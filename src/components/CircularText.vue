<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  spinDuration: {
    type: Number,
    default: 20
  },
  onHover: {
    type: String,
    default: 'speedUp' // 'slowDown', 'speedUp', 'pause', 'goBonkers'
  },
  fontSize: {
    type: String,
    default: '14px'
  },
  radius: {
    type: Number,
    default: 80
  }
})

const containerRef = ref(null)
const letters = computed(() => Array.from(props.text))

let tween = null

const startRotation = (durationFactor = 1) => {
  if (!containerRef.value) return
  if (tween) tween.kill()

  const currentRotation = gsap.getProperty(containerRef.value, 'rotate') || 0
  tween = gsap.to(containerRef.value, {
    rotate: currentRotation + 360,
    duration: props.spinDuration * durationFactor,
    ease: 'none',
    repeat: -1,
    overwrite: 'auto'
  })
}

onMounted(() => startRotation(1))
onUnmounted(() => { if (tween) tween.kill() })

const handleHoverStart = () => {
  if (!props.onHover) return
  switch (props.onHover) {
    case 'slowDown':
      startRotation(2)
      gsap.to(containerRef.value, { scale: 1.1, duration: 0.4, ease: 'power2.out' })
      break
    case 'speedUp':
      startRotation(0.25)
      gsap.to(containerRef.value, { scale: 1.1, duration: 0.4, ease: 'power2.out' })
      break
    case 'pause':
      if (tween) tween.pause()
      break
    case 'goBonkers':
      startRotation(0.05)
      gsap.to(containerRef.value, { scale: 0.8, duration: 0.4, ease: 'power2.out' })
      break
  }
}

const handleHoverEnd = () => {
  startRotation(1)
  gsap.to(containerRef.value, { scale: 1, duration: 0.4, ease: 'power2.out' })
}

watch(() => props.spinDuration, () => startRotation(1))
</script>

<template>
  <!--
    NOTE: This component uses inheritAttrs default (true), so the parent-applied
    classes (including 'absolute', top/right positioning, z-index) are automatically
    merged onto the root div. We do NOT set position here — let the parent control it.
  -->
  <div
    ref="containerRef"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: (props.radius * 2 + 40) + 'px',
      height: (props.radius * 2 + 40) + 'px',
      cursor: 'pointer',
      userSelect: 'none'
    }"
    @mouseenter="handleHoverStart"
    @mouseleave="handleHoverEnd"
  >
    <!-- Spinning ring — positioned relative to the container above -->
    <div style="position: absolute; inset: 0; transform-origin: center center;">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        :style="{
          position: 'absolute',
          display: 'inline-block',
          left: '50%',
          top: '50%',
          width: '20px',
          height: '20px',
          marginLeft: '-10px',
          marginTop: '-10px',
          fontFamily: 'var(--font-headline, sans-serif)',
          fontWeight: '900',
          color: '#ffffff',
          lineHeight: '20px',
          textAlign: 'center',
          transformOrigin: 'center center',
          textTransform: 'uppercase',
          fontSize: props.fontSize,
          transform: `rotateZ(${(360 / letters.length) * i}deg) translate3d(0, -${props.radius}px, 0)`
        }"
      >
        {{ letter }}
      </span>
    </div>
    <!-- Central slot content -->
    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; z-index: 2;">
      <slot />
    </div>
  </div>
</template>
