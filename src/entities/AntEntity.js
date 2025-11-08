/**
 * AntEntity - Pure game logic (no rendering)
 * Handles position, movement, and behavior
 */
export class AntEntity {
    constructor(x, y, worldWidth, worldHeight) {
        // Position
        this.x = x;
        this.y = y;

        // World bounds for collision
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        // Movement
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 0.5 + Math.random() * 1.5;
        this.direction = Math.random() * Math.PI * 2;

        // Behavior
        this.turnSpeed = 0.02 + Math.random() * 0.03;
        this.wanderAngle = Math.random() * Math.PI * 2;

        // Stats (for future use)
        this.health = 100;
        this.energy = 100;
        this.id = Math.random().toString(36).substr(2, 9);
    }

    /**
     * Update game logic only
     * @param {number} delta - Time delta from ticker
     */
    update(delta) {
        // Wander behavior - curving paths
        this.wanderAngle += (Math.random() - 0.5) * this.turnSpeed;
        this.direction += Math.sin(this.wanderAngle) * 0.1;

        // Calculate velocity
        this.velocityX = Math.cos(this.direction) * this.speed;
        this.velocityY = Math.sin(this.direction) * this.speed;

        // Update position
        this.x += this.velocityX * delta;
        this.y += this.velocityY * delta;

        // Bounce off walls
        const margin = 20;

        if (this.x < margin) {
            this.x = margin;
            this.direction = Math.PI - this.direction;
        } else if (this.x > this.worldWidth - margin) {
            this.x = this.worldWidth - margin;
            this.direction = Math.PI - this.direction;
        }

        if (this.y < margin) {
            this.y = margin;
            this.direction = -this.direction;
        } else if (this.y > this.worldHeight - margin) {
            this.y = this.worldHeight - margin;
            this.direction = -this.direction;
        }
    }

    /**
     * Update world bounds (called when canvas resizes)
     */
    updateWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
}

