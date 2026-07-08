<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { GraduationCap, Briefcase, Calendar, MapPin, School, Terminal } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const { experience, profile, education } = portfolioData

onMounted(async () => {
  await nextTick()
  
  gsap.set('.gsap-reveal', { autoAlpha: 0, y: 30 })

  gsap.to('.exp-header > *', {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out'
  })

  gsap.to('.exp-item', {
    scrollTrigger: {
      trigger: '.exp-item',
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.2
  })

  gsap.to('.sidebar-card', {
    scrollTrigger: {
      trigger: '.sidebar-card',
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out'
  })
})
</script>

<template>
  <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-16 md:pt-24 pb-16 overflow-visible">
    <!-- HERO HEADER -->
    <header class="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-16 exp-header">
      <div class="max-w-3xl">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-8 block">Professional Odyssey</span>
        <h1 class="app-h1 mb-8 md:mb-10 text-on-surface">
          CHRONOLOGY & <span class="text-primary italic underline decoration-8 underline-offset-[12px]">RIGOR.</span>
        </h1>
      </div>
      <div class="hidden md:flex flex-col gap-4 items-end">
        <div class="bg-primary w-40 h-3 rounded-full"></div>
        <div class="bg-surface-container-high w-64 h-3 rounded-full"></div>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 overflow-visible mb-24">
      <!-- TIMELINE COLUMN -->
      <div class="lg:col-span-8 relative">
        <!-- Vertical Line -->
        <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-surface-container-high to-transparent ml-4 md:ml-8 lg:ml-0 opacity-20"></div>
        
        <div class="space-y-16 md:space-y-24 relative">
          <div v-for="(job, i) in experience" :key="i" 
            class="exp-item gsap-reveal relative pl-12 md:pl-20 group transition-all duration-700">
            <!-- Bullet -->
            <div class="absolute left-[-2px] top-4 w-4 h-4 rounded-full bg-primary ring-6 ring-primary/5 transition-all duration-500 group-hover:scale-[1.8] group-hover:ring-[15px] md:left-[9px] lg:left-[-4px] z-10"></div>
            
            <div class="p-8 md:p-12 transition-all duration-1000 relative overflow-hidden group shadow-2xl active-spring cursor-pointer"
              :style="{ borderRadius: 'var(--app-radius)' }"
              :class="[
                themeStore.currentStyle === 'brutal' ? 'brutal-card' : 
                themeStore.currentStyle === 'street' ? 'street-card' : 'bg-surface-container-low hover:bg-surface-container border border-primary/5 hover:border-primary/20'
              ]" v-ripple>
              
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div class="max-w-full">
                  <h3 class="text-2xl md:text-4xl font-headline font-black text-on-surface leading-[0.9] mb-3 uppercase tracking-tighter break-words">{{ job.role }}</h3>
                  <div class="flex flex-wrap items-center gap-3">
                    <span class="text-primary font-black text-lg md:text-2xl italic tracking-tight break-words">{{ job.company }}</span>
                    <span class="w-2 h-2 rounded-full bg-primary/20 hidden md:inline-block"></span>
                    <span class="text-on-surface-variant font-black text-[9px] tracking-[0.3em] uppercase opacity-40">{{ job.period }}</span>
                  </div>
                </div>
                <div v-if="job.status" class="flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/10 relative z-10 shrink-0">
                   <div class="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                   <span class="font-black tracking-[0.2em] text-[8px] uppercase whitespace-nowrap">Active Command</span>
                </div>
              </div>

              <p class="text-on-surface leading-snug mb-10 font-body font-medium text-base md:text-xl opacity-90 break-words">{{ job.description }}</p>
              
              <div class="flex flex-wrap gap-3">
                <span v-for="tag in job.tags" :key="tag" 
                  class="px-5 py-2 rounded-xl bg-surface text-[10px] font-black uppercase tracking-widest text-on-surface/60 border border-surface-container transition-all hover:border-primary hover:text-primary active-spring cursor-pointer" v-ripple>
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR COLUMN -->
      <div class="lg:col-span-4 space-y-12">
        <!-- Academic Records -->
        <section class="sidebar-card gsap-reveal p-10 md:p-14 transition-all duration-1000 relative overflow-hidden"
          :style="{ borderRadius: 'var(--app-radius)' }"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 'bg-surface-container shadow-2xl border border-primary/5'
          ]">
          <h2 class="text-3xl md:text-4xl font-headline font-black text-on-surface mb-16 border-l-[8px] border-primary pl-10 uppercase tracking-tighter leading-none">ACADEMIC <br/> BLUEPRINT</h2>
          
          <div class="space-y-16 relative z-10">
            <div v-for="(edu, i) in education" :key="i" class="group relative pb-8 border-b border-on-surface/5 last:border-0 last:pb-0 cursor-pointer active-spring" v-ripple>
              <p class="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-4">{{ edu.period }}</p>
              <h4 class="text-2xl md:text-3xl font-black font-headline leading-tight mb-4 tracking-tight uppercase group-hover:text-primary transition-colors text-on-surface break-words">{{ edu.degree }}</h4>
              <p class="text-on-surface-variant text-sm mb-6 font-black opacity-60 leading-tight uppercase break-words">{{ edu.institution }}</p>
              
              <div class="flex flex-wrap gap-2">
                <span v-for="t in edu.tags" :key="t" 
                  class="text-[8px] font-black tracking-[0.15em] uppercase text-on-surface-variant/40 bg-surface/40 px-4 py-2 border border-surface-container-high group-hover:border-primary/30 transition-colors"
                  :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">
                  {{ t }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Availability CTA Card - FULL WIDTH -->
    <div class="sidebar-card gsap-reveal p-10 md:p-16 bg-on-surface text-surface relative overflow-hidden group shadow-4xl hover:scale-[1.01] transition-all duration-1000 mt-24"
      :style="{ borderRadius: 'calc(var(--app-radius) * 1.5)' }"
      :class="{ 'brutal-card border-8 border-primary': themeStore.currentStyle === 'brutal' }">
      <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-24 w-full">
        <div class="max-w-3xl">
          <div class="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2.5rem] bg-primary/20 flex items-center justify-center mb-8 md:mb-10 group-hover:rotate-[20deg] transition-transform duration-700">
             <Terminal class="w-8 h-8 md:w-10 md:h-10 text-primary" />
          </div>
          <h3 class="text-4xl md:text-7xl font-headline font-black mb-8 leading-[0.9] md:leading-[0.8] tracking-tighter uppercase underline decoration-primary/50 underline-offset-8 break-words">ENGINEERING <br/> THE FUTURE.</h3>
          <p class="text-surface-variant/40 text-lg md:text-2xl leading-relaxed font-body font-medium break-words">Seeking elite cross-functional projects and strategic development mandates across the digital spectrum.</p>
        </div>
        <div class="w-full md:w-auto">
          <router-link to="/contact" 
            class="w-full md:w-auto px-10 py-6 md:px-16 md:py-10 bg-primary text-on-primary font-black font-label text-[12px] md:text-[16px] tracking-[0.4em] md:tracking-[0.6em] hover:translate-y-[-10px] transition-all shadow-4xl shadow-primary/40 uppercase inline-flex justify-center items-center active-spring"
            :style="{ borderRadius: 'calc(var(--app-radius))' }" v-ripple>
            INITIATE CONTACT
          </router-link>
        </div>
      </div>
      <!-- Decorative background icon -->
      <Terminal class="absolute right-[-10%] top-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-surface-variant opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
    </div>
  </div>
</template>
