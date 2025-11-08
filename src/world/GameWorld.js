import { AntEntity } from '../entities/AntEntity.js';
import { createAntSprite, loadAntTexture } from '../rendering/SpriteFactory.js';

/**
 * GameWorld - Manages entities and their sprites, syncing logic to visuals.
 */
export class GameWorld {
    constructor(app, container) {
        this.app = app;
        this.container = container;
        this.entities = [];
        this.sprites = [];
    }

    /** Load required assets. @returns {Promise<void>} */
    async init() {
        await loadAntTexture();
    }

    /**
     * Spawn a single ant at (x,y) and return its entity.
     * @param {number} x
     * @param {number} y
     * @returns {AntEntity}
     */
    spawnAnt(x, y) {
        const entity = new AntEntity(
            x,
            y,
            this.app.screen.width,
            this.app.screen.height
        );

        const sprite = createAntSprite();
        sprite.position.set(entity.x, entity.y);
        this.container.addChild(sprite);

        this.entities.push(entity);
        this.sprites.push(sprite);

        return entity;
    }

    /** Spawn multiple ants at random positions. */
    spawnAnts(count) {
        this.clear();

        for (let i = 0; i < count; i++) {
            const x = Math.random() * this.app.screen.width;
            const y = Math.random() * this.app.screen.height;
            this.spawnAnt(x, y);
        }

        console.log(`Spawned ${count} ants 🐜`);
    }

    /** Update all entities and sync sprites. @param {number} delta */
    update(delta) {
        const maxDelta = 10;
        const rawDelta = Number.isFinite(delta) ? delta : 1;
        const dt = Math.min(rawDelta, maxDelta);

        const width = this.app.screen.width;
        const height = this.app.screen.height;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            const sprite = this.sprites[i];

            const prevX = Number.isFinite(entity.x) ? entity.x : centerX;
            const prevY = Number.isFinite(entity.y) ? entity.y : centerY;
            const prevDir = Number.isFinite(entity.direction) ? entity.direction : 0;

            entity.update(dt);

            if (!Number.isFinite(entity.x) || !Number.isFinite(entity.y) || !Number.isFinite(entity.direction)) {
                entity.x = prevX;
                entity.y = prevY;
                entity.direction = prevDir;
                entity.velocityX = 0;
                entity.velocityY = 0;
                sprite.position.set(prevX, prevY);
            }

            if (entity.x < 0) entity.x = 0;
            else if (entity.x > width) entity.x = width;

            if (entity.y < 0) entity.y = 0;
            else if (entity.y > height) entity.y = height;

            const sx = Number.isFinite(entity.x) ? entity.x : centerX;
            const sy = Number.isFinite(entity.y) ? entity.y : centerY;

            sprite.position.set(sx, sy);

            const targetRot = Number.isFinite(entity.direction) ? entity.direction + Math.PI / 2 : 0;

            const currentRot = sprite.rotation || 0;
            let diff = targetRot - currentRot;
            while (diff <= -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;

            const lerpFactor = Math.min(1, 0.2 * Math.max(0.01, dt));
            const newRot = currentRot + diff * lerpFactor;
            sprite.rotation = Number.isFinite(newRot) ? newRot : targetRot;

            if (sprite.visible === false) sprite.visible = true;

            if (!Number.isFinite(sprite.scale.x) || !Number.isFinite(sprite.scale.y)) {
                sprite.scale.set(0.1, 0.1);
            }
        }
    }

    /** Remove all ants and destroy their sprite instances. */
    clear() {
        for (let i = 0; i < this.sprites.length; i++) {
            this.container.removeChild(this.sprites[i]);
            this.sprites[i].destroy({ children: true, texture: false, baseTexture: false });
        }

        this.entities = [];
        this.sprites = [];
    }

    /** Get number of ants. @returns {number} */
    getAntCount() {
        return this.entities.length;
    }

    /** Update world bounds for all entities and sprites (on resize). */
    updateWorldBounds(width, height) {
        const centerX = width / 2;
        const centerY = height / 2;

        for (const entity of this.entities) {
            entity.updateWorldBounds(width, height);

            if (entity.x < 0 || entity.x > width || entity.y < 0 || entity.y > height) {
                entity.x = centerX;
                entity.y = centerY;
            }
        }

        for (let i = 0; i < this.sprites.length; i++) {
            const sprite = this.sprites[i];
            const entity = this.entities[i];

            if (sprite.x < 0 || sprite.x > width || sprite.y < 0 || sprite.y > height) {
                sprite.position.set(centerX, centerY);
                entity.x = centerX;
                entity.y = centerY;
            }
        }
    }
}
