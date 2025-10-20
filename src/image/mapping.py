from utils.helpers import clamp
from utils.scales import get_scale

def map_to_notes(pixels, scale_name="major_pentatonic"):
    """(t,h,s,l) piksel verilerini gam notalarına dönüştürür."""
    scale = get_scale(scale_name)
    notes = []
    for t, h, s, l in pixels:
        idx = clamp(int(l * len(scale)), 0, len(scale) - 1)
        midi = scale[idx]
        vel = clamp(0.1 + s * 0.9, 0.05, 1.0)
        hue_hz = 300 + h * 1400
        notes.append((t, midi, vel, hue_hz))
    return notes
