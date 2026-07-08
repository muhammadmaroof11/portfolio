<script setup>
import { onMounted, ref, nextTick, computed, watch } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { 
  LayoutDashboard, Zap, Smartphone, Globe, Terminal, 
  Cpu, Server, Code, CheckCircle, ShieldAlert, Cpu as AiIcon
} from 'lucide-vue-next'
import gsap from 'gsap'
import FuzzyText from '../components/FuzzyText.vue'

const themeStore = useThemeStore()
const { skills } = portfolioData

// Enriched telemetry and descriptive content for each skill
const enrichedMetadata = {
  'JavaScript': {
    description: 'Core engine of modern web architectures. Writing clean, modular, and optimized asynchronous ES6+ code for high-concurrency client-side applications.',
    layer: 'Presentation & Logic',
    percentage: 95,
    snippet: `const orchestrate = async (nodes) => {\n  return Promise.all(nodes.map(n => n.activate()));\n};`
  },
  'Python': {
    description: 'Leveraged for data transformation pipelines, scripting automation, and writing local agentic integrations. Proficient in asynchronous API wrappers and statistical analytics.',
    layer: 'Data & Processing',
    percentage: 90,
    snippet: `async def run_pipeline(data: dict) -> dict:\n    processed = await analyzer.process(data)\n    return { "status": "success", "data": processed }`
  },
  'Vue.js': {
    description: 'Favorite frontend ecosystem. Specialized in Vue 3 Composition API, reactive state stores (Pinia), custom rendering logic, and high-performance DOM orchestration.',
    layer: 'Reactive Interface Tier',
    percentage: 95,
    snippet: `\u003cscript setup\u003e\nimport { ref, computed } from 'vue'\nconst state = ref('active')\n\u003c/script\u003e`
  },
  'React': {
    description: 'Capable of architecting enterprise React applications, integrating complex state machines, GSAP timelines, and Framer Motion layout transitions.',
    layer: 'Component Architecture',
    percentage: 88,
    snippet: `import React, { useState } from 'react';\nexport const Dashboard = () => {\n  const [nodes] = useState([]);\n};`
  },
  'Ionic Framework': {
    description: 'Building native-grade cross-platform mobile apps for iOS and Android. High proficiency in performance profiling and hardware plugins integration.',
    layer: 'Mobile Runtime Bridge',
    percentage: 92,
    snippet: `\u003cIonContent\u003e\n  \u003cIonGrid\u003e\n    \u003cIonRow\u003e\n      \u003cIonCol\u003eActive Node\u003c/IonCol\u003e\n    \u003c/IonRow\u003e\n  \u003c/IonGrid\u003e\n\u003c/IonContent\u003e`
  },
  'Tailwind CSS': {
    description: 'Crafting responsive, utility-first design systems. Optimizing bundle sizes, using design tokens, and applying complex styles without overhead.',
    layer: 'Visual Presentation Layer',
    percentage: 98,
    snippet: `\u003cdiv class="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 backdrop-blur-md bg-opacity-50"\u003e`
  },
  'Flutter': {
    description: 'Compiling high-performance native binaries from a single codebase. Skilled in custom painter animations, local SQLite databases, and WebRTC integration.',
    layer: 'Native Compilation SDK',
    percentage: 90,
    snippet: `class SignalNode extends StatelessWidget {\n  @override\n  Widget build(BuildContext context) =\u003e Container();\n}`
  },
  'Node.js': {
    description: 'Building fast, scalable backend APIs. Designing event-driven architectures, custom stream processors, and secure authentication controllers.',
    layer: 'Server Operations Logic',
    percentage: 88,
    snippet: `const express = require('express');\nconst app = express();\napp.get('/status', (req, res) => res.json({ ok: true }));`
  },
  'MongoDB': {
    description: 'Handling highly polymorphic data streams. Optimizing indexing models, designing aggregation pipelines, and maintaining local clustering replica sets.',
    layer: 'Document Storage persistence',
    percentage: 85,
    snippet: `db.collection('signals').aggregate([\n  { $match: { status: 'active' } },\n  { $group: { _id: '$type', count: { $sum: 1 } } }\n]);`
  },
  'Supabase': {
    description: 'Utilizing real-time databases, row-level security policies, PostgreSQL functions, edge triggers, and low-latency storage buckets for high-scale apps.',
    layer: 'BaaS Engine / Postgres Core',
    percentage: 90,
    snippet: `const { data, error } = await supabase\n  .from('nodes')\n  .select('*')\n  .eq('active', true)`
  },
  'Firebase': {
    description: 'Configuring Firestore real-time sync listeners, Cloud Functions, phone authentication, FCM push notification microservices, and secure storage rules.',
    layer: 'BaaS Ecosystem',
    percentage: 88,
    snippet: `import { getFirestore, doc, onSnapshot } from 'firebase/firestore';\nconst db = getFirestore();`
  },
  'Capacitor': {
    description: 'Bridging web architectures to mobile hardware. Developing custom plugins, managing webview lifecycle, and optimizing asset delivery performance.',
    layer: 'Hybrid Mobile Runtime',
    percentage: 92,
    snippet: `import { Camera, CameraResultType } from '@capacitor/camera';\nconst photo = await Camera.getPhoto({ resultType: CameraResultType.Uri });`
  },
  'GSAP': {
    description: 'Crafting complex scroll-linked timelines, physics-based canvas animations, shape morphs, SVG paths, and custom page transitions.',
    layer: 'Motion & Animation Engine',
    percentage: 94,
    snippet: `gsap.timeline({ scrollTrigger: { trigger: '.panel', scrub: true } })\n  .to('.mesh', { rotation: 360 })`
  },
  'Agentic AI': {
    description: 'Creating autonomous agent workflows, tools selection, multi-agent frameworks, task delegation systems, and conversational LLM integrations.',
    layer: 'Autonomous Intelligence Tier',
    percentage: 90,
    snippet: `class AIWorkerAgent {\n  async decideAction(env) {\n    const tool = this.selectTool(env.task);\n    return await tool.execute();\n  }\n}`
  },
  'n8n Automation': {
    description: 'Designing visual automation logic, building custom node API integrations, webhook listeners, and automatic sync tasks across 200+ microservices.',
    layer: 'Integration & Sync Layer',
    percentage: 90,
    snippet: `// JSON configuration for automated webhooks and parsing nodes\n{\n  "nodes": [ { "type": "n8n-nodes-base.httpRequest" } ]\n}`
  },
  'Generative AI': {
    description: 'Integrating LLMs, prompt template parsing, retrieval augmentations, custom vision analysis models, and low-latency stream interfaces.',
    layer: 'Context-Aware AI Core',
    percentage: 90,
    snippet: `const completion = await openai.chat.completions.create({\n  model: "gpt-4-turbo",\n  messages: [{ role: "user", content: prompt }]\n});`
  },
  'Docker': {
    description: 'Containerizing microservices, optimizing multi-stage build pipelines, managing local Docker-compose development ecosystems, and configuring secure images.',
    layer: 'Virtualization & Sandbox',
    percentage: 85,
    snippet: `FROM node:18-alpine\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["node", "server.js"]`
  },
  'RAG Agents': {
    description: 'Implementing vector databases (Pinecone, pgvector), chunking and overlap algorithms, chunk embedding comparisons, and context validation steps.',
    layer: 'Retrieval Augmented Core',
    percentage: 88,
    snippet: `const embedding = await getEmbedding(query);\nconst results = await index.query({ vector: embedding, topK: 5 });`
  },
  'PyTorch': {
    description: 'Training and fine-tuning neural network topologies, working with tensor operations, running dataset pipelines, and deploying edge models.',
    layer: 'Machine Learning Framework',
    percentage: 80,
    snippet: `import torch\nimport torch.nn as nn\nx = torch.randn(10, 3)\nmodel = nn.Linear(3, 1)`
  }
}

// Setup categories
const categories = [
  { name: 'All', icon: Terminal },
  { name: 'Frontend', icon: Code },
  { name: 'Backend', icon: Server },
  { name: 'AI & Data', icon: Cpu },
  { name: 'Mobile', icon: Smartphone }
]

const activeCategory = ref('All')
const selectedSkill = ref(null)
const scrambleSkillName = ref('')
const scrambleInterval = ref(null)

// Computed filtered skills list
const filteredSkills = computed(() => {
  if (activeCategory.value === 'All') return skills
  return skills.filter(s => s.category === activeCategory.value)
})

// Scramble text function to simulate futuristic console decrypt
const startScramble = (targetText) => {
  if (scrambleInterval.value) clearInterval(scrambleInterval.value)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
  let iterations = 0
  const maxIterations = 8
  
  scrambleInterval.value = setInterval(() => {
    scrambleSkillName.value = targetText.split('').map((char, index) => {
      if (char === ' ') return ' '
      if (index < iterations) return targetText[index]
      return chars[Math.floor(Math.random() * chars.length)]
    }).join('')
    
    if (iterations >= targetText.length) {
      scrambleSkillName.value = targetText
      clearInterval(scrambleInterval.value)
    }
    iterations += 1
  }, 25)
}

// Update selected skill details and start title scrambler
const selectSkill = (skill) => {
  selectedSkill.value = skill
  startScramble(skill.name)
}

// Find projects in portfolioData associated with the selected skill
const associatedProjects = computed(() => {
  if (!selectedSkill.value) return []
  const currentSkill = selectedSkill.value.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  return portfolioData.projects.filter(proj => {
    return proj.tech.some(t => {
      const formatTech = t.toLowerCase().replace(/[^a-z0-9]/g, '')
      return formatTech === currentSkill || 
             (currentSkill === 'javascript' && formatTech === 'javascript') ||
             (currentSkill === 'vuejs' && formatTech === 'vue3') ||
             (currentSkill === 'vuejs' && formatTech === 'vuejs') ||
             (currentSkill === 'tailwindcss' && formatTech === 'tailwind')
    })
  })
})

// Enriched stats for the selected skill
const selectedMeta = computed(() => {
  if (!selectedSkill.value) return { description: '', layer: '', percentage: 80, snippet: '' }
  return enrichedMetadata[selectedSkill.value.name] || {
    description: `Highly capable with ${selectedSkill.value.name}, implementing best practices in modern application environments.`,
    layer: selectedSkill.value.category === 'Frontend' ? 'Presentation Tier' : 'Logic Layer',
    percentage: selectedSkill.value.level === 'Expert' ? 95 : selectedSkill.value.level === 'Advanced' ? 88 : 80,
    snippet: `// ${selectedSkill.value.name} integration script\nconst init = () => {\n  console.log("${selectedSkill.value.name} operational");\n};`
  }
})

// Auto select first skill when category changes
watch(filteredSkills, (newSkills) => {
  if (newSkills.length > 0) {
    selectSkill(newSkills[0])
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  
  // Hero reveal animation
  gsap.fromTo('.skills-header > *', 
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' }
  )

  // Sub-console grids stagger entry
  gsap.fromTo('.gsap-console-enter',
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
  )
})
</script>

<template>
  <div class="w-full overflow-visible relative">
    <!-- Double Crossing Police Caution/Warning ribbons under navbar (running full width in background) -->
    <!-- Ribbon 1: Angled at 20deg, running across the screen -->
    <div 
      class="fixed top-[200px] right-[-600px] w-[3000px] py-1 text-center select-none transform rotate-[20deg] border-y border-black/25 z-[1] shadow-xl flex items-center justify-center pointer-events-none"
      style="background: repeating-linear-gradient(-45deg, #fbbf24, #fbbf24 6px, #1c1917 6px, #1c1917 12px);"
    >
      <div class="w-full bg-black/90 py-2.5 text-[12px] md:text-[14px] font-black tracking-[0.35em] text-yellow-400 font-mono uppercase whitespace-nowrap overflow-hidden">
        OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED // OVERCLOCKED // OVERSKILLED
      </div>
    </div>
    <!-- Ribbon 2: Crossing angled at 76deg, shifted to the very right edge of the viewport (extended to 5000px) -->
    <div 
      class="fixed top-[-1200px] right-[-1950px] w-[5000px] py-1 text-center select-none transform rotate-[76deg] border-y border-black/25 z-[2] shadow-xl flex items-center justify-center pointer-events-none"
      style="background: repeating-linear-gradient(-45deg, #fbbf24, #fbbf24 6px, #1c1917 6px, #1c1917 12px);"
    >
      <div class="w-full bg-black/90 py-2.5 text-[12px] md:text-[14px] font-black tracking-[0.35em] text-yellow-400 font-mono uppercase whitespace-nowrap overflow-hidden">
        DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF // DANGER // CONFIDENT_AF
      </div>
    </div>

    <!-- MAIN CONTENT WRAPPER (Keeps page text, grids, and details above caution ribbons) -->
    <div class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-16 md:pt-24 pb-16 overflow-visible relative z-10 pointer-events-none-children-auto">

    <!-- HERO HEADER -->
    <header class="mb-12 md:mb-16 skills-header">
      <div class="max-w-3xl">
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-6 md:mb-8 block">Technical Competencies</span>
        <h1 class="text-4xl sm:text-5xl md:text-7xl xl:text-[100px] font-headline font-black text-on-background tracking-[calc(-0.06em)] leading-none mb-8 md:mb-10 uppercase flex flex-wrap lg:flex-nowrap items-baseline gap-x-3 md:gap-x-4">
          <span>ENGINEERING</span>
          <FuzzyText 
            color="var(--color-primary)" 
            font-style="italic"
            font-size="clamp(2.5rem, 6vw, 6.2rem)"
            font-weight="900"
            font-family="inherit"
            class-name="text-primary italic inline-block select-none"
            :base-intensity="0.15"
            :hover-intensity="0.45"
            :fuzz-range="18"
            :enable-hover="true"
          >
            ARSENAL.
          </FuzzyText>
        </h1>
      </div>
    </header>

    <!-- CYBERNETIC CONTROL TABS -->
    <div class="flex flex-wrap gap-3 mb-10 border-b border-on-surface/10 pb-5 gsap-console-enter">
      <button 
        v-for="cat in categories" 
        :key="cat.name"
        @click="activeCategory = cat.name"
        class="flex items-center gap-3 px-5 py-3 text-xs md:text-sm font-black uppercase tracking-wider transition-all duration-300 relative border cursor-pointer select-none"
        :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
        :class="[
          activeCategory === cat.name 
            ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-[1.03]' 
            : 'bg-surface-container-low text-on-surface/75 border-primary/10 hover:border-primary/40 hover:text-on-surface',
          themeStore.currentStyle === 'brutal' ? 'brutal-card border-2 font-mono' : '',
          themeStore.currentStyle === 'street' ? 'street-card font-mono' : ''
        ]"
      >
        <component :is="cat.icon" class="w-4 h-4" />
        {{ cat.name }}
      </button>
    </div>

    <!-- MAIN INTERACTIVE DECK CONSOLE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT HAND PANEL: CARDS DECK (lg:7 cols) -->
      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gsap-console-enter">
        <div 
          v-for="skill in filteredSkills" 
          :key="skill.name"
          @click="selectSkill(skill)"
          class="skill-card p-5 transition-all duration-500 cursor-pointer border relative overflow-hidden flex flex-col justify-between group active-spring min-h-[140px]"
          :style="{ borderRadius: 'var(--app-radius)' }"
          :class="[
            selectedSkill?.name === skill.name
              ? 'border-primary ring-2 ring-primary/25 bg-surface-container-high' 
              : 'border-primary/5 bg-surface-container-low hover:bg-surface-container hover:border-primary/20',
            themeStore.currentStyle === 'brutal' 
              ? `brutal-card border-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]` 
              : '',
            themeStore.currentStyle === 'street' 
              ? 'street-card border-primary/20 shadow-[0_0_15px_rgba(0,255,255,0.02)] hover:shadow-[0_0_20px_rgba(0,255,255,0.08)]' 
              : ''
          ]"
        >
          <!-- Selected Tech Glow Bar -->
          <div 
            v-if="selectedSkill?.name === skill.name" 
            class="absolute top-0 left-0 right-0 h-[3px]"
            :style="{ backgroundColor: skill.color }"
          ></div>

          <div class="flex items-start justify-between gap-3 mb-4">
            <!-- Icon Frame -->
            <div class="w-12 h-12 flex items-center justify-center p-2.5 rounded shadow-inner bg-surface border border-primary/10 transition-transform duration-500 group-hover:scale-105 shrink-0"
              :style="{ color: skill.color, borderRadius: 'calc(var(--app-radius) / 4)' }"
              :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface' : ''"
            >
              <i v-if="skill.faIcon" :class="skill.faIcon" class="text-2xl" :style="{ color: skill.color }"></i>
              <div v-else-if="skill.iconUrl && skill.iconUrl.includes('simple-icons')"
                class="w-full h-full"
                :style="{
                  backgroundColor: skill.color,
                  mask: `url(${skill.iconUrl}) no-repeat center / contain`,
                  webkitMask: `url(${skill.iconUrl}) no-repeat center / contain`
                }"
              ></div>
              <img v-else :src="skill.iconUrl || `https://skillicons.dev/icons?i=${skill.slug}`" 
                :alt="skill.name" 
                class="w-full h-full object-contain" />
            </div>

            <!-- Level Label -->
            <span 
              class="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-surface border border-primary/5 text-on-surface/60"
              :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface' : ''"
            >
              {{ skill.level }}
            </span>
          </div>

          <!-- Bottom Title + Mini Stats Bar -->
          <div>
            <h4 class="text-base font-headline font-black uppercase tracking-tight text-on-surface break-words leading-tight">
              {{ skill.name }}
            </h4>
            
            <!-- Skill Level mini gauge -->
            <div class="mt-3 flex items-center gap-2">
              <div class="flex-grow h-1.5 bg-surface rounded-full overflow-hidden border border-primary/5">
                <div 
                  class="h-full rounded-full transition-all duration-700 ease-out" 
                  :style="{ 
                    width: `${enrichedMetadata[skill.name]?.percentage || 80}%`,
                    backgroundColor: skill.color 
                  }"
                ></div>
              </div>
              <span class="text-[9px] font-mono font-bold opacity-60" :style="{ color: skill.color }">
                {{ enrichedMetadata[skill.name]?.percentage || 80 }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT HAND PANEL: TELEMETRY DETAIL HUD (lg:5 cols) -->
      <div class="lg:col-span-5 gsap-console-enter lg:sticky lg:top-24">
        <div 
          class="hud-terminal border p-6 md:p-8 relative overflow-hidden backdrop-blur-md shadow-2xl"
          :style="{ 
            borderRadius: 'var(--app-radius)',
            borderColor: selectedSkill?.color ? `${selectedSkill.color}25` : 'var(--primary-color)'
          }"
          :class="[
            themeStore.currentStyle === 'brutal' 
              ? 'brutal-card border-4 border-on-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-surface' 
              : 'bg-surface-container-low/80',
            themeStore.currentStyle === 'street' 
              ? 'street-card shadow-[0_0_30px_rgba(255,0,255,0.05)] border-primary/30' 
              : ''
          ]"
        >
          <!-- Corner Decors -->
          <div class="absolute top-2 left-2 w-2 h-2 border-t border-l opacity-50" :style="{ borderColor: selectedSkill?.color }"></div>
          <div class="absolute top-2 right-2 w-2 h-2 border-t border-r opacity-50" :style="{ borderColor: selectedSkill?.color }"></div>
          <div class="absolute bottom-2 left-2 w-2 h-2 border-b border-l opacity-50" :style="{ borderColor: selectedSkill?.color }"></div>
          <div class="absolute bottom-2 right-2 w-2 h-2 border-b border-r opacity-50" :style="{ borderColor: selectedSkill?.color }"></div>

          <!-- Active Panel Header -->
          <div class="flex items-center justify-between border-b border-on-surface/10 pb-5 mb-6">
            <div class="min-w-0">
              <span class="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50 block mb-1">SELECTED COMPONENT</span>
              <h2 class="text-2xl md:text-3xl font-headline font-black uppercase tracking-tight text-on-surface font-mono break-words leading-none">
                {{ scrambleSkillName }}
              </h2>
            </div>
            
            <!-- Skill Color Pulsing Indicator -->
            <div class="relative w-8 h-8 rounded-full border border-primary/10 shrink-0 flex items-center justify-center">
              <div class="w-3.5 h-3.5 rounded-full animate-pulse" :style="{ backgroundColor: selectedSkill?.color }"></div>
            </div>
          </div>

          <!-- Circular Percentage Gauge & Basic Stats Block -->
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6">
            
            <!-- SVG Mastery Circular Ring (sm:4 cols) -->
            <div class="sm:col-span-5 flex justify-center">
              <div class="relative w-28 h-28 flex items-center justify-center">
                <!-- Outer rotating dot ring -->
                <svg class="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="transparent" 
                    stroke="rgba(255,255,255,0.03)" 
                    stroke-width="6"
                  />
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="transparent" 
                    :stroke="selectedSkill?.color || 'var(--primary)'" 
                    stroke-width="6"
                    stroke-dasharray="264"
                    :stroke-dashoffset="264 - (264 * (selectedMeta.percentage || 80)) / 100"
                    stroke-linecap="round"
                    class="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div class="absolute flex flex-col items-center justify-center">
                  <span class="text-2xl font-black font-mono tracking-tighter text-on-surface leading-none">
                    {{ selectedMeta.percentage }}%
                  </span>
                  <span class="text-[8px] font-black uppercase opacity-40 mt-1">Mastery</span>
                </div>
              </div>
            </div>

            <!-- Telemetry Metrics Block (sm:7 cols) -->
            <div class="sm:col-span-7 space-y-3.5 text-xs">
              <div class="flex justify-between border-b border-on-surface/5 pb-1">
                <span class="opacity-50 uppercase tracking-widest text-[9px] font-bold">System Status</span>
                <span class="text-emerald-500 font-bold flex items-center gap-1.5 font-mono">
                  <CheckCircle class="w-3 h-3" /> ONLINE
                </span>
              </div>
              <div class="flex justify-between border-b border-on-surface/5 pb-1">
                <span class="opacity-50 uppercase tracking-widest text-[9px] font-bold">Execution Tier</span>
                <span class="font-bold text-on-surface/90 uppercase tracking-tight text-[10px]">{{ selectedMeta.layer }}</span>
              </div>
              <div class="flex justify-between border-b border-on-surface/5 pb-1">
                <span class="opacity-50 uppercase tracking-widest text-[9px] font-bold">Response Speed</span>
                <span class="font-bold text-on-surface/80 font-mono text-[10px]">&lt; 12ms</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="mb-6">
            <span class="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 block mb-2">FUNCTIONAL OVERVIEW</span>
            <p class="text-sm leading-relaxed text-on-surface-variant/90 opacity-90 font-medium">
              {{ selectedMeta.description }}
            </p>
          </div>

          <!-- Associated Projects list (Dynamic Portfolio Integration) -->
          <div v-if="associatedProjects.length > 0" class="mb-6">
            <span class="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 block mb-2.5">DYNAMIC SYSTEM LINKAGE</span>
            <div class="flex flex-wrap gap-2">
              <a 
                v-for="proj in associatedProjects" 
                :key="proj.id"
                href="#projects"
                class="flex items-center gap-2 px-3 py-1.5 rounded bg-surface border border-primary/10 text-xs font-bold uppercase tracking-wider text-on-surface/85 transition-all duration-300 hover:border-primary hover:text-primary active-spring"
                :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface font-mono' : ''"
              >
                <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: selectedSkill?.color }"></div>
                {{ proj.title }}
              </a>
            </div>
          </div>

          <!-- Mock Code Terminal Box -->
          <div>
            <span class="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 block mb-2">TELEMETRY CODE VIEW</span>
            <div 
              class="rounded bg-black/60 border border-primary/10 p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto relative"
              :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface' : ''"
            >
              <div class="absolute top-2 right-2 flex gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500/70"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-green-500/70"></span>
              </div>
              <pre class="leading-relaxed select-all"><code>{{ selectedMeta.snippet }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FLOATING DECORATIVE MARQUEE -->
    <div class="mt-32 -mx-6 md:-mx-12 overflow-hidden py-10 opacity-5 pointer-events-none">
      <div class="flex gap-20 animate-scroll-left whitespace-nowrap">
        <span v-for="skill in skills" :key="skill.name" 
          class="text-8xl md:text-9xl font-black font-headline uppercase leading-none"
          :style="{ color: skill.color }">
          {{ skill.name }}
        </span>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped>
.hud-terminal {
  box-shadow: inset 0 0 25px rgba(255, 255, 255, 0.015);
}

.animate-scroll-left {
  animation: scroll-left 55s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
