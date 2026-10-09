/**
 * kontak-pala.js
 * Kelurahan Paslaten Satu
 *
 * Menampilkan data Kontak Pala & Wakil Pala untuk 7 lingkungan dengan fitur Flip Card 3D.
 * Data tersimpan di data/kontak-pala.json dan memiliki data fallback bawaan di bawah ini.
 */

(function () {
  'use strict';

  /* =====================================================
     1. DATA UTAMA (Fallback Synchronous)
     ===================================================== */
  const KONTAK_PALA_DATA = [
    {
      lingkungan: 1,
      pala: { nama: 'Aldo Mumu', telepon: '' },
      wakil: { nama: 'Jefry Montolalu', telepon: '082192745729' }
    },
    {
      lingkungan: 2,
      pala: { nama: 'Rocky Frengky Frits Lempas', telepon: '085298499171' },
      wakil: { nama: 'Adri Langingi', telepon: '' }
    },
    {
      lingkungan: 3,
      pala: { nama: 'Sonny Rumagit', telepon: '083149474680' },
      wakil: { nama: 'Alin Supit', telepon: '089633318880' }
    },
    {
      lingkungan: 4,
      pala: { nama: 'John Willem Poluan', telepon: '' },
      wakil: { nama: 'Anita Diana Sangki', telepon: '085343517818' }
    },
    {
      lingkungan: 5,
      pala: { nama: 'Ferry Rarobong', telepon: '' },
      wakil: { nama: 'Rosmita Gosal', telepon: '' }
    },
    {
      lingkungan: 6,
      pala: { nama: 'Noldy Youdy Posumah', telepon: '082188137898' },
      wakil: { nama: 'Djony Johanes Ngantung', telepon: '081220585405' }
    },
    {
      lingkungan: 7,
      pala: { nama: 'Aneke Tulandi', telepon: '0895355679080' },
      wakil: { nama: 'Jeane Rapar', telepon: '085396272937' }
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

  function formatNumber(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function formatWaUrl(phone) {
    if (!phone) return '';
    var clean = String(phone).replace(/[^0-9]/g, '');
    if (clean.indexOf('0') === 0) {
      clean = '62' + clean.slice(1);
    }
    return 'https://wa.me/' + clean;
  }

  /* =====================================================
     3. RENDER CARD SIDES (FRONT = PALA, BACK = WAKIL)
     ===================================================== */

  function renderCardSide(item, isWakil) {
    var person = isWakil ? item.wakil : item.pala;
    var sideClass = isWakil ? 'pala-card-back' : 'pala-card-front';
    var labelTop = isWakil ? 'Wakil Kepala' : 'Kepala';
    var labelNama = isWakil ? 'Nama Wakil Kepala' : 'Nama Kepala';
    var hintText = isWakil ? 'Ketuk untuk lihat Kepala' : 'Ketuk untuk lihat Wakil';
    var numText = formatNumber(item.lingkungan);

    // Render nama
    var namaHtml = '';
    if (person && person.nama && person.nama.trim() !== '') {
      namaHtml = '<span class="pala-detail-value">' + esc(person.nama) + '</span>';
    } else {
      namaHtml = '<span class="pala-detail-value pala-detail-value--empty">[Akan dilengkapi]</span>';
    }

    // Render telepon
    var telHtml = '';
    if (person && person.telepon && person.telepon.trim() !== '') {
      var telClean = person.telepon.replace(/[^0-9+]/g, '');
      var waUrl = formatWaUrl(person.telepon);
      telHtml = '<div class="pala-phone-row">' +
        '<a class="pala-detail-value pala-phone-link" href="tel:' + esc(telClean) + '" title="Hubungi via telepon">' + esc(person.telepon) + '</a>' +
        '<a class="pala-wa-btn" href="' + esc(waUrl) + '" target="_blank" rel="noopener noreferrer" title="Chat WhatsApp ' + esc(person.nama) + '" aria-label="Chat WhatsApp ' + esc(person.nama) + '">' +
          '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
            '<path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.5c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>' +
          '</svg>' +
        '</a>' +
      '</div>';
    } else {
      telHtml = '<span class="pala-detail-value pala-detail-value--empty">[Akan dilengkapi]</span>';
    }

    return '<article class="pala-contact-card ' + sideClass + '">' +
      '<div class="pala-card-top">' +
        '<span class="pala-card-label">' + esc(labelTop) + '</span>' +
        '<span class="pala-card-number">' + esc(numText) + '</span>' +
      '</div>' +
      '<h3>Lingkungan ' + esc(item.lingkungan) + '</h3>' +
      '<div class="pala-card-details">' +
        '<div class="pala-detail">' +
          '<span class="pala-detail-icon" aria-hidden="true">' +
            '<svg fill="none" viewBox="0 0 24 24">' +
              '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"></circle>' +
              '<path d="M4.5 20c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" stroke="currentColor" stroke-linecap="round" stroke-width="1.8"></path>' +
            '</svg>' +
          '</span>' +
          '<span class="pala-detail-content">' +
            '<span class="pala-detail-label">' + esc(labelNama) + '</span>' +
            namaHtml +
          '</span>' +
        '</div>' +
        '<div class="pala-detail">' +
          '<span class="pala-detail-icon" aria-hidden="true">' +
            '<svg fill="none" viewBox="0 0 24 24">' +
              '<path d="M6.6 2.8h3l1.5 4.4-2.1 1.5a15.1 15.1 0 006.3 6.3l1.5-2.1 4.4 1.5v3A2.6 2.6 0 0118.6 20C10.5 19.6 4.4 13.5 4 5.4A2.6 2.6 0 016.6 2.8z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"></path>' +
            '</svg>' +
          '</span>' +
          '<span class="pala-detail-content">' +
            '<span class="pala-detail-label">Telepon / WhatsApp</span>' +
            telHtml +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="pala-flip-hint" aria-hidden="true">' +
        '<svg class="pala-flip-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
          '<path d="M4 12v-2a4 4 0 0 1 4-4h11M16 3l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M20 12v2a4 4 0 0 1-4 4H5M8 21l-3-3 3-3" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '<span>' + esc(hintText) + '</span>' +
      '</div>' +
      '<span aria-hidden="true" class="pala-card-watermark">' + esc(item.lingkungan) + '</span>' +
    '</article>';
  }

  function renderFlipCard(item) {
    var frontHtml = renderCardSide(item, false);
    var backHtml = renderCardSide(item, true);

    return '<div class="pala-card-wrapper">' +
      '<div class="pala-flip-card" role="button" tabindex="0" aria-pressed="false" aria-label="Lingkungan ' + esc(item.lingkungan) + ', tampilkan Wakil Kepala" data-lingkungan="' + esc(item.lingkungan) + '">' +
        '<div class="pala-card-inner">' +
          frontHtml +
          backHtml +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* =====================================================
     4. INTERAKSI FLIP CARD
     ===================================================== */

  function updateCardSideFocus(frontEl, backEl, isFlipped) {
    if (!frontEl || !backEl) return;

    var activeSide = isFlipped ? backEl : frontEl;
    var inactiveSide = isFlipped ? frontEl : backEl;

    activeSide.setAttribute('aria-hidden', 'false');
    inactiveSide.setAttribute('aria-hidden', 'true');

    if ('inert' in activeSide) {
      activeSide.inert = false;
      inactiveSide.inert = true;
    }

    // Fallback: kelola tabindex link di dalam sisi yang tidak aktif
    var activeLinks = activeSide.querySelectorAll('a, button');
    for (var i = 0; i < activeLinks.length; i++) {
      activeLinks[i].removeAttribute('tabindex');
    }

    var inactiveLinks = inactiveSide.querySelectorAll('a, button');
    for (var j = 0; j < inactiveLinks.length; j++) {
      inactiveLinks[j].setAttribute('tabindex', '-1');
    }
  }

  function toggleFlip(cardEl) {
    var isFlipped = cardEl.classList.toggle('is-flipped');
    var lingkungan = cardEl.getAttribute('data-lingkungan') || '';
    cardEl.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
    cardEl.setAttribute(
      'aria-label',
      isFlipped
        ? 'Lingkungan ' + lingkungan + ', tampilkan Kepala'
        : 'Lingkungan ' + lingkungan + ', tampilkan Wakil Kepala'
    );

    var frontEl = cardEl.querySelector('.pala-card-front');
    var backEl = cardEl.querySelector('.pala-card-back');

    updateCardSideFocus(frontEl, backEl, isFlipped);
  }

  function bindFlipEvents(container) {
    var cards = container.querySelectorAll('.pala-flip-card');
    cards.forEach(function (card) {
      // Inisialisasi status aksesibilitas awal
      var frontEl = card.querySelector('.pala-card-front');
      var backEl = card.querySelector('.pala-card-back');
      updateCardSideFocus(frontEl, backEl, false);

      // Klik pada card
      card.addEventListener('click', function (e) {
        // Jangan flip bila user klik link nomor telpon / tombol WA
        if (e.target.closest('a')) {
          return;
        }
        toggleFlip(card);
      });

      // Keyboard (Enter / Space)
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('a') || (document.activeElement && document.activeElement.tagName === 'A')) {
            return;
          }
          e.preventDefault();
          toggleFlip(card);
        }
      });
    });

    // Mencegah klik link telepon/WA memicu flip
    var links = container.querySelectorAll('.pala-phone-link, .pala-wa-btn');
    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }

  /* =====================================================
     5. INIT & RENDER
     ===================================================== */

  function renderAll(dataList) {
    var gridEl = document.querySelector('.pala-contact-grid');
    if (!gridEl) return;

    var html = dataList.map(function (item) {
      return renderFlipCard(item);
    }).join('');

    gridEl.innerHTML = html;
    bindFlipEvents(gridEl);
  }

  function init() {
    if (window.location.protocol === 'file:') {
      renderAll(KONTAK_PALA_DATA);
    } else {
      fetch('../data/kontak-pala.json')
        .then(function (res) {
          if (!res.ok) throw new Error('Network error');
          return res.json();
        })
        .then(function (data) {
          renderAll(data);
        })
        .catch(function () {
          renderAll(KONTAK_PALA_DATA);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
