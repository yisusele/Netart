//----------------------------------------------------------
// 🌙 LUNAYARI FESTIVAL - Fondo interactivo con partículas
// Optimizado para desktop y mobile
//----------------------------------------------------------

let logo, ambientSound;
let reveal = 0;
let showText = false;
let particles = [];
let pulse = 0;
let lastParticleTime = 0;
let lastTouchTime = 0;
/* let started = false; */

// 🎛️ Variables ajustables
let maxParticles = 2500;
let randomParticleInterval = 50;
let attractionStrength = 0.001;
let attractionRadiusSq = 60000;
let pulseSpeed = 0.07;
let pulseAmount = 15;
const touchThrottle = 120;

// 💡 Detectar mobile antes de setup()
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
  maxParticles = 150;
  randomParticleInterval = 120;
  attractionStrength = 0.0004;
  attractionRadiusSq = 25000;
  pulseSpeed = 0.05;
  pulseAmount = 10;
  console.log("🌐 Modo mobile ultra optimizado");
}

function preload() {
  logo = loadImage("assets/lunayari.png");
  fontLunayari = loadFont("assets/fonts/MacondoSwashCaps-Regular.ttf");
  fontFestival = loadFont("assets/fonts/NovaSquare-Regular.ttf");
  ambientSound = loadSound("assets/sonido.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noCursor();

  if (isMobile) {
    pixelDensity(0.75); // 🔹 no tan agresivo, mantiene buena nitidez
    frameRate(30);
  } else {
    pixelDensity(displayDensity());
    frameRate(45);
  }

  ambientSound.setLoop(true);
  ambientSound.setVolume(0.1);

  // Partículas iniciales
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  clear();
  background(10, 20, 30);

  // 💫 Pulso del logo
  pulse = sin(frameCount * pulseSpeed);
  let pulseSize = map(pulse, -1, 1, 5, pulseAmount);

  // 🔹 Dibujar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // Detectar mouse o touch sin necesidad de click
    let mx, my;
    if (touches.length > 0) {
      mx = touches[0].x;
      my = touches[0].y;
    } else if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      mx = mouseX;
      my = mouseY;
    }

    p.update(mx, my);
    p.display();

    if (p.isDead()) {
      particles.splice(i, 1);
      if (particles.length < maxParticles) {
        particles.push(new Particle(random(width), random(height)));
      }
    }
  }

  // 🌌 Crear partículas automáticas
  if (millis() - lastParticleTime > randomParticleInterval && particles.length < maxParticles) {
    particles.push(new Particle(random(width), random(height)));
    lastParticleTime = millis();
  }

  // 🌕 Logo + halo
  push();
  translate(width / 2, height / 2);
  let baseSize = min(width, height) * 0.35;
  let logoSize = baseSize + pulseSize;

  let haloAlpha = map(reveal, 0, 255, 0, 80);
  noStroke();
  for (let i = 0; i < 8; i++) {
    let alpha = map(i, 0, 8, haloAlpha, 0);
    let haloSize = logoSize + i * 40 + sin(frameCount * 0.05) * 5;
    fill(180, 220, 255, alpha);
    ellipse(0, 0, haloSize, haloSize);
  }

  tint(255, reveal);
  image(logo, 0, 0, logoSize, logoSize);
  pop();

  // 🩶 Texto
  if (showText) {
    let alpha = map(reveal, 200, 255, 0, 255);
    fill(255, alpha);
    textAlign(CENTER, CENTER);

    textFont(fontLunayari);
    let titleSize = max(min(width, height) * 0.08, 42);
    textSize(titleSize);
    text("LUNAYARI", width / 2, height * 0.75);

    textFont(fontFestival);
    let subtitleSize = max(min(width, height) * 0.05, 28);
    textSize(subtitleSize);
    text("festival", width / 2, height * 0.85);
  }
}

// ✨ Interacción
function mouseMoved() {
  addParticleAt(mouseX, mouseY);
  reveal += 0.3;
  if (reveal > 255) { reveal = 255; showText = true; }
}

function touchMoved() {
  if (touches.length === 0) return false;

  const now = millis();
  if (now - lastTouchTime > touchThrottle) {
    let t = touches[0];
    addParticleAt(t.x, t.y);
    reveal += 0.8;
    if (reveal > 255) { reveal = 255; showText = true; }
    lastTouchTime = now;
  }
  return false;
}

function addParticleAt(x, y) {
  const now = millis();
  if (now - lastParticleTime > 120 && particles.length < maxParticles) {
    particles.push(new Particle(x, y));
    if (!isMobile) particles.push(new Particle(x, y));
    lastParticleTime = now;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 🌫️ Partículas
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-0.3, 0.3);
    this.vy = random(-0.3, 0.3);
    this.size = random(2, 4);
    this.life = random(180, 255);
  }

  update(mx, my) {
    if (mx !== undefined && my !== undefined) {
      let dx = mx - this.x;
      let dy = my - this.y;
      let distSq = dx * dx + dy * dy;
      if (distSq < attractionRadiusSq) {
        this.vx += dx * attractionStrength;
        this.vy += dy * attractionStrength;
      }
    }
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life -= 1;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    noStroke();
    fill(180, 220, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.life < 0;
  }
}

// 🔊 Audio
function mousePressed() {
  if (!ambientSound.isPlaying()) ambientSound.play();
}
function touchStarted() {
  if (!ambientSound.isPlaying()) ambientSound.play();
  return false;
}

/* function startExperience() {
  if (!started) {
    started = true;
    ambientSound.loop();
    ambientSound.setVolume(0.1);
  }
}

function mousePressed() { startExperience(); }
function touchStarted() { startExperience(); return false; } */