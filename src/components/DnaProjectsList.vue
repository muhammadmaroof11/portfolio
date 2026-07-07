<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const projects = ref(portfolioData.projects)

const containerRef = ref(null)
const canvasRef = ref(null)

let ctx = null
let animationId = null
let scrollY = 0

// DNA Properties
const radius = 35 // helix radius
const frequency = 0.015 // vertical wave frequency
const rungProbability = 0.25 // frequency of drawing rungs

const drawDna = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  const width = canvas.width
  const height = canvas.height
  const centerX = width / 2
  
  // Use scroll position and time for rotation speed
  const time = Date.now() * 0.001
  const rotation = time * 0.8 + scrollY * 0.003
  
  const points1 = []
  const points2 = []
  
  // Draw binary nodes along two strands
  for (let y = 0; y < height; y += 16) {
    const angle = y * frequency + rotation
    
    // Strand 1
    const x1 = Math.cos(angle) * radius
    const z1 = Math.sin(angle) * radius
    
    // Strand 2
    const x2 = Math.cos(angle + Math.PI) * radius
    const z2 = Math.sin(angle + Math.PI) * radius
    
    points1.push({ x: centerX + x1, y, z: z1 })
    points2.push({ x: centerX + x2, y, z: z2 })
  }
  
  // Draw connecting horizontal rungs
  ctx.lineWidth = 1
  for (let i = 0; i < points1.length; i++) {
    if (i % 3 === 0) {
      const p1 = points1[i]
      const p2 = points2[i]
      
      const avgZ = (p1.z + p2.z) / 2
      const opacity = ((avgZ + radius) / (2 * radius)) * 0.35 + 0.05
      
      // Cyber green/cyan theme color based on active theme
      const colorVal = themeStore.currentStyle === 'street' ? '0, 255, 255' : '34, 197, 94'
      ctx.strokeStyle = `rgba(${colorVal}, ${opacity})`
      
      ctx.setLineDash([2, 4])
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
  
  // Sort and project the binary character points for 3D depth illusion
  const allPoints = []
  points1.forEach((p, idx) => allPoints.push({ ...p, index: idx }))
  points2.forEach((p, idx) => allPoints.push({ ...p, index: idx + 0.5 }))
  
  allPoints.sort((a, b) => a.z - b.z)
  
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  allPoints.forEach(p => {
    const scale = ((p.z + radius) / (2 * radius)) * 0.5 + 0.6 // 0.6 to 1.1
    const opacity = ((p.z + radius) / (2 * radius)) * 0.75 + 0.25 // 0.25 to 1.0
    
    ctx.font = `bold ${Math.round(11 * scale)}px Courier New, monospace`
    
    const isCyan = themeStore.currentStyle === 'street' && p.index % 2 === 0
    const colorStr = isCyan ? '0, 255, 255' : 
                     themeStore.currentStyle === 'street' ? '255, 0, 255' : '34, 197, 94'
                     
    ctx.fillStyle = `rgba(${colorStr}, ${opacity})`
    
    if (p.z > radius * 0.5) {
      ctx.shadowColor = `rgb(${colorStr})`
      ctx.shadowBlur = 4
    } else {
      ctx.shadowBlur = 0
    }
    
    const char = Math.floor(p.index) % 2 === 0 ? '0' : '1'
    ctx.fillText(char, p.x, p.y)
  })
  
  ctx.shadowBlur = 0
  animationId = requestAnimationFrame(drawDna)
}

const resizeCanvas = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight
}

onMounted(async () => {
  await nextTick()
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  
  // Track scroll position for rotation sync
  const onScroll = () => {
    scrollY = window.scrollY
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  
  drawDna()
  
  // Staggered scroll animation for project rows
  gsap.fromTo('.dna-project-row', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none none'
      }
    }
  )
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <div ref="containerRef" class="relative w-full overflow-visible py-16 md:py-24">
    
    <!-- Title Area -->
    <div class="max-w-3xl mb-16 md:mb-24">
      <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">Genetic Blueprints</span>
      <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.9] text-on-surface">
        DNA SYSTEM OF <br/><span class="text-primary italic">DEPLOYMENTS.</span>
      </h2>
    </div>

    <!-- Layout Wrapper containing sticky timeline track and alternating cards -->
    <div class="relative w-full overflow-visible">
      
      <!-- Central Sticky DNA Helix Canvas Track -->
      <div class="absolute inset-y-0 left-0 lg:left-1/2 lg:-translate-x-1/2 w-[70px] lg:w-[100px] pointer-events-none z-10">
        <div class="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <canvas ref="canvasRef" class="w-full h-full opacity-80"></canvas>
        </div>
      </div>

      <!-- Projects Alternating List -->
      <div class="relative w-full space-y-24 md:space-y-36 lg:space-y-48">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id"
          class="dna-project-row flex flex-col lg:flex-row items-center w-full relative"
          :class="[
            index % 2 === 0 ? 'lg:flex-row-reverse' : ''
          ]"
        >
          <!-- Project Card Element -->
          <div 
            class="w-full lg:w-[calc(50%-60px)] z-20"
            :class="[
              index % 2 === 0 ? 'lg:mr-auto pl-0 lg:pl-6' : 'lg:ml-auto pr-0 lg:pr-6',
              'pl-16 lg:pl-0' // Indent on mobile to make room for canvas on left
            ]"
          >
            <div 
              class="group relative transition-all duration-500 overflow-hidden flex flex-col items-stretch p-5 md:p-7"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.8)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface' :
                themeStore.currentStyle === 'street' ? 'street-card border-2 border-black bg-surface-container-low/90' :
                'border border-primary/5 bg-surface-container-low/40 backdrop-blur-md hover:bg-surface-container-low/60 shadow-xl'
              ]"
            >
              <!-- Index Number Badge -->
              <span class="absolute top-4 right-4 font-headline font-black text-3xl md:text-4xl text-primary/10 select-none">
                0{{ index + 1 }}
              </span>

              <!-- Tight Fit Adaptive Picture Container -->
              <div 
                class="relative overflow-hidden flex items-center justify-center bg-black/5 dark:bg-black/40 border border-primary/5 cursor-pointer"
                :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.5)' }"
              >
                <!-- Blur fill layer -->
                <img 
                  :src="project.image" 
                  alt="" 
                  class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none" 
                />
                
                <!-- Main Image - naturally sized to fit tightly -->
                <img 
                  :src="project.image" 
                  :alt="project.title" 
                  class="relative z-10 max-h-[250px] md:max-h-[350px] w-auto h-auto object-contain rounded-lg p-2 transition-transform duration-500 group-hover:scale-[1.02]" 
                />
              </div>

              <!-- Content details -->
              <div class="mt-6">
                <!-- Tech stacks -->
                <div class="flex flex-wrap gap-1.5 mb-4">
                  <span 
                    v-for="tag in project.tech" 
                    :key="tag"
                    class="text-[7px] md:text-[8px] font-black px-2 py-1 bg-primary/5 dark:bg-primary/10 text-primary border border-primary/10 uppercase tracking-widest rounded"
                    :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Title -->
                <h3 class="text-2xl md:text-3xl font-headline font-black uppercase tracking-tight text-on-surface mb-3">
                  {{ project.title }}
                </h3>

                <!-- Description -->
                <p class="text-on-surface-variant text-xs md:text-sm leading-relaxed font-body font-medium mb-6 opacity-90">
                  {{ project.description }}
                </p>

                <!-- Action links -->
                <div class="flex items-center justify-between mt-auto">
                  <span class="font-mono text-[10px] font-bold text-on-surface/40 uppercase">
                    YEAR :: {{ project.year || '2026' }}
                  </span>
                  
                  <a 
                    v-if="project.link && project.link !== '#'" 
                    :href="project.link" 
                    target="_blank"
                    class="inline-flex items-center gap-2 px-5 py-3 bg-primary text-on-primary font-black text-[8px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.03] active-spring shadow-md shadow-primary/10"
                    :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) / 4)' }"
                    :class="{ 'brutal-btn border-2 border-on-surface': themeStore.currentStyle === 'brutal' }"
                    v-ripple
                  >
                    EXPLORE
                    <ArrowRight class="w-3.5 h-3.5 -rotate-45" />
                  </a>
                  <div 
                    v-else-if="project.hoverText"
                    class="px-4 py-2.5 bg-surface-container-high border border-surface-container-high text-on-surface/50 font-black text-[8px] tracking-[0.2em] uppercase rounded-md"
                  >
                    {{ project.hoverText }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty placeholder opposite spacer on desktop (split structure) -->
          <div class="hidden lg:block lg:w-[calc(50%-60px)]"></div>
          
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Canvas responsive height alignment */
canvas {
  max-height: 100vh;
}
</style>
