<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount, shallowRef } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { Mail, Github, Linkedin, MessageCircle, Instagram, Send, MapPin, Clock, ArrowUpRight, Globe, Phone } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FuzzyText from '../components/FuzzyText.vue'

// ScrollTrigger is registered globally in main.js

const themeStore = useThemeStore()
const { profile } = portfolioData
const viewRoot = ref(null)
const bgCanvas = ref(null)
let animationFrameId = null
let resize = null
let handleMouseMove = null
let handleMouseLeave = null

const form = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const submitted = ref(false)
const showError = ref(false)

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
    return
  }

  isSubmitting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  isSubmitting.value = false
  submitted.value = true
  
  // Show toast for 5 seconds
  setTimeout(() => {
    submitted.value = false
  }, 5000)

  form.value = { name: '', email: '', message: '' }
}

onMounted(async () => {
  await nextTick()
  
  const root = viewRoot.value
  if (!root) return

  // Set initial states — scoped to this view's root to avoid bleed onto other pages
  gsap.set(root.querySelectorAll('.gsap-reveal'), { autoAlpha: 0, y: 30 })
  gsap.set(root.querySelectorAll('.contact-header > *'), { autoAlpha: 0, y: 20 })
  gsap.set(root.querySelectorAll('.contact-card'), { autoAlpha: 0, x: -30 })
  gsap.set(root.querySelector('.contact-form'), { autoAlpha: 0, x: 30 })

  gsap.to(root.querySelectorAll('.gsap-reveal'), {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.gsap-reveal'), { clearProps: "all" })
    }
  })

  gsap.to(root.querySelectorAll('.contact-header > *'), {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.contact-header > *'), { clearProps: "all" })
    }
  })

  gsap.to(root.querySelectorAll('.contact-card'), {
    scrollTrigger: {
      trigger: root.querySelector('.contact-card'),
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.1,
    onComplete: () => {
      gsap.set(root.querySelectorAll('.contact-card'), { clearProps: "all" })
    }
  })

  gsap.to(root.querySelector('.contact-form'), {
    scrollTrigger: {
      trigger: root.querySelector('.contact-form'),
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 1,
    ease: 'expo.out',
    onComplete: () => {
      gsap.set(root.querySelector('.contact-form'), { clearProps: "all" })
    }
  })

  // Canvas Corner Mesh Animation Loop
  const canvas = bgCanvas.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    let width = 0
    let height = 0
    let particles = []
    const mouse = { x: null, y: null }

    handleMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    class CornerParticle {
      constructor(cornerX, cornerY, maxRadius = 120, type = 'corner') {
        this.cornerX = cornerX
        this.cornerY = cornerY
        this.maxRadius = maxRadius
        this.type = type
        this.isFollowerCandidate = false // Will be designated in initParticles
        this.reset()
      }

      reset() {
        // Expand sector slightly by 0.15 radians (~8.5 degrees) on each side for organic overflow
        const buffer = 0.15
        const angle = -buffer + Math.random() * (Math.PI * 0.5 + 2 * buffer)
        let finalAngle = angle

        if (this.type === 'bottom-center') {
          // Spread upwards: pointing up, from 195 deg to 345 deg
          finalAngle = Math.PI + 0.25 + Math.random() * (Math.PI - 0.5)
        } else {
          // Standard corners
          const isRight = this.cornerX > width / 2
          const isBottom = this.cornerY > height / 2

          if (!isRight && !isBottom) {
            // Top Left
            finalAngle = angle
          } else if (isRight && !isBottom) {
            // Top Right
            finalAngle = Math.PI * 0.5 + angle
          } else if (!isRight && isBottom) {
            // Bottom Left
            finalAngle = Math.PI * 1.5 + angle
          } else {
            // Bottom Right
            finalAngle = Math.PI + angle
          }
        }

        // Varied radii per particle to create an organic dendritic cloud
        const radiusLimit = this.maxRadius * (0.65 + Math.random() * 0.7)
        const dist = 25 + Math.pow(Math.random(), 1.25) * (radiusLimit - 25)
        this.x = this.cornerX + Math.cos(finalAngle) * dist
        this.y = this.cornerY + Math.sin(finalAngle) * dist

        this.vx = (Math.random() - 0.5) * 0.25
        this.vy = (Math.random() - 0.5) * 0.25
        this.size = 1.5 + Math.random() * 2.5
        this.baseOpacity = 0.4 + Math.random() * 0.4
        this.opacity = this.baseOpacity
        this.originX = this.x
        this.originY = this.y
      }

      update(mouse, isAttractedToMouse) {
        this.isAttracted = isAttractedToMouse && mouse.x !== null && mouse.y !== null

        if (this.isAttracted) {
          // Smoothly ease towards the mouse cursor
          this.x += (mouse.x - this.x) * 0.12
          this.y += (mouse.y - this.y) * 0.12
          // Reset velocity so it is static while attached
          this.vx = 0
          this.vy = 0
        } else {
          const dx = this.x - this.originX
          const dy = this.y - this.originY
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 25) {
            // Easing directly back to origin space without accumulating speed
            this.x += (this.originX - this.x) * 0.05
            this.y += (this.originY - this.y) * 0.05
            // Dampen velocity to prevent wild spring launching
            this.vx *= 0.8
            this.vy *= 0.8
          } else {
            // Standard drift physics when close to origin
            this.x += this.vx
            this.y += this.vy

            // Standard soft return forces
            this.vx -= dx * 0.002
            this.vy -= dy * 0.002
            
            // Friction to stabilize standard drift
            this.vx *= 0.98
            this.vy *= 0.98

            // Small random walk to keep standard drifting alive
            this.vx += (Math.random() - 0.5) * 0.015
            this.vy += (Math.random() - 0.5) * 0.015
          }
        }

        this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.001 * this.size) * 0.05
      }

      draw(c) {
        if (this.isAttracted) {
          // Glow effect (outer ring)
          c.beginPath()
          c.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2)
          c.strokeStyle = 'rgba(255, 255, 255, 0.4)'
          c.lineWidth = 1.0
          c.stroke()

          // Draw the main highlighted solid node
          c.beginPath()
          c.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2)
          c.fillStyle = '#ffffff'
          c.fill()
        } else {
          // Draw standard drifting node
          c.beginPath()
          c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
          c.fill()
        }
      }
    }

    const initParticles = () => {
      particles = []
      const corners = [
        { x: 10, y: 10, radius: 200, count: 9, type: 'corner' },
        { x: width - 10, y: 10, radius: 320, count: 18, type: 'corner' }, // Top Right - Enlarged size & density
        { x: 10, y: height - 10, radius: 320, count: 18, type: 'corner' }, // Bottom Left - Enlarged size & density
        { x: width - 10, y: height - 10, radius: 200, count: 9, type: 'corner' },
        { x: width / 2, y: height - 20, radius: 240, count: 12, type: 'bottom-center' }
      ]
      corners.forEach(corner => {
        for (let i = 0; i < corner.count; i++) {
          const p = new CornerParticle(corner.x, corner.y, corner.radius, corner.type)
          if (i === 0) {
            p.isFollowerCandidate = true // Exactly one node per cluster tracks the mouse
          }
          particles.push(p)
        }
      })
    }

    resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    resize()
    window.addEventListener('resize', resize)

    const drawLoop = () => {
      ctx.clearRect(0, 0, width, height)

      // Reset connection counts for all particles to prevent spider web clusters
      for (let i = 0; i < particles.length; i++) {
        particles[i].connections = 0
      }

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        
        // Find if this node is the single designated follower node for its active cluster
        let isAttracted = false
        if (p1.isFollowerCandidate && mouse.x !== null && mouse.y !== null) {
          const dxAnchor = mouse.x - p1.cornerX
          const dyAnchor = mouse.y - p1.cornerY
          const distToAnchor = Math.sqrt(dxAnchor * dxAnchor + dyAnchor * dyAnchor)
          
          if (distToAnchor < p1.maxRadius + 180) {
            isAttracted = true
          }
        }

        p1.update(mouse, isAttracted)
        p1.draw(ctx)

        // Draw connection wires - maximum 2 connections per node for a clean constellation/neural tree look
        ctx.lineWidth = 1.0
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          if (p1.connections >= 2 || p2.connections >= 2) continue

          if (p1.cornerX === p2.cornerX && p1.cornerY === p2.cornerY) {
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const threshold = p1.maxRadius * 0.65
            if (dist < threshold) {
              const alpha = Math.min(0.95, (1 - dist / threshold) * 0.95 * Math.min(p1.opacity, p2.opacity) * 2)
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()

              p1.connections++
              p2.connections++
            }
          }
        }
      }

      // Cybernetic structural crosshairs/corner frame brackets - thicker and brighter
      const len = 35
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.lineWidth = 2.0

      // TL
      ctx.beginPath(); ctx.moveTo(10, 10 + len); ctx.lineTo(10, 10); ctx.lineTo(10 + len, 10); ctx.stroke()
      // TR
      ctx.beginPath(); ctx.moveTo(width - 10, 10 + len); ctx.lineTo(width - 10, 10); ctx.lineTo(width - 10 - len, 10); ctx.stroke()
      // BL
      ctx.beginPath(); ctx.moveTo(10, height - 10 - len); ctx.lineTo(10, height - 10); ctx.lineTo(10 + len, height - 10); ctx.stroke()
      // BR
      ctx.beginPath(); ctx.moveTo(width - 10, height - 10 - len); ctx.lineTo(width - 10, height - 10); ctx.lineTo(width - 10 - len, height - 10); ctx.stroke()
      // Bottom Center Chevron Bracket
      ctx.beginPath(); ctx.moveTo(width / 2 - len, height - 10); ctx.lineTo(width / 2, height - 20); ctx.lineTo(width / 2 + len, height - 10); ctx.stroke()

      animationFrameId = requestAnimationFrame(drawLoop)
    }

    drawLoop()
  }
})

const socialLinks = [
  { name: 'GitHub', icon: Github, link: profile.socials.github },
  { name: 'LinkedIn', icon: Linkedin, link: profile.socials.linkedin },
  { name: 'Instagram', icon: Instagram, link: profile.socials.instagram },
  { name: 'WhatsApp', icon: MessageCircle, link: profile.socials.whatsapp }
]

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (resize) {
    window.removeEventListener('resize', resize)
  }
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
  if (handleMouseLeave) {
    window.removeEventListener('mouseleave', handleMouseLeave)
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div ref="viewRoot" class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 min-h-[calc(100vh-96px)] flex flex-col justify-center py-8 md:py-12 overflow-hidden relative">
    <canvas ref="bgCanvas" class="absolute inset-0 w-full h-full pointer-events-none select-none z-0"></canvas>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10 w-full">
      
      <!-- LEFT SIDE: HEADER & COMPACT INFO -->
      <div class="lg:col-span-6 space-y-8 contact-header">
        <div>
          <span class="app-badge mb-4 block inline-block" :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">Global Connectivity Protocol</span>
          <h1 class="text-4xl sm:text-5xl md:text-6xl xl:text-[80px] font-headline font-black text-on-surface tracking-[calc(-0.06em)] leading-none mb-6 uppercase flex flex-wrap items-baseline gap-x-3">
            <span>STRATEGIC</span>
            <FuzzyText 
              color="var(--color-primary)" 
              font-style="italic"
              font-size="clamp(2.2rem, 5.5vw, 5rem)"
              font-weight="900"
              font-family="inherit"
              class-name="text-primary italic inline-block select-none underline decoration-wavy decoration-[3px] sm:decoration-6 underline-offset-[4px] sm:underline-offset-[8px]"
              :base-intensity="0.15"
              :hover-intensity="0.45"
              :fuzz-range="18"
              :enable-hover="true"
            >
              DIALOGUE.
            </FuzzyText>
          </h1>
          <p class="text-on-surface-variant text-base md:text-lg leading-relaxed font-body max-w-xl opacity-80 font-medium">
            Ready to deploy world-class architectures. Initiate the sequence for your next high-impact digital project.
          </p>
        </div>

        <!-- COMPACT INFO ITEMS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(info, i) in [
            { label: 'DIRECT SIGNAL', val: profile.email || 'mmaroof341@gmail.com', icon: Mail },
            { label: 'OPERATIONAL BASE', val: profile.location, icon: MapPin },
            { label: 'DIRECT VOICE', val: profile.phone || '+923051526463', icon: Phone },
            { label: 'RESPONSE LATENCY', val: '< 24 Hours', icon: Clock }
          ]" :key="i" 
            class="contact-card gsap-reveal p-4 flex items-center gap-4 transition-all duration-700 hover:-translate-y-1 shadow-lg cursor-pointer active-spring"
            :style="{ borderRadius: 'var(--app-radius)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card' : 
              themeStore.currentStyle === 'street' ? 'street-card' : 'bg-surface-container border border-primary/10 hover:border-primary/20'
            ]" v-ripple>
            <div class="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 backdrop-blur-sm shrink-0"
              :style="{ borderRadius: 'calc(var(--app-radius) / 3)' }">
               <component :is="info.icon" class="w-5 h-5 text-primary opacity-80" />
            </div>
            <div class="min-w-0">
              <p class="text-primary font-black text-[7px] tracking-[0.25em] uppercase mb-1">{{ info.label }}</p>
              <p class="text-xs md:text-sm font-headline font-black tracking-tight leading-tight uppercase text-on-surface truncate">{{ info.val }}</p>
            </div>
          </div>
        </div>

        <!-- SOCIAL CARDS -->
        <div class="flex flex-wrap gap-3 pt-2">
          <a v-for="social in socialLinks" :key="social.name" :href="social.link" target="_blank"
            class="px-5 py-2.5 bg-on-surface text-surface flex items-center gap-3 transition-all duration-500 hover:scale-[1.05] hover:-translate-y-0.5 relative active-spring group"
            :style="{ borderRadius: 'calc(var(--app-radius) / 2.5)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card border-primary' : '',
              social.name.toLowerCase() === 'github' ? 'hover:text-[#40c463] hover:shadow-[0_8px_16px_rgba(64,196,99,0.2)]' :
              social.name.toLowerCase() === 'linkedin' ? 'hover:text-[#0077b5] hover:shadow-[0_8px_16px_rgba(0,119,181,0.2)]' :
              social.name.toLowerCase() === 'whatsapp' ? 'hover:text-[#25d366] hover:shadow-[0_8px_16px_rgba(37,211,102,0.2)]' :
              social.name.toLowerCase() === 'instagram' ? 'hover:text-[#e1306c] hover:shadow-[0_8px_16px_rgba(225,48,108,0.2)]' : ''
            ]" v-ripple>
            <component :is="social.icon" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
            <span class="font-black tracking-[0.15em] text-[8px] uppercase">{{ social.name }}</span>
            <ArrowUpRight class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      <!-- RIGHT SIDE: CONTACT FORM -->
      <div class="lg:col-span-6 contact-form p-6 sm:p-8 rounded-[2rem] md:rounded-[3rem] transition-all duration-1000 relative overflow-hidden group shadow-3xl"
        :class="[
          themeStore.currentStyle === 'brutal' ? 'brutal-card border-8 border-on-surface' : 
          themeStore.currentStyle === 'street' ? 'street-card border-secondary/40' : 'bg-surface-container-highest shadow-2xl border border-primary/10'
        ]">
        <!-- Corner Decors -->
        <div class="absolute top-4 left-4 w-4 h-4 border-t border-l opacity-25 border-primary"></div>
        <div class="absolute top-4 right-4 w-4 h-4 border-t border-r opacity-25 border-primary"></div>
        <div class="absolute bottom-4 left-4 w-4 h-4 border-b border-l opacity-25 border-primary"></div>
        <div class="absolute bottom-4 right-4 w-4 h-4 border-b border-r opacity-25 border-primary"></div>

        <h2 class="text-3xl md:text-4xl font-headline font-black mb-6 md:mb-8 tracking-tighter uppercase leading-[0.9] text-on-surface">Send a <br/> <span class="text-primary italic">Message</span></h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-6 md:space-y-8 relative z-10">
          <transition 
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 -translate-y-10 scale-90"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 scale-90"
          >
            <div v-if="submitted" class="absolute inset-0 z-50 flex items-center justify-center bg-surface-container-highest/80 backdrop-blur-md rounded-[2rem] md:rounded-[3rem]">
              <div class="p-8 rounded-[1.5rem] bg-primary text-on-primary text-center shadow-2xl border-4 border-white/20">
                <Send class="w-12 h-12 mx-auto mb-4 animate-bounce" />
                <h3 class="text-xl font-black uppercase tracking-widest mb-2">Message Sent</h3>
                <p class="opacity-80 uppercase text-[9px] tracking-widest">Thank you! I will get back to you shortly.</p>
              </div>
            </div>
          </transition>

          <div v-if="!submitted" class="space-y-6 md:space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div class="space-y-3 relative group/input">
                <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-on-surface opacity-60 px-4">Your Name</label>
                <input v-model="form.name" type="text" placeholder="Enter your name" required
                  class="w-full px-5 py-3.5 rounded-xl bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-base text-on-surface placeholder:text-on-surface-variant/40 shadow-inner dark:bg-black/20" />
                <div class="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 origin-center"></div>
              </div>
              <div class="space-y-3 relative group/input">
                <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-on-surface opacity-60 px-4">Email Address</label>
                <input v-model="form.email" type="email" placeholder="your.email@domain.com" required
                  class="w-full px-5 py-3.5 rounded-xl bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-base text-on-surface placeholder:text-on-surface-variant/40 shadow-inner dark:bg-black/20" />
                <div class="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 origin-center"></div>
              </div>
            </div>
            
            <div class="space-y-3 relative group/input">
              <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-on-surface opacity-60 px-4">Your Message</label>
              <textarea v-model="form.message" rows="3" placeholder="Write your message here..." required
                class="w-full px-5 py-3.5 bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-base text-on-surface placeholder:text-on-surface-variant/40 resize-none shadow-inner dark:bg-black/20"
                :style="{ borderRadius: 'calc(var(--app-radius) / 1.5)' }"></textarea>
              <div class="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500 origin-center"></div>
            </div>

            <!-- Status Board -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface/50 border border-primary/5 font-mono text-[9px] tracking-wider uppercase text-on-surface/50">
              <div class="flex flex-col gap-1 border-r border-on-surface/5 pr-2">
                <span class="opacity-40">AVAILABILITY</span>
                <span class="text-primary font-black flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> READY
                </span>
              </div>
              <div class="flex flex-col gap-1 sm:border-r border-on-surface/5 sm:px-2">
                <span class="opacity-40">RESPONSE</span>
                <span class="text-on-surface font-bold">UNDER 24 HOURS</span>
              </div>
              <div class="flex flex-col gap-1 border-r border-on-surface/5 pr-2 sm:px-2">
                <span class="opacity-40">LOCATION</span>
                <span class="text-on-surface font-bold">LAHORE / REMOTE</span>
              </div>
              <div class="flex flex-col gap-1 pl-2">
                <span class="opacity-40">STATUS</span>
                <span class="text-emerald-500 font-bold">ACTIVE & ONLINE</span>
              </div>
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full py-4 md:py-5 bg-primary text-on-primary font-black tracking-[0.2em] md:tracking-[0.25em] text-xs md:text-sm uppercase flex items-center justify-center gap-4 hover:translate-y-[-3px] transition-all shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.3)] group disabled:opacity-50 disabled:grayscale active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2.5)' }" v-ripple>
              <span v-if="!isSubmitting">SEND MESSAGE</span>
              <span v-else class="animate-pulse">SENDING MESSAGE...</span>
              <Send class="w-5 h-5 transition-transform group-hover:translate-x-3 group-hover:-translate-y-2 group-active:scale-90" />
            </button>
          </div>
        </form>

        <div class="absolute bottom-[-15%] right-[-15%] opacity-5 pointer-events-none group-hover:rotate-12 group-hover:scale-125 transition-transform duration-1000">
           <Send class="w-[600px] h-[600px] text-primary" />
        </div>
      </div>
    </div>
  </div>
</template>
