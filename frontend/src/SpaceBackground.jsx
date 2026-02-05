import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─────────────────────────────────────────────
//  SPACE BACKGROUND — stars, particles, animated lights
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
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000)
    camera.position.z = 600

    // ── Lighting rig
    scene.add(new THREE.AmbientLight(0x1a1a2a, 0.5))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(200, 200, 400)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xccccee, 0.6)
    fillLight.position.set(-200, 100, 300)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.3)
    rimLight.position.set(0, -150, -200)
    scene.add(rimLight)

    // Animated red point light (Sith glow)
    const redLight = new THREE.PointLight(0xdc2626, 3, 800)
    redLight.position.set(0, 0, 200)
    scene.add(redLight)

    // Animated blue point light (hologram effect)
    const blueLight = new THREE.PointLight(0x3b82f6, 2, 600)
    blueLight.position.set(300, 0, 100)
    scene.add(blueLight)

    // ── Star field
    const starGeo = new THREE.BufferGeometry()
    const starCount = 3000
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 2000
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 2000
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 1000
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.8, transparent: true, opacity: 0.7, sizeAttenuation: true,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Red accent particles
    const redGeo = new THREE.BufferGeometry()
    const redCount = 150
    const redPos = new Float32Array(redCount * 3)
    for (let i = 0; i < redCount; i++) {
      redPos[i * 3] = (Math.random() - 0.5) * 1200
      redPos[i * 3 + 1] = (Math.random() - 0.5) * 1200
      redPos[i * 3 + 2] = (Math.random() - 0.5) * 600
    }
    redGeo.setAttribute('position', new THREE.BufferAttribute(redPos, 3))
    const redMat = new THREE.PointsMaterial({
      color: 0xff1a1a, size: 1.5, transparent: true, opacity: 0.3, sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })
    const redParticles = new THREE.Points(redGeo, redMat)
    scene.add(redParticles)

    // Blue accent particles
    const blueGeo = new THREE.BufferGeometry()
    const blueCount = 80
    const bluePos = new Float32Array(blueCount * 3)
    for (let i = 0; i < blueCount; i++) {
      bluePos[i * 3] = (Math.random() - 0.5) * 1000
      bluePos[i * 3 + 1] = (Math.random() - 0.5) * 1000
      bluePos[i * 3 + 2] = (Math.random() - 0.5) * 500
    }
    blueGeo.setAttribute('position', new THREE.BufferAttribute(bluePos, 3))
    const blueMat = new THREE.PointsMaterial({
      color: 0x3b82f6, size: 1.2, transparent: true, opacity: 0.2, sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })
    const blueParticles = new THREE.Points(blueGeo, blueMat)
    scene.add(blueParticles)

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
      stars.rotation.y = t * 0.012
      stars.rotation.x = t * 0.006

      // Particles
      redParticles.rotation.y = -t * 0.018
      redParticles.rotation.x = t * 0.008
      blueParticles.rotation.y = t * 0.015
      blueParticles.rotation.x = -t * 0.005

      // Animate scene lights
      redLight.position.x = Math.sin(t * 0.8) * 300
      redLight.position.y = Math.cos(t * 0.8) * 200
      redLight.intensity = Math.sin(t * 1.5) * 1 + 3

      blueLight.position.x = Math.cos(t * 0.6) * 400
      blueLight.position.y = Math.sin(t * 0.6) * 250

      // Camera parallax
      camera.position.x += (mouseX * 40 - camera.position.x) * 0.02
      camera.position.y += (-mouseY * 40 - camera.position.y + scrollY * 0.05) * 0.02
      camera.lookAt(0, 0, 0)

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
