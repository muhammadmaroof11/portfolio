<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, defineAsyncComponent } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { Mail, MapPin, Phone, Clock, Github, Linkedin, Instagram, MessageCircle, Send, ArrowUpRight } from 'lucide-vue-next'
const FuzzyText = defineAsyncComponent(() => import('../components/FuzzyText.vue'))
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// ScrollTrigger is registered globally in main.js

const themeStore = useThemeStore()
const { profile } = portfolioData
const viewRoot = ref(null)

const isDesktop = ref(window.innerWidth >= 1024)
let resizeHandler = null

const ContactCanvas = defineAsyncComponent(() => import('../components/ContactCanvas.vue'))

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

  resizeHandler = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  window.addEventListener('resize', resizeHandler)
})

const socialLinks = [
  { name: 'GitHub', icon: Github, link: profile.socials.github },
  { name: 'LinkedIn', icon: Linkedin, link: profile.socials.linkedin },
  { name: 'Instagram', icon: Instagram, link: profile.socials.instagram },
  { name: 'WhatsApp', icon: MessageCircle, link: profile.socials.whatsapp }
]

onBeforeUnmount(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <div ref="viewRoot" class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 min-h-[calc(100vh-96px)] flex flex-col justify-center py-8 md:py-12 overflow-hidden relative">
    <ContactCanvas v-if="isDesktop" />
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10 w-full">
      
      <!-- LEFT SIDE: HEADER & COMPACT INFO -->
      <div class="contents lg:block lg:col-span-6 order-none">
        
        <!-- HEADING -->
        <div class="contact-header order-1 lg:order-none mb-0 lg:mb-8 w-full">
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
                :hover-intensity="isDesktop ? 0.45 : 0.15"
                :fuzz-range="18"
                :enable-hover="isDesktop"
              >
                DIALOGUE.
              </FuzzyText>
            </h1>
            <p class="text-on-surface-variant text-base md:text-lg leading-relaxed font-body max-w-xl opacity-80 font-medium">
              Ready to deploy world-class architectures. Initiate the sequence for your next high-impact digital project.
            </p>
          </div>
        </div>

        <!-- DETAILS (COMPACT INFO & SOCIALS) -->
        <div class="contact-header order-3 lg:order-none space-y-8 mt-4 lg:mt-0 w-full">
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
        </div> <!-- Close DETAILS wrapper -->
      </div> <!-- Close LEFT SIDE wrapper -->

      <!-- RIGHT SIDE: CONTACT FORM -->
      <div class="lg:col-span-6 contact-form p-6 sm:p-8 rounded-[2rem] md:rounded-[3rem] transition-all duration-1000 relative overflow-hidden group shadow-3xl order-2 lg:order-none w-full"
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
            <div class="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
