<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { Mail, Github, Linkedin, Twitter, Instagram, Send, MapPin, Clock, ArrowUpRight, Globe } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const { profile } = portfolioData

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
  
  // Set initial states
  gsap.set('.gsap-reveal', { autoAlpha: 0, y: 30 })

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

  gsap.to('.contact-header > *', {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out'
  })

  gsap.to('.contact-card', {
    scrollTrigger: {
      trigger: '.contact-card',
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 0.8,
    stagger: 0.1
  })

  gsap.to('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 85%'
    },
    x: 0,
    autoAlpha: 1,
    duration: 1,
    ease: 'expo.out'
  })
})

const socialLinks = [
  { name: 'GitHub', icon: Github, link: profile.socials.github },
  { name: 'LinkedIn', icon: Linkedin, link: profile.socials.linkedin },
  { name: 'Twitter', icon: Twitter, link: profile.socials.twitter },
  { name: 'Instagram', icon: Instagram, link: profile.socials.instagram }
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-22 pb-16 overflow-visible">
    <!-- HERO HEADER -->
    <header class="mb-12 md:mb-16 contact-header relative z-20">
      <div class="max-w-3xl">
        <span class="app-badge mb-6 md:mb-8 block" :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">Global Connectivity Protocol</span>
        <h1 class="app-h1 mb-8 md:mb-10 text-on-surface">
          STRATEGIC <br/><span class="text-primary italic underline decoration-wavy decoration-8 underline-offset-[12px]">DIALOGUE.</span>
        </h1>
        <p class="text-on-surface-variant text-lg md:text-xl leading-relaxed font-body max-w-2xl opacity-80 font-medium">
          Ready to deploy world-class architectures. Initiate the sequence for your next high-impact digital project.
        </p>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start relative z-10">
      <!-- CONTACT INFO & SOCIALS -->
      <div class="space-y-12 md:space-y-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div v-for="(info, i) in [
            { label: 'DIRECT SIGNAL', val: profile.email || 'maroof@byteforce.dev', icon: Mail },
            { label: 'OPERATIONAL BASE', val: profile.location, icon: MapPin },
            { label: 'ENGAGEMENT MODEL', val: 'Remote / Global', icon: Globe },
            { label: 'RESPONSE LATENCY', val: '< 24 Hours', icon: Clock }
          ]" :key="i" 
            class="contact-card gsap-reveal p-6 md:p-8 transition-all duration-700 hover:-translate-y-4 shadow-xl cursor-pointer active-spring"
            :style="{ borderRadius: 'var(--app-radius)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card' : 
              themeStore.currentStyle === 'street' ? 'street-card' : 'bg-surface-container border border-primary/10 hover:border-primary/30'
            ]" v-ripple>
            <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-6 md:mb-8 bg-gradient-to-br from-primary/5 to-primary/20 backdrop-blur-sm"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2.5)' }">
               <component :is="info.icon" class="w-6 h-6 md:w-7 md:h-7 text-primary opacity-80" />
            </div>
            <p class="text-primary font-black text-[8px] md:text-[9px] tracking-[0.3em] md:tracking-[0.4em] uppercase mb-3 md:mb-4">{{ info.label }}</p>
            <p class="text-lg md:text-xl font-headline font-black tracking-tight leading-none uppercase text-on-surface break-words">{{ info.val }}</p>
          </div>
        </div>

        <!-- SOCIAL CARDS -->
        <div class="flex flex-wrap gap-4 md:gap-6 pt-8 md:pt-12">
          <a v-for="social in socialLinks" :key="social.name" :href="social.link" target="_blank"
            class="px-6 md:px-8 py-3 md:py-4 bg-on-surface text-surface flex items-center gap-4 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 active-spring"
            :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
            :class="{ 'brutal-card border-primary': themeStore.currentStyle === 'brutal' }" v-ripple>
            <component :is="social.icon" class="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
            <span class="font-black tracking-[0.2em] text-[8px] md:text-[9px] uppercase">{{ social.name }}</span>
            <ArrowUpRight class="w-4 h-4 md:w-5 md:h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      <!-- CONTACT FORM -->
      <div class="contact-form p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] transition-all duration-1000 relative overflow-hidden group shadow-3xl"
        :class="[
          themeStore.currentStyle === 'brutal' ? 'brutal-card border-8 border-on-surface' : 
          themeStore.currentStyle === 'street' ? 'street-card border-secondary/40' : 'bg-surface-container-highest shadow-2xl border border-primary/10'
        ]">
        <h2 class="text-3xl md:text-5xl font-headline font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.9] text-on-surface">Initiate <br/> <span class="text-primary italic">Transmission</span></h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-8 md:space-y-10 relative z-10">
          <transition 
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 -translate-y-10 scale-90"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 scale-90"
          >
            <div v-if="submitted" class="absolute inset-0 z-50 flex items-center justify-center bg-surface-container-highest/80 backdrop-blur-md rounded-[2.5rem] md:rounded-[4rem]">
              <div class="p-10 rounded-[2rem] bg-primary text-on-primary text-center shadow-2xl border-4 border-white/20">
                <Send class="w-16 h-16 mx-auto mb-6 animate-bounce" />
                <h3 class="text-2xl font-black uppercase tracking-widest mb-2">Signal Transmitted</h3>
                <p class="opacity-80 uppercase text-[10px] tracking-widest">Communication successfully established.</p>
              </div>
            </div>
          </transition>

          <div v-if="!submitted" class="space-y-8 md:space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div class="space-y-4 md:space-y-6">
                <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-on-surface opacity-60 px-4">Identifier</label>
                <input v-model="form.name" type="text" placeholder="Quantum Engine v1" required
                  class="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-lg md:text-xl text-on-surface placeholder:text-on-surface-variant/40 shadow-inner dark:bg-black/20" />
              </div>
              <div class="space-y-4 md:space-y-6">
                <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-on-surface opacity-60 px-4">Primary Signal</label>
                <input v-model="form.email" type="email" placeholder="contact@domain.io" required
                  class="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-lg md:text-xl text-on-surface placeholder:text-on-surface-variant/40 shadow-inner dark:bg-black/20" />
              </div>
            </div>
            
            <div class="space-y-4 md:space-y-6">
              <label class="font-black text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase text-on-surface opacity-60 px-4">Strategic Brief</label>
              <textarea v-model="form.message" rows="4" md:rows="5" placeholder="Outline the requirements..." required
                class="w-full px-6 md:px-8 py-4 md:py-6 bg-surface-container border-2 border-primary/5 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-lg md:text-xl text-on-surface placeholder:text-on-surface-variant/40 resize-none shadow-inner dark:bg-black/20"
                :style="{ borderRadius: 'calc(var(--app-radius) / 1.5)' }"></textarea>
            </div>

            <button type="submit" :disabled="isSubmitting"
              class="w-full py-6 md:py-8 bg-primary text-on-primary font-black tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-[12px] uppercase flex items-center justify-center gap-4 md:gap-6 hover:translate-y-[-5px] transition-all shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] group disabled:opacity-50 disabled:grayscale active-spring"
              :style="{ borderRadius: 'calc(var(--app-radius) / 2.5)' }" v-ripple>
              <span v-if="!isSubmitting">ESTABLISH COMMUNICATION</span>
              <span v-else class="animate-pulse">TRANSMITTING...</span>
              <Send class="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:translate-x-3 group-hover:-translate-y-2 group-active:scale-90" />
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
