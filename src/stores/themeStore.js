import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Load initial state from local storage or defaults
  const savedStyle = localStorage.getItem('portfolio-style') || 'minimal'
  const savedDark = localStorage.getItem('portfolio-dark') === 'true'

  const currentStyle = ref(savedStyle)
  const isDark = ref(savedDark)

  const setStyle = (style) => {
    currentStyle.value = style
    localStorage.setItem('portfolio-style', style)
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem('portfolio-dark', isDark.value)
  }

  // Watch for changes and update the body class for global styling hooks
  watch([currentStyle, isDark], ([newStyle, dark]) => {
    document.body.classList.remove('style-minimal', 'style-street', 'style-brutal', 'dark')
    document.body.classList.add(`style-${newStyle}`)
    if (dark) {
      document.body.classList.add('dark')
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    currentStyle,
    isDark,
    setStyle,
    toggleDarkMode
  }
})
