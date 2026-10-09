/**
 * kepala-lingkungan.js
 * Kelurahan Paslaten Satu
 *
 * Menampilkan data Kepala Lingkungan dan Wakil Kepala Lingkungan untuk 7 lingkungan.
 * Data dapat diedit pada variabel KEPALA_LINGKUNGAN_DATA di bawah ini, atau
 * pada file data/kepala-lingkungan.json.
 */

(function () {
  'use strict';

  /* =====================================================
     1. DATA UTAMA
     Untuk mengganti nama atau menambah URL foto, edit array ini.
     Format foto: path relatif (misal "../assets/images/pejabat/nama.jpg")
     ===================================================== */
  const KEPALA_LINGKUNGAN_DATA = [
    {
      lingkungan: 1,
      kepala: { nama: 'Aldo Mumu', foto: '' },
      wakil: { nama: 'Jefry Montolalu', foto: '' }
    },
    {
      lingkungan: 2,
      kepala: { nama: 'Rocky Frengky Frits Lempas', foto: '' },
      wakil: { nama: 'Adri Langingi', foto: '' }
    },
    {
      lingkungan: 3,
      kepala: { nama: 'Sonny Rumagit', foto: '' },
      wakil: { nama: 'Alin Supit', foto: '' }
    },
    {
      lingkungan: 4,
      kepala: { nama: 'John Willem Poluan', foto: '' },
      wakil: { nama: 'Anita Diana Sangki', foto: '' }
    },
    {
      lingkungan: 5,
      kepala: { nama: 'Ferry Rarobong', foto: '' },
      wakil: { nama: 'Rosnita Gosal', foto: '' }
    },
    {
      lingkungan: 6,
      kepala: { nama: 'Noldy Youdy Posumah', foto: '' },
      wakil: { nama: 'Djony Johanes Ngantung', foto: '' }
    },
    {
      lingkungan: 7,
      kepala: { nama: 'Aneke Tulandi', foto: '' },
      wakil: { nama: 'Jeane Rapar', foto: '' }
    }
  ];

  /* =====================================================
     2. HELPER FUNCTIONS
     ===================================================== */

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function formatIndex(num) {
    return num < 10 ? '0' + num : String(num);
  }

  /* =====================================================
     3. RENDER PERSON ROW
     ===================================================== */

  function renderPersonRow(person, roleLabel, roleType) {
    var isKepala = (roleType === 'kepala');
    var avatarHtml = '';

    if (person.foto && person.foto.trim() !== '') {
      avatarHtml = '<img class="kl-avatar-img" src="' + esc(person.foto) + '" alt="Foto ' + esc(person.nama) + '" loading="lazy">';
    } else {
      var avatarClass = isKepala ? 'kl-avatar kl-avatar--kepala' : 'kl-avatar kl-avatar--wakil';
      var defaultIcon = '<svg fill="currentColor" viewBox="0 0 24 24" style="width: 55%; height: 55%;"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
      avatarHtml = '<div class="' + avatarClass + '" aria-hidden="true" style="display: flex; align-items: center; justify-content: center;">' + defaultIcon + '</div>';
    }

    var rowClass = isKepala ? 'kl-person kl-person--kepala' : 'kl-person kl-person--wakil';
    var labelClass = isKepala ? 'kl-role-label kl-role-label--kepala' : 'kl-role-label kl-role-label--wakil';
    var nameClass = isKepala ? 'kl-person-name kl-person-name--kepala' : 'kl-person-name kl-person-name--wakil';

    return '<div class="' + rowClass + '">' +
      '<div class="kl-avatar-wrap">' + avatarHtml + '</div>' +
      '<div class="kl-person-info">' +
        '<span class="' + labelClass + '">' + esc(roleLabel) + '</span>' +
        '<div class="' + nameClass + '">' + esc(person.nama) + '</div>' +
      '</div>' +
    '</div>';
  }

  /* =====================================================
     4. RENDER LINGKUNGAN CARD
     ===================================================== */

  function renderCard(item) {
    var indexText = formatIndex(item.lingkungan);

    var kepalaHtml = renderPersonRow(item.kepala, 'Kepala Lingkungan (Data 2026)', 'kepala');
    var wakilHtml = renderPersonRow(item.wakil, 'Wakil Kepala Lingkungan (Data 2026)', 'wakil');

    return '<article class="kl-card" role="listitem" aria-label="Lingkungan ' + esc(item.lingkungan) + '">' +
      '<div class="kl-card-header">' +
        '<div class="kl-badge-wrap">' +
          '<span class="kl-badge-dot" aria-hidden="true"></span>' +
          '<h3 class="kl-card-title">Lingkungan ' + esc(item.lingkungan) + '</h3>' +
        '</div>' +
        '<span class="kl-card-watermark" aria-hidden="true">' + esc(indexText) + '</span>' +
      '</div>' +
      '<div class="kl-people-list">' +
        kepalaHtml +
        '<div class="kl-divider" aria-hidden="true"></div>' +
        wakilHtml +
      '</div>' +
    '</article>';
  }

  /* =====================================================
     5. INIT & RENDER
     ===================================================== */

  function renderAll(dataList) {
    var container = document.getElementById('kl-grid');
    if (!container) return;

    var html = dataList.map(function (item) {
      return renderCard(item);
    }).join('');

    container.innerHTML = html;

    // Optional subtle scroll reveal if supported and not prefers-reduced-motion
    if (window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var cards = container.querySelectorAll('.kl-card');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('kl-card--visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      cards.forEach(function (card) {
        observer.observe(card);
      });
    }
  }

  function init() {
    // Coba fetch dari file json bila tersedia di environment HTTP,
    // fallback otomatis ke data synchronous (misal file://).
    if (window.location.protocol === 'file:') {
      renderAll(KEPALA_LINGKUNGAN_DATA);
    } else {
      fetch('../data/kepala-lingkungan.json')
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(function (data) {
          renderAll(data);
        })
        .catch(function () {
          renderAll(KEPALA_LINGKUNGAN_DATA);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
