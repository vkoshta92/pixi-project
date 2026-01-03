// ----------------------
// APP SETUP
// ----------------------
const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

// ----------------------
// BACKGROUND (Scrolling)
// ----------------------
const bgTexture = PIXI.Texture.from(
  "https://pixijs.io/examples/examples/assets/pixi-filters/bg_depth_blur.jpg"
);

const background = new PIXI.TilingSprite(
  bgTexture,
  app.screen.width,
  app.screen.height
);
app.stage.addChild(background);

// ----------------------
// PLAYER
// ----------------------
const playerTexture = PIXI.Texture.from(
  "https://pixijs.io/examples/examples/assets/bunny.png"
);

const player = new PIXI.Sprite(playerTexture);
player.anchor.set(0.5);
player.x = app.screen.width / 2;
player.y = app.screen.height / 2;
player.scale.set(1.2);
app.stage.addChild(player);

// ----------------------
// TEXT UI
// ----------------------
let clickCount = 0;
const text = new PIXI.Text(`Clicks: 0`, {
  fill: "#ffffff",
  fontSize: 24,
});
text.x = 20;
text.y = 20;
app.stage.addChild(text);

// ----------------------
// KEYBOARD INPUT
// ----------------------
const keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

// ----------------------
// PARTICLES (SIMPLE)
// ----------------------
const particles = [];

function createParticle(x, y) {
  const p = new PIXI.Graphics();
  p.beginFill(0xffff00);
  p.drawCircle(0, 0, 3);
  p.endFill();
  p.x = x;
  p.y = y;
  p.vx = (Math.random() - 0.5) * 2;
  p.vy = (Math.random() - 0.5) * 2;
  p.life = 30;
  app.stage.addChild(p);
  particles.push(p);
}

// ----------------------
// CLICK EXPLOSION
// ----------------------
app.stage.eventMode = "static";
app.stage.on("pointerdown", (e) => {
  clickCount++;
  text.text = `Clicks: ${clickCount}`;

  for (let i = 0; i < 20; i++) {
    createParticle(e.global.x, e.global.y);
  }
});

// ----------------------
// GAME LOOP
// ----------------------
app.ticker.add(() => {
  // Background scroll
  background.tilePosition.x -= 1;

  // Player movement
  let moving = false;

  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= 5;
    player.scale.x = -1.2;
    moving = true;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += 5;
    player.scale.x = 1.2;
    moving = true;
  }
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= 5;
    moving = true;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.y += 5;
    moving = true;
  }

  // Bounds
  player.x = Math.max(0, Math.min(app.screen.width, player.x));
  player.y = Math.max(0, Math.min(app.screen.height, player.y));

  // Particle trail when moving
  if (moving) {
    createParticle(player.x, player.y);
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) {
      app.stage.removeChild(p);
      particles.splice(i, 1);
    }
  }
});
