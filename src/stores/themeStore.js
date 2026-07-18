import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentStyle = ref(localStorage.getItem('portfolio-theme-style') || 'minimal')
  const isDark = ref(true)

  const setStyle = (style) => {
    currentStyle.value = style
    localStorage.setItem('portfolio-theme-style', style)
  }

  const toggleDarkMode = () => {
    // Permanently locked to dark mode
  }

  const loadedFonts = ref({
    street: false,
    brutal: false
  })

  const loadStyleFonts = (style) => {
    if (style === 'street' && !loadedFonts.value.street) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Bungee&family=Syne:wght@400;700;800&family=Permanent+Marker&family=Sedgwick+Ave+Display&display=swap'
      document.head.appendChild(link)
      loadedFonts.value.street = true
    }
    if (style === 'brutal' && !loadedFonts.value.brutal) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&display=swap'
      document.head.appendChild(link)
      loadedFonts.value.brutal = true
    }
  }

  // Watch for changes and update the body class for global styling hooks
  watch([currentStyle, isDark], ([newStyle, dark]) => {
    document.body.classList.remove('style-minimal', 'style-street', 'style-brutal', 'dark')
    document.body.classList.add(`style-${newStyle}`)
    document.body.classList.add('dark')
    document.documentElement.classList.add('dark')
    
    // Dynamically load theme-specific fonts when selected
    loadStyleFonts(newStyle)
  }, { immediate: true })

  return {
    currentStyle,
    isDark,
    setStyle,
    toggleDarkMode
  }
})
