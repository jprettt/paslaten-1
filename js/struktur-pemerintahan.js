/**
 * struktur-pemerintahan.js
 * Kelurahan Paslaten Satu
 *
 * Untuk mengedit data pegawai:
 *   Edit variabel STRUKTUR_DATA di bawah — bagian "nodes" dan "penandaTangan".
 *   Tidak perlu menyentuh HTML atau CSS.
 */

(function () {
  'use strict';

  /* =====================================================
     1. DATA — Edit bagian ini untuk memperbarui pegawai
     ===================================================== */

  const STRUKTUR_DATA = {
    tanggalTtd: '6 Oktober 2026',
    kotaTtd: 'Tomohon',
    penandaTangan: {
      jabatan: 'Lurah Paslaten Satu',
      nama: 'Konny Roky Worung, ST',
      nip: '197510072006041015'
    },
    nodes: [
      {
        id: 'lurah',
        jabatan: 'Lurah Paslaten Satu',
        labelTingkat: 'Tingkat 1 \u00b7 Pimpinan',
        kategori: 'administrator',
        eselon: 'IV/a',
        atasanId: null,
        B: 1, K: 1,
        pegawai: [
          { nama: 'Konny Roky Worung, ST', pendidikan: 'S1', status: 'PNS', golongan: 'III/d' }
        ]
      },
      {
        id: 'sekretaris',
        jabatan: 'Sekretaris Kelurahan',
        labelTingkat: 'Tingkat 2 \u00b7 Pengawas',
        kategori: 'pengawas',
        eselon: 'IV/b',
        atasanId: 'lurah',
        B: 1, K: 1,
        pegawai: [
          { nama: 'Reince R. Jacob, SIP, MAP', pendidikan: 'S2', status: 'PNS', golongan: 'III/d' }
        ]
      },
      {
        id: 'kasi-pembangunan',
        jabatan: 'Kasi Pembangunan dan Keuangan',
        labelTingkat: 'Tingkat 2 \u00b7 Pengawas',
        kategori: 'pengawas',
        eselon: 'IV/b',
        atasanId: 'lurah',
        B: 1, K: 1,
        pegawai: [
          { nama: 'Ria Pingkan Kalalo', pendidikan: 'SLTA', status: 'PNS', golongan: 'III/c' }
        ]
      },
      {
        id: 'kasi-pemerintahan',
        jabatan: 'Kasi Pemerintahan, Ketenteraman dan Ketertiban',
        labelTingkat: 'Tingkat 2 \u00b7 Pengawas',
        kategori: 'pengawas',
        eselon: 'IV/b',
        atasanId: 'lurah',
        B: 1, K: 1,
        pegawai: [
          { nama: 'Meidi Jefri Simboh, S.H', pendidikan: 'S1', status: 'PNS', golongan: 'III/c' }
        ]
      },
      {
        id: 'penelaah',
        jabatan: 'Penelaah Teknis Kebijakan',
        labelTingkat: 'Tingkat 3 \u00b7 Pelaksana',
        kategori: 'pelaksana',
        eselon: null,
        atasanId: 'sekretaris',
        B: 1, K: 1,
        pegawai: [
          { nama: 'Voike G. Walewangko, SE', pendidikan: 'S1', status: 'PNS', golongan: 'III/c' }
        ]
      },
      {
        id: 'operator-layanan',
        jabatan: 'Operator Layanan Operasional',
        labelTingkat: 'Non Struktural',
        kategori: 'nonstruktural',
        eselon: null,
        atasanId: 'kasi-pembangunan',
        B: 2, K: 2,
        pegawai: [
          { nama: 'Anggli Robert Kristofel Katiho', pendidikan: 'SLTA', status: 'PPPK_PW', golongan: null },
          { nama: 'Nansi Tiske Clara Taroreh', pendidikan: 'SLTA', status: 'PPPK_PW', golongan: null }
        ]
      },
      {
        id: 'pengadministrasi',
        jabatan: 'Pengadministrasi Perkantoran',
        labelTingkat: 'Tingkat 3 \u00b7 Pelaksana',
        kategori: 'pelaksana',
        eselon: null,
        atasanId: 'sekretaris',
        B: 1, K: 1,
        pegawai: [
          { nama: 'Alfien Kaparang', pendidikan: 'SLTA', status: 'PNS', golongan: 'II/d' }
        ]
      }
    ]
  };

  /* =====================================================
     2. HELPER — ESCAPE HTML
     ===================================================== */

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTingkatLabel(node) {
    if (!node.labelTingkat) return '';
    var parts = node.labelTingkat.split(/[·•]/);
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    return node.labelTingkat.replace(/^Tingkat\s*\d+\s*/i, '').trim();
  }

  /* =====================================================
     3. BUILD CARD HTML (Model Kartu Sejarah)
     ===================================================== */

  function buildCard(node) {
    var tingkat = getTingkatLabel(node);

    var pegawaiItems = node.pegawai.map(function (p) {
      return '<div class="sp-card-pegawai-item">' +
        '<p class="sp-card-nama">' + esc(p.nama) + '</p>' +
        (p.pendidikan ? '<span class="sp-card-tag">' + esc(p.pendidikan) + '</span>' : '') +
        '</div>';
    }).join('');

    return '<article class="sp-card" aria-label="' + esc(node.jabatan) + '">' +
      (tingkat ? '<span class="sp-card-index" aria-hidden="true">' + esc(tingkat) + '</span>' : '') +
      '<h3 class="sp-card-jabatan">' + esc(node.jabatan) + '</h3>' +
      '<div class="sp-card-pegawai-list">' + pegawaiItems + '</div>' +
      '</article>';
  }

  /* =====================================================
     4. BUILD TREE RECURSIVELY
     ===================================================== */

  function buildNodeGroup(node, allNodes, depth, isLast) {
    var children = allNodes.filter(function (n) { return n.atasanId === node.id; });

    var childrenHtml = '';
    if (children.length > 0) {
      var siblingItems = children.map(function (child, idx) {
        var isLastChild = (idx === children.length - 1);
        return buildNodeGroup(child, allNodes, depth + 1, isLastChild);
      }).join('');
      childrenHtml = '<div class="sp-children" data-depth="' + depth + '">' +
        '<div class="sp-siblings" role="group">' + siblingItems + '</div>' +
        '</div>';
    }

    var groupClasses = ['sp-node-group'];
    if (depth > 0) groupClasses.push('sp-node-group--child');
    if (isLast) groupClasses.push('sp-node-group--last');

    return '<div class="' + groupClasses.join(' ') + '" role="treeitem" data-depth="' + depth + '">' +
      '<div class="sp-node-wrap">' + buildCard(node) + '</div>' +
      childrenHtml +
      '</div>';
  }

  function buildTree(nodes) {
    var roots = nodes.filter(function (n) { return n.atasanId === null; });
    return roots.map(function (root, idx) {
      var isLast = (idx === roots.length - 1);
      return buildNodeGroup(root, nodes, 0, isLast);
    }).join('');
  }

  /* =====================================================
     5. BUILD RINGKASAN PEGAWAI
     ===================================================== */

  function buildSummary(nodes) {
    var allPegawai = [];
    nodes.forEach(function (n) {
      n.pegawai.forEach(function (p) { allPegawai.push(p); });
    });

    // Golongan
    var golMap = {};
    allPegawai.forEach(function (p) {
      if (p.golongan) golMap[p.golongan] = (golMap[p.golongan] || 0) + 1;
    });
    var golRows = Object.keys(golMap).sort().map(function (gol) {
      return '<div class="sp-summary-row"><span>Gol.\u00a0' + esc(gol) + '</span><strong class="sp-summary-val">' + golMap[gol] + '</strong></div>';
    }).join('');

    // Eselon
    var eselonMap = {};
    nodes.forEach(function (n) {
      if (n.eselon) eselonMap[n.eselon] = (eselonMap[n.eselon] || 0) + n.B;
    });
    var eselonRows = Object.keys(eselonMap).sort().map(function (es) {
      return '<div class="sp-summary-row"><span>Eselon\u00a0' + esc(es) + '</span><strong class="sp-summary-val">' + eselonMap[es] + '</strong></div>';
    }).join('');

    // Status
    var totalPNS = allPegawai.filter(function (p) { return p.status === 'PNS'; }).length;
    var totalPPPK = allPegawai.filter(function (p) { return p.status === 'PPPK_PW'; }).length;

    // B/K total
    var totalB = nodes.reduce(function (s, n) { return s + n.B; }, 0);
    var totalK = nodes.reduce(function (s, n) { return s + n.K; }, 0);

    return '<div class="sp-summary-group"><h4>Per Golongan</h4>' + golRows + '</div>' +
      '<div class="sp-summary-group"><h4>Per Eselon</h4>' + eselonRows + '</div>' +
      '<div class="sp-summary-group"><h4>Status Kepegawaian</h4>' +
      '<div class="sp-summary-row"><span>PNS</span><strong class="sp-summary-val">' + totalPNS + '</strong></div>' +
      '<div class="sp-summary-row"><span>PPPK Paruh Waktu</span><strong class="sp-summary-val">' + totalPPPK + '</strong></div>' +
      '</div>' +
      '<div class="sp-summary-group"><h4>Kekuatan Total</h4>' +
      '<div class="sp-summary-row"><span>Terisi (B)</span><strong class="sp-summary-val">' + totalB + '</strong></div>' +
      '<div class="sp-summary-row"><span>Kebutuhan (K)</span><strong class="sp-summary-val">' + totalK + '</strong></div>' +
      '</div>';
  }

  /* =====================================================
     6. LEGEND DIALOG (bottom-sheet / modal)
     ===================================================== */

  function initLegendDialog() {
    var btn = document.getElementById('sp-legend-btn');
    var dialog = document.getElementById('sp-legend-dialog');
    var backdrop = document.getElementById('sp-backdrop');
    var closeBtn = document.getElementById('sp-dialog-close');

    if (!btn || !dialog || !backdrop || !closeBtn) return;

    var previousFocus = null;

    function openDialog() {
      previousFocus = document.activeElement;
      backdrop.classList.add('sp-open');
      requestAnimationFrame(function () { backdrop.classList.add('sp-visible'); });
      dialog.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      setTimeout(function () {
        var first = dialog.querySelector('.sp-dialog-close');
        if (first) first.focus();
      }, 50);
    }

    function closeDialog() {
      backdrop.classList.remove('sp-visible');
      setTimeout(function () { backdrop.classList.remove('sp-open'); }, 250);
      dialog.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (previousFocus) previousFocus.focus();
    }

    btn.addEventListener('click', openDialog);
    closeBtn.addEventListener('click', closeDialog);
    backdrop.addEventListener('click', closeDialog);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dialog.getAttribute('aria-hidden') === 'false') closeDialog();
    });

    // Focus trap
    dialog.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = Array.prototype.slice.call(
        dialog.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return !el.disabled; });
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* =====================================================
     6. SCROLL ANIMATION (MOTION CHOREOGRAPHY)
     ===================================================== */

  function initScrollAnimation() {
    var treeEl = document.getElementById('sp-tree');
    var sectionEl = document.getElementById('struktur-pemerintahan');
    if (!treeEl || !sectionEl) return;

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    treeEl.classList.add('sp-motion-ready');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            treeEl.classList.add('sp-animated');
            observer.unobserve(entry.target);

            // Setelah sekuens selesai (3.1s), hapus batasan animasi agar hover bekerja normal
            setTimeout(function () {
              treeEl.classList.add('sp-animation-done');
            }, 3100);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
      });

      observer.observe(sectionEl);
    } else {
      treeEl.classList.add('sp-animated');
    }
  }

  /* =====================================================
     7. INIT
     ===================================================== */

  function init() {
    var data = STRUKTUR_DATA;
    var nodes = data.nodes;

    var treeEl = document.getElementById('sp-tree');
    if (treeEl) treeEl.innerHTML = buildTree(nodes);

    var summaryEl = document.getElementById('sp-summary-body');
    if (summaryEl) summaryEl.innerHTML = buildSummary(nodes);

    initLegendDialog();
    initScrollAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
