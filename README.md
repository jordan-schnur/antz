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

This repo includes a GitHub Actions workflow that builds and deploys `dist/` to GitHub Pages on pushes to the `main` branch.

Ensure your repository's default branch is `main`. The action runs automatically on push.

If you'd like to deploy manually:

```bash
npm run build
npx surge dist/ # or use any static hosting
```

## Notes
- The app uses Vite with `base: './'` in `vite.config.js` so it can be served from a subpath (GitHub Pages).
- Assets like `ant.png` are loaded with a relative path so they work after building.

