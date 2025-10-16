//----------------------------------------------------------
// 🌙 LUNAYARI FESTIVAL - Fondo interactivo con partículas
// Optimizado para desktop y mobile
//----------------------------------------------------------

let logo;
let reveal = 0;
let showText = false;
let particles = [];
let pulse = 0;
let lastParticleTime = 0;

// 🎛️ Variables ajustables
let maxParticles = 2500;              // cantidad máxima de partículas
let randomParticleInterval = 50;      // ms entre partículas aleatorias
let attractionStrength = 0.001;       // fuerza de atracción del mouse (↑ más impacto)
let attractionRadiusSq = 60000;       // radio de influencia del mouse (↑ más área)
let pulseSpeed = 0.07;                // velocidad del pulso del logo
let pulseAmount = 15;                 // amplitud del pulso

let lastTouchTime = 0;     // declarar esto globalmente arriba del código
const touchThrottle = 120; // ms entre eventos efectivos

// 🔊 Elementos de sonido
let ambientSound;

// 💡 Adaptación automática para mobile
if (/Mobi|Android/i.test(navigator.userAgent)) {
  maxParticles = 250;           // 🔹 muchas menos partículas
  randomParticleInterval = 120; // 🔹 menos spawn
  attractionStrength = 0.0004;  // 🔹 cálculos más suaves
  attractionRadiusSq = 25000;
  pulseSpeed = 0.05;
  pixelDensity(0.5);            // 🔹 reduce resolución del canvas (gran mejora)
  frameRate(30);                // 🔹 limita FPS para no saturar CPU/GPU
  console.log("🌐 Modo mobile ultra optimizado");
}

function preload() {
  logo = loadImage("assets/lunayari.png",
    () => console.log("Logo cargado OK"),
    () => console.error("Error cargando logo")
  );

  fontLunayari = loadFont("assets/fonts/MacondoSwashCaps-Regular.ttf");
  fontFestival = loadFont("assets/fonts/NovaSquare-Regular.ttf");
  ambientSound = loadSound("assets/sonido.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noCursor();
  pixelDensity(displayDensity());
  frameRate(45);

  ambientSound.setLoop(true);
  ambientSound.setVolume(0.1);
  ambientSound.play();

  // Crear partículas iniciales
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(10, 20, 30);

  // 💫 Pulso del logo
  pulse = sin(frameCount * pulseSpeed);
  let pulseSize = map(pulse, -1, 1, 5, pulseAmount);

  // 🔹 Dibujar partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (mouseX || touches.length > 0) {
      let mx = mouseX || touches[0].x;
      let my = mouseY || touches[0].y;
      p.update(mx, my);
    } else {
      p.update();
    }
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

  // 🌕 Logo y halo
  push();
  translate(width / 2, height / 2);
let baseSize = min(width, height) * 0.35;
let logoSize = baseSize + pulseSize;

// 🔹 Revelar halo junto con el logo
let haloAlpha = map(reveal, 0, 255, 0, 80); // intensidad general
let haloLayers = 8;

noStroke();
for (let i = 0; i < haloLayers; i++) {
  let alpha = map(i, 0, haloLayers, haloAlpha, 0);
  let haloSize = logoSize + i * 40 + sin(frameCount * 0.05) * 5; // pequeño pulso
  fill(180, 220, 255, alpha);
  ellipse(0, 0, haloSize, haloSize);
}

// Logo
tint(255, reveal);
image(logo, 0, 0, logoSize, logoSize);
  pop();

  // 🩶 Texto del festival
  if (showText) {
  let alpha = map(reveal, 200, 255, 0, 255);
  fill(255, alpha);
  textAlign(CENTER, CENTER);

  textFont(fontLunayari);
  let titleSize = max(min(width, height) * 0.08, 42); // tamaño mínimo 42px
  textSize(titleSize);
  text("LUNAYARI", width / 2, height * 0.75);

  textFont(fontFestival);
  let subtitleSize = max(min(width, height) * 0.05, 28);
  textSize(subtitleSize);
  text("festival", width / 2, height * 0.85);
}
}

// ✨ Eventos del mouse/touch
function mouseMoved() {
  addParticleAt(mouseX, mouseY);
  reveal += 0.4;
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

  // 🔹 Evita re-renderes forzados por scroll
  return false;
}


// 🪶 Agregar partículas al interactuar
function addParticleAt(x, y) {
  const now = millis();
  if (now - lastParticleTime > 120 && particles.length < maxParticles) {
    particles.push(new Particle(x, y));
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      particles.push(new Particle(x, y)); // solo en desktop
    }
    lastParticleTime = now;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 🌫️ Clase Partícula
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

    // Teletransportarse si sale del canvas
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    noSmooth();
    noStroke();
    fill(180, 220, 255, this.life);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.life < 0;
  }
}

// 🖱️ Audio: iniciar tras interacción del usuario
function mousePressed() {
  if (!ambientSound.isPlaying()) ambientSound.play();
}

function touchStarted() {
  if (!ambientSound.isPlaying()) ambientSound.play();
  return false;
}
