import numpy as np, wave
from utils.scales import note_to_freq

SR = 44100

def render_audio(notes, out_path="examples/output.wav"):
    """Nota listesinden WAV dosyası üretir."""
    if not notes:
        raise ValueError("Nota listesi boş!")

    duration = max(t for t, *_ in notes) + 2.0
    timeline = np.zeros(int(duration * SR), dtype=np.float32)

    for (t, midi, vel, _) in notes:
        f = note_to_freq(midi)
        start = int(t * SR)
        dur = int((0.12 + vel * 0.3) * SR)
        env = np.linspace(0, 1, int(0.02 * SR))
        sustain = np.ones(max(dur - len(env) * 2, 0))
        env_full = np.concatenate([env, sustain, env[::-1]]) if sustain.size else np.concatenate([env, env[::-1]])
        tone = np.sin(2 * np.pi * f * np.arange(env_full.size) / SR) * vel * 0.5
        i1 = min(start + tone.size, timeline.size)
        timeline[start:i1] += tone[:i1 - start]

    mx = np.max(np.abs(timeline)) or 1.0
    audio = np.int16(timeline / mx * 32767)

    with wave.open(out_path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(audio.tobytes())
