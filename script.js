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
         * Apple Maps–Identical Animated Map
         * Pixel-perfect Apple design system compliance
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const mapContainer = document.getElementById('mapContainer');
            const cityLabel = document.getElementById('cityLabel');
            const userCardsContainer = document.getElementById('mapUserCards');
            
            if (!mapContainer || !container || typeof L === 'undefined') return;
            
            // Locked city set (US only)
            const cities = [
                {
                    name: 'New York City',
                    state: 'NY',
                    coords: [40.7128, -74.0060],
                    members: [
                        { name: 'Sarah Mitchell', initial: 'S' },
                        { name: 'Michael Chen', initial: 'M' },
                        { name: 'Emma Wilson', initial: 'E' }
                    ]
                },
                {
                    name: 'Los Angeles',
                    state: 'CA',
                    coords: [34.0522, -118.2437],
                    members: [
                        { name: 'David Park', initial: 'D' },
                        { name: 'Sofia Garcia', initial: 'S' }
                    ]
                },
                {
                    name: 'San Francisco',
                    state: 'CA',
                    coords: [37.7749, -122.4194],
                    members: [
                        { name: 'Alex Kumar', initial: 'A' },
                        { name: 'Jordan Lee', initial: 'J' },
                        { name: 'Sam Rivera', initial: 'S' }
                    ]
                },
                {
                    name: 'Chicago',
                    state: 'IL',
                    coords: [41.8781, -87.6298],
                    members: [
                        { name: 'Jamie Walsh', initial: 'J' },
                        { name: 'Drew Morgan', initial: 'D' }
                    ]
                },
                {
                    name: 'Austin',
                    state: 'TX',
                    coords: [30.2672, -97.7431],
                    members: [
                        { name: 'Chris Bennett', initial: 'C' },
                        { name: 'Taylor Scott', initial: 'T' }
                    ]
                },
                {
                    name: 'Seattle',
                    state: 'WA',
                    coords: [47.6062, -122.3321],
                    members: [
                        { name: 'Casey Harper', initial: 'C' },
                        { name: 'Riley Nguyen', initial: 'R' }
                    ]
                },
                {
                    name: 'Miami',
                    state: 'FL',
                    coords: [25.7617, -80.1918],
                    members: [
                        { name: 'Nicolas Vega', initial: 'N' },
                        { name: 'Luna Rodriguez', initial: 'L' }
                    ]
                }
            ];
            
            let currentCityIndex = 0;
            let map = null;
            let markersLayer = null;
            let isAnimating = false;
            let cursor = null;
            
            // Apple system easing
            const APPLE_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
            const ZOOM_LEVEL = 13;
            
            // Inject Apple-exact styles
            const injectStyles = () => {
                const style = document.createElement('style');
                style.textContent = `
                    /* Hide all Leaflet chrome */
                    .leaflet-control-container,
                    .leaflet-control-attribution,
                    .leaflet-control-zoom { 
                        display: none !important; 
                    }
                    
                    /* Apple Maps base */
                    .leaflet-container {
                        background: #F5F5F7 !important;
                        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif;
                    }
                    
                    /* GPU acceleration */
                    .leaflet-map-pane,
                    .leaflet-tile-pane,
                    .leaflet-marker-pane,
                    .leaflet-tile {
                        will-change: transform;
                        transform: translateZ(0);
                        backface-visibility: hidden;
                    }
                    
                    /* Apple-style location pin */
                    .apple-map-pin {
                        width: 28px;
                        height: 28px;
                        background: #007AFF;
                        border-radius: 50%;
                        border: 3px solid #FFFFFF;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.3s ${APPLE_EASE};
                    }
                    
                    .apple-map-pin:hover {
                        transform: scale(1.05);
                    }
                    
                    /* Subtle pulse ring */
                    .apple-map-pin::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 28px;
                        height: 28px;
                        border: 1.5px solid rgba(0, 122, 255, 0.3);
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                        animation: applePulse 2.5s ${APPLE_EASE} infinite;
                    }
                    
                    @keyframes applePulse {
                        0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                        100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
                    }
                    
                    /* Member pin - neutral gray */
                    .member-pin {
                        width: 36px;
                        height: 36px;
                        background: #F5F5F7;
                        border-radius: 50%;
                        border: 2px solid #FFFFFF;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: #1D1D1F;
                        letter-spacing: -0.01em;
                        transition: transform 0.3s ${APPLE_EASE}, box-shadow 0.3s ${APPLE_EASE};
                    }
                    
                    .member-pin:hover {
                        transform: scale(1.05);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    
                    /* Apple cursor */
                    .apple-cursor {
                        position: fixed;
                        width: 20px;
                        height: 20px;
                        border: 1.5px solid rgba(0, 0, 0, 0.4);
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 100000;
                        transform: translate(-50%, -50%);
                        transition: transform 0.15s ${APPLE_EASE}, border-color 0.2s ${APPLE_EASE}, background 0.2s ${APPLE_EASE};
                        mix-blend-mode: exclusion;
                        background: transparent;
                    }
                    
                    .apple-cursor::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 4px;
                        height: 4px;
                        background: rgba(0, 0, 0, 0.5);
                        border-radius: 50%;
                        transform: translate(-50%, -50%);
                    }
                    
                    .apple-cursor.hovering {
                        transform: translate(-50%, -50%) scale(1.4);
                        border-color: rgba(0, 122, 255, 0.6);
                        background: rgba(0, 122, 255, 0.08);
                    }
                    
                    #mapContainer {
                        cursor: none !important;
                    }
                    
                    #mapContainer * {
                        cursor: none !important;
                    }
                    
                    /* Apple-style member card */
                    .apple-member-card {
                        position: absolute;
                        background: rgba(255, 255, 255, 0.72);
                        backdrop-filter: blur(20px) saturate(180%);
                        -webkit-backdrop-filter: blur(20px) saturate(180%);
                        border-radius: 16px;
                        padding: 16px;
                        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
                        border: 0.5px solid rgba(0, 0, 0, 0.06);
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        opacity: 0;
                        transform: translateY(12px);
                        transition: opacity 0.5s ${APPLE_EASE}, transform 0.5s ${APPLE_EASE}, box-shadow 0.3s ${APPLE_EASE};
                        z-index: 100;
                        min-width: 180px;
                    }
                    
                    .apple-member-card.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .apple-member-card:hover {
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
                    }
                    
                    .apple-member-avatar {
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #FFFFFF;
                        font-size: 16px;
                        font-weight: 500;
                        letter-spacing: -0.01em;
                        flex-shrink: 0;
                    }
                    
                    .apple-member-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }
                    
                    .apple-member-name {
                        font-size: 15px;
                        font-weight: 600;
                        color: #1D1D1F;
                        letter-spacing: -0.01em;
                        line-height: 1.2;
                    }
                    
                    .apple-member-role {
                        font-size: 13px;
                        font-weight: 400;
                        color: #86868B;
                        letter-spacing: -0.01em;
                        line-height: 1.3;
                    }
                    
                    /* City label - Apple style */
                    .city-label {
                        background: rgba(255, 255, 255, 0.72) !important;
                        backdrop-filter: blur(20px) saturate(180%) !important;
                        -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
                        border-radius: 12px !important;
                        border: 0.5px solid rgba(0, 0, 0, 0.06) !important;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
                        padding: 10px 16px !important;
                    }
                    
                    .city-label .city-name {
                        font-size: 15px !important;
                        font-weight: 600 !important;
                        color: #1D1D1F !important;
                        letter-spacing: -0.01em !important;
                    }
                    
                    .city-label .city-users {
                        font-size: 13px !important;
                        font-weight: 400 !important;
                        color: #86868B !important;
                    }
                `;
                document.head.appendChild(style);
            };
            
            // Create Apple cursor
            const createCursor = () => {
                cursor = document.createElement('div');
                cursor.className = 'apple-cursor';
                cursor.style.display = 'none';
                document.body.appendChild(cursor);
                
                let cursorX = 0, cursorY = 0;
                let currentX = 0, currentY = 0;
                
                mapContainer.addEventListener('mouseenter', () => cursor.style.display = 'block');
                mapContainer.addEventListener('mouseleave', () => cursor.style.display = 'none');
                
                document.addEventListener('mousemove', (e) => {
                    cursorX = e.clientX;
                    cursorY = e.clientY;
                });
                
                // Smooth trailing animation
                const animateCursor = () => {
                    currentX += (cursorX - currentX) * 0.15;
                    currentY += (cursorY - currentY) * 0.15;
                    cursor.style.left = currentX + 'px';
                    cursor.style.top = currentY + 'px';
                    requestAnimationFrame(animateCursor);
                };
                animateCursor();
            };
            
            // Initialize map
            const initMap = () => {
                injectStyles();
                createCursor();
                
                map = L.map(mapContainer, {
                    center: cities[0].coords,
                    zoom: ZOOM_LEVEL,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    dragging: false,
                    keyboard: false,
                    touchZoom: false,
                    preferCanvas: true,
                    zoomAnimation: true,
                    fadeAnimation: true,
                    markerZoomAnimation: true
                });
                
                // CartoDB Positron - closest to Apple Maps light
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    updateWhenIdle: true,
                    updateWhenZooming: false,
                    keepBuffer: 6
                }).addTo(map);
                
                markersLayer = L.layerGroup().addTo(map);
                showCity(cities[0]);
            };
            
            // Display city with members
            const showCity = (city) => {
                markersLayer.clearLayers();
                
                // Add member pins
                city.members.forEach((member, i) => {
                    const angle = (i / city.members.length) * Math.PI * 2 - Math.PI / 2;
                    const r = 0.006;
                    const lat = city.coords[0] + Math.sin(angle) * r;
                    const lng = city.coords[1] + Math.cos(angle) * r * 1.3;
                    
                    const icon = L.divIcon({
                        className: '',
                        html: `<div class="member-pin">${member.initial}</div>`,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                    });
                    
                    const marker = L.marker([lat, lng], { icon }).addTo(markersLayer);
                    
                    // Cursor hover effect
                    marker.on('mouseover', () => cursor?.classList.add('hovering'));
                    marker.on('mouseout', () => cursor?.classList.remove('hovering'));
                });
                
                // Center pin
                const pinIcon = L.divIcon({
                    className: '',
                    html: '<div class="apple-map-pin"></div>',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                const centerMarker = L.marker(city.coords, { icon: pinIcon }).addTo(markersLayer);
                centerMarker.on('mouseover', () => cursor?.classList.add('hovering'));
                centerMarker.on('mouseout', () => cursor?.classList.remove('hovering'));
                
                updateUI(city);
            };
            
            // Card positions
            const positions = [
                { left: '24px', top: '120px' },
                { right: '24px', top: '100px' },
                { left: '24px', bottom: '180px' },
                { right: '24px', bottom: '160px' }
            ];
            
            // Update UI
            const updateUI = (city) => {
                // City label
                if (cityLabel) {
                    cityLabel.querySelector('.city-name').textContent = `${city.name}, ${city.state}`;
                    cityLabel.querySelector('.city-users').textContent = `${city.members.length + Math.floor(Math.random() * 8) + 12} active nearby`;
                    cityLabel.classList.add('visible');
                }
                
                // Member cards
                if (userCardsContainer) {
                    userCardsContainer.innerHTML = '';
                    
                    city.members.forEach((member, i) => {
                        const pos = positions[i % positions.length];
                        const card = document.createElement('div');
                        card.className = 'apple-member-card';
                        
                        let posStyle = '';
                        if (pos.left) posStyle += `left: ${pos.left};`;
                        if (pos.right) posStyle += `right: ${pos.right};`;
                        if (pos.top) posStyle += `top: ${pos.top};`;
                        if (pos.bottom) posStyle += `bottom: ${pos.bottom};`;
                        
                        card.style.cssText = posStyle;
                        card.innerHTML = `
                            <div class="apple-member-avatar">${member.initial}</div>
                            <div class="apple-member-info">
                                <div class="apple-member-name">${member.name}</div>
                                <div class="apple-member-role">Community member</div>
                            </div>
                        `;
                        
                        userCardsContainer.appendChild(card);
                        
                        // Staggered fade in
                        setTimeout(() => card.classList.add('visible'), 200 + i * 150);
                    });
                }
            };
            
            // Hide UI
            const hideUI = () => {
                cityLabel?.classList.remove('visible');
                userCardsContainer?.querySelectorAll('.apple-member-card').forEach(c => c.classList.remove('visible'));
            };
            
            // Cinematic transition
            const transitionToCity = () => {
                if (isAnimating) return;
                isAnimating = true;
                
                hideUI();
                
                setTimeout(() => markersLayer.clearLayers(), 400);
                
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                const nextCity = cities[currentCityIndex];
                
                setTimeout(() => {
                    map.flyTo(nextCity.coords, ZOOM_LEVEL, {
                        duration: 2.8,
                        easeLinearity: 0.1
                    });
                }, 500);
                
                setTimeout(() => {
                    showCity(nextCity);
                    isAnimating = false;
                }, 3400);
            };
            
            // Initialize
            initMap();
            
            // Continuous loop - 7 seconds per city
            setInterval(transitionToCity, 7000);
            
            // Scroll handling
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
