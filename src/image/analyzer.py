import cv2
import numpy as np

def extract_pixels(img_path, step=12, duration=16.0):
    """Görseli okur, HSL analizine göre (t, hue, sat, light) döndürür."""
    img = cv2.imread(img_path, cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(f"Görsel bulunamadı: {img_path}")

    h, w = img.shape[:2]
    scale = 512 / max(h, w)
    img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
    h, w = img.shape[:2]

    hls = cv2.cvtColor(img, cv2.COLOR_BGR2HLS)
    H, L, S = cv2.split(hls)

    data = []
    for y in range(0, h, step):
        t = (y / max(1, h - 1)) * duration
        for x in range(0, w, step):
            l = L[y, x] / 255.0
            s = S[y, x] / 255.0
            h_ = H[y, x] / 180.0
            data.append((t, h_, s, l))
    return data
