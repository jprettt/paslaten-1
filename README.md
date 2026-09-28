# Website Profil Kelurahan Paslaten Satu

**KKT 149 UNSRAT – Posko Paslaten 1, Kota Tomohon**

---

## Tujuan Project

Website ini dibuat sebagai media informasi dan profil digital Kelurahan Paslaten Satu,
Kecamatan Tomohon Timur, Kota Tomohon, Sulawesi Utara.

Website ini merupakan bagian dari program Kuliah Kerja Terpadu (KKT) 149 UNSRAT
yang berlokasi di Posko Paslaten 1.

---

## Teknologi

- HTML5
- CSS3
- Vanilla JavaScript

Tidak menggunakan framework, library, database, atau backend.
Website ini berjalan sepenuhnya sebagai **static website**.

---

## Struktur Folder

```
paslaten-1/
│
├── index.html              → Halaman beranda
│
├── pages/
│   ├── tentang.html        → Halaman tentang kelurahan
│   ├── sejarah.html        → Halaman sejarah kelurahan
│   ├── galeri.html         → Halaman galeri foto & dokumentasi
│   └── kontak.html         → Halaman kontak & lokasi
│
├── css/
│   └── style.css           → Stylesheet utama
│
├── js/
│   └── main.js             → JavaScript global
│
├── data/
│   └── kelurahan.json      → Data kelurahan (placeholder)
│
├── assets/
│   ├── images/
│   │   ├── hero/           → Gambar untuk section hero
│   │   ├── tentang/        → Gambar untuk halaman tentang
│   │   ├── pemerintahan/   → Foto perangkat pemerintahan
│   │   └── galeri/         → Foto dokumentasi kegiatan
│   │
│   ├── icons/              → Icon dan logo (SVG/PNG)
│   └── videos/             → Video dokumentasi (jika ada)
│
└── README.md               → Dokumentasi project ini
```

---

## Fungsi Setiap Folder

| Folder/File         | Fungsi                                                              |
|---------------------|---------------------------------------------------------------------|
| `index.html`        | Halaman utama / beranda website                                     |
| `pages/`            | Berisi seluruh halaman website selain beranda                       |
| `css/`              | Berisi stylesheet (style.css) untuk tampilan website                |
| `js/`               | Berisi JavaScript global (main.js) untuk interaksi website          |
| `data/`             | Berisi file JSON untuk data kelurahan yang dapat diperbarui         |
| `assets/images/`    | Berisi gambar yang digunakan di seluruh halaman website             |
| `assets/icons/`     | Berisi icon, logo, dan aset grafis kecil                            |
| `assets/videos/`    | Berisi video dokumentasi (opsional)                                 |

---

## Halaman Website

| Halaman             | URL                  | Keterangan                              |
|---------------------|----------------------|-----------------------------------------|
| Beranda             | `index.html`         | Halaman utama dengan informasi ringkas  |
| Tentang             | `pages/tentang.html` | Profil, kondisi wilayah, pemerintahan   |
| Sejarah             | `pages/sejarah.html` | Sejarah Kelurahan Paslaten Satu         |
| Galeri              | `pages/galeri.html`  | Foto dan dokumentasi kegiatan           |
| Kontak              | `pages/kontak.html`  | Informasi kontak dan lokasi             |

---

## Status Project

> **STATUS: TAHAP 1 — SCAFFOLD**

Tahap ini hanya mencakup pembuatan struktur project dasar.

- [x] Struktur folder
- [x] File HTML dasar (5 halaman)
- [x] File CSS dasar (reset + struktur komentar)
- [x] File JavaScript dasar (struktur + TODO)
- [x] File JSON placeholder
- [ ] Desain & styling (tahap berikutnya)
- [ ] Konten & data kelurahan (tahap berikutnya)
- [ ] Fitur interaktif (tahap berikutnya)

---

*Project ini dikembangkan secara bertahap.*
