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
- ✅ Render 100s or 1000s of ants simultaneously
- ✅ Independent ant movement with wandering behavior
- ✅ Settings panel with tabs for Display and Simulation options
- ✅ Multiple resolution presets (800×600 to 4K)
- ✅ Dynamic ant count control (10 to 5000+ ants)
- ✅ Easy-to-use function to load your own ant images
- ✅ Hot module reloading for fast development
- ✅ Responsive canvas setup

## Project Structure

- `index.html` - Main HTML file with canvas container
- `index.js` - Canvas setup and ant rendering logic
- `package.json` - Project dependencies and scripts

## Using the Settings Panel

Click the **⚙️ Settings** button in the top-right corner to access:

### Display Tab
- **Canvas Resolution**: Choose from 6 preset resolutions or use custom dimensions
- Resolutions range from 800×600 to 4K (3840×2160)

### Simulation Tab
- **Number of Ants**: Choose from preset counts (10, 100, 500, 1K, 2.5K, 5K)
- **Custom Count**: Enter any number from 1 to 10,000 ants
- Watch performance as you scale up to thousands of ants!

## Customization

### Change Canvas Size
Use the settings panel or edit the default in `index.js`:
```javascript
let currentWidth = 1280;
let currentHeight = 720;
```

### Change Background Color
Edit the `backgroundColor` property (hex color without '#'):
```javascript
backgroundColor: 0x1099bb,  // Light blue
```

### Modify Ant Behavior
Edit the `Ant` class in `index.js`:
- `speed`: How fast ants move (0.5 to 2.0)
- `turnSpeed`: How quickly they change direction
- `wanderAngle`: Controls the curving path behavior

## Next Steps

- Import your ant image and use `loadAntImage()` to display it
- Modify the animation in the `app.ticker.add()` callback
- Add mouse interaction or keyboard controls
- Create multiple ants with different behaviors

Enjoy coding! 🐜✨

