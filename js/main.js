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
    // 2. HAMBURGER MENU (mobile)
    // ================================================================
    var hamburger = document.getElementById('nav-hamburger');
    var navMenu   = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            var isOpen = navMenu.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Tutup menu saat link diklik (mobile)
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Tutup menu saat klik di luar
        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

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

});
