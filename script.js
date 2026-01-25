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
        init() {
            if (prefersReducedMotion()) return;
            
            if (CreativeConfig.features.timeAwareGreeting) {
                this.setTimeGreeting();
            }
            
            if (CreativeConfig.features.seasonalTheme) {
                this.setSeasonalTheme();
            }
            
            if (CreativeConfig.features.ambientCanvas) {
                this.initMapBackground();
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
         * Initialize animated Apple Maps-style background
         * Shows different US cities with moving user dots
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const canvas = document.getElementById('mapCanvas');
            const cityLabel = document.getElementById('cityLabel');
            
            if (!canvas || !container) return;
            
            const ctx = canvas.getContext('2d');
            let animationId;
            
            // City data with different road patterns
            const cities = [
                { name: 'New York, NY', grid: 'manhattan', color: '#e8e4df' },
                { name: 'San Francisco, CA', grid: 'hills', color: '#e5e8e4' },
                { name: 'Austin, TX', grid: 'sprawl', color: '#e8e6e2' },
                { name: 'Seattle, WA', grid: 'waterfront', color: '#e2e6e8' },
                { name: 'Chicago, IL', grid: 'grid', color: '#e6e4e2' },
                { name: 'Miami, FL', grid: 'coastal', color: '#e4e8e6' },
                { name: 'Denver, CO', grid: 'mountain', color: '#e8e6e4' },
                { name: 'Portland, OR', grid: 'bridges', color: '#e4e6e4' },
                { name: 'Boston, MA', grid: 'old', color: '#e6e4e0' },
                { name: 'Los Angeles, CA', grid: 'highways', color: '#e8e8e4' }
            ];
            
            let currentCityIndex = 0;
            let roads = [];
            let users = [];
            let parks = [];
            let transitionProgress = 1;
            
            // Resize canvas
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                generateCity(cities[currentCityIndex]);
            };
            
            // Generate road network for a city
            const generateCity = (city) => {
                roads = [];
                parks = [];
                const w = canvas.width;
                const h = canvas.height;
                
                // Base grid roads
                const gridSize = 80 + Math.random() * 40;
                
                // Horizontal roads
                for (let y = gridSize; y < h; y += gridSize + Math.random() * 30) {
                    const isMain = Math.random() > 0.7;
                    roads.push({
                        x1: 0,
                        y1: y + (Math.random() - 0.5) * 20,
                        x2: w,
                        y2: y + (Math.random() - 0.5) * 20,
                        width: isMain ? 3 : 1.5,
                        isMain
                    });
                }
                
                // Vertical roads
                for (let x = gridSize; x < w; x += gridSize + Math.random() * 30) {
                    const isMain = Math.random() > 0.7;
                    roads.push({
                        x1: x + (Math.random() - 0.5) * 20,
                        y1: 0,
                        x2: x + (Math.random() - 0.5) * 20,
                        y2: h,
                        width: isMain ? 3 : 1.5,
                        isMain
                    });
                }
                
                // Add diagonal roads for some cities
                if (city.grid === 'old' || city.grid === 'hills') {
                    for (let i = 0; i < 5; i++) {
                        const startX = Math.random() * w;
                        const startY = Math.random() * h;
                        roads.push({
                            x1: startX,
                            y1: startY,
                            x2: startX + (Math.random() - 0.5) * 400,
                            y2: startY + (Math.random() - 0.5) * 400,
                            width: 2,
                            isMain: true
                        });
                    }
                }
                
                // Add parks (green areas)
                const parkCount = 3 + Math.floor(Math.random() * 4);
                for (let i = 0; i < parkCount; i++) {
                    parks.push({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        radius: 30 + Math.random() * 60
                    });
                }
                
                // Generate users
                generateUsers();
            };
            
            // Generate moving users
            const generateUsers = () => {
                users = [];
                const userCount = 15 + Math.floor(Math.random() * 10);
                
                for (let i = 0; i < userCount; i++) {
                    // Pick a random road to follow
                    const road = roads[Math.floor(Math.random() * roads.length)];
                    const progress = Math.random();
                    
                    users.push({
                        x: road.x1 + (road.x2 - road.x1) * progress,
                        y: road.y1 + (road.y2 - road.y1) * progress,
                        road: road,
                        progress: progress,
                        speed: 0.0005 + Math.random() * 0.001,
                        direction: Math.random() > 0.5 ? 1 : -1,
                        size: 4 + Math.random() * 3,
                        pulsePhase: Math.random() * Math.PI * 2,
                        isActive: Math.random() > 0.3
                    });
                }
            };
            
            // Transition to next city
            const nextCity = () => {
                transitionProgress = 0;
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                
                // Show city label
                if (cityLabel) {
                    cityLabel.textContent = cities[currentCityIndex].name;
                    cityLabel.classList.add('visible');
                    
                    setTimeout(() => {
                        cityLabel.classList.remove('visible');
                    }, 3000);
                }
                
                // Generate new city after brief fade
                setTimeout(() => {
                    generateCity(cities[currentCityIndex]);
                }, 500);
            };
            
            // Animation loop
            const animate = () => {
                // Clear with city background color
                const city = cities[currentCityIndex];
                ctx.fillStyle = city.color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Handle transition
                if (transitionProgress < 1) {
                    transitionProgress += 0.02;
                }
                
                const alpha = Math.min(1, transitionProgress);
                
                // Draw parks (green areas)
                ctx.globalAlpha = alpha * 0.5;
                parks.forEach(park => {
                    const gradient = ctx.createRadialGradient(
                        park.x, park.y, 0,
                        park.x, park.y, park.radius
                    );
                    gradient.addColorStop(0, '#c7dfc7');
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(park.x, park.y, park.radius, 0, Math.PI * 2);
                    ctx.fill();
                });
                
                // Draw roads
                ctx.globalAlpha = alpha;
                roads.forEach(road => {
                    ctx.beginPath();
                    ctx.moveTo(road.x1, road.y1);
                    ctx.lineTo(road.x2, road.y2);
                    ctx.strokeStyle = road.isMain ? '#d4d0cc' : '#e0dcd8';
                    ctx.lineWidth = road.width;
                    ctx.stroke();
                });
                
                // Update and draw users
                const time = Date.now() * 0.001;
                users.forEach(user => {
                    // Move along road
                    user.progress += user.speed * user.direction;
                    
                    // Bounce at ends or switch roads
                    if (user.progress > 1 || user.progress < 0) {
                        user.direction *= -1;
                        user.progress = Math.max(0, Math.min(1, user.progress));
                        
                        // Sometimes switch to a different road
                        if (Math.random() > 0.5) {
                            user.road = roads[Math.floor(Math.random() * roads.length)];
                        }
                    }
                    
                    // Calculate position
                    user.x = user.road.x1 + (user.road.x2 - user.road.x1) * user.progress;
                    user.y = user.road.y1 + (user.road.y2 - user.road.y1) * user.progress;
                    
                    // Add slight wobble
                    user.x += Math.sin(time * 2 + user.pulsePhase) * 2;
                    user.y += Math.cos(time * 2 + user.pulsePhase) * 2;
                    
                    // Draw user dot
                    if (user.isActive) {
                        // Pulse effect
                        const pulse = 1 + Math.sin(time * 3 + user.pulsePhase) * 0.2;
                        
                        // Glow
                        ctx.globalAlpha = alpha * 0.3;
                        ctx.beginPath();
                        ctx.arc(user.x, user.y, user.size * 2 * pulse, 0, Math.PI * 2);
                        ctx.fillStyle = '#22c55e';
                        ctx.fill();
                        
                        // Core dot
                        ctx.globalAlpha = alpha * 0.9;
                        ctx.beginPath();
                        ctx.arc(user.x, user.y, user.size * pulse, 0, Math.PI * 2);
                        ctx.fillStyle = '#22c55e';
                        ctx.fill();
                        
                        // White center
                        ctx.globalAlpha = alpha;
                        ctx.beginPath();
                        ctx.arc(user.x, user.y, user.size * 0.4 * pulse, 0, Math.PI * 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                    }
                });
                
                ctx.globalAlpha = 1;
                animationId = requestAnimationFrame(animate);
            };
            
            // Initialize
            resize();
            window.addEventListener('resize', debounce(resize, 250));
            animate();
            
            // Change city every 8 seconds
            setInterval(nextCity, 8000);
            
            // Show first city label
            setTimeout(() => {
                if (cityLabel) {
                    cityLabel.textContent = cities[0].name;
                    cityLabel.classList.add('visible');
                    setTimeout(() => cityLabel.classList.remove('visible'), 3000);
                }
            }, 1000);
            
            // Fade map when scrolled
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 400) {
                    container.classList.add('faded');
                } else {
                    container.classList.remove('faded');
                }
            }, { passive: true });
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
    // EXPERIMENTAL LAYER: Enhanced UI Effects
    // ==========================================================================
    
    const ExperimentalLayer = {
        init() {
            this.initExperimentalToggle();
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
         * 3D Phone showcase with mouse parallax + floating cards
         */
        initPhoneShowcase() {
            if (prefersReducedMotion()) return;
            
            const showcase = document.querySelector('.hero-phone-showcase');
            const phoneFront = document.querySelector('.phone-front');
            const phoneBack = document.querySelector('.phone-back');
            const floatingCards = document.querySelectorAll('.floating-card');
            const floatingShapes = document.querySelectorAll('.floating-shape');
            
            if (!showcase || !phoneFront || !phoneBack) return;
            
            let mouseX = 0, mouseY = 0;
            let currentX = 0, currentY = 0;
            let isHovering = false;
            let animationId;
            
            const animate = () => {
                currentX += (mouseX - currentX) * 0.05;
                currentY += (mouseY - currentY) * 0.05;
                
                // Animate phones
                const frontRotateY = 8 - currentX * 12;
                const frontRotateX = -4 + currentY * 8;
                phoneFront.style.transform = `rotateY(${frontRotateY}deg) rotateX(${frontRotateX}deg) rotateZ(-2deg) translateZ(30px)`;
                
                const backRotateY = -12 + currentX * 10;
                const backRotateX = 5 - currentY * 6;
                phoneBack.style.transform = `rotateY(${backRotateY}deg) rotateX(${backRotateX}deg) rotateZ(4deg)`;
                
                // Animate floating cards with parallax
                floatingCards.forEach((card, index) => {
                    const speed = parseFloat(card.dataset.speed) || 1;
                    const offsetX = currentX * 30 * speed;
                    const offsetY = currentY * 20 * speed;
                    const rotateX = currentY * 5 * speed;
                    const rotateY = -currentX * 5 * speed;
                    
                    // Add unique offset based on index for variety
                    const phase = (index * 0.5);
                    card.style.transform = `
                        translateX(${offsetX}px) 
                        translateY(${offsetY}px) 
                        translateZ(${10 + index * 5}px)
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg)
                    `;
                });
                
                // Animate floating shapes
                floatingShapes.forEach((shape, index) => {
                    const speed = parseFloat(shape.dataset.speed) || 1;
                    const offsetX = currentX * 50 * speed;
                    const offsetY = currentY * 40 * speed;
                    shape.style.transform = `
                        translateX(${offsetX}px) 
                        translateY(${offsetY}px)
                        rotate(${currentX * 20}deg)
                    `;
                });
                
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
                    
                    // Reset phones
                    const frontRotateY = 8 - currentX * 12;
                    const frontRotateX = -4 + currentY * 8;
                    phoneFront.style.transform = `rotateY(${frontRotateY}deg) rotateX(${frontRotateX}deg) rotateZ(-2deg) translateZ(30px)`;
                    
                    const backRotateY = -12 + currentX * 10;
                    const backRotateX = 5 - currentY * 6;
                    phoneBack.style.transform = `rotateY(${backRotateY}deg) rotateX(${backRotateX}deg) rotateZ(4deg)`;
                    
                    // Reset floating cards
                    floatingCards.forEach((card) => {
                        const speed = parseFloat(card.dataset.speed) || 1;
                        const offsetX = currentX * 30 * speed;
                        const offsetY = currentY * 20 * speed;
                        card.style.transform = `
                            translateX(${offsetX}px) 
                            translateY(${offsetY}px) 
                            translateZ(0px)
                            rotateX(0deg) 
                            rotateY(0deg)
                        `;
                    });
                    
                    // Reset shapes
                    floatingShapes.forEach((shape) => {
                        const speed = parseFloat(shape.dataset.speed) || 1;
                        const offsetX = currentX * 50 * speed;
                        const offsetY = currentY * 40 * speed;
                        shape.style.transform = `
                            translateX(${offsetX}px) 
                            translateY(${offsetY}px)
                            rotate(${currentX * 20}deg)
                        `;
                    });
                    
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
