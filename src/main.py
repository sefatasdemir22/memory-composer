from image.analyzer import extract_pixels
from image.mapping import map_to_notes
from audio.generator import render_audio
import argparse, os

def main():
    parser = argparse.ArgumentParser(description="Fotoğraftan müzik üretir.")
    parser.add_argument("image", help="Girdi fotoğraf yolu")
    parser.add_argument("--output", default="examples/output.wav")
    parser.add_argument("--scale", default="major_pentatonic")
    parser.add_argument("--step", type=int, default=12)
    parser.add_argument("--duration", type=float, default=16.0)
    args = parser.parse_args()

    if not os.path.exists(args.image):
        raise SystemExit(f"Görsel bulunamadı: {args.image}")

    print("[1] Piksel analizi yapılıyor…")
    pixels = extract_pixels(args.image, step=args.step, duration=args.duration)

    print("[2] Notalara dönüştürülüyor…")
    notes = map_to_notes(pixels, scale_name=args.scale)

    print(f"[3] {len(notes)} nota → {args.output}")
    render_audio(notes, out_path=args.output)
    print("[✓] Tamamlandı.")

if __name__ == "__main__":
    main()
