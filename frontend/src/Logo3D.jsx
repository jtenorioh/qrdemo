import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────
//  Build the Darth Seldon CPU circuit logo procedurally
//  Based on DARTH-SELDON-THREEJS-IMPLEMENTATION.md
//  SVG is 800x800 centered at (400,400) — we map to 3D centered at origin
// ─────────────────────────────────────────────
function createCPULogo() {
  const group = new THREE.Group()

  // Scale: SVG coords centered at 400,400 → origin, 1 SVG unit = 0.01 world unit
  const S = 0.01
  function svgX(x) { return (x - 400) * S }
  function svgY(y) { return -(y - 400) * S } // flip Y

  // ── Materials (from implementation guide)
  const redMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.6,
    metalness: 0.8, roughness: 0.2,
  })
  const redGlowMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.8,
    metalness: 0.9, roughness: 0.1,
  })
  const blueMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 0.5,
    metalness: 0.7, roughness: 0.3, transparent: true, opacity: 0.9,
  })
  const grayMat = new THREE.MeshStandardMaterial({
    color: 0x6b7280, metalness: 0.6, roughness: 0.4,
  })
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, metalness: 0.7, roughness: 0.3,
  })
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a, metalness: 0.6, roughness: 0.4,
  })
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.3,
    metalness: 0.8, roughness: 0.2,
  })

  const DEPTH = 0.15 // extrusion depth for main elements
  const TRACE_DEPTH = 0.1

  // Helper: extruded box (circuit trace segment)
  function addTrace(x1, y1, x2, y2, width, mat, depth = TRACE_DEPTH) {
    const dx = x2 - x1, dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy) * S
    const w = width * S
    const geo = new THREE.BoxGeometry(len, w, depth)
    const mesh = new THREE.Mesh(geo, mat)
    const cx = ((x1 + x2) / 2 - 400) * S
    const cy = -((y1 + y2) / 2 - 400) * S
    mesh.position.set(cx, cy, depth / 2)
    // Rotate for vertical or angled traces
    const angle = Math.atan2(-(y2 - y1), x2 - x1)
    mesh.rotation.z = angle
    group.add(mesh)
    return mesh
  }

  // Helper: filled rect from SVG coords
  function addRect(x, y, w, h, mat, depth = DEPTH) {
    const geo = new THREE.BoxGeometry(w * S, h * S, depth)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(svgX(x + w / 2), svgY(y + h / 2), depth / 2)
    group.add(mesh)
    return mesh
  }

  // Helper: circle/sphere at SVG coords
  function addDot(cx, cy, r, mat) {
    const geo = new THREE.SphereGeometry(r * S, 16, 16)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(svgX(cx), svgY(cy), DEPTH / 2)
    group.add(mesh)
    return mesh
  }

  // ── OUTER CIRCLE RING (torus) — stroke="#dc2626" r="200"
  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(200 * S, 3 * S, 16, 64),
    ringMat
  )
  outerRing.position.z = DEPTH / 2
  group.add(outerRing)

  // Secondary ring — stroke="#3a3a3a" r="220"
  const midRing = new THREE.Mesh(
    new THREE.TorusGeometry(220 * S, 2 * S, 12, 64),
    frameMat
  )
  midRing.position.z = DEPTH / 2
  group.add(midRing)

  // Inner filled circle — r="200" fill="#0f0f0f"
  const innerDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(200 * S, 200 * S, 0.02, 64),
    darkMat
  )
  innerDisc.rotation.x = Math.PI / 2
  innerDisc.position.z = 0
  group.add(innerDisc)

  // ── CENTRAL CPU CORE
  // Outer rect: 100x100 at (350,350) — fill="#1a1a1a" stroke="#dc2626"
  addRect(350, 350, 100, 100, darkMat, DEPTH)
  // Red border for CPU core
  addTrace(350, 350, 450, 350, 4, redMat) // top
  addTrace(350, 450, 450, 450, 4, redMat) // bottom
  addTrace(350, 350, 350, 450, 4, redMat) // left
  addTrace(450, 350, 450, 450, 4, redMat) // right

  // Inner rects (stroke only in SVG, we make thin bordered boxes)
  // 80x80 at (360,360)
  addTrace(360, 360, 440, 360, 3, redMat)
  addTrace(360, 440, 440, 440, 3, redMat)
  addTrace(360, 360, 360, 440, 3, redMat)
  addTrace(440, 360, 440, 440, 3, redMat)

  // 60x60 at (370,370)
  addTrace(370, 370, 430, 370, 2, redMat)
  addTrace(370, 430, 430, 430, 2, redMat)
  addTrace(370, 370, 370, 430, 2, redMat)
  addTrace(430, 370, 430, 430, 2, redMat)

  // Center filled 40x40 at (380,380) — fill="#dc2626"
  addRect(380, 380, 40, 40, redGlowMat, DEPTH * 1.2)

  // ── CPU PIN GRID (16 small dots)
  const pinPositions = [
    [375,375],[390,375],[405,375],[420,375],
    [375,390],[390,390],[405,390],[420,390],
    [375,405],[390,405],[405,405],[420,405],
    [375,420],[390,420],[405,420],[420,420],
  ]
  pinPositions.forEach(([px, py]) => addDot(px, py, 2, redMat))

  // ── NORTH CIRCUIT
  addTrace(400, 350, 400, 300, 3, redMat)
  addTrace(400, 300, 420, 300, 3, redMat)
  addTrace(420, 300, 420, 280, 3, redMat)
  addTrace(400, 330, 380, 330, 2, grayMat)
  addTrace(380, 330, 380, 290, 2, grayMat)
  addTrace(380, 290, 360, 290, 2, grayMat)
  addTrace(360, 290, 360, 280, 2, grayMat)
  addTrace(400, 330, 420, 330, 2, grayMat)
  addTrace(420, 330, 420, 310, 2, grayMat)
  addRect(416, 276, 8, 8, redMat)
  addRect(356, 276, 8, 8, grayMat)
  addDot(420, 310, 4, grayMat)

  // ── SOUTH CIRCUIT
  addTrace(400, 450, 400, 500, 3, redMat)
  addTrace(400, 500, 380, 500, 3, redMat)
  addTrace(380, 500, 380, 520, 3, redMat)
  addTrace(400, 470, 420, 470, 2, grayMat)
  addTrace(420, 470, 420, 510, 2, grayMat)
  addTrace(420, 510, 440, 510, 2, grayMat)
  addTrace(440, 510, 440, 520, 2, grayMat)
  addTrace(400, 470, 380, 470, 2, grayMat)
  addTrace(380, 470, 380, 490, 2, grayMat)
  addRect(376, 516, 8, 8, redMat)
  addRect(436, 516, 8, 8, grayMat)
  addDot(380, 490, 4, grayMat)

  // ── WEST CIRCUIT
  addTrace(350, 400, 300, 400, 3, redMat)
  addTrace(300, 400, 300, 380, 3, redMat)
  addTrace(300, 380, 280, 380, 3, redMat)
  addTrace(330, 400, 330, 420, 2, grayMat)
  addTrace(330, 420, 310, 420, 2, grayMat)
  addTrace(310, 420, 310, 440, 2, grayMat)
  addTrace(310, 440, 290, 440, 2, grayMat)
  addTrace(330, 400, 330, 380, 2, grayMat)
  addTrace(330, 380, 310, 380, 2, grayMat)
  addRect(276, 376, 8, 8, redMat)
  addRect(286, 436, 8, 8, grayMat)
  addDot(310, 380, 4, grayMat)

  // ── EAST CIRCUIT
  addTrace(450, 400, 500, 400, 3, redMat)
  addTrace(500, 400, 500, 420, 3, redMat)
  addTrace(500, 420, 520, 420, 3, redMat)
  addTrace(470, 400, 470, 380, 2, grayMat)
  addTrace(470, 380, 490, 380, 2, grayMat)
  addTrace(490, 380, 490, 360, 2, grayMat)
  addTrace(490, 360, 510, 360, 2, grayMat)
  addTrace(470, 400, 470, 420, 2, grayMat)
  addTrace(470, 420, 490, 420, 2, grayMat)
  addRect(516, 416, 8, 8, redMat)
  addRect(506, 356, 8, 8, grayMat)
  addDot(490, 420, 4, grayMat)

  // ── DIAGONAL TRACES (blue hologram)
  // NE
  addTrace(450, 350, 480, 350, 2.5, blueMat)
  addTrace(480, 350, 480, 320, 2.5, blueMat)
  addTrace(480, 320, 500, 320, 2.5, blueMat)
  addTrace(450, 370, 470, 370, 2, blueMat)
  addTrace(470, 370, 470, 340, 2, blueMat)
  addTrace(470, 340, 490, 340, 2, blueMat)
  addTrace(490, 340, 490, 310, 2, blueMat)
  addDot(500, 320, 5, blueMat)
  addDot(490, 310, 4, blueMat)

  // NW
  addTrace(350, 350, 320, 350, 2.5, blueMat)
  addTrace(320, 350, 320, 320, 2.5, blueMat)
  addTrace(320, 320, 300, 320, 2.5, blueMat)
  addTrace(350, 370, 330, 370, 2, blueMat)
  addTrace(330, 370, 330, 340, 2, blueMat)
  addTrace(330, 340, 310, 340, 2, blueMat)
  addTrace(310, 340, 310, 310, 2, blueMat)
  addDot(300, 320, 5, blueMat)
  addDot(310, 310, 4, blueMat)

  // SE
  addTrace(450, 450, 480, 450, 2.5, blueMat)
  addTrace(480, 450, 480, 480, 2.5, blueMat)
  addTrace(480, 480, 500, 480, 2.5, blueMat)
  addTrace(450, 430, 470, 430, 2, blueMat)
  addTrace(470, 430, 470, 460, 2, blueMat)
  addTrace(470, 460, 490, 460, 2, blueMat)
  addTrace(490, 460, 490, 490, 2, blueMat)
  addDot(500, 480, 5, blueMat)
  addDot(490, 490, 4, blueMat)

  // SW
  addTrace(350, 450, 320, 450, 2.5, blueMat)
  addTrace(320, 450, 320, 480, 2.5, blueMat)
  addTrace(320, 480, 300, 480, 2.5, blueMat)
  addTrace(350, 430, 330, 430, 2, blueMat)
  addTrace(330, 430, 330, 460, 2, blueMat)
  addTrace(330, 460, 310, 460, 2, blueMat)
  addTrace(310, 460, 310, 490, 2, blueMat)
  addDot(300, 480, 5, blueMat)
  addDot(310, 490, 4, blueMat)

  // ── VIA CONNECTIONS
  addDot(380, 330, 2.5, redMat)
  addDot(420, 330, 2.5, redMat)
  addDot(380, 470, 2.5, redMat)
  addDot(420, 470, 2.5, redMat)
  addDot(330, 380, 2.5, blueMat)
  addDot(470, 380, 2.5, blueMat)
  addDot(330, 420, 2.5, blueMat)
  addDot(470, 420, 2.5, blueMat)

  // ── OUTER CONNECTORS
  const connectors = [
    [396, 235, 8, 15], [396, 550, 8, 15],
    [225, 396, 15, 8], [560, 396, 15, 8],
    [265, 255, 12, 12], [523, 255, 12, 12],
    [265, 533, 12, 12], [523, 533, 12, 12],
  ]
  connectors.forEach(([x, y, w, h]) => addRect(x, y, w, h, darkMat, 0.08))

  // ── GLOW RINGS (subtle)
  const glowRingMat = new THREE.MeshBasicMaterial({
    color: 0xdc2626, transparent: true, opacity: 0.15, side: THREE.DoubleSide,
  })
  ;[110, 85, 65].forEach((r) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r * S, 1 * S, 8, 48),
      glowRingMat
    )
    ring.position.z = DEPTH / 2
    group.add(ring)
  })

  return { group, redMat, redGlowMat, blueMat, ringMat }
}

// ─────────────────────────────────────────────
//  React component
// ─────────────────────────────────────────────
export default function Logo3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)

    // ── Lighting (from implementation guide)
    scene.add(new THREE.AmbientLight(0x404040, 0.5))

    const redLight = new THREE.PointLight(0xdc2626, 2, 20)
    redLight.position.set(0, 0, 4)
    scene.add(redLight)

    const blueLight = new THREE.PointLight(0x3b82f6, 1.5, 15)
    blueLight.position.set(3, 0, 2)
    scene.add(blueLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(2, 2, 5)
    scene.add(dirLight)

    const fillLight = new THREE.DirectionalLight(0xccccee, 0.4)
    fillLight.position.set(-2, 1, 3)
    scene.add(fillLight)

    // ── Build logo
    const { group: logo, redMat, redGlowMat, blueMat, ringMat } = createCPULogo()
    scene.add(logo)

    // Collect emissive materials for pulsing
    const emissiveMats = [redMat, redGlowMat, blueMat, ringMat]

    // ── Animation (Preset 1 from guide: Slow Rotation with Pulse)
    const clock = new THREE.Clock()
    let animId

    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Slow Y-axis rotation
      logo.rotation.y = t * 0.4

      // Subtle X tilt
      logo.rotation.x = Math.sin(t * 0.5) * 0.08

      // Pulsing emissive glow
      const intensity = Math.sin(t * 4) * 0.3 + 0.7
      emissiveMats.forEach((mat) => {
        mat.emissiveIntensity = intensity * (mat === redGlowMat ? 1.2 : 0.8)
      })

      // Animate lights
      redLight.intensity = Math.sin(t * 1.5) * 0.8 + 2.5
      blueLight.position.x = Math.cos(t * 0.8) * 4
      blueLight.position.y = Math.sin(t * 0.8) * 2

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className="logo-3d-container" />
}
