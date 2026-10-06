const galeriData = [
    { file: "gereja-katolik.jpeg", keterangan: "Gereja Katolik Paroki Trinitas Mahakudus", maps: "https://maps.app.goo.gl/6kCWuU1NB3r22EK3A" },
    { file: "jordan-bakery.jpeg", keterangan: "Jordan Bakery", maps: "https://maps.app.goo.gl/UVgGTZqEJ8dGLvhB6" },
    { file: "monumen-wilken.jpeg", keterangan: "Monumen Pandita N.P. Wilken", maps: "https://maps.app.goo.gl/gXpXiMtiATpjZ8pv7" },
    { file: "pembenahan.jpeg", keterangan: "Mempercantik halaman kantor lurah" },
    { file: "pasar-beriman.jpeg", keterangan: "Pasar Beriman Tomohon", maps: "https://maps.app.goo.gl/DUgJAGF78cpSBXJd6" },
    { file: "pt-timur.jpeg", keterangan: "PT. Timur Jaya Dayatama", maps: "https://maps.app.goo.gl/ejkrWu5z975CA3aL6" },
    { file: "kerja-bakti.jpg", keterangan: "Kerja bakti membersihkan halaman kantor lurah" },
    { file: "gmim.jpeg", keterangan: "Gereja GMIM Wilken Paslaten", maps: "https://maps.app.goo.gl/vex1rmHMrdZ9PHuJ6" }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".gallery-modern-grid");
    if (!grid) return;
    
    // Clear existing placeholders
    grid.innerHTML = "";
    
    // Render cards
    galeriData.forEach((item, index) => {
        const numStr = String(index + 1).padStart(2, '0');
        
        const figure = document.createElement("figure");
        figure.className = "gallery-modern-item";
        
        const mapsHtml = item.maps ? `
            <a href="${item.maps}" target="_blank" rel="noopener noreferrer" class="gallery-map-link" title="Buka di Google Maps">
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Lihat di Google Maps
            </a>
        ` : "";

        figure.innerHTML = `
            <button class="gallery-photo-btn" aria-label="Lihat foto: ${item.keterangan}">
                <div class="gallery-modern-placeholder">
                    <span class="gallery-num">${numStr}</span>
                    <img src="../assets/images/galeri/${item.file}" alt="${item.keterangan}" loading="lazy" decoding="async" onload="this.classList.add('loaded')">
                </div>
            </button>
            <figcaption>
                <div class="gallery-caption-text">${item.keterangan}</div>
                ${mapsHtml}
            </figcaption>
        `;
        
        // Handle map link click stop propagation
        const mapLink = figure.querySelector(".gallery-map-link");
        if (mapLink) {
            mapLink.addEventListener("click", (e) => e.stopPropagation());
        }
        
        // Open lightbox on button click
        const btn = figure.querySelector(".gallery-photo-btn");
        btn.addEventListener("click", () => openLightbox(index));
        
        grid.appendChild(figure);
    });
    
    // Build lightbox HTML
    const lightboxHtml = `
        <div id="gallery-lightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Galeri Foto Fullscreen">
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
                    <img id="lightbox-img" src="" alt="">
                    <div class="lightbox-loader"></div>
                </div>
                
                <button class="lightbox-nav lightbox-next" aria-label="Foto berikutnya">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
            
            <div class="lightbox-footer">
                <div id="lightbox-counter" class="lightbox-counter"></div>
                <div id="lightbox-caption" class="lightbox-caption"></div>
                <div id="lightbox-map-wrapper"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML("beforeend", lightboxHtml);
    
    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const lightboxMapWrapper = document.getElementById("lightbox-map-wrapper");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const loader = lightbox.querySelector(".lightbox-loader");
    
    let currentIndex = 0;
    let lastFocusedElement = null;
    
    function updateLightbox() {
        const item = galeriData[currentIndex];
        
        // Loader handling
        lightboxImg.style.opacity = "0";
        loader.style.display = "block";
        
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = "1";
            loader.style.display = "none";
        };
        
        lightboxImg.src = `../assets/images/galeri/${item.file}`;
        lightboxImg.alt = item.keterangan;
        lightboxCaption.textContent = item.keterangan;
        lightboxCounter.textContent = `${currentIndex + 1} / ${galeriData.length}`;
        
        if (item.maps) {
            lightboxMapWrapper.innerHTML = `
                <a href="${item.maps}" target="_blank" rel="noopener noreferrer" class="gallery-map-link lightbox-map-link">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Lihat di Google Maps
                </a>
            `;
        } else {
            lightboxMapWrapper.innerHTML = "";
        }
        
        preloadNext();
    }
    
    function preloadNext() {
        const nextIndex = (currentIndex + 1) % galeriData.length;
        const prevIndex = (currentIndex - 1 + galeriData.length) % galeriData.length;
        
        new Image().src = `../assets/images/galeri/${galeriData[nextIndex].file}`;
        new Image().src = `../assets/images/galeri/${galeriData[prevIndex].file}`;
    }
    
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        
        lastFocusedElement = document.activeElement;
        
        lightbox.setAttribute("aria-hidden", "false");
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // lock scroll
        
        // Trap focus to dialog
        closeBtn.focus();
    }
    
    function closeLightbox() {
        lightbox.setAttribute("aria-hidden", "true");
        lightbox.classList.remove("active");
        document.body.style.overflow = ""; // restore scroll
        
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % galeriData.length;
        updateLightbox();
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + galeriData.length) % galeriData.length;
        updateLightbox();
    }
    
    // Event Listeners
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
            
            // Trap focus simple implementation
            if (e.key === "Tab") {
                const focusable = lightbox.querySelectorAll('button, a[href]');
                if(focusable.length === 0) return;
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
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    lightbox.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) showNext();
        if (touchEndX > touchStartX + threshold) showPrev();
    }
});
