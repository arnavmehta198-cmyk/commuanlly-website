// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// 3D Tilt Effect on Phone Showcase
const phoneDuo = document.querySelector('.phone-duo');
const phoneShowcase = document.querySelector('.hero-phone-showcase');

if (phoneDuo && phoneShowcase) {
    phoneShowcase.addEventListener('mousemove', (e) => {
        const rect = phoneShowcase.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        phoneDuo.style.animation = 'none';
        phoneDuo.style.transform = 'rotateX(' + (-rotateX) + 'deg) rotateY(' + (-rotateY) + 'deg)';
    });
    
    phoneShowcase.addEventListener('mouseleave', () => {
        phoneDuo.style.animation = 'floatPhones 6s ease-in-out infinite';
        phoneDuo.style.transform = '';
    });
}

// Navbar scroll effect
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

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animStyle = document.createElement('style');
animStyle.textContent = '.animate-target{opacity:0;transform:translateY(30px);transition:opacity 0.6s ease,transform 0.6s ease}.animate-target.animate-in{opacity:1;transform:translateY(0)}';
document.head.appendChild(animStyle);

['.strategy-card','.power-card','.pricing-card'].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
        el.classList.add('animate-target');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
});

// 3D tilt on cards
document.querySelectorAll('.strategy-card, .power-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Scroll progress bar
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#a3e635,#22c55e);z-index:9999;width:0%;transition:width 0.1s ease';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
});
