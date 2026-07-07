<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Cpu, Shield, ChevronRight, Zap } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const projects = ref(portfolioData.projects)

const containerRef = ref(null)
const pinnedRef = ref(null)
const canvasRef = ref(null)

const scrollProgress = ref(0)
let ctx = null
let animationId = null

// Cinematic Camera & Parallax properties
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0

// DNA Geometry
let currentRadius = 240 // Colossal radius for 70vw center presentation
const frequency = 0.0055 // Smooth wave frequency
let baseFontSize = 28

// Background particles
const bgParticles = []

// Telemetry state values
const activeTitle = ref('')
const scramblerInterval = ref(null)
const activeSubtitle = ref('')
const telemetryCoordX = ref('45.291')
const telemetryCoordY = ref('09.433')
const telemetrySignal = ref(98.5)

// Scramble text function to simulate cinematic decryption
const scrambleActiveTitle = (targetText) => {
  if (scramblerInterval.value) clearInterval(scramblerInterval.value)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
  let iterations = 0
  const maxIterations = 10
  
  scramblerInterval.value = setInterval(() => {
    activeTitle.value = targetText.split('').map((char, index) => {
      if (char === ' ') return ' '
      if (index < iterations) return targetText[index]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join('')
    
    if (iterations >= targetText.length) {
      activeTitle.value = targetText
      clearInterval(scramblerInterval.value)
    }
    iterations += Math.ceil(targetText.length / maxIterations)
  }, 35)
}

// Compute active index
const activeIndex = computed(() => {
  const index = Math.floor(scrollProgress.value * projects.value.length)
  return Math.min(index, projects.value.length - 1)
})

// Update scrambler when activeIndex changes
watch(activeIndex, (newVal) => {
  const currentProj = projects.value[newVal]
  if (currentProj) {
    scrambleActiveTitle(currentProj.title)
    activeSubtitle.value = currentProj.tech.join(' // ')
    
    // Animate telemetry values
    telemetryCoordX.value = (Math.random() * 90 + 10).toFixed(3)
    telemetryCoordY.value = (Math.random() * 90 + 10).toFixed(3)
    telemetrySignal.value = parseFloat((95 + Math.random() * 4.9).toFixed(1))
  }
}, { immediate: true })

// Initialize floating particles
const initParticles = (width, height) => {
  bgParticles.length = 0
  const count = window.innerWidth < 1024 ? 15 : 40
  for (let i = 0; i < count; i++) {
    bgParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.2 + Math.random() * 0.8,
      char: Math.random() > 0.5 ? '0' : '1',
      size: 9 + Math.random() * 6,
      opacity: 0.02 + Math.random() * 0.1
    })
  }
}

// 3D Canvas Loop
const drawDna = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  
  // Interpolate mouse movement for smooth parallax
  mouseX += (targetMouseX - mouseX) * 0.05
  mouseY += (targetMouseY - mouseY) * 0.05
  
  const rotation = scrollProgress.value * Math.PI * 6
  
  // Calculate neuron message pulse position along the vertical height
  const pulseY = scrollProgress.value * height
  
  // Render floating cyber dust in background
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  bgParticles.forEach(p => {
    p.y -= p.speed
    if (p.y < 0) {
      p.y = height
      p.x = Math.random() * width
    }
    ctx.font = `${Math.round(p.size)}px monospace`
    const isStreet = themeStore.currentStyle === 'street'
    ctx.fillStyle = isStreet ? `rgba(0, 255, 255, ${p.opacity})` : `rgba(34, 300, 94, ${p.opacity})`
    ctx.fillText(p.char, p.x, p.y)
  })
  
  const points1 = []
  const points2 = []
  
  // 3D Wide-angle Camera / Perspective math
  const distance = 250 
  const fov = 170 
  
  const yStep = window.innerWidth < 1024 ? 22 : 14
  for (let y = 0; y < height; y += yStep) {
    const angle = y * frequency + rotation
    
    // Strand 1 (3D space coords)
    const x1 = Math.cos(angle) * currentRadius
    const z1 = Math.sin(angle) * currentRadius
    
    // Strand 2 (3D space coords)
    const x2 = Math.cos(angle + Math.PI) * currentRadius
    const z2 = Math.sin(angle + Math.PI) * currentRadius
    
    // Apply camera projection formulas
    const scale1 = fov / (fov + z1)
    const scale2 = fov / (fov + z2)
    
    points1.push({
      x: centerX + x1 * scale1 + mouseX,
      y: y + mouseY * (scale1 - 0.5),
      z: z1,
      scale: scale1
    })
    
    points2.push({
      x: centerX + x2 * scale2 + mouseX,
      y: y + mouseY * (scale2 - 0.5),
      z: z2,
      scale: scale2
    })
  }
  
  // Draw rungs with custom glowing neon lines
  ctx.lineWidth = window.innerWidth < 1024 ? 1 : 2
  for (let i = 0; i < points1.length; i++) {
    if (i % 2 === 0) {
      const p1 = points1[i]
      const p2 = points2[i]
      
      const avgZ = (p1.z + p2.z) / 2
      const distToPulse = Math.abs(p1.y - pulseY)
      const isPulseActive = distToPulse < 120
      const pulseGlow = isPulseActive ? Math.cos((distToPulse / 120) * Math.PI / 2) : 0
      
      const opacity = ((avgZ + currentRadius) / (2 * currentRadius)) * 0.35 + 0.05 + pulseGlow * 0.4
      
      // Cyber colors: pulse is white/cyan
      let colorVal = themeStore.currentStyle === 'street' ? '0, 255, 255' : '34, 197, 94'
      if (isPulseActive) {
        colorVal = themeStore.currentStyle === 'street' ? '255, 255, 255' : '230, 255, 240'
      }
      ctx.strokeStyle = `rgba(${colorVal}, ${opacity})`
      ctx.lineWidth = window.innerWidth < 1024 ? (1 + pulseGlow * 1.5) : (2 + pulseGlow * 2.5)
      
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
    }
  }
  
  // Collect all points, sort by depth (Z-index back to front sorting)
  const allPoints = []
  points1.forEach((p, idx) => allPoints.push({ ...p, index: idx, isStrand1: true }))
  points2.forEach((p, idx) => allPoints.push({ ...p, index: idx + 0.5, isStrand1: false }))
  
  allPoints.sort((a, b) => a.z - b.z)
  
  allPoints.forEach(p => {
    const distToPulse = Math.abs(p.y - pulseY)
    const isPulseActive = distToPulse < 120
    const pulseGlow = isPulseActive ? Math.cos((distToPulse / 120) * Math.PI / 2) : 0
    
    const opacity = ((p.z + currentRadius) / (2 * currentRadius)) * 0.7 + 0.3 + pulseGlow * 0.2
    // Scale up binary digits at the pulse coordinate to show neuron message traveling
    const fontSize = baseFontSize * p.scale * (1 + pulseGlow * 0.3)
    
    ctx.font = `bold ${Math.round(fontSize)}px Courier New, monospace`
    
    let colorStr = ''
    if (isPulseActive) {
      // Blinding white/cyan or white/green pulse node
      colorStr = themeStore.currentStyle === 'street' ? '255, 255, 255' : '255, 255, 255'
    } else {
      const isCyan = themeStore.currentStyle === 'street' && p.index % 2 === 0
      colorStr = isCyan ? '0, 255, 255' : 
                 themeStore.currentStyle === 'street' ? '255, 0, 255' : '34, 197, 94'
    }
                     
    ctx.fillStyle = `rgba(${colorStr}, ${opacity})`
    
    // Add real shadow glow
    if (isPulseActive || p.z > currentRadius * 0.3) {
      ctx.shadowColor = `rgb(${colorStr})`
      ctx.shadowBlur = (window.innerWidth < 1024 ? 6 : 14) + pulseGlow * 15
    } else {
      ctx.shadowBlur = 0
    }
    
    const char = Math.floor(p.index) % 2 === 0 ? '0' : '1'
    ctx.fillText(char, p.x, p.y)
  })
  
  ctx.shadowBlur = 0
  
  // DRAW HOLOGRAM LASER LINK (Desktop only, connects active DNA strand coordinate to project card)
  if (window.innerWidth >= 1024 && scrollProgress.value > 0.01 && scrollProgress.value < 0.99) {
    const angle = pulseY * frequency + rotation
    const activeScale = fov / (fov + Math.sin(angle) * currentRadius)
    // Projected X coordinate of active strand point
    const activeNodeX = centerX + Math.cos(angle) * currentRadius * activeScale
    
    const colorStr = themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e'
    ctx.strokeStyle = colorStr
    ctx.lineWidth = 1.5
    ctx.shadowColor = colorStr
    ctx.shadowBlur = 10
    ctx.setLineDash([4, 4])
    
    ctx.beginPath()
    ctx.moveTo(activeNodeX + mouseX, pulseY)
    
    // Pointing to left border center of project card (Desktop card floats on right column)
    const cardLeftX = width - (window.innerWidth < 1280 ? 440 : 490)
    ctx.lineTo(cardLeftX, height / 2)
    ctx.stroke()
    ctx.setLineDash([])
    
    // Draw glowing node bead at connection point
    ctx.beginPath()
    ctx.arc(activeNodeX + mouseX, pulseY, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.shadowBlur = 0
  }
  
  animationId = requestAnimationFrame(drawDna)
}

const updateDimensions = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight
  
  // Set helix scaling - Colossal widths!
  if (window.innerWidth < 768) {
    currentRadius = 55
    baseFontSize = 13
  } else if (window.innerWidth < 1024) {
    currentRadius = 90
    baseFontSize = 17
  } else {
    currentRadius = Math.min(canvas.width * 0.28, 250) // Colossal 28% of canvas width!
    baseFontSize = 28 
  }
  
  initParticles(canvas.width, canvas.height)
}

let scrollTriggerInstance = null

const handleMouseMove = (e) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * -70
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * -70
}

const scrollToProject = (index) => {
  if (!scrollTriggerInstance) return
  const start = scrollTriggerInstance.start
  const end = scrollTriggerInstance.end
  const step = (end - start) / projects.value.length
  const target = start + index * step + step * 0.5
  window.scrollTo({
    top: target,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  await nextTick()
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  window.addEventListener('mousemove', handleMouseMove)
  
  // Lock container during scrolling sequences (GSAP Pinned ScrollTrigger)
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top top',
    end: `+=${projects.value.length * 150}%`, // Story mode scrolling pacing
    pin: pinnedRef.value,
    scrub: true,
    onUpdate: (self) => {
      scrollProgress.value = self.progress
    }
  })
  
  drawDna()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
  window.removeEventListener('mousemove', handleMouseMove)
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  cancelAnimationFrame(animationId)
  if (scramblerInterval.value) clearInterval(scramblerInterval.value)
})
</script>

<template>
  <div ref="containerRef" class="relative w-full overflow-visible">
    <!-- Pinned viewport container -->
    <div ref="pinnedRef" class="h-screen w-full relative flex items-center justify-center overflow-hidden" :style="{ background: 'var(--color-background)' }">
      
      <!-- Gradient masks for seamless section blend -->
      <div class="absolute top-0 left-0 right-0 h-40 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)` }">
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to top, var(--color-background) 0%, transparent 100%)` }">
      </div>

      <!-- Cyberpunk Grid Backplate -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10"></div>
      <div 
        class="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        :style="{
          backgroundImage: `linear-gradient(to right, ${themeStore.currentStyle === 'street' ? '#ff00ff' : '#22c55e'} 1px, transparent 1px), linear-gradient(to bottom, ${themeStore.currentStyle === 'street' ? '#ff00ff' : '#22c55e'} 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }"
      ></div>

      <!-- CINEMATIC HUD BAR (Top Horizontal Deck Specs) -->
      <div class="absolute top-8 left-12 right-12 z-40 hidden lg:flex items-center justify-between text-[9px] font-mono text-on-surface/40 pointer-events-none uppercase tracking-[0.2em] border-b border-on-surface/5 pb-4">
        <div class="flex items-center gap-6">
          <span class="text-primary font-black">// GENETIC SEQUENCE_ENGINE_ v8.71</span>
          <span>LAT: {{ telemetryCoordX }}°</span>
          <span>LNG: {{ telemetryCoordY }}°</span>
        </div>
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1.5"><Shield class="w-3.5 h-3.5 text-primary shrink-0" /> LINK: {{ telemetrySignal }}% SECURE</span>
          <span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
        </div>
      </div>

      <!-- LEFT SIDEBAR TRACKER (Desktop HUD specs) - Floats cleanly on left -->
      <div class="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col justify-center items-start gap-4 z-40 max-w-[240px] pointer-events-none bg-surface-container-lowest/10 backdrop-blur-md p-4 rounded-xl border border-primary/5 shadow-lg">
        <div>
          <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] block mb-2">SYSTEM DECK STATUS</span>
          <h3 class="font-headline text-2xl font-black text-on-surface uppercase leading-[0.9]">
            GENETIC<br/><span class="text-primary italic">REGISTRY.</span>
          </h3>
        </div>
        
        <p class="text-on-surface-variant text-[11px] font-body font-semibold opacity-60 leading-relaxed">
          DNA strand rotation linked directly to scroll scrub telemetry. Nodes represent repository deployment records.
        </p>

        <!-- Interactive progression navigation elements -->
        <div class="flex flex-col gap-2 mt-2 pointer-events-auto w-full">
          <button 
            v-for="(p, index) in projects" 
            :key="'hud-i-' + p.id"
            class="flex items-center gap-3.5 group cursor-pointer border-none bg-transparent p-0 text-left outline-none w-full"
            @click="scrollToProject(index)"
          >
            <div 
              class="h-[3px] transition-all duration-500 rounded-full"
              :class="[
                index === activeIndex ? 'w-10 bg-primary shadow-sm shadow-primary' : 'w-2 bg-on-surface/20 group-hover:bg-primary/50'
              ]"
            ></div>
            <span 
              class="text-[9px] font-mono font-black uppercase tracking-[0.2em] transition-colors duration-500 flex items-center gap-1"
              :class="[
                index === activeIndex ? 'text-primary' : 'text-on-surface/40 group-hover:text-on-surface/70'
              ]"
            >
              0{{ index + 1 }}. {{ p.title }}
              <ChevronRight v-if="index === activeIndex" class="w-3 h-3 text-primary animate-pulse" />
            </span>
          </button>
        </div>
      </div>

      <!-- Centered 3D DNA Canvas Viewport (Takes up massive space in the center, 70vw equivalent) -->
      <div class="absolute inset-y-0 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[70vw] lg:max-w-[1200px] pointer-events-none z-20">
        <canvas ref="canvasRef" class="w-full h-full opacity-70 dark:opacity-85"></canvas>
      </div>

      <!-- Mobile/Tablet Top Info Deck -->
      <div class="absolute top-6 left-6 right-6 z-40 flex lg:hidden justify-between items-center pointer-events-none">
        <div>
          <span class="text-primary font-black tracking-[0.3em] uppercase text-[8px] block">
            GENETIC SEQUENCER
          </span>
          <h3 class="font-headline text-lg font-black text-on-surface uppercase mt-1">
            PROJECT DECK [0{{ activeIndex + 1 }}/0{{ projects.length }}]
          </h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] font-mono text-on-surface/30 uppercase tracking-widest">{{ telemetryCoordX }} // {{ telemetryCoordY }}</span>
          <Cpu class="w-5 h-5 text-primary animate-pulse shrink-0" />
        </div>
      </div>

      <!-- Project Cards Stack - Positioned on far right column for desktop, bottom for mobile -->
      <div class="absolute inset-0 z-30 flex items-end lg:items-center justify-center lg:justify-end pointer-events-none px-6 pb-10 md:pb-14 lg:pb-0 lg:pr-8 xl:pr-12">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id"
          class="absolute w-full max-w-[500px] lg:max-w-[400px] xl:max-w-[440px] transition-all duration-750 ease-out flex flex-col pointer-events-none"
          :class="[
            index === activeIndex 
              ? 'opacity-100 scale-100 translate-y-0 blur-0 pointer-events-auto z-40' 
              : index < activeIndex 
                ? 'opacity-0 scale-95 -translate-y-36 blur-[10px] pointer-events-none z-10' 
                : 'opacity-0 scale-95 translate-y-36 blur-[10px] pointer-events-none z-10'
          ]"
        >
          <!-- Cinematic HUD styled Card Box -->
          <div 
            class="group relative flex flex-col items-stretch p-5 md:p-6 xl:p-7 overflow-hidden bg-surface-container-low/10 backdrop-blur-md"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 1.2)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]' :
              themeStore.currentStyle === 'street' ? 'street-card border-2 border-black bg-surface-container-low/95' :
              'border border-primary/10 bg-surface-container-low/85 backdrop-blur-3xl shadow-2xl'
            ]"
          >
            <!-- High-tech HUD Corner Brackets -->
            <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute inset-0 pointer-events-none">
              <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/25 group-hover:border-primary/60 transition-colors duration-500"></div>
              <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/25 group-hover:border-primary/60 transition-colors duration-500"></div>
              <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/25 group-hover:border-primary/60 transition-colors duration-500"></div>
              <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/25 group-hover:border-primary/60 transition-colors duration-500"></div>
            </div>

            <!-- Decorative Scanning Beam Effect -->
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none translate-y-[-100%] group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>

            <!-- Floating sequence indicator -->
            <span class="absolute top-4 right-6 font-mono font-black text-4xl md:text-5xl text-primary/10 select-none">
              0{{ index + 1 }}
            </span>

            <!-- Image preview box -->
            <div 
              class="relative overflow-hidden flex items-center justify-center bg-black/15 dark:bg-black/50 border border-primary/5 cursor-pointer max-h-[140px] md:max-h-[190px]"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.7)' }"
            >
              <img 
                :src="project.image" 
                alt="" 
                class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none" 
              />
              
              <img 
                :src="project.image" 
                :alt="project.title" 
                class="relative z-10 max-h-[120px] md:max-h-[170px] w-auto h-auto object-contain rounded-lg p-2 transition-transform duration-700 group-hover:scale-[1.03]" 
              />
            </div>

            <!-- Content spec sheet -->
            <div class="mt-5">
              <!-- HUD System Headers -->
              <div class="flex items-center justify-between text-[7px] md:text-[8px] font-mono text-on-surface/30 mb-2">
                <span>[DECK_REF: #0{{ index + 1 }}/PORTFOLIO_NODE]</span>
                <span>STATUS: OPERATIONAL</span>
              </div>

              <!-- Cinematic Scrambled Title -->
              <h3 class="text-xl md:text-2xl font-headline font-black uppercase tracking-tight text-on-surface mb-2 leading-none">
                <span v-if="index === activeIndex">{{ activeTitle }}</span>
                <span v-else>{{ project.title }}</span>
              </h3>

              <!-- Tech tags -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span 
                  v-for="tag in project.tech" 
                  :key="tag"
                  class="text-[7px] md:text-[8px] font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/10 uppercase tracking-widest rounded"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-on-surface-variant text-xs leading-relaxed font-body font-medium mb-4 opacity-90 max-w-sm">
                {{ project.description }}
              </p>

              <!-- Footer with explore actions -->
              <div class="flex items-center justify-between mt-auto border-t border-on-surface/5 pt-3.5">
                <div class="flex flex-col">
                  <span class="font-mono text-[8px] font-bold text-on-surface/30 uppercase tracking-wider">
                    COMPILED YEAR
                  </span>
                  <span class="font-headline font-black text-xs text-primary tracking-widest">
                    {{ project.year || '2026' }}
                  </span>
                </div>
                
                <a 
                  v-if="project.link && project.link !== '#'" 
                  :href="project.link" 
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-primary text-on-primary font-black text-[8px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03] active-spring shadow-md shadow-primary/10 pointer-events-auto"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) / 4)' }"
                  :class="{ 'brutal-btn border-2 border-on-surface': themeStore.currentStyle === 'brutal' }"
                  v-ripple
                >
                  LOAD PROTOCOL
                  <ArrowRight class="w-3.5 h-3.5 -rotate-45" />
                </a>
                <div 
                  v-else-if="project.hoverText"
                  class="px-3.5 py-2.5 bg-surface-container-high border border-surface-container-high text-on-surface/40 font-black text-[8px] tracking-[0.2em] uppercase rounded-md"
                >
                  {{ project.hoverText }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* HUD scanning animations */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(280px);
  }
  100% {
    transform: translateY(-100%);
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.duration-750 {
  duration: 750ms;
}
</style>
