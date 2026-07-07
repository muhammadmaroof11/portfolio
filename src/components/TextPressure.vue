<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: 'Compressa'
  },
  fontFamily: {
    type: String,
    default: 'Roboto Flex'
  },
  fontUrl: {
    type: String,
    default: 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap'
  },
  width: {
    type: Boolean,
    default: true
  },
  weight: {
    type: Boolean,
    default: true
  },
  italic: {
    type: Boolean,
    default: true
  },
  alpha: {
    type: Boolean,
    default: false
  },
  flex: {
    type: Boolean,
    default: true
  },
  stroke: {
    type: Boolean,
    default: false
  },
  scale: {
    type: Boolean,
    default: false
  },
  textColor: {
    type: String,
    default: '#FFFFFF'
  },
  strokeColor: {
    type: String,
    default: '#FF0000'
  },
  className: {
    type: String,
    default: ''
  },
  minFontSize: {
    type: Number,
    default: 24
  }
})

const containerRef = ref(null)
const titleRef = ref(null)
const spansRef = ref([])

const mouse = ref({ x: 0, y: 0 })
const cursor = ref({ x: 0, y: 0 })

const fontSize = ref(props.minFontSize)
const scaleY = ref(1)
const lineHeight = ref(1)

const chars = computed(() => props.text.split(''))

const dist = (a, b) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist)
  return Math.max(minVal, val + minVal)
}

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const handleMouseMove = (e) => {
  cursor.value.x = e.clientX
  cursor.value.y = e.clientY
}

const handleTouchMove = (e) => {
  const t = e.touches[0]
  cursor.value.x = t.clientX
  cursor.value.y = t.clientY
}

const setSize = () => {
  if (!containerRef.value || !titleRef.value) return

  const { width: containerW, height: containerH } = containerRef.value.getBoundingClientRect()

  let newFontSize = containerW / (chars.value.length / 2)
  newFontSize = Math.max(newFontSize, props.minFontSize)

  fontSize.value = newFontSize
  scaleY.value = 1
  lineHeight.value = 1

  requestAnimationFrame(() => {
    if (!titleRef.value) return
    const textRect = titleRef.value.getBoundingClientRect()

    if (props.scale && textRect.height > 0) {
      const yRatio = containerH / textRect.height
      scaleY.value = yRatio
      lineHeight.value = yRatio
    }
  })
}

const debouncedSetSize = debounce(setSize, 100)

let rafId = null

const animate = () => {
  mouse.value.x += (cursor.value.x - mouse.value.x) / 15
  mouse.value.y += (cursor.value.y - mouse.value.y) / 15

  if (titleRef.value) {
    const titleRect = titleRef.value.getBoundingClientRect()
    const maxDist = titleRect.width / 2

    spansRef.value.forEach((span) => {
      if (!span) return

      const rect = span.getBoundingClientRect()
      const charCenter = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      }

      const d = dist(mouse.value, charCenter)

      const wdth = props.width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100
      const wght = props.weight ? Math.floor(getAttr(d, maxDist, 400, 500)) : 400
      const italVal = props.italic ? 1.0 : 0.0
      const alphaVal = props.alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1

      const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`

      if (span.style.fontVariationSettings !== newFontVariationSettings) {
        span.style.fontVariationSettings = newFontVariationSettings
      }
      if (props.alpha && span.style.opacity !== alphaVal) {
        span.style.opacity = alphaVal
      }
    })
  }

  rafId = requestAnimationFrame(animate)
}

const setSpanRef = (el, i) => {
  if (el) {
    spansRef.value[i] = el
  }
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
  window.addEventListener('resize', debouncedSetSize)

  if (containerRef.value) {
    const { left, top, width, height } = containerRef.value.getBoundingClientRect()
    mouse.value.x = left + width / 2
    mouse.value.y = top + height / 2
    cursor.value.x = mouse.value.x
    cursor.value.y = mouse.value.y
  }

  setSize()
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('touchmove', handleTouchMove)
  window.removeEventListener('resize', debouncedSetSize)
  if (rafId) cancelAnimationFrame(rafId)
})

watch(() => props.text, () => {
  nextTick(() => {
    setSize()
  })
})

const styleContent = computed(() => {
  return `
    @import url('${props.fontUrl}');

    .text-pressure-flex {
      display: flex;
      justify-content: space-between;
    }

    .text-pressure-stroke span {
      position: relative;
      color: ${props.textColor};
    }
    .text-pressure-stroke span::after {
      content: attr(data-char);
      position: absolute;
      left: 0;
      top: 0;
      color: transparent;
      z-index: -1;
      -webkit-text-stroke-width: 3px;
      -webkit-text-stroke-color: ${props.strokeColor};
    }

    .text-pressure-title {
      color: ${props.textColor};
    }
  `
})

const dynamicClassName = computed(() => {
  return [
    props.className,
    props.flex ? 'text-pressure-flex' : '',
    props.stroke ? 'text-pressure-stroke' : ''
  ].filter(Boolean).join(' ')
})
</script>

<template>
  <div
    ref="containerRef"
    style="position: relative; width: 100%; height: 100%; background: transparent;"
  >
    <component :is="'style'" v-html="styleContent" />
    <h1
      ref="titleRef"
      class="text-pressure-title"
      :class="dynamicClassName"
      :style="{
        fontFamily: props.fontFamily,
        textTransform: 'uppercase',
        fontSize: fontSize + 'px',
        lineHeight: lineHeight,
        transform: `scale(1, ${scaleY})`,
        transformOrigin: 'center top',
        margin: 0,
        textAlign: 'center',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        fontWeight: 100,
        width: '100%'
      }"
    >
      <span
        v-for="(char, i) in chars"
        :key="i"
        :ref="el => setSpanRef(el, i)"
        :data-char="char"
        style="display: inline-block;"
        :style="{ color: props.stroke ? undefined : props.textColor }"
      >
        {{ char }}
      </span>
    </h1>
  </div>
</template>
