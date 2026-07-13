<script setup>
import { ref, onMounted, onUnmounted, watch, computed, defineAsyncComponent } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const CircularText = defineAsyncComponent(() => import('./CircularText.vue'))

const isDesktop = ref(window.innerWidth >= 1024)
let resizeHandler = null

const themeStore = useThemeStore()
const containerRef = ref(null)
const canvasRef = ref(null)
const imageRef = ref(null)
const portraitRef = ref(null)

const computedRadius = ref(150)
const computedFontSize = computed(() => {
  const size = Math.max(8, Math.min(14, computedRadius.value * 0.05))
  return `${size}px`
})

let ctx = null
let animationFrameId = null
let isVisible = true
let observer = null
let handleMouseMove = null

// Mouse and Parallax state
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
const parallax = { imgX: 0, imgY: 0, canvasX: 0, canvasY: 0 }

// HUD and Particle simulation state
const particles = []
const maxParticles = 60
const hudAngle = ref(0)
const scanPulse = ref(0)
const readouts = ref([
  { label: 'SYS_LOC', val: '41.8781° N' },
  { label: 'ARCH_VER', val: 'V4.2.0' },
  { label: 'CORE_STAT', val: 'NOMINAL' },
  { label: 'AI_LINK', val: 'ESTABLISHED' }
])



const resizeCanvas = () => {
  if (!canvasRef.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  
  // Match High-DPI screens
  const dpr = window.devicePixelRatio || 1
  canvasRef.value.width = rect.width * dpr
  canvasRef.value.height = rect.height * dpr
  canvasRef.value.style.width = `${rect.width}px`
  canvasRef.value.style.height = `${rect.height}px`
  
  if (ctx) {
    ctx.scale(dpr, dpr)
  }
  
  if (portraitRef.value) {
    const pRect = portraitRef.value.getBoundingClientRect()
    computedRadius.value = pRect.width * 0.52
  }
}

// Particle class
class Particle {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.reset()
  }

  reset() {
    this.x = (Math.random() - 0.5) * (this.w * 0.6) + this.w / 2
    this.y = this.h * 0.8 + Math.random() * (this.h * 0.15)
    this.vx = (Math.random() - 0.5) * 0.8
    this.vy = -(0.5 + Math.random() * 1.5)
    this.size = 1.5 + Math.random() * 3
    this.maxLife = 100 + Math.random() * 100
    this.life = this.maxLife
    
    // Theme-specific colors
    if (themeStore.currentStyle === 'street') {
      this.color = Math.random() > 0.5 ? 'rgba(0, 255, 255, ' : 'rgba(255, 0, 255, '
    } else if (themeStore.currentStyle === 'brutal') {
      this.color = 'rgba(168, 85, 247, '
    } else {
      this.color = 'rgba(168, 85, 247, '
    }
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life--
    
    // Reset if dead or out of bounds
    if (this.life <= 0 || this.y < this.h * 0.1) {
      this.reset()
    }
  }

  draw(c) {
    const alpha = (this.life / this.maxLife) * 0.5
    c.fillStyle = `${this.color}${alpha})`
    
    if (themeStore.currentStyle === 'brutal') {
      // Chunky square particles
      c.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size * 1.5, this.size * 1.5)
    } else {
      // Floating circles
      c.beginPath()
      c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      c.fill()
    }
  }
}

const drawHUD = (c, w, h) => {
  const cx = w / 2
  const cy = h / 2
  const maxRadius = Math.min(w, h) * 0.45
  
  hudAngle.value += 0.003
  scanPulse.value = (scanPulse.value + 0.005) % 1
  
  const activeColor = themeStore.currentStyle === 'street' ? '#00ffff' : '#a855f7'
  const accentColor = themeStore.currentStyle === 'street' ? '#ff00ff' : '#7e22ce'
  const isBrutal = themeStore.currentStyle === 'brutal'

  c.strokeStyle = activeColor
  c.fillStyle = activeColor
  
  // 1. Blueprint Grid Background (Minimal/Glass and Brutal only)
  if (themeStore.currentStyle !== 'street') {
    c.strokeStyle = 'rgba(168, 85, 247, 0.04)'
    c.lineWidth = 1
    const gridSize = 40
    for (let x = 0; x < w; x += gridSize) {
      c.beginPath()
      c.moveTo(x, 0)
      c.lineTo(x, h)
      c.stroke()
    }
    for (let y = 0; y < h; y += gridSize) {
      c.beginPath()
      c.moveTo(0, y)
      c.lineTo(w, y)
      c.stroke()
    }
  }

  // Offset slightly based on mouse
  c.save()
  c.translate(parallax.canvasX, parallax.canvasY)

  // 2. Concentric Target HUD Rings
  c.lineWidth = isBrutal ? 2.5 : 1
  
  // Outer Ring
  c.beginPath()
  c.strokeStyle = `${activeColor}22` // low opacity
  c.arc(cx, cy, maxRadius, 0, Math.PI * 2)
  c.stroke()
  
  // Animated Sector Ring
  c.beginPath()
  c.strokeStyle = activeColor
  c.arc(cx, cy, maxRadius * 0.88, hudAngle.value, hudAngle.value + Math.PI * 0.4)
  c.stroke()
  
  c.beginPath()
  c.strokeStyle = accentColor
  c.arc(cx, cy, maxRadius * 0.88, hudAngle.value + Math.PI, hudAngle.value + Math.PI * 1.3)
  c.stroke()

  // 3. Telemetry corner brackets
  const bracketSize = 15
  const pad = maxRadius * 0.7
  
  c.strokeStyle = activeColor
  c.lineWidth = isBrutal ? 3 : 1.5
  
  // Top Left Bracket
  c.beginPath()
  c.moveTo(cx - pad, cy - pad + bracketSize)
  c.lineTo(cx - pad, cy - pad)
  c.lineTo(cx - pad + bracketSize, cy - pad)
  c.stroke()
  
  // Top Right Bracket
  c.beginPath()
  c.moveTo(cx + pad, cy - pad + bracketSize)
  c.lineTo(cx + pad, cy - pad)
  c.lineTo(cx + pad - bracketSize, cy - pad)
  c.stroke()

  // Bottom Left Bracket
  c.beginPath()
  c.moveTo(cx - pad, cy + pad - bracketSize)
  c.lineTo(cx - pad, cy + pad)
  c.lineTo(cx - pad + bracketSize, cy + pad)
  c.stroke()

  // Bottom Right Bracket
  c.beginPath()
  c.moveTo(cx + pad, cy + pad - bracketSize)
  c.lineTo(cx + pad, cy + pad)
  c.lineTo(cx + pad - bracketSize, cy + pad)
  c.stroke()

  // 4. Cursor Tracking Reticle
  const reticleX = cx + mouse.x * (w * 0.2)
  const reticleY = cy + mouse.y * (h * 0.2)
  
  c.strokeStyle = `${accentColor}aa`
  c.lineWidth = 1
  c.beginPath()
  c.arc(reticleX, reticleY, 20, 0, Math.PI * 2)
  c.stroke()
  
  // Reticle crosshairs
  c.beginPath()
  c.moveTo(reticleX - 28, reticleY)
  c.lineTo(reticleX - 12, reticleY)
  c.moveTo(reticleX + 12, reticleY)
  c.lineTo(reticleX + 28, reticleY)
  c.moveTo(reticleX, reticleY - 28)
  c.lineTo(reticleX, reticleY - 12)
  c.moveTo(reticleX, reticleY + 12)
  c.lineTo(reticleX, reticleY + 28)
  c.stroke()
  
  // 5. Data Feeds Readouts (Text Indicators)
  c.fillStyle = `${activeColor}bb`
  c.font = '7px "JetBrains Mono", monospace'
  c.textAlign = 'left'
  
  readouts.value.forEach((item, index) => {
    const rx = cx - pad + 8
    const ry = cy - pad + 25 + index * 12
    c.fillText(`// ${item.label}: [${item.val}]`, rx, ry)
  })

  // Dynamic coordinates under target
  c.font = '8px "JetBrains Mono", monospace'
  c.fillStyle = accentColor
  c.fillText(`TARGET_LOCK: ${reticleX.toFixed(0)}, ${reticleY.toFixed(0)}`, reticleX + 18, reticleY - 8)

  c.restore()
}

const loop = () => {
  animationFrameId = requestAnimationFrame(loop)
  if (!isDesktop.value) {
    if (ctx && canvasRef.value) {
      const w = canvasRef.value.width / (window.devicePixelRatio || 1)
      const h = canvasRef.value.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)
    }
    if (imageRef.value) {
      imageRef.value.style.transform = `translate3d(0, 0, 0) scale(1)`
    }
    return
  }
  if (!isVisible || !ctx || !canvasRef.value) return

  const w = canvasRef.value.width / (window.devicePixelRatio || 1)
  const h = canvasRef.value.height / (window.devicePixelRatio || 1)

  ctx.clearRect(0, 0, w, h)

  // Smooth mouse coordinates interpolation
  mouse.x += (mouse.targetX - mouse.x) * 0.08
  mouse.y += (mouse.targetY - mouse.y) * 0.08

  // Calculate parallax displacements (Canvas moves with cursor, Image moves opposite)
  parallax.canvasX = mouse.x * 12
  parallax.canvasY = mouse.y * 12
  parallax.imgX = -mouse.x * 16
  parallax.imgY = -mouse.y * 16

  // Apply parallax styles to image ref
  if (imageRef.value) {
    imageRef.value.style.transform = `translate3d(${parallax.imgX}px, ${parallax.imgY}px, 0) scale(1.04)`
  }

  // Initialize particles once canvas bounds are established
  if (particles.length === 0 && w > 0) {
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle(w, h))
    }
  }

  // Update & Draw Particles
  particles.forEach(p => {
    p.update()
    p.draw(ctx)
  })

  // Draw HUD Graphics
  drawHUD(ctx, w, h)
}
onMounted(() => {
  ctx = canvasRef.value.getContext('2d')
  
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  handleMouseMove = (e) => {
    if (!isDesktop.value) return
    mouse.targetX = (e.clientX / window.innerWidth) - 0.5
    mouse.targetY = (e.clientY / window.innerHeight) - 0.5
  }
  window.addEventListener('mousemove', handleMouseMove)

  resizeHandler = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  window.addEventListener('resize', resizeHandler)

  // Intersection Observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting
    })
  }, { threshold: 0.1 })
  
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }

  loop()
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resizeCanvas)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
  if (observer) {
    observer.disconnect()
  }
})

watch(() => themeStore.currentStyle, () => {
  // Reset particle style colors on theme toggles
  particles.forEach(p => p.reset())
})
</script>

<template>
  <div 
    ref="containerRef" 
    class="relative w-full aspect-[1/1.1] md:aspect-[1/1.1] flex items-center justify-center overflow-visible"
  >
    <!-- Background Animating Canvas -->
    <canvas 
      ref="canvasRef" 
      class="absolute inset-0 pointer-events-none select-none z-0 overflow-visible"
    ></canvas>

    <!-- Portrait Container (Float above canvas, offset opposite of mouse) -->
    <div 
      ref="portraitRef"
      class="relative w-full max-w-[240px] md:max-w-[380px] lg:max-w-[410px] xl:max-w-[465px] aspect-[1/1.1] z-10 overflow-visible flex items-end justify-center transition-all duration-700"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'border-4 border-on-surface' : 
        themeStore.currentStyle === 'street' ? 'street-card !rounded-[2rem] md:!rounded-[4rem]' : 
        'rounded-t-full border border-primary/20 backdrop-blur-[2px]'
      ]"
      :style="{ 
        backgroundColor: themeStore.currentStyle === 'minimal' ? 'rgba(168, 85, 247, 0.08)' : 
                         themeStore.currentStyle === 'street' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
        borderRadius: themeStore.currentStyle === 'minimal' ? '100% 100% 2.5rem 2.5rem' : '',
        borderBottom: themeStore.currentStyle === 'minimal' ? '4px solid var(--color-primary)' : ''
      }"
    >
      <!-- Hollow ring track behind the circular text -->
      <div 
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full pointer-events-none transition-all duration-700"
        :style="{ 
          width: `calc(${computedRadius * 2}px + ${computedFontSize} + 8px)`, 
          height: `calc(${computedRadius * 2}px + ${computedFontSize} + 8px)`,
          border: `calc(${computedFontSize} + 8px) solid #ffffff`
        }"
      ></div>

      <!-- Spin text that circles around the portrait image -->
      <CircularText
        text="BUG SLAYER CERTIFIED * 100% CHAD VERIFIED * ELITE CODE ARCHITECT * "
        textColor="#000000"
        :spinDuration="25"
        :onHover="isDesktop ? 'speedUp' : undefined"
        :radius="computedRadius"
        :fontSize="computedFontSize"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
      />

      <!-- User Portrait Image with dynamic parallax offset applied inline -->
      <img 
        ref="imageRef"
        src="/1.webp" 
        alt="Muhammad Maroof" 
        class="w-full h-auto object-cover transition-transform duration-300 ease-out z-10 drop-shadow-[0_15px_40px_rgba(0,0,0,0.35)] select-none pointer-events-none"
      />
      
      <!-- Ambient Blueprint Label Overlay -->
      <div 
        v-if="themeStore.currentStyle !== 'brutal'" 
        class="absolute bottom-4 left-4 z-20 font-label text-[7px] md:text-[8px] uppercase tracking-[0.3em] opacity-40 select-none text-on-surface"
      >
        LIV_PORTRAIT_STREAM
      </div>
    </div>
  </div>
</template>

<style scoped>
canvas {
  filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.15));
}
</style>
