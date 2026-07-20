/* ═══════════════════════════════════════════════════════════════
   SpeakUp Club — Landing Page JavaScript
   - Scroll-based navigation styling
   - Mobile menu toggle
   - Intersection Observer animations
   - Counter animation
   - Form validation & success state
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── DOM REFERENCES ─────────────────────────────────────── */
    const nav         = document.getElementById('nav');
    const burger      = document.getElementById('navBurger');
    const menu        = document.getElementById('navMenu');
    const form        = document.getElementById('signupForm');
    const successEl   = document.getElementById('signupSuccess');
    const counters    = document.querySelectorAll('[data-count]');
    const navLinks    = document.querySelectorAll('.nav__link');

    /* ── NAVIGATION: Scroll Effect ──────────────────────────── */
    function handleNavScroll() {
        if (window.scrollY > 60) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ── NAVIGATION: Mobile Menu ────────────────────────────── */
    burger.addEventListener('click', function () {
        const isOpen = burger.classList.toggle('active');
        menu.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            burger.classList.remove('active');
            menu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
        if (menu.classList.contains('active') && !menu.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            menu.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    /* ── SMOOTH SCROLL for anchor links ─────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight + 16;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ── INTERSECTION OBSERVER: Reveal Animations ───────────── */
    const revealElements = document.querySelectorAll(
        '.benefits__card, .schedule__card, .reviews__card'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry, index) {
                    if (entry.isIntersecting) {
                        // Staggered reveal
                        const siblings = Array.from(entry.target.parentElement.children).filter(function (el) {
                            return el.classList.contains(entry.target.classList[0]);
                        });
                        const siblingIndex = siblings.indexOf(entry.target);
                        const delay = siblingIndex * 120;

                        setTimeout(function () {
                            entry.target.classList.add('visible');
                        }, delay);

                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: just show everything
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ── COUNTER ANIMATION ──────────────────────────────────── */
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);

            // Format with spaces for thousands
            el.textContent = current.toLocaleString('ru-RU');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(function (c) {
            counterObserver.observe(c);
        });
    } else {
        counters.forEach(animateCounter);
    }

    /* ── FORM VALIDATION & SUBMISSION ───────────────────────── */
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(inputEl, errorEl, message) {
        inputEl.classList.add('error');
        errorEl.textContent = message;
    }

    function clearError(inputEl, errorEl) {
        inputEl.classList.remove('error');
        errorEl.textContent = '';
    }

    // Live validation & Phone Mask
    var nameInput  = document.getElementById('userName');
    var emailInput = document.getElementById('userEmail');
    var phoneInput = document.getElementById('userPhone');
    var nameError  = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');

    nameInput.addEventListener('input', function () {
        if (this.value.trim().length > 0) {
            clearError(this, nameError);
        }
    });

    emailInput.addEventListener('input', function () {
        if (validateEmail(this.value.trim())) {
            clearError(this, emailError);
        }
    });

    // Simple robust phone mask for Russian format
    phoneInput.addEventListener('input', function (e) {
        var input = this.value.replace(/\D/g, '');
        // Limit to 11 digits
        if (input.length > 11) {
            input = input.substring(0, 11);
        }
        
        var formatted = '';
        if (input.length > 0) {
            // Force first digit to 7 if user starts typing something else, or if it's 8
            if (input[0] === '8' || input[0] === '9') {
                if (input[0] === '9') {
                    input = '79' + input.substring(1);
                } else {
                    input = '7' + input.substring(1);
                }
            } else if (input[0] !== '7') {
                input = '7' + input;
            }
            
            formatted = '+7';
            if (input.length > 1) {
                formatted += ' (' + input.substring(1, 4);
            }
            if (input.length > 4) {
                formatted += ') ' + input.substring(4, 7);
            }
            if (input.length > 7) {
                formatted += '-' + input.substring(7, 9);
            }
            if (input.length > 9) {
                formatted += '-' + input.substring(9, 11);
            }
        }
        this.value = formatted;
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;

        // Name
        if (nameInput.value.trim().length < 2) {
            showError(nameInput, nameError, 'Введите ваше имя');
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        // Email
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Введите корректный email');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Phone validation (optional but if filled, must be complete)
        var phoneDigits = phoneInput.value.replace(/\D/g, '');
        if (phoneDigits.length > 0 && phoneDigits.length < 11) {
            phoneInput.classList.add('error');
            isValid = false;
        } else {
            phoneInput.classList.remove('error');
        }

        if (!isValid) return;

        // Simulate submit — show success
        var submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-loading"></span> Отправка...';

        setTimeout(function () {
            form.hidden = true;
            successEl.hidden = false;
        }, 1200);
    });

    /* ── ACTIVE NAV LINK ON SCROLL ──────────────────────────── */
    var sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        var scrollY = window.scrollY + nav.offsetHeight + 80;

        sections.forEach(function (section) {
            var top    = section.offsetTop;
            var height = section.offsetHeight;
            var id     = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
