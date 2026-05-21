<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Download, Terminal, Cpu, Smartphone, Globe, Zap } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const { profile, projects } = portfolioData
const featuredProjects = projects.filter(p => p.featured)

const heroRef = ref(null)
const servicesRef = ref(null)
const projectsRef = ref(null)

onMounted(async () => {
  await nextTick()
  
  // Set initial states to avoid 'stuck hidden' elements
  gsap.set('.gsap-reveal', { autoAlpha: 0, y: 30 })

  // Hero Animation
  gsap.to('.hero-content > *', {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })

  // Services Animation
  gsap.to('.service-card', {
    scrollTrigger: {
      trigger: servicesRef.value,
      start: 'top 85%',
    },
    y: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    onComplete: () => {
      gsap.set('.service-card', { clearProps: "transform" })
    }
  })

  // Projects Animation
  gsap.to('.project-item', {
    scrollTrigger: {
      trigger: projectsRef.value,
      start: 'top 75%',
    },
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.15,
    ease: 'expo.out',
    onComplete: () => {
      gsap.set('.project-item', { clearProps: "transform" })
    }
  })
})

const services = [
  { title: 'Full Stack Engineering', desc: 'Architecting robust web ecosystems using Vue.js, Node.js, and modern databases.', icon: Globe },
  { title: 'Mobile First Development', desc: 'High-performance cross-platform apps with Flutter and Ionic Capacitor.', icon: Smartphone },
  { title: 'AI & Data Integration', desc: 'Orchestrating agentic AI workflows and real-time data streaming solutions.', icon: Cpu },
  { title: 'Game Development', desc: 'Immersive multiplayer experiences built with Unity and high-fidelity rendering.', icon: Zap }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 pt-6 md:pt-16 pb-16 overflow-visible">
    <!-- HERO SECTION -->
    <header ref="heroRef" class="relative min-h-[calc(100vh-120px)] flex items-center mb-12 md:mb-24 layer-base overflow-visible">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full relative overflow-visible">
        <div class="order-2 lg:order-1 hero-content layer-content relative z-10 overflow-visible">
          <div class="gsap-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/40 text-primary font-black text-[8px] md:text-[9px] tracking-[0.3em] mb-4 md:mb-6 uppercase">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {{ profile.availability }}
          </div>
          
          <h1 class="gsap-reveal app-h1 mb-6 md:mb-8 relative !overflow-visible">
            <span class="block whitespace-nowrap !overflow-visible" 
              :class="[
                themeStore.currentStyle === 'street' ? 'street-fx-radiant street-fx-glitch' : ''
              ]">{{ profile.name.split(' ')[0] }}</span>
            <span class="text-primary italic block whitespace-nowrap !overflow-visible" 
              :class="[
                themeStore.currentStyle === 'street' ? 'street-fx-glitch' : ''
              ]">{{ profile.name.split(' ').slice(1).join(' ') }}</span>
          </h1>
          
          <p class="gsap-reveal text-base md:text-xl text-on-surface-variant max-w-lg mb-8 md:mb-10 leading-relaxed font-body font-medium">
            {{ profile.role }}. Bridging the gap between creative vision and technical precision with <span class="text-on-surface font-black">Scalable Architectures</span>.
          </p>

          <div class="gsap-reveal flex flex-col sm:flex-row gap-4 md:gap-6">
            <router-link to="/contact" 
              class="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 font-black text-[8px] md:text-[9px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-3 group shadow-2xl relative overflow-hidden active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-primary text-on-primary' : 
                'bg-gradient-to-br from-primary to-primary-dim text-on-primary hover:scale-[1.05] shadow-primary/20'
              ]" v-ripple>
              Contact Me <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </router-link>
            <a href="/Muhammad_Maroof_CV.pdf" download="Muhammad_Maroof_CV.pdf"
              class="flex-1 md:flex-none px-6 md:px-8 py-4 md:py-5 font-black text-[8px] md:text-[9px] tracking-[0.4em] uppercase transition-all shadow-xl group border border-surface-container-high flex items-center justify-center active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-surface-container text-on-surface' : 
                'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              ]" v-ripple>
              Curriculum Vitae <Download class="w-4 h-4 inline-block ml-3 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>

        <!-- Hero Visual (Optimized for Transparent Portrait) -->
        <div class="relative order-1 lg:order-2 flex justify-center lg:justify-end layer-visual group z-30 mb-6 lg:mb-0 overflow-visible">
          <!-- Stylistic Backdrop Glow -->
          <div class="absolute inset-0 scale-[1.2] blur-[80px] md:blur-[120px] opacity-40 transition-all duration-1000 z-0"
            :class="[
              themeStore.currentStyle === 'street' ? 'bg-gradient-to-br from-primary via-secondary to-primary/20 animate-pulse' : 
              themeStore.currentStyle === 'brutal' ? 'bg-on-surface opacity-10' : 
              'bg-gradient-to-tr from-primary/30 to-primary-dim/10'
            ]"></div>
          
          <div class="relative w-full max-w-[220px] md:max-w-[420px] transition-all duration-1000 z-10 flex items-end justify-center pt-10 overflow-visible"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'border-4 border-on-surface' : 
              themeStore.currentStyle === 'street' ? 'street-card !rounded-[2rem] md:!rounded-[4rem]' : 
              'rounded-t-full'
            ]"
            :style="{ 
              backgroundColor: themeStore.currentStyle === 'minimal' ? 'rgba(168, 85, 247, 0.1)' : 
                               themeStore.currentStyle === 'street' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              borderRadius: themeStore.currentStyle === 'minimal' ? '100% 100% 2rem 2rem' : '',
              borderBottom: themeStore.currentStyle === 'minimal' ? '4px solid var(--color-primary)' : ''
            }">
            
            <img src="/1.png" 
              alt="Muhammad Maroof" 
              class="w-full h-auto object-cover transition-all duration-1000 group-hover:scale-105 z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
            
            <!-- Decorative Street Elements -->
            <div v-if="themeStore.currentStyle === 'street'" class="absolute top-0 right-0 p-4 street-fx-radiant font-black text-xl rotate-12 -translate-y-6">ARCHITECT</div>
            <div v-if="themeStore.currentStyle === 'street'" class="absolute bottom-10 left-0 p-2 bg-secondary text-surface font-black text-[9px] -rotate-12 translate-x-[-20%]">SYSTEM_PROTOCOL_V4</div>
          </div>

          <div class="absolute -bottom-4 md:-bottom-8 -left-2 md:-left-16 p-4 md:p-8 shadow-3xl max-w-[140px] md:max-w-[260px] transition-all duration-700 hover:-translate-y-4 z-20 !absolute"
            :style="{ borderRadius: 'calc(var(--app-radius) / 1.5)' }"
            :class="[
              themeStore.currentStyle === 'street' ? 'bg-surface border-4 border-on-surface shadow-[8px_8px_0_0_var(--color-secondary)]' : 
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
              'bg-surface/90 backdrop-blur-md border border-primary/20 text-on-surface'
            ]">
            <div class="text-2xl md:text-5xl font-headline font-black text-primary mb-1 md:mb-2 leading-none italic"
              :class="{ 'street-fx-radiant !not-italic': themeStore.currentStyle === 'street' }">10+</div>
            <div class="text-[6px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.4em] leading-tight opacity-50 text-on-surface">Enterprise Ready Implementations</div>
          </div>
        </div>
      </div>
    </header>

    <section id="strategy" ref="servicesRef" class="mt-24 md:mt-48 mb-24 md:mb-48 relative layer-base scroll-mt-32">
      <div class="mb-12 md:mb-20 text-center">
        <h2 class="font-headline text-4xl md:text-6xl xl:text-7xl font-black tracking-[calc(-0.06em)] mb-4 md:mb-6 uppercase leading-none text-on-surface"
          :class="{ 'street-fx-glow text-surface': themeStore.currentStyle === 'street' }">STRATEGIC <span class="text-primary italic" :class="{ 'text-secondary': themeStore.currentStyle === 'street' }">PILLARS</span></h2>
        <p class="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg leading-relaxed font-body font-medium px-4 opacity-80">
          Architecting resilient digital ecosystems that transform complex requirements into seamless experiences.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <div v-for="service in services" :key="service.title" 
          class="service-card gsap-reveal p-8 md:p-10 transition-all duration-700 cursor-pointer active-spring"
          :style="{ borderRadius: 'var(--app-radius)' }"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
            themeStore.currentStyle === 'street' ? 'street-card' : 
            'bg-surface-container-low hover:bg-surface-container shadow-xl border border-primary/5'
          ]" v-ripple>
          <div class="w-12 h-12 md:w-14 md:h-14 bg-primary/10 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform"
            :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">
            <component :is="service.icon" class="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <h3 class="font-headline text-lg md:text-xl font-black mb-3 md:mb-4 uppercase tracking-tight leading-none text-on-surface">{{ service.title }}</h3>
          <p class="text-on-surface-variant leading-relaxed text-sm md:text-base opacity-70 font-medium">{{ service.desc }}</p>
        </div>
      </div>
    </section>

    <section class="mt-24 md:mt-48 -mx-6 md:-mx-12 overflow-hidden border-y border-primary/20 relative"
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

    <!-- FEATURED PROJECTS -->
    <section ref="projectsRef" class="mt-24 md:mt-48 scroll-mt-32 relative layer-base" id="work">
      <div class="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-20 px-4 gap-12">
        <div class="max-w-3xl">
          <h2 class="font-headline text-4xl md:text-7xl xl:text-8xl font-black tracking-[calc(-0.05em)] mb-4 md:mb-6 uppercase leading-[0.85] text-on-surface"
            :class="{ 'street-fx-outline': themeStore.currentStyle === 'street' }">SELECTED <span class="text-primary italic">LEGACIES.</span></h2>
          <div class="w-24 md:w-32 h-2 md:h-3 bg-primary rounded-full"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div v-for="(project, index) in featuredProjects" :key="project.id"
          class="project-item gsap-reveal group relative overflow-hidden transition-all duration-1000 cursor-pointer active-spring"
          :style="{ borderRadius: 'calc(var(--app-radius) * 1.2)' }" v-ripple>
          <div class="aspect-[16/10] overflow-hidden relative"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'border-4 border-on-surface' : 'shadow-2xl border border-primary/5'
            ]">
            <img :src="project.image" :alt="project.title" 
              class="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-10"></div>
            
            <div class="p-6 md:p-10 absolute bottom-0 left-0 right-0 translate-y-16 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20">
              <div class="flex flex-col h-full justify-between items-start">
                <div class="flex flex-wrap gap-2 mb-4 md:mb-6">
                   <span v-for="tag in project.tech" :key="tag" 
                    class="text-[8px] md:text-[9px] font-black text-white px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md border border-white/10 uppercase tracking-[0.2em]"
                    :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">
                     {{ tag }}
                   </span>
                </div>
                <div class="flex justify-between items-end w-full gap-4">
                  <div class="max-w-[75%]">
                    <h3 class="text-2xl md:text-4xl xl:text-5xl font-headline font-black tracking-tighter text-white uppercase leading-none truncate">{{ project.title }}</h3>
                    <p class="text-white/80 text-[10px] md:text-sm mt-2 md:mt-4 font-body leading-relaxed line-clamp-2">{{ project.description }}</p>
                  </div>
                  <a v-if="project.link && project.link !== '#'" :href="project.link" target="_blank" class="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary text-on-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shrink-0"
                    :style="{ borderRadius: 'calc(var(--app-radius) / 3)' }"
                    :class="{ 'brutal-btn border-2 border-on-surface': themeStore.currentStyle === 'brutal' }">
                    <ArrowRight class="w-5 h-5 md:w-7 md:h-7 -rotate-45" />
                  </a>
                  <div v-else-if="project.hoverText" class="px-4 py-2 rounded-xl bg-primary text-on-primary font-black uppercase text-[10px] md:text-xs flex items-center justify-center shrink-0 border border-primary/20 whitespace-nowrap transition-all shadow-2xl"
                    :style="{ borderRadius: 'calc(var(--app-radius) / 3)' }">
                    {{ project.hoverText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CORE PHILOSOPHY -->
    <section class="mt-24 md:mt-48 -mx-6 md:-mx-12 px-8 md:px-12 py-20 md:py-32 relative overflow-hidden layer-base"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'bg-primary border-y-8 border-on-surface' : 
        themeStore.currentStyle === 'street' ? 'bg-on-surface-variant/20 border-y-4 border-primary' : 
        'bg-surface-container-lowest text-on-surface border-y border-primary/10'
      ]">
       <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/20 blur-[150px] md:blur-[250px] rounded-full pointer-events-none opacity-20"></div>
       
       <div class="max-w-5xl mx-auto text-center relative z-10">
         <h2 class="font-headline text-4xl md:text-7xl xl:text-8xl font-black mb-10 md:mb-16 tracking-tighter leading-[0.9] md:leading-[0.8] uppercase"
           :class="[
             themeStore.currentStyle === 'brutal' ? 'text-on-surface' : 'text-on-surface',
             themeStore.currentStyle === 'street' ? 'street-fx-radiant' : ''
           ]">
            ARCHITECTURE <br/> <span class="italic text-primary" :class="[
              themeStore.currentStyle === 'brutal' ? 'text-surface' : '',
              themeStore.currentStyle === 'street' ? 'street-fx-glitch' : ''
            ]">without compromise.</span>
         </h2>
         <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-12 md:mt-20">
            <div v-for="val in ['SECURITY FIRST', 'ENGINEERING RIGOR', 'USER EXPERIENCE']" :key="val" 
              class="p-6 md:p-10 transition-all duration-500 group cursor-pointer active-spring"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'bg-surface border-4 border-on-surface-variant shadow-[8px_8px_0_0_#000000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none' : 
                themeStore.currentStyle === 'street' ? 'street-card border-secondary/40 shadow-[10px_10px_0_0_#00ffff]' : 
                'bg-surface-container-low/40 backdrop-blur-md border border-primary/5 rounded-2xl md:rounded-[2.5rem] hover:border-primary/50'
              ]" v-ripple>
               <p class="font-headline font-black text-lg md:text-2xl tracking-[0.2em] transition-opacity"
                 :class="[
                   themeStore.currentStyle === 'brutal' ? 'text-on-surface' : 'text-on-surface opacity-40 group-hover:opacity-100'
                 ]">{{ val }}</p>
            </div>
         </div>
       </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="mt-24 md:mt-48 text-center pb-16 md:pb-24 layer-base">
        <div class="p-10 md:p-20 relative overflow-hidden group shadow-3xl transition-all duration-1000"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
            themeStore.currentStyle === 'street' ? 'street-card bg-surface rotate-1' : 'bg-surface-container-low border border-primary/20 rounded-[2.5rem] md:rounded-[4rem]'
          ]">
           <div class="relative z-10">
             <h3 class="font-headline text-3xl md:text-7xl xl:text-8xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-on-surface text-balance"
               :class="{ 'street-fx-glow text-surface': themeStore.currentStyle === 'street' }">
               READY TO ARCHITECT<br/>YOUR <span class="text-primary italic underline decoration-wavy underline-offset-8" :class="{ 'text-secondary': themeStore.currentStyle === 'street' }">NEXT MILESTONE?</span>
             </h3>
             <router-link to="/contact" 
               class="px-10 md:px-20 py-5 md:py-8 font-black text-[10px] md:text-[12px] tracking-[0.4em] md:tracking-[0.5em] uppercase inline-flex items-center gap-4 md:gap-6 transition-all shadow-3xl active-spring"
               :class="[
                 themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-primary text-on-primary text-sm md:text-base' : 
                 themeStore.currentStyle === 'street' ? 'street-btn shadow-secondary' : 
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
</template>
