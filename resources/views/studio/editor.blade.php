@php
  $isProjectOwner = isset($project) && $project && $project->exists && auth()->check() && (int) $project->user_id === (int) auth()->id();
@endphp
<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#f5f6f2" />
  <meta name="description" content="Skyfy Drone Studio untuk merancang, menyimpan, dan membagikan konsep pertunjukan drone." />
  <meta name="csrf-token" content="{{ csrf_token() }}" />
  <meta name="project-id" content="{{ $isProjectOwner ? $project->id : '' }}" />
  <meta name="user-logged-in" content="{{ auth()->check() ? 'true' : 'false' }}" />
  <title>{{ isset($project) && $project ? $project->name . ' · Skyfy Studio' : 'Skyfy | Studio Pertunjukan Drone' }}</title>
  <link rel="icon" type="image/svg+xml" href="{{ asset('assets/skyfy-favicon.svg') }}" />
  <script src="{{ asset('assets/studio/studio-theme.js') }}"></script>
  <link rel="stylesheet" href="{{ asset('assets/studio/studio.css') }}" />
  @if(isset($project) && $project)
  <script>
    window.__INITIAL_PROJECT__ = @json($project->data);
    window.__PROJECT_ID__ = {{ $isProjectOwner ? (int) $project->id : 'null' }};
    window.__PROJECT_NAME__ = @json($project->name);
  </script>
  @endif
  <script src="{{ asset('assets/studio/studio.js') }}" defer></script>
</head>
<body>
  <a class="skip-link" href="#studio-main">Lewati ke editor</a>
  <header class="studio-header">
    <div style="display:flex; align-items:center; gap:0.75rem;">
      <a class="studio-wordmark" href="https://skyfy.id/" aria-label="Kembali ke website Skyfy">SKYFY<span>.</span></a>
      @auth
        <a href="{{ route('dashboard') }}" class="text-button" style="text-decoration:none; font-size:0.82rem; padding:0.35rem 0.65rem;" title="Kembali ke Dashboard Saya">← Dashboard</a>
      @endauth
    </div>
    <div class="project-identity">
      <div class="project-copy">
        <label for="project-name">Nama proyek</label>
        <input id="project-name" value="{{ $project->name ?? 'Konsep Langit 01' }}" maxlength="48" data-project-name />
      </div>
    </div>
    <div class="header-actions">
      <p class="save-state" role="status" data-save-state>Belum disimpan</p>
      <button class="theme-button" type="button" data-theme-toggle aria-label="Aktifkan mode gelap"><span data-theme-label>Mode gelap</span></button>
      <input class="visually-hidden" type="file" accept=".json,application/json" data-project-file aria-label="Pilih file proyek Skyfy" tabindex="-1" />
      @auth
        <button class="text-button" type="button" data-save style="background: rgba(99, 102, 241, 0.15); border-color: rgba(99, 102, 241, 0.4); color: #818cf8; font-weight:600;">☁ Simpan ke Akun</button>
      @else
        <button class="text-button" type="button" data-save>Simpan proyek (.json)</button>
        <a class="text-button" href="{{ route('login') }}" style="text-decoration:none;">Masuk</a>
      @endauth
      <button class="text-button" type="button" data-export-abc title="Unduh animasi posisi drone sebagai Alembic .abc. Perlu server Studio dan Blender.">Unduh animasi (.abc)</button>
      <a class="primary-button compact" data-consult href="https://wa.me/6282199988399" target="_blank" rel="noopener noreferrer">Konsultasi desain</a>
    </div>
  </header>

  <main class="studio-shell" id="studio-main">
    <div class="feature-dock" data-feature-dock>
      <button type="button" class="feature-trigger" data-feature-toggle aria-controls="feature-panel" aria-expanded="false">Fitur</button>
    <aside class="control-panel" id="feature-panel" aria-label="Pengaturan desain" inert>
      <div class="panel-heading">
        <div><span class="eyebrow">Skyfy Studio</span><h1>Pengaturan desain</h1><a class="panel-site-link" href="https://skyfy.id/" target="_blank" rel="noopener noreferrer">Kunjungi website Skyfy ↗</a></div>
      </div>

      <section class="control-section catalog-section" aria-labelledby="catalog-title" data-client-catalog>
        <div class="section-title-row"><h2 id="catalog-title">Katalog desain klien</h2><span data-sequence-badge>500 drone · Urutan unik</span></div>
        <p class="reference-help">5 formasi ikonik per tema (mengikuti referensi drone show global); tiap klien mendapat kombinasi &amp; urutan berbeda.</p>
        <div class="catalog-grid" role="group" aria-label="Pilih paket desain klien">
          <button class="catalog-card" type="button" data-client-preset="brand"><strong>Logo &amp; Brand Besar</strong><small>Perisai, Bola Dunia, Trofi, Roket &amp; Berlian</small></button>
          <button class="catalog-card" type="button" data-client-preset="wedding"><strong>Wedding &amp; Pernikahan</strong><small>Pengantin, Kotak Cincin, Kue, Dua Cincin &amp; Bersulang</small></button>
          <button class="catalog-card" type="button" data-client-preset="festival"><strong>Event Besar &amp; Festival</strong><small>Bianglala, Balon Udara, Lentera, Kembang Api &amp; Kado</small></button>
          <button class="catalog-card" type="button" data-client-preset="national"><strong>Event Nasional &amp; Konser</strong><small>Dua Bendera, Monas, Borobudur, Armillary &amp; Gitar</small></button>
          <button class="catalog-card" type="button" data-client-preset="christmas"><strong>Event Hari Raya &amp; Natal</strong><small>Pohon Natal, Wreath, Bola Kaca, Bola Hati &amp; Ornamen 3D</small></button>
          <button class="catalog-card" type="button" data-client-preset="custom"><strong>Buat Desain Sendiri</strong><small>Kanvas kustom + jiplak gambar/logo referensi</small></button>
        </div>
        <div class="catalog-footer-actions">
          <button class="reset-button" type="button" data-catalog-shuffle>Ganti kombinasi &amp; urutan scene</button>
          <button class="primary-button catalog-consult-button" type="button" data-consult data-catalog-consult>Pilih Desain Ini &amp; Hubungi Skyfy</button>
        </div>
      </section>

      <section class="control-section" aria-labelledby="drone-title">
        <div class="section-title-row"><h2 id="drone-title">Jumlah drone</h2><output class="number-output" for="drone-count" data-drone-output>500</output></div>
        <input class="range" id="drone-count" type="range" min="1" max="1000" step="1" value="500" data-drone-count aria-labelledby="drone-title" />
        <div class="range-labels"><span>1</span><span>1.000</span></div>
        <label class="count-exact">Jumlah tepat <input type="number" min="1" max="1000" step="1" value="500" data-drone-number aria-labelledby="drone-title" /></label>
      </section>

      <section class="control-section ai-section" aria-labelledby="ai-title" data-ai-section data-ai-locked="true" hidden>
        <div class="section-title-row"><h2 id="ai-title">Desain drone AI</h2><span class="ai-lock-badge" data-ai-lock-badge>🔒 Dikunci</span></div>
        <p class="reference-help ai-lock-note" data-ai-lock-note>Fitur AI dikunci sementara. Gunakan <strong>Katalog desain klien</strong> di atas atau <strong>Buat Desain Sendiri</strong>.</p>
        <div class="ai-lock-body" data-ai-lock-body inert>
          <div class="ai-conversation" data-ai-conversation role="log" aria-label="Riwayat desain" aria-live="polite" hidden></div>
          <form data-ai-form>
            <label for="ai-dimension">Bentuk desain</label>
            <select id="ai-dimension" data-ai-dimension><option value="2d">2D · tampak depan</option><option value="3d">3D · bentuk bervolume</option></select>
            <label for="ai-prompt">Arahan desain <span class="ai-optional">(opsional)</span></label>
            <div class="ai-composer">
              <textarea id="ai-prompt" data-ai-prompt maxlength="500" rows="3" placeholder="Contoh: logo perusahaan lalu kembang api 3D"></textarea>
              <div class="ai-composer-footer">
                <label class="ai-attach-label" for="ai-reference-file"><input id="ai-reference-file" type="file" accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime,.png,.jpg,.jpeg,.webp,.mp4,.webm,.mov" data-ai-reference-file /><span aria-hidden="true">＋</span> Lampirkan gambar / video</label>
                <small>Gambar ≤2 MB · Video ≤25 MB</small>
              </div>
            </div>
            <div class="ai-attachment" data-ai-attachment hidden><img data-ai-attachment-preview alt="Pratinjau gambar terlampir" /><span><strong data-ai-reference-label></strong><small>Acuan bentuk drone</small></span><button type="button" data-ai-reference-remove aria-label="Hapus gambar terlampir">×</button></div>
            <p class="ai-help" data-ai-context hidden></p>
            <div class="ai-form-actions"><button class="primary-button" type="submit" data-ai-generate disabled>Buat desain drone</button><button class="cancel-button" type="button" data-ai-cancel hidden>Batal</button><button type="button" data-ai-new hidden>Desain baru</button></div>
          </form>
          <p class="ai-help" data-ai-remaining hidden></p>
          <p class="ai-status" role="status" data-ai-status>Memeriksa layanan AI…</p>
          <p class="ai-status" data-ai-source-row hidden>Sumber gambar: <a data-ai-source-link target="_blank" rel="noopener noreferrer"></a></p>
          <button class="reset-button" type="button" data-recheck-services>Periksa layanan lagi</button>
        </div>
      </section>

      <section class="control-section" aria-labelledby="import-title">
        <div class="section-title-row"><h2 id="import-title">Impor desain</h2><span>CSV, JSON, atau ABC</span></div>
        <label class="workspace-field">Tujuan impor
          <select data-import-placement><option value="new">Desain baru — mulai 00:00</option><option value="append">Tambah scene ke proyek ini</option></select>
        </label>
        <p class="reference-help" role="status" data-alembic-status>Memeriksa layanan Alembic…</p>
        <label class="file-drop" for="design-file">
          <input id="design-file" type="file" accept=".csv,.json,.abc,application/json,text/csv,application/octet-stream" data-file-input />
          <span><strong>Buka desain atau animasi</strong><small data-file-label>CSV / JSON maks. 32 MB; ABC maks. 25 MB</small></span>
        </label>
      </section>

      <section class="control-section" aria-labelledby="reference-title">
        <div class="section-title-row"><h2 id="reference-title">Gambar referensi</h2><span data-reference-count>0 / 5 layer</span></div>
        <label class="file-drop" for="reference-file">
          <input id="reference-file" type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" multiple data-reference-input />
          <span><strong>Tambah gambar</strong><small>PNG, JPG, WebP · maks. 5 MB</small></span>
        </label>
        <div class="reference-list" data-reference-list aria-label="Layer gambar referensi"></div>
        <div class="reference-controls" data-reference-controls hidden>
          <label class="workspace-field">Transparansi <output data-reference-opacity-output>50%</output>
            <input type="range" min="10" max="100" step="5" value="50" data-reference-opacity />
          </label>
          <label class="workspace-field">Ukuran <output data-reference-scale-output>100%</output>
            <input type="range" min="25" max="200" step="5" value="100" data-reference-scale />
          </label>
          <div class="reference-actions"><button type="button" data-reference-move aria-pressed="false">Geser di kanvas</button><button type="button" data-reference-up>Naikkan layer</button><button type="button" data-reference-remove>Hapus</button></div>
        </div>
      </section>

      <section class="control-section drone-library" aria-labelledby="library-title">
        <div class="section-title-row"><h2 id="library-title">Tambahkan drone</h2><output data-placed-count>0 ditempatkan</output></div>
        <div class="drone-palette" aria-label="Elemen drone yang dapat ditarik">
          <button type="button" draggable="true" data-drone-template="single"><span><strong>Drone tunggal</strong><small>1 drone</small></span></button>
          <button type="button" draggable="true" data-drone-template="row"><span><strong>Baris</strong><small>8 drone</small></span></button>
          <button type="button" draggable="true" data-drone-template="grid"><span><strong>Grid</strong><small>25 drone</small></span></button>
          <button type="button" draggable="true" data-drone-template="ring"><span><strong>Lingkaran</strong><small>32 drone</small></span></button>
        </div>
        <div class="keyboard-hint"><span><kbd>Ctrl</kbd> + <kbd>A</kbd> pilih semua</span><span><kbd>Ctrl</kbd> + <kbd>C</kbd> salin</span><span><kbd>Ctrl</kbd> + <kbd>V</kbd> tempel</span><span><kbd>Del</kbd> hapus</span></div>
      </section>

      <section class="control-section" aria-labelledby="template-title">
        <div class="section-title-row"><h2 id="template-title">Formasi awal</h2><button class="reset-button" type="button" data-reset>Atur ulang</button></div>
        <div class="formation-grid" role="group" aria-label="Pilih formasi">
          <button class="formation-card active" type="button" data-formation="orbit" aria-pressed="true">Orbit</button>
          <button class="formation-card" type="button" data-formation="wave" aria-pressed="false">Gelombang</button>
          <button class="formation-card" type="button" data-formation="mark" aria-pressed="false">Sky mark</button>
          <button class="formation-card" type="button" data-formation="free" aria-pressed="false">Dari nol</button>
        </div>
      </section>

      <section class="control-section" aria-labelledby="color-title">
        <div class="section-title-row"><h2 id="color-title">Warna cahaya</h2><label class="toggle-label"><input type="checkbox" checked data-gradient-toggle /><span>Gradasi</span></label></div>
        <p class="reference-help" data-color-scope>Permainan warna 3D aktif. Pilih warna tema, gradasi, atau polos Blender.</p>
        <div class="color-controls">
          <label>Warna awal<span><input type="color" value="#b9f43c" data-color-start /><b data-color-start-label>#B9F43C</b></span></label>
          <label>Warna akhir<span><input type="color" value="#52c7ff" data-color-end /><b data-color-end-label>#52C7FF</b></span></label>
        </div>
        <div class="color-preset-row" role="group" aria-label="Pilihan warna cepat" data-color-presets>
          <button type="button" class="color-preset-btn active" data-color-preset="theme">Warna Tema</button>
          <button type="button" class="color-preset-btn" data-color-preset="blender">Polos (Blender)</button>
          <button type="button" class="color-preset-btn" data-color-preset="gold">Emas</button>
          <button type="button" class="color-preset-btn" data-color-preset="cyan">Biru</button>
          <button type="button" class="color-preset-btn" data-color-preset="red">Merah</button>
          <button type="button" class="color-preset-btn" data-color-preset="lime">Hijau</button>
        </div>
        <button class="reset-button" type="button" data-restore-file-colors hidden>Pulihkan warna dari file</button>
      </section>

      <section class="control-section" aria-labelledby="workspace-title">
        <div class="section-title-row"><h2 id="workspace-title">Workspace</h2></div>
        <label class="workspace-check"><input type="checkbox" checked data-ground-toggle />Tampilkan ground mesh</label>
        <label class="workspace-field">Ukuran tampilan <output data-marker-size-output>100%</output>
          <input type="range" min="70" max="180" step="10" value="100" data-marker-size />
        </label>
        <label class="workspace-field">Lebar area kerja (m)
          <input type="number" min="5" max="200" step="1" value="40" data-workspace-width />
        </label>
        <div class="drone-inspector" data-drone-inspector hidden>
          <strong data-inspector-title>Drone terpilih</strong>
          <div class="inspector-fields">
            <label>X (%)<input type="number" min="0" max="100" step="0.1" data-inspector-x /></label>
            <label>Y (%)<input type="number" min="0" max="100" step="0.1" data-inspector-y /></label>
            <label>Z<input type="number" min="-1000000" max="1000000" step="0.1" data-inspector-z /></label>
            <label>Warna<input type="color" data-inspector-color /></label>
          </div>
        </div>
        <p class="workspace-help" data-workspace-help>Pilih drone untuk mengubah posisi.</p>
        <details class="workspace-guide"><summary>Kontrol kanvas</summary><p>Mouse: Alt + seret memutar, Shift + seret menggeser, roda zoom.</p><p>Ponsel: 1 jari memutar, 2 jari menggeser/zoom.</p></details>
        <p class="workspace-help" data-spacing-status>Jarak ke drone terdekat: —</p>
      </section>

      <div class="scene-panel">
        <div class="scene-heading"><div><span class="eyebrow">Urutan</span><h2>Scene pertunjukan</h2></div><button class="add-scene" type="button" data-add-scene>Tambah scene</button></div>
        <div class="scene-order-bar" role="group" aria-label="Atur urutan scene" data-scene-order-bar>
          <button type="button" data-scene-move="-1" aria-label="Majukan urutan scene aktif">← Majukan</button>
          <button type="button" data-scene-move="1" aria-label="Mundurkan urutan scene aktif">Mundurkan →</button>
          <button type="button" data-scene-shuffle aria-label="Acak urutan scene">Acak urutan</button>
          <button type="button" data-scene-delete aria-label="Hapus scene aktif">Hapus</button>
        </div>
        <div class="scene-track" data-scene-track>
          <button class="scene-card active" type="button" data-scene="0" aria-pressed="true"><span class="scene-index">01</span><span><strong>Orbit</strong><small>4 detik</small></span></button>
          <button class="scene-card" type="button" data-scene="1" aria-pressed="false"><span class="scene-index">02</span><span><strong>Transisi</strong><small>3 detik</small></span></button>
          <button class="scene-card" type="button" data-scene="2" aria-pressed="false"><span class="scene-index">03</span><span><strong>Sky mark</strong><small>5 detik</small></span></button>
        </div>
      </div>
    </aside>
    </div>

    <section class="preview-panel" aria-label="Preview formasi drone">
      <div class="starter-banner" data-starter-banner><span><strong>Katalog klien:</strong> pilih formasi Logo, Wedding, Event Besar, Hari Raya, atau buat sendiri.</span><div class="starter-actions"><button type="button" data-client-preset="brand">Logo &amp; Brand</button><button type="button" data-client-preset="wedding">Wedding</button><button type="button" data-client-preset="festival">Event Besar</button><button type="button" data-client-preset="national">Event Nasional</button><button type="button" data-client-preset="christmas">Hari Raya (Natal)</button><button type="button" data-client-preset="custom">Buat Sendiri</button></div></div>
      <div class="preview-topbar">
        <div><span class="live-indicator">Kanvas</span><div class="scene-title"><strong data-scene-name>Scene 01 — Orbit</strong><span data-motion-origin>Animasi formasi Studio</span></div></div>
        <div class="view-actions" role="group" aria-label="Pengaturan tampilan">
          <button type="button" class="test-run-button" data-run-test>Uji animasi</button>
          <button type="button" class="active" data-view="perspective" aria-pressed="true">Perspektif</button>
          <button type="button" class="front-view-button" data-view="front" aria-pressed="false">Depan</button>
          <button type="button" data-orbit-tool aria-pressed="false">Putar ruang</button>
          <button type="button" data-reset-camera>Reset kamera</button>
          <button type="button" data-fullscreen>Layar penuh</button>
          <button type="button" data-shortcut-help aria-haspopup="dialog">Shortcut</button>
        </div>
      </div>
      <div class="sky-stage" data-sky-stage>
        <canvas data-drone-canvas tabindex="0" aria-label="Workspace desain formasi drone"></canvas>
        <div class="ai-preview" data-ai-preview hidden>
          <div class="ai-preview-bar"><strong>Pratinjau AI</strong><div><button type="button" data-ai-use>Gunakan di workspace</button><button type="button" data-ai-replay>Putar ulang</button><button type="button" data-ai-consult>Konsultasikan desain</button><button type="button" data-ai-close>Kembali ke proyek</button></div></div>
        </div>
        <div class="stage-metrics" aria-hidden="true">
          <span><small>Drone</small><strong data-stage-drone-count>500</strong></span>
          <span><small>Durasi</small><strong data-stage-duration>12s</strong></span>
          <span><small>Scene</small><strong data-stage-scenes>03</strong></span>
        </div>
        <div class="workspace-toolbar" aria-label="Alat edit drone">
          <button type="button" data-reference-toggle disabled>Referensi: tidak ada</button>
          <button type="button" data-select-all>Pilih semua</button>
          <button type="button" data-copy-drone aria-label="Salin drone terpilih">Salin</button>
          <button type="button" data-paste-drone aria-label="Tempel drone">Tempel</button>
          <button type="button" data-delete-drone aria-label="Hapus drone terpilih">Hapus</button>
        </div>
        <div class="selection-status" data-selection-status role="status" hidden></div>
        <div class="canvas-hint" data-canvas-hint hidden>Klik pada langit untuk menambah titik arah.</div>
        <div class="stage-note"><p>Pratinjau konsep — perlu verifikasi tim Skyfy.</p></div>
      </div>
      <div class="playback-panel">
        <button class="play-button" type="button" aria-label="Putar preview" data-play><span data-play-icon>Putar</span></button>
        <span class="timecode" data-current-time>00:00.000</span>
        <input class="timeline-range" type="range" min="0" max="100" step="0.001" value="0" aria-label="Posisi waktu seluruh scene" data-time-range />
        <span class="timecode" data-duration>00:12.000</span>
      </div>
    </section>
  </main>

  <dialog class="generator-dialog" data-generator-dialog aria-labelledby="generator-title" aria-describedby="generator-description">
    <form data-generator-form>
      <div class="generator-heading"><div><span class="eyebrow">MULAI DESAIN</span><h2 id="generator-title">Buat pertunjukan awal</h2></div><button type="button" data-close-generator>Tutup</button></div>
      <p id="generator-description">Pilih paket desain klien siap pakai (500 drone) atau rancang sendiri.</p>
      <div class="catalog-grid dialog-catalog-grid" role="group" aria-label="Paket desain klien langsung">
        <button class="catalog-card" type="button" data-client-preset="brand"><strong>Logo &amp; Brand Besar</strong><small>Perisai, Trofi, Bola Dunia, Roket &amp; Berlian</small></button>
        <button class="catalog-card" type="button" data-client-preset="wedding"><strong>Wedding &amp; Pernikahan</strong><small>Pengantin, Kotak Cincin, Kue, Dua Cincin &amp; Gelas Bersulang</small></button>
        <button class="catalog-card" type="button" data-client-preset="festival"><strong>Event Besar &amp; Festival</strong><small>Bianglala, Balon Udara, Lentera, Kembang Api &amp; Kado</small></button>
        <button class="catalog-card" type="button" data-client-preset="national"><strong>Event Nasional &amp; Konser</strong><small>Dua Bendera, Monas, Borobudur, Armillary &amp; Gitar</small></button>
        <button class="catalog-card" type="button" data-client-preset="christmas"><strong>Event Hari Raya &amp; Natal</strong><small>Pohon Natal, Wreath, Bola Kaca, Bola Hati &amp; Ornamen 3D</small></button>
        <button class="catalog-card" type="button" data-client-preset="custom"><strong>Buat Desain Sendiri (Kustom)</strong><small>Kanvas kosong + jiplak gambar/logo referensi</small></button>
      </div>
      <label class="generator-field">Nama acara atau proyek<input name="name" type="text" maxlength="48" value="Pertunjukan Skyfy" required /></label>
      <fieldset class="generator-events"><legend>Acara seperti apa?</legend>
        <label><input type="radio" name="occasion" value="wedding" checked /><span><strong>Pernikahan</strong><small>Hati dan cahaya hangat</small></span></label>
        <label><input type="radio" name="occasion" value="festival" /><span><strong>Festival</strong><small>Gelombang dan spiral</small></span></label>
        <label><input type="radio" name="occasion" value="brand" /><span><strong>Peluncuran</strong><small>Formasi rapi dan dinamis</small></span></label>
        <label><input type="radio" name="occasion" value="celebration" /><span><strong>Perayaan</strong><small>Bintang dan kembang cahaya</small></span></label>
      </fieldset>
      <div class="generator-row"><label class="generator-field">Jumlah drone<input name="droneCount" type="number" min="1" max="1000" step="1" value="500" required /></label><label class="generator-field">Durasi<select name="duration"><option value="12">12 detik</option><option value="24" selected>24 detik</option><option value="36">36 detik</option></select></label></div>
      <label class="generator-field" data-generator-ai-field hidden>Arahan desain <span class="ai-optional">(opsional)</span><textarea name="prompt" maxlength="500" rows="3" placeholder="Contoh: logo perusahaan lalu kembang api 3D"></textarea></label>
      <div class="generator-actions"><button class="primary-button" type="submit" data-generator-submit>Buat dan lihat hasil</button><small data-generator-help>Tanpa prompt, Studio membuat tiga scene otomatis.</small></div>
    </form>
  </dialog>

  <dialog class="shortcut-dialog" data-shortcut-dialog aria-labelledby="shortcut-title" aria-describedby="shortcut-description">
    <div class="shortcut-heading"><h2 id="shortcut-title">Shortcut Studio</h2><button type="button" data-shortcut-close autofocus>Tutup</button></div>
    <p id="shortcut-description">Fokuskan kanvas untuk memakai shortcut. Di Mac, gunakan Cmd sebagai pengganti Ctrl.</p>
    <div class="shortcut-list" data-shortcut-list></div>
    <p class="shortcut-footnote">Alt + seret: putar kamera. Shift + seret: geser. Roda mouse: zoom.</p>
  </dialog>

  <dialog class="consult-dialog" data-consult-dialog aria-labelledby="consult-title">
    <form method="dialog">
      <button class="dialog-close" type="button" data-close-consult>Tutup</button>
      <span class="eyebrow">KONSULTASI DESAIN</span><h2 id="consult-title">Bawa konsep ini<br />ke tahap berikutnya.</h2>
      <p data-consult-copy>WhatsApp Skyfy siap dengan ringkasan desain. Lampirkan <strong data-consult-filename></strong>, lalu kirim pesannya.</p>
      <p data-consult-ai-copy hidden>WhatsApp Skyfy siap dengan ringkasan ide. Periksa lalu kirim pesannya.</p>
      <div class="dialog-summary"><span data-dialog-drones>500 drone</span><span data-dialog-scenes>3 scene</span><span data-dialog-duration>12 detik</span></div>
      <button type="button" data-consult-download>Unduh file desain lagi</button>
      <a class="primary-button dialog-submit" data-submit-consult href="https://wa.me/6282199988399" target="_blank" rel="noopener noreferrer">Buka WhatsApp lagi</a>
      <small>File proyek perlu dilampirkan sendiri di WhatsApp.</small>
    </form>
  </dialog>
  <dialog class="draft-dialog" data-draft-dialog aria-labelledby="draft-title" aria-describedby="draft-description">
    <h2 id="draft-title">Lanjutkan desain sebelumnya?</h2>
    <p id="draft-description">Konsep terakhir ada di browser ini. Lanjutkan atau mulai desain baru.</p>
    <div class="draft-actions"><button type="button" data-draft-new>Mulai dari awal</button><button class="primary-button" type="button" data-draft-resume>Lanjutkan desain</button></div>
  </dialog>
  <div class="toast" role="status" aria-live="polite" data-toast></div>
</body>
</html>
