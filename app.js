const onlineElem = document.getElementById('onlineCount');
const randOnline = Math.floor(Math.random() * (220 - 198 + 1)) + 198;
onlineElem.textContent = randOnline;

const upload = document.getElementById('upload');
const uploadArea = document.getElementById('uploadArea');
const analyzeBtn = document.getElementById('analyzeBtn');

// Drag & drop
['dragenter','dragover'].forEach(ev => uploadArea.addEventListener(ev, e => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
}));
['dragleave','drop'].forEach(ev => uploadArea.addEventListener(ev, e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
}));

// Handle drop & click
uploadArea.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
uploadArea.addEventListener('click', () => upload.click());
upload.addEventListener('change', () => handleFile(upload.files[0]));

function handleFile(file) {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = e => {
      uploadArea.querySelector('img')?.remove();
      const img = document.createElement('img');
      img.src = e.target.result;
      uploadArea.insertBefore(img, uploadArea.firstChild.nextSibling);
      analyzeBtn.disabled = false;
      analyzeBtn.classList.add('enabled');
    };
    reader.readAsDataURL(file);
  }
}

// Fake analysis
analyzeBtn.addEventListener('click', () => {
  uploadArea.querySelector('.overlay')?.remove();
  const loader = document.createElement('div');
  loader.className = 'overlay';
  loader.innerHTML = '<div class="loader"></div><div class="loading-text">Анализ...</div>';
  uploadArea.appendChild(loader);
  setTimeout(() => {
    loader.remove();
    const chance = Math.floor(Math.random() * 100);
    const spins = Math.floor(Math.random() * 200);
    const result = document.createElement('div');
    result.className = 'overlay';
    result.innerHTML = `
      <div class="chance">Шанс ${chance}%</div>
      <div class="spins">Через ${spins} вращений</div>
    `;
    uploadArea.appendChild(result);
  }, 2000);
});

// Timer update (every 3h reset at 4:00 MSK)
function updateTimer() {
  const nowUtc = Date.now();
  const interval = 3 * 3600 * 1000;
  const mskOffset = 3 * 3600 * 1000;
  const mskNowTs = nowUtc + mskOffset;
  const mskNow = new Date(mskNowTs);
  const y = mskNow.getUTCFullYear();
  const mo = mskNow.getUTCMonth();
  const d = mskNow.getUTCDate();
  const baseUtcHour = 4 - 3;
  let baseTs = Date.UTC(y, mo, d, baseUtcHour, 0, 0);
  let elapsed = nowUtc - baseTs;
  let nextTs;
  if (elapsed < 0) nextTs = baseTs;
  else nextTs = baseTs + (Math.floor(elapsed / interval) + 1) * interval;
  let diff = nextTs - nowUtc;
  if (diff < 0) diff += 24*3600*1000;
  const hrs = Math.floor(diff/3600000);
  const mins = Math.floor((diff%3600000)/60000);
  const secs = Math.floor((diff%60000)/1000);
  const pad = n => String(n).padStart(2,'0');
  document.getElementById('timer').textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
updateTimer();
setInterval(updateTimer, 1000);