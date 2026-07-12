<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const bgCanvas = ref(null)
let animationFrameId = null
let resize = null
let handleMouseMove = null
let handleMouseLeave = null

onMounted(() => {
  const canvas = bgCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let width = 0
  let height = 0
  let particles = []
  const mouse = { x: null, y: null }

  handleMouseMove = (e) => {
    // This is desktop only anyway, but just in case
    const rect = canvas.parentElement.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }
  handleMouseLeave = () => {
    mouse.x = null
    mouse.y = null
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)

  class CornerParticle {
    constructor(cornerX, cornerY, maxRadius = 120, type = 'corner') {
      this.cornerX = cornerX
      this.cornerY = cornerY
      this.maxRadius = maxRadius
      this.type = type
      this.isFollowerCandidate = false // Will be designated in initParticles
      this.reset()
    }

    reset() {
      // Expand sector slightly by 0.15 radians (~8.5 degrees) on each side for organic overflow
      const buffer = 0.15
      const angle = -buffer + Math.random() * (Math.PI * 0.5 + 2 * buffer)
      let finalAngle = angle

      if (this.type === 'bottom-center') {
        // Spread upwards: pointing up, from 195 deg to 345 deg
        finalAngle = Math.PI + 0.25 + Math.random() * (Math.PI - 0.5)
      } else {
        // Standard corners
        const isRight = this.cornerX > width / 2
        const isBottom = this.cornerY > height / 2

        if (!isRight && !isBottom) {
          // Top Left
          finalAngle = angle
        } else if (isRight && !isBottom) {
          // Top Right
          finalAngle = Math.PI * 0.5 + angle
        } else if (!isRight && isBottom) {
          // Bottom Left
          finalAngle = Math.PI * 1.5 + angle
        } else {
          // Bottom Right
          finalAngle = Math.PI + angle
        }
      }

      // Varied radii per particle to create an organic dendritic cloud
      const radiusLimit = this.maxRadius * (0.65 + Math.random() * 0.7)
      const dist = 25 + Math.pow(Math.random(), 1.25) * (radiusLimit - 25)
      this.x = this.cornerX + Math.cos(finalAngle) * dist
      this.y = this.cornerY + Math.sin(finalAngle) * dist

      this.vx = (Math.random() - 0.5) * 0.25
      this.vy = (Math.random() - 0.5) * 0.25
      this.size = 1.5 + Math.random() * 2.5
      this.baseOpacity = 0.4 + Math.random() * 0.4
      this.opacity = this.baseOpacity
      this.originX = this.x
      this.originY = this.y
    }

    update(mouse, isAttractedToMouse) {
      this.isAttracted = isAttractedToMouse && mouse.x !== null && mouse.y !== null

      if (this.isAttracted) {
        // Smoothly ease towards the mouse cursor
        this.x += (mouse.x - this.x) * 0.12
        this.y += (mouse.y - this.y) * 0.12
        // Reset velocity so it is static while attached
        this.vx = 0
        this.vy = 0
      } else {
        const dx = this.x - this.originX
        const dy = this.y - this.originY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 25) {
          // Easing directly back to origin space without accumulating speed
          this.x += (this.originX - this.x) * 0.05
          this.y += (this.originY - this.y) * 0.05
          // Dampen velocity to prevent wild spring launching
          this.vx *= 0.8
          this.vy *= 0.8
        } else {
          // Standard drift physics when close to origin
          this.x += this.vx
          this.y += this.vy

          // Standard soft return forces
          this.vx -= dx * 0.002
          this.vy -= dy * 0.002
          
          // Friction to stabilize standard drift
          this.vx *= 0.98
          this.vy *= 0.98

          // Small random walk to keep standard drifting alive
          this.vx += (Math.random() - 0.5) * 0.015
          this.vy += (Math.random() - 0.5) * 0.015
        }
      }

      this.opacity = this.baseOpacity + Math.sin(Date.now() * 0.001 * this.size) * 0.05
    }

    draw(c) {
      if (this.isAttracted) {
        // Glow effect (outer ring)
        c.beginPath()
        c.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2)
        c.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        c.lineWidth = 1.0
        c.stroke()

        // Draw the main highlighted solid node
        c.beginPath()
        c.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2)
        c.fillStyle = '#ffffff'
        c.fill()
      } else {
        // Draw standard drifting node
        c.beginPath()
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        c.fill()
      }
    }
  }

  const initParticles = () => {
    particles = []
    const corners = [
      { x: 10, y: 10, radius: 200, count: 9, type: 'corner' },
      { x: width - 10, y: 10, radius: 320, count: 18, type: 'corner' }, // Top Right - Enlarged size & density
      { x: 10, y: height - 10, radius: 320, count: 18, type: 'corner' }, // Bottom Left - Enlarged size & density
      { x: width - 10, y: height - 10, radius: 200, count: 9, type: 'corner' },
      { x: width / 2, y: height - 20, radius: 240, count: 12, type: 'bottom-center' }
    ]
    corners.forEach(corner => {
      for (let i = 0; i < corner.count; i++) {
        const p = new CornerParticle(corner.x, corner.y, corner.radius, corner.type)
        if (i === 0) {
          p.isFollowerCandidate = true // Exactly one node per cluster tracks the mouse
        }
        particles.push(p)
      }
    })
  }

  resize = () => {
    const root = canvas.parentElement
    if (!root) return
    width = root.clientWidth
    height = root.clientHeight
    canvas.width = width
    canvas.height = height
    initParticles()
  }

  resize()
  window.addEventListener('resize', resize)

  const drawLoop = () => {
    ctx.clearRect(0, 0, width, height)

    // Reset connection counts for all particles to prevent spider web clusters
    for (let i = 0; i < particles.length; i++) {
      particles[i].connections = 0
    }

    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i]
      
      // Find if this node is the single designated follower node for its active cluster
      let isAttracted = false
      if (p1.isFollowerCandidate && mouse.x !== null && mouse.y !== null) {
        const dxAnchor = mouse.x - p1.cornerX
        const dyAnchor = mouse.y - p1.cornerY
        const distToAnchor = Math.sqrt(dxAnchor * dxAnchor + dyAnchor * dyAnchor)
        
        if (distToAnchor < p1.maxRadius + 180) {
          isAttracted = true
        }
      }

      p1.update(mouse, isAttracted)
      p1.draw(ctx)

      // Draw connection wires - maximum 2 connections per node for a clean constellation/neural tree look
      ctx.lineWidth = 1.0
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        if (p1.connections >= 2 || p2.connections >= 2) continue

        if (p1.cornerX === p2.cornerX && p1.cornerY === p2.cornerY) {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const threshold = p1.maxRadius * 0.65
          if (dist < threshold) {
            const alpha = Math.min(0.95, (1 - dist / threshold) * 0.95 * Math.min(p1.opacity, p2.opacity) * 2)
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()

            p1.connections++
            p2.connections++
          }
        }
      }
    }

    // Cybernetic structural crosshairs/corner frame brackets - thicker and brighter
    const len = 35
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.lineWidth = 2.0

    // TL
    ctx.beginPath(); ctx.moveTo(10, 10 + len); ctx.lineTo(10, 10); ctx.lineTo(10 + len, 10); ctx.stroke()
    // TR
    ctx.beginPath(); ctx.moveTo(width - 10, 10 + len); ctx.lineTo(width - 10, 10); ctx.lineTo(width - 10 - len, 10); ctx.stroke()
    // BL
    ctx.beginPath(); ctx.moveTo(10, height - 10 - len); ctx.lineTo(10, height - 10); ctx.lineTo(10 + len, height - 10); ctx.stroke()
    // BR
    ctx.beginPath(); ctx.moveTo(width - 10, height - 10 - len); ctx.lineTo(width - 10, height - 10); ctx.lineTo(width - 10 - len, height - 10); ctx.stroke()
    // Bottom Center Chevron Bracket
    ctx.beginPath(); ctx.moveTo(width / 2 - len, height - 10); ctx.lineTo(width / 2, height - 20); ctx.lineTo(width / 2 + len, height - 10); ctx.stroke()

    animationFrameId = requestAnimationFrame(drawLoop)
  }

  drawLoop()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  if (resize) {
    window.removeEventListener('resize', resize)
  }
  if (handleMouseMove) {
    window.removeEventListener('mousemove', handleMouseMove)
  }
  if (handleMouseLeave) {
    window.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<template>
  <canvas ref="bgCanvas" class="absolute inset-0 w-full h-full pointer-events-none select-none z-0"></canvas>
</template>
