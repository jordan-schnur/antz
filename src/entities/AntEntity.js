import {NeuralNet} from "../neuralnet/NeuralNet.js";

/**
 * AntEntity - pure game logic for an ant (position, movement, behavior).
 */
export class AntEntity {
    /** @type {NeuralNet} */
    brain = null;

    /**
     * Create a new AntEntity
     * @param {number} x - initial x position
     * @param {number} y - initial y position
     * @param {number} worldWidth - world width for bounds
     * @param {number} worldHeight - world height for bounds
     */
    constructor(x, y, worldWidth, worldHeight) {
        this.x = x;
        this.y = y;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 0.5 + Math.random() * 1.5;
        this.direction = Math.random() * Math.PI * 2;

        this.turnSpeed = 0.02 + Math.random() * 0.03;
        this.wanderAngle = Math.random() * Math.PI * 2;

        this.wanderTimer = 30 + Math.random() * 120;

        this.health = 100;
        this.energy = 100;
        this.id = Math.random().toString(36).substr(2, 9);

        this.brain = new NeuralNet([5, 10, 2]);
    }

    /**
     * Update game logic only.
     * @param {number} delta - Time delta from ticker
     */
    update(delta) {
        this.wanderAngle += (Math.random() - 0.5) * this.turnSpeed;
        this.direction += Math.sin(this.wanderAngle) * 0.1;

        this.wanderTimer -= delta;
        if (this.wanderTimer <= 0) {
            this.direction += (Math.random() - 0.5) * Math.PI * 0.6;
            this.speed = Math.max(0.2, Math.min(3.0, this.speed + (Math.random() - 0.5) * 0.8));
            this.wanderTimer = 30 + Math.random() * 120;
        }

        this.velocityX = Math.cos(this.direction) * this.speed;
        this.velocityY = Math.sin(this.direction) * this.speed;

        this.x += this.velocityX * delta;
        this.y += this.velocityY * delta;

        if (this.x < 0) {
            this.x = 0;
            this.direction = Math.PI - this.direction;
        } else if (this.x > this.worldWidth) {
            this.x = this.worldWidth;
            this.direction = Math.PI - this.direction;
        }

        if (this.y < 0) {
            this.y = 0;
            this.direction = -this.direction;
        } else if (this.y > this.worldHeight) {
            this.y = this.worldHeight;
            this.direction = -this.direction;
        }
    }

    /**
     * Update stored world bounds (called on resize).
     * @param {number} width
     * @param {number} height
     */
    updateWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
}
