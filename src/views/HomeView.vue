<script setup>
import { onMounted, ref, nextTick, onBeforeUnmount, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Download, Terminal, Cpu, Smartphone, Globe, Zap, Gamepad2, Code, User, Target, ChevronDown } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { defineAsyncComponent } from 'vue'
const PolymorphicCanvas = defineAsyncComponent(() => import('../components/PolymorphicCanvas.vue'))
import ThreeDCarousel from '../components/ThreeDCarousel.vue'
import LivePortraitBackground from '../components/LivePortraitBackground.vue'
const FuzzyText = defineAsyncComponent(() => import('../components/FuzzyText.vue'))
import DecryptedText from '../components/DecryptedText.vue'
import ProjectsTable from '../components/ProjectsTable.vue'
import SynapticProjectsList from '../components/SynapticProjectsList.vue'
import meImage from '../assets/me.webp'

// ScrollTrigger is registered globally in main.js

const themeStore = useThemeStore()
const { profile, projects } = portfolioData
const nameParts = profile.name.split(' ')
const firstWord = nameParts[0].split('')

const isDesktop = ref(window.innerWidth >= 1024)
let resizeHandler = null

const servicesRef = ref(null)
const offeredServicesRef = ref(null)
const projectsRef = ref(null)
const aboutRef = ref(null)
const viewRoot = ref(null)

const adventures = [
  { id: 'default', label: 'All-Rounder' },
  { id: 'ai', label: 'AI & Agents' },
  { id: 'web', label: 'Scalable Systems' },
  { id: 'mobile', label: 'Mobile Apps' }
]
const activeAdventure = ref('default')
const getAdventureText = computed(() => {
  switch (activeAdventure.value) {
    case 'ai':
      return "Orchestrating intelligent agents, custom LLM configurations, and automated n8n pipeline workflows to build future-proof AI systems."
    case 'web':
      return "Designing robust, high-throughput backend controllers and responsive client interfaces that scale seamlessly under heavy workloads."
    case 'mobile':
      return "Developing premium cross-platform mobile apps with Capacitor and Flutter that deliver smooth, native performance."
    default:
      return "Full Stack Developer at Byte Force. Bridging the gap between creative vision and technical precision with Scalable Architectures."
  }
})

// Metrics cycling state
const metrics = [
  { value: 250, suffix: 'K+', label: 'Users Served' },
  { value: 30, suffix: '%', label: 'Hosting Cost Cut' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'System SLA Uptime' }
]
const activeMetricIdx = ref(0)
const metricVal = ref(0)
let metricInterval = null

const animateMetricNumber = (targetVal) => {
  const currentObj = { val: 0 }
  gsap.to(currentObj, {
    val: targetVal,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: () => {
      metricVal.value = metrics[activeMetricIdx.value].decimals 
        ? currentObj.val.toFixed(1) 
        : Math.round(currentObj.val)
    }
  })
}

// Testimonials data
const testimonials = [
  {
    metric: '30% Server Cost Reduction',
    quote: 'Maroof audited our Node.js systems, refactored our caching layer, and optimized our database queries, reducing our hosting bill overnight.',
    author: 'Alex Carter',
    role: 'CTO, Bytely.ai'
  },
  {
    metric: '0 to 10k Users in 3 Months',
    quote: 'Thanks to the Capacitor-based mobile layout and Supabase real-time Dispatch core Maroof architected, our delivery app launched smoothly and scaled without hiccups.',
    author: 'Sara Chen',
    role: 'Founder, FoodLink'
  }
]

const homeActiveFaqIdx = ref(null)
const homeFaqs = [
  {
    q: "What technologies are in your core tech stack?",
    a: "My architectural core is built on Vue 3 (Composition API, Pinia) and React for user interfaces, styled via utility grids or vanilla CSS tokens. On the server, I design backend microservices using Node.js and Python, handle persistence with Supabase/PostgreSQL/MongoDB, package runtimes in Docker, and orchestrate automated AI workflows with n8n."
  },
  {
    q: "What does a 'Digital Architect' actually do?",
    a: "Unlike a standard developer who solely writes user-facing client code, a Digital Architect bridges frontend interaction design, backend service reliability, and database indexing. I design system blueprints, profile and remove server/rendering bottlenecks, structure secure auth schemas, and guarantee high system availability under heavy loads."
  },
  {
    q: "How do you approach Agentic AI integration?",
    a: "We move past simple prompt engineering to build production-grade autonomous workflow engines. This includes setting up secure vector databases (RAG) using pgvector or Pinecone, orchestrating multi-agent decision systems in Python or n8n, deploying real-time voice agents, and automating corporate manual operations to save hours of human labor."
  },
  {
    q: "What is your contract availability and booking process?",
    a: "I am currently based at Byte Force, but maintain capacity for selective startup consultation, systems audits, and architecture design workshops. Project slots are strictly limited to ensure engineering quality. Use the 'Initiate Protocol' CTA or direct signals (email/voice) to request availability."
  }
]

onMounted(async () => {
  await nextTick()

  const root = viewRoot.value
  if (!root) return
  
  // Set initial states — scoped to this view's root to avoid bleed onto other pages
  gsap.set(root.querySelectorAll('.gsap-reveal, .about-reveal'), { autoAlpha: 0, y: 30 })

  // 1. Hero Content & Split-Character Reveal
  gsap.to(root.querySelectorAll('.hero-title-char'), {
    y: 0,
    duration: 1.0,
    stagger: 0.025,
    ease: 'power4.out'
  })

  gsap.to(root.querySelectorAll('.hero-content > *:not(h1)'), {
    y: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  })

  // 2. Strategic Pillars Cards Reveal
  gsap.to(root.querySelectorAll('.strategy-card'), {
    scrollTrigger: {
      trigger: servicesRef.value,
      start: 'top 82%',
    },
    y: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.strategy-card'), { clearProps: "all" })
    }
  })

  // 2a. About/Mentality Section Reveal
  gsap.to(root.querySelectorAll('.about-reveal'), {
    scrollTrigger: {
      trigger: aboutRef.value,
      start: 'top 82%',
    },
    y: 0,
    autoAlpha: 1,
    duration: 1.0,
    stagger: 0.15,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.about-reveal'), { clearProps: "all" })
    }
  })

  // 2b. Offered Services Carousel Reveal
  gsap.to(root.querySelectorAll('.offered-carousel-reveal'), {
    scrollTrigger: {
      trigger: offeredServicesRef.value,
      start: 'top 82%',
    },
    y: 0,
    scale: 1,
    autoAlpha: 1,
    duration: 1.2,
    ease: 'power4.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.offered-carousel-reveal'), { clearProps: "all" })
    }
  })

  // 3. Dynamic Skew-on-Scroll for Marquee
  const marqueeSec = root.querySelector('.marquee-section')
  if (marqueeSec) {
    let proxy = { skew: 0 }
    let skewSetter = gsap.quickSetter(marqueeSec, "skewY", "deg")
    let clamp = gsap.utils.clamp(-6, 6)

    ScrollTrigger.create({
      onUpdate: (self) => {
        let skew = clamp(self.getVelocity() / -400)
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew
          gsap.to(proxy, {
            skew: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: "auto",
            onUpdate: () => skewSetter(proxy.skew)
          })
        }
      }
    })
  }


  // 5. Core Philosophy Cards - Bounce slide-up entry
  gsap.from(root.querySelectorAll('.philosophy-card'), {
    scrollTrigger: {
      trigger: root.querySelector('.philosophy-card'),
      start: 'top 90%',
    },
    y: 60,
    scale: 0.94,
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.5)',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.philosophy-card'), { clearProps: "all" })
    }
  })

  // 6. Call To Action Panel - Scale up and glow activation
  gsap.from(root.querySelector('.cta-box'), {
    scrollTrigger: {
      trigger: root.querySelector('.cta-box'),
      start: 'top 88%',
    },
    scale: 0.95,
    y: 40,
    autoAlpha: 0,
    duration: 1.0,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set(root.querySelector('.cta-box'), { clearProps: "transform" })
    }
  })

  animateMetricNumber(metrics[activeMetricIdx.value].value)
  metricInterval = setInterval(() => {
    activeMetricIdx.value = (activeMetricIdx.value + 1) % metrics.length
    animateMetricNumber(metrics[activeMetricIdx.value].value)
  }, 4500)

  resizeHandler = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  window.addEventListener('resize', resizeHandler)
})

const services = [
  { title: 'Full Stack Engineering', desc: 'Architecting robust web ecosystems using Vue.js, Node.js, and modern databases.', icon: Globe },
  { title: 'Mobile First Development', desc: 'High-performance cross-platform apps with Flutter and Ionic Capacitor.', icon: Smartphone },
  { title: 'AI & Data Integration', desc: 'Orchestrating agentic AI workflows and real-time data streaming solutions.', icon: Cpu },
  { title: 'Game Development', desc: 'Immersive multiplayer experiences built with Unity and high-fidelity rendering.', icon: Zap }
]

const offeredServices = [
  { title: 'Custom Website Development', desc: 'Crafting bespoke, lightning-fast web applications optimized for speed, SEO, and flawless responsiveness.', icon: Globe, image: '/services/web_dev.webp' },
  { title: 'Game Development', desc: 'Developing immersive, real-time interactive 2D/3D browser and native games using high-performance graphic engines.', icon: Gamepad2, image: '/services/game_dev.webp' },
  { title: 'Code Audit & Review', desc: 'Deep codebase security profiling, architectural health assessments, and streamlining logic to eliminate technical debt.', icon: Code, image: '/services/code_audit.webp' },
  { title: 'Optimization & Enhancements', desc: 'Fine-tuning memory allocation, script execution speeds, asset packaging, and database queries for peak efficiency.', icon: Cpu, image: '/services/optimization.webp' },
  { title: 'Business Automation', desc: 'Designing custom agentic AI pipelines, data extraction routines, and headless process integrations to supercharge productivity.', icon: Smartphone, image: '/services/automation.webp' }
]

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (metricInterval) {
    clearInterval(metricInterval)
  }
  // Kill all triggers – safe because no other view is mounted yet.
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <!-- Full-width wrapper -->
  <div ref="viewRoot" class="relative w-full overflow-visible">

    <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-6 md:pt-16 pb-16 overflow-visible">
    <!-- HERO SECTION -->
    <header class="relative min-h-[calc(100vh-120px)] flex items-center mb-12 md:mb-24 layer-base overflow-visible">
      <!-- 3D Canvas Background -->
      <PolymorphicCanvas />

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full relative overflow-visible">
        <div class="order-2 lg:order-1 lg:col-span-7 hero-content layer-content relative z-10 overflow-visible">
          <div class="gsap-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/40 text-primary font-black text-[8px] md:text-[9px] tracking-[0.3em] mb-4 md:mb-6 uppercase">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {{ profile.availability }}
          </div>
          
          <h1 class="app-h1 mb-6 md:mb-8 relative !overflow-visible select-none flex flex-wrap items-center gap-x-4 gap-y-2">
            <!-- First Name (character split) -->
            <span class="inline-block whitespace-nowrap !overflow-visible">
              <span v-for="(char, idx) in firstWord" :key="'first-' + idx" class="char-container">
                <span class="char-inner hero-title-char inline-block" 
                  :class="[
                    themeStore.currentStyle === 'street' ? 'street-fx-radiant street-fx-glitch' : ''
                  ]">{{ char === ' ' ? '&nbsp;' : char }}</span>
              </span>
            </span>
            
            <!-- Rest of Name (FuzzyText on desktop, fallback span on mobile) -->
            <span class="inline-block whitespace-nowrap !overflow-visible">
              <FuzzyText
                fontStyle="italic"
                fontSize="inherit"
                fontWeight="900"
                color="var(--color-primary)"
                fontFamily="Outfit"
                :baseIntensity="0.18"
                :hoverIntensity="isDesktop ? 0.5 : 0.18"
                :enableHover="isDesktop"
                :glitchMode="themeStore.currentStyle === 'street'"
                class="!overflow-visible"
              >MAROOF</FuzzyText>
            </span>
          </h1>
          
          <!-- Choose Your Own Adventure pills -->
          <div class="gsap-reveal flex flex-wrap gap-1.5 mb-5 max-w-lg">
            <button 
              v-for="adv in adventures" 
              :key="adv.id"
              @click="activeAdventure = adv.id"
              class="px-2.5 py-1.5 text-[8px] md:text-[9px] font-mono font-bold uppercase tracking-widest rounded-full border transition-all active-spring"
              :class="activeAdventure === adv.id 
                ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/10' 
                : 'bg-surface-container-high/30 text-on-surface/50 border-primary/5 hover:bg-surface-container-high/60 hover:text-on-surface'"
            >
              {{ adv.label }}
            </button>
          </div>

          <p class="gsap-reveal text-base md:text-xl text-on-surface-variant max-w-lg mb-8 md:mb-10 leading-relaxed font-body font-medium min-h-[70px]">
            <DecryptedText 
              :key="activeAdventure"
              :text="getAdventureText" 
              animateOn="view"
              :sequential="true"
              revealDirection="start"
              :speed="8"
              className="text-on-surface-variant font-medium"
              encryptedClassName="text-primary font-mono opacity-80"
            />
          </p>

          <div class="gsap-reveal flex flex-col sm:flex-row gap-4 md:gap-6">
            <router-link to="/contact" 
              class="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 font-black text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 group shadow-2xl relative overflow-hidden active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-primary text-on-primary' : 
                'bg-gradient-to-br from-primary to-primary-dim text-on-primary hover:scale-[1.05] shadow-primary/20'
              ]" v-ripple>
              Contact Me <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </router-link>
            <a href="/Muhammad_Maroof_CV.pdf" download="Muhammad_Maroof_CV.pdf"
              class="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 font-black text-[10px] md:text-xs tracking-[0.2em] uppercase transition-all shadow-xl group border border-surface-container-high flex items-center justify-center active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-surface-container text-on-surface' : 
                'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              ]" v-ripple>
              Curriculum Vitae <Download class="w-4 h-4 inline-block ml-3 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <!-- AI Certification Callout -->
          <div 
            @click="() => {
              const el = document.getElementById('work')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }"
            class="gsap-reveal mt-6 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl border border-primary/20 bg-surface-container-low/80 backdrop-blur-md max-w-md shadow-lg group/cert hover:border-primary/50 transition-all cursor-pointer pointer-events-auto"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
            :class="{ 'brutal-card bg-surface': themeStore.currentStyle === 'brutal' }"
          >
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div class="flex-1 text-left">
              <span class="block text-[8px] font-mono text-primary font-black uppercase tracking-widest leading-none mb-1">LIVE INTEL // CERTIFIED AGENTIC AI</span>
              <p class="text-[10px] font-body font-semibold text-on-surface-variant leading-tight">
                Built autonomous voice-calling agents & n8n pipeline integrations. <span class="text-primary font-black hover:underline">See project specs →</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Hero Visual (Overhauled with Live Background Canvas) -->
        <div class="lg:col-span-5 relative order-1 lg:order-2 flex justify-center lg:justify-end layer-visual group z-30 mb-6 lg:mb-0 overflow-visible w-full max-w-[320px] md:max-w-[480px] lg:max-w-[490px] xl:max-w-[540px] lg:-translate-y-12 xl:-translate-y-16 mx-auto lg:mx-0">
          <!-- Stylistic Backdrop Glow -->
          <div class="absolute inset-0 scale-[1.2] blur-[80px] md:blur-[120px] opacity-40 transition-all duration-1000 z-0"
            :class="[
              themeStore.currentStyle === 'street' ? 'bg-gradient-to-br from-primary via-secondary to-primary/20 animate-pulse' : 
              themeStore.currentStyle === 'brutal' ? 'bg-on-surface opacity-10' : 
              'bg-gradient-to-tr from-primary/30 to-primary-dim/10'
            ]"></div>

          <LivePortraitBackground />

          <!-- Floating Dynamic Metric Card -->
          <div class="absolute bottom-2 sm:bottom-4 md:bottom-8 lg:-bottom-8 right-2 sm:right-4 md:right-8 lg:right-auto lg:-left-12 p-3 md:p-4 lg:p-6 shadow-3xl w-[220px] transition-all duration-700 hover:-translate-y-4 z-20 flex flex-row lg:block items-center gap-3 lg:gap-0"
            v-tilt="{ max: 15, scale: 1.05 }"
            :style="{ borderRadius: 'calc(var(--app-radius) / 1.5)' }"
            :class="[
              themeStore.currentStyle === 'street' ? 'bg-surface border-4 border-on-surface shadow-[8px_8px_0_0_var(--color-secondary)]' : 
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
              'bg-surface/90 backdrop-blur-md border border-primary/20 text-on-surface'
            ]">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-headline font-black text-primary leading-none lg:mb-2 italic w-28 lg:w-auto text-left"
              :class="{ 'street-fx-radiant !not-italic': themeStore.currentStyle === 'street' }">
              {{ metricVal }}{{ metrics[activeMetricIdx].suffix }}
            </div>
            <div class="text-[7px] sm:text-[8px] lg:text-[8px] font-black uppercase tracking-[0.1em] leading-tight opacity-70 lg:opacity-60 text-on-surface text-left">
              {{ metrics[activeMetricIdx].label }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <section id="strategy" ref="servicesRef" class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 mb-24 md:mb-32 lg:mb-40 xl:mb-48 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-[calc(-0.06em)] mb-4 md:mb-6 uppercase leading-none text-on-surface"
          :class="{ 'street-fx-glow text-surface': themeStore.currentStyle === 'street' }">STRATEGIC <span class="text-primary italic" :class="{ 'text-secondary': themeStore.currentStyle === 'street' }">PILLARS</span></h2>
        <p class="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg leading-relaxed font-body font-medium px-4 opacity-80">
          Architecting resilient digital ecosystems that transform complex requirements into seamless experiences.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div v-for="service in services" :key="service.title"
          class="strategy-card w-full p-5 md:p-8 lg:p-10 rounded-[1.25rem] md:rounded-[2rem] transition-all duration-500 cursor-pointer active-spring hover:-translate-y-2 border border-primary/10 bg-surface-container-low/80 backdrop-blur-md relative group overflow-hidden gsap-reveal"
          v-ripple
          v-tilt="{ max: 15, scale: 1.03 }"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card' : 
            themeStore.currentStyle === 'street' ? 'street-card border-2 border-black' : ''
          ]"
        >
          <!-- Hover Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="w-10 h-10 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center mb-4 md:mb-6 lg:mb-8 transition-transform group-hover:scale-110"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0' : 'calc(var(--app-radius) / 4)' }">
            <component :is="service.icon" class="w-5 h-5 md:w-7 md:h-7 text-primary" />
          </div>
          <h3 class="font-headline text-base md:text-xl font-black mb-2 md:mb-4 uppercase tracking-tight leading-none text-on-surface">{{ service.title }}</h3>
          <p class="text-on-surface-variant leading-relaxed text-xs md:text-sm lg:text-base opacity-75 font-medium">{{ service.desc }}</p>
        </div>
      </div>
    </section>

    <section class="marquee-section mt-24 md:mt-32 lg:mt-40 xl:mt-48 -mx-6 md:-mx-12 overflow-hidden border-y border-primary/20 relative"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'bg-surface border-y-4 border-on-surface' : 
        themeStore.currentStyle === 'street' ? 'bg-primary/30' : 'bg-surface-container-lowest/80 backdrop-blur-md'
      ]">
      <div class="marquee-container opacity-100 py-6 md:py-10">
        <div class="marquee-content animate-scroll-left flex gap-10 md:gap-16 py-2">
          <div v-for="i in 2" :key="i" class="flex gap-10 md:gap-16">
            <span v-for="skill in portfolioData.skills" :key="skill.name" 
              class="font-headline font-black text-2xl md:text-4xl tracking-[calc(-0.04em)] transition-all cursor-default flex items-center gap-4 md:gap-6 hover:scale-105 whitespace-nowrap"
              :style="{ color: skill.color }">
              <div class="w-2 md:w-3 h-2 md:h-3 rounded-full shrink-0" :style="{ backgroundColor: skill.color }"></div>
              {{ skill.name.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- PROFILE INTRO / MENTALITY SECTION -->
    <section id="about" ref="aboutRef" class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 relative layer-base scroll-mt-32">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        <!-- Left: Image Frame with thematic styling -->
        <div class="lg:col-span-4 flex justify-center lg:justify-start about-reveal">
          <div class="relative w-full max-w-[380px] lg:max-w-full aspect-square md:aspect-[4/5] lg:aspect-[3/4] overflow-visible group">
            
            <!-- Minimal/Street background glow -->
            <div 
              v-if="themeStore.currentStyle !== 'brutal'"
              class="absolute -inset-4 opacity-30 blur-3xl transition-opacity duration-1000 group-hover:opacity-50"
              :class="themeStore.currentStyle === 'street' ? 'bg-gradient-to-tr from-primary via-secondary to-transparent' : 'bg-primary/20'"
            ></div>

            <!-- Brutalist offset back frame -->
            <div 
              v-if="themeStore.currentStyle === 'brutal'"
              class="absolute inset-0 bg-primary border-4 border-on-surface translate-x-4 translate-y-4"
            ></div>

            <!-- Image wrapper container -->
            <div 
              class="w-full h-full relative overflow-hidden transition-all duration-500 bg-surface-container-low/20"
              :style="{ 
                borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '2.5rem',
                border: themeStore.currentStyle === 'brutal' ? '4px solid var(--color-on-surface)' : 
                        themeStore.currentStyle === 'street' ? '2px solid var(--color-primary)' : '1px solid rgba(var(--color-primary-rgb), 0.15)'
              }"
              :class="{
                'shadow-2xl backdrop-blur-md': themeStore.currentStyle !== 'brutal'
              }"
            >
              <img 
                :src="meImage" 
                alt="Muhammad Maroof" 
                class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              <!-- Scanning grid overlay for Street Mode -->
              <div 
                v-if="themeStore.currentStyle === 'street'"
                class="absolute inset-0 pointer-events-none opacity-[0.08]"
                style="background-image: radial-gradient(var(--color-primary) 1.5px, transparent 1.5px); background-size: 15px 15px;"
              ></div>

              <!-- Glitch scanner bar for Street Mode -->
              <div 
                v-if="themeStore.currentStyle === 'street'"
                class="absolute top-0 left-0 w-full h-[2px] bg-secondary pointer-events-none translate-y-[-100%] group-hover:animate-[scan_3s_ease-in-out_infinite]"
              ></div>

              <!-- Telemetry Label -->
              <div 
                class="absolute bottom-4 left-4 right-4 z-10 p-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider backdrop-blur-md"
                :style="{ 
                  borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '1rem',
                  border: themeStore.currentStyle === 'brutal' ? '2px solid var(--color-on-surface)' : '1px solid rgba(var(--color-on-surface-rgb), 0.08)',
                  background: themeStore.currentStyle === 'brutal' ? 'var(--color-surface)' : 'rgba(var(--color-background-rgb), 0.75)'
                }"
              >
                <span class="flex items-center gap-1.5 font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  [OPERATIVE: MAROOF]
                </span>
                <span class="opacity-60">SYSTEM_ACTIVE</span>
              </div>
            </div>

            <!-- Corner decorations for Street mode -->
            <div v-if="themeStore.currentStyle === 'street'" class="absolute inset-[-8px] pointer-events-none z-20">
              <div class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
              <div class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
              <div class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
              <div class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
            </div>
          </div>
        </div>

        <!-- Right: Text Content and Mentality Quote -->
        <div class="lg:col-span-8 flex flex-col justify-center about-reveal">
          <!-- Decrypt/Scrambled Section Subtitle -->
          <div class="inline-flex items-center gap-2 mb-4 font-mono text-xs text-primary font-black uppercase tracking-[0.2em]">
            <User class="w-4 h-4 shrink-0" />
            <span>// PROFILE INTELLECT</span>
          </div>

          <!-- Bold, punchy Heading with text pressure or Outfit font -->
          <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tight text-on-surface mb-6 leading-[1.05]">
            SOMEONE WHO <br/>
            <span class="text-primary italic" :class="{ 'street-fx-radiant': themeStore.currentStyle === 'street' }">
              DOES NOT STOP
            </span> <br/>
            UNTIL WINNING.
          </h2>

          <p class="text-on-surface-variant text-base md:text-lg leading-relaxed font-body font-medium mb-8 opacity-90">
            My commitment is absolute: I do not stop until we win. I partner with high-growth businesses to convert complex concepts into top-tier digital assets. You bring the vision—I deliver the high-caliber engineering, clean architecture, and execution power to turn it into its most impactful practical manifestation.
          </p>

          <!-- Telemetry Stats Panel -->
          <div 
            class="grid grid-cols-2 gap-4 md:gap-6 p-5 md:p-6 mb-8"
            :style="{ 
              borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '1.5rem',
              border: themeStore.currentStyle === 'brutal' ? '3px solid var(--color-on-surface)' : '1px solid rgba(var(--color-primary-rgb), 0.12)',
              background: themeStore.currentStyle === 'brutal' ? 'var(--color-surface)' : 'var(--color-surface-container-low)'
            }"
            :class="{ 'shadow-md': themeStore.currentStyle !== 'brutal' }"
          >
            <div>
              <span class="block font-mono text-[9px] text-on-surface/40 uppercase tracking-widest mb-1">EXECUTION MINDSET</span>
              <span class="font-headline font-black text-sm md:text-base text-on-surface uppercase flex items-center gap-1.5">
                <Target class="w-4 h-4 text-primary shrink-0" />
                NEVER-SURRENDER
              </span>
            </div>
            <div>
              <span class="block font-mono text-[9px] text-on-surface/40 uppercase tracking-widest mb-1">DEVELOPMENT SPEED</span>
              <span class="font-headline font-black text-sm md:text-base text-on-surface uppercase flex items-center gap-1.5">
                <Zap class="w-4 h-4 text-primary shrink-0" />
                RAPID ITERATION
              </span>
            </div>
            <div class="border-t border-on-surface/5 pt-4 col-span-2 flex items-center justify-between font-mono text-[9px] text-on-surface/50">
              <span>LOC: LAHORE, PK</span>
              <span>DEV_RIGOR: 99.9%</span>
            </div>
          </div>

          <!-- Contact Link Button -->
          <div>
            <router-link to="/contact" 
              class="px-6 py-3.5 font-black text-[11px] md:text-xs tracking-[0.2em] uppercase transition-all inline-flex items-center gap-2 shadow-lg active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2.5)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-primary text-on-primary' : 
                'bg-primary text-on-primary hover:scale-[1.03]'
              ]" v-ripple>
              LEVERAGE MY DRIVE <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>

      </div>
    </section>

    <!-- THE QUANTUM METHODOLOGY & PROBLEM-SOLUTION NARRATIVE -->
    <section id="methodology" class="mt-24 md:mt-32 lg:mt-40 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">OPERATIONAL PROTOCOL</span>
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-on-surface">
          THE QUANTUM <span class="text-primary italic">PROTOCOL</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <!-- Left Column: The 5-Step Methodology Steps -->
        <div class="lg:col-span-6 flex flex-col gap-6 text-left">
          <div class="font-mono text-[9px] text-primary font-black tracking-widest uppercase mb-2">// 5-STAGE PIPELINE</div>
          
          <div v-for="(step, idx) in [
            { num: '01', title: 'Deep Audit', desc: 'Bottleneck profiling, architectural sanity checking, and complete code dependencies security mapping.' },
            { num: '02', title: 'AI Synthesis', desc: 'Feasibility engineering for integrating autonomous agent pipelines, vector databases, and custom LLM workflows.' },
            { num: '03', title: 'Architectural Blueprint', desc: 'Designing low-latency caching schemas, high-throughput message queues, and API routing layouts.' },
            { num: '04', title: 'Rigorous Execution', desc: 'Writing clean, test-driven code using Vue/React/Node.js/Python following strict Git revisioning standards.' },
            { num: '05', title: 'Telemetry & Scale', desc: 'Continuous performance profiling, sub-second load optimizations, and secure Docker cloud deployment.' }
          ]" :key="step.num"
            class="p-5 border border-primary/10 bg-surface-container-low/40 hover:bg-surface-container-low/80 backdrop-blur-md rounded-2xl group transition-all duration-300 hover:border-primary/40 cursor-default"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
            :class="themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : themeStore.currentStyle === 'street' ? 'street-card' : ''">
            <div class="flex items-start gap-4">
              <span class="font-mono font-black text-xs text-primary bg-primary/10 px-2 py-1 rounded">{{ step.num }}</span>
              <div>
                <h3 class="font-headline font-black text-sm md:text-base uppercase tracking-wider text-on-surface mb-1">{{ step.title }}</h3>
                <p class="text-on-surface-variant text-xs font-body font-medium leading-relaxed opacity-80">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Problem & Solution Accordion -->
        <div class="lg:col-span-6 flex flex-col gap-6 text-left">
          <div class="font-mono text-[9px] text-primary font-black tracking-widest uppercase mb-2">// PROBLEM RESOLUTION DIRECTIVE</div>
          
          <div v-for="(ps, idx) in [
            { prob: 'Outgrowing legacy unscalable backends and database throttling.', sol: 'Developing low-latency Redis/Supabase caching and indexing strategies to handle millions of transactions.' },
            { prob: 'Wasting developer and ops hours on repetitive manual tasks.', sol: 'Designing autonomous voice calling agent agents and custom n8n headless background automation workflows.' },
            { prob: 'Laggy user interfaces driving customer churn.', sol: 'Optimizing asset bundle size, running CSS payloads updates, and scripting fluid custom GSAP animations.' }
          ]" :key="idx"
            class="p-5 border border-primary/10 bg-surface-container-low/40 rounded-2xl transition-all duration-300"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
            :class="themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : themeStore.currentStyle === 'street' ? 'street-card' : ''">
            <div class="flex flex-col gap-3">
              <div class="flex items-start gap-2">
                <span class="font-mono font-black text-[9px] text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">PAIN POINT</span>
                <p class="text-xs font-body font-bold text-on-surface leading-snug">{{ ps.prob }}</p>
              </div>
              <div class="h-px bg-on-surface/5 my-1"></div>
              <div class="flex items-start gap-2">
                <span class="font-mono font-black text-[9px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">RESOLUTION</span>
                <p class="text-xs font-body font-medium text-emerald-500 leading-snug">{{ ps.sol }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SPECIALIZED SERVICES (3D CAROUSEL) -->
    <section id="services" ref="offeredServicesRef" class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 mb-24 md:mb-32 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-[calc(-0.06em)] mb-4 md:mb-6 uppercase leading-none text-on-surface">
          OFFERED <span class="text-primary italic">SERVICES</span>
        </h2>
        <p class="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg leading-relaxed font-body font-medium px-4 opacity-80">
          Deploying production-ready interactive configurations and automated backend workflows.
        </p>
      </div>

      <!-- ponytail: w-full removed to let negative margins expand block width correctly on both sides -->
      <div class="overflow-visible py-4 gsap-reveal offered-carousel-reveal -mx-6 md:-mx-12 xl:-mx-20 px-6 md:px-12 xl:px-20">
        <ThreeDCarousel :items="offeredServices" cardWidth="480px" v-slot="{ item: service, isActive }">
          <div 
            class="w-full p-4 md:p-8 transition-all duration-700 cursor-pointer active-spring"
            v-ripple
            v-tilt="{ max: 12, scale: 1.03 }"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '2rem' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
              themeStore.currentStyle === 'street' ? 'street-card border-2 border-black' : 
              'shadow-2xl border border-primary/10 bg-surface-container-low/80 backdrop-blur-md',
              isActive ? 'opacity-100 scale-100 filter-none' : 'opacity-40 scale-95 grayscale'
            ]"
          >
            <!-- Futuristic Image Banner -->
            <div v-if="service.image" class="w-full aspect-[21/9] overflow-hidden mb-4 md:mb-6 relative rounded-xl border border-primary/10">
              <img :src="service.image" :alt="service.title" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-surface-container-low/30 via-transparent to-transparent"></div>
            </div>

            <!-- Header and Description -->
            <div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div class="w-8 h-8 md:w-10 md:h-10 bg-primary/10 flex items-center justify-center shrink-0"
                :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0' : 'calc(var(--app-radius) / 5)' }">
                <component :is="service.icon" class="w-4.5 h-4.5 md:w-5 md:h-5 text-primary" />
              </div>
              <h3 class="font-headline text-sm sm:text-base md:text-xl font-black uppercase tracking-tight leading-tight text-on-surface">{{ service.title }}</h3>
            </div>
            <p class="text-on-surface-variant leading-relaxed text-xs md:text-base opacity-75 font-medium">{{ service.desc }}</p>
          </div>
        </ThreeDCarousel>
      </div>
    </section>

    </div> <!-- Close max-w-[1800px] container for full-width DNA block -->

    <!-- FEATURED PROJECTS (3D DNA SYSTEM LADDER) -->
    <section ref="projectsRef" class="w-full relative layer-base scroll-mt-32" id="work">
      <SynapticProjectsList />
    </section>

    <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pb-16 overflow-visible"> <!-- Reopen max-w-[1800px] container -->
      <!-- PROJECTS ARCHIVE TABLE (hidden on mobile and tablet — merged above in Engineered Projects) -->
      <div class="hidden lg:block">
        <ProjectsTable />
      </div>

    <!-- CORE PHILOSOPHY -->
    <section class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 -mx-6 md:-mx-12 px-8 md:px-12 py-20 md:py-32 relative overflow-hidden layer-base"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'bg-primary border-y-8 border-on-surface' : 
        themeStore.currentStyle === 'street' ? 'bg-on-surface-variant/20 border-y-4 border-primary' : 
        'bg-surface-container-lowest text-on-surface border-y border-primary/10'
      ]">
       <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/20 blur-[150px] md:blur-[250px] rounded-full pointer-events-none opacity-20"></div>
       
       <div class="max-w-5xl mx-auto text-center relative z-10">
         <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black mb-10 md:mb-16 tracking-tighter leading-[0.9] md:leading-[0.8] uppercase"
           :class="[
             themeStore.currentStyle === 'brutal' ? 'text-on-surface' : 'text-on-surface',
             themeStore.currentStyle === 'street' ? 'street-fx-radiant' : ''
           ]">
            ARCHITECTURE <br/> <span class="italic text-primary" :class="[
              themeStore.currentStyle === 'brutal' ? 'text-surface' : '',
              themeStore.currentStyle === 'street' ? 'street-fx-glitch' : ''
            ]">without compromise.</span>
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-20">
            <div v-for="(val, index) in ['SECURITY FIRST', 'ENGINEERING RIGOR', 'USER EXPERIENCE']" :key="val" 
              class="philosophy-card p-6 md:p-10 transition-all duration-500 group cursor-pointer active-spring"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'bg-surface border-4 border-on-surface-variant shadow-[8px_8px_0_0_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none' : 
                themeStore.currentStyle === 'street' ? 'street-card border-secondary/40 shadow-[10px_10px_0_0_#00ffff]' : 
                'bg-surface-container-low/40 backdrop-blur-md border border-primary/5 rounded-2xl md:rounded-[2.5rem] hover:border-primary/50',
                index === 2 ? 'md:col-span-2 lg:col-span-1' : ''
              ]" v-ripple>
               <p class="font-headline font-black text-lg md:text-2xl tracking-[0.2em] transition-opacity"
                 :class="[
                   themeStore.currentStyle === 'brutal' ? 'text-on-surface' : 'text-on-surface opacity-40 group-hover:opacity-100'
                 ]">{{ val }}</p>
            </div>
         </div>
       </div>
    </section>

    <!-- OUTCOME-DRIVEN TESTIMONIALS -->
    <section id="testimonials" class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">CLIENT DEBRIEFING</span>
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-on-surface">
          IMPACT <span class="text-primary italic">TESTIMONIALS</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div v-for="t in testimonials" :key="t.author"
          class="p-8 border border-primary/10 bg-surface-container-low/40 rounded-3xl text-left flex flex-col justify-between"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : themeStore.currentStyle === 'street' ? 'street-card' : ''">
          
          <div>
            <!-- Big Bold Metric Outlier -->
            <div class="text-primary font-headline font-black text-xl md:text-2xl tracking-wide mb-4 uppercase border-b border-primary/10 pb-3 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              {{ t.metric }}
            </div>
            
            <p class="text-on-surface-variant font-body font-medium text-sm md:text-base leading-relaxed italic mb-6">
              "{{ t.quote }}"
            </p>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-on-surface/5 font-mono">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-headline font-black text-xs text-primary uppercase">
              {{ t.author[0] }}
            </div>
            <div>
              <span class="block font-black text-[10px] uppercase text-on-surface leading-none mb-1">{{ t.author }}</span>
              <span class="block text-[8px] text-on-surface-variant/70 leading-none">{{ t.role }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOMEPAGE FAQ SECTION -->
    <section id="homepage-faq" class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">FREQUENT DEBRIEFS</span>
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-on-surface">
          SYSTEM <span class="text-primary italic">FAQ</span>
        </h2>
      </div>

      <div class="max-w-4xl mx-auto flex flex-col gap-4 text-left">
        <div 
          v-for="(faq, idx) in homeFaqs" 
          :key="faq.q"
          class="p-5 border border-primary/10 bg-surface-container-low/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-md cursor-pointer select-none"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
            themeStore.currentStyle === 'street' ? 'street-card' : 'hover:border-primary/30',
            homeActiveFaqIdx === idx ? 'border-primary/45 bg-surface-container-low/80 ring-1 ring-primary/10' : ''
          ]"
          @click="homeActiveFaqIdx = homeActiveFaqIdx === idx ? null : idx"
        >
          <div class="flex items-center justify-between gap-4">
            <h3 class="font-headline font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-on-surface leading-tight">
              {{ faq.q }}
            </h3>
            <ChevronDown 
              class="w-5 h-5 text-on-surface-variant/60 transition-transform duration-300 shrink-0"
              :class="{ 'rotate-180 text-primary': homeActiveFaqIdx === idx }"
            />
          </div>

          <div 
            class="transition-all duration-500 ease-in-out overflow-hidden"
            :style="{ maxHeight: homeActiveFaqIdx === idx ? '200px' : '0px' }"
          >
            <div class="pt-4 mt-4 border-t border-on-surface/5">
              <p class="text-on-surface-variant text-xs sm:text-sm font-body font-medium leading-relaxed opacity-90">
                {{ faq.a }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- LINK TO FULL FAQ PAGE -->
      <div class="text-center mt-10">
        <router-link 
          to="/faq" 
          class="font-mono text-xs font-black uppercase text-primary tracking-widest inline-flex items-center gap-2 hover:underline"
        >
          VIEW COMPLETE FAQ REGISTRY
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="mt-24 md:mt-32 lg:mt-40 xl:mt-48 text-center pb-16 md:pb-24 layer-base">
        <div class="cta-box p-10 md:p-20 relative overflow-hidden group shadow-3xl transition-all duration-1000"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
            themeStore.currentStyle === 'street' ? 'street-card bg-surface rotate-1' : 'bg-surface-container-low border border-primary/20 rounded-[2.5rem] md:rounded-[4rem]'
          ]">
           <div class="relative z-10 flex flex-col items-center">
             
             <!-- Availability and Urgency indicator -->
             <div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-primary/25 bg-surface-container-low/90 backdrop-blur-md mb-8 text-[9px] md:text-[10px] font-mono tracking-wider text-on-surface max-w-xs mx-auto">
               <span class="relative flex h-2 w-2">
                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                 <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span>AVAILABILITY: Q3 2026 // ONLY 2 SLOTS LEFT</span>
             </div>

             <h3 class="font-headline text-3xl md:text-5xl lg:text-6xl xl:text-8xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-on-surface text-balance"
               :class="{ 'street-fx-glow text-surface': themeStore.currentStyle === 'street' }">
               READY TO ARCHITECT<br/>YOUR <span class="text-primary italic underline decoration-wavy underline-offset-8" :class="{ 'text-secondary': themeStore.currentStyle === 'street' }">NEXT MILESTONE?</span>
             </h3>
             <router-link to="/contact" 
               class="px-10 md:px-20 py-5 md:py-8 font-black text-xs md:text-sm tracking-[0.25em] md:tracking-[0.3em] uppercase inline-flex items-center gap-4 md:gap-6 transition-all shadow-3xl active-spring"
               :class="[
                 themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-primary text-on-primary text-sm md:text-base' : 
                 themeStore.currentStyle === 'street' ? 'street-btn shadow-secondary text-sm md:text-base' : 
                 'bg-primary text-on-primary rounded-2xl md:rounded-[2rem] hover:scale-105 shadow-primary/30'
               ]" v-ripple>
               INITIATE PROTOCOL
               <Terminal class="w-6 h-6 md:w-8 md:h-8" />
             </router-link>
           </div>
           
           <div v-if="themeStore.currentStyle === 'brutal'" class="absolute -top-10 -right-10 opacity-10 rotate-12">
             <Terminal class="w-48 h-48 md:w-96 md:h-96 text-on-surface" />
           </div>
        </div>
    </section>
  </div>
  </div>
</template>
