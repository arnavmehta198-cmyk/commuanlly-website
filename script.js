// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Advanced 3D Phone Showcase with Parallax
const phoneDuo = document.querySelector('.phone-duo');
const phoneShowcase = document.querySelector('.hero-phone-showcase');
const phoneFront = document.querySelector('.phone-front');
const phoneBack = document.querySelector('.phone-back');

if (phoneDuo && phoneShowcase) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    function animatePhones() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        
        if (phoneFront && phoneBack) {
            const frontRotateX = -5 + currentY * 15;
            const frontRotateY = 10 - currentX * 20;
            const frontRotateZ = -3 + currentX * 5;
            const frontTranslateX = currentX * 30;
            const frontTranslateY = currentY * 20;
            phoneFront.style.transform = 
                'rotateX(' + frontRotateX + 'deg) rotateY(' + frontRotateY + 'deg) rotateZ(' + frontRotateZ + 'deg) translateX(' + (50 + frontTranslateX) + 'px) translateY(' + frontTranslateY + 'px) translateZ(' + (50 + Math.abs(currentX) * 30) + 'px)';
            
            const backRotateX = 5 - currentY * 12;
            const backRotateY = -15 + currentX * 18;
            const backRotateZ = 5 - currentX * 4;
            const backTranslateX = -currentX * 25;
            const backTranslateY = -currentY * 15;
            phoneBack.style.transform = 
                'rotateX(' + backRotateX + 'deg) rotateY(' + backRotateY + 'deg) rotateZ(' + backRotateZ + 'deg) translateX(' + backTranslateX + 'px) translateY(' + backTranslateY + 'px) translateZ(' + (-20 - Math.abs(currentX) * 20) + 'px)';
        }
        
        requestAnimationFrame(animatePhones);
    }
    animatePhones();
    
    phoneShowcase.addEventListener('mousemove', (e) => {
        const rect = phoneShowcase.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    phoneShowcase.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });
}

// Navbar scroll effect with blur
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset > 50;
    navbar.style.background = scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.9)';
    navbar.style.backdropFilter = scrolled ? 'blur(20px)' : 'blur(10px)';
    navbar.style.boxShadow = scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none';
});

// Magnetic 3D Cards with Glow
document.querySelectorAll('.strategy-card, .power-card, .pricing-card').forEach(card => {
    card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        const rotateX = y * -25;
        const rotateY = x * 25;
        
        card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(30px) scale(1.02)';
        card.style.boxShadow = (-x * 30) + 'px ' + (y * 30) + 'px 60px rgba(0,0,0,0.15), 0 0 30px rgba(163,230,53,' + (0.1 + Math.abs(x) * 0.2) + ')';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
    });
});

// Scroll reveal with stagger
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.strategy-card, .power-card, .pricing-card, .icon-item').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px) rotateX(15deg)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.1) + 's, transform 0.8s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.1) + 's';
    observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.revealed{opacity:1!important;transform:translateY(0) rotateX(0)!important}';
document.head.appendChild(style);

// Scroll progress with gradient
const progress = document.createElement('div');
progress.style.cssText = 'position:fixed;top:0;left:0;height:3px;background:linear-gradient(90deg,#84cc16,#22c55e,#10b981);z-index:9999;width:0;transition:width 0.15s ease-out;box-shadow:0 0 10px rgba(132,204,22,0.5)';
document.body.appendChild(progress);

window.addEventListener('scroll', () => {
    const pct = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = pct + '%';
});

// Floating particles background
function createParticles() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;overflow:hidden';
    document.body.appendChild(container);
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        particle.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;background:linear-gradient(135deg,rgba(163,230,53,0.3),rgba(34,197,94,0.2));border-radius:50%;left:' + (Math.random()*100) + '%;top:' + (Math.random()*100) + '%;animation:floatParticle ' + (8+Math.random()*12) + 's ease-in-out infinite;animation-delay:' + (Math.random()*5) + 's;filter:blur(1px);';
        container.appendChild(particle);
    }
}

const particleStyle = document.createElement('style');
particleStyle.textContent = '@keyframes floatParticle{0%,100%{transform:translate(0,0) scale(1);opacity:0.3}25%{transform:translate(50px,-80px) scale(1.2);opacity:0.6}50%{transform:translate(-30px,-150px) scale(0.8);opacity:0.4}75%{transform:translate(70px,-100px) scale(1.1);opacity:0.5}}';
document.head.appendChild(particleStyle);
createParticles();
