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
const countNumberInput = q('[data-drone-number]');
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
const dropZone = q('[for="design-file"]');
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
const aiDimension = q('[data-ai-dimension]');
const aiPromptInput = q('[data-ai-prompt]');
const aiGenerateButton = q('[data-ai-generate]');
const aiCancelButton = q('[data-ai-cancel]');
const aiStatus = q('[data-ai-status]');
const alembicStatus = q('[data-alembic-status]');
const aiPreview = q('[data-ai-preview]');
const aiReferenceFile = q('[data-ai-reference-file]');
const aiReferenceLabel = q('[data-ai-reference-label]');
const aiReferenceRemove = q('[data-ai-reference-remove]');
const aiAttachment = q('[data-ai-attachment]');
const aiAttachmentPreview = q('[data-ai-attachment-preview]');
const aiSourceRow = q('[data-ai-source-row]');
const aiSourceLink = q('[data-ai-source-link]');
const aiRemaining = q('[data-ai-remaining]');
const aiContext = q('[data-ai-context]');
const aiConversationLog = q('[data-ai-conversation]');
const aiNewButton = q('[data-ai-new]');
const draftDialog = q('[data-draft-dialog]');
const exportAbcButton = q('[data-export-abc]');
const generatorDialog = q('[data-generator-dialog]');
const generatorForm = q('[data-generator-form]');
const starterBanner = q('[data-starter-banner]');
const MAX_FILE_BYTES = 32 * 1024 * 1024;
const MAX_ABC_BYTES = 25 * 1024 * 1024;
const MAX_PROJECT_FILE_BYTES = 40 * 1024 * 1024;
const MAX_MANUAL_DRONES = 1000;
const MAX_AI_SHOW_DRONES = 3000;
const MAX_AI_REFERENCE_BYTES = 2 * 1024 * 1024;
const MAX_AI_VIDEO_BYTES = 25 * 1024 * 1024;
const AI_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const AI_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
const AI_SPACING_METERS = 2.5;
const AI_STATIC_MIN_METERS = 1.5;
const AI_DYNAMIC_MIN_METERS = 1.2;
const AI_MAX_SPEED_MPS = 5;
const AI_MAX_VERTICAL_SPEED_MPS = 3;
const AI_MAX_ACCELERATION_MPS2 = 3;
const AI_WORKSPACE_METERS = 400;
const AI_DISPLAY_GAP_PX = 7.5;
const MAX_SCENES = 20;
const MAX_ANIMATION_ROWS = 300000;
const MAX_ANIMATION_FRAMES = 1000;
const MAX_NEAREST_DISTANCE_METERS = 2;
const MAX_DRONE_SPEED_MPS = 5;
const MAX_REFERENCES_PER_SCENE = 5;
const MAX_REFERENCE_FILE_BYTES = 5 * 1024 * 1024;
const MAX_REFERENCE_DATA_LENGTH = 1_000_000;
const MAX_REFERENCE_TOTAL_LENGTH = 8_000_000;
const SKYFY_WHATSAPP_NUMBER = '6282199988399';
const VALID_TEMPLATES = new Set(['single', 'row', 'grid', 'ring']);
const DEFAULT_CAMERA = Object.freeze({ yaw: -.12, pitch: -.14, zoom: 1, panX: 0, panY: 0 });
const FRONT_GROUND_LEVEL = .94;
const GROUND_STAGE_LEVEL = .94;
const HOVER_TAKEOFF_Y = .905;
const GROUND_FAR_SCREEN_LEVEL = .82;
const GROUND_GRID_DIVISIONS = 16;

const DEFAULT_BLENDER_COLOR = '#e8eef2';
const state = {
  mode: 'formation',
  formation: 'orbit',
  droneCount: 500,
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
    { name: 'Orbit', formation: 'orbit', duration: 4, palette: { startColor: '#b9f43c', endColor: '#52c7ff', gradient: true } },
    { name: 'Transisi', formation: 'wave', duration: 3, palette: { startColor: '#52c7ff', endColor: '#ff77b7', gradient: true } },
    { name: 'Sky mark', formation: 'mark', duration: 5, palette: { startColor: '#ffd15e', endColor: '#52c7ff', gradient: true } }
  ]
};

function paletteSettings(source = state) {
  return { startColor: source.startColor, endColor: source.endColor, gradient: source.gradient };
}
state.scenes.forEach(scene => { scene.palette ||= paletteSettings(); });

let animationFrame;
let freeMotionFrame = 0;
let freeMotionTime = 0;
let freeMotionLastTs = 0;
let previousTime = 0;
let toastTimer;
let importToken = 0;
let importInProgress = false;
let hasUnsavedChanges = false;
let hasUserProject = false;
let hasCustomEdits = false;
let lastSpacingCheck = 0;
let aiPreviewPrompt = '';
let aiPreviewReferenceName = '';
let aiConversation = [];
let aiCurrentDesign = null;
let draftReady = false;
let draftSaveTimer = null;
let draftDatabasePromise = null;
let aiRequestController = null;
let servicesCheckPromise = null;
let exportInProgress = false;
let aiPreviousProject = null;
let guestRemaining = null;
let aiServiceReady = false;
let aiProviderAvailable = false;
let aiTestMode = false;
let generatorSettings = null;
let alembicAvailable = null;
let aiAttachedVideoFrames = null;
let aiVideoExtractPromise = null;
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

function markDirty(isCustom = true) {
  hasUnsavedChanges = true;
  hasUserProject = true;
  if (isCustom) hasCustomEdits = true;
  saveState.textContent = 'Perubahan belum disimpan';
  scheduleDraftSave();
}

function openDraftDatabase() {
  if (!draftDatabasePromise) draftDatabasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('skyfy-studio-drafts', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('drafts');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return draftDatabasePromise;
}

async function draftOperation(mode, action) {
  const database = await openDraftDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('drafts', mode);
    const request = action(transaction.objectStore('drafts'));
    let result;
    request.onsuccess = () => { result = request.result; };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => resolve(result);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Transaksi penyimpanan draf dibatalkan.'));
  });
}

function draftPayload() {
  if (!hasUserProject && !aiConversation.length && !aiCurrentDesign && !aiPromptInput.value.trim()) return null;
  return { version: 1, savedAt: Date.now(),
    project: aiPreviousProject?.project || projectSnapshot(),
    unsaved: aiPreviousProject?.unsaved ?? hasUnsavedChanges,
    userProject: aiPreviousProject?.userProject ?? hasUserProject,
    selectedScene: aiPreviousProject?.selectedScene ?? state.selectedScene,
    globalTime: aiPreviousProject?.globalTime ?? totalDuration() * Number(timeRange.value) / 100,
    view: aiPreviousProject?.view ?? state.view,
    camera: aiPreviousProject?.camera ?? { ...state.camera },
    conversation: aiConversation.slice(-8), input: aiPromptInput.value,
    ai: aiCurrentDesign, previousAi: aiPreviousProject?.aiDesign || null,
    aiPreviewActive: aiCurrentDesign && !aiPreview.hidden };
}

async function persistDraft() {
  if (!draftReady) return;
  const payload = draftPayload();
  try {
    if (payload) await draftOperation('readwrite', store => store.put(payload, 'current'));
    else await draftOperation('readwrite', store => store.delete('current'));
    if (payload?.aiPreviewActive) saveState.textContent = 'Pratinjau AI · tersimpan di browser';
  } catch {
    saveState.textContent = 'Penyimpanan browser gagal · unduh proyek';
  }
}

function scheduleDraftSave() {
  if (!draftReady) return;
  clearTimeout(draftSaveTimer);
  draftSaveTimer = setTimeout(persistDraft, 350);
}

function renderAiConversation() {
  aiConversationLog.replaceChildren();
  aiConversationLog.hidden = !aiConversation.length;
  for (const turn of aiConversation) for (const [role, message] of [
    ['user', turn.prompt], ['assistant', turn.reply]]) {
    const card = document.createElement('div');
    card.className = `ai-message ${role}`;
    const label = document.createElement('strong');
    label.textContent = role === 'user' ? 'Anda' : 'Skyfy Studio';
    const body = document.createElement('p');
    body.textContent = message;
    card.append(label, body);
    aiConversationLog.append(card);
  }
  aiConversationLog.scrollTop = aiConversationLog.scrollHeight;
  const revising = Boolean(aiCurrentDesign && !aiPreview.hidden && aiConversation.length);
  aiGenerateButton.textContent = revising ? 'Kirim perubahan' : 'Buat desain drone';
  aiNewButton.hidden = !aiCurrentDesign;
  aiPromptInput.placeholder = revising
    ? 'Contoh: ubah topi jadi merah; bagian lain tetap'
    : 'Contoh: manusia salju, topi hitam, hidung wortel, syal merah';
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
  const n = Math.max(1, total);
  const safeIndex = Math.max(0, Math.min(n - 1, index));
  const cx = .5, cy = .47, scaleU = .38, scaleV = .38, scaleW = 15.2;
  const cache = formationPoint._cache || (formationPoint._cache = {});
  const cacheKey = `${type}:${n}`;
  let basePts = cache[cacheKey];
  if (!basePts) {
    const raw = [];
    for (let i = 0; i < n; i += 1) {
      const progress = n <= 1 ? 0 : i / (n - 1);
      let u = 0, v = 0, w = 0;
      if (type === 'wave') {
        const layers = n > 220 ? 3 : n > 80 ? 2 : 1;
        const layer = i % layers;
        const perLayer = Math.max(1, Math.ceil(n / layers));
        const idxL = Math.floor(i / layers);
        const cols = Math.max(2, Math.ceil(Math.sqrt(perLayer * 1.15)));
        const rows = Math.max(2, Math.ceil(perLayer / cols));
        const col = idxL % cols;
        const row = Math.floor(idxL / cols);
        u = cols <= 1 ? 0 : (col / (cols - 1)) * 1.76 - .88;
        w = rows <= 1 ? 0 : (row / (rows - 1)) * 1.76 - .88;
        const layerV = layers <= 1 ? 0 : ((layer / (layers - 1)) - .5) * .96;
        const wave = Math.sin(u * Math.PI * 1.4) * Math.cos(w * Math.PI * 1.2) * .22;
        v = layerV + wave;
      } else if (type === 'mark') {
        const strands = 6;
        const strand = i % strands;
        const idxS = Math.floor(i / strands);
        const perStrand = Math.max(1, Math.ceil(n / strands));
        const pS = perStrand <= 1 ? .5 : idxS / (perStrand - 1);
        const shell = strand < 3 ? 0 : 1;
        const turns = pS * Math.PI * 3.4 + (strand % 3) * (Math.PI * 2 / 3) + shell * .52;
        const env = .58 + .36 * Math.sin(pS * Math.PI);
        const rad = (shell === 0 ? .88 : .54) * env;
        u = Math.cos(turns) * rad;
        v = (pS - .5) * 1.72;
        w = Math.sin(turns) * rad;
      } else if (type === 'heart') {
        const zLayers = n > 180 ? 7 : 5;
        const zIdx = i % zLayers;
        const zNorm = (zIdx - (zLayers - 1) / 2) / Math.max(1, (zLayers - 1) / 2);
        const idxL = Math.floor(i / zLayers);
        const perLayer = Math.max(1, Math.ceil(n / zLayers));
        const subShell = idxL % 2;
        const idxC = Math.floor(idxL / 2);
        const perContour = Math.max(1, Math.ceil(perLayer / 2));
        const frac = (idxC + .5 * subShell + .15 * zIdx) / perContour;
        const angle = frac * Math.PI * 2 + .24 * Math.sin(2 * frac * Math.PI * 2);
        const shellScale = (1 - Math.abs(zNorm) * .22) * (subShell === 0 ? .92 : .64);
        u = Math.pow(Math.sin(angle), 3) * shellScale;
        v = ((13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) / 16) * shellScale + .08;
        w = zNorm * .86;
      } else if (type === 'star') {
        const zLayers = n > 180 ? 7 : 5;
        const zIdx = i % zLayers;
        const zNorm = (zIdx - (zLayers - 1) / 2) / Math.max(1, (zLayers - 1) / 2);
        const idxL = Math.floor(i / zLayers);
        const perLayer = Math.max(1, Math.ceil(n / zLayers));
        const subShell = idxL % 2;
        const idxC = Math.floor(idxL / 2);
        const perContour = Math.max(1, Math.ceil(perLayer / 2));
        const angle = ((idxC + .5 * subShell) / perContour) * Math.PI * 2 - Math.PI / 2 + zIdx * .12;
        const starR = (.68 + .24 * Math.cos(5 * angle)) * (1 - Math.abs(zNorm) * .20) * (subShell === 0 ? 1 : .66);
        u = Math.cos(angle) * starR;
        v = Math.sin(angle) * starR;
        w = zNorm * .86;
      } else if (type === 'spiral') {
        const zLayers = n > 180 ? 5 : 3;
        const zIdx = i % zLayers;
        const zNorm = (zIdx - (zLayers - 1) / 2) / Math.max(1, (zLayers - 1) / 2);
        const idxL = Math.floor(i / zLayers);
        const perLayer = Math.max(1, Math.ceil(n / zLayers));
        const arm = idxL % 3;
        const pArm = Math.floor(idxL / 3) / Math.max(1, Math.ceil(perLayer / 3) - 1);
        const r = .24 + Math.sqrt(Math.max(0, Math.min(1, pArm))) * .66;
        const angle = pArm * Math.PI * 3.8 + arm * (Math.PI * 2 / 3) + zIdx * .35;
        u = Math.cos(angle) * r;
        v = zNorm * .78 + Math.sin(angle) * r * .18;
        w = Math.sin(angle) * r;
      } else if (type === 'burst') {
        const radii = [.46, .62, .77, .91];
        const weights = [.10, .18, .30, .42];
        let acc = 0, shell = 3, localIdx = i, shellCount = Math.max(1, Math.round(n * weights[3]));
        for (let s = 0; s < 4; s += 1) {
          const cnt = s === 3 ? Math.max(1, n - acc) : Math.max(1, Math.round(n * weights[s]));
          if (i < acc + cnt) {
            shell = s;
            localIdx = i - acc;
            shellCount = cnt;
            break;
          }
          acc += cnt;
        }
        const golden = Math.PI * (3 - Math.sqrt(5));
        const yNorm = 1 - 2 * ((localIdx + .5) / shellCount);
        const rPlane = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
        const theta = localIdx * golden + shell * .9;
        const rad = radii[shell];
        u = Math.cos(theta) * rPlane * rad;
        v = yNorm * rad;
        w = Math.sin(theta) * rPlane * rad;
      } else if (type === 'free') {
        const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
        const rows = Math.max(1, Math.ceil(n / cols));
        const col = i % cols;
        const row = Math.floor(i / cols);
        u = cols <= 1 ? 0 : (col / (cols - 1)) * 1.72 - .86;
        v = rows <= 1 ? 0 : (row / (rows - 1)) * 1.72 - .86;
        w = ((col + row) % 2 === 0 ? 1 : -1) * .12;
      } else {
        const rings = 8;
        const ring = i % rings;
        const perRing = Math.max(1, Math.ceil(n / rings));
        const ringOrder = (Math.floor(i / rings) + (ring % 2) * .5) / perRing;
        const angle = ringOrder * Math.PI * 2 + ring * .38;
        const radius = .50 + (ring / (rings - 1)) * .40;
        const tiltX = .35 + (ring % 4) * .36;
        const tiltZ = ring * (Math.PI / 8);
        const lx = Math.cos(angle) * radius;
        const ly = Math.sin(angle) * radius * Math.cos(tiltX);
        const lz = Math.sin(angle) * radius * Math.sin(tiltX);
        u = lx * Math.cos(tiltZ) - ly * Math.sin(tiltZ);
        v = lx * Math.sin(tiltZ) + ly * Math.cos(tiltZ);
        w = lz + ((ring % 2 === 0 ? 1 : -1) * .08);
      }
      raw.push({
        u: Math.max(-.93, Math.min(.93, u)),
        v: Math.max(-.90, Math.min(.90, v)),
        w: Math.max(-.93, Math.min(.93, w)),
        u0: u, v0: v, w0: w
      });
    }
    const minDistUVW = 1.62 / scaleW;
    const minDistSq = minDistUVW * minDistUVW;
    for (let iter = 0; iter < 48; iter += 1) {
      let maxOverlap = 0;
      const pushFactor = iter < 30 ? .48 : .54;
      for (let i = 0; i < n; i += 1) {
        const p1 = raw[i];
        for (let j = i + 1; j < n; j += 1) {
          const p2 = raw[j];
          const du = p1.u - p2.u;
          const dv = p1.v - p2.v;
          const dw = p1.w - p2.w;
          const dSq = du * du + dv * dv + dw * dw;
          if (dSq < minDistSq) {
            const d = Math.sqrt(dSq);
            const overlap = minDistUVW - d;
            if (overlap > maxOverlap) maxOverlap = overlap;
            let ux, uy, uz;
            if (d > 1e-5 && Math.abs(dw) > .012) {
              ux = du / d; uy = dv / d; uz = dw / d;
            } else {
              const a = i * 2.399963 + j * .71;
              const zSign = (i + j) % 2 === 0 ? 1 : -1;
              ux = Math.cos(a) * .65;
              uy = Math.sin(a) * .65;
              uz = zSign * .76;
              const norm = Math.hypot(ux, uy, uz);
              ux /= norm; uy /= norm; uz /= norm;
            }
            const push = overlap * pushFactor;
            p1.u = Math.max(-.94, Math.min(.94, p1.u + ux * push));
            p1.v = Math.max(-.91, Math.min(.91, p1.v + uy * push));
            p1.w = Math.max(-.94, Math.min(.94, p1.w + uz * push));
            p2.u = Math.max(-.94, Math.min(.94, p2.u - ux * push));
            p2.v = Math.max(-.91, Math.min(.91, p2.v - uy * push));
            p2.w = Math.max(-.94, Math.min(.94, p2.w - uz * push));
          }
        }
      }
      if (maxOverlap < 1e-4 && iter >= 8) break;
    }
    // 3D monotone quantile bucket ordering for collision-free, minimal-distance transitions
    const uBins = Math.max(1, Math.round(Math.cbrt(n)));
    raw.sort((a, b) => a.u - b.u);
    const ordered = [];
    for (let ub = 0; ub < uBins; ub += 1) {
      const uStart = Math.floor(ub * n / uBins);
      const uEnd = Math.floor((ub + 1) * n / uBins);
      const uSlice = raw.slice(uStart, uEnd).sort((a, b) => a.v - b.v);
      const vBins = Math.max(1, Math.round(Math.sqrt(uSlice.length)));
      for (let vb = 0; vb < vBins; vb += 1) {
        const vStart = Math.floor(vb * uSlice.length / vBins);
        const vEnd = Math.floor((vb + 1) * uSlice.length / vBins);
        const vStrip = uSlice.slice(vStart, vEnd).sort((a, b) => a.w - b.w);
        for (const item of vStrip) ordered.push({ u: item.u, v: item.v, w: item.w });
      }
    }
    basePts = cache[cacheKey] = ordered;
  }

  const pt = basePts[safeIndex];
  if (type === 'free') {
    return {
      x: width * (cx + pt.u * scaleU),
      y: height * (cy - pt.v * scaleV),
      z: pt.w * scaleW
    };
  }

  // Smooth C-infinity phase with zero velocity & zero acceleration at scene start (time=0) and end (time=1)
  const rawPhase = time * Math.PI * 2;
  const phase = rawPhase - Math.sin(rawPhase);

  let u = pt.u, v = pt.v, w = pt.w;
  if (type === 'wave') {
    v += Math.sin(phase + u * 1.4) * .006;
    w += Math.cos(phase + v * 1.2) * .004;
  } else if (type === 'burst') {
    const pulse = 1 + (1 - Math.cos(phase)) * .006;
    u *= pulse; v *= pulse; w *= pulse;
  } else {
    v += Math.sin(phase + u * 1.1) * .004;
  }

  const yawAmp = type === 'orbit' || type === 'spiral' ? .072 : .054;
  const pitchAmp = .024;
  const yaw = Math.sin(phase) * yawAmp;
  const pitch = (1 - Math.cos(phase)) * .5 * pitchAmp;
  const rotU = u * Math.cos(yaw) + w * Math.sin(yaw);
  const rotW = -u * Math.sin(yaw) + w * Math.cos(yaw);
  const finalV = v * Math.cos(pitch) - rotW * Math.sin(pitch);
  const finalW = v * Math.sin(pitch) + rotW * Math.cos(pitch);

  return {
    x: width * Math.max(.04, Math.min(.96, cx + rotU * scaleU)),
    y: height * Math.max(.04, Math.min(.90, cy - finalV * scaleV)),
    z: finalW * scaleW
  };
}

function pathPoint(points, index, total, time) {
  const lengths = points.map((point, part) => {
    const next = points[(part + 1) % points.length];
    return Math.hypot(next.x - point.x, next.y - point.y);
  });
  const perimeter = lengths.reduce((sum, length) => sum + length, 0);
  if (perimeter < .01) return points[0];
  let distance = ((index / total + time * .06) % 1) * perimeter;
  for (let part = 0; part < points.length; part += 1) {
    if (distance <= lengths[part] || part === points.length - 1) {
      const from = points[part];
      const to = points[(part + 1) % points.length];
      const blend = lengths[part] ? distance / lengths[part] : 0;
      return { x: from.x + (to.x - from.x) * blend, y: from.y + (to.y - from.y) * blend };
    }
    distance -= lengths[part];
  }
  return points[0];
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

function stageSpan(width, height) {
  return Math.max(1, Math.min(width, height));
}

function cameraDepthScale(width, height = width) {
  return stageSpan(width, height) / state.workspaceWidth;
}

function worldFromDrone(drone, width, height) {
  const span = stageSpan(width, height);
  return {
    x: (drone.x - .5) * span,
    y: (.5 - drone.y) * span,
    z: (drone.z || 0) * cameraDepthScale(width, height)
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
  const point = projectWorldPoint(worldFromDrone(drone, width, height), width, height);
  return !aiPreview.hidden && window.innerWidth <= 620
    ? { ...point, y: point.y - Math.min(30, height * .075) }
    : point;
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
  const span = stageSpan(width, height);
  const world = unprojectScreen(screenX, screenY, depth, width, height);
  return {
    x: Math.max(0, Math.min(1, .5 + world.x / span)),
    y: Math.max(0, Math.min(1, .5 - world.y / span)),
    z: Math.max(-1_000_000, Math.min(1_000_000, world.z / cameraDepthScale(width, height)))
  };
}

function drawGround(width, height) {
  if (!state.groundVisible) return;
  const span = stageSpan(width, height);
  if (state.view === 'front') {
    const horizon = height / 2 + (GROUND_STAGE_LEVEL - .5) * span;
    ctx.fillStyle = 'rgba(152, 187, 151, .055)';
    ctx.fillRect(0, horizon, width, Math.max(0, height - horizon));
    ctx.strokeStyle = 'rgba(157, 198, 161, .28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(width, horizon);
    ctx.stroke();
    // Hover launch pad footprint marker on ground horizon
    const padHalf = span * .34;
    ctx.strokeStyle = 'rgba(185, 244, 60, .42)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - padHalf, horizon);
    ctx.lineTo(width / 2 + padHalf, horizon);
    ctx.stroke();
    ctx.lineWidth = 1;
    return;
  }

  const halfSize = span * .62;
  const padHalf = span * .34;
  const groundY = (.5 - GROUND_STAGE_LEVEL) * span;
  const halfDiv = GROUND_GRID_DIVISIONS / 2;
  const cellSize = halfSize / halfDiv;
  const groundPoint = (x, z) => projectWorldPoint({ x, y: groundY, z }, width, height);
  const corners = [groundPoint(-halfSize, -halfSize), groundPoint(halfSize, -halfSize), groundPoint(halfSize, halfSize), groundPoint(-halfSize, halfSize)];
  ctx.fillStyle = 'rgba(152, 187, 151, .045)';
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(157, 198, 161, .16)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let line = -halfDiv; line <= halfDiv; line += 1) {
    const x = line * cellSize;
    const near = groundPoint(x, -halfSize);
    const far = groundPoint(x, halfSize);
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
  }
  for (let row = -halfDiv; row <= halfDiv; row += 1) {
    const z = row * cellSize;
    const left = groundPoint(-halfSize, z);
    const right = groundPoint(halfSize, z);
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
  }
  ctx.stroke();
  ctx.strokeStyle = 'rgba(157, 198, 161, .32)';
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.stroke();
  // Neat hover / takeoff launch pad zone
  const pad = [groundPoint(-padHalf, -padHalf), groundPoint(padHalf, -padHalf), groundPoint(padHalf, padHalf), groundPoint(-padHalf, padHalf)];
  ctx.fillStyle = 'rgba(185, 244, 60, .03)';
  ctx.strokeStyle = 'rgba(185, 244, 60, .30)';
  ctx.beginPath();
  ctx.moveTo(pad[0].x, pad[0].y);
  pad.slice(1).forEach(point => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawDrone(x, y, color, selected = false, alpha = 1, depth = 0, span = 600) {
  const scale = state.markerScale;
  const aiScene = state.scenes?.[state.selectedScene]?.aiGenerated;
  const depthFactor = state.view === 'perspective'
    ? Math.max(.78, Math.min(1.22, 1 - depth / (Math.max(1, span) * 2.2) * .35))
    : 1;
  const aiRadius = (aiScene ? Math.min(2.4 * scale, Math.max(.65,
    AI_DISPLAY_GAP_PX * Math.min(canvas.clientWidth / 1200, canvas.clientHeight / 600)
      * (state.camera?.zoom || 1) * .42)) : 2.35 * scale) * depthFactor;
  if (!selected) {
    ctx.globalAlpha = alpha * (aiPreview.hidden ? .14 : .12);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, aiScene ? aiRadius * 1.7 : aiRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, selected ? 3.7 * scale : aiRadius, 0, Math.PI * 2);
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
  const span = stageSpan(width, height);
  return projectWorldPoint({
    x: (reference.x - .5) * span + offsetX,
    y: (.5 - reference.y) * span + offsetY,
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
    const span = stageSpan(width, height);
    const fit = Math.min(span * .8 / image.naturalWidth, span * .75 / image.naturalHeight);
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
    const pathPosition = scene.formation === 'path' ? pathPoint(scene.path, index, state.droneCount, time) : null;
    const point = pathPosition ? { x: pathPosition.x * width, y: pathPosition.y * height, z: 0 }
      : formationPoint(scene.formation, index, state.droneCount, width, height, time);
    const zDepth = point.z || 0;
    const waveShift = ((progress * 1.35 + time * .75 + (zDepth + 6) * .035) % 1 + 1) % 1;
    const colorAmount = palette.gradient ? .5 - .5 * Math.cos(waveShift * Math.PI * 2) : 0;
    let color = mixColor(palette.startColor, palette.endColor, colorAmount);
    if (palette.gradient && !scene.customColored) {
      const accentPulse = Math.max(0, Math.sin((progress * 3 + time * 1.1) * Math.PI * 2)) * .38;
      if (accentPulse > .02) color = mixColor(colorToHex(color), '#ffd15e', accentPulse);
    }
    return { x: point.x / width, y: point.y / height, z: zDepth, color };
  });
}

function calculateTransitionSeconds(index) {
  if (index < 1) return 0;
  const previousScene = state.scenes[index - 1];
  const scene = state.scenes[index];
  if (previousScene.formation === 'animation' || scene.formation === 'animation' || previousScene.bounds || scene.bounds) return 0;
  const rawPrev = sceneDrones(previousScene, previousScene.duration, 1200, 600);
  const previous = previousScene.formation === 'manual' && previousScene.catalog3D
    ? rawPrev.map((drone, idx) => animateCatalog3DDrone(drone, idx, rawPrev.length, previousScene.duration * 1.35, previousScene))
    : rawPrev;
  const rawCur = sceneDrones(scene, 0, 1200, 600);
  const current = scene.formation === 'manual' && scene.catalog3D
    ? rawCur.map((drone, idx) => animateCatalog3DDrone(drone, idx, rawCur.length, 0, scene))
    : rawCur;
  if (!previous.length || previous.length !== current.length) return 0;
  let maxDist = 0;
  let maxVert = 0;
  for (let drone = 0; drone < current.length; drone += 1) {
    const a = worldPoint(previous[drone]);
    const b = worldPoint(current[drone]);
    const dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
    const vert = Math.abs(a.y - b.y);
    if (dist > maxDist) maxDist = dist;
    if (vert > maxVert) maxVert = vert;
  }
  // Quintic C^2 interpolation peaks at 1.875x velocity and 5.7735x acceleration.
  // Enforce speed < 5 m/s, vertical rise/fall < 3 m/s, and acceleration < 3 m/s^2.
  const tSpeed = 1.875 * maxDist / (MAX_DRONE_SPEED_MPS * .92);
  const tVert = 1.875 * maxVert / (AI_MAX_VERTICAL_SPEED_MPS * .90);
  const tAccel = Math.sqrt(5.7735 * maxDist / (AI_MAX_ACCELERATION_MPS2 * .90));
  return Math.max(1.2, tSpeed, tVert, tAccel);
}

function transitionSeconds(index) {
  return state.scenes[index]?._transitionSeconds ?? calculateTransitionSeconds(index);
}

function takeoffSeconds(index) {
  if (index !== 0) return 0;
  const scene = state.scenes[0];
  if (!scene || scene.formation === 'animation' || scene.formation === 'free') return 0;
  return Math.min(2.2, scene.duration * .36);
}

function motionSeconds(scene) {
  if (scene.formation === 'free' || scene.formation === 'animation') return 0;
  if (scene.formation === 'manual') {
    if (!scene.catalog3D || !scene.manualDrones?.length) return 0;
    const raw = scene.manualDrones;
    let maxDist = 0;
    let maxVert = 0;
    let previous = raw.map((drone, idx) => animateCatalog3DDrone(drone, idx, raw.length, 0, scene));
    for (let step = 1; step <= 24; step += 1) {
      const phase = (scene.duration * step / 24) * 1.35;
      const current = raw.map((drone, idx) => animateCatalog3DDrone(drone, idx, raw.length, phase, scene));
      for (let drone = 0; drone < current.length; drone += 1) {
        const a = worldPoint(previous[drone]);
        const b = worldPoint(current[drone]);
        maxDist = Math.max(maxDist, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
        maxVert = Math.max(maxVert, Math.abs(a.y - b.y));
      }
      previous = current;
    }
    const bySpeed = maxDist * 24 * 1.15 / MAX_DRONE_SPEED_MPS;
    const byVert = maxVert * 24 * 1.15 / AI_MAX_VERTICAL_SPEED_MPS;
    return Math.max(4, bySpeed, byVert);
  }
  if (scene.formation === 'path') {
    const perimeter = scene.path.reduce((sum, point, index) => {
      const next = scene.path[(index + 1) % scene.path.length];
      return sum + Math.hypot(next.x - point.x, next.y - point.y);
    }, 0);
    return perimeter * .06 * state.workspaceWidth / MAX_DRONE_SPEED_MPS;
  }
  let maxDist = 0;
  let maxVert = 0;
  let previous = sceneDrones(scene, 0, 1200, 600);
  for (let step = 1; step <= 48; step += 1) {
    const current = sceneDrones(scene, scene.duration * step / 48, 1200, 600);
    for (let drone = 0; drone < current.length; drone += 1) {
      const a = worldPoint(previous[drone]);
      const b = worldPoint(current[drone]);
      maxDist = Math.max(maxDist, Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z));
      maxVert = Math.max(maxVert, Math.abs(a.y - b.y));
    }
    previous = current;
  }
  const bySpeed = maxDist * 48 * 1.15 / MAX_DRONE_SPEED_MPS;
  const byVert = maxVert * 48 * 1.15 / AI_MAX_VERTICAL_SPEED_MPS;
  return Math.max(4, bySpeed, byVert);
}

function normalizeMotionTimings() {
  state.scenes.forEach((scene, index) => {
    scene._transitionSeconds = calculateTransitionSeconds(index);
    if (scene.formation === 'animation') return; // Source timestamps stay intact.
    const lead = index === 0 ? takeoffSeconds(0) : scene._transitionSeconds;
    const minimum = lead + motionSeconds(scene);
    if (minimum > scene.duration) scene.duration = Math.ceil(minimum * 1000) / 1000;
  });
}

function formationLocalTime(index, localTime) {
  const scene = state.scenes[index];
  if (!scene) return localTime;
  const lead = index === 0 ? takeoffSeconds(0) : transitionSeconds(index);
  if (!lead) return localTime;
  return Math.max(0, Math.min(scene.duration,
    (localTime - lead) / Math.max(.001, scene.duration - lead) * scene.duration));
}

function quinticEase(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function takeoffInterpolateDrone(from, to, amount) {
  const t = Math.max(0, Math.min(1, amount));
  // Vertical lift leads smoothly from the bottom hover pad up to the sky;
  // lateral/depth spread engages after clean ground clearance so drones never sweep sideways along the ground.
  const yBlend = quinticEase(Math.min(1, t / .86));
  const xzBlend = quinticEase(Math.max(0, (t - .15) / .85));
  const colorBlend = quinticEase(t);
  const fromHex = colorToHex(from?.color || state?.startColor || '#ffffff');
  const toHex = colorToHex(to?.color || state?.endColor || '#ffffff');
  return {
    x: from.x + (to.x - from.x) * xzBlend,
    y: from.y + (to.y - from.y) * yBlend,
    z: (from.z || 0) + ((to.z || 0) - (from.z || 0)) * xzBlend,
    color: mixColor(fromHex, toHex, colorBlend)
  };
}

function renderProjectedDrones(rendered, width, height) {
  if (state?.view === 'perspective' && rendered.length > 1) {
    rendered.sort((a, b) => b.depth - a.depth);
  }
  const span = stageSpan(width, height);
  const depthSpan = span * .45;
  for (const item of rendered) {
    const baseAlpha = item.alpha ?? 1;
    const depthAlpha = state?.view === 'perspective' && !item.selected
      ? Math.max(.65, Math.min(1, .88 - item.depth / depthSpan * .22)) * baseAlpha
      : baseAlpha;
    drawDrone(item.x, item.y, item.color, Boolean(item.selected), depthAlpha, item.depth || 0, span);
  }
}

function drawTakeoffTransition(takeoffGrid, targetDrones, amount, width, height) {
  const maxLen = Math.min(takeoffGrid.length, targetDrones.length);
  const rendered = [];
  for (let index = 0; index < maxLen; index += 1) {
    const drone = takeoffInterpolateDrone(takeoffGrid[index], targetDrones[index], amount);
    const projected = projectDrone(drone, width, height);
    rendered.push({
      x: projected.x,
      y: projected.y,
      depth: projected.depth || 0,
      color: drone.color,
      alpha: 1
    });
  }
  renderProjectedDrones(rendered, width, height);
}

function drawSceneTransition(previous, current, amount, width, height) {
  const t = Math.max(0, Math.min(1, amount));
  // Quintic C^2 interpolation (v = 0, a = 0 at start & end, matching smooth_quintic in all_in_one_drone_show.py)
  const blend = quinticEase(t);
  const env = 16 * t * t * (1 - t) * (1 - t);
  const maxLen = Math.max(previous.length, current.length);
  const rendered = [];
  for (let index = 0; index < maxLen; index += 1) {
    const from = previous[index];
    const to = current[index];
    if (!from && !to) continue;
    const zSep = ((from?.z || 0) !== 0 || (to?.z || 0) !== 0) ? (index % 2 === 0 ? .18 : -.18) * env : 0;
    const drone = from && to ? {
      x: from.x + (to.x - from.x) * blend,
      y: from.y + (to.y - from.y) * blend,
      z: (from.z || 0) + ((to.z || 0) - (from.z || 0)) * blend + zSep
    } : from || to;
    const fromHex = colorToHex(from?.color || state?.startColor || '#ffffff');
    const toHex = colorToHex(to?.color || state?.endColor || '#ffffff');
    const color = from && to ? mixColor(fromHex, toHex, blend) : (from ? fromHex : toHex);
    const projected = projectDrone(drone, width, height);
    rendered.push({
      x: projected.x,
      y: projected.y,
      depth: projected.depth || 0,
      color,
      alpha: from && to ? 1 : from ? 1 - blend : blend
    });
  }
  renderProjectedDrones(rendered, width, height);
}

function animateCatalog3DDrone(drone, index, total, phase, scene) {
  const progress = index / Math.max(1, total - 1);
  const cx = .5, cy = .47, scaleU = .38, scaleV = .38, scaleW = 15.2;
  let u = drone.lu !== undefined ? drone.lu : (drone.x - cx) / scaleU;
  let v = drone.lv !== undefined ? drone.lv : (cy - drone.y) / scaleV;
  let w = drone.lw !== undefined ? drone.lw : (drone.z || 0) / scaleW;

  // 1. Bagian bergerak asinkron C-infinity halus (mempertahankan jarak dinamis > 1.2m dan percepatan < 3 m/s^2)
  const storyWave = .5 - .5 * Math.cos(phase * .55);
  const phi = drone.spinA !== undefined ? drone.spinA : (progress * Math.PI * 2);

  if (drone.part === 'lid' && drone.hingeV !== undefined) {
    const ang = .028 * storyWave;
    const dv = v - drone.hingeV;
    const dw = w - (drone.hingeW || 0);
    v = drone.hingeV + dv * Math.cos(ang) + dw * Math.sin(ang);
    w = (drone.hingeW || 0) + dw * Math.cos(ang) - dv * Math.sin(ang);
  } else if (drone.part === 'ring' || drone.part === 'diamond') {
    v += .005 * storyWave;
    w += Math.sin(phase * .75 + phi) * .004;
  } else if (drone.part === 'sparkle') {
    u += Math.cos(phase * .95 + phi) * .003;
    v += Math.sin(phase * .95 + phi) * .004;
    w += Math.sin(phase * .85 + phi * 1.3) * .004;
  } else if (drone.part === 'spin') {
    const pivU = drone.spinOU || 0;
    const pivV = (drone.hingeV || 0) + (drone.spinOV || 0);
    const ang = Math.sin(phase * .60) * .022;
    const du = u - pivU, dv = v - pivV;
    u = pivU + du * Math.cos(ang) - dv * Math.sin(ang);
    v = pivV + du * Math.sin(ang) + dv * Math.cos(ang);
  } else if (drone.part === 'bell_swing' && drone.hingeV !== undefined) {
    const swing = Math.sin(phase * .75 + phi) * .018;
    const pivotU = drone.spinOU || 0;
    const pivotV = drone.hingeV;
    const du = u - pivotU, dv = v - pivotV;
    u = pivotU + du * Math.cos(swing) - dv * Math.sin(swing);
    v = pivotV + du * Math.sin(swing) + dv * Math.cos(swing);
    w += Math.sin(phase * .68 + phi) * .004;
  } else if (drone.part === 'depth_swing') {
    const pivotU = drone.spinOU || 0;
    const pivotV = drone.hingeV !== undefined ? drone.hingeV : .38;
    const pitchA = Math.sin(phase * .72 + phi) * .012;
    const yawA = Math.cos(phase * .58 + phi) * .010;
    const du = u - pivotU, dv = v - pivotV;
    const v1 = pivotV + dv * Math.cos(pitchA) - w * Math.sin(pitchA);
    const w1 = dv * Math.sin(pitchA) + w * Math.cos(pitchA);
    u = pivotU + du * Math.cos(yawA) + w1 * Math.sin(yawA);
    v = v1;
    w = -du * Math.sin(yawA) + w1 * Math.cos(yawA);
  } else if (drone.part === 'ribbon_wave') {
    const s = drone.distFromPole !== undefined ? drone.distFromPole : .5;
    const sidePhi = u >= 0 ? .85 : 0;
    const wPhase = phase * 1.05 - s * 1.6 + sidePhi;
    u += Math.sin(wPhase) * .003 * s;
    v += Math.cos(wPhase) * .003 * s;
    w += Math.sin(wPhase + .8) * .004 * s;
  } else if (drone.part === 'burst_pulse') {
    const scale = 1 + Math.sin(phase * .85 + phi) * .012;
    const rot = Math.cos(phase * .68 + phi) * .018;
    const cu = drone.spinOU || 0;
    const cv = drone.hingeV || 0;
    const du = (u - cu) * scale, dv = (v - cv) * scale;
    u = cu + du * Math.cos(rot) - dv * Math.sin(rot);
    v = cv + du * Math.sin(rot) + dv * Math.cos(rot);
  } else if (drone.part === 'helix_flow') {
    const axisU = drone.spinOU !== undefined ? drone.spinOU : u;
    const rot = Math.sin(phase * .72) * .025;
    const du = u - axisU;
    u = axisU + du * Math.cos(rot) + w * Math.sin(rot);
    w = -du * Math.sin(rot) + w * Math.cos(rot);
  }

  // 2. Dua bendera berkibar: gelombang merambat halus dari tiang ke ujung kain
  if ((drone.part === 'flag_left' || drone.part === 'flag_right') && drone.distFromPole !== undefined) {
    const s = drone.distFromPole;
    w += Math.sin(phase * 1.1 - s * 1.8 + v * 1.1) * .007 * s;
    v += Math.cos(phase * .95 - s * 1.6) * .004 * s;
  }

  // 3. Rotasi benda tegar 3D (isometri Euklides karena scaleU*40 = scaleV*40 = scaleW = 15.2m)
  const yaw = Math.sin(phase * .24) * .17;
  const pitch = Math.sin(phase * .18) * .065;
  const rotU = u * Math.cos(yaw) + w * Math.sin(yaw);
  const rotW = -u * Math.sin(yaw) + w * Math.cos(yaw);
  const floatY = Math.sin(phase * .35 + u * .6) * .005;
  const finalV = v * Math.cos(pitch) - rotW * Math.sin(pitch) + floatY;
  const finalW = v * Math.sin(pitch) + rotW * Math.cos(pitch);

  let color = drone.color || state.startColor;
  if (!scene.customColored && drone.themeColor) {
    const baseHex = colorToHex(drone.themeColor);
    if (drone.part === 'burst_pulse') {
      const wWave = .5 + .5 * Math.cos(phase * 3.2 + (drone.spinA || 0));
      color = wWave > .55 ? mixColor(baseHex, '#ffffff', (wWave - .55) / .45 * .65) : baseHex;
    } else if (drone.part === 'helix_flow') {
      const stripe = .5 + .5 * Math.cos((drone.lv || 0) * 6.5 - phase * 3.6 + (drone.spinA || 0));
      color = stripe > .6 ? mixColor(baseHex, '#ffffff', (stripe - .6) / .4 * .7) : baseHex;
    } else {
      const twinkle = Math.sin(phase * 2.2 + progress * 16.0 + u * 4.0 + w * 4.0);
      color = twinkle > 0.90 ? mixColor(baseHex, '#ffffff', (twinkle - 0.90) / 0.10 * 0.35) : baseHex;
    }
  }
  return {
    x: Math.max(.04, Math.min(.96, cx + rotU * scaleU)),
    y: Math.max(.04, Math.min(.90, cy - finalV * scaleV)),
    z: finalW * scaleW,
    color
  };
}

function shouldRunFreeMotion() {
  if (typeof document !== 'undefined' && document.hidden) return false;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  if (state.playing || state.draggingDrone || state.selectionBox?.active || !aiPreview.hidden) return false;
  const scene = state.scenes[state.selectedScene];
  if (!scene) return false;
  if (scene.formation === 'manual') return Boolean(scene.catalog3D && state.selectedDrones.size === 0 && scene.manualDrones?.length);
  return !['free', 'animation'].includes(scene.formation);
}

function tickFreeMotion(ts) {
  freeMotionFrame = 0;
  if (!shouldRunFreeMotion()) {
    freeMotionLastTs = 0;
    return;
  }
  const dt = freeMotionLastTs ? Math.min(.05, Math.max(0, (ts - freeMotionLastTs) / 1000)) : .016;
  freeMotionLastTs = ts;
  freeMotionTime = (freeMotionTime + dt) % 120;
  draw();
}

function ensureFreeMotionLoop() {
  if (!freeMotionFrame && shouldRunFreeMotion()) {
    freeMotionFrame = requestAnimationFrame(tickFreeMotion);
  }
}

let isTimelineScrubbing = false;

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
  const inTransition = state.testInProgress || state.playing || isTimelineScrubbing;
  const effectiveTime = (!state.playing && !state.testInProgress && !isTimelineScrubbing && !['manual', 'free', 'animation'].includes(scene.formation))
    ? (localTime + freeMotionTime * 1.15) % Math.max(.001, scene.duration)
    : formationLocalTime(state.selectedScene, localTime);
  const staticVideoPose = !state.playing && !state.testInProgress && state.selectedScene === 0
    && localTime < 0.01 && scene.formation === 'animation' && scene.aiGenerated && scene.frames?.length > 4
    ? scene.frames[1].drones : null;
  const baseDrones = staticVideoPose || sceneDrones(scene, effectiveTime, width, height);
  const applyCatalogFree3D = scene.formation === 'manual' && scene.catalog3D && !state.draggingDrone && state.selectedDrones.size === 0;
  const catalogPhase = (inTransition ? effectiveTime : freeMotionTime) * 1.35;
  const current = applyCatalogFree3D
    ? baseDrones.map((drone, idx) => animateCatalog3DDrone(drone, idx, baseDrones.length, catalogPhase, scene))
    : baseDrones;
  if (inTransition && state.selectedScene === 0 && scene.formation !== 'animation' && scene.formation !== 'free' && current.length) {
    const takeoffDuration = takeoffSeconds(0);
    if (localTime < takeoffDuration) {
      if (!scene._takeoffGrid || scene._takeoffGrid.length !== current.length) {
        scene._takeoffGrid = buildTakeoffGridDrones(current, '3d');
      }
      drawTakeoffTransition(scene._takeoffGrid, current, localTime / takeoffDuration, width, height);
      drawSelectionBox();
      return;
    }
  }
  if (inTransition && state.selectedScene > 0 && scene.formation !== 'animation') {
    const transitionDuration = transitionSeconds(state.selectedScene);
    if (localTime < transitionDuration) {
      const previousScene = state.scenes[state.selectedScene - 1];
      const rawPrev = sceneDrones(previousScene, previousScene.duration, width, height);
      const previous = previousScene.formation === 'manual' && previousScene.catalog3D
        ? rawPrev.map((drone, idx) => animateCatalog3DDrone(drone, idx, rawPrev.length, previousScene.duration * 1.35, previousScene))
        : rawPrev;
      drawSceneTransition(previous, current, localTime / transitionDuration, width, height);
      drawSelectionBox();
      return;
    }
  }
  const rendered = [];
  for (let index = 0; index < current.length; index += 1) {
    const drone = current[index];
    if (scene.aiGenerated && drone.color === '#000000') continue;
    const projected = projectDrone(drone, width, height);
    rendered.push({
      x: projected.x,
      y: projected.y,
      depth: projected.depth || 0,
      color: drone.color || state.startColor,
      selected: state.mode === 'manual' && state.selectedDrones.has(index)
    });
  }
  renderProjectedDrones(rendered, width, height);
  drawSelectionBox();
  ensureFreeMotionLoop();
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

function animationPeakSpeed(scene) {
  if (!scene.bounds) return null;
  if (Number.isFinite(scene._peakSpeed)) return scene._peakSpeed;
  let maximum = 0;
  for (let frame = 1; frame < scene.frames.length; frame += 1) {
    const previous = scene.frames[frame - 1];
    const current = scene.frames[frame];
    const elapsed = current.time - previous.time;
    if (elapsed <= 0) continue;
    for (let drone = 0; drone < current.drones.length; drone += 1) {
      maximum = Math.max(maximum,
        distanceBetween(previous.drones[drone], current.drones[drone], scene.bounds) / elapsed);
    }
  }
  scene._peakSpeed = maximum;
  return maximum;
}

function nearestDistance(drones, selectedIndex, bounds = null) {
  if (drones.length < 2) return Infinity;
  let nearest = Infinity;
  for (let index = 0; index < drones.length; index += 1) {
    if (index !== selectedIndex) nearest = Math.min(nearest, distanceBetween(drones[selectedIndex], drones[index], bounds));
  }
  return nearest;
}

function analyzeSpacing(drones, bounds = null, scene = null) {
  if (drones.length < 2) return { violations: 0, largestNearest: 0, smallestNearest: Infinity };
  const points = drones.map(drone => worldPoint(drone, bounds));
  if (scene?.aiGenerated) {
    const cells = new Map();
    const crowded = new Set();
    let smallestNearest = Infinity;
    const gap = AI_SPACING_METERS;
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const cellX = Math.floor(point.x / gap), cellY = Math.floor(point.y / gap);
      const cellZ = Math.floor(point.z / gap);
      for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) for (let dz = -1; dz <= 1; dz += 1) {
        for (const other of cells.get(`${cellX + dx},${cellY + dy},${cellZ + dz}`) || []) {
          const candidate = points[other];
          const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y, point.z - candidate.z);
          smallestNearest = Math.min(smallestNearest, distance);
          if (distance < gap - 1e-6) { crowded.add(index); crowded.add(other); }
        }
      }
      const key = `${cellX},${cellY},${cellZ}`;
      if (!cells.has(key)) cells.set(key, []);
      cells.get(key).push(index);
    }
    return { violations: crowded.size, largestNearest: 0, smallestNearest };
  }
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
    largestNearest: Math.max(...nearest), smallestNearest: Math.min(...nearest)
  };
}

function wouldIncreaseSpacingViolations(before, after) {
  const scene = state.scenes[state.selectedScene];
  const bounds = scene?.bounds || null;
  return analyzeSpacing(after, bounds, scene).violations > analyzeSpacing(before, bounds, scene).violations;
}

function spacingEditMessage() {
  return state.scenes[state.selectedScene]?.aiGenerated
    ? 'Posisi ditolak: jarak antar drone minimal 2,5 m pada skala konsep.'
    : 'Posisi ditolak: jarak ke drone terdekat harus maks 2 m.';
}

function updateSpacingStatus() {
  const status = q('[data-spacing-status]');
  const scene = state.scenes[state.selectedScene];
  const bounds = scene?.bounds || null;
  if (state.mode === 'manual' && state.selectedDrone >= 0) {
    const nearest = nearestDistance(state.manualDrones, state.selectedDrone, bounds);
    const violation = scene?.aiGenerated ? nearest < AI_SPACING_METERS : nearest > MAX_NEAREST_DISTANCE_METERS;
    status.textContent = `Jarak ke drone terdekat: ${Number.isFinite(nearest) ? `${displaySeconds(nearest)} m${violation ? scene?.aiGenerated ? ' · kurang dari 2,5 m' : ' · melewati batas maks 2 m' : ''}` : 'belum ada drone lain'}`;
    return;
  }
  if (state.mode === 'manual') {
    const report = analyzeSpacing(state.manualDrones, bounds, scene);
    status.textContent = scene?.aiGenerated
      ? report.violations ? `${report.violations} drone terlalu dekat (minimal 2,5 m).` : 'Formasi AI: jarak minimal 2,5 m. Pilih drone untuk mengedit.'
      : report.violations ? `${report.violations} drone melewati batas jarak terdekat maks 2 m.` : 'Jarak ke drone terdekat: pilih drone pada kanvas.';
    return;
  }
  if (state.mode === 'animation') {
    if (state.playing && Date.now() - lastSpacingCheck < 250) return;
    lastSpacingCheck = Date.now();
    const moment = state.time / 100 * scene.duration;
    let index = 0;
    while (index < scene.frames.length - 1 && scene.frames[index].time < moment) index += 1;
    const drones = scene.frames[index].drones;
    if (scene.aiGenerated) {
      const report = analyzeSpacing(drones, scene.bounds, scene);
      status.textContent = report.violations
        ? `${report.violations} drone terlalu dekat pada frame ini (minimal 2,5 m).`
        : 'Frame AI: jarak minimal 2,5 m. Jalur terbang perlu diperiksa Skyfy.';
      return;
    }
    if (!scene.bounds) {
      status.textContent = 'Koordinat asli tidak tersedia untuk pemeriksaan jarak dalam meter.';
      return;
    }
    const report = analyzeSpacing(drones, scene.bounds);
    const peak = animationPeakSpeed(scene);
    const speedWarning = peak > MAX_DRONE_SPEED_MPS + .01
      ? ` Kecepatan sumber hingga ${displaySeconds(peak)} m/detik; batas ekspor 5 m/detik.` : '';
    status.textContent = (report.violations ? `${report.violations} drone melewati batas maks 2 m pada frame ini (jarak terjauh ${displaySeconds(report.largestNearest)} m).` : 'Semua drone pada frame ini berjarak maks 2 m dari tetangga terdekat.') + speedWarning;
    return;
  }
  status.textContent = 'Scene biasa: tetangga maks 2 m. Formasi AI: antar drone minimal 2,5 m.';
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
    ? `${scene.aiGenerated ? state.scenes.indexOf(scene) > 0 ? 'Animasi AI · transisi cahaya' : 'Animasi AI'
      : 'Animasi dari file'} · ${scene.frames.length} frame · ${displaySeconds(scene.duration)} detik`
    : scene.formation === 'manual' ? (scene.catalog3D ? 'Formasi 3D Katalog · gerak 3D bebas' : 'Desain statis · tanpa data gerak')
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
    showToast('Maksimal 1.000 drone di workspace. Untuk jumlah lebih besar, konsultasi dengan tim Skyfy.');
    return;
  }
  if (wouldIncreaseSpacingViolations(existing, [...existing, ...additions])) {
    showToast(spacingEditMessage());
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
    const name = { orbit: 'Orbit', wave: 'Wave', mark: 'Sky mark', heart: 'Hati', star: 'Bintang', spiral: 'Spiral', burst: 'Kembang cahaya', path: 'Bentuk khusus', free: 'Dari nol' }[type];
    state.scenes[state.selectedScene].formation = type;
    delete state.scenes[state.selectedScene].manualDrones;
    delete state.scenes[state.selectedScene].frames;
    delete state.scenes[state.selectedScene].path;
    delete state.scenes[state.selectedScene].colorOverride;
    delete state.scenes[state.selectedScene].bounds;
    delete state.scenes[state.selectedScene].catalog3D;
    delete state.scenes[state.selectedScene]._takeoffGrid;
    if (replacingAnimation) {
      state.scenes[state.selectedScene].duration = 4;
      const durationLabel = q(`[data-scene="${state.selectedScene}"] small`);
      if (durationLabel) durationLabel.textContent = '4 detik';
    }
    state.scenes[state.selectedScene].name = name;
    sceneName.textContent = `Scene ${String(state.selectedScene + 1).padStart(2, '0')} — ${name}`;
    const cardName = q(`[data-scene="${state.selectedScene}"] strong`);
    if (cardName) cardName.textContent = name;
  }
  if (updateScene) { updateSceneSummary(); markDirty(); }
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
  const scene = state.scenes[state.selectedScene];
  const applyCatalogFree3D = scene?.formation === 'manual' && scene.catalog3D && !state.draggingDrone && state.selectedDrones.size === 0;
  const catalogPhase = (state.playing ? (state.time / 100 * scene.duration) : freeMotionTime) * 1.35;
  let best = -1;
  let bestDistance = 14;
  state.manualDrones.forEach((drone, index) => {
    const sample = applyCatalogFree3D ? animateCatalog3DDrone(drone, index, state.manualDrones.length, catalogPhase, scene) : drone;
    const projected = projectDrone(sample, width, height);
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
    const projected = projectDrone({ x: point.x / width, y: point.y / height, z: point.z || 0 }, width, height);
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
    showToast('Maksimal 1.000 drone di workspace. Untuk jumlah lebih besar, konsultasi dengan tim Skyfy.');
    return;
  }
  const dx = Math.min(.025, 1 - Math.max(...state.clipboardDrones.map(drone => drone.x)));
  const dy = Math.min(.035, 1 - Math.max(...state.clipboardDrones.map(drone => drone.y)));
  const pasted = state.clipboardDrones.map(drone => ({ ...drone, x: drone.x + dx, y: drone.y + dy }));
  if (wouldIncreaseSpacingViolations(existing, [...existing, ...pasted])) {
    showToast(spacingEditMessage());
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
    showToast(spacingEditMessage());
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
const touchPoints = new Map();
let touchGesture = null;
let touchPending = null;

function touchMetrics() {
  const [[firstId, first], [secondId, second]] = [...touchPoints].slice(0, 2);
  return {
    ids: [firstId, secondId],
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
    distance: Math.max(1, Math.hypot(second.x - first.x, second.y - first.y))
  };
}

function startTouchGesture() {
  const firstId = touchPoints.keys().next().value;
  if (state.referenceDrag?.pointerId === firstId || state.dragOrigin?.pointerId === firstId || state.selectionBox?.pointerId === firstId) {
    stopDragging({ type: 'pointercancel', pointerId: firstId });
  }
  cameraGesture = null;
  touchPending = null;
  touchGesture = touchMetrics();
  for (const id of touchGesture.ids) if (!canvas.hasPointerCapture(id)) canvas.setPointerCapture(id);
}

function moveTouchGesture() {
  const next = touchMetrics();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const previousCenter = screenPosition({ clientX: touchGesture.x, clientY: touchGesture.y });
  const anchor = unprojectScreen(previousCenter.x, previousCenter.y, 0, width, height);
  state.camera.zoom = Math.max(.35, Math.min(4, state.camera.zoom * next.distance / touchGesture.distance));
  const projected = projectWorldPoint(anchor, width, height);
  const center = screenPosition({ clientX: next.x, clientY: next.y });
  state.camera.panX += center.x - projected.x;
  state.camera.panY += center.y - projected.y;
  touchGesture = next;
  draw();
}

function setView(view) {
  state.view = view;
  qa('[data-view]').forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
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
    violations: analyzeSpacing(state.manualDrones, state.scenes[state.selectedScene].bounds || null, state.scenes[state.selectedScene]).violations
  };
  canvas.setPointerCapture(event.pointerId);
}

canvas.addEventListener('pointerdown', event => {
  canvas.focus({ preventScroll: true });
  if (event.pointerType === 'touch') {
    event.preventDefault();
    touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touchPoints.size >= 2) {
      if (!touchGesture) startTouchGesture();
      else if (!canvas.hasPointerCapture(event.pointerId)) canvas.setPointerCapture(event.pointerId);
      return;
    }
    if (!state.movingReference && !orbitToolActive) {
      const screen = screenPosition(event);
      const hit = state.mode === 'manual' ? findDroneAt(screen) : state.mode === 'formation' ? findFormationAt(screen) : -1;
      if (state.mode === 'manual' && hit >= 0) {
        beginDroneDrag(hit, event, screen);
        return;
      }
      if (state.mode === 'formation' && (state.formation === 'free' || hit >= 0)) {
        touchPending = {
          pointerId: event.pointerId, x: event.clientX, y: event.clientY,
          action: state.formation === 'free' ? 'add' : 'select', hit
        };
        canvas.setPointerCapture(event.pointerId);
        return;
      }
    }
    if (!state.movingReference) {
      cameraGesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, pan: false };
      canvas.setPointerCapture(event.pointerId);
      setView('perspective');
      return;
    }
  }
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
  if (event.pointerType === 'touch' && touchPoints.has(event.pointerId)) {
    touchPoints.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (touchGesture) {
      if (touchGesture.ids.includes(event.pointerId)) moveTouchGesture();
      return;
    }
    if (touchPending?.pointerId === event.pointerId) {
      if (Math.hypot(event.clientX - touchPending.x, event.clientY - touchPending.y) < 6) return;
      cameraGesture = { pointerId: event.pointerId, x: touchPending.x, y: touchPending.y, pan: false };
      touchPending = null;
      setView('perspective');
    }
  }
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
    if (event.type === 'pointercancel' || analyzeSpacing(state.manualDrones, state.scenes[state.selectedScene].bounds || null, state.scenes[state.selectedScene]).violations > state.dragOrigin.violations) {
      state.dragOrigin.positions.forEach(point => {
        const drone = state.manualDrones[point.index];
        drone.x = point.x;
        drone.y = point.y;
        drone.z = point.z || 0;
      });
      if (event.type !== 'pointercancel') showToast(spacingEditMessage());
    }
    updateInspector();
    draw();
  }
  if (state.draggingDrone && canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  state.draggingDrone = false;
  state.dragOrigin = null;
}

function finishTouch(event) {
  if (event.pointerType !== 'touch') return false;
  touchPoints.delete(event.pointerId);
  if (touchGesture) {
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (touchGesture.ids.includes(event.pointerId)) {
      touchGesture = touchPoints.size >= 2 ? touchMetrics() : null;
      if (!touchGesture && touchPoints.size === 1) {
        const [pointerId, point] = touchPoints.entries().next().value;
        cameraGesture = { pointerId, x: point.x, y: point.y, pan: false };
      }
    }
    return true;
  }
  if (touchPending?.pointerId === event.pointerId) {
    const pending = touchPending;
    touchPending = null;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    if (event.type === 'pointerup') {
      if (pending.action === 'add') {
        const position = canvasPosition(event);
        addTemplate('single', position.x, position.y, position.z);
      } else {
        state.manualDrones = formationAsManualDrones();
        state.selectedDrones.clear();
        enterManualMode();
        setSelection([pending.hit]);
        markDirty();
      }
    }
    return true;
  }
  return false;
}

canvas.addEventListener('pointerup', event => { if (!finishTouch(event)) stopDragging(event); });
canvas.addEventListener('pointercancel', event => { if (!finishTouch(event)) stopDragging(event); });
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
  { group: 'Proyek & panduan', keys: ['ctrl+o', 'meta+o'], label: 'Ctrl + O', text: 'Buka proyek', run: () => { if (!hasUnsavedChanges || window.confirm('Perubahan yang belum disimpan akan hilang. Buka proyek lain?')) projectFile.click(); }, global: true },
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
      if (button) {
        button.title = `${shortcut.text} (${shortcut.label})`;
        button.setAttribute('aria-keyshortcuts', shortcut.keys.map(binding => binding.replace('ctrl+', 'Control+').replace('meta+', 'Meta+').replace('shift+', 'Shift+').replace('backspace', 'Backspace').replace('delete', 'Delete').replace('space', 'Space')).join(' '));
      }
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
      if (frames.length >= MAX_ANIMATION_FRAMES) throw new Error('Maksimal 1.000 frame animasi.');
      frames.push({ timestamp, drones: new Map() });
      lastTime = timestamp;
    }
    const id = Number(record.drone_id);
    if (!Number.isSafeInteger(id) || id < 0) throw new Error('drone_id harus bilangan bulat nonnegatif.');
    const frame = frames[frames.length - 1];
    if (frame.drones.has(id)) throw new Error(`drone_id ${id} muncul dua kali pada satu frame.`);
    if (frame.drones.size >= MAX_AI_SHOW_DRONES) throw new Error('Maksimal 3.000 drone per frame animasi.');
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

function parseAlembicFrames(data) {
  const frames = data?.frames;
  if (!Array.isArray(frames) || !frames.length || frames.length > MAX_ANIMATION_FRAMES) throw new Error('Frame Alembic tidak valid.');
  const count = frames[0]?.points?.length;
  if (!Number.isInteger(count) || count < 1 || count > MAX_AI_SHOW_DRONES || count * frames.length > 300_000) throw new Error('Jumlah titik Alembic melebihi batas.');
  let xMin = Infinity; let xMax = -Infinity; let yMin = Infinity; let yMax = -Infinity;
  let lastTime = -1;
  for (const frame of frames) {
    if (!Number.isFinite(frame.time) || frame.time < 0 || frame.time <= lastTime || frame.time > 120 ||
        !Array.isArray(frame.points) || frame.points.length !== count) throw new Error('Waktu atau jumlah drone Alembic tidak konsisten.');
    lastTime = frame.time;
    for (const point of frame.points) {
      if (!Array.isArray(point) || point.length !== 3 || point.some(value => !Number.isFinite(value) || Math.abs(value) > 1_000_000)) throw new Error('Koordinat Alembic tidak valid.');
      xMin = Math.min(xMin, point[0]); xMax = Math.max(xMax, point[0]);
      yMin = Math.min(yMin, point[1]); yMax = Math.max(yMax, point[1]);
    }
  }
  const spanX = xMax - xMin || 1;
  const spanY = yMax - yMin || 1;
  const bounds = { xMin, xMax, yMin, yMax, projection: 'animation' };
  const projected = frames.map(frame => ({ time: frame.time, drones: frame.points.map(point => ({
    x: .12 + (point[0] - xMin) / spanX * .76,
    y: .85 - (point[1] - yMin) / spanY * .7,
    z: point[2], color: '#b9f43c'
  })) }));
  if (frames.length === 1) return { formation: 'manual', duration: 4, manualDrones: projected[0].drones, bounds };
  if (lastTime <= 0) throw new Error('Durasi Alembic harus lebih dari nol.');
  return { formation: 'animation', duration: lastTime, frames: projected, bounds };
}

function installImportedScene(scene, placement) {
  const append = placement === 'append';
  if (append && state.scenes.length >= MAX_SCENES) throw new Error('Maksimal 20 scene.');
  if (!append && hasUserProject && !window.confirm('Buka sebagai desain baru mulai 00:00? Proyek saat ini akan diganti. Simpan proyek dahulu jika ingin menyimpannya.')) return false;
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
  if (importInProgress) {
    fileInput.value = '';
    showToast('Tunggu impor sebelumnya selesai.');
    return;
  }
  const placement = q('[data-import-placement]').value;
  const extension = file.name.split('.').pop().toLowerCase();
  if (!['csv', 'json', 'abc'].includes(extension)) {
    showToast('Gunakan file CSV, JSON, atau ABC.');
    return;
  }
  importInProgress = true;
  const thisImport = ++importToken;
  try {
    if (extension === 'abc') {
      if (file.size > MAX_ABC_BYTES) throw new Error('Maksimal ukuran file ABC 25 MB.');
      const response = await fetch('/api/alembic/import', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file });
      const data = await response.json().catch(() => ({}));
      if (thisImport !== importToken) return;
      if (!response.ok) throw new Error(data.error || 'Server tidak dapat membaca file Alembic.');
      const scene = { name: file.name.slice(0, 80), ...parseAlembicFrames(data) };
      if (!installImportedScene(scene, placement)) return;
      fileLabel.textContent = `${file.name} · ${scene.formation === 'animation' ? `${scene.frames.length} frame animasi` : 'desain statis'}, ${data.frames[0].points.length} drone`;
      markDirty();
      showToast(`Alembic berhasil dibuka mulai 00:00 dengan ${data.frames[0].points.length} drone.`);
      return;
    }
    if (file.size > MAX_FILE_BYTES) throw new Error('Maksimal ukuran file 32 MB.');
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
    importInProgress = false;
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
  if (typeof updateSceneSummary === 'function') updateSceneSummary();
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
  if (typeof updateSceneSummary === 'function') updateSceneSummary();
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
  if (state.playing) stopPlayback();
  state.droneCount = Number(countInput.value);
  state.scenes.forEach(scene => delete scene._takeoffGrid);
  if (generatorSettings) generatorSettings.count = state.droneCount;
  countOutput.textContent = state.droneCount.toLocaleString('id-ID');
  countNumberInput.value = String(state.droneCount);
  updateRangeFill(countInput, state.droneCount, 1, 1000);
  updateAiContext();
  if (state.mode === 'formation') {
    const visibleDrones = state.formation === 'free' ? 0 : state.droneCount;
    q('[data-dialog-drones]').textContent = `${visibleDrones.toLocaleString('id-ID')} drone`;
    q('[data-stage-drone-count]').textContent = visibleDrones.toLocaleString('id-ID');
  }
  markDirty();
  draw();
});
countInput.addEventListener('change', () => { updateSceneSummary(); draw(); });
countNumberInput.addEventListener('change', () => {
  const count = Number(countNumberInput.value);
  if (!Number.isInteger(count) || count < 1 || count > 1000) {
    countNumberInput.value = String(state.droneCount);
    showToast('Pilih jumlah drone antara 1 dan 1.000.');
    return;
  }
  countInput.value = String(count);
  countInput.dispatchEvent(new Event('input'));
  countInput.dispatchEvent(new Event('change'));
});

function updateColorScope() {
  const scene = state.scenes[state.selectedScene];
  const animated = scene?.formation === 'animation';
  q('[data-color-scope]').textContent = animated
    ? scene.colorOverride ? 'Warna kustom untuk seluruh frame scene ini.' : 'Warna dari file. Ubah palet untuk mewarnai seluruh frame.'
    : state.mode === 'manual'
      ? state.selectedDrones.size ? `Warna untuk ${state.selectedDrones.size} drone terpilih.` : 'Warna untuk semua drone. Pilih drone untuk mewarnai sebagian.'
      : 'Warna untuk formasi pada scene aktif.';
  q('[data-restore-file-colors]').hidden = !animated || !scene.colorOverride;
}

function syncColorControls() {
  const palette = state.scenes[state.selectedScene]?.palette || state;
  const selected = state.mode === 'manual' && state.selectedDrones.size === 1 ? state.manualDrones[state.selectedDrone] : null;
  startColor.value = selected ? colorToHex(selected.color) : palette.startColor;
  endColor.value = selected ? colorToHex(selected.color) : palette.endColor;
  gradientToggle.checked = selected ? false : palette.gradient;
  endColor.disabled = false;
  q('[data-color-start-label]').textContent = startColor.value.toUpperCase();
  q('[data-color-end-label]').textContent = endColor.value.toUpperCase();
  updateColorScope();
}

function updateColors() {
  state.startColor = startColor.value;
  state.endColor = endColor.value;
  state.gradient = gradientToggle.checked;
  endColor.disabled = false;
  const scene = state.scenes[state.selectedScene];
  scene.palette = paletteSettings();
  scene.customColored = true;
  if (scene.formation === 'manual') {
    const indices = state.selectedDrones.size ? selectionIndices() : state.manualDrones.map((_, index) => index);
    indices.forEach((index, order) => {
      state.manualDrones[index].color = mixColor(state.startColor, state.endColor, state.gradient ? order / Math.max(1, indices.length - 1) : 0);
    });
    scene.manualDrones = state.manualDrones;
    if (typeof buildTakeoffGridDrones === 'function' && scene._takeoffGrid?.length === state.manualDrones.length) {
      scene._takeoffGrid = buildTakeoffGridDrones(state.manualDrones, '3d');
    }
    updateInspector();
  } else if (scene.formation === 'animation') scene.colorOverride = true;
  q('[data-color-start-label]').textContent = state.startColor.toUpperCase();
  q('[data-color-end-label]').textContent = state.endColor.toUpperCase();
  updateColorScope();
  markDirty();
  draw();
}

startColor.addEventListener('input', updateColors);
endColor.addEventListener('input', () => {
  if (!gradientToggle.checked && !(state.mode === 'manual' && state.selectedDrones.size === 1)) {
    gradientToggle.checked = true;
  }
  updateColors();
});
gradientToggle.addEventListener('change', updateColors);

function applyColorPreset(preset) {
  const scene = state.scenes[state.selectedScene];
  qa('[data-color-preset]').forEach(btn => btn.classList.toggle('active', btn.dataset.colorPreset === preset));
  if (preset === 'blender') {
    startColor.value = DEFAULT_BLENDER_COLOR;
    gradientToggle.checked = false;
    updateColors();
    showToast('Warna polos Blender diaktifkan (#E8EEF2).');
    return;
  }
  if (preset === 'theme') {
    if (scene) scene.customColored = false;
    if (scene?.formation === 'manual' && state.manualDrones.some(drone => drone.themeColor)) {
      const themeStart = scene.themePalette?.[0] || '#ffd15e';
      const themeEnd = scene.themePalette?.[1] || '#52c7ff';
      state.startColor = themeStart;
      state.endColor = themeEnd;
      state.gradient = true;
      startColor.value = themeStart;
      endColor.value = themeEnd;
      gradientToggle.checked = true;
      scene.palette = paletteSettings();
      const indices = state.selectedDrones.size ? selectionIndices() : state.manualDrones.map((_, index) => index);
      indices.forEach(index => {
        const drone = state.manualDrones[index];
        if (drone.themeColor) drone.color = drone.themeColor;
      });
      scene.manualDrones = state.manualDrones;
      if (scene._takeoffGrid?.length === state.manualDrones.length) {
        scene._takeoffGrid = buildTakeoffGridDrones(state.manualDrones, '3d');
      }
      q('[data-color-start-label]').textContent = state.startColor.toUpperCase();
      q('[data-color-end-label]').textContent = state.endColor.toUpperCase();
      updateInspector();
      updateColorScope();
      markDirty();
      draw();
      showToast('Permainan warna tema 3D diaktifkan.');
      return;
    }
    startColor.value = '#b9f43c';
    endColor.value = '#52c7ff';
    gradientToggle.checked = true;
    updateColors();
    if (scene) scene.customColored = false;
    draw();
    showToast('Permainan warna tema 3D diaktifkan.');
    return;
  }
  const presets = {
    gold: ['#ffd15e', '#ff8c3b', 'Warna Emas diterapkan.'],
    cyan: ['#52c7ff', '#2868ff', 'Warna Biru diterapkan.'],
    red: ['#ff4757', '#ffd15e', 'Warna Merah diterapkan.'],
    lime: ['#b9f43c', '#52c7ff', 'Warna Hijau diterapkan.']
  };
  const chosen = presets[preset];
  if (!chosen) return;
  startColor.value = chosen[0];
  endColor.value = chosen[1];
  updateColors();
  showToast(chosen[2]);
}

qa('[data-color-preset]').forEach(button => {
  button.addEventListener('click', () => applyColorPreset(button.dataset.colorPreset));
});
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
  state.scenes.forEach(scene => delete scene._takeoffGrid);
  updateSceneSummary();
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
    const violationsBefore = analyzeSpacing(state.manualDrones, bounds, state.scenes[state.selectedScene]).violations;
    drone[key] = value / factor;
    if (analyzeSpacing(state.manualDrones, bounds, state.scenes[state.selectedScene]).violations > violationsBefore) {
      drone[key] = previous;
      updateInspector();
      showToast(spacingEditMessage());
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
  const scene = state.scenes[state.selectedScene];
  if (scene?._takeoffGrid?.length === state.manualDrones.length) {
    scene._takeoffGrid = buildTakeoffGridDrones(state.manualDrones, '3d');
  }
  syncColorControls();
  markDirty();
  draw();
});
timeRange.addEventListener('input', updateTime);
timeRange.addEventListener('pointerdown', () => { isTimelineScrubbing = true; });
if (typeof window !== 'undefined') {
  window.addEventListener('pointerup', () => { isTimelineScrubbing = false; });
  window.addEventListener('pointercancel', () => { isTimelineScrubbing = false; });
}
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
  if (typeof syncSceneOrderButtons === 'function') syncSceneOrderButtons();
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
  normalizeMotionTimings();
  sceneTrack.querySelectorAll('.scene-card').forEach((card, index) => {
    const duration = card.querySelector('small');
    if (duration) duration.textContent = `${displaySeconds(state.scenes[index].duration)} detik`;
  });
  q('[data-dialog-scenes]').textContent = `${state.scenes.length} scene`;
  q('[data-dialog-duration]').textContent = `${displaySeconds(totalDuration())} detik`;
  q('[data-duration]').textContent = formatPlaybackTime(totalDuration());
  q('[data-stage-scenes]').textContent = String(state.scenes.length).padStart(2, '0');
  q('[data-stage-duration]').textContent = `${displaySeconds(totalDuration())}s`;
  currentTime.textContent = formatPlaybackTime(totalDuration() * Number(timeRange.value) / 100);
}

const generatedShows = Object.freeze({
  wedding: { palette: ['#ffe5aa', '#ff77b7'], scenes: [['Hati', 'heart'], ['Cahaya berputar', 'orbit'], ['Penutup cahaya', 'burst']] },
  festival: { palette: ['#52c7ff', '#d376ff'], scenes: [['Gelombang', 'wave'], ['Spiral', 'spiral'], ['Puncak cahaya', 'burst']] },
  brand: { palette: ['#b9f43c', '#52c7ff'], scenes: [['Pembuka', 'mark'], ['Orbit', 'orbit'], ['Gelombang', 'wave']] },
  celebration: { palette: ['#fff39a', '#fa805f'], scenes: [['Bintang', 'star'], ['Gerak bersama', 'wave'], ['Kembang cahaya', 'burst']] }
});

const occasionNames = Object.freeze({ wedding: 'Pernikahan', festival: 'Festival', brand: 'Peluncuran', celebration: 'Perayaan' });

function updateAiContext() {
  aiContext.hidden = !generatorSettings;
  if (generatorSettings) aiContext.textContent = `Pilihan AI: ${occasionNames[generatorSettings.occasion]} · ${generatorSettings.count} drone · ${generatorSettings.duration} detik · ${generatorSettings.name}.`;
}

function isAiFeatureLocked() {
  return q('[data-ai-section]')?.dataset.aiLocked !== 'false';
}

function updateGeneratorSubmit() {
  const locked = isAiFeatureLocked();
  const usesAi = !locked && Boolean(generatorForm.elements.prompt.value.trim() || aiReferenceFile.files?.length);
  q('[data-generator-submit]').textContent = usesAi ? 'Buat desain dari arahan' : 'Buat dan lihat hasil';
  q('[data-generator-help]').textContent = locked
    ? 'Pilih acara untuk membuat tiga scene yang bisa diedit.'
    : usesAi
      ? 'Studio memakai pilihan acara, jumlah drone, durasi, dan arahan Anda.'
      : 'Tanpa prompt, Studio membuat tiga scene yang bisa diedit.';
}

function openGenerator() {
  if (!isAiFeatureLocked() && aiPromptInput.value.trim()) generatorForm.elements.prompt.value = aiPromptInput.value;
  updateGeneratorSubmit();
  generatorDialog.showModal();
  generatorForm.elements.name.focus();
}

q('[data-open-generator]')?.addEventListener('click', openGenerator);
q('[data-banner-generator]')?.addEventListener('click', openGenerator);
q('[data-close-generator]').addEventListener('click', () => generatorDialog.close());
generatorForm.elements.prompt.addEventListener('input', updateGeneratorSubmit);
generatorForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = String(generatorForm.elements.name.value).trim();
  const occasion = String(generatorForm.elements.occasion.value);
  const count = Number(generatorForm.elements.droneCount.value);
  const duration = Number(generatorForm.elements.duration.value);
  const preset = Object.hasOwn(generatedShows, occasion) ? generatedShows[occasion] : null;
  if (!name || name.length > 48 || !preset || !Number.isInteger(count) || count < 1 || count > 1000 || ![12, 24, 36].includes(duration)) return;
  const prompt = isAiFeatureLocked() ? '' : String(generatorForm.elements.prompt.value).trim();
  if (!isAiFeatureLocked() && (prompt || aiReferenceFile.files?.length)) {
    generatorSettings = { name, occasion, duration, count };
    updateAiContext();
    aiPromptInput.value = prompt;
    generatorDialog.close();
    aiForm.requestSubmit();
    return;
  }
  if (hasUserProject && !window.confirm('Rancangan baru akan mengganti seluruh scene proyek saat ini. Simpan proyek dahulu bila ingin menyimpannya. Lanjutkan?')) return;
  generatorSettings = { name, occasion, duration, count };
  updateAiContext();

  stopPlayback();
  clearWorkspaceTool();
  const palette = { startColor: preset.palette[0], endColor: preset.palette[1], gradient: true };
  state.scenes = preset.scenes.map(([sceneName, formation]) => ({ name: sceneName, formation, duration: duration / 3, palette: { ...palette } }));
  state.selectedScene = -1;
  state.manualDrones = [];
  state.clipboardDrones = [];
  state.droneCount = count;
  state.groundVisible = true;
  projectName.value = name;
  countInput.value = String(count);
  countNumberInput.value = String(count);
  countOutput.textContent = count.toLocaleString('id-ID');
  updateRangeFill(countInput, count, 1, 1000);
  groundToggle.checked = true;
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  chooseScene(0);
  markDirty();
  starterBanner.hidden = true;
  generatorDialog.close();
  showToast('Rancangan awal siap. Tekan Uji animasi untuk melihat seluruh scene.');
});

function rotate3DPoint(u, v, w, rx = 0, ry = 0, rz = 0) {
  let x1 = u, y1 = v, z1 = w;
  if (rx) {
    const c = Math.cos(rx), s = Math.sin(rx);
    const ny = y1 * c - z1 * s, nz = y1 * s + z1 * c;
    y1 = ny; z1 = nz;
  }
  if (ry) {
    const c = Math.cos(ry), s = Math.sin(ry);
    const nx = x1 * c + z1 * s, nz = -x1 * s + z1 * c;
    x1 = nx; z1 = nz;
  }
  if (rz) {
    const c = Math.cos(rz), s = Math.sin(rz);
    const nx = x1 * c - y1 * s, ny = x1 * s + y1 * c;
    x1 = nx; y1 = ny;
  }
  return { u: x1, v: y1, w: z1 };
}

function buildCatalog3DSceneDrones(shapeId, count, startColor, endColor) {
  const pts = [];
  // `extra` menyimpan data gerak lokal (engsel tutup, kibaran bendera, putaran bianglala).
  const push = (u, v, w, color = startColor, part = null, extra = null) => {
    const item = {
      u: Math.max(-.98, Math.min(.98, u)),
      v: Math.max(-.95, Math.min(.95, v)),
      w: Math.max(-.98, Math.min(.98, w)),
      color,
      part
    };
    if (extra) Object.assign(item, extra);
    pts.push(item);
    return item;
  };
  // Hash deterministik agar konfeti/gelembung selalu sama untuk desain yang sama.
  const hash01 = n => {
    const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const addRing3D = (n, cu, cv, cw, ru, rw, rx, ry, rz, color, part = null) => {
    for (let i = 0; i < n; i += 1) {
      const a = (i / n) * Math.PI * 2;
      const p = rotate3DPoint(Math.cos(a) * ru, 0, Math.sin(a) * rw, rx, ry, rz);
      push(cu + p.u, cv + p.v, cw + p.w, color, part);
    }
  };
  const addRectRing3D = (n, cu, cv, cw, hu, hw, rx = 0, ry = 0, rz = 0, color = startColor, part = null) => {
    for (let i = 0; i < n; i += 1) {
      const t = (i / n) * 4;
      const edge = Math.floor(t) % 4;
      const frac = t - Math.floor(t);
      let lu = 0, lw = 0;
      if (edge === 0) { lu = (-1 + 2 * frac) * hu; lw = -hw; }
      else if (edge === 1) { lu = hu; lw = (-1 + 2 * frac) * hw; }
      else if (edge === 2) { lu = (1 - 2 * frac) * hu; lw = hw; }
      else { lu = -hu; lw = (1 - 2 * frac) * hw; }
      const p = rotate3DPoint(lu, 0, lw, rx, ry, rz);
      push(cu + p.u, cv + p.v, cw + p.w, color, part);
    }
  };
  const addTorus3D = (n, cu, cv, cw, majorR, minorR, rx, ry, rz, coils, color1, color2 = color1) => {
    for (let i = 0; i < n; i += 1) {
      const t = i / n;
      const a = t * Math.PI * 2;
      const b = t * Math.PI * 2 * coils;
      const r = majorR + Math.cos(b) * minorR;
      const p = rotate3DPoint(Math.cos(a) * r, Math.sin(b) * minorR, Math.sin(a) * r, rx, ry, rz);
      push(cu + p.u, cv + p.v, cw + p.w, i % 2 === 0 ? color1 : color2);
    }
  };
  const addStructuredSphere3D = (n, cu, cv, cw, ru, rv, rw, rings, meridians, color1, color2 = color1) => {
    const ringBudget = Math.round(n * .58);
    const merBudget = n - ringBudget;
    for (let r = 0; r < rings; r += 1) {
      const lat = ((r + .5) / rings - .5) * Math.PI * .84;
      const countRing = Math.max(4, Math.round(ringBudget / rings));
      const cosLat = Math.cos(lat), sinLat = Math.sin(lat);
      const phaseOffset = (r % 2) * (Math.PI / countRing);
      for (let i = 0; i < countRing; i += 1) {
        const a = (i / countRing) * Math.PI * 2 + phaseOffset;
        push(cu + Math.cos(a) * cosLat * ru, cv + sinLat * rv, cw + Math.sin(a) * cosLat * rw, r % 2 === 0 ? color1 : color2);
      }
    }
    for (let m = 0; m < meridians; m += 1) {
      const lon = ((m + .35) / meridians) * Math.PI;
      const countMer = Math.max(6, Math.round(merBudget / meridians));
      const merOffset = ((m + .5) / meridians) * (Math.PI * 2 / countMer);
      for (let i = 0; i < countMer; i += 1) {
        const a = ((i + .5) / countMer) * Math.PI * 2 + merOffset;
        push(cu + Math.cos(lon) * Math.sin(a) * ru, cv + Math.cos(a) * rv, cw + Math.sin(lon) * Math.sin(a) * rw, color2);
      }
    }
  };
  const addStructuredLathe3D = (n, cu, v0, v1, cw, radiusFn, rings, ribs, colorFn, twist = 0) => {
    const ringBudget = Math.round(n * .56);
    const ribBudget = n - ringBudget;
    for (let r = 0; r < rings; r += 1) {
      const t = rings <= 1 ? .5 : r / (rings - 1);
      const v = v0 + (v1 - v0) * t;
      const rad = radiusFn(t);
      const ru = Math.max(.022, typeof rad === 'number' ? rad : rad.ru);
      const rw = Math.max(.022, typeof rad === 'number' ? rad : rad.rw);
      const perRing = Math.max(4, Math.round(ringBudget / rings));
      const ringPhase = (r % 2) * (Math.PI / perRing);
      for (let i = 0; i < perRing; i += 1) {
        const a = (i / perRing) * Math.PI * 2 + t * twist + ringPhase;
        push(cu + Math.cos(a) * ru, v, cw + Math.sin(a) * rw, colorFn(t, a));
      }
    }
    for (let b = 0; b < ribs; b += 1) {
      const baseA = ((b + .5) / ribs) * Math.PI * 2;
      const perRib = Math.max(4, Math.round(ribBudget / ribs));
      for (let i = 0; i < perRib; i += 1) {
        const t = ((i + .5) / perRib);
        const v = v0 + (v1 - v0) * t;
        const rad = radiusFn(t);
        const ru = Math.max(.024, typeof rad === 'number' ? rad : rad.ru);
        const rw = Math.max(.024, typeof rad === 'number' ? rad : rad.rw);
        const a = baseA + t * twist;
        push(cu + Math.cos(a) * ru, v, cw + Math.sin(a) * rw, colorFn(t, a));
      }
    }
  };
  const addHeart3D = (n, cu, cv, cw, scaleU, scaleV, depthW, rotY, color1, color2) => {
    const shells = [
      { s: 1.00, w: 0, weight: .28, c: color1 },
      { s: .82, w: .55, weight: .18, c: color1 },
      { s: .82, w: -.55, weight: .18, c: color1 },
      { s: .56, w: .88, weight: .12, c: color2 },
      { s: .56, w: -.88, weight: .12, c: color2 },
      { s: .28, w: 1.0, weight: .06, c: '#ffffff' },
      { s: .28, w: -1.0, weight: .06, c: '#ffffff' }
    ];
    for (const sh of shells) {
      const cnt = Math.max(6, Math.round(n * sh.weight));
      for (let i = 0; i < cnt; i += 1) {
        const t = ((i + .25) / cnt) * Math.PI * 2;
        const hu = Math.pow(Math.sin(t), 3) * scaleU * sh.s;
        const hv = ((13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16) * scaleV * sh.s;
        const hw = sh.w * depthW * (.7 + .3 * Math.sin(t * 2));
        const p = rotate3DPoint(hu, hv, hw, 0, rotY, 0);
        push(cu + p.u, cv + p.v, cw + p.w, sh.c);
      }
    }
  };

  // --- Standar Komponen Semi-3D & Koreografi Asinkron (Mengikuti Arsitektur drone_show_4_points) ---
  // 1. Bola Kaca 3D Berisi Penuh Menghadap Penonton (Siluet Lingkar Luar + Kubah Depan/Belakang + Busur Kilau Kaca Putih Neon di Kanan Atas)
  const addFilledGlassSphere3D = (budget, cu, cv, cw, r, colRim, colFront, colBack, hasCap = true, part = null, extra = null) => {
    const nRim = Math.max(10, Math.round(budget * .34));
    const nGlare = Math.max(6, Math.round(budget * .16));
    const nCap = hasCap ? 4 : 0;
    const nDomes = Math.max(4, budget - nRim - nGlare - nCap);
    const emit = (u, v, w, col) => push(u, v, w, col, part, extra ? { ...extra, lu: u, lv: v, lw: w } : null);
    for (let i = 0; i < nRim; i += 1) {
      const a = (i / nRim) * Math.PI * 2;
      emit(cu + Math.cos(a) * r, cv + Math.sin(a) * r, cw, colRim);
    }
    if (hasCap) {
      for (let i = 0; i < nCap; i += 1) {
        const uOff = ((i / (nCap - 1)) - .5) * r * .36;
        emit(cu + uOff, cv + r * 1.08, cw + .02, '#ffd15e');
      }
    }
    const nInG = Math.floor(nGlare * .6);
    const nOutG = nGlare - nInG;
    for (let i = 0; i < nInG; i += 1) {
      const f = nInG <= 1 ? .5 : i / (nInG - 1);
      const a = (18 + f * 60) * Math.PI / 180;
      const pr = r * .58;
      const pw = Math.sqrt(Math.max(0, r * r - pr * pr));
      emit(cu + Math.cos(a) * pr, cv + Math.sin(a) * pr, cw + pw * 1.15, '#ffffff');
    }
    for (let i = 0; i < nOutG; i += 1) {
      const f = nOutG <= 1 ? .5 : i / (nOutG - 1);
      const a = (24 + f * 48) * Math.PI / 180;
      const pr = r * .74;
      const pw = Math.sqrt(Math.max(0, r * r - pr * pr));
      emit(cu + Math.cos(a) * pr, cv + Math.sin(a) * pr, cw + pw * 1.15, '#ffffff');
    }
    emit(cu, cv, cw + r * 1.1, colFront);
    emit(cu, cv, cw - r * 1.1, colBack);
    const rem = Math.max(4, nDomes - 2);
    const nF1 = Math.round(rem * .34), nF2 = Math.round(rem * .22), nB1 = Math.round(rem * .28);
    const nB2 = Math.max(2, rem - nF1 - nF2 - nB1);
    const addLat = (cnt, fracR, zSign, col, phaseOff) => {
      const pr = r * fracR;
      const pw = zSign * Math.sqrt(Math.max(0, r * r - pr * pr)) * 1.1;
      for (let i = 0; i < cnt; i += 1) {
        const a = (i / cnt) * Math.PI * 2 + phaseOff;
        const deg = ((a * 180 / Math.PI) % 360 + 360) % 360;
        const useA = (zSign > 0 && deg >= 15 && deg <= 80 && fracR > .48) ? a + Math.PI : a;
        const useR = (zSign > 0 && deg >= 15 && deg <= 80 && fracR > .48) ? pr * .88 : pr;
        emit(cu + Math.cos(useA) * useR, cv + Math.sin(useA) * useR, cw + pw, col);
      }
    };
    addLat(nF1, .76, 1, colFront, .15);
    addLat(nF2, .44, 1, colFront, .55);
    addLat(nB1, .72, -1, colBack, .35);
    addLat(nB2, .40, -1, colBack, .85);
  };

  // 2. Gantungan Hati 3D Mengkilap dengan Kilau Kaca Putih di Pipi Kanan & Ayunan Maju-Mundur (depth_swing)
  const addGlossyHeart3D = (cu, cv, cw, scale, colRim = '#ff2244', colFront = '#ff4b6e', colBack = '#991b36', hingeV = null) => {
    const pivV = hingeV !== null ? hingeV : cv + .28 * scale;
    const heartPt = (t, sc) => {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      return { u: cu + (x / 16) * .24 * scale * sc, v: cv + ((y - 2) / 16) * .24 * scale * sc };
    };
    const emitH = (u, v, w, col) => push(u, v, w, col, 'depth_swing', { lu: u, lv: v, lw: w, spinOU: cu, hingeV: pivV, spinA: 0 });
    for (let i = 0; i < 32; i += 1) {
      const p = heartPt((i / 32) * Math.PI * 2, 1.0);
      emitH(p.u, p.v, cw, colRim);
    }
    for (const [cnt, sc, zw, col] of [[18, .72, cw + .13 * scale, colRim], [12, .46, cw + .20 * scale, colFront], [8, .24, cw + .25 * scale, colFront]]) {
      for (let i = 0; i < cnt; i += 1) {
        const p = heartPt((i / cnt) * Math.PI * 2 + sc, sc);
        emitH(p.u, p.v, zw, col);
      }
    }
    for (let i = 0; i < 16; i += 1) {
      const p = heartPt((i / 16) * Math.PI * 2, .60);
      emitH(p.u, p.v, cw - .15 * scale, colBack);
    }
    // Busur pantulan silau kaca putih neon di pipi kanan hati
    for (let i = 0; i < 8; i += 1) {
      const p = heartPt(.35 + (i / 7) * .90, .64);
      emitH(p.u, p.v, cw + .24 * scale, '#ffffff');
    }
    for (let i = 0; i < 4; i += 1) {
      const p = heartPt(.45 + (i / 3) * .68, .46);
      emitH(p.u, p.v, cw + .27 * scale, '#ffffff');
    }
  };

  // 3. Empat Bola Ornamen Kecil Satelit di 4 Sudut yang Mengayun Asinkron Seperti Lonceng (bell_swing)
  const addCornerSatellites3D = (sats) => {
    const freqs = [1.75, 2.15, 2.35, 1.95];
    for (let s = 0; s < sats.length; s += 1) {
      const sat = sats[s];
      const r = sat.r || .125;
      const pivotV = sat.cv + r * 1.25;
      const freq = sat.freq || freqs[s % freqs.length];
      const phase = sat.phase !== undefined ? sat.phase : s * 1.65;
      const pushSat = (u, v, w, col) => {
        push(u, v, w, col, 'bell_swing', { lu: u, lv: v, lw: w, spinOU: sat.cu, hingeV: pivotV, spinA: phase, spinFreq: freq });
      };
      for (let i = 0; i < 3; i += 1) {
        pushSat(sat.cu + (i - 1) * .024, sat.cv + r * 1.06, sat.cw, '#ffd15e');
      }
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * Math.PI * 2;
        pushSat(sat.cu + Math.cos(a) * r, sat.cv + Math.sin(a) * r, sat.cw, sat.colMain);
      }
      pushSat(sat.cu + r * .35, sat.cv + r * .35, sat.cw + r * .85, '#ffffff');
      pushSat(sat.cu + r * .20, sat.cv + r * .48, sat.cw + r * .85, '#ffffff');
      for (let i = 0; i < 8; i += 1) {
        const a = (i / 8) * Math.PI * 2;
        pushSat(sat.cu + Math.cos(a) * r * .60, sat.cv + Math.sin(a) * r * .60, sat.cw + r * .68, i % 2 === 0 ? sat.colMain : sat.colSub);
      }
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2 + .3;
        pushSat(sat.cu + Math.cos(a) * r * .56, sat.cv + Math.sin(a) * r * .56, sat.cw - r * .65, sat.colSub);
      }
    }
  };

  // 4. Empat Kembang Api Radial Kecil di 4 Sudut yang Mekar-Menguncup Bergantian (burst_pulse)
  const addCornerFireworks3D = (col1 = '#ffd15e', col2 = '#ff2244', rBurst = .115) => {
    const fwCenters = [
      { u: -.74, v: .56, w: -.10 },
      { u: .74, v: .56, w: .10 },
      { u: -.74, v: -.56, w: .10 },
      { u: .74, v: -.56, w: -.10 }
    ];
    for (let f = 0; f < fwCenters.length; f += 1) {
      const fw = fwCenters[f];
      const phi = f * 1.45;
      const emitFW = (u, v, w, col) => push(u, v, w, col, 'burst_pulse', { lu: u, lv: v, lw: w, spinOU: fw.u, hingeV: fw.v, spinA: phi });
      emitFW(fw.u, fw.v, fw.w + .08, '#ffffff');
      for (let ray = 0; ray < 8; ray += 1) {
        const a = (ray / 8) * Math.PI * 2 + f * .2;
        const col = ray % 2 === 0 ? col1 : col2;
        emitFW(fw.u + Math.cos(a) * rBurst * .48, fw.v + Math.sin(a) * rBurst * .48, fw.w + .04, '#ffffff');
        emitFW(fw.u + Math.cos(a) * rBurst * .88, fw.v + Math.sin(a) * rBurst * .88, fw.w, col);
        if (ray % 2 === 0) {
          emitFW(fw.u + Math.cos(a) * rBurst * 1.15, fw.v + Math.sin(a) * rBurst * 1.15, fw.w - .04, col1);
        }
      }
    }
  };

  // 5. Dua Pilar Spiral Double-Helix / Candy Cane 3D di Kiri & Kanan (helix_flow)
  const addCandyHelixColumns3D = (nSteps, v0, v1, uBase, uTaper, radU, colA, colB, colRung = '#ffd15e') => {
    for (const side of [-1, 1]) {
      for (let i = 0; i < nSteps; i += 1) {
        const t = i / Math.max(1, nSteps - 1);
        const v = v0 + t * (v1 - v0);
        const axisU = side * (uBase - t * uTaper);
        const theta = t * Math.PI * 3.4 + (side < 0 ? 0 : Math.PI * .5);
        const uA = axisU + Math.sin(theta) * radU;
        const wA = Math.cos(theta) * .20;
        push(uA, v, wA, colA, 'helix_flow', { lu: uA, lv: v, lw: wA, spinOU: axisU, spinR: radU, spinA: theta });
        const thB = theta + Math.PI;
        const uB = axisU + Math.sin(thB) * radU;
        const wB = Math.cos(thB) * .20;
        push(uB, v, wB, colB, 'helix_flow', { lu: uB, lv: v, lw: wB, spinOU: axisU, spinR: radU, spinA: thB });
        if (i % 3 === 1) {
          push(axisU, v, 0, colRung, 'helix_flow', { lu: axisU, lv: v, lw: 0, spinOU: axisU, spinR: 0, spinA: theta });
        }
      }
    }
  };

  // 6. Pita Satin Volumetrik 3D dengan Ekor Melambai Asimetris (ribbon_wave)
  const addVolumetricBow3D = (cu, cv, cw, scale, colLoop = '#ff3b5c', colKnot = '#ffd15e') => {
    addRing3D(10, cu, cv, cw + .04, .042 * scale, .042 * scale, .22, 0, 0, colKnot);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 12; i += 1) {
        const f = i / 11;
        const a = f * Math.PI;
        const lu = cu + side * (.035 + Math.sin(a) * .20) * scale;
        const lv = cv + (Math.sin(a * 2) * .075 + f * .03) * scale;
        const lw = cw + .12 * Math.sin(a);
        push(lu, lv, lw, colLoop, 'ribbon_wave', { lu, lv, lw, distFromPole: f * .6 });
      }
      for (let i = 0; i < 9; i += 1) {
        const f = i / 8;
        const tu = cu + side * (.05 + f * .22) * scale;
        const tv = cv - (.02 + f * .18 - Math.sin(f * Math.PI) * .025) * scale;
        const tw = cw + .14 - f * .07;
        push(tu, tv, tw, f > .8 ? colKnot : colLoop, 'ribbon_wave', { lu: tu, lv: tv, lw: tw, distFromPole: .3 + f * .7 });
      }
    }
  };

  if (shapeId === 'brand_shield') {
    // 3D Heraldic Crest Shield (Semi-3D Dome + Neon White Glass Glare) + 3D "S" Monogram (depth_swing) + Crown Star + 2 Spiral Helix + 4 Corner Fireworks
    const shieldPoint = (s, scale = 1) => {
      let u = 0, v = 0;
      if (s < .24) {
        const t = s / .24;
        u = (-1 + 2 * t) * .46;
        v = .46 + Math.sin(t * Math.PI * 2) * .04 - Math.abs(t - .5) * .035;
      } else if (s < .62) {
        const t = (s - .24) / .38;
        u = t < .38 ? .46 * (1 - t * .08) : .44 * Math.cos(((t - .38) / .62) * Math.PI * .5);
        v = .44 - t * 1.08;
      } else {
        const t = 1 - (s - .62) / .38;
        u = -(t < .38 ? .46 * (1 - t * .08) : .44 * Math.cos(((t - .38) / .62) * Math.PI * .5));
        v = .44 - t * 1.08;
      }
      return { u: u * scale, v: v * scale };
    };
    const shells = [
      { scale: 1.00, w: 0, n: 54, c: '#ffd15e' },
      { scale: .86, w: .16, n: 44, c: '#b9f43c' },
      { scale: .86, w: -.16, n: 44, c: '#38bdf8' },
      { scale: .68, w: .26, n: 34, c: '#52c7ff' }
    ];
    for (const sh of shells) {
      for (let i = 0; i < sh.n; i += 1) {
        const p = shieldPoint(i / sh.n, sh.scale);
        push(p.u, p.v, sh.w, sh.c);
      }
    }
    // Upper-Right Neon White 3D Glass Glare along the right shield bevel
    for (let i = 0; i < 14; i += 1) {
      const p = shieldPoint(.18 + (i / 13) * .16, .76);
      push(p.u, p.v, .28, '#ffffff');
    }
    // 3D "S" Monogram inside the shield (front and back relief, depth_swing)
    for (const wLayer of [.34, -.26]) {
      for (let i = 0; i < 34; i += 1) {
        const t = i / 33;
        let u = 0, v = 0;
        if (t <= .5) {
          const a = (.18 + (t / .5) * 1.32) * Math.PI;
          u = Math.cos(a) * .15;
          v = .10 + Math.sin(a) * .125;
        } else {
          const a = (.5 - ((t - .5) / .5) * 1.32) * Math.PI;
          u = Math.cos(a) * .15;
          v = -.15 + Math.sin(a) * .125;
        }
        push(u, v, wLayer, '#ffffff', 'depth_swing', { lu: u, lv: v, lw: wLayer, spinOU: 0, hingeV: .32, spinA: 0 });
      }
    }
    // 3D 5-Pointed Crown Star emblem above shield
    const starVerts = Array.from({ length: 10 }, (_, k) => {
      const a = Math.PI / 2 + (k * Math.PI) / 5;
      const r = k % 2 === 0 ? .14 : .06;
      return { u: Math.cos(a) * r, v: .72 + Math.sin(a) * r };
    });
    for (let k = 0; k < 10; k += 1) {
      const p1 = starVerts[k], p2 = starVerts[(k + 1) % 10];
      for (let s = 0; s < 3; s += 1) {
        const t = s / 3;
        push(p1.u + (p2.u - p1.u) * t, p1.v + (p2.v - p1.v) * t, (s % 2 === 0 ? .08 : -.06), '#ffd15e');
      }
    }
    addCandyHelixColumns3D(16, -.62, .48, .72, .08, .08, '#52c7ff', '#b9f43c', '#ffd15e');
    addCornerFireworks3D('#ffd15e', '#52c7ff', .11);
  } else if (shapeId === 'brand_trophy') {
    // 3D Trophy Cup (with Neon White Glass Glare) + Pedestal + 2 Symmetrical 3D Handles + 3D Victory Star + 2 Helix Columns + 4 Corner Fireworks
    addStructuredLathe3D(64, 0, -.80, -.52, 0, t => .38 - t * .12, 3, 6, () => '#52c7ff');
    addStructuredLathe3D(42, 0, -.52, -.14, 0, t => .11 + .04 * Math.cos(t * Math.PI), 3, 5, () => '#ffd15e');
    addStructuredLathe3D(135, 0, -.14, .46, 0, t => .13 + Math.pow(t, .72) * .34, 6, 8, t => t > .80 ? '#ffffff' : '#ffd15e', .22);
    // Upper-Right Neon White 3D Glass Glare Arc on Trophy Bowl
    for (let i = 0; i < 16; i += 1) {
      const f = i / 15;
      const v = .04 + f * .36;
      const r = (.13 + Math.pow((v + .14) / .60, .72) * .34) * .78;
      const a = (22 + f * 35) * Math.PI / 180;
      push(Math.cos(a) * r, v, Math.sin(a) * r + .14, '#ffffff');
    }
    // Symmetrical 3D Cup Handles
    for (const dir of [-1, 1]) {
      for (const wOff of [-.06, .06]) {
        for (let i = 0; i < 18; i += 1) {
          const t = i / 17;
          const a = t * Math.PI;
          const rimR = .13 + Math.pow(.15 + t * .75, .72) * .34;
          const u = dir * (rimR + Math.sin(a) * .20);
          const v = -.04 + t * .44;
          push(u, v, wOff, '#52c7ff');
        }
      }
    }
    // 3D 5-Pointed Victory Star crowning the Trophy Cup (depth_swing)
    for (const [wOff, scale, col] of [[0, 1.0, '#ffd15e'], [.09, .64, '#ffffff']]) {
      const cnt = scale === 1.0 ? 25 : 15;
      for (let i = 0; i < cnt; i += 1) {
        const seg = (i / cnt) * 10;
        const k = Math.floor(seg);
        const frac = seg - k;
        const a1 = Math.PI / 2 + k * Math.PI / 5;
        const a2 = Math.PI / 2 + (k + 1) * Math.PI / 5;
        const r1 = (k % 2 === 0 ? .18 : .075) * scale;
        const r2 = ((k + 1) % 2 === 0 ? .18 : .075) * scale;
        const u = Math.cos(a1) * r1 + (Math.cos(a2) * r2 - Math.cos(a1) * r1) * frac;
        const v = .68 + (Math.sin(a1) * r1 + (Math.sin(a2) * r2 - Math.sin(a1) * r1) * frac);
        push(u, v, wOff, col, 'depth_swing', { lu: u, lv: v, lw: wOff, spinOU: 0, hingeV: .78, spinA: 0 });
      }
    }
    addCandyHelixColumns3D(14, -.64, .44, .74, .08, .08, '#ffd15e', '#52c7ff', '#ffffff');
    addCornerFireworks3D('#ffd15e', '#52c7ff', .11);
  } else if (shapeId === 'brand_globe') {
    // Semi-3D Brand Globe (Crescent Meridians + Filled 3D Core + Glass Glare + Top Ribbon Emblem + 2 Orbital Rings + 4 Swinging Satellite Spheres)
    const gR = .46;
    // Outer Silhouette Rim + Left & Right 3D Crescent Meridians (matching Point 2)
    for (let i = 0; i < 56; i += 1) {
      const a = (i / 56) * Math.PI * 2;
      push(Math.cos(a) * gR, Math.sin(a) * gR, 0, '#52c7ff');
    }
    for (const side of [-1, 1]) {
      for (const [rFrac, wPeak, cnt] of [[.84, .28, 13], [.66, .36, 10]]) {
        for (let i = 0; i < cnt; i += 1) {
          const f = i / (cnt - 1);
          const a = (side < 0 ? Math.PI : 0) + (f - .5) * Math.PI * .70;
          const pr = gR * rFrac;
          const pw = (side < 0 ? 1 : -1) * Math.sin(f * Math.PI) * wPeak;
          push(Math.cos(a) * pr, Math.sin(a) * pr, pw, '#ffffff');
        }
      }
    }
    // Inner Filled 3D Glass Globe Core with Upper-Right Neon White Glare Arc
    addFilledGlassSphere3D(110, 0, 0, 0, .28, '#b9f43c', '#52c7ff', '#0284c7', false, 'depth_swing', { spinOU: 0, hingeV: .32, spinA: 0 });
    // Two Tilted Orbital Rings
    addRing3D(48, 0, 0, 0, .64, .64, .52, .26, .36, '#ffd15e');
    addRing3D(44, 0, 0, 0, .60, .60, -.46, -.28, -.32, '#b9f43c');
    // Volumetric Crown Bow atop the Globe
    addVolumetricBow3D(0, gR + .04, .12, .85, '#52c7ff', '#ffd15e');
    // 4 Satellite 3D Brand Spheres in the 4 Corners (bell_swing)
    addCornerSatellites3D([
      { cu: -.73, cv: .50, cw: -.12, r: .125, colMain: '#52c7ff', colSub: '#ffd15e', phase: 0 },
      { cu: .73, cv: .50, cw: .12, r: .125, colMain: '#b9f43c', colSub: '#52c7ff', phase: 1.5 },
      { cu: -.73, cv: -.48, cw: .12, r: .125, colMain: '#ffd15e', colSub: '#52c7ff', phase: 3.0 },
      { cu: .73, cv: -.48, cw: -.12, r: .125, colMain: '#52c7ff', colSub: '#b9f43c', phase: 4.5 }
    ]);
  } else if (shapeId === 'brand_rocket') {
    // 3D Rocket Fuselage (with Neon White Glass Glare + Pokéball-style Glowing Porthole) + 4 Swept Fins + Exhaust Plume + 4 Corner Satellite Planets
    addStructuredLathe3D(175, 0, -.34, .82, 0, t => t < .65 ? .22 + .035 * Math.sin(t * Math.PI) : Math.max(.03, .24 * Math.cos((t - .65) / .35 * Math.PI * .48)), 8, 8, t => t > .66 ? '#ff684c' : '#ffffff');
    // Upper-Right Neon White 3D Glass Glare Strip along Rocket Fuselage
    for (let i = 0; i < 16; i += 1) {
      const f = i / 15;
      const v = -.22 + f * .68;
      push(.15, v, .24, '#ffffff');
    }
    // Glowing Multi-Ring Porthole Window on front fuselage (Pokéball button style)
    push(0, .24, .28, '#ffffff');
    addRing3D(10, 0, .24, .27, .05, .05, Math.PI / 2, 0, 0, '#ffffff');
    addRing3D(18, 0, .24, .26, .10, .10, Math.PI / 2, 0, 0, '#38bdf8');
    // 4 Swept Fins
    for (let f = 0; f < 4; f += 1) {
      const finAngle = f * Math.PI / 2 + Math.PI / 4;
      for (let i = 0; i < 28; i += 1) {
        const s = ((i % 7) + 1) / 7;
        const h = Math.floor(i / 7) / 3;
        const r = .23 + s * (1 - h * .58) * .32;
        const v = -.42 + h * .32 - s * .09;
        push(Math.cos(finAngle) * r, v, Math.sin(finAngle) * r, '#52c7ff');
      }
    }
    // 3D Exhaust Plume
    addStructuredLathe3D(64, 0, -.82, -.36, 0, t => .04 + Math.sin(t * Math.PI) * .18, 4, 6, t => t < .45 ? '#ffd15e' : '#ff684c', 1.2);
    // 4 Satellite 3D Planets in the 4 Corners (bell_swing)
    addCornerSatellites3D([
      { cu: -.73, cv: .50, cw: -.12, r: .125, colMain: '#ff684c', colSub: '#ffd15e', phase: .2 },
      { cu: .73, cv: .50, cw: .12, r: .125, colMain: '#52c7ff', colSub: '#ffffff', phase: 1.8 },
      { cu: -.73, cv: -.48, cw: .12, r: .125, colMain: '#ffd15e', colSub: '#ff684c', phase: 3.3 },
      { cu: .73, cv: -.48, cw: -.12, r: .125, colMain: '#b9f43c', colSub: '#52c7ff', phase: 4.9 }
    ]);
  } else if (shapeId === 'brand_diamond') {
    // 3D Brilliant-Cut Diamond (with Neon White Glass Glare & depth_swing) + 2 Tilted Gyro Rings + 2 Spinning Crystal Stars + 4 Corner Fireworks
    const dStart = pts.length;
    addStructuredLathe3D(95, 0, .12, .42, 0, t => .56 - t * .25, 4, 10, () => '#9be8ff');
    addStructuredLathe3D(145, 0, -.58, .10, 0, t => .04 + t * .52, 5, 10, t => t > .58 ? '#ffffff' : '#52c7ff');
    // Upper-Right Neon White 3D Glass Glare Facets on Diamond Crown & Pavilion
    for (let i = 0; i < 16; i += 1) {
      const f = i / 15;
      const v = -.36 + f * .72;
      const r = v > .10 ? (.56 - ((v - .12) / .30) * .25) : (.04 + ((v + .58) / .68) * .52);
      const a = (25 + f * 35) * Math.PI / 180;
      push(Math.cos(a) * r * .82, v, Math.sin(a) * r + .16, '#ffffff');
    }
    for (let i = dStart; i < pts.length; i += 1) {
      Object.assign(pts[i], { part: 'depth_swing', lu: pts[i].u, lv: pts[i].v, lw: pts[i].w, spinOU: 0, hingeV: .42, spinA: 0 });
    }
    addRing3D(52, 0, .02, 0, .68, .68, .48, .30, .35, '#ffd15e');
    addRing3D(52, 0, .02, 0, .68, .68, -.48, -.30, -.35, '#b9f43c');
    // 2 Rotating 6-Branched Crystal Starflakes on Left & Right (spin)
    for (const [su, sv, sw] of [[-.75, .02, .08], [.75, .02, -.08]]) {
      push(su, sv, sw + .06, '#ffffff', 'spin', { spinR: 0, spinA: 0, spinOU: su, hingeV: sv, spinOV: 0, lw: sw + .06 });
      for (let b = 0; b < 6; b += 1) {
        const ba = (b / 6) * Math.PI * 2;
        for (const r of [.045, .095]) {
          push(su + Math.cos(ba) * r, sv + Math.sin(ba) * r, sw, r > .06 ? '#ffd15e' : '#ffffff', 'spin',
            { spinR: r, spinA: ba, spinOU: su, hingeV: sv, spinOV: 0, lw: sw });
        }
      }
    }
    addCornerFireworks3D('#ffd15e', '#52c7ff', .11);
  } else if (shapeId === 'wedding_couple') {
    // 3D Bride & Groom + Bouquet + Golden Arch + 3D Glossy Heart Ornament (depth_swing + White Glare) + 4 Corner Fireworks
    // Groom (cu = -0.22, cw = -0.03)
    for (const legOffset of [-.06, .06]) {
      addStructuredLathe3D(20, -.22 + legOffset, -.72, -.26, -.03, () => .044, 3, 4, () => '#38bdf8');
    }
    addStructuredLathe3D(42, -.22, -.26, .16, -.03, t => .125 + .02 * Math.cos(t * Math.PI), 4, 5, (t, a) => {
      const isFront = Math.sin(a) > .35 && Math.abs(Math.cos(a)) < .45;
      return t > .45 && isFront ? (t > .82 ? '#ffd15e' : '#ffffff') : '#60a5fa';
    });
    for (const armDir of [-1, 1]) {
      addStructuredLathe3D(14, -.22 + armDir * .16, -.16, .14, -.03, () => .038, 3, 3, () => '#38bdf8');
    }
    addFilledGlassSphere3D(24, -.22, .30, -.03, .09, '#ffe5aa', '#ffe5aa', '#93c5fd', false);

    // Bride (cu = .20, cw = .03): Voluminous 3D Bell Ballgown with Neon White Glare Highlight
    addStructuredLathe3D(108, .20, -.72, -.06, .03, t => .36 * Math.pow(1 - t * .70, .90), 6, 7, t => {
      return (Math.floor(t * 6) % 2 === 0) ? '#ffffff' : '#fbcfe8';
    });
    for (let i = 0; i < 12; i += 1) {
      const f = i / 11;
      const v = -.66 + f * .54;
      const r = .34 * Math.pow(1 - f * .70, .90);
      push(.20 + r * .55, v, .03 + r * .85, '#ffffff');
    }
    addStructuredLathe3D(26, .20, -.06, .16, .03, () => .088, 3, 4, () => '#ffffff');
    addFilledGlassSphere3D(24, .20, .30, .03, .088, '#ffe5aa', '#ffffff', '#fbcfe8', false);
    // Flowing Veil with ribbon_wave motion
    for (let i = 0; i < 22; i += 1) {
      const t = i / 21;
      const va = (t - .5) * 1.4;
      const v = .37 - t * .50;
      const r = .11 + t * .16;
      const lu = .20 + Math.sin(va) * r, lw = .03 - Math.cos(va) * r * .8;
      push(lu, v, lw, '#e0f2fe', 'ribbon_wave', { lu, lv: v, lw, distFromPole: t });
    }
    // Wedding Bouquet held between Groom & Bride
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      const r = .06 * (i % 2 === 0 ? 1 : .62);
      push(-.01 + Math.cos(a) * r, -.02 + Math.sin(a) * r * .55, .14 + (i % 2 === 0 ? .035 : -.035), i % 3 === 0 ? '#ff4b8b' : i % 3 === 1 ? '#ffd15e' : '#73e48c');
    }
    // Overhead Golden Arch
    for (let i = 0; i < 36; i += 1) {
      const t = i / 35;
      const a = t * Math.PI;
      push(-Math.cos(a) * .52, .26 + Math.sin(a) * .42, Math.sin(a * 2) * .10, '#ffd15e');
    }
    // 3D Glossy Heart Ornament at Arch Apex (with right-cheek white glass glare & depth_swing)
    addGlossyHeart3D(0, .68, .06, .62, '#ff4b8b', '#ff77b7', '#9d174d', .84);
    addCornerFireworks3D('#ffe5aa', '#ff77b7', .11);
  } else if (shapeId === 'wedding_ringbox') {
    // 3D Open Luxury Ring Box (Hinged Lid + Rising Diamond Ring + White Glare) + 4 Swinging Satellite Pearl/Rose Ornaments
    for (let layer = 0; layer < 4; layer += 1) {
      const v = -.66 + layer * .14;
      addRectRing3D(28, 0, v, 0, .40, .34, 0, 0, 0, layer === 3 ? '#ffd15e' : '#ef4444');
    }
    for (let i = 0; i < 20; i += 1) {
      const corner = i % 4;
      const h = (Math.floor(i / 4) + .5) / 5;
      const cu = (corner === 0 || corner === 3 ? -1 : 1) * .40;
      const cw = (corner < 2 ? -1 : 1) * .34;
      push(cu, -.66 + h * .42, cw, '#f87171');
    }
    for (let r = 1; r <= 3; r += 1) {
      addRectRing3D(16, 0, -.24, 0, .32 * (r / 3), .26 * (r / 3), 0, 0, 0, '#b91c1c');
    }
    // Hinged Lid on back edge
    const hingeV = -.22, hingeW = -.34, openAngle = 1.92;
    const pushLid = (lu, lv, lw, color) => {
      const v = hingeV + lw * Math.sin(openAngle) + lv * Math.cos(openAngle);
      const w = hingeW + lw * Math.cos(openAngle) - lv * Math.sin(openAngle);
      push(lu, v, w, color, 'lid', { lu, lv, lw, hingeV, hingeW });
    };
    for (let layer = 0; layer < 3; layer += 1) {
      const lv = layer * .065;
      for (let i = 0; i < 32; i += 1) {
        const t = (i / 32) * 4;
        const edge = Math.floor(t) % 4;
        const frac = t - Math.floor(t);
        let lu = 0, lw = 0;
        if (edge === 0) { lu = (-1 + 2 * frac) * .40; lw = 0; }
        else if (edge === 1) { lu = .40; lw = frac * .68; }
        else if (edge === 2) { lu = (1 - 2 * frac) * .40; lw = .68; }
        else { lu = -.40; lw = (1 - frac) * .68; }
        pushLid(lu, lv, lw, layer === 0 ? '#ffd15e' : '#ef4444');
      }
    }
    for (let i = 0; i < 25; i += 1) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      pushLid(-.26 + col * .13, -.015, .10 + row * .12, '#fef3c7');
    }
    // Upright Solitaire Ring rising from the cushion
    for (let i = 0; i < 52; i += 1) {
      const a = (i / 52) * Math.PI * 2;
      const ringRadius = .22;
      const isGlare = a > .3 && a < 1.2;
      push(Math.cos(a) * ringRadius, .04 + Math.sin(a) * ringRadius, (i % 2 === 0 ? .035 : -.035) * Math.sin(a), isGlare ? '#ffffff' : '#facc15', 'ring');
    }
    const diamondStart = pts.length;
    addStructuredLathe3D(36, 0, .28, .46, 0, t => t < .5 ? .03 + (t / .5) * .11 : .14 - ((t - .5) / .5) * .07, 4, 7, t => t > .55 ? '#ffffff' : '#9be8ff');
    for (let i = diamondStart; i < pts.length; i += 1) pts[i].part = 'ring';
    for (let r = 0; r < 8; r += 1) {
      const ra = (r / 8) * Math.PI * 2;
      for (let s = 1; s <= 2; s += 1) {
        const dist = .16 + s * .07;
        push(Math.cos(ra) * dist, .40 + Math.sin(ra) * dist * .7, (s % 2 === 0 ? .04 : -.04), '#ffffff', 'sparkle');
      }
    }
    // 4 Satellite 3D Rose/Pearl Ornaments in the 4 Corners (bell_swing)
    addCornerSatellites3D([
      { cu: -.73, cv: .50, cw: -.12, r: .12, colMain: '#ef4444', colSub: '#ffd15e', phase: 0 },
      { cu: .73, cv: .50, cw: .12, r: .12, colMain: '#ffd15e', colSub: '#ffffff', phase: 1.6 },
      { cu: -.73, cv: -.48, cw: .12, r: .12, colMain: '#ff77b7', colSub: '#fffbeb', phase: 3.2 },
      { cu: .73, cv: -.48, cw: -.12, r: .12, colMain: '#ef4444', colSub: '#ffd15e', phase: 4.8 }
    ]);
  } else if (shapeId === 'wedding_cake') {
    // 3D 3-Tier Wedding Cake with Scalloped Wreath-style Garland Borders + Glossy 3D Heart Topper + 2 Helix Columns + 4 Corner Fireworks
    addRing3D(32, 0, -.78, 0, .50, .50, 0, 0, 0, '#ffd15e');
    // Tier 1 (Base Tier): v from -.75 to -.44, radius = .44 + scalloped icing border
    addStructuredLathe3D(88, 0, -.75, -.44, 0, () => .44, 4, 7, () => '#fffbeb');
    for (let i = 0; i < 32; i += 1) {
      const a = (i / 32) * Math.PI * 2;
      push(Math.cos(a) * .45, -.44 + .022 * Math.sin(a * 8), Math.sin(a) * .45, i % 2 === 0 ? '#ffd15e' : '#ffffff');
    }
    // Tier 2 (Middle Tier): v from -.42 to -.12, radius = .31 + scalloped icing border
    addStructuredLathe3D(76, 0, -.42, -.12, 0, () => .31, 4, 6, () => '#fbcfe8');
    for (let i = 0; i < 26; i += 1) {
      const a = (i / 26) * Math.PI * 2;
      push(Math.cos(a) * .32, -.26 + .02 * Math.cos(a * 6), Math.sin(a) * .32, '#f472b6');
    }
    // Tier 3 (Top Tier): v from -.10 to .16, radius = .20 + right-side white glaze glare
    addStructuredLathe3D(52, 0, -.10, .16, 0, () => .20, 3, 5, () => '#fffbeb');
    for (let i = 0; i < 12; i += 1) {
      const f = i / 11;
      const v = -.70 + f * .82;
      const r = v < -.43 ? .44 : v < -.11 ? .31 : .20;
      push(r * .65, v, r * .82, '#ffffff');
    }
    // 3D Glossy Heart Topper with Right-Cheek White Glass Glare & depth_swing
    addGlossyHeart3D(0, .44, .06, .75, '#ff4b8b', '#fbcfe8', '#9d174d', .66);
    addCandyHelixColumns3D(14, -.66, .42, .74, .08, .08, '#fbcfe8', '#ffd15e', '#ffffff');
    addCornerFireworks3D('#ffe5aa', '#ff77b7', .11);
  } else if (shapeId === 'wedding_rings') {
    // 2 Interlocking 3D Wedding Bands (with Neon White Glass Glare) + Diamond Solitaire + Top Satin Bow (ribbon_wave) + 4 Corner Fireworks
    const addBand3D = (cu, cv, cw, radius, rx, ry, rz, cMain, cEdge) => {
      const layers = [
        { r: radius - .032, w: 0, n: 44, c: cEdge },
        { r: radius, w: .042, n: 50, c: cMain },
        { r: radius, w: -.042, n: 48, c: cMain }
      ];
      for (const l of layers) {
        for (let i = 0; i < l.n; i += 1) {
          const a = (i / l.n) * Math.PI * 2;
          const p = rotate3DPoint(Math.cos(a) * l.r, Math.sin(a) * l.r, l.w, rx, ry, rz);
          const deg = ((a * 180 / Math.PI) % 360 + 360) % 360;
          const isGlare = l.w > 0 && deg >= 22 && deg <= 72;
          push(cu + p.u, cv + p.v, cw + p.w, isGlare ? '#ffffff' : l.c);
        }
      }
    };
    addBand3D(-.20, -.12, -.04, .34, .24, .42, .12, '#ffd15e', '#facc15');
    addBand3D(.20, -.12, .04, .34, -.24, -.42, -.12, '#fbcfe8', '#f472b6');
    // Faceted 3D Diamond Solitaire at top center (depth_swing)
    const dStart = pts.length;
    addStructuredLathe3D(64, 0, .22, .52, 0, t => t < .55 ? .03 + (t / .55) * .19 : .22 - ((t - .55) / .45) * .10, 4, 7, t => t > .55 ? '#ffffff' : '#9be8ff');
    for (let i = dStart; i < pts.length; i += 1) {
      Object.assign(pts[i], { part: 'depth_swing', lu: pts[i].u, lv: pts[i].v, lw: pts[i].w, spinOU: 0, hingeV: .52, spinA: 0 });
    }
    // Top Volumetric Satin Bow above the diamond
    addVolumetricBow3D(0, .60, .10, .85, '#ff77b7', '#ffd15e');
    addCornerFireworks3D('#ffd15e', '#9be8ff', .115);
  } else if (shapeId === 'wedding_toast') {
    // 2 Clinking 3D Champagne Flutes (bell_swing + Neon White Glass Glare) + Rising Bubbles + 3D Glossy Heart + 4 Corner Fireworks
    for (const dir of [-1, 1]) {
      const tilt = dir * .28;
      const baseU = dir * .22;
      const baseW = dir * .07;
      const pivotV = .28;
      const emit = (lu, lv, lw, color) => {
        const p = rotate3DPoint(lu, lv, lw, 0, dir * .18, tilt);
        const u = baseU + p.u, v = p.v, w = baseW + p.w;
        push(u, v, w, color, 'bell_swing', { lu: u, lv: v, lw: w, spinOU: baseU, hingeV: pivotV, spinA: dir < 0 ? 0 : Math.PI, spinFreq: 1.6 });
      };
      for (const [r, vOff] of [[.14, -.76], [.08, -.74]]) {
        for (let i = 0; i < 14; i += 1) {
          const a = (i / 14) * Math.PI * 2;
          emit(Math.cos(a) * r, vOff, Math.sin(a) * r, '#9be8ff');
        }
      }
      for (let i = 0; i < 12; i += 1) {
        const st = (i + .5) / 12;
        const sa = i * 1.1;
        emit(Math.cos(sa) * .018, -.72 + st * .34, Math.sin(sa) * .018, '#ffffff');
      }
      const bowlRadius = t => .042 + Math.sin(t * Math.PI * .5) * .105;
      for (let r = 0; r < 8; r += 1) {
        const t = r / 7;
        const lv = -.36 + t * .64;
        const rad = bowlRadius(t);
        const liquid = t < .72;
        for (let i = 0; i < 14; i += 1) {
          const a = (i / 14) * Math.PI * 2 + r * .08;
          const isGlare = Math.cos(a) > .55 && Math.sin(a) > 0;
          emit(Math.cos(a) * rad, lv, Math.sin(a) * rad, isGlare ? '#ffffff' : liquid ? (r % 2 ? '#fde68a' : '#facc15') : '#e0f2fe');
        }
      }
      for (let i = 0; i < 12; i += 1) {
        const seed = i + (dir > 0 ? 40 : 0);
        const a = hash01(seed) * Math.PI * 2;
        const rad = .015 + hash01(seed + 7) * .055;
        emit(Math.cos(a) * rad, -.28 + (i / 12) * .50, Math.sin(a) * rad, '#ffffff');
      }
    }
    // 3D Glossy Heart Ornament hanging above the clinking glasses (depth_swing + White Glare)
    addGlossyHeart3D(0, .58, .08, .72, '#ff4b8b', '#ff77b7', '#9d174d', .78);
    addCornerFireworks3D('#facc15', '#ff4b8b', .115);
  } else if (shapeId === 'national_borobudur') {
    // Candi Borobudur (4 Teras Bujur Sangkar + 3 Teras Melingkar Berstupa + Stupa Induk Berkilau) + 2 Golden Helix + 4 Satellite Lotus Orbs
    for (let level = 0; level < 4; level += 1) {
      const v0 = -.76 + level * .12;
      const half = .68 - level * .10;
      addRectRing3D(42 - level * 4, 0, v0, 0, half, half, 0, 0, 0, level % 2 === 0 ? '#ffd15e' : '#cbd5e1');
      addRectRing3D(34 - level * 4, 0, v0 + .055, 0, half - .035, half - .035, 0, 0, 0, '#f8fafc');
    }
    const terraces = [{ r: .32, v: -.16, n: 10 }, { r: .24, v: -.02, n: 8 }, { r: .16, v: .12, n: 6 }];
    for (const terrace of terraces) {
      addRing3D(28, 0, terrace.v - .03, 0, terrace.r + .03, terrace.r + .03, 0, 0, 0, '#94a3b8');
      for (let s = 0; s < terrace.n; s += 1) {
        const a = (s / terrace.n) * Math.PI * 2;
        const su = Math.cos(a) * terrace.r, sw = Math.sin(a) * terrace.r;
        push(su, terrace.v + .02, sw, '#f8fafc');
        push(su, terrace.v + .06, sw, '#ffd15e');
      }
    }
    // Stupa Induk (Main Bell Dome with White Glare Highlight + Harmika + Chattra Spire)
    addStructuredLathe3D(58, 0, .18, .48, 0, t => .15 * Math.cos(t * Math.PI * .44), 4, 7, (t, a) => (Math.cos(a) > .5 && Math.sin(a) > 0) ? '#ffffff' : '#ffd15e');
    addRectRing3D(12, 0, .51, 0, .05, .05, 0, 0, 0, '#ffffff');
    addStructuredLathe3D(20, 0, .54, .74, 0, t => .038 * (1 - t * .65), 4, 4, () => '#ffd15e');
    // 2 Rising Golden Nusantara Helix Columns + 4 Corner Satellite Lotus Spheres
    addCandyHelixColumns3D(12, -.60, .44, .76, .08, .075, '#ffd15e', '#f8fafc', '#ff3b3b');
    addCornerSatellites3D([
      { cu: -.74, cv: .52, cw: -.12, r: .115, colMain: '#ffd15e', colSub: '#cbd5e1', phase: 0 },
      { cu: .74, cv: .52, cw: .12, r: .115, colMain: '#cbd5e1', colSub: '#ffd15e', phase: 1.6 },
      { cu: -.74, cv: -.50, cw: .12, r: .115, colMain: '#ffd15e', colSub: '#ffffff', phase: 3.1 },
      { cu: .74, cv: -.50, cw: -.12, r: .115, colMain: '#cbd5e1', colSub: '#ffd15e', phase: 4.7 }
    ]);
  } else if (shapeId === 'national_monas') {
    // 3D Architectural Monas (with Glass Glare & Lidah Api Emas depth_swing) + 2 Merah-Putih Helix Columns + 4 Corner Fireworks
    addStructuredLathe3D(64, 0, -.80, -.60, 0, t => .54 - t * .10, 3, 6, () => '#ffffff');
    addStructuredLathe3D(88, 0, -.58, -.26, 0, t => .22 + Math.pow(t, .75) * .30, 4, 7, (t, a) => (Math.cos(a) > .6 && Math.sin(a) > 0) ? '#ffffff' : '#ff3b3b');
    addStructuredLathe3D(96, 0, -.24, .46, 0, t => .12 - t * .04, 7, 5, () => '#ffffff');
    addStructuredLathe3D(28, 0, .48, .55, 0, () => .17, 2, 5, () => '#ffd15e');
    const flameStart = pts.length;
    addStructuredLathe3D(52, 0, .57, .86, 0, t => .035 + Math.sin(t * Math.PI) * .13, 4, 6, t => t > .65 ? '#ffffff' : '#ffd15e', 1.8);
    for (let i = flameStart; i < pts.length; i += 1) {
      Object.assign(pts[i], { part: 'depth_swing', lu: pts[i].u, lv: pts[i].v, lw: pts[i].w, spinOU: 0, hingeV: .56, spinA: 0 });
    }
    // 2 Merah-Putih Candy-Cane Helix Columns flanking Monas + 4 Corner Fireworks
    addCandyHelixColumns3D(16, -.64, .48, .72, .08, .085, '#ff3b3b', '#ffffff', '#ffd15e');
    addCornerFireworks3D('#ffd15e', '#ff3b3b', .11);
  } else if (shapeId === 'national_compass') {
    // 3D Armillary Nusantara: Filled 3D Glass Sphere Core + 8-Pointed Compass Star + 2 Armillary Rings + Wave Base (ribbon_wave) + 4 Satellite Spheres
    addFilledGlassSphere3D(88, 0, .10, 0, .25, '#ffd15e', '#facc15', '#b45309', false);
    const dirs = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
      [.7, .7, 0], [-.7, .7, 0], [.7, -.7, 0], [-.7, -.7, 0]
    ];
    for (const [du, dv, dw] of dirs) {
      for (let s = 1; s <= 7; s += 1) {
        const r = .24 + (s / 7) * .38;
        push(du * r, .10 + dv * r, dw * r, s > 4 ? '#ffd15e' : '#52c7ff');
      }
    }
    addRing3D(48, 0, .10, 0, .62, .62, .18, 0, .12, '#52c7ff');
    addRing3D(48, 0, .10, 0, .62, .62, 1.25, .42, 0, '#ffd15e');
    // Nusantara Emerald Wave Base with ribbon_wave motion
    for (let i = 0; i < 84; i += 1) {
      const row = i % 3;
      const t = Math.floor(i / 3) / 27;
      const u = -.72 + t * 1.44;
      const w = ((row - 1) / 1) * .32 + Math.sin(t * Math.PI * 3) * .14;
      const v = -.68 + Math.cos(t * Math.PI * 4 + row) * .07;
      push(u, v, w, row === 1 ? '#ff5474' : '#73e48c', 'ribbon_wave', { lu: u, lv: v, lw: w, distFromPole: Math.abs(t - .5) * 1.6 });
    }
    addCornerSatellites3D([
      { cu: -.74, cv: .52, cw: -.12, r: .12, colMain: '#ffd15e', colSub: '#73e48c', phase: .3 },
      { cu: .74, cv: .52, cw: .12, r: .12, colMain: '#73e48c', colSub: '#ffd15e', phase: 1.9 },
      { cu: -.74, cv: -.46, cw: .12, r: .12, colMain: '#52c7ff', colSub: '#ffd15e', phase: 3.4 },
      { cu: .74, cv: -.46, cw: -.12, r: .12, colMain: '#ffd15e', colSub: '#52c7ff', phase: 5.0 }
    ]);
  } else if (shapeId === 'national_guitar') {
    // 3D Guitar (Figure-8 Dome + Neon White Glass Glare + Multi-Ring Soundhole) + Soundwave Rings + 4 Corner Fireworks & Spinning Notes
    const rotG = (lu, lv, lw) => rotate3DPoint(lu, lv, lw, .20, .28, -.48);
    for (let i = 0; i < 156; i += 1) {
      const shell = i % 3;
      const a = (Math.floor(i / 3) / 52) * Math.PI * 2;
      const waist = 1 - .32 * Math.cos(2 * a) - .12 * Math.sin(a);
      const localU = Math.cos(a) * .34 * waist;
      const localV = -.26 + Math.sin(a) * .38;
      const localW = (shell - 1) * .16;
      const p = rotG(localU, localV, localW);
      const isGlare = shell === 2 && a > .25 && a < 1.15;
      push(p.u, p.v, p.w, isGlare ? '#ffffff' : shell === 1 ? '#ffd15e' : '#ff5474');
    }
    // Multi-Ring Soundhole & Rosette (Pokéball button style)
    const pCore = rotG(0, -.18, .20);
    push(pCore.u, pCore.v, pCore.w, '#ffffff');
    for (const [r, n, col] of [[.055, 12, '#ffffff'], [.095, 18, '#ffd15e'], [.125, 22, '#52c7ff']]) {
      for (let i = 0; i < n; i += 1) {
        const a = (i / n) * Math.PI * 2;
        const p = rotG(Math.cos(a) * r, -.18 + Math.sin(a) * r, .19);
        push(p.u, p.v, p.w, col);
      }
    }
    for (let i = 0; i < 12; i += 1) {
      const t = (i / 11) * 2 - 1;
      const p = rotG(t * .12, -.40, .19);
      push(p.u, p.v, p.w, '#ffffff');
    }
    for (let i = 0; i < 72; i += 1) {
      const strand = i % 4;
      const t = Math.floor(i / 4) / 17;
      const localU = ((strand - 1.5) / 1.5) * .052;
      const localV = -.08 + t * .78;
      const localW = strand === 0 || strand === 3 ? -.04 : .18;
      const p = rotG(localU, localV, localW);
      push(p.u, p.v, p.w, strand === 0 || strand === 3 ? '#ff5474' : '#fef08a');
    }
    for (let i = 0; i < 18; i += 1) {
      const a = (i / 18) * Math.PI * 2;
      const p = rotG(Math.cos(a) * .08, .76 + Math.sin(a) * .09, .06 + Math.sin(a * 2) * .04);
      push(p.u, p.v, p.w, i % 2 === 0 ? '#ffd15e' : '#ffffff');
    }
    addRing3D(46, 0, -.06, 0, .68, .68, .58, .24, .38, '#52c7ff');
    addRing3D(46, 0, -.06, 0, .64, .64, -.52, -.28, -.34, '#b9f43c');
    addCornerFireworks3D('#ffd15e', '#52c7ff', .115);
  } else if (shapeId === 'national_flags') {
    // Dua Bendera Merah Putih Berkibar 3D + Bintang Emas 5 Sudut di Puncak (depth_swing) + Pita Nusantara + 4 Corner Fireworks
    for (const dir of [-1, 1]) {
      const part = dir < 0 ? 'flag_left' : 'flag_right';
      const bottom = { u: dir * .24, v: -.78, w: dir * .12 };
      const top = { u: -dir * .36, v: .48, w: -dir * .12 };
      const onPole = t => ({
        u: bottom.u + (top.u - bottom.u) * t,
        v: bottom.v + (top.v - bottom.v) * t,
        w: bottom.w + (top.w - bottom.w) * t
      });
      for (let i = 0; i < 28; i += 1) {
        const p = onPole(i / 27);
        push(p.u, p.v, p.w, '#e2e8f0');
      }
      addFilledGlassSphere3D(14, top.u, top.v + .05, top.w, .042, '#ffd15e', '#ffffff', '#f59e0b', false);
      for (let row = 0; row < 8; row += 1) {
        const q = row / 7;
        const anchor = onPole(.96 - q * .25);
        for (let col = 0; col < 18; col += 1) {
          const s = (col + .6) / 18;
          const u = anchor.u - dir * s * .46;
          const v = anchor.v - s * .04;
          const w = anchor.w + Math.sin(s * Math.PI * 1.6) * .22 * s;
          push(u, v, w, q < .5 ? '#ff3b3b' : '#ffffff', part, { distFromPole: s });
        }
      }
    }
    // 5-Pointed Golden Nusantara Star at Top Center (depth_swing)
    const starV = .68;
    for (let k = 0; k < 10; k += 1) {
      const a1 = Math.PI / 2 + k * Math.PI / 5;
      const a2 = Math.PI / 2 + (k + 1) * Math.PI / 5;
      const r1 = k % 2 === 0 ? .13 : .055;
      const r2 = (k + 1) % 2 === 0 ? .13 : .055;
      for (let s = 0; s < 3; s += 1) {
        const f = s / 3;
        const u = Math.cos(a1) * r1 + (Math.cos(a2) * r2 - Math.cos(a1) * r1) * f;
        const v = starV + Math.sin(a1) * r1 + (Math.sin(a2) * r2 - Math.sin(a1) * r1) * f;
        push(u, v, .10, '#ffd15e', 'depth_swing', { lu: u, lv: v, lw: .10, spinOU: 0, hingeV: .80, spinA: 0 });
      }
    }
    addCornerFireworks3D('#ff3b3b', '#ffd15e', .115);
  } else if (shapeId === 'festival_ferris') {
    // Bianglala Berputar 3D (Dual Rims + Glowing Hub + 12 Spherical Gondolas with White Glare) + 4 Corner Fireworks
    const hubV = .08, R = .56;
    const spin = (r, a, w, color, ou = 0, ov = 0) => {
      push(Math.cos(a) * r + ou, hubV + Math.sin(a) * r + ov, w, color, 'spin',
        { spinR: r, spinA: a, spinOU: ou, spinOV: ov, hingeV: hubV });
    };
    for (const w of [-.12, .12]) {
      for (let i = 0; i < 56; i += 1) spin(R, (i / 56) * Math.PI * 2, w, i % 2 ? '#52c7ff' : '#ff5e97');
      for (let i = 0; i < 28; i += 1) spin(R * .54, (i / 28) * Math.PI * 2, w, '#ffd15e');
    }
    for (let k = 0; k < 12; k += 1) {
      const a = (k / 12) * Math.PI * 2;
      for (let i = 0; i < 6; i += 1) {
        const t = (i + .6) / 6.6;
        spin(R * t, a, (k % 2 ? .12 : -.12) * t, '#ffffff');
      }
    }
    // Glowing Multi-Ring Hub (Pokéball button style)
    push(0, hubV, .18, '#ffffff');
    addRing3D(10, 0, hubV, .16, .045, .045, Math.PI / 2, 0, 0, '#ffffff');
    addRing3D(16, 0, hubV, .14, .09, .09, Math.PI / 2, 0, 0, '#ffd15e');
    const cabinColors = ['#ff5e97', '#ffd15e', '#73e48c', '#52c7ff'];
    for (let k = 0; k < 12; k += 1) {
      const a = (k / 12) * Math.PI * 2 + Math.PI / 12;
      const color = cabinColors[k % cabinColors.length];
      spin(R, a, .06, '#ffffff', .02, -.06);
      for (let i = 0; i < 7; i += 1) {
        const b = (i / 7) * Math.PI * 2;
        spin(R, a, Math.sin(b) * .065, color, Math.cos(b) * .055, -.09);
      }
    }
    for (const w of [-.18, .18]) {
      for (const side of [-1, 1]) {
        for (let i = 0; i < 16; i += 1) {
          const t = (i + .5) / 16;
          push(side * .38 * t, hubV + (-.82 - hubV) * t, w, '#e2e8f0');
        }
      }
    }
    addRectRing3D(24, 0, -.84, 0, .48, .22, 0, 0, 0, '#94a3b8');
    addCornerFireworks3D('#ffd15e', '#ff5e97', .11);
  } else if (shapeId === 'festival_balloon') {
    // Hero 3D Hot Air Balloon (with Neon White Glass Glare & bell_swing) + 4 Asynchronous Satellite Balloons/Orbs in 4 Corners
    const heroScale = .92, cv = .18;
    const rings = 8, gores = 12;
    const shape = t => {
      const taper = t < .35 ? .55 + (t / .35) * .45 : 1;
      return {
        v: cv + (-Math.cos(t * Math.PI)) * .44 * heroScale,
        r: Math.max(.065, .40 * Math.sin(t * Math.PI) * taper) * heroScale
      };
    };
    const goreColor = a => Math.floor((a / (Math.PI * 2)) * gores) % 2 ? '#ff3b3b' : '#ffd15e';
    for (let r = 1; r < rings; r += 1) {
      const t = r / rings;
      const s = shape(t);
      const n = 20;
      for (let i = 0; i < n; i += 1) {
        const a = ((i + .3) / n) * Math.PI * 2;
        const deg = ((a * 180 / Math.PI) % 360 + 360) % 360;
        const isGlare = t > .45 && t < .85 && deg >= 20 && deg <= 75;
        push(Math.cos(a) * s.r, s.v, Math.sin(a) * s.r + (isGlare ? .06 : 0), isGlare || t > .9 ? '#ffffff' : goreColor(a + .01));
      }
    }
    for (let g = 0; g < gores; g += 1) {
      const a = (g / gores) * Math.PI * 2;
      for (let i = 0; i < 12; i += 1) {
        const s = shape((i + .5) / 12);
        push(Math.cos(a) * s.r, s.v, Math.sin(a) * s.r, '#ffffff');
      }
    }
    const neckV = cv - .44 * heroScale;
    const basketV = neckV - .24 * heroScale;
    for (const [du, dw] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      for (let i = 0; i < 5; i += 1) {
        const t = (i + .5) / 5;
        push(du * (.065 + t * .02), neckV - t * .22, dw * (.065 + t * .02), '#e2e8f0');
      }
    }
    for (let layer = 0; layer < 3; layer += 1) {
      addRectRing3D(14, 0, basketV - layer * .06, 0, .09, .09, 0, 0, 0, '#f59e0b');
    }
    for (let i = 0; i < 6; i += 1) push(0, neckV - .02 - i * .025, 0, i < 3 ? '#ffd15e' : '#ff8c3b');
    // 4 Satellite 3D Mini-Balloon Spheres in the 4 Corners (bell_swing)
    addCornerSatellites3D([
      { cu: -.72, cv: .50, cw: -.14, r: .13, colMain: '#52c7ff', colSub: '#ffffff', phase: 0 },
      { cu: .72, cv: .50, cw: .14, r: .13, colMain: '#73e48c', colSub: '#ffd15e', phase: 1.5 },
      { cu: -.72, cv: -.46, cw: .14, r: .13, colMain: '#ff5e97', colSub: '#ffd15e', phase: 3.1 },
      { cu: .72, cv: -.46, cw: -.14, r: .13, colMain: '#ffd15e', colSub: '#ff3b3b', phase: 4.6 }
    ]);
  } else if (shapeId === 'festival_gift') {
    // 3D Surprise Gift Box + Volumetric Top Satin Bow (ribbon_wave) + Emerging 3D Glossy Heart (depth_swing) + 2 Helix Columns + 4 Corner Fireworks
    const half = .36, v0 = -.78, v1 = -.10;
    for (let layer = 0; layer < 5; layer += 1) {
      const v = v0 + (layer / 4) * (v1 - v0);
      for (let i = 0; i < 36; i += 1) {
        const t = (i / 36) * 4;
        const edge = Math.floor(t) % 4;
        const frac = t - Math.floor(t);
        let lu = 0, lw = 0;
        if (edge === 0) { lu = (-1 + 2 * frac) * half; lw = -half; }
        else if (edge === 1) { lu = half; lw = (-1 + 2 * frac) * half; }
        else if (edge === 2) { lu = (1 - 2 * frac) * half; lw = half; }
        else { lu = -half; lw = (1 - 2 * frac) * half; }
        const ribbon = Math.abs(lu) < .05 || Math.abs(lw) < .05;
        push(lu, v, lw, ribbon ? '#ffd15e' : '#ff5e97');
      }
    }
    addRectRing3D(36, 0, v1 + .05, 0, half + .035, half + .035, 0, 0, 0, '#ff3b77');
    // Volumetric Top Satin Bow with Flowing Ribbon Tails (ribbon_wave)
    addVolumetricBow3D(0, v1 + .10, .14, .95, '#ffd15e', '#ffffff');
    // Emerging 3D Glossy Heart Surprise above the Gift Box (depth_swing + White Glare)
    addGlossyHeart3D(0, .42, .08, .78, '#ff2244', '#ff5e97', '#9d174d', .68);
    addCandyHelixColumns3D(12, -.64, .40, .74, .08, .08, '#ff5e97', '#ffd15e', '#52c7ff');
    addCornerFireworks3D('#ffd15e', '#52c7ff', .11);
  } else if (shapeId === 'festival_lantern') {
    // 3D Royal Sky Lantern (Filled 3D Glass Sphere with Neon White Glare) + Blooming Lotus Base + Silk Tassels (ribbon_wave) + 4 Satellite Lanterns
    addFilledGlassSphere3D(145, 0, .28, 0, .38, '#ff5e4d', '#ffd15e', '#b91c1c', false);
    addStructuredLathe3D(32, 0, .64, .76, 0, () => .18, 2, 5, () => '#ffd15e');
    addStructuredLathe3D(32, 0, -.12, -.01, 0, () => .20, 2, 5, () => '#ffd15e');
    // 10 Blooming Lotus Petals cradling the Lantern Base
    for (let petal = 0; petal < 10; petal += 1) {
      const pa = (petal / 10) * Math.PI * 2;
      for (let i = 0; i < 12; i += 1) {
        const s = (i + 1) / 12;
        const spread = Math.sin(s * Math.PI) * .12;
        const r = .16 + s * .42;
        const a = pa + (i % 2 === 0 ? spread : -spread);
        const v = -.32 + Math.pow(s, 1.3) * .26;
        push(Math.cos(a) * r, v, Math.sin(a) * r, s > .55 ? '#ff82b2' : '#ffd15e');
      }
    }
    // Golden Silk Tassels with ribbon_wave motion
    for (let t = 0; t < 6; t += 1) {
      const ta = (t / 6) * Math.PI * 2;
      const tr = t === 0 ? 0 : .10;
      for (let i = 0; i < 6; i += 1) {
        const f = i / 5;
        const flare = f * .04;
        const lu = Math.cos(ta) * (tr + flare), lv = -.20 - f * .52, lw = Math.sin(ta) * (tr + flare);
        push(lu, lv, lw, f > .65 ? '#ff5e4d' : '#ffd15e', 'ribbon_wave', { lu, lv, lw, distFromPole: f });
      }
    }
    // 4 Satellite 3D Mini-Lantern Spheres in the 4 Corners (bell_swing)
    addCornerSatellites3D([
      { cu: -.73, cv: .50, cw: -.12, r: .125, colMain: '#ff5e4d', colSub: '#ffd15e', phase: 0 },
      { cu: .73, cv: .50, cw: .12, r: .125, colMain: '#ffd15e', colSub: '#ff82b2', phase: 1.6 },
      { cu: -.73, cv: -.48, cw: .12, r: .125, colMain: '#ff82b2', colSub: '#ffd15e', phase: 3.2 },
      { cu: .73, cv: -.48, cw: -.12, r: .125, colMain: '#ff5e4d', colSub: '#ffd15e', phase: 4.8 }
    ]);
  } else if (shapeId === 'christmas_tree') {
    // Point 4 (Event Hari Raya & Natal): Pohon Natal Semi-3D Berpola 11 Lingkaran Konsentris + Bintang 5 Sudut + 2 Spiral Candy Cane 3D
    // 1. 5-Pointed Golden Star at the Apex (cv = 0.78, depth_swing)
    const starV = .78, starOuter = .135, starInner = .056;
    const starVerts = [];
    for (let k = 0; k < 10; k += 1) {
      const a = Math.PI / 2 + k * (Math.PI / 5);
      const r = k % 2 === 0 ? starOuter : starInner;
      starVerts.push({ u: Math.cos(a) * r, v: starV + Math.sin(a) * r, w: k % 2 === 0 ? .09 : -.05 });
    }
    for (let k = 0; k < 10; k += 1) {
      const p0 = starVerts[k], p1 = starVerts[(k + 1) % 10];
      for (let s = 0; s < 4; s += 1) {
        const f = s / 4;
        const lu = p0.u + (p1.u - p0.u) * f;
        const lv = p0.v + (p1.v - p0.v) * f;
        const lw = p0.w + (p1.w - p0.w) * f;
        push(lu, lv, lw, '#ffd15e', 'depth_swing', { lu, lv, lw, spinOU: 0, hingeV: .88, spinA: 0 });
      }
    }
    addRing3D(10, 0, starV, .12, .036, .036, .20, 0, 0, '#fffbeb');

    // 2. 11 Concentric Multi-Ring Ornament Balls forming the Christmas Tree Body
    const treeBalls = [
      // Row 1 (Apex below star - 1 ball)
      { u: 0, v: .48, w: .06, r: .115, cOuter: '#ff2244', cMid: '#ffd15e', cInner: '#22c55e' },
      // Row 2 (Upper-mid - 2 balls)
      { u: -.155, v: .22, w: .09, r: .122, cOuter: '#22c55e', cMid: '#ffffff', cInner: '#ff2244' },
      { u: .155, v: .22, w: -.07, r: .122, cOuter: '#ff2244', cMid: '#ffffff', cInner: '#ffd15e' },
      // Row 3 (Lower-mid - 3 balls)
      { u: -.295, v: -.06, w: -.07, r: .124, cOuter: '#ff2244', cMid: '#ffd15e', cInner: '#ffffff' },
      { u: 0, v: -.05, w: .12, r: .130, cOuter: '#22c55e', cMid: '#ffd15e', cInner: '#ff2244' },
      { u: .295, v: -.06, w: -.07, r: .124, cOuter: '#ff2244', cMid: '#ffd15e', cInner: '#ffffff' },
      // Row 4 (Base tier - 5 balls)
      { u: -.46, v: -.36, w: .08, r: .114, cOuter: '#22c55e', cMid: '#ffffff', cInner: '#ffd15e' },
      { u: -.23, v: -.38, w: -.08, r: .116, cOuter: '#ff2244', cMid: '#ffd15e', cInner: '#22c55e' },
      { u: 0, v: -.36, w: .13, r: .122, cOuter: '#ffd15e', cMid: '#ff2244', cInner: '#ffffff' },
      { u: .23, v: -.38, w: -.08, r: .116, cOuter: '#ff2244', cMid: '#ffd15e', cInner: '#22c55e' },
      { u: .46, v: -.36, w: .08, r: .114, cOuter: '#22c55e', cMid: '#ffffff', cInner: '#ffd15e' }
    ];
    for (let b = 0; b < treeBalls.length; b += 1) {
      const tb = treeBalls[b];
      // Glowing White Center Core (3D forward protrusion)
      push(tb.u, tb.v, tb.w + .11, '#ffffff');
      // Inner Concentric Ring (6 drones)
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2 + b * .3;
        push(tb.u + Math.cos(a) * tb.r * .36, tb.v + Math.sin(a) * tb.r * .36, tb.w + .08, tb.cInner);
      }
      // Middle Concentric Ring (10 drones)
      for (let i = 0; i < 10; i += 1) {
        const a = (i / 10) * Math.PI * 2 + b * .5;
        push(tb.u + Math.cos(a) * tb.r * .68, tb.v + Math.sin(a) * tb.r * .68, tb.w + .04 * Math.cos(a), tb.cMid);
      }
      // Outer Rim Ring (14 drones)
      for (let i = 0; i < 14; i += 1) {
        const a = (i / 14) * Math.PI * 2;
        push(tb.u + Math.cos(a) * tb.r, tb.v + Math.sin(a) * tb.r, tb.w - .03 * Math.sin(a), tb.cOuter);
      }
    }

    // 3. Tree Trunk & Golden Pedestal Base (v from -0.74 to -0.50)
    addStructuredLathe3D(28, 0, -.74, -.50, 0, t => .14 - t * .04, 4, 4, t => t < .4 ? '#ffd15e' : '#ff2244');

    // 4. Two 3D Double-Helix / Candy Cane Spiral Columns on Left and Right (helix_flow)
    addCandyHelixColumns3D(22, -.66, .58, .76, .095, .20, '#ff2244', '#ffffff', '#ffd15e');
  } else if (shapeId === 'christmas_wreath') {
    // Point 5 (Event Hari Raya & Natal): Karangan Bunga Natal (Wreath) Semi-3D + 6 Ornamen Merah + 6 Berry Emas + Pita Atas & Bawah
    const wcv = .02;
    // 1. Scalloped Outer 3D Evergreen Wreath Ring (104 drones)
    for (let i = 0; i < 104; i += 1) {
      const a = (i / 104) * Math.PI * 2;
      const r = .76 + .035 * Math.sin(a * 12);
      const w = .16 * Math.cos(a * 6);
      push(Math.cos(a) * r, wcv + Math.sin(a) * r, w, i % 4 === 0 ? '#4ade80' : '#22c55e');
    }
    // 2. Mid-Outer 3D Foliage Volume Ring (76 drones)
    for (let i = 0; i < 76; i += 1) {
      const a = (i / 76) * Math.PI * 2 + .03;
      const r = .62 + .025 * Math.cos(a * 12);
      const w = -.14 * Math.sin(a * 6);
      push(Math.cos(a) * r, wcv + Math.sin(a) * r, w, '#16a34a');
    }
    // 3. Inner Scalloped Frosted Snow & Pine Ring (64 drones)
    for (let i = 0; i < 64; i += 1) {
      const a = (i / 64) * Math.PI * 2;
      const r = .36 + .022 * Math.cos(a * 10);
      const w = .15 * Math.sin(a * 5);
      push(Math.cos(a) * r, wcv + Math.sin(a) * r, w, i % 2 === 0 ? '#e2e8f0' : '#22c55e');
    }
    // 4. 6 Shiny Red 3D Bauble Ornaments with White Glass Glare Cores (6 * 17 = 102 drones)
    const baubleAngles = [32, 148, 208, 332, 68, 112].map(d => d * Math.PI / 180);
    for (let b = 0; b < baubleAngles.length; b += 1) {
      const ba = baubleAngles[b];
      const bu = Math.cos(ba) * .51;
      const bv = wcv + Math.sin(ba) * .51;
      const bw = .18;
      const br = .072;
      // Upper-right white glass glare dot
      push(bu + br * .28, bv + br * .28, bw + .08, '#ffffff');
      // Inner 3D bauble dome ring (6 drones)
      for (let i = 0; i < 6; i += 1) {
        const a = (i / 6) * Math.PI * 2;
        push(bu + Math.cos(a) * br * .52, bv + Math.sin(a) * br * .52, bw + .05, '#ff4b6e');
      }
      // Outer 3D bauble rim (10 drones)
      for (let i = 0; i < 10; i += 1) {
        const a = (i / 10) * Math.PI * 2;
        push(bu + Math.cos(a) * br, bv + Math.sin(a) * br, bw, '#ff2244');
      }
    }
    // 5. 6 Golden Holly Berry Clusters interleaved around the Wreath (6 * 5 = 30 drones)
    const berryAngles = [8, 50, 130, 175, 240, 300].map(d => d * Math.PI / 180);
    for (let k = 0; k < berryAngles.length; k += 1) {
      const ka = berryAngles[k];
      const ku = Math.cos(ka) * .52;
      const kv = wcv + Math.sin(ka) * .52;
      push(ku, kv, .22, '#fffbeb');
      for (let i = 0; i < 4; i += 1) {
        const a = (i / 4) * Math.PI * 2 + .4;
        push(ku + Math.cos(a) * .032, kv + Math.sin(a) * .032, .19, '#ffd15e');
      }
    }
    // 6. Top 3D Satin Bow at Wreath Crown (v = 0.62) + 2 Long Ribbon Tails Hanging into the Center Hole (ribbon_wave)
    const topBowV = .62;
    addRing3D(10, 0, topBowV, .26, .048, .048, .20, 0, 0, '#ffd15e');
    for (const side of [-1, 1]) {
      for (let i = 0; i < 16; i += 1) {
        const t = (i / 16) * Math.PI * 2;
        const lu = side * (.04 + .18 * Math.pow(Math.sin(t * .5), 0.8));
        const lv = topBowV + Math.sin(t) * .085;
        const lw = .24 + Math.cos(t) * .08;
        push(lu, lv, lw, '#ff2244');
      }
      // Long wavy ribbon tails hanging into the center of the wreath (v from 0.56 down to 0.04)
      for (let i = 0; i < 15; i += 1) {
        const f = i / 14;
        const tu = side * (.045 + f * .11 + Math.sin(f * Math.PI * 2) * .022);
        const tv = topBowV - .05 - f * .52;
        const tw = .25 - f * .06 + Math.cos(f * Math.PI * 2) * .03;
        push(tu, tv, tw, f > .8 ? '#ffd15e' : '#ff2244', 'ribbon_wave', { lu: tu, lv: tv, lw: tw, distFromPole: f });
      }
    }
    // 7. Bottom 3D Satin Bow at Wreath Base (v = -0.58) + 2 Hanging Tails (ribbon_wave)
    const botBowV = -.58;
    addRing3D(8, 0, botBowV, .24, .042, .042, .20, 0, 0, '#ffd15e');
    for (const side of [-1, 1]) {
      for (let i = 0; i < 12; i += 1) {
        const t = (i / 12) * Math.PI * 2;
        const lu = side * (.035 + .15 * Math.sin(t * .5));
        const lv = botBowV + Math.sin(t) * .07;
        const lw = .22 + Math.cos(t) * .06;
        push(lu, lv, lw, '#ff2244');
      }
      for (let i = 0; i < 10; i += 1) {
        const f = i / 9;
        const tu = side * (.05 + f * .13);
        const tv = botBowV - .04 - f * .28;
        const tw = .22 - f * .05;
        push(tu, tv, tw, '#ff2244', 'ribbon_wave', { lu: tu, lv: tv, lw: tw, distFromPole: f });
      }
    }
  } else if (shapeId === 'christmas_baubles') {
    // Point 1 (Event Hari Raya & Natal): 7 Bola Kaca Natal Mengkilap 3D dengan Pantulan Cahaya Putih Neon di Kanan Atas & Ayunan Asinkron
    const baubles = [
      { cu: .02, cv: .03, cw: .05, r: .265, budget: 98, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 1.85 },
      { cu: -.56, cv: .40, cw: -.14, r: .205, budget: 74, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 2.15 },
      { cu: .58, cv: .38, cw: .14, r: .198, budget: 72, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 2.35 },
      { cu: -.62, cv: -.28, cw: .12, r: .188, budget: 68, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 1.95 },
      { cu: .60, cv: -.30, cw: -.12, r: .188, budget: 68, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 2.55 },
      { cu: .10, cv: .54, cw: -.22, r: .155, budget: 60, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 1.75 },
      { cu: -.12, cv: -.50, cw: .22, r: .155, budget: 60, colRim: '#ff2244', colFront: '#ff4b6e', colBack: '#991b36', freq: 2.45 }
    ];
    for (let b = 0; b < baubles.length; b += 1) {
      const sp = baubles[b];
      const pivotV = sp.cv + sp.r * 1.32;
      const phase = b * 1.15;
      const pushBauble = (u, v, w, col) => {
        push(u, v, w, col, 'bell_swing', { lu: u, lv: v, lw: w, spinOU: sp.cu, hingeV: pivotV, spinA: phase, spinFreq: sp.freq });
      };
      const nRim = Math.round(sp.budget * .34);
      const nGlare = Math.max(8, Math.round(sp.budget * .16));
      const nCap = 4;
      const nDomes = sp.budget - nRim - nGlare - nCap;
      // 1. Outer 3D Silhouette Rim
      for (let i = 0; i < nRim; i += 1) {
        const a = (i / nRim) * Math.PI * 2;
        pushBauble(sp.cu + Math.cos(a) * sp.r, sp.cv + Math.sin(a) * sp.r, sp.cw, sp.colRim);
      }
      // 2. Golden Ornament Cap at Top Pole
      for (let i = 0; i < nCap; i += 1) {
        const uOff = ((i / (nCap - 1)) - .5) * sp.r * .36;
        pushBauble(sp.cu + uOff, sp.cv + sp.r * 1.08, sp.cw + .02, '#ffd15e');
      }
      // 3. Upper-Right Curved Neon White 3D Glass Glare Arc (signature visual feature)
      const nInnerGlare = Math.floor(nGlare * .6);
      const nOuterGlare = nGlare - nInnerGlare;
      for (let i = 0; i < nInnerGlare; i += 1) {
        const f = nInnerGlare <= 1 ? .5 : i / (nInnerGlare - 1);
        const a = (18 + f * 60) * Math.PI / 180;
        const pr = sp.r * .58;
        const pw = Math.sqrt(Math.max(0, sp.r * sp.r - pr * pr));
        pushBauble(sp.cu + Math.cos(a) * pr, sp.cv + Math.sin(a) * pr, sp.cw + pw * 1.15, '#ffffff');
      }
      for (let i = 0; i < nOuterGlare; i += 1) {
        const f = nOuterGlare <= 1 ? .5 : i / (nOuterGlare - 1);
        const a = (24 + f * 48) * Math.PI / 180;
        const pr = sp.r * .74;
        const pw = Math.sqrt(Math.max(0, sp.r * sp.r - pr * pr));
        pushBauble(sp.cu + Math.cos(a) * pr, sp.cv + Math.sin(a) * pr, sp.cw + pw * 1.15, '#ffffff');
      }
      // 4. Front & Back 3D Dome Concentric Latitude Rings + Poles
      pushBauble(sp.cu, sp.cv, sp.cw + sp.r * 1.1, sp.colFront);
      pushBauble(sp.cu, sp.cv, sp.cw - sp.r * 1.1, sp.colBack);
      const rem = Math.max(4, nDomes - 2);
      const nFront1 = Math.round(rem * .34);
      const nFront2 = Math.round(rem * .22);
      const nBack1 = Math.round(rem * .28);
      const nBack2 = Math.max(2, rem - nFront1 - nFront2 - nBack1);
      const addLatRing = (cnt, fracR, zSign, col, phaseOff) => {
        const pr = sp.r * fracR;
        const pw = zSign * Math.sqrt(Math.max(0, sp.r * sp.r - pr * pr)) * 1.1;
        for (let i = 0; i < cnt; i += 1) {
          const a = (i / cnt) * Math.PI * 2 + phaseOff;
          // Skip upper-right glare overlap on front ring
          const deg = ((a * 180 / Math.PI) % 360 + 360) % 360;
          if (zSign > 0 && deg >= 15 && deg <= 80 && fracR > .48) {
            const shiftedA = a + Math.PI;
            pushBauble(sp.cu + Math.cos(shiftedA) * pr * .88, sp.cv + Math.sin(shiftedA) * pr * .88, sp.cw + pw, col);
          } else {
            pushBauble(sp.cu + Math.cos(a) * pr, sp.cv + Math.sin(a) * pr, sp.cw + pw, col);
          }
        }
      };
      addLatRing(nFront1, .76, 1, sp.colFront, .15);
      addLatRing(nFront2, .44, 1, sp.colFront, .55);
      addLatRing(nBack1, .72, -1, sp.colBack, .35);
      addLatRing(nBack2, .40, -1, sp.colBack, .85);
    }
  } else if (shapeId === 'christmas_heart_globe') {
    // Point 2 (Event Hari Raya & Natal): Bola Semi-3D + Gantungan Hati 3D di Dalamnya (depth_swing) + Pita Atas (ribbon_wave) + 2 Snowflakes (spin) + 4 Kembang Api Kecil (burst_pulse)
    const gcv = -.04, gR = .46;
    // 1. Semi-3D Outer Glass Globe Rim (64 drones) + Left/Right White 3D Crescent Meridians (48 drones)
    for (let i = 0; i < 64; i += 1) {
      const a = (i / 64) * Math.PI * 2;
      push(Math.cos(a) * gR, gcv + Math.sin(a) * gR, .04 * Math.sin(a * 2), '#ff2244');
    }
    for (const side of [-1, 1]) {
      for (let i = 0; i < 14; i += 1) {
        const f = i / 13;
        const a = (side < 0 ? Math.PI : 0) + (f - .5) * Math.PI * .72;
        const pr = gR * .84;
        const pw = (side < 0 ? 1 : -1) * Math.sin(f * Math.PI) * .28;
        push(Math.cos(a) * pr, gcv + Math.sin(a) * pr, pw, '#ffffff');
      }
      for (let i = 0; i < 10; i += 1) {
        const f = i / 9;
        const a = (side < 0 ? Math.PI : 0) + (f - .5) * Math.PI * .58;
        const pr = gR * .68;
        const pw = (side < 0 ? 1 : -1) * Math.sin(f * Math.PI) * .36;
        push(Math.cos(a) * pr, gcv + Math.sin(a) * pr, pw, '#ffffff');
      }
    }
    // Hanging String from Globe Top Pole to Heart Top Cleft (8 drones)
    for (let i = 0; i < 8; i += 1) {
      const f = i / 7;
      const sv = (gcv + gR) - f * (gR - .14);
      push(0, sv, 0, '#ffffff', 'depth_swing', { lu: 0, lv: sv, lw: 0, spinOU: 0, hingeV: gcv + gR, spinA: 0 });
    }
    // 2. 3D Glossy Heart Ornament Hanging Inside the Globe (132 drones, depth_swing)
    addGlossyHeart3D(0, gcv - .02, 0, 1.0, '#ff2244', '#ff4b6e', '#991b36', gcv + gR);

    // 3. 3D Volumetric Top Ribbon Bow Sitting Atop the Globe (v = 0.45, ribbon_wave)
    const bowV = gcv + gR + .03;
    addRing3D(10, 0, bowV, .16, .044, .044, .25, 0, 0, '#ffd15e');
    for (const side of [-1, 1]) {
      for (let i = 0; i < 14; i += 1) {
        const f = i / 13;
        const a = f * Math.PI;
        const lu = side * (.04 + Math.sin(a) * .22);
        const lv = bowV + Math.sin(a * 2) * .08 + f * .04;
        push(lu, lv, .14 * Math.sin(a), '#ff3b5c');
        if (i < 9) {
          push(lu * .78, lv * .98, -.12 * Math.sin(a), '#ff2244');
        }
      }
      // Flowing ribbon tails over the upper globe shoulders (10 drones per side, ribbon_wave)
      for (let i = 0; i < 10; i += 1) {
        const f = i / 9;
        const tu = side * (.06 + f * .26);
        const tv = bowV - .02 - f * .16 + Math.sin(f * Math.PI) * .03;
        const tw = .16 - f * .08;
        push(tu, tv, tw, '#ff3b5c', 'ribbon_wave', { lu: tu, lv: tv, lw: tw, distFromPole: f });
      }
    }

    // 4. Two 6-Branched 3D Crystal Snowflakes on Left & Right (64 drones, rotating via 'spin')
    for (const [su, sv, sw] of [[-.75, -.02, .08], [.75, -.02, -.08]]) {
      push(su, sv, sw + .06, '#ffffff', 'spin', { spinR: 0, spinA: 0, spinOU: su, hingeV: sv, spinOV: 0, lw: sw + .06 });
      for (let b = 0; b < 6; b += 1) {
        const ba = (b / 6) * Math.PI * 2;
        for (const r of [.042, .082, .122]) {
          push(
            su + Math.cos(ba) * r,
            sv + Math.sin(ba) * r,
            sw,
            r > .09 ? '#52c7ff' : '#ffffff',
            'spin',
            { spinR: r, spinA: ba, spinOU: su, hingeV: sv, spinOV: 0, lw: sw }
          );
        }
        // Chevron V-twigs on each snowflake arm
        for (const side of [-1, 1]) {
          const twigA = ba + side * .42;
          const twigR = .096;
          push(
            su + Math.cos(twigA) * twigR,
            sv + Math.sin(twigA) * twigR,
            sw + side * .03,
            '#ffffff',
            'spin',
            { spinR: twigR, spinA: twigA, spinOU: su, hingeV: sv, spinOV: 0, lw: sw + side * .03 }
          );
        }
      }
    }

    // 5. Four Corner Small Radial 3D Fireworks (108 drones, burst_pulse)
    addCornerFireworks3D('#ffd15e', '#ff2244', .12);
  } else if (shapeId === 'christmas_pokeball') {
    // Point 3 (Event Hari Raya & Natal): Bola Pokémon / Ornamen Bulat 3D Sempurna + 4 Bola Kecil Satelit Bertema Natal (bell_swing)
    const pR = .48;
    // 1. Central Glowing Button Core & Rings on the Front Equator (w = +0.48, 44 drones)
    push(0, 0, pR + .06, '#ffffff');
    for (let i = 0; i < 9; i += 1) {
      const a = (i / 9) * Math.PI * 2;
      push(Math.cos(a) * .045, Math.sin(a) * .045, pR + .05, '#ffffff');
    }
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 14) * Math.PI * 2;
      push(Math.cos(a) * .092, Math.sin(a) * .092, pR + .03, '#ffffff');
    }
    for (let i = 0; i < 20; i += 1) {
      const a = (i / 20) * Math.PI * 2;
      push(Math.cos(a) * .145, Math.sin(a) * .145, pR + .01, '#38bdf8');
    }

    // 2. 3D Equatorial Belt Ring & Outer Silhouette Perimeter (96 drones)
    for (let i = 0; i < 38; i += 1) {
      const lon = (i / 38) * Math.PI * 2;
      const u = Math.sin(lon) * pR;
      const w = Math.cos(lon) * pR;
      if (w > 0 && Math.abs(u) < .155) continue;
      push(u, 0, w, '#38bdf8');
    }
    for (let i = 0; i < 64; i += 1) {
      const a = (i / 64) * Math.PI * 2;
      const u = Math.cos(a) * pR;
      const v = Math.sin(a) * pR;
      const col = Math.abs(v) < .04 ? '#38bdf8' : v > 0 ? '#ff2244' : '#ffffff';
      push(u, v, 0, col);
    }

    // 3. Upper 3D Red Hemisphere (Latitude & Meridian Dome Arcs + White 3D Glass Glare, 104 drones)
    for (const [latDeg, cnt] of [[20, 26], [38, 22], [56, 18], [74, 12]]) {
      const lat = latDeg * Math.PI / 180;
      const ry = Math.sin(lat) * pR;
      const rxz = Math.cos(lat) * pR;
      for (let i = 0; i < cnt; i += 1) {
        const lon = (i / cnt) * Math.PI * 2 + lat;
        const u = Math.sin(lon) * rxz;
        const w = Math.cos(lon) * rxz;
        if (w > 0 && Math.hypot(u, ry) < .155) continue;
        // Upper-right glass highlight on front dome
        const isGlare = w > .18 && u > .10 && u < .34 && ry > .14 && ry < .36;
        push(u, ry, w, isGlare ? '#ffffff' : w >= 0 ? '#ff2244' : '#be123c');
      }
    }
    // Top Golden Ornament Crown & Hanging Ring (12 drones)
    addRing3D(8, 0, pR + .03, 0, .07, .07, 0, 0, 0, '#ffd15e');
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 3) * Math.PI;
      push(Math.cos(a) * .04, pR + .05 + Math.sin(a) * .05, 0, '#ffd15e');
    }

    // 4. Lower 3D White Hemisphere (Latitude & Meridian Dome Arcs, 96 drones)
    for (const [latDeg, cnt] of [[-20, 26], [-38, 22], [-56, 18], [-74, 12]]) {
      const lat = latDeg * Math.PI / 180;
      const ry = Math.sin(lat) * pR;
      const rxz = Math.cos(lat) * pR;
      for (let i = 0; i < cnt; i += 1) {
        const lon = (i / cnt) * Math.PI * 2 - lat;
        const u = Math.sin(lon) * rxz;
        const w = Math.cos(lon) * rxz;
        if (w > 0 && Math.hypot(u, ry) < .155) continue;
        push(u, ry, w, w >= 0 ? '#ffffff' : '#cbd5e1');
      }
    }

    // 5. Four Satellite 3D Christmas Ornament Spheres in the 4 Corners (4 * 38 = 152 drones, asynchronous bell_swing)
    addCornerSatellites3D([
      { cu: -.73, cv: .50, cw: -.12, r: .135, colMain: '#22c55e', colSub: '#ffd15e', phase: 0, freq: 1.75 },
      { cu: .73, cv: .50, cw: .12, r: .135, colMain: '#ffd15e', colSub: '#ff2244', phase: 1.4, freq: 2.15 },
      { cu: -.73, cv: -.48, cw: .12, r: .135, colMain: '#ff2244', colSub: '#ffd15e', phase: 2.8, freq: 2.35 },
      { cu: .73, cv: -.48, cw: -.12, r: .135, colMain: '#ffffff', colSub: '#38bdf8', phase: 4.2, freq: 1.95 }
    ]);
  } else {
    // 'festival_fireworks': 3D Filled Glass Chrysanthemum Core (with Neon White Glare) + 20 3D Radial Streamers + Tilted Shockwave Ring + 2 Spinning Snowflakes + 4 Corner Fireworks
    addFilledGlassSphere3D(115, 0, .06, 0, .25, '#ffd15e', '#ff5e97', '#7c2d12', false);
    const rayCount = 20;
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let r = 0; r < rayCount; r += 1) {
      const vy = 1 - 2 * ((r + .5) / rayCount);
      const rp = Math.sqrt(Math.max(0, 1 - vy * vy));
      const theta = r * golden;
      const du = Math.cos(theta) * rp;
      const dv = vy;
      const dw = Math.sin(theta) * rp;
      const col = r % 3 === 0 ? '#ffd15e' : r % 3 === 1 ? '#52c7ff' : '#ff5e97';
      for (let s = 1; s <= 9; s += 1) {
        const t = s / 9;
        const rad = .26 + t * .46;
        const lu = du * rad, lv = .06 + dv * rad - t * t * .09, lw = dw * rad;
        push(lu, lv, lw, col, s >= 7 ? 'burst_pulse' : '', s >= 7 ? { lu, lv, lw, spinOU: 0, hingeV: .06, hingeW: 0, spinA: r * .4, distFromPole: t } : undefined);
      }
    }
    addRing3D(56, 0, .02, 0, .72, .72, .36, .22, .28, '#b9f43c');
    // 2 Rotating 6-Branched Crystal Starflakes on Left & Right ('spin')
    for (const [su, sv, sw] of [[-.76, .02, .10], [.76, .02, -.10]]) {
      push(su, sv, sw + .05, '#ffffff', 'spin', { spinR: 0, spinA: 0, spinOU: su, hingeV: sv, spinOV: 0, lw: sw + .05 });
      for (let b = 0; b < 6; b += 1) {
        const ba = (b / 6) * Math.PI * 2;
        for (const r of [.045, .092]) {
          push(su + Math.cos(ba) * r, sv + Math.sin(ba) * r, sw, r > .07 ? '#ffd15e' : '#ffffff', 'spin', { spinR: r, spinA: ba, spinOU: su, hingeV: sv, spinOV: 0, lw: sw });
        }
      }
    }
    addCornerFireworks3D('#52c7ff', '#ff5e97', .115);
  }

  // Ensure exact count and map (u, v, w) -> 3D workspace coordinates (x, y, z) with 3D repulsive spacing relaxation
  const finalPts = [];
  if (pts.length >= count) {
    for (let i = 0; i < count; i += 1) {
      const idx = Math.min(pts.length - 1, Math.floor(i * pts.length / count));
      finalPts.push({ ...pts[idx] });
    }
  } else {
    for (const p of pts) finalPts.push({ ...p });
    let idx = 0;
    while (finalPts.length < count) {
      const base = pts[idx % Math.max(1, pts.length)] || { u: 0, v: 0, w: 0, color: startColor };
      const next = pts[(idx + 1) % Math.max(1, pts.length)] || base;
      const pass = Math.floor(idx / Math.max(1, pts.length)) + 1;
      const blend = .35 + (pass % 3) * .15;
      const jitterA = idx * 2.39996;
      const nu = Math.max(-.98, Math.min(.98, base.u + (next.u - base.u) * blend + Math.cos(jitterA) * .014 * pass));
      const nv = Math.max(-.95, Math.min(.95, base.v + (next.v - base.v) * blend + Math.sin(jitterA) * .014 * pass));
      const nw = Math.max(-.98, Math.min(.98, base.w + (next.w - base.w) * blend + Math.cos(jitterA * .7) * .02 * pass));
      const du = nu - base.u, dv = nv - base.v, dw = nw - base.w;
      finalPts.push({
        ...base,
        u: nu,
        v: nv,
        w: nw,
        lu: base.lu !== undefined ? base.lu + du : undefined,
        lv: base.lv !== undefined ? base.lv + dv : undefined,
        lw: base.lw !== undefined ? base.lw + dw : undefined,
        color: base.color || startColor
      });
      idx += 1;
    }
  }

  // Iterative 3D repulsive spacing relaxation enforcing static spacing > 1.5 m (target >= 1.62 m)
  const cx = .5, cy = .47, scaleU = .38, scaleV = .38, scaleW = 15.2;
  const minDistUVW = 1.62 / scaleW;
  const minDistSq = minDistUVW * minDistUVW;
  for (let iter = 0; iter < 54; iter += 1) {
    let maxOverlap = 0;
    const pushFactor = iter < 32 ? .48 : .54;
    for (let i = 0; i < finalPts.length; i += 1) {
      const p1 = finalPts[i];
      for (let j = i + 1; j < finalPts.length; j += 1) {
        const p2 = finalPts[j];
        const du = p1.u - p2.u;
        const dv = p1.v - p2.v;
        const dw = p1.w - p2.w;
        const dSq = du * du + dv * dv + dw * dw;
        if (dSq < minDistSq) {
          const d = Math.sqrt(dSq);
          const overlap = minDistUVW - d;
          if (overlap > maxOverlap) maxOverlap = overlap;
          let ux, uy, uz;
          if (d > 1e-5 && Math.abs(dw) > .014) {
            ux = du / d;
            uy = dy_or_dv(dv, d);
            uz = dw / d;
          } else {
            const a = (i * 2.399963) + j * .71;
            const zSign = (i + j) % 2 === 0 ? 1 : -1;
            ux = Math.cos(a) * .62;
            uy = Math.sin(a) * .62;
            uz = zSign * .78;
            const norm = Math.hypot(ux, uy, uz);
            ux /= norm; uy /= norm; uz /= norm;
          }
          const push = overlap * pushFactor;
          p1.u = Math.max(-.96, Math.min(.96, p1.u + ux * push));
          p1.v = Math.max(-.93, Math.min(.93, p1.v + uy * push));
          p1.w = Math.max(-.96, Math.min(.96, p1.w + uz * push));
          p2.u = Math.max(-.96, Math.min(.96, p2.u - ux * push));
          p2.v = Math.max(-.93, Math.min(.93, p2.v - uy * push));
          p2.w = Math.max(-.96, Math.min(.96, p2.w - uz * push));
        }
      }
    }
    if (maxOverlap < 1e-4 && iter >= 10) break;
  }

  function dy_or_dv(dv, d) {
    return dv / d;
  }

  return finalPts.map(pt => {
    const x = Number((cx + pt.u * scaleU).toFixed(5));
    const y = Number((cy - pt.v * scaleV).toFixed(5));
    const z = Number((pt.w * scaleW).toFixed(4));
    const themeColor = pt.color || startColor;
    const drone = { x, y, z, themeColor, color: themeColor };
    if (pt.part) {
      // Simpan posisi lokal yang sudah direlaksasi agar animasi tetap mempertahankan jarak > 1.2 m.
      Object.assign(drone, {
        part: pt.part,
        lu: pt.u,
        lv: pt.v,
        lw: pt.w
      });
      for (const key of ['hingeV', 'hingeW', 'distFromPole', 'spinR', 'spinA', 'spinOU', 'spinOV', 'spinFreq', 'spinSpeed']) {
        if (pt[key] !== undefined) drone[key] = pt[key];
      }
    }
    return drone;
  });
}

const CATALOG_PERMUTATIONS_3_OF_5 = (() => {
  const list = [];
  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      if (j === i) continue;
      for (let k = 0; k < 5; k += 1) {
        if (k === i || k === j) continue;
        list.push([i, j, k]);
      }
    }
  }
  return list;
})();

const clientPresetCounter = { brand: 0, wedding: 0, festival: 0, national: 0, christmas: 0 };
let activeClientPresetKey = 'brand';

function getUserSequenceBaseSeed() {
  try {
    const key = 'skyfy.clientSequenceSeed';
    const existing = window.sessionStorage.getItem(key);
    if (existing && Number.isInteger(Number(existing))) return Number(existing);
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    const seed = buffer[0] % 100000;
    window.sessionStorage.setItem(key, String(seed));
    return seed;
  } catch {
    return Math.floor(Date.now() % 100000);
  }
}

function nextClientPermutationIndex(presetKey) {
  const step = clientPresetCounter[presetKey] || 0;
  clientPresetCounter[presetKey] = step + 1;
  if (step === 0) return 0;
  const base = getUserSequenceBaseSeed();
  const offset = { brand: 3, wedding: 17, festival: 31, national: 47, christmas: 61 }[presetKey] || 11;
  return 1 + ((base + offset + (step - 1) * 7) % (CATALOG_PERMUTATIONS_3_OF_5.length - 1));
}

function buildClientCatalogPool(presetKey, count = 500) {
  if (presetKey === 'brand') {
    return {
      title: 'Peluncuran Logo & Brand 3D',
      palette: ['#b9f43c', '#52c7ff'],
      pool: [
        { name: 'Perisai & Monogram 3D', shapeId: 'brand_shield', palette: ['#b9f43c', '#52c7ff'] },
        { name: 'Bola Dunia & Satelit 3D', shapeId: 'brand_globe', palette: ['#52c7ff', '#ffd15e'] },
        { name: 'Trofi Prestasi & Bintang 3D', shapeId: 'brand_trophy', palette: ['#ffd15e', '#52c7ff'] },
        { name: 'Roket Peluncuran 3D', shapeId: 'brand_rocket', palette: ['#ffffff', '#ff684c'] },
        { name: 'Berlian & Gyro 3D', shapeId: 'brand_diamond', palette: ['#52c7ff', '#ffd15e'] }
      ],
      count
    };
  }

  if (presetKey === 'wedding') {
    return {
      title: 'Pernikahan & Wedding 3D',
      palette: ['#ff77b7', '#ffe5aa'],
      pool: [
        { name: 'Pasangan Pengantin 3D', shapeId: 'wedding_couple', palette: ['#ffffff', '#38bdf8'] },
        { name: 'Kotak Cincin Terbuka 3D', shapeId: 'wedding_ringbox', palette: ['#ef4444', '#ffd15e'] },
        { name: 'Kue Pernikahan Bertingkat 3D', shapeId: 'wedding_cake', palette: ['#fffbeb', '#fbcfe8'] },
        { name: 'Dua Cincin Bersatu 3D', shapeId: 'wedding_rings', palette: ['#ffd15e', '#9be8ff'] },
        { name: 'Gelas Bersulang & Hati 3D', shapeId: 'wedding_toast', palette: ['#facc15', '#ff4b8b'] }
      ],
      count
    };
  }

  if (presetKey === 'national') {
    return {
      title: 'Event Nasional & Konser 3D',
      palette: ['#ffd15e', '#ff3b3b'],
      pool: [
        { name: 'Dua Bendera Merah Putih Berkibar 3D', shapeId: 'national_flags', palette: ['#ff3b3b', '#ffffff'] },
        { name: 'Monumen Nasional 3D', shapeId: 'national_monas', palette: ['#ffffff', '#ffd15e'] },
        { name: 'Candi Borobudur 3D', shapeId: 'national_borobudur', palette: ['#cbd5e1', '#ffd15e'] },
        { name: 'Armillary Nusantara 3D', shapeId: 'national_compass', palette: ['#ffd15e', '#73e48c'] },
        { name: 'Gitar Nada & Gelombang 3D', shapeId: 'national_guitar', palette: ['#ff5474', '#52c7ff'] }
      ],
      count
    };
  }

  if (presetKey === 'christmas') {
    return {
      title: 'Event Hari Raya & Natal 3D',
      palette: ['#ff2244', '#ffd15e'],
      pool: [
        { name: 'Pohon Natal & Spiral Candy Cane 3D', shapeId: 'christmas_tree', palette: ['#ff2244', '#ffd15e'] },
        { name: 'Karangan Bunga Natal (Wreath) 3D', shapeId: 'christmas_wreath', palette: ['#22c55e', '#ff2244'] },
        { name: '7 Bola Kaca Natal Mengkilap 3D', shapeId: 'christmas_baubles', palette: ['#ff2244', '#ffffff'] },
        { name: 'Bola Hati, Pita & Kristal Salju 3D', shapeId: 'christmas_heart_globe', palette: ['#ff2244', '#ffffff'] },
        { name: 'Bola Pokémon & Ornamen Natal 3D', shapeId: 'christmas_pokeball', palette: ['#ff2244', '#ffffff'] }
      ],
      count
    };
  }

  return {
    title: 'Event Besar & Festival 3D',
    palette: ['#ff3b3b', '#ffd15e'],
    pool: [
      { name: 'Bianglala Berputar 3D', shapeId: 'festival_ferris', palette: ['#52c7ff', '#ff5e97'] },
      { name: 'Balon Udara 3D', shapeId: 'festival_balloon', palette: ['#ff3b3b', '#ffd15e'] },
      { name: 'Lentera & Teratai 3D', shapeId: 'festival_lantern', palette: ['#ff5e4d', '#ff82b2'] },
      { name: 'Kembang Api Mekar 3D', shapeId: 'festival_fireworks', palette: ['#ffd15e', '#52c7ff'] },
      { name: 'Kado Kejutan 3D', shapeId: 'festival_gift', palette: ['#ff5e97', '#ffd15e'] }
    ],
    count
  };
}

function rematchManualSceneTransitions() {
  let previousDrones = null;
  state.scenes.forEach((scene, index) => {
    if (scene.formation === 'manual' && scene.manualDrones?.length) {
      if (previousDrones && previousDrones.length === scene.manualDrones.length) {
        scene.manualDrones = matchAiVideoDrones(previousDrones, scene.manualDrones);
      }
      previousDrones = scene.manualDrones;
      if (index === 0) scene._takeoffGrid = buildTakeoffGridDrones(scene.manualDrones, '3d');
      else delete scene._takeoffGrid;
    } else {
      delete scene._takeoffGrid;
      previousDrones = null;
    }
  });
}

function syncSceneOrderButtons() {
  const prevBtn = q('[data-scene-move="-1"]');
  const nextBtn = q('[data-scene-move="1"]');
  const shuffleBtn = q('[data-scene-shuffle]');
  const deleteBtn = q('[data-scene-delete]');
  if (prevBtn) prevBtn.disabled = state.selectedScene <= 0;
  if (nextBtn) nextBtn.disabled = state.selectedScene < 0 || state.selectedScene >= state.scenes.length - 1;
  if (shuffleBtn) shuffleBtn.disabled = state.scenes.length < 2;
  if (deleteBtn) deleteBtn.disabled = state.scenes.length <= 1;
}

function applyClientCatalogPreset(presetKey, skipConfirm = false) {
  if (!aiPreview.hidden) unlockAiWorkspace();
  if (!skipConfirm && hasCustomEdits && !window.confirm('Memilih paket desain akan mengganti scene proyek saat ini. Lanjutkan?')) return;
  stopPlayback();
  clearWorkspaceTool();
  activeClientPresetKey = presetKey;
  qa('[data-client-preset]').forEach(button => {
    button.classList.toggle('active', button.dataset.clientPreset === presetKey);
  });

  const count = 500;
  if (presetKey === 'custom') {
    const palette = { startColor: DEFAULT_BLENDER_COLOR, endColor: '#52c7ff', gradient: false };
    state.scenes = [
      { name: 'Kanvas Kustom 01', formation: 'free', duration: 8, palette: { ...palette } },
      { name: 'Kanvas Kustom 02', formation: 'free', duration: 8, palette: { ...palette } },
      { name: 'Kanvas Kustom 03', formation: 'free', duration: 8, palette: { ...palette } }
    ];
    state.selectedScene = -1;
    state.manualDrones = [];
    state.clipboardDrones = [];
    state.droneCount = count;
    state.groundVisible = true;
    projectName.value = 'Desain Kustom Klien';
    countInput.value = String(count);
    countNumberInput.value = String(count);
    countOutput.textContent = count.toLocaleString('id-ID');
    updateRangeFill(countInput, count, 1, 1000);
    groundToggle.checked = true;
    sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
    updateSceneSummary();
    chooseScene(0);
    syncSceneOrderButtons();
    markDirty(false);
    hasCustomEdits = false;
    starterBanner.hidden = true;
    if (generatorDialog.open) generatorDialog.close();
    if (!featureDock.classList.contains('is-open')) featureToggle.click();
    q('#reference-title')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Mode Buat Desain Sendiri siap. Unggah gambar referensi atau tarik drone ke kanvas.');
    return;
  }

  const catalog = buildClientCatalogPool(presetKey, count);
  const permIndex = nextClientPermutationIndex(presetKey);
  const chosenIndices = CATALOG_PERMUTATIONS_3_OF_5[permIndex];
  const chosenDefs = chosenIndices.map(idx => catalog.pool[idx]);
  const badge = q('[data-sequence-badge]');
  if (badge) badge.textContent = `500 drone · 3D #${String(permIndex + 1).padStart(2, '0')}`;

  let previousDrones = null;
  state.scenes = chosenDefs.map((def, sceneIndex) => {
    const rawDrones = buildCatalog3DSceneDrones(def.shapeId, catalog.count, def.palette[0], def.palette[1]);
    const matchedDrones = previousDrones ? matchAiVideoDrones(previousDrones, rawDrones) : rawDrones;
    previousDrones = matchedDrones;
    const scene = {
      name: def.name,
      formation: 'manual',
      duration: 8,
      manualDrones: matchedDrones,
      catalog3D: true,
      customColored: false,
      themePalette: [...def.palette],
      palette: { startColor: def.palette[0], endColor: def.palette[1], gradient: true }
    };
    if (sceneIndex === 0) scene._takeoffGrid = buildTakeoffGridDrones(matchedDrones, '3d');
    return scene;
  });
  state.selectedScene = -1;
  state.manualDrones = [];
  state.clipboardDrones = [];
  state.droneCount = catalog.count;
  state.startColor = catalog.palette[0];
  state.endColor = catalog.palette[1];
  state.gradient = true;
  state.groundVisible = true;
  state.camera = { ...DEFAULT_CAMERA };
  setView('perspective');
  projectName.value = catalog.title;
  countInput.value = String(catalog.count);
  countNumberInput.value = String(catalog.count);
  countOutput.textContent = catalog.count.toLocaleString('id-ID');
  updateRangeFill(countInput, catalog.count, 1, 1000);
  groundToggle.checked = true;
  qa('[data-color-preset]').forEach(btn => btn.classList.toggle('active', btn.dataset.colorPreset === 'theme'));
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  chooseScene(0);
  syncSceneOrderButtons();
  stopPlayback();
  timeRange.value = '0';
  updateTime(0);
  markDirty(false);
  hasCustomEdits = false;
  starterBanner.hidden = true;
  if (generatorDialog.open) generatorDialog.close();
  showToast(`${catalog.title} · Urutan #${String(permIndex + 1).padStart(2, '0')} (${chosenDefs.map(d => d.name).join(' → ')}).`);
}

function moveActiveScene(delta) {
  const from = state.selectedScene;
  const to = from + delta;
  if (from < 0 || to < 0 || to >= state.scenes.length) return;
  if (state.scenes[from]?.formation === 'manual') state.scenes[from].manualDrones = state.manualDrones;
  stopPlayback();
  const [moved] = state.scenes.splice(from, 1);
  state.scenes.splice(to, 0, moved);
  rematchManualSceneTransitions();
  state.selectedScene = -1;
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  chooseScene(to);
  syncSceneOrderButtons();
  markDirty();
  showToast(`Urutan diubah: ${moved.name} kini di Scene ${String(to + 1).padStart(2, '0')}.`);
}

function shuffleProjectScenes() {
  if (state.scenes.length < 2) return;
  if (state.scenes[state.selectedScene]?.formation === 'manual') {
    state.scenes[state.selectedScene].manualDrones = state.manualDrones;
  }
  stopPlayback();
  const first = state.scenes[0];
  if (state.scenes.length === 2) {
    state.scenes.reverse();
  } else {
    // Rotate/shuffle so the new order is always distinct from the current order
    const offset = 1 + (getUserSequenceBaseSeed() % (state.scenes.length - 1));
    state.scenes = state.scenes.map((_, idx) => state.scenes[(idx + offset) % state.scenes.length]);
    if (state.scenes[0] === first) state.scenes.push(state.scenes.shift());
  }
  rematchManualSceneTransitions();
  state.selectedScene = -1;
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  chooseScene(0);
  syncSceneOrderButtons();
  markDirty();
  showToast(`Urutan scene diacak: ${state.scenes.map(s => s.name).join(' → ')}.`);
}

function deleteActiveScene() {
  if (state.scenes.length <= 1) {
    showToast('Minimal 1 scene diperlukan dalam proyek.');
    return;
  }
  const index = state.selectedScene;
  const removedName = state.scenes[index]?.name || 'Scene';
  stopPlayback();
  state.scenes.splice(index, 1);
  rematchManualSceneTransitions();
  state.selectedScene = -1;
  sceneTrack.replaceChildren(...state.scenes.map(createSceneCard));
  updateSceneSummary();
  const nextIndex = Math.min(index, state.scenes.length - 1);
  chooseScene(nextIndex);
  syncSceneOrderButtons();
  markDirty();
  showToast(`${removedName} dihapus dari urutan.`);
}

qa('[data-client-preset]').forEach(button => {
  button.addEventListener('click', () => applyClientCatalogPreset(button.dataset.clientPreset));
});
q('[data-catalog-shuffle]')?.addEventListener('click', () => {
  const targetPreset = activeClientPresetKey === 'custom' ? 'brand' : activeClientPresetKey;
  applyClientCatalogPreset(targetPreset, true);
});
qa('[data-scene-move]').forEach(button => {
  button.addEventListener('click', () => moveActiveScene(Number(button.dataset.sceneMove)));
});
q('[data-scene-shuffle]')?.addEventListener('click', shuffleProjectScenes);
q('[data-scene-delete]')?.addEventListener('click', deleteActiveScene);

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
  syncSceneOrderButtons();
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
  countInput.value = '500';
  startColor.value = DEFAULT_BLENDER_COLOR;
  endColor.value = '#52c7ff';
  gradientToggle.checked = false;
  countInput.dispatchEvent(new Event('input'));
  updateColors();
  updatePlacedCount();
  selectFormation('orbit', true, true);
  hasCustomEdits = false;
  showToast('Workspace dikembalikan ke pengaturan awal.');
});

function projectSnapshot() {
  normalizeMotionTimings();
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
      ...(scene.aiGenerated === true && ['animation', 'manual'].includes(scene.formation) ? { aiGenerated: true } : {}),
      ...(scene.references?.length ? { references: scene.references.map(reference => ({ ...reference })) } : {}),
      ...(scene.formation === 'manual' ? { manualDrones: scene.manualDrones || [], ...(scene.bounds ? { bounds: scene.bounds } : {}) } : {}),
      ...(scene.formation === 'path' ? { path: scene.path.map(point => ({ ...point })) } : {}),
      ...(scene.formation === 'animation' ? { frames: scene.frames, bounds: scene.bounds } : {})
    }))
  };
}

function validateProject(data) {
  if (!data || data.format !== 'skyfy-studio-project' || data.version !== 1) throw new Error('Format proyek Skyfy tidak dikenal.');
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 48) throw new Error('Nama proyek tidak valid.');
  if (!Number.isInteger(data.droneCount) || data.droneCount < 1 || data.droneCount > 1000) throw new Error('Jumlah drone tidak valid (1–1.000).');
  if (typeof data.gradient !== 'boolean') throw new Error('Pengaturan gradasi tidak valid.');
  if (![data.startColor, data.endColor].every(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color))) throw new Error('Warna proyek tidak valid.');
  if (data.groundVisible !== undefined && typeof data.groundVisible !== 'boolean') throw new Error('Pengaturan ground tidak valid.');
  if (data.markerStyle !== undefined && !['model', 'point'].includes(data.markerStyle)) throw new Error('Tampilan drone tidak valid.');
  if (data.markerScale !== undefined && (!Number.isFinite(data.markerScale) || data.markerScale < .7 || data.markerScale > 1.8)) throw new Error('Ukuran tampilan tidak valid.');
  if (data.workspaceWidth !== undefined && (!Number.isFinite(data.workspaceWidth) || data.workspaceWidth < 5 || data.workspaceWidth > 400)) throw new Error('Lebar workspace tidak valid.');
  if (!Array.isArray(data.scenes) || !data.scenes.length || data.scenes.length > MAX_SCENES) throw new Error('Jumlah scene tidak valid.');
  let referenceTotalLength = 0;
  const scenes = data.scenes.map((scene, index) => {
    if (!scene || typeof scene.name !== 'string' || !scene.name.trim() || scene.name.length > 80) throw new Error(`Nama scene ${index + 1} tidak valid.`);
    if (!['orbit', 'wave', 'mark', 'heart', 'star', 'spiral', 'burst', 'path', 'free', 'manual', 'animation'].includes(scene.formation)) throw new Error(`Formasi scene ${index + 1} tidak valid.`);
    if (!Number.isFinite(scene.duration) || scene.duration <= 0 || scene.duration > 120) throw new Error(`Durasi scene ${index + 1} tidak valid.`);
    const palette = scene.palette === undefined ? data : scene.palette;
    if (!palette || typeof palette !== 'object' || Array.isArray(palette) || typeof palette.gradient !== 'boolean' ||
        ![palette.startColor, palette.endColor].every(color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color))) throw new Error(`Palet scene ${index + 1} tidak valid.`);
    if (scene.colorOverride !== undefined && (typeof scene.colorOverride !== 'boolean' || scene.formation !== 'animation')) throw new Error(`Pengaturan warna animasi scene ${index + 1} tidak valid.`);
    if (scene.aiGenerated !== undefined && (scene.aiGenerated !== true || !['animation', 'manual'].includes(scene.formation))) throw new Error(`Asal desain scene ${index + 1} tidak valid.`);
    const savedOrigin = scene.aiGenerated === true ? { aiGenerated: true } : {};
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
        if (!Array.isArray(frame.drones) || !frame.drones.length || frame.drones.length > MAX_AI_SHOW_DRONES || frameIndex && frame.drones.length !== droneCount) throw new Error(`Drone frame ${frameIndex + 1} tidak valid.`);
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
      return { name: scene.name, formation: 'animation', duration: scene.duration, frames, ...savedAppearance, ...savedReferences, ...savedOrigin, ...(safeBounds ? { bounds: safeBounds } : {}) };
    }
    if (scene.formation === 'path') {
      if (!Array.isArray(scene.path) || scene.path.length < 4 || scene.path.length > 48 || scene.path.some(point =>
        !point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || point.x < .08 || point.x > .92 || point.y < .08 || point.y > .78)) {
        throw new Error(`Titik bentuk scene ${index + 1} tidak valid.`);
      }
      return { name: scene.name, formation: 'path', duration: scene.duration, path: scene.path.map(point => ({ x: point.x, y: point.y })), ...savedAppearance, ...savedReferences };
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
    return { name: scene.name, formation: 'manual', duration: scene.duration, manualDrones, ...savedAppearance, ...savedReferences, ...savedOrigin, ...(safeBounds ? { bounds: safeBounds } : {}) };
  });
  return { name: data.name, droneCount: data.droneCount, gradient: data.gradient, startColor: data.startColor, endColor: data.endColor, groundVisible: data.groundVisible ?? true, markerStyle: 'point', markerScale: data.markerScale ?? 1, workspaceWidth: data.workspaceWidth ?? 40, scenes };
}

function projectFilename(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'skyfy-project'}.skyfy.json`;
}

function downloadProject(data) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  if (blob.size > MAX_PROJECT_FILE_BYTES) throw new Error('File proyek melebihi 40 MB. Kurangi gambar referensi atau frame animasi.');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = projectFilename(data.name);
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
  hasUnsavedChanges = false;
  hasUserProject = true;
  saveState.textContent = 'File proyek diunduh';
  scheduleDraftSave();
  return link.download;
}

q('[data-save]').addEventListener('click', async () => {
  if (!aiPreview.hidden) {
    showToast('Pratinjau AI tidak dapat disimpan. Tutup pratinjau untuk menyimpan proyek manual.');
    return;
  }

  const isUserLoggedIn = document.querySelector('meta[name="user-logged-in"]')?.content === 'true';
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  const rawProjectId = window.__PROJECT_ID__ || document.querySelector('meta[name="project-id"]')?.content;
  const parsedProjectId = Number(rawProjectId);
  const currentProjectId = Number.isInteger(parsedProjectId) && parsedProjectId > 0 ? String(parsedProjectId) : '';

  if (isUserLoggedIn && csrfToken) {
    const originalText = saveState.textContent;
    try {
      saveState.textContent = 'Menyimpan ke akun…';
      const snap = projectSnapshot();
      const payload = {
        name: projectName.value.trim() || 'Proyek Skyfy',
        drone_count: state.droneCount,
        scenes_count: state.scenes.length,
        duration: Math.round(totalDuration()),
        data: snap
      };

      const url = currentProjectId ? `/api/projects/${currentProjectId}` : '/api/projects';
      const method = currentProjectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menyimpan ke server.');
      }

      const resData = await response.json();
      if (resData.project?.id) {
        window.__PROJECT_ID__ = resData.project.id;
        const metaProjId = document.querySelector('meta[name="project-id"]');
        if (metaProjId) metaProjId.content = resData.project.id;
        if (!currentProjectId && window.history?.pushState) {
          window.history.pushState(null, '', `/studio/${resData.project.id}`);
        }
      }

      hasUnsavedChanges = false;
      saveState.textContent = 'Tersimpan di akun';
      showToast(resData.message || 'Proyek berhasil disimpan ke akun Anda.');
      scheduleDraftSave();
      return;
    } catch (error) {
      saveState.textContent = originalText;
      showToast(`Gagal simpan ke cloud: ${error.message}. Mengunduh cadangan lokal…`);
      try {
        downloadProject(projectSnapshot());
      } catch (dlErr) {
        showToast(dlErr.message);
      }
      return;
    }
  }

  try {
    downloadProject(projectSnapshot());
    showToast('File proyek diunduh. Masuk/daftar akun untuk menyimpan langsung di cloud.');
  } catch (error) {
    showToast(error.message);
  }
});

function dronesForExport(seconds, width, height) {
  const position = sceneAtTime(seconds);
  const scene = state.scenes[position.index];
  const localFormTime = formationLocalTime(position.index, position.localTime);
  const rawCur = sceneDrones(scene, localFormTime, width, height);
  const current = scene.formation === 'manual' && scene.catalog3D
    ? rawCur.map((drone, idx) => animateCatalog3DDrone(drone, idx, rawCur.length, localFormTime * 1.35, scene))
    : rawCur;
  if (position.index === 0 || scene.formation === 'animation') return { drones: current, bounds: scene.bounds || null };
  const transitionDuration = transitionSeconds(position.index);
  if (position.localTime >= transitionDuration) return { drones: current, bounds: scene.bounds || null };
  const previousScene = state.scenes[position.index - 1];
  const rawPrev = sceneDrones(previousScene, previousScene.duration, width, height);
  const previous = previousScene.formation === 'manual' && previousScene.catalog3D
    ? rawPrev.map((drone, idx) => animateCatalog3DDrone(drone, idx, rawPrev.length, previousScene.duration * 1.35, previousScene))
    : rawPrev;
  if (previous.length !== current.length || previousScene.bounds || scene.bounds) return { drones: current, bounds: scene.bounds || null };
  const t = Math.max(0, Math.min(1, position.localTime / transitionDuration));
  const blend = t * t * t * (t * (t * 6 - 15) + 10);
  const env = 16 * t * t * (1 - t) * (1 - t);
  return { drones: current.map((drone, index) => {
    const zSep = ((previous[index].z || 0) !== 0 || (drone.z || 0) !== 0) ? (index % 2 === 0 ? .18 : -.18) * env : 0;
    return {
      x: previous[index].x + (drone.x - previous[index].x) * blend,
      y: previous[index].y + (drone.y - previous[index].y) * blend,
      z: (previous[index].z || 0) + ((drone.z || 0) - (previous[index].z || 0)) * blend + zSep
    };
  }), bounds: null };
}

function alembicPayload() {
  normalizeMotionTimings();
  const duration = totalDuration();
  if (duration > 120) throw new Error('Ekspor ABC mendukung durasi maksimal 120 detik.');
  const width = 1200; const height = 600;
  const initial = dronesForExport(0, width, height);
  const count = initial.drones.length;
  if (!count) throw new Error('Scene kosong tidak dapat diekspor ke ABC.');
  const fps = Math.max(1, Math.min(20, Math.floor((MAX_ANIMATION_FRAMES - 1) / duration), Math.floor((300_000 / count - 1) / duration)));
  const frameCount = Math.round(duration * fps) + 1;
  if (frameCount > MAX_ANIMATION_FRAMES || frameCount * count > MAX_ANIMATION_ROWS) {
    throw new Error('Ekspor ABC melebihi 1.000 frame atau 300.000 sampel. Kurangi durasi atau jumlah drone.');
  }
  const frames = [];
  for (let index = 0; index < frameCount; index += 1) {
    const { drones, bounds } = dronesForExport(Math.min(duration, index / fps), width, height);
    if (drones.length !== count) throw new Error('Jumlah drone harus sama di setiap scene untuk ekspor ABC.');
    frames.push(drones.map(drone => {
      const point = worldPoint(drone, bounds);
      const elevation = bounds?.projection === 'animation' ? point.y : (1 - drone.y) * state.workspaceWidth;
      return [Number(point.x.toFixed(5)), Number((point.z || 0).toFixed(5)), Number(elevation.toFixed(5))];
    }));
  }
  if (state.scenes.some(scene => scene.aiGenerated) && frames.length > 1) {
    let peakSpeed = 0;
    for (let index = 1; index < frames.length; index += 1) {
      for (let drone = 0; drone < count; drone += 1) {
        const previous = frames[index - 1][drone];
        const current = frames[index][drone];
        const speed = Math.hypot(current[0] - previous[0], current[1] - previous[1], current[2] - previous[2]) * fps;
        if (speed > peakSpeed) peakSpeed = speed;
      }
    }
    if (peakSpeed > MAX_DRONE_SPEED_MPS * .98) {
      const factor = (MAX_DRONE_SPEED_MPS * .98) / peakSpeed;
      for (let index = 0; index < frames.length; index += 1) {
        frames[index] = frames[index].map(point => [
          Number((point[0] * factor).toFixed(5)),
          Number((point[1] * factor).toFixed(5)),
          Number((point[2] * factor).toFixed(5))
        ]);
      }
    }
  }
  for (let index = 1; index < frames.length; index += 1) {
    for (let drone = 0; drone < count; drone += 1) {
      const previous = frames[index - 1][drone];
      const current = frames[index][drone];
      const speed = Math.hypot(current[0] - previous[0], current[1] - previous[1], current[2] - previous[2]) * fps;
      if (speed > MAX_DRONE_SPEED_MPS + .01) {
        throw new Error(`Drone ${drone + 1} bergerak ${displaySeconds(speed)} m/detik pada ${formatPlaybackTime(index / fps)}. Batas ekspor 5 m/detik.`);
      }
    }
  }
  return { fps, frames };
}

exportAbcButton.addEventListener('click', async () => {
  if (!aiPreview.hidden || exportInProgress) return;
  if (alembicAvailable === false) {
    showToast(alembicStatus.textContent);
    return;
  }
  exportInProgress = true;
  exportAbcButton.disabled = true;
  const previousLabel = saveState.textContent;
  saveState.textContent = 'Membuat file Alembic…';
  try {
    const response = await fetch('/api/alembic/export', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alembicPayload())
    });
    if (!response.ok) {
      if (response.status === 404 || response.status === 405) throw new Error('Unduh .abc memerlukan server Studio. Jalankan node server.cjs.');
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Server tidak dapat membuat Alembic.');
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = projectFilename(projectName.value.trim()).replace(/\.skyfy\.json$/, '.abc');
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    showToast('File Alembic .abc diunduh. Proyek .json tetap tersedia untuk edit lengkap.');
  } catch (error) {
    showToast(error.message || 'Ekspor Alembic gagal.');
  } finally {
    exportInProgress = false;
    exportAbcButton.disabled = false;
    saveState.textContent = previousLabel;
  }
});

q('[data-open-project]')?.addEventListener('click', () => {
  if (hasUnsavedChanges && !window.confirm('Perubahan yang belum disimpan akan hilang. Buka proyek lain?')) return;
  projectFile.click();
});
function applyProjectToEditor(project) {
  stopPlayback();
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
  countNumberInput.value = String(state.droneCount);
  countOutput.textContent = state.droneCount.toLocaleString('id-ID');
  updateRangeFill(countInput, state.droneCount, 1, 1000);
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
  hasCustomEdits = false;
}
projectFile.addEventListener('change', async () => {
  const file = projectFile.files[0];
  if (!file) return;
  try {
    if (file.size > MAX_PROJECT_FILE_BYTES) throw new Error('Maksimal ukuran file proyek 40 MB.');
    const project = validateProject(JSON.parse(await file.text()));
    applyProjectToEditor(project);
    hasUserProject = true;
    hasCustomEdits = true;
    hasUnsavedChanges = false;
    starterBanner.hidden = true;
    saveState.textContent = 'Proyek dibuka dari file';
    scheduleDraftSave();
    showToast('Proyek berhasil dibuka.');
  } catch (error) {
    showToast(`Proyek tidak dapat dibuka: ${error.message}`);
  } finally {
    projectFile.value = '';
  }
});

function sceneDescription(scene, index, project) {
  const labels = { orbit: 'Orbit', wave: 'Wave', mark: 'Sky mark', heart: 'Hati', star: 'Bintang', spiral: 'Spiral', burst: 'Kembang cahaya', path: 'Bentuk khusus', free: 'Kosong', manual: 'Desain manual', animation: 'Animasi Blender/CSV/ABC' };
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
    : [
      'Halo tim Skyfy, saya ingin konsultasi pratinjau desain drone show dari AI.',
      `Nama proyek: ${projectName.value.trim() || 'Proyek Skyfy'}`,
      `Ide: ${aiPreviewPrompt}`,
      ...(aiPreviewReferenceName ? [`Gambar referensi: ${aiPreviewReferenceName} (mohon lampirkan ulang di WhatsApp)`] : []),
      `Jumlah drone: ${state.scenes[0]?.frames?.[0]?.drones?.length || state.droneCount}`,
      `Total durasi visual: ${displaySeconds(totalDuration())} detik`,
      'Urutan scene:',
      ...state.scenes.map((scene, index) => `${index + 1}. ${scene.name}, ${displaySeconds(scene.duration)} detik, ${scene.palette.startColor} ke ${scene.palette.endColor}`),
      'Pratinjau AI tidak dapat dilampirkan sebagai file. Mohon bantu meninjau bentuk, gerakan, dan kelayakan konsep ini.',
      'Detail acara: [silakan lengkapi]'
    ].join('\n');
  const url = whatsappConsultationUrl(message);
  const link = event.currentTarget;
  if (link.tagName === 'A') link.href = url;
  else window.open(url, '_blank', 'noopener,noreferrer');
  q('[data-submit-consult]').href = url;
  q('[data-consult-copy]').hidden = aiConcept;
  q('[data-consult-ai-copy]').hidden = !aiConcept;
  q('[data-consult-filename]').textContent = filename;
  q('[data-consult-download]').hidden = aiConcept;
  q('[data-dialog-drones]').textContent = project ? `${project.scenes[state.selectedScene].formation === 'manual' ? project.scenes[state.selectedScene].manualDrones.length : project.scenes[state.selectedScene].formation === 'animation' ? project.scenes[state.selectedScene].frames[0].drones.length : project.scenes[state.selectedScene].formation === 'free' ? 0 : project.droneCount} drone` : `${aiCurrentDesign?.actualCount || state.droneCount} drone`;
  q('[data-dialog-scenes]').textContent = project ? `${project.scenes.length} scene` : `${state.scenes.length} scene`;
  q('[data-dialog-duration]').textContent = project ? `${displaySeconds(project.scenes.reduce((sum, scene) => sum + scene.duration, 0))} detik` : `${displaySeconds(totalDuration())} detik`;
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

function sampleAiStrokes(strokes, count, startColor, endColor) {
  const halton = (index, base) => {
    let fraction = 1;
    let result = 0;
    while (index > 0) { fraction /= base; result += fraction * (index % base); index = Math.floor(index / base); }
    return result;
  };
  const insidePolygon = (point, polygon) => {
    let inside = false;
    for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
      const a = polygon[index], b = polygon[previous];
      if ((a.y > point.y) !== (b.y > point.y)
        && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  };
  const smoothPoints = stroke => {
    if (!stroke.smooth || stroke.points.length < 3) return stroke.points;
    const source = stroke.points;
    const total = stroke.closed ? source.length : source.length - 1;
    const at = index => {
      if (stroke.closed) return source[(index + source.length) % source.length];
      if (index < 0) return { x: 2 * source[0].x - source[1].x, y: 2 * source[0].y - source[1].y };
      if (index >= source.length) return { x: 2 * source.at(-1).x - source.at(-2).x,
        y: 2 * source.at(-1).y - source.at(-2).y };
      return source[index];
    };
    const points = [];
    for (let index = 0; index < total; index += 1) {
      const p0 = at(index - 1), p1 = at(index), p2 = at(index + 1), p3 = at(index + 2);
      // Centripetal knots avoid loops when AI control points have uneven spacing.
      // Measure curves in the 2:1 display space used by the design brief.
      const knot = (a, b) => Math.max(.0001, Math.sqrt(Math.hypot((b.x - a.x) * 2, b.y - a.y)));
      const t0 = 0, t1 = knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
      const blend = (a, b, from, to, t) => ({
        x: ((to - t) * a.x + (t - from) * b.x) / (to - from),
        y: ((to - t) * a.y + (t - from) * b.y) / (to - from)
      });
      const steps = Math.max(8, Math.min(64, Math.ceil(Math.hypot((p2.x - p1.x) * 1200, (p2.y - p1.y) * 600) / 3)));
      for (let step = 0; step < steps; step += 1) {
        const t = t1 + (t2 - t1) * step / steps;
        const a1 = blend(p0, p1, t0, t1, t), a2 = blend(p1, p2, t1, t2, t), a3 = blend(p2, p3, t2, t3, t);
        const b1 = blend(a1, a2, t0, t2, t), b2 = blend(a2, a3, t1, t3, t);
        const point = blend(b1, b2, t1, t2, t);
        points.push({ x: Math.max(.08, Math.min(.92, point.x)),
          y: Math.max(.08, Math.min(.78, point.y)) });
      }
    }
    if (!stroke.closed) points.push(source.at(-1));
    return points;
  };
  const routes = strokes.map(stroke => {
    const points = smoothPoints(stroke);
    const segments = points.slice(0, stroke.closed ? points.length : -1).map((point, index) => {
      const next = points[(index + 1) % points.length];
      return { from: point, to: next, length: Math.hypot((next.x - point.x) * 2, next.y - point.y) };
    });
    const area = stroke.closed ? Math.abs(points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0)) / 2 : 0;
    return { closed: stroke.closed, fill: stroke.fill === true, color: stroke.color, importance: stroke.importance || 1, points, segments,
      area, length: segments.reduce((sum, segment) => sum + segment.length, 0) };
  }).filter(route => route.length > .001).slice(0, count);
  if (!routes.length) throw new Error('AI belum menghasilkan bentuk drone yang dapat digunakan.');
  const weights = routes.map(route => (route.length + (route.fill ? 2 * Math.sqrt(route.area) : 0)) * route.importance);
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
  const minimum = Math.min(6, Math.max(1, Math.floor(count / (routes.length * 4))));
  const allocations = routes.map(() => minimum);
  const remaining = count - minimum * routes.length;
  const shares = weights.map(weight => remaining * weight / weightSum);
  shares.forEach((share, index) => { allocations[index] += Math.floor(share); });
  for (let extra = remaining - shares.reduce((sum, share) => sum + Math.floor(share), 0); extra > 0; extra -= 1) {
    const index = shares.reduce((best, share, next) =>
      share - Math.floor(share) > shares[best] - Math.floor(shares[best]) ? next : best, 0);
    allocations[index] += 1;
    shares[index] = Math.floor(shares[index]);
  }
  const outlines = [], echoes = [], interiors = [];
  routes.forEach((route, routeIndex) => {
    const amount = allocations[routeIndex];
    const outlineCount = route.fill && route.area > .0005 && amount >= 8
      ? Math.max(4, Math.round(amount * .45)) : amount;
    const color = route.color ? mixColor(route.color, route.color, 0)
      : mixColor(startColor, endColor, routeIndex / Math.max(1, routes.length - 1));
    const pointAt = fraction => {
      let remainingLength = route.length * fraction;
      let point = route.segments.at(-1).to;
      for (const segment of route.segments) {
        if (remainingLength <= segment.length) {
          const blend = segment.length ? remainingLength / segment.length : 0;
          point = { x: segment.from.x + (segment.to.x - segment.from.x) * blend,
            y: segment.from.y + (segment.to.y - segment.from.y) * blend };
          break;
        }
        remainingLength -= segment.length;
      }
      return point;
    };
    for (let index = 0; index < outlineCount; index += 1) {
      const point = pointAt(route.closed ? index / outlineCount : index / Math.max(1, outlineCount - 1));
      outlines.push({ x: point.x, y: point.y, z: 0, color });
    }
    // A second contour gives large organic forms depth without flooding their inner lines.
    let echoCount = 0;
    if (route.fill && route.closed && route.area > .006 && amount >= 40) {
      const center = { x: route.points.reduce((sum, point) => sum + point.x, 0) / route.points.length,
        y: route.points.reduce((sum, point) => sum + point.y, 0) / route.points.length };
      const target = Math.round(amount * .2);
      for (let index = 0; index < target; index += 1) {
        const edge = pointAt((index + .5) / target);
        const distance = Math.hypot(center.x - edge.x, center.y - edge.y);
        const blend = Math.min(.28, .02 / Math.max(.001, distance));
        const point = { x: edge.x + (center.x - edge.x) * blend,
          y: edge.y + (center.y - edge.y) * blend };
        if (!insidePolygon(point, route.points)) continue;
        echoes.push({ ...point, z: 0, color });
        echoCount += 1;
      }
    }
    const interiorCount = amount - outlineCount - echoCount;
    if (interiorCount) {
      const center = { x: route.points.reduce((sum, point) => sum + point.x, 0) / route.points.length,
        y: route.points.reduce((sum, point) => sum + point.y, 0) / route.points.length };
      let placed = 0;
      if (insidePolygon(center, route.points)) {
        interiors.push({ x: center.x, y: center.y, z: 0, color });
        placed += 1;
      }
      const rings = [.76, .58, .42, .26, .12];
      const ringWeightSum = rings.reduce((sum, radius) => sum + radius, 0);
      const remainingRingBudget = Math.max(0, interiorCount - placed);
      rings.forEach((radius, ringIndex) => {
        if (placed >= interiorCount) return;
        const target = Math.max(4, Math.ceil(remainingRingBudget * (radius / ringWeightSum)));
        for (let index = 0; index < target && placed < interiorCount; index += 1) {
          const edge = pointAt(((index + ringIndex * .37) % target) / target);
          const point = { x: center.x + (edge.x - center.x) * radius,
            y: center.y + (edge.y - center.y) * radius };
          if (!insidePolygon(point, route.points)) continue;
          interiors.push({ ...point, z: 0, color });
          placed += 1;
        }
      });
      const xs = route.points.map(point => point.x), ys = route.points.map(point => point.y);
      const left = Math.min(...xs), top = Math.min(...ys);
      const width = Math.max(...xs) - left, height = Math.max(...ys) - top;
      for (let candidate = 1; candidate <= interiorCount * 30 && placed < interiorCount; candidate += 1) {
        const point = { x: left + halton(candidate, 2) * width, y: top + halton(candidate, 3) * height };
        if (!insidePolygon(point, route.points)) continue;
        interiors.push({ ...point, z: 0, color });
        placed += 1;
      }
      while (placed < interiorCount) {
        const point = route.points[placed % route.points.length];
        interiors.push({ x: point.x, y: point.y, z: 0, color });
        placed += 1;
      }
    }
  });
  return outlines.concat(echoes, interiors);
}

function sampleAiStrokes3d(strokes, count, startColor, endColor, silhouetteFirst = false) {
  const halton = (index, base) => {
    let value = 0, fraction = 1;
    while (index) { fraction /= base; value += fraction * (index % base); index = Math.floor(index / base); }
    return value;
  };
  const inside = (point, polygon) => {
    let found = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i], b = polygon[j];
      if ((a.y > point.y) !== (b.y > point.y) &&
        point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) found = !found;
    }
    return found;
  };
  const smoothPoints3d = stroke => {
    if (!stroke.smooth || stroke.points.length < 3) return stroke.points;
    const source = stroke.points;
    const total = stroke.closed ? source.length : source.length - 1;
    const at = index => {
      if (stroke.closed) return source[(index + source.length) % source.length];
      if (index < 0) return { x: 2 * source[0].x - source[1].x, y: 2 * source[0].y - source[1].y, z: 2 * source[0].z - source[1].z };
      if (index >= source.length) return { x: 2 * source.at(-1).x - source.at(-2).x,
        y: 2 * source.at(-1).y - source.at(-2).y, z: 2 * source.at(-1).z - source.at(-2).z };
      return source[index];
    };
    const points = [];
    for (let index = 0; index < total; index += 1) {
      const p0 = at(index - 1), p1 = at(index), p2 = at(index + 1), p3 = at(index + 2);
      const knot = (a, b) => Math.max(.0001, Math.sqrt(Math.hypot((b.x - a.x) * 2, b.y - a.y, (b.z - a.z) / 200)));
      const t0 = 0, t1 = knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
      const blend = (a, b, from, to, t) => ({
        x: ((to - t) * a.x + (t - from) * b.x) / (to - from),
        y: ((to - t) * a.y + (t - from) * b.y) / (to - from),
        z: ((to - t) * a.z + (t - from) * b.z) / (to - from)
      });
      const steps = Math.max(8, Math.min(48, Math.ceil(Math.hypot((p2.x - p1.x) * 1200, (p2.y - p1.y) * 600) / 4)));
      for (let step = 0; step < steps; step += 1) {
        const t = t1 + (t2 - t1) * step / steps;
        const a1 = blend(p0, p1, t0, t1, t), a2 = blend(p1, p2, t1, t2, t), a3 = blend(p2, p3, t2, t3, t);
        const b1 = blend(a1, a2, t0, t2, t), b2 = blend(a2, a3, t1, t3, t);
        const point = blend(b1, b2, t1, t2, t);
        points.push({ x: Math.max(.08, Math.min(.92, point.x)),
          y: Math.max(.08, Math.min(.78, point.y)),
          z: Math.max(-80, Math.min(80, point.z)) });
      }
    }
    if (!stroke.closed) points.push(source.at(-1));
    return points;
  };
  const routes = strokes.map(stroke => {
    const points = smoothPoints3d(stroke);
    const segments = points.slice(0, stroke.closed ? points.length : -1).map((from, index) => {
      const to = points[(index + 1) % points.length];
      return { from, to, length: Math.hypot((to.x - from.x) * 2, to.y - from.y, (to.z - from.z) / 200) };
    });
    const length = segments.reduce((sum, segment) => sum + segment.length, 0);
    const area = stroke.fill ? Math.abs(points.reduce((sum, point, index) => {
      const next = points[(index + 1) % points.length];
      return sum + point.x * next.y - next.x * point.y;
    }, 0)) / 2 : 0;
    return { ...stroke, points, segments, length, area, weight: (length + 4 * Math.sqrt(area)) * (stroke.importance || 1) };
  }).filter(route => route.length > .001).slice(0, count);
  if (!routes.length) throw new Error('AI belum menghasilkan bentuk 3D yang dapat digunakan.');
  const weightSum = routes.reduce((sum, route) => sum + route.weight, 0);
  const minimum = Math.min(6, Math.max(1, Math.floor(count / (routes.length * 4))));
  const allocations = routes.map(() => minimum);
  const remaining = count - minimum * routes.length;
  const shares = routes.map(route => remaining * route.weight / weightSum);
  shares.forEach((share, index) => { allocations[index] += Math.floor(share); });
  for (let extra = remaining - shares.reduce((sum, share) => sum + Math.floor(share), 0); extra > 0; extra--) {
    const index = shares.reduce((best, share, next) =>
      share - Math.floor(share) > shares[best] - Math.floor(shares[best]) ? next : best, 0);
    allocations[index]++;
    shares[index] = Math.floor(shares[index]);
  }
  const outlines = [], surfaces = [];
  routes.forEach((route, routeIndex) => {
    const amount = allocations[routeIndex];
    const color = route.color ? mixColor(route.color, route.color, 0)
      : mixColor(startColor, endColor, routeIndex / Math.max(1, routes.length - 1));
    // Figurative references need a legible front silhouette at small drone counts.
    // Keep the usual surface balance for freeform 3D objects such as spheres.
    const outlineCount = route.fill && route.depth >= 5 && amount >= 12
      ? Math.max(4, Math.round(amount * (silhouetteFirst ? .85 : .25))) : amount;
    const pointAt3d = fraction => {
      let distance = route.length * fraction;
      for (const segment of route.segments) {
        if (distance <= segment.length || segment === route.segments.at(-1)) {
          const t = segment.length ? Math.min(1, distance / segment.length) : 0;
          return { x: segment.from.x + (segment.to.x - segment.from.x) * t,
            y: segment.from.y + (segment.to.y - segment.from.y) * t,
            z: segment.from.z + (segment.to.z - segment.from.z) * t };
        }
        distance -= segment.length;
      }
      return route.points.at(-1);
    };
    for (let index = 0; index < outlineCount; index++) {
      const point = pointAt3d(route.closed ? index / outlineCount : index / Math.max(1, outlineCount - 1));
      outlines.push({ ...point, color });
    }
    if (amount <= outlineCount) return;
    const polygon = route.points;
    const center = { x: polygon.reduce((sum, point) => sum + point.x, 0) / polygon.length,
      y: polygon.reduce((sum, point) => sum + point.y, 0) / polygon.length,
      z: polygon.reduce((sum, point) => sum + point.z, 0) / polygon.length };
    let placed = 0;
    const interiorCount = amount - outlineCount;
    const rings = [.82, .66, .5, .34, .18];
    const ringWeightSum = rings.reduce((sum, radius) => sum + radius, 0);
    const pairBudget = Math.max(1, Math.ceil(interiorCount / 2));
    rings.forEach((radius, ringIndex) => {
      if (placed >= interiorCount) return;
      const target = Math.max(4, Math.ceil(pairBudget * (radius / ringWeightSum)));
      for (let index = 0; index < target && placed < interiorCount; index++) {
        const edge = pointAt3d(((index + ringIndex * .37) % target) / target);
        const x = center.x + (edge.x - center.x) * radius;
        const y = center.y + (edge.y - center.y) * radius;
        if (!inside({ x, y }, polygon)) continue;
        const baseZ = center.z + (edge.z - center.z) * radius;
        const surfaceZ = route.depth * Math.sqrt(1 - radius * radius);
        surfaces.push({ x, y, z: baseZ + surfaceZ, color });
        placed++;
        if (placed < interiorCount) {
          surfaces.push({ x, y, z: baseZ - surfaceZ, color });
          placed++;
        }
      }
    });
    for (let candidate = 1; candidate <= interiorCount * 40 && placed < interiorCount; candidate++) {
      const edge = polygon[Math.floor(halton(candidate, 2) * polygon.length)];
      const next = polygon[(polygon.indexOf(edge) + 1) % polygon.length];
      const edgeT = halton(candidate, 3);
      const radius = Math.min(.94, Math.sqrt(halton(candidate, 5)));
      const x = center.x + ((edge.x + (next.x - edge.x) * edgeT) - center.x) * radius;
      const y = center.y + ((edge.y + (next.y - edge.y) * edgeT) - center.y) * radius;
      if (!inside({ x, y }, polygon)) continue;
      const baseZ = center.z + ((edge.z + (next.z - edge.z) * edgeT) - center.z) * radius;
      const surfaceZ = route.depth * Math.sqrt(1 - radius * radius);
      surfaces.push({ x, y, z: baseZ + surfaceZ, color });
      placed++;
      if (placed < interiorCount) {
        surfaces.push({ x, y, z: baseZ - surfaceZ, color });
        placed++;
      }
    }
  });
  return outlines.concat(surfaces);
}

function selectAiDrones3d(drones, frontReadable = false) {
  const gap = AI_SPACING_METERS / AI_WORKSPACE_METERS;
  const cells = new Map(), frontCells = new Map(), selected = [];
  for (const point of drones) {
    if (![point.x, point.y, point.z].every(Number.isFinite) ||
      point.x < .075 || point.x > .925 || point.y < .075 || point.y > .795 || Math.abs(point.z) > 180) continue;
    const cx = Math.floor(point.x / gap), cy = Math.floor(point.y / gap), cz = Math.floor(point.z / AI_SPACING_METERS);
    let crowded = false;
    for (let dx = -1; dx <= 1 && !crowded; dx++) for (let dy = -1; dy <= 1 && !crowded; dy++)
      for (let dz = -1; dz <= 1 && !crowded; dz++) {
        for (const other of cells.get(`${cx + dx},${cy + dy},${cz + dz}`) || []) {
          if (Math.hypot((point.x - other.x) * AI_WORKSPACE_METERS,
            (point.y - other.y) * AI_WORKSPACE_METERS, point.z - other.z) < AI_SPACING_METERS - 1e-7) {
            crowded = true; break;
          }
        }
      }
    if (frontReadable && !crowded) {
      const fx = Math.floor(point.x * 1200 / AI_DISPLAY_GAP_PX);
      const fy = Math.floor(point.y * 600 / AI_DISPLAY_GAP_PX);
      for (let dx = -1; dx <= 1 && !crowded; dx++) for (let dy = -1; dy <= 1 && !crowded; dy++)
        for (const other of frontCells.get(`${fx + dx},${fy + dy}`) || []) {
          if (Math.hypot((point.x - other.x) * 1200,
            (point.y - other.y) * 600) < AI_DISPLAY_GAP_PX - 1e-7) { crowded = true; break; }
        }
      if (!crowded) {
        const frontKey = `${fx},${fy}`;
        if (!frontCells.has(frontKey)) frontCells.set(frontKey, []);
        frontCells.get(frontKey).push(point);
      }
    }
    if (crowded) continue;
    selected.push(point);
    const key = `${cx},${cy},${cz}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(point);
  }
  if (!selected.length) throw new Error('Bentuk 3D belum cukup jelas untuk membentuk drone.');
  return selected;
}

function selectAiDronesOnLines(drones) {
  const worldGap = AI_SPACING_METERS / AI_WORKSPACE_METERS;
  const cellWidth = Math.max(worldGap, AI_DISPLAY_GAP_PX / 1200);
  const cellHeight = Math.max(worldGap, AI_DISPLAY_GAP_PX / 600);
  const cells = new Map();
  const selected = [];
  for (const point of drones) {
    if (![point.x, point.y, point.z].every(Number.isFinite)
      || point.x < .075 || point.x > .925 || point.y < .075 || point.y > .795) continue;
    const cx = Math.floor(point.x / cellWidth), cy = Math.floor(point.y / cellHeight);
    let crowded = false;
    for (let dx = -1; dx <= 1 && !crowded; dx += 1) for (let dy = -1; dy <= 1 && !crowded; dy += 1) {
      for (const other of cells.get(`${cx + dx},${cy + dy}`) || []) {
        if (Math.hypot(point.x - other.x, point.y - other.y, point.z - other.z) < worldGap - 1e-7
          || Math.hypot((point.x - other.x) * 1200, (point.y - other.y) * 600) < AI_DISPLAY_GAP_PX) {
          crowded = true;
          break;
        }
      }
    }
    if (crowded) continue;
    selected.push(point);
    const key = `${cx},${cy}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(point);
  }
  if (!selected.length) throw new Error('Garis gambar belum cukup jelas untuk membentuk drone.');
  return selected;
}

function buildAiLightShow(targets, durations, frameBudget = MAX_ANIMATION_ROWS, dimension = '2d') {
  const gap = AI_SPACING_METERS / AI_WORKSPACE_METERS;
  const cellWidth = Math.max(gap, AI_DISPLAY_GAP_PX / 1200);
  const cellHeight = Math.max(gap, AI_DISPLAY_GAP_PX / 600);
  const cells = new Map();
  const positions = [];
  const colors = targets.map(() => []);
  const key = (x, y, z = 0) => dimension === '3d' ? `${x},${y},${z}` : `${x},${y}`;
  targets.forEach((target, sceneIndex) => {
    for (const drone of target) {
      const cx = Math.floor(drone.x / cellWidth), cy = Math.floor(drone.y / cellHeight);
      const cz = dimension === '3d' ? Math.floor(drone.z / AI_SPACING_METERS) : 0;
      let nearest = -1;
      let distance = Infinity;
      for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1)
        for (let dz = dimension === '3d' ? -1 : 0; dz <= (dimension === '3d' ? 1 : 0); dz++) {
        for (const index of cells.get(key(cx + dx, cy + dy, cz + dz)) || []) {
          const candidate = positions[index];
          const squared = (candidate.x - drone.x) ** 2 + (candidate.y - drone.y) ** 2
            + (dimension === '3d' ? ((candidate.z - drone.z) / AI_WORKSPACE_METERS) ** 2 : 0);
          const displayDistance = Math.hypot((candidate.x - drone.x) * 1200,
            (candidate.y - drone.y) * 600);
          if ((squared < gap * gap || dimension === '2d' && displayDistance < AI_DISPLAY_GAP_PX)
            && squared < distance) { distance = squared; nearest = index; }
        }
      }
      if (nearest < 0) {
        nearest = positions.length;
        if (nearest >= MAX_AI_SHOW_DRONES) {
          throw new Error('Gabungan bentuk melebihi kapasitas pratinjau 3.000 drone. Kurangi detail atau jumlah scene.');
        }
        positions.push({ x: drone.x, y: drone.y, z: drone.z });
        const cell = key(cx, cy, cz);
        if (!cells.has(cell)) cells.set(cell, []);
        cells.get(cell).push(nearest);
      }
      colors[sceneIndex][nearest] = colorToHex(drone.color);
    }
  });
  const off = '#000000';
  const framesFor = (sceneIndex, duration) => {
    const frameCount = Math.min(Math.round(duration * 12), Math.floor(frameBudget / positions.length) - 1,
      MAX_ANIMATION_FRAMES - 1);
    if (frameCount < 2) throw new Error('Animasi terlalu besar untuk kapasitas frame Studio. Kurangi detail atau scene.');
    const before = sceneIndex ? colors[sceneIndex - 1] : [];
    const after = colors[sceneIndex];
    const frames = Array.from({ length: frameCount + 1 }, (_, frameIndex) => {
      const time = frameIndex === frameCount ? duration : Number((duration * frameIndex / frameCount).toFixed(4));
      return { time, drones: positions.map((point, droneIndex) => {
        const from = before[droneIndex] || off;
        const to = after[droneIndex] || off;
        const delay = .65 * (point.x - .075) / .85;
        const phase = Math.max(0, Math.min(1, (time - delay) / 2.4));
        const blend = phase * phase * (3 - 2 * phase);
        return { ...point, color: from === to || blend === 0 ? from
          : blend === 1 ? to : mixColor(from, to, blend) };
      }) };
    });
    return { duration, frames };
  };
  const show = { count: positions.length, scenes: durations.map((duration, index) => framesFor(index, duration)) };
  validateAiLightShow(show, dimension);
  return show;
}

function validateAiLightShow(show, dimension = '2d') {
  const fixed = show.scenes[0]?.frames[0]?.drones;
  if (!fixed?.length || fixed.length !== show.count) throw new Error('Formasi AI tidak lengkap.');
  if (AI_SPACING_METERS <= Math.max(AI_STATIC_MIN_METERS, AI_DYNAMIC_MIN_METERS)) {
    throw new Error('Jarak formasi AI harus melebihi batas jarak diam dan transisi.');
  }
  const gap = AI_SPACING_METERS / AI_WORKSPACE_METERS;
  const cellWidth = Math.max(gap, AI_DISPLAY_GAP_PX / 1200);
  const cellHeight = Math.max(gap, AI_DISPLAY_GAP_PX / 600);
  const cells = new Map();
  for (const point of fixed) {
    if (![point.x, point.y, point.z].every(Number.isFinite)) throw new Error('Koordinat formasi AI tidak valid.');
    const cx = Math.floor(point.x / cellWidth), cy = Math.floor(point.y / cellHeight), cz = Math.floor(point.z / AI_SPACING_METERS);
    for (let dx = -1; dx <= 1; dx += 1) for (let dy = -1; dy <= 1; dy += 1) for (let dz = -1; dz <= 1; dz += 1) {
      for (const other of cells.get(`${cx + dx},${cy + dy},${cz + dz}`) || []) {
        if (Math.hypot(point.x - other.x, point.y - other.y,
          (point.z - other.z) / AI_WORKSPACE_METERS) < gap - 1e-7
          || dimension === '2d' && Math.hypot((point.x - other.x) * 1200,
            (point.y - other.y) * 600) < AI_DISPLAY_GAP_PX - 1e-6) {
          throw new Error('Formasi AI terlalu rapat. Kurangi jumlah drone atau sederhanakan garis.');
        }
      }
    }
    const key = `${cx},${cy},${cz}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key).push(point);
  }
  let moved = false;
  for (const scene of show.scenes) {
    let previousFrame = null;
    let previousVelocities = null;
    let previousStep = 0;
    for (const frame of scene.frames) {
      if (!Number.isFinite(frame.time) || frame.drones.length !== fixed.length ||
        frame.drones.some(point => ![point.x, point.y, point.z].every(Number.isFinite))) {
        throw new Error('Frame formasi AI tidak valid.');
      }
      if (previousFrame) {
        const step = frame.time - previousFrame.time;
        if (!(step > 0)) throw new Error('Waktu frame AI harus terus bertambah.');
        const velocities = frame.drones.map((point, index) => {
          const previous = previousFrame.drones[index];
          const velocity = { x: (point.x - previous.x) * AI_WORKSPACE_METERS / step,
            y: (point.y - previous.y) * AI_WORKSPACE_METERS / step,
            z: (point.z - previous.z) / step };
          if (Math.hypot(velocity.x, velocity.y, velocity.z) >= AI_MAX_SPEED_MPS) {
            throw new Error('Kecepatan formasi AI harus kurang dari 5 m/detik.');
          }
          if (Math.abs(velocity.y) >= AI_MAX_VERTICAL_SPEED_MPS) {
            throw new Error('Laju naik/turun formasi AI harus kurang dari 3 m/detik.');
          }
          if (previousVelocities) {
            const prior = previousVelocities[index];
            const interval = (step + previousStep) / 2;
            if (Math.hypot(velocity.x - prior.x, velocity.y - prior.y,
              velocity.z - prior.z) / interval >= AI_MAX_ACCELERATION_MPS2) {
              throw new Error('Percepatan formasi AI harus kurang dari 3 m/detik kuadrat.');
            }
          }
          return velocity;
        });
        previousVelocities = velocities;
        previousStep = step;
      }
      if (frame.drones.some((point, index) =>
        point.x !== fixed[index].x || point.y !== fixed[index].y || point.z !== fixed[index].z)) {
        moved = true;
      }
      previousFrame = frame;
    }
  }
  // Fixed positions make the 2.5 m static gap hold throughout every light transition.
  // This also guarantees dynamic spacing above 1.2 m between sampled frames.
  if (moved) throw new Error('Transisi AI menggeser posisi drone. Buat ulang desain.');
}

function padAiVideoKeyframe(points, targetCount, dimension = '2d') {
  const result = points.slice(0, targetCount).map(point => ({ ...point, z: dimension === '3d' ? (point.z || 0) : 0 }));
  if (!result.length || result.length >= targetCount) return result;
  const gap = AI_SPACING_METERS / AI_WORKSPACE_METERS;
  const gapSq = gap * gap;
  const bounds = result.reduce((box, point) => ({
    minX: Math.min(box.minX, point.x), maxX: Math.max(box.maxX, point.x),
    minY: Math.min(box.minY, point.y), maxY: Math.max(box.maxY, point.y)
  }), { minX: 1, maxX: 0, minY: 1, maxY: 0 });
  const step = gap * 1.04;
  for (let ring = 1; result.length < targetCount && ring <= 28; ring += 1) {
    const minX = Math.max(.08, bounds.minX - ring * step);
    const maxX = Math.min(.92, bounds.maxX + ring * step);
    const minY = Math.max(.08, bounds.minY - ring * step);
    const maxY = Math.min(.88, bounds.maxY + ring * step);
    for (let y = minY; result.length < targetCount && y <= maxY; y += step) {
      for (let x = minX; result.length < targetCount && x <= maxX; x += step) {
        let tooClose = false;
        let nearest = result[0];
        let nearestDist = Infinity;
        for (const other of result) {
          const dSq = (x - other.x) ** 2 + (y - other.y) ** 2;
          if (dSq < gapSq) { tooClose = true; break; }
          if (dSq < nearestDist) { nearestDist = dSq; nearest = other; }
        }
        if (!tooClose) {
          result.push({
            x: Number(x.toFixed(5)),
            y: Number(y.toFixed(5)),
            z: dimension === '3d' ? (nearest?.z || 0) : 0,
            color: nearest?.color || '#ff4242'
          });
        }
      }
    }
  }
  return result;
}

function matchAiVideoDrones(fromDrones, toDrones) {
  const n = Math.min(fromDrones.length, toDrones.length);
  if (n <= 1) return toDrones.slice(0, n).map(d => ({ ...d }));
  const assign = new Int32Array(n);
  const rank3D = arr => {
    const indexed = Array.from({ length: n }, (_, idx) => idx);
    indexed.sort((a, b) => arr[a].x - arr[b].x);
    const xBins = Math.max(1, Math.round(Math.cbrt(n)));
    const ordered = [];
    for (let xb = 0; xb < xBins; xb += 1) {
      const xStart = Math.floor(xb * n / xBins);
      const xEnd = Math.floor((xb + 1) * n / xBins);
      const xSlice = indexed.slice(xStart, xEnd).sort((a, b) => arr[a].y - arr[b].y);
      const yBins = Math.max(1, Math.round(Math.sqrt(xSlice.length)));
      for (let yb = 0; yb < yBins; yb += 1) {
        const yStart = Math.floor(yb * xSlice.length / yBins);
        const yEnd = Math.floor((yb + 1) * xSlice.length / yBins);
        const yStrip = xSlice.slice(yStart, yEnd).sort((a, b) => (arr[a].z || 0) - (arr[b].z || 0));
        for (const item of yStrip) ordered.push(item);
      }
    }
    return ordered;
  };
  const fromOrder = rank3D(fromDrones);
  const toOrder = rank3D(toDrones);
  for (let r = 0; r < n; r += 1) {
    assign[fromOrder[r]] = toOrder[r];
  }
  const zScale = Math.max(10, state?.workspaceWidth || 40);
  for (let pass = 0; pass < 10; pass += 1) {
    let swaps = 0;
    for (let i = 0; i < n; i += 1) {
      const ji = assign[i];
      const fx1 = fromDrones[i].x, fy1 = fromDrones[i].y, fz1 = (fromDrones[i].z || 0) / zScale;
      let tx1 = toDrones[ji].x, ty1 = toDrones[ji].y, tz1 = (toDrones[ji].z || 0) / zScale;
      let d1 = (fx1 - tx1) ** 2 + (fy1 - ty1) ** 2 + (fz1 - tz1) ** 2;
      for (let k = i + 1; k < n; k += 1) {
        const jk = assign[k];
        const fx2 = fromDrones[k].x, fy2 = fromDrones[k].y, fz2 = (fromDrones[k].z || 0) / zScale;
        const tx2 = toDrones[jk].x, ty2 = toDrones[jk].y, tz2 = (toDrones[jk].z || 0) / zScale;
        const d2 = (fx2 - tx2) ** 2 + (fy2 - ty2) ** 2 + (fz2 - tz2) ** 2;
        const nd1 = (fx1 - tx2) ** 2 + (fy1 - ty2) ** 2 + (fz1 - tz2) ** 2;
        const nd2 = (fx2 - tx1) ** 2 + (fy2 - ty1) ** 2 + (fz2 - tz1) ** 2;
        const currentCost = d1 + d2 + .35 * Math.max(d1, d2);
        const swappedCost = nd1 + nd2 + .35 * Math.max(nd1, nd2);
        if (swappedCost + 1e-8 < currentCost) {
          assign[i] = jk;
          assign[k] = ji;
          tx1 = tx2; ty1 = ty2; tz1 = tz2;
          d1 = nd1;
          swaps += 1;
        }
      }
    }
    if (!swaps) break;
  }
  return Array.from({ length: n }, (_, i) => ({ ...toDrones[assign[i]] }));
}

function buildTakeoffGridDrones(targetDrones, dimension = '3d') {
  const n = targetDrones.length;
  if (!n) return [];
  const cols = Math.min(n, Math.max(1, Math.round(Math.sqrt(n * 1.25))));
  const rows = Math.max(1, Math.ceil(n / cols));
  const wsWidth = Math.max(10, state?.workspaceWidth || 40);
  const padWidth = Math.min(.64, Math.max(.22, (cols - 1) * (1.55 / wsWidth)));
  const padDepth = dimension === '3d'
    ? Math.min(wsWidth * .62, Math.max(3.2, (rows - 1) * 1.55))
    : Math.min(8, Math.max(1.6, (rows - 1) * .9));

  // Monotone spatial mapping: left->right columns match target.x,
  // and within each column back->front rows (+z -> -z) match target.y (top->bottom)
  // so drones rise cleanly from the bottom hover pad straight up to the sky without crossing paths.
  const sortedByX = Array.from({ length: n }, (_, idx) => idx)
    .sort((a, b) => (targetDrones[a].x - targetDrones[b].x) || ((targetDrones[a].z || 0) - (targetDrones[b].z || 0)));

  const grid = Array(n);
  let cursor = 0;
  for (let col = 0; col < cols; col += 1) {
    const remainingCols = cols - col;
    const remainingItems = n - cursor;
    const colCount = Math.ceil(remainingItems / remainingCols);
    const colSlice = sortedByX.slice(cursor, cursor + colCount);
    cursor += colCount;
    colSlice.sort((a, b) => (targetDrones[a].y - targetDrones[b].y) || ((targetDrones[b].z || 0) - (targetDrones[a].z || 0)));
    const colT = cols === 1 ? .5 : col / (cols - 1);
    const gx = .5 + (colT - .5) * padWidth;
    for (let r = 0; r < colSlice.length; r += 1) {
      const targetIdx = colSlice[r];
      const rowT = colSlice.length === 1 ? .5 : r / (colSlice.length - 1);
      const gz = (.5 - rowT) * padDepth;
      grid[targetIdx] = {
        x: Number(gx.toFixed(5)),
        y: HOVER_TAKEOFF_Y,
        z: Number(gz.toFixed(4)),
        color: targetDrones[targetIdx]?.color || '#ffd15e'
      };
    }
  }
  return grid;
}

function buildAiVideoShow(videoMotionGroups, durations, dimension = '2d') {
  const flatGroups = videoMotionGroups.map(group => group.filter(kf => Array.isArray(kf) && kf.length));
  const targetCount = Math.max(1, ...flatGroups.flat().map(kf => kf.length));
  const matchedGroups = [];
  let previousKeyframe = null;
  for (let sceneIndex = 0; sceneIndex < flatGroups.length; sceneIndex += 1) {
    const group = flatGroups[sceneIndex];
    const matchedGroup = [];
    for (let kfIndex = 0; kfIndex < group.length; kfIndex += 1) {
      const padded = padAiVideoKeyframe(group[kfIndex], targetCount, dimension);
      const matched = previousKeyframe ? matchAiVideoDrones(previousKeyframe, padded) : padded;
      matchedGroup.push(matched);
      previousKeyframe = matched;
    }
    matchedGroups.push(matchedGroup);
  }
  const scenes = durations.map((duration, sceneIndex) => {
    const group = matchedGroups[sceneIndex] || [];
    const priorEnd = sceneIndex === 0
      ? (group.length ? buildTakeoffGridDrones(group[0], dimension) : null)
      : matchedGroups[sceneIndex - 1]?.at(-1);
    const keyframes = priorEnd ? [priorEnd, ...group] : group;
    const steps = Math.max(1, keyframes.length - 1);
    const frames = keyframes.map((drones, index) => ({
      time: Number((index / steps * duration).toFixed(3)),
      drones: drones.map(drone => ({
        x: Number(drone.x.toFixed(5)),
        y: Number(drone.y.toFixed(5)),
        z: dimension === '3d' ? Number((drone.z || 0).toFixed(3)) : 0,
        color: drone.color
      }))
    }));
    if (frames.length === 1) {
      frames.push({ time: Number(duration.toFixed(3)), drones: frames[0].drones.map(drone => ({ ...drone })) });
    } else {
      frames[0].time = 0;
      frames[frames.length - 1].time = Number(duration.toFixed(3));
    }
    return { duration, frames };
  });
  return { count: targetCount, scenes };
}

async function sampleAiImage(file, count, { logo = false, video = false } = {}) {
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error('Gambar tidak dapat dibaca. Pilih file PNG, JPG, atau WebP lain.'); }
  try {
    if (!bitmap.width || !bitmap.height || bitmap.width * bitmap.height > 20_000_000) {
      throw new Error('Resolusi gambar terlalu besar. Perkecil gambar lalu coba lagi.');
    }
    const maxSampleSide = video ? 320 : 160;
    const scale = Math.min(1, maxSampleSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(8, Math.round(bitmap.width * scale));
    const height = Math.max(8, Math.round(bitmap.height * scale));
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    const context = surface.getContext('2d', { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0, width, height);
    const pixels = context.getImageData(0, 0, width, height).data;
    const pixelAt = (x, y) => {
      const index = (Math.max(0, Math.min(height - 1, y)) * width + Math.max(0, Math.min(width - 1, x))) * 4;
      return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
    };
    const border = [];
    for (let x = 0; x < width; x += 3) { border.push(pixelAt(x, 0), pixelAt(x, height - 1)); }
    for (let y = 0; y < height; y += 3) { border.push(pixelAt(0, y), pixelAt(width - 1, y)); }
    const background = [0, 1, 2].map(channel => border.map(pixel => pixel[channel]).sort((a, b) => a - b)[Math.floor(border.length / 2)]);
    const transparent = border.filter(pixel => pixel[3] < 245).length > border.length * .05;
    const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 441.673;
    const brightness = pixel => (pixel[0] + pixel[1] + pixel[2]) / 3;
    const uniformBorder = border.filter(pixel => distance(pixel, background) < .08).length >= border.length * .9;
    const palette = new Set();
    let opaque = 0, foreground = 0, strongForeground = 0;
    for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
      const pixel = pixelAt(x, y);
      if (pixel[3] < 32) continue;
      opaque += 1;
      const contrast = distance(pixel, background);
      if (palette.size <= 64) palette.add(pixel.slice(0, 3).map(value => Math.floor(value / 16)).join(','));
      if (contrast > .13) foreground += 1;
      if (contrast > .35) strongForeground += 1;
    }
    const lineArt = !transparent && uniformBorder && foreground < opaque * .35
      && strongForeground > opaque * .005;
    const flatArtwork = !transparent && uniformBorder && palette.size <= 64
      && foreground > opaque * .005 && foreground < opaque * .8;
    const isolatedSubject = !transparent
      && border.filter(pixel => distance(pixel, background) < .12).length >= border.length * .82
      && foreground > opaque * .005 && foreground < opaque * .78;
    const borderTexture = border.reduce((sum, pixel, index) => sum + (index
      ? Math.abs(brightness(pixel) - brightness(border[index - 1])) : 0), 0) / border.length;
    const checkerBackground = !transparent && brightness(background) > 205 && borderTexture > 5;
    // A photographed drone figure is sparse colored light on dark sky. Keep its
    // actual light positions instead of replacing them with model-interpreted geometry.
    const luminous = pixel => {
      const peak = Math.max(pixel[0], pixel[1], pixel[2]);
      const spread = peak - Math.min(pixel[0], pixel[1], pixel[2]);
      return peak >= 80 && (spread >= 28 || brightness(pixel) >= 105)
        && distance(pixel, background) > .12;
    };
    let darkSky = 0, skySamples = 0, skyLights = 0;
    const skyBottom = Math.floor(height * .85);
    for (let y = 0; y < skyBottom; y += 2) for (let x = 0; x < width; x += 2) {
      const pixel = pixelAt(x, y);
      if (Math.max(pixel[0], pixel[1], pixel[2]) < 75) darkSky += 1;
      if (luminous(pixel)) skyLights += 1;
      skySamples += 1;
    }
    let nightLights = !transparent && brightness(background) < 70
      && darkSky / skySamples > .72 && skyLights / skySamples > .003
      && skyLights / skySamples < .2;
    let lightCutoff = height;
    let minXScan = 0;
    if (nightLights) {
      if (video) {
        lightCutoff = Math.floor(height * .925);
        let leftGroundLights = 0;
        const leftLimit = Math.floor(width * .08);
        for (let y = Math.floor(height * .65); y < lightCutoff; y += 1) {
          for (let x = 0; x < leftLimit; x += 1) {
            if (luminous(pixelAt(x, y))) leftGroundLights += 1;
          }
        }
        if (leftGroundLights > 8) minXScan = leftLimit;
      } else {
        const rowLights = Array.from({ length: height }, (_, y) => {
          let total = 0;
          for (let x = 0; x < width; x++) if (luminous(pixelAt(x, y))) total += 1;
          return total;
        });
        const density = (from, to) => rowLights.slice(from, to).reduce((sum, value) => sum + value, 0)
          / Math.max(1, (to - from) * width);
        if (density(Math.floor(height * .92), height) > .08) {
          for (let y = Math.floor(height * .93); y >= Math.floor(height * .7); y--) {
            if (density(Math.max(0, y - 2), Math.min(height, y + 3)) < .018
              && density(Math.min(height, y + 4), height) > .07) {
              lightCutoff = Math.min(height, y + 3);
              break;
            }
          }
        }
      }
    }
    const smoothLight = new Uint8Array(width * height);
    if (checkerBackground) {
      for (let y = 2; y < height - 2; y += 1) for (let x = 2; x < width - 2; x += 1) {
        const pixel = pixelAt(x, y);
        if (brightness(pixel) < 185 || Math.max(...pixel.slice(0, 3)) - Math.min(...pixel.slice(0, 3)) > 28) continue;
        let low = 255, high = 0;
        for (let dy = -2; dy <= 2; dy += 1) for (let dx = -2; dx <= 2; dx += 1) {
          const value = brightness(pixelAt(x + dx, y + dy));
          low = Math.min(low, value);
          high = Math.max(high, value);
        }
        if (high - low < 17) smoothLight[y * width + x] = 1;
      }
      const visited = new Uint8Array(smoothLight.length);
      for (let seed = 0; seed < smoothLight.length; seed += 1) {
        if (!smoothLight[seed] || visited[seed]) continue;
        const component = [seed];
        visited[seed] = 1;
        for (let head = 0; head < component.length; head += 1) {
          const index = component[head];
          const x = index % width, y = Math.floor(index / width);
          for (const neighbor of [index - 1, index + 1, index - width, index + width]) {
            if (neighbor < 0 || neighbor >= smoothLight.length
              || Math.abs(neighbor % width - x) + Math.abs(Math.floor(neighbor / width) - y) !== 1
              || !smoothLight[neighbor] || visited[neighbor]) continue;
            visited[neighbor] = 1;
            component.push(neighbor);
          }
        }
        if (component.length < width * height * .003 || component.length > width * height * .5) {
          for (const index of component) smoothLight[index] = 0;
        }
      }
    }
    const enclosedLight = new Uint8Array(width * height);
    if (!transparent && !checkerBackground && !lineArt && brightness(background) > 205) {
      const barrier = new Uint8Array(enclosedLight.length);
      for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
        const color = pixelAt(x, y);
        if (distance(color, background) > .13) {
          for (let dy = -1; dy <= 1; dy += 1) for (let dx = -1; dx <= 1; dx += 1) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) barrier[ny * width + nx] = 1;
          }
        }
      }
      const outside = new Uint8Array(barrier.length);
      const queue = [];
      for (let x = 0; x < width; x += 1) for (const y of [0, height - 1]) {
        const index = y * width + x;
        if (!barrier[index] && !outside[index]) { outside[index] = 1; queue.push(index); }
      }
      for (let y = 0; y < height; y += 1) for (const x of [0, width - 1]) {
        const index = y * width + x;
        if (!barrier[index] && !outside[index]) { outside[index] = 1; queue.push(index); }
      }
      for (let head = 0; head < queue.length; head += 1) {
        const index = queue[head];
        const x = index % width, y = Math.floor(index / width);
        for (const neighbor of [index - 1, index + 1, index - width, index + width]) {
          if (neighbor < 0 || neighbor >= barrier.length
            || Math.abs(neighbor % width - x) + Math.abs(Math.floor(neighbor / width) - y) !== 1
            || barrier[neighbor] || outside[neighbor]) continue;
          outside[neighbor] = 1;
          queue.push(neighbor);
        }
      }
      for (let index = 0; index < barrier.length; index += 1) {
        if (!barrier[index] && !outside[index]) enclosedLight[index] = 1;
      }
    }
    const candidates = [];
    let maximum = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = minXScan; x < width; x += 1) {
        const color = pixelAt(x, y);
        if (color[3] < 32 || nightLights && (y >= lightCutoff || !luminous(color))) continue;
        let score;
        if (video && nightLights) {
          const b0 = brightness(color);
          const n1 = brightness(pixelAt(x - 1, y)), n2 = brightness(pixelAt(x + 1, y));
          const n3 = brightness(pixelAt(x, y - 1)), n4 = brightness(pixelAt(x, y + 1));
          const isPeak = b0 >= Math.max(n1, n2, n3, n4) - 6 ? 1.35 : 1;
          const peak = Math.max(color[0], color[1], color[2]) / 255;
          const sat = (Math.max(color[0], color[1], color[2]) - Math.min(color[0], color[1], color[2])) / 255;
          score = (peak * .65 + sat * .35) * isPeak;
        } else {
          const contrast = Math.max(distance(color, pixelAt(x + 1, y)), distance(color, pixelAt(x, y + 1)));
          const alphaEdge = Math.max(Math.abs(color[3] - pixelAt(x - 1, y)[3]),
            Math.abs(color[3] - pixelAt(x + 1, y)[3]), Math.abs(color[3] - pixelAt(x, y - 1)[3]),
            Math.abs(color[3] - pixelAt(x, y + 1)[3])) / 255;
          const saturation = (Math.max(...color.slice(0, 3)) - Math.min(...color.slice(0, 3))) / 255;
          const baseScore = transparent
            ? color[3] / 255 * (.25 + alphaEdge * 1.3 + contrast * .45)
            : Math.min(1, distance(color, background) * 1.3 + contrast * .65 + saturation * .08);
          const index = y * width + x;
          score = smoothLight[index] ? Math.max(baseScore, .8)
            : enclosedLight[index] ? Math.max(baseScore, .7) : baseScore;
        }
        if (score > maximum) maximum = score;
        candidates.push({ x, y, color, score, nearest: Infinity, used: false });
      }
    }
    if (maximum < .035) throw new Error('Gambar terlalu polos untuk diubah menjadi formasi drone.');
    let eligible = candidates.filter(candidate => candidate.score >= maximum * (lineArt ? .25 : .16)
      && (!lineArt || distance(candidate.color, background) > .13));
    if (nightLights) {
      const remaining = new Map(eligible.map(candidate => [candidate.y * width + candidate.x, candidate]));
      const components = [];
      const radiusSq = video ? 29 : 25;
      while (remaining.size) {
        const first = remaining.keys().next().value;
        const group = [remaining.get(first)];
        remaining.delete(first);
        for (let head = 0; head < group.length; head += 1) {
          const point = group[head];
          for (let dy = -5; dy <= 5; dy += 1) for (let dx = -5; dx <= 5; dx += 1) {
            if (dx * dx + dy * dy > radiusSq) continue;
            const neighbor = (point.y + dy) * width + point.x + dx;
            const candidate = remaining.get(neighbor);
            if (candidate && candidate.x === point.x + dx && candidate.y === point.y + dy) {
              remaining.delete(neighbor);
              group.push(candidate);
            }
          }
        }
        components.push(group);
      }
      components.sort((a, b) => b.length - a.length);
      if (video) {
        const stats = components.map(group => {
          let minY = height, maxY = 0, sumY = 0, minX = width, maxX = 0;
          for (const point of group) {
            if (point.y < minY) minY = point.y;
            if (point.y > maxY) maxY = point.y;
            if (point.x < minX) minX = point.x;
            if (point.x > maxX) maxX = point.x;
            sumY += point.y;
          }
          return { group, length: group.length, minY, maxY, meanY: sumY / group.length, minX, maxX };
        });
        const skyMain = stats.filter(item => item.length >= 35
          && item.meanY < height * .62 && item.minY < height * .45
          && !(item.maxY >= lightCutoff - 2 && item.minY > height * .55));
        const main = skyMain[0] || stats[0];
        if (main && main.length >= 25) {
          eligible = stats.filter(item => item.group === main.group || (
            item.length >= 8
            && item.maxY <= main.maxY + 5
            && item.minY >= main.minY - 8
            && item.minX >= main.minX - 14
            && item.maxX <= main.maxX + 14
            && item.meanY < height * .68
          )).flatMap(item => item.group);
        }
      } else if (components[0]?.length >= 40 && components[0].length >= eligible.length * .35) {
        const minimum = Math.max(8, components[0].length * .06);
        eligible = components.filter(group => group.length >= minimum).flat();
      } else nightLights = false;
    }
    if (!eligible.length) throw new Error('Bentuk pada gambar belum dapat dikenali.');
    let primaryLogoHue = null;
    let logoMainBand = null;
    if (logo && !nightLights && (uniformBorder || transparent)) {
      // A flat logo's largest field is often its background or plaque. Find the
      // broad, detailed color group instead, so letters receive the point budget.
      const hueOf = color => {
        const [r, g, b] = color;
        const high = Math.max(r, g, b), low = Math.min(r, g, b), delta = high - low;
        if (high < 55 || delta < 35 || delta / high < .22) return -1;
        let hue = high === r ? (g - b) / delta : high === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
        if (hue < 0) hue += 6;
        const bucket = Math.floor(hue * 2) % 12;
        return bucket === 11 ? 0 : bucket;
      };
      const hueAt = (x, y) => hueOf(pixelAt(x, y));
      const groups = new Map();
      for (const candidate of eligible) {
        candidate.logoHue = hueOf(candidate.color);
        if (candidate.logoHue < 0) continue;
        if (!groups.has(candidate.logoHue)) groups.set(candidate.logoHue,
          { count: 0, edges: 0, border: 0, left: width, right: 0, rows: new Int32Array(height) });
        const group = groups.get(candidate.logoHue);
        group.count++;
        group.left = Math.min(group.left, candidate.x);
        group.right = Math.max(group.right, candidate.x);
        group.rows[candidate.y]++;
        if (hueAt(candidate.x + 1, candidate.y) !== candidate.logoHue ||
          hueAt(candidate.x, candidate.y + 1) !== candidate.logoHue) group.edges++;
      }
      const markBorder = (x, y) => {
        const color = pixelAt(x, y);
        if (color[3] < 32) return;
        const group = groups.get(hueOf(color));
        if (group) group.border++;
      };
      for (let x = 0; x < width; x++) { markBorder(x, 0); markBorder(x, height - 1); }
      for (let y = 1; y < height - 1; y++) { markBorder(0, y); markBorder(width - 1, y); }
      const logoRank = group => group.edges * group.edges / group.count
        * (group.right - group.left + 1)
        * (group.border > (width + height) * .12 ? .05 : 1);
      const ranked = [...groups].filter(([, group]) => group.count >= Math.max(25, eligible.length * .02))
        .sort((a, b) => logoRank(b[1]) - logoRank(a[1]));
      if (ranked.length) {
        primaryLogoHue = ranked[0][0];
        const group = ranked[0][1];
        const bands = [];
        let band = null, last = -10;
        for (let y = 0; y < height; y++) {
          if (group.rows[y] < Math.max(2, width * .008)) continue;
          if (!band || y - last > 5) { band = { top: y, bottom: y, count: 0 }; bands.push(band); }
          band.bottom = y;
          band.count += group.rows[y];
          last = y;
        }
        bands.sort((a, b) => b.count - a.count);
        const focus = bands[0];
        if (focus && focus.count >= group.count * .45) {
          const main = eligible.filter(candidate => candidate.logoHue === primaryLogoHue
            && candidate.y >= focus.top - 2 && candidate.y <= focus.bottom + 2);
          if (main.length >= Math.min(30, count / 3)) {
            logoMainBand = { top: focus.top - 2, bottom: focus.bottom + 2 };
            const left = Math.min(...main.map(point => point.x));
            const right = Math.max(...main.map(point => point.x));
            const padX = Math.max(2, (right - left) * .04);
            const padY = Math.max(3, (focus.bottom - focus.top) * .3);
            eligible = eligible.filter(candidate => candidate.x >= left - padX && candidate.x <= right + padX
              && candidate.y >= focus.top - padY && candidate.y <= focus.bottom + padY
              && (candidate.logoHue === primaryLogoHue
                ? candidate.y >= logoMainBand.top && candidate.y <= logoMainBand.bottom
                : candidate.logoHue >= 0 && (candidate.y < logoMainBand.top || candidate.y > logoMainBand.bottom)));
          }
        }
      }
    }
    // Fit the visible subject, not the image canvas; logos often have wide empty margins.
    const bounds = eligible.reduce((box, candidate) => ({
      left: Math.min(box.left, candidate.x), right: Math.max(box.right, candidate.x),
      top: Math.min(box.top, candidate.y), bottom: Math.max(box.bottom, candidate.y)
    }), { left: width, right: 0, top: height, bottom: 0 });
    const subjectWidth = Math.max(1, bounds.right - bounds.left + 1);
    const subjectHeight = Math.max(1, bounds.bottom - bounds.top + 1);
    const aspect = subjectWidth / subjectHeight;
    let designWidth = video && nightLights ? .76 : logo && primaryLogoHue !== null ? .82 : .7;
    let designHeight = designWidth * 2 / aspect;
    const maximumHeight = video && nightLights ? .68 : nightLights ? .64 : logo && primaryLogoHue !== null ? .68 : .55;
    if (designHeight > maximumHeight) { designHeight = maximumHeight; designWidth = designHeight * aspect / 2; }
    const centerY = nightLights ? .42 : .43;
    const vividVideoColor = (cx, cy) => {
      let rSum = 0, gSum = 0, bSum = 0, wSum = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const p = pixelAt(cx + dx, cy + dy);
          const pk = Math.max(p[0], p[1], p[2]);
          if (pk < 55) continue;
          const sp = pk - Math.min(p[0], p[1], p[2]);
          const w = (sp + 15) * (pk / 255) * (dx === 0 && dy === 0 ? 1.8 : 1);
          rSum += p[0] * w; gSum += p[1] * w; bSum += p[2] * w; wSum += w;
        }
      }
      let r = wSum > 0 ? rSum / wSum : pixelAt(cx, cy)[0];
      let g = wSum > 0 ? gSum / wSum : pixelAt(cx, cy)[1];
      let b = wSum > 0 ? bSum / wSum : pixelAt(cx, cy)[2];
      const mean = (r + g + b) / 3;
      r = Math.max(0, r - mean * .22) * 1.75 + mean * .12;
      g = Math.max(0, g - mean * .22) * 1.75 + mean * .12;
      b = Math.max(0, b - mean * .22) * 1.75 + mean * .12;
      const pk = Math.max(r, g, b, 1);
      const scaleColor = 248 / pk;
      const hex = value => Math.max(0, Math.min(255, Math.round(value * scaleColor))).toString(16).padStart(2, '0');
      return `#${hex(r)}${hex(g)}${hex(b)}`;
    };
    const makePoint = candidate => {
      if (video && nightLights) {
        return {
          x: .5 - designWidth / 2 + (candidate.x - bounds.left + .5) / subjectWidth * designWidth,
          y: centerY - designHeight / 2 + (candidate.y - bounds.top + .5) / subjectHeight * designHeight,
          z: 0,
          color: vividVideoColor(candidate.x, candidate.y)
        };
      }
      const red = candidate.color[0], green = candidate.color[1], blue = candidate.color[2];
      const peak = Math.max(red, green, blue);
      const boost = peak < 20 ? null : Math.max(1, (nightLights || logo && primaryLogoHue !== null ? 225 : 175) / peak);
      const hex = channel => Math.min(255, Math.round(channel * boost)).toString(16).padStart(2, '0');
      return {
        x: .5 - designWidth / 2 + (candidate.x - bounds.left + .5) / subjectWidth * designWidth,
        y: centerY - designHeight / 2 + (candidate.y - bounds.top + .5) / subjectHeight * designHeight,
        z: 0,
        color: boost === null ? '#d9e0e3' : `#${hex(red)}${hex(green)}${hex(blue)}`
      };
    };
    const selected = [];
    const minimumGapSquared = (AI_SPACING_METERS / AI_WORKSPACE_METERS) ** 2;
    const minDisplayGapSquared = video && nightLights ? 0 : AI_DISPLAY_GAP_PX ** 2;
    for (const candidate of eligible) {
      candidate.point = makePoint(candidate);
      candidate.nearestWorld = Infinity;
      candidate.nearestDisplay = Infinity;
    }
    // Night photos contain many source pixels per light. A smaller, brighter
    // selection keeps the head legible and the body from becoming a dot cloud.
    const requestedPoints = nightLights && !video ? Math.min(count, 320) : count;
    const headBoundary = bounds.top + subjectHeight * .29;
    let primaryPlaced = 0;
    const primaryBudget = primaryLogoHue === null ? requestedPoints : Math.ceil(requestedPoints * .88);
    for (let pick = 0; pick < Math.min(requestedPoints, eligible.length); pick += 1) {
      let best = null;
      let priority = -1;
      const choosingPrimary = primaryPlaced < primaryBudget;
      for (const candidate of eligible) {
        if (candidate.used) continue;
        if (primaryLogoHue !== null && choosingPrimary !== (candidate.logoHue === primaryLogoHue)) continue;
        if (candidate.nearestWorld < minimumGapSquared
          || candidate.nearestDisplay < minDisplayGapSquared) continue;
        const spacing = selected.length
          ? Math.min(1, Math.sqrt(candidate.nearest) / (video && nightLights ? 3.5 : 6))
          : 1;
        const headPriority = nightLights && !video && candidate.y < headBoundary ? 1.18 : 1;
        const value = candidate.score * (video && nightLights ? .4 + .6 * spacing : .25 + .75 * spacing) * headPriority;
        if (value > priority) { best = candidate; priority = value; }
      }
      if (!best) {
        if (primaryLogoHue !== null && choosingPrimary) primaryPlaced = primaryBudget;
        else break;
        continue;
      }
      best.used = true;
      if (best.logoHue === primaryLogoHue) primaryPlaced++;
      selected.push(best.point);
      for (const candidate of eligible) {
        const separation = (candidate.x - best.x) ** 2 + (candidate.y - best.y) ** 2;
        if (separation < candidate.nearest) candidate.nearest = separation;
        const worldSeparation = (candidate.point.x - best.point.x) ** 2
          + (candidate.point.y - best.point.y) ** 2;
        if (worldSeparation < candidate.nearestWorld) candidate.nearestWorld = worldSeparation;
        const displaySeparation = ((candidate.point.x - best.point.x) * 1200) ** 2
          + ((candidate.point.y - best.point.y) * 600) ** 2;
        if (displaySeparation < candidate.nearestDisplay) candidate.nearestDisplay = displaySeparation;
      }
    }
    selected.preferReferencePixels = lineArt || flatArtwork || isolatedSubject || transparent || checkerBackground || nightLights
      || logo && primaryLogoHue !== null;
    selected.logoReference = logo && primaryLogoHue !== null;
    return selected;
  } finally { bitmap.close(); }
}

function setAiDesign(design, prompt, count, referenceName = '', imageDrones = null, settings = null,
  referenceImage = null, referenceSource = null, referenceIsLogo = false,
  additionalReferenceImages = [], referenceSources = [], additionalImageDrones = [],
  videoMotionGroups = null) {
  const original = aiPreviousProject || {
      project: projectSnapshot(),
      unsaved: hasUnsavedChanges,
      userProject: hasUserProject,
      saveLabel: saveState.textContent,
      bannerHidden: starterBanner.hidden,
      selectedScene: state.selectedScene,
      globalTime: totalDuration() * Number(timeRange.value) / 100,
      view: state.view,
      camera: { ...state.camera },
      aiDesign: aiCurrentDesign
  };
  const previous = original.project;
  const frameBudget = Math.floor(MAX_ANIMATION_ROWS / design.scenes.length);
  const dimension = design.dimension === '3d' ? '3d' : '2d';
  const figurativeReference = !referenceIsLogo && (referenceSource?.kind === 'commons' ||
    /\b(?:naga|dragon|phoenix|phoneix|feniks|burung|bird|harimau|tiger|singa|lion)\b/i.test(prompt));
  const to3dReferencePoints = points => {
    const colored = points.map(point => {
      const red = parseInt(point.color.slice(1, 3), 16);
      const blue = parseInt(point.color.slice(5, 7), 16);
      return { ...point, z: Math.round((blue - red) / 255 * 12) };
    });
    const zs = colored.map(point => point.z);
    if (zs.length && Math.max(...zs) - Math.min(...zs) >= 5) return colored;
    return points.map(point => ({
      ...point,
      z: Math.round((1 - Math.min(1, Math.hypot((point.x - .5) * 2.2, (point.y - .43) * 2.2))) * 16 - 8)
    }));
  };
  const durations = design.scenes.map(scene => settings?.duration && design.scenes.length === 1
    ? settings.duration : Math.max(9, Math.min(12, scene.duration + 3)));
  const hasVideoMotion = Array.isArray(videoMotionGroups)
    && videoMotionGroups.length === design.scenes.length
    && videoMotionGroups.every(group => Array.isArray(group) && group.some(kf => Array.isArray(kf) && kf.length >= 20));
  let show;
  if (hasVideoMotion) {
    const preparedGroups = videoMotionGroups.map(group => group.map(kf => dimension === '3d'
      ? to3dReferencePoints(kf)
      : kf));
    show = buildAiVideoShow(preparedGroups, durations, dimension);
  } else {
    const targets = design.scenes.map((scene, index) => {
      const strokes = scene.strokes || [{ closed: true, points: scene.points }];
      const sceneImageDrones = index === 0 ? imageDrones : additionalImageDrones[index - 1];
      return dimension === '3d'
        ? selectAiDrones3d(sceneImageDrones
          ? to3dReferencePoints(sceneImageDrones)
          : sampleAiStrokes3d(strokes, count, scene.startColor, scene.endColor,
            figurativeReference), figurativeReference)
        : selectAiDronesOnLines(sceneImageDrones
          || sampleAiStrokes(strokes, count, scene.startColor, scene.endColor));
    });
    show = buildAiLightShow(targets, durations, frameBudget, dimension);
  }
  const scenes = design.scenes.map((scene, index) => {
    return { name: scene.name, formation: 'animation', aiGenerated: true, ...show.scenes[index],
      palette: { startColor: scene.startColor, endColor: scene.endColor, gradient: true } };
  });
  if (scenes.reduce((sum, scene) => sum + scene.duration, 0) > 119) {
    throw new Error('Durasi desain AI melebihi batas ekspor 120 detik. Sederhanakan bentuk atau kurangi jarak antar formasi.');
  }
  const project = validateProject({ ...previous, name: settings?.name || design.title, droneCount: count,
    workspaceWidth: AI_WORKSPACE_METERS, markerScale: show.count <= 250 ? 1.35 : show.count >= 700 ? .9 : 1.1,
    groundVisible: false,
    startColor: scenes[0].palette.startColor, endColor: scenes[0].palette.endColor,
    gradient: true, scenes });
  applyProjectToEditor(project);
  updateMotionOrigin(state.scenes[0]);
  updateSpacingStatus();
  state.camera = { ...DEFAULT_CAMERA, yaw: dimension === '3d' ? imageDrones ? -.12 : -.5 : 0,
    pitch: dimension === '3d' ? imageDrones ? -.08 : -.2 : 0, zoom: 1 };
  setView(dimension === '3d' ? 'perspective' : 'front');
  aiDimension.value = dimension;
  aiPreviousProject = original;
  aiPreviewPrompt = prompt;
  aiPreviewReferenceName = referenceName;
  aiCurrentDesign = { design, prompt, count, actualCount: show.count, referenceName, imageDrones,
    settings, referenceImage, referenceSource, referenceIsLogo,
    additionalReferenceImages, referenceSources, additionalImageDrones, videoMotionGroups };
  aiSourceRow.hidden = true;
  aiSourceRow.querySelectorAll('[data-extra-source]').forEach(element => element.remove());
  if (referenceSource?.pageUrl && referenceSource?.name) {
    try {
      const sourceUrl = new URL(referenceSource.pageUrl);
      if (sourceUrl.protocol === 'https:') {
        aiSourceLink.href = sourceUrl.href;
        aiSourceLink.textContent = `${referenceSource.name} (${referenceSource.kind === 'official'
          ? 'halaman resmi' : referenceSource.kind === 'commons' ? 'Wikimedia Commons' : 'hasil pencarian'})`;
        aiSourceRow.hidden = false;
      }
    } catch { /* Sumber yang tidak valid tidak ditampilkan. */ }
  }
  for (const source of referenceSources.slice(1, 3)) {
    try {
      const url = new URL(source.pageUrl);
      if (url.protocol !== 'https:' || !source.name) continue;
      const item = document.createElement('span');
      item.dataset.extraSource = '';
      const link = document.createElement('a');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = source.name;
      item.append(' · ', link);
      aiSourceRow.append(item);
      aiSourceRow.hidden = false;
    } catch { /* Tautan sumber yang tidak valid diabaikan. */ }
  }
  if (referenceImage && !aiReferenceFile.files?.length) {
    aiReferenceLabel.textContent = `${referenceName || 'Gambar referensi'} · tersimpan di browser`;
    aiAttachmentPreview.alt = `Gambar terlampir: ${referenceName || 'referensi terakhir'}`;
    aiAttachmentPreview.src = `data:${referenceImage.mimeType};base64,${referenceImage.data}`;
    aiAttachment.hidden = false;
  }
  aiPreview.hidden = false;
  stage.classList.add('ai-preview-active');
  starterBanner.hidden = true;
  canvas.inert = true;
  projectName.disabled = true;
  if (q('[data-open-project]')) q('[data-open-project]').disabled = true;
  if (q('[data-open-generator]')) q('[data-open-generator]').disabled = true;
  qa('.control-panel > .control-section:not(.ai-section), .scene-panel, .workspace-toolbar').forEach(element => { element.inert = true; });
  q('[data-save]').disabled = true;
  exportAbcButton.disabled = true;
  q('[data-consult-download]').hidden = true;
  saveState.textContent = 'Desain drone · pratinjau saja';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) updateTime(totalDuration());
  else startTest();
}

function unlockAiWorkspace() {
  aiPreview.hidden = true;
  stage.classList.remove('ai-preview-active');
  canvas.inert = false;
  projectName.disabled = false;
  if (q('[data-open-project]')) q('[data-open-project]').disabled = false;
  if (q('[data-open-generator]')) q('[data-open-generator]').disabled = false;
  qa('.control-panel > .control-section:not(.ai-section), .scene-panel, .workspace-toolbar').forEach(element => { element.inert = false; });
  q('[data-save]').disabled = false;
  exportAbcButton.disabled = false;
  q('[data-consult-download]').hidden = false;
}

async function useAiDesignInWorkspace() {
  if (aiPreview.hidden || !aiCurrentDesign) return;
  if (aiRequestController) { showToast('Tunggu hingga perubahan AI selesai dibuat.'); return; }
  if (aiPreviousProject?.userProject && !window.confirm('Gunakan hasil AI sebagai proyek aktif? Proyek sebelumnya akan diganti. Unduh dahulu bila ingin menyimpannya.')) return;
  const button = q('[data-ai-use]');
  button.disabled = true;
  button.textContent = 'Menyiapkan workspace…';
  let referenceWarning = '';
  try {
    const animation = state.scenes.at(-1);
    const activeFinalDrones = animation.frames.at(-1).drones.filter(drone => drone.color !== '#000000');
    const finalDrones = (activeFinalDrones.length ? activeFinalDrones : animation.frames.at(-1).drones).map(drone => ({ ...drone }));
    const editableDuration = Math.min(5, Math.max(1, Number((119.99 - totalDuration()).toFixed(3))));
    const editable = { name: `${animation.name.slice(0, 62)} · formasi akhir`, formation: 'manual',
      duration: editableDuration, manualDrones: finalDrones, aiGenerated: true, palette: { ...animation.palette } };
    const source = aiCurrentDesign.referenceImage;
    if (source) {
      try {
        const bytes = Uint8Array.from(atob(source.data), char => char.charCodeAt(0));
        const file = new File([bytes], aiCurrentDesign.referenceName || 'referensi-ai', { type: source.mimeType });
        const data = await encodeReferenceImage(file);
        const references = [{ name: file.name.slice(0, 80), data, visible: false,
          opacity: .5, scale: 1, x: .5, y: .5 }];
        if (finalDrones.length <= MAX_MANUAL_DRONES) editable.references = references;
        else animation.references = references;
      } catch {
        referenceWarning = ' Gambar referensi tidak berhasil disalin; tambahkan lagi melalui panel Referensi.';
      }
    }
    const current = projectSnapshot();
    const accepted = validateProject({ ...current, scenes: finalDrones.length <= MAX_MANUAL_DRONES
      ? [...current.scenes, editable] : current.scenes });
    aiPreviousProject = null;
    unlockAiWorkspace();
    applyProjectToEditor(accepted);
    chooseScene(accepted.scenes.length - 1);
    updateTime(sceneStartTime(state.selectedScene));
    markDirty();
    aiConversation = [];
    aiReferenceFile.value = '';
    aiAttachedVideoFrames = null;
    aiVideoExtractPromise = null;
    aiAttachment.hidden = true;
    aiAttachmentPreview.removeAttribute('src');
    renderAiConversation();
    aiStatus.textContent = finalDrones.length <= MAX_MANUAL_DRONES
      ? 'Formasi akhir siap diedit. Simpan proyek setelah selesai.'
      : 'Animasi cahaya siap disimpan. Jumlah drone melebihi kapasitas editor manual 1.000 titik.';
    showToast(`${finalDrones.length <= MAX_MANUAL_DRONES ? 'Formasi akhir siap diedit' : 'Animasi cahaya siap'} dan disimpan.${referenceWarning}`);
  } catch (error) {
    showToast(`Hasil AI belum dapat digunakan: ${error.message}`);
  } finally {
    button.disabled = false;
    button.textContent = 'Gunakan di workspace';
  }
}

function closeAiPreview() {
  aiRequestController?.abort();
  aiRequestController = null;
  let previousAiDesign = null;
  if (aiPreviousProject) {
    const previous = aiPreviousProject;
    previousAiDesign = previous.aiDesign || null;
    aiPreviousProject = null;
    applyProjectToEditor(previous.project);
    state.camera = { ...previous.camera };
    setView(previous.view);
    chooseScene(previous.selectedScene);
    updateTime(previous.globalTime);
    hasUnsavedChanges = previous.unsaved;
    hasUserProject = previous.userProject;
    saveState.textContent = previous.saveLabel;
    starterBanner.hidden = previous.bannerHidden;
  }
  unlockAiWorkspace();
  aiPreviewPrompt = '';
  aiPreviewReferenceName = '';
  aiCurrentDesign = previousAiDesign;
  aiConversation = [];
  aiReferenceFile.value = '';
  aiAttachedVideoFrames = null;
  aiVideoExtractPromise = null;
  aiAttachment.hidden = true;
  aiAttachmentPreview.removeAttribute('src');
  renderAiConversation();
  scheduleDraftSave();
}

q('[data-ai-use]').addEventListener('click', useAiDesignInWorkspace);
q('[data-ai-close]').addEventListener('click', closeAiPreview);
q('[data-ai-replay]').addEventListener('click', startTest);
q('[data-ai-consult]').addEventListener('click', openConsultation);
if (aiCancelButton) {
  aiCancelButton.addEventListener('click', () => {
    if (aiRequestController) {
      aiRequestController.abort();
    }
  });
}
aiNewButton.addEventListener('click', () => {
  if (aiRequestController) return;
  if (!aiPreview.hidden) closeAiPreview();
  aiCurrentDesign = null;
  aiConversation = [];
  aiPromptInput.value = '';
  generatorForm.elements.prompt.value = '';
  aiReferenceFile.value = '';
  aiAttachedVideoFrames = null;
  aiVideoExtractPromise = null;
  aiAttachment.hidden = true;
  aiAttachmentPreview.removeAttribute('src');
  renderAiConversation();
  updateGeneratorSubmit();
  aiStatus.textContent = 'Desain baru siap. Tulis objek dan detail yang ingin dibuat.';
  scheduleDraftSave();
});
aiDimension.addEventListener('change', () => {
  if (!aiPreview.hidden) closeAiPreview();
  aiCurrentDesign = null;
  aiConversation = [];
  renderAiConversation();
  aiStatus.textContent = aiDimension.value === '3d'
    ? 'Mode 3D: AI membentuk kedalaman nyata. Putar kamera untuk meninjau hasil.'
    : 'Mode 2D: AI membentuk gambar titik dari tampak depan.';
  scheduleDraftSave();
});

function updateAiGuestQuota(remaining) {
  if (aiTestMode) {
    guestRemaining = null;
    updateAiAvailabilityUi();
    return;
  }
  if (!Number.isInteger(remaining)) return;
  guestRemaining = Math.max(0, remaining);
  updateAiAvailabilityUi();
}

function updateAiAvailabilityUi() {
  [aiPromptInput, generatorForm.elements.prompt].forEach(input => {
    if (aiTestMode) input.removeAttribute('maxlength');
    else input.setAttribute('maxlength', '500');
  });
  aiRemaining.hidden = aiTestMode || !aiProviderAvailable;
  aiRemaining.textContent = guestRemaining === 0 ? 'Kesempatan AI tamu habis.'
    : `Sisa generate: ${guestRemaining ?? 2} dari 2.`;
  aiGenerateButton.disabled = !aiServiceReady || Boolean(aiRequestController)
    || !aiProviderAvailable || guestRemaining === 0;
  if (aiCancelButton) aiCancelButton.hidden = !aiRequestController;
}

function isAiVideoFile(file) {
  return Boolean(file && (AI_VIDEO_TYPES.includes(file.type) || /\.(?:mp4|webm|mov)$/i.test(file.name || '')));
}

async function extractAiVideoFrames(file, maxFrames = 3) {
  if (!file || !file.size || file.size > MAX_AI_VIDEO_BYTES) {
    throw new Error('Video referensi harus MP4, WebM, atau MOV dan maksimal 25 MB.');
  }
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  const objectUrl = URL.createObjectURL(file);
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Waktu baca video habis.')), 12_000);
      video.onloadedmetadata = () => { clearTimeout(timer); resolve(); };
      video.onerror = () => { clearTimeout(timer); reject(new Error('Video tidak dapat dibaca. Pilih file MP4, WebM, atau MOV lain.')); };
      video.src = objectUrl;
    });
    if (!video.videoWidth || !video.videoHeight) {
      throw new Error('Resolusi video tidak valid.');
    }
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
    const fractions = duration >= 1.2 && maxFrames >= 3 ? [.15, .38, .85]
      : duration >= .5 && maxFrames >= 2 ? [.2, .8] : [Math.min(.1, duration / 2 || 0)];
    const scale = Math.min(1, 480 / Math.max(video.videoWidth, video.videoHeight));
    const width = Math.max(16, Math.round(video.videoWidth * scale));
    const height = Math.max(16, Math.round(video.videoHeight * scale));
    const surface = document.createElement('canvas');
    surface.width = width;
    surface.height = height;
    const context = surface.getContext('2d', { willReadFrequently: true });
    const captureAtFraction = async (fraction, needBase64 = true) => {
      const targetTime = duration > 0 ? Math.min(Math.max(0, duration - .05), Number((duration * fraction).toFixed(3))) : 0;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Gagal mengambil frame video.')), 8_000);
        const onReady = () => { clearTimeout(timer); resolve(); };
        if (Math.abs(video.currentTime - targetTime) < .01 && video.readyState >= 2) {
          onReady();
          return;
        }
        video.onseeked = onReady;
        video.onerror = () => { clearTimeout(timer); reject(new Error('Gagal membaca frame video.')); };
        video.currentTime = targetTime;
      });
      context.clearRect(0, 0, width, height);
      context.drawImage(video, 0, 0, width, height);
      if (!needBase64 && typeof surface.toBlob === 'function') {
        const blob = await new Promise(resolve => surface.toBlob(resolve, 'image/png'));
        if (blob) return { blob };
      }
      let dataUrl = surface.toDataURL('image/png');
      let mimeType = 'image/png';
      if (dataUrl.length > MAX_AI_REFERENCE_BYTES * 1.2) {
        dataUrl = surface.toDataURL('image/jpeg', .86);
        mimeType = 'image/jpeg';
      }
      const data = dataUrl.split(',')[1];
      const bytes = Uint8Array.from(atob(data), char => char.charCodeAt(0));
      return { mimeType, data, dataUrl, blob: new Blob([bytes], { type: mimeType }) };
    };
    const frames = [];
    for (const fraction of fractions.slice(0, maxFrames)) {
      frames.push(await captureAtFraction(fraction, true));
    }
    if (!frames.length) throw new Error('Tidak ada frame video yang dapat dibaca.');
    if (duration >= 1.2 && maxFrames >= 3) {
      const groupFractions = [
        [.04, .10, .16, .22],
        [.29, .37, .45, .53],
        [.61, .71, .82, .94]
      ];
      const motionGroups = [];
      for (const group of groupFractions) {
        const blobs = [];
        for (const fraction of group) {
          const captured = await captureAtFraction(fraction, false);
          blobs.push(captured.blob);
        }
        motionGroups.push(blobs);
      }
      frames.motionGroups = motionGroups;
    }
    return frames;
  } finally {
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}

aiReferenceFile.addEventListener('change', () => {
  updateGeneratorSubmit();
  aiAttachedVideoFrames = null;
  aiVideoExtractPromise = null;
  const file = aiReferenceFile.files?.[0];
  if (!file) return;
  if (isAiVideoFile(file)) {
    if (!file.size || file.size > MAX_AI_VIDEO_BYTES) {
      aiReferenceFile.value = '';
      aiAttachment.hidden = true;
      aiAttachmentPreview.removeAttribute('src');
      aiStatus.textContent = 'Pilih video MP4, WebM, atau MOV berukuran maksimal 25 MB.';
      return;
    }
    aiReferenceLabel.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB (video)`;
    aiAttachmentPreview.alt = `Video terlampir: ${file.name}`;
    aiAttachment.hidden = false;
    aiVideoExtractPromise = extractAiVideoFrames(file, 3).then(frames => {
      if (aiReferenceFile.files?.[0] === file) {
        aiAttachedVideoFrames = frames;
        aiAttachmentPreview.src = frames[0].dataUrl;
      }
      return frames;
    }).catch(error => {
      if (aiReferenceFile.files?.[0] === file) {
        aiReferenceFile.value = '';
        aiAttachment.hidden = true;
        aiAttachmentPreview.removeAttribute('src');
        aiStatus.textContent = error.message || 'Video tidak dapat dibaca.';
      }
      throw error;
    });
    return;
  }
  if (!AI_IMAGE_TYPES.includes(file.type) || file.size > MAX_AI_REFERENCE_BYTES || !file.size) {
    aiReferenceFile.value = '';
    aiAttachment.hidden = true;
    aiAttachmentPreview.removeAttribute('src');
    aiStatus.textContent = 'Pilih gambar PNG, JPG, atau WebP berukuran maksimal 2 MB.';
    return;
  }
  aiReferenceLabel.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  aiAttachmentPreview.alt = `Gambar terlampir: ${file.name}`;
  aiAttachment.hidden = false;
  const reader = new FileReader();
  reader.onload = () => {
    if (aiReferenceFile.files?.[0] === file) aiAttachmentPreview.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

aiReferenceRemove.addEventListener('click', () => {
  aiReferenceFile.value = '';
  aiAttachedVideoFrames = null;
  aiVideoExtractPromise = null;
  aiAttachment.hidden = true;
  aiAttachmentPreview.removeAttribute('src');
  if (aiCurrentDesign) {
    aiCurrentDesign.referenceImage = null;
    aiCurrentDesign.imageDrones = null;
    aiCurrentDesign.referenceName = '';
    aiCurrentDesign.referenceSource = null;
    aiCurrentDesign.additionalReferenceImages = [];
    aiCurrentDesign.referenceSources = [];
    aiCurrentDesign.additionalImageDrones = [];
    aiCurrentDesign.videoMotionGroups = null;
  }
  aiSourceRow.hidden = true;
  updateGeneratorSubmit();
  scheduleDraftSave();
});

async function aiReferencePayload() {
  const file = aiReferenceFile.files?.[0];
  if (!file) return null;
  if (isAiVideoFile(file)) {
    const frames = aiAttachedVideoFrames || await (aiVideoExtractPromise || extractAiVideoFrames(file, 3));
    aiAttachedVideoFrames = frames;
    return { mimeType: frames[0].mimeType, data: frames[0].data };
  }
  if (!AI_IMAGE_TYPES.includes(file.type) || !file.size || file.size > MAX_AI_REFERENCE_BYTES) {
    throw new Error('Gambar referensi harus PNG, JPG, atau WebP dan maksimal 2 MB.');
  }
  const url = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gambar referensi tidak bisa dibaca.'));
    reader.readAsDataURL(file);
  });
  return { mimeType: file.type, data: String(url).split(',')[1] };
}

function studioApiUnavailableMessage() {
  return 'API Studio tidak merespons di alamat ini. Jalankan node server.cjs dari folder skyfy-studio, buka alamat yang muncul di terminal, lalu klik Periksa layanan lagi.';
}

async function checkAiService() {
  aiGenerateButton.disabled = true;
  aiServiceReady = false;
  aiProviderAvailable = false;
  try {
    const response = await fetch('/api/ai-status', { cache: 'no-store' });
    if (!response.ok) throw new Error(studioApiUnavailableMessage());
    const data = await response.json().catch(() => null);
    if (!data || typeof data.available !== 'boolean') throw new Error(studioApiUnavailableMessage());
    aiTestMode = data.testMode === true;
    [aiPromptInput, generatorForm.elements.prompt].forEach(input => {
      if (aiTestMode) input.removeAttribute('maxlength');
      else input.setAttribute('maxlength', '500');
    });
    const providerName = { anthropic: 'Anthropic', openai: 'OpenAI' }[data.provider] || 'AI';
    const keyName = { anthropic: 'ANTHROPIC_API_KEY', openai: 'OPENAI_API_KEY' }[data.provider] || 'API key';
    const modelName = typeof data.model === 'string' && data.model ? ` (${data.model})` : '';
    aiProviderAvailable = data.available;
    aiServiceReady = true;
    updateAiGuestQuota(data.guestRemaining);
    updateAiAvailabilityUi();
    q('[data-recheck-services]').hidden = data.available;
    aiStatus.textContent = !data.available ? `Server aktif memakai ${providerName}${modelName}, tetapi ${keyName} belum diatur.`
        : guestRemaining === 0 ? 'Kesempatan desain AI tamu habis. Login masih direncanakan.'
          : `${providerName}${modelName} siap.`;
  } catch (error) {
    q('[data-recheck-services]').hidden = false;
    aiStatus.textContent = error instanceof TypeError ? studioApiUnavailableMessage()
      : error.message || 'Layanan AI belum tersedia.';
  }
}

async function checkAlembicService() {
  alembicAvailable = null;
  try {
    const response = await fetch('/api/alembic-status', { cache: 'no-store' });
    if (!response.ok) throw new Error('Unduh .abc memerlukan server Studio. Jalankan node server.cjs.');
    const data = await response.json().catch(() => null);
    if (!data || typeof data.available !== 'boolean') throw new Error('Unduh .abc memerlukan server Studio. Jalankan node server.cjs.');
    if (!data.available) throw new Error('Server aktif, tetapi Blender belum ditemukan. Atur BLENDER_BIN ke lokasi blender.exe dan jalankan ulang server.');
    alembicAvailable = true;
    alembicStatus.textContent = 'Alembic siap. .abc menyimpan animasi; .json menyimpan proyek lengkap.';
    exportAbcButton.title = 'Unduh animasi posisi drone sebagai Alembic .abc';
  } catch (error) {
    alembicAvailable = false;
    alembicStatus.textContent = error.message || 'Layanan Alembic belum tersedia.';
    exportAbcButton.title = alembicStatus.textContent;
  }
}

function recheckServices() {
  if (servicesCheckPromise) return servicesCheckPromise;
  const button = q('[data-recheck-services]');
  button.disabled = true;
  aiStatus.textContent = 'Memeriksa layanan AI…';
  alembicStatus.textContent = 'Memeriksa layanan Alembic…';
  servicesCheckPromise = Promise.allSettled([checkAiService(), checkAlembicService()]).finally(() => {
    servicesCheckPromise = null;
    button.disabled = false;
  });
  return servicesCheckPromise;
}
q('[data-recheck-services]').addEventListener('click', () => { void recheckServices(); });

aiForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (aiRequestController) {
    aiStatus.textContent = 'Desain AI masih diproses. Tunggu hasilnya.';
    return;
  }
  if (!aiServiceReady) {
    aiStatus.textContent = studioApiUnavailableMessage();
    return;
  }
  if (!aiProviderAvailable) {
    aiStatus.textContent = 'AI belum tersedia. Atur API key di server.';
    return;
  }
  if (guestRemaining === 0) {
    aiStatus.textContent = 'Dua kesempatan tamu sudah dipakai. Login untuk melanjutkan masih direncanakan.';
    return;
  }
  const prompt = aiPromptInput.value.trim();
  const settings = generatorSettings ? { ...generatorSettings } : null;
  const count = settings?.count ?? Number(countInput.value);
  const revising = Boolean(aiCurrentDesign && !aiPreview.hidden && aiConversation.length);
  const dimension = revising ? (aiCurrentDesign.design.dimension || '2d') : aiDimension.value;
  const rememberedImage = revising ? aiCurrentDesign.referenceImage || null : null;
  const rememberedExtras = revising && !aiReferenceFile.files?.length
    ? aiCurrentDesign.additionalReferenceImages || [] : [];
  if (!aiTestMode && prompt.length > 500 || (!aiReferenceFile.files?.length && !rememberedImage
    && prompt.length < (revising || aiTestMode ? 1 : 10))) {
    aiStatus.textContent = aiTestMode ? 'Isi prompt desain atau lampirkan gambar.' : 'Tulis ide desain sepanjang 10–500 karakter, atau lampirkan gambar.';
    return;
  }
  const conversation = [];
  let historyBudget = 6000;
  for (const turn of (revising ? aiConversation : []).slice(-6).reverse()) {
    if (historyBudget <= 0) break;
    const summary = turn.prompt.length > 2000
      ? `${turn.prompt.slice(0, 995)} … ${turn.prompt.slice(-1000)}` : turn.prompt;
    const bounded = summary.slice(0, historyBudget).trim();
    if (bounded) conversation.unshift(bounded);
    historyBudget -= bounded.length;
  }
  const controller = new AbortController();
  aiRequestController = controller;
  updateAiAvailabilityUi();
  aiGenerateButton.disabled = true;
  aiStatus.textContent = revising ? 'AI sedang menyesuaikan desain…'
    : /\b(?:logo|lambang)\b/i.test(prompt) && !aiReferenceFile.files?.length
      ? 'Mencari gambar logo di internet sebelum membuat desain…'
      : !aiReferenceFile.files?.length && prompt
        ? 'Mencari gambar acuan di internet sebelum membuat desain…' : 'AI sedang membuat desain…';
  try {
    const attachedFile = aiReferenceFile.files?.[0] || null;
    const videoAttached = isAiVideoFile(attachedFile);
    let videoFrames = null;
    if (videoAttached) {
      videoFrames = aiAttachedVideoFrames || await (aiVideoExtractPromise || extractAiVideoFrames(attachedFile, 3));
      aiAttachedVideoFrames = videoFrames;
    }
    let referenceImage = videoFrames
      ? { mimeType: videoFrames[0].mimeType, data: videoFrames[0].data }
      : attachedFile ? await aiReferencePayload() : rememberedImage;
    const attachedExtraImages = videoFrames
      ? videoFrames.slice(1, 3).map(frame => ({ mimeType: frame.mimeType, data: frame.data }))
      : rememberedExtras;
    const rememberedBytes = !attachedFile && referenceImage
      ? Uint8Array.from(atob(referenceImage.data), char => char.charCodeAt(0)) : null;
    let imageDrones = null;
    const logoPrompt = /\b(?:logo|lambang)\b/i.test(prompt)
      || revising && aiCurrentDesign.referenceIsLogo === true;
    const primarySourceBlob = videoFrames ? videoFrames[0].blob
      : attachedFile || (rememberedBytes ? new Blob([rememberedBytes], { type: referenceImage.mimeType }) : null);
    if (primarySourceBlob && (attachedFile || logoPrompt || aiCurrentDesign?.referenceSource?.kind !== 'commons')) {
      try {
        const sampled = await sampleAiImage(primarySourceBlob, count, { logo: logoPrompt, video: Boolean(videoFrames) });
        if (sampled.preferReferencePixels) imageDrones = sampled;
      } catch { /* The AI can still interpret the attached image and supply its own strokes. */ }
    }
    const referenceName = attachedFile?.name || (revising ? aiCurrentDesign.referenceName : '') || '';
    const response = await fetch('/api/ai-design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, droneCount: count, dimension, referenceImage,
        ...(attachedExtraImages.length ? { additionalReferenceImages: attachedExtraImages } : {}), conversation,
        previousDesign: revising
          ? { supported: true, reason: '', title: aiCurrentDesign.design.title,
            scenes: aiCurrentDesign.design.scenes } : null,
        designContext: settings ? { name: settings.name, occasion: settings.occasion, duration: settings.duration } : null }),
      signal: controller.signal
    });
    const data = await response.json();
    updateAiGuestQuota(data.guestRemaining);
    if (!response.ok) throw new Error(data.error || 'Desain drone belum berhasil dibuat.');
    if (!data || !Array.isArray(data.scenes) || data.scenes.length < 1 || data.scenes.length > 3) throw new Error('Respons desain AI tidak valid.');
    if (dimension === '3d' && data.dimension !== '3d') throw new Error('AI belum menghasilkan desain 3D. Coba lagi.');
    if (aiRequestController !== controller) return;
    const referenceSource = data.referenceSource || (revising && !attachedFile ? aiCurrentDesign.referenceSource : null);
    const referenceSources = data.referenceSources || (revising && !attachedFile ? aiCurrentDesign.referenceSources : []) || [];
    const additionalReferenceImages = data.additionalReferenceImages || attachedExtraImages;
    if (data.referenceImage) referenceImage = data.referenceImage;
    if ((dimension === '2d' || logoPrompt) && data.referenceImage
      && (logoPrompt || referenceSource?.kind !== 'commons')) {
      try {
        const bytes = Uint8Array.from(atob(data.referenceImage.data), char => char.charCodeAt(0));
        const sampled = await sampleAiImage(new Blob([bytes], { type: data.referenceImage.mimeType }), count,
          { logo: logoPrompt, video: Boolean(videoFrames) });
        if (sampled.preferReferencePixels) imageDrones = sampled;
      } catch { /* Model tetap memakai gambar acuan yang diterima server. */ }
    }
    const additionalImageDrones = [];
    for (const extra of additionalReferenceImages.slice(0, 2)) {
      if (referenceSources[additionalImageDrones.length + 1]?.kind === 'commons') {
        additionalImageDrones.push(null);
        continue;
      }
      if (dimension !== '2d' && !videoFrames && !logoPrompt) {
        additionalImageDrones.push(null);
        continue;
      }
      try {
        const bytes = Uint8Array.from(atob(extra.data), char => char.charCodeAt(0));
        const sampled = await sampleAiImage(new Blob([bytes], { type: extra.mimeType }), count,
          { logo: logoPrompt, video: Boolean(videoFrames) });
        additionalImageDrones.push(sampled.preferReferencePixels ? sampled : null);
      } catch { additionalImageDrones.push(null); }
    }
    if (videoFrames && videoFrames.length > 1 && data.scenes.length === 1 && additionalImageDrones.some(Boolean)) {
      data.scenes = videoFrames.slice(0, 3).map((_, index) => ({
        ...data.scenes[0],
        name: `${data.scenes[0].name.slice(0, 68)} · Frame ${index + 1}`
      }));
    }
    let videoMotionGroups = null;
    if (videoFrames?.motionGroups?.length && imageDrones) {
      try {
        const sampledGroups = [];
        for (const group of videoFrames.motionGroups.slice(0, data.scenes.length)) {
          const keyframes = [];
          for (const blob of group) {
            const sampled = await sampleAiImage(blob, count, { logo: logoPrompt, video: true });
            if (sampled.preferReferencePixels && sampled.length >= 20) keyframes.push(sampled);
          }
          if (keyframes.length) sampledGroups.push(keyframes);
        }
        if (sampledGroups.length === data.scenes.length) videoMotionGroups = sampledGroups;
      } catch { /* Fallback ke pose statis bila sampling frame gerak gagal. */ }
    } else if (revising && !attachedFile && aiCurrentDesign?.videoMotionGroups?.length === data.scenes.length) {
      videoMotionGroups = aiCurrentDesign.videoMotionGroups;
    }
    const resolvedReferenceName = referenceSource?.name || referenceName;
    const visiblePrompt = prompt || `${videoAttached ? 'Video' : 'Gambar'} referensi: ${referenceName}`;
    setAiDesign(data, visiblePrompt, count, resolvedReferenceName, imageDrones, settings,
      referenceImage, referenceSource, logoPrompt, additionalReferenceImages,
      referenceSources, additionalImageDrones, videoMotionGroups);
    if (!revising) aiConversation = [];
    aiConversation.push({ prompt: visiblePrompt, reply: `${data.title} · ${aiCurrentDesign.actualCount.toLocaleString('id-ID')} drone · jarak konsep minimal 2,5 m` });
    aiConversation = aiConversation.slice(-8);
    renderAiConversation();
    aiPreviewPrompt = aiConversation.map(turn => turn.prompt).join(' → ');
    aiPromptInput.value = '';
    generatorForm.elements.prompt.value = '';
    scheduleDraftSave();
    aiStatus.textContent = (window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'Bentuk akhir AI ditampilkan. Tekan Putar ulang bila ingin melihat animasinya.'
        : 'Animasi AI diputar otomatis. Tulis perubahan berikutnya di kolom chat; jarak titik konsep minimal 2,5 m.')
        + (data.modelUsed ? ` Model: ${data.modelUsed}.` : '')
        + (data.referenceSearchWarning ? ` ${data.referenceSearchWarning}` : '');
  } catch (error) {
    if (error.name === 'AbortError') {
      aiStatus.textContent = 'Pembuatan desain AI dibatalkan.';
    } else {
      aiStatus.textContent = error.message || 'Desain drone belum berhasil dibuat.';
    }
  } finally {
    if (aiRequestController === controller) {
      aiRequestController = null;
      updateAiAvailabilityUi();
    }
  }
});
aiPromptInput.addEventListener('input', scheduleDraftSave);
generatorForm.elements.prompt.addEventListener('input', scheduleDraftSave);

async function initializeDraftRecovery() {
  if (window.__INITIAL_PROJECT__) {
    try {
      const initialProject = validateProject(window.__INITIAL_PROJECT__);
      applyProjectToEditor(initialProject);
      if (window.__PROJECT_NAME__) projectName.value = window.__PROJECT_NAME__;
      hasUnsavedChanges = false;
      hasUserProject = true;
      saveState.textContent = 'Proyek cloud aktif';
      starterBanner.hidden = true;
      draftReady = true;
      scheduleDraftSave();
      return;
    } catch (err) {
      console.warn('Gagal memuat proyek dari database:', err);
    }
  }

  let draft;
  try { draft = await draftOperation('readonly', store => store.get('current')); }
  catch {
    draftReady = true;
    showToast('Penyimpanan browser tidak tersedia. Unduh file proyek untuk menyimpan desain.');
    return;
  }
  if (!draft || draft.version !== 1) { draftReady = true; return; }
  let project;
  try { project = validateProject(draft.project); }
  catch { draftReady = true; return; }
  draftDialog.addEventListener('cancel', event => event.preventDefault());
  draftDialog.showModal();
  q('[data-draft-resume]').addEventListener('click', () => {
    draftDialog.close();
    applyProjectToEditor(project);
    if (Number.isInteger(draft.selectedScene) && draft.selectedScene >= 0 && draft.selectedScene < state.scenes.length) chooseScene(draft.selectedScene);
    if (Number.isFinite(draft.globalTime)) updateTime(Math.max(0, Math.min(totalDuration(), draft.globalTime)));
    if (draft.camera && ['yaw', 'pitch', 'zoom', 'panX', 'panY'].every(key => Number.isFinite(draft.camera[key]))) {
      state.camera = { ...draft.camera };
    }
    if (['front', 'perspective'].includes(draft.view)) setView(draft.view);
    hasUnsavedChanges = draft.unsaved === true;
    hasUserProject = draft.userProject === true;
    saveState.textContent = 'Konsep dipulihkan dari browser';
    starterBanner.hidden = true;
    aiConversation = Array.isArray(draft.conversation) ? draft.conversation.filter(turn =>
      turn && typeof turn.prompt === 'string' && typeof turn.reply === 'string').slice(-8) : [];
    renderAiConversation();
    aiPromptInput.value = typeof draft.input === 'string' ? draft.input : '';
    try {
      if (!isAiFeatureLocked() && draft.ai && Number.isInteger(draft.ai.count) && draft.ai.count >= 1 && draft.ai.count <= 1000
        && draft.ai.design?.scenes?.length >= 1 && draft.ai.design.scenes.length <= 3) {
        const saved = draft.ai;
        generatorSettings = saved.settings || null;
        updateAiContext();
        if (draft.aiPreviewActive !== false) {
          setAiDesign(saved.design, saved.prompt, saved.count, saved.referenceName,
            saved.imageDrones, saved.settings, saved.referenceImage, saved.referenceSource,
            saved.referenceIsLogo === true || /\b(?:logo|lambang)\b/i.test(saved.prompt || ''),
            saved.additionalReferenceImages || [], saved.referenceSources || [],
            saved.additionalImageDrones || []);
          renderAiConversation();
          if (aiPreviousProject) aiPreviousProject.aiDesign = draft.previousAi || null;
          aiPreviewPrompt = aiConversation.map(turn => turn.prompt).join(' → ');
          aiStatus.textContent = 'Konsep AI dipulihkan. Gunakan di workspace atau tulis perubahan berikutnya.';
        } else {
          aiCurrentDesign = saved;
          aiConversation = [];
          renderAiConversation();
          aiStatus.textContent = 'Proyek AI dipulihkan. Tulis prompt baru untuk membuat objek lain.';
        }
      }
    } catch {
      aiStatus.textContent = 'Riwayat chat dipulihkan, tetapi pratinjau AI tidak dapat dibuka.';
    }
    draftReady = true;
    scheduleDraftSave();
  }, { once: true });
  q('[data-draft-new]').addEventListener('click', async () => {
    draftDialog.close();
    try { await draftOperation('readwrite', store => store.delete('current')); }
    catch { showToast('Salinan lokal belum dapat dihapus dari browser.'); }
    draftReady = true;
  }, { once: true });
}

window.addEventListener('beforeunload', event => {
  if (!draftReady || !hasUserProject && !aiCurrentDesign && !aiPromptInput.value.trim()) return;
  clearTimeout(draftSaveTimer);
  void persistDraft();
  event.preventDefault();
  event.returnValue = '';
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') { clearTimeout(draftSaveTimer); void persistDraft(); }
});
void initializeDraftRecovery();
void recheckServices();

let featurePinned = false;
let featureHovered = false;

function updateFeatureDock() {
  const open = featurePinned || featureHovered || featurePanel.contains(document.activeElement);
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
  if (!featurePinned) {
    featureHovered = false;
    featureToggle.blur();
  }
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
  featureToggle.focus();
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
function setAiFeatureLock(locked) {
  const section = q('[data-ai-section]');
  const body = q('[data-ai-lock-body]');
  const note = q('[data-ai-lock-note]');
  const badge = q('[data-ai-lock-badge]');
  const genAiField = q('[data-generator-ai-field]');
  const genDesc = q('#generator-description');
  if (section) {
    section.hidden = locked;
    section.classList.toggle('is-locked', locked);
    section.dataset.aiLocked = String(locked);
  }
  if (body) body.inert = locked;
  if (note) note.hidden = !locked;
  if (badge) badge.textContent = locked ? '🔒 Dikunci' : 'Aktif';
  if (genAiField) {
    genAiField.hidden = locked;
    if (locked && generatorForm?.elements?.prompt) generatorForm.elements.prompt.value = '';
  }
  if (genDesc) {
    genDesc.textContent = locked
      ? 'Pilih paket desain klien siap pakai (500 drone) atau rancang sendiri.'
      : 'Pilih paket desain klien siap pakai (500 drone), rancang sendiri, atau tulis arahan AI.';
  }
  if (locked && !aiPreview.hidden) unlockAiWorkspace();
  updateGeneratorSubmit();
}
setAiFeatureLock(!window.__SKYFY_QA_UNLOCK_AI__);

updateHeaderHeight();
updateFeatureDock();
updateReferencePanel();
syncColorControls();
updateRangeFill(countInput, state.droneCount, 1, 1000);
updateSceneSummary();
updatePlacedCount();
updateTime();
resizeCanvas();
