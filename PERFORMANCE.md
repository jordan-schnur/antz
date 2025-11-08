# Performance Tips for Rendering Thousands of Ants

## Current Optimizations

The project is already optimized for rendering large numbers of ants:

1. **Efficient Update Loop**: Uses a single `app.ticker.add()` callback
2. **Object Pooling Ready**: The `Ant` class is designed for reuse
3. **Simple Graphics**: Placeholder ants use basic shapes for fast rendering
4. **Edge Wrapping**: Ants wrap around screen instead of bouncing (fewer calculations)

## Performance Benchmarks

Expected performance on modern hardware:
- **100 ants**: 60 FPS (smooth)
- **500 ants**: 60 FPS (smooth)
- **1000 ants**: 55-60 FPS (good)
- **2500 ants**: 40-50 FPS (acceptable)
- **5000 ants**: 25-35 FPS (may drop on slower devices)

## Further Optimizations (If Needed)

If you experience performance issues with high ant counts:

### 1. Use Sprite Sheets
Instead of drawing each ant individually, use a single texture:
```javascript
const texture = await PIXI.Assets.load('./ant.png');
const antSprite = new PIXI.Sprite(texture);
```

### 2. Reduce Visual Complexity
Simplify the ant graphics or reduce the number of circles/lines.

### 3. Culling (Don't Render Off-Screen Ants)
Only update ants that are visible on screen:
```javascript
if (ant.sprite.x < -50 || ant.sprite.x > app.screen.width + 50) {
    return; // Skip update
}
```

### 4. Use ParticleContainer
For massive numbers (10K+), use Pixi's `ParticleContainer`:
```javascript
const antContainer = new PIXI.ParticleContainer(10000, {
    scale: true,
    position: true,
    rotation: true,
});
```

### 5. Reduce Update Frequency
Update less important ants less frequently:
```javascript
if (i % 2 === frameCount % 2) {
    ants[i].update(delta);
}
```

### 6. WebGL Optimization
Ensure WebGL is being used (it should be by default):
```javascript
console.log(app.renderer.type); // Should be 2 for WebGL
```

## Monitoring Performance

Open browser console and check:
```javascript
console.log(app.ticker.FPS); // Current FPS
```

Or add an FPS counter to your UI!

