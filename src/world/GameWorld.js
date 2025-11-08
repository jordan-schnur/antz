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
    }

    /**
     * Initialize and load required assets
     * @returns {Promise<void>}
     */
    async init() {
        await loadAntTexture();
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
        this.container.addChild(sprite);

        // Store both
        this.entities.push(entity);
        this.sprites.push(sprite);

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
        // Defensive: cap delta to avoid runaway updates if ticker misreports
        const maxDelta = 10; // frames - arbitrary large cap
        // Ensure delta is a finite number; fallback to 1 frame if not
        const rawDelta = Number.isFinite(delta) ? delta : 1;
        const dt = Math.min(rawDelta, maxDelta);

        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            const sprite = this.sprites[i];

            // Save previous valid state (to revert on bad update)
            const prevX = Number.isFinite(entity.x) ? entity.x : centerX;
            const prevY = Number.isFinite(entity.y) ? entity.y : centerY;
            const prevDir = Number.isFinite(entity.direction) ? entity.direction : 0;

            // Update game logic (entity uses its internal world bounds)
            entity.update(dt);

            // If entity produced invalid coordinates/rotation, revert to previous
            if (!Number.isFinite(entity.x) || !Number.isFinite(entity.y) || !Number.isFinite(entity.direction)) {
                // Revert to last known-good values to avoid snapping to center each frame
                entity.x = prevX;
                entity.y = prevY;
                entity.direction = prevDir;
                entity.velocityX = 0;
                entity.velocityY = 0;

                // Also set sprite back to prev to avoid visual jump
                sprite.position.set(prevX, prevY);
            }

            // Clamp into world bounds (use screen as strict border)
            if (entity.x < 0) entity.x = 0;
            else if (entity.x > width) entity.x = width;

            if (entity.y < 0) entity.y = 0;
            else if (entity.y > height) entity.y = height;

            // Sync sprite to entity state, but guard against invalid sprite transforms
            const sx = Number.isFinite(entity.x) ? entity.x : centerX;
            const sy = Number.isFinite(entity.y) ? entity.y : centerY;

            // Ensure sprite position values are finite before applying
            sprite.position.set(sx, sy);

            // Rotation may become NaN if direction is invalid; guard it
            const targetRot = Number.isFinite(entity.direction) ? entity.direction + Math.PI / 2 : 0;

            // Smooth rotation: interpolate taking the shortest angular path
            const currentRot = sprite.rotation || 0;
            let diff = targetRot - currentRot;
            // Normalize to [-PI, PI]
            while (diff <= -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            // Interpolation factor - faster when delta frames are larger, but capped
            const lerpFactor = Math.min(1, 0.2 * Math.max(0.01, dt));
            const newRot = currentRot + diff * lerpFactor;
            sprite.rotation = Number.isFinite(newRot) ? newRot : targetRot;

            // Ensure sprite remains visible (defensive; nothing in game logic should hide it)
            if (sprite.visible === false) sprite.visible = true;

            // Guard against malformed scale (very unlikely but defensive)
            if (!Number.isFinite(sprite.scale.x) || !Number.isFinite(sprite.scale.y)) {
                sprite.scale.set(0.1, 0.1);
            }
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
        const centerX = width / 2;
        const centerY = height / 2;

        for (const entity of this.entities) {
            entity.updateWorldBounds(width, height);

            // Teleport to center if out of new bounds
            if (entity.x < 0 || entity.x > width || entity.y < 0 || entity.y > height) {
                entity.x = centerX;
                entity.y = centerY;
            }
        }

        // Also ensure sprites are inside new bounds; teleport their visuals if needed
        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            const entity = this.entities[i];

            if (sprite.x < 0 || sprite.x > width || sprite.y < 0 || sprite.y > height) {
                sprite.position.set(centerX, centerY);
                // Also keep entity synced (defensive)
                entity.x = centerX;
                entity.y = centerY;
            }
        }
    }
}
