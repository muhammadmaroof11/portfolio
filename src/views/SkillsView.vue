<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick, computed, watch } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { 
  Braces, Layers, Cpu, Database, Paintbrush, Smartphone,
  CheckCircle, ShieldAlert
} from 'lucide-vue-next'
import gsap from 'gsap'
import FuzzyText from '../components/FuzzyText.vue'

const themeStore = useThemeStore()
const { skills } = portfolioData
const viewRoot = ref(null)

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
  },
  'PHP': {
    description: 'Backend server-side scripting language. Building RESTful APIs, handling session authentication, database transactions, and legacy server integrations.',
    layer: 'Application Logic Layer',
    percentage: 85,
    snippet: `<?php\nclass Controller {\n  public function index() {\n    return json_encode(["status" => "active"]);\n  }\n}`
  },
  'C': {
    description: 'Low-level systems programming. Understanding memory allocation, pointers, structures, low-level compilation, and hardware interface optimization.',
    layer: 'System Interface Layer',
    percentage: 82,
    snippet: `#include <stdio.h>\nint main() {\n  printf("System active\\n");\n  return 0;\n}`
  },
  'C++': {
    description: 'Object-oriented low-level systems and application development. Utilizing standard templates library (STL), references, performance-critical loops, and cross-compilation.',
    layer: 'Performance Engineering',
    percentage: 80,
    snippet: `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Process initialized" << endl;\n}`
  },
  'Blender': {
    description: '3D modeling, asset creation, texturing, animation, and glTF asset optimization for WebGL renderers like Three.js and Babylon.js.',
    layer: '3D Asset Pipeline',
    percentage: 85,
    snippet: `# Python scripting in Blender for procedural object generation\nimport bpy\nbpy.ops.mesh.primitive_uv_sphere_add(radius=1.5)`
  },
  'Framer Motion': {
    description: 'Production-ready animation library for React applications. Creating smooth layout animations, physical spring physics transitions, and gestures-linked tweens.',
    layer: 'Interactive Transition Engine',
    percentage: 90,
    snippet: `<motion.div animate={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 100 }} />`
  },
  'CSS': {
    description: 'Core styling layer. Expertise in grid layouts, flexbox, custom properties, viewport-relative styling, animations, media queries, and pixel-perfect responsiveness.',
    layer: 'Visual Styling Engine',
    percentage: 95,
    snippet: `.element {\n  display: grid;\n  place-items: center;\n  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);\n}`
  },
  'Flask': {
    description: 'Micro web framework for Python. Building modular RESTful APIs, route blue-printing, server-side caching, and lightweight microservice architectures.',
    layer: 'Microservice Application Layer',
    percentage: 88,
    snippet: `from flask import Flask, jsonify\napp = Flask(__name__)\n@app.route('/health')\ndef health():\n    return jsonify(status="ok")`
  },
  'GCP': {
    description: 'Google Cloud Platform infrastructure administration. Configuring VPC networks, virtual machine deployment (GCE), Cloud Run deployment, serverless functions, and Cloud SQL storage.',
    layer: 'Cloud Infrastructure',
    percentage: 84,
    snippet: `# gcloud deployment CLI target\ngcloud run deploy service-name --image gcr.io/project-id/image`
  },
  'Postman': {
    description: 'Comprehensive API testing ecosystem. Writing test suites, automated mock assertions, environment variable synchronization, and run collection testing.',
    layer: 'API Assurance & Validation',
    percentage: 90,
    snippet: `pm.test("Status code is 200", function () {\n  pm.response.to.have.status(200);\n});`
  },
  'Kubernetes': {
    description: 'Orchestrating containerized systems at scale. Configuring deploy manifests, services, ingress controllers, load balancers, secrets, and pod horizontal autoscaling.',
    layer: 'Container Orchestration',
    percentage: 80,
    snippet: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-deployment\nspec:\n  replicas: 3`
  },
  'Scikit-Learn': {
    description: 'Classical machine learning in Python. Building regression models, support vector machines, clustering pipelines, dimensionality reduction, and preprocessing workflows.',
    layer: 'Predictive Analytics Layer',
    percentage: 85,
    snippet: `from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier()\nclf.fit(X_train, y_train)`
  },
  'Fine-Tuning': {
    description: 'Specialized model tuning. Adapting LLMs using LoRA, QLoRA, custom dataset preparation, hyperparameter search, and loss curve monitoring for domain specialization.',
    layer: 'Model Specialization Tier',
    percentage: 87,
    snippet: `# PEFT LoRA configuration in training cycle\npeft_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])`
  },
  'SQL': {
    description: 'Designing relational databases, writing optimized queries, configuring indexes, managing schema migrations, and optimizing transaction rollbacks.',
    layer: 'Data Persistence Layer',
    percentage: 92,
    snippet: `SELECT u.id, u.name, COUNT(p.id) AS posts_count\nFROM users u\nLEFT JOIN posts p ON p.author_id = u.id\nGROUP BY u.id;`
  },
  'Electron': {
    description: 'Building desktop native apps with web technologies (HTML, CSS, JavaScript). Implementing IPC bridge communication, OS integration, and auto-updater scripts.',
    layer: 'Desktop Application Bridge',
    percentage: 88,
    snippet: `const { app, BrowserWindow } = require('electron');\nconst createWindow = () => {\n  const win = new BrowserWindow({ width: 1200, height: 800 });\n};`
  }
}

// Setup categories
const categories = [
  { name: 'Languages', icon: Braces },
  { name: 'Frameworks', icon: Layers },
  { name: 'AI & Automation', icon: Cpu },
  { name: 'Backend & Cloud', icon: Database },
  { name: 'Styling & Motion', icon: Paintbrush },
  { name: 'Mobile Dev', icon: Smartphone }
]

const activeCategory = ref('Languages')
const selectedSkill = ref(null)
const scrambleSkillName = ref('')
const scrambleInterval = ref(null)

// Computed filtered skills list
const filteredSkills = computed(() => {
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

  const root = viewRoot.value
  if (!root) return
  
  // Hero reveal animation
  gsap.fromTo(root.querySelectorAll('.skills-header > *'), 
    { autoAlpha: 0, y: 30 },
    { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out' }
  )

  // Sub-console grids stagger entry
  gsap.fromTo(root.querySelectorAll('.gsap-console-enter'),
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 1, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
  )
})

onBeforeUnmount(() => {
  if (scrambleInterval.value) clearInterval(scrambleInterval.value)
})
</script>

<template>
  <div ref="viewRoot" class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-16 md:pt-24 pb-16 overflow-visible relative">

    <!-- MAIN INTERACTIVE DECK CONSOLE -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- LEFT HAND PANEL: FILTERS & CARDS DECK (lg:7 cols) -->
      <div class="lg:col-span-7 flex flex-col gap-6">

        <!-- HERO HEADER (nested inside left column and scaled down by 30%) -->
        <header class="mb-6 skills-header">
          <div class="max-w-3xl">
            <h1 class="text-3xl sm:text-4xl md:text-5xl xl:text-7xl font-headline font-black text-on-background tracking-[calc(-0.06em)] leading-none mb-4 uppercase flex flex-wrap items-baseline gap-x-3 md:gap-x-4">
              <span>ENGINEERING</span>
              <FuzzyText 
                color="var(--color-primary)" 
                font-style="italic"
                font-size="clamp(1.8rem, 4.5vw, 4.4rem)"
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
        <div class="flex flex-wrap gap-2.5 border-b border-on-surface/10 pb-4 gsap-console-enter">
          <button 
            v-for="cat in categories" 
            :key="cat.name"
            @click="activeCategory = cat.name"
            class="flex items-center gap-2.5 px-4 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-wider transition-all duration-300 relative border cursor-pointer select-none"
            :style="{ borderRadius: 'calc(var(--app-radius) / 2)' }"
            :class="[
              activeCategory === cat.name 
                ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'bg-surface-container-low text-on-surface/75 border-primary/10 hover:border-primary/40 hover:text-on-surface',
              themeStore.currentStyle === 'brutal' ? 'brutal-card border-2 font-mono' : '',
              themeStore.currentStyle === 'street' ? 'street-card font-mono' : ''
            ]"
          >
            <component :is="cat.icon" class="w-3.5 h-3.5" />
            {{ cat.name }}
          </button>
        </div>

        <!-- CARDS DECK -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gsap-console-enter">
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

            <div class="flex items-center justify-between gap-3 mb-4 w-full">
              <div class="flex items-center gap-3 min-w-0">
                <!-- Icon Frame -->
                <div class="w-10 h-10 flex items-center justify-center p-2 rounded shadow-inner bg-surface border border-primary/10 transition-transform duration-500 group-hover:scale-105 shrink-0"
                  :style="{ color: skill.color, borderRadius: 'calc(var(--app-radius) / 4)' }"
                  :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface' : ''"
                >
                  <i v-if="skill.faIcon" :class="skill.faIcon" class="text-xl" :style="{ color: skill.color }"></i>
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

                <!-- Skill Name next to Icon -->
                <h4 class="text-sm md:text-base font-headline font-black uppercase tracking-tight text-on-surface truncate">
                  {{ skill.name }}
                </h4>
              </div>

              <!-- Level Label -->
              <span 
                class="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-surface border border-primary/5 text-on-surface/60 shrink-0"
                :class="themeStore.currentStyle === 'brutal' ? 'border-2 border-on-surface' : ''"
              >
                {{ skill.level }}
              </span>
            </div>

            <!-- Bottom Mini Stats Bar -->
            <div class="mt-auto w-full">
              <!-- Skill Level mini gauge -->
              <div class="flex items-center gap-2">
                <div class="flex-grow h-1.5 bg-surface rounded-full overflow-hidden border border-primary/5">
                  <div 
                    class="h-full rounded-full transition-all duration-700 ease-out" 
                    :style="{ 
                      width: `${enrichedMetadata[skill.name]?.percentage || 80}%`,
                      backgroundColor: skill.color 
                    }"
                  ></div>
                </div>
                <span class="text-[9px] font-mono font-bold opacity-60 shrink-0" :style="{ color: skill.color }">
                  {{ enrichedMetadata[skill.name]?.percentage || 80 }}%
                </span>
              </div>
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
