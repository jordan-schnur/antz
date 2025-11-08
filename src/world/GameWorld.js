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
        sprite.position.set(entity.x, entity.y);
        sprite.zIndex = 100; // Ensure sprites are on top

        // TEMPORARY: Add directly to stage to test if container is the problem
        this.app.stage.addChild(sprite);
        // this.container.addChild(sprite);

        // Store both
        this.entities.push(entity);
        this.sprites.push(sprite);

        // Debug log first few ants
        if (this.entities.length <= 3) {
            console.log(`Ant ${this.entities.length} sprite created:`, {
                position: { x: sprite.x, y: sprite.y },
                worldTransform: sprite.worldTransform,
                visible: sprite.visible,
                alpha: sprite.alpha,
                scale: { x: sprite.scale.x, y: sprite.scale.y },
                tint: sprite.tint.toString(16),
                texture: {
                    valid: sprite.texture.valid,
                    width: sprite.texture.width,
                    height: sprite.texture.height,
                    baseTexture: sprite.texture.baseTexture?.valid
                },
                width: sprite.width,
                height: sprite.height,
                bounds: sprite.getBounds(),
                parent: sprite.parent ? 'has parent' : 'NO PARENT',
                renderable: sprite.renderable
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

        console.log(`🐜 Spawning ${count} ants in world:`, {
            worldWidth: this.app.screen.width,
            worldHeight: this.app.screen.height,
            containerChildren: this.container.children.length
        });

        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            this.spawnAnt(x, y);
        }

        console.log(`✅ Spawned ${count} ants, container now has ${this.container.children.length} children`);
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

            // Sync sprite to entity state - use position.set for explicit transform update
            sprite.position.set(entity.x, entity.y);
            // TEMPORARILY DISABLED TO TEST IF ROTATION IS THE ISSUE
            // sprite.rotation = entity.direction + Math.PI / 2;
        }
    }

    /**
     * Clear all ants (removes entities and sprites)
     */
    clear() {
        if (this.sprites.length > 0) {
            console.log(`🧹 Clearing ${this.sprites.length} sprites from container`);
        }

        // Remove all sprites from display
        for (let i = 0; i < this.sprites.length; i++) {
            // TEMPORARY: Remove from stage instead of container
            this.app.stage.removeChild(this.sprites[i]);
            // this.container.removeChild(this.sprites[i]);
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

