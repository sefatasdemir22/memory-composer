# 🎵 Memory Composer — Fotoğraflardan Müzik Üreten Sistem

> “Bir fotoğraf yükle, o fotoğrafın sesini duy.”
> Görsellerin renk tonlarını analiz ederek onlardan müzik üreten interaktif bir web uygulaması.

---

## 🌐 Canlı Demo

🔗 [https://sefatasdemir22.github.io/memory-composer/index.html](https://sefatasdemir22.github.io/memory-composer/index.html)

---

## 🧠 Fikir

Bir fotoğrafın renk tonlarını ve parlaklık değerlerini alır:

* **Koyu tonlar → düşük frekans**,
* **Açık tonlar → yüksek frekans**
  olarak eşlenir.
  Sonuç: her fotoğrafın kendine özgü bir melodisi oluşur. 🎶

---

## 🧪 Teknolojiler

| Katman        | Kullanılan Araçlar                   |
| ------------- | ------------------------------------ |
| Frontend      | HTML5, CSS3, JavaScript (ES6)        |
| Ses Motoru    | [Tone.js](https://tonejs.github.io/) |
| Görsel İşleme | Canvas API                           |
| Yayın         | GitHub Pages                         |

---

## ✨ Özellikler

* 📸 Fotoğraf yükle, anında melodisini dinle
* 🎨 Renk tonuna göre ses rengi ve frekans eşleme
* 🧠 **AI Mood Analyzer** → fotoğrafın ruh haline göre otomatik gam & tempo seçimi
* 🌈 Renk tepki veren, gradient geçişli dalga animasyonu
* 💾 Kaydet butonuyla `.wav` olarak indir
* ⚡ Canlı slider: örnekleme yoğunluğu & süre ayarları

---

## 🚀 Kurulum (Yerel çalıştırmak için)

1. Projeyi klonla:

   ```bash
   git clone https://github.com/sefatasdemir22/memory-composer.git
   ```
2. Klasöre gir:

   ```bash
   cd memory-composer
   ```
3. Tarayıcıda test et:

   ```bash
   python -m http.server 8000
   ```
4. Tarayıcıdan şu adrese git:
   🔗 [http://localhost:8000](http://localhost:8000)

---

## 🗂️ Klasör Yapısı

```
memory-composer/
├── index.html
├── assets/
│   └── style.css
└── js/
    └── app.js
```

---

## 🎨 Ekran Görüntüsü

<p align="center">
  <img src="https://user-images.githubusercontent.com/00000000/placeholder.png" width="700" alt="Memory Composer Preview" />
</p>

*(İstersen buraya kendi ekran görüntünü yükleyip linkini değiştirebilirsin.)*

---

## 📜 Lisans

MIT License © 2025 [Sefa Taşdemir](https://github.com/sefatasdemir22)

---

## 💬 İlham

Bu proje, görsel veriyi duyusal bir forma dönüştürme fikrinden doğmuştur.
Her fotoğraf bir hikaye anlatır — Memory Composer bu hikayeyi **müziğe çevirir.**
