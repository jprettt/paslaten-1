/*
 * main.js
 * Website Profil Kelurahan Paslaten 1
 */

document.addEventListener('DOMContentLoaded', function () {

    // Buka komposisi penduduk melalui klik atau keyboard.
    document.querySelectorAll('.environment-card').forEach(function (card, index) {
        var detail = card.querySelector('.environment-card-detail');
        var label = card.querySelector('.environment-toggle-label');
        if (!detail) return;

        detail.id = detail.id || 'environment-detail-' + (index + 1);
        card.setAttribute('aria-controls', detail.id);

        function setExpanded(expanded) {
            card.classList.toggle('is-expanded', expanded);
            card.setAttribute('aria-expanded', String(expanded));
            detail.setAttribute('aria-hidden', String(!expanded));
            if (label && label.firstChild) {
                label.firstChild.textContent = expanded ? 'Tutup komposisi ' : 'Lihat komposisi ';
            }
        }

        setExpanded(false);
        card.addEventListener('click', function () {
            setExpanded(!card.classList.contains('is-expanded'));
        });
        card.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setExpanded(!card.classList.contains('is-expanded'));
            } else if (event.key === 'Escape') {
                setExpanded(false);
            }
        });
    });

    console.log(
        '[Paslaten 1] JavaScript terhubung. Halaman:',
        document.title
    );

    // Navigasi chip untuk bagian halaman: tandai bagian aktif saat diklik
    // atau saat bagian tersebut memasuki area baca di viewport.
    document.querySelectorAll('.editorial-jump').forEach(function (jumpNav) {
        var links = Array.from(jumpNav.querySelectorAll('a[href^="#"]'));
        var visibleTargets = new Set();

        function setActiveLink(link) {
            links.forEach(function (item) {
                item.classList.toggle('is-active', item === link);
            });
        }

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                setActiveLink(link);
            });
        });

        if (links.length) setActiveLink(links[0]);

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) visibleTargets.add(entry.target);
                    else visibleTargets.delete(entry.target);
                });

                var currentTarget = Array.from(visibleTargets).sort(function (a, b) {
                    return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
                })[0];

                if (currentTarget) {
                    var currentLink = links.find(function (link) {
                        return link.getAttribute('href') === '#' + currentTarget.id;
                    });
                    if (currentLink) setActiveLink(currentLink);
                }
            }, {
                rootMargin: '-86px 0px -35% 0px',
                threshold: 0
            });

            links.forEach(function (link) {
                var targetId = link.getAttribute('href').slice(1);
                var target = document.getElementById(targetId);
                if (target) observer.observe(target);
            });
        }
    });


    // ================================================================
    // 1. HERO ACTION BUTTONS
    //
    // Masukkan tombol "Jelajahi Paslaten 1"
    // dan "Mengenai website" ke dalam parent yang sama.
    //
    // Hasil:
    //
    // [ Jelajahi Paslaten 1 ↓ ] [ Mengenai website → ]
    //
    // Karena berada dalam Flexbox yang sama,
    // kedua tombol akan benar-benar sejajar.
    // ================================================================

    var heroActions =
        document.querySelector(
            '.hero-editorial-actions'
        );

    var exploreButton =
        document.getElementById(
            'hero-scroll-indicator'
        );

    var kenaliButton =
        document.getElementById(
            'btn-kenali'
        );


    if (
        heroActions &&
        exploreButton &&
        kenaliButton
    ) {

        // ------------------------------------------------------------
        // Pindahkan tombol Jelajahi ke parent yang sama
        // ------------------------------------------------------------

        if (
            exploreButton.parentElement !==
            heroActions
        ) {

            heroActions.insertBefore(
                exploreButton,
                kenaliButton
            );

        }


        // ------------------------------------------------------------
        // Tambahkan class khusus
        // ------------------------------------------------------------

        heroActions.classList.add(
            'hero-actions-unified'
        );


        // ------------------------------------------------------------
        // CSS override khusus tombol hero
        // ------------------------------------------------------------

        var heroActionStyle =
            document.createElement(
                'style'
            );


        heroActionStyle.id =
            'hero-actions-alignment-fix';


        heroActionStyle.textContent = `

            /* =====================================================
               HERO ACTION CONTAINER
               ===================================================== */

            #hero .hero-actions-unified {

                position: relative !important;

                width: 100% !important;

                display: flex !important;

                flex-direction: row !important;

                align-items: stretch !important;

                justify-content: flex-start !important;

                gap: 0.65rem !important;

                margin-top: 1.1rem !important;

            }


            /* =====================================================
               RESET POSISI KEDUA TOMBOL

               Menghapus positioning lama supaya
               keduanya mengikuti Flexbox yang sama.
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator,

            #hero .hero-actions-unified
            #btn-kenali {

                position: relative !important;

                top: auto !important;

                bottom: auto !important;

                left: auto !important;

                right: auto !important;

                margin: 0 !important;

                transform: none !important;

                box-sizing: border-box !important;

                align-self: stretch !important;

            }


            /* =====================================================
               BUTTON 1
               JELAJAHI PASLATEN 1
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator {

                order: 1 !important;

                display: inline-flex !important;

                flex-direction: row !important;

                align-items: center !important;

                justify-content: center !important;

                gap: 0.55rem !important;

                width: auto !important;

                min-width: 0 !important;

                height: 45px !important;

                min-height: 45px !important;

                padding:
                    0
                    1.05rem !important;

                margin: 0 !important;

                border:
                    1px solid
                    rgba(
                        255,
                        255,
                        255,
                        0.42
                    ) !important;

                border-radius:
                    999px !important;

                background:
                    rgba(
                        11,
                        56,
                        47,
                        0.78
                    ) !important;

                color:
                    #ffffff !important;

                box-shadow:
                    0
                    8px
                    22px
                    rgba(
                        0,
                        0,
                        0,
                        0.15
                    ) !important;

                backdrop-filter:
                    blur(9px) !important;

                -webkit-backdrop-filter:
                    blur(9px) !important;

                white-space:
                    nowrap !important;

                cursor:
                    pointer !important;

            }


            /* =====================================================
               LABEL JELAJAHI
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator
            .scroll-label {

                display:
                    inline-flex !important;

                align-items:
                    center !important;

                color:
                    #ffffff !important;

                font-family:
                    var(--font-body) !important;

                font-weight:
                    650 !important;

                letter-spacing:
                    0 !important;

                text-transform:
                    none !important;

                line-height:
                    1 !important;

                /*
                 * Hilangkan teks lama:
                 * LIHAT SELENGKAPNYA
                 */

                font-size:
                    0 !important;

            }


            #hero .hero-actions-unified
            #hero-scroll-indicator
            .scroll-label::before {

                content:
                    "Jelajahi Paslaten 1";

                font-size:
                    0.67rem !important;

                line-height:
                    1 !important;

                white-space:
                    nowrap !important;

            }


            /* =====================================================
               ARROW JELAJAHI
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator
            .scroll-arrow {

                width:
                    auto !important;

                height:
                    auto !important;

                display:
                    inline-flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                flex-shrink:
                    0 !important;

                color:
                    #ffffff !important;

                border:
                    none !important;

                border-radius:
                    0 !important;

                background:
                    transparent !important;

                backdrop-filter:
                    none !important;

                -webkit-backdrop-filter:
                    none !important;

                animation:
                    none !important;

                transform:
                    none !important;

            }


            #hero .hero-actions-unified
            #hero-scroll-indicator
            .scroll-arrow svg {

                width:
                    17px !important;

                height:
                    17px !important;

            }


            /* =====================================================
               BUTTON 2
               MENGENAI WEBSITE
               ===================================================== */

            #hero .hero-actions-unified
            #btn-kenali {

                order: 2 !important;

                display: inline-flex !important;

                align-items: center !important;

                justify-content: center !important;

                gap: 0.7rem !important;

                width: auto !important;

                min-width: 0 !important;

                height: 45px !important;

                min-height: 45px !important;

                padding:
                    0
                    1.15rem !important;

                margin: 0 !important;

                border:
                    1px solid
                    var(--color-gold) !important;

                border-radius:
                    999px !important;

                background:
                    var(--color-gold) !important;

                color:
                    #16251f !important;

                font-family:
                    var(--font-body) !important;

                font-size:
                    0.70rem !important;

                font-weight:
                    700 !important;

                line-height:
                    1 !important;

                white-space:
                    nowrap !important;

                cursor:
                    pointer !important;

                box-shadow:
                    0
                    9px
                    22px
                    rgba(
                        0,
                        0,
                        0,
                        0.12
                    ) !important;

            }


            #hero .hero-actions-unified
            #btn-kenali span {

                display:
                    inline-flex !important;

                align-items:
                    center !important;

                line-height:
                    1 !important;

            }


            /* =====================================================
               HOVER
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator:hover {

                background:
                    rgba(
                        18,
                        77,
                        64,
                        0.96
                    ) !important;

                border-color:
                    rgba(
                        255,
                        255,
                        255,
                        0.68
                    ) !important;

                transform:
                    translateY(-2px) !important;

            }


            #hero .hero-actions-unified
            #btn-kenali:hover {

                background:
                    var(--color-gold-light) !important;

                border-color:
                    var(--color-gold-light) !important;

                transform:
                    translateY(-2px) !important;

            }


            /* =====================================================
               ACTIVE
               ===================================================== */

            #hero .hero-actions-unified
            #hero-scroll-indicator:active,

            #hero .hero-actions-unified
            #btn-kenali:active {

                transform:
                    scale(0.97) !important;

            }


            /* =====================================================
               MOBILE
               ===================================================== */

            @media (max-width: 640px) {

                #hero .hero-actions-unified {

                    width: 100% !important;

                    display: flex !important;

                    flex-direction: row !important;

                    align-items: stretch !important;

                    justify-content: flex-start !important;

                    gap: 0.55rem !important;

                    margin-top: 1.1rem !important;

                }


                /* =================================================
                   KEDUA TOMBOL
                   TINGGI SAMA
                   ================================================= */

                #hero .hero-actions-unified
                #hero-scroll-indicator,

                #hero .hero-actions-unified
                #btn-kenali {

                    position:
                        relative !important;

                    top:
                        auto !important;

                    bottom:
                        auto !important;

                    left:
                        auto !important;

                    right:
                        auto !important;

                    margin:
                        0 !important;

                    height:
                        44px !important;

                    min-height:
                        44px !important;

                    align-self:
                        stretch !important;

                    transform:
                        none !important;

                    box-sizing:
                        border-box !important;

                }


                /* =================================================
                   JELAJAHI
                   ================================================= */

                #hero .hero-actions-unified
                #hero-scroll-indicator {

                    flex:
                        1 1 0 !important;

                    min-width:
                        0 !important;

                    padding:
                        0
                        0.8rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator
                .scroll-label::before {

                    font-size:
                        0.61rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator
                .scroll-arrow svg {

                    width:
                        16px !important;

                    height:
                        16px !important;

                }


                /* =================================================
                   MENGENAI WEBSITE
                   ================================================= */

                #hero .hero-actions-unified
                #btn-kenali {

                    flex:
                        1 1 0 !important;

                    min-width:
                        0 !important;

                    padding:
                        0
                        0.8rem !important;

                    font-size:
                        0.63rem !important;

                }

            }


            /* =====================================================
               SMALL MOBILE
               ===================================================== */

            @media (max-width: 374px) {

                #hero .hero-actions-unified {

                    gap:
                        0.4rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator,

                #hero .hero-actions-unified
                #btn-kenali {

                    height:
                        42px !important;

                    min-height:
                        42px !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator {

                    padding:
                        0
                        0.55rem !important;

                }


                #hero .hero-actions-unified
                #btn-kenali {

                    padding:
                        0
                        0.55rem !important;

                    font-size:
                        0.55rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator
                .scroll-label::before {

                    font-size:
                        0.53rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator
                .scroll-arrow svg {

                    width:
                        14px !important;

                    height:
                        14px !important;

                }

            }


            /* =====================================================
               VERY SMALL MOBILE
               ===================================================== */

            @media (max-width: 340px) {

                #hero .hero-actions-unified {

                    gap:
                        0.32rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator {

                    padding:
                        0
                        0.42rem !important;

                }


                #hero .hero-actions-unified
                #btn-kenali {

                    padding:
                        0
                        0.42rem !important;

                    font-size:
                        0.51rem !important;

                }


                #hero .hero-actions-unified
                #hero-scroll-indicator
                .scroll-label::before {

                    font-size:
                        0.49rem !important;

                }

            }

        `;


        document.head.appendChild(
            heroActionStyle
        );

    }


    // ================================================================
    // 2. NAVBAR
    // Transparan di hero, solid setelah scroll.
    // ================================================================

    var navbar =
        document.getElementById(
            'navbar'
        );

    var isHomeNavbar = !!(navbar && navbar.closest('#site-header'));

    var SCROLL_THRESHOLD = 60;


    function handleNavbarScroll() {
        if (!navbar) {
            return;
        }

        var shouldShowNavbar = window.scrollY > SCROLL_THRESHOLD;

        if (isHomeNavbar && heroSection) {
            var heroBottom = heroSection.getBoundingClientRect().bottom + window.scrollY;
            shouldShowNavbar = window.scrollY >= heroBottom;
        }

        if (shouldShowNavbar) {
            navbar.classList.add('scrolled', 'is-scrolled');
        } else {
            navbar.classList.remove('scrolled', 'is-scrolled');
        }
    }


    var heroSection =
        document.getElementById(
            'hero'
        ) || document.querySelector(
            '.editorial-hero, .stats-hero'
        );


    if (navbar) {

        if (heroSection) {

            window.addEventListener(
                'scroll',
                handleNavbarScroll,
                {
                    passive: true
                }
            );

            if (isHomeNavbar) {
                window.addEventListener('resize', handleNavbarScroll, { passive: true });
            }


            handleNavbarScroll();

        } else {

            navbar.classList.add('scrolled', 'is-scrolled');

        }

    }


    // ================================================================
    // 3. MOBILE DRAWER
    // ================================================================

    var hamburgers = Array.from(
        document.querySelectorAll('.nav-hamburger')
    );


    var drawer =
        document.getElementById(
            'drawer-menu'
        );


    var drawerBackdrop =
        document.getElementById(
            'drawer-backdrop'
        );


    var drawerClose =
        document.getElementById(
            'drawer-close'
        );


    function openDrawer() {

        if (!drawer) {
            return;
        }


        drawer.classList.add(
            'drawer-open'
        );


        drawer.setAttribute(
            'aria-hidden',
            'false'
        );


        if (drawerBackdrop) {

            drawerBackdrop.classList.add(
                'drawer-open'
            );


            drawerBackdrop.setAttribute(
                'aria-hidden',
                'false'
            );

        }


        hamburgers.forEach(function (hamburger) {
            hamburger.setAttribute('aria-expanded', 'true');
        });


        document.body.style.overflow =
            'hidden';


        if (drawerClose) {

            drawerClose.focus();

        }

    }


    function closeDrawer() {

        if (!drawer) {
            return;
        }


        drawer.classList.remove(
            'drawer-open'
        );


        drawer.setAttribute(
            'aria-hidden',
            'true'
        );


        if (drawerBackdrop) {

            drawerBackdrop.classList.remove(
                'drawer-open'
            );


            drawerBackdrop.setAttribute(
                'aria-hidden',
                'true'
            );

        }


        hamburgers.forEach(function (hamburger) {
            hamburger.setAttribute('aria-expanded', 'false');
        });


        document.body.style.overflow =
            '';

    }


    hamburgers.forEach(function (hamburger) {
        hamburger.addEventListener(
            'click',
            function () {

                var isOpen =
                    drawer &&
                    drawer.classList.contains(
                        'drawer-open'
                    );


                if (isOpen) {

                    closeDrawer();

                } else {

                    openDrawer();

                }

            }
        );
    });


    if (drawerClose) {

        drawerClose.addEventListener(
            'click',
            closeDrawer
        );

    }


    if (drawerBackdrop) {

        drawerBackdrop.addEventListener(
            'click',
            closeDrawer
        );

    }


    if (drawer) {

        var drawerLinks =
            drawer.querySelectorAll(
                '.drawer-link'
            );


        drawerLinks.forEach(
            function (link) {

                link.addEventListener(
                    'click',
                    function () {

                        closeDrawer();

                    }
                );

            }
        );

    }


    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key ===
                    'Escape' &&
                drawer &&
                drawer.classList.contains(
                    'drawer-open'
                )
            ) {

                closeDrawer();

            }

        }
    );


    // ================================================================
    // 4. HERO SCROLL BUTTON
    // ================================================================

    var scrollIndicator =
        document.getElementById(
            'hero-scroll-indicator'
        );


    heroSection =
        document.getElementById(
            'hero'
        );


    if (
        scrollIndicator &&
        heroSection
    ) {

        function scrollPastHero() {

            var firstSection =
                document.getElementById(
                    'tentang-singkat'
                );


            if (firstSection) {

                firstSection.scrollIntoView(
                    {
                        behavior:
                            'smooth',

                        block:
                            'start'
                    }
                );


                return;

            }


            var targetY =
                heroSection.offsetTop +
                heroSection.offsetHeight;


            window.scrollTo(
                {
                    top:
                        targetY,

                    behavior:
                        'smooth'
                }
            );

        }


        scrollIndicator.addEventListener(
            'click',
            scrollPastHero
        );


        scrollIndicator.addEventListener(
            'keydown',
            function (event) {

                if (
                    event.key ===
                        'Enter' ||
                    event.key ===
                        ' '
                ) {

                    event.preventDefault();

                    scrollPastHero();

                }

            }
        );

    }


    // ================================================================
    // 5. ACTIVE NAVIGATION LINK
    // ================================================================

    var currentPath =
        window.location.pathname;


    var navLinks =
        document.querySelectorAll(
            '.nav-menu a'
        );


    navLinks.forEach(
        function (link) {

            link.classList.remove(
                'active'
            );


            var linkHref =
                link.getAttribute(
                    'href'
                ) || '';


            if (
                linkHref &&
                (
                    currentPath.endsWith(
                        linkHref
                    ) ||
                    currentPath.endsWith(
                        linkHref.replace(
                            '../',
                            ''
                        )
                    )
                )
            ) {

                link.classList.add(
                    'active'
                );

            }


            if (
                (
                    currentPath === '/' ||
                    currentPath.endsWith(
                        '/index.html'
                    )
                ) &&
                (
                    linkHref ===
                        'index.html' ||
                    linkHref ===
                        '../index.html'
                )
            ) {

                link.classList.add(
                    'active'
                );

            }

        }
    );


    // ================================================================
    // 6. ONBOARDING
    // ================================================================

    var kenaliBtn =
        document.getElementById(
            'btn-kenali'
        );


    var onboarding =
        document.getElementById(
            'onboarding'
        );


    var onboardingTrack =
        document.getElementById(
            'ob-track'
        );


    var onboardingSkip =
        document.getElementById(
            'ob-skip'
        );


    var onboardingBack =
        document.getElementById(
            'ob-back'
        );


    var onboardingNext =
        document.getElementById(
            'ob-next'
        );


    var onboardingDots =
        document.querySelectorAll(
            '.ob-dot'
        );


    var ONBOARDING_TOTAL = 3;

    var onboardingCurrent = 0;

    var touchStartX = 0;


    function openOnboarding() {

        if (!onboarding) {
            return;
        }


        goToOnboardingSlide(
            0
        );


        onboarding.classList.add(
            'ob-active'
        );


        onboarding.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.style.overflow =
            'hidden';


        if (onboardingSkip) {

            onboardingSkip.focus();

        }

    }


    function closeOnboarding() {

        if (!onboarding) {
            return;
        }


        onboarding.classList.remove(
            'ob-active'
        );


        onboarding.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.style.overflow =
            '';


        if (kenaliBtn) {

            kenaliBtn.focus();

        }

    }


    function goToOnboardingSlide(
        index
    ) {

        onboardingCurrent =
            index;


        if (onboardingTrack) {

            onboardingTrack.style.transform =
                'translateX(-' +
                (
                    index *
                    100
                ) +
                '%)';

        }


        if (onboarding) {

            onboarding.classList.remove(
                'ob-at-0',
                'ob-at-1',
                'ob-at-2'
            );


            onboarding.classList.add(
                'ob-at-' +
                index
            );

        }


        onboardingDots.forEach(
            function (
                dot,
                dotIndex
            ) {

                var isActive =
                    dotIndex ===
                    index;


                dot.classList.toggle(
                    'active',
                    isActive
                );


                dot.setAttribute(
                    'aria-selected',
                    isActive
                        ? 'true'
                        : 'false'
                );

            }
        );


        if (onboardingBack) {

            onboardingBack.classList.toggle(
                'ob-hidden',
                index === 0
            );

        }


        if (onboardingNext) {

            onboardingNext.textContent =
                index ===
                ONBOARDING_TOTAL - 1
                    ? 'Mulai Jelajahi'
                    : 'Selanjutnya';

        }

    }


    if (
        kenaliBtn &&
        onboarding
    ) {

        kenaliBtn.addEventListener(
            'click',
            openOnboarding
        );

    }


    if (onboardingSkip) {

        onboardingSkip.addEventListener(
            'click',
            closeOnboarding
        );

    }


    if (onboardingBack) {

        onboardingBack.addEventListener(
            'click',
            function () {

                if (
                    onboardingCurrent >
                    0
                ) {

                    goToOnboardingSlide(
                        onboardingCurrent -
                        1
                    );

                }

            }
        );

    }


    if (onboardingNext) {

        onboardingNext.addEventListener(
            'click',
            function () {

                if (
                    onboardingCurrent <
                    ONBOARDING_TOTAL - 1
                ) {

                    goToOnboardingSlide(
                        onboardingCurrent +
                        1
                    );

                } else {

                    closeOnboarding();


                    var firstSection =
                        document.getElementById(
                            'tentang-singkat'
                        );


                    if (firstSection) {

                        setTimeout(
                            function () {

                                firstSection.scrollIntoView(
                                    {
                                        behavior:
                                            'smooth',

                                        block:
                                            'start'
                                    }
                                );

                            },
                            300
                        );

                    }

                }

            }
        );

    }


    onboardingDots.forEach(
        function (dot) {

            dot.addEventListener(
                'click',
                function () {

                    var slideIndex =
                        parseInt(
                            dot.getAttribute(
                                'data-index'
                            ),
                            10
                        );


                    if (
                        !isNaN(
                            slideIndex
                        )
                    ) {

                        goToOnboardingSlide(
                            slideIndex
                        );

                    }

                }
            );

        }
    );


    // ================================================================
    // 7. ONBOARDING SWIPE
    // ================================================================

    if (onboarding) {

        onboarding.addEventListener(
            'touchstart',
            function (event) {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive: true
            }
        );


        onboarding.addEventListener(
            'touchend',
            function (event) {

                var touchEndX =
                    event.changedTouches[0]
                        .screenX;


                var difference =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(
                        difference
                    ) <
                    48
                ) {

                    return;

                }


                if (
                    difference >
                    0 &&
                    onboardingCurrent <
                    ONBOARDING_TOTAL - 1
                ) {

                    goToOnboardingSlide(
                        onboardingCurrent +
                        1
                    );

                }


                if (
                    difference <
                    0 &&
                    onboardingCurrent >
                    0
                ) {

                    goToOnboardingSlide(
                        onboardingCurrent -
                        1
                    );

                }

            },
            {
                passive: true
            }
        );

    }


    // ================================================================
    // 8. ESCAPE ONBOARDING
    // ================================================================

    document.addEventListener(
        'keydown',
        function (event) {

            if (
                event.key ===
                    'Escape' &&
                onboarding &&
                onboarding.classList.contains(
                    'ob-active'
                )
            ) {

                closeOnboarding();

            }

        }
    );

});
