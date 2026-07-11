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

  // Watch for changes and update the body class for global styling hooks
  watch([currentStyle, isDark], ([newStyle, dark]) => {
    document.body.classList.remove('style-minimal', 'style-street', 'style-brutal', 'dark')
    document.body.classList.add(`style-${newStyle}`)
    document.body.classList.add('dark')
    document.documentElement.classList.add('dark')
  }, { immediate: true })

  return {
    currentStyle,
    isDark,
    setStyle,
    toggleDarkMode
  }
})
