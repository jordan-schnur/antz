import * as PIXI from 'pixi.js';
import { GameWorld } from './src/world/GameWorld.js';

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

// FPS Counter
const fpsCounter = document.getElementById('fps-counter');
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;

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

// ============================================================================
// GAME WORLD INITIALIZATION
// ============================================================================

const gameWorld = new GameWorld(app, antContainer);
let antCount = 100;
let isInitialized = false;
// Pause state: when true we skip game-world updates but keep rendering active
let isPaused = false;

/**
 * Toggle pause state and update UI.
 * When paused we still run the Pixi ticker (rendering), but skip game logic updates.
 */
function setPaused(paused) {
    isPaused = !!paused;
    // Update FPS counter to indicate paused state
    fpsCounter.textContent = isPaused ? `PAUSED — FPS: ${fps}` : `FPS: ${fps}`;
    // Tint the FPS counter so it's obvious when paused
    fpsCounter.style.color = isPaused ? '#FFD700' : '#00ff00';
    // Slightly dim the ant layer as a visual affordance (keeps rendering)
    antContainer.alpha = isPaused ? 0.7 : 1.0;
}

function togglePause() {
    setPaused(!isPaused);
}

// Keyboard handling: Space toggles pause. Ignore when typing in inputs/textareas.
window.addEventListener('keydown', (e) => {
    // Use code to reliably detect Spacebar; fallback to key
    if (e.code === 'Space' || e.key === ' ') {
        const active = document.activeElement;
        const tag = active && active.tagName ? active.tagName.toLowerCase() : '';

        const isEditable = active && (
            tag === 'input' ||
            tag === 'textarea' ||
            active.isContentEditable
        );

        if (!isEditable) {
            // Prevent page scrolling when space is pressed
            e.preventDefault();
            togglePause();
        }
    }
});

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
}).catch(err => {
    console.error('Failed to initialize:', err);
});

// Main game loop
app.ticker.add((ticker) => {
    const delta = ticker.deltaTime;
    // Update game world each frame (advance entity logic and sync sprites)
    // When paused we skip updating entity logic but keep rendering active.
    if (!isPaused) {
        gameWorld.update(delta);
    }

    // Update FPS counter
    frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;

    // Update FPS display every 500ms for smooth readability
    if (deltaTime >= 500) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        // Respect paused state when writing the text (keeps PAUSED label)
        fpsCounter.textContent = isPaused ? `PAUSED — FPS: ${fps}` : `FPS: ${fps}`;
        frameCount = 0;
        lastTime = currentTime;
    }
});

console.log('Canvas initialized! Ready to render ants 🐜');

// Export for potential external use
export { app, antContainer, gameWorld };
