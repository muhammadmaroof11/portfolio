<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import { useThemeStore } from '../stores/themeStore'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  autoplaySpeed: {
    type: Number,
    default: 3500
  },
  cardWidth: {
    type: String,
    default: '460px'
  }
})

const themeStore = useThemeStore()
const activeIdx = ref(0)
const isPaused = ref(false)
const isMobile = ref(false)
const touchStart = ref(0)
let autoplayInterval = null

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  updateMobileStatus()
  window.addEventListener('resize', updateMobileStatus)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus)
  stopAutoplay()
})

const startAutoplay = () => {
  if (!props.autoplaySpeed || props.items.length === 0) return
  
  stopAutoplay()
  isPaused.value = false
  autoplayInterval = setInterval(() => {
    activeIdx.value = (activeIdx.value + 1) % props.items.length
  }, props.autoplaySpeed)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
}

const handleInteraction = (idx) => {
  activeIdx.value = idx
  // Reset autoplay timer so it doesn't immediately tick, but continues looping smoothly
  startAutoplay()
}

const nextSlide = () => {
  handleInteraction((activeIdx.value + 1) % props.items.length)
}

const prevSlide = () => {
  handleInteraction((activeIdx.value - 1 + props.items.length) % props.items.length)
}

const onTouchStart = (e) => {
  touchStart.value = e.targetTouches[0].clientX
  stopAutoplay()
}

const onTouchEnd = (e) => {
  const touchEnd = e.changedTouches[0].clientX
  const diff = touchStart.value - touchEnd
  if (diff > 50) {
    nextSlide()
  } else if (diff < -50) {
    prevSlide()
  } else {
    startAutoplay()
  }
}

// Compute transforms dynamically
const getCardStyle = (idx) => {
  const count = props.items.length
  if (count === 0) return {}
  
  let diff = idx - activeIdx.value
  if (diff < -count / 2) diff += count
  if (diff > count / 2) diff -= count

  const isActive = diff === 0
  const isLeft1 = diff === -1
  const isRight1 = diff === 1

  let x = '0%'
  let scale = 1
  let zIndex = 10
  let rotateY = 0
  let opacity = 0
  let pointerEvents = 'none'

  if (isMobile.value) {
    if (isActive) {
      x = '0%'
      scale = 1
      zIndex = 30
      rotateY = 0
      opacity = 1
      pointerEvents = 'auto'
    } else if (isLeft1) {
      x = '-58%'
      scale = 0.85;
      zIndex = 20
      rotateY = 18
      opacity = 0.55
      pointerEvents = 'auto'
    } else if (isRight1) {
      x = '58%'
      scale = 0.85
      zIndex = 20
      rotateY = -18
      opacity = 0.55
      pointerEvents = 'auto'
    } else {
      x = diff < 0 ? '-110%' : '110%'
      scale = 0.7
      zIndex = 10
      opacity = 0
    }
  } else {
    // Desktop layout settings
    if (isActive) {
      x = '0%'
      scale = 1
      zIndex = 30
      rotateY = 0
      opacity = 1
      pointerEvents = 'auto'
    } else if (isLeft1) {
      x = '-70%'
      scale = 0.88
      zIndex = 20
      rotateY = 24
      opacity = 0.65
      pointerEvents = 'auto'
    } else if (isRight1) {
      x = '70%'
      scale = 0.88
      zIndex = 20
      rotateY = -24
      opacity = 0.65
      pointerEvents = 'auto'
    } else if (diff === -2) {
      x = '-130%'
      scale = 0.78
      zIndex = 15
      rotateY = 32
      opacity = 0.2
    } else if (diff === 2) {
      x = '130%'
      scale = 0.78
      zIndex = 15
      rotateY = -32
      opacity = 0.2
    } else {
      x = diff < 0 ? '-170%' : '170%'
      scale = 0.65
      zIndex = 5
      opacity = 0
    }
  }

  return {
    transform: `translateX(${x}) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
    opacity,
    pointerEvents,
    position: 'absolute',
    width: isMobile.value ? '82%' : '90%',
    maxWidth: props.cardWidth,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
  }
}

// Watch active style and apply subtle design overrides
watch(() => themeStore.currentStyle, startAutoplay)
</script>

<template>
  <div class="relative w-full flex flex-col items-center select-none overflow-visible py-8 px-6 md:px-16 lg:px-24">
    <!-- Central animated service cards viewport -->
    <div
      class="relative w-full h-[320px] md:h-[450px] flex items-center justify-center overflow-visible"
      style="perspective: 1200px; transform-style: preserve-3d;"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(item, idx) in items"
        :key="idx"
        :style="getCardStyle(idx)"
        @click="handleInteraction(idx)"
        class="will-change-transform cursor-pointer"
      >
        <slot :item="item" :index="idx" :is-active="idx === activeIdx"></slot>
      </div>
    </div>

    <!-- Direction Navigation Controls (Absolute Corners) -->
    <button
      @click.stop="prevSlide"
      class="absolute left-[-16px] md:left-[-32px] lg:left-[-48px] xl:left-[-64px] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border active-spring z-40"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-surface text-primary border-primary' : 
        'bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50 text-primary backdrop-blur-md shadow-lg shadow-primary/10 hover:scale-105'
      ]"
      aria-label="Previous Slide"
    >
      <ArrowLeft class="w-6 h-6 md:w-7 md:h-7" />
    </button>
    <button
      @click.stop="nextSlide"
      class="absolute right-[-16px] md:right-[-32px] lg:right-[-48px] xl:right-[-64px] top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 border active-spring z-40"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'brutal-btn bg-surface text-primary border-primary' : 
        'bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50 text-primary backdrop-blur-md shadow-lg shadow-primary/10 hover:scale-105'
      ]"
      aria-label="Next Slide"
    >
      <ArrowRight class="w-6 h-6 md:w-7 md:h-7" />
    </button>

    <!-- Navigation Dots -->
    <div class="flex items-center gap-3 mt-8 z-20">
      <button
        v-for="(_, idx) in items"
        :key="idx"
        @click="handleInteraction(idx)"
        class="h-2.5 rounded-full transition-all duration-500 ease-out"
        :class="[
          activeIdx === idx
            ? 'w-8 bg-primary shadow-lg shadow-primary/30'
            : 'w-2.5 bg-on-surface/10 hover:bg-on-surface/20'
        ]"
        :aria-label="`Go to slide ${idx + 1}`"
      />
    </div>
  </div>
</template>
