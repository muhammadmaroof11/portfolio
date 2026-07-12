<script setup>
import { ref, onMounted, onUnmounted, watch, useSlots } from 'vue'
import { useThemeStore } from '../stores/themeStore'

const props = defineProps({
  fontSize: {
    type: [String, Number],
    default: 'clamp(2rem, 10vw, 10rem)'
  },
  fontWeight: {
    type: [String, Number],
    default: 900
  },
  fontFamily: {
    type: String,
    default: 'inherit'
  },
  fontStyle: {
    type: String,
    default: 'normal'
  },
  color: {
    type: String,
    default: '#fff'
  },
  enableHover: {
    type: Boolean,
    default: true
  },
  baseIntensity: {
    type: Number,
    default: 0.18
  },
  hoverIntensity: {
    type: Number,
    default: 0.5
  },
  fuzzRange: {
    type: Number,
    default: 30
  },
  fps: {
    type: Number,
    default: 60
  },
  direction: {
    type: String,
    default: 'horizontal' // 'horizontal' | 'vertical' | 'both'
  },
  transitionDuration: {
    type: Number,
    default: 0
  },
  clickEffect: {
    type: Boolean,
    default: false
  },
  glitchMode: {
    type: Boolean,
    default: false
  },
  glitchInterval: {
    type: Number,
    default: 2000
  },
  glitchDuration: {
    type: Number,
    default: 200
  },
  gradient: {
    type: Array,
    default: null
  },
  letterSpacing: {
    type: Number,
    default: 0
  },
  className: {
    type: String,
    default: ''
  }
})

const canvasRef = ref(null)
const slots = useSlots()
const themeStore = useThemeStore()

const getSlotText = () => {
  if (!slots.default) return ''
  const nodes = slots.default()
  
  const extract = (vnodes) => {
    let result = ''
    for (const node of vnodes) {
      if (typeof node.children === 'string') {
        result += node.children
      } else if (Array.isArray(node.children)) {
        result += extract(node.children)
      } else if (node.text) {
        result += node.text
      }
    }
    return result
  }
  
  return extract(nodes).trim()
}

let cleanupFn = null

const initFuzzyText = async () => {
  if (cleanupFn) {
    cleanupFn()
    cleanupFn = null
  }

  // Brief delay to allow stylesheet classes to propagate and CSS custom variables to update
  await new Promise(resolve => setTimeout(resolve, 30))

  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const computedFontFamily =
    props.fontFamily === 'inherit' ? window.getComputedStyle(canvas).fontFamily || 'sans-serif' : props.fontFamily

  const inheritedSize = window.getComputedStyle(canvas).fontSize
  const fontSizeStr = props.fontSize === 'inherit' ? inheritedSize : (typeof props.fontSize === 'number' ? `${props.fontSize}px` : props.fontSize)
  const fontString = `${props.fontStyle} ${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`

  try {
    await document.fonts.load(fontString)
  } catch {
    await document.fonts.ready
  }

  let numericFontSize
  if (props.fontSize === 'inherit') {
    numericFontSize = parseFloat(inheritedSize)
  } else if (typeof props.fontSize === 'number') {
    numericFontSize = props.fontSize
  } else {
    const temp = document.createElement('span')
    temp.style.fontSize = props.fontSize
    document.body.appendChild(temp)
    const computedSize = window.getComputedStyle(temp).fontSize
    numericFontSize = parseFloat(computedSize)
    document.body.removeChild(temp)
  }

  const text = getSlotText()

  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')
  if (!offCtx) return

  offCtx.font = `${props.fontStyle} ${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`
  offCtx.textBaseline = 'alphabetic'

  let totalWidth = 0
  if (props.letterSpacing !== 0) {
    for (const char of text) {
      totalWidth += offCtx.measureText(char).width + props.letterSpacing
    }
    totalWidth -= props.letterSpacing
  } else {
    totalWidth = offCtx.measureText(text).width
  }

  const metrics = offCtx.measureText(text)
  const actualLeft = metrics.actualBoundingBoxLeft ?? 0
  const actualRight = props.letterSpacing !== 0 ? totalWidth : (metrics.actualBoundingBoxRight ?? metrics.width)
  const actualAscent = metrics.actualBoundingBoxAscent ?? numericFontSize
  const actualDescent = metrics.actualBoundingBoxDescent ?? numericFontSize * 0.2

  const textBoundingWidth = Math.ceil(props.letterSpacing !== 0 ? totalWidth : actualLeft + actualRight)
  const tightHeight = Math.ceil(actualAscent + actualDescent)

  const extraWidthBuffer = 10
  const offscreenWidth = textBoundingWidth + extraWidthBuffer

  offscreen.width = offscreenWidth
  offscreen.height = tightHeight

  const xOffset = extraWidthBuffer / 2
  offCtx.font = `${props.fontStyle} ${props.fontWeight} ${fontSizeStr} ${computedFontFamily}`
  offCtx.textBaseline = 'alphabetic'

  // Resolve color dynamically if it is a CSS custom property (variable)
  let resolvedColor = props.color
  if (props.color.startsWith('var(')) {
    const varName = props.color.slice(4, -1).trim()
    resolvedColor = window.getComputedStyle(canvas).getPropertyValue(varName).trim() || '#fff'
  }

  if (props.gradient && Array.isArray(props.gradient) && props.gradient.length >= 2) {
    const grad = offCtx.createLinearGradient(0, 0, offscreenWidth, 0)
    props.gradient.forEach((c, i) => grad.addColorStop(i / (props.gradient.length - 1), c))
    offCtx.fillStyle = grad
  } else {
    offCtx.fillStyle = resolvedColor
  }

  if (props.letterSpacing !== 0) {
    let xPos = xOffset
    for (const char of text) {
      offCtx.fillText(char, xPos, actualAscent)
      xPos += offCtx.measureText(char).width + props.letterSpacing
    }
  } else {
    offCtx.fillText(text, xOffset - actualLeft, actualAscent)
  }

  const horizontalMargin = props.fuzzRange + 20
  const verticalMargin = 0
  canvas.width = offscreenWidth + horizontalMargin * 2
  canvas.height = tightHeight + verticalMargin * 2
  ctx.translate(horizontalMargin, verticalMargin)

  // Align canvas visually using negative margins to cancel the horizontal layout buffers
  canvas.style.marginLeft = `-${horizontalMargin + xOffset - actualLeft}px`
  canvas.style.marginRight = `-${horizontalMargin}px`
  canvas.style.display = 'inline-block'
  canvas.style.verticalAlign = 'bottom'

  const interactiveLeft = horizontalMargin + xOffset
  const interactiveTop = verticalMargin
  const interactiveRight = interactiveLeft + textBoundingWidth
  const interactiveBottom = interactiveTop + tightHeight

  let isHovering = false
  let isClicking = false
  let isGlitching = false
  let currentIntensity = props.baseIntensity
  let targetIntensity = props.baseIntensity
  let lastFrameTime = 0
  const frameDuration = 1000 / props.fps
  let animationFrameId
  let glitchTimeoutId
  let glitchEndTimeoutId
  let clickTimeoutId

  const startGlitchLoop = () => {
    if (!props.glitchMode) return
    glitchTimeoutId = setTimeout(() => {
      isGlitching = true
      glitchEndTimeoutId = setTimeout(() => {
        isGlitching = false
        startGlitchLoop()
      }, props.glitchDuration)
    }, props.glitchInterval)
  }

  if (props.glitchMode) startGlitchLoop()

  const run = timestamp => {
    if (timestamp - lastFrameTime < frameDuration) {
      animationFrameId = window.requestAnimationFrame(run)
      return
    }
    lastFrameTime = timestamp

    ctx.clearRect(
      -props.fuzzRange - 20,
      -props.fuzzRange - 10,
      offscreenWidth + 2 * (props.fuzzRange + 20),
      tightHeight + 2 * (props.fuzzRange + 10)
    )

    if (isClicking) {
      targetIntensity = 1
    } else if (isGlitching) {
      targetIntensity = 1
    } else if (isHovering) {
      targetIntensity = props.hoverIntensity
    } else {
      targetIntensity = props.baseIntensity
    }

    if (props.transitionDuration > 0) {
      const step = 1 / (props.transitionDuration / frameDuration)
      if (currentIntensity < targetIntensity) {
        currentIntensity = Math.min(currentIntensity + step, targetIntensity)
      } else if (currentIntensity > targetIntensity) {
        currentIntensity = Math.max(currentIntensity - step, targetIntensity)
      }
    } else {
      currentIntensity = targetIntensity
    }

    if (props.direction === 'horizontal') {
      for (let j = 0; j < tightHeight; j++) {
        const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange)
        ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1)
      }
    } else if (props.direction === 'vertical') {
      for (let i = 0; i < offscreenWidth; i++) {
        const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange)
        ctx.drawImage(offscreen, i, 0, 1, tightHeight, i, dy, 1, tightHeight)
      }
    } else {
      for (let j = 0; j < tightHeight; j++) {
        const dx = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange)
        ctx.drawImage(offscreen, 0, j, offscreenWidth, 1, dx, j, offscreenWidth, 1)
      }
      const tempData = ctx.getImageData(0, 0, offscreenWidth + props.fuzzRange, tightHeight + props.fuzzRange)
      ctx.clearRect(
        -props.fuzzRange - 20,
        -props.fuzzRange - 10,
        offscreenWidth + 2 * (props.fuzzRange + 20),
        tightHeight + 2 * (props.fuzzRange + 10)
      )
      ctx.putImageData(tempData, 0, 0)
      for (let i = 0; i < offscreenWidth + props.fuzzRange; i++) {
        const dy = Math.floor(currentIntensity * (Math.random() - 0.5) * props.fuzzRange * 0.5)
        const colData = ctx.getImageData(i, 0, 1, tightHeight + props.fuzzRange)
        ctx.clearRect(i, -props.fuzzRange, 1, tightHeight + 2 * props.fuzzRange)
        ctx.putImageData(colData, i, dy)
      }
    }
    animationFrameId = window.requestAnimationFrame(run)
  }

  animationFrameId = window.requestAnimationFrame(run)

  const isInsideTextArea = (x, y) => {
    return x >= interactiveLeft && x <= interactiveRight && y >= interactiveTop && y <= interactiveBottom
  }

  const handleMouseMove = e => {
    if (!props.enableHover) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    isHovering = isInsideTextArea(x, y)
  }

  const handleMouseLeave = () => {
    isHovering = false
  }

  const handleClick = () => {
    if (!props.clickEffect) return
    isClicking = true
    clearTimeout(clickTimeoutId)
    clickTimeoutId = setTimeout(() => {
      isClicking = false
    }, 150)
  }

  const handleTouchMove = e => {
    if (!props.enableHover) return
    e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    isHovering = isInsideTextArea(x, y)
  }

  const handleTouchEnd = () => {
    isHovering = false
  }

  if (props.enableHover) {
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
  }

  if (props.clickEffect) {
    canvas.addEventListener('click', handleClick)
  }

  cleanupFn = () => {
    window.cancelAnimationFrame(animationFrameId)
    clearTimeout(glitchTimeoutId)
    clearTimeout(glitchEndTimeoutId)
    clearTimeout(clickTimeoutId)
    if (props.enableHover) {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
    if (props.clickEffect) {
      canvas.removeEventListener('click', handleClick)
    }
  }
}

onMounted(() => {
  initFuzzyText()
})

onUnmounted(() => {
  if (cleanupFn) cleanupFn()
})

watch([
  () => slots.default,
  () => props.fontSize,
  () => props.fontWeight,
  () => props.fontFamily,
  () => props.fontStyle,
  () => props.color,
  () => themeStore.currentStyle,
  () => props.enableHover,
  () => props.baseIntensity,
  () => props.hoverIntensity,
  () => props.fuzzRange,
  () => props.fps,
  () => props.direction,
  () => props.transitionDuration,
  () => props.clickEffect,
  () => props.glitchMode,
  () => props.glitchInterval,
  () => props.glitchDuration,
  () => props.gradient,
  () => props.letterSpacing
], () => {
  initFuzzyText()
})
</script>

<template>
  <canvas ref="canvasRef" :class="props.className" />
</template>
