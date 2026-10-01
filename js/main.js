/*
 * ================================================================
 * main.js
 * Website Profil Kelurahan Paslaten 1
 * ================================================================
 */

document.addEventListener(
    'DOMContentLoaded',
    function () {


        // ============================================================
        // 1. NAVBAR
        // ============================================================

        var navbar =
            document.getElementById(
                'navbar'
            );


        var heroSection =
            document.getElementById(
                'hero'
            );


        var SCROLL_THRESHOLD =
            60;


        function handleNavbarScroll() {

            if (!navbar) {
                return;
            }


            if (
                window.scrollY >
                SCROLL_THRESHOLD
            ) {

                navbar.classList.add(
                    'scrolled'
                );

            } else {

                navbar.classList.remove(
                    'scrolled'
                );

            }

        }


        if (navbar) {

            /*
             * BERANDA
             */

            if (heroSection) {

                window.addEventListener(
                    'scroll',
                    handleNavbarScroll,
                    {
                        passive: true
                    }
                );


                handleNavbarScroll();

            }

            /*
             * HALAMAN LAIN
             */

            else {

                navbar.classList.add(
                    'scrolled'
                );

            }

        }



        // ============================================================
        // 2. DRAWER MENU
        // ============================================================

        var hamburger =
            document.getElementById(
                'nav-hamburger'
            );


        var drawer =
            document.getElementById(
                'drawer-menu'
            );


        var backdrop =
            document.getElementById(
                'drawer-backdrop'
            );


        var drawerClose =
            document.getElementById(
                'drawer-close'
            );


        function drawerOpen() {

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


            if (backdrop) {

                backdrop.classList.add(
                    'drawer-open'
                );


                backdrop.setAttribute(
                    'aria-hidden',
                    'false'
                );

            }


            if (hamburger) {

                hamburger.setAttribute(
                    'aria-expanded',
                    'true'
                );

            }


            document.body.style.overflow =
                'hidden';


            if (drawerClose) {

                drawerClose.focus();

            }

        }


        function drawerCloseFn() {

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


            if (backdrop) {

                backdrop.classList.remove(
                    'drawer-open'
                );


                backdrop.setAttribute(
                    'aria-hidden',
                    'true'
                );

            }


            if (hamburger) {

                hamburger.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }


            document.body.style.overflow =
                '';


            if (hamburger) {

                hamburger.focus();

            }

        }


        /*
         * Hamburger
         */

        if (hamburger) {

            hamburger.addEventListener(
                'click',
                function () {

                    var isOpen =
                        drawer &&
                        drawer.classList.contains(
                            'drawer-open'
                        );


                    if (isOpen) {

                        drawerCloseFn();

                    } else {

                        drawerOpen();

                    }

                }
            );

        }


        /*
         * Close Button
         */

        if (drawerClose) {

            drawerClose.addEventListener(
                'click',
                drawerCloseFn
            );

        }


        /*
         * Backdrop
         */

        if (backdrop) {

            backdrop.addEventListener(
                'click',
                drawerCloseFn
            );

        }


        /*
         * Drawer Links
         */

        if (drawer) {

            drawer
                .querySelectorAll(
                    '.drawer-link'
                )
                .forEach(
                    function (link) {

                        link.addEventListener(
                            'click',
                            function () {

                                drawerCloseFn();

                            }
                        );

                    }
                );

        }


        /*
         * Escape
         */

        document.addEventListener(
            'keydown',
            function (e) {

                if (
                    e.key ===
                    'Escape' &&

                    drawer &&

                    drawer
                        .classList
                        .contains(
                            'drawer-open'
                        )
                ) {

                    drawerCloseFn();

                }

            }
        );



        // ============================================================
        // 3. HERO PANORAMA
        //
        // Tidak membutuhkan JavaScript.
        //
        // Animasi:
        // kiri → kanan → kiri
        //
        // dijalankan sepenuhnya melalui CSS:
        //
        // @keyframes heroPanHorizontal
        // ============================================================



        // ============================================================
        // 4. HERO SCROLL INDICATOR
        // ============================================================

        var scrollIndicator =
            document.getElementById(
                'hero-scroll-indicator'
            );


        if (
            scrollIndicator &&
            heroSection
        ) {

            function scrollPastHero() {

                var targetY =
                    heroSection.offsetTop +
                    heroSection.offsetHeight;


                window.scrollTo(
                    {
                        top: targetY,
                        behavior: 'smooth'
                    }
                );

            }


            /*
             * CLICK
             */

            scrollIndicator.addEventListener(
                'click',
                scrollPastHero
            );


            /*
             * KEYBOARD
             */

            scrollIndicator.addEventListener(
                'keydown',
                function (e) {

                    if (
                        e.key ===
                        'Enter' ||

                        e.key ===
                        ' '
                    ) {

                        e.preventDefault();


                        scrollPastHero();

                    }

                }
            );

        }



        // ============================================================
        // 5. ACTIVE NAV LINK
        // ============================================================

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


                /*
                 * Halaman normal
                 */

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


                /*
                 * Beranda
                 */

                if (
                    (
                        currentPath ===
                        '/' ||

                        currentPath.endsWith(
                            '/index.html'
                        )
                    )
                    &&
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



        // ============================================================
        // 6. ONBOARDING
        // ============================================================

        var kenaliBtn =
            document.getElementById(
                'btn-kenali'
            );


        var obOverlay =
            document.getElementById(
                'onboarding'
            );


        var obTrack =
            document.getElementById(
                'ob-track'
            );


        var obSkipBtn =
            document.getElementById(
                'ob-skip'
            );


        var obBackBtn =
            document.getElementById(
                'ob-back'
            );


        var obNextBtn =
            document.getElementById(
                'ob-next'
            );


        var obDotBtns =
            document.querySelectorAll(
                '.ob-dot'
            );


        var OB_TOTAL =
            3;


        var obCurrent =
            0;


        var obTouchX0 =
            0;


        var obTouchY0 =
            0;



        // ============================================================
        // OPEN ONBOARDING
        // ============================================================

        function obOpen() {

            if (!obOverlay) {
                return;
            }


            obGoTo(0);


            obOverlay.classList.add(
                'ob-active'
            );


            obOverlay.setAttribute(
                'aria-hidden',
                'false'
            );


            document.body.style.overflow =
                'hidden';


            if (obSkipBtn) {

                obSkipBtn.focus();

            }

        }



        // ============================================================
        // CLOSE ONBOARDING
        // ============================================================

        function obClose() {

            if (!obOverlay) {
                return;
            }


            obOverlay.classList.remove(
                'ob-active'
            );


            obOverlay.setAttribute(
                'aria-hidden',
                'true'
            );


            document.body.style.overflow =
                '';


            if (kenaliBtn) {

                kenaliBtn.focus();

            }

        }



        // ============================================================
        // MOVE ONBOARDING SLIDE
        // ============================================================

        function obGoTo(index) {

            /*
             * Prevent invalid slide
             */

            if (index < 0) {

                index = 0;

            }


            if (
                index >
                OB_TOTAL - 1
            ) {

                index =
                    OB_TOTAL - 1;

            }


            obCurrent =
                index;


            /*
             * Move track
             */

            if (obTrack) {

                obTrack.style.transform =
                    'translateX(-' +
                    (
                        index *
                        100
                    ) +
                    '%)';

            }


            /*
             * Background
             */

            if (obOverlay) {

                obOverlay
                    .classList
                    .remove(
                        'ob-at-0',
                        'ob-at-1',
                        'ob-at-2'
                    );


                obOverlay
                    .classList
                    .add(
                        'ob-at-' +
                        index
                    );

            }


            /*
             * Dots
             */

            obDotBtns.forEach(
                function (
                    dot,
                    i
                ) {

                    var isActive =
                        i ===
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


            /*
             * Back button
             */

            if (obBackBtn) {

                obBackBtn
                    .classList
                    .toggle(
                        'ob-hidden',
                        index === 0
                    );

            }


            /*
             * Next label
             */

            if (obNextBtn) {

                if (
                    index ===
                    OB_TOTAL - 1
                ) {

                    obNextBtn.textContent =
                        'Mulai Jelajahi';

                } else {

                    obNextBtn.textContent =
                        'Selanjutnya';

                }

            }

        }



        // ============================================================
        // OPEN BUTTON
        // ============================================================

        if (
            kenaliBtn &&
            obOverlay
        ) {

            kenaliBtn.addEventListener(
                'click',
                obOpen
            );

        }



        // ============================================================
        // SKIP
        // ============================================================

        if (obSkipBtn) {

            obSkipBtn.addEventListener(
                'click',
                obClose
            );

        }



        // ============================================================
        // BACK
        // ============================================================

        if (obBackBtn) {

            obBackBtn.addEventListener(
                'click',
                function () {

                    if (
                        obCurrent >
                        0
                    ) {

                        obGoTo(
                            obCurrent - 1
                        );

                    }

                }
            );

        }



        // ============================================================
        // NEXT
        // ============================================================

        if (obNextBtn) {

            obNextBtn.addEventListener(
                'click',
                function () {

                    /*
                     * Masih ada slide berikutnya
                     */

                    if (
                        obCurrent <
                        OB_TOTAL - 1
                    ) {

                        obGoTo(
                            obCurrent + 1
                        );

                    }

                    /*
                     * Slide terakhir
                     */

                    else {

                        obClose();


                        var firstSection =
                            document
                                .getElementById(
                                    'tentang-singkat'
                                );


                        if (firstSection) {

                            setTimeout(
                                function () {

                                    firstSection
                                        .scrollIntoView(
                                            {
                                                behavior:
                                                    'smooth'
                                            }
                                        );

                                },
                                350
                            );

                        }

                    }

                }
            );

        }



        // ============================================================
        // DOT NAVIGATION
        // ============================================================

        obDotBtns.forEach(
            function (dot) {

                dot.addEventListener(
                    'click',
                    function () {

                        var index =
                            parseInt(
                                dot.getAttribute(
                                    'data-index'
                                ),
                                10
                            );


                        if (
                            !isNaN(
                                index
                            )
                        ) {

                            obGoTo(
                                index
                            );

                        }

                    }
                );

            }
        );



        // ============================================================
        // ONBOARDING SWIPE
        // ============================================================

        if (obOverlay) {

            /*
             * TOUCH START
             */

            obOverlay.addEventListener(
                'touchstart',
                function (e) {

                    if (
                        !e.changedTouches ||
                        !e.changedTouches.length
                    ) {

                        return;

                    }


                    obTouchX0 =
                        e.changedTouches[0]
                            .screenX;


                    obTouchY0 =
                        e.changedTouches[0]
                            .screenY;

                },
                {
                    passive: true
                }
            );


            /*
             * TOUCH END
             */

            obOverlay.addEventListener(
                'touchend',
                function (e) {

                    if (
                        !e.changedTouches ||
                        !e.changedTouches.length
                    ) {

                        return;

                    }


                    var x1 =
                        e.changedTouches[0]
                            .screenX;


                    var y1 =
                        e.changedTouches[0]
                            .screenY;


                    var diffX =
                        obTouchX0 -
                        x1;


                    var diffY =
                        obTouchY0 -
                        y1;


                    /*
                     * Hanya horizontal swipe
                     */

                    if (
                        Math.abs(
                            diffX
                        ) >
                        48
                        &&
                        Math.abs(
                            diffX
                        ) >
                        Math.abs(
                            diffY
                        )
                    ) {

                        /*
                         * Swipe kiri
                         */

                        if (
                            diffX >
                            0
                            &&
                            obCurrent <
                            OB_TOTAL - 1
                        ) {

                            obGoTo(
                                obCurrent +
                                1
                            );

                        }


                        /*
                         * Swipe kanan
                         */

                        else if (
                            diffX <
                            0
                            &&
                            obCurrent >
                            0
                        ) {

                            obGoTo(
                                obCurrent -
                                1
                            );

                        }

                    }

                },
                {
                    passive: true
                }
            );

        }



        // ============================================================
        // ESCAPE
        // ============================================================

        document.addEventListener(
            'keydown',
            function (e) {

                if (
                    e.key ===
                    'Escape'
                    &&
                    obOverlay
                    &&
                    obOverlay
                        .classList
                        .contains(
                            'ob-active'
                        )
                ) {

                    obClose();

                }

            }
        );



        // ============================================================
        // 7. KARTU LINGKUNGAN INTERAKTIF
        // ============================================================

        var environmentCards =
            document.querySelectorAll(
                '.environment-card'
            );


        function setEnvironmentCardState(
            card,
            expanded
        ) {

            if (!card) {
                return;
            }


            card.classList.toggle(
                'is-expanded',
                expanded
            );


            card.setAttribute(
                'aria-expanded',
                expanded
                    ? 'true'
                    : 'false'
            );


            var detail =
                card.querySelector(
                    '.environment-card-detail'
                );


            if (detail) {

                detail.setAttribute(
                    'aria-hidden',
                    expanded
                        ? 'false'
                        : 'true'
                );

            }


            var label =
                card.querySelector(
                    '.environment-toggle-label'
                );


            if (
                label &&
                label.firstChild
            ) {

                label.firstChild.nodeValue =
                    expanded
                        ? 'Tutup komposisi '
                        : 'Lihat komposisi ';

            }

        }



        function toggleEnvironmentCard(
            card
        ) {

            var willOpen =
                !card
                    .classList
                    .contains(
                        'is-expanded'
                    );


            /*
             * Tutup card lain
             */

            environmentCards.forEach(
                function (
                    otherCard
                ) {

                    if (
                        otherCard !==
                        card
                    ) {

                        setEnvironmentCardState(
                            otherCard,
                            false
                        );

                    }

                }
            );


            /*
             * Toggle current card
             */

            setEnvironmentCardState(
                card,
                willOpen
            );

        }



        environmentCards.forEach(
            function (card) {

                /*
                 * CLICK
                 */

                card.addEventListener(
                    'click',
                    function () {

                        toggleEnvironmentCard(
                            card
                        );

                    }
                );


                /*
                 * KEYBOARD
                 */

                card.addEventListener(
                    'keydown',
                    function (e) {

                        if (
                            e.key ===
                            'Enter'
                            ||
                            e.key ===
                            ' '
                        ) {

                            e.preventDefault();


                            toggleEnvironmentCard(
                                card
                            );

                        }

                    }
                );

            }
        );

    }
);