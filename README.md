# Antz

A simple PixiJS-based ant simulation.

## Local development

Requirements:
- Node.js 16+ (Node 20 recommended)
- npm

Install deps and run dev server:

```bash
npm ci
npm run dev
```

Open http://localhost:5173 (Vite default) and you should see the canvas.

## Build

```bash
npm run build
npm run preview
```

The production build output is in `dist/`.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that automatically builds and deploys to GitHub Pages on pushes to the `main` branch.

### Live Demo

Once deployed, your app will be available at: **https://jordan-schnur.github.io/antz/**

### Automatic Deployment

The GitHub Actions workflow (`.github/workflows/gh-pages.yml`) automatically:
1. Installs dependencies
2. Builds the production bundle
3. Deploys to the `gh-pages` branch

### Setup GitHub Pages (One-time)

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub: https://github.com/jordan-schnur/antz
2. Click **Settings** → **Pages** (in the left sidebar)
3. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` and `/ (root)`, then click Save
4. Push to `main` branch - the workflow will run automatically
5. Wait a few minutes, then visit https://jordan-schnur.github.io/antz/

### Manual Deployment

If you'd like to deploy manually:

```bash
npm run build
# Then upload the dist/ folder to any static hosting service
```

## Notes
- The app uses Vite with `base: '/antz/'` in `vite.config.js` so it works correctly on GitHub Pages.
- Assets like `ant.png` are loaded with the correct path for the build output.
- The GitHub Actions workflow requires the `gh-pages` branch to be set as the Pages source.

