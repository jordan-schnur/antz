import * as PIXI from 'pixi.js';
import { GameWorld } from './src/world/GameWorld.js';
import { createAntSprite } from './src/rendering/SpriteFactory.js';

console.log('🐜 Antz Canvas Project - Happy developing ✨');

// Default resolution
let currentWidth = 1280;
let currentHeight = 720;

// Create the Pixi Application
const app = new PIXI.Application({
    width: currentWidth,
    height: currentHeight,
    backgroundColor: 0x1099bb,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
});
globalThis.__PIXI_APP__ = app;

console.log('🎮 Pixi Application created:', {
    width: app.screen.width,
    height: app.screen.height,
    renderer: app.renderer.type,
    backgroundColor: app.renderer.background.backgroundColor
});

// Add the canvas to the DOM
document.getElementById('game-container').appendChild(app.view);

// Settings Panel Logic
const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
const closeSettings = document.getElementById('close-settings');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const resolutionButtons = document.querySelectorAll('.resolution-btn');
const currentResolutionDisplay = document.getElementById('current-resolution');

// Toggle settings panel
settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.remove('hidden');
    settingsToggle.classList.add('hidden');
});

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
    settingsToggle.classList.remove('hidden');
});

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Resolution changing
resolutionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const resolution = button.dataset.resolution;
        const [width, height] = resolution.split('x').map(Number);

        // Update active button
        resolutionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Resize canvas
        resizeCanvas(width, height);

        // Update display
        currentResolutionDisplay.textContent = resolution.replace('x', '×');
    });
});

// ============================================================================
// RENDERING SYSTEM
// ============================================================================

// Create a container for rendering sprites
const antContainer = new PIXI.Container();
antContainer.visible = true;
antContainer.alpha = 1.0;
antContainer.renderable = true;
antContainer.sortableChildren = true; // Enable z-index sorting

// Add a semi-transparent background to the container to verify it renders
// TEMPORARILY DISABLED TO TEST IF IT'S BLOCKING SPRITES
// const containerBg = new PIXI.Graphics();
// containerBg.beginFill(0x00FF00, 0.1); // Semi-transparent green
// containerBg.drawRect(0, 0, currentWidth, currentHeight);
// containerBg.endFill();
// containerBg.zIndex = -1000; // Put it far in the back
// antContainer.addChild(containerBg);
// antContainer.sortableChildren = true; // Enable z-index sorting

app.stage.addChild(antContainer);

console.log('🎨 Ant container setup:', {
    visible: antContainer.visible,
    alpha: antContainer.alpha,
    position: { x: antContainer.x, y: antContainer.y },
    scale: { x: antContainer.scale.x, y: antContainer.scale.y },
    rotation: antContainer.rotation,
    parent: antContainer.parent ? 'has parent (stage)' : 'NO PARENT',
    stage: app.stage,
    stageChildren: app.stage.children.length,
    worldTransform: antContainer.worldTransform,
    children: antContainer.children.length,
    mask: antContainer.mask,
    filters: antContainer.filters,
    cullable: antContainer.cullable,
    sortableChildren: antContainer.sortableChildren
});

// Add a test red circle to verify rendering works
const testGraphics = new PIXI.Graphics();
testGraphics.beginFill(0xFF0000);
testGraphics.drawCircle(0, 0, 50);
testGraphics.endFill();
testGraphics.position.set(100, 100);
app.stage.addChild(testGraphics);
console.log('🔴 Test red circle added at (100, 100) - should be visible if rendering works');

// ============================================================================
// GAME WORLD INITIALIZATION
// ============================================================================

const gameWorld = new GameWorld(app, antContainer);
let antCount = 100;
let isInitialized = false;

// Initialize the game world (loads assets)
async function initializeGame() {
    try {
        await gameWorld.init();
        isInitialized = true;
        console.log('🎮 Game initialized successfully');

        // Spawn initial ants after initialization
        gameWorld.spawnAnts(antCount);
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

// Function to resize the canvas
function resizeCanvas(width, height) {
    currentWidth = width;
    currentHeight = height;

    app.renderer.resize(width, height);
    gameWorld.updateWorldBounds(width, height);
    console.log(`Canvas resized to ${width}×${height}`);
}

// Ant count controls
const antCountButtons = document.querySelectorAll('.ant-count-btn');
const currentAntCountDisplay = document.getElementById('current-ant-count');
const customAntCountInput = document.getElementById('custom-ant-count');
const applyCustomCountButton = document.getElementById('apply-custom-count');

// Preset ant count buttons
antCountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const count = parseInt(button.dataset.count);

        // Update active button
        antCountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update ant count
        updateAntCount(count);
    });
});

// Custom ant count input
applyCustomCountButton.addEventListener('click', () => {
    const count = parseInt(customAntCountInput.value);
    if (count > 0 && count <= 10000) {
        // Clear preset button selection
        antCountButtons.forEach(btn => btn.classList.remove('active'));
        updateAntCount(count);
    }
});

customAntCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyCustomCountButton.click();
    }
});

// Function to update ant count
function updateAntCount(count) {
    antCount = count;
    if (isInitialized) {
        gameWorld.spawnAnts(count);
    }
    currentAntCountDisplay.textContent = count.toLocaleString();
    console.log(`Updated to ${count} ants`);
}


// ============================================================================
// SPAWN INITIAL ANTS & START GAME LOOP
// ============================================================================

// Initialize game (loads assets, then spawns ants)
initializeGame().then(() => {
    // Add a test ant sprite directly on stage to verify texture works
    const testAntSprite = createAntSprite();
    testAntSprite.position.set(640, 360); // Center of default screen
    testAntSprite.scale.set(0.5, 0.5); // Larger for testing
    app.stage.addChild(testAntSprite);
    console.log('🐜 Test ant sprite added to stage (VISIBLE):', {
        position: { x: testAntSprite.x, y: testAntSprite.y },
        scale: { x: testAntSprite.scale.x, y: testAntSprite.scale.y },
        visible: testAntSprite.visible,
        alpha: testAntSprite.alpha,
        renderable: testAntSprite.renderable,
        worldVisible: testAntSprite.worldVisible,
        parent: testAntSprite.parent.constructor.name
    });

    // Compare with a sprite in the container
    if (antContainer.children.length > 0) {
        const containerSprite = antContainer.children[0];
        console.log('🐜 Container sprite (INVISIBLE?):', {
            position: { x: containerSprite.x, y: containerSprite.y },
            scale: { x: containerSprite.scale.x, y: containerSprite.scale.y },
            visible: containerSprite.visible,
            alpha: containerSprite.alpha,
            renderable: containerSprite.renderable,
            worldVisible: containerSprite.worldVisible,
            parent: containerSprite.parent.constructor.name,
            parentVisible: containerSprite.parent.visible,
            parentAlpha: containerSprite.parent.alpha,
            parentRenderable: containerSprite.parent.renderable
        });
    }
}).catch(err => {
    console.error('Failed to initialize:', err);
});

// Main game loop
// TEMPORARILY DISABLED TO TEST IF UPDATE IS CAUSING INVISIBILITY
app.ticker.add((ticker) => {
    const delta = ticker.deltaTime;
    // gameWorld.update(delta);
});

console.log('Canvas initialized! Ready to render ants 🐜');

// Export for potential external use
export { app, antContainer, gameWorld };

