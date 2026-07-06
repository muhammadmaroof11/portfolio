import { createApp, nextTick } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Global GSAP Registration
gsap.registerPlugin(ScrollTrigger)

import { Ripple } from './directives/ripple'
import { VTilt } from './directives/vTilt'

const app = createApp(App)
const pinia = createPinia()

app.directive('ripple', Ripple)
app.directive('tilt', VTilt)
app.use(pinia)
app.use(router)

// Global Hash Scroll Support
router.afterEach((to) => {
  if (to.hash) {
    nextTick(() => {
      const el = document.querySelector(to.hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    })
  }
})

app.mount('#app')
