

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY || window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOut(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 8);
        smoothScrollTo(targetY, 900); // slow, ~0.9s
      }
      const nav = document.querySelector('.primary-nav');
      if (nav && nav.classList.contains('open')) nav.classList.remove('open');
    }
  });
});

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();


const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
}


const orbs = document.querySelectorAll('.orb');
if (orbs.length) {
  window.addEventListener('mousemove', (e) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; 
    const y = (e.clientY / innerHeight - 0.5) * 2;
    orbs.forEach((orb, idx) => {
      const depth = (idx + 1) * 6; 
      orb.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });
}


const tiltCards = document.querySelectorAll('.features .card');
tiltCards.forEach((card) => {
  const dampen = 12;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const rx = ((cy / rect.height) - 0.5) * -dampen; 
    const ry = ((cx / rect.width) - 0.5) * dampen;  
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
  

