# Architecture Overview

## Clean Separation of Concerns

The codebase has a clear separation between **game logic** and **rendering**.

```
┌─────────────────────────────────────────┐
│          Game Logic Layer               │
│  (AntEntity - position, behavior)       │
└────────────────┬────────────────────────┘
                 │
                 │ synchronized by GameWorld
                 │
┌────────────────▼────────────────────────┐
│         Rendering Layer                 │
│  (PIXI.Sprite with texture - visuals)   │
└─────────────────────────────────────────┘
```

## Core Components

### 1. **AntEntity** (Game Logic)
Pure data and behavior - no rendering code.

```javascript
class AntEntity {
    // State
    x, y              // Position
    velocityX, velocityY
    direction, speed
    
    // Stats (for future features)
    health, energy, id
    
    // Logic
    update(delta)     // Movement, collision, AI
}
```

**Responsibilities:**
- Calculate position based on velocity
- Implement wandering behavior
- Handle wall collisions (bouncing)
- Store game state (health, energy, etc.)

### 2. **PIXI Sprites** (Rendering)
Visual representation only - no game logic.

```javascript
async function loadAntTexture() {
    // Load ant.png texture once and cache it
}

function createAntSprite() {
    // Returns a PIXI.Sprite using the loaded texture
    // Configured with anchor, scale, and visibility settings
}
```

**Responsibilities:**
- Load and cache the ant texture (ant.png)
- Create sprite instances using the shared texture
- Position and rotation are set by GameWorld, not self-managed

### 3. **GameWorld** (Entity-Sprite Manager)
Manages the relationship between entities and sprites.

```javascript
class GameWorld {
    app              // Reference to PIXI.Application
    container        // PIXI.Container for all ant sprites
    entities[]       // Array of AntEntity objects
    sprites[]        // Array of PIXI.Sprite (1-to-1 mapping)
    
    async init()              // Load assets (ant texture)
    spawnAnt(x, y)            // Create entity + sprite pair
    spawnAnts(count)          // Spawn multiple ants (replaces existing)
    update(delta)             // Update logic, sync sprites
    clear()                   // Remove all ants
    updateWorldBounds(w, h)   // Resize world bounds
}
```

**Responsibilities:**
- Initialize and load required assets (ant texture)
- Create and destroy ant entities
- Create and destroy ant sprites (safely, preserving shared texture)
- Update all entity logic
- **Synchronize sprite positions/rotations to entity state**
- Handle world resizing

### 4. **Main Entry Point & Game Loop**
```javascript
// Bootstrap in index.js
const app = new PIXI.Application({ ... });
const antContainer = new PIXI.Container();
app.stage.addChild(antContainer);

const gameWorld = new GameWorld(app, antContainer);

// Initialize (async - loads ant texture)
await gameWorld.init();

// Spawn initial ants
gameWorld.spawnAnts(100);

// Main game loop
app.ticker.add((ticker) => {
    const delta = ticker.deltaTime;
    gameWorld.update(delta);
});
```

Every frame:
1. Update all AntEntity logic (positions, collisions)
2. Sync all sprite visuals to match entity state

## Why This Architecture?

### ✅ Benefits

1. **Testable**: Game logic (AntEntity) can be tested without rendering
2. **Scalable**: Easy to add features to entities (pathfinding, combat, etc.)
3. **Maintainable**: Clear responsibilities - logic vs visuals
4. **Performant**: Can optimize rendering separately from logic
5. **Flexible**: Can swap rendering systems without changing game logic

### 🎯 Future Extensions

With this architecture, you can easily add:

- **Pathfinding**: Add `target` and `findPath()` to AntEntity
- **Combat**: Add `attack()` and `takeDamage()` methods
- **Resources**: Add `carrying` property and resource gathering
- **Ant Types**: Extend AntEntity into `WorkerAnt`, `SoldierAnt`, etc.
- **Sprite Pooling**: Reuse sprites instead of destroying/creating
- **Multiple Textures**: Load different ant textures for various ant types
- **Animation**: Use sprite sheets with animated textures
- **Spatial Partitioning**: Add QuadTree for collision detection
- **Networking**: Sync `entities` array over network

## Example: Adding Health Bars

```javascript
// In GameWorld.update():
for (let i = 0; i < this.entities.length; i++) {
    const entity = this.entities[i];
    const sprite = this.sprites[i];
    
    entity.update(delta);
    
    // Sync visuals
    sprite.x = entity.x;
    sprite.y = entity.y;
    sprite.rotation = entity.direction + Math.PI / 2;
    
    // Add health bar (new feature!)
    if (entity.health < 100) {
        drawHealthBar(sprite, entity.health);
    }
}
```

## Current File Structure

```
/
├── index.html              // HTML5 wrapper with settings UI
├── index.js                // Bootstrap & main game loop
├── ant.png                 // Ant sprite texture
├── package.json            // Dependencies (PixiJS v7.3, Vite v5)
└── src/
    ├── entities/
    │   └── AntEntity.js     // Pure game logic
    ├── rendering/
    │   └── SpriteFactory.js // Texture loading & sprite creation
    └── world/
        └── GameWorld.js     // Entity-sprite manager
```

### Future Growth Paths

For larger projects, consider adding:

```
src/
├── systems/
│   ├── MovementSystem.js
│   └── CollisionSystem.js
├── ui/
│   └── SettingsPanel.js     // Extract UI logic from index.js
└── utils/
    └── SpatialHash.js       // Performance optimizations
```

## Performance Notes

- **Each ant** = 1 AntEntity + 1 PIXI.Sprite instance
- **Texture sharing**: All sprites reference the same cached ant.png texture
- **Memory efficient**: Only one texture in VRAM, sprites are just transforms
- **Entity updates**: O(n), pure JavaScript calculations
- **Sprite syncing**: O(n), lightweight property assignments
- **For 10,000+ ants**: Consider `PIXI.ParticleContainer` for batch rendering
- **Current performance**: ~1000 ants at 60 FPS on modern hardware

### Optimization Strategies
1. **Spatial partitioning**: Add QuadTree for collision detection
2. **Object pooling**: Reuse entity/sprite pairs instead of destroy/create
3. **Culling**: Only update entities visible on screen
4. **Web Workers**: Offload entity logic to background threads

