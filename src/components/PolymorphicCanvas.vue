<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useThemeStore } from '../stores/themeStore'

const themeStore = useThemeStore()
const canvasContainer = ref(null)

let scene, camera, renderer, animationFrameId
let isVisible = true
let observer

// Theme Groups
let minimalGroup, streetGroup, brutalGroup
let minimalNodes = []
let minimalLinesGeometry = null
let minimalPointsGeometry = null
let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

// Material references for opacity transition
let materialsToUpdate = []

const initThree = () => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  // Scene setup
  scene = new THREE.Scene()

  // Camera setup
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
  camera.position.z = 15

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // Light sources
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight(0xa855f7, 2, 50)
  pointLight1.position.set(5, 5, 5)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x00ffff, 2, 50)
  pointLight2.position.set(-5, -5, 5)
  scene.add(pointLight2)

  // Initialize theme-specific groups
  minimalGroup = createMinimalScene()
  streetGroup = createStreetScene()
  brutalGroup = createBrutalScene()

  scene.add(minimalGroup)
  scene.add(streetGroup)
  scene.add(brutalGroup)

  // Set initial visibilities based on currentStyle
  transitionTheme(themeStore.currentStyle, true)

  // Listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)

  // Intersection Observer to pause when not in viewport
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting
    })
  }, { threshold: 0.1 })
  
  observer.observe(canvasContainer.value)

  // Start loop
  animate()
}

const createMinimalScene = () => {
  const group = new THREE.Group()

  // 1. Add floating translucent architectural developer polyhedra
  const shapeCount = 8
  const geometries = [
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.OctahedronGeometry(0.9, 0),
    new THREE.TetrahedronGeometry(1.0, 0)
  ]
  
  for (let i = 0; i < shapeCount; i++) {
    const geo = geometries[i % geometries.length]
    
    // Face material: very low opacity glass
    const faceMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.06,
      transmission: 0.3,
      thickness: 0.5,
      side: THREE.DoubleSide
    })
    
    // Edge material: clean developer wireframe
    const edgeGeo = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.25,
      linewidth: 1
    })
    
    const mesh = new THREE.Mesh(geo, faceMat)
    const wireframe = new THREE.LineSegments(edgeGeo, edgeMat)
    mesh.add(wireframe)
    
    // Random placement
    mesh.position.set(
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 6
    )
    
    // Custom speeds
    mesh.userData = {
      speedX: (Math.random() - 0.5) * 0.005,
      speedY: (Math.random() - 0.5) * 0.005,
      speedZ: (Math.random() - 0.5) * 0.005,
      initialPos: mesh.position.clone()
    }
    
    group.add(mesh)
    materialsToUpdate.push({ mat: faceMat, targetOpacity: 0.06 })
    materialsToUpdate.push({ mat: edgeMat, targetOpacity: 0.25 })
  }

  // 2. Holographic Dynamic Constellation Node Network
  const nodeCount = 65
  minimalNodes = []
  
  for (let i = 0; i < nodeCount; i++) {
    minimalNodes.push({
      x: (Math.random() - 0.5) * 44,
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 0.012,
      vy: (Math.random() - 0.5) * 0.012,
      vz: (Math.random() - 0.5) * 0.012
    })
  }

  // Points representation
  minimalPointsGeometry = new THREE.BufferGeometry()
  const pointPositions = new Float32Array(nodeCount * 3)
  for (let i = 0; i < nodeCount; i++) {
    pointPositions[i * 3] = minimalNodes[i].x
    pointPositions[i * 3 + 1] = minimalNodes[i].y
    pointPositions[i * 3 + 2] = minimalNodes[i].z
  }
  minimalPointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3))
  
  const pointsMat = new THREE.PointsMaterial({
    color: 0xa855f7,
    size: 0.22,
    transparent: true,
    opacity: 0.5
  })
  
  const points = new THREE.Points(minimalPointsGeometry, pointsMat)
  group.add(points)
  materialsToUpdate.push({ mat: pointsMat, targetOpacity: 0.5 })

  // Lines representation (dynamic connection network)
  // Max connections is nodeCount * (nodeCount - 1) / 2
  // We allocate max 500 line segments (1000 vertices)
  minimalLinesGeometry = new THREE.BufferGeometry()
  const linePositions = new Float32Array(1000 * 3) // x,y,z for 1000 vertices
  minimalLinesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
  
  const linesMat = new THREE.LineBasicMaterial({
    color: 0x7e22ce,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending
  })
  
  const lines = new THREE.LineSegments(minimalLinesGeometry, linesMat)
  group.add(lines)
  materialsToUpdate.push({ mat: linesMat, targetOpacity: 0.18 })

  // 3. Grid Helper floor at the bottom to give space depth
  const gridHelper = new THREE.GridHelper(40, 24, 0x1c1b1f, 0x1c1b1f)
  gridHelper.position.y = -7
  gridHelper.rotation.x = Math.PI / 12
  const gridMat = gridHelper.material
  gridMat.transparent = true
  gridMat.opacity = 0.08
  group.add(gridHelper)
  materialsToUpdate.push({ mat: gridMat, targetOpacity: 0.08 })

  return group
}

const createStreetScene = () => {
  const group = new THREE.Group()

  // Dynamic neon particles
  const count = 450
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  const neonColors = [
    new THREE.Color(0xff00ff), // Magenta
    new THREE.Color(0x00ffff), // Cyan
    new THREE.Color(0xffff00)  // Yellow
  ]

  for (let i = 0; i < count; i++) {
    // Positioning in spiral or flow pattern
    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 18
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12

    const color = neonColors[Math.floor(Math.random() * neonColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending
  })

  const particleSystem = new THREE.Points(geometry, material)
  group.add(particleSystem)
  materialsToUpdate.push({ mat: material, targetOpacity: 0.75 })

  return group
}

const createBrutalScene = () => {
  const group = new THREE.Group()

  // Chunk grid of wireframe cubes
  const cubeCount = 5
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  
  for (let i = 0; i < cubeCount; i++) {
    const wireframeGeo = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0,
      linewidth: 2
    })
    
    const line = new THREE.LineSegments(wireframeGeo, material)
    
    // Spread in coordinate space
    line.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 4
    )
    
    line.userData = {
      rotX: (Math.random() - 0.5) * 0.015,
      rotY: (Math.random() - 0.5) * 0.015
    }
    
    group.add(line)
    materialsToUpdate.push({ mat: material, targetOpacity: 0.4 })
  }

  // Giant background grid helper to represent architectural floor
  const gridHelper = new THREE.GridHelper(30, 20, 0x1c1b1f, 0x1c1b1f)
  gridHelper.position.y = -6
  gridHelper.rotation.x = Math.PI / 12
  
  // Custom wrapper to set wireframe colors and transitions
  const gridMat = gridHelper.material
  gridMat.transparent = true
  gridMat.opacity = 0
  group.add(gridHelper)
  materialsToUpdate.push({ mat: gridMat, targetOpacity: 0.08 })

  return group
}

const transitionTheme = (newStyle, immediate = false) => {
  if (!minimalGroup || !streetGroup || !brutalGroup) return

  const duration = immediate ? 0 : 0.05
  
  // Set target opacities inside materials list
  materialsToUpdate.forEach(item => {
    // Match which group this material belongs to
    let belongsTo = 'minimal'
    if (minimalGroup.uuid) {
      if (minimalGroup.getObjectByProperty('uuid', item.mat.uuid) || minimalGroup.children.some(c => c.material === item.mat || (c.children && c.children.some(cc => cc.material === item.mat)))) belongsTo = 'minimal'
      else if (streetGroup.getObjectByProperty('uuid', item.mat.uuid) || streetGroup.children.some(c => c.material === item.mat)) belongsTo = 'street'
      else belongsTo = 'brutal'
    }
    
    if (belongsTo === newStyle) {
      item.currentOpacity = item.targetOpacity
    } else {
      item.currentOpacity = 0
    }
  })

  // Animate the parent group visibilities/scales
  const animateScale = (grp, targetScale, targetVis) => {
    if (immediate) {
      grp.scale.set(targetScale, targetScale, targetScale)
      grp.visible = targetVis
    } else {
      const currentScale = grp.scale.x
      const step = (targetScale - currentScale) * 0.1
      if (Math.abs(step) > 0.001) {
        const val = currentScale + step
        grp.scale.set(val, val, val)
      }
      grp.visible = targetVis
    }
  }

  minimalGroup.visible = newStyle === 'minimal' || newStyle === 'glass'
  streetGroup.visible = newStyle === 'street'
  brutalGroup.visible = newStyle === 'brutal'

  // Update light colors to match theme profile
  if (scene) {
    scene.children.forEach(child => {
      if (child.isPointLight) {
        if (newStyle === 'street') {
          child.color.setHex(0xff00ff) // Vibrant neon magenta
        } else if (newStyle === 'brutal') {
          child.color.setHex(0x000000) // Brutal black/white shadow cast
        } else {
          child.color.setHex(0xa855f7) // Purple minimal glow
        }
      }
    })
  }
}

const handleResize = () => {
  if (!canvasContainer.value || !renderer || !camera) return
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const handleMouseMove = (e) => {
  mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 4
  mouse.targetY = (e.clientY / window.innerHeight - 0.5) * -4
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  if (!isVisible || !renderer || !scene) return

  // Smooth mouse inertia
  mouse.x += (mouse.targetX - mouse.x) * 0.05
  mouse.y += (mouse.targetY - mouse.y) * 0.05

  // Apply subtle camera tilt
  camera.position.x = mouse.x * 0.5
  camera.position.y = mouse.y * 0.5
  camera.lookAt(0, 0, 0)

  // Update material opacities for fades
  materialsToUpdate.forEach(item => {
    if (item.mat) {
      const current = item.mat.opacity
      const target = item.currentOpacity || 0
      item.mat.opacity = current + (target - current) * 0.08
    }
  })

  // Theme Animation loops
  const style = themeStore.currentStyle

  if ((style === 'minimal' || style === 'glass') && minimalGroup) {
    // 1. Float and rotate the floating polyhedra meshes
    minimalGroup.children.forEach(child => {
      if (child.isMesh && child.userData.initialPos) {
        const time = Date.now() * 0.0005
        child.position.x = child.userData.initialPos.x + Math.sin(time + child.userData.speedX * 100) * 0.8
        child.position.y = child.userData.initialPos.y + Math.cos(time + child.userData.speedY * 100) * 0.8
        child.rotation.x += 0.002
        child.rotation.y += 0.003
      }
    })

    // 2. Drift nodes and bounce off boundary limits
    const boundaryX = 22, boundaryY = 8, boundaryZ = 4
    const nodeCount = minimalNodes.length
    
    for (let i = 0; i < nodeCount; i++) {
      const n = minimalNodes[i]
      n.x += n.vx
      n.y += n.vy
      n.z += n.vz
      
      // Bounce checks
      if (Math.abs(n.x) > boundaryX) n.vx *= -1
      if (Math.abs(n.y) > boundaryY) n.vy *= -1
      if (Math.abs(n.z) > boundaryZ) n.vz *= -1
    }

    // Update point positions attribute
    if (minimalPointsGeometry) {
      const posAttr = minimalPointsGeometry.attributes.position
      for (let i = 0; i < nodeCount; i++) {
        posAttr.setXYZ(i, minimalNodes[i].x, minimalNodes[i].y, minimalNodes[i].z)
      }
      posAttr.needsUpdate = true
    }

    // 3. Update connected lines
    if (minimalLinesGeometry) {
      const linePosAttr = minimalLinesGeometry.attributes.position
      let vertexIndex = 0
      const maxVertices = 1000
      const threshold = 3.8
      
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          if (vertexIndex >= maxVertices) break
          
          const n1 = minimalNodes[i]
          const n2 = minimalNodes[j]
          
          const dx = n1.x - n2.x
          const dy = n1.y - n2.y
          const dz = n1.z - n2.z
          const distSq = dx * dx + dy * dy + dz * dz
          
          if (distSq < threshold * threshold) {
            linePosAttr.setXYZ(vertexIndex, n1.x, n1.y, n1.z)
            linePosAttr.setXYZ(vertexIndex + 1, n2.x, n2.y, n2.z)
            vertexIndex += 2
          }
        }
      }
      
      // Clear remaining vertices
      for (let k = vertexIndex; k < maxVertices; k++) {
        linePosAttr.setXYZ(k, 0, 0, 0)
      }
      
      linePosAttr.needsUpdate = true
    }

    minimalGroup.rotation.y += 0.0006
  }

  if (style === 'street' && streetGroup) {
    // Spin and distort street particles
    streetGroup.rotation.y += 0.002
    streetGroup.rotation.z += 0.001
    
    // Wave ripple on vertices
    const points = streetGroup.children[0]
    if (points && points.geometry) {
      const posAttr = points.geometry.attributes.position
      const time = Date.now() * 0.001
      
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i)
        const y = posAttr.getY(i)
        // Apply sine wave displacement
        posAttr.setZ(i, Math.sin(x * 0.5 + time) * Math.cos(y * 0.5 + time) * 0.8)
      }
      posAttr.needsUpdate = true
    }
  }

  if (style === 'brutal' && brutalGroup) {
    // Heavy mechanical rotations
    brutalGroup.children.forEach(child => {
      if (child.isLineSegments) {
        child.rotation.x += child.userData.rotX
        child.rotation.y += child.userData.rotY
      }
    })
    brutalGroup.rotation.y += 0.0015
  }

  renderer.render(scene, camera)
}

watch(() => themeStore.currentStyle, (newStyle) => {
  transitionTheme(newStyle)
})

onMounted(() => {
  initThree()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleMouseMove)
  if (observer) {
    observer.disconnect()
  }
  if (renderer) {
    if (renderer.domElement) {
      renderer.dispose()
    }
    renderer = null
  }
  if (canvasContainer.value) {
    canvasContainer.value.innerHTML = ''
  }
})
</script>

<template>
  <div ref="canvasContainer" class="absolute left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none select-none z-0 overflow-hidden">
    <!-- ThreeJS canvas renders inside here -->
  </div>
</template>

<style scoped>
div {
  mix-blend-mode: normal;
}
</style>
