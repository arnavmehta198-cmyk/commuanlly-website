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

// Navbar style on scroll (light navbar)
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for scroll animations
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
const animStyle = document.createElement('style');
animStyle.textContent = '.animate-target{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease}.animate-target.animate-in{opacity:1;transform:translateY(0)}';
document.head.appendChild(animStyle);

// Observe elements for animation
const animateSelectors = ['.strategy-card','.mini-card','.int-icon','.power-card','.testimonial-card','.pricing-card','.solution-feature','.sol-card'];
animateSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('animate-target');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
});

// Observe section headers
document.querySelectorAll('.strategy-content, .features-center, .integrations-content, .power-header, .proof-header, .pricing-header, .solution-content').forEach(el => {
    el.classList.add('animate-target');
    observer.observe(el);
});

// 3D tilt effect for cards
document.querySelectorAll('.strategy-card, .mini-card, .power-card, .testimonial-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// App window 3D effect
const appWindow = document.querySelector('.app-window');
const heroVisual = document.querySelector('.hero-visual');

if (appWindow && heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 80;
        const rotateY = (centerX - x) / 80;
        appWindow.style.transform = 'perspective(1500px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });
    heroVisual.addEventListener('mouseleave', () => {
        appWindow.style.transform = '';
    });
}

// Floating elements parallax
const floatingElements = document.querySelectorAll('.floating-element');
if (floatingElements.length > 0 && heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 30;
        const y = (e.clientY - rect.top - rect.height / 2) / 30;
        floatingElements.forEach((el, index) => {
            const depth = (index + 1) * 1.5;
            el.style.transform = 'translate(' + (x * depth) + 'px, ' + (y * depth) + 'px)';
        });
    });
    heroVisual.addEventListener('mouseleave', () => {
        floatingElements.forEach(el => {
            el.style.transform = '';
        });
    });
}

// Button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}.btn{position:relative;overflow:hidden}.btn-ripple{position:absolute;background:rgba(255,255,255,0.3);border-radius:50%;transform:scale(0);animation:ripple 0.6s ease-out;width:100px;height:100px;margin-left:-50px;margin-top:-50px;pointer-events:none}';
document.head.appendChild(rippleStyle);

// Scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#a3e635,#22c55e);z-index:9999;width:0%;transition:width 0.1s ease';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Job card hover effect
document.querySelectorAll('.job-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(8px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
