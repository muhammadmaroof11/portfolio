<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, watch } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Cpu, Shield, ChevronRight, Zap } from 'lucide-vue-next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const themeStore = useThemeStore()
const selectedChallenge = ref('ALL')
const challenges = [
  'ALL',
  'Automate Operations',
  'Scale User Growth',
  'Deploy Agentic AI',
  'Launch Mobile Products'
]

const projects = computed(() => {
  if (selectedChallenge.value === 'ALL') return portfolioData.projects
  return portfolioData.projects.filter(p => p.challenges?.includes(selectedChallenge.value))
})

const activeProjectViews = ref({}) // mapping project ID -> 'overview' or 'blueprint'
const toggleProjectView = (id) => {
  activeProjectViews.value[id] = activeProjectViews.value[id] === 'blueprint' ? 'overview' : 'blueprint'
}

const containerRef = ref(null)
const pinnedRef = ref(null)
const canvasRef = ref(null)
const headingRef = ref(null)

const cardRefs = ref({})
const setCardRef = (el, index) => {
  if (el) {
    cardRefs.value[index] = el
  } else {
    delete cardRefs.value[index]
  }
}

const scrollProgress = ref(0)
let ctx = null
let animationId = null

// Cinematic Camera & Parallax properties
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0
let meshCenterX = 0

// Neural Mesh state
let nodes = []
let edges = []
let signals = []
let cameraRotY = 0
let cameraRotX = 0

// Telemetry state values
const activeTitle = ref('')
const scramblerInterval = ref(null)
const activeSubtitle = ref('')
const telemetryCoordX = ref('45.291')
const telemetryCoordY = ref('09.433')
const telemetrySignal = ref(98.5)

// Scramble text function to simulate cinematic decryption
const scrambleActiveTitle = (targetText) => {
  if (scramblerInterval.value) clearInterval(scramblerInterval.value)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
  let iterations = 0
  const maxIterations = 10
  
  scramblerInterval.value = setInterval(() => {
    activeTitle.value = targetText.split('').map((char, index) => {
      if (char === ' ') return ' '
      if (index < iterations) return targetText[index]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join('')
    
    if (iterations >= targetText.length) {
      activeTitle.value = targetText
      clearInterval(scramblerInterval.value)
    }
    iterations += Math.ceil(targetText.length / maxIterations)
  }, 35)
}

// Compute active index
const activeIndex = computed(() => {
  if (projects.value.length === 0) return 0
  const index = Math.floor(scrollProgress.value * projects.value.length)
  return Math.min(index, projects.value.length - 1)
})

// Update scrambler when activeIndex changes
watch(activeIndex, (newVal) => {
  const currentProj = projects.value[newVal]
  if (currentProj) {
    scrambleActiveTitle(currentProj.title)
    activeSubtitle.value = currentProj.tech.join(' // ')
    
    // Animate telemetry values
    telemetryCoordX.value = (Math.random() * 90 + 10).toFixed(3)
    telemetryCoordY.value = (Math.random() * 90 + 10).toFixed(3)
    telemetrySignal.value = parseFloat((95 + Math.random() * 4.9).toFixed(1))
  }
}, { immediate: true })

watch(selectedChallenge, () => {
  nextTick(() => {
    updateDimensions()
    if (scrollTriggerInstance) {
      scrollTriggerInstance.refresh()
    }
  })
})

// ─── NEURAL MESH ENGINE ──────────────────────────────────────────
const NODE_COUNT = 72
const HUB_SPHERE_R = 340
const CONNECT_DIST = 210
const MAX_SIGS = 50

// Calculates the target mathematical coordinates to form a humanoid brain structure
function getBrainCoord(nodeIndex, totalNodes) {
  const phi = Math.acos(1 - 2 * (nodeIndex + 0.5) / totalNodes);
  const theta = Math.PI * (1 + Math.sqrt(5)) * nodeIndex;
  
  const isLeft = nodeIndex % 2 === 0;
  
  // Scaled up radii to make the brain much larger and more prominent
  const brainScale = isMobile.value ? 0.7 : (isTablet.value ? 0.8 : 0.62);
  const rx = 210 * brainScale;
  const ry = 240 * brainScale;
  const rz = 260 * brainScale;
  
  let bx = Math.sin(phi) * Math.cos(theta);
  let by = Math.sin(phi) * Math.sin(theta);
  let bz = Math.cos(phi);
  
  // Separate hemispheres with a clean central fissure gap
  const gap = 16;
  if (isLeft) {
    bx = -Math.abs(bx) * rx - gap;
  } else {
    bx = Math.abs(bx) * rx + gap;
  }
  
  let x = bx;
  let y = by * ry;
  let z = bz * rz;
  
  // ─── ANATOMICAL BRAIN SHAPING ───
  // 1. Frontal Lobe (narrower at the front)
  // z > 0 is front
  if (z > 0) {
    const frontalT = z / rz;
    x *= (1 - frontalT * 0.24);
    y *= (1 - frontalT * 0.12);
  }
  
  // 2. Occipital Lobe (sloped down and wider at the back)
  if (z < 0) {
    const occipitalT = Math.abs(z / rz);
    y -= occipitalT * 42; // curve downwards
  }
  
  // 3. Temporal Lobes (bulges at bottom sides)
  if (y < 20 && z > -40 && z < 100) {
    const tempFactor = Math.cos((z - 30) * 0.02) * Math.cos(y * 0.015);
    x += Math.sign(x) * 24 * Math.abs(tempFactor);
  }
  
  // 4. Cerebellum (separate structure at lower back: z < -80, y < -35)
  if (z < -80 && y < -35) {
    x = Math.sign(x) * (45 + Math.abs(Math.sin(theta * 2.5)) * 30);
    y = -105 + Math.cos(phi * 3) * 25;
    z = -140 + Math.sin(phi * 2) * 20;
  }
  
  // 5. Brain Stem (vertical protrusion at bottom center: y < -100, x close to 0)
  const isStemNode = nodeIndex % 12 === 0 && !isLeft && z < 40 && z > -80;
  if (isStemNode) {
    x = Math.sin(nodeIndex) * 15;
    z = -20 + Math.cos(nodeIndex) * 15;
    y = -130 - (nodeIndex % 5) * 15;
  }
  
  // ─── DENSE HIGH-FREQUENCY SULCI & GYRI (Folds) ───
  if (!isStemNode) {
    // Combine multiple sine waves for rich fold topology details
    const wrinkleVal = (Math.sin(x * 0.055) * Math.cos(y * 0.055) * Math.sin(z * 0.055) * 24) +
                       (Math.sin(x * 0.12) * Math.cos(z * 0.12) * 8);
    
    // Apply perturbation along the normal directions
    x += wrinkleVal * Math.cos(theta) * 0.6;
    y += wrinkleVal * Math.sin(theta) * 0.6;
    z += wrinkleVal * Math.cos(phi) * 0.6;
  }
  
  // Center alignment: shift down slightly
  y += 10;
  
  return { x, y, z };
}

// Calculates the target mathematical coordinates for 0-9 digits
function getDigitCoord(digit, t) {
  let x = 0, y = 0;
  switch (digit) {
    case 0:
      {
        const angle = t * Math.PI * 2;
        x = 55 * Math.cos(angle);
        y = 110 * Math.sin(angle);
      }
      break;
    case 1:
      if (t < 0.8) {
        const subT = t / 0.8;
        x = 10;
        y = -110 + subT * 220;
      } else {
        const subT = (t - 0.8) / 0.2;
        x = 10 - subT * 35;
        y = -110 + subT * 35;
      }
      break;
    case 2:
      if (t < 0.45) {
        const subT = t / 0.45;
        const angle = -Math.PI + subT * Math.PI;
        x = 10 + 50 * Math.cos(angle);
        y = -60 + 50 * Math.sin(angle);
      } else if (t < 0.75) {
        const subT = (t - 0.45) / 0.3;
        x = 60 - subT * 110;
        y = -60 + subT * 170;
      } else {
        const subT = (t - 0.75) / 0.25;
        x = -50 + subT * 110;
        y = 110;
      }
      break;
    case 3:
      if (t < 0.45) {
        const subT = t / 0.45;
        const angle = -Math.PI * 1.25 + subT * Math.PI * 1.25;
        x = 10 + 50 * Math.cos(angle);
        y = -55 + 55 * Math.sin(angle);
      } else {
        const subT = (t - 0.45) / 0.55;
        const angle = -Math.PI * 0.95 + subT * Math.PI * 1.35;
        x = 5 + 55 * Math.cos(angle);
        y = 55 + 55 * Math.sin(angle);
      }
      break;
    case 4:
      if (t < 0.4) {
        const subT = t / 0.4;
        x = 25 - subT * 75;
        y = -110 + subT * 150;
      } else if (t < 0.7) {
        const subT = (t - 0.4) / 0.3;
        x = -50 + subT * 110;
        y = 40;
      } else {
        const subT = (t - 0.7) / 0.3;
        x = 25;
        y = -110 + subT * 220;
      }
      break;
    case 5:
      if (t < 0.25) {
        const subT = t / 0.25;
        x = 55 - subT * 105;
        y = -110;
      } else if (t < 0.45) {
        const subT = (t - 0.25) / 0.2;
        x = -50;
        y = -110 + subT * 90;
      } else {
        const subT = (t - 0.45) / 0.55;
        const angle = -Math.PI * 0.75 + subT * Math.PI * 1.5;
        x = 5 + 55 * Math.cos(angle);
        y = 45 + 65 * Math.sin(angle);
      }
      break;
    case 6:
      if (t < 0.4) {
        const subT = t / 0.4;
        x = 45 - subT * 95;
        y = -110 + subT * 145;
      } else {
        const subT = (t - 0.4) / 0.6;
        const angle = -Math.PI + subT * Math.PI * 2;
        x = -5 + 50 * Math.cos(angle);
        y = 55 + 55 * Math.sin(angle);
      }
      break;
  }
  return { x, y };
}

// Calculates target coordinates to spell "1", "2", "3", "4", "5", "6"
function getNumberCoord(projIndex, nodeIndex, totalNodes) {
  const t = nodeIndex / (totalNodes - 1 || 1);
  const pt = getDigitCoord(projIndex + 1, t);
  
  // Scale factor: compact on desktop (1.32), readable on tablet (1.9) and mobile (1.8)
  const scale = isMobile.value ? 1.8 : (isTablet.value ? 1.9 : 1.32);
  const dx = pt.x * scale;
  const dy = pt.y * scale;
  
  const zScale = isMobile.value ? 0.85 : (isTablet.value ? 0.9 : 0.58);
  const z = ((nodeIndex % 2 === 0 ? -60 : 60) + (Math.sin(nodeIndex * 1.7) * 15)) * zScale;
  
  return { x: dx, y: dy, z };
}

function initMesh(numProjects) {
  nodes = []; edges = []; signals = []
  const totalNodes = numProjects + NODE_COUNT;

  // Create temporary shell layouts to build uniform topological connections
  for (let i = 0; i < totalNodes; i++) {
    const isHub = i < numProjects;
    const hubIndex = isHub ? i : -1;
    
    const phi = Math.acos(1 - 2 * (i + 0.5) / totalNodes);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const R = 320;
    const sx = R * Math.sin(phi) * Math.cos(theta);
    const sy = R * Math.sin(phi) * Math.sin(theta);
    const sz = R * Math.cos(phi);

    nodes.push({
      x: sx, y: sy, z: sz,
      targetX: sx, targetY: sy, targetZ: sz,
      isHub, hubIndex,
      size: isHub ? 6 : 1.8 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  // Build edges based on initial uniform spherical layout
  buildEdges();

  // Morph immediately to the initial humanoid brain targets
  nodes.forEach((n, i) => {
    const tCoord = getBrainCoord(i, totalNodes);
    n.x = tCoord.x;
    n.y = tCoord.y;
    n.z = tCoord.z;
    n.targetX = tCoord.x;
    n.targetY = tCoord.y;
    n.targetZ = tCoord.z;
  });
}

function buildEdges() {
  edges = []
  const maxPer = 5
  const counts = new Array(nodes.length).fill(0)
  for (let i = 0; i < nodes.length; i++) {
    const near = []
    const isLeftI = i % 2 === 0
    for (let j = i + 1; j < nodes.length; j++) {
      const isLeftJ = j % 2 === 0
      // ONLY connect nodes that belong to the same hemisphere/digit side
      if (isLeftI !== isLeftJ) continue
      
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dz = nodes[i].z - nodes[j].z
      const d = Math.sqrt(dx*dx + dy*dy + dz*dz)
      if (d < CONNECT_DIST) near.push({ j, d })
    }
    near.sort((a, b) => a.d - b.d)
    for (const { j } of near.slice(0, maxPer)) {
      if (counts[i] < maxPer && counts[j] < maxPer) {
        edges.push({ a: i, b: j })
        counts[i]++; counts[j]++
      }
    }
  }
}

function spawnSignal() {
  if (signals.length >= MAX_SIGS || !edges.length) return
  const activeHub = activeIndex.value
  const hubEdges = edges.filter(e => nodes[e.a].hubIndex === activeHub || nodes[e.b].hubIndex === activeHub)
  const pool = Math.random() < 0.45 && hubEdges.length ? hubEdges : edges
  const e = pool[Math.floor(Math.random() * pool.length)]
  const rev = Math.random() < 0.5
  signals.push({
    from: rev ? e.b : e.a, to: rev ? e.a : e.b,
    t: 0, speed: 0.007 + Math.random() * 0.013,
    size: 2 + Math.random() * 2.5, opacity: 0.7 + Math.random() * 0.3
  })
}

function project3D(n, W, H, fov) {
  // Rotate Y (scroll yaw)
  const cy = Math.cos(cameraRotY), sy = Math.sin(cameraRotY)
  let rx = n.x * cy + n.z * sy
  let ry = n.y
  let rz = -n.x * sy + n.z * cy
  // Rotate X (pitch arc)
  const cx = Math.cos(cameraRotX), sx = Math.sin(cameraRotX)
  const ry2 = ry * cx - rz * sx
  const rz2 = ry * sx + rz * cx + fov
  if (rz2 <= 1) return null
  const s = fov / rz2
  // Read meshCenterX from the outer script scope with W / 2 fallback
  const cxVal = meshCenterX || (W / 2)
  return { x: cxVal + rx * s + mouseX, y: H / 2 + 45 + ry2 * s + mouseY, z: rz2, s }
}

const drawMesh = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx2 = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const time = Date.now() * 0.001
  const fov = 950

  mouseX += (targetMouseX - mouseX) * 0.04
  mouseY += (targetMouseY - mouseY) * 0.04

  // Smoothly shift the horizontal center of the mesh to balance the active layout
  let targetCenterX = W / 2
  if (W >= 1024 && !isTablet.value) {
    if (scrollProgress.value > 0.015) {
      if (activeIndex.value % 2 === 0) {
        // Even index project card is on the right side, shift mesh left
        targetCenterX = W / 2 - 280
      } else {
        // Odd index project card is on the left side, shift mesh right
        targetCenterX = W / 2 + 280
      }
    }
  }
  // On tablet: always keep mesh centered
  if (isTablet.value) {
    targetCenterX = W / 2
  }
  if (!meshCenterX) {
    meshCenterX = targetCenterX
  } else {
    meshCenterX += (targetCenterX - meshCenterX) * 0.045
  }

  // Keep letters facing the front, with a subtle continuous organic 3D float
  const targetY = Math.sin(time * 0.35) * 0.16
  const targetX = Math.cos(time * 0.35) * 0.08
  cameraRotY += (targetY - cameraRotY) * 0.035
  cameraRotX += (targetX - cameraRotX) * 0.035

  // Interpolate node positions towards current active number formation or brain shape
  nodes.forEach((n, i) => {
    // Before lock in, use Brain. After lock in, morph to project numbers (01, 02, etc.)
    const tCoord = scrollProgress.value <= 0.015
      ? getBrainCoord(i, nodes.length)
      : getNumberCoord(activeIndex.value, i, nodes.length);
    
    // Lerp targets
    n.targetX += (tCoord.x - n.targetX) * 0.045;
    n.targetY += (tCoord.y - n.targetY) * 0.045;
    n.targetZ += (tCoord.z - n.targetZ) * 0.045;

    // Apply continuous organic orbital drift/vibration
    const driftAmp = n.isHub ? 3 : 10;
    n.x = n.targetX + Math.sin(time * 0.65 + n.pulse) * driftAmp;
    n.y = n.targetY + Math.cos(time * 0.65 + n.pulse) * driftAmp;
    n.z = n.targetZ + Math.sin(time * 0.35 + n.pulse) * driftAmp;
  })

  ctx2.clearRect(0, 0, W, H)

  const isStreet = themeStore.currentStyle === 'street'
  const pRGB = isStreet ? [0, 255, 255] : [34, 197, 94]
  const sRGB = isStreet ? [255, 0, 255] : [16, 185, 129]
  const pCol = `rgb(${pRGB})`
  const sCol = `rgb(${sRGB})`

  // Project all nodes
  const proj = nodes.map(n => project3D(n, W, H, fov))

  // Draw edges
  edges.forEach(({ a, b }) => {
    const pa = proj[a], pb = proj[b]
    if (!pa || !pb) return
    const depth = ((pa.z + pb.z) / 2 - fov) / (HUB_SPHERE_R * 2)
    const alpha = Math.max(0, (1 - depth)) * 0.22
    const isActive = nodes[a].hubIndex === activeIndex.value || nodes[b].hubIndex === activeIndex.value
    
    ctx2.beginPath()
    ctx2.moveTo(pa.x, pa.y)
    ctx2.lineTo(pb.x, pb.y)
    
    if (isActive) {
      // First pass: Glow (wider line, lower opacity)
      ctx2.strokeStyle = `rgba(${pRGB},${Math.min(alpha * 1.5, 0.35)})`
      ctx2.lineWidth = 4.0
      ctx2.stroke()
      
      // Second pass: Core (thinner line, higher opacity)
      ctx2.strokeStyle = `rgba(${pRGB},${Math.min(alpha * 4.0, 0.9)})`
      ctx2.lineWidth = 1.75
      ctx2.stroke()
    } else {
      ctx2.strokeStyle = `rgba(${pRGB},${alpha})`
      ctx2.lineWidth = 0.85
      ctx2.stroke()
    }
  })

  // Update & draw signals
  signals = signals.filter(sig => sig.t < 1)
  signals.forEach(sig => {
    sig.t += sig.speed
    const pa = proj[sig.from], pb = proj[sig.to]
    if (!pa || !pb) return
    const sx = pa.x + (pb.x - pa.x) * sig.t
    const sy = pa.y + (pb.y - pa.y) * sig.t
    const trail = 0.1
    const tx = pa.x + (pb.x - pa.x) * Math.max(0, sig.t - trail)
    const ty = pa.y + (pb.y - pa.y) * Math.max(0, sig.t - trail)
    const isAct = nodes[sig.from].hubIndex === activeIndex.value || nodes[sig.to].hubIndex === activeIndex.value
    const col = isAct ? pRGB : sRGB
    const colStr = isAct ? pCol : sCol
    const grad = ctx2.createLinearGradient(tx, ty, sx, sy)
    grad.addColorStop(0, `rgba(${col},0)`)
    grad.addColorStop(1, `rgba(${col},${sig.opacity})`)
    // First pass: Glow line (wider, lower opacity)
    ctx2.beginPath()
    ctx2.moveTo(tx, ty)
    ctx2.lineTo(sx, sy)
    ctx2.strokeStyle = `rgba(${col},${sig.opacity * 0.22})`
    ctx2.lineWidth = isAct ? 7.5 : 4.0
    ctx2.stroke()
    
    // Second pass: Core line (thinner, gradient color)
    ctx2.beginPath()
    ctx2.moveTo(tx, ty)
    ctx2.lineTo(sx, sy)
    ctx2.strokeStyle = grad
    ctx2.lineWidth = isAct ? 3.0 : 1.75
    ctx2.stroke()
    
    // Signal dot core
    ctx2.beginPath()
    ctx2.arc(sx, sy, sig.size * ((pa.s + pb.s) / 2) * (isAct ? 1.6 : 1), 0, Math.PI * 2)
    ctx2.fillStyle = `rgba(${col},${sig.opacity})`
    ctx2.fill()
  })
  if (Math.random() < 0.18) spawnSignal()

  // Draw nodes
  nodes.forEach((n, i) => {
    const p = proj[i]
    if (!p) return
    const depth = (p.z - fov) / (HUB_SPHERE_R * 2)
    const bright = Math.max(0, 1 - depth * 0.7)
    const isActiveHub = n.isHub && n.hubIndex === activeIndex.value
    const pulse = isActiveHub ? 1 + 0.35 * Math.sin(time * 2.5 + n.pulse) : 1
    const r = n.size * p.s * pulse * (isActiveHub ? 2.2 : 1)

    if (isActiveHub) {
      // Outer ring + core glow
      ;[r * 2.8, r * 1.7].forEach((ring, ri) => {
        ctx2.beginPath()
        ctx2.arc(p.x, p.y, ring, 0, Math.PI * 2)
        ctx2.strokeStyle = `rgba(${pRGB},${bright * (ri === 0 ? 0.2 : 0.45)})`
        ctx2.lineWidth = ri === 0 ? 0.8 : 1.3
        ctx2.stroke()
      })
      // Glow fill pass
      ctx2.beginPath()
      ctx2.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2)
      ctx2.fillStyle = `rgba(${pRGB},${bright * 0.25})`
      ctx2.fill()
      
      // Core fill pass
      ctx2.beginPath()
      ctx2.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx2.fillStyle = `rgba(${pRGB},${bright})`
      ctx2.fill()
    } else if (n.isHub) {
      // Glow fill pass for inactive hubs
      ctx2.beginPath()
      ctx2.arc(p.x, p.y, r * 1.8, 0, Math.PI * 2)
      ctx2.fillStyle = `rgba(${sRGB},${bright * 0.15})`
      ctx2.fill()
      
      // Core fill pass for inactive hubs
      ctx2.beginPath()
      ctx2.arc(p.x, p.y, r * 1.3, 0, Math.PI * 2)
      ctx2.fillStyle = `rgba(${sRGB},${bright * 0.55})`
      ctx2.fill()
    } else {
      ctx2.beginPath()
      ctx2.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx2.fillStyle = `rgba(${pRGB},${bright * 0.65})`
      ctx2.fill()
    }
  })

  // Animated wire to active card
  if (window.innerWidth >= 1024 && scrollProgress.value > 0.01 && scrollProgress.value < 0.99) {
    const activeCard = cardRefs.value[activeIndex.value]
    if (activeCard) {
      const cardBox = activeCard.querySelector('.project-card-box')
      if (cardBox) {
        const cr = cardBox.getBoundingClientRect()
        const canR = canvas.getBoundingClientRect()
        const hubProj = proj[activeIndex.value]
        if (hubProj) {
          const isEven = activeIndex.value % 2 === 0
          const cardX = isEven ? cr.left - canR.left : cr.right - canR.left
          const cardY = cr.top - canR.top + cr.height / 2
          const wt = time * 2.2
          const segs = 36
          ctx2.beginPath()
          for (let i = 0; i <= segs; i++) {
            const t = i / segs
            const wx = hubProj.x + (cardX - hubProj.x) * t
            const amp = 10 * Math.sin(t * Math.PI) * Math.sin(wt + t * 5)
            const wy = hubProj.y + (cardY - hubProj.y) * t + amp
            i === 0 ? ctx2.moveTo(wx, wy) : ctx2.lineTo(wx, wy)
          }
          // Fade in/out at scroll boundaries
          const sub = scrollProgress.value * projects.value.length - activeIndex.value
          const wireOp = sub < 0.15 ? sub / 0.15 : sub > 0.85 ? (1 - sub) / 0.15 : 1
          
          ctx2.setLineDash([4, 7])
          
          // First pass: Glow line (wider, lower opacity)
          ctx2.strokeStyle = `rgba(${pRGB},${wireOp * 0.18})`
          ctx2.lineWidth = 5.0
          ctx2.stroke()
          
          // Second pass: Core line (thinner, higher opacity)
          ctx2.strokeStyle = `rgba(${pRGB},${wireOp * 0.55})`
          ctx2.lineWidth = 2.2
          ctx2.stroke()
          
          ctx2.setLineDash([])
        }
      }
    }
  }

  animationId = requestAnimationFrame(drawMesh)
}
// ─────────────────────────────────────────────────────────────────

// Initialize floating particles and spark splatters
const initParticles = (width, height) => {
  initMesh(projects.value.length)
}

const isMobile = ref(false)
const isTablet = ref(false)
const isMobileOrTablet = ref(false)

const updateDimensions = () => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  canvas.width = canvas.parentElement.clientWidth
  canvas.height = canvas.parentElement.clientHeight
  isMobile.value = window.innerWidth < 768
  isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
  isMobileOrTablet.value = window.innerWidth < 1024
  initMesh(projects.value.length)
}

let scrollTriggerInstance = null

const handleMouseMove = (e) => {
  targetMouseX = (e.clientX / window.innerWidth - 0.5) * -70
  targetMouseY = (e.clientY / window.innerHeight - 0.5) * -70
}

const scrollToProject = (index) => {
  if (!scrollTriggerInstance) return
  const start = scrollTriggerInstance.start
  const end = scrollTriggerInstance.end
  const step = (end - start) / projects.value.length
  const target = start + index * step + step * 0.5
  window.scrollTo({
    top: target,
    behavior: 'smooth'
  })
}

onMounted(async () => {
  await nextTick()
  updateDimensions()
  window.addEventListener('resize', updateDimensions)
  window.addEventListener('mousemove', handleMouseMove)

  // Only run heavy 3D animation and scroll-pin on desktop
  if (!isMobileOrTablet.value) {
    // Re-measure after font loads so heading width is accurate for DNA radius
    setTimeout(() => {
      updateDimensions()
      ScrollTrigger.refresh()
    }, 150)
    
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: pinnedRef.value,
      // Pin immediately when the top of the container reaches the navbar bottom (80px)
      start: 'top 80px',
      end: `+=${projects.value.length * 150}%`,
      pin: pinnedRef.value,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgress.value = self.progress
      }
    })
    
    drawMesh()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateDimensions)
  window.removeEventListener('mousemove', handleMouseMove)
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill()
  }
  cancelAnimationFrame(animationId)
  if (scramblerInterval.value) clearInterval(scramblerInterval.value)
})

</script>

<template>
  <div ref="containerRef" class="relative w-full overflow-visible">

    <!-- ===== WAVY DIVIDER + SECTION HEADING ===== -->
    <div class="relative w-full overflow-hidden" style="margin-bottom: -2px;">
      <!-- Animated wavy SVG separator -->
      <svg
        viewBox="0 0 1440 90"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        class="w-full block synaptic-wave-divider"
        style="height: 90px;"
      >
        <path
          class="synaptic-wave-path"
          :style="{ stroke: themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e' }"
          fill="none"
          stroke-width="2.5"
          opacity="0.55"
          d="M0,45 C60,15 120,75 180,45 C240,15 300,75 360,45 C420,15 480,75 540,45 C600,15 660,75 720,45 C780,15 840,75 900,45 C960,15 1020,75 1080,45 C1140,15 1200,75 1260,45 C1320,15 1380,75 1440,45"
        />
        <path
          class="synaptic-wave-path-2"
          :style="{ stroke: themeStore.currentStyle === 'street' ? '#ff00ff' : '#10b981' }"
          fill="none"
          stroke-width="1.5"
          opacity="0.3"
          d="M0,55 C80,25 160,85 240,55 C320,25 400,85 480,55 C560,25 640,85 720,55 C800,25 880,85 960,55 C1040,25 1120,85 1200,55 C1280,25 1360,85 1440,55"
        />
      </svg>

      <!-- Glow line underneath waves -->
      <div
        class="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        :style="{ background: `linear-gradient(to right, transparent, ${ themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e' }55, transparent)` }"
      />
    </div>

    <!-- ===== MOBILE / TABLET: Scrollable project cards (no heavy animation) ===== -->
    <div class="lg:hidden px-4 sm:px-6 md:px-10 pb-12">
      <!-- Section heading -->
      <div class="text-center mb-6 mt-12 md:mt-16">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-2 block">PORTFOLIO</span>
        <h2 class="font-headline text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-on-surface">
          FEATURED <span class="text-primary italic">PROJECTS</span>
        </h2>
      </div>


      <!-- Scrollable card grid (Merged Card + Archive layout for Mobile & Tablet) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-6">
        <div v-for="(project, index) in projects" :key="project.id" class="flex flex-col gap-0 h-full">

          <!-- Visual card: image + title (NO description, NO tags) -->
          <div
            class="group relative flex flex-col p-4 overflow-hidden backdrop-blur-md w-full pointer-events-auto transition-all"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 1.2) calc(var(--app-radius) * 1.2) 0 0' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface' :
              themeStore.currentStyle === 'street' ? 'street-card border-2 border-b-0 border-black bg-surface-container-low/95' :
              'border border-b-0 border-primary/10 bg-surface-container-low/80 backdrop-blur-3xl shadow-xl'
            ]"
          >
            <!-- Corner Brackets -->
            <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute inset-0 pointer-events-none z-10">
              <div class="absolute top-3 left-3 w-4 h-4 border-t-[2px] border-l-[2px] border-primary/25 group-hover:border-primary transition-colors duration-500"></div>
              <div class="absolute top-3 right-3 w-4 h-4 border-t-[2px] border-r-[2px] border-primary/25 group-hover:border-primary transition-colors duration-500"></div>
            </div>

            <!-- Sequence indicator -->
            <span class="absolute top-3 right-5 font-mono font-black text-2xl text-primary/10 select-none z-10">0{{ index + 1 }}</span>

            <!-- Image preview -->
            <div
              class="relative overflow-hidden flex items-center justify-center bg-black/15 dark:bg-black/50 border border-primary/5 max-h-[180px] z-10 mb-3"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.7)' }"
            >
              <img :src="project.image" alt="" class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none" />
              <img :src="project.image" :alt="project.title" class="relative z-10 max-h-[140px] w-auto h-auto object-contain rounded-lg p-2 transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>



            <!-- Title -->
            <h3 class="text-base sm:text-lg font-headline font-black uppercase tracking-tight text-on-surface mb-0 leading-none z-10">{{ project.title }}</h3>
          </div>

          <!-- Archive row: sits flush below the card, connected visually -->
          <div
            class="px-4 py-4 border border-t-0 flex flex-col flex-1"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '0 0 calc(var(--app-radius) * 1.2) calc(var(--app-radius) * 1.2)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'bg-surface border-4 border-t-0 border-on-surface' :
              themeStore.currentStyle === 'street' ? 'border-2 border-t-0 border-black bg-surface-container-low/60' :
              'border-primary/10 bg-surface-container-lowest/60'
            ]"
          >
            <!-- All tech tags -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span
                v-for="tag in project.tech"
                :key="tag"
                class="text-[7px] font-black px-2 py-0.5 bg-surface-container-high/60 border border-primary/10 text-primary uppercase tracking-widest rounded"
              >{{ tag }}</span>
            </div>

            <!-- Description / Blueprint View Switcher -->
            <div class="flex items-center gap-3 mb-3 border-b border-on-surface/5 pb-1.5 text-[8px] font-mono">
              <button 
                @click="activeProjectViews[project.id] = 'overview'" 
                class="uppercase tracking-widest font-black active-spring"
                :class="activeProjectViews[project.id] !== 'blueprint' ? 'text-primary' : 'text-on-surface/40'"
              >Overview</button>
              <span class="text-on-surface/20">|</span>
              <button 
                @click="activeProjectViews[project.id] = 'blueprint'" 
                class="uppercase tracking-widest font-black flex items-center gap-1 active-spring"
                :class="activeProjectViews[project.id] === 'blueprint' ? 'text-primary' : 'text-on-surface/40'"
              >
                Blueprint <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block"></span>
              </button>
            </div>

            <!-- Description -->
            <p v-if="activeProjectViews[project.id] !== 'blueprint'" class="text-on-surface-variant text-[11px] leading-relaxed font-body font-medium opacity-85 mb-4 flex-1">
              {{ project.description }}
            </p>

            <!-- Blueprint View -->
            <div v-else class="flex flex-col gap-1.5 mb-4 text-left font-mono text-[8px] flex-1">
              <div class="p-1.5 border border-primary/10 rounded bg-surface-container-high/40">
                <span class="text-primary font-black block">⚡ AI CORE:</span>
                <span class="text-on-surface-variant leading-tight block mt-0.5">{{ project.blueprint?.ai }}</span>
              </div>
              <div class="p-1.5 border border-primary/10 rounded bg-surface-container-high/40">
                <span class="text-primary font-black block">⚙️ SCALE LAYER:</span>
                <span class="text-on-surface-variant leading-tight block mt-0.5">{{ project.blueprint?.scalability }}</span>
              </div>
              <div class="p-1.5 border border-primary/10 rounded bg-surface-container-high/40">
                <span class="text-primary font-black block">👁️ UX INTERFACE:</span>
                <span class="text-on-surface-variant leading-tight block mt-0.5">{{ project.blueprint?.ux }}</span>
              </div>
            </div>

            <!-- Year + CTA -->
            <div class="flex items-center justify-between mt-auto">
              <div class="flex flex-col">
                <span class="font-mono text-[7px] font-bold text-on-surface/30 uppercase tracking-wider">COMPILED YEAR</span>
                <span class="font-headline font-black text-xs text-primary tracking-widest">{{ project.year || '2026' }}</span>
              </div>
              <a
                v-if="project.link && project.link !== '#'"
                :href="project.link"
                target="_blank"
                class="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-on-primary font-black text-[10px] tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[1.03] active-spring shadow-md shadow-primary/10"
                :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) / 4)' }"
                v-ripple
              >
                LOAD PROTOCOL <ArrowRight class="w-3 h-3 -rotate-45" />
              </a>
              <span
                v-else-if="project.hoverText"
                class="px-3 py-2 bg-surface-container-high text-on-surface/40 font-black text-[10px] tracking-[0.15em] uppercase rounded-md"
              >{{ project.hoverText }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ===== DESKTOP: Pinned neural mesh experience (lg+ only) ===== -->
    <!-- Pinned viewport container with calc(100vh - 80px) to clear navbar -->
    <div ref="pinnedRef" class="hidden lg:flex pinned-container h-[calc(100vh-80px)] w-full relative items-center justify-center overflow-hidden" :style="{ background: 'var(--color-background)' }">
      


      <!-- Section Heading inside the pinned screen-locked container -->
      <div class="absolute top-6 md:top-24 lg:top-10 xl:top-12 left-0 right-0 z-40 flex flex-col items-center justify-center px-4 pointer-events-none">
        <div class="text-center">
          <h2 class="font-headline text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black uppercase tracking-tight text-on-surface">
            FEATURED <span class="text-primary italic">PROJECTS</span>
          </h2>
        </div>
        <div
          class="h-[1.5px] mt-2 rounded-full synaptic-heading-bar opacity-75 animate-pulse"
          :style="{ background: themeStore.currentStyle === 'street' ? '#00ffff' : '#22c55e', width: '60px' }"
        />
      </div>

      <!-- Gradient masks for seamless section blend -->
      <div class="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)` }">
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[45]"
        :style="{ background: `linear-gradient(to top, var(--color-background) 0%, transparent 100%)` }">
      </div>

      <!-- Cyberpunk Grid Backplate -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10"></div>
      <div 
        class="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        :style="{
          backgroundImage: `linear-gradient(to right, ${themeStore.currentStyle === 'street' ? '#ff00ff' : '#22c55e'} 1px, transparent 1px), linear-gradient(to bottom, ${themeStore.currentStyle === 'street' ? '#ff00ff' : '#22c55e'} 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }"
      ></div>



      <div 
        class="absolute inset-y-0 left-0 right-0 w-full pointer-events-none z-20 transition-transform duration-700 ease-in-out"
        :style="{ transform: isMobileOrTablet || scrollProgress <= 0.015 ? 'translateX(0%)' : (activeIndex % 2 === 0 ? 'translateX(-14%)' : 'translateX(14%)') }"
      >
        <canvas ref="canvasRef" class="w-full h-full opacity-80 dark:opacity-95"></canvas>
      </div>

      <!-- Mobile/Tablet Top Info Deck -->
      <div class="absolute top-6 left-6 right-6 z-40 flex lg:hidden justify-between items-center pointer-events-none">
        <div>
          <span class="hidden md:block text-primary font-black tracking-[0.3em] uppercase text-[8px]">
            SYNAPTIC CORE
          </span>
          <h3 class="hidden md:block font-headline text-lg font-black text-on-surface uppercase mt-1">
            PROJECT DECK [0{{ activeIndex + 1 }}/0{{ projects.length }}]
          </h3>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[8px] font-mono text-on-surface/30 uppercase tracking-widest">{{ telemetryCoordX }} // {{ telemetryCoordY }}</span>
          <Cpu class="w-5 h-5 text-primary animate-pulse shrink-0" />
        </div>
      </div>

      <!-- Project Cards Stack - Positioned on alternating sides (Right, Left, Right, Left) -->
      <div class="absolute inset-0 z-30 pointer-events-none">
        <div 
          v-for="(project, index) in projects" 
          :key="project.id"
          :ref="el => setCardRef(el, index)"
          class="absolute inset-0 w-full h-full transition-all duration-750 ease-out flex pointer-events-none"
          :class="[
            (index === activeIndex && scrollProgress > 0.015)
              ? 'opacity-100 scale-100 translate-y-0 blur-0 pointer-events-auto z-40' 
              : index < activeIndex 
                ? 'opacity-0 scale-95 -translate-y-36 blur-[10px] pointer-events-none z-10' 
                : 'opacity-0 scale-95 translate-y-36 blur-[10px] pointer-events-none z-10',
          // Card on right side (even index)
            index % 2 === 0
              ? 'items-center justify-center lg:items-center lg:justify-end px-6 lg:pb-0 lg:pr-[11%] xl:pr-[13%] lg:pt-14 xl:pt-18'
              : 'items-center justify-center lg:items-center lg:justify-start px-6 lg:pb-0 lg:pl-[11%] xl:pl-[13%] lg:pt-14 xl:pt-18'
          ]"
        >
          <!-- Cinematic HUD styled Card Box (Glassmorphism look from sample.mp4) -->
          <div 
            class="group relative flex flex-col justify-between p-4 md:p-5 xl:p-6 overflow-hidden bg-surface-container-low/10 backdrop-blur-md project-card-box w-full max-w-[440px] lg:max-w-[395px] xl:max-w-[445px] lg:min-h-[385px] xl:min-h-[415px] pointer-events-auto transition-all"
            v-tilt="{ max: 6, scale: 1.01 }"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 1.2)' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface shadow-[8px_8px_0_0_rgba(0,0,0,0.15)]' :
              themeStore.currentStyle === 'street' ? 'street-card border-2 border-black bg-surface-container-low/95' :
              'border border-primary/10 bg-surface-container-low/80 backdrop-blur-3xl shadow-2xl hover:border-primary/35'
            ]"
          >
            <!-- Neon Glow Behind the Card -->
            <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-[inherit] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none z-0"></div>

            <!-- Futuristic High-tech Background Deco Grid -->
            <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute inset-0 pointer-events-none z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
              <div class="absolute inset-0" :style="{
                backgroundImage: `radial-gradient(circle, var(--color-primary) 1.5px, transparent 1.5px)`,
                backgroundSize: '20px 20px'
              }"></div>
            </div>

            <!-- High-tech HUD Corner Brackets -->
            <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute inset-0 pointer-events-none z-10">
              <div class="absolute top-3 left-3 w-5 h-5 border-t-[3px] border-l-[3px] border-primary/25 group-hover:border-primary group-hover:scale-105 transition-all duration-500"></div>
              <div class="absolute top-3 right-3 w-5 h-5 border-t-[3px] border-r-[3px] border-primary/25 group-hover:border-primary group-hover:scale-105 transition-all duration-500"></div>
              <div class="absolute bottom-3 left-3 w-5 h-5 border-b-[3px] border-l-[3px] border-primary/25 group-hover:border-primary group-hover:scale-105 transition-all duration-500"></div>
              <div class="absolute bottom-3 right-3 w-5 h-5 border-b-[3px] border-r-[3px] border-primary/25 group-hover:border-primary group-hover:scale-105 transition-all duration-500"></div>
            </div>

            <!-- Decorative Scanning Beam Effect -->
            <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent pointer-events-none translate-y-[-100%] group-hover:animate-[scan_2.5s_ease-in-out_infinite] z-10"></div>

            <!-- Floating sequence indicator -->
            <span class="absolute top-4 right-6 font-mono font-black text-3xl md:text-4xl text-primary/10 select-none z-10">
              0{{ index + 1 }}
            </span>

            <!-- Image preview box -->
            <div 
              class="relative overflow-hidden flex items-center justify-center bg-black/15 dark:bg-black/50 border border-primary/5 cursor-pointer max-h-[160px] md:max-h-[190px] xl:max-h-[220px] z-10"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) * 0.7)' }"
            >
              <img 
                :src="project.image" 
                alt="" 
                class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xl scale-110 pointer-events-none" 
              />
              
              <img 
                :src="project.image" 
                :alt="project.title" 
                class="relative z-10 max-h-[140px] md:max-h-[170px] xl:max-h-[200px] w-auto h-auto object-contain rounded-lg p-2 transition-transform duration-700 group-hover:scale-[1.03]" 
              />

              <!-- HUD Target Reticle Overlay -->
              <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center bg-black/25">
                <div class="absolute w-24 h-24 border border-dashed border-primary/45 rounded-full animate-[spin_12s_linear_infinite]"></div>
                <div class="absolute w-18 h-18 border border-primary/30 border-t-transparent border-b-transparent rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
                <div class="absolute w-5 h-px bg-primary/70"></div>
                <div class="absolute h-5 w-px bg-primary/70"></div>
                <div class="absolute top-3 left-3 w-3 h-3 border-t border-l border-primary/80"></div>
                <div class="absolute top-3 right-3 w-3 h-3 border-t border-r border-primary/80"></div>
                <div class="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-primary/80"></div>
                <div class="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-primary/80"></div>
                <div class="absolute bottom-2 left-4 text-[6px] font-mono text-primary/80 tracking-widest">SYS_NODE: 0x5D9{{ index + 1 }}</div>
                <div class="absolute top-2 right-4 text-[6px] font-mono text-primary/80 tracking-widest">ACTIVE_ZOOM</div>
              </div>
            </div>

            <!-- Content spec sheet -->
            <div class="mt-4 z-10 flex-1 flex flex-col justify-between">
              <div>
                <!-- Cinematic Scrambled Title -->
                <h3 class="text-lg md:text-xl font-headline font-black uppercase tracking-tight text-on-surface mb-2 leading-none">
                  <span v-if="index === activeIndex">{{ activeTitle }}</span>
                  <span v-else>{{ project.title }}</span>
                </h3>

                <!-- Tech tags -->
                <div class="flex flex-wrap gap-1.5 mb-3">
                  <span 
                    v-for="tag in project.tech" 
                    :key="tag"
                    class="text-[7px] md:text-[8px] font-mono font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/10 uppercase tracking-widest rounded"
                    :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Description -->
                <p class="text-on-surface-variant text-[11px] leading-relaxed font-body font-medium opacity-90 max-w-sm">
                  {{ project.description }}
                </p>
              </div>

              <div>

                <!-- Footer with explore actions -->
                <div class="flex items-center justify-between border-t border-on-surface/5">
                  <div class="flex flex-col">
                    <span class="font-mono text-[8px] font-bold text-on-surface/30 uppercase tracking-wider">
                      COMPILED YEAR
                    </span>
                    <span class="font-headline font-black text-xs text-primary tracking-widest">
                      {{ project.year || '2026' }}
                    </span>
                  </div>
                  
                  <a 
                    v-if="project.link && project.link !== '#'" 
                    :href="project.link" 
                    target="_blank"
                    class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary font-black text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:scale-[1.03] active-spring shadow-md shadow-primary/10 pointer-events-auto"
                    :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : 'calc(var(--app-radius) / 4)' }"
                    :class="{ 'brutal-btn border-2 border-on-surface': themeStore.currentStyle === 'brutal' }"
                    v-ripple
                  >
                    LOAD PROTOCOL
                    <ArrowRight class="w-3.5 h-3.5 -rotate-45" />
                  </a>
                  <div 
                    v-else-if="project.hoverText"
                    class="px-3.5 py-2 bg-surface-container-high border border-surface-container-high text-on-surface/40 font-black text-[10px] md:text-xs tracking-[0.15em] uppercase rounded-md"
                  >
                    {{ project.hoverText }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* HUD scanning animations */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(280px);
  }
  100% {
    transform: translateY(-100%);
  }
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
.duration-750 {
  duration: 750ms;
}

/* ===== WAVY DIVIDER ANIMATIONS ===== */
@keyframes wave-drift {
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -300px; }
}

@keyframes wave-drift-reverse {
  0%   { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 300px; }
}

.synaptic-wave-path {
  stroke-dasharray: 80px 20px;
  animation: wave-drift 6s linear infinite;
  filter: drop-shadow(0 0 4px currentColor);
}

.synaptic-wave-path-2 {
  stroke-dasharray: 60px 40px;
  animation: wave-drift-reverse 9s linear infinite;
  filter: drop-shadow(0 0 3px currentColor);
}

/* ===== HEADING BAR PULSE ===== */
@keyframes bar-glow-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px 2px currentColor; width: 120px; }
  50%       { opacity: 0.6; box-shadow: 0 0 18px 4px currentColor; width: 160px; }
}

.synaptic-heading-bar {
  animation: bar-glow-pulse 3s ease-in-out infinite;
}

.pinned-container {
  width: 100% !important;
  left: 0 !important;
}

/* Pulse wave animation for HUD widgets */
@keyframes hud-wave {
  0% {
    height: 2px;
  }
  100% {
    height: 8px;
  }
}
</style>
