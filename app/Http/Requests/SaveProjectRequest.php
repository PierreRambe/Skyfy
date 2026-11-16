<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SaveProjectRequest extends FormRequest
{
    private const MAX_DATA_BYTES = 16_777_216; // 16 MB
    private const MAX_SCENES = 50;
    private const MAX_REFERENCES_PER_SCENE = 5;
    private const MAX_REFERENCE_DATA_LENGTH = 1_000_000;
    private const ALLOWED_FORMATIONS = [
        'orbit', 'wave', 'mark', 'heart', 'star', 'spiral', 'burst', 'path', 'free', 'manual', 'animation',
    ];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Project|null $project */
        $project = $this->route('project');

        if ($project instanceof Project) {
            return $this->user()?->can('update', $project) ?? false;
        }

        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isCreate = $this->isMethod('POST');

        return [
            'name' => [$isCreate ? 'required' : 'sometimes', 'required', 'string', 'max:100'],
            'drone_count' => ['nullable', 'integer', 'min:1', 'max:2000'],
            'scenes_count' => ['nullable', 'integer', 'min:1', 'max:' . self::MAX_SCENES],
            'duration' => ['nullable', 'integer', 'min:1', 'max:600'],
            'data' => [$isCreate ? 'required' : 'sometimes', 'required', 'array'],
        ];
    }

    /**
     * Validate structural integrity and size limits of the project payload.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            if ($validator->errors()->has('data') || ! $this->has('data')) {
                return;
            }

            $data = $this->input('data');
            if (! is_array($data)) {
                return;
            }

            $encoded = json_encode($data, JSON_UNESCAPED_UNICODE);
            if ($encoded === false || strlen($encoded) > self::MAX_DATA_BYTES) {
                $validator->errors()->add('data', 'Ukuran data proyek melebihi batas maksimal 16 MB.');
                return;
            }

            if (($data['format'] ?? null) !== 'skyfy-studio-project' || ($data['version'] ?? null) !== 1) {
                $validator->errors()->add('data', 'Format proyek Skyfy tidak valid.');
                return;
            }

            $scenes = $data['scenes'] ?? null;
            if (! is_array($scenes) || count($scenes) < 1 || count($scenes) > self::MAX_SCENES) {
                $validator->errors()->add('data', 'Daftar scene proyek tidak valid.');
                return;
            }

            foreach ($scenes as $index => $scene) {
                if (! is_array($scene) || ! in_array($scene['formation'] ?? null, self::ALLOWED_FORMATIONS, true)) {
                    $validator->errors()->add('data', 'Formasi scene ke-' . ($index + 1) . ' tidak valid.');
                    return;
                }

                if (isset($scene['references'])) {
                    if (! is_array($scene['references']) || count($scene['references']) > self::MAX_REFERENCES_PER_SCENE) {
                        $validator->errors()->add('data', 'Gambar referensi scene ke-' . ($index + 1) . ' melebihi batas.');
                        return;
                    }

                    foreach ($scene['references'] as $ref) {
                        $refData = is_array($ref) ? ($ref['data'] ?? null) : null;
                        if (
                            ! is_string($refData) ||
                            strlen($refData) > self::MAX_REFERENCE_DATA_LENGTH ||
                            ! preg_match('/^data:image\/webp;base64,[A-Za-z0-9+\/]+={0,2}$/', $refData)
                        ) {
                            $validator->errors()->add('data', 'Format gambar referensi harus WebP base64 yang valid.');
                            return;
                        }
                    }
                }
            }
        });
    }
}
