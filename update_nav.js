const fs = require('fs');

const files = [
    "pages/galeri.html",
    "pages/kontak.html",
    "pages/sejarah.html",
    "pages/statistik.html",
    "pages/tentang.html"
];

const drawer_replace = '<li class="drawer-item"><a class="drawer-link" href="anggota-kkt.html"><span class="drawer-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span><span class="drawer-link-text">Anggota KKT</span></a></li>';

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    if (file === 'pages/galeri.html') {
        content = content.replace('<li><a class="active" href="galeri.html">Galeri</a></li>', '<li><a class="active" href="galeri.html">Galeri</a></li>\n<li><a href="anggota-kkt.html">Anggota KKT</a></li>');
        content = content.replace(/(<li class="drawer-item"><a class="drawer-link active" href="galeri\.html">.*?<\/a><\/li>)/, '$1\n' + drawer_replace);
    } else {
        const navSearch = '            <li>\n              <a href="galeri.html"> Galeri </a>\n            </li>';
        const navReplace = navSearch + '\n\n            <li>\n              <a href="anggota-kkt.html"> Anggota KKT </a>\n            </li>';
        content = content.replace(navSearch, navReplace);

        const drawerSearch = '              <span class="drawer-link-text"> Galeri </span>\n            </a>\n          </li>';
        const drawerReplaceMulti = drawerSearch + '\n\n          <!-- ANGGOTA KKT -->\n          <li class="drawer-item">\n            <a href="anggota-kkt.html" class="drawer-link">\n              <span class="drawer-icon">\n                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>\n                  <circle cx="9" cy="7" r="4"></circle>\n                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>\n                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>\n                </svg>\n              </span>\n              <span class="drawer-link-text"> Anggota KKT </span>\n            </a>\n          </li>';
        content = content.replace(drawerSearch, drawerReplaceMulti);
    }

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Done');
