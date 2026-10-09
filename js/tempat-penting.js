/**
 * tempat-penting.js
 * Renders the "Tempat Penting" grid, filters, and lightbox.
 * Depends on: tempat-data.js (loaded first)
 */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       CATEGORY ICON SVG MAP
       ===================================================== */
    const KATEGORI_ICONS = {
        "Ibadah": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="4"/></svg>`,
        "Pemerintahan": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4h6v4"/><path d="M9 10h1M14 10h1M9 14h1M14 14h1"/></svg>`,
        "Pendidikan & Kesehatan": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        "Ekonomi & Kuliner": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
        "Landmark & Wisata": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    };

    const grid = document.querySelector(".tempat-grid");
    const filterBar = document.querySelector(".tempat-filter-bar");
    if (!grid || !filterBar) return;

    /* =====================================================
       BUILD FILTER CHIPS
       ===================================================== */
    const counts = {};
    TEMPAT_DATA.forEach(t => {
        counts[t.kategori] = (counts[t.kategori] || 0) + 1;
    });

    const allBtn = document.createElement("button");
    allBtn.className = "tempat-chip tempat-chip--active";
    allBtn.setAttribute("aria-pressed", "true");
    allBtn.setAttribute("data-kategori", "");
    allBtn.textContent = `Semua (${TEMPAT_DATA.length})`;
    filterBar.appendChild(allBtn);

    TEMPAT_KATEGORI.forEach(kat => {
        const btn = document.createElement("button");
        btn.className = "tempat-chip";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("data-kategori", kat);
        btn.textContent = `${kat} (${counts[kat] || 0})`;
        filterBar.appendChild(btn);
    });

    let activeKategori = "";

    /* =====================================================
       RENDER GRID
       ===================================================== */
    function renderGrid() {
        grid.innerHTML = "";
        const filtered = activeKategori
            ? TEMPAT_DATA.filter(t => t.kategori === activeKategori)
            : TEMPAT_DATA;

        filtered.forEach((item) => {
            const figure = document.createElement("figure");
            figure.className = "tempat-card";
            figure.setAttribute("data-kategori", item.kategori);

            const hasFoto = !!item.foto;
            const iconSvg = KATEGORI_ICONS[item.kategori] || "";

            // Badge
            const badgeHtml = `<span class="tempat-badge">${item.kategori}</span>`;

            // Photo or placeholder area
            let photoHtml;
            if (hasFoto) {
                photoHtml = `
                    <button class="tempat-photo-btn" aria-label="Lihat foto: ${item.nama}">
                        <div class="tempat-photo-area">
                            ${badgeHtml}
                            <img src="${TEMPAT_IMG_BASE}${item.foto}" alt="${item.nama}" loading="lazy" decoding="async" onload="this.classList.add('loaded')">
                        </div>
                    </button>`;
            } else {
                photoHtml = `
                    <div class="tempat-photo-area tempat-placeholder-area">
                        ${badgeHtml}
                        <div class="tempat-placeholder-icon">${iconSvg}</div>
                        <span class="tempat-placeholder-label">Foto segera ditambahkan</span>
                    </div>`;
            }

            // Maps link
            const mapsHtml = item.maps ? `
                <a href="${item.maps}" target="_blank" rel="noopener noreferrer" class="tempat-maps-link" title="Buka di Google Maps">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Lihat di Google Maps
                </a>` : "";

            // Alamat
            const alamatHtml = item.alamat ? `<p class="tempat-alamat">${item.alamat}</p>` : "";

            // Deskripsi
            const deskripsiHtml = item.deskripsi ? `<p class="tempat-deskripsi">${item.deskripsi}</p>` : "";

            figure.innerHTML = `
                ${photoHtml}
                <figcaption class="tempat-caption">
                    <h3 class="tempat-nama">${item.nama}</h3>
                    ${alamatHtml}
                    ${deskripsiHtml}
                    ${mapsHtml}
                </figcaption>
            `;

            // Click handlers
            if (hasFoto) {
                const btn = figure.querySelector(".tempat-photo-btn");
                btn.addEventListener("click", () => openLightbox(item));
            }

            const mapLink = figure.querySelector(".tempat-maps-link");
            if (mapLink) {
                mapLink.addEventListener("click", (e) => e.stopPropagation());
            }

            grid.appendChild(figure);
        });

        // Scroll animation with stagger
        requestAnimationFrame(() => {
            const observer = new IntersectionObserver((entries) => {
                let delayIndex = 0;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.transitionDelay = `${delayIndex * 0.07}s`;
                        entry.target.classList.add("tempat-animate-in");
                        observer.unobserve(entry.target);
                        delayIndex++;
                    }
                });
            }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

            grid.querySelectorAll(".tempat-card").forEach(card => {
                observer.observe(card);
            });
        });
    }

    /* =====================================================
       FILTER HANDLER
       ===================================================== */
    filterBar.addEventListener("click", (e) => {
        const chip = e.target.closest(".tempat-chip");
        if (!chip) return;

        const kat = chip.getAttribute("data-kategori");
        if (kat === activeKategori) return;

        activeKategori = kat;

        filterBar.querySelectorAll(".tempat-chip").forEach(c => {
            const isActive = c.getAttribute("data-kategori") === kat;
            c.classList.toggle("tempat-chip--active", isActive);
            c.setAttribute("aria-pressed", isActive ? "true" : "false");
        });

        // Fade transition
        grid.classList.add("tempat-grid--fading");
        setTimeout(() => {
            renderGrid();
            grid.classList.remove("tempat-grid--fading");
        }, 220);
    });

    // Keyboard arrow navigation for chip bar
    filterBar.addEventListener("keydown", (e) => {
        const chips = Array.from(filterBar.querySelectorAll(".tempat-chip"));
        const idx = chips.indexOf(document.activeElement);
        if (idx < 0) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            chips[(idx + 1) % chips.length].focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            chips[(idx - 1 + chips.length) % chips.length].focus();
        }
    });

    /* =====================================================
       LIGHTBOX
       ===================================================== */
    const lightboxHtml = `
        <div id="tempat-lightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Foto Tempat Penting Fullscreen">
            <button class="lightbox-close" aria-label="Tutup lightbox">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <div class="lightbox-content">
                <button class="lightbox-nav lightbox-prev" aria-label="Foto sebelumnya">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div class="lightbox-image-container">
                    <img id="tempat-lightbox-img" src="" alt="">
                    <div class="lightbox-loader"></div>
                </div>
                <button class="lightbox-nav lightbox-next" aria-label="Foto berikutnya">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
            <div class="lightbox-footer">
                <div id="tempat-lightbox-counter" class="lightbox-counter"></div>
                <div id="tempat-lightbox-caption" class="lightbox-caption"></div>
                <div id="tempat-lightbox-map-wrapper"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", lightboxHtml);

    const lightbox = document.getElementById("tempat-lightbox");
    const lightboxImg = document.getElementById("tempat-lightbox-img");
    const lightboxCaption = document.getElementById("tempat-lightbox-caption");
    const lightboxCounter = document.getElementById("tempat-lightbox-counter");
    const lightboxMapWrapper = document.getElementById("tempat-lightbox-map-wrapper");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const loader = lightbox.querySelector(".lightbox-loader");

    let currentLbIndex = 0;
    let lastFocusedElement = null;

    function getLightboxItems() {
        const filtered = activeKategori
            ? TEMPAT_DATA.filter(t => t.kategori === activeKategori)
            : TEMPAT_DATA;
        return filtered.filter(t => !!t.foto);
    }

    function updateLightbox() {
        const items = getLightboxItems();
        if (items.length === 0) return;
        const item = items[currentLbIndex];

        lightboxImg.style.opacity = "0";
        loader.style.display = "block";

        lightboxImg.onload = () => {
            lightboxImg.style.opacity = "1";
            loader.style.display = "none";
        };

        lightboxImg.src = `${TEMPAT_IMG_BASE}${item.foto}`;
        lightboxImg.alt = item.nama;
        lightboxCaption.textContent = item.nama;
        lightboxCounter.textContent = `${currentLbIndex + 1} / ${items.length}`;

        if (item.maps) {
            lightboxMapWrapper.innerHTML = `
                <a href="${item.maps}" target="_blank" rel="noopener noreferrer" class="gallery-map-link lightbox-map-link">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Lihat di Google Maps
                </a>`;
        } else {
            lightboxMapWrapper.innerHTML = "";
        }

        // Preload neighbours
        const next = items[(currentLbIndex + 1) % items.length];
        const prev = items[(currentLbIndex - 1 + items.length) % items.length];
        new Image().src = `${TEMPAT_IMG_BASE}${next.foto}`;
        new Image().src = `${TEMPAT_IMG_BASE}${prev.foto}`;
    }

    function openLightbox(item) {
        const items = getLightboxItems();
        currentLbIndex = items.indexOf(item);
        if (currentLbIndex < 0) currentLbIndex = 0;
        updateLightbox();

        lastFocusedElement = document.activeElement;
        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
        if (lastFocusedElement) lastFocusedElement.focus();
    }

    function showNext() {
        const items = getLightboxItems();
        currentLbIndex = (currentLbIndex + 1) % items.length;
        updateLightbox();
    }

    function showPrev() {
        const items = getLightboxItems();
        currentLbIndex = (currentLbIndex - 1 + items.length) % items.length;
        updateLightbox();
    }

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (lightbox.getAttribute("aria-hidden") === "false") {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") showNext();
            if (e.key === "ArrowLeft") showPrev();

            if (e.key === "Tab") {
                const focusable = lightbox.querySelectorAll("button, a[href]");
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });

    // Swipe support
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", e => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (diff < -50) showNext();
        if (diff > 50) showPrev();
    }, { passive: true });

    /* =====================================================
       INITIAL RENDER
       ===================================================== */
    renderGrid();
});
