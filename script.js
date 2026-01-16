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

// Parallax effect for floating cards
const floatingCards = document.querySelectorAll('.floating-card');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animateCards() {
    floatingCards.forEach((card, index) => {
        const depth = (index % 3 + 1) * 5;
        const moveX = mouseX * depth;
        const moveY = mouseY * depth;
        
        card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    requestAnimationFrame(animateCards);
}

animateCards();

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
if (phoneMockup) {
    const heroContainer = document.querySelector('.hero-phone-container');
    
    heroContainer.addEventListener('mousemove', (e) => {
        const rect = heroContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 50;
        const rotateY = (centerX - x) / 50;
        
        phoneMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    heroContainer.addEventListener('mouseleave', () => {
        phoneMockup.style.transform = 'rotateX(0deg) rotateY(0deg)';
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
