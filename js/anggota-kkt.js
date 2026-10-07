const fallbackData = [
    { "divisi": "Pengurus Inti", "nama": "Nidal Sumardi", "nim": "210611020649", "jabatan": "Koordinator Posko", "foto": "../assets/images/anggota/nidal.jpg" },
    { "divisi": "Pengurus Inti", "nama": "Ribka Sumarauw", "nim": "231011030041", "jabatan": "Sekretaris", "foto": "../assets/images/anggota/ribka.jpg" },
    { "divisi": "Pengurus Inti", "nama": "Sofia Nur Mokoginta", "nim": "230511060022", "jabatan": "Bendahara", "foto": "../assets/images/anggota/sofia.jpg" },
    { "divisi": "Divisi Humas", "nama": "Bagus Pratama", "nim": "230211050003", "jabatan": "Koordinator", "foto": "../assets/images/anggota/bagus.jpg" },
    { "divisi": "Divisi Humas", "nama": "Rafaelito Soputan", "nim": "230211050035", "jabatan": "Anggota", "foto": "../assets/images/anggota/rafaelito.jpg" },
    { "divisi": "Divisi PDD", "nama": "Karlin Wantri", "nim": "230811060005", "jabatan": "Koordinator", "foto": "../assets/images/anggota/karlin.jpg" },
    { "divisi": "Divisi PDD", "nama": "Regita Massie", "nim": "230411040041", "jabatan": "Anggota", "foto": "../assets/images/anggota/regita.jpg" },
    { "divisi": "Divisi PDD", "nama": "Kimberly Latuni", "nim": "230811010073", "jabatan": "Anggota", "foto": "../assets/images/anggota/kimberly.jpg" },
    { "divisi": "Divisi Program & Perlengkapan", "nama": "Fajrin Mardi", "nim": "230211040025", "jabatan": "Koordinator", "foto": "../assets/images/anggota/fajrin.jpg" },
    { "divisi": "Divisi Program & Perlengkapan", "nama": "Yulison Kogi", "nim": "230111040121", "jabatan": "Anggota", "foto": "../assets/images/anggota/yulison.jpg" },
    { "divisi": "Divisi Program & Perlengkapan", "nama": "Helena Sumeke", "nim": "230311060048", "jabatan": "Anggota", "foto": "../assets/images/anggota/helena.jpg" },
    { "divisi": "Divisi Pelaporan", "nama": "Jonathan Sitanggang", "nim": "230211060042", "jabatan": "Koordinator", "foto": "../assets/images/anggota/jonathan.jpg" },
    { "divisi": "Divisi Pelaporan", "nama": "Varel Sumampouw", "nim": "230211060106", "jabatan": "Anggota", "foto": "../assets/images/anggota/varel.jpg" }
];

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('kkt-container');
    if (!container) return;

    fetch('../data/anggota-kkt.json')
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data anggota KKT.");
            return response.json();
        })
        .then(data => {
            renderKKT(data, container);
        })
        .catch(err => {
            console.warn("Fetch JSON gagal. Menggunakan data statis sebagai fallback.", err);
            renderKKT(fallbackData, container);
        });
});

function getInitials(name) {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function renderStrip(data) {
    const members = data.length;
    const divs = [...new Set(data.map(d => d.divisi))].length;
    return `
        <div class="kkt-summary-strip kkt-animate-in" style="animation-delay: 0s;">
            <div class="kkt-summary-item">
                <strong>${members} Anggota</strong>
                <span>Total Mahasiswa</span>
            </div>
            <div class="kkt-summary-item">
                <strong>${divs - 1} Divisi</strong>
                <span>Struktur Inti</span>
            </div>
            <div class="kkt-summary-item">
                <strong>KKT 149</strong>
                <span>UNSRAT</span>
            </div>
        </div>
    `;
}

function renderCard(anggota, customClass = '', isKoorUtama = false) {
    const cardClass = isKoorUtama ? 'kkt-item-utama' : 'kkt-item-biasa';
    const isKoor = anggota.jabatan.toLowerCase().includes('koordinator');
    const roleClass = isKoor ? 'kkt-role-koor' : 'kkt-role-anggota';
    
    let mediaHtml = '';
    const initials = getInitials(anggota.nama);
    
    if (anggota.foto && anggota.foto.trim() !== '') {
        mediaHtml = `<img src="${anggota.foto}" alt="Foto ${anggota.nama}, ${anggota.jabatan}" class="kkt-item-img" loading="lazy" onload="this.classList.add('loaded')" onerror="this.outerHTML='<div class=\\'kkt-item-placeholder\\' aria-hidden=\\'true\\'><div class=\\'kkt-placeholder-text\\'>${initials}</div></div>'" />`;
    } else {
        mediaHtml = `<div class="kkt-item-placeholder" aria-hidden="true"><div class="kkt-placeholder-text">${initials}</div></div>`;
    }

    return `
        <article class="kkt-item ${customClass} ${cardClass}">
            <div class="kkt-item-media">
                ${mediaHtml}
            </div>
            <div class="kkt-item-content">
                <h4 class="kkt-item-name">${anggota.nama}</h4>
                <p class="kkt-item-role ${roleClass}">${anggota.jabatan}</p>
                <p class="kkt-item-nim"><span class="kkt-nim-label">NIM</span> <span class="kkt-item-nim-val">${anggota.nim}</span></p>
            </div>
        </article>
    `;
}

function renderKKT(data, container) {
    const pengurusInti = data.filter(d => d.divisi === 'Pengurus Inti');
    
    const divisiGroups = {};
    data.filter(d => d.divisi !== 'Pengurus Inti').forEach(d => {
        if (!divisiGroups[d.divisi]) divisiGroups[d.divisi] = [];
        divisiGroups[d.divisi].push(d);
    });

    let html = renderStrip(data);

    // Helper for background icons
    function getSectionIcon(divName) {
        const name = divName.toLowerCase();
        let svg = '';
        let posClass = 'bg-pos-top-right';
        
        if (name.includes('pengurus inti')) {
            svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
            posClass = 'bg-pos-top-right'; // Peeks from top right
        } else if (name.includes('humas')) {
            // Megaphone
            svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M3 11l18-5v12L3 14v-3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>`;
            posClass = 'bg-pos-center-right'; // Peeks from right empty space
        } else if (name.includes('pdd')) {
            // Camera
            svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
            posClass = 'bg-pos-bottom-right'; // Peeks from bottom right empty space
        } else if (name.includes('program') || name.includes('perlengkapan')) {
            // Gear
            svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/><circle cx="12" cy="12" r="3"/></svg>`;
            posClass = 'bg-pos-bottom-right'; // Peeks from bottom right empty space
        } else if (name.includes('pelaporan')) {
            // Document
            svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 18h8"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 14h8"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h2"/></svg>`;
            posClass = 'bg-pos-bottom-left'; // Peeks from bottom left
        }
        return svg ? `<div class="kkt-bg-icon ${posClass}">${svg}</div>` : '';
    }

    // 1. PENGURUS INTI
    if (pengurusInti.length > 0) {
        const koor = pengurusInti.find(p => p.jabatan.toLowerCase().includes('koordinator'));
        const sekre = pengurusInti.find(p => p.jabatan.toLowerCase().includes('sekretaris'));
        const benda = pengurusInti.find(p => p.jabatan.toLowerCase().includes('bendahara'));

        html += `
            <div class="kkt-section kkt-pengurus-inti">
                ${getSectionIcon('Pengurus Inti')}
                <h2 class="kkt-section-heading">Pengurus Inti</h2>
                <div class="kkt-tree">
                    ${koor ? `
                    <div class="kkt-tree-top">
                        ${renderCard(koor, '', true)}
                    </div>
                    ` : ''}
                    <div class="kkt-tree-bottom">
                        ${sekre ? renderCard(sekre) : ''}
                        ${benda ? renderCard(benda) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    // 2. DIVISI
    const divNames = Object.keys(divisiGroups);
    if (divNames.length > 0) {
        html += `<div class="kkt-section kkt-divisi-list">`;
        
        divNames.forEach((divName, index) => {
            const members = divisiGroups[divName];
            members.sort((a, b) => {
                const aKoor = a.jabatan.toLowerCase().includes('koordinator') ? -1 : 1;
                const bKoor = b.jabatan.toLowerCase().includes('koordinator') ? -1 : 1;
                return aKoor - bKoor;
            });
            html += `
                <div class="kkt-divisi-group">
                    ${getSectionIcon(divName)}
                    <h2 class="kkt-section-heading">${divName}</h2>
                    <div class="kkt-divisi-grid">
                        ${members.map(m => renderCard(m)).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }

    container.innerHTML = html;

    // Scroll Animation Observer (with stagger)
    const observer = new IntersectionObserver((entries) => {
        let delayIndex = 0;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = `${delayIndex * 0.1}s`;
                entry.target.classList.add('kkt-animate-in');
                observer.unobserve(entry.target);
                delayIndex++;
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const cards = container.querySelectorAll('.kkt-item');
    cards.forEach(card => {
        observer.observe(card);
    });
}
