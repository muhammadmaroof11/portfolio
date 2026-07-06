<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { LayoutDashboard, Zap, Smartphone, Globe, Terminal } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const { skills } = portfolioData

onMounted(async () => {
  await nextTick()
  
  gsap.set('.gsap-reveal', { autoAlpha: 0, y: 30 })

  gsap.to('.skills-header > *', {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out'
  })

  gsap.to('.gsap-reveal', {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set('.gsap-reveal', { clearProps: "transform" })
    }
  })
})

const categories = [
  { name: 'Architecture', icon: LayoutDashboard, skills: skills.filter(s => s.category === 'Frontend' || s.category === 'Backend') },
  { name: 'Mobile Ecosystem', icon: Smartphone, skills: skills.filter(s => s.category === 'Mobile') },
  { name: 'Intelligence & Data', icon: Zap, skills: skills.filter(s => s.category === 'AI & Data') },
  { name: 'Cloud & Infrastructure', icon: Globe, skills: skills.filter(s => s.category === 'Backend') }
]
</script>

<template>
  <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-16 md:pt-24 pb-16 overflow-visible">
    <!-- HERO HEADER -->
    <header class="mb-16 md:mb-24 skills-header">
      <div class="max-w-3xl">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-6 md:mb-8 block">Technical Competencies</span>
        <h1 class="text-5xl md:text-7xl xl:text-8xl font-headline font-black text-on-background tracking-[calc(-0.06em)] leading-[0.9] md:leading-[0.8] mb-8 md:mb-12 uppercase">
          ENGINEERING <br/><span class="text-primary italic">ARSENAL.</span>
        </h1>
        <p class="text-lg md:text-xl leading-relaxed font-body max-w-2xl opacity-80 font-medium text-on-surface-variant">
          A curate-selected stack engineered for performance, security, and extreme scalability. From machine-level logic to high-abstraction interfaces.
        </p>
      </div>
    </header>

    <!-- SKILLS CATALOG -->
    <div class="space-y-16 md:space-y-24">
      <div v-for="cat in categories" :key="cat.name" class="gsap-reveal group">
        <!-- Section "Table" Header -->
        <div class="flex items-center gap-6 mb-8 border-b border-on-surface/10 pb-4 relative">
          <div class="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0"
            :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">
            <component :is="cat.icon" class="w-5 h-5 text-primary" />
          </div>
          <h3 class="font-headline font-black text-2xl md:text-4xl uppercase tracking-[calc(-0.04em)] text-on-surface flex-grow">{{ cat.name }}</h3>
          <div class="hidden md:block font-label text-[9px] font-bold tracking-[0.4em] text-primary uppercase opacity-60">System Module :: {{ cat.skills.length }} Nodes</div>
          <div class="absolute bottom-[-2px] left-0 w-24 h-[4px] bg-primary rounded-full"></div>
        </div>

        <!-- Skills Grid Under Category Header -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="skill in cat.skills" :key="skill.name"
            class="skill-card p-6 md:p-8 transition-all duration-700 gsap-reveal group cursor-pointer active-spring"
            :style="{ borderRadius: 'var(--app-radius)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card' : 
              themeStore.currentStyle === 'street' ? 'street-card' : 
              'bg-surface-container-low hover:bg-surface-container shadow-xl border border-primary/5'
            ]" v-ripple>
            <div class="flex items-center gap-6">
              <div class="w-12 h-12 flex items-center justify-center text-xl font-black shadow-lg bg-surface relative z-10 shrink-0 p-2.5 overflow-hidden"
                :style="{ color: skill.color, borderRadius: 'calc(var(--app-radius) / 3)' }"
                :class="[
                  themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface p-1' : '',
                  themeStore.currentStyle === 'street' ? 'border border-primary ring-2 ring-secondary/20' : ''
                ]">
                <i v-if="skill.faIcon" :class="skill.faIcon" class="text-3xl" :style="{ color: skill.color }"></i>
                <img v-else :src="skill.iconUrl || `https://skillicons.dev/icons?i=${skill.slug}`" 
                  :alt="skill.name" 
                  class="w-full h-full object-contain transition-all duration-500 hover:scale-110" />
              </div>
              <div class="min-w-0">
                <h4 class="text-lg md:text-xl font-headline font-black uppercase tracking-tighter text-on-surface leading-tight break-words">{{ skill.name }}</h4>
                <div class="flex items-center gap-2 mt-2 opacity-40">
                   <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: skill.color }"></div>
                   <span class="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">{{ skill.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOATING MARQUEE (Decorative) -->
    <div class="mt-48 -mx-6 md:-mx-12 overflow-hidden py-16 opacity-10 pointer-events-none">
       <div class="flex gap-24 animate-scroll-left whitespace-nowrap">
          <span v-for="skill in skills" :key="skill.name" 
            class="text-[12rem] font-black font-headline uppercase leading-none"
            :style="{ color: skill.color }">
            {{ skill.name }}
          </span>
       </div>
    </div>
  </div>
</template>
