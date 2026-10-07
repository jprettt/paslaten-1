/* =====================================================
   MOMEN KKT — Fullscreen Snap Video Feed
   Activated when user scrolls to teaser, takes over viewport
   ===================================================== */

const momenFallback = [
    { file: "jalan-jalan-akamsi.mp4", day: 3, keterangan: "Jalan-jalan bersama anak-anak dari Paslaten 1 untuk observasi kebutuhan program kerja" },
    { file: "lagi-ibadah.mp4", day: 4, keterangan: "Ibadah bersama seluruh anggota KKT di GMIM Maranatha Paslaten" },
    { file: "merayakan ultah.mp4", day: 14, keterangan: "Merayakan ulang tahun Pak Lurah" },
    { file: "tebak tebakan.mp4", day: 3, keterangan: "Main tebak-tebakan sama anak-anak Paslaten" }
];

document.addEventListener('DOMContentLoaded', function () {
    const feedContainer = document.getElementById('momen-feed-container');
    if (!feedContainer) return;

    fetch('../data/momen-kkt.json')
        .then(r => { if (!r.ok) throw new Error(); return r.json(); })
        .then(data => initMomen(data, feedContainer))
        .catch(() => initMomen(momenFallback, feedContainer));
});

function initMomen(data, container) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMuted = true;
    let hasScrolledVideo = false;
    let feedActive = false;

    // --- Build Teaser (inline, part of page scroll) ---
    container.innerHTML = `
        <div class="momen-teaser" id="momen-teaser">
            <p class="momen-teaser-title">Momen KKT</p>
            <p class="momen-teaser-desc">Potongan cerita selama 23 hari di Paslaten 1</p>
            <div class="momen-teaser-hint" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                <span>Tarik ke atas</span>
            </div>
        </div>
    `;

    // --- Build Fullscreen Feed (appended to body) ---
    const slidesHtml = data.map((item, i) => `
        <div class="momen-slide" data-momen-index="${i}">
            <div class="momen-loader"><div class="momen-spinner"></div></div>
            <video
                class="momen-video"
                preload="none"
                muted
                playsinline
                loop
                disablepictureinpicture
                controlslist="nodownload nofullscreen noremoteplayback"
            >
                <source src="../assets/videos/${item.file}" type="video/mp4">
            </video>
            <div class="momen-play-indicator" aria-hidden="true">
                <svg viewBox="0 0 24 24" class="momen-icon-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <svg viewBox="0 0 24 24" class="momen-icon-pause" style="display:none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            </div>
            <div class="momen-error">
                <p>Videonya belum bisa dimuat, coba lagi nanti 😊</p>
                <button class="momen-retry-btn" aria-label="Coba muat ulang video">Coba Lagi</button>
            </div>
            <div class="momen-slide-gradient" aria-hidden="true"></div>
            <div class="momen-info">
                <p class="momen-day">Day ${item.day}</p>
                <p class="momen-caption">${item.keterangan}</p>
            </div>
            ${i === 0 ? `
            <div class="momen-hint" aria-hidden="true">
                <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                <span>Geser ke atas</span>
            </div>` : ''}
        </div>
    `).join('');

    const dotsHtml = data.map((_, i) =>
        `<button class="momen-dot ${i === 0 ? 'active' : ''}" data-dot="${i}" aria-label="Video ${i + 1}"></button>`
    ).join('') + `<button class="momen-dot" data-dot="${data.length}" aria-label="Penutup"></button>`;

    const feedHtml = `
        <div class="momen-feed-fullscreen" id="momen-feed" role="dialog" aria-modal="true" aria-label="Momen KKT">
            <button class="momen-back-btn" id="momen-back" aria-label="Kembali ke halaman anggota">
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button class="momen-mute-btn" id="momen-mute" aria-label="Nyalakan suara">
                <svg viewBox="0 0 24 24" class="momen-icon-muted"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                <svg viewBox="0 0 24 24" class="momen-icon-unmuted" style="display:none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="none"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
            <div class="momen-dots" id="momen-dots">${dotsHtml}</div>
            <div class="momen-feed-scrollable" id="momen-feed-scrollable">
                ${slidesHtml}
                <div class="momen-slide momen-closing" data-momen-index="${data.length}">
                    <div class="momen-closing-inner">
                        <h2 class="momen-closing-title">Terima Kasih, Paslaten 1.</h2>
                        <p class="momen-closing-subtitle">23 hari mungkin singkat, tetapi cukup untuk meninggalkan banyak cerita.</p>
                        <div class="momen-closing-actions">
                            <button class="momen-closing-btn momen-btn-replay" aria-label="Putar ulang dari awal">Putar Ulang</button>
                            <button class="momen-closing-btn momen-btn-back" aria-label="Kembali ke atas halaman">Kembali ke Atas</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', feedHtml);

    // --- References ---
    const feed = document.getElementById('momen-feed');
    const feedScrollable = document.getElementById('momen-feed-scrollable');
    const backBtn = document.getElementById('momen-back');
    const muteBtn = document.getElementById('momen-mute');
    const dotsEl = document.getElementById('momen-dots');
    const dots = dotsEl.querySelectorAll('.momen-dot');
    const slides = feedScrollable.querySelectorAll('.momen-slide');
    const hint = feed.querySelector('.momen-hint');
    const teaser = document.getElementById('momen-teaser');
    const replayBtn = feedScrollable.querySelector('.momen-btn-replay');
    const closingBackBtn = feedScrollable.querySelector('.momen-btn-back');

    // --- Activate / Deactivate Feed ---
    function activateFeed() {
        if (feedActive) return;
        feedActive = true;
        hasScrolledVideo = false;
        isMuted = true;
        updateMuteUI();

        feedScrollable.scrollTop = 0;
        updateDots(0);
        feed.classList.add('active');
        document.body.classList.add('momen-active');
        document.body.style.overflow = 'hidden';

        preloadVideo(0);
        if (data.length > 1) preloadVideo(1);
        if (!prefersReducedMotion) playVideo(0);
        if (hint) hint.classList.remove('hidden');
        backBtn.focus();
    }

    function deactivateFeed() {
        if (!feedActive) return;
        feedActive = false;
        feed.classList.remove('active');
        document.body.classList.remove('momen-active');
        document.body.style.overflow = '';

        // Stop all videos
        feed.querySelectorAll('video').forEach(v => {
            v.pause();
            v.currentTime = 0;
        });

        // Scroll page back up a bit so teaser is visible
        teaser.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- Swipe/Scroll Past Bottom to Activate ---
    let isAtBottom = false;
    
    window.addEventListener('scroll', () => {
        // Detect if user is at the bottom of the page
        isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50;
    });

    window.addEventListener('wheel', (e) => {
        if (isAtBottom && e.deltaY > 50 && !feedActive) {
            activateFeed();
        }
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isAtBottom || feedActive) return;
        let touchEndY = e.touches[0].clientY;
        if (touchStartY - touchEndY > 40) { // Swiped up past bottom
            activateFeed();
        }
    }, { passive: true });

    // Fallback: Tap teaser to play
    teaser.addEventListener('click', activateFeed);
    teaser.style.cursor = 'pointer';

    // --- Back / Close ---
    backBtn.addEventListener('click', deactivateFeed);

    document.addEventListener('keydown', (e) => {
        if (!feedActive) return;
        if (e.key === 'Escape') deactivateFeed();
    });

    // --- Video Playback ---
    function preloadVideo(index) {
        if (index < 0 || index >= data.length) return;
        const video = slides[index]?.querySelector('video');
        if (video && video.getAttribute('preload') === 'none') {
            video.setAttribute('preload', 'auto');
            video.load();
        }
    }

    function playVideo(index) {
        if (index < 0 || index >= data.length) return;
        const video = slides[index]?.querySelector('video');
        if (!video) return;
        video.muted = isMuted;
        const p = video.play();
        if (p) p.catch(() => {
            video.muted = true;
            isMuted = true;
            updateMuteUI();
            video.play().catch(() => {});
        });
    }

    function pauseVideo(index) {
        if (index < 0 || index >= data.length) return;
        const video = slides[index]?.querySelector('video');
        if (video) { video.pause(); video.currentTime = 0; }
    }

    // --- Scroll Snap Observer ---
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = parseInt(entry.target.dataset.momenIndex);
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                updateDots(idx);
                if (idx < data.length) {
                    if (!prefersReducedMotion) playVideo(idx);
                    preloadVideo(idx + 1);
                    const video = entry.target.querySelector('video');
                    const loader = entry.target.querySelector('.momen-loader');
                    if (video && loader) {
                        const hide = () => { loader.style.display = 'none'; };
                        video.addEventListener('canplay', hide, { once: true });
                        if (video.readyState >= 3) hide();
                    }
                }
                if (!hasScrolledVideo && idx > 0) {
                    hasScrolledVideo = true;
                    if (hint) hint.classList.add('hidden');
                }
            } else {
                if (idx < data.length) pauseVideo(idx);
            }
        });
    }, { root: feedScrollable, threshold: 0.6 });

    slides.forEach(slide => videoObserver.observe(slide));

    // --- Tap to Play/Pause ---
    slides.forEach((slide, i) => {
        if (i >= data.length) return;
        const video = slide.querySelector('video');
        const indicator = slide.querySelector('.momen-play-indicator');
        const playIcon = indicator?.querySelector('.momen-icon-play');
        const pauseIcon = indicator?.querySelector('.momen-icon-pause');

        slide.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('a')) return;
            if (!video) return;
            if (video.paused) {
                video.play().catch(() => {});
                if (playIcon) playIcon.style.display = 'block';
                if (pauseIcon) pauseIcon.style.display = 'none';
            } else {
                video.pause();
                if (playIcon) playIcon.style.display = 'none';
                if (pauseIcon) pauseIcon.style.display = 'block';
            }
            if (indicator) {
                indicator.classList.add('show');
                setTimeout(() => indicator.classList.remove('show'), 600);
            }
        });

        // Error handling
        const errorEl = slide.querySelector('.momen-error');
        const retryBtn = slide.querySelector('.momen-retry-btn');
        if (video && errorEl) video.addEventListener('error', () => errorEl.classList.add('show'));
        if (retryBtn && video) retryBtn.addEventListener('click', () => {
            errorEl.classList.remove('show');
            video.load();
            video.play().catch(() => {});
        });
    });

    // --- Mute ---
    function updateMuteUI() {
        const m = muteBtn.querySelector('.momen-icon-muted');
        const u = muteBtn.querySelector('.momen-icon-unmuted');
        if (isMuted) {
            m.style.display = 'block'; u.style.display = 'none';
            muteBtn.setAttribute('aria-label', 'Nyalakan suara');
        } else {
            m.style.display = 'none'; u.style.display = 'block';
            muteBtn.setAttribute('aria-label', 'Matikan suara');
        }
    }

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        updateMuteUI();
        feed.querySelectorAll('video').forEach(v => { v.muted = isMuted; });
    });

    // --- Dots ---
    function updateDots(active) {
        dots.forEach((d, i) => d.classList.toggle('active', i === active));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.dot);
            if (idx >= 0 && idx < slides.length) {
                slides[idx].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Closing Section ---
    if (replayBtn) replayBtn.addEventListener('click', () => {
        feedScrollable.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (closingBackBtn) closingBackBtn.addEventListener('click', deactivateFeed);

    // --- Focus Trap ---
    feed.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const focusable = feed.querySelectorAll('button:not([disabled])');
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
}
