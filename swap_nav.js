const fs = require('fs');
const path = require('path');

const files = ['index.html', 'pages/tentang.html', 'pages/sejarah.html', 'pages/statistik.html', 'pages/kontak.html', 'pages/galeri.html', 'pages/anggota-kkt.html'];

for (const f of files) {
    if (!fs.existsSync(f)) continue;
    let content = fs.readFileSync(f, 'utf-8');
    
    // Desktop nav
    const desktopPattern = /(<li[^>]*>\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>[\s\S]*?Anggota KKT[\s\S]*?<\/a>\s*<\/li>)\s*(<li[^>]*>\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>[\s\S]*?Kontak[\s\S]*?<\/a>\s*<\/li>)/gi;
    content = content.replace(desktopPattern, '$2\n$1');
    
    // Drawer nav
    const drawerPattern = /(<!--\s*ANGGOTA KKT\s*-->\s*<li class="drawer-item">\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>[\s\S]*?Anggota KKT\s*<\/span>\s*<\/a>\s*<\/li>)\s*(<!--\s*KONTAK\s*-->\s*<li class="drawer-item">\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>[\s\S]*?Kontak\s*<\/span>\s*<\/a>\s*<\/li>)/gi;
    content = content.replace(drawerPattern, '$2\n\n$1');
    
    // Without comments drawer nav
    const drawerPattern2 = /(<li class="drawer-item">\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>[\s\S]*?Anggota KKT\s*<\/span>\s*<\/a>\s*<\/li>)\s*(<li class="drawer-item">\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>[\s\S]*?Kontak\s*<\/span>\s*<\/a>\s*<\/li>)/gi;
    content = content.replace(drawerPattern2, '$2\n$1');
    
    fs.writeFileSync(f, content, 'utf-8');
    console.log(`Updated ${f}`);
}
