const fs = require('fs');
const path = require('path');

const kontakHtml = fs.readFileSync(path.join(__dirname, '..', 'pages', 'kontak.html'), 'utf8');

// Extract style block from kontak.html
const styleMatch = kontakHtml.match(/<style>([\s\S]*?)<\/style>/);
const styleContent = styleMatch ? styleMatch[1] : '';

const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Perbandingan Warna Card Alamat vs Sisi Belakang Wakil Pala</title>
  <link href="../css/style.css" rel="stylesheet" />
  <style>
    ${styleContent}
    body {
      background: #0d1f2a;
      padding: 30px 20px;
    }
    .preview-container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .preview-heading {
      color: #ffffff;
      font-family: var(--font-heading);
      margin: 30px 0 15px;
      font-size: 1.25rem;
    }
  </style>
</head>
<body class="contact-page modern-inner-page">
  <div class="preview-container">
    <h2 class="preview-heading">Referensi Card "Alamat" Asli:</h2>
    <div class="contact-modern-grid" style="margin-bottom: 40px;">
      <article class="contact-modern-card contact-modern-card--featured">
        <span class="contact-card-label"> Alamat </span>
        <h3>Jl. Kalooran</h3>
        <p>
          Kelurahan Paslaten 1<br />
          Kecamatan Tomohon Timur<br />
          Kota Tomohon, Sulawesi Utara 95446
        </p>
        <div class="contact-card-mark">01</div>
      </article>
    </div>

    <h2 class="preview-heading">Pala Setiap Lingkungan (Card 1 & 2 Dibalik ke Wakil Pala [Hijau Tua], Card 3 Tetap Sisi Depan Pala [Putih]):</h2>
    <div class="pala-contact-grid" id="pala-contact-grid"></div>
  </div>

  <script src="../js/kontak-pala.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Tunggu render
      setTimeout(() => {
        const cards = document.querySelectorAll('.pala-flip-card');
        if (cards.length >= 2) {
          cards[0].classList.add('is-flipped');
          cards[1].classList.add('is-flipped');
        }
      }, 100);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'preview_comparison.html'), html, 'utf8');
console.log('preview_comparison.html created');
