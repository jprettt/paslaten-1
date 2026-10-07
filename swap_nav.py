import os, re

files = ['index.html', 'pages/tentang.html', 'pages/sejarah.html', 'pages/statistik.html', 'pages/kontak.html', 'pages/galeri.html', 'pages/anggota-kkt.html']

for f in files:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Desktop nav
    desktop_pattern = re.compile(r'(<li[^>]*>\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>.*?Anggota KKT.*?</a>\s*</li>)\s*(<li[^>]*>\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>.*?Kontak.*?</a>\s*</li>)', re.DOTALL | re.IGNORECASE)
    content, n1 = desktop_pattern.subn(r'\2\n\1', content)
    
    # Drawer nav
    drawer_pattern = re.compile(r'(<!--\s*ANGGOTA KKT\s*-->\s*<li class="drawer-item">\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>.*?Anggota KKT\s*</span>\s*</a>\s*</li>)\s*(<!--\s*KONTAK\s*-->\s*<li class="drawer-item">\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>.*?Kontak\s*</span>\s*</a>\s*</li>)', re.DOTALL | re.IGNORECASE)
    content, n2 = drawer_pattern.subn(r'\2\n\n\1', content)
    
    # Without comments drawer nav (like in galeri.html where there might be no comments)
    drawer_pattern2 = re.compile(r'(<li class="drawer-item">\s*<a[^>]*href="[^"]*anggota-kkt\.html"[^>]*>.*?Anggota KKT\s*</span>\s*</a>\s*</li>)\s*(<li class="drawer-item">\s*<a[^>]*href="[^"]*kontak\.html"[^>]*>.*?Kontak\s*</span>\s*</a>\s*</li>)', re.DOTALL | re.IGNORECASE)
    content, n3 = drawer_pattern2.subn(r'\2\n\1', content)
    
    if n1 > 0 or n2 > 0 or n3 > 0:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f} (desktop: {n1}, drawer: {n2}, drawer2: {n3})')
