<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, defineAsyncComponent } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { HelpCircle, ChevronDown, MessageSquare, ArrowRight, Sparkles, Terminal } from 'lucide-vue-next'
const FuzzyText = defineAsyncComponent(() => import('../components/FuzzyText.vue'))
import gsap from 'gsap'

const themeStore = useThemeStore()
const { profile } = portfolioData
const viewRoot = ref(null)

const searchQuery = ref('')
const activeFaqIdx = ref(null)

const faqs = [
  {
    q: "What technologies are in your core tech stack?",
    a: "My architectural core is built on Vue 3 (Composition API, Pinia) and React for user interfaces, styled via utility grids or vanilla CSS tokens. On the server, I design backend microservices using Node.js and Python, handle persistence with Supabase/PostgreSQL/MongoDB, package runtimes in Docker, and orchestrate automated AI workflows with n8n.",
    category: "technology"
  },
  {
    q: "What does a 'Digital Architect' actually do?",
    a: "Unlike a standard developer who solely writes user-facing client code, a Digital Architect bridges frontend interaction design, backend service reliability, and database indexing. I design system blueprints, profile and remove server/rendering bottlenecks, structure secure auth schemas, and guarantee high system availability under heavy loads.",
    category: "methodology"
  },
  {
    q: "How do you approach Agentic AI integration?",
    a: "We move past simple prompt engineering to build production-grade autonomous workflow engines. This includes setting up secure vector databases (RAG) using pgvector or Pinecone, orchestrating multi-agent decision systems in Python or n8n, deploying real-time voice agents, and automating corporate manual operations to save hours of human labor.",
    category: "artificial intelligence"
  },
  {
    q: "Can you audit or refactor an existing legacy codebase?",
    a: "Yes. I perform thorough architectural audits: identifying database lock throttling, profiling memory leaks, auditing dependencies for vulnerabilities, and refactoring monolithic layouts into componentized structures. Every audit includes a prioritized technical debt ledger.",
    category: "audit"
  },
  {
    q: "What is your contract availability and booking process?",
    a: "I am currently based at Byte Force, but maintain capacity for selective startup consultation, systems audits, and architecture design workshops. Project slots are strictly limited to ensure engineering quality. Use the 'Initiate Protocol' CTA or direct signals (email/voice) to request availability.",
    category: "availability"
  }
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(f => 
    f.q.toLowerCase().includes(query) || 
    f.a.toLowerCase().includes(query) ||
    f.category.toLowerCase().includes(query)
  )
})

const toggleFaq = (idx) => {
  activeFaqIdx.value = activeFaqIdx.value === idx ? null : idx
}

// JSON-LD dynamic schema injection for SEO optimizations
let scriptTag = null
onMounted(async () => {
  await nextTick()
  const root = viewRoot.value
  if (!root) return

  // Entry animations
  gsap.set(root.querySelectorAll('.gsap-reveal'), { autoAlpha: 0, y: 30 })
  gsap.to(root.querySelectorAll('.gsap-reveal'), {
    y: 0,
    autoAlpha: 1,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    onComplete: () => {
      gsap.set(root.querySelectorAll('.gsap-reveal'), { clearProps: 'all' })
    }
  })

  // Schema generation
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  scriptTag = document.createElement('script')
  scriptTag.type = 'application/ld+json'
  scriptTag.text = JSON.stringify(schemaData)
  document.head.appendChild(scriptTag)
})

onBeforeUnmount(() => {
  if (scriptTag && scriptTag.parentNode) {
    scriptTag.parentNode.removeChild(scriptTag)
  }
})
</script>

<template>
  <div ref="viewRoot" class="max-w-[1800px] mx-auto px-6 md:px-12 xl:px-20 pt-16 md:pt-24 pb-16 overflow-visible relative">
    
    <!-- HEADER -->
    <header class="mb-12 md:mb-16 gsap-reveal">
      <div class="max-w-3xl text-left">
        <span class="app-badge mb-4 block inline-block" :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">SYSTEM DEBRIEFING</span>
        <h1 class="text-4xl sm:text-5xl md:text-6xl xl:text-[80px] font-headline font-black text-on-surface tracking-[calc(-0.06em)] leading-none mb-6 uppercase flex flex-wrap items-baseline gap-x-3">
          <span>FREQUENT</span>
          <FuzzyText 
            color="var(--color-primary)" 
            font-style="italic"
            font-size="clamp(2.2rem, 5.5vw, 5rem)"
            font-weight="900"
            font-family="inherit"
            class-name="text-primary italic inline-block select-none underline decoration-wavy decoration-[3px] sm:decoration-6 underline-offset-[4px] sm:underline-offset-[8px]"
            :base-intensity="0.15"
            :fuzz-range="18"
            :enable-hover="true"
          >
            QUERIES.
          </FuzzyText>
        </h1>
        <p class="text-on-surface-variant text-base md:text-lg leading-relaxed font-body max-w-xl opacity-80 font-medium">
          Detailed technical blueprints, stacks, philosophies, and availability queries decoded for direct client debriefing.
        </p>
      </div>
    </header>

    <!-- SEARCH & CONTROLLERS -->
    <div class="mb-10 gsap-reveal">
      <div class="relative max-w-xl">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Filter system queries (e.g. AI, audit, stack)..." 
          class="w-full px-5 py-4 pl-12 rounded-2xl bg-surface-container border border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-base text-on-surface placeholder:text-on-surface-variant/40 shadow-inner"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="themeStore.currentStyle === 'brutal' ? 'brutal-card' : ''"
        />
        <HelpCircle class="w-5 h-5 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- MAIN FAQ DECK CONTAINER -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      <!-- LEFT COLUMN: ACCORDION LIST -->
      <div class="lg:col-span-8 flex flex-col gap-5 text-left">
        <transition-group name="list" tag="div" class="flex flex-col gap-4">
          <div 
            v-for="(faq, idx) in filteredFaqs" 
            :key="faq.q"
            class="faq-card border border-primary/10 bg-surface-container-low/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-md cursor-pointer select-none"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
              themeStore.currentStyle === 'street' ? 'street-card' : 'hover:border-primary/30',
              activeFaqIdx === idx ? 'border-primary/45 bg-surface-container-low/80 ring-1 ring-primary/10' : ''
            ]"
            @click="toggleFaq(idx)"
          >
            <!-- Card Question Section -->
            <div class="p-5 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary font-black shrink-0">
                  {{ faq.category }}
                </span>
                <h3 class="font-headline font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-on-surface leading-tight">
                  {{ faq.q }}
                </h3>
              </div>
              <ChevronDown 
                class="w-5 h-5 text-on-surface-variant/60 transition-transform duration-300 shrink-0"
                :class="{ 'rotate-180 text-primary': activeFaqIdx === idx }"
              />
            </div>

            <!-- Card Answer Section (Collapsible) -->
            <div 
              class="transition-all duration-500 ease-in-out overflow-hidden"
              :style="{ maxHeight: activeFaqIdx === idx ? '300px' : '0px' }"
            >
              <div class="px-5 pb-6 pt-1 border-t border-on-surface/5">
                <p class="text-on-surface-variant text-xs sm:text-sm font-body font-medium leading-relaxed opacity-90 text-balance">
                  {{ faq.a }}
                </p>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- No results template -->
        <div v-if="filteredFaqs.length === 0" class="p-12 text-center border border-dashed border-primary/10 rounded-2xl font-mono text-xs opacity-50 uppercase tracking-widest">
          No matching operational records found.
        </div>
      </div>

      <!-- RIGHT COLUMN: SIDEBAR CONSOLE -->
      <div class="lg:col-span-4 flex flex-col gap-6 gsap-reveal">
        <div 
          class="p-6 border border-primary/10 bg-surface-container-low/60 rounded-3xl text-left relative overflow-hidden"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : themeStore.currentStyle === 'street' ? 'street-card' : ''"
        >
          <div class="absolute -top-10 -right-10 opacity-[0.03]">
            <Terminal class="w-48 h-48 text-on-surface" />
          </div>
          
          <h3 class="font-headline font-black text-lg md:text-xl uppercase tracking-tight text-on-surface mb-3 flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-primary shrink-0" />
            DIRECT PROTOCOL
          </h3>
          <p class="text-on-surface-variant text-xs leading-relaxed font-body font-medium mb-6 opacity-85">
            Do you have a unique or custom business inquiry not detailed in the index? Reach out directly via the secure communications panel.
          </p>

          <router-link 
            to="/contact" 
            class="px-6 py-3.5 bg-primary text-on-primary font-black text-[10px] tracking-[0.2em] uppercase inline-flex items-center gap-3 hover:translate-y-[-2px] transition-all shadow-lg active-spring"
            :style="{ borderRadius: 'var(--app-radius)' }"
            :class="themeStore.currentStyle === 'brutal' ? 'brutal-btn text-[11px]' : themeStore.currentStyle === 'street' ? 'street-btn shadow-secondary' : ''"
          >
            DISPATCH MESSAGE
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
</style>
