/*
 * main.js
 * Global JavaScript — Website Profil Kelurahan Paslaten Satu
 * KKT 149 UNSRAT – Posko Paslaten 1, Kota Tomohon
 */

document.addEventListener('DOMContentLoaded', function () {

    console.log('[Paslaten Satu] JavaScript terhubung. Halaman:', document.title);

    // ================================================================
    // 1. NAVBAR — transparan → solid saat scroll
    // ================================================================
    var navbar    = document.getElementById('navbar');
    var SCROLL_THRESHOLD = 60; // px sebelum navbar berubah

    function handleNavbarScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    var heroSection = document.getElementById('hero');

    if (navbar) {
        if (heroSection) {
            // Beranda: navbar transparan → solid saat scroll
            window.addEventListener('scroll', handleNavbarScroll, { passive: true });
            handleNavbarScroll();
        } else {
            // Halaman lain (tanpa hero): navbar selalu solid hijau
            navbar.classList.add('scrolled');
        }
    }

    // ================================================================
    // 2. DRAWER MENU (mobile) — slide dari kanan
    // ================================================================
    var hamburger    = document.getElementById('nav-hamburger');
    var drawer       = document.getElementById('drawer-menu');
    var backdrop     = document.getElementById('drawer-backdrop');
    var drawerClose  = document.getElementById('drawer-close');

    function drawerOpen() {
        if (!drawer) return;
        drawer.classList.add('drawer-open');
        drawer.setAttribute('aria-hidden', 'false');
        if (backdrop) {
            backdrop.classList.add('drawer-open');
            backdrop.setAttribute('aria-hidden', 'false');
        }
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (drawerClose) drawerClose.focus();
    }

    function drawerClose_fn() {
        if (!drawer) return;
        drawer.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        if (backdrop) {
            backdrop.classList.remove('drawer-open');
            backdrop.setAttribute('aria-hidden', 'true');
        }
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (hamburger) hamburger.focus();
    }

    /* Buka saat klik hamburger */
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            var isOpen = drawer && drawer.classList.contains('drawer-open');
            if (isOpen) {
                drawerClose_fn();
            } else {
                drawerOpen();
            }
        });
    }

    /* Tutup saat klik tombol × */
    if (drawerClose) {
        drawerClose.addEventListener('click', drawerClose_fn);
    }

    /* Tutup saat klik backdrop */
    if (backdrop) {
        backdrop.addEventListener('click', drawerClose_fn);
    }

    /* Tutup saat link di-klik */
    if (drawer) {
        drawer.querySelectorAll('.drawer-link').forEach(function (link) {
            link.addEventListener('click', function () {
                drawerClose_fn();
            });
        });
    }

    /* Tutup dengan Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('drawer-open')) {
            drawerClose_fn();
        }
    });

    // ================================================================
    // 3. HERO SLIDESHOW — crossfade otomatis setiap 5 detik
    //    Untuk menambah foto: tambah .hero-slide di HTML dan
    //    tambah .hero-dot di HTML, lalu tidak perlu ubah JS ini.
    // ================================================================
    var slides      = document.querySelectorAll('.hero-slide');
    var dots        = document.querySelectorAll('.hero-dot');
    var captionEl   = document.getElementById('hero-caption-text');
    var currentSlide = 0;
    var slideshowInterval = null;
    var SLIDE_INTERVAL = 5000; // 5 detik

    function goToSlide(index) {
        if (!slides.length) return;

        // Hapus active dari semua slide dan dot
        slides.forEach(function (s) { s.classList.remove('active'); });
        dots.forEach(function (d) { d.classList.remove('active'); });

        // Set slide baru sebagai active
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');

        // Update dot
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }

        // Update caption
        if (captionEl) {
            var caption = slides[currentSlide].getAttribute('data-caption') || '';
            captionEl.textContent = caption;
        }
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlideshow() {
        if (slides.length > 1) {
            slideshowInterval = setInterval(nextSlide, SLIDE_INTERVAL);
        }
    }

    function resetSlideshow() {
        clearInterval(slideshowInterval);
        startSlideshow();
    }

    // Klik dots untuk navigasi manual
    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            goToSlide(i);
            resetSlideshow(); // reset timer setelah klik manual
        });
    });

    // Inisialisasi slideshow
    if (slides.length) {
        goToSlide(0);
        startSlideshow();
    }

    // ================================================================
    // 4. SCROLL INDICATOR — klik untuk scroll ke section berikutnya
    // ================================================================
    var scrollIndicator = document.getElementById('hero-scroll-indicator');
    var heroSection     = document.getElementById('hero');

    if (scrollIndicator && heroSection) {
        function scrollPastHero() {
            var targetY = heroSection.offsetTop + heroSection.offsetHeight;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        }

        scrollIndicator.addEventListener('click', scrollPastHero);

        // Keyboard: Enter atau Space
        scrollIndicator.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollPastHero();
            }
        });
    }

    // ================================================================
    // 5. ACTIVE NAV LINK (halaman dalam / pages/)
    //    Tandai link navbar yang sesuai dengan halaman aktif
    // ================================================================
    var currentPath = window.location.pathname;
    var navLinks    = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(function (link) {
        link.classList.remove('active');
        var linkHref = link.getAttribute('href') || '';

        // Cocokkan akhir path URL dengan href link
        if (
            linkHref &&
            (currentPath.endsWith(linkHref) ||
             currentPath.endsWith(linkHref.replace('../', '')))
        ) {
            link.classList.add('active');
        }

        // Khusus root / index.html
        if (
            (currentPath === '/' || currentPath.endsWith('/index.html')) &&
            (linkHref === 'index.html' || linkHref === '../index.html')
        ) {
            link.classList.add('active');
        }
    });

    // ================================================================
    // TODO (tahap berikutnya):
    // - Gallery lightbox
    // - Smooth scroll untuk anchor link (#section)
    // - Fetch data dari data/kelurahan.json
    // ================================================================

    // ================================================================
    // 6. ONBOARDING OVERLAY
    //    Dipicu saat tombol "Kenali Paslaten 1" diklik di hero.
    //    Hanya tersedia di beranda (index.html).
    // ================================================================
    var kenaliBtn   = document.getElementById('btn-kenali');
    var obOverlay   = document.getElementById('onboarding');
    var obTrack     = document.getElementById('ob-track');
    var obSkipBtn   = document.getElementById('ob-skip');
    var obBackBtn   = document.getElementById('ob-back');
    var obNextBtn   = document.getElementById('ob-next');
    var obDotBtns   = document.querySelectorAll('.ob-dot');

    var OB_TOTAL    = 3;
    var obCurrent   = 0;
    var obTouchX0   = 0;

    /* --- Buka onboarding --- */
    function obOpen() {
        if (!obOverlay) return;
        obGoTo(0);
        obOverlay.classList.add('ob-active');
        obOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (obSkipBtn) obSkipBtn.focus();
    }

    /* --- Tutup onboarding --- */
    function obClose() {
        if (!obOverlay) return;
        obOverlay.classList.remove('ob-active');
        obOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (kenaliBtn) kenaliBtn.focus();
    }

    /* --- Pindah ke slide ke-index --- */
    function obGoTo(index) {
        obCurrent = index;

        /* Geser track secara horizontal */
        if (obTrack) {
            obTrack.style.transform = 'translateX(-' + (index * 100) + '%)';
        }

        /* Ganti warna background overlay sesuai slide aktif */
        if (obOverlay) {
            /* Hapus semua class ob-at-* */
            obOverlay.classList.remove('ob-at-0', 'ob-at-1', 'ob-at-2');
            /* Tambahkan class yang sesuai */
            obOverlay.classList.add('ob-at-' + index);
        }

        /* Update dots */
        obDotBtns.forEach(function (dot, i) {
            var isActive = (i === index);
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        /* Sembunyikan / tampilkan tombol Kembali */
        if (obBackBtn) {
            obBackBtn.classList.toggle('ob-hidden', index === 0);
        }

        /* Teks tombol berikutnya */
        if (obNextBtn) {
            obNextBtn.textContent = (index === OB_TOTAL - 1) ? 'Mulai Jelajahi' : 'Selanjutnya';
        }
    }

    /* --- Event: tombol Kenali Paslaten 1 --- */
    if (kenaliBtn && obOverlay) {
        kenaliBtn.addEventListener('click', obOpen);
    }

    /* --- Event: Lewati --- */
    if (obSkipBtn) {
        obSkipBtn.addEventListener('click', obClose);
    }

    /* --- Event: Kembali --- */
    if (obBackBtn) {
        obBackBtn.addEventListener('click', function () {
            if (obCurrent > 0) obGoTo(obCurrent - 1);
        });
    }

    /* --- Event: Selanjutnya / Mulai Jelajahi --- */
    if (obNextBtn) {
        obNextBtn.addEventListener('click', function () {
            if (obCurrent < OB_TOTAL - 1) {
                obGoTo(obCurrent + 1);
            } else {
                /* Slide terakhir: tutup onboarding & scroll ke konten */
                obClose();
                var firstSection = document.getElementById('tentang-singkat');
                if (firstSection) {
                    setTimeout(function () {
                        firstSection.scrollIntoView({ behavior: 'smooth' });
                    }, 350);
                }
            }
        });
    }

    /* --- Event: klik dots --- */
    obDotBtns.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var idx = parseInt(dot.getAttribute('data-index'), 10);
            if (!isNaN(idx)) obGoTo(idx);
        });
    });

    /* --- Swipe (touch) support --- */
    if (obOverlay) {
        obOverlay.addEventListener('touchstart', function (e) {
            obTouchX0 = e.changedTouches[0].screenX;
        }, { passive: true });

        obOverlay.addEventListener('touchend', function (e) {
            var diff = obTouchX0 - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 48) {
                if (diff > 0 && obCurrent < OB_TOTAL - 1) {
                    obGoTo(obCurrent + 1); /* swipe kiri → selanjutnya */
                } else if (diff < 0 && obCurrent > 0) {
                    obGoTo(obCurrent - 1); /* swipe kanan → kembali */
                }
            }
        }, { passive: true });

        /* Tutup dengan tombol Escape */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && obOverlay.classList.contains('ob-active')) {
                obClose();
            }
        });
    }

});
