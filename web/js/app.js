const fileInput = document.getElementById("file");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const waveCanvas = document.getElementById("waveCanvas");
const waveCtx = waveCanvas.getContext("2d");
const imgEl = document.getElementById("img");
const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const saveBtn = document.getElementById("save");
const densityEl = document.getElementById("density");
const durationEl = document.getElementById("duration");
const scaleSel = document.getElementById("scale");
const moodLabel = document.getElementById("moodLabel");

let part = null;
let analyser, dataArray, recorder;
let isPlaying = false;
let waveColor = "#7c3aed";

// 🔊 Synth & Recorder
const synth = new Tone.PolySynth(Tone.Synth).toDestination();
synth.maxPolyphony = 8;
synth.set({
  oscillator: { type: "sine" },
  envelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.5 },
});
recorder = new Tone.Recorder();
synth.connect(recorder);

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function getAverageColor(img) {
  const tmp = document.createElement("canvas");
  const tctx = tmp.getContext("2d");
  tmp.width = img.width;
  tmp.height = img.height;
  tctx.drawImage(img, 0, 0);
  const data = tctx.getImageData(0, 0, img.width, img.height).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  const n = data.length / 4;
  return rgbToHsl(r / n, g / n, b / n);
}

// 🧠 Ruh hali tahmincisi
function guessMood(h, l) {
  if (l < 0.3) return { mood: "Hüzünlü", scale: "A minor", bpm: 70 };
  if (l > 0.7 && h > 0.3 && h < 0.7)
    return { mood: "Neşeli", scale: "C major pentatonic", bpm: 110 };
  if (h < 0.1 || h > 0.9)
    return { mood: "Tutkulu", scale: "G major", bpm: 95 };
  if (h > 0.45 && h < 0.6)
    return { mood: "Rahat", scale: "A minor pentatonic", bpm: 85 };
  return { mood: "Dingin", scale: "C major pentatonic", bpm: 90 };
}

function mapToScale(value01, scale) {
  const idx = clamp(Math.floor(value01 * scale.length), 0, scale.length - 1);
  return scale[idx];
}

function getScale(name) {
  switch (name) {
    case "C major pentatonic":
      return [60, 62, 64, 67, 69, 72];
    case "A minor pentatonic":
      return [57, 60, 62, 65, 67, 69];
    case "G major":
      return [55, 57, 59, 60, 62, 64, 67];
    case "A minor":
      return [57, 59, 60, 62, 64, 65, 67];
    default:
      return [60, 62, 64, 67, 69];
  }
}

function scheduleFromImage(img) {
  console.log("🎨 Görsel yüklendi:", img.width, img.height);
  const step = parseInt(densityEl.value);
  const totalSec = parseInt(durationEl.value);

  // 🧠 Fotoğraf analizi ve ruh hali
  const avg = getAverageColor(img);
  const mood = guessMood(avg.h, avg.l);
  moodLabel.textContent = `🧠 Ruh hali: ${mood.mood}`;
  scaleSel.value = mood.scale;
  Tone.Transport.bpm.value = mood.bpm;
  waveColor = `hsl(${avg.h * 360}, 80%, 60%)`;

  const sc = getScale(scaleSel.value);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  const w = img.width * ratio,
    h = img.height * ratio;
  const x0 = (canvas.width - w) / 2,
    y0 = (canvas.height - h) / 2;
  ctx.drawImage(img, x0, y0, w, h);

  const { data } = ctx.getImageData(x0, y0, w, h);
  const notes = [];

  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (Math.floor(y) * Math.floor(w) + Math.floor(x)) * 4;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      if (a < 10) continue;
      const { s, l } = rgbToHsl(r, g, b);
      const t = (y / h) * totalSec;
      const midi = mapToScale(l, sc);
      const vel = clamp(0.1 + s * 0.9, 0.05, 1);
      notes.push({ time: t, midi, vel });
    }
  }

  notes.sort((a, b) => a.time - b.time);
  if (part) part.dispose();

  const filtered = notes.filter((_, i) => i % 3 === 0);

  part = new Tone.Part((time, n) => {
    synth.triggerAttackRelease(
      Tone.Frequency(n.midi, "midi"),
      0.15 + n.vel * 0.3,
      time,
      n.vel
    );
  }, filtered).start(0);

  Tone.Transport.seconds = 0;

  analyser = new Tone.Analyser("waveform", 256);
  synth.connect(analyser);
  dataArray = new Float32Array(analyser.size);
  animateWave();
}

function animateWave() {
  if (!analyser) return;
  requestAnimationFrame(animateWave);
  const values = analyser.getValue();
  const len = values.length;
  const energy = values.reduce((a, v) => a + Math.abs(v), 0) / len;
  const amp = 80 + energy * 200;

  waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
  waveCtx.beginPath();

  const grad = waveCtx.createLinearGradient(0, 0, waveCanvas.width, 0);
  grad.addColorStop(0, waveColor);
  grad.addColorStop(1, "#8b5cf6");
  waveCtx.strokeStyle = grad;
  waveCtx.lineWidth = 2;

  const mid = waveCanvas.height / 2;
  for (let i = 0; i < len; i++) {
    const x = (i / len) * waveCanvas.width;
    const y = mid + values[i] * amp;
    if (i === 0) waveCtx.moveTo(x, y);
    else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();
}

fileInput.addEventListener("change", (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  imgEl.onload = () => {
    scheduleFromImage(imgEl);
    playBtn.disabled = false;
    stopBtn.disabled = false;
    saveBtn.disabled = false;
  };
  imgEl.src = url;
});

playBtn.addEventListener("click", async () => {
  await Tone.start();
  if (!isPlaying) {
    recorder.start();
    Tone.Transport.start("+0.02");
    console.log("🔊 Oynatma başladı, kayıt aktif");
    isPlaying = true;
  }
});

stopBtn.addEventListener("click", async () => {
  Tone.Transport.stop();
  console.log("⏹ Durduruldu");
  isPlaying = false;
});

saveBtn.addEventListener("click", async () => {
  const recording = await recorder.stop();
  const url = URL.createObjectURL(recording);
  const a = document.createElement("a");
  a.href = url;
  a.download = "memory_composer_output.wav";
  a.click();
  console.log("💾 Kayıt indirildi");
});

[densityEl, durationEl].forEach((slider) => {
  slider.addEventListener("input", () => {
    if (imgEl.src) scheduleFromImage(imgEl);
  });
});
