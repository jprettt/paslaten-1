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

Tidak menggunakan framework, database, atau backend. Section peta 3D menggunakan Google Maps JavaScript API.
Website ini berjalan sepenuhnya sebagai **static website**.

## Peta 3D Interaktif

Section **Paslaten 1 dari Udara** berada di `pages/kontak.html`, pada section lokasi (`#lokasi`) sebelum footer.

1. Buat project Google Cloud, aktifkan billing dan **Maps JavaScript API**.
2. Buat API key untuk website. Batasi HTTP referrers ke domain website dan alamat server lokal yang digunakan, serta batasi API ke Maps JavaScript API.
3. Isi `apiKey` di `js/maps-config.js`. Key browser memang terlihat di browser; pembatasan domain dilakukan melalui Google Cloud.
4. Jalankan website melalui server HTTP lokal (misalnya Live Server dari IDE), bukan membuka file melalui `file://`.

Dokumentasi: https://developers.google.com/maps/documentation/javascript/get-api-key

SDK dimuat saat 20% area peta terlihat. Setelah peta siap dan masih terlihat, kamera terbang sekali selama 6000 ms dari range 18 km ke 3,2 km, tilt 15 ke 62 derajat, heading akhir 325 derajat. Fokus akhir memakai altitude 25 m relatif ke tanah. Marker pada `1.32778, 124.85722` ditambahkan setelah event `gmp-animationend`. Marker SVG dirender oleh Google sehingga fade/scale CSS pada elemen tidak digunakan.

Kontrol: Satelit/Peta, 3D, Pusatkan, zoom, utara, dan fullscreen jika didukung browser. Channel `alpha` diperlukan untuk mode `ROADMAP` pada Maps 3D; jika mode tersebut tidak tersedia, tombol Peta disembunyikan. Atribusi Google tetap terlihat. Detail terrain dan bangunan mengikuti cakupan citra Google; koordinat tidak mendefinisikan batas administratif kelurahan.

Tanpa key atau jika layanan gagal, section menampilkan pesan beserta tautan Google Maps. Animasi dilewati untuk preferensi reduced motion. Tinggi peta 600 px di desktop dan 480 px di mobile.

Validasi logika lokal (SDK mock): `node --test tests/paslaten-map.test.cjs`. Rendering satelit, framing akhir, dan akses layanan harus diuji lagi setelah key aktif.

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
