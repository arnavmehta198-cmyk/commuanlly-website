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
         * Initialize Animated Map Background
         * Pure CSS/JS animation - looks like Apple Maps flying between cities
         * No API needed - works everywhere!
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const mapContainer = document.getElementById('mapContainer');
            const cityLabel = document.getElementById('cityLabel');
            const userCardsContainer = document.getElementById('mapUserCards');
            
            if (!mapContainer || !container) return;
            
            // City data with colors and sample users
            const cities = [
                {
                    name: 'Brooklyn, NY',
                    // Map-like colors: water, parks, streets
                    colors: {
                        water: '#a8d5e5',
                        parks: '#c8e6c9',
                        streets: '#ffffff',
                        buildings: '#e8e0d5'
                    },
                    users: [
                        { name: 'Sarah M.', initial: 'S', activity: 'Walking dogs in Park Slope', badge: '⭐ Top Helper' },
                        { name: 'Mike R.', initial: 'M', activity: 'Helping with groceries', badge: '🏆 5 jobs today' },
                        { name: 'Emma L.', initial: 'E', activity: 'Tutoring nearby', badge: '✨ New neighbor' }
                    ]
                },
                {
                    name: 'San Francisco, CA',
                    colors: {
                        water: '#7eb8da',
                        parks: '#a5d6a7',
                        streets: '#f5f5f5',
                        buildings: '#ede7e0'
                    },
                    users: [
                        { name: 'Alex K.', initial: 'A', activity: 'Moving furniture in SOMA', badge: '💪 Strong helper' },
                        { name: 'Jordan T.', initial: 'J', activity: 'Pet sitting in Mission', badge: '🐕 Pet expert' }
                    ]
                },
                {
                    name: 'Austin, TX',
                    colors: {
                        water: '#81d4fa',
                        parks: '#aed581',
                        streets: '#fafafa',
                        buildings: '#f5ebe0'
                    },
                    users: [
                        { name: 'Chris B.', initial: 'C', activity: 'Yard work downtown', badge: '🌱 Garden pro' },
                        { name: 'Taylor S.', initial: 'T', activity: 'Running errands', badge: '⚡ Quick helper' },
                        { name: 'Morgan P.', initial: 'M', activity: 'Tech support', badge: '💻 Tech whiz' }
                    ]
                },
                {
                    name: 'Seattle, WA',
                    colors: {
                        water: '#90caf9',
                        parks: '#81c784',
                        streets: '#f0f0f0',
                        buildings: '#e0e0e0'
                    },
                    users: [
                        { name: 'Casey H.', initial: 'C', activity: 'Coffee delivery in Capitol Hill', badge: '☕ Local favorite' },
                        { name: 'Riley N.', initial: 'R', activity: 'Dog walking near Pike Place', badge: '🐾 Pet lover' }
                    ]
                },
                {
                    name: 'Chicago, IL',
                    colors: {
                        water: '#4fc3f7',
                        parks: '#66bb6a',
                        streets: '#ffffff',
                        buildings: '#d7ccc8'
                    },
                    users: [
                        { name: 'Jamie W.', initial: 'J', activity: 'Helping in Lincoln Park', badge: '❄️ Winter warrior' },
                        { name: 'Drew M.', initial: 'D', activity: 'Furniture assembly', badge: '🔧 Handy helper' }
                    ]
                },
                {
                    name: 'Miami, FL',
                    colors: {
                        water: '#4dd0e1',
                        parks: '#9ccc65',
                        streets: '#fff8e1',
                        buildings: '#ffe0b2'
                    },
                    users: [
                        { name: 'Nico V.', initial: 'N', activity: 'Beach cleanup in South Beach', badge: '🌴 Community hero' },
                        { name: 'Luna R.', initial: 'L', activity: 'Spanish tutoring', badge: '📚 Top tutor' }
                    ]
                },
                {
                    name: 'Denver, CO',
                    colors: {
                        water: '#80deea',
                        parks: '#a5d6a7',
                        streets: '#fafafa',
                        buildings: '#d7ccc8'
                    },
                    users: [
                        { name: 'Sky P.', initial: 'S', activity: 'Hiking gear organization', badge: '🏔️ Outdoor expert' },
                        { name: 'River J.', initial: 'R', activity: 'Plant care in LoDo', badge: '🪴 Plant parent' }
                    ]
                },
                {
                    name: 'Los Angeles, CA',
                    colors: {
                        water: '#81d4fa',
                        parks: '#c5e1a5',
                        streets: '#fff8e1',
                        buildings: '#ffe0b2'
                    },
                    users: [
                        { name: 'Kai M.', initial: 'K', activity: 'Car washing in Silver Lake', badge: '🚗 Detail king' },
                        { name: 'Sage L.', initial: 'S', activity: 'Meal prep assistance', badge: '🍳 Chef helper' },
                        { name: 'Quinn B.', initial: 'Q', activity: 'Personal shopping', badge: '🛍️ Style guru' }
                    ]
                }
            ];
            
            let currentCityIndex = 0;
            
            // Create the animated map canvas
            const createMapVisualization = () => {
                // Create SVG-based map visualization
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('viewBox', '0 0 1000 800');
                svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
                svg.id = 'mapSvg';
                svg.innerHTML = `
                    <defs>
                        <!-- Gradient for water -->
                        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#a8d5e5"/>
                            <stop offset="100%" style="stop-color:#7eb8da"/>
                        </linearGradient>
                        <!-- Pattern for streets -->
                        <pattern id="streetPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                            <rect width="50" height="50" fill="#f5f5f0"/>
                            <line x1="25" y1="0" x2="25" y2="50" stroke="#fff" stroke-width="3"/>
                            <line x1="0" y1="25" x2="50" y2="25" stroke="#fff" stroke-width="3"/>
                            <line x1="0" y1="0" x2="50" y2="0" stroke="#e0e0e0" stroke-width="1"/>
                            <line x1="0" y1="0" x2="0" y2="50" stroke="#e0e0e0" stroke-width="1"/>
                        </pattern>
                        <!-- Pattern for buildings -->
                        <pattern id="buildingPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="#ede7e0"/>
                            <rect x="5" y="5" width="12" height="12" fill="#e0d5c8" rx="1"/>
                            <rect x="23" y="5" width="12" height="12" fill="#d5ccc0" rx="1"/>
                            <rect x="5" y="23" width="12" height="12" fill="#d8d0c5" rx="1"/>
                            <rect x="23" y="23" width="12" height="12" fill="#e5ddd2" rx="1"/>
                        </pattern>
                    </defs>
                    
                    <!-- Base layer - streets/land -->
                    <rect class="map-base" width="100%" height="100%" fill="url(#streetPattern)"/>
                    
                    <!-- Water bodies -->
                    <ellipse class="map-water water-1" cx="850" cy="200" rx="200" ry="150" fill="url(#waterGradient)" opacity="0.9"/>
                    <ellipse class="map-water water-2" cx="100" cy="600" rx="180" ry="120" fill="url(#waterGradient)" opacity="0.85"/>
                    <path class="map-water water-river" d="M 0 300 Q 200 350, 400 300 T 800 350 T 1000 300" fill="none" stroke="#a8d5e5" stroke-width="40" opacity="0.7"/>
                    
                    <!-- Parks -->
                    <ellipse class="map-park park-1" cx="300" cy="200" rx="100" ry="80" fill="#c8e6c9" opacity="0.9"/>
                    <ellipse class="map-park park-2" cx="700" cy="500" rx="120" ry="90" fill="#a5d6a7" opacity="0.85"/>
                    <rect class="map-park park-3" x="450" y="100" width="80" height="100" rx="10" fill="#b9deb5" opacity="0.8"/>
                    <ellipse class="map-park park-4" cx="150" cy="400" rx="70" ry="50" fill="#c5e1a5" opacity="0.75"/>
                    
                    <!-- Building clusters -->
                    <rect class="map-buildings buildings-1" x="350" y="250" width="150" height="180" fill="url(#buildingPattern)" rx="5"/>
                    <rect class="map-buildings buildings-2" x="550" y="300" width="120" height="150" fill="url(#buildingPattern)" rx="5"/>
                    <rect class="map-buildings buildings-3" x="200" y="450" width="100" height="120" fill="url(#buildingPattern)" rx="5"/>
                    <rect class="map-buildings buildings-4" x="650" y="150" width="90" height="100" fill="url(#buildingPattern)" rx="5"/>
                    
                    <!-- Major roads -->
                    <line class="map-road road-h1" x1="0" y1="400" x2="1000" y2="400" stroke="#ffffff" stroke-width="8"/>
                    <line class="map-road road-h2" x1="0" y1="250" x2="1000" y2="250" stroke="#ffffff" stroke-width="6"/>
                    <line class="map-road road-v1" x1="500" y1="0" x2="500" y2="800" stroke="#ffffff" stroke-width="8"/>
                    <line class="map-road road-v2" x1="300" y1="0" x2="300" y2="800" stroke="#ffffff" stroke-width="5"/>
                    <line class="map-road road-v3" x1="700" y1="0" x2="700" y2="800" stroke="#ffffff" stroke-width="5"/>
                    
                    <!-- Road outlines -->
                    <line x1="0" y1="400" x2="1000" y2="400" stroke="#e8e8e8" stroke-width="10" opacity="0.5"/>
                    <line x1="500" y1="0" x2="500" y2="800" stroke="#e8e8e8" stroke-width="10" opacity="0.5"/>
                    
                    <!-- Highway/freeway style -->
                    <path class="map-highway" d="M 0 550 Q 250 500, 500 550 T 1000 500" fill="none" stroke="#ffd54f" stroke-width="12" opacity="0.8"/>
                    <path d="M 0 550 Q 250 500, 500 550 T 1000 500" fill="none" stroke="#ffecb3" stroke-width="8" opacity="0.9"/>
                    
                    <!-- Location pins for users -->
                    <g class="map-pins">
                        <circle class="pin pin-1" cx="420" cy="320" r="12" fill="#22c55e" stroke="#fff" stroke-width="3"/>
                        <circle class="pin pin-2" cx="580" cy="380" r="12" fill="#22c55e" stroke="#fff" stroke-width="3"/>
                        <circle class="pin pin-3" cx="350" cy="480" r="12" fill="#22c55e" stroke="#fff" stroke-width="3"/>
                        <circle class="pin pin-4" cx="650" cy="220" r="12" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
                    </g>
                `;
                
                mapContainer.innerHTML = '';
                mapContainer.appendChild(svg);
                
                // Add CSS for animations
                const style = document.createElement('style');
                style.textContent = `
                    #mapSvg {
                        transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    #mapSvg.transitioning {
                        transform: scale(1.5);
                        opacity: 0.3;
                    }
                    
                    .map-water, .map-park, .map-buildings, .map-road, .map-highway {
                        transition: all 1.2s ease;
                    }
                    
                    .pin {
                        animation: pinPulse 2s ease-in-out infinite;
                    }
                    
                    .pin-1 { animation-delay: 0s; }
                    .pin-2 { animation-delay: 0.5s; }
                    .pin-3 { animation-delay: 1s; }
                    .pin-4 { animation-delay: 1.5s; }
                    
                    @keyframes pinPulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.8; }
                    }
                    
                    /* Slow drift animation for map elements */
                    @keyframes mapDrift {
                        0% { transform: translate(0, 0) scale(1); }
                        25% { transform: translate(-20px, -10px) scale(1.02); }
                        50% { transform: translate(-10px, -20px) scale(1.03); }
                        75% { transform: translate(10px, -15px) scale(1.02); }
                        100% { transform: translate(0, 0) scale(1); }
                    }
                    
                    #mapSvg {
                        animation: mapDrift 30s ease-in-out infinite;
                    }
                `;
                document.head.appendChild(style);
            };
            
            // Initialize the map
            createMapVisualization();
            
            // Card positions for different layouts
            const cardPositions = [
                { left: '8%', top: '15%' },
                { right: '8%', top: '12%' },
                { left: '5%', top: '55%' },
                { right: '5%', top: '50%' },
            ];
            
            // Create user card HTML
            const createUserCard = (user, index) => {
                const pos = cardPositions[index % cardPositions.length];
                const posStyle = pos.left 
                    ? `left: ${pos.left}; top: ${pos.top};`
                    : `right: ${pos.right}; top: ${pos.top};`;
                    
                return `
                    <div class="map-user-card" style="${posStyle} animation-delay: ${index * 0.15}s;">
                        <div class="user-card-header">
                            <div class="user-avatar">${user.initial}</div>
                            <div class="user-info">
                                <div class="user-name">${user.name}</div>
                                <div class="user-badge">
                                    <span>${user.badge}</span>
                                </div>
                            </div>
                        </div>
                        <div class="user-activity">${user.activity}</div>
                    </div>
                `;
            };
            
            // Update city label and user cards
            const updateCityDisplay = (city) => {
                if (cityLabel) {
                    const cityNameEl = cityLabel.querySelector('.city-name');
                    const cityUsersEl = cityLabel.querySelector('.city-users');
                    
                    if (cityNameEl) cityNameEl.textContent = city.name;
                    if (cityUsersEl) cityUsersEl.textContent = `${city.users.length + Math.floor(Math.random() * 20) + 10} neighbors active now`;
                    
                    cityLabel.classList.add('visible');
                }
                
                if (userCardsContainer) {
                    const existingCards = userCardsContainer.querySelectorAll('.map-user-card');
                    existingCards.forEach(card => card.classList.remove('visible'));
                    
                    setTimeout(() => {
                        userCardsContainer.innerHTML = city.users.map((user, i) => createUserCard(user, i)).join('');
                        
                        setTimeout(() => {
                            userCardsContainer.querySelectorAll('.map-user-card').forEach((card, i) => {
                                setTimeout(() => card.classList.add('visible'), i * 200);
                            });
                        }, 100);
                    }, 300);
                }
                
                // Update map colors based on city
                const svg = document.getElementById('mapSvg');
                if (svg && city.colors) {
                    const waters = svg.querySelectorAll('.map-water');
                    const parks = svg.querySelectorAll('.map-park');
                    
                    waters.forEach(w => w.style.fill = city.colors.water);
                    parks.forEach(p => p.style.fill = city.colors.parks);
                }
            };
            
            // Fly to next city with smooth animation
            const flyToNextCity = () => {
                const svg = document.getElementById('mapSvg');
                
                // Hide current display
                if (cityLabel) cityLabel.classList.remove('visible');
                if (userCardsContainer) {
                    userCardsContainer.querySelectorAll('.map-user-card').forEach(card => card.classList.remove('visible'));
                }
                
                // Animate map transition (zoom out then in)
                if (svg) {
                    svg.classList.add('transitioning');
                }
                
                // Move to next city
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                const city = cities[currentCityIndex];
                
                // After zoom out, update and zoom back in
                setTimeout(() => {
                    if (svg) {
                        // Shift viewBox slightly to simulate moving to new location
                        const offsetX = (Math.random() - 0.5) * 100;
                        const offsetY = (Math.random() - 0.5) * 80;
                        svg.setAttribute('viewBox', `${offsetX} ${offsetY} 1000 800`);
                        
                        svg.classList.remove('transitioning');
                    }
                    
                    // Update display
                    setTimeout(() => {
                        updateCityDisplay(city);
                    }, 500);
                }, 1500);
            };
            
            // Show first city
            setTimeout(() => {
                updateCityDisplay(cities[0]);
            }, 500);
            
            // Start city rotation every 8 seconds
            setInterval(flyToNextCity, 8000);
            
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
