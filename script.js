// ---------- Envelope open ----------
const envelope = document.getElementById('envelope');
const envelopeScreen = document.getElementById('envelope-screen');
const mainEl = document.getElementById('main');

envelope.addEventListener('click', () => {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');

  setTimeout(() => {
    envelopeScreen.classList.add('hidden');
    mainEl.classList.add('show');
    document.body.style.overflow = 'auto';
  }, 1300);
});

document.body.style.overflow = 'hidden';

// ---------- 3D 360° Rotating Gallery ----------
(function initGallery3D() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  const photos = gallery.querySelectorAll('.polaroid');

  const RADIUS = 380;               // distance of each photo from center
  const AUTO_SPEED = 360 / 26000;   // deg per ms — one slow, smooth revolution
  const DRAG_SENSITIVITY = 0.35;

  const count = photos.length;
  const step = 360 / count;

  photos.forEach((photo, i) => {
    photo.dataset.baseAngle = i * step;
  });

  let angle = 0;
  let velocity = AUTO_SPEED;
  let isDragging = false;
  let isHovering = false;
  let lastX = 0;
  let lastTime = performance.now();

  function pointerX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onPointerDown(e) {
    isDragging = true;
    velocity = 0;
    lastX = pointerX(e);
    gallery.classList.add('dragging');
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const x = pointerX(e);
    const dx = x - lastX;
    lastX = x;
    angle += dx * DRAG_SENSITIVITY;
    velocity = dx * DRAG_SENSITIVITY;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    gallery.classList.remove('dragging');
  }

  gallery.addEventListener('mousedown', onPointerDown);
  gallery.addEventListener('touchstart', onPointerDown, { passive: true });

  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  window.addEventListener('mouseup', onPointerUp);
  window.addEventListener('touchend', onPointerUp);

  gallery.addEventListener('mouseenter', () => (isHovering = true));
  gallery.addEventListener('mouseleave', () => (isHovering = false));

  

  function render(now) {
    const dt = now - lastTime;
    lastTime = now;

    if (isDragging) {
      // angle already updated directly in onPointerMove for zero-lag dragging
    } else if (isHovering) {
      velocity += (0 - velocity) * 0.08;
      angle += velocity * dt;
    } else {
      velocity += (AUTO_SPEED - velocity) * 0.03;
      angle += velocity * dt;
    }

    gallery.style.transform = `rotateY(${angle}deg)`;

    photos.forEach((photo) => {
      const base = parseFloat(photo.dataset.baseAngle);
      let effective = (base + angle) % 360;
      if (effective < 0) effective += 360;
      if (effective > 180) effective -= 360;

      const facing = Math.cos((effective * Math.PI) / 180);
      const scale = 0.8 + 0.25 * ((facing + 1) / 2);
      const opacity = 0.4 + 0.6 * ((facing + 1) / 2);
      const brightness = 0.55 + 0.55 * ((facing + 1) / 2);
      const blur = facing < 0 ? (1 - (facing + 1) / 2) * 3 : 0;

      photo.style.transform =
        `rotateY(${base}deg) translateZ(${RADIUS}px) scale(${scale})`;
      photo.style.opacity = opacity;
      photo.style.filter = `brightness(${brightness}) blur(${blur}px)`;
      photo.style.zIndex = Math.round((facing + 1) * 100);
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();

// ---------- Ambient floating petals ----------
const ambient = document.getElementById('ambient');
const petalSVG = `<svg viewBox="0 0 32 32"><path d="M16 2 C22 2 28 8 28 16 C28 24 22 30 16 30 C10 30 4 24 4 16 C4 8 10 2 16 2 Z" fill="#ff9fb8" opacity="0.8"/></svg>`;
const heartSVG = `<svg viewBox="0 0 32 29"><path d="M16 29 C16 29 0 18 0 8.5 C0 3.8 3.8 0 8.5 0 C11.7 0 14.4 1.8 16 4.4 C17.6 1.8 20.3 0 23.5 0 C28.2 0 32 3.8 32 8.5 C32 18 16 29 16 29 Z" fill="#e3567a" opacity="0.7"/></svg>`;

for (let i = 0; i < 50; i++) {
  const el = document.createElement('div');
  el.className = 'petal';
  el.innerHTML = i % 3 === 0 ? heartSVG : petalSVG;

  const size = 14 + Math.random() * 22;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${Math.random() * 100}vw`;
  
  el.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
  el.style.setProperty('--rot-end', `${Math.random() * 800 - 200}deg`);
  el.style.animationDuration = `${9 + Math.random() * 14}s`;
  el.style.animationDelay = `-${Math.random() * 12}s`;

  ambient.appendChild(el);
}

// ---------- Countdown ----------
function nextBirthday() {
  const now = new Date();
  let year = now.getFullYear();
  let target = new Date(year, 7, 21);
  if (target < now) target = new Date(year + 1, 7, 21);
  return target;
}

function updateCountdown() {
  const target = nextBirthday();
  const diff = target - new Date();

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.getElementById('cd-days').textContent = String(d).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2, '0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Elements ----------
const wishBtn = document.getElementById('wishBtn');
const wishMsg = document.getElementById('wishMsg');
const cakeStage = document.getElementById('cakeStage');
const music = document.getElementById('birthdayMusic');
const musicToggle = document.getElementById('musicToggle');
const musicControl = document.querySelector('.music-control');

const colors = ['#e3567a', '#ffb6c8', '#cda05e', '#fff7f1', '#f7d9e0'];
let wishTriggered = false;
let musicStarted = false;

// Hide music button initially
if (musicControl) musicControl.style.display = 'none';

// ---------- Music ----------
musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    musicToggle.textContent = "♪ Pause Music";
  } else {
    music.pause();
    musicToggle.textContent = "♪ Play Music";
  }
});

// ---------- Celebration Functions ----------
function launchCelebration() {
  const particles = ["✨","🎉","🎊","💖","💝","🌸","💫","⭐","🥳","🎈"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "celebrated-particle";
    p.textContent = particles[Math.floor(Math.random() * particles.length)];

    p.style.fontSize = `${18 + Math.random() * 18}px`;
    p.style.setProperty("--dx", `${Math.random() * 500 - 250}px`);
    p.style.setProperty("--dy", `${220 + Math.random() * 280}px`);
    p.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    p.style.animationDuration = `${1.8 + Math.random() * 0.8}s`;

    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }
}

function launchConfetti() {
  for (let i = 0; i < 600; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    c.style.width = `${size}px`;
    c.style.height = `${size * 0.4}px`;
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animation = `confetti-fall ${2 + Math.random() * 2}s ease-in forwards`;
    c.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

const gradients = [
  'linear-gradient(135deg,#ff6fa5,#ff9a5c,#ffd36e)',
  'linear-gradient(135deg,#c471f5,#fa71cd,#ffb6c8)',
  'linear-gradient(135deg,#ff9a9e,#fecfef,#fad0c4)',
  'linear-gradient(135deg,#f857a6,#ff5858,#ffb88c)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb,#f6d365)'
];

function spawnHbPopup(i) {
  const emojis = ["🎈", "🎈", "🎈", "🎈", "🎈", "🎈", "🎈", "🎈", "🎈", "🎈"];
  
  for (let k = 0; k < 2; k++) {   // spawn 2 emojis per call
    const popup = document.createElement('div');
    popup.className = 'hb-popup';
    popup.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    
    popup.style.setProperty('--hb-gradient', gradients[(i + k) % gradients.length]);
    popup.style.left = `${12 + Math.random() * 76}vw`;
    popup.style.setProperty('--rot', `${Math.random() * 50 - 25}deg`);
    popup.style.fontSize = `${26 + Math.random() * 22}px`;
    popup.style.animationDuration = `${2.4 + Math.random() * 0.8}s`;
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
  }
}

function celebrate() {
  const flash = document.createElement('div');
  flash.className = 'celebration-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 1500);

  wishBtn.classList.add('celebrating');
  setTimeout(() => wishBtn.classList.remove('celebrating'), 19000);

  launchConfetti();
  launchCelebration();

  for (let i = 0; i < 5; i++) {
    setTimeout(() => spawnHbPopup(i), i * 80);
  }
}

// ---------- Wish Button Click ----------
wishBtn.addEventListener('click', () => {
  if (!wishTriggered) {
    wishTriggered = true;
    cakeStage.classList.add('show');
    wishMsg.classList.add('show');
    launchConfetti();

    if (musicControl) musicControl.style.display = 'block';
  }

  if (!musicStarted) {
    musicStarted = true;
    music.play().catch(err => console.log("Music play prevented:", err));
  } else if (music.paused) {
    music.play();
  }

  celebrate();
});

// ---------- Scroll animation fallback ----------
if (!CSS.supports('animation-timeline: view()')) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.translate = '0 0';
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.letter-paper').forEach(el => observer.observe(el));
}