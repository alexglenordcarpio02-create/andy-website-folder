// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== STAT COUNTERS =====
function animateCounter(el, target, duration = 1600) {
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, +e.target.dataset.target);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

// ===== TESTIMONIAL SLIDER =====
const track = document.getElementById('testimonial-track');
const dots = document.querySelectorAll('.t-dot');
let current = 0;
const total = dots.length;
let autoTimer;

function goTo(i) {
  current = ((i % total) + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
}

function startAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(current + 1), 5500);
}

document.getElementById('t-next').addEventListener('click', () => { goTo(current + 1); startAuto(); });
document.getElementById('t-prev').addEventListener('click', () => { goTo(current - 1); startAuto(); });
dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.i); startAuto(); }));
startAuto();

// Touch swipe
let tsX = 0;
track.parentElement.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
track.parentElement.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tsX;
  if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -9999, y: -9999 };

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + .5,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    alpha: Math.random() * .5 + .1,
    color: Math.random() > .6 ? '#3dbcb0' : '#f6c94e',
  };
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 100);
  for (let i = 0; i < count; i++) particles.push(createParticle());
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    // Mouse repel
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      p.x += dx * force * .02;
      p.y += dy * force * .02;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const ddx = p.x - q.x;
      const ddy = p.y - q.y;
      const d = Math.sqrt(ddx * ddx + ddy * ddy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = '#3dbcb0';
        ctx.globalAlpha = (1 - d / 120) * .12;
        ctx.lineWidth = .8;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  });

  requestAnimationFrame(drawParticles);
}

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

window.addEventListener('resize', () => {
  resize();
  initParticles();
}, { passive: true });

resize();
initParticles();
drawParticles();

// ===== 3D BOOK TILT =====
const book3dWrap = document.getElementById('book3d');
if (book3dWrap) {
  const book3d = book3dWrap.querySelector('.book-3d');
  book3dWrap.addEventListener('mousemove', e => {
    const rect = book3dWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotY = ((e.clientX - cx) / rect.width) * 30;
    const rotX = -((e.clientY - cy) / rect.height) * 15;
    book3d.style.transform = `rotateY(${-15 + rotY}deg) rotateX(${5 + rotX}deg)`;
  });
  book3dWrap.addEventListener('mouseleave', () => {
    book3d.style.transform = 'rotateY(-15deg) rotateX(5deg)';
  });
}

// ===== NEWSLETTER FORM =====
const nlForm = document.getElementById('nl-form');
if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = nlForm.querySelector('button');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = 'linear-gradient(135deg, #5bac6a, #2a9b90)';
    btn.disabled = true;
    nlForm.querySelector('input').value = '';
  });
}

// ===== CARD 3D TILT =====
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotX = ((e.clientY - cy) / rect.height) * -8;
    const rotY = ((e.clientX - cx) / rect.width) * 8;
    card.style.transform = `translateY(-10px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    card.style.transition = 'box-shadow .35s';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .35s';
  });
});
