// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.background = 'rgba(35, 35, 35, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(35, 35, 35, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Create stars dynamically
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 2 + 1}px;
            animation-delay: ${Math.random() * 3}s;
            animation-duration: ${Math.random() * 2 + 2}s;
        `;
        starsContainer.appendChild(star);
    }
}

createStars();

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .animate-target {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .animate-target.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card.animate-target {
        transition-delay: calc(var(--delay, 0) * 0.15s);
    }
    
    .step-card.animate-target {
        transition-delay: calc(var(--delay, 0) * 0.2s);
    }
    
    .security-feature.animate-target {
        transition-delay: calc(var(--delay, 0) * 0.1s);
    }
`;
document.head.appendChild(style);

// Observe elements
document.querySelectorAll('.feature-card').forEach((el, index) => {
    el.classList.add('animate-target');
    el.style.setProperty('--delay', index);
    observer.observe(el);
});

document.querySelectorAll('.step-card').forEach((el, index) => {
    el.classList.add('animate-target');
    el.style.setProperty('--delay', index);
    observer.observe(el);
});

document.querySelectorAll('.security-feature').forEach((el, index) => {
    el.classList.add('animate-target');
    el.style.setProperty('--delay', index);
    observer.observe(el);
});

document.querySelectorAll('.security-grid, .cta-card').forEach((el) => {
    el.classList.add('animate-target');
    observer.observe(el);
});

// ============================================
// ENHANCED 3D FLOATING CARDS - Full Card Tilt
// ============================================

const floatingCards = document.querySelectorAll('.floating-card');
const heroContainer = document.querySelector('.hero-phone-container');

// Store each card's current rotation and position
const cardStates = new Map();

floatingCards.forEach((card, index) => {
    cardStates.set(card, {
        rotateX: 0,
        rotateY: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        targetRotateX: 0,
        targetRotateY: 0,
        targetTranslateX: 0,
        targetTranslateY: 0,
        depth: (index % 3 + 1) * 8 // Different depth layers
    });
});

// Global mouse position tracking
let globalMouseX = 0;
let globalMouseY = 0;
let isMouseInHero = false;

// Track mouse position globally
document.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;
});// Track if mouse is in hero section
if (heroContainer) {
    heroContainer.addEventListener('mouseenter', () => {
        isMouseInHero = true;
    });
    
    heroContainer.addEventListener('mouseleave', () => {
        isMouseInHero = false;
        // Smoothly reset cards when mouse leaves
        floatingCards.forEach(card => {
            const state = cardStates.get(card);
            state.targetRotateX = 0;
            state.targetRotateY = 0;
            state.targetTranslateX = 0;
            state.targetTranslateY = 0;
        });
    });
}

// Update card transforms based on mouse position
function updateFloatingCards() {
    floatingCards.forEach(card => {
        const state = cardStates.get(card);
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;
        
        if (isMouseInHero) {
            // Calculate distance from mouse to card center
            const deltaX = globalMouseX - cardCenterX;
            const deltaY = globalMouseY - cardCenterY;
            
            // Distance-based intensity (closer = stronger effect)
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxDistance = 500;
            const intensity = Math.max(0, 1 - distance / maxDistance);
            
            // Calculate rotation based on mouse position relative to card
            // The card should tilt TOWARD the mouse
            const maxRotation = 25;
            state.targetRotateY = (deltaX / 300) * maxRotation * intensity;
            state.targetRotateX = -(deltaY / 300) * maxRotation * intensity;
            
            // Subtle translation based on depth
            state.targetTranslateX = (deltaX / 50) * state.depth * intensity;
            state.targetTranslateY = (deltaY / 50) * state.depth * intensity;
        }
        
        // Smooth interpolation for fluid movement
        const smoothing = 0.08;
        state.rotateX += (state.targetRotateX - state.rotateX) * smoothing;
        state.rotateY += (state.targetRotateY - state.rotateY) * smoothing;
        state.translateX += (state.targetTranslateX - state.translateX) * smoothing;
        state.translateY += (state.targetTranslateY - state.translateY) * smoothing;
        
        // Calculate translateZ based on rotation for depth effect
        const rotationMagnitude = Math.sqrt(state.rotateX ** 2 + state.rotateY ** 2);
        state.translateZ = rotationMagnitude * 0.5;
        
        // Apply the combined transform
        card.style.transform = `
            perspective(1000px)
            translate3d(${state.translateX}px, ${state.translateY}px, ${state.translateZ}px)
            rotateX(${state.rotateX}deg)
            rotateY(${state.rotateY}deg)
        `;
    });
    
    requestAnimationFrame(updateFloatingCards);
}

updateFloatingCards();

// Individual card hover for extra emphasis
floatingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'box-shadow 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'box-shadow 0.3s ease';
    });
});

// 3D tilt effect for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});

// Phone mockup 3D effect
const phoneMockup = document.querySelector('.phone-mockup');
if (phoneMockup && heroContainer) {
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 60;
        const rotateY = (centerX - x) / 60;
        
        phoneMockup.style.transform = `translateY(${Math.sin(Date.now() / 1000) * 15}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    heroContainer.addEventListener('mouseleave', () => {
        // Resume floating animation
        phoneMockup.style.transform = '';
    });
}

// Security mockup 3D effect
const securityImage = document.querySelector('.security-image');
if (securityImage) {
    securityImage.addEventListener('mousemove', (e) => {
        const rect = securityImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        securityImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    securityImage.addEventListener('mouseleave', () => {
        securityImage.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #a3e635, #22c55e);
    z-index: 9999;
    transition: width 0.1s ease;
    width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Counter animation for numbers
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            el.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    
    update();
}

// Emoji bounce on hover
document.querySelectorAll('.emoji-3d').forEach(emoji => {
    emoji.addEventListener('mouseenter', () => {
        emoji.style.animation = 'none';
        emoji.offsetHeight; // Trigger reflow
        emoji.style.animation = 'bounce3d 0.5s ease';
    });
});

// ============================================
// Subtle parallax background effect
// ============================================
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        hero.style.backgroundPosition = `center ${rate}px`;
    });
}
