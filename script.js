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
         * Dramatic zoom into each US city, show people, then fly to next
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const mapContainer = document.getElementById('mapContainer');
            const cityLabel = document.getElementById('cityLabel');
            const userCardsContainer = document.getElementById('mapUserCards');
            
            if (!mapContainer || !container || typeof L === 'undefined') return;
            
            // US Cities - start with San Francisco
            const cities = [
                {
                    name: 'San Francisco',
                    state: 'CA',
                    coords: [37.7749, -122.4194],
                    users: [
                        { name: 'Alex K.', avatar: '👨', activity: 'Moving furniture in SOMA', badge: '💪 Strong helper', color: '#3b82f6' },
                        { name: 'Jordan T.', avatar: '🧑', activity: 'Pet sitting in Mission', badge: '🐕 Pet expert', color: '#22c55e' },
                        { name: 'Sam R.', avatar: '👩', activity: 'Grocery delivery', badge: '⚡ Quick', color: '#f59e0b' }
                    ]
                },
                {
                    name: 'New York City',
                    state: 'NY',
                    coords: [40.7128, -74.0060],
                    users: [
                        { name: 'Sarah M.', avatar: '👩', activity: 'Walking dogs in Brooklyn', badge: '⭐ Top Helper', color: '#3b82f6' },
                        { name: 'Mike R.', avatar: '👨', activity: 'Helping with groceries', badge: '🏆 5 jobs', color: '#22c55e' },
                        { name: 'Emma L.', avatar: '👩‍🦰', activity: 'Tutoring in Manhattan', badge: '✨ New', color: '#a855f7' }
                    ]
                },
                {
                    name: 'Los Angeles',
                    state: 'CA',
                    coords: [34.0522, -118.2437],
                    users: [
                        { name: 'Kai M.', avatar: '🧑', activity: 'Car detailing in Silver Lake', badge: '🚗 Pro', color: '#f59e0b' },
                        { name: 'Sage L.', avatar: '👩', activity: 'Meal prep in WeHo', badge: '🍳 Chef', color: '#22c55e' }
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
                        { name: 'Chris B.', avatar: '👨', activity: 'Yard work downtown', badge: '🌱 Garden pro', color: '#22c55e' },
                        { name: 'Taylor S.', avatar: '👩', activity: 'Running errands', badge: '⚡ Fast', color: '#f59e0b' },
                        { name: 'Morgan P.', avatar: '🧑', activity: 'Tech support', badge: '💻 Tech', color: '#3b82f6' }
                    ]
                },
                {
                    name: 'Seattle',
                    state: 'WA',
                    coords: [47.6062, -122.3321],
                    users: [
                        { name: 'Casey H.', avatar: '👩', activity: 'Coffee runs in Capitol Hill', badge: '☕ Local', color: '#f59e0b' },
                        { name: 'Riley N.', avatar: '🧑', activity: 'Dog walking downtown', badge: '🐾 Pet lover', color: '#22c55e' }
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
            let markers = [];
            
            // Zoom levels for dramatic effect
            const ZOOM_OUT = 5;      // US overview
            const ZOOM_IN = 14;      // Street level detail
            
            // Add Apple Maps-like styles
            const addMapStyles = () => {
                const style = document.createElement('style');
                style.textContent = `
                    /* Hide all Leaflet controls */
                    .leaflet-control-container,
                    .leaflet-control-attribution {
                        display: none !important;
                    }
                    
                    .leaflet-container {
                        background: #e8f4f8 !important;
                        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                    }
                    
                    /* Apple Maps style pin */
                    .apple-pin {
                        position: relative;
                        width: 44px;
                        height: 44px;
                    }
                    
                    .apple-pin-marker {
                        width: 44px;
                        height: 44px;
                        background: linear-gradient(180deg, #ff3b30 0%, #d63030 100%);
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        border: 3px solid white;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
                        position: relative;
                    }
                    
                    .apple-pin-marker::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(45deg);
                        width: 16px;
                        height: 16px;
                        background: white;
                        border-radius: 50%;
                    }
                    
                    .apple-pin-pulse {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 44px;
                        height: 44px;
                        background: rgba(255, 59, 48, 0.3);
                        border-radius: 50%;
                        animation: applePulse 2s ease-out infinite;
                    }
                    
                    @keyframes applePulse {
                        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                        100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
                    }
                    
                    /* User marker on map */
                    .user-marker {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 18px;
                        background: #22c55e;
                        cursor: pointer;
                        transition: transform 0.2s ease;
                    }
                    
                    .user-marker:hover {
                        transform: scale(1.2);
                    }
                    
                    .user-marker.blue { background: #3b82f6; }
                    .user-marker.purple { background: #a855f7; }
                    .user-marker.orange { background: #f59e0b; }
                `;
                document.head.appendChild(style);
            };
            
            // Initialize Leaflet map
            const initMap = () => {
                addMapStyles();
                
                // Start zoomed out on US
                map = L.map(mapContainer, {
                    center: [39.8283, -98.5795], // Center of US
                    zoom: ZOOM_OUT,
                    zoomControl: false,
                    attributionControl: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    dragging: false,
                    keyboard: false,
                    touchZoom: false,
                    zoomAnimation: true,
                    fadeAnimation: true
                });
                
                // Use Stadia Alidade Smooth for Apple Maps-like look
                // Fallback to CartoDB Voyager which looks similar to Apple Maps
                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                    maxZoom: 20
                }).addTo(map);
                
                // Start the animation sequence
                setTimeout(() => {
                    zoomIntoCity(cities[0]);
                }, 1000);
            };
            
            // Add user markers on the map
            const addUserMarkers = (city) => {
                // Clear existing markers
                markers.forEach(m => map.removeLayer(m));
                markers = [];
                
                // Add markers for each user at slightly offset positions
                city.users.forEach((user, index) => {
                    const offset = 0.003; // Slight position offset
                    const angle = (index / city.users.length) * Math.PI * 2;
                    const lat = city.coords[0] + Math.cos(angle) * offset * 2;
                    const lng = city.coords[1] + Math.sin(angle) * offset * 3;
                    
                    const colorClass = user.color === '#3b82f6' ? 'blue' : 
                                       user.color === '#a855f7' ? 'purple' : 
                                       user.color === '#f59e0b' ? 'orange' : '';
                    
                    const userIcon = L.divIcon({
                        className: 'user-marker-wrapper',
                        html: `<div class="user-marker ${colorClass}">${user.avatar}</div>`,
                        iconSize: [36, 36],
                        iconAnchor: [18, 18]
                    });
                    
                    const marker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
                    markers.push(marker);
                });
                
                // Add center pin
                const pinIcon = L.divIcon({
                    className: 'apple-pin',
                    html: `<div class="apple-pin-pulse"></div><div class="apple-pin-marker"></div>`,
                    iconSize: [44, 44],
                    iconAnchor: [22, 44]
                });
                
                const centerPin = L.marker(city.coords, { icon: pinIcon }).addTo(map);
                markers.push(centerPin);
            };
            
            // Card positions
            const cardPositions = [
                { left: '4%', top: '18%' },
                { right: '4%', top: '15%' },
                { left: '3%', top: '58%' },
                { right: '3%', top: '55%' },
            ];
            
            // Create user card
            const createUserCard = (user, index) => {
                const pos = cardPositions[index % cardPositions.length];
                const posStyle = pos.left 
                    ? `left: ${pos.left}; top: ${pos.top};`
                    : `right: ${pos.right}; top: ${pos.top};`;
                    
                return `
                    <div class="map-user-card" style="${posStyle}">
                        <div class="user-card-header">
                            <div class="user-avatar" style="background: ${user.color};">
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
            };
            
            // Update city label
            const updateCityDisplay = (city) => {
                if (cityLabel) {
                    const cityNameEl = cityLabel.querySelector('.city-name');
                    const cityUsersEl = cityLabel.querySelector('.city-users');
                    
                    if (cityNameEl) cityNameEl.textContent = `${city.name}, ${city.state}`;
                    if (cityUsersEl) cityUsersEl.textContent = `${city.users.length + Math.floor(Math.random() * 15) + 12} neighbors active`;
                    
                    cityLabel.classList.add('visible');
                }
            };
            
            // Show user cards with staggered animation
            const showUserCards = (city) => {
                if (userCardsContainer) {
                    userCardsContainer.innerHTML = city.users.map((user, i) => createUserCard(user, i)).join('');
                    
                    setTimeout(() => {
                        userCardsContainer.querySelectorAll('.map-user-card').forEach((card, i) => {
                            setTimeout(() => card.classList.add('visible'), i * 200);
                        });
                    }, 200);
                }
            };
            
            // Hide all UI
            const hideUI = () => {
                if (cityLabel) cityLabel.classList.remove('visible');
                if (userCardsContainer) {
                    userCardsContainer.querySelectorAll('.map-user-card').forEach(card => {
                        card.classList.remove('visible');
                    });
                }
                // Clear markers
                markers.forEach(m => map.removeLayer(m));
                markers = [];
            };
            
            // Zoom into a city dramatically
            const zoomIntoCity = (city) => {
                // First zoom out to show context (if not first load)
                map.flyTo(city.coords, ZOOM_IN, {
                    duration: 3,
                    easeLinearity: 0.1
                });
                
                // Add markers after starting to zoom
                setTimeout(() => {
                    addUserMarkers(city);
                }, 1500);
                
                // Show city label
                setTimeout(() => {
                    updateCityDisplay(city);
                }, 2000);
                
                // Show user cards
                setTimeout(() => {
                    showUserCards(city);
                }, 2500);
            };
            
            // Transition to next city
            const flyToNextCity = () => {
                // Hide current UI
                hideUI();
                
                // Zoom out first
                map.flyTo(map.getCenter(), ZOOM_OUT + 1, {
                    duration: 1.5,
                    easeLinearity: 0.5
                });
                
                // Move to next city
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                const nextCity = cities[currentCityIndex];
                
                // After zoom out, fly to next city and zoom in
                setTimeout(() => {
                    zoomIntoCity(nextCity);
                }, 1800);
            };
            
            // Initialize
            initMap();
            
            // Start city rotation every 7 seconds
            setInterval(flyToNextCity, 7000);
            
            // Fade when scrolled
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
