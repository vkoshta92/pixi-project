// APP SETUP (Responsive)
const app = new PIXI.Application({
  backgroundColor: 0x000000,
  antialias: true,
});

document.body.appendChild(app.view);

// Enable interaction
app.stage.eventMode = "static";

// SCROLLING BACKGROUND
const bgTexture = PIXI.Texture.from(
  "https://pixijs.io/examples/examples/assets/bg_grass.jpg"
);

const background = new PIXI.TilingSprite(bgTexture);
app.stage.addChild(background);

// PLAYER
const player = PIXI.Sprite.from(
  "https://pixijs.io/examples/examples/assets/bunny.png"
);
player.anchor.set(0.5);
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
  p.beginFill(0xffcc00).drawCircle(0, 0, 4).endFill();
  p.x = x;
  p.y = y;
  p.vx = (Math.random() - 0.5) * 2;
  p.vy = (Math.random() - 0.5) * 2;
  p.life = 30;

  app.stage.addChild(p);
  particles.push(p);
}

// CLICK

app.stage.hitArea = new PIXI.Rectangle();

app.stage.on("pointerdown", (e) => {
  clickCount++;
  counterText.text = `Clicks: ${clickCount}`;

  for (let i = 0; i < 20; i++) {
    createParticle(e.global.x, e.global.y);
  }
});

// MASK

const mask = new PIXI.Graphics();
app.stage.addChild(mask);
app.stage.mask = mask;

// 🔥 REAL RESPONSIVE RESIZE

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  // Renderer resize (IMPORTANT)
  app.renderer.resize(w, h);

  // Hit area update
  app.stage.hitArea.width = w;
  app.stage.hitArea.height = h;

  // Background resize
  background.width = w;
  background.height = h;

  // Player center on first load only
  if (!player._placed) {
    player.x = w / 2;
    player.y = h / 2;
    player._placed = true;
  }

  // Player scale responsive
  const scale = Math.min(w, h) / 600;
  player.scale.set(scale);

  // UI text
  counterText.x = 20;
  counterText.y = 20;

  const radius = Math.min(w, h) / 2.5;

  mask.clear();
  mask.beginFill(0xffffff);
  mask.drawCircle(0, 0, radius);
  mask.endFill();

  mask.x = w / 2;
  mask.y = h / 2;
}

window.addEventListener("resize", resize);
resize(); // initial call

// GAME LOOP
app.ticker.add(() => {
  background.tilePosition.x -= 1;

  let moving = false;
  const speed = 5;

  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= speed;
    player.scale.x = -Math.abs(player.scale.x);
    moving = true;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += speed;
    player.scale.x = Math.abs(player.scale.x);
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

  if (moving) {
    createParticle(player.x, player.y);
  }

  blurFilter.blur = moving ? 4 : 2;

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (--p.life <= 0) {
      app.stage.removeChild(p);
      particles.splice(i, 1);
    }
  }

  // // Mask follows player
  // mask.x = player.x;
  // mask.y = player.y;
});
