# Page Speed Optimization — DeepLine Homepage

## Objective
Reduce page load time, First Contentful Paint, and improve scroll smoothness for go.deeplineop.ai.

## Baseline (2026-03-17)
- FCP: 512ms
- DOM Content Loaded: 408ms
- Load Complete: 410ms
- HTML size: 270KB (bloated — 1500 lines inline CSS)
- Image transfer: 621KB (2 images)
- DOM nodes: 858
- JS errors: 3 (null reference)
- styles.css: 77KB (loaded sync, render-blocking)
- scripts.js: 52KB (not loaded — all JS inline)
- Google Fonts: render-blocking

## Scoring
Composite score (0-100) based on:
- HTML size (lower = better, target <50KB)
- FCP (lower = better, target <300ms)
- Inline CSS lines (lower = better, target <200 lines)
- JS errors (fewer = better, target 0)
- Transfer size (lower = better)

## Constraints
- Site must look and function identically after changes
- Don't break any animations, interactions, or layouts
- Don't modify the evaluation script
- One change per experiment
- Test locally by opening index.html

## Strategy
### Phase 1: Low-hanging fruit (runs 1-5)
1. Move inline CSS (below-the-fold) to styles.css, keep only critical CSS inline
2. Defer styles.css loading with media="print" trick
3. Defer Google Fonts loading
4. Add lazy loading to images
5. Move inline JS to scripts.js with defer

### Phase 2: Systematic (runs 6-15)
6. Remove duplicate CSS between inline and styles.css
7. Fix 3 JS null reference errors
8. Add resource hints (preconnect, dns-prefetch)
9. Add width/height to images to prevent CLS
10. Add prefers-reduced-motion improvements

### Phase 3: Structural (runs 16+)
11. Minify CSS
12. Reduce DOM node count
13. Lazy-load below-fold sections
14. Optimize animation performance (compositor-only)
