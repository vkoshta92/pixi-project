// APP SETUP (Responsive)
const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x000000,
  antialias: true,
});

document.body.appendChild(app.view);

// Enable interaction
app.stage.eventMode = "static";
app.stage.hitArea = app.screen;

// SCROLLING BACKGROUND
const bgTexture = PIXI.Texture.from(
  "https://pixijs.io/examples/examples/assets/bg_grass.jpg"
);

const background = new PIXI.TilingSprite(
  bgTexture,
  app.screen.width,
  app.screen.height
);

app.stage.addChild(background);

// Resize background
window.addEventListener("resize", () => {
  background.width = app.screen.width;
  background.height = app.screen.height;
});


// PLAYER
const player = PIXI.Sprite.from(
  "https://pixijs.io/examples/examples/assets/bunny.png"
);

player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
player.scale.set(1.2);

app.stage.addChild(player);


// ADVANCED: FILTER (Blur)
const blurFilter = new PIXI.filters.BlurFilter(2);
player.filters = [blurFilter];

// UI TEXT
let clickCount = 0;

const counterText = new PIXI.Text("Clicks: 0", {
  fill: "#ffffff",
  fontSize: 22,
});

counterText.x = 20;
counterText.y = 20;
app.stage.addChild(counterText);

// KEYBOARD INPUT
const keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// PARTICLES
const particles = [];
const MAX_PARTICLES = 150;

function createParticle(x, y) {
  if (particles.length > MAX_PARTICLES) {
    const old = particles.shift();
    app.stage.removeChild(old);
  }

  const p = new PIXI.Graphics();
  p.beginFill(0xffcc00);
  p.drawCircle(0, 0, 4);
  p.endFill();

  p.x = x;
  p.y = y;
  p.vx = (Math.random() - 0.5) * 2;
  p.vy = (Math.random() - 0.5) * 2;
  p.life = 30;

  app.stage.addChild(p);
  particles.push(p);
}

// CLICK / TAP EXPLOSION
app.stage.on("pointerdown", (e) => {
  clickCount++;
  counterText.text = `Clicks: ${clickCount}`;

  for (let i = 0; i < 20; i++) {
    createParticle(e.global.x, e.global.y);
  }
});

// ADVANCED: MASK (Circular)
const mask = new PIXI.Graphics();
mask.beginFill(0xffffff);
mask.drawCircle(0, 0, 220);
mask.endFill();

app.stage.addChild(mask);
app.stage.mask = mask;

// GAME LOOP
app.ticker.add(() => {
  // Background scroll
  background.tilePosition.x -= 1;

  let moving = false;
  const speed = 5;

  // Movement
  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= speed;
    player.scale.x = -1.2;
    moving = true;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += speed;
    player.scale.x = 1.2;
    moving = true;
  }
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= speed;
    moving = true;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.y += speed;
    moving = true;
  }

  // Bounds
  player.x = Math.max(0, Math.min(app.screen.width, player.x));
  player.y = Math.max(0, Math.min(app.screen.height, player.y));

  // Particle trail
  if (moving) {
    createParticle(player.x, player.y);
  }

  // Animate filter
  blurFilter.blur = moving ? 4 : 2;

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) { // memory clean
      app.stage.removeChild(p);
      particles.splice(i, 1);
    }
  }

  // Mask follows player
  mask.x = player.x;
  mask.y = player.y;
});
