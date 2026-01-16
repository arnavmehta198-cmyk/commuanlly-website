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

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 4px 16px rgba(134, 239, 172, 0.15)';
    } else {
        navbar.style.padding = '1.5rem 0';
        navbar.style.boxShadow = '0 2px 8px rgba(134, 239, 172, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Screenshot slideshow
const screenshots = document.querySelectorAll('.phone-mockup .screenshot');
let currentIndex = 0;

function rotateScreenshots() {
    if (screenshots.length > 1) {
        screenshots[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % screenshots.length;
        screenshots[currentIndex].classList.add('active');
    }
}

// Rotate every 4 seconds
setInterval(rotateScreenshots, 4000);

// Fade in on scroll with stagger effect
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all sections with initial hidden state
document.querySelectorAll('.feature-card, .step, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});

