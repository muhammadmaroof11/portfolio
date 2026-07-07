<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Cpu, Sparkles } from 'lucide-vue-next'
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
let scrollY = 0

// DNA Properties
let currentRadius = 140 // Helix radius (adaptive)
const frequency = 0.008 // Wave frequency
let baseFontSize = 18 // Base font size for 3D binary symbols

// Compute current active index based on scrollProgress
const activeIndex = computed(() => {
  const index = Math.floor(scrollProgress.value * projects.value.length)
  return Math.min(index, projects.value.length - 1)
})

// Draw loop for Canvas DNA Helix
const drawDna = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  
  const time = Date.now() * 0.001
  // Spin speed reacts directly to scroll position + slow base rotation
  const rotation = scrollProgress.value * Math.PI * 6 + time * 0.5
  
  const points1 = []
  const points2 = []
  
  // Dense double helix calculation
  const yStep = window.innerWidth < 1024 ? 20 : 16
  for (let y = 0; y < height; y += yStep) {
    const angle = y * frequency + rotation
    
    // Strand 1
    const x1 = Math.cos(angle) * currentRadius
    const z1 = Math.sin(angle) * currentRadius
    
    // Strand 2
    const x2 = Math.cos(angle + Math.PI) * currentRadius
    const z2 = Math.sin(angle + Math.PI) * currentRadius
    
    points1.push({ x: centerX + x1, y, z: z1 })
    points2.push({ x: centerX + x2, y, z: z2 })
  }
  
  // Draw glowing cyan/green horizontal connector rungs
  ctx.lineWidth = window.innerWidth < 1024 ? 1.5 : 2.5
  for (let i = 0; i < points1.length; i++) {
    if (i % 2 === 0) {
      const p1 = points1[i]
      const p2 = points2[i]
      
      const avgZ = (p1.z + p2.z) / 2
      const opacity = ((avgZ + currentRadius) / (2 * currentRadius)) * 0.45 + 0.1
      
      const colorVal = themeStore.currentStyle === 'street' ? '0, 255, 255' : '34, 197, 94'
      ctx.strokeStyle = `rgba(${colorVal}, ${opacity})`
      
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
  
  // Combine strands and sort depth (Z-index sorting from back to front)
  const allPoints = []
  points1.forEach((p, idx) => allPoints.push({ ...p, index: idx }))
  points2.forEach((p, idx) => allPoints.push({ ...p, index: idx + 0.5 }))
  
  allPoints.sort((a, b) => a.z - b.z)
  
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  allPoints.forEach(p => {
    // Math logic for 3D projection sizing/opacity
    const scale = ((p.z + currentRadius) / (2 * currentRadius)) * 0.6 + 0.5 // 0.5 to 1.1
    const opacity = ((p.z + currentRadius) / (2 * currentRadius)) * 0.8 + 0.2 // 0.2 to 1.0
    
    ctx.font = `bold ${Math.round(baseFontSize * scale)}px Courier New, monospace`
    
    const isCyan = themeStore.currentStyle === 'street' && p.index % 2 === 0
    const colorStr = isCyan ? '0, 255, 255' : 
                     themeStore.currentStyle === 'street' ? '255, 0, 255' : '34, 197, 94'
                     
    ctx.fillStyle = `rgba(${colorStr}, ${opacity})`
    
    if (p.z > currentRadius * 0.4) {
      ctx.shadowColor = `rgb(${colorStr})`
      ctx.shadowBlur = window.innerWidth < 1024 ? 4 : 8
    } else {
      ctx.shadowBlur = 0
    }
    
    const char = Math.floor(p.index) % 2 === 0 ? '0' : '1'
    ctx.fillText(char, p.x, p.y)
  })
  
  ctx.shadowBlur = 0
  animationId = requestAnimationFrame(drawDna)
}

const updateDimensions = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight
  
  // Make the DNA helix thicker and bigger based on window width
  if (window.innerWidth < 768) {
    currentRadius = 45
    baseFontSize = 13
  } else if (window.innerWidth < 1024) {
    currentRadius = 75
    baseFontSize = 16
  } else {
    currentRadius = 160 // Thicker and way bigger helix!
    baseFontSize = 26 // Substantially larger binary characters!
  }
}

let scrollTriggerInstance = null

onMounted(async () => {
  await nextTick()
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  
  // GSAP ScrollTrigger to lock/pin the screen during DNA exploration
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: containerRef.value,
    start: 'top top',
    end: `+=${projects.value.length * 120}%`, // Scroll length determines scrub feel
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
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div ref="containerRef" class="relative w-full overflow-visible">
    <!-- Pinned screen-locked viewport container -->
    <div ref="pinnedRef" class="h-screen w-full relative flex items-center justify-center overflow-hidden" :style="{ background: 'var(--color-background)' }">
      
      <!-- Top blend gradient overlay -->
      <div class="absolute top-0 left-0 right-0 h-32 md:h-48 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)` }">
      </div>
      
      <!-- Bottom blend gradient overlay -->
      <div class="absolute bottom-0 left-0 right-0 h-32 md:h-48 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to top, var(--color-background) 0%, transparent 100%)` }">
      </div>

      <!-- Faint Cyberpunk Grid Overlay in Background -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-10"></div>
      
      <!-- Binary/Digital grid back-glow -->
      <div 
        class="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        :style="{
          backgroundImage: `linear-gradient(to right, ${themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e'} 1px, transparent 1px), linear-gradient(to bottom, ${themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e'} 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }"
      ></div>

      <!-- Left-pinned Info Tracker (Desktop only) -->
      <div class="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col justify-center items-start gap-4 z-40 max-w-[280px] pointer-events-none">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[10px]">
          DNA SYSTEM ENGINE
        </span>
        <h3 class="font-headline text-3xl font-black text-on-surface uppercase leading-none">
          REGISTRY <br/>
          <span class="text-primary italic">DECK.</span>
        </h3>
        <p class="text-on-surface-variant text-[11px] font-body font-semibold opacity-70 leading-relaxed">
          Scrolling rotates the core genetic binary strand. Projects materialize sequentially according to sequence indices.
        </p>
        
        <!-- Live DNA Track Progress Indicators -->
        <div class="flex flex-col gap-2 mt-4 pointer-events-auto">
          <div 
            v-for="(p, index) in projects" 
            :key="'indicator-' + p.id"
            class="flex items-center gap-3 group cursor-pointer"
            @click="gsap.to(window, { duration: 0.8, scrollTo: scrollTriggerInstance.start + (index * (scrollTriggerInstance.end - scrollTriggerInstance.start) / projects.length) })"
          >
            <div 
              class="h-1.5 transition-all duration-300 rounded-full"
              :class="[
                index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-on-surface/20 group-hover:bg-primary/50'
              ]"
            ></div>
            <span 
              class="text-[9px] font-black uppercase tracking-widest transition-colors duration-300"
              :class="[
                index === activeIndex ? 'text-primary' : 'text-on-surface/40 group-hover:text-on-surface/70'
              ]"
            >
              {{ p.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Giant Rotating DNA Canvas (Centered behind project cards) -->
      <div class="absolute inset-y-0 left-0 right-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[500px] pointer-events-none z-20">
        <canvas ref="canvasRef" class="w-full h-full opacity-65 dark:opacity-85"></canvas>
      </div>

      <!-- Mobile/Tablet top title info -->
      <div class="absolute top-8 left-8 right-8 z-40 flex lg:hidden justify-between items-center pointer-events-none">
        <div>
          <span class="text-primary font-black tracking-[0.3em] uppercase text-[8px] block">
            GENETIC SEQUENCER
          </span>
          <h3 class="font-headline text-lg font-black text-on-surface uppercase mt-1">
            PROJECT DECK [0{{ activeIndex + 1 }}/0{{ projects.length }}]
          </h3>
        </div>
        <Cpu class="w-5 h-5 text-primary animate-pulse shrink-0" />
      </div>

      <!-- Project Cards stack - absolute placement, transitions active states -->
      <div class="absolute inset-0 z-30 flex items-center justify-center pointer-events-none px-6 md:px-12">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id"
          class="absolute w-full max-w-[500px] lg:max-w-[420px] transition-all duration-750 ease-out flex flex-col pointer-events-none"
          :class="[
            index === activeIndex 
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto z-40' 
              : index < activeIndex 
                ? 'opacity-0 scale-90 -translate-y-24 pointer-events-none z-10' 
                : 'opacity-0 scale-90 translate-y-24 pointer-events-none z-10',
            // Alternates card placement left vs right on desktop
            index % 2 === 0 ? 'lg:translate-x-[-240px] xl:translate-x-[-320px]' : 'lg:translate-x-[240px] xl:translate-x-[320px]'
          ]"
        >
          <!-- The visual card container -->
          <div 
            class="group relative flex flex-col items-stretch p-6 md:p-8"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 1)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface' :
              themeStore.currentStyle === 'street' ? 'street-card border-2 border-black bg-surface-container-low/95 backdrop-blur-xl' :
              'border border-primary/10 bg-surface-container-low/80 backdrop-blur-2xl shadow-2xl'
            ]"
          >
            <!-- Large floating Index Number -->
            <span class="absolute top-4 right-6 font-headline font-black text-4xl md:text-5xl text-primary/10 select-none">
              0{{ index + 1 }}
            </span>

            <!-- Picture container (Padded, contained fit to avoid letterboxing) -->
            <div 
              class="relative overflow-hidden flex items-center justify-center bg-black/10 dark:bg-black/50 border border-primary/5 cursor-pointer max-h-[160px] md:max-h-[220px]"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.6)' }"
            >
              <!-- Blur fill background -->
              <img 
                :src="project.image" 
                alt="" 
                class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none" 
              />
              
              <!-- Content fitted image -->
              <img 
                :src="project.image" 
                :alt="project.title" 
                class="relative z-10 max-h-[140px] md:max-h-[200px] w-auto h-auto object-contain rounded-lg p-2 transition-transform duration-500 group-hover:scale-[1.03]" 
              />
            </div>

            <!-- Content Area -->
            <div class="mt-6">
              <!-- Tech tags -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <span 
                  v-for="tag in project.tech" 
                  :key="tag"
                  class="text-[7px] md:text-[8px] font-black px-2 py-0.5 bg-primary/10 text-primary border border-primary/10 uppercase tracking-widest rounded"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Title -->
              <h3 class="text-xl md:text-2xl font-headline font-black uppercase tracking-tight text-on-surface mb-2.5">
                {{ project.title }}
              </h3>

              <!-- Description -->
              <p class="text-on-surface-variant text-xs leading-relaxed font-body font-medium mb-5 opacity-90 max-w-sm">
                {{ project.description }}
              </p>

              <!-- Footer values and button -->
              <div class="flex items-center justify-between mt-auto">
                <span class="font-mono text-[9px] font-bold text-on-surface/40 uppercase">
                  SEQUENCE :: {{ project.year || '2026' }}
                </span>
                
                <a 
                  v-if="project.link && project.link !== '#'" 
                  :href="project.link" 
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-on-primary font-black text-[8px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03] active-spring shadow-md shadow-primary/10"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) / 4)' }"
                  :class="{ 'brutal-btn border-2 border-on-surface': themeStore.currentStyle === 'brutal' }"
                  v-ripple
                >
                  EXPLORE
                  <ArrowRight class="w-3 h-3 -rotate-45" />
                </a>
                <div 
                  v-else-if="project.hoverText"
                  class="px-3 py-2 bg-surface-container-high border border-surface-container-high text-on-surface/50 font-black text-[8px] tracking-[0.2em] uppercase rounded-md"
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
/* Ensure smooth transitions inside Vue views */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.duration-750 {
  duration: 750ms;
}
</style>
