# Antz Canvas Project 🐜

A simple real-time canvas rendering project using Pixi.js to display and animate ant images.

## Setup

Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

Then open your browser to the URL shown in the terminal (usually http://localhost:5173)

## Using Your Own Ant Image

1. Place your ant image (PNG, JPG, or any web-compatible format) in the project folder
2. In `index.js`, uncomment and modify the line near the bottom:
   ```javascript
   loadAntImage('./your-ant-image.png', app.screen.width / 2, app.screen.height / 2);
   ```
3. Replace `'./your-ant-image.png'` with the path to your ant image

## Features

- ✅ Real-time canvas rendering with Pixi.js
- ✅ Animated placeholder ant (moving in a circle)
- ✅ Easy-to-use function to load your own ant images
- ✅ Hot module reloading for fast development
- ✅ Responsive canvas setup

## Project Structure

- `index.html` - Main HTML file with canvas container
- `index.js` - Canvas setup and ant rendering logic
- `package.json` - Project dependencies and scripts

## Customization

### Change Canvas Size
Edit the `width` and `height` in `index.js`:
```javascript
await app.init({
    width: 1024,
    height: 768,
    // ...
});
```

### Change Background Color
Edit the `backgroundColor` property (hex color without '#'):
```javascript
backgroundColor: 0x1099bb,  // Light blue
```

### Add More Ants
Use the `loadAntImage` function or `createPlaceholderAnt` function multiple times:
```javascript
loadAntImage('./ant.png', 200, 300);
loadAntImage('./ant.png', 400, 200);
```

## Next Steps

- Import your ant image and use `loadAntImage()` to display it
- Modify the animation in the `app.ticker.add()` callback
- Add mouse interaction or keyboard controls
- Create multiple ants with different behaviors

Enjoy coding! 🐜✨

