## Project Context

- This is a PixiJS-based web application.
- Target environment: modern browsers (ES2020+).
- Use PixiJS idioms and APIs (e.g. `PIXI.Application`, `Container`, `Sprite`, assets loader) rather than reinventing core rendering logic.
- Prefer configuration-driven behavior over hard-coded values where reasonable.

## Languages & Frameworks

- Primary: TypeScript if present in the repo, otherwise modern ES modules (`import`/`export`) JavaScript.
- Use PixiJS v6+ style APIs and official typings when available.
- Use Vite/Webpack/esbuild config already present; do not introduce new build tools unless explicitly requested in the code or comments.

## Architecture & Organization

When suggesting or generating code:

1. **Entry point & bootstrap**
    - Keep initialization in a small bootstrap file (e.g. `src/main.ts` or `src/index.ts`).
    - Initialize a single `PIXI.Application` and pass references into other modules instead of using globals.

2. **Scenes / states**
    - Organize game/app states into separate modules under `src/scenes` (or existing pattern).
    - Each scene:
        - Extends `PIXI.Container` (or composition with a `Container`).
        - Exposes `init()`, `update(delta)`, and `destroy()` (or follows existing scene interface).
    - Do not place scene logic in the entry file.

3. **Rendering & game loop**
    - Use Pixi’s ticker or the app’s shared update loop.
    - Keep per-frame logic small and delegate to objects/modules.

4. **Assets**
    - Centralize asset loading and paths in `src/assets` or a dedicated loader module.
    - No inline magic URLs; reuse shared constants.

5. **Utilities & shared logic**
    - Common helpers go in `src/utils` (math, collision, layout, etc.).
    - Reuse existing helpers before generating new ones.

## Code Style & Standards

- Follow DRY, KISS, and single-responsibility principles.
- Prefer composition over inheritance for game objects and UI.
- Use clear, descriptive names (`playerHealthBar`, `backgroundLayer`) over abbreviations.
- Strict typing:
    - If TypeScript: no `any` unless absolutely necessary; prefer explicit interfaces/types.
    - If JavaScript: use JSDoc for complex types.
- No unused variables, commented-out blocks, or dead code in suggestions.
- Avoid adding dependencies unless:
    - They are lightweight and solve a clear problem.
    - They fit the existing stack.

## PixiJS-Specific Guidelines

When writing PixiJS code:

- Use `Application`'s `stage` as the root and attach scene containers to it.
- Prefer `Container` hierarchies for grouping instead of manual positional coupling.
- Use anchor, pivot, and scale properties correctly instead of manual offset hacks.
- Clean up:
    - Always remove sprites/containers from parents on destruction.
    - Destroy textures/graphics where appropriate to avoid memory leaks.
- Respect device performance:
    - Avoid generating extremely large textures or unbounded loops in `update`.

## Testing & Quality

- When appropriate, suggest tests for non-rendering logic:
    - Put tests in `tests/` or `__tests__/` following existing structure.
- Guard against null/undefined where async asset loading or dynamic lookups occur.
- Prefer pure functions for calculations (physics, layout, etc.) to keep them testable.

## Git & Files

- Keep files focused and small; suggest splitting large modules into smaller ones.
- When adding new files, match the existing directory and naming conventions.

## How Copilot Should Behave

When assisting in this repo, Copilot should:

1. Prefer modifying and reusing existing patterns, utilities, and scene structure.
2. Suggest small, incremental changes instead of large rewrites, unless explicitly asked.
3. Explain non-trivial code with brief comments or docstrings (not verbose).
4. Avoid generating framework/tool changes that conflict with the current setup.
5. Assume code will be reviewed; prioritize correctness, readability, and maintainability over cleverness.