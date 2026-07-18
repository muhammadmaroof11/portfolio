<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  sparkColor: {
    type: String,
    default: '#ffffff'
  },
  sparkSize: {
    type: Number,
    default: 10
  },
  sparkRadius: {
    type: Number,
    default: 20
  },
  sparkCount: {
    type: Number,
    default: 8
  },
  duration: {
    type: Number,
    default: 400
  },
  easing: {
    type: String,
    default: 'ease-out'
  },
  extraScale: {
    type: Number,
    default: 1.0
  }
})

const canvasRef = ref(null)
const sparks = ref([])
let animationId = null

const easeFunc = (t) => {
  switch (props.easing) {
    case 'linear':
      return t
    case 'ease-in':
      return t * t
    case 'ease-in-out':
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    default:
      return t * (2 - t)
  }
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

const draw = (timestamp) => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  sparks.value = sparks.value.filter((spark) => {
    const elapsed = timestamp - spark.startTime
    if (elapsed >= props.duration) {
      return false
    }

    const progress = elapsed / props.duration
    const eased = easeFunc(progress)

    const distance = eased * props.sparkRadius * props.extraScale
    const lineLength = props.sparkSize * (1 - eased)

    const x1 = spark.x + distance * Math.cos(spark.angle)
    const y1 = spark.y + distance * Math.sin(spark.angle)
    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

    ctx.strokeStyle = props.sparkColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    return true
  })

  if (sparks.value.length > 0) {
    animationId = requestAnimationFrame(draw)
  } else {
    animationId = null
  }
}

const handleClick = (e) => {
  const canvas = canvasRef.value
  if (!canvas) return

  const x = e.clientX
  const y = e.clientY

  const now = performance.now()
  const newSparks = Array.from({ length: props.sparkCount }, (_, i) => ({
    x,
    y,
    angle: (2 * Math.PI * i) / props.sparkCount,
    startTime: now
  }))

  const wasEmpty = sparks.value.length === 0
  sparks.value.push(...newSparks)

  if (wasEmpty) {
    if (animationId) cancelAnimationFrame(animationId)
    animationId = requestAnimationFrame(draw)
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('click', handleClick)
  resizeCanvas()
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('click', handleClick)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    style="width: 100vw; height: 100vh; display: block; user-select: none; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;"
  />
</template>
