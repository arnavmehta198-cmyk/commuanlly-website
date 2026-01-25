/**
 * ==========================================================================
 * COMMUNALLY - CREATIVE SYSTEMS MODULE
 * ==========================================================================
 * 
 * ARCHITECTURE: 5-Layer Creative System
 * 
 * 1. CORE LAYER - Basic interactions (always active)
 * 2. AMBIENT LAYER - Living backgrounds, time-aware UI
 * 3. REFLECTIVE LAYER - Pauses, breathing space, emotional prompts
 * 4. EXPERIMENTAL LAYER - Diagonal scrolling, wild UI
 * 5. NARRATIVE LAYER - Poetic copy, growth indicators
 * 
 * DESIGN PHILOSOPHY:
 * - Features unlock progressively based on time spent and return visits
 * - First-time users see only the calm core experience
 * - Experimental features are opt-in or revealed naturally
 * - All animations respect prefers-reduced-motion
 * 
 * ==========================================================================
 */

(function() {
    'use strict';

    // ==========================================================================
    // CREATIVE SYSTEMS CONFIGURATION
    // Centralized settings for all creative features
    // ==========================================================================
    
    const CreativeConfig = {
        // Feature flags (can be toggled)
        features: {
            ambientCanvas: true,        // Living particle background
            globalPulse: true,          // Community heartbeat animation
            diagonalScroll: true,       // Experimental journey section
            livingStats: true,          // Numbers that breathe
            timeAwareGreeting: true,    // Time-of-day messaging
            seasonalTheme: true,        // Season-based colors
            constellations: true,       // Star visualization in CTA
            scrollSpeedColors: true,    // Color changes with scroll speed
            antiAddictive: true,        // "You've done enough" messages
            soundDesign: false,         // Ambient sounds (off by default)
        },
        
        // Timing settings
        timing: {
            pulseInterval: 4000,        // Global pulse frequency
            statUpdateInterval: 5000,   // Living stat animation
            enoughMessageDelay: 180000, // 3 minutes before "done enough" message
        },
        
        // Diagonal scroll settings
        diagonalScroll: {
            angle: 37,                  // Degrees (arctan(0.75))
            sensitivity: 1.5,           // Scroll multiplier
            maxX: 3,                    // Maximum X position (in node units)
            maxY: 3,                    // Maximum Y position (in node units)
        },
        
        // User state (persisted to localStorage)
        state: {
            visitCount: 0,
            totalTimeSpent: 0,
            experimentalMode: false,
            preferredMood: 'calm',
            lastVisit: null,
        }
    };

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    /**
     * Check if user prefers reduced motion
     */
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    /**
     * Get current time of day category
     */
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    };

    /**
     * Get current season
     */
    const getSeason = () => {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'fall';
        return 'winter';
    };

    /**
     * Load user state from localStorage
     */
    const loadState = () => {
        try {
            const saved = localStorage.getItem('communally_creative_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(CreativeConfig.state, parsed);
            }
        } catch (e) {
            console.log('Could not load creative state');
        }
    };

    /**
     * Save user state to localStorage
     */
    const saveState = () => {
        try {
            localStorage.setItem('communally_creative_state', 
                JSON.stringify(CreativeConfig.state));
        } catch (e) {
            console.log('Could not save creative state');
        }
    };

    /**
     * Debounce function for scroll handlers
     */
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // ==========================================================================
    // CORE LAYER: Basic Interactions
    // Always active, essential functionality
    // ==========================================================================
    
    const CoreLayer = {
        init() {
            this.initMobileMenu();
            this.initSmoothScroll();
            this.initNavbarScroll();
            this.initEmailForm();
            this.initContactForm();
            this.initFaqAccessibility();
        },

        /**
         * Mobile hamburger menu toggle
         */
        initMobileMenu() {
            const btn = document.getElementById('mobileMenuBtn');
            const nav = document.getElementById('navLinks');
            
            if (!btn || !nav) return;

            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', !isExpanded);
                nav.classList.toggle('active');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            // Close on link click
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    btn.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    btn.setAttribute('aria-expanded', 'false');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                    btn.focus();
                }
            });
        },

        /**
         * Smooth scroll for anchor links
         */
        initSmoothScroll() {
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
                            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                        });
                    }
                });
            });
        },

        /**
         * Navbar shadow on scroll
         */
        initNavbarScroll() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 50) {
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                } else {
                    navbar.style.boxShadow = 'none';
                }
            }, { passive: true });
        },

        /**
         * Email form with feedback
         */
        initEmailForm() {
            const form = document.getElementById('emailForm');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = this.querySelector('input[type="email"]');
                const btn = this.querySelector('button[type="submit"]');
                
                if (input && input.value) {
                    const originalText = btn.textContent;
                    btn.textContent = 'Joining...';
                    btn.disabled = true;
                    
                    // Simulate API call
                    setTimeout(() => {
                        btn.textContent = 'Welcome!';
                        btn.style.background = '#22c55e';
                        input.value = '';
                        
                        // REFLECTIVE LAYER: Show moment of silence
                        if (CreativeConfig.features.antiAddictive) {
                            ReflectiveLayer.showSilenceMoment("You're in. We'll be in touch.");
                        }
                        
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.disabled = false;
                            btn.style.background = '';
                        }, 3000);
                    }, 1000);
                }
            });
        },

        /**
         * Contact form handling
         */
        initContactForm() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const btn = this.querySelector('button[type="submit"]');
                
                const originalText = btn.textContent;
                btn.textContent = 'Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.textContent = 'Message Sent!';
                    btn.style.background = '#22c55e';
                    this.reset();
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 3000);
                }, 1000);
            });
        },

        /**
         * FAQ keyboard accessibility
         */
        initFaqAccessibility() {
            document.querySelectorAll('.faq-item summary').forEach(summary => {
                summary.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        summary.click();
                    }
                });
            });
        }
    };

    // ==========================================================================
    // AMBIENT LAYER: Living UI
    // Time-aware colors, particles, global pulse
    // ==========================================================================
    
    const AmbientLayer = {
        canvas: null,
        ctx: null,
        particles: [],
        animationId: null,
        
        init() {
            if (prefersReducedMotion()) return;
            
            if (CreativeConfig.features.timeAwareGreeting) {
                this.setTimeGreeting();
            }
            
            if (CreativeConfig.features.seasonalTheme) {
                this.setSeasonalTheme();
            }
            
            if (CreativeConfig.features.ambientCanvas) {
                this.initAmbientCanvas();
            }
            
            if (CreativeConfig.features.livingStats) {
                this.initLivingStats();
            }
            
            if (CreativeConfig.features.constellations) {
                this.initConstellations();
            }
            
            if (CreativeConfig.features.scrollSpeedColors) {
                this.initScrollSpeedColors();
            }
        },

        /**
         * NARRATIVE LAYER: Time-aware greeting
         * Changes message based on time of day
         */
        setTimeGreeting() {
            const greetingEl = document.querySelector('.greeting-text');
            if (!greetingEl) return;
            
            const timeOfDay = getTimeOfDay();
            const greetings = {
                morning: 'Good morning, neighbor',
                afternoon: 'Good afternoon, neighbor',
                evening: 'Good evening, neighbor',
                night: 'The neighborhood is quiet tonight'
            };
            
            greetingEl.textContent = greetings[timeOfDay];
            
            // Set time warmth CSS variable
            const warmth = {
                morning: 0.3,
                afternoon: 0,
                evening: 0.5,
                night: -0.3
            };
            document.documentElement.style.setProperty('--time-warmth', warmth[timeOfDay]);
        },

        /**
         * Set seasonal theme colors
         */
        setSeasonalTheme() {
            const season = getSeason();
            document.documentElement.setAttribute('data-season', season);
        },

        /**
         * Initialize ambient particle canvas
         * Renders subtle particles that respond to mouse
         */
        initAmbientCanvas() {
            this.canvas = document.getElementById('ambientCanvas');
            if (!this.canvas) return;
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            this.createParticles();
            this.animate();
            
            window.addEventListener('resize', debounce(() => {
                this.resizeCanvas();
                this.createParticles();
            }, 250));
            
            // Mouse interaction
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
            
            this.mouseX = () => mouseX;
            this.mouseY = () => mouseY;
        },

        resizeCanvas() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        },

        createParticles() {
            this.particles = [];
            const count = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 30000));
            
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    radius: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        },

        animate() {
            if (!this.ctx) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Get primary color from CSS
            const primaryColor = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-primary').trim() || '#22c55e';
            
            this.particles.forEach(p => {
                // Subtle mouse attraction
                const dx = this.mouseX() - p.x;
                const dy = this.mouseY() - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 200) {
                    p.vx += dx * 0.00003;
                    p.vy += dy * 0.00003;
                }
                
                // Update position
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around edges
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;
                
                // Draw particle
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = primaryColor;
                this.ctx.globalAlpha = p.opacity;
                this.ctx.fill();
            });
            
            this.ctx.globalAlpha = 1;
            this.animationId = requestAnimationFrame(() => this.animate());
        },

        /**
         * Living stats - numbers that occasionally update
         */
        initLivingStats() {
            const stats = document.querySelectorAll('.living-stat');
            if (stats.length === 0) return;
            
            setInterval(() => {
                stats.forEach(stat => {
                    const base = parseInt(stat.dataset.base) || 5000;
                    const variation = Math.floor(Math.random() * 50) - 25;
                    const newValue = base + Math.floor(Math.random() * 500) + variation;
                    
                    // Animate the number change
                    stat.style.transition = 'transform 0.3s ease';
                    stat.style.transform = 'scale(1.05)';
                    
                    setTimeout(() => {
                        stat.textContent = newValue.toLocaleString() + '+';
                        stat.style.transform = 'scale(1)';
                    }, 150);
                });
            }, CreativeConfig.timing.statUpdateInterval);
        },

        /**
         * Constellation visualization in CTA section
         */
        initConstellations() {
            const container = document.getElementById('constellationBg');
            if (!container) return;
            
            // Create stars
            const starCount = 30;
            const stars = [];
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: rgba(255, 255, 255, ${0.3 + Math.random() * 0.7});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                container.appendChild(star);
                stars.push({
                    el: star,
                    x: parseFloat(star.style.left),
                    y: parseFloat(star.style.top)
                });
            }
            
            // Draw connections between nearby stars
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            `;
            container.appendChild(svg);
            
            stars.forEach((star, i) => {
                stars.slice(i + 1).forEach(otherStar => {
                    const dx = star.x - otherStar.x;
                    const dy = star.y - otherStar.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 25) { // Connect stars within 25% distance
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', star.x + '%');
                        line.setAttribute('y1', star.y + '%');
                        line.setAttribute('x2', otherStar.x + '%');
                        line.setAttribute('y2', otherStar.y + '%');
                        line.setAttribute('stroke', 'rgba(255, 255, 255, 0.1)');
                        line.setAttribute('stroke-width', '1');
                        svg.appendChild(line);
                    }
                });
            });
        },

        /**
         * Color changes based on scroll speed
         * Fast = energetic, Slow = calm
         */
        initScrollSpeedColors() {
            let lastScrollY = window.pageYOffset;
            let lastTime = Date.now();
            let scrollSpeed = 0;
            
            window.addEventListener('scroll', () => {
                const currentY = window.pageYOffset;
                const currentTime = Date.now();
                const timeDiff = currentTime - lastTime;
                
                if (timeDiff > 0) {
                    scrollSpeed = Math.abs(currentY - lastScrollY) / timeDiff;
                }
                
                lastScrollY = currentY;
                lastTime = currentTime;
                
                // Set speed attribute for CSS
                if (scrollSpeed > 2) {
                    document.documentElement.setAttribute('data-scroll-speed', 'fast');
                } else if (scrollSpeed < 0.5) {
                    document.documentElement.setAttribute('data-scroll-speed', 'slow');
                } else {
                    document.documentElement.removeAttribute('data-scroll-speed');
                }
            }, { passive: true });
            
            // Reset speed attribute after scrolling stops
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    document.documentElement.removeAttribute('data-scroll-speed');
                }, 300);
            }, { passive: true });
        }
    };

    // ==========================================================================
    // REFLECTIVE LAYER: Pauses and Breathing Space
    // Moments of silence, emotional prompts
    // ==========================================================================
    
    const ReflectiveLayer = {
        init() {
            if (CreativeConfig.features.antiAddictive) {
                this.initAntiAddictive();
            }
            
            this.initScrollReveal();
        },

        /**
         * Scroll reveal animations
         */
        initScrollReveal() {
            if (prefersReducedMotion()) return;
            
            const revealElements = document.querySelectorAll(
                '.feature-card, .step-card, .testimonial-card, .faq-item'
            );
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-on-scroll', 'revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            revealElements.forEach((el, index) => {
                el.classList.add('reveal-on-scroll');
                el.style.transitionDelay = `${index * 0.05}s`;
                observer.observe(el);
            });
        },

        /**
         * Anti-addictive design: gentle encouragement to leave
         */
        initAntiAddictive() {
            // Show "you've done enough" message after spending time on site
            setTimeout(() => {
                this.showEnoughMessage();
            }, CreativeConfig.timing.enoughMessageDelay);
        },

        /**
         * Show the "done enough" message
         */
        showEnoughMessage() {
            // Only show if user has scrolled significantly
            if (window.pageYOffset < 500) return;
            
            let msg = document.querySelector('.enough-message');
            if (!msg) {
                msg = document.createElement('div');
                msg.className = 'enough-message';
                msg.textContent = "You've explored plenty. Maybe it's time to go outside.";
                document.body.appendChild(msg);
            }
            
            setTimeout(() => {
                msg.classList.add('visible');
            }, 100);
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                msg.classList.remove('visible');
            }, 10000);
        },

        /**
         * Show a moment of silence (brief pause after meaningful action)
         */
        showSilenceMoment(message) {
            if (prefersReducedMotion()) return;
            
            let overlay = document.querySelector('.silence-moment');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'silence-moment';
                overlay.innerHTML = `<p class="silence-message">${message}</p>`;
                document.body.appendChild(overlay);
            } else {
                overlay.querySelector('.silence-message').textContent = message;
            }
            
            overlay.classList.add('active');
            
            // Auto-dismiss after 2 seconds
            setTimeout(() => {
                overlay.classList.remove('active');
            }, 2000);
        }
    };

    // ==========================================================================
    // EXPERIMENTAL LAYER: Diagonal Scrolling & Wild UI
    // ==========================================================================
    
    const ExperimentalLayer = {
        journeySection: null,
        journeyCanvas: null,
        isActive: false,
        position: { x: 0, y: 0 },
        targetPosition: { x: 0, y: 0 },
        animationId: null,
        
        init() {
            this.initExperimentalToggle();
            
            if (CreativeConfig.features.diagonalScroll && !prefersReducedMotion()) {
                this.initDiagonalScroll();
            }
            
            this.initPhoneShowcase();
        },

        /**
         * Experimental mode toggle button
         */
        initExperimentalToggle() {
            const toggle = document.getElementById('experimentalToggle');
            if (!toggle) return;
            
            // Load saved state
            if (CreativeConfig.state.experimentalMode) {
                toggle.setAttribute('aria-pressed', 'true');
                document.documentElement.setAttribute('data-experimental', 'true');
            }
            
            toggle.addEventListener('click', () => {
                const isPressed = toggle.getAttribute('aria-pressed') === 'true';
                toggle.setAttribute('aria-pressed', !isPressed);
                
                CreativeConfig.state.experimentalMode = !isPressed;
                document.documentElement.setAttribute('data-experimental', !isPressed);
                saveState();
                
                // Provide feedback
                if (!isPressed) {
                    ReflectiveLayer.showSilenceMoment('Experimental mode activated ✧');
                }
            });
        },

        /**
         * =================================================================
         * DIAGONAL SCROLLING IMPLEMENTATION
         * =================================================================
         * 
         * CONCEPT:
         * Instead of vertical scroll, the Journey section moves diagonally.
         * Content is positioned on a 2D canvas and users traverse it
         * at approximately 37° angle (arctan(0.75)).
         * 
         * MATH:
         * - angle = 37° means tan(37°) ≈ 0.75
         * - For scroll delta d: ΔX = d * cos(37°) ≈ d * 0.8
         *                       ΔY = d * sin(37°) ≈ d * 0.6
         * 
         * This creates natural diagonal movement that feels like
         * exploring a canvas rather than reading a document.
         * 
         * ACCESSIBILITY:
         * - "Return to Normal Scroll" button always visible
         * - Falls back to vertical layout with reduced-motion
         * - All content remains keyboard accessible
         */
        initDiagonalScroll() {
            this.journeySection = document.getElementById('journey');
            this.journeyCanvas = document.getElementById('journeyCanvas');
            const escapeBtn = document.getElementById('journeyEscape');
            
            if (!this.journeySection || !this.journeyCanvas) return;
            
            // Configuration
            const config = CreativeConfig.diagonalScroll;
            const angleRad = (config.angle * Math.PI) / 180;
            const cosAngle = Math.cos(angleRad);  // ≈ 0.8
            const sinAngle = Math.sin(angleRad);  // ≈ 0.6
            
            // Escape button: return to normal scroll
            if (escapeBtn) {
                escapeBtn.addEventListener('click', () => {
                    this.journeySection.classList.add('normal-scroll');
                    this.isActive = false;
                    if (this.animationId) {
                        cancelAnimationFrame(this.animationId);
                    }
                });
            }
            
            // Set up scroll handling when section is in view
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        this.activateDiagonalScroll();
                    } else if (!entry.isIntersecting) {
                        this.deactivateDiagonalScroll();
                    }
                });
            }, { threshold: [0, 0.3, 1] });
            
            sectionObserver.observe(this.journeySection);
            
            // Handle scroll/wheel events
            let accumulatedScroll = 0;
            
            const handleScroll = (e) => {
                if (!this.isActive) return;
                if (this.journeySection.classList.contains('normal-scroll')) return;
                
                e.preventDefault();
                
                // Get scroll delta (normalize for different input devices)
                let delta = e.deltaY;
                if (e.deltaMode === 1) delta *= 40; // Line mode
                if (e.deltaMode === 2) delta *= 800; // Page mode
                
                // Apply sensitivity
                delta *= config.sensitivity;
                
                // Calculate diagonal movement
                // Movement along diagonal: ΔX = delta * cos(θ), ΔY = delta * sin(θ)
                const moveX = delta * cosAngle * 0.15;
                const moveY = delta * sinAngle * 0.15;
                
                // Update target position
                this.targetPosition.x = Math.max(0, Math.min(
                    this.targetPosition.x + moveX,
                    config.maxX * 100 // Convert to viewport units
                ));
                
                this.targetPosition.y = Math.max(0, Math.min(
                    this.targetPosition.y + moveY,
                    config.maxY * 100
                ));
            };
            
            // Use wheel event for diagonal section
            this.journeySection.addEventListener('wheel', handleScroll, { passive: false });
            
            // Touch handling for mobile
            let touchStartY = 0;
            this.journeySection.addEventListener('touchstart', (e) => {
                if (!this.isActive) return;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            this.journeySection.addEventListener('touchmove', (e) => {
                if (!this.isActive) return;
                if (this.journeySection.classList.contains('normal-scroll')) return;
                
                const touchY = e.touches[0].clientY;
                const delta = (touchStartY - touchY) * 2;
                touchStartY = touchY;
                
                const moveX = delta * cosAngle * 0.15;
                const moveY = delta * sinAngle * 0.15;
                
                this.targetPosition.x = Math.max(0, Math.min(
                    this.targetPosition.x + moveX,
                    config.maxX * 100
                ));
                
                this.targetPosition.y = Math.max(0, Math.min(
                    this.targetPosition.y + moveY,
                    config.maxY * 100
                ));
            }, { passive: true });
            
            // Animation loop for smooth movement
            const animate = () => {
                // Ease toward target position
                const easing = 0.08;
                this.position.x += (this.targetPosition.x - this.position.x) * easing;
                this.position.y += (this.targetPosition.y - this.position.y) * easing;
                
                // Apply transform
                this.journeyCanvas.style.transform = 
                    `translate(${-this.position.x}vw, ${-this.position.y}vh)`;
                
                // Update node visibility based on position
                this.updateNodeVisibility();
                
                // Update progress indicator
                this.updateProgress();
                
                if (this.isActive) {
                    this.animationId = requestAnimationFrame(animate);
                }
            };
            
            this.animate = animate;
        },

        /**
         * Activate diagonal scroll mode
         */
        activateDiagonalScroll() {
            if (this.isActive) return;
            if (this.journeySection.classList.contains('normal-scroll')) return;
            
            this.isActive = true;
            document.body.style.overflow = 'hidden';
            
            // Start animation
            if (this.animate) {
                this.animationId = requestAnimationFrame(this.animate);
            }
        },

        /**
         * Deactivate diagonal scroll mode
         */
        deactivateDiagonalScroll() {
            if (!this.isActive) return;
            
            this.isActive = false;
            document.body.style.overflow = '';
            
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        },

        /**
         * Update which journey nodes are visible/active
         */
        updateNodeVisibility() {
            const nodes = document.querySelectorAll('.journey-node');
            const reflection = document.querySelector('.journey-reflection');
            
            nodes.forEach(node => {
                const nodeX = parseInt(node.style.getPropertyValue('--node-x')) || 0;
                const nodeY = parseInt(node.style.getPropertyValue('--node-y')) || 0;
                
                // Calculate distance from current position to node
                const distX = Math.abs(this.position.x - nodeX * 25);
                const distY = Math.abs(this.position.y - nodeY * 20);
                const dist = Math.sqrt(distX * distX + distY * distY);
                
                // Activate node if close enough
                if (dist < 30) {
                    node.classList.add('active');
                } else {
                    node.classList.remove('active');
                }
            });
            
            // Show reflection at the end
            if (reflection) {
                const refX = parseInt(reflection.style.getPropertyValue('--node-x')) || 4;
                const refY = parseInt(reflection.style.getPropertyValue('--node-y')) || 4;
                const distX = Math.abs(this.position.x - refX * 25);
                const distY = Math.abs(this.position.y - refY * 20);
                
                if (distX < 40 && distY < 40) {
                    reflection.classList.add('visible');
                }
            }
        },

        /**
         * Update progress indicator
         */
        updateProgress() {
            const config = CreativeConfig.diagonalScroll;
            const maxDist = Math.sqrt(
                Math.pow(config.maxX * 100, 2) + 
                Math.pow(config.maxY * 100, 2)
            );
            const currentDist = Math.sqrt(
                Math.pow(this.position.x, 2) + 
                Math.pow(this.position.y, 2)
            );
            const progress = currentDist / maxDist;
            
            const progressLabel = document.querySelector('.progress-label');
            if (progressLabel) {
                if (progress < 0.1) {
                    progressLabel.textContent = 'Scroll to explore';
                } else if (progress < 0.5) {
                    progressLabel.textContent = 'Keep going...';
                } else if (progress < 0.9) {
                    progressLabel.textContent = 'Almost there';
                } else {
                    progressLabel.textContent = 'You made it';
                }
            }
        },

        /**
         * 3D Phone showcase with mouse parallax
         */
        initPhoneShowcase() {
            if (prefersReducedMotion()) return;
            
            const showcase = document.querySelector('.hero-phone-showcase');
            const phoneFront = document.querySelector('.phone-front');
            const phoneBack = document.querySelector('.phone-back');
            
            if (!showcase || !phoneFront || !phoneBack) return;
            
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;
            let isHovering = false;
            let animationId;
            
            const animate = () => {
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;
                
                const frontRotateY = 8 - currentX * 12;
                const frontRotateX = -4 + currentY * 8;
                phoneFront.style.transform = `rotateY(${frontRotateY}deg) rotateX(${frontRotateX}deg) rotateZ(-2deg) translateZ(30px)`;
                
                const backRotateY = -12 + currentX * 10;
                const backRotateX = 5 - currentY * 6;
                phoneBack.style.transform = `rotateY(${backRotateY}deg) rotateX(${backRotateX}deg) rotateZ(4deg)`;
                
                if (isHovering) {
                    animationId = requestAnimationFrame(animate);
                }
            };
            
            showcase.addEventListener('mouseenter', () => {
                isHovering = true;
                animationId = requestAnimationFrame(animate);
            });
            
            showcase.addEventListener('mousemove', (e) => {
                const rect = showcase.getBoundingClientRect();
                mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            });
            
            showcase.addEventListener('mouseleave', () => {
                isHovering = false;
                cancelAnimationFrame(animationId);
                
                // Smoothly return to original position
                const returnToOrigin = () => {
                    currentX += (0 - currentX) * 0.1;
                    currentY += (0 - currentY) * 0.1;
                    
                    const frontRotateY = 8 - currentX * 12;
                    const frontRotateX = -4 + currentY * 8;
                    phoneFront.style.transform = `rotateY(${frontRotateY}deg) rotateX(${frontRotateX}deg) rotateZ(-2deg) translateZ(30px)`;
                    
                    const backRotateY = -12 + currentX * 10;
                    const backRotateX = 5 - currentY * 6;
                    phoneBack.style.transform = `rotateY(${backRotateY}deg) rotateX(${backRotateX}deg) rotateZ(4deg)`;
                    
                    if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
                        requestAnimationFrame(returnToOrigin);
                    }
                };
                returnToOrigin();
            });
        }
    };

    // ==========================================================================
    // NARRATIVE LAYER: Poetic Language & Growth
    // ==========================================================================
    
    const NarrativeLayer = {
        init() {
            this.trackVisits();
            this.updateForReturningUser();
        },

        /**
         * Track visit count and time spent
         */
        trackVisits() {
            // Increment visit count
            CreativeConfig.state.visitCount++;
            CreativeConfig.state.lastVisit = new Date().toISOString();
            saveState();
            
            // Track time spent
            setInterval(() => {
                CreativeConfig.state.totalTimeSpent += 10;
                saveState();
            }, 10000);
        },

        /**
         * Customize experience for returning users
         */
        updateForReturningUser() {
            const visits = CreativeConfig.state.visitCount;
            
            // After 3+ visits, show "welcome back" message
            if (visits >= 3) {
                const greeting = document.querySelector('.greeting-text');
                if (greeting) {
                    const timeOfDay = getTimeOfDay();
                    greeting.textContent = `Welcome back, neighbor`;
                }
            }
            
            // After 5+ visits, user has "grown"
            if (visits >= 5) {
                // Could unlock additional features or change language
                console.log('User is a returning neighbor');
            }
        }
    };

    // ==========================================================================
    // SCROLL PROGRESS INDICATOR
    // ==========================================================================
    
    const initScrollProgress = () => {
        if (prefersReducedMotion()) return;
        
        const progressBar = document.createElement('div');
        progressBar.setAttribute('aria-hidden', 'true');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
            z-index: 9999;
            width: 0%;
            transition: width 0.1s ease-out;
            pointer-events: none;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        }, { passive: true });
    };

    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    const init = () => {
        // Load persisted state
        loadState();
        
        // Initialize all layers
        CoreLayer.init();
        
        // Ambient and Reflective layers load after a brief delay
        // This ensures the core experience loads first
        setTimeout(() => {
            AmbientLayer.init();
            ReflectiveLayer.init();
        }, 100);
        
        // Experimental layer loads last
        setTimeout(() => {
            ExperimentalLayer.init();
            NarrativeLayer.init();
            initScrollProgress();
        }, 200);
        
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ✧ COMMUNALLY CREATIVE SYSTEMS ✧                            ║
║                                                               ║
║   This website implements a 5-layer creative architecture:   ║
║                                                               ║
║   1. CORE      - Basic interactions                          ║
║   2. AMBIENT   - Living backgrounds, time-aware UI           ║
║   3. REFLECTIVE - Pauses, breathing space                    ║
║   4. EXPERIMENTAL - Diagonal scroll, wild UI                 ║
║   5. NARRATIVE - Poetic copy, growth indicators              ║
║                                                               ║
║   Toggle experimental mode with the ✧ button in the nav.     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
