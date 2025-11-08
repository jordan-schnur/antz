import * as PIXI from 'pixi.js';

console.log('🐜 Antz Canvas Project - Happy developing ✨');

// Create the Pixi Application
const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});

// Add the canvas to the DOM
document.getElementById('game-container').appendChild(app.view);

// Create a container for our ant(s)
const antContainer = new PIXI.Container();
app.stage.addChild(antContainer);

// Example: Create a placeholder ant (circle) until you import an actual ant image
// Replace this with your actual ant image loading code
const createPlaceholderAnt = (x, y) => {
    const antGraphics = new PIXI.Graphics();

    // Draw a simple ant shape as placeholder
    // Body
    antGraphics.beginFill(0x000000);
    antGraphics.drawCircle(0, 0, 15);
    antGraphics.drawCircle(-10, -5, 10);
    antGraphics.drawCircle(10, 5, 10);
    antGraphics.endFill();

    // Antennae
    antGraphics.lineStyle(2, 0x000000);
    antGraphics.moveTo(-8, -12);
    antGraphics.lineTo(-15, -20);
    antGraphics.moveTo(-3, -12);
    antGraphics.lineTo(-5, -20);

    antGraphics.x = x;
    antGraphics.y = y;

    return antGraphics;
};

// Function to load and display your ant image
// Uncomment and use this when you have an ant image
const loadAntImage = async (imagePath, x, y) => {
    try {
        const texture = await PIXI.Assets.load(imagePath);
        const antSprite = new PIXI.Sprite(texture);

        // Center the sprite anchor
        antSprite.anchor.set(0.5);
        antSprite.x = x;
        antSprite.y = y;

        // Optional: scale the ant to a reasonable size
        antSprite.scale.set(0.5);

        antContainer.addChild(antSprite);
        return antSprite;
    } catch (error) {
        console.error('Failed to load ant image:', error);
        console.log('Using placeholder ant instead');
        const placeholder = createPlaceholderAnt(x, y);
        antContainer.addChild(placeholder);
        return placeholder;
    }
};

// Create a placeholder ant in the center
const centerAnt = createPlaceholderAnt(app.screen.width / 2, app.screen.height / 2);
antContainer.addChild(centerAnt);

// Example animation: Make the ant move in a circle
let time = 0;
const radius = 100;
const centerX = app.screen.width / 2;
const centerY = app.screen.height / 2;

// Real-time rendering loop
app.ticker.add((ticker) => {
    time += ticker.deltaTime * 0.02;

    // Animate the ant in a circular path
    centerAnt.x = centerX + Math.cos(time) * radius;
    centerAnt.y = centerY + Math.sin(time) * radius;

    // Rotate the ant to face the direction of movement
    centerAnt.rotation = time + Math.PI / 2;
});

// To use your own ant image, uncomment this and provide the path:
loadAntImage('./ant.png', app.screen.width / 2, app.screen.height / 2);

console.log('Canvas initialized! Ready to render ants 🐜');

// Export for potential external use
export { app, antContainer, loadAntImage };

