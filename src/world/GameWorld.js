import { AntEntity } from '../entities/AntEntity.js';
import { createAntSprite, loadAntTexture } from '../rendering/SpriteFactory.js';

/**
 * GameWorld - Entity-Sprite Manager
 * Manages the relationship between game entities and their visual sprites
 */
export class GameWorld {
    constructor(app, container) {
        this.app = app;
        this.container = container;
        this.entities = [];  // Game logic objects
        this.sprites = [];   // Rendering sprites (1-to-1 with entities)
        this.textureLoaded = false; // Track if ant texture is loaded
    }

    /**
     * Initialize and load required assets
     * @returns {Promise<void>}
     */
    async init() {
        await loadAntTexture();
        this.textureLoaded = true;
    }

    /**
     * Spawn a single ant at specified position
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {AntEntity} The created ant entity
     */
    spawnAnt(x, y) {
        // Create game logic entity
        const entity = new AntEntity(
            x,
            y,
            this.app.screen.width,
            this.app.screen.height
        );

        // Create visual sprite
        const sprite = createAntSprite();
        sprite.x = entity.x;
        sprite.y = entity.y;
        this.container.addChild(sprite);

        // Store both
        this.entities.push(entity);
        this.sprites.push(sprite);

        // Debug log first ant
        if (this.entities.length === 1) {
            console.log('First ant sprite created:', {
                position: { x: sprite.x, y: sprite.y },
                visible: sprite.visible,
                alpha: sprite.alpha,
                scale: { x: sprite.scale.x, y: sprite.scale.y },
                tint: sprite.tint.toString(16),
                texture: sprite.texture.valid
            });
        }

        return entity;
    }

    /**
     * Spawn multiple ants at random positions
     * @param {number} count - Number of ants to spawn
     */
    spawnAnts(count) {
        this.clear();

        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            this.spawnAnt(x, y);
        }

        console.log(`Spawned ${count} ants 🐜`);
    }

    /**
     * Update all entities and sync sprites
     * @param {number} delta - Time delta from ticker
     */
    update(delta) {
        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            const sprite = this.sprites[i];

            // Update game logic
            entity.update(delta);

            // Sync sprite to entity state
            sprite.x = entity.x;
            sprite.y = entity.y;
            sprite.rotation = entity.direction + Math.PI / 2;
        }
    }

    /**
     * Clear all ants (removes entities and sprites)
     */
    clear() {
        // Remove all sprites from display
        for (let i = 0; i < this.sprites.length; i++) {
            this.container.removeChild(this.sprites[i]);
            // Don't destroy the shared texture, just the sprite instance
            this.sprites[i].destroy({ children: true, texture: false, baseTexture: false });
        }

        // Clear arrays
        this.entities = [];
        this.sprites = [];
    }

    /**
     * Get current ant count
     * @returns {number} Number of ants
     */
    getAntCount() {
        return this.entities.length;
    }

    /**
     * Update world bounds for all entities (called on resize)
     * @param {number} width - New world width
     * @param {number} height - New world height
     */
    updateWorldBounds(width, height) {
        for (const entity of this.entities) {
            entity.updateWorldBounds(width, height);
        }
    }
}

