# GSAP Animations Design — Turing-IA Tech Catalog
Date: 2026-04-12

## Goal
Add subtle, professional animations using GSAP + ScrollTrigger to enhance the user experience across all pages of the catalog app. All animations are non-blocking and degrade gracefully if GSAP fails to load.

## Dependencies
- `gsap` (v3, free tier — includes ScrollTrigger plugin)
- `@gsap/react` (provides `useGSAP` hook with automatic cleanup for React 19)

Install: `npm install gsap @gsap/react` inside `frontend/`

## Animation Inventory

### Navbar (`Navbar.jsx`)
- **Trigger:** component mount
- **Effect:** slide-down from `y: -60` to `y: 0`, fade in (`opacity: 0 → 1`)
- **Duration:** 0.6s, `ease: "power2.out"`

### LoginPage (`LoginPage.jsx`)
- **Trigger:** component mount
- **Effect:** form card fades up from `y: 40, opacity: 0` to `y: 0, opacity: 1`
- **Duration:** 0.7s, `ease: "power2.out"`

### CatalogPage (`CatalogPage.jsx`)
| Element | Trigger | Effect | Duration |
|---|---|---|---|
| Hero `h1` + `p` | mount | fade-up, stagger 0.15s | 0.7s |
| Hero button | mount | fade-up, delay 0.3s | 0.6s |
| Filter buttons (3) | mount | fade-in, stagger 0.1s | 0.5s |
| Product cards | ScrollTrigger (enter viewport) | fade-up `y:30→0`, stagger 0.1s per card | 0.6s |

### ProductDetailPage (`ProductDetailPage.jsx`)
| Element | Trigger | Effect | Duration |
|---|---|---|---|
| Hero text (name + price) | mount | slide from `x: -30` | 0.6s |
| Left column (image) | mount | fade from `x: -20, opacity: 0` | 0.7s |
| Right column (info) | mount | fade from `x: 20, opacity: 0` | 0.7s |
| Spec list items | ScrollTrigger | stagger slide-up, 0.08s each | 0.5s |
| Plan comparison cards | ScrollTrigger | stagger fade-up, 0.12s each | 0.6s |

## Technical Approach
- Use `useGSAP` hook from `@gsap/react` in every component — handles `ctx.revert()` cleanup automatically on unmount.
- Register `ScrollTrigger` plugin once in a shared `gsap.config.js` utility and import it at app entry (`main.jsx`).
- Refs (`useRef`) point to container elements; GSAP selects children via scoped context.
- No global timeline — each component manages its own animations independently.

## Constraints
- Animations must not cause layout shift (use `opacity` + `transform` only, not `width`/`height`/`margin`).
- Cards must still render correctly when loaded as mock data (no dependency on API).
- ScrollTrigger uses `start: "top 85%"` so elements animate before they're fully in view.

## Files Changed
- `frontend/package.json` — add gsap, @gsap/react
- `frontend/src/gsap.config.js` — register plugins (new file)
- `frontend/src/main.jsx` — import gsap.config
- `frontend/src/components/Navbar.jsx`
- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/pages/CatalogPage.jsx`
- `frontend/src/pages/ProductDetailPage.jsx`
