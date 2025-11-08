import * as PIXI from 'pixi.js';
import { GameWorld } from './src/world/GameWorld.js';

console.log('🐜 Antz Canvas Project - Happy developing ✨');

/** Default canvas width (pixels) */
let currentWidth = 1280;
/** Default canvas height (pixels) */
let currentHeight = 720;

/**
 * The shared Pixi Application.
 * @type {PIXI.Application}
 */
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

// Attach canvas to DOM
document.getElementById('game-container').appendChild(app.view);

/** DOM element showing FPS */
const fpsCounter = document.getElementById('fps-counter');
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;

const settingsPanel = document.getElementById('settings-panel');
const settingsToggle = document.getElementById('settings-toggle');
const closeSettings = document.getElementById('close-settings');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const resolutionButtons = document.querySelectorAll('.resolution-btn');
const currentResolutionDisplay = document.getElementById('current-resolution');

settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.remove('hidden');
    settingsToggle.classList.add('hidden');
});

closeSettings.addEventListener('click', () => {
    settingsPanel.classList.add('hidden');
    settingsToggle.classList.remove('hidden');
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

resolutionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const resolution = button.dataset.resolution;
        const [width, height] = resolution.split('x').map(Number);
        resolutionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        resizeCanvas(width, height);
        currentResolutionDisplay.textContent = resolution.replace('x', '×');
    });
});

// Rendering container for ants
/** @type {PIXI.Container} */
const antContainer = new PIXI.Container();
antContainer.visible = true;
antContainer.alpha = 1.0;
antContainer.renderable = true;
antContainer.sortableChildren = true;
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

// Initialize game world
/** @type {GameWorld} */
const gameWorld = new GameWorld(app, antContainer);
let antCount = 100;
let isInitialized = false;
let isPaused = false; // when true skip game-world updates but keep rendering

/**
 * Update pause state and UI.
 * @param {boolean} paused
 */
function setPaused(paused) {
    isPaused = !!paused;
    fpsCounter.textContent = isPaused ? `PAUSED — FPS: ${fps}` : `FPS: ${fps}`;
    fpsCounter.style.color = isPaused ? '#FFD700' : '#00ff00';
    antContainer.alpha = isPaused ? 0.7 : 1.0;
}

/** Toggle the paused state. */
function togglePause() {
    setPaused(!isPaused);
}

// Keyboard: Space toggles pause unless typing in an input
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        const active = document.activeElement;
        const tag = active && active.tagName ? active.tagName.toLowerCase() : '';
        const isEditable = active && (tag === 'input' || tag === 'textarea' || active.isContentEditable);
        if (!isEditable) {
            e.preventDefault();
            togglePause();
        }
    }
});

/**
 * Initialize the game (loads assets through GameWorld).
 * @returns {Promise<void>}
 */
async function initializeGame() {
    try {
        await gameWorld.init();
        isInitialized = true;
        console.log('🎮 Game initialized successfully');
        gameWorld.spawnAnts(antCount);
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

/**
 * Resize the renderer and update world bounds.
 * @param {number} width
 * @param {number} height
 */
function resizeCanvas(width, height) {
    currentWidth = width;
    currentHeight = height;
    app.renderer.resize(width, height);
    gameWorld.updateWorldBounds(width, height);
    console.log(`Canvas resized to ${width}×${height}`);
}

const antCountButtons = document.querySelectorAll('.ant-count-btn');
const currentAntCountDisplay = document.getElementById('current-ant-count');
const customAntCountInput = document.getElementById('custom-ant-count');
const applyCustomCountButton = document.getElementById('apply-custom-count');

antCountButtons.forEach(button => {
    button.addEventListener('click', () => {
        const count = parseInt(button.dataset.count);
        antCountButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateAntCount(count);
    });
});

applyCustomCountButton.addEventListener('click', () => {
    const count = parseInt(customAntCountInput.value);
    if (count > 0 && count <= 10000) {
        antCountButtons.forEach(btn => btn.classList.remove('active'));
        updateAntCount(count);
    }
});

customAntCountInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        applyCustomCountButton.click();
    }
});

/**
 * Update ant population.
 * @param {number} count
 */
function updateAntCount(count) {
    antCount = count;
    if (isInitialized) {
        gameWorld.spawnAnts(count);
    }
    currentAntCountDisplay.textContent = count.toLocaleString();
    console.log(`Updated to ${count} ants`);
}

// Start
initializeGame().then(() => {}).catch(err => {
    console.error('Failed to initialize:', err);
});

// Main loop: advance game logic when not paused
app.ticker.add((ticker) => {
    const delta = ticker.deltaTime;
    if (!isPaused) {
        gameWorld.update(delta);
    }
    frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= 500) {
        fps = Math.round((frameCount * 1000) / deltaTime);
        fpsCounter.textContent = isPaused ? `PAUSED — FPS: ${fps}` : `FPS: ${fps}`;
        frameCount = 0;
        lastTime = currentTime;
    }
});

console.log('Canvas initialized! Ready to render ants 🐜');

/**
 * Exports for external use.
 * @type {{app: PIXI.Application, antContainer: PIXI.Container, gameWorld: GameWorld}}
 */
export { app, antContainer, gameWorld };
