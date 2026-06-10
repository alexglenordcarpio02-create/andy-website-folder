// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));

// Testimonial slider
const track = document.getElementById('testimonial-track');
const dots = document.querySelectorAll('.t-dot');
let current = 0;
const total = dots.length;

function goTo(i) {
  current = (i + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
}

document.getElementById('t-next').addEventListener('click', () => goTo(current + 1));
document.getElementById('t-prev').addEventListener('click', () => goTo(current - 1));
dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

// Auto-advance testimonials
setInterval(() => goTo(current + 1), 5500);

// Touch/swipe for testimonial slider
let tsX = 0;
track.parentElement.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
track.parentElement.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tsX;
  if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
});
