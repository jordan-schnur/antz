import * as PIXI from 'pixi.js';

/** @type {PIXI.Texture | null} Cached ant texture (loaded once and reused) */
let antTexture = null;

/**
 * Load the ant texture from the project root `/ant.png`.
 * Use a relative path (no leading slash) so built sites and GitHub Pages resolve correctly.
 * @returns {Promise<PIXI.Texture>} The loaded ant texture
 */
export async function loadAntTexture() {
    if (!antTexture) {
        try {
            antTexture = await PIXI.Assets.load('ant.png');
            console.log('✅ Ant texture loaded successfully', {
                width: antTexture.width,
                height: antTexture.height,
                valid: antTexture.valid,
                baseTexture: antTexture.baseTexture?.valid
            });
        } catch (error) {
            console.error('❌ Failed to load ant texture:', error);
            throw error;
        }
    }
    return antTexture;
}

/**
 * Create a sprite using the shared ant texture.
 * @returns {PIXI.Sprite}
 */
export function createAntSprite() {
    if (!antTexture) {
        throw new Error('Ant texture not loaded. Call loadAntTexture() first.');
    }

    const sprite = new PIXI.Sprite(antTexture);
    sprite.anchor.set(0.5, 0.5);
    sprite.visible = true;
    sprite.alpha = 1.0;
    sprite.tint = 0xFFFFFF;
    sprite.scale.set(0.1, 0.1);

    return sprite;
}

/**
 * Create an ant sprite from a provided texture.
 * @param {PIXI.Texture} texture
 * @returns {PIXI.Sprite}
 */
export function createAntSpriteFromTexture(texture) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(0.5, 0.5);
    return sprite;
}
