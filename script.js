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

/* ── Confetti ── */
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

const COLORS = ['#e08a3e', '#f0a85e', '#1c2e4a', '#2e7d6a', '#ffffff', '#ffd166', '#f472b6'];

let particles = [];
let animFrame = null;

function spawnConfetti(x, y, count = 90) {
  for (let i = 0; i < count; i++) {
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(3, 10);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(2, 7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(5, 11),
      rotation: randomBetween(0, Math.PI * 2),
      rotSpeed: randomBetween(-0.12, 0.12),
      life: 1,
      decay: randomBetween(0.010, 0.020),
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
    p.vy += 0.25;
    p.vx *= 0.98;
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

/* Auto-trigger confetti when gracias section enters view */
const graciasSec = document.getElementById('gracias');
let confettiFired = false;

const graciasTrigger = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !confettiFired) {
      confettiFired = true;
      graciasTrigger.unobserve(graciasSec);

      /* burst from center of viewport */
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight * 0.45;
      spawnConfetti(cx, cy, 110);

      /* second smaller burst after 400ms */
      setTimeout(() => {
        spawnConfetti(cx - 120, cy + 40, 40);
        spawnConfetti(cx + 120, cy + 40, 40);
      }, 400);

      if (!animFrame) animate();
    }
  });
}, { threshold: 0.35 });

graciasTrigger.observe(graciasSec);
