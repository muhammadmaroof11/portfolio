<script setup>
import { useThemeStore } from '../stores/themeStore'
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const themeStore = useThemeStore()
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Work', path: '/' },
  { name: 'Skills', path: '/skills' },
  { name: 'Experience', path: '/experience' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' }
]

const styles = [
  { key: 'minimal', label: 'MINIMAL' },
  { key: 'brutal', label: 'BRUTAL' },
  { key: 'street', label: 'STREET' }
]

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
    :class="[
      themeStore.currentStyle === 'glass' ? 'bg-white/60 dark:bg-black/60 border-b border-white/20' : 'bg-surface/98 dark:bg-surface/90 border-b border-surface-container-high shadow-sm'
    ]">
    <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 h-20 flex items-center justify-between">
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
      <div class="hidden lg:flex items-center gap-8">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path"
          class="font-label text-xs font-black tracking-[0.2em] uppercase hover:text-primary transition-colors text-on-surface/80 px-2 py-1 rounded-md active-spring"
          active-class="text-primary !opacity-100" v-ripple>
          {{ link.name }}
        </router-link>

        <!-- STYLE SWITCHER (Highly Prominent Glow/Gradient Wrapper) -->
        <div class="bg-gradient-to-r from-primary/40 via-secondary/20 to-primary/40 p-[1.5px] rounded-xl ml-4 shadow-lg shadow-primary/5 hover:shadow-primary/10 transition-all duration-300">
          <div class="flex items-center gap-1.5 p-1 rounded-[10px] bg-black/90 backdrop-blur-md">
            <button
              v-for="s in styles"
              :key="s.key"
              @click="themeStore.setStyle(s.key)"
              class="text-[9px] font-black tracking-[0.2em] rounded-lg transition-all duration-300 active-spring"
              :class="themeStore.currentStyle === s.key
                ? 'bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/20 scale-[1.04] px-4 py-2'
                : 'text-on-surface/50 hover:text-on-surface hover:bg-white/5 px-3.5 py-2'"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- MOBILE TOGGLE -->
      <div class="flex items-center gap-4 lg:hidden">
        <button @click="toggleMenu" class="p-2 text-on-surface">
          <Menu v-if="!isMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <div v-if="isMenuOpen" class="lg:hidden absolute top-20 left-0 right-0 bg-surface border-b border-surface-container-high p-6 animate-fade-in shadow-2xl">
      <div class="flex flex-col gap-6">
        <router-link v-for="link in navLinks" :key="link.name" :to="link.path"
          @click="isMenuOpen = false"
          class="font-headline text-2xl font-black uppercase tracking-tighter hover:text-primary transition-colors py-2 px-4 rounded-xl active-spring" v-ripple>
          {{ link.name }}
        </router-link>

        <!-- MOBILE STYLE SWITCHER -->
        <div class="flex flex-col gap-3 pt-4 border-t border-surface-container-high">
          <span class="text-[9px] font-black tracking-[0.25em] uppercase text-on-surface/40">THEME STYLE</span>
          <div class="grid grid-cols-3 gap-2 bg-surface-container-high/65 p-1 rounded-xl border border-surface-container-high/80">
            <button
              v-for="s in styles"
              :key="s.key"
              @click="themeStore.setStyle(s.key); isMenuOpen = false"
              class="text-[9px] font-black tracking-[0.2em] rounded-lg transition-all duration-300 py-3 text-center"
              :class="themeStore.currentStyle === s.key
                ? 'bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/15 scale-[1.02]'
                : 'bg-surface-container text-on-surface/60 hover:text-on-surface'"
            >
              {{ s.label }}
            </button>
          </div>
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
