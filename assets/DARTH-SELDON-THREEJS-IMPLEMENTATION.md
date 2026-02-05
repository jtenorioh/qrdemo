# Darth Seldon Logo - Three.js Implementation Guide

**Created:** 2026-02-04  
**Purpose:** 3D logo rendering with animations for backgrounds, headers, and hero sections  
**Status:** Production-ready implementation

---

## 🎯 Overview

This guide shows how to implement the Darth Seldon logo as a 3D object in Three.js with glowing effects, animations, and particle systems.

---

## 📦 Project Setup

### **Installation**

```bash
npm install three
# Optional: For TypeScript
npm install --save-dev @types/three
```

### **File Structure**

```
/project
  /public
    /assets
      darth-seldon-logo-no-slogan.svg
  /src
    /components
      DarthSeldonLogo3D.js
      ParticleBackground.js
    /shaders
      glowFragment.glsl
      glowVertex.glsl
    main.js
```

---

## 🔴 Basic 3D Logo Implementation

### **1. Simple Extruded Logo**

```javascript
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class DarthSeldonLogo3D {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.logo = null;
    this.controls = null;
    
    this.init();
  }
  
  init() {
    // Setup scene
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.loadLogo();
    this.setupControls();
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onResize());
  }
  
  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(0, 0, 0);
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a0a0a, 1); // Deep space black
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // Red point light (Sith glow)
    const redLight = new THREE.PointLight(0xdc2626, 2, 500);
    redLight.position.set(0, 0, 100);
    this.scene.add(redLight);
    
    // Blue point light (hologram effect)
    const blueLight = new THREE.PointLight(0x3b82f6, 1.5, 400);
    blueLight.position.set(150, 0, 50);
    this.scene.add(blueLight);
    
    // Directional light (front)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 0, 200);
    this.scene.add(directionalLight);
  }
  
  loadLogo() {
    const loader = new SVGLoader();
    
    loader.load(
      '/assets/darth-seldon-logo-no-slogan.svg',
      (data) => {
        this.createLogoMesh(data);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading SVG:', error);
      }
    );
  }
  
  createLogoMesh(svgData) {
    const logoGroup = new THREE.Group();
    
    const paths = svgData.paths;
    
    // Extrusion settings
    const extrudeSettings = {
      depth: 20,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 3
    };
    
    paths.forEach((path) => {
      const shapes = SVGLoader.createShapes(path);
      
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        
        // Determine material based on path color
        const color = path.color;
        let material;
        
        if (this.isRed(color)) {
          // Red elements (CPU core, main traces) - emissive glow
          material = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            emissive: 0xdc2626,
            emissiveIntensity: 0.6,
            metalness: 0.8,
            roughness: 0.2
          });
        } else if (this.isBlue(color)) {
          // Blue elements (hologram circuits)
          material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.5,
            metalness: 0.7,
            roughness: 0.3,
            transparent: true,
            opacity: 0.9
          });
        } else {
          // Gray/white elements
          material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.6,
            roughness: 0.4
          });
        }
        
        const mesh = new THREE.Mesh(geometry, material);
        logoGroup.add(mesh);
      });
    });
    
    // Center the logo
    const box = new THREE.Box3().setFromObject(logoGroup);
    const center = box.getCenter(new THREE.Vector3());
    logoGroup.position.sub(center);
    
    // Scale appropriately
    logoGroup.scale.set(0.5, -0.5, 0.5); // Flip Y for SVG coordinate system
    
    this.logo = logoGroup;
    this.scene.add(this.logo);
  }
  
  isRed(color) {
    return color.r > 0.7 && color.g < 0.2 && color.b < 0.2;
  }
  
  isBlue(color) {
    return color.b > 0.7 && color.r < 0.3 && color.g < 0.6;
  }
  
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.0;
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (this.controls) {
      this.controls.update();
    }
    
    // Pulsing glow effect
    if (this.logo) {
      const time = Date.now() * 0.001;
      const pulseIntensity = Math.sin(time * 2) * 0.2 + 0.6;
      
      this.logo.children.forEach((mesh) => {
        if (mesh.material.emissive) {
          mesh.material.emissiveIntensity = pulseIntensity;
        }
      });
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }
  
  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}

// Usage
const container = document.getElementById('logo-container');
const logo3D = new DarthSeldonLogo3D(container);
```

---

## ⚡ Advanced: Animated Background Logo

### **2. Hero Background with Particles**

```javascript
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

class DarthSeldonBackground {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.logo = null;
    this.particles = null;
    this.mouse = new THREE.Vector2();
    
    this.init();
  }
  
  init() {
    this.setupCamera();
    this.setupRenderer();
    this.setupLights();
    this.loadLogo();
    this.createParticles();
    this.setupMouseTracking();
    this.animate();
    
    window.addEventListener('resize', () => this.onResize());
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 0, 600);
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x0a0a0a);
    this.container.appendChild(this.renderer.domElement);
  }
  
  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x1a1a1a, 0.3);
    this.scene.add(ambientLight);
    
    // Animated red point light
    const redLight = new THREE.PointLight(0xdc2626, 3, 800);
    redLight.position.set(0, 0, 200);
    redLight.name = 'redLight';
    this.scene.add(redLight);
    
    // Animated blue point light
    const blueLight = new THREE.PointLight(0x3b82f6, 2, 600);
    blueLight.position.set(300, 0, 100);
    blueLight.name = 'blueLight';
    this.scene.add(blueLight);
  }
  
  loadLogo() {
    const loader = new SVGLoader();
    
    loader.load('/assets/darth-seldon-logo-no-slogan.svg', (data) => {
      const logoGroup = new THREE.Group();
      
      const extrudeSettings = {
        depth: 30,
        bevelEnabled: true,
        bevelThickness: 3,
        bevelSize: 2,
        bevelSegments: 5
      };
      
      data.paths.forEach((path) => {
        const shapes = SVGLoader.createShapes(path);
        
        shapes.forEach((shape) => {
          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          
          const color = path.color;
          let material;
          
          if (this.isRed(color)) {
            material = new THREE.MeshStandardMaterial({
              color: 0xdc2626,
              emissive: 0xdc2626,
              emissiveIntensity: 0.8,
              metalness: 0.9,
              roughness: 0.1
            });
          } else if (this.isBlue(color)) {
            material = new THREE.MeshStandardMaterial({
              color: 0x3b82f6,
              emissive: 0x3b82f6,
              emissiveIntensity: 0.7,
              metalness: 0.8,
              roughness: 0.2,
              transparent: true,
              opacity: 0.95
            });
          } else {
            material = new THREE.MeshStandardMaterial({
              color: color,
              metalness: 0.7,
              roughness: 0.3
            });
          }
          
          const mesh = new THREE.Mesh(geometry, material);
          logoGroup.add(mesh);
        });
      });
      
      // Center and scale
      const box = new THREE.Box3().setFromObject(logoGroup);
      const center = box.getCenter(new THREE.Vector3());
      logoGroup.position.sub(center);
      logoGroup.scale.set(0.8, -0.8, 0.8);
      
      this.logo = logoGroup;
      this.scene.add(this.logo);
    });
  }
  
  createParticles() {
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Positions
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
      
      // Colors (mix of red, blue, white)
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        // Red
        colors[i * 3] = 0.86;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.15;
      } else if (colorChoice < 0.6) {
        // Blue
        colors[i * 3] = 0.23;
        colors[i * 3 + 1] = 0.51;
        colors[i * 3 + 2] = 0.96;
      } else {
        // White/gray
        const gray = Math.random() * 0.5 + 0.5;
        colors[i * 3] = gray;
        colors[i * 3 + 1] = gray;
        colors[i * 3 + 2] = gray;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }
  
  setupMouseTracking() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.0005;
    
    // Rotate logo slowly
    if (this.logo) {
      this.logo.rotation.y = time * 0.3;
      this.logo.rotation.x = Math.sin(time * 0.5) * 0.1;
      
      // Pulsing glow
      const pulseIntensity = Math.sin(time * 4) * 0.3 + 0.7;
      this.logo.children.forEach((mesh) => {
        if (mesh.material.emissive) {
          mesh.material.emissiveIntensity = pulseIntensity;
        }
      });
    }
    
    // Animate particles
    if (this.particles) {
      this.particles.rotation.y = time * 0.05;
      this.particles.rotation.x = time * 0.02;
    }
    
    // Animate lights
    const redLight = this.scene.getObjectByName('redLight');
    const blueLight = this.scene.getObjectByName('blueLight');
    
    if (redLight) {
      redLight.position.x = Math.sin(time * 2) * 200;
      redLight.position.y = Math.cos(time * 2) * 200;
      redLight.intensity = Math.sin(time * 3) * 1 + 3;
    }
    
    if (blueLight) {
      blueLight.position.x = Math.cos(time * 1.5) * 300;
      blueLight.position.y = Math.sin(time * 1.5) * 200;
    }
    
    // Mouse parallax effect
    if (this.logo) {
      this.logo.rotation.x += (this.mouse.y * 0.1 - this.logo.rotation.x) * 0.05;
      this.logo.rotation.y += (this.mouse.x * 0.1 - this.logo.rotation.y) * 0.05;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  isRed(color) {
    return color.r > 0.7 && color.g < 0.2 && color.b < 0.2;
  }
  
  isBlue(color) {
    return color.b > 0.7 && color.r < 0.3;
  }
  
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// Usage
const container = document.getElementById('hero-background');
const background = new DarthSeldonBackground(container);
```

---

## 🌟 HTML Integration Examples

### **Example 1: Hero Section Background**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Darth Seldon</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Orbitron', sans-serif;
      background: #0a0a0a;
      color: #e5e7eb;
      overflow-x: hidden;
    }
    
    #hero-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    
    h1 {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 20px;
      text-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
    }
    
    .slogan {
      font-size: 1.5rem;
      font-weight: 700;
      color: #9ca3af;
      margin-bottom: 40px;
    }
    
    .cta-button {
      padding: 15px 40px;
      font-size: 1.2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
      color: #e5e7eb;
      border: 2px solid #dc2626;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
    }
    
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 40px rgba(220, 38, 38, 0.9);
    }
  </style>
</head>
<body>
  <div id="hero-background"></div>
  
  <div class="hero-content">
    <h1>DARTH SELDON</h1>
    <p class="slogan">"You don't know the power of the Dark Side"</p>
    <button class="cta-button">Enter</button>
  </div>
  
  <script type="module">
    import { DarthSeldonBackground } from './DarthSeldonBackground.js';
    
    const container = document.getElementById('hero-background');
    const background = new DarthSeldonBackground(container);
  </script>
</body>
</html>
```

---

### **Example 2: Rotating Logo Card**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Logo Showcase</title>
  <style>
    body {
      margin: 0;
      background: #0a0a0a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    
    #logo-container {
      width: 600px;
      height: 600px;
      border: 2px solid #3a3a3a;
      border-radius: 12px;
      background: #0f0f0f;
      box-shadow: 0 0 40px rgba(220, 38, 38, 0.3);
    }
  </style>
</head>
<body>
  <div id="logo-container"></div>
  
  <script type="module">
    import { DarthSeldonLogo3D } from './DarthSeldonLogo3D.js';
    
    const container = document.getElementById('logo-container');
    const logo = new DarthSeldonLogo3D(container);
  </script>
</body>
</html>
```

---

## 🎬 Animation Presets

### **Preset 1: Slow Rotation with Pulse**

```javascript
animate() {
  requestAnimationFrame(() => this.animate());
  
  const time = Date.now() * 0.0003;
  
  if (this.logo) {
    // Slow Y-axis rotation
    this.logo.rotation.y = time;
    
    // Subtle breathing effect
    const scale = Math.sin(time * 2) * 0.05 + 1.0;
    this.logo.scale.set(scale, scale, scale);
    
    // Pulsing emissive glow
    const intensity = Math.sin(time * 4) * 0.3 + 0.7;
    this.logo.children.forEach(mesh => {
      if (mesh.material.emissive) {
        mesh.material.emissiveIntensity = intensity;
      }
    });
  }
  
  this.renderer.render(this.scene, this.camera);
}
```

---

### **Preset 2: Wobble Effect**

```javascript
animate() {
  requestAnimationFrame(() => this.animate());
  
  const time = Date.now() * 0.001;
  
  if (this.logo) {
    // Wobble on X and Y axes
    this.logo.rotation.x = Math.sin(time * 0.7) * 0.2;
    this.logo.rotation.y = time * 0.5;
    this.logo.rotation.z = Math.cos(time * 0.5) * 0.1;
  }
  
  this.renderer.render(this.scene, this.camera);
}
```

---

### **Preset 3: Data Flow Animation**

```javascript
// Add flowing particles along circuit traces
createFlowingParticles() {
  const particleCount = 50;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const material = new THREE.PointsMaterial({
    color: 0xdc2626,
    size: 4,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  this.flowParticles = new THREE.Points(geometry, material);
  this.scene.add(this.flowParticles);
}

animateFlowParticles() {
  const positions = this.flowParticles.geometry.attributes.position.array;
  const time = Date.now() * 0.001;
  
  for (let i = 0; i < positions.length / 3; i++) {
    // Move particles along circuit path
    const t = (time + i * 0.1) % 1;
    positions[i * 3] = Math.sin(t * Math.PI * 2) * 100;
    positions[i * 3 + 1] = Math.cos(t * Math.PI * 2) * 100;
    positions[i * 3 + 2] = t * 50;
  }
  
  this.flowParticles.geometry.attributes.position.needsUpdate = true;
}
```

---

## 🎨 Material Configurations

### **Red Emissive (CPU Core)**

```javascript
const redMaterial = new THREE.MeshStandardMaterial({
  color: 0xdc2626,
  emissive: 0xdc2626,
  emissiveIntensity: 0.8,
  metalness: 0.9,
  roughness: 0.1,
  envMapIntensity: 1.0
});
```

### **Blue Hologram (Secondary Circuits)**

```javascript
const blueMaterial = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  emissive: 0x3b82f6,
  emissiveIntensity: 0.7,
  metalness: 0.8,
  roughness: 0.2,
  transparent: true,
  opacity: 0.95,
  blending: THREE.AdditiveBlending
});
```

### **Metallic Gray (Tertiary Traces)**

```javascript
const grayMaterial = new THREE.MeshStandardMaterial({
  color: 0x6b7280,
  metalness: 0.7,
  roughness: 0.3,
  envMapIntensity: 0.5
});
```

---

## 📱 Responsive Implementation

```javascript
class ResponsiveLogo3D {
  constructor(container) {
    this.container = container;
    this.isMobile = window.innerWidth < 768;
    this.init();
  }
  
  init() {
    // Adjust settings based on device
    const extrudeDepth = this.isMobile ? 10 : 30;
    const particleCount = this.isMobile ? 500 : 2000;
    const pixelRatio = this.isMobile ? 1 : window.devicePixelRatio;
    
    this.renderer.setPixelRatio(Math.min(pixelRatio, 2));
    
    // Disable auto-rotate on mobile for better performance
    if (this.controls) {
      this.controls.autoRotate = !this.isMobile;
    }
  }
  
  onResize() {
    this.isMobile = window.innerWidth < 768;
    
    // Adjust camera FOV for mobile
    if (this.isMobile) {
      this.camera.fov = 70;
      this.camera.position.z = 800;
    } else {
      this.camera.fov = 45;
      this.camera.position.z = 500;
    }
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
```

---

## ⚙️ Performance Optimization

### **1. Level of Detail (LOD)**

```javascript
setupLOD() {
  const lod = new THREE.LOD();
  
  // High detail (close)
  const highDetailLogo = this.createLogo({ depth: 30, bevelSegments: 5 });
  lod.addLevel(highDetailLogo, 0);
  
  // Medium detail
  const mediumDetailLogo = this.createLogo({ depth: 20, bevelSegments: 3 });
  lod.addLevel(mediumDetailLogo, 300);
  
  // Low detail (far)
  const lowDetailLogo = this.createLogo({ depth: 10, bevelSegments: 1 });
  lod.addLevel(lowDetailLogo, 600);
  
  this.scene.add(lod);
}
```

### **2. Frustum Culling**

```javascript
// Automatically enabled by Three.js, but ensure it's not disabled
mesh.frustumCulled = true;
```

### **3. Texture Atlasing** (if using textures)

```javascript
// Combine multiple textures into one atlas to reduce draw calls
```

---

## 🚀 Production Checklist

- [ ] Optimize extrusion depth (balance detail vs performance)
- [ ] Use LOD for distant/small logos
- [ ] Implement lazy loading for SVG
- [ ] Add loading spinner while logo loads
- [ ] Test on mobile devices (reduce particle count if needed)
- [ ] Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- [ ] Dispose of geometries/materials on cleanup
- [ ] Use `requestIdleCallback` for non-critical animations
- [ ] Consider using OffscreenCanvas for background rendering
- [ ] Add fallback 2D logo for low-end devices

---

## 📚 Additional Resources

**Three.js Docs:**
- SVGLoader: https://threejs.org/docs/#examples/en/loaders/SVGLoader
- ExtrudeGeometry: https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry
- MeshStandardMaterial: https://threejs.org/docs/#api/en/materials/MeshStandardMaterial

**Examples:**
- Three.js SVG Examples: https://threejs.org/examples/?q=svg
- Particle Systems: https://threejs.org/examples/?q=points

---

**All systems nominal. Three.js implementation ready for production.** ⚡🔴🎨
