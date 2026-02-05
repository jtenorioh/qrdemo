# Darth Seldon UI Design System Guide

This document defines the complete look and feel of the Darth Seldon frontend. Use it to replicate the UI across other projects. Every value is production-tested — copy directly.

---

## 1. Design Identity

**Theme:** Dark sci-fi Imperial aesthetic — a Sith-inspired command center meets circuit board engineering. The UI feels like interfacing with a weapon system aboard a Star Destroyer.

**Tone:** Militaristic, minimal, precise. No rounded corners, no playful colors. Everything is sharp, angular, and purpose-built. Text is uppercase and tracked wide. Interactions feel deliberate — slow easing curves, red energy glows, scan-line animations.

**Core metaphor:** CPU processor circuitry fused with Sith iconography.

---

## 2. Color Palette

All colors are defined as CSS custom properties on `:root`:

```css
:root {
  --red: #ff1a1a;          /* Primary accent — Sith energy, borders, active states */
  --red-glow: #ff0000;     /* Glow/shadow color for red elements */
  --dark: #0a0a0a;         /* Main background, containers */
  --darker: #050505;       /* Body/page background (deepest black) */
  --grey: #1a1a1a;         /* Secondary backgrounds, subtle borders */
  --light-grey: #2a2a2a;   /* Tertiary backgrounds */
  --text: #c0c0c0;         /* Default body text */
  --text-bright: #e0e0e0;  /* Emphasized text, input values */
}
```

### Extended palette (used in 3D elements and SVG logo):

| Role | Hex | Usage |
|------|-----|-------|
| Sith Red | `#dc2626` | 3D materials, CPU core, primary circuit traces |
| Hologram Blue | `#3b82f6` | Diagonal circuit traces, secondary glow accents |
| Circuit Gray | `#6b7280` | Secondary traces, small connectors |
| Frame Gray | `#3a3a3a` | Outer ring borders, structural elements |
| Deep Black | `#0a0a0a` | Container fill, inner backgrounds |
| Surface Black | `#0f0f0f` | Disc/circle fill behind circuit elements |

### Rules:
- White (`#fff`) is only used for h1 headings and hover states — never for body text
- Red is the only saturated color in the 2D UI. Blue appears only in the 3D scene and logo
- All borders use `rgba(255, 26, 26, 0.15)` — never solid red borders except on the generate button
- Glows and shadows always use `var(--red-glow)` or `rgba(255, 0, 0, ...)`

---

## 3. Typography

### Font stack

Import via Google Fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
```

| Font | Role | Weights |
|------|------|---------|
| **Orbitron** | Headings, labels, buttons, loader text, footer | 400, 700, 900 |
| **Rajdhani** | Body text, descriptions, input values, motto | 300, 400, 500, 600, 700 |

### Type rules

- **All headings and labels:** `font-family: 'Orbitron', sans-serif; text-transform: uppercase;`
- **All body text:** `font-family: 'Rajdhani', sans-serif;`
- **Letter spacing is mandatory** on all Orbitron text. Typical values: `3px` to `8px`
- **h1:** `clamp(1.8rem, 4vw, 2.4rem)`, weight 900, `letter-spacing: 6px`, color `#fff`, text-shadow `0 0 30px rgba(255, 0, 0, 0.3)`
- **Labels:** `0.65rem`, weight 700, `letter-spacing: 4px`, color `var(--red)`
- **Buttons:** `0.75rem–0.8rem`, weight 700, `letter-spacing: 3px–4px`
- **Body text:** `1rem–1.05rem`, weight 300–500, `line-height: 1.8`
- **Footer:** `0.6rem`, `letter-spacing: 4px`, `color: rgba(255, 255, 255, 0.15)`

### Accent text

The word "Seldon's" (or your project's accent word) uses:
```css
.accent {
  color: var(--red);
  text-shadow: 0 0 40px var(--red-glow), 0 0 80px rgba(255, 0, 0, 0.2);
}
```

---

## 4. Layout Structure

### Page-level
```
body
  align-items: flex-start
  justify-content: center
  padding: 10px 20px

#root
  max-width: 800px
  position: relative
  z-index: 1
```

### Component hierarchy (top to bottom)
```
<LoaderOverlay />         ← fullscreen, z-index: 9999, fades out after 2.8s
<CursorGlow />            ← fixed, follows mouse, z-index: 0
<SpaceBackground />       ← fixed canvas, z-index: 0 (behind everything)
<div class="app">
  <Logo3D />              ← 280x280 Three.js canvas, centered above card
  <div class="container"> ← main card: dark glass panel
    <header>              ← logo image + title + divider + motto
    <content>             ← form, results, actions
  </div>
  <footer />
</div>
```

### Container (main card)
```css
.container {
  background: rgba(10, 10, 10, 0.85);
  padding: 50px;
  border: 1px solid rgba(255, 26, 26, 0.15);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}
```
- **No border-radius** — everything is sharp/angular
- Has a `::before` scan-line animation (red gradient sliding across the top edge)
- Has a `::after` radial red glow overlay at center (3% opacity, non-interactive)

---

## 5. Logo Usage

### Static logo in card header

Place the SVG logo as an `<img>` tag inside the header:

```html
<img class="imperial-crest" src="/assets/darth-seldon-logo-no-slogan.svg" alt="Darth Seldon" />
```

```css
.imperial-crest {
  display: block;
  width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 50%;
  filter: drop-shadow(0 0 25px rgba(220, 38, 38, 0.5))
          drop-shadow(0 0 50px rgba(220, 38, 38, 0.2));
  animation: fadeScaleIn 0.8s ease 3s both;
}
```

### Logo files available

| File | Format | Size | Use |
|------|--------|------|-----|
| `darth-seldon-logo-no-slogan.svg` | SVG | 800x800 viewBox | Card header, favicon, icons |
| `darth-seldon-logo-no-slogan.png` | PNG | 2400x2400px | Textures, social images |
| `darth-seldon-logo-with-slogan.svg` | SVG | 800x1000 viewBox | Full brand marks, documentation |
| `darth-seldon-logo-with-slogan.png` | PNG | 2400x3000px | Print, marketing |

Place all logo files in `public/assets/` so they are served from `/assets/`.

---

## 6. Animated Space Background (Three.js)

A full-viewport fixed canvas renders a 3D star field behind all content.

### Dependency
```
three: ^0.182.0 (or later)
```

### Component: `SpaceBackground.jsx`

Renders onto a `<canvas id="bg-canvas">` positioned via CSS:

```css
#bg-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
```

### Scene composition

| Element | Count | Geometry | Material | Details |
|---------|-------|----------|----------|---------|
| White stars | 3000 | BufferGeometry (random positions) | PointsMaterial, white, size 0.8, opacity 0.7 | Spread across 2000x2000x1000 cube |
| Red particles | 150 | BufferGeometry (random positions) | PointsMaterial, `#ff1a1a`, size 1.5, opacity 0.3, AdditiveBlending | Spread across 1200x1200x600 |
| Blue particles | 80 | BufferGeometry (random positions) | PointsMaterial, `#3b82f6`, size 1.2, opacity 0.2, AdditiveBlending | Spread across 1000x1000x500 |

### Lighting rig

| Light | Type | Color | Intensity | Position | Behavior |
|-------|------|-------|-----------|----------|----------|
| Ambient | AmbientLight | `0x1a1a2a` | 0.5 | — | Static |
| Key | DirectionalLight | `0xffffff` | 1.2 | (200, 200, 400) | Static |
| Fill | DirectionalLight | `0xccccee` | 0.6 | (-200, 100, 300) | Static |
| Rim | DirectionalLight | `0xffeedd` | 0.3 | (0, -150, -200) | Static |
| Red Sith | PointLight | `0xdc2626` | 3, range 800 | Orbiting | `x = sin(t*0.8)*300`, `y = cos(t*0.8)*200`, intensity pulses |
| Blue Holo | PointLight | `0x3b82f6` | 2, range 600 | Orbiting | `x = cos(t*0.6)*400`, `y = sin(t*0.6)*250` |

### Camera

```
PerspectiveCamera(60, aspect, 0.1, 2000)
position.z = 600
```

### Animations (per frame)

```javascript
// Stars — slow rotation
stars.rotation.y = t * 0.012
stars.rotation.x = t * 0.006

// Red particles — opposite rotation
redParticles.rotation.y = -t * 0.018
redParticles.rotation.x = t * 0.008

// Blue particles
blueParticles.rotation.y = t * 0.015
blueParticles.rotation.x = -t * 0.005

// Mouse parallax (camera follows cursor with damping)
camera.position.x += (mouseX * 40 - camera.position.x) * 0.02
camera.position.y += (-mouseY * 40 - camera.position.y + scrollY * 0.05) * 0.02
camera.lookAt(0, 0, 0)
```

### Renderer settings
```javascript
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.4
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))  // Cap at 2 for performance
```

---

## 7. 3D Rotating Logo (Three.js Procedural)

A separate Three.js canvas renders the Darth Seldon CPU circuit logo as a 3D object above the main card. The logo is built procedurally — no SVG loading required.

### Container

```css
.logo-3d-container {
  width: 280px;
  height: 280px;
  margin: -10px auto 10px;
  animation: fadeScaleIn 0.8s ease 2.8s both;
}
.logo-3d-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
```

### Coordinate system

The logo design is based on an 800x800 SVG grid centered at (400, 400). To convert SVG coordinates to 3D world coordinates:

```javascript
const S = 0.01  // Scale factor: 1 SVG unit = 0.01 world units
function svgX(x) { return (x - 400) * S }    // Center at origin
function svgY(y) { return -(y - 400) * S }    // Flip Y axis
```

This makes the logo about 4.4 world units in diameter (220 SVG units radius * 2 * 0.01).

### Materials

Define these 7 materials. All emissive materials must be instances (not shared) if you want independent pulse control.

```javascript
// Red — CPU core, primary circuit traces, via dots
const redMat = new THREE.MeshStandardMaterial({
  color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.6,
  metalness: 0.8, roughness: 0.2,
})

// Red glow — center CPU square (brightest element)
const redGlowMat = new THREE.MeshStandardMaterial({
  color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.8,
  metalness: 0.9, roughness: 0.1,
})

// Blue hologram — diagonal traces, blue via dots
const blueMat = new THREE.MeshStandardMaterial({
  color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.5,
  metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.9,
})

// Gray — secondary traces, endpoint dots
const grayMat = new THREE.MeshStandardMaterial({
  color: 0x6b7280, metalness: 0.6, roughness: 0.4,
})

// Dark — filled rectangles, disc base, connector ports
const darkMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a, metalness: 0.7, roughness: 0.3,
})

// Frame — secondary outer ring
const frameMat = new THREE.MeshStandardMaterial({
  color: 0x3a3a3a, metalness: 0.6, roughness: 0.4,
})

// Ring — outer red ring
const ringMat = new THREE.MeshStandardMaterial({
  color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.3,
  metalness: 0.8, roughness: 0.2,
})
```

### Logo geometry — element-by-element build order

Constants:
```javascript
const DEPTH = 0.15       // Extrusion depth for major elements
const TRACE_DEPTH = 0.1  // Extrusion depth for circuit traces
```

**Helper functions:**

```javascript
// Circuit trace segment (positioned box between two SVG points)
function addTrace(x1, y1, x2, y2, width, material, depth = TRACE_DEPTH) {
  const dx = x2 - x1, dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy) * S
  const w = width * S
  const geo = new THREE.BoxGeometry(len, w, depth)
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set(
    ((x1 + x2) / 2 - 400) * S,
    -((y1 + y2) / 2 - 400) * S,
    depth / 2
  )
  mesh.rotation.z = Math.atan2(-(y2 - y1), x2 - x1)
  group.add(mesh)
}

// Filled rectangle from SVG coords
function addRect(x, y, w, h, material, depth = DEPTH) {
  const geo = new THREE.BoxGeometry(w * S, h * S, depth)
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set(svgX(x + w / 2), svgY(y + h / 2), depth / 2)
  group.add(mesh)
}

// Sphere dot at SVG coords
function addDot(cx, cy, r, material) {
  const geo = new THREE.SphereGeometry(r * S, 16, 16)
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set(svgX(cx), svgY(cy), DEPTH / 2)
  group.add(mesh)
}
```

**Build order (all coordinates are SVG units):**

#### 1. Outer rings
```
TorusGeometry(200*S, 3*S, 16, 64) → ringMat        // Red ring, r=200
TorusGeometry(220*S, 2*S, 12, 64) → frameMat        // Gray ring, r=220
```

#### 2. Inner disc base
```
CylinderGeometry(200*S, 200*S, 0.02, 64) → darkMat  // Rotated 90° on X
```

#### 3. Central CPU core
```
Rect(350, 350, 100, 100) → darkMat                   // Base plate
Trace borders: (350,350)→(450,350), (350,450)→(450,450), etc. width=4 → redMat
Inner border 80x80: (360,360)→(440,360), etc. width=3 → redMat
Inner border 60x60: (370,370)→(430,370), etc. width=2 → redMat
Rect(380, 380, 40, 40) → redGlowMat, depth=DEPTH*1.2 // Brightest center
```

#### 4. Pin grid (16 dots)
```
4x4 grid at positions: [375,390,405,420] x [375,390,405,420], r=2 → redMat
```

#### 5. Circuit traces (N/S/E/W, each has red primary + gray secondary paths)

**North:**
```
(400,350)→(400,300) w=3 redMat, (400,300)→(420,300) w=3 redMat, (420,300)→(420,280) w=3 redMat
(400,330)→(380,330) w=2 grayMat, (380,330)→(380,290) w=2 grayMat, etc.
Rect(416,276, 8,8) redMat, Rect(356,276, 8,8) grayMat, Dot(420,310, r=4) grayMat
```

**South:** Mirror of north, offset to bottom. Primary: (400,450)→(400,500)→(380,500)→(380,520)

**West:** Primary: (350,400)→(300,400)→(300,380)→(280,380)

**East:** Primary: (450,400)→(500,400)→(500,420)→(520,420)

#### 6. Diagonal traces (blue, 4 quadrants)

Each quadrant has 2 paths (thick 2.5 + thin 2) with endpoint dots:

**NE:** (450,350)→(480,350)→(480,320)→(500,320) w=2.5, dot(500,320,r=5)
**NW:** (350,350)→(320,350)→(320,320)→(300,320) w=2.5, dot(300,320,r=5)
**SE:** (450,450)→(480,450)→(480,480)→(500,480) w=2.5, dot(500,480,r=5)
**SW:** (350,450)→(320,450)→(320,480)→(300,480) w=2.5, dot(300,480,r=5)

#### 7. Via connections (8 dots)
```
Red vias: (380,330), (420,330), (380,470), (420,470) → r=2.5 redMat
Blue vias: (330,380), (470,380), (330,420), (470,420) → r=2.5 blueMat
```

#### 8. Outer connectors (8 small rects)
```
N: (396,235, 8x15)   S: (396,550, 8x15)
W: (225,396, 15x8)   E: (560,396, 15x8)
NW: (265,255, 12x12) NE: (523,255, 12x12)
SW: (265,533, 12x12) SE: (523,533, 12x12)
All → darkMat, depth=0.08
```

#### 9. Glow rings (subtle inner rings)
```
TorusGeometry(r*S, 1*S, 8, 48) for r in [110, 85, 65]
MeshBasicMaterial({ color: 0xdc2626, transparent: true, opacity: 0.15, side: DoubleSide })
```

### Logo scene setup

```javascript
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
camera.position.set(0, 0, 8)

// Lighting
AmbientLight(0x404040, 0.5)
PointLight(0xdc2626, intensity=2, range=20) at (0, 0, 4)     // Red front glow
PointLight(0x3b82f6, intensity=1.5, range=15) at (3, 0, 2)   // Blue orbiting
DirectionalLight(0xffffff, 0.8) at (2, 2, 5)                 // Key light
DirectionalLight(0xccccee, 0.4) at (-2, 1, 3)                // Fill light

// Renderer
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.setClearColor(0x000000, 0)  // Transparent background
```

### Logo animation loop

```javascript
const t = clock.getElapsedTime()

// Rotation
logo.rotation.y = t * 0.4                     // Continuous Y spin
logo.rotation.x = Math.sin(t * 0.5) * 0.08   // Gentle X tilt oscillation

// Emissive pulse
const intensity = Math.sin(t * 4) * 0.3 + 0.7
redMat.emissiveIntensity = intensity * 0.8
redGlowMat.emissiveIntensity = intensity * 1.2  // Center glows brighter
blueMat.emissiveIntensity = intensity * 0.8
ringMat.emissiveIntensity = intensity * 0.8

// Animated lights
redLight.intensity = Math.sin(t * 1.5) * 0.8 + 2.5
blueLight.position.x = Math.cos(t * 0.8) * 4
blueLight.position.y = Math.sin(t * 0.8) * 2
```

---

## 8. Loading Screen

A fullscreen overlay that fades out after 2.8 seconds.

```html
<div class="loader-overlay">
  <div class="loader-text">Initializing</div>
  <div class="loader-bar"><div class="loader-bar-fill"></div></div>
</div>
```

```css
.loader-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 1s ease, visibility 1s ease;
}
.loader-overlay.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
```

- **Text:** Orbitron, 1.4rem, `var(--red)`, letter-spacing 8px, uppercase, `breathe` animation (pulsing opacity + text-shadow)
- **Bar:** 200px wide, 2px tall, gray background, red fill animates from 0% to 100% over 2.5s
- Add the `.hidden` class after 2.8s via JavaScript timeout

---

## 9. Cursor Glow

A 400px radial gradient that follows the mouse:

```html
<div id="cursor-glow"></div>
```

```css
#cursor-glow {
  position: fixed;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 0, 0, 0.04) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
}
```

Update position on `mousemove`:
```javascript
element.style.left = e.clientX + 'px'
element.style.top = e.clientY + 'px'
```

---

## 10. CSS Animations

### `fadeScaleIn` — Container and elements entrance
```css
@keyframes fadeScaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
/* Usage: animation: fadeScaleIn 0.8s ease 2.8s both; */
```

### `fadeUp` — Result sections
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### `scanLine` — Red line sweeping across container top edge
```css
@keyframes scanLine {
  to { left: 100%; }
}
/* Applied to .container::before — a 1px red gradient line */
```

### `loadFill` — Progress bar fill
```css
@keyframes loadFill {
  to { width: 100%; }
}
```

### `breathe` — Loader text pulse
```css
@keyframes breathe {
  0%, 100% { opacity: 0.4; text-shadow: 0 0 10px transparent; }
  50% { opacity: 1; text-shadow: 0 0 20px var(--red-glow); }
}
```

### Easing function
All interactive transitions use:
```css
transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
```
This gives a fast start with a long ease-out — feels snappy but smooth.

---

## 11. Interactive Elements

### Buttons — Generate (primary)
- Transparent background, 1px solid `var(--red)` border
- On hover: `::after` pseudo-element slides up from bottom (`translateY(100%)` → `translateY(0)`) with red background
- Text changes to white, box-shadow adds red glow
- Orbitron font, 0.8rem, weight 700, letter-spacing 4px, uppercase

### Buttons — Secondary (download, reset)
- Same transparent base, border `rgba(255, 26, 26, 0.3)`
- On hover: `::before` pseudo-element scales from right (`scaleX(0)`) to left (`scaleX(1)`)
- Orbitron font, 0.65rem

### Type selector tabs
- Two-column grid, no gap
- Active tab: `background: rgba(255, 26, 26, 0.1)`, `color: var(--red)`, 2px red bottom border
- Hover: `::before` pseudo-element `scaleY(0.03)` from bottom

### Form inputs
- `background: rgba(0, 0, 0, 0.5)`, `border: 1px solid rgba(255, 26, 26, 0.15)`
- Focus: border brightens to `rgba(255, 26, 26, 0.5)`, box-shadow adds subtle red glow, background darkens to 0.7 alpha
- Rajdhani font, 1rem, weight 500
- Placeholder: `rgba(255, 255, 255, 0.2)`, letter-spacing 2px

### Error messages
- Left-border style: `border-left: 2px solid var(--red)`
- Background: `rgba(255, 26, 26, 0.08)`
- Text color: `var(--red)`

---

## 12. Saber Divider

A horizontal glowing line used to separate sections:

```css
.saber-divider {
  width: 120px;
  height: 2px;
  margin: 15px auto;
  background: linear-gradient(90deg, transparent, var(--red), transparent);
  box-shadow: 0 0 15px var(--red-glow), 0 0 30px rgba(255, 0, 0, 0.3);
  border-radius: 2px;
}
```

---

## 13. Scrollbar

```css
html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--red) var(--dark);
}
```

---

## 14. Responsive Breakpoints

Single breakpoint at 600px:

```css
@media (max-width: 600px) {
  .container { padding: 30px 20px; }
  header h1 { letter-spacing: 3px; }
  .form-row { grid-template-columns: 1fr; }
  .qr-actions { flex-direction: column; align-items: center; }
  .download-btn, .reset-btn { width: 100%; }
}
```

---

## 15. Implementation Checklist for New Projects

### Dependencies
```json
{
  "three": "^0.182.0",
  "react": "^18.2.0",
  "vite": "^5.0.0"
}
```

### Files to create/copy
1. `index.css` — CSS variables, body reset, canvas positioning, cursor glow, scrollbar
2. `App.css` — All component styles (loader, container, header, forms, buttons, animations)
3. `SpaceBackground.jsx` — Full-viewport Three.js star field with particles and animated lights
4. `Logo3D.jsx` — Procedural CPU circuit logo with rotation and glow animation
5. `public/assets/` — Logo SVG and PNG files

### Font preloading (in `index.html`)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Key principles
- **No border-radius** on containers, inputs, or buttons (sharp edges only)
- **No bright backgrounds** — darkest possible, using alpha transparency for layering
- **Red is the only accent** in 2D UI — blue appears only in 3D scenes
- **All UI text is uppercase** with wide letter-spacing
- **Animations delay 2.8–3s** so the loading screen completes first
- **All glows use red** — `box-shadow`, `text-shadow`, `filter: drop-shadow`, or Three.js emissive
- **Backdrop blur (12px)** on the main container for glass-panel effect over the 3D background
- **Pointer-events: none** on all decorative layers (canvas, cursor glow, overlays)
