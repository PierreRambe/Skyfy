"""Convert bounded Skyfy point animation JSON to/from real Blender Alembic archives.

Usage: blender --background --factory-startup --python studio_alembic.py -- export input.json output.abc
       blender --background --factory-startup --python studio_alembic.py -- import input.abc output.json
"""

import json
import math
import re
import sys
from pathlib import Path

import bpy


def arguments():
    tail = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if len(tail) != 3 or tail[0] not in {"export", "import"}:
        raise ValueError("Gunakan mode export/import dan dua lokasi file.")
    return tail[0], str(Path(tail[1]).resolve()), str(Path(tail[2]).resolve())


def finite_point(point):
    return (len(point) == 3 and all(isinstance(value, (int, float))
            and not isinstance(value, bool) and math.isfinite(value)
            and abs(value) <= 1_000_000 for value in point))


def export_archive(source, destination):
    payload = json.loads(Path(source).read_text(encoding="utf-8"))
    frames = payload.get("frames")
    fps = payload.get("fps")
    if not isinstance(frames, list) or not 1 <= len(frames) <= 1000 or not isinstance(fps, int) or not 1 <= fps <= 30:
        raise ValueError("Frame atau FPS ekspor tidak valid.")
    count = len(frames[0])
    if not 1 <= count <= 1000 or len(frames) * count > 300_000:
        raise ValueError("Jumlah sampel drone melebihi batas ekspor.")
    if any(not isinstance(frame, list) or len(frame) != count or any(not finite_point(point) for point in frame) for frame in frames):
        raise ValueError("Koordinat frame tidak valid.")

    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = len(frames)
    # Skyfy sends coordinates in Blender's X/Y/Z convention.
    mesh = bpy.data.meshes.new("Skyfy drone points")
    mesh.from_pydata(frames[0], [], [])
    mesh.update()
    obj = bpy.data.objects.new(f"Skyfy_fps{fps}_n{len(frames)}", mesh)
    scene.collection.objects.link(obj)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    if len(frames) > 1:
        obj.shape_key_add(name="Frame 1", from_mix=False)
        for index, points in enumerate(frames[1:], start=2):
            key = obj.shape_key_add(name=f"Frame {index}", from_mix=False)
            for vertex, point in zip(key.data, points):
                vertex.co = point
            key.value = 0
            key.keyframe_insert(data_path="value", frame=max(1, index - 1))
            key.value = 1
            key.keyframe_insert(data_path="value", frame=index)
            key.value = 1 if index == len(frames) else 0
            key.keyframe_insert(data_path="value", frame=index + 1)
    result = bpy.ops.wm.alembic_export(
        filepath=str(destination), start=1, end=len(frames) + 1, selected=True,
        uvs=False, normals=False, vcolors=False, export_custom_properties=False,
        as_background_job=False, evaluation_mode="VIEWPORT",
    )
    if "FINISHED" not in result or not Path(destination).is_file():
        raise RuntimeError("Blender gagal menulis file Alembic.")


def import_archive(source, destination):
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    result = bpy.ops.wm.alembic_import(filepath=str(source), set_frame_range=True, as_background_job=False)
    if "FINISHED" not in result:
        raise ValueError("File Alembic tidak dapat dibuka Blender.")
    scene = bpy.context.scene
    objects = sorted((obj for obj in scene.objects if obj.type == "MESH"), key=lambda obj: obj.name)
    if not objects:
        objects = sorted((obj for obj in scene.objects if obj.type == "EMPTY"), key=lambda obj: obj.name)
    if not objects:
        raise ValueError("Alembic tidak memiliki titik atau objek drone.")
    start = scene.frame_start
    end = scene.frame_end
    if end < start or end - start + 1 > 3000:
        raise ValueError("Alembic melebihi batas durasi.")
    fps = scene.render.fps / scene.render.fps_base
    if fps <= 0:
        raise ValueError("FPS Alembic tidak valid.")
    own_archive = re.search(r"Skyfy_fps(\d+)_n(\d+)", objects[0].name) if len(objects) == 1 else None
    if own_archive:
        source_fps = int(own_archive.group(1))
        source_count = int(own_archive.group(2))
        if not 1 <= source_fps <= 30 or not 1 <= source_count <= 1000:
            raise ValueError("Metadata waktu Skyfy pada Alembic tidak valid.")
        schedule = [(min(end, start + round((index + .5) * fps / source_fps)), index / source_fps)
                    for index in range(source_count)]
    else:
        if end - start + 1 > 1000:
            raise ValueError("Alembic melebihi 1.000 frame.")
        schedule = [(number, (number - start) / fps) for number in range(start, end + 1)]
    frames = []
    expected = None
    for frame_number, moment in schedule:
        scene.frame_set(frame_number)
        depsgraph = bpy.context.evaluated_depsgraph_get()
        points = []
        for obj in objects:
            evaluated = obj.evaluated_get(depsgraph)
            if obj.type == "MESH":
                mesh = evaluated.to_mesh()
                try:
                    if mesh and len(mesh.polygons) == 0 and len(mesh.vertices) > 0:
                        points.extend(tuple(evaluated.matrix_world @ vertex.co) for vertex in mesh.vertices)
                    else:
                        points.append(tuple(evaluated.matrix_world.translation))
                finally:
                    evaluated.to_mesh_clear()
            else:
                points.append(tuple(evaluated.matrix_world.translation))
        if not 1 <= len(points) <= 1000 or expected is not None and len(points) != expected:
            raise ValueError("Jumlah drone Alembic harus konsisten dan maksimal 1.000 per frame.")
        expected = len(points)
        if len(frames) * expected > 300_000:
            raise ValueError("Alembic memiliki terlalu banyak sampel drone.")
        # Blender Z is height. Skyfy CSV uses X/Y as the design plane and Z as depth.
        drones = [[round(point[0], 5), round(point[2], 5), round(point[1], 5)] for point in points]
        if any(not finite_point(point) for point in drones):
            raise ValueError("Alembic memiliki koordinat tidak valid.")
        frames.append({"time": round(moment, 6), "points": drones})
    Path(destination).write_text(json.dumps({"fps": int(own_archive.group(1)) if own_archive else fps, "frames": frames}, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    mode, source_path, destination_path = arguments()
    if mode == "export":
        export_archive(source_path, destination_path)
    else:
        import_archive(source_path, destination_path)
