let logo;
let reveal = 0;
let showText = false;
let particles = [];
let pulse = 0;

let lastParticleTime = 0;
let maxParticles = 2500; // límite de partículas en pantalla
let randomParticleInterval = 50; // ms entre partículas automáticas

function preload() {
    logo = loadImage("assets/lunayari.png", 
      () => console.log("Logo cargado OK"), 
      () => console.error("Error cargando logo")
    );

    fontLunayari = loadFont("assets/fonts/MacondoSwashCaps-Regular.ttf");
fontFestival = loadFont("assets/fonts/NovaSquare-Regular.ttf");
ambientSound = loadSound("assets/sonido.wav"); // tu sonido  

}
  

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noCursor();

  ambientSound.setLoop(true);
  ambientSound.setVolume(0.1); // volumen muy bajo
  ambientSound.play();

  // Inicializamos algunas partículas en pantalla
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(10, 20, 30);

  // Pulso y brillo del logo
  pulse = sin(frameCount * 0.070);
  let pulseSize = map(pulse, -1, 1, 5,15);


  // Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    // Atracción hacia mouse/touch
    if (mouseX || touches.length > 0) {
      let mx = mouseX || touches[0].x;
      let my = mouseY || touches[0].y;
      p.update(mx, my);
    } else {
      p.update();
    }
    p.display();

    // Reaparecen al morir
    if (p.isDead()) {
      particles.splice(i, 1);
      if (particles.length < maxParticles) {
        particles.push(new Particle(random(width), random(height)));
      }
    }
  }

  // Agregar partículas aleatorias cada intervalo
  if (millis() - lastParticleTime > randomParticleInterval && particles.length < maxParticles) {
    particles.push(new Particle(random(width), random(height)));
    lastParticleTime = millis();
  }

  // Logo y halo difuso
  push();
  translate(width / 2, height / 2);
  let baseSize = min(width, height) * 0.35; // recalculado siempre
  let logoSize = baseSize + pulseSize;

  noStroke();
  for (let i = 0; i < 10; i++) {
    let alpha = map(i, 0, 10, 40, 0);
    let haloSize = logoSize + i * 40;
    fill(180, 220, 255, alpha);
    ellipse(0, 0, haloSize, haloSize);
  }

  tint(255, reveal);
  image(logo, 0, 0, logoSize, logoSize);
  pop();

  // Texto del festival
  if (showText) {
    let alpha = map(reveal, 200, 255, 0, 255);
    fill(255, alpha);
    textAlign(CENTER, CENTER);
    textFont(fontLunayari);
    textSize(72);
    text("LUNAYARIS", width / 2, height * 0.75);

    textFont(fontFestival);
    textSize(48);
    text("festival", width / 2, height * 0.85);
  }
}

// Control de partículas por mouse
function mouseMoved() {
  addParticleAt(mouseX, mouseY);

  reveal += 1;
  if(reveal>255){ reveal = 255; showText = true; }

}
function touchMoved() {
  addParticleAt(touches[0].x, touches[0].y);
  reveal += 1;
  if(reveal>255){ reveal = 255; showText = true; }
  return false; // evita scroll
}

function addParticleAt(x, y) {
    const now = millis();
    if (now - lastParticleTime > 120 && particles.length < maxParticles) {
      particles.push(new Particle(x, y));
      particles.push(new Particle(x, y)); // segunda partícula
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
    // Si hay coordenadas de atracción
    if (mx !== undefined && my !== undefined) {
      let dx = mx - this.x;
      let dy = my - this.y;
      let distSq = dx * dx + dy * dy;
      if (distSq < 30000) {
        this.vx += dx * 0.0005;
        this.vy += dy * 0.0005;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life -= 1;

    // Teletransportarse al otro lado
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

function mousePressed() {
    if (!ambientSound.isPlaying()) {
      ambientSound.play();
    }
  }
  
  function touchStarted() {
    if (!ambientSound.isPlaying()) {
      ambientSound.play();
    }
    return false; // evita scroll
  }