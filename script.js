/**
 * Communally Website JavaScript
 * Mobile-first, accessible, performant
 */

(function() {
    'use strict';

    // ==========================================================================
    // Mobile Menu Toggle
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenuBtn.focus();
            }
        });
    }

    // ==========================================================================
    // Smooth Scroll for Anchor Links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // Navbar Scroll Effect
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.pageYOffset;

    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.pageYOffset;
            
            if (currentScrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // ==========================================================================
    // Scroll Reveal Animation (respects reduced motion)
    // ==========================================================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add reveal animation to cards
        const animateElements = document.querySelectorAll('.feature-card, .step-card, .testimonial-card, .faq-item');
        
        animateElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            revealObserver.observe(el);
        });

        // Add revealed class styles
        const style = document.createElement('style');
        style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(style);
    }

    // ==========================================================================
    // Phone Showcase 3D Effect (respects reduced motion)
    // ==========================================================================
    if (!prefersReducedMotion) {
        const phoneShowcase = document.querySelector('.hero-phone-showcase');
        const phoneFront = document.querySelector('.phone-front');
        const phoneBack = document.querySelector('.phone-back');

        if (phoneShowcase && phoneFront && phoneBack) {
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;
            let animationId;

            function animatePhones() {
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;

                const frontRotateY = 8 - currentX * 12;
                const frontRotateX = -4 + currentY * 8;
                phoneFront.style.transform = `rotateY(${frontRotateY}deg) rotateX(${frontRotateX}deg) rotateZ(-2deg) translateZ(30px)`;

                const backRotateY = -12 + currentX * 10;
                const backRotateX = 5 - currentY * 6;
                phoneBack.style.transform = `rotateY(${backRotateY}deg) rotateX(${backRotateX}deg) rotateZ(4deg)`;

                animationId = requestAnimationFrame(animatePhones);
            }

            phoneShowcase.addEventListener('mouseenter', () => {
                animationId = requestAnimationFrame(animatePhones);
            });

            phoneShowcase.addEventListener('mousemove', (e) => {
                const rect = phoneShowcase.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            });

            phoneShowcase.addEventListener('mouseleave', () => {
                cancelAnimationFrame(animationId);
                mouseX = 0;
                mouseY = 0;
                
                // Smoothly return to original position
                const returnInterval = setInterval(() => {
                    currentX += (0 - currentX) * 0.1;
                    currentY += (0 - currentY) * 0.1;
                    
                    phoneFront.style.transform = `rotateY(${8 - currentX * 12}deg) rotateX(${-4 + currentY * 8}deg) rotateZ(-2deg) translateZ(30px)`;
                    phoneBack.style.transform = `rotateY(${-12 + currentX * 10}deg) rotateX(${5 - currentY * 6}deg) rotateZ(4deg)`;
                    
                    if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
                        clearInterval(returnInterval);
                    }
                }, 16);
            });
        }
    }

    // ==========================================================================
    // Email Form Handling
    // ==========================================================================
    const emailForm = document.getElementById('emailForm');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Simple validation
            if (emailInput && emailInput.value) {
                // Show loading state
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call (replace with actual implementation)
                setTimeout(() => {
                    submitBtn.textContent = 'Subscribed!';
                    submitBtn.style.background = '#22c55e';
                    emailInput.value = '';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 3000);
                }, 1000);
            }
        });
    }

    // ==========================================================================
    // Contact Form Handling
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual implementation)
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#22c55e';
                this.reset();
                
                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 1000);
        });
    }

    // ==========================================================================
    // Scroll Progress Indicator (optional - respects reduced motion)
    // ==========================================================================
    if (!prefersReducedMotion) {
        const progressBar = document.createElement('div');
        progressBar.setAttribute('aria-hidden', 'true');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #22c55e, #a3e635);
            z-index: 9999;
            width: 0%;
            transition: width 0.1s ease-out;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ==========================================================================
    // Feature Card Hover Effect (respects reduced motion)
    // ==========================================================================
    if (!prefersReducedMotion) {
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

})();
