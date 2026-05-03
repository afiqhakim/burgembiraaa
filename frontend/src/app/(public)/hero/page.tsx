'use client'
import { useEffect, useRef } from 'react'
import styles from './hero.module.css'

// Nav removed — friend's nav handles this globally via layout.tsx
export default function HeroPage() {
  return (
    <main className={styles.main}>

      {/* Background SVG contour lines — Lando Norris style organic shapes */}
      <svg className={styles.bgSvg} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="rgba(10,8,6,0.055)" strokeWidth="1">
          <ellipse cx="720" cy="450" rx="310" ry="245"/>
          <ellipse cx="720" cy="450" rx="430" ry="345"/>
          <ellipse cx="720" cy="450" rx="552" ry="448"/>
          <ellipse cx="720" cy="450" rx="674" ry="551"/>
          <ellipse cx="190" cy="635" rx="188" ry="148" transform="rotate(-18,190,635)"/>
          <ellipse cx="190" cy="635" rx="258" ry="202" transform="rotate(-18,190,635)"/>
          <ellipse cx="190" cy="635" rx="328" ry="256" transform="rotate(-18,190,635)"/>
          <ellipse cx="1290" cy="255" rx="168" ry="128" transform="rotate(22,1290,255)"/>
          <ellipse cx="1290" cy="255" rx="238" ry="182" transform="rotate(22,1290,255)"/>
          <ellipse cx="1290" cy="255" rx="308" ry="236" transform="rotate(22,1290,255)"/>
          <ellipse cx="295" cy="578" rx="138" ry="106" transform="rotate(-10,295,578)" fill="rgba(200,121,26,0.028)" stroke="none"/>
          <ellipse cx="1100" cy="200" rx="100" ry="80" transform="rotate(15,1100,200)" fill="rgba(200,121,26,0.018)" stroke="none"/>
        </g>
      </svg>

      <BurgerScene />

      {/* Ghost title — large faded text at bottom, only brand name on page */}
      <div className={styles.ghostTitle} aria-hidden="true">
        <span>BURGEMBIRAAA</span>
      </div>

      {/* Bottom-left: Next Event card (like Lando's Next Race) */}
      <div className={styles.infoCard}>
        <p className={styles.infoLabel}>Next Event</p>
        <div className={styles.infoBox}>
          <div className={styles.infoEvent}>
            St Nicholas
            <span>Food Market</span>
          </div>
          <div className={styles.infoMeta}>
            <div className={styles.infoIcon}>🍔</div>
            <div>
              <strong>Smile with every bite.</strong>
              <small>Est. Bristol 2025</small>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.cornerBr}>Bristol · UK · 2024</p>
      <p className={styles.hint} id="hero-hint">Hover the burger</p>
    </main>
  )
}

function BurgerScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    let animId: number
    let cleanup: (() => void) | undefined

    import('three').then((THREE) => {
      const canvas = canvasRef.current!

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      renderer.setSize(innerWidth, innerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.92

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.1, 100)
      camera.position.set(0, 0.5, 9.5)
      camera.lookAt(0, 0.2, 0)

      // DRAMATIC LIGHTING
      const keyLight = new THREE.DirectionalLight(0xfff8e8, 9.5)
      keyLight.position.set(6, 10, 5)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.set(2048, 2048)
      keyLight.shadow.radius = 4
      keyLight.shadow.bias = -0.001
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0xffd88a, 0.40)
      fillLight.position.set(-7, 1, 3)
      scene.add(fillLight)

      const rimLight = new THREE.DirectionalLight(0xffcc44, 3.8)
      rimLight.position.set(-4, 6, -7)
      scene.add(rimLight)

      const heatLight = new THREE.PointLight(0xC8791A, 5.5, 18)
      heatLight.position.set(0, -3.5, 5)
      scene.add(heatLight)

      scene.add(new THREE.AmbientLight(0xffeedd, 0.10))

      // MATERIALS
      const topBunMat = new THREE.MeshStandardMaterial({ color: 0xD9821E, roughness: 0.22, metalness: 0, emissive: new THREE.Color(0x1A0600), emissiveIntensity: 0.22 })
      const botBunMat = new THREE.MeshStandardMaterial({ color: 0xBF6C14, roughness: 0.30, metalness: 0, emissive: new THREE.Color(0x130400), emissiveIntensity: 0.16 })
      const pattyMat  = new THREE.MeshStandardMaterial({ color: 0x1A0802, roughness: 0.90, metalness: 0, emissive: new THREE.Color(0x060200), emissiveIntensity: 0.05 })
      const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xF5C014, roughness: 0.30, metalness: 0, emissive: new THREE.Color(0x201000), emissiveIntensity: 0.24 })
      const seedMat   = new THREE.MeshStandardMaterial({ color: 0xF0E0A8, roughness: 0.58, metalness: 0 })
      const faceMat   = new THREE.MeshStandardMaterial({ color: 0x0C0400, roughness: 0.72, metalness: 0 })
      const glowRingMat  = new THREE.MeshBasicMaterial({ color: 0xC8791A, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
      const outerGlowMat = new THREE.MeshBasicMaterial({ color: 0x7A3A08, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })

      // TOP BUN PROFILE
      // LatheGeometry: profile y=0 is flat base, y increases = dome goes UP ✓
      function topBunProfile(): THREE.Vector2[] {
        const pts: THREE.Vector2[] = []
        for (let i = 0; i <= 64; i++) {
          const t = i / 64
          const a = t * Math.PI * 0.5
          const r = Math.sin(a) * 1.62 * (1 + (1 - t) * 0.04)
          const y = (1 - Math.cos(a * 1.10)) * 0.75
          pts.push(new THREE.Vector2(Math.max(0, r), y))
        }
        return pts
      }

      // BOTTOM BUN PROFILE — thin flat half bun, will be flipped
      function botBunProfile(): THREE.Vector2[] {
        const pts: THREE.Vector2[] = []
        for (let i = 0; i <= 32; i++) {
          const t = i / 32
          const a = t * Math.PI * 0.5
          pts.push(new THREE.Vector2(Math.sin(a) * 1.62 * (1 - t * 0.02), Math.pow(t, 0.85) * 0.30))
        }
        return pts
      }

      // TOP BUN — no rotation, dome faces UP naturally ✓
      const topBunGeo = new THREE.LatheGeometry(topBunProfile(), 88)
      const topBun = new THREE.Mesh(topBunGeo, topBunMat)
      topBun.castShadow = true
      topBun.receiveShadow = true

      // Sesame seeds
      const seedDefs = [
        { x: -0.58, zA: 0.87 }, { x: 0.00, zA: 1.00 }, { x: 0.58, zA: 0.87 },
        { x: -0.30, zA: 0.95 }, { x: 0.30, zA: 0.95 },
      ]
      seedDefs.forEach(({ x, zA }) => {
        const geo = new THREE.SphereGeometry(0.065, 12, 12)
        geo.scale(1, 0.38, 1.95)
        const seed = new THREE.Mesh(geo, seedMat)
        const normX = Math.abs(x) / 1.62
        const dA = Math.asin(Math.min(normX, 0.999))
        const ySurf = (1 - Math.cos(dA * 1.10 * 2)) * 0.75 * 0.5 + 0.04
        const zSurf = Math.sqrt(Math.max(0, 1.62 * 1.62 - x * x)) * zA
        seed.position.set(x, ySurf, zSurf)
        seed.rotation.z = x * 0.10
        topBun.add(seed)
      })

      // Smiley — small eyes, subtle smile
      const eyeGeo = new THREE.SphereGeometry(0.082, 14, 14)
      const eyeL = new THREE.Mesh(eyeGeo, faceMat)
      eyeL.position.set(-0.34, 0.30, 1.56)
      eyeL.scale.set(1, 1.0, 0.40)
      topBun.add(eyeL)
      const eyeR = new THREE.Mesh(eyeGeo, faceMat)
      eyeR.position.set( 0.34, 0.30, 1.56)
      eyeR.scale.set(1, 1.0, 0.40)
      topBun.add(eyeR)

      // Small smile arc
      const smileCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-0.28, 0.15, 1.57),
        new THREE.Vector3( 0.00, 0.06, 1.60),
        new THREE.Vector3( 0.28, 0.15, 1.57)
      )
      smileCurve.getPoints(10).forEach((pt, i) => {
        if (i % 2 !== 0) return
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 10), faceMat)
        b.position.copy(pt)
        b.scale.set(1, 0.62, 0.36)
        topBun.add(b)
      })

      // BOTTOM BUN — rotation.x = Math.PI flips dome to face DOWN ✓
      // Flat face (y=0) now faces UP to receive the patty
      const botBunGeo = new THREE.LatheGeometry(botBunProfile(), 88)
      const botBun = new THREE.Mesh(botBunGeo, botBunMat)
      botBun.rotation.x = Math.PI
      botBun.castShadow = true
      botBun.receiveShadow = true

      // PATTY
      const patty = new THREE.Mesh(new THREE.CylinderGeometry(1.50, 1.53, 0.22, 64), pattyMat)
      patty.castShadow = true

      // CHEESE — 45° diamond like logo
      const cheese = new THREE.Mesh(new THREE.BoxGeometry(2.28, 0.09, 2.28), cheeseMat)
      cheese.rotation.y = Math.PI / 4
      cheese.castShadow = true

      // GLOW RINGS
      const glowRing = new THREE.Mesh(new THREE.RingGeometry(1.72, 2.10, 80), glowRingMat)
      glowRing.position.set(0, 0.40, -0.45)
      scene.add(glowRing)
      const outerGlowRing = new THREE.Mesh(new THREE.RingGeometry(2.18, 3.15, 80), outerGlowMat)
      outerGlowRing.position.set(0, 0.40, -0.68)
      scene.add(outerGlowRing)

      // STACK — bottom up: botBun → patty → cheese → topBun
      const BOT_Y = 0.0, PAT_Y = 0.40, CHE_Y = 0.55, TOP_Y = 0.68
      const TOP_OPEN = 3.2, BOT_OPEN = -1.9
      botBun.position.y = BOT_Y
      patty.position.y  = PAT_Y
      cheese.position.y = CHE_Y
      topBun.position.y = TOP_Y

      const burger = new THREE.Group()
      burger.add(botBun, patty, cheese, topBun)
      scene.add(burger)
      burger.scale.setScalar(1.08)

      // STEAM
      const SN = 50
      const sPos = new Float32Array(SN * 3)
      const sSp  = new Float32Array(SN)
      const sPh  = new Float32Array(SN)
      function rSteam(i: number) {
        const a = Math.random() * Math.PI * 2, r = Math.random() * 0.85
        sPos[i*3] = Math.cos(a)*r; sPos[i*3+1] = 0.7; sPos[i*3+2] = Math.sin(a)*r
        sSp[i] = 0.007 + Math.random() * 0.011; sPh[i] = Math.random() * Math.PI * 2
      }
      for (let i = 0; i < SN; i++) { rSteam(i); sPos[i*3+1] = (Math.random()-0.5)*2 }
      const stGeo = new THREE.BufferGeometry()
      stGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
      const stMat = new THREE.PointsMaterial({ color: 0x9B5218, size: 0.050, transparent: true, opacity: 0, sizeAttenuation: true, depthWrite: false })
      scene.add(new THREE.Points(stGeo, stMat))

      // INTERACTION
      const hintEl = document.getElementById('hero-hint')
      let mx = innerWidth/2, my = innerHeight/2
      let openAmt = 0, targetOpen = 0, hintFaded = false
      const raycaster = new THREE.Raycaster()
      const m2d = new THREE.Vector2()

      const onMouseMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY
        m2d.x = (mx/innerWidth)*2-1; m2d.y = -(my/innerHeight)*2+1
        raycaster.setFromCamera(m2d, camera)
        const hits = raycaster.intersectObjects([topBun, botBun, patty, cheese], true)
        if (hits.length > 0) {
          targetOpen = 1
          if (!hintFaded && hintEl) { hintFaded = true; hintEl.style.opacity = '0' }
        } else { targetOpen = 0 }
      }
      const onMouseLeave = () => { targetOpen = 0 }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseleave', onMouseLeave)

      const lerp = (a: number, b: number, t: number) => a + (b-a)*t
      const eOut = (t: number) => 1 - Math.pow(1-t, 3)

      // RENDER LOOP
      const clock = new THREE.Clock()
      const loop = () => {
        animId = requestAnimationFrame(loop)
        const t = clock.getElapsedTime()

        openAmt = lerp(openAmt, targetOpen, 0.062)
        const e = eOut(openAmt)

        topBun.position.y = lerp(TOP_Y, TOP_OPEN, e)
        botBun.position.y = lerp(BOT_Y, BOT_OPEN, e)
        patty.position.y  = lerp(PAT_Y, PAT_Y+0.45, e*0.28)
        cheese.position.y = lerp(CHE_Y, CHE_Y+0.20, e*0.18)

        burger.position.y = Math.sin(t*0.40)*0.055
        burger.rotation.y = Math.sin(t*0.18)*0.055
        burger.rotation.z = Math.sin(t*0.30)*0.008
        burger.rotation.x = lerp(0, 0.18, e)

        glowRingMat.opacity  = lerp(0, 0.52, e)
        outerGlowMat.opacity = lerp(0, 0.16, e)
        glowRing.rotation.z      += 0.0028
        outerGlowRing.rotation.z -= 0.0016

        stMat.opacity = lerp(0, 0.40, e)
        const sp = stGeo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < SN; i++) {
          sp.array[i*3+1] += sSp[i]*e
          sp.array[i*3]   += Math.sin(t*0.6+sPh[i])*0.0022
          if (sp.array[i*3+1] > 2.0) rSteam(i)
        }
        sp.needsUpdate = true

        heatLight.intensity = 5.5 + Math.sin(t*1.9)*0.75 + Math.sin(t*3.3)*0.28
        renderer.render(scene, camera)
      }
      loop()

      const onResize = () => {
        camera.aspect = innerWidth/innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(innerWidth, innerHeight)
      }
      window.addEventListener('resize', onResize)

      cleanup = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseleave', onMouseLeave)
        window.removeEventListener('resize', onResize)
        renderer.dispose()
      }
    })

    return () => { cleanup?.() }
  }, [])

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }} />
  )
}
