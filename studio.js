const q = selector => document.querySelector(selector);
const qa = selector => document.querySelectorAll(selector);

const canvas = q('[data-drone-canvas]');
const ctx = canvas.getContext('2d');
const stage = q('[data-sky-stage]');
const studioHeader = q('.studio-header');
const featureDock = q('[data-feature-dock]');
const featurePanel = q('#feature-panel');
const featureToggle = q('[data-feature-toggle]');
const countInput = q('[data-drone-count]');
const countOutput = q('[data-drone-output]');
const startColor = q('[data-color-start]');
const endColor = q('[data-color-end]');
const gradientToggle = q('[data-gradient-toggle]');
const timeRange = q('[data-time-range]');
const currentTime = q('[data-current-time]');
const playButton = q('[data-play]');
const playIcon = q('[data-play-icon]');
const fileInput = q('[data-file-input]');
const fileLabel = q('[data-file-label]');
const dropZone = q('.file-drop');
const sceneTrack = q('[data-scene-track]');
const sceneName = q('[data-scene-name]');
const consultDialog = q('[data-consult-dialog]');
const toast = q('[data-toast]');
const saveState = q('[data-save-state]');
const canvasHint = q('[data-canvas-hint]');
const selectionStatus = q('[data-selection-status]');
const runTestButton = q('[data-run-test]');
const placedCount = q('[data-placed-count]');
const projectName = q('[data-project-name]');
const projectFile = q('[data-project-file]');
const themeButton = q('[data-theme-toggle]');
const groundToggle = q('[data-ground-toggle]');
const markerSizeInput = q('[data-marker-size]');
const workspaceWidthInput = q('[data-workspace-width]');
const inspector = q('[data-drone-inspector]');
const inspectorX = q('[data-inspector-x]');
const inspectorY = q('[data-inspector-y]');
const inspectorZ = q('[data-inspector-z]');
const inspectorColor = q('[data-inspector-color]');
const referenceInput = q('[data-reference-input]');
const referenceList = q('[data-reference-list]');
const referenceControls = q('[data-reference-controls]');
const referenceOpacity = q('[data-reference-opacity]');
const referenceScale = q('[data-reference-scale]');
const referenceMoveButton = q('[data-reference-move]');
const referenceToggleButton = q('[data-reference-toggle]');
const aiForm = q('[data-ai-form]');
const aiPromptInput = q('[data-ai-prompt]');
const aiGenerateButton = q('[data-ai-generate]');
const aiStatus = q('[data-ai-status]');
const aiPreview = q('[data-ai-preview]');
const aiImage = q('[data-ai-image]');
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_PROJECT_FILE_BYTES = 20 * 1024 * 1024;
const MAX_MANUAL_DRONES = 1000;
const MAX_SCENES = 20;
const MAX_ANIMATION_ROWS = 120000;
const MAX_ANIMATION_FRAMES = 1200;
const MAX_NEAREST_DISTANCE_METERS = 2;
const MAX_REFERENCES_PER_SCENE = 5;
const MAX_REFERENCE_FILE_BYTES = 5 * 1024 * 1024;
const MAX_REFERENCE_DATA_LENGTH = 1_000_000;
const MAX_REFERENCE_TOTAL_LENGTH = 8_000_000;
const SKYFY_WHATSAPP_NUMBER = '6282199988399';
const VALID_TEMPLATES = new Set(['single', 'row', 'grid', 'ring']);
// Negative pitch places the camera above the design, looking down toward the ground.
const DEFAULT_CAMERA = Object.freeze({ yaw: -.18, pitch: -.18, zoom: 1, panX: 0, panY: 0 });
const FRONT_GROUND_LEVEL = .92;
const GROUND_FAR_SCREEN_LEVEL = .82;
const GROUND_GRID_DIVISIONS = 16;

const state = {
  mode: 'formation',
  formation: 'orbit',
  droneCount: 300,
  gradient: true,
  startColor: '#b9f43c',
  endColor: '#52c7ff',
  time: 0,
  playing: false,
  testInProgress: false,
  view: 'perspective',
  camera: { ...DEFAULT_CAMERA },
  groundVisible: true,
  markerScale: 1,
  workspaceWidth: 40,
  selectedScene: 0,
  manualDrones: [],
  selectedDrone: -1,
  selectedDrones: new Set(),
  selectionBox: null,
  clipboardDrones: [],
  selectedReference: -1,
  movingReference: false,
  referenceDrag: null,
  draggingDrone: false,
  dragOrigin: null,
  scenes: [
    { name: 'Orbit', formation: 'orbit', duration: 4 },
    { name: 'Transisi', formation: 'wave', duration: 3 },
    { name: 'Sky mark', formation: 'mark', duration: 5 }
  ]
};

function paletteSettings(source = state) {
  return { startColor: source.startColor, endColor: source.endColor, gradient: source.gradient };
}
state.scenes.forEach(scene => { scene.palette = paletteSettings(); });

let animationFrame;
let previousTime = 0;
let toastTimer;
let importToken = 0;
let hasUnsavedChanges = false;
let lastSpacingCheck = 0;
let aiPreviewPrompt = '';
let aiRequestController = null;
const referenceImages = new Map();

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function mixColor(a, b, amount) {
  const from = hexToRgb(a);
  const to = hexToRgb(b);
  const channel = key => Math.round(from[key] + (to[key] - from[key]) * amount);
  return `rgb(${channel('r')}, ${channel('g')}, ${channel('b')})`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function markDirty() {
  hasUnsavedChanges = true;
  saveState.textContent = 'Perubahan belum disimpan';
}

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
  q('[data-theme-label]').textContent = dark ? 'Mode terang' : 'Mode gelap';
}

themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  q('meta[name="theme-color"]').content = theme === 'dark' ? '#111a16' : '#f5f6f2';
  try { localStorage.setItem('skyfy-studio-theme', theme); } catch { /* Preference is session-only. */ }
  updateThemeButton();
});
updateThemeButton();

function formatPlaybackTime(seconds) {
  const milliseconds = Math.floor(Math.max(0, seconds) * 1000 + 1e-6);
  return `${String(Math.floor(milliseconds / 60000)).padStart(2, '0')}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}.${String(milliseconds % 1000).padStart(3, '0')}`;
}

function totalDuration() {
  return state.scenes.reduce((total, scene) => total + scene.duration, 0);
}

function sceneStartTime(index) {
  return state.scenes.slice(0, index).reduce((total, scene) => total + scene.duration, 0);
}

function sceneAtTime(seconds) {
  let start = 0;
  for (let index = 0; index < state.scenes.length; index += 1) {
    const end = start + state.scenes[index].duration;
    if (seconds < end - 1e-8 || index === state.scenes.length - 1) {
      return { index, localTime: Math.max(0, Math.min(state.scenes[index].duration, seconds - start)) };
    }
    start = end;
  }
  return { index: 0, localTime: 0 };
}

function selectedDuration() {
  return state.scenes[state.selectedScene]?.duration || 1;
}

function displaySeconds(seconds) {
  return seconds.toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

function updateRangeFill(input, value, start = 0, end = 100) {
  const percent = ((value - start) / (end - start)) * 100;
  input.style.background = `linear-gradient(90deg, var(--acid) 0 ${percent}%, var(--track) ${percent}%)`;
}

function formationPoint(type, index, total, width, height, time) {
  const progress = total <= 1 ? 0 : index / (total - 1);
  const centerX = width / 2;
  const centerY = height * .46;
  const scale = Math.min(width, height);
  const phase = time * Math.PI * 2;

  if (type === 'wave') {
    const rows = 4;
    const row = index % rows;
    const column = Math.floor(index / rows) / Math.max(1, Math.floor(total / rows) - 1);
    return {
      x: width * .18 + column * width * .64,
      y: centerY + Math.sin(column * Math.PI * 3 + phase * .35 + row * .22) * height * .14 + (row - 1.5) * 10
    };
  }

  if (type === 'mark') {
    const band = index % 3;
    const angle = progress * Math.PI * 2.15 - Math.PI * .55;
    return {
      x: centerX + Math.sin(angle * 1.45) * scale * .18 + (band - 1) * 6,
      y: centerY + (progress - .5) * scale * .5 + Math.sin(angle * 2.9) * scale * .055
    };
  }

  if (type === 'free') {
    const size = Math.ceil(Math.sqrt(total));
    return {
      x: centerX + (index % size - size / 2) * 8,
      y: centerY + (Math.floor(index / size) - size / 2) * 8
    };
  }

  const ring = index % 4;
  const angle = progress * Math.PI * 4.08 + ring * .07 + phase * .04;
  const radiusX = scale * (.16 + ring * .025);
  const radiusY = radiusX;
  return {
    x: centerX + Math.cos(angle) * radiusX,
    y: centerY + Math.sin(angle) * radiusY + ring * 1.5
  };
}

function resizeCanvas() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  if (!width || !height) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(width * ratio);
  const pixelHeight = Math.round(height * ratio);
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  draw();
}

function cameraDepthScale(width) {
  return width / state.workspaceWidth;
}

function worldFromDrone(drone, width, height) {
  return {
    x: (drone.x - .5) * width,
    y: (.5 - drone.y) * height,
    z: (drone.z || 0) * cameraDepthScale(width)
  };
}

function cameraFactor(depth, width, height) {
  if (state.view === 'front') return 1;
  const distance = Math.max(width, height) * 2.5;
  return Math.max(.45, Math.min(1.8, distance / Math.max(distance * .2, distance + depth)));
}

function projectWorldPoint(world, width, height) {
  const { yaw, pitch, zoom, panX, panY } = state.camera;
  const rotatedX = world.x * Math.cos(yaw) + world.z * Math.sin(yaw);
  const rotatedZ = -world.x * Math.sin(yaw) + world.z * Math.cos(yaw);
  const rotatedY = world.y * Math.cos(pitch) - rotatedZ * Math.sin(pitch);
  const depth = world.y * Math.sin(pitch) + rotatedZ * Math.cos(pitch);
  const scale = zoom * cameraFactor(depth, width, height);
  return { x: width / 2 + panX + rotatedX * scale, y: height / 2 + panY - rotatedY * scale, depth };
}

function projectDrone(drone, width, height) {
  return projectWorldPoint(worldFromDrone(drone, width, height), width, height);
}

function unprojectScreen(screenX, screenY, depth, width, height) {
  const { yaw, pitch, zoom, panX, panY } = state.camera;
  const scale = zoom * cameraFactor(depth, width, height);
  const rotatedX = (screenX - width / 2 - panX) / scale;
  const rotatedY = (height / 2 + panY - screenY) / scale;
  const worldY = rotatedY * Math.cos(pitch) + depth * Math.sin(pitch);
  const rotatedZ = -rotatedY * Math.sin(pitch) + depth * Math.cos(pitch);
  return {
    x: rotatedX * Math.cos(yaw) - rotatedZ * Math.sin(yaw),
    y: worldY,
    z: rotatedX * Math.sin(yaw) + rotatedZ * Math.cos(yaw)
  };
}

function droneFromScreen(screenX, screenY, depth, width, height) {
  const world = unprojectScreen(screenX, screenY, depth, width, height);
  return {
    x: Math.max(0, Math.min(1, .5 + world.x / width)),
    y: Math.max(0, Math.min(1, .5 - world.y / height)),
    z: Math.max(-1_000_000, Math.min(1_000_000, world.z / cameraDepthScale(width)))
  };
}

function drawGround(width, height) {
  if (!state.groundVisible) return;
  if (state.view === 'front') {
    const horizon = height * FRONT_GROUND_LEVEL;
    ctx.fillStyle = 'rgba(152, 187, 151, .045)';
    ctx.fillRect(0, horizon, width, height - horizon);
    ctx.strokeStyle = 'rgba(157, 198, 161, .24)';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(width, horizon);
    ctx.stroke();
    return;
  }
  // A square plane with equal x/z spacing keeps the grid cells square in 3D.
  const halfSize = Math.max(width, height);
  const groundY = height * (.5 - GROUND_FAR_SCREEN_LEVEL) - Math.sin(-DEFAULT_CAMERA.pitch) * halfSize;
  const cellSize = halfSize / GROUND_GRID_DIVISIONS;
  const groundPoint = (x, z) => projectWorldPoint({ x, y: groundY, z }, width, height);
  const corners = [groundPoint(-halfSize, -halfSize), groundPoint(halfSize, -halfSize), groundPoint(halfSize, halfSize), groundPoint(-halfSize, halfSize)];
  ctx.fillStyle = 'rgba(152, 187, 151, .045)';
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(157, 198, 161, .24)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let line = -GROUND_GRID_DIVISIONS; line <= GROUND_GRID_DIVISIONS; line += 1) {
    const x = line * cellSize;
    const near = groundPoint(x, -halfSize);
    const far = groundPoint(x, halfSize);
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
  }
  for (let row = -GROUND_GRID_DIVISIONS; row <= GROUND_GRID_DIVISIONS; row += 1) {
    const z = row * cellSize;
    const left = groundPoint(-halfSize, z);
    const right = groundPoint(halfSize, z);
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
  }
  ctx.stroke();
}

function drawDrone(x, y, color, selected = false, alpha = 1) {
  const scale = state.markerScale;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, (selected ? 3.7 : 2.4) * scale, 0, Math.PI * 2);
  ctx.fill();
  if (!selected) { ctx.globalAlpha = 1; return; }
  ctx.beginPath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.arc(x, y, 8 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawSelectionBox() {
  const box = state.selectionBox;
  if (!box?.active) return;
  const left = Math.min(box.startX, box.endX);
  const top = Math.min(box.startY, box.endY);
  const width = Math.abs(box.endX - box.startX);
  const height = Math.abs(box.endY - box.startY);
  ctx.save();
  ctx.fillStyle = 'rgba(185, 244, 60, .12)';
  ctx.strokeStyle = '#b9f43c';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 4]);
  ctx.fillRect(left, top, width, height);
  ctx.strokeRect(left, top, width, height);
  ctx.restore();
}

function referencePoint(reference, offsetX, offsetY, width, height) {
  return projectWorldPoint({
    x: (reference.x - .5) * width + offsetX,
    y: (.5 - reference.y) * height + offsetY,
    z: 0
  }, width, height);
}

function referenceCorners(reference, drawWidth, drawHeight, width, height) {
  return [
    referencePoint(reference, -drawWidth / 2, drawHeight / 2, width, height),
    referencePoint(reference, drawWidth / 2, drawHeight / 2, width, height),
    referencePoint(reference, drawWidth / 2, -drawHeight / 2, width, height),
    referencePoint(reference, -drawWidth / 2, -drawHeight / 2, width, height)
  ];
}

function drawReferenceTriangle(image, sourceWidth, sourceHeight, corners, indices) {
  const [first, second, third] = indices.map(index => corners[index]);
  const xAxis = indices[0] === 0
    ? { x: (second.x - first.x) / sourceWidth, y: (second.y - first.y) / sourceWidth }
    : { x: (first.x - second.x) / sourceWidth, y: (first.y - second.y) / sourceWidth };
  const yAxis = indices[0] === 0
    ? { x: (third.x - first.x) / sourceHeight, y: (third.y - first.y) / sourceHeight }
    : { x: (first.x - third.x) / sourceHeight, y: (first.y - third.y) / sourceHeight };
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  ctx.lineTo(second.x, second.y);
  ctx.lineTo(third.x, third.y);
  ctx.closePath();
  ctx.clip();
  const origin = indices[0] === 0 ? first : {
    x: first.x - xAxis.x * sourceWidth - yAxis.x * sourceHeight,
    y: first.y - xAxis.y * sourceWidth - yAxis.y * sourceHeight
  };
  ctx.transform(xAxis.x, xAxis.y, yAxis.x, yAxis.y, origin.x, origin.y);
  ctx.drawImage(image, 0, 0);
  ctx.restore();
}

function drawReferenceLayers(width, height) {
  const references = state.scenes[state.selectedScene]?.references || [];
  references.forEach((reference, index) => {
    if (!reference.visible) return;
    let image = referenceImages.get(reference.data);
    if (!image) {
      image = new Image();
      referenceImages.set(reference.data, image);
      image.onload = () => draw();
      image.onerror = () => showToast(`Gambar referensi ${reference.name} tidak dapat dibuka.`);
      image.src = reference.data;
    }
    if (!image.complete || !image.naturalWidth || !image.naturalHeight) return;
    const fit = Math.min(width * .8 / image.naturalWidth, height * .75 / image.naturalHeight);
    const drawWidth = image.naturalWidth * fit * reference.scale;
    const drawHeight = image.naturalHeight * fit * reference.scale;
    const corners = referenceCorners(reference, drawWidth, drawHeight, width, height);
    ctx.save();
    ctx.globalAlpha = reference.opacity;
    drawReferenceTriangle(image, image.naturalWidth, image.naturalHeight, corners, [0, 1, 3]);
    drawReferenceTriangle(image, image.naturalWidth, image.naturalHeight, corners, [2, 3, 1]);
    ctx.restore();
    if (state.movingReference && index === state.selectedReference) {
      ctx.save();
      ctx.strokeStyle = '#b9f43c';
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      corners.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  });
}

function referenceFromScreen(screenX, screenY, reference, width, height) {
  let x = reference.x;
  let y = reference.y;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const point = referencePoint({ x, y }, 0, 0, width, height);
    const xStep = referencePoint({ x: x + .001, y }, 0, 0, width, height);
    const yStep = referencePoint({ x, y: y + .001 }, 0, 0, width, height);
    const xx = (xStep.x - point.x) * 1000;
    const xy = (xStep.y - point.y) * 1000;
    const yx = (yStep.x - point.x) * 1000;
    const yy = (yStep.y - point.y) * 1000;
    const determinant = xx * yy - xy * yx;
    if (Math.abs(determinant) < 1) break;
    const dx = screenX - point.x;
    const dy = screenY - point.y;
    x += Math.max(-.25, Math.min(.25, (dx * yy - dy * yx) / determinant));
    y += Math.max(-.25, Math.min(.25, (dy * xx - dx * xy) / determinant));
    if (Math.hypot(dx, dy) < .1) break;
  }
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

function animationBracket(frames, moment) {
  let high = frames.length - 1;
  let low = 0;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (frames[middle].time < moment) low = middle + 1;
    else high = middle;
  }
  const after = frames[low];
  const before = frames[Math.max(0, low - 1)];
  const blend = after === before ? 0 : Math.max(0, Math.min(1, (moment - before.time) / (after.time - before.time)));
  return { before, after, blend };
}

function sceneDrones(scene, localTime, width, height) {
  const palette = scene.palette || state;
  if (scene.formation === 'manual') return scene.manualDrones || [];
  if (scene.formation === 'free') return [];
  if (scene.formation === 'animation') {
    const { before, after, blend } = animationBracket(scene.frames, localTime);
    return before.drones.map((drone, index) => {
      const next = after.drones[index];
      return {
        x: drone.x + (next.x - drone.x) * blend,
        y: drone.y + (next.y - drone.y) * blend,
        z: drone.z + (next.z - drone.z) * blend,
        color: scene.colorOverride
          ? mixColor(palette.startColor, palette.endColor, palette.gradient ? index / Math.max(1, before.drones.length - 1) : 0)
          : drone.color === next.color ? drone.color : mixColor(colorToHex(drone.color), colorToHex(next.color), blend)
      };
    });
  }
  const time = localTime / scene.duration;
  return Array.from({ length: state.droneCount }, (_, index) => {
    const progress = index / Math.max(1, state.droneCount - 1);
    const point = formationPoint(scene.formation, index, state.droneCount, width, height, time);
    const shifted = progress + time * .65;
    const colorAmount = palette.gradient ? (shifted <= 1 ? shifted : shifted % 1) : 0;
    return { x: point.x / width, y: point.y / height, z: 0, color: mixColor(palette.startColor, palette.endColor, colorAmount) };
  });
}

function drawSceneTransition(previous, current, amount, width, height) {
  const blend = amount * amount * (3 - 2 * amount);
  for (let index = 0; index < Math.max(previous.length, current.length); index += 1) {
    const from = previous[index];
    const to = current[index];
    if (!from && !to) continue;
    const drone = from && to ? {
      x: from.x + (to.x - from.x) * blend,
      y: from.y + (to.y - from.y) * blend,
      z: (from.z || 0) + ((to.z || 0) - (from.z || 0)) * blend
    } : from || to;
    const color = from && to ? mixColor(colorToHex(from.color), colorToHex(to.color), blend) : (from || to).color;
    const projected = projectDrone(drone, width, height);
    drawDrone(projected.x, projected.y, color, false, from && to ? 1 : from ? 1 - blend : blend);
  }
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;
  ctx.clearRect(0, 0, width, height);
  drawReferenceLayers(width, height);
  drawGround(width, height);
  const scene = state.scenes[state.selectedScene];
  if (!scene) return;
  const localTime = state.time / 100 * scene.duration;
  const current = sceneDrones(scene, localTime, width, height);
  if (state.testInProgress && state.selectedScene > 0 && scene.formation !== 'animation') {
    const transitionDuration = Math.min(.8, scene.duration / 3);
    if (localTime < transitionDuration) {
      const previousScene = state.scenes[state.selectedScene - 1];
      const previous = sceneDrones(previousScene, previousScene.duration, width, height);
      drawSceneTransition(previous, current, localTime / transitionDuration, width, height);
      drawSelectionBox();
      return;
    }
  }
  current.forEach((drone, index) => {
    const projected = projectDrone(drone, width, height);
    drawDrone(projected.x, projected.y, drone.color || state.startColor, state.mode === 'manual' && state.selectedDrones.has(index));
  });
  drawSelectionBox();
}

function activeReferences() {
  return state.scenes[state.selectedScene]?.references || [];
}

function selectedReference() {
  return activeReferences()[state.selectedReference] || null;
}

function setReferenceMove(active) {
  if (active && !selectedReference()?.visible) {
    showToast('Tampilkan layer referensi sebelum menggesernya.');
    return;
  }
  state.movingReference = active;
  state.referenceDrag = null;
  referenceMoveButton.setAttribute('aria-pressed', String(active));
  referenceMoveButton.textContent = active ? 'Selesai menggeser' : 'Geser di kanvas';
  canvas.style.cursor = active ? 'move' : orbitToolActive ? 'grab' : '';
  if (active && orbitToolActive) {
    orbitToolActive = false;
    q('[data-orbit-tool]').classList.remove('active');
    q('[data-orbit-tool]').setAttribute('aria-pressed', 'false');
  }
  draw();
}

function updateReferencePanel() {
  const references = activeReferences();
  if (state.selectedReference >= references.length) state.selectedReference = references.length - 1;
  if (state.selectedReference < 0 && references.length) state.selectedReference = references.length - 1;
  referenceList.replaceChildren();
  references.forEach((reference, index) => {
    const row = document.createElement('div');
    row.className = 'reference-row';
    const select = document.createElement('button');
    select.type = 'button';
    select.className = `reference-select${index === state.selectedReference ? ' active' : ''}`;
    select.textContent = reference.name;
    select.title = reference.name;
    select.setAttribute('aria-label', `Pilih gambar referensi ${reference.name}`);
    select.addEventListener('click', () => { state.selectedReference = index; updateReferencePanel(); draw(); });
    const visibility = document.createElement('button');
    visibility.type = 'button';
    visibility.className = 'reference-visibility';
    visibility.textContent = reference.visible ? 'Tampil' : 'Sembunyi';
    visibility.setAttribute('aria-label', `${reference.visible ? 'Sembunyikan' : 'Tampilkan'} ${reference.name}`);
    visibility.setAttribute('aria-pressed', String(reference.visible));
    visibility.addEventListener('click', () => {
      state.selectedReference = index;
      toggleReferenceVisibility();
    });
    row.append(select, visibility);
    referenceList.append(row);
  });
  q('[data-reference-count]').textContent = `${references.length} / ${MAX_REFERENCES_PER_SCENE} layer`;
  const reference = selectedReference();
  referenceControls.hidden = !reference;
  referenceToggleButton.disabled = !reference;
  referenceToggleButton.textContent = reference ? `Referensi: ${reference.visible ? 'tampil' : 'sembunyi'}` : 'Referensi: tidak ada';
  referenceToggleButton.setAttribute('aria-label', reference ? `${reference.visible ? 'Sembunyikan' : 'Tampilkan'} gambar referensi ${reference.name}` : 'Belum ada gambar referensi');
  if (!reference) {
    if (state.movingReference) setReferenceMove(false);
    return;
  }
  referenceOpacity.value = String(Math.round(reference.opacity * 100));
  referenceScale.value = String(Math.round(reference.scale * 100));
  q('[data-reference-opacity-output]').textContent = `${referenceOpacity.value}%`;
  q('[data-reference-scale-output]').textContent = `${referenceScale.value}%`;
  q('[data-reference-up]').disabled = state.selectedReference === references.length - 1;
  if (state.movingReference && !reference.visible) setReferenceMove(false);
}

function toggleReferenceVisibility() {
  const reference = selectedReference();
  if (!reference) return;
  reference.visible = !reference.visible;
  if (!reference.visible && state.movingReference) setReferenceMove(false);
  updateReferencePanel();
  markDirty();
  draw();
}

async function encodeReferenceImage(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new Error('Gunakan gambar PNG, JPG, atau WebP.');
  if (file.size > MAX_REFERENCE_FILE_BYTES) throw new Error('Gambar referensi maksimal 5 MB per file.');
  const bitmap = await createImageBitmap(file);
  try {
    if (!bitmap.width || !bitmap.height || bitmap.width > 8192 || bitmap.height > 8192) throw new Error('Dimensi gambar harus antara 1 dan 8.192 piksel.');
    for (const maxSide of [1600, 1200, 960, 720]) {
      const factor = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const surface = document.createElement('canvas');
      surface.width = Math.max(1, Math.round(bitmap.width * factor));
      surface.height = Math.max(1, Math.round(bitmap.height * factor));
      surface.getContext('2d').drawImage(bitmap, 0, 0, surface.width, surface.height);
      for (const quality of [.82, .65, .5]) {
        const data = surface.toDataURL('image/webp', quality);
        if (!data.startsWith('data:image/webp;base64,')) throw new Error('Browser tidak mendukung penyimpanan gambar WebP.');
        if (data.length <= MAX_REFERENCE_DATA_LENGTH) return data;
      }
    }
    throw new Error('Gambar terlalu rumit untuk disimpan. Coba file yang lebih kecil.');
  } finally {
    bitmap.close();
  }
}

referenceInput.addEventListener('change', async () => {
  const scene = state.scenes[state.selectedScene];
  const files = [...referenceInput.files];
  referenceInput.value = '';
  if (!files.length) return;
  const references = scene.references || (scene.references = []);
  for (const file of files) {
    try {
      if (references.length >= MAX_REFERENCES_PER_SCENE) throw new Error('Maksimal 5 gambar referensi per scene.');
      const data = await encodeReferenceImage(file);
      if (!state.scenes.includes(scene)) return;
      const used = state.scenes.reduce((total, item) => total + (item.references || []).reduce((sum, reference) => sum + reference.data.length, 0), 0);
      if (used + data.length > MAX_REFERENCE_TOTAL_LENGTH) throw new Error('Total gambar referensi proyek maksimal 8 MB.');
      references.push({ name: file.name.slice(0, 80), data, visible: true, opacity: .5, scale: 1, x: .5, y: .5 });
      if (state.scenes[state.selectedScene] === scene) {
        state.selectedReference = references.length - 1;
        updateReferencePanel();
        draw();
      }
      markDirty();
      showToast(`Gambar referensi ${file.name} ditambahkan.`);
    } catch (error) {
      showToast(`Gambar tidak dapat ditambahkan: ${error.message}`);
    }
  }
});

referenceOpacity.addEventListener('input', () => {
  const reference = selectedReference();
  if (!reference) return;
  reference.opacity = Number(referenceOpacity.value) / 100;
  q('[data-reference-opacity-output]').textContent = `${referenceOpacity.value}%`;
  markDirty();
  draw();
});
referenceScale.addEventListener('input', () => {
  const reference = selectedReference();
  if (!reference) return;
  reference.scale = Number(referenceScale.value) / 100;
  q('[data-reference-scale-output]').textContent = `${referenceScale.value}%`;
  markDirty();
  draw();
});
referenceMoveButton.addEventListener('click', () => setReferenceMove(!state.movingReference));
referenceToggleButton.addEventListener('click', toggleReferenceVisibility);
q('[data-reference-up]').addEventListener('click', () => {
  const references = activeReferences();
  const index = state.selectedReference;
  if (index < 0 || index >= references.length - 1) return;
  [references[index], references[index + 1]] = [references[index + 1], references[index]];
  state.selectedReference += 1;
  updateReferencePanel();
  markDirty();
  draw();
});
q('[data-reference-remove]').addEventListener('click', () => {
  const references = activeReferences();
  if (state.selectedReference < 0) return;
  const [removed] = references.splice(state.selectedReference, 1);
  if (removed) referenceImages.delete(removed.data);
  if (state.movingReference) setReferenceMove(false);
  updateReferencePanel();
  markDirty();
  draw();
});

function colorToHex(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const channels = color.match(/\d+/g);
  return channels && channels.length === 3
    ? `#${channels.map(value => Number(value).toString(16).padStart(2, '0')).join('')}`
    : state.startColor;
}

function worldPoint(drone, bounds = null) {
  if (!bounds) return { x: drone.x * state.workspaceWidth, y: drone.y * state.workspaceWidth, z: drone.z || 0 };
  if (bounds.projection === 'static') return {
    x: bounds.xMin + (drone.x - .14) / .72 * (bounds.xMax - bounds.xMin),
    y: bounds.yMin + (drone.y - .14) / .72 * (bounds.yMax - bounds.yMin),
    z: drone.z || 0
  };
  return {
    x: bounds.xMin + (drone.x - .12) / .76 * (bounds.xMax - bounds.xMin),
    y: bounds.yMin + (.85 - drone.y) / .7 * (bounds.yMax - bounds.yMin),
    z: drone.z || 0
  };
}

function distanceBetween(first, second, bounds = null) {
  const a = worldPoint(first, bounds);
  const b = worldPoint(second, bounds);
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function nearestDistance(drones, selectedIndex, bounds = null) {
  if (drones.length < 2) return Infinity;
  let nearest = Infinity;
  for (let index = 0; index < drones.length; index += 1) {
    if (index !== selectedIndex) nearest = Math.min(nearest, distanceBetween(drones[selectedIndex], drones[index], bounds));
  }
  return nearest;
}

function analyzeSpacing(drones, bounds = null) {
  if (drones.length < 2) return { violations: 0, largestNearest: 0 };
  const points = drones.map(drone => worldPoint(drone, bounds));
  const nearest = Array(drones.length).fill(Infinity);
  for (let first = 0; first < points.length; first += 1) {
    for (let second = first + 1; second < points.length; second += 1) {
      const gap = Math.hypot(
        points[first].x - points[second].x,
        points[first].y - points[second].y,
        points[first].z - points[second].z
      );
      nearest[first] = Math.min(nearest[first], gap);
      nearest[second] = Math.min(nearest[second], gap);
    }
  }
  return {
    violations: nearest.filter(gap => gap > MAX_NEAREST_DISTANCE_METERS + 1e-6).length,
    largestNearest: Math.max(...nearest)
  };
}

function wouldIncreaseSpacingViolations(before, after) {
  const bounds = state.scenes[state.selectedScene]?.bounds || null;
  return analyzeSpacing(after, bounds).violations > analyzeSpacing(before, bounds).violations;
}

function updateSpacingStatus() {
  const status = q('[data-spacing-status]');
  const bounds = state.scenes[state.selectedScene]?.bounds || null;
  if (state.mode === 'manual' && state.selectedDrone >= 0) {
    const nearest = nearestDistance(state.manualDrones, state.selectedDrone, bounds);
    status.textContent = `Jarak ke drone terdekat: ${Number.isFinite(nearest) ? `${displaySeconds(nearest)} m${nearest > MAX_NEAREST_DISTANCE_METERS ? ' · melewati batas maks 2 m' : ''}` : 'belum ada drone lain'}`;
    return;
  }
  if (state.mode === 'manual') {
    const report = analyzeSpacing(state.manualDrones, bounds);
    status.textContent = report.violations ? `${report.violations} drone melewati batas jarak terdekat maks 2 m.` : 'Jarak ke drone terdekat: pilih drone pada kanvas.';
    return;
  }
  if (state.mode === 'animation') {
    if (state.playing && Date.now() - lastSpacingCheck < 250) return;
    lastSpacingCheck = Date.now();
    const scene = state.scenes[state.selectedScene];
    if (!scene.bounds) {
      status.textContent = 'Koordinat asli tidak tersedia untuk pemeriksaan jarak dalam meter.';
      return;
    }
    const moment = state.time / 100 * scene.duration;
    let index = 0;
    while (index < scene.frames.length - 1 && scene.frames[index].time < moment) index += 1;
    const drones = scene.frames[index].drones;
    const report = analyzeSpacing(drones, scene.bounds);
    status.textContent = report.violations ? `${report.violations} drone melewati batas maks 2 m pada frame ini (jarak terjauh ${displaySeconds(report.largestNearest)} m).` : 'Semua drone pada frame ini berjarak maks 2 m dari tetangga terdekat.';
    return;
  }
  status.textContent = 'Aturan jarak 2 m berlaku pada titik manual dan animasi impor.';
}

function updateSelectionStatus() {
  const count = state.selectedDrones.size;
  selectionStatus.hidden = count === 0;
  selectionStatus.textContent = count ? `${count.toLocaleString('id-ID')} drone terpilih` : '';
}

function setSelection(indices) {
  state.selectedDrones = new Set([...indices].filter(index => Number.isInteger(index) && index >= 0 && index < state.manualDrones.length));
  state.selectedDrone = state.selectedDrones.size === 1 ? state.selectedDrones.values().next().value : -1;
  updateSelectionStatus();
  updateInspector();
  syncColorControls();
  draw();
}

function updateInspector() {
  updateColorScope();
  const drone = state.mode === 'manual' && state.selectedDrones.size === 1 ? state.manualDrones[state.selectedDrone] : null;
  inspector.hidden = !drone;
  q('[data-workspace-help]').textContent = state.mode === 'animation'
    ? 'Posisi animasi Blender mengikuti file. Ubah warnanya melalui panel Warna cahaya.'
    : state.selectedDrones.size > 1 ? `${state.selectedDrones.size} drone terpilih. Seret salah satunya untuk menggeser bersama.`
      : drone ? 'Seret drone di kanvas atau ubah nilainya di sini.' : 'Pilih drone pada kanvas untuk mengubah posisinya.';
  updateSpacingStatus();
  if (!drone) return;
  q('[data-inspector-title]').textContent = `Drone ${state.selectedDrone + 1}`;
  inspectorX.value = (drone.x * 100).toFixed(1);
  inspectorY.value = (drone.y * 100).toFixed(1);
  inspectorZ.value = String(drone.z || 0);
  inspectorColor.value = colorToHex(drone.color || state.startColor);
}

function updatePlacedCount() {
  const count = state.mode === 'animation' ? state.scenes[state.selectedScene].frames[0].drones.length : state.manualDrones.length;
  placedCount.textContent = `${count.toLocaleString('id-ID')} ${state.mode === 'animation' ? 'dalam animasi' : 'ditempatkan'}`;
  if (state.mode === 'manual') {
    q('[data-stage-drone-count]').textContent = state.manualDrones.length.toLocaleString('id-ID');
    q('[data-dialog-drones]').textContent = `${state.manualDrones.length.toLocaleString('id-ID')} drone`;
  }
  if (state.mode === 'animation') {
    q('[data-stage-drone-count]').textContent = count.toLocaleString('id-ID');
    q('[data-dialog-drones]').textContent = `${count.toLocaleString('id-ID')} drone`;
  }
  updateInspector();
  draw();
}

function updateMotionOrigin(scene) {
  q('[data-motion-origin]').textContent = scene.formation === 'animation'
    ? `Animasi dari file · ${scene.frames.length} frame · ${displaySeconds(scene.duration)} detik`
    : scene.formation === 'manual' ? 'Desain statis · tanpa data gerak'
      : scene.formation === 'free' ? 'Scene kosong' : 'Animasi formasi Studio';
}

function enterManualMode(name = 'Custom workspace') {
  const wasManual = state.mode === 'manual';
  state.mode = 'manual';
  state.formation = 'manual';
  const scene = state.scenes[state.selectedScene];
  scene.formation = 'manual';
  scene.manualDrones = state.manualDrones;
  if (!wasManual || name !== 'Custom workspace') scene.name = name;
  qa('[data-formation]').forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  });
  sceneName.textContent = `Scene ${String(state.selectedScene + 1).padStart(2, '0')} — ${scene.name}`;
  updateMotionOrigin(scene);
  const cardName = q(`[data-scene="${state.selectedScene}"] strong`);
  if (cardName) cardName.textContent = scene.name;
  canvasHint.hidden = true;
  updatePlacedCount();
}

function templatePoints(type, centerX, centerY, centerZ = 0) {
  const points = [];
  if (type === 'single') points.push({ x: centerX, y: centerY });
  if (type === 'row') {
    for (let index = 0; index < 8; index += 1) points.push({ x: centerX + (index - 3.5) * .025, y: centerY });
  }
  if (type === 'grid') {
    for (let row = -2; row <= 2; row += 1) for (let col = -2; col <= 2; col += 1) points.push({ x: centerX + col * .027, y: centerY + row * .04 });
  }
  if (type === 'ring') {
    for (let index = 0; index < 32; index += 1) {
      const angle = index / 32 * Math.PI * 2;
      points.push({ x: centerX + Math.cos(angle) * .1, y: centerY + Math.sin(angle) * .13 });
    }
  }
  return points.map((point, index) => ({
    x: Math.max(.04, Math.min(.96, point.x)),
    y: Math.max(.06, Math.min(.94, point.y)),
    z: centerZ,
    color: state.gradient ? mixColor(state.startColor, state.endColor, index / Math.max(1, points.length - 1)) : state.startColor
  }));
}

function formationAsManualDrones() {
  if (state.mode !== 'formation' || state.formation === 'free') return state.manualDrones;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const time = state.time / 100;
  return sceneDrones(state.scenes[state.selectedScene], time * selectedDuration(), width, height).map(drone => ({
    ...drone, x: Math.max(0, Math.min(1, drone.x)), y: Math.max(0, Math.min(1, drone.y))
  }));
}

function selectAllDrones() {
  if (state.mode === 'animation') {
    showToast('Animasi impor hanya untuk pratinjau. Buat scene baru untuk memilih dan mengedit drone.');
    return;
  }
  if (state.mode === 'formation' && state.formation !== 'free') {
    state.manualDrones = formationAsManualDrones();
    state.selectedDrones.clear();
    enterManualMode();
    markDirty();
  }
  if (!state.manualDrones.length) {
    showToast('Belum ada drone pada scene ini.');
    return;
  }
  setSelection(state.manualDrones.map((_, index) => index));
}

function addTemplate(type, x = null, y = null, z = 0) {
  if (!VALID_TEMPLATES.has(type)) return;
  if (state.mode === 'animation') {
    showToast('Tambahkan scene baru untuk mengedit drone secara manual.');
    return;
  }
  const wasFormation = state.mode === 'formation' && state.formation !== 'free';
  const existing = formationAsManualDrones();
  const existingCount = existing.length;
  if (x === null || y === null) {
    const anchor = existing[state.selectedDrone] || existing[0];
    x = anchor ? Math.min(.96, anchor.x + .025) : .5;
    y = anchor ? Math.min(.94, anchor.y + .025) : .5;
    z = anchor?.z || 0;
  }
  const additions = templatePoints(type, x, y, z);
  if (existing.length + additions.length > MAX_MANUAL_DRONES) {
    showToast('Maksimal 1.000 drone di workspace.');
    return;
  }
  if (wouldIncreaseSpacingViolations(existing, [...existing, ...additions])) {
    showToast('Pola ini menambah drone dengan jarak terdekat lebih dari 2 m.');
    return;
  }
  state.manualDrones = existing;
  state.selectedDrones.clear();
  enterManualMode();
  state.manualDrones.push(...additions);
  state.selectedDrones = new Set(additions.map((_, index) => state.manualDrones.length - additions.length + index));
  state.selectedDrone = additions.length === 1 ? state.manualDrones.length - 1 : -1;
  updateSelectionStatus();
  updatePlacedCount();
  markDirty();
  showToast(wasFormation ? `${existingCount} titik formasi dibekukan untuk diedit; ${additions.length} drone ditambahkan.` : `${additions.length} drone ditambahkan ke workspace.`);
}

function selectFormation(type, updateScene = true, confirmed = false) {
  const replacingAnimation = updateScene && state.mode === 'animation';
  const replacingManual = updateScene && state.mode === 'manual' && state.manualDrones.length > 0;
  if (replacingAnimation && !confirmed && !window.confirm('Formasi baru akan mengganti animasi pada scene ini. Lanjutkan?')) return;
  if (replacingManual && !confirmed && !window.confirm('Formasi baru akan mengganti drone manual pada scene ini. Lanjutkan?')) return;
  if (updateScene && (state.mode === 'manual' || state.mode === 'animation')) state.manualDrones = [];
  state.mode = 'formation';
  state.formation = type;
  state.selectedDrone = -1;
  state.selectedDrones.clear();
  updateSelectionStatus();
  qa('[data-formation]').forEach(button => {
    const active = button.dataset.formation === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  canvasHint.hidden = type !== 'free';
  const visibleDrones = type === 'free' ? 0 : state.droneCount;
  q('[data-stage-drone-count]').textContent = visibleDrones.toLocaleString('id-ID');
  q('[data-dialog-drones]').textContent = `${visibleDrones.toLocaleString('id-ID')} drone`;
  if (updateScene) {
    const name = { orbit: 'Orbit', wave: 'Wave', mark: 'Sky mark', free: 'Dari nol' }[type];
    state.scenes[state.selectedScene].formation = type;
    delete state.scenes[state.selectedScene].manualDrones;
    delete state.scenes[state.selectedScene].frames;
    delete state.scenes[state.selectedScene].colorOverride;
    delete state.scenes[state.selectedScene].bounds;
    if (replacingAnimation) {
      state.scenes[state.selectedScene].duration = 4;
      const durationLabel = q(`[data-scene="${state.selectedScene}"] small`);
      if (durationLabel) durationLabel.textContent = '4 detik';
      updateSceneSummary();
    }
    state.scenes[state.selectedScene].name = name;
    sceneName.textContent = `Scene ${String(state.selectedScene + 1).padStart(2, '0')} — ${name}`;
    const cardName = q(`[data-scene="${state.selectedScene}"] strong`);
    if (cardName) cardName.textContent = name;
  }
  if (updateScene) markDirty();
  updateMotionOrigin(state.scenes[state.selectedScene]);
  updateInspector();
  syncColorControls();
  draw();
}

function canvasPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return droneFromScreen(event.clientX - rect.left, event.clientY - rect.top, 0, rect.width, rect.height);
}

function screenPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function findDroneAt(position) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  let best = -1;
  let bestDistance = 14;
  state.manualDrones.forEach((drone, index) => {
    const projected = projectDrone(drone, width, height);
    const distance = Math.hypot(projected.x - position.x, projected.y - position.y);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

function findFormationAt(position) {
  if (state.mode !== 'formation' || state.formation === 'free') return -1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  let best = -1;
  let bestDistance = 14;
  for (let index = 0; index < state.droneCount; index += 1) {
    const point = formationPoint(state.formation, index, state.droneCount, width, height, state.time / 100);
    const projected = projectDrone({ x: point.x / width, y: point.y / height, z: 0 }, width, height);
    const distance = Math.hypot(projected.x - position.x, projected.y - position.y);
    if (distance < bestDistance) { best = index; bestDistance = distance; }
  }
  return best;
}

function selectionIndices() {
  return [...state.selectedDrones].sort((a, b) => a - b);
}

function copySelectedDrone() {
  if (state.mode !== 'manual' || !state.selectedDrones.size) {
    showToast('Pilih drone di workspace terlebih dahulu.');
    return;
  }
  state.clipboardDrones = selectionIndices().map(index => ({ ...state.manualDrones[index] }));
  showToast(`${state.clipboardDrones.length} drone disalin. Tekan Ctrl+V untuk menempel.`);
}

function pasteDrone() {
  if (!state.clipboardDrones.length) {
    showToast('Belum ada drone yang disalin.');
    return;
  }
  if (state.mode === 'animation') {
    showToast('Tambahkan scene baru untuk mengedit drone secara manual.');
    return;
  }
  const existing = formationAsManualDrones();
  if (existing.length + state.clipboardDrones.length > MAX_MANUAL_DRONES) {
    showToast('Maksimal 1.000 drone di workspace.');
    return;
  }
  const dx = Math.min(.025, 1 - Math.max(...state.clipboardDrones.map(drone => drone.x)));
  const dy = Math.min(.035, 1 - Math.max(...state.clipboardDrones.map(drone => drone.y)));
  const pasted = state.clipboardDrones.map(drone => ({ ...drone, x: drone.x + dx, y: drone.y + dy }));
  if (wouldIncreaseSpacingViolations(existing, [...existing, ...pasted])) {
    showToast('Tempelan ini terlalu jauh dari drone terdekat (maks 2 m).');
    return;
  }
  state.manualDrones = existing;
  state.selectedDrones.clear();
  enterManualMode();
  const first = state.manualDrones.length;
  state.manualDrones.push(...pasted);
  state.clipboardDrones = pasted.map(drone => ({ ...drone }));
  state.selectedDrones = new Set(pasted.map((_, index) => first + index));
  state.selectedDrone = pasted.length === 1 ? first : -1;
  updateSelectionStatus();
  updatePlacedCount();
  markDirty();
  showToast(`${pasted.length} salinan drone ditempatkan.`);
}

function deleteSelectedDrone() {
  if (state.mode !== 'manual' || !state.selectedDrones.size) {
    showToast('Pilih drone yang ingin dihapus.');
    return;
  }
  const remaining = state.manualDrones.filter((_, index) => !state.selectedDrones.has(index));
  if (wouldIncreaseSpacingViolations(state.manualDrones, remaining)) {
    showToast('Penghapusan ini membuat jarak drone lain melebihi 2 m.');
    return;
  }
  const removed = state.selectedDrones.size;
  state.manualDrones = remaining;
  state.scenes[state.selectedScene].manualDrones = state.manualDrones;
  state.selectedDrones.clear();
  state.selectedDrone = -1;
  updateSelectionStatus();
  updatePlacedCount();
  markDirty();
  showToast(`${removed} drone dihapus dari workspace.`);
}

qa('[data-drone-template]').forEach(button => {
  button.addEventListener('dragstart', event => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/skyfy-template', button.dataset.droneTemplate);
  });
  button.addEventListener('click', () => addTemplate(button.dataset.droneTemplate));
});

['dragenter', 'dragover'].forEach(name => stage.addEventListener(name, event => {
  if (!event.dataTransfer.types.includes('text/skyfy-template')) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  stage.classList.add('dragging-over');
}));

['dragleave', 'drop'].forEach(name => stage.addEventListener(name, event => {
  if (name === 'drop') event.preventDefault();
  stage.classList.remove('dragging-over');
}));

stage.addEventListener('drop', event => {
  const type = event.dataTransfer.getData('text/skyfy-template');
  if (!type) return;
  const position = canvasPosition(event);
  addTemplate(type, position.x, position.y, position.z);
  canvas.focus({ preventScroll: true });
});

let cameraGesture = null;
let orbitToolActive = false;

function setView(view) {
  state.view = view;
  qa('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  draw();
}

canvas.addEventListener('contextmenu', event => event.preventDefault());
function beginDroneDrag(index, event, screen) {
  if (!state.selectedDrones.has(index)) setSelection([index]);
  const anchor = state.manualDrones[index];
  state.draggingDrone = true;
  state.dragOrigin = {
    pointerId: event.pointerId,
    positions: selectionIndices().map(selected => ({ index: selected, ...state.manualDrones[selected] })),
    anchor: { ...anchor },
    projected: projectDrone(anchor, canvas.clientWidth, canvas.clientHeight),
    screen,
    violations: analyzeSpacing(state.manualDrones, state.scenes[state.selectedScene].bounds || null).violations
  };
  canvas.setPointerCapture(event.pointerId);
}

canvas.addEventListener('pointerdown', event => {
  canvas.focus({ preventScroll: true });
  if (event.button === 1 || event.button === 2 || (event.button === 0 && (event.altKey || event.shiftKey || orbitToolActive))) {
    event.preventDefault();
    const pan = event.shiftKey || event.button === 2;
    cameraGesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, pan };
    canvas.setPointerCapture(event.pointerId);
    if (!pan) setView('perspective');
    return;
  }
  if (event.button !== 0) return;
  if (state.movingReference) {
    const reference = selectedReference();
    if (!reference?.visible) return;
    state.referenceDrag = {
      pointerId: event.pointerId, x: event.clientX, y: event.clientY,
      startX: reference.x, startY: reference.y,
      projected: referencePoint(reference, 0, 0, canvas.clientWidth, canvas.clientHeight)
    };
    canvas.setPointerCapture(event.pointerId);
    return;
  }
  if (state.mode === 'animation') return;
  const screen = screenPosition(event);
  if (state.mode === 'formation' && state.formation === 'free') {
    const position = canvasPosition(event);
    addTemplate('single', position.x, position.y, position.z);
    return;
  }
  const hit = state.mode === 'manual' ? findDroneAt(screen) : findFormationAt(screen);
  if (hit >= 0) {
    if (state.mode === 'formation') {
      state.manualDrones = formationAsManualDrones();
      state.selectedDrones.clear();
      enterManualMode();
      markDirty();
    }
    if (event.ctrlKey || event.metaKey) {
      const next = new Set(state.selectedDrones);
      if (next.has(hit)) next.delete(hit);
      else next.add(hit);
      setSelection(next);
      return;
    }
    beginDroneDrag(hit, event, screen);
    return;
  }
  state.selectionBox = {
    pointerId: event.pointerId,
    startX: screen.x, startY: screen.y, endX: screen.x, endY: screen.y,
    active: false,
    additive: event.ctrlKey || event.metaKey,
    initial: new Set(state.selectedDrones)
  };
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener('pointermove', event => {
  if (cameraGesture?.pointerId === event.pointerId) {
    const dx = event.clientX - cameraGesture.x;
    const dy = event.clientY - cameraGesture.y;
    cameraGesture.x = event.clientX;
    cameraGesture.y = event.clientY;
    if (cameraGesture.pan) {
      state.camera.panX += dx;
      state.camera.panY += dy;
    } else {
      state.camera.yaw += dx * .006;
      state.camera.pitch = Math.max(-1.35, Math.min(1.35, state.camera.pitch + dy * .006));
    }
    draw();
    return;
  }
  if (state.referenceDrag?.pointerId === event.pointerId) {
    const reference = selectedReference();
    if (!reference) return;
    const drag = state.referenceDrag;
    const position = referenceFromScreen(
      drag.projected.x + event.clientX - drag.x,
      drag.projected.y + event.clientY - drag.y,
      { x: drag.startX, y: drag.startY }, canvas.clientWidth, canvas.clientHeight
    );
    reference.x = position.x;
    reference.y = position.y;
    markDirty();
    draw();
    return;
  }
  if (state.selectionBox?.pointerId === event.pointerId) {
    const box = state.selectionBox;
    const screen = screenPosition(event);
    box.endX = screen.x;
    box.endY = screen.y;
    if (!box.active && Math.hypot(box.endX - box.startX, box.endY - box.startY) < 5) return;
    if (!box.active) {
      box.active = true;
      if (state.mode === 'formation') {
        state.manualDrones = formationAsManualDrones();
        state.selectedDrones.clear();
        enterManualMode();
        markDirty();
      }
    }
    const left = Math.min(box.startX, box.endX);
    const right = Math.max(box.startX, box.endX);
    const top = Math.min(box.startY, box.endY);
    const bottom = Math.max(box.startY, box.endY);
    const selected = box.additive ? new Set(box.initial) : new Set();
    state.manualDrones.forEach((drone, index) => {
      const point = projectDrone(drone, canvas.clientWidth, canvas.clientHeight);
      if (point.x >= left && point.x <= right && point.y >= top && point.y <= bottom) selected.add(index);
    });
    state.selectedDrones = selected;
    state.selectedDrone = selected.size === 1 ? selected.values().next().value : -1;
    updateSelectionStatus();
    draw();
    return;
  }
  if (!state.draggingDrone || !state.dragOrigin) return;
  const screen = screenPosition(event);
  const origin = state.dragOrigin;
  const target = droneFromScreen(
    origin.projected.x + screen.x - origin.screen.x,
    origin.projected.y + screen.y - origin.screen.y,
    origin.projected.depth, canvas.clientWidth, canvas.clientHeight
  );
  const minX = Math.min(...origin.positions.map(point => point.x));
  const maxX = Math.max(...origin.positions.map(point => point.x));
  const minY = Math.min(...origin.positions.map(point => point.y));
  const maxY = Math.max(...origin.positions.map(point => point.y));
  const dx = Math.max(-minX, Math.min(1 - maxX, target.x - origin.anchor.x));
  const dy = Math.max(-minY, Math.min(1 - maxY, target.y - origin.anchor.y));
  const dz = target.z - (origin.anchor.z || 0);
  origin.positions.forEach(point => {
    const drone = state.manualDrones[point.index];
    drone.x = point.x + dx;
    drone.y = point.y + dy;
    drone.z = Math.max(-1_000_000, Math.min(1_000_000, (point.z || 0) + dz));
  });
  if (state.selectedDrones.size === 1) {
    const drone = state.manualDrones[state.selectedDrone];
    inspectorX.value = (drone.x * 100).toFixed(1);
    inspectorY.value = (drone.y * 100).toFixed(1);
    inspectorZ.value = String(drone.z);
  }
  markDirty();
  draw();
});

function stopDragging(event) {
  if (cameraGesture?.pointerId === event.pointerId) {
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    cameraGesture = null;
    return;
  }
  if (state.referenceDrag?.pointerId === event.pointerId) {
    if (event.type === 'pointercancel') {
      const reference = selectedReference();
      if (reference) {
        reference.x = state.referenceDrag.startX;
        reference.y = state.referenceDrag.startY;
        draw();
      }
    }
    state.referenceDrag = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    return;
  }
  if (state.selectionBox?.pointerId === event.pointerId) {
    const box = state.selectionBox;
    state.selectionBox = null;
    if (event.type === 'pointercancel') setSelection(box.initial);
    else if (!box.active && !box.additive) setSelection([]);
    else setSelection(state.selectedDrones);
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    return;
  }
  if (state.draggingDrone && state.dragOrigin) {
    if (event.type === 'pointercancel' || analyzeSpacing(state.manualDrones, state.scenes[state.selectedScene].bounds || null).violations > state.dragOrigin.violations) {
      state.dragOrigin.positions.forEach(point => {
        const drone = state.manualDrones[point.index];
        drone.x = point.x;
        drone.y = point.y;
        drone.z = point.z || 0;
      });
      if (event.type !== 'pointercancel') showToast('Posisi ditolak: jarak ke drone terdekat harus maks 2 m.');
    }
    updateInspector();
    draw();
  }
  if (state.draggingDrone && canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  state.draggingDrone = false;
  state.dragOrigin = null;
}

canvas.addEventListener('pointerup', stopDragging);
canvas.addEventListener('pointercancel', stopDragging);
canvas.addEventListener('wheel', event => {
  event.preventDefault();
  const pointer = screenPosition(event);
  const world = unprojectScreen(pointer.x, pointer.y, 0, canvas.clientWidth, canvas.clientHeight);
  state.camera.zoom = Math.max(.35, Math.min(4, state.camera.zoom * Math.exp(-event.deltaY * .001)));
  const projected = projectWorldPoint(world, canvas.clientWidth, canvas.clientHeight);
  state.camera.panX += pointer.x - projected.x;
  state.camera.panY += pointer.y - projected.y;
  draw();
}, { passive: false });
q('[data-copy-drone]').addEventListener('click', copySelectedDrone);
q('[data-paste-drone]').addEventListener('click', pasteDrone);
q('[data-delete-drone]').addEventListener('click', deleteSelectedDrone);
q('[data-select-all]').addEventListener('click', selectAllDrones);

const shortcutDialog = q('[data-shortcut-dialog]');
function seekShortcut(seconds) {
  stopPlayback();
  updateTime(seconds);
}
function stepShortcut(direction, seconds) {
  seekShortcut(sceneStartTime(state.selectedScene) + state.time / 100 * selectedDuration() + direction * seconds);
}
function clearWorkspaceTool() {
  const pointerId = cameraGesture?.pointerId ?? state.referenceDrag?.pointerId ?? state.selectionBox?.pointerId ?? state.dragOrigin?.pointerId;
  if (pointerId !== undefined) stopDragging({ type: 'pointercancel', pointerId });
  if (state.movingReference) setReferenceMove(false);
  if (orbitToolActive) q('[data-orbit-tool]').click();
  setSelection([]);
}

const studioShortcuts = [
  { group: 'Proyek & panduan', keys: ['ctrl+s', 'meta+s'], label: 'Ctrl + S', text: 'Simpan proyek', button: '[data-save]', global: true },
  { group: 'Proyek & panduan', keys: ['ctrl+o', 'meta+o'], label: 'Ctrl + O', text: 'Buka proyek', button: '[data-open-project]', global: true },
  { group: 'Proyek & panduan', keys: ['?'], label: '?', text: 'Buka panduan shortcut', button: '[data-shortcut-help]', global: true },
  { group: 'Drone & seleksi', keys: ['shift+a'], label: 'Shift + A', text: 'Tambah drone tunggal', button: '[data-drone-template="single"]' },
  { group: 'Drone & seleksi', keys: ['ctrl+a', 'meta+a'], label: 'Ctrl + A', text: 'Pilih semua drone', button: '[data-select-all]' },
  { group: 'Drone & seleksi', keys: ['ctrl+c', 'meta+c'], label: 'Ctrl + C', text: 'Salin drone terpilih', button: '[data-copy-drone]' },
  { group: 'Drone & seleksi', keys: ['ctrl+v', 'meta+v'], label: 'Ctrl + V', text: 'Tempel drone', button: '[data-paste-drone]' },
  { group: 'Drone & seleksi', keys: ['delete', 'backspace'], label: 'Del / Backspace', text: 'Hapus drone terpilih', button: '[data-delete-drone]' },
  { group: 'Drone & seleksi', keys: ['escape'], label: 'Esc', text: 'Keluar alat / batalkan seleksi atau geser', run: clearWorkspaceTool },
  { group: 'Kamera & workspace', keys: ['1'], label: '1', text: 'Tampak depan', button: '[data-view="front"]' },
  { group: 'Kamera & workspace', keys: ['3'], label: '3', text: 'Tampak perspektif', button: '[data-view="perspective"]' },
  { group: 'Kamera & workspace', keys: ['0'], label: '0', text: 'Reset kamera', button: '[data-reset-camera]' },
  { group: 'Kamera & workspace', keys: ['r'], label: 'R', text: 'Aktifkan / matikan putar ruang', button: '[data-orbit-tool]' },
  { group: 'Kamera & workspace', keys: ['+', '='], label: '+', text: 'Zoom masuk', repeat: true, run: () => { state.camera.zoom = Math.min(4, state.camera.zoom * 1.1); draw(); } },
  { group: 'Kamera & workspace', keys: ['-'], label: '-', text: 'Zoom keluar', repeat: true, run: () => { state.camera.zoom = Math.max(.35, state.camera.zoom / 1.1); draw(); } },
  { group: 'Kamera & workspace', keys: ['g'], label: 'G', text: 'Tampil / sembunyikan ground mesh', button: '[data-ground-toggle]' },
  { group: 'Kamera & workspace', keys: ['f'], label: 'F', text: 'Masuk / keluar layar penuh', button: '[data-fullscreen]' },
  { group: 'Kamera & workspace', keys: ['b'], label: 'B', text: 'Buka / tutup panel fitur', button: '[data-feature-toggle]' },
  { group: 'Kamera & workspace', keys: ['t'], label: 'T', text: 'Ganti mode terang / gelap', button: '[data-theme-toggle]' },
  { group: 'Gambar referensi', keys: ['h'], label: 'H', text: 'Tampil / sembunyikan layer terpilih', button: '[data-reference-toggle]' },
  { group: 'Gambar referensi', keys: ['shift+h'], label: 'Shift + H', text: 'Aktifkan / matikan geser referensi', button: '[data-reference-move]' },
  { group: 'Animasi & scene', keys: ['space'], label: 'Spasi', text: 'Putar / jeda', button: '[data-play]' },
  { group: 'Animasi & scene', keys: ['shift+space'], label: 'Shift + Spasi', text: 'Putar dari scene pertama', button: '[data-run-test]' },
  { group: 'Animasi & scene', keys: ['arrowleft'], label: 'Panah kiri', text: 'Mundur 0,1 detik', repeat: true, run: () => stepShortcut(-1, .1) },
  { group: 'Animasi & scene', keys: ['arrowright'], label: 'Panah kanan', text: 'Maju 0,1 detik', repeat: true, run: () => stepShortcut(1, .1) },
  { group: 'Animasi & scene', keys: ['shift+arrowleft'], label: 'Shift + kiri', text: 'Mundur 1 detik', repeat: true, run: () => stepShortcut(-1, 1) },
  { group: 'Animasi & scene', keys: ['shift+arrowright'], label: 'Shift + kanan', text: 'Maju 1 detik', repeat: true, run: () => stepShortcut(1, 1) },
  { group: 'Animasi & scene', keys: ['home'], label: 'Home', text: 'Awal seluruh scene', run: () => seekShortcut(0) },
  { group: 'Animasi & scene', keys: ['end'], label: 'End', text: 'Akhir seluruh scene', run: () => seekShortcut(totalDuration()) },
  { group: 'Animasi & scene', keys: ['['], label: '[', text: 'Scene sebelumnya', run: () => chooseScene(Math.max(0, state.selectedScene - 1)) },
  { group: 'Animasi & scene', keys: [']'], label: ']', text: 'Scene berikutnya', run: () => chooseScene(Math.min(state.scenes.length - 1, state.selectedScene + 1)) },
  { group: 'Animasi & scene', keys: ['shift+n'], label: 'Shift + N', text: 'Tambah scene kosong', button: '[data-add-scene]' }
];

// Generate the guide and button hints from the same bindings used by the editor.
for (const group of new Set(studioShortcuts.map(shortcut => shortcut.group))) {
  const section = document.createElement('section');
  const heading = document.createElement('h3');
  heading.textContent = group;
  const list = document.createElement('dl');
  studioShortcuts.filter(shortcut => shortcut.group === group).forEach(shortcut => {
    const row = document.createElement('div');
    row.className = 'shortcut-row';
    const term = document.createElement('dt');
    const key = document.createElement('kbd');
    key.textContent = shortcut.label;
    term.append(key);
    const description = document.createElement('dd');
    description.textContent = shortcut.text;
    row.append(term, description);
    list.append(row);
    if (shortcut.button) {
      const button = q(shortcut.button);
      button.title = `${shortcut.text} (${shortcut.label})`;
      button.setAttribute('aria-keyshortcuts', shortcut.keys.map(binding => binding.replace('ctrl+', 'Control+').replace('meta+', 'Meta+').replace('shift+', 'Shift+').replace('backspace', 'Backspace').replace('delete', 'Delete').replace('space', 'Space')).join(' '));
    }
  });
  section.append(heading, list);
  q('[data-shortcut-list]').append(section);
}
q('[data-shortcut-help]').addEventListener('click', () => shortcutDialog.showModal());
q('[data-shortcut-close]').addEventListener('click', () => shortcutDialog.close());

document.addEventListener('keydown', event => {
  const target = event.target;
  if (event.defaultPrevented || event.isComposing || event.altKey || q('dialog[open]') || !aiPreview.hidden) return;
  if (target.closest('input, textarea, select, [role="textbox"]') || target.isContentEditable) return;
  const key = event.key === ' ' ? 'space' : event.key.toLowerCase();
  const binding = `${event.ctrlKey ? 'ctrl+' : ''}${event.metaKey ? 'meta+' : ''}${event.shiftKey && !['?', '+'].includes(key) ? 'shift+' : ''}${key}`;
  const shortcut = studioShortcuts.find(item => item.keys.includes(binding));
  if (!shortcut) return;
  const inWorkspace = target === canvas || !!target.closest('.preview-panel');
  if (!shortcut.global && !inWorkspace) return;
  // Preserve native Space activation for focused buttons and links.
  if (key === 'space' && !event.shiftKey && target.closest('button, a')) return;
  if (binding !== 'escape' && (cameraGesture || state.referenceDrag || state.selectionBox || state.draggingDrone)) return;
  event.preventDefault();
  if (event.repeat && !shortcut.repeat) return;
  if (!shortcut.global) canvas.focus({ preventScroll: true });
  if (shortcut.button) q(shortcut.button).click();
  else shortcut.run();
});

function validCoordinate(value, label) {
  if (value === '' || value === null || value === undefined) throw new Error(`Koordinat ${label} kosong.`);
  const number = Number(value);
  if (!Number.isFinite(number) || Math.abs(number) > 1_000_000) throw new Error(`Koordinat ${label} tidak valid.`);
  return number;
}

function colorFromRecord(record) {
  if (record.color !== undefined && record.color !== '') {
    if (typeof record.color !== 'string') throw new Error('Warna harus berupa teks.');
    const color = record.color.trim();
    if (/^#[0-9a-f]{6}$/i.test(color)) return color;
    const rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(color);
    if (rgb && rgb.slice(1).every(channel => Number(channel) <= 255)) return `rgb(${rgb.slice(1).map(Number).join(', ')})`;
    throw new Error('Warna harus #RRGGBB atau rgb(0-255, 0-255, 0-255).');
  }
  const channels = [record.r, record.g, record.b];
  if (channels.every(value => value === undefined || value === '')) return state.startColor;
  if (!channels.every(value => value !== undefined && value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) <= 255)) {
    throw new Error('Kanal r, g, b harus bilangan 0-255.');
  }
  return `rgb(${channels.map(Number).join(', ')})`;
}

function normalizeImported(records) {
  if (!records.length || records.length > MAX_MANUAL_DRONES) throw new Error('File harus berisi 1 sampai 1.000 drone.');
  const usable = records.map((record, index) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`Drone ${index + 1} tidak valid.`);
    return {
      x: validCoordinate(record.x, 'x'),
      y: validCoordinate(record.y, 'y'),
      z: record.z === undefined || record.z === '' ? 0 : validCoordinate(record.z, 'z'),
      color: colorFromRecord(record)
    };
  });
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  for (const record of usable) {
    minX = Math.min(minX, record.x); maxX = Math.max(maxX, record.x);
    minY = Math.min(minY, record.y); maxY = Math.max(maxY, record.y);
  }
  if (minX >= 0 && maxX <= 1 && minY >= 0 && maxY <= 1) return usable;
  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  return usable.map(record => ({
    ...record,
    x: .14 + (record.x - minX) / width * .72,
    y: .14 + (record.y - minY) / height * .72
  }));
}

function parseCsv(text, maxRecords = MAX_MANUAL_DRONES) {
  text = text.replace(/^\uFEFF/, '');
  const firstLine = text.split(/\r?\n/, 1)[0];
  let delimiter;
  let headerQuoted = false;
  for (const char of firstLine) {
    if (char === '"') headerQuoted = !headerQuoted;
    else if (!headerQuoted && [',', ';', '\t'].includes(char)) { delimiter = char; break; }
  }
  if (!delimiter) throw new Error('CSV membutuhkan pemisah koma, titik koma, atau tab.');
  const rows = [];
  let row = []; let field = ''; let quoted = false; let closedQuote = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (quoted) { quoted = false; closedQuote = true; }
      else if (!field && !closedQuote) quoted = true;
      else throw new Error('Format kutip CSV tidak valid.');
    } else if (!quoted && (char === delimiter || char === '\n' || char === '\r')) {
      row.push(field.trim()); field = ''; closedQuote = false;
      if (char !== delimiter) {
        if (row.some(value => value !== '')) rows.push(row);
        row = [];
        if (char === '\r' && text[index + 1] === '\n') index += 1;
        if (rows.length > maxRecords + 1) throw new Error(`Maksimal ${maxRecords.toLocaleString('id-ID')} baris data.`);
      }
    } else {
      if (closedQuote && char !== ' ' && char !== '\t') throw new Error('Teks setelah kutip CSV tidak valid.');
      field += char;
    }
  }
  if (quoted) throw new Error('Format kutip CSV tidak lengkap.');
  row.push(field.trim());
  if (row.some(value => value !== '')) rows.push(row);
  if (rows.length > maxRecords + 1) throw new Error(`Maksimal ${maxRecords.toLocaleString('id-ID')} baris data.`);
  if (!rows.length) return [];
  const possibleHeader = rows[0].map(value => value.toLowerCase());
  const hasHeader = possibleHeader.includes('x') && possibleHeader.includes('y');
  const header = hasHeader ? possibleHeader : ['x', 'y', 'z', 'r', 'g', 'b'];
  if (new Set(header).size !== header.length || !header.includes('x') || !header.includes('y')) throw new Error('Header CSV tidak valid.');
  if (rows.slice(hasHeader ? 1 : 0).some(values => hasHeader ? values.length !== header.length : values.length < 2 || values.length > header.length)) {
    throw new Error('Jumlah kolom CSV tidak konsisten.');
  }
  return rows.slice(hasHeader ? 1 : 0).map(values => Object.fromEntries(header.map((key, index) => [key, values[index]])));
}

function parseAnimationCsv(records) {
  if (!records.length || records.length > MAX_ANIMATION_ROWS) throw new Error('Jumlah baris animasi tidak valid.');
  const frames = [];
  let lastTime = -Infinity;
  let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
  for (const record of records) {
    const timestamp = validCoordinate(record.timestamp, 'timestamp');
    if (timestamp < 0 || timestamp < lastTime) throw new Error('Timestamp harus berurutan dari awal ke akhir.');
    if (timestamp !== lastTime) {
      if (frames.length >= MAX_ANIMATION_FRAMES) throw new Error('Maksimal 1.200 frame animasi.');
      frames.push({ timestamp, drones: new Map() });
      lastTime = timestamp;
    }
    const id = Number(record.drone_id);
    if (!Number.isSafeInteger(id) || id < 0) throw new Error('drone_id harus bilangan bulat nonnegatif.');
    const frame = frames[frames.length - 1];
    if (frame.drones.has(id)) throw new Error(`drone_id ${id} muncul dua kali pada satu frame.`);
    if (frame.drones.size >= MAX_MANUAL_DRONES) throw new Error('Maksimal 1.000 drone per frame.');
    const x = validCoordinate(record.x, 'x');
    const y = validCoordinate(record.y, 'y');
    const z = validCoordinate(record.z, 'z');
    const color = colorFromRecord(record);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    frame.drones.set(id, { x, y, z, color });
  }
  if (frames.length < 2) throw new Error('Animasi memerlukan minimal dua timestamp.');
  const ids = [...frames[0].drones.keys()].sort((a, b) => a - b);
  if (frames.some(frame => frame.drones.size !== ids.length || ids.some(id => !frame.drones.has(id)))) {
    throw new Error('Setiap frame harus memiliki drone_id yang sama.');
  }
  const duration = frames[frames.length - 1].timestamp - frames[0].timestamp;
  if (duration <= 0 || duration > 120) throw new Error('Durasi animasi harus lebih dari 0 dan maksimal 120 detik.');
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return {
    duration,
    droneCount: ids.length,
    bounds: { xMin: minX, xMax: maxX, yMin: minY, yMax: maxY, projection: 'animation' },
    frames: frames.map(frame => ({
      time: frame.timestamp - frames[0].timestamp,
      drones: ids.map(id => {
        const drone = frame.drones.get(id);
        return {
          x: .12 + (drone.x - minX) / spanX * .76,
          y: .85 - (drone.y - minY) / spanY * .7,
          z: drone.z,
          color: drone.color
        };
      })
    }))
  };
}

function installImportedScene(scene, placement) {
  const append = placement === 'append';
  if (append && state.scenes.length >= MAX_SCENES) throw new Error('Maksimal 20 scene.');
  if (!append && hasUnsavedChanges && !window.confirm('Buka sebagai desain baru mulai 00:00? Perubahan proyek yang belum disimpan akan diganti. Pilih Batal untuk menyimpan proyek atau memilih Tambah scene.')) return false;
  stopPlayback();
  clearWorkspaceTool();
  if (append) {
    state.scenes.push(scene);
  } else {
    state.scenes = [scene];
    state.selectedScene = -1;
    state.manualDrones = [];
    state.clipboardDrones = [];
    projectName.value = scene.name.replace(/\.[^.]+$/, '').slice(0, 48) || 'Desain impor';
  }
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  chooseScene(append ? state.scenes.length - 1 : 0);
  return true;
}

async function handleFile(file) {
  if (!file) return;
  const thisImport = ++importToken;
  const placement = q('[data-import-placement]').value;
  const extension = file.name.split('.').pop().toLowerCase();
  if (!['csv', 'json'].includes(extension)) {
    showToast('Gunakan file CSV atau JSON.');
    return;
  }
  try {
    if (file.size > MAX_FILE_BYTES) throw new Error('Maksimal ukuran file 10 MB.');
    const text = await file.text();
    if (thisImport !== importToken) return;
    const parsed = extension === 'json' ? JSON.parse(text) : parseCsv(text, MAX_ANIMATION_ROWS);
    const records = extension === 'json' ? (Array.isArray(parsed) ? parsed : parsed.drones) : parsed;
    if (!Array.isArray(records)) throw new Error('JSON harus berisi array drones.');
    const animationRecords = records[0]?.timestamp !== undefined && records[0]?.drone_id !== undefined;
    if (animationRecords) {
      const animation = parseAnimationCsv(records);
      const scene = { name: file.name.slice(0, 80), formation: 'animation', duration: animation.duration, frames: animation.frames, bounds: animation.bounds };
      if (!installImportedScene(scene, placement)) return;
      fileLabel.textContent = `${file.name} • animasi file, ${animation.droneCount} drone, ${animation.frames.length} frame`;
      markDirty();
      showToast(`Animasi ${animation.droneCount} drone dan ${animation.frames.length} frame berhasil diimpor.`);
      return;
    }
    const scene = { name: file.name.slice(0, 80), formation: 'manual', duration: 4, manualDrones: normalizeImported(records) };
    const xs = records.map(record => Number(record.x));
    const ys = records.map(record => Number(record.y));
    const xMin = Math.min(...xs); const xMax = Math.max(...xs);
    const yMin = Math.min(...ys); const yMax = Math.max(...ys);
    if (xMin < 0 || xMax > 1 || yMin < 0 || yMax > 1) {
      scene.bounds = { xMin, xMax, yMin, yMax, projection: 'static' };
    }
    if (!installImportedScene(scene, placement)) return;
    fileLabel.textContent = `${file.name} • ${state.manualDrones.length} drone, tanpa data animasi`;
    markDirty();
    showToast(`${state.manualDrones.length} drone berhasil diimpor sebagai desain statis.`);
  } catch (error) {
    showToast(`File tidak dapat dibaca: ${error.message}`);
  } finally {
    fileInput.value = '';
  }
}

fileInput.addEventListener('change', () => handleFile(fileInput.files[0]));
['dragenter', 'dragover'].forEach(name => dropZone.addEventListener(name, event => {
  event.preventDefault();
  dropZone.classList.add('dragging');
}));
['dragleave', 'drop'].forEach(name => dropZone.addEventListener(name, event => {
  event.preventDefault();
  dropZone.classList.remove('dragging');
}));
dropZone.addEventListener('drop', event => handleFile(event.dataTransfer.files[0]));

function updateTime(seconds) {
  const globalTime = typeof seconds === 'number'
    ? Math.max(0, Math.min(totalDuration(), seconds))
    : totalDuration() * Number(timeRange.value) / 100;
  if (typeof seconds === 'number') timeRange.value = String(globalTime / totalDuration() * 100);
  const position = sceneAtTime(globalTime);
  state.time = position.localTime / state.scenes[position.index].duration * 100;
  if (position.index !== state.selectedScene) activateScene(position.index);
  state.time = position.localTime / selectedDuration() * 100;
  currentTime.textContent = formatPlaybackTime(globalTime);
  updateRangeFill(timeRange, Number(timeRange.value));
  if (state.mode === 'animation') updateSpacingStatus();
  draw();
}

function stopPlayback() {
  state.playing = false;
  state.testInProgress = false;
  previousTime = 0;
  cancelAnimationFrame(animationFrame);
  playIcon.textContent = 'Putar';
  playButton.setAttribute('aria-label', 'Putar preview');
}

function pausePlayback() {
  state.playing = false;
  previousTime = 0;
  cancelAnimationFrame(animationFrame);
  playIcon.textContent = 'Putar';
  playButton.setAttribute('aria-label', 'Lanjutkan preview');
}

function playbackUnavailableReason() {
  if (state.scenes.every(scene => scene.formation === 'free' || scene.formation === 'manual' && !scene.manualDrones?.length)) return 'Semua scene masih kosong. Tambahkan drone atau impor animasi dahulu.';
  return null;
}

function startTest() {
  const unavailable = playbackUnavailableReason();
  if (unavailable) { showToast(unavailable); return; }
  stopPlayback();
  state.testInProgress = true;
  state.playing = true;
  timeRange.value = '0';
  playIcon.textContent = 'Jeda';
  playButton.setAttribute('aria-label', 'Jeda test desain');
  updateTime();
  animationFrame = requestAnimationFrame(tick);
  showToast('Pratinjau animasi dimulai.');
}

function tick(timestamp) {
  if (!state.playing) return;
  const delta = previousTime ? Math.max(0, timestamp - previousTime) : 0;
  if (delta > 250 || typeof document !== 'undefined' && document.hidden) {
    pausePlayback();
    showToast('Pratinjau dijeda karena tab tidak aktif atau render tertunda. Tekan Putar untuk melanjutkan.');
    return;
  }
  previousTime = timestamp;
  const next = sceneStartTime(state.selectedScene) + state.time / 100 * selectedDuration() + delta / 1000;
  if (next >= totalDuration()) {
    updateTime(totalDuration());
    stopPlayback();
    showToast('Pratinjau selesai.');
    return;
  }
  updateTime(next);
  animationFrame = requestAnimationFrame(tick);
}

function togglePlayback() {
  const unavailable = playbackUnavailableReason();
  if (unavailable) { showToast(unavailable); return; }
  if (state.playing) {
    pausePlayback();
    return;
  }
  if (Number(timeRange.value) >= 100) {
    timeRange.value = '0';
    updateTime();
  }
  state.playing = true;
  state.testInProgress = true;
  previousTime = 0;
  playIcon.textContent = 'Jeda';
  playButton.setAttribute('aria-label', 'Jeda preview');
  animationFrame = requestAnimationFrame(tick);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.playing) pausePlayback();
});

qa('[data-formation]').forEach(button => button.addEventListener('click', () => selectFormation(button.dataset.formation)));

countInput.addEventListener('input', () => {
  state.droneCount = Number(countInput.value);
  countOutput.textContent = state.droneCount.toLocaleString('id-ID');
  updateRangeFill(countInput, state.droneCount, 50, 1000);
  if (state.mode === 'formation') {
    const visibleDrones = state.formation === 'free' ? 0 : state.droneCount;
    q('[data-dialog-drones]').textContent = `${visibleDrones.toLocaleString('id-ID')} drone`;
    q('[data-stage-drone-count]').textContent = visibleDrones.toLocaleString('id-ID');
  }
  markDirty();
  draw();
});

function updateColorScope() {
  const scene = state.scenes[state.selectedScene];
  const animated = scene?.formation === 'animation';
  q('[data-color-scope]').textContent = animated
    ? scene.colorOverride ? 'Warna kustom untuk semua drone di seluruh frame scene ini.' : 'Warna asli dari file. Mengubah palet menerapkan warna kustom ke seluruh frame scene ini.'
    : state.mode === 'manual'
      ? state.selectedDrones.size ? `Warna untuk ${state.selectedDrones.size} drone terpilih.` : 'Warna untuk semua drone pada scene aktif. Pilih drone untuk mewarnai sebagian.'
      : 'Warna untuk formasi pada scene aktif.';
  q('[data-restore-file-colors]').hidden = !animated || !scene.colorOverride;
}

function syncColorControls() {
  const palette = state.scenes[state.selectedScene]?.palette || state;
  const selected = state.mode === 'manual' && state.selectedDrones.size === 1 ? state.manualDrones[state.selectedDrone] : null;
  startColor.value = selected ? colorToHex(selected.color) : palette.startColor;
  endColor.value = selected ? colorToHex(selected.color) : palette.endColor;
  gradientToggle.checked = selected ? false : palette.gradient;
  endColor.disabled = !gradientToggle.checked;
  q('[data-color-start-label]').textContent = startColor.value.toUpperCase();
  q('[data-color-end-label]').textContent = endColor.value.toUpperCase();
  updateColorScope();
}

function updateColors() {
  state.startColor = startColor.value;
  state.endColor = endColor.value;
  state.gradient = gradientToggle.checked;
  endColor.disabled = !state.gradient;
  const scene = state.scenes[state.selectedScene];
  scene.palette = paletteSettings();
  if (scene.formation === 'manual') {
    const indices = state.selectedDrones.size ? selectionIndices() : state.manualDrones.map((_, index) => index);
    indices.forEach((index, order) => {
      state.manualDrones[index].color = mixColor(state.startColor, state.endColor, state.gradient ? order / Math.max(1, indices.length - 1) : 0);
    });
    scene.manualDrones = state.manualDrones;
    updateInspector();
  } else if (scene.formation === 'animation') scene.colorOverride = true;
  q('[data-color-start-label]').textContent = state.startColor.toUpperCase();
  q('[data-color-end-label]').textContent = state.endColor.toUpperCase();
  updateColorScope();
  markDirty();
  draw();
}

startColor.addEventListener('input', updateColors);
endColor.addEventListener('input', updateColors);
gradientToggle.addEventListener('change', updateColors);
q('[data-restore-file-colors]').addEventListener('click', () => {
  const scene = state.scenes[state.selectedScene];
  if (scene.formation !== 'animation' || !scene.colorOverride) return;
  delete scene.colorOverride;
  syncColorControls();
  markDirty();
  draw();
});
groundToggle.addEventListener('change', () => {
  state.groundVisible = groundToggle.checked;
  markDirty();
  draw();
});
markerSizeInput.addEventListener('input', () => {
  state.markerScale = Number(markerSizeInput.value) / 100;
  q('[data-marker-size-output]').textContent = `${markerSizeInput.value}%`;
  markDirty();
  draw();
});
workspaceWidthInput.addEventListener('change', () => {
  const width = Number(workspaceWidthInput.value);
  if (!Number.isFinite(width) || width < 5 || width > 200) {
    workspaceWidthInput.value = String(state.workspaceWidth);
    showToast('Lebar workspace harus antara 5 dan 200 meter.');
    return;
  }
  state.workspaceWidth = width;
  updateSpacingStatus();
  markDirty();
});
for (const [field, key, factor] of [[inspectorX, 'x', 100], [inspectorY, 'y', 100], [inspectorZ, 'z', 1]]) {
  field.addEventListener('change', () => {
    const drone = state.mode === 'manual' ? state.manualDrones[state.selectedDrone] : null;
    if (!drone) return;
    const value = Number(field.value);
    const min = key === 'z' ? -1_000_000 : 0;
    const max = key === 'z' ? 1_000_000 : 100;
    if (field.value === '' || !Number.isFinite(value) || value < min || value > max) {
      updateInspector();
      showToast(`Nilai ${key.toUpperCase()} harus antara ${min} dan ${max}.`);
      return;
    }
    const previous = drone[key];
    const bounds = state.scenes[state.selectedScene].bounds || null;
    const violationsBefore = analyzeSpacing(state.manualDrones, bounds).violations;
    drone[key] = value / factor;
    if (analyzeSpacing(state.manualDrones, bounds).violations > violationsBefore) {
      drone[key] = previous;
      updateInspector();
      showToast('Posisi ditolak: jarak ke drone terdekat harus maks 2 m.');
      return;
    }
    updateInspector();
    markDirty();
    draw();
  });
}
inspectorColor.addEventListener('input', () => {
  const drone = state.mode === 'manual' ? state.manualDrones[state.selectedDrone] : null;
  if (!drone) return;
  drone.color = inspectorColor.value;
  syncColorControls();
  markDirty();
  draw();
});
timeRange.addEventListener('input', updateTime);
playButton.addEventListener('click', togglePlayback);
runTestButton.addEventListener('click', startTest);

qa('[data-view]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.view === 'front') {
    state.camera.yaw = 0;
    state.camera.pitch = 0;
  } else if (state.view === 'front') {
    state.camera.yaw = DEFAULT_CAMERA.yaw;
    state.camera.pitch = DEFAULT_CAMERA.pitch;
  }
  setView(button.dataset.view);
}));

q('[data-orbit-tool]').addEventListener('click', event => {
  orbitToolActive = !orbitToolActive;
  if (orbitToolActive && state.movingReference) setReferenceMove(false);
  event.currentTarget.classList.toggle('active', orbitToolActive);
  event.currentTarget.setAttribute('aria-pressed', String(orbitToolActive));
  canvas.style.cursor = orbitToolActive ? 'grab' : '';
});

q('[data-reset-camera]').addEventListener('click', () => {
  Object.assign(state.camera, DEFAULT_CAMERA);
  setView('perspective');
});

q('[data-fullscreen]').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await stage.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    showToast('Mode layar penuh tidak tersedia di browser ini.');
  }
});

function activateScene(index) {
  const scene = state.scenes[index];
  if (!scene) return;
  const previousScene = state.scenes[state.selectedScene];
  if (previousScene?.formation === 'manual') previousScene.manualDrones = state.manualDrones;
  if (index !== state.selectedScene) {
    state.selectedReference = -1;
    state.movingReference = false;
    state.referenceDrag = null;
    referenceMoveButton.setAttribute('aria-pressed', 'false');
    referenceMoveButton.textContent = 'Geser di kanvas';
    canvas.style.cursor = orbitToolActive ? 'grab' : '';
    referenceImages.clear();
  }
  state.selectedScene = index;
  scene.palette ||= paletteSettings();
  Object.assign(state, scene.palette);
  updateReferencePanel();
  state.manualDrones = scene.manualDrones || [];
  state.selectedDrone = -1;
  state.selectedDrones.clear();
  state.selectionBox = null;
  updateSelectionStatus();
  qa('[data-scene]').forEach(button => {
    const active = Number(button.dataset.scene) === index;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (scene.formation === 'manual') enterManualMode(scene.name);
  else if (scene.formation === 'animation') {
    state.mode = 'animation';
    state.formation = 'animation';
    canvasHint.hidden = true;
    qa('[data-formation]').forEach(button => {
      button.classList.remove('active');
      button.setAttribute('aria-pressed', 'false');
    });
    updatePlacedCount();
  } else selectFormation(scene.formation, false);
  sceneName.textContent = `Scene ${String(index + 1).padStart(2, '0')} — ${scene.name}`;
  updateMotionOrigin(scene);
  updatePlacedCount();
  syncColorControls();
}

function chooseScene(index) {
  if (!state.scenes[index]) return;
  stopPlayback();
  state.time = 0;
  activateScene(index);
  updateTime(sceneStartTime(index));
}

sceneTrack.addEventListener('click', event => {
  const button = event.target.closest('[data-scene]');
  if (button) chooseScene(Number(button.dataset.scene));
});

function createSceneCard(scene, index) {
  const button = document.createElement('button');
  button.className = 'scene-card';
  button.type = 'button';
  button.dataset.scene = String(index);
  button.setAttribute('aria-pressed', 'false');
  const sceneIndex = document.createElement('span');
  sceneIndex.className = 'scene-index';
  sceneIndex.textContent = String(index + 1).padStart(2, '0');
  const content = document.createElement('span');
  const name = document.createElement('strong');
  name.textContent = scene.name;
  const duration = document.createElement('small');
  duration.textContent = `${displaySeconds(scene.duration)} detik`;
  content.append(name, duration);
  button.append(sceneIndex, content);
  return button;
}

function updateSceneSummary() {
  q('[data-dialog-scenes]').textContent = `${state.scenes.length} scene`;
  q('[data-dialog-duration]').textContent = `${displaySeconds(totalDuration())} detik`;
  q('[data-duration]').textContent = formatPlaybackTime(totalDuration());
  q('[data-stage-scenes]').textContent = String(state.scenes.length).padStart(2, '0');
  q('[data-stage-duration]').textContent = `${displaySeconds(totalDuration())}s`;
  currentTime.textContent = formatPlaybackTime(totalDuration() * Number(timeRange.value) / 100);
}

q('[data-add-scene]').addEventListener('click', () => {
  if (state.scenes.length >= MAX_SCENES) {
    showToast('Maksimal 20 scene.');
    return;
  }
  const index = state.scenes.length;
  state.scenes.push({ name: 'Scene baru', formation: 'free', duration: 4 });
  sceneTrack.append(createSceneCard(state.scenes[index], index));
  updateSceneSummary();
  chooseScene(index);
  markDirty();
  showToast('Scene baru ditambahkan.');
});

q('[data-reset]').addEventListener('click', () => {
  if (state.mode === 'animation' && !window.confirm('Atur ulang akan mengganti animasi pada scene ini. Lanjutkan?')) return;
  if (state.mode === 'manual' && state.manualDrones.length && !window.confirm('Atur ulang akan menghapus drone manual pada scene ini. Lanjutkan?')) return;
  state.manualDrones = [];
  state.scenes[state.selectedScene].manualDrones = [];
  state.selectedDrone = -1;
  state.selectedDrones.clear();
  state.selectionBox = null;
  updateSelectionStatus();
  countInput.value = '300';
  startColor.value = '#b9f43c';
  endColor.value = '#52c7ff';
  gradientToggle.checked = true;
  countInput.dispatchEvent(new Event('input'));
  updateColors();
  updatePlacedCount();
  selectFormation('orbit', true, true);
  showToast('Workspace dikembalikan ke pengaturan awal.');
});

function projectSnapshot() {
  if (state.mode === 'manual') state.scenes[state.selectedScene].manualDrones = state.manualDrones;
  return {
    format: 'skyfy-studio-project',
    version: 1,
    name: projectName.value.trim() || 'Proyek Skyfy',
    droneCount: state.droneCount,
    gradient: state.gradient,
    startColor: state.startColor,
    endColor: state.endColor,
    groundVisible: state.groundVisible,
    markerStyle: 'point',
    markerScale: state.markerScale,
    workspaceWidth: state.workspaceWidth,
    scenes: state.scenes.map(scene => ({
      name: scene.name,
      formation: scene.formation,
      duration: scene.duration,
      palette: paletteSettings(scene.palette || state),
      ...(scene.formation === 'animation' && scene.colorOverride ? { colorOverride: true } : {}),
      ...(scene.references?.length ? { references: scene.references.map(reference => ({ ...reference })) } : {}),
      ...(scene.formation === 'manual' ? { manualDrones: scene.manualDrones || [], ...(scene.bounds ? { bounds: scene.bounds } : {}) } : {}),
      ...(scene.formation === 'animation' ? { frames: scene.frames, bounds: scene.bounds } : {})
    }))
  };
}

function validateProject(data) {
  if (!data || data.format !== 'skyfy-studio-project' || data.version !== 1) throw new Error('Format proyek Skyfy tidak dikenal.');
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 48) throw new Error('Nama proyek tidak valid.');
  if (!Number.isInteger(data.droneCount) || data.droneCount < 50 || data.droneCount > 1000) throw new Error('Jumlah drone tidak valid.');
  if (typeof data.gradient !== 'boolean') throw new Error('Pengaturan gradasi tidak valid.');
  if (![data.startColor, data.endColor].every(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color))) throw new Error('Warna proyek tidak valid.');
  if (data.groundVisible !== undefined && typeof data.groundVisible !== 'boolean') throw new Error('Pengaturan ground tidak valid.');
  if (data.markerStyle !== undefined && !['model', 'point'].includes(data.markerStyle)) throw new Error('Tampilan drone tidak valid.');
  if (data.markerScale !== undefined && (!Number.isFinite(data.markerScale) || data.markerScale < .7 || data.markerScale > 1.8)) throw new Error('Ukuran tampilan tidak valid.');
  if (data.workspaceWidth !== undefined && (!Number.isFinite(data.workspaceWidth) || data.workspaceWidth < 5 || data.workspaceWidth > 200)) throw new Error('Lebar workspace tidak valid.');
  if (!Array.isArray(data.scenes) || !data.scenes.length || data.scenes.length > MAX_SCENES) throw new Error('Jumlah scene tidak valid.');
  let referenceTotalLength = 0;
  const scenes = data.scenes.map((scene, index) => {
    if (!scene || typeof scene.name !== 'string' || !scene.name.trim() || scene.name.length > 80) throw new Error(`Nama scene ${index + 1} tidak valid.`);
    if (!['orbit', 'wave', 'mark', 'free', 'manual', 'animation'].includes(scene.formation)) throw new Error(`Formasi scene ${index + 1} tidak valid.`);
    if (!Number.isFinite(scene.duration) || scene.duration <= 0 || scene.duration > 120) throw new Error(`Durasi scene ${index + 1} tidak valid.`);
    const palette = scene.palette === undefined ? data : scene.palette;
    if (!palette || typeof palette !== 'object' || Array.isArray(palette) || typeof palette.gradient !== 'boolean' ||
        ![palette.startColor, palette.endColor].every(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color))) throw new Error(`Palet scene ${index + 1} tidak valid.`);
    if (scene.colorOverride !== undefined && (typeof scene.colorOverride !== 'boolean' || scene.formation !== 'animation')) throw new Error(`Pengaturan warna animasi scene ${index + 1} tidak valid.`);
    const savedAppearance = { palette: { startColor: palette.startColor, endColor: palette.endColor, gradient: palette.gradient }, ...(scene.colorOverride ? { colorOverride: true } : {}) };
    if (scene.references !== undefined && (!Array.isArray(scene.references) || scene.references.length > MAX_REFERENCES_PER_SCENE)) throw new Error(`Jumlah gambar referensi scene ${index + 1} tidak valid.`);
    const references = (scene.references || []).map(reference => {
      if (!reference || typeof reference !== 'object' || Array.isArray(reference) ||
          typeof reference.name !== 'string' || !reference.name.trim() || reference.name.length > 80 ||
          typeof reference.data !== 'string' || reference.data.length > MAX_REFERENCE_DATA_LENGTH ||
          !/^data:image\/webp;base64,[A-Za-z0-9+/]+={0,2}$/.test(reference.data) ||
          typeof reference.visible !== 'boolean' ||
          !Number.isFinite(reference.opacity) || reference.opacity < .1 || reference.opacity > 1 ||
          !Number.isFinite(reference.scale) || reference.scale < .25 || reference.scale > 2 ||
          !Number.isFinite(reference.x) || reference.x < 0 || reference.x > 1 ||
          !Number.isFinite(reference.y) || reference.y < 0 || reference.y > 1) {
        throw new Error(`Gambar referensi scene ${index + 1} tidak valid.`);
      }
      referenceTotalLength += reference.data.length;
      if (referenceTotalLength > MAX_REFERENCE_TOTAL_LENGTH) throw new Error('Total gambar referensi proyek melebihi 8 MB.');
      return { name: reference.name, data: reference.data, visible: reference.visible, opacity: reference.opacity, scale: reference.scale, x: reference.x, y: reference.y };
    });
    const savedReferences = references.length ? { references } : {};
    const bounds = scene.bounds;
    if (bounds !== undefined && (!bounds || !['xMin', 'xMax', 'yMin', 'yMax'].every(key => Number.isFinite(bounds[key]) && Math.abs(bounds[key]) <= 1_000_000) || bounds.xMin > bounds.xMax || bounds.yMin > bounds.yMax || ![undefined, 'static', 'animation'].includes(bounds.projection))) throw new Error(`Batas koordinat scene ${index + 1} tidak valid.`);
    const safeBounds = bounds ? { xMin: bounds.xMin, xMax: bounds.xMax, yMin: bounds.yMin, yMax: bounds.yMax, projection: bounds.projection || (scene.formation === 'manual' ? 'static' : 'animation') } : null;
    if (scene.formation === 'animation') {
      if (!Array.isArray(scene.frames) || scene.frames.length < 2 || scene.frames.length > MAX_ANIMATION_FRAMES) throw new Error(`Frame scene ${index + 1} tidak valid.`);
      let previousTime = -Infinity;
      let droneCount = 0;
      const frames = scene.frames.map((frame, frameIndex) => {
        if (!frame || !Number.isFinite(frame.time) || frame.time < 0 || frame.time <= previousTime || frame.time > scene.duration) throw new Error(`Timestamp frame ${frameIndex + 1} tidak valid.`);
        previousTime = frame.time;
        if (!Array.isArray(frame.drones) || !frame.drones.length || frame.drones.length > MAX_MANUAL_DRONES || frameIndex && frame.drones.length !== droneCount) throw new Error(`Drone frame ${frameIndex + 1} tidak valid.`);
        droneCount = frame.drones.length;
        const drones = frame.drones.map(drone => {
          if (!drone || typeof drone !== 'object' || Array.isArray(drone) ||
              !Number.isFinite(drone.x) || drone.x < 0 || drone.x > 1 ||
              !Number.isFinite(drone.y) || drone.y < 0 || drone.y > 1 ||
              !Number.isFinite(drone.z) || Math.abs(drone.z) > 1_000_000 ||
              typeof drone.color !== 'string' ||
              !(/^#[0-9a-f]{6}$/i.test(drone.color) || /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(drone.color) && drone.color.match(/\d+/g).every(value => Number(value) <= 255))) {
            throw new Error(`Koordinat atau warna frame ${frameIndex + 1} tidak valid.`);
          }
          return { x: drone.x, y: drone.y, z: drone.z, color: drone.color };
        });
        return { time: frame.time, drones };
      });
      if (frames[0].time !== 0 || Math.abs(frames[frames.length - 1].time - scene.duration) > .001 || frames.length * droneCount > MAX_ANIMATION_ROWS) throw new Error(`Durasi atau ukuran animasi scene ${index + 1} tidak valid.`);
      return { name: scene.name, formation: 'animation', duration: scene.duration, frames, ...savedAppearance, ...savedReferences, ...(safeBounds ? { bounds: safeBounds } : {}) };
    }
    if (scene.formation !== 'manual') return { name: scene.name, formation: scene.formation, duration: scene.duration, ...savedAppearance, ...savedReferences };
    if (!Array.isArray(scene.manualDrones) || scene.manualDrones.length > MAX_MANUAL_DRONES) throw new Error(`Drone scene ${index + 1} tidak valid.`);
    const manualDrones = scene.manualDrones.map(drone => {
      if (!drone || typeof drone !== 'object' || Array.isArray(drone) ||
          !Number.isFinite(drone.x) || drone.x < 0 || drone.x > 1 ||
          !Number.isFinite(drone.y) || drone.y < 0 || drone.y > 1 ||
          !Number.isFinite(drone.z) || Math.abs(drone.z) > 1_000_000 ||
          typeof drone.color !== 'string' ||
          !(/^#[0-9a-f]{6}$/i.test(drone.color) || /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.test(drone.color) && drone.color.match(/\d+/g).every(value => Number(value) <= 255))) {
        throw new Error(`Koordinat atau warna drone scene ${index + 1} tidak valid.`);
      }
      return { x: drone.x, y: drone.y, z: drone.z, color: drone.color };
    });
    return { name: scene.name, formation: 'manual', duration: scene.duration, manualDrones, ...savedAppearance, ...savedReferences, ...(safeBounds ? { bounds: safeBounds } : {}) };
  });
  return { name: data.name, droneCount: data.droneCount, gradient: data.gradient, startColor: data.startColor, endColor: data.endColor, groundVisible: data.groundVisible ?? true, markerStyle: 'point', markerScale: data.markerScale ?? 1, workspaceWidth: data.workspaceWidth ?? 40, scenes };
}

function projectFilename(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'skyfy-project'}.skyfy.json`;
}

function downloadProject(data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  if (blob.size > MAX_PROJECT_FILE_BYTES) throw new Error('File proyek melebihi 20 MB. Kurangi gambar referensi atau frame animasi.');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = projectFilename(data.name);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  hasUnsavedChanges = false;
  saveState.textContent = 'File proyek diunduh';
  return link.download;
}

q('[data-save]').addEventListener('click', () => {
  if (!aiPreview.hidden) {
    showToast('Pratinjau AI tidak dapat disimpan. Tutup pratinjau untuk menyimpan proyek manual.');
    return;
  }
  try {
    downloadProject(projectSnapshot());
    showToast('File proyek diunduh. Simpan di tempat yang aman.');
  } catch (error) {
    showToast(error.message);
  }
});

q('[data-open-project]').addEventListener('click', () => {
  if (hasUnsavedChanges && !window.confirm('Perubahan yang belum disimpan akan hilang. Buka proyek lain?')) return;
  projectFile.click();
});
projectFile.addEventListener('change', async () => {
  const file = projectFile.files[0];
  if (!file) return;
  try {
    if (file.size > MAX_PROJECT_FILE_BYTES) throw new Error('Maksimal ukuran file proyek 20 MB.');
    const project = validateProject(JSON.parse(await file.text()));
    cancelAnimationFrame(animationFrame);
    state.playing = false;
    state.testInProgress = false;
    playIcon.textContent = 'Putar';
    playButton.setAttribute('aria-label', 'Putar preview');
    projectName.value = project.name;
    state.droneCount = project.droneCount;
    state.gradient = project.gradient;
    state.startColor = project.startColor;
    state.endColor = project.endColor;
    state.groundVisible = project.groundVisible;
    state.markerScale = project.markerScale;
    state.workspaceWidth = project.workspaceWidth;
    state.scenes = project.scenes;
    state.selectedScene = -1;
    state.manualDrones = [];
    state.selectedDrones.clear();
    state.selectionBox = null;
    state.clipboardDrones = [];
    updateSelectionStatus();
    countInput.value = String(state.droneCount);
    countOutput.textContent = state.droneCount.toLocaleString('id-ID');
    updateRangeFill(countInput, state.droneCount, 50, 1000);
    gradientToggle.checked = state.gradient;
    groundToggle.checked = state.groundVisible;
    markerSizeInput.value = String(Math.round(state.markerScale * 100));
    workspaceWidthInput.value = String(state.workspaceWidth);
    q('[data-marker-size-output]').textContent = `${markerSizeInput.value}%`;
    startColor.value = state.startColor;
    endColor.value = state.endColor;
    q('[data-color-start-label]').textContent = state.startColor.toUpperCase();
    q('[data-color-end-label]').textContent = state.endColor.toUpperCase();
    sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
    updateSceneSummary();
    chooseScene(0);
    hasUnsavedChanges = false;
    saveState.textContent = 'Proyek dibuka dari file';
    showToast('Proyek berhasil dibuka.');
  } catch (error) {
    showToast(`Proyek tidak dapat dibuka: ${error.message}`);
  } finally {
    projectFile.value = '';
  }
});

function sceneDescription(scene, index, project) {
  const labels = { orbit: 'Orbit', wave: 'Wave', mark: 'Sky mark', free: 'Kosong', manual: 'Desain manual', animation: 'Animasi Blender/CSV' };
  const drones = scene.formation === 'animation' ? scene.frames[0].drones.length
    : scene.formation === 'manual' ? scene.manualDrones.length
      : scene.formation === 'free' ? 0 : project.droneCount;
  const details = scene.formation === 'animation' ? `, ${scene.frames.length} frame bertimestamp`
    : scene.formation === 'manual' ? `, ${new Set(scene.manualDrones.map(drone => drone.color.toLowerCase())).size} warna titik`
      : '';
  const referenceDetails = scene.references?.length ? `, ${scene.references.length} gambar referensi` : '';
  return `${index + 1}. ${scene.name} — ${labels[scene.formation]}, ${drones} drone, ${displaySeconds(scene.duration)} detik${details}${referenceDetails}`;
}

function consultationMessage(project, filename) {
  const total = project.scenes.reduce((sum, scene) => sum + scene.duration, 0);
  return [
    'Halo tim Skyfy, saya ingin konsultasi desain drone show yang saya buat di Skyfy Studio.',
    '',
    `Nama proyek: ${project.name}`,
    `Jumlah scene: ${project.scenes.length}`,
    `Total durasi visual: ${displaySeconds(total)} detik`,
    `Jumlah drone acuan: ${project.droneCount}`,
    `Warna utama: ${project.startColor.toUpperCase()} → ${project.endColor.toUpperCase()}${project.gradient ? ' (gradasi)' : ''}`,
    `Lebar workspace: ${project.workspaceWidth} m`,
    '',
    'Urutan desain:',
    ...project.scenes.map((scene, index) => sceneDescription(scene, index, project)),
    '',
    `File desain lengkap (koordinat, warna, dan frame animasi): ${filename}`,
    'Saya akan melampirkan file proyek ini di chat. Mohon tinjau seluruh scene, gerakan, kebutuhan drone, dan kelayakan pelaksanaannya.',
    '',
    'Detail acara — tanggal, lokasi, tujuan, dan pesan visual: [silakan lengkapi]'
  ].join('\n');
}

function whatsappConsultationUrl(message) {
  return `https://wa.me/${SKYFY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openConsultation(event) {
  const aiConcept = !aiPreview.hidden;
  const project = aiConcept ? null : projectSnapshot();
  let filename = '';
  try {
    if (project) filename = downloadProject(project);
  } catch (error) {
    event.preventDefault();
    showToast(error.message);
    return;
  }
  const message = project ? consultationMessage(project, filename)
    : `Halo tim Skyfy, saya ingin konsultasi ide drone show.\n\nNama proyek: ${projectName.value.trim() || 'Proyek Skyfy'}\nIde: ${aiPreviewPrompt}\n\nDetail acara: [silakan lengkapi]`;
  const url = whatsappConsultationUrl(message);
  const link = event.currentTarget;
  if (link.tagName === 'A') link.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
  q('[data-submit-consult]').href = url;
  q('[data-consult-copy]').hidden = aiConcept;
  q('[data-consult-ai-copy]').hidden = !aiConcept;
  q('[data-consult-filename]').textContent = filename;
  q('[data-consult-download]').hidden = aiConcept;
  q('[data-dialog-drones]').textContent = project ? `${project.scenes[state.selectedScene].formation === 'manual' ? project.scenes[state.selectedScene].manualDrones.length : project.scenes[state.selectedScene].formation === 'animation' ? project.scenes[state.selectedScene].frames[0].drones.length : project.scenes[state.selectedScene].formation === 'free' ? 0 : project.droneCount} drone` : 'Konsep AI';
  q('[data-dialog-scenes]').textContent = project ? `${project.scenes.length} scene` : 'Pratinjau visual';
  q('[data-dialog-duration]').textContent = project ? `${displaySeconds(project.scenes.reduce((sum, scene) => sum + scene.duration, 0))} detik` : 'Tanpa file proyek';
  showToast(project ? 'File desain diunduh. Lampirkan di chat WhatsApp sebelum mengirim.' : 'WhatsApp Skyfy dibuka untuk konsultasi konsep.');
  setTimeout(() => { if (!consultDialog.open) consultDialog.showModal(); }, 0);
}

projectName.addEventListener('input', markDirty);
qa('[data-consult]').forEach(button => button.addEventListener('click', openConsultation));
q('[data-close-consult]').addEventListener('click', () => consultDialog.close());
q('[data-consult-download]').addEventListener('click', () => {
  if (!aiPreview.hidden) return;
  try {
    const filename = downloadProject(projectSnapshot());
    q('[data-consult-filename]').textContent = filename;
    showToast('File desain diunduh. Lampirkan di chat WhatsApp.');
  } catch (error) {
    showToast(error.message);
  }
});

function setAiPreview(image, prompt) {
  aiImage.src = image;
  aiPreviewPrompt = prompt;
  aiPreview.hidden = false;
  stage.classList.add('showing-ai');
  canvas.inert = true;
  projectName.disabled = true;
  q('[data-open-project]').disabled = true;
  qa('.control-panel > .control-section:not(.ai-section), .scene-panel, .playback-panel, .view-actions, .workspace-toolbar').forEach(element => { element.inert = true; });
  q('[data-save]').disabled = true;
  q('[data-save]').title = 'Pratinjau AI tidak dapat disimpan sebagai proyek';
  saveState.textContent = 'Konsep AI · tidak dapat disimpan';
}

function closeAiPreview() {
  aiRequestController?.abort();
  aiRequestController = null;
  aiPreview.hidden = true;
  stage.classList.remove('showing-ai');
  canvas.inert = false;
  projectName.disabled = false;
  q('[data-open-project]').disabled = false;
  qa('.control-panel > .control-section:not(.ai-section), .scene-panel, .playback-panel, .view-actions, .workspace-toolbar').forEach(element => { element.inert = false; });
  aiImage.removeAttribute('src');
  aiPreviewPrompt = '';
  q('[data-save]').disabled = false;
  q('[data-save]').removeAttribute('title');
  saveState.textContent = hasUnsavedChanges ? 'Perubahan belum disimpan' : 'Proyek manual siap disimpan';
}

q('[data-ai-close]').addEventListener('click', closeAiPreview);
q('[data-ai-consult]').addEventListener('click', openConsultation);

async function checkAiService() {
  try {
    const response = await fetch('/api/ai-status', { cache: 'no-store' });
    if (!response.ok) throw new Error('Layanan AI belum tersedia di hosting ini.');
    const data = await response.json().catch(() => null);
    if (!data || typeof data.available !== 'boolean') throw new Error('Layanan AI belum tersedia di hosting ini.');
    if (!data.available) throw new Error('Layanan AI belum dikonfigurasi oleh Skyfy.');
    aiGenerateButton.disabled = false;
    aiStatus.textContent = 'Layanan AI siap. Prompt Anda diproses oleh server Skyfy.';
  } catch (error) {
    aiStatus.textContent = error.message || 'Layanan AI belum tersedia.';
  }
}

aiForm.addEventListener('submit', async event => {
  event.preventDefault();
  const prompt = aiPromptInput.value.trim();
  if (prompt.length < 10 || prompt.length > 500) {
    aiStatus.textContent = 'Tulis ide desain sepanjang 10–500 karakter.';
    return;
  }
  aiRequestController?.abort();
  const controller = new AbortController();
  aiRequestController = controller;
  aiGenerateButton.disabled = true;
  aiStatus.textContent = 'Sedang membuat gambar konsep. Ini bisa memerlukan beberapa saat…';
  try {
    const response = await fetch('/api/ai-preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Gambar konsep belum berhasil dibuat.');
    if (typeof data.image !== 'string' || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data.image)) throw new Error('Respons gambar AI tidak valid.');
    if (aiRequestController !== controller) return;
    setAiPreview(data.image, prompt);
    aiStatus.textContent = 'Pratinjau AI siap. Konsultasikan hasilnya dengan tim Skyfy.';
  } catch (error) {
    if (error.name !== 'AbortError') aiStatus.textContent = error.message || 'Gambar konsep belum berhasil dibuat.';
  } finally {
    if (aiRequestController === controller) {
      aiRequestController = null;
      aiGenerateButton.disabled = false;
    }
  }
});
// AI concept generation is paused. Keep its controls unavailable until it is enabled again.

let featurePinned = false;
let featureHovered = false;

function updateFeatureDock() {
  const open = featurePinned || featureHovered || featureDock.contains(document.activeElement);
  featureDock.classList.toggle('is-open', open);
  featurePanel.inert = !open;
  featureToggle.setAttribute('aria-expanded', String(open));
  featureToggle.setAttribute('aria-label', featurePinned ? 'Tutup panel fitur' : open ? 'Sematkan panel fitur' : 'Buka panel fitur');
}

featureDock.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover)').matches) return;
  featureHovered = true;
  updateFeatureDock();
});
featureDock.addEventListener('pointerleave', () => {
  featureHovered = false;
  updateFeatureDock();
});
featureDock.addEventListener('focusin', updateFeatureDock);
featureDock.addEventListener('focusout', () => requestAnimationFrame(updateFeatureDock));
featureToggle.addEventListener('click', () => {
  featurePinned = !featurePinned;
  if (!featurePinned) featureToggle.blur();
  updateFeatureDock();
});
document.addEventListener('pointerdown', event => {
  if (!featurePinned || featureDock.contains(event.target)) return;
  featurePinned = false;
  requestAnimationFrame(updateFeatureDock);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || q('dialog[open]') || !featureDock.classList.contains('is-open')) return;
  featurePinned = false;
  featureHovered = false;
  canvas.focus({ preventScroll: true });
  updateFeatureDock();
});

function updateHeaderHeight() {
  document.documentElement.style.setProperty('--studio-header-height', `${studioHeader.getBoundingClientRect().height}px`);
}

window.addEventListener('resize', () => { updateHeaderHeight(); resizeCanvas(); });
if ('ResizeObserver' in window) {
  new ResizeObserver(resizeCanvas).observe(stage);
  new ResizeObserver(updateHeaderHeight).observe(studioHeader);
}
document.addEventListener('fullscreenchange', resizeCanvas);
updateHeaderHeight();
updateFeatureDock();
updateReferencePanel();
syncColorControls();
updateRangeFill(countInput, state.droneCount, 50, 1000);
updateSceneSummary();
updatePlacedCount();
updateTime();
resizeCanvas();
