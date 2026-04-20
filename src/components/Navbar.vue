<script setup>
import { useThemeStore } from '../stores/themeStore'
import { ref } from 'vue'
import { Menu, X, Sun, Moon } from 'lucide-vue-next'

const themeStore = useThemeStore()
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Work', path: '/' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'Contact', path: '/contact' }
]

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
    :class="[
      themeStore.currentStyle === 'glass' ? 'bg-white/60 dark:bg-black/60 border-b border-white/20' : 'bg-surface/98 dark:bg-surface/90 border-b border-surface-container-high shadow-sm'
    ]">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <!-- LOGO -->
      <router-link to="/" class="flex items-center gap-3 group active-spring" v-ripple>
        <div class="w-10 h-10 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110 bg-white flex items-center justify-center p-0.5">
          <img src="/logo.png" alt="Maroof.dev Logo" class="w-full h-full object-contain rounded-lg" />
        </div>
        <span class="font-headline font-black text-xl tracking-[calc(-0.04em)] uppercase text-on-surface">
          Maroof<span class="text-primary">.dev</span>
        </span>
      </router-link>

      <!-- DESKTOP NAV -->
      <div class="hidden md:flex items-center gap-8">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path"
          class="font-label text-xs font-black tracking-[0.2em] uppercase hover:text-primary transition-colors text-on-surface/80 px-2 py-1 rounded-md active-spring"
          active-class="text-primary !opacity-100" v-ripple>
          {{ link.name }}
        </router-link>
        
        <!-- Style Switcher (Consolidated) -->
        <div class="flex items-center gap-4 pl-6 border-l border-surface-container-high">
          <!-- Dark Mode Toggle -->
          <button @click="themeStore.toggleDarkMode" 
            class="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface active-spring"
            title="Toggle Dark Mode" v-ripple>
            <Sun v-if="themeStore.isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <!-- Theme Style Pill Switch (3-Slide with Labels) -->
          <div class="relative bg-surface-container p-1 rounded-full flex items-center border border-surface-container-highest transition-all duration-500 shadow-inner group w-[240px] h-10 overflow-hidden">
            <!-- Sliding Indicator -->
            <div class="absolute h-8 rounded-full bg-primary shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
              :style="{ 
                width: '76px',
                transform: `translateX(${
                  themeStore.currentStyle === 'minimal' ? '0px' : 
                  themeStore.currentStyle === 'street' ? '79px' : '158px'
                })` 
              }"></div>
            
            <!-- Labels -->
            <button v-for="style in ['minimal', 'street', 'brutal']" :key="style"
              @click="themeStore.setStyle(style)"
              class="relative z-10 w-[78px] h-8 flex items-center justify-center transition-colors duration-500 active-spring"
              :title="style.toUpperCase() + ' Mode'" v-ripple>
              <span class="font-label text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500"
                :class="themeStore.currentStyle === style ? 'text-on-primary' : 'text-on-surface/40 hover:text-on-surface/80'">
                {{ style }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- MOBILE TOGGLE -->
      <div class="flex items-center gap-4 md:hidden">
        <button @click="themeStore.toggleDarkMode" class="p-2 text-on-surface">
          <Sun v-if="themeStore.isDark" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
        <button @click="toggleMenu" class="p-2 text-on-surface">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div v-if="isMenuOpen" class="md:hidden absolute top-20 left-0 right-0 bg-surface border-b border-surface-container-high p-6 animate-fade-in shadow-2xl">
      <div class="flex flex-col gap-6">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path"
          @click="isMenuOpen = false"
          class="font-headline text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors py-2 px-4 rounded-xl active-spring" v-ripple>
          {{ link.name }}
        </router-link>
        <div class="pt-6 border-t border-surface-container-high flex flex-col gap-4">
           <!-- Mobile Theme Style Cycle -->
            <button @click="() => {
              const styles = ['minimal', 'street', 'brutal'];
              const nextIndex = (styles.indexOf(themeStore.currentStyle) + 1) % styles.length;
              themeStore.setStyle(styles[nextIndex]);
            }"
            class="flex items-center justify-between w-full px-6 py-4 rounded-2xl bg-surface-container border border-surface-container-highest transition-all active-spring"
            :title="'Switch to next style'" v-ripple>
              <span class="font-label text-xs font-black uppercase tracking-[0.2em] text-on-surface/60">
                Design Style: <span class="text-primary">{{ themeStore.currentStyle }}</span>
              </span>
              <div class="w-5 h-5 rounded-full border-2 border-primary"
                :class="[
                  themeStore.currentStyle === 'minimal' ? 'bg-transparent' : 
                  themeStore.currentStyle === 'street' ? 'bg-primary shadow-[0_0_20px_rgba(255,0,255,0.8)]' : 'bg-primary'
                ]"></div>
            </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
