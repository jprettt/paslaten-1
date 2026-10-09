/**
 * Data Tempat Penting — Kelurahan Paslaten 1
 *
 * Untuk menambah/mengubah tempat, cukup edit array TEMPAT_DATA di bawah.
 * Field "foto" cukup nama file (folder dasar diatur di TEMPAT_IMG_BASE).
 * Field foto, alamat, dan deskripsi bersifat opsional — kosongkan saja
 * jika belum tersedia.
 */

const TEMPAT_IMG_BASE = "../assets/images/tempat/";

const TEMPAT_KATEGORI = [
    "Ibadah",
    "Pemerintahan",
    "Pendidikan & Kesehatan",
    "Ekonomi & Kuliner",
    "Landmark & Wisata"
];

const TEMPAT_DATA = [
    // ── Ibadah ──────────────────────────────────────────────
    {
        nama: "Gereja GMIM Maranatha Paslaten",
        kategori: "Ibadah",
        foto: "maranatha.png",
        maps: "https://maps.app.goo.gl/U9vCzed5nggg6EWR9"
    },
    {
        nama: "Gereja GMIM Sion Tomohon",
        kategori: "Ibadah",
        foto: "sion.png",
        maps: "https://maps.app.goo.gl/6wZN2yBnHFNaeJRn6"
    },
    {
        nama: "Gereja GMIM Wilken Paslaten",
        kategori: "Ibadah",
        foto: "gmim.jpeg",
        maps: "https://maps.app.goo.gl/vex1rmHMrdZ9PHuJ6"
    },
    {
        nama: "Gereja Katolik Paroki Trinitas Mahakudus",
        kategori: "Ibadah",
        foto: "gereja-katolik.jpeg",
        maps: "https://maps.app.goo.gl/6kCWuU1NB3r22EK3A"
    },

    // ── Pemerintahan ────────────────────────────────────────
    {
        nama: "Kantor Kelurahan Paslaten Satu",
        kategori: "Pemerintahan",
        foto: "kantor lurah.jpeg",
        maps: "https://maps.app.goo.gl/xVgriAcPcfdskUNU8"
    },
    {
        nama: "Kantor Kecamatan Tomohon Timur",
        kategori: "Pemerintahan",
        foto: "kantor camat.png",
        maps: "https://maps.app.goo.gl/XJeRbzktxx2kY9GSA"
    },
    {
        nama: "Dinas Pendidikan & Kebudayaan Daerah Kota Tomohon",
        kategori: "Pemerintahan",
        foto: "dinas pendidikan.png",
        maps: "https://maps.app.goo.gl/jnZ692PnUDQZrjQb7"
    },

    // ── Pendidikan & Kesehatan ──────────────────────────────
    {
        nama: "SMP-SMA Lentera Harapan Tomohon",
        kategori: "Pendidikan & Kesehatan",
        foto: "lentera harapan.jpeg",
        maps: "https://maps.app.goo.gl/7RmMv1fx5ZFRL57w9"
    },
    {
        nama: "Puskesmas Pembantu Paslaten Satu",
        kategori: "Pendidikan & Kesehatan",
        foto: "puskesmas pembantu.jpeg",
        maps: "https://maps.app.goo.gl/M2D3mqRqxas2WowE8"
    },
    {
        nama: "Rumah Sakit GMIM Bethesda",
        kategori: "Pendidikan & Kesehatan",
        foto: "rumah sakit bethesda.png",
        maps: "https://maps.app.goo.gl/646cqmWrjmh7r7uE9"
    },

    // ── Ekonomi & Kuliner ───────────────────────────────────
    {
        nama: "Pasar Beriman Tomohon",
        kategori: "Ekonomi & Kuliner",
        foto: "pasar-beriman.jpeg",
        maps: "https://maps.app.goo.gl/DUgJAGF78cpSBXJd6"
    },
    {
        nama: "Terminal Beriman Tomohon",
        kategori: "Ekonomi & Kuliner",
        foto: "terminal.jpeg",
        maps: "https://maps.app.goo.gl/Vo2is1jmB7zSh2aM9"
    },
    {
        nama: "Jordan Bakery",
        kategori: "Ekonomi & Kuliner",
        foto: "jordan-bakery.jpeg",
        maps: "https://maps.app.goo.gl/UVgGTZqEJ8dGLvhB6"
    },
    {
        nama: "PT. Timur Jaya Dayatama",
        kategori: "Ekonomi & Kuliner",
        foto: "pt-timur.jpeg",
        maps: "https://maps.app.goo.gl/ejkrWu5z975CA3aL6"
    },
    {
        nama: "Pusat Kuliner",
        kategori: "Ekonomi & Kuliner",
        foto: "pusat kuliner.png",
        maps: "https://maps.app.goo.gl/tanmaAQ5JYAn9QYY8"
    },

    // ── Landmark & Wisata ──────────────────────────────────
    {
        nama: "Monumen Pandita N.P. Wilken",
        kategori: "Landmark & Wisata",
        foto: "monumen-wilken.jpeg",
        maps: "https://maps.app.goo.gl/gXpXiMtiATpjZ8pv7"
    },
    {
        nama: "Menara Alfa Omega",
        kategori: "Landmark & Wisata",
        foto: "alfa omega.png",
        maps: "https://maps.app.goo.gl/tYqKJpTJNgrJXcxy5"
    },
    {
        nama: "Taman Mimpi",
        kategori: "Landmark & Wisata",
        maps: "https://maps.app.goo.gl/qPdMYcbP3pxXEhPH6"
    }
];
