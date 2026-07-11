import { createApp } from 'vue'
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

// Hash scroll is handled by router scrollBehavior in router/index.js
app.mount('#app')
