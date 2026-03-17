# DeepLine Homepage Redesign Audit

Audited: 2026-03-17
Files: `index.html`, `styles.css`

---

## Typography

- [ ] **[HIGH] Inter is the only font** -- Inter is loaded via Google Fonts as the sole typeface. Inter is the default "AI startup" font and signals generic tech. Consider Geist (Vercel's typeface, sharper for B2B), Outfit (geometric but warmer), or Satoshi (modern sans with more personality). Alternatively, pair Inter with a display font for headlines only.

- [x] **Headlines have good letter-spacing and line-height** -- h1 uses `letter-spacing: -0.02em; line-height: 1.1`, h2 uses the same letter-spacing with `line-height: 1.2`. These are solid. No issues.

- [x] **Body text width constrained to ~65ch** -- `p { max-width: 65ch; }` is set globally in the critical CSS. Correct.

- [ ] **[LOW] Limited font weight variety** -- Only 400, 500, 600, 700 are loaded. This is actually fine for performance, but the page mostly uses 600 and 700, making body text (400) feel thin against heavy headlines. Consider using 500 for body text in key sections (service descriptions, about bio) to improve readability.

---

## Color

- [ ] **[HIGH] Purple/blue "AI gradient" palette** -- The primary palette is `--deep-purple-navy: #0F0B2E` + `--muted-indigo: #4F46E5` + `--teal-accent: #1B9AAA`. This is the exact purple-to-teal gradient spectrum that 90% of AI/SaaS landing pages use (Jasper, Copy.ai, etc.). For an industrial distribution audience, this reads as "tech company" not "operations partner who understands warehouses." Consider shifting toward darker navy (#0A1628) + warm amber or copper accents that signal industrial/manufacturing.

- [ ] **[MEDIUM] Gradient accent bars on every card** -- `.service-card::before`, `.result-card::before`, `.tool-card::before`, `.problem-card::before` all use `linear-gradient(90deg, ...)` top bars. This is a recognizable AI-generated pattern. Consider removing gradient bars entirely or using a single solid accent color per card category.

- [x] **No oversaturated accents** -- `--teal-accent: #1B9AAA` and `--signal-green: #2ECC71` are reasonably muted. Acceptable.

- [ ] **[LOW] No shadow tinting** -- All `box-shadow` values use `rgba(0,0,0,...)` or `rgba(15,11,46,...)`. Consider tinting shadows with the accent color for cards on hover (e.g., `box-shadow: 0 12px 30px rgba(27,154,170,0.12)`) to add depth without the flat gray shadow look.

- [ ] **[LOW] No noise/grain texture** -- The page uses dot-grid and line-grid patterns as background textures (`.problems::before`, `.services::before`, `.how-we-work::before`). These are subtle but all follow the same radial-gradient dot pattern. Consider a single noise/grain overlay on the hero or dark sections for a more tactile feel, or remove the background patterns entirely (they add visual noise without value).

---

## Layout

- [ ] **[HIGH] Three equal card columns everywhere** -- `.problems-grid`: 3 equal columns. `.results-grid`: 3 equal columns. `.trust-badges-grid`: 3 equal columns. `.process-timeline`: 3 equal columns. This is the most generic AI-generated layout pattern. Consider:
  - Asymmetric layouts (2/3 + 1/3, or featured card + smaller cards)
  - Breaking the grid for the problems section (stacked or side-by-side with illustration)
  - Using a masonry or staggered layout for case studies

- [ ] **[MEDIUM] Everything centered and symmetrical** -- Every section uses centered `section-header`, centered cards, centered CTAs. The only asymmetric layout is the about section (photo left, text right). Add visual variety with left-aligned section headers, alternating image/text blocks, or offset card positions.

- [x] **Adequate whitespace** -- Sections use `padding: 60px 0` (80px-100px for key sections). Card gaps are 24-32px. Container is 1400px max with 40px padding. Spacing is appropriate.

- [ ] **[LOW] Cards forced to equal height** -- Grid layout inherently forces equal-height columns. The service cards use `grid-template-columns: repeat(2, 1fr)` which is fine for 2-col, but the 3-col grids (problems, results, trust) stretch shorter cards. Not a major issue but could benefit from `align-items: start` on the grid to let cards breathe.

---

## Components

- [ ] **[HIGH] Generic card patterns** -- Every content block is a white card with border-radius 12px, 1px light-gray border, hover translateY(-4px) + box-shadow. This pattern repeats across `.problem-card`, `.service-card`, `.result-card`, `.case-study-card`, `.tool-card`, `.faq-item`. They are visually indistinguishable. Consider differentiating card styles by section purpose (e.g., problems could use a different visual treatment than services).

- [ ] **[MEDIUM] Pill badges overused** -- `.hero-badge`, `.price-badge`, `.free-badge`, `.case-tag`, `.result-tag`, `.guarantee-badge`, `.credential-tag`, `.health-badge`, `.email-status` -- there are 9+ pill badge variants. The rounded-pill pattern (border-radius: 20-30px, small font, colored background) is used for every type of label. Reduce to 2-3 badge styles max and use other patterns (underline, bold text, icon) for remaining labels.

- [x] **Accordion FAQ** -- The FAQ section uses a standard accordion pattern (`.faq-question` button + `.faq-answer` with max-height transition). This is expected and appropriate for FAQ content. No issue.

- [x] **No carousel testimonials** -- Results/case studies use a static grid, not a carousel. Good.

---

## Motion

- [ ] **[HIGH] Animations NOT using transform/opacity only** -- Several animations trigger layout or paint:
  - `@keyframes urgentPulse` uses `transform: scale()` -- OK
  - `@keyframes tickHour/tickMinute` uses `transform: rotate()` -- OK
  - `@keyframes stackPaper` uses `transform + opacity` -- OK
  - `@keyframes dashboardGrow` animates `height` -- PROBLEM: triggers layout. Should animate `transform: scaleY()` instead.
  - `@keyframes badgeShine` uses `transform: translateX()` -- OK (was fixed)
  - `@keyframes tickerScroll` uses `transform: translateX()` -- OK, and has `will-change: transform`
  - `.route-path-active.drawing` uses `transition: stroke-dashoffset` -- OK for SVG
  - Multiple animations use `box-shadow` animation via class toggles (`.orch-node.active`) -- PROBLEM: `box-shadow` triggers paint
  - `.coo-kpi-card` has `transition: all 0.3s` -- PROBLEM: `all` can animate layout properties

- [ ] **[MEDIUM] Staggered entry animations on every section** -- Every `section` starts with `opacity: 0; transform: translateY(20px)` and transitions to visible on scroll. This is fine in isolation but creates a "waterfall reveal" effect when scrolling quickly through the page. Consider reducing the translateY distance to 10px or removing the transform entirely (fade-in only) for less jarring scroll behavior.

- [ ] **[MEDIUM] Excessive concurrent animations** -- The problems section has 3 cards each with their own continuous CSS animations (clock spinning, nodes pulsing, question mark bouncing). The service cards have animated mockups (typing, dashboard growing, route drawing). Combined, there can be 10+ simultaneous animations visible at once. Consider pausing animations when cards are not in viewport.

- [ ] **[LOW] Shimmer effect on every CTA** -- `.nav-cta::before`, `.hero-cta::before`, `.final-cta-btn::before`, `.diagnostic-cta::before` all use the same shine/shimmer hover effect (linear-gradient sweep from left to right). This is a recognizable AI-generated pattern. Consider removing it from all but the primary CTA, or replacing with a simpler color transition.

---

## Summary of Priority Actions

### High Priority
1. Replace or supplement Inter with a more distinctive typeface
2. Shift color palette away from purple/blue AI gradient toward industrial tones
3. Break the 3-equal-column grid pattern in at least 2 sections
4. Differentiate card styles across sections instead of one universal card
5. Fix `height` animation in dashboard bars (use scaleY transform instead)

### Medium Priority
6. Reduce gradient accent bars (remove or make solid color)
7. Add asymmetric/left-aligned layouts for variety
8. Reduce pill badge variants from 9+ to 2-3
9. Reduce stagger distance on scroll reveals
10. Pause offscreen animations for performance

### Low Priority
11. Bump body text to font-weight 500 in key sections
12. Add shadow tinting with accent colors
13. Remove or replace background dot patterns
14. Use `align-items: start` on 3-col grids
15. Remove shimmer effect from secondary CTAs
