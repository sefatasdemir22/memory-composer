# Gam tanımları ve nota → frekans dönüştürme
SCALES = {
    "major_pentatonic": [0, 2, 4, 7, 9],
    "minor_pentatonic": [0, 3, 5, 7, 10],
    "dorian": [0, 2, 3, 5, 7, 9, 10],
    "phrygian": [0, 1, 3, 5, 7, 8, 10],
    "major": [0, 2, 4, 5, 7, 9, 11],
    "minor": [0, 2, 3, 5, 7, 8, 10],
}

def get_scale(name="major_pentatonic", root=60, octaves=(3, 4, 5)):
    """Gam tanımını MIDI nota dizisine dönüştürür."""
    intervals = SCALES.get(name, SCALES["major_pentatonic"])
    notes = []
    for octv in octaves:
        for deg in intervals:
            notes.append(root + deg + 12 * octv)
    return notes

def note_to_freq(midi_note: int):
    """MIDI nota -> frekans (Hz)"""
    return 440.0 * (2 ** ((midi_note - 69) / 12))
