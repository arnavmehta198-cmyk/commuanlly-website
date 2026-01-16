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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
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
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-target.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card.animate-target {
        transition-delay: calc(var(--delay, 0) * 0.1s);
    }
    
    .step-card.animate-target {
        transition-delay: calc(var(--delay, 0) * 0.15s);
    }
`;
document.head.appendChild(style);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step-card, .security-grid, .cta-card').forEach((el, index) => {
    el.classList.add('animate-target');
    el.style.setProperty('--delay', index);
    observer.observe(el);
});

// Floating cards parallax effect
const floatingCards = document.querySelectorAll('.floating-card');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            floatingCards.forEach((card, index) => {
                const speed = 0.05 + (index * 0.01);
                const yPos = scrolled * speed;
                card.style.transform = `translateY(${-yPos}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

// Add twinkling effect to stars in CTA
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    // Add more stars dynamically
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            width: ${Math.random() * 2 + 1}px;
            height: ${Math.random() * 2 + 1}px;
            animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        starsContainer.appendChild(star);
    }
}

// Add twinkle animation
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(twinkleStyle);

// Initialize stars
createStars();

// Phone mockup image rotation (if multiple screenshots)
const screenshots = document.querySelectorAll('.phone-mockup .screenshot');
if (screenshots.length > 1) {
    let currentIndex = 0;
    setInterval(() => {
        screenshots[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % screenshots.length;
        screenshots[currentIndex].classList.add('active');
    }, 4000);
}
