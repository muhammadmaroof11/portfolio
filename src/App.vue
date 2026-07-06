<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()
const router = useRouter()
const isLoading = ref(true)
const pageProgress = ref(0)

router.beforeEach(() => {
  pageProgress.value = 30
  setTimeout(() => pageProgress.value = 70, 200)
})

router.afterEach(() => {
  pageProgress.value = 100
  setTimeout(() => {
    pageProgress.value = 0
  }, 400)
})

onMounted(() => {
  // Simulate initial load for premium feel
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<template>
  <div class="min-h-screen transition-colors duration-500 overflow-x-hidden relative"
    :class="[
      themeStore.currentStyle === 'glass' ? 'bg-surface-bright' : 
      themeStore.currentStyle === 'brutal' ? 'bg-surface font-headline' : 
      'bg-surface'
    ]">
    
    <!-- Top Progress Bar -->
    <div 
      class="fixed top-0 left-0 h-1 bg-primary z-[100] transition-all duration-300 ease-out pointer-events-none"
      :style="{ width: pageProgress + '%', opacity: pageProgress > 0 ? 1 : 0 }"
    ></div>

    <!-- Initial Loading Overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed inset-0 z-[200] bg-surface flex items-center justify-center">
        <div class="flex flex-col items-center gap-6">
          <div class="w-16 h-16 rounded-2xl bg-primary animate-bounce shadow-2xl shadow-primary/40 flex items-center justify-center">
            <div class="w-8 h-8 rounded-lg bg-surface animate-pulse"></div>
          </div>
          <div class="font-headline font-black text-xl tracking-[0.4em] uppercase text-on-surface animate-pulse">
            Architecting<span class="text-primary italic">...</span>
          </div>
        </div>
      </div>
    </transition>

    <Navbar />
    
    <main class="pt-16">
      <router-view v-slot="{ Component }">
        <transition 
          name="slide-fade" 
          mode="out-in"
          enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          enter-from-class="opacity-0 translate-y-8 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-400 ease-[cubic-bezier(0.7,0,0.84,0)]"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-8 scale-95"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-surface py-16 md:py-24 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-surface-container-high mt-24 relative overflow-hidden">
      <div class="relative z-10 flex flex-col items-center md:items-start gap-4">
        <div class="text-2xl font-black text-on-surface font-headline uppercase tracking-tighter">
          MAROOF<span class="text-primary italic">.DEV</span>
        </div>
        <p class="font-label text-[10px] tracking-[0.4em] uppercase text-on-surface/40 text-center md:text-left max-w-xs leading-loose">
          Architecting elite digital experiences. Engineered with precision.
        </p>
      </div>

      <div class="relative z-10 flex flex-col items-center md:items-end gap-6 text-center md:text-right">
        <div class="flex gap-8 font-label text-[10px] tracking-[0.4em] uppercase font-black">
          <a href="https://github.com/MuhammadMaroof" target="_blank" class="text-on-surface hover:text-primary transition-all hover:-translate-y-1">GITHUB</a>
          <a href="https://linkedin.com/in/muhammadmaroof" target="_blank" class="text-on-surface hover:text-primary transition-all hover:-translate-y-1">LINKEDIN</a>
          <a href="#" target="_blank" class="text-on-surface hover:text-primary transition-all hover:-translate-y-1">TWITTER</a>
        </div>
        <p class="font-inter text-[9px] tracking-widest uppercase text-on-surface/30">
          © 2026 THE DIGITAL ARCHITECT. BEYOND COMPROMISE.
        </p>
      </div>

      <!-- Decorative Background Text -->
      <div class="absolute -bottom-10 right-0 font-headline font-black text-[12vw] text-on-surface/[0.03] uppercase pointer-events-none select-none whitespace-nowrap">
        LEGACY_V4
      </div>
    </footer>
  </div>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(10px);
}
</style>
