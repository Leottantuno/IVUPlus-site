(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initHero() {
        var hero = document.querySelector('.hero');
        if (!hero) return;
        if (reducedMotion) {
            hero.classList.add('hero-loaded');
            return;
        }
        requestAnimationFrame(function () {
            hero.classList.add('hero-loaded');
        });
    }

    function initScrollReveal() {
        var nodes = document.querySelectorAll('.section-block, .feature-item, .step-item');
        if (!nodes.length) return;

        if (reducedMotion) {
            nodes.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        nodes.forEach(function (el) {
            el.classList.add('reveal-on-scroll');
        });

        document.querySelectorAll('.feature-grid').forEach(function (grid) {
            grid.querySelectorAll('.feature-item').forEach(function (el, index) {
                el.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 70 + 'ms');
            });
        });

        document.querySelectorAll('.steps-grid').forEach(function (grid) {
            grid.querySelectorAll('.step-item').forEach(function (el, index) {
                el.style.setProperty('--reveal-delay', index * 90 + 'ms');
            });
        });

        if (!('IntersectionObserver' in window)) {
            nodes.forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
        );

        nodes.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initHeaderScroll() {
        var header = document.querySelector('.site-header');
        if (!header || reducedMotion) return;

        var onScroll = function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHero();
        initScrollReveal();
        initHeaderScroll();
    });
})();
