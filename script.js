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
         * Interactive Map Background with City Tour
         * Uses Leaflet + OpenStreetMap for beautiful, free maps
         * Tours through US cities showing fake community members
         */
        initMapBackground() {
            const container = document.getElementById('mapBackground');
            const mapContainer = document.getElementById('mapContainer');
            const userCardsContainer = document.getElementById('mapUserCards');
            const cityLabel = document.getElementById('cityLabel');
            
            if (!mapContainer || !container) {
                console.log('Map containers not found');
                return;
            }
            
            // Check if Leaflet is available
            if (typeof L === 'undefined') {
                console.log('Leaflet not loaded, skipping map background');
                return;
            }
            
            console.log('Initializing Leaflet map with Apple-style 3D tilt...');
            
            // Huge pool of profile photos - maximum diversity
            const allProfilePhotos = [];
            // Generate 99 women and 99 men photos
            for (let i = 1; i <= 99; i++) {
                allProfilePhotos.push(`https://randomuser.me/api/portraits/women/${i}.jpg`);
                allProfilePhotos.push(`https://randomuser.me/api/portraits/men/${i}.jpg`);
            }
            
            // Get photos for current city (different subset for each city)
            let cityPhotoOffset = 0;
            const getPhotosForCity = (cityIndex) => {
                // Each city gets a completely different starting point
                const offset = (cityIndex * 24) % allProfilePhotos.length;
                cityPhotoOffset = offset;
                usedPhotoIndexes.clear();
            };
            
            const cities = [
                { name: 'San Francisco', state: 'California', coords: [37.7749, -122.4294], zoom: 15 }, // Western Addition - far from water
                { name: 'New York', state: 'New York', coords: [40.7549, -73.9840], zoom: 15 }, // Midtown Manhattan center
                { name: 'Chicago', state: 'Illinois', coords: [41.8819, -87.6378], zoom: 15 }, // Downtown inland
                { name: 'Austin', state: 'Texas', coords: [30.2672, -97.7431], zoom: 15 },
                { name: 'Denver', state: 'Colorado', coords: [39.7392, -104.9903], zoom: 15 },
                { name: 'Miami', state: 'Florida', coords: [25.7717, -80.2318], zoom: 15 }, // Further inland
                { name: 'Seattle', state: 'Washington', coords: [47.6162, -122.3321], zoom: 15 }, // Capitol Hill - inland
                { name: 'Boston', state: 'Massachusetts', coords: [42.3451, -71.0789], zoom: 15 } // Back Bay - inland
            ];
            
            // Inject styles for map and cards
            const style = document.createElement('style');
            style.textContent = `
                #mapContainer {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                /* Leaflet controls hidden for clean look */
                .leaflet-control-zoom,
                .leaflet-control-attribution {
                    display: none !important;
                }
                .leaflet-container {
                    background: #f8f9fa;
                    font-family: -apple-system, system-ui, sans-serif;
                }
                /* Ensure crisp rendering with 3D transform */
                #mapContainer {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                /* Profile marker styles */
                .profile-marker {
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    border: 3px solid #34C759;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    overflow: hidden;
                    background: #fff;
                    opacity: 0;
                    transform: translateY(30px) scale(0.3);
                    will-change: opacity, transform;
                }
                .profile-marker.visible {
                    animation: popUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .profile-marker.leaving {
                    animation: sinkDown 0.4s ease-in forwards;
                }
                @keyframes popUp {
                    0% {
                        opacity: 0;
                        transform: translateY(50px) scale(0.2);
                    }
                    40% {
                        opacity: 1;
                        transform: translateY(-20px) scale(1.25);
                    }
                    60% {
                        transform: translateY(8px) scale(0.9);
                    }
                    75% {
                        transform: translateY(-8px) scale(1.1);
                    }
                    85% {
                        transform: translateY(3px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes sinkDown {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(-8px) scale(1.1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(60px) scale(0.1);
                    }
                }
                .profile-marker img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .leaflet-marker-icon {
                    background: none !important;
                    border: none !important;
                }
                .city-label {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    padding: 12px 24px;
                    border-radius: 50px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                .city-label.visible {
                    opacity: 1;
                }
                .city-label .city-name {
                    font-family: -apple-system, system-ui, sans-serif;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1D1D1F;
                }
                .city-label .city-users {
                    font-family: -apple-system, system-ui, sans-serif;
                    font-size: 13px;
                    color: #86868B;
                    padding-left: 8px;
                    border-left: 1px solid #E5E5E7;
                }
                .map-user-cards { 
                    pointer-events: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999;
                }
                .map-background.faded {
                    opacity: 0.3;
                }
                .map-background {
                    transition: opacity 0.5s ease;
                }
            `;
            document.head.appendChild(style);
            
            // Initialize Leaflet map with Apple-style tiles
            let map;
            try {
                map = L.map(mapContainer, {
                    zoomControl: false,
                    attributionControl: false,
                    dragging: false,
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    touchZoom: false,
                    keyboard: false,
                    fadeAnimation: true,
                    zoomAnimation: true
                }).setView(cities[0].coords, cities[0].zoom);
                
                // Apple Maps-like light tiles (CartoDB Positron)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    subdomains: 'abcd',
                    maxZoom: 19,
                    updateWhenIdle: false,
                    updateWhenZooming: false
                }).addTo(map);
                
                console.log('Leaflet map initialized with Apple-style 3D tilt!');
            } catch (e) {
                console.error('Error initializing map:', e);
                return;
            }
            
            let currentCityIndex = 0;
            let isTransitioning = false;
            let panInterval = null;
            let userCycleInterval = null;
            let activeMarkers = []; // Leaflet markers on the map
            let usedPhotoIndexes = new Set();
            
            // Get random offset - smaller range to stay on land
            const getRandomOffset = () => ({
                lat: (Math.random() - 0.5) * 0.025,
                lng: (Math.random() - 0.5) * 0.030
            });
            
            // Get a random photo not currently shown (different for each city)
            const getRandomPhoto = () => {
                let availableIndexes = [];
                // Use 24 photos starting from the city offset for more variety
                for (let i = 0; i < 24; i++) {
                    const actualIdx = (cityPhotoOffset + i) % allProfilePhotos.length;
                    if (!usedPhotoIndexes.has(actualIdx)) {
                        availableIndexes.push(actualIdx);
                    }
                }
                if (availableIndexes.length === 0) {
                    usedPhotoIndexes.clear();
                    for (let i = 0; i < 24; i++) {
                        availableIndexes.push((cityPhotoOffset + i) % allProfilePhotos.length);
                    }
                }
                const idx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
                usedPhotoIndexes.add(idx);
                return allProfilePhotos[idx];
            };
            
            // Create a profile marker on the map
            const createProfileMarker = (city) => {
                const offset = getRandomOffset();
                const lat = city.coords[0] + offset.lat;
                const lng = city.coords[1] + offset.lng;
                const photo = getRandomPhoto();
                
                const icon = L.divIcon({
                    className: 'profile-marker-container',
                    html: `<div class="profile-marker"><img src="${photo}" alt="User"></div>`,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25]
                });
                
                const marker = L.marker([lat, lng], { icon: icon }).addTo(map);
                
                // Trigger smooth fade-in after a tiny delay
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        const el = marker.getElement();
                        if (el) {
                            const profileEl = el.querySelector('.profile-marker');
                            if (profileEl) profileEl.classList.add('visible');
                        }
                    });
                });
                
                return marker;
            };
            
            // Remove a marker with smooth animation
            const removeMarkerAnimated = (marker) => {
                if (!marker) return;
                const el = marker.getElement();
                if (el) {
                    const profileEl = el.querySelector('.profile-marker');
                    if (profileEl) {
                        profileEl.classList.remove('visible');
                        profileEl.classList.add('leaving');
                        setTimeout(() => {
                            try { map.removeLayer(marker); } catch(e) {}
                        }, 350);
                    } else {
                        try { map.removeLayer(marker); } catch(e) {}
                    }
                } else {
                    try { map.removeLayer(marker); } catch(e) {}
                }
            };
            
            // Continuous smooth pan - map and markers move together as one
            const startCityPan = (city) => {
                if (panInterval) {
                    clearInterval(panInterval);
                    panInterval = null;
                }
                
                // Continuous smooth pan using Leaflet's panBy with duration
                const doPan = () => {
                    if (isTransitioning) return;
                    
                    // Pan by pixels - even faster movement
                    map.panBy([25, 18], {
                        animate: true,
                        duration: 0.35,
                        easeLinearity: 1
                    });
                };
                
                // Start continuous panning - faster interval
                doPan();
                panInterval = setInterval(doPan, 350);
            };
            
            // Stop the pan animation
            const stopCityPan = () => {
                if (panInterval) {
                    clearInterval(panInterval);
                    panInterval = null;
                }
            };
            
            // Cycle one marker - smoothly remove and add new one
            const cycleOneMarker = (city) => {
                if (isTransitioning || activeMarkers.length === 0) return;
                
                // Pick a random marker to replace
                const idx = Math.floor(Math.random() * activeMarkers.length);
                const markerToRemove = activeMarkers[idx];
                
                // Smooth remove with animation
                removeMarkerAnimated(markerToRemove);
                
                // Add new marker after fade out completes
                setTimeout(() => {
                    if (!isTransitioning) {
                        const newMarker = createProfileMarker(city);
                        activeMarkers[idx] = newMarker;
                    }
                }, 400);
            };
            
            // Start cycling markers at faster intervals
            const startMarkerCycling = (city) => {
                if (userCycleInterval) clearTimeout(userCycleInterval);
                
                const cycle = () => {
                    if (!isTransitioning && activeMarkers.length > 0) {
                        cycleOneMarker(city);
                    }
                    // Faster cycling (1 - 2 seconds)
                    const nextInterval = 1000 + Math.random() * 1000;
                    userCycleInterval = setTimeout(cycle, nextInterval);
                };
                
                userCycleInterval = setTimeout(cycle, 1200);
            };
            
            // Stop cycling
            const stopMarkerCycling = () => {
                if (userCycleInterval) {
                    clearTimeout(userCycleInterval);
                    userCycleInterval = null;
                }
            };
            
            // Show markers for a city
            const showCityMembers = (city) => {
                // Stop current cycling
                stopMarkerCycling();
                
                // Remove existing markers with animation
                activeMarkers.forEach(marker => {
                    removeMarkerAnimated(marker);
                });
                
                // Reset and get new photos for this city
                activeMarkers = [];
                getPhotosForCity(currentCityIndex);
                
                // Create 8 markers spread across the city
                setTimeout(() => {
                    const numMarkers = 8;
                    for (let i = 0; i < numMarkers; i++) {
                        setTimeout(() => {
                            const marker = createProfileMarker(city);
                            activeMarkers.push(marker);
                        }, i * 200); // Stagger each marker
                    }
                    
                    // Start cycling after all markers appear
                    setTimeout(() => startMarkerCycling(city), numMarkers * 200 + 400);
                }, 300);
                
                // Update city label
                if (cityLabel) {
                    const cityNameEl = cityLabel.querySelector('.city-name');
                    const cityUsersEl = cityLabel.querySelector('.city-users');
                    
                    cityLabel.classList.remove('visible');
                    
                    setTimeout(() => {
                        if (cityNameEl) cityNameEl.textContent = `${city.name}, ${city.state}`;
                        if (cityUsersEl) cityUsersEl.textContent = `${Math.floor(Math.random() * 500 + 200)} people nearby`;
                        cityLabel.classList.add('visible');
                    }, 500);
                }
            };
            
            // Function to transition to next city - slow and smooth
            const goToNextCity = () => {
                if (isTransitioning) return;
                isTransitioning = true;
                
                // Stop panning and marker cycling
                stopCityPan();
                stopMarkerCycling();
                
                // Remove current markers
                activeMarkers.forEach(marker => {
                    removeMarkerAnimated(marker);
                });
                activeMarkers = [];
                
                currentCityIndex = (currentCityIndex + 1) % cities.length;
                const nextCity = cities[currentCityIndex];
                
                console.log(`Flying to ${nextCity.name}, ${nextCity.state}...`);
                
                // Slow, smooth flight to next city
                map.flyTo(nextCity.coords, nextCity.zoom, {
                    duration: 4,
                    easeLinearity: 0.02
                });
                
                // After flight completes, start smooth panning and show new markers
                setTimeout(() => {
                    isTransitioning = false;
                    map.setView(nextCity.coords, nextCity.zoom, { animate: false });
                    setTimeout(() => {
                        startCityPan(nextCity);
                        showCityMembers(nextCity);
                    }, 200);
                }, 4000);
            };
            
            // Initial display - start at exact city center
            console.log(`Starting in ${cities[0].name}, ${cities[0].state}`);
            
            // Ensure map is at exact city center first
            map.setView(cities[0].coords, cities[0].zoom, { animate: false });
            
            // Start smooth panning from city center
            startCityPan(cities[0]);
            
            // Show city label
            if (cityLabel) {
                const cityNameEl = cityLabel.querySelector('.city-name');
                const cityUsersEl = cityLabel.querySelector('.city-users');
                if (cityNameEl) cityNameEl.textContent = `${cities[0].name}, ${cities[0].state}`;
                if (cityUsersEl) cityUsersEl.textContent = `${Math.floor(Math.random() * 500 + 200)} people nearby`;
                setTimeout(() => cityLabel.classList.add('visible'), 500);
            }
            
            // Show users while map is moving
            showCityMembers(cities[0]);
            
            // Start the city tour - fly to new city every 12 seconds
            setInterval(goToNextCity, 12000);
            
            console.log('Apple-style 3D tour started!');
            
            // Scroll fade effect
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
            
            // Handle window resize
            window.addEventListener('resize', () => {
                map.invalidateSize();
            });
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
