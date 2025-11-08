import * as PIXI from 'pixi.js';

// Cached ant texture (loaded once and reused)
let antTexture = null;

/**
 * Load the ant texture from ant.png
 * @returns {Promise<PIXI.Texture>} The loaded ant texture
 */
export async function loadAntTexture() {
    if (!antTexture) {
        try {
            antTexture = await PIXI.Assets.load('/ant.png');
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
 * Factory function to create ant sprite using the ant.png image
 * @returns {PIXI.Sprite} Ant sprite with texture
 */
export function createAntSprite() {
    if (!antTexture) {
        throw new Error('Ant texture not loaded. Call loadAntTexture() first.');
    }

    const sprite = new PIXI.Sprite(antTexture);
    sprite.anchor.set(0.1, 0.1); // Center the sprite

    // Ensure sprite is visible
    sprite.visible = true;
    sprite.alpha = 1.0;
    sprite.tint = 0xFFFFFF; // White tint (no color modification)

    // Scale down the sprite to a reasonable size - matching test sprite scale
    sprite.scale.set(0.1, 0.1);

    return sprite;
}


/**
 * Create ant sprite from custom texture
 * @param {PIXI.Texture} texture - Custom texture
 * @returns {PIXI.Sprite} Ant sprite
 */
export function createAntSpriteFromTexture(texture) {
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5, 0.5);
    // Scale to reasonable size (adjust as needed)
    sprite.scale.set(0.5, 0.5);
    return sprite;
}

