<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  speed: {
    type: Number,
    default: 50
  },
  maxIterations: {
    type: Number,
    default: 10
  },
  sequential: {
    type: Boolean,
    default: false
  },
  revealDirection: {
    type: String,
    default: 'start' // 'start' | 'end' | 'center'
  },
  useOriginalCharsOnly: {
    type: Boolean,
    default: false
  },
  characters: {
    type: String,
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'
  },
  className: {
    type: String,
    default: ''
  },
  parentClassName: {
    type: String,
    default: ''
  },
  encryptedClassName: {
    type: String,
    default: ''
  },
  animateOn: {
    type: String,
    default: 'hover' // 'view' | 'hover' | 'inViewHover' | 'click'
  },
  clickMode: {
    type: String,
    default: 'once' // 'once' | 'toggle'
  }
})

const displayText = ref(props.text)
const isAnimating = ref(false)
const revealedIndices = ref(new Set())
const hasAnimated = ref(false)
const isDecrypted = ref(props.animateOn !== 'click')
const direction = ref('forward')

const containerRef = ref(null)
const orderRef = ref([])
const pointerRef = ref(0)
let intervalId = null
let clickTimeoutId = null
let observer = null

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: '0'
  }
}

const availableChars = computed(() => {
  if (props.useOriginalCharsOnly) {
    return Array.from(new Set(props.text.split(''))).filter(char => char !== ' ')
  }
  return props.characters.split('')
})

const shuffleText = (originalText, currentRevealed) => {
  return originalText
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      if (currentRevealed.has(i)) return originalText[i]
      return availableChars.value[Math.floor(Math.random() * availableChars.value.length)]
    })
    .join('')
}

const computeOrder = (len) => {
  const order = []
  if (len <= 0) return order
  if (props.revealDirection === 'start') {
    for (let i = 0; i < len; i++) order.push(i)
    return order
  }
  if (props.revealDirection === 'end') {
    for (let i = len - 1; i >= 0; i--) order.push(i)
    return order
  }
  // center
  const middle = Math.floor(len / 2)
  let offset = 0
  while (order.length < len) {
    if (offset % 2 === 0) {
      const idx = middle + offset / 2
      if (idx >= 0 && idx < len) order.push(idx)
    } else {
      const idx = middle - Math.ceil(offset / 2)
      if (idx >= 0 && idx < len) order.push(idx)
    }
    offset++
  }
  return order.slice(0, len)
}

const fillAllIndices = () => {
  const s = new Set()
  for (let i = 0; i < props.text.length; i++) s.add(i)
  return s
}

const removeRandomIndices = (set, count) => {
  const arr = Array.from(set)
  for (let i = 0; i < count && arr.length > 0; i++) {
    const idx = Math.floor(Math.random() * arr.length)
    arr.splice(idx, 1)
  }
  return new Set(arr)
}

const encryptInstantly = () => {
  const emptySet = new Set()
  revealedIndices.value = emptySet
  displayText.value = shuffleText(props.text, emptySet)
  isDecrypted.value = false
}

const triggerDecrypt = () => {
  if (props.sequential) {
    orderRef.value = computeOrder(props.text.length)
    pointerRef.value = 0
    revealedIndices.value = new Set()
  } else {
    revealedIndices.value = new Set()
  }
  direction.value = 'forward'
  isAnimating.value = true
}

const triggerReverse = () => {
  if (props.sequential) {
    orderRef.value = computeOrder(props.text.length).slice().reverse()
    pointerRef.value = 0
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  } else {
    revealedIndices.value = fillAllIndices()
    displayText.value = shuffleText(props.text, fillAllIndices())
  }
  direction.value = 'reverse'
  isAnimating.value = true
}

const cleanupInterval = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

watch(isAnimating, (animating) => {
  cleanupInterval()
  if (!animating) return

  let currentIteration = 0

  const getNextIndex = (revealedSet) => {
    const textLength = props.text.length
    switch (props.revealDirection) {
      case 'start':
        return revealedSet.size
      case 'end':
        return textLength - 1 - revealedSet.size
      case 'center': {
        const middle = Math.floor(textLength / 2)
        const offset = Math.floor(revealedSet.size / 2)
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex
        }

        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i
        }
        return 0
      }
      default:
        return revealedSet.size
    }
  }

  intervalId = setInterval(() => {
    const prevRevealed = revealedIndices.value
    if (props.sequential) {
      // Forward
      if (direction.value === 'forward') {
        if (prevRevealed.size < props.text.length) {
          const nextIndex = getNextIndex(prevRevealed)
          const newRevealed = new Set(prevRevealed)
          newRevealed.add(nextIndex)
          revealedIndices.value = newRevealed
          displayText.value = shuffleText(props.text, newRevealed)
        } else {
          cleanupInterval()
          isAnimating.value = false
          isDecrypted.value = true
        }
      }
      // Reverse
      if (direction.value === 'reverse') {
        if (pointerRef.value < orderRef.value.length) {
          const idxToRemove = orderRef.value[pointerRef.value++]
          const newRevealed = new Set(prevRevealed)
          newRevealed.delete(idxToRemove)
          revealedIndices.value = newRevealed
          displayText.value = shuffleText(props.text, newRevealed)
          if (newRevealed.size === 0) {
            cleanupInterval()
            isAnimating.value = false
            isDecrypted.value = false
          }
        } else {
          cleanupInterval()
          isAnimating.value = false
          isDecrypted.value = false
        }
      }
    } else {
      // Non-Sequential
      if (direction.value === 'forward') {
        displayText.value = shuffleText(props.text, prevRevealed)
        currentIteration++
        if (currentIteration >= props.maxIterations) {
          cleanupInterval()
          isAnimating.value = false
          displayText.value = props.text
          isDecrypted.value = true
        }
      }
      // Non-Sequential Reverse
      if (direction.value === 'reverse') {
        let currentSet = prevRevealed
        if (currentSet.size === 0) {
          currentSet = fillAllIndices()
        }
        const removeCount = Math.max(1, Math.ceil(props.text.length / Math.max(1, props.maxIterations)))
        const nextSet = removeRandomIndices(currentSet, removeCount)
        revealedIndices.value = nextSet
        displayText.value = shuffleText(props.text, nextSet)
        currentIteration++
        if (nextSet.size === 0 || currentIteration >= props.maxIterations) {
          cleanupInterval()
          isAnimating.value = false
          isDecrypted.value = false
          displayText.value = shuffleText(props.text, new Set())
          revealedIndices.value = new Set()
        }
      }
    }
  }, props.speed)
})

const handleClick = () => {
  if (props.animateOn !== 'click') return

  if (props.clickMode === 'once') {
    if (isDecrypted.value) return
    direction.value = 'forward'
    triggerDecrypt()
  }

  if (props.clickMode === 'toggle') {
    if (isDecrypted.value) {
      triggerReverse()
    } else {
      direction.value = 'forward'
      triggerDecrypt()
    }
  }
}

const triggerHoverDecrypt = () => {
  if (isAnimating.value) return

  revealedIndices.value = new Set()
  isDecrypted.value = false
  displayText.value = props.text
  direction.value = 'forward'
  isAnimating.value = true
}

const resetToPlainText = () => {
  cleanupInterval()
  isAnimating.value = false
  revealedIndices.value = new Set()
  displayText.value = props.text
  isDecrypted.value = true
  direction.value = 'forward'
}

const initObserver = () => {
  if (props.animateOn !== 'view' && props.animateOn !== 'inViewHover') return

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated.value) {
        triggerDecrypt()
        hasAnimated.value = true
      }
    })
  }

  observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  })

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
}

onMounted(() => {
  if (props.animateOn === 'click') {
    encryptInstantly()
  } else {
    displayText.value = props.text
    isDecrypted.value = true
  }
  revealedIndices.value = new Set()
  direction.value = 'forward'
  
  nextTick(() => {
    initObserver()
  })
})

onUnmounted(() => {
  cleanupInterval()
  clearTimeout(clickTimeoutId)
  if (observer && containerRef.value) {
    observer.unobserve(containerRef.value)
  }
})

watch(() => props.text, (newText) => {
  displayText.value = newText
  if (props.animateOn === 'click') {
    encryptInstantly()
  } else {
    isDecrypted.value = true
  }
})
</script>

<template>
  <span 
    ref="containerRef"
    :class="parentClassName"
    :style="styles.wrapper"
    @mouseenter="props.animateOn === 'hover' || props.animateOn === 'inViewHover' ? triggerHoverDecrypt() : null"
    @mouseleave="props.animateOn === 'hover' || props.animateOn === 'inViewHover' ? resetToPlainText() : null"
    @click="handleClick"
  >
    <span :style="styles.srOnly">{{ displayText }}</span>
    <span aria-hidden="true">
      <span 
        v-for="(char, index) in displayText.split('')" 
        :key="index"
        :class="revealedIndices.has(index) || (!isAnimating && isDecrypted) ? className : encryptedClassName"
      >{{ char }}</span>
    </span>
  </span>
</template>
