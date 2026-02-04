import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────
//  DARTH SELDON "DS" LOGO — 3D extruded monogram crest
// ─────────────────────────────────────────────
function createDarthSeldonLogo() {
  const group = new THREE.Group()

  // ── Materials
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a, roughness: 0.25, metalness: 0.85,
  })
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a, roughness: 0.3, metalness: 0.8,
  })
  const redEmissive = new THREE.MeshStandardMaterial({
    color: 0xff1a1a, roughness: 0.2, metalness: 0.3,
    emissive: 0xff1a1a, emissiveIntensity: 1.5,
    transparent: true, opacity: 0.9,
  })
  const redTipMat = new THREE.MeshStandardMaterial({
    color: 0xff1a1a, roughness: 0.1, metalness: 0.2,
    emissive: 0xff1a1a, emissiveIntensity: 2.0,
  })

  const extrudeSettings = {
    depth: 1.2,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.1,
    bevelSegments: 3,
  }

  const letterExtrude = {
    depth: 1.6,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 2,
  }

  // Scale factor: SVG coordinates mapped to 3D world units
  // SVG viewBox is 0..100 x 0..120, we'll map to roughly -5..5 x -6..6
  const S = 0.1 // scale
  const OX = -50 // offset X to center
  const OY = -60 // offset Y to center

  function svgPt(x, y) {
    return new THREE.Vector2((x + OX) * S, -(y + OY) * S)
  }

  // ── OUTER FRAME — angular hexagonal shield
  const frameShape = new THREE.Shape()
  frameShape.moveTo(...svgPt(50, 2).toArray())
  frameShape.lineTo(...svgPt(88, 22).toArray())
  frameShape.lineTo(...svgPt(88, 98).toArray())
  frameShape.lineTo(...svgPt(50, 118).toArray())
  frameShape.lineTo(...svgPt(12, 98).toArray())
  frameShape.lineTo(...svgPt(12, 22).toArray())
  frameShape.closePath()

  // Cut out the inner area to make it a frame
  const innerHole = new THREE.Path()
  innerHole.moveTo(...svgPt(50, 10).toArray())
  innerHole.lineTo(...svgPt(82, 27).toArray())
  innerHole.lineTo(...svgPt(82, 93).toArray())
  innerHole.lineTo(...svgPt(50, 110).toArray())
  innerHole.lineTo(...svgPt(18, 93).toArray())
  innerHole.lineTo(...svgPt(18, 27).toArray())
  innerHole.closePath()
  frameShape.holes.push(innerHole)

  const frameGeo = new THREE.ExtrudeGeometry(frameShape, extrudeSettings)
  const frameMesh = new THREE.Mesh(frameGeo, frameMat)
  frameMesh.position.z = -extrudeSettings.depth / 2
  group.add(frameMesh)

  // ── Inner back plate (solid fill behind letters)
  const backShape = new THREE.Shape()
  backShape.moveTo(...svgPt(50, 10).toArray())
  backShape.lineTo(...svgPt(82, 27).toArray())
  backShape.lineTo(...svgPt(82, 93).toArray())
  backShape.lineTo(...svgPt(50, 110).toArray())
  backShape.lineTo(...svgPt(18, 93).toArray())
  backShape.lineTo(...svgPt(18, 27).toArray())
  backShape.closePath()

  const backGeo = new THREE.ExtrudeGeometry(backShape, { depth: 0.3, bevelEnabled: false })
  const backMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, roughness: 0.4, metalness: 0.7,
  })
  const backMesh = new THREE.Mesh(backGeo, backMat)
  backMesh.position.z = -0.15
  group.add(backMesh)

  // ── "D" LETTER — left half
  // Outer shape of D
  const dShape = new THREE.Shape()
  dShape.moveTo(...svgPt(28, 32).toArray())
  dShape.lineTo(...svgPt(28, 88).toArray())
  dShape.lineTo(...svgPt(48, 88).toArray())
  dShape.lineTo(...svgPt(48, 82).toArray())
  dShape.lineTo(...svgPt(52, 76).toArray())
  dShape.lineTo(...svgPt(52, 44).toArray())
  dShape.lineTo(...svgPt(48, 38).toArray())
  dShape.lineTo(...svgPt(48, 32).toArray())
  dShape.closePath()

  // Inner hole of D
  const dHole = new THREE.Path()
  dHole.moveTo(...svgPt(36, 42).toArray())
  dHole.lineTo(...svgPt(44, 42).toArray())
  dHole.lineTo(...svgPt(46, 46).toArray())
  dHole.lineTo(...svgPt(46, 74).toArray())
  dHole.lineTo(...svgPt(44, 78).toArray())
  dHole.lineTo(...svgPt(36, 78).toArray())
  dHole.closePath()
  dShape.holes.push(dHole)

  const dGeo = new THREE.ExtrudeGeometry(dShape, letterExtrude)
  const dMesh = new THREE.Mesh(dGeo, chromeMat)
  dMesh.position.z = -letterExtrude.depth / 2
  group.add(dMesh)

  // ── "S" LETTER — right half, angular zigzag
  const sShape = new THREE.Shape()
  sShape.moveTo(...svgPt(54, 32).toArray())
  sShape.lineTo(...svgPt(74, 32).toArray())
  sShape.lineTo(...svgPt(74, 40).toArray())
  sShape.lineTo(...svgPt(62, 40).toArray())
  sShape.lineTo(...svgPt(58, 46).toArray())
  sShape.lineTo(...svgPt(58, 54).toArray())
  sShape.lineTo(...svgPt(74, 54).toArray())
  sShape.lineTo(...svgPt(74, 88).toArray())
  sShape.lineTo(...svgPt(54, 88).toArray())
  sShape.lineTo(...svgPt(54, 80).toArray())
  sShape.lineTo(...svgPt(66, 80).toArray())
  sShape.lineTo(...svgPt(70, 74).toArray())
  sShape.lineTo(...svgPt(70, 66).toArray())
  sShape.lineTo(...svgPt(54, 66).toArray())
  sShape.closePath()

  const sGeo = new THREE.ExtrudeGeometry(sShape, letterExtrude)
  const sMesh = new THREE.Mesh(sGeo, chromeMat)
  sMesh.position.z = -letterExtrude.depth / 2
  group.add(sMesh)

  // ── RED CENTER LINE — lightsaber accent
  const lineGeo = new THREE.BoxGeometry(0.18, 8.4, 0.5)
  const lineMesh = new THREE.Mesh(lineGeo, redEmissive)
  lineMesh.position.set(0, 0, 0.5)
  lineMesh.name = 'centerLine'
  group.add(lineMesh)

  // ── RED TIP ACCENTS — top and bottom points
  const tipGeo = new THREE.SphereGeometry(0.3, 12, 12)
  const topTip = new THREE.Mesh(tipGeo, redTipMat)
  topTip.position.set(...svgPt(50, 2).toArray(), 0.6)
  topTip.name = 'topTip'
  group.add(topTip)

  const bottomTip = new THREE.Mesh(tipGeo.clone(), redTipMat)
  bottomTip.position.set(...svgPt(50, 118).toArray(), 0.6)
  bottomTip.name = 'bottomTip'
  group.add(bottomTip)

  // ── Notch details on sides
  const notchShape = new THREE.Shape()
  notchShape.moveTo(...svgPt(12, 45).toArray())
  notchShape.lineTo(...svgPt(6, 50).toArray())
  notchShape.lineTo(...svgPt(6, 70).toArray())
  notchShape.lineTo(...svgPt(12, 75).toArray())
  notchShape.lineTo(...svgPt(10, 70).toArray())
  notchShape.lineTo(...svgPt(10, 50).toArray())
  notchShape.closePath()

  const notchGeo = new THREE.ExtrudeGeometry(notchShape, { depth: 0.8, bevelEnabled: false })
  const leftNotch = new THREE.Mesh(notchGeo, frameMat)
  leftNotch.position.z = -0.4
  group.add(leftNotch)

  // Right notch — mirrored
  const rNotchShape = new THREE.Shape()
  rNotchShape.moveTo(...svgPt(88, 45).toArray())
  rNotchShape.lineTo(...svgPt(94, 50).toArray())
  rNotchShape.lineTo(...svgPt(94, 70).toArray())
  rNotchShape.lineTo(...svgPt(88, 75).toArray())
  rNotchShape.lineTo(...svgPt(90, 70).toArray())
  rNotchShape.lineTo(...svgPt(90, 50).toArray())
  rNotchShape.closePath()

  const rNotchGeo = new THREE.ExtrudeGeometry(rNotchShape, { depth: 0.8, bevelEnabled: false })
  const rightNotch = new THREE.Mesh(rNotchGeo, frameMat)
  rightNotch.position.z = -0.4
  group.add(rightNotch)

  // ── Red point lights for glow
  const topGlow = new THREE.PointLight(0xff1a1a, 2, 12)
  topGlow.position.set(0, 5.8, 2)
  group.add(topGlow)

  const bottomGlow = new THREE.PointLight(0xff1a1a, 2, 12)
  bottomGlow.position.set(0, -5.8, 2)
  group.add(bottomGlow)

  const centerGlow = new THREE.PointLight(0xff1a1a, 1.5, 8)
  centerGlow.position.set(0, 0, 3)
  group.add(centerGlow)

  return group
}

// ─────────────────────────────────────────────
//  SCENE SETUP & ANIMATION
// ─────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 50

    // ── Lighting rig
    scene.add(new THREE.AmbientLight(0x666688, 1.2))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
    keyLight.position.set(25, 25, 45)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xccccee, 0.7)
    fillLight.position.set(-30, 10, 35)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.4)
    rimLight.position.set(0, -15, -30)
    scene.add(rimLight)

    const topLight = new THREE.DirectionalLight(0xeeeeff, 0.5)
    topLight.position.set(0, 40, 20)
    scene.add(topLight)

    // ── Star field
    const starGeo = new THREE.BufferGeometry()
    const starCount = 3000
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 400
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 400
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 400
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8, sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Red accent particles
    const redGeo = new THREE.BufferGeometry()
    const redCount = 150
    const redPos = new Float32Array(redCount * 3)
    for (let i = 0; i < redCount; i++) {
      redPos[i * 3] = (Math.random() - 0.5) * 250
      redPos[i * 3 + 1] = (Math.random() - 0.5) * 250
      redPos[i * 3 + 2] = (Math.random() - 0.5) * 250
    }
    redGeo.setAttribute('position', new THREE.BufferAttribute(redPos, 3))
    const redMat = new THREE.PointsMaterial({
      color: 0xff1a1a, size: 0.8, transparent: true, opacity: 0.3, sizeAttenuation: true,
    })
    const redParticles = new THREE.Points(redGeo, redMat)
    scene.add(redParticles)

    // ── Darth Seldon Logo — right side of the card
    const logo = createDarthSeldonLogo()
    logo.position.set(30, 0, 22)
    logo.scale.setScalar(1.8)
    scene.add(logo)

    // Cache references for animation
    const centerLine = logo.getObjectByName('centerLine')
    const topTip = logo.getObjectByName('topTip')
    const bottomTip = logo.getObjectByName('bottomTip')

    // ── Mouse parallax
    let mouseX = 0, mouseY = 0
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    document.addEventListener('mousemove', onMouseMove)

    // ── Scroll
    let scrollY = 0
    const onScroll = () => { scrollY = window.pageYOffset }
    window.addEventListener('scroll', onScroll)

    // ── Animation loop
    const clock = new THREE.Clock()
    let animId

    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Stars
      stars.rotation.y = t * 0.015
      stars.rotation.x = t * 0.008
      redParticles.rotation.y = -t * 0.02
      redParticles.rotation.x = t * 0.01

      // Logo: slow rotate + gentle float
      logo.rotation.y = t * 0.04
      logo.position.x = 30 + Math.sin(t * 0.08) * 2
      logo.position.y = Math.cos(t * 0.06) * 1.5

      // Pulse the center line and tips
      if (centerLine) {
        centerLine.material.emissiveIntensity = 1.2 + Math.sin(t * 2.5) * 0.5
        centerLine.material.opacity = 0.7 + Math.sin(t * 3) * 0.2
      }
      if (topTip) {
        topTip.material.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.8
      }
      if (bottomTip) {
        bottomTip.material.emissiveIntensity = 1.5 + Math.sin(t * 2 + 1) * 0.8
      }

      // Camera parallax
      camera.position.x += (mouseX * 3 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 3 - camera.position.y + scrollY * 0.01) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
