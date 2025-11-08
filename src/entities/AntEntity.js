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

        // Wander impulse timer (frames)
        this.wanderTimer = 30 + Math.random() * 120; // frames until next big random tweak

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
        // Small continuous wandering (curving paths)
        this.wanderAngle += (Math.random() - 0.5) * this.turnSpeed;
        this.direction += Math.sin(this.wanderAngle) * 0.1;

        // Occasionally apply a larger random tweak to direction and speed
        this.wanderTimer -= delta;
        if (this.wanderTimer <= 0) {
            // Big random nudge
            this.direction += (Math.random() - 0.5) * Math.PI * 0.6;

            // Slight random speed change but keep within reasonable bounds
            this.speed = Math.max(0.2, Math.min(3.0, this.speed + (Math.random() - 0.5) * 0.8));

            // Reset timer (in frames)
            this.wanderTimer = 30 + Math.random() * 120;
        }

        // Calculate velocity
        this.velocityX = Math.cos(this.direction) * this.speed;
        this.velocityY = Math.sin(this.direction) * this.speed;

        // Update position
        this.x += this.velocityX * delta;
        this.y += this.velocityY * delta;

        // Bounce off exact screen edges (use screen edges as border)
        // Reflect direction when hitting the edges and clamp position inside bounds
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
     * Update world bounds (called when canvas resizes)
     */
    updateWorldBounds(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }
}
