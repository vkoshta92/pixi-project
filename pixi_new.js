/**
 * This is the default playground.
 * You should see a bunny spinning in the right preview pane.
 * Feel free to use this as a starting point for you own playground!
 */

// Create our application instance
(async () => {
  const app = new PIXI.Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2c3e50,
  });
  document.body.appendChild(app.canvas);
  let container = new PIXI.Container();
  app.stage.addChild(container);
  const texture = await PIXI.Assets.load(
    "https://pixijs.io/examples/examples/assets/bunny.png"
  );

  for (let i = 0; i < 5; i++) {
    let sprite = new PIXI.Sprite(texture);
    sprite.x = i * 50;
    sprite.y = 0;
    sprite.scale.set(0.8);
    container.addChild(sprite);
  }
  container.x = 0;
  container.y = app.screen.height / 2;
  let s = 2;
  app.ticker.add(() => {
    container.x += s;
    if (container.x > app.screen.width) {
      container.x = -container.width;
    }
  });
})();
