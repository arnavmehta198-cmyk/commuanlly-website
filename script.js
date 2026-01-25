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
         * Initialize Apple Maps-Style Interactive Map
         * Optimized for smooth, lag-free animations
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const mapContainer = document.getElementById('mapContainer');
            const cityLabel = document.getElementById('cityLabel');
            const userCardsContainer = document.getElementById('mapUserCards');
            
            if (!mapContainer || !container || typeof L === 'undefined') return;
            
            // US Cities
            const cities = [
                {
                    name: 'San Francisco',
                    state: 'CA',
                    coords: [37.7749, -122.4194],
                    users: [
                        { name: 'Alex K.', avatar: '👨', activity: 'Moving furniture in SOMA', badge: '💪 Strong', color: '#3b82f6' },
                        { name: 'Jordan T.', avatar: '🧑', activity: 'Pet sitting in Mission', badge: '🐕 Pet pro', color: '#22c55e' },
                        { name: 'Sam R.', avatar: '👩', activity: 'Grocery delivery', badge: '⚡ Quick', color: '#f59e0b' }
                    ]
                },
                {
                    name: 'New York City',
                    state: 'NY',
                    coords: [40.7128, -74.0060],
                    users: [
                        { name: 'Sarah M.', avatar: '👩', activity: 'Walking dogs in Brooklyn', badge: '⭐ Top', color: '#3b82f6' },
                        { name: 'Mike R.', avatar: '👨', activity: 'Helping with groceries', badge: '🏆 5 jobs', color: '#22c55e' },
                        { name: 'Emma L.', avatar: '👩‍🦰', activity: 'Tutoring in Manhattan', badge: '✨ New', color: '#a855f7' }
                    ]
                },
                {
                    name: 'Los Angeles',
                    state: 'CA',
                    coords: [34.0522, -118.2437],
                    users: [
                        { name: 'Kai M.', avatar: '🧑', activity: 'Car detailing', badge: '🚗 Pro', color: '#f59e0b' },
                        { name: 'Sage L.', avatar: '👩', activity: 'Meal prep help', badge: '🍳 Chef', color: '#22c55e' }
                    ]
                },
                {
                    name: 'Chicago',
                    state: 'IL',
                    coords: [41.8781, -87.6298],
                    users: [
                        { name: 'Jamie W.', avatar: '👨', activity: 'Helping in Lincoln Park', badge: '❄️ Reliable', color: '#3b82f6' },
                        { name: 'Drew M.', avatar: '🧑', activity: 'Furniture assembly', badge: '🔧 Handy', color: '#22c55e' }
                    ]
                },
                {
                    name: 'Austin',
                    state: 'TX',
                    coords: [30.2672, -97.7431],
                    users: [
                        { name: 'Chris B.', avatar: '👨', activity: 'Yard work downtown', badge: '🌱 Garden', color: '#22c55e' },
                        { name: 'Taylor S.', avatar: '👩', activity: 'Running errands', badge: '⚡ Fast', color: '#f59e0b' }
                    ]
                },
                {
                    name: 'Seattle',
                    state: 'WA',
                    coords: [47.6062, -122.3321],
                    users: [
                        { name: 'Casey H.', avatar: '👩', activity: 'Coffee delivery', badge: '☕ Local', color: '#f59e0b' },
                        { name: 'Riley N.', avatar: '🧑', activity: 'Dog walking', badge: '🐾 Pet lover', color: '#22c55e' }
                    ]
                },
                {
                    name: 'Miami',
                    state: 'FL',
                    coords: [25.7617, -80.1918],
                    users: [
                        { name: 'Nico V.', avatar: '👨', activity: 'Beach cleanup', badge: '🌴 Hero', color: '#22c55e' },
                        { name: 'Luna R.', avatar: '👩', activity: 'Spanish tutoring', badge: '📚 Tutor', color: '#3b82f6' }
                    ]
                }
            ];
            
            let currentCityIndex = 0;
            let map = null;
            let markersLayer = null;
            let isAnimating = false;
            
            const ZOOM_CITY = 13;
            
            // Add optimized styles
            const addMapStyles = () => {
                const style = document.createElement('style');
                style.textContent = `
                    .leaflet-control-container,
                    .leaflet-control-attribution { display: none !important; }
                    
                    .leaflet-container {
                        background: #f0f4f8 !important;
                    }
                    
                    /* GPU-accelerated animations */
                    .leaflet-map-pane,
                    .leaflet-tile-pane,
                    .leaflet-marker-pane {
                        will-change: transform;
                        transform: translateZ(0);
                    }
                    
                    .leaflet-tile {
                        will-change: opacity;
                    }
                    
                    /* Simple clean pin */
                    .city-pin {
                        width: 32px;
                        height: 32px;
                        background: #ff3b30;
                        border: 3px solid white;
                        border-radius: 50%;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    }
                    
                    .city-pin::before {
                        content: '';
                        position: absolute;
                        inset: -8px;
                        border: 2px solid rgba(255, 59, 48, 0.4);
                        border-radius: 50%;
                        animation: pinRing 1.5s ease-out infinite;
                    }
                    
                    @keyframes pinRing {
                        0% { transform: scale(1); opacity: 1; }
                        100% { transform: scale(2); opacity: 0; }
                    }
                    
                    /* User markers */
                    .user-pin {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        background: #22c55e;
                    }
                    .user-pin.blue { background: #3b82f6; }
                    .user-pin.purple { background: #a855f7; }
                    .user-pin.orange { background: #f59e0b; }
                `;
                document.head.appendChild(style);
            };
            
            // Initialize map
            const initMap = () => {
                addMapStyles();
                
                map = L.map(mapContainer, {
                    center: cities[0].coords,
                    zoom: ZOOM_CITY,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    dragging: false,
                    keyboard: false,
                    touchZoom: false,
                    preferCanvas: true
                });
                
                // Simple, fast tile layer
                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 18,
                    updateWhenIdle: true,
                    updateWhenZooming: false,
                    keepBuffer: 4
                }).addTo(map);
                
                // Create markers layer
                markersLayer = L.layerGroup().addTo(map);
                
                // Show first city immediately
                showCity(cities[0]);
            };
            
            // Show city with markers
            const showCity = (city) => {
                markersLayer.clearLayers();
                
                // Add user markers
                city.users.forEach((user, i) => {
                    const angle = (i / city.users.length) * Math.PI * 2;
                    const r = 0.004;
                    const lat = city.coords[0] + Math.cos(angle) * r;
                    const lng = city.coords[1] + Math.sin(angle) * r * 1.5;
                    
                    const colorClass = user.color === '#3b82f6' ? 'blue' : 
                                       user.color === '#a855f7' ? 'purple' : 
                                       user.color === '#f59e0b' ? 'orange' : '';
                    
                    const icon = L.divIcon({
                        className: '',
                        html: `<div class="user-pin ${colorClass}">${user.avatar}</div>`,
                        iconSize: [32, 32],
                        iconAnchor: [16, 16]
                    });
                    
                    L.marker([lat, lng], { icon }).addTo(markersLayer);
                });
                
                // Add center pin
                const pinIcon = L.divIcon({
                    className: '',
                    html: '<div class="city-pin"></div>',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });
                L.marker(city.coords, { icon: pinIcon }).addTo(markersLayer);
                
                // Update UI
                updateUI(city);
            };
            
            // Card positions
            const cardPositions = [
                { left: '4%', top: '18%' },
                { right: '4%', top: '15%' },
                { left: '3%', top: '58%' },
                { right: '3%', top: '52%' },
            ];
            
            // Update UI elements
            const updateUI = (city) => {
                // City label
                if (cityLabel) {
                    cityLabel.querySelector('.city-name').textContent = `${city.name}, ${city.state}`;
                    cityLabel.querySelector('.city-users').textContent = `${city.users.length + 15} neighbors active`;
                    cityLabel.classList.add('visible');
                }
                
                // User cards
                if (userCardsContainer) {
                    userCardsContainer.innerHTML = city.users.map((user, i) => {
                        const pos = cardPositions[i % cardPositions.length];
                        const style = pos.left ? `left:${pos.left};top:${pos.top}` : `right:${pos.right};top:${pos.top}`;
                        return `
                            <div class="map-user-card" style="${style}">
                                <div class="user-card-header">
                                    <div class="user-avatar" style="background:${user.color}">
                                        <span class="avatar-emoji">${user.avatar}</span>
                                    </div>
                                    <div class="user-info">
                                        <div class="user-name">${user.name}</div>
                                        <div class="user-badge"><span>${user.badge}</span></div>
                                    </div>
                                </div>
                                <div class="user-activity">${user.activity}</div>
                            </div>
                        `;
                    }).join('');
                    
                    requestAnimationFrame(() => {
                        userCardsContainer.querySelectorAll('.map-user-card').forEach((card, i) => {
                            setTimeout(() => card.classList.add('visible'), i * 100);
                        });
                    });
                }
            };
            
            // Hide UI
            const hideUI = () => {
                if (cityLabel) cityLabel.classList.remove('visible');
                if (userCardsContainer) {
                    userCardsContainer.querySelectorAll('.map-user-card').forEach(c => c.classList.remove('visible'));
                }
            };
            
            // Smooth transition to next city
            const goToNextCity = () => {
                if (isAnimating) return;
                isAnimating = true;
                
                hideUI();
                
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                const nextCity = cities[currentCityIndex];
                
                // Clear markers before flying
                setTimeout(() => markersLayer.clearLayers(), 300);
                
                // Smooth fly
                setTimeout(() => {
                    map.flyTo(nextCity.coords, ZOOM_CITY, {
                        duration: 2,
                        easeLinearity: 0.5
                    });
                }, 400);
                
                // Show new city
                setTimeout(() => {
                    showCity(nextCity);
                    isAnimating = false;
                }, 2500);
            };
            
            // Initialize
            initMap();
            
            // City rotation every 6 seconds
            setInterval(goToNextCity, 6000);
            
            // Scroll fade
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        container.classList.toggle('faded', window.pageYOffset > 400);
                        ticking = false;
                    });
                    ticking = true;
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
