/* ── Scroll reveal ── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── Header shrink on scroll ── */
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  header.style.padding = window.scrollY > 60 ? '0' : '';
}, { passive: true });

/* ── Gracias button + confetti ── */
const btn = document.getElementById('btnGracias');
const graciasText = document.getElementById('gracias-text');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

const messages = [
  '¡Gracias por participar!',
  '¡Nos alegra mucho que hayas estado!',
  '¡Fue un gusto compartir este espacio!',
  '¡Hasta el próximo taller!',
];

let msgIndex = 0;
let particles = [];
let animFrame = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

const COLORS = ['#e08a3e', '#f0a85e', '#1c2e4a', '#2e7d6a', '#ffffff', '#ffd166'];

function spawnConfetti(x, y, count = 80) {
  for (let i = 0; i < count; i++) {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(3, 9);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(2, 6),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(5, 10),
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.12, 0.12),
      life: 1,
      decay: randomBetween(0.012, 0.022),
    });
  }
}

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.life;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;         // gravity
    p.vx *= 0.98;         // air drag
    p.rotation += p.rotSpeed;
    p.life -= p.decay;
    drawParticle(p);
  }

  if (particles.length > 0) {
    animFrame = requestAnimationFrame(animate);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animFrame = null;
  }
}

btn.addEventListener('click', () => {
  msgIndex = (msgIndex + 1) % messages.length;
  graciasText.textContent = messages[msgIndex];

  // Burst from button center
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  spawnConfetti(cx, cy, 90);

  if (!animFrame) animate();

  btn.classList.add('clicked');
  setTimeout(() => btn.classList.remove('clicked'), 1200);
});

/* hover: mini-burst */
btn.addEventListener('mouseenter', () => {
  const rect = btn.getBoundingClientRect();
  spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
  if (!animFrame) animate();
});

/* ── Smooth active nav link ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + entry.target.id
          ? 'var(--amber-light)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
