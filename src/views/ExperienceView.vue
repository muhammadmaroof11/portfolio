<script setup>
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { GraduationCap, Briefcase, Calendar, MapPin, School, Terminal } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FuzzyText from '../components/FuzzyText.vue'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const { experience, profile, education } = portfolioData

onMounted(async () => {
  await nextTick()
  
  // Header animation
  gsap.fromTo('.exp-header > *', 
    { autoAlpha: 0, y: 30 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 1,
      stagger: 0.15,
      ease: 'power4.out'
    }
  )

  // Experience timeline nodes entering from left as you scroll
  gsap.utils.toArray('.exp-item').forEach((item) => {
    gsap.fromTo(item, 
      { autoAlpha: 0, x: -50 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })

  // Sidebar cards entering from right as you scroll
  gsap.utils.toArray('.sidebar-card').forEach((card) => {
    gsap.fromTo(card,
      { autoAlpha: 0, x: 50 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    )
  })
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-12 md:pt-16 pb-12 overflow-visible">
    <!-- HERO HEADER -->
    <header class="mb-10 md:mb-12 flex flex-col md:flex-row justify-between items-end gap-8 exp-header">
      <div class="max-w-3xl">
        <h1 class="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-headline font-black text-on-surface tracking-[calc(-0.06em)] leading-none mb-4 md:mb-6 uppercase flex flex-wrap lg:flex-nowrap items-baseline gap-x-3 md:gap-x-4">
          <span>PROFESSIONAL</span>
          <FuzzyText 
            color="var(--color-primary)" 
            font-style="italic"
            font-size="clamp(1.8rem, 4.5vw, 4.4rem)"
            font-weight="900"
            font-family="inherit"
            class-name="text-primary italic inline-block select-none"
            :base-intensity="0.15"
            :hover-intensity="0.45"
            :fuzz-range="18"
            :enable-hover="true"
          >
            JOURNEY.
          </FuzzyText>
        </h1>
      </div>
      <div class="hidden md:flex flex-col gap-2 items-end">
        <div class="bg-primary w-24 h-1.5 rounded-full"></div>
        <div class="bg-surface-container-high w-40 h-1.5 rounded-full"></div>
      </div>
    </header>

    <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12 overflow-visible mb-16">
      <!-- TIMELINE COLUMN -->
      <div class="xl:col-span-8 relative">
        <!-- Vertical Line -->
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-surface-container-high to-transparent ml-4 md:ml-8 xl:ml-0 opacity-20"></div>
        
        <div class="space-y-10 md:space-y-12 relative">
          <div v-for="(job, i) in experience" :key="i" 
            class="exp-item relative pl-10 md:pl-16 group transition-all duration-700">
            <!-- Bullet -->
            <div class="absolute left-[-2px] top-3 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-primary/5 transition-all duration-500 group-hover:scale-[1.5] group-hover:ring-[10px] md:left-[9px] xl:left-[-4px] z-10"></div>
            
            <div class="exp-card-wrapper flex flex-col relative">
              <!-- TOP CARD (TRAY): Tags & Deployment Status -->
              <div class="exp-top-card relative shadow-lg"
                :style="{ 
                  borderTopLeftRadius: 'var(--app-radius)',
                  borderTopRightRadius: 'var(--app-radius)',
                  borderBottomLeftRadius: '0px',
                  borderBottomRightRadius: '0px'
                }"
                :class="[
                  themeStore.currentStyle === 'brutal' ? 'border-4 border-b-0 border-on-background bg-surface-container-high' : 
                  themeStore.currentStyle === 'street' ? 'border border-b-0 border-primary/20 bg-surface-container/95' : 'bg-surface-container border border-b-0 border-primary/5'
                ]"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between border-b border-on-surface/5 pb-1.5">
                    <span class="font-mono text-[8px] uppercase tracking-widest text-primary font-bold">TECH STACK INTEGRATION</span>
                    <span class="font-mono text-[8px] opacity-40">DEPLOYS // OK</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in job.tags" :key="tag" 
                      class="px-2.5 py-1 rounded bg-surface text-[8px] font-black uppercase tracking-wider text-on-surface/65 border border-surface-container transition-all hover:border-primary hover:text-primary active-spring cursor-pointer" v-ripple>
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- FRONT CARD: Main Job Info -->
              <div class="exp-front-card p-6 md:p-8 transition-all duration-500 relative z-20 cursor-pointer shadow-lg"
                :style="{ borderRadius: 'var(--app-radius)' }"
                :class="[
                  themeStore.currentStyle === 'brutal' ? 'brutal-card border-4 border-on-background bg-surface' : 
                  themeStore.currentStyle === 'street' ? 'street-card border-primary/20 bg-surface-container-low/95' : 'bg-surface-container-low hover:bg-surface-container border border-primary/5 hover:border-primary/20'
                ]" v-ripple>
                
                <!-- Corner Decors -->
                <div class="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-25 group-hover:opacity-60 transition-opacity border-primary"></div>
                <div class="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-25 group-hover:opacity-60 transition-opacity border-primary"></div>
                <div class="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-25 group-hover:opacity-60 transition-opacity border-primary"></div>
                <div class="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-25 group-hover:opacity-60 transition-opacity border-primary"></div>

                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <div class="max-w-full">
                    <h3 class="text-xl md:text-2xl font-headline font-black text-on-surface leading-tight mb-1.5 uppercase tracking-tighter break-words">{{ job.role }}</h3>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-primary font-black text-base md:text-lg italic tracking-tight break-words">{{ job.company }}</span>
                      <span v-if="job.location" class="text-on-surface/40 font-body text-xs">| {{ job.location }}</span>
                      <span class="w-1.5 h-1.5 rounded-full bg-primary/20 hidden md:inline-block"></span>
                      <span class="text-on-surface-variant font-mono text-[8px] tracking-wider uppercase opacity-55">{{ job.period }}</span>
                    </div>
                  </div>
                  <div v-if="job.status" class="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg border border-primary/10 relative z-10 shrink-0">
                     <div class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                     <span class="font-black tracking-[0.2em] text-[8px] uppercase whitespace-nowrap">Active Command</span>
                  </div>
                </div>

                <p class="text-on-surface leading-snug font-body font-medium text-sm md:text-base opacity-95 break-words">{{ job.description }}</p>
              </div>

              <!-- BACK CARD / BOTTOM CARD (TRAY): Detailed Achievements & Status -->
              <div class="exp-bottom-card relative z-10 shadow-xl flex flex-col gap-4"
                :style="{ 
                  borderBottomLeftRadius: 'var(--app-radius)',
                  borderBottomRightRadius: 'var(--app-radius)',
                  borderTopLeftRadius: '0px',
                  borderTopRightRadius: '0px'
                }"
                :class="[
                  themeStore.currentStyle === 'brutal' ? 'border-4 border-t-0 border-on-background bg-surface-container-high' : 
                  themeStore.currentStyle === 'street' ? 'border border-t-0 border-primary/20 bg-surface-container/95' : 'bg-surface-container border border-t-0 border-primary/5'
                ]"
              >
                <!-- Detailed Bullet Achievements -->
                <div class="flex flex-col gap-3">
                  <div class="flex items-center justify-between border-b border-on-surface/5 pb-1.5">
                    <span class="font-mono text-[8px] uppercase tracking-widest text-primary font-bold">CORE RESPONSIBILITIES & DEPLOYMENTS</span>
                    <span class="font-mono text-[8px] opacity-40">INTEGRITY // 100%</span>
                  </div>
                  <ul class="space-y-2.5 text-on-surface/85 font-body text-xs md:text-sm list-none pl-0">
                    <li v-for="(bullet, index) in job.bullets" :key="index" class="flex items-start gap-2 leading-relaxed">
                      <span class="text-primary font-black shrink-0 text-base leading-none mt-0.5">•</span>
                      <span>{{ bullet }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Bottom Status Bar -->
                <div class="exp-status-bar h-7 flex items-center justify-center font-mono text-[8px] font-black uppercase tracking-widest text-background"
                  :style="{ 
                    borderBottomLeftRadius: 'calc(var(--app-radius) - 4px)',
                    borderBottomRightRadius: 'calc(var(--app-radius) - 4px)',
                    backgroundColor: job.status ? 'var(--color-primary)' : 'var(--color-secondary)'
                  }"
                >
                  {{ job.status ? 'SYSTEM ONLINE // CONNECTED' : 'ARCHIVE LOADED // STATIC' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SIDEBAR COLUMN -->
      <div class="xl:col-span-4 space-y-8">
        <!-- Academic Records -->
        <section class="sidebar-card p-6 md:p-8 transition-all duration-1000 relative overflow-hidden"
          :style="{ borderRadius: 'var(--app-radius)' }"
          :class="[
            themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 'bg-surface-container shadow-xl border border-primary/5'
          ]">
          <!-- Corner Decors -->
          <div class="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-25 border-primary"></div>
          <div class="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-25 border-primary"></div>
          <div class="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-25 border-primary"></div>
          <div class="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-25 border-primary"></div>

          <h2 class="text-xl md:text-2xl font-headline font-black text-on-surface mb-8 border-l-[6px] border-primary pl-6 uppercase tracking-tighter leading-none">ACADEMIC <br/> BLUEPRINT</h2>
          
          <div class="space-y-8 relative z-10">
            <div v-for="(edu, i) in education" :key="i" class="group relative pb-6 border-b border-on-surface/5 last:border-0 last:pb-0 cursor-pointer active-spring" v-ripple>
              <p class="text-primary font-black text-[9px] tracking-[0.3em] uppercase mb-2">{{ edu.period }}</p>
              <h4 class="text-lg md:text-xl font-black font-headline leading-tight mb-2 tracking-tight uppercase group-hover:text-primary transition-colors text-on-surface break-words">{{ edu.degree }}</h4>
              <p class="text-on-surface-variant text-xs mb-3 font-black opacity-60 leading-tight uppercase break-words">{{ edu.institution }}</p>
              
              <div class="flex flex-wrap gap-1.5">
                <span v-for="t in edu.tags" :key="t" 
                  class="text-[8px] font-black tracking-[0.12em] uppercase text-on-surface-variant/40 bg-surface/40 px-3 py-1.5 border border-surface-container-high group-hover:border-primary/30 transition-colors"
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
    <div class="sidebar-card p-6 sm:p-8 md:p-10 bg-on-surface text-surface relative overflow-hidden group shadow-3xl hover:scale-[1.01] transition-all duration-1000 mt-12"
      :style="{ borderRadius: 'calc(var(--app-radius) * 1.25)' }"
      :class="{ 'brutal-card border-4 border-primary': themeStore.currentStyle === 'brutal' }">
      <!-- Corner Decors -->
      <div class="absolute top-4 left-4 w-4 h-4 border-t border-l opacity-25 border-primary"></div>
      <div class="absolute top-4 right-4 w-4 h-4 border-t border-r opacity-25 border-primary"></div>
      <div class="absolute bottom-4 left-4 w-4 h-4 border-b border-l opacity-25 border-primary"></div>
      <div class="absolute bottom-4 right-4 w-4 h-4 border-b border-r opacity-25 border-primary"></div>

      <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12 xl:gap-16 w-full">
        <div class="max-w-3xl">
          <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 md:mb-6 group-hover:rotate-[20deg] transition-transform duration-700">
             <Terminal class="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <h3 class="text-2xl sm:text-3xl md:text-4xl font-headline font-black mb-4 leading-tight tracking-tighter uppercase underline decoration-primary/50 underline-offset-4 break-words">ENGINEERING <br/> THE FUTURE.</h3>
          <p class="text-surface-variant/70 text-sm sm:text-base md:text-lg leading-relaxed font-body font-medium break-words">Seeking elite cross-functional projects and strategic development mandates across the digital spectrum.</p>
        </div>
        <div class="w-full lg:w-auto">
          <router-link to="/contact" 
            class="w-full lg:w-auto px-5 py-4 sm:px-8 sm:py-5 lg:px-10 lg:py-6 bg-primary text-on-primary font-black font-label text-[10px] sm:text-[11px] lg:text-[13px] tracking-[0.2em] sm:tracking-[0.3em] lg:tracking-[0.4em] hover:translate-y-[-5px] transition-all shadow-xl shadow-primary/40 uppercase inline-flex justify-center items-center active-spring"
            :style="{ borderRadius: 'calc(var(--app-radius))' }" v-ripple>
            INITIATE CONTACT
          </router-link>
        </div>
      </div>
      <!-- Decorative background icon -->
      <Terminal class="absolute right-[-10%] top-[-10%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] text-surface-variant opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
    </div>
  </div>
</template>

<style scoped>
.exp-card-wrapper {
  perspective: 1000px;
}

.exp-front-card {
  transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.exp-top-card {
  max-height: 0;
  opacity: 0;
  transform: translateY(10px);
  overflow: hidden;
  pointer-events: none;
  padding: 0 1rem;
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-bottom-width: 0px !important;
  z-index: 10;
  background: linear-gradient(180deg, var(--color-surface-container-high), var(--color-surface-container)) !important;
}

.exp-bottom-card {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  overflow: hidden;
  pointer-events: none;
  padding: 0 1.5rem;
  transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-top-width: 0px !important;
  z-index: 10;
  background: linear-gradient(180deg, var(--color-surface-container), var(--color-surface-container-high)) !important;
}

/* Hover States */
.exp-card-wrapper:hover .exp-front-card {
  transform: scale(1.005);
  border-color: var(--color-primary) !important;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
}

.exp-card-wrapper:hover .exp-top-card {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
  padding: 1rem 1.5rem;
  margin-bottom: -0.75rem;
  pointer-events: auto;
}

.exp-card-wrapper:hover .exp-bottom-card {
  max-height: 400px;
  opacity: 1;
  transform: translateY(0);
  padding: 1.75rem 1.5rem 1.5rem 1.5rem;
  margin-top: -1rem;
  pointer-events: auto;
}

/* Street style specific overrides for card */
.theme-street .exp-card-wrapper:hover .exp-front-card {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
}

.theme-street .exp-card-wrapper:hover .exp-top-card {
  box-shadow: 0 -5px 15px rgba(0, 255, 255, 0.03);
}

.theme-street .exp-card-wrapper:hover .exp-bottom-card {
  box-shadow: 0 10px 20px rgba(255, 0, 255, 0.05);
}
</style>
