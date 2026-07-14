<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, defineAsyncComponent } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { HelpCircle, ArrowRight, Sparkles, Terminal } from 'lucide-vue-next'
const FuzzyText = defineAsyncComponent(() => import('../components/FuzzyText.vue'))
import FaqAccordion from '../components/FaqAccordion.vue'
import gsap from 'gsap'

const themeStore = useThemeStore()
const { profile } = portfolioData
const viewRoot = ref(null)

const searchQuery = ref('')

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return portfolioData.faqs
  const query = searchQuery.value.toLowerCase()
  return portfolioData.faqs.filter(f => 
    f.q.toLowerCase().includes(query) || 
    f.a.toLowerCase().includes(query) ||
    f.category.toLowerCase().includes(query)
  )
})

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
    "mainEntity": portfolioData.faqs.map(faq => ({
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
    <header class="mb-12 md:mb-16 gsap-reveal max-w-4xl mx-auto">
      <div class="text-left">
        <span class="app-badge mb-4 block inline-block" :style="{ borderRadius: 'calc(var(--app-radius) / 4)' }">COMMON QUESTIONS</span>
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
            QUESTIONS.
          </FuzzyText>
        </h1>
        <p class="text-on-surface-variant text-base md:text-lg leading-relaxed font-body max-w-xl opacity-80 font-medium">
          Clear answers about my services, custom workflow automation, app development, and how we can work together.
        </p>
      </div>
    </header>

    <!-- SEARCH & CONTROLLERS -->
    <div class="mb-10 max-w-4xl mx-auto gsap-reveal">
      <div class="relative w-full">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search for answers..." 
          class="w-full px-5 py-4 pl-12 rounded-2xl bg-surface-container border border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-base text-on-surface placeholder:text-on-surface-variant/40 shadow-inner"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          :class="themeStore.currentStyle === 'brutal' ? 'brutal-card' : ''"
        />
        <HelpCircle class="w-5 h-5 text-on-surface-variant/40 absolute left-4 top-1/2 -translate-y-1/2" />
      </div>
    </div>

    <!-- MAIN FAQ DECK CONTAINER -->
    <div class="max-w-4xl mx-auto gsap-reveal">
      <FaqAccordion :items="filteredFaqs" />

      <!-- No results template -->
      <div v-if="filteredFaqs.length === 0" class="p-12 text-center border border-dashed border-primary/10 rounded-2xl font-mono text-xs opacity-50 uppercase tracking-widest">
        No answers found matching your search.
      </div>
    </div>

    <!-- BOTTOM CALLOUT: STILL HAVE QUESTIONS -->
    <div class="mt-16 md:mt-24 max-w-4xl mx-auto gsap-reveal">
      <div 
        class="p-8 md:p-10 border border-primary/15 bg-surface-container-low/60 rounded-3xl text-center relative overflow-hidden flex flex-col items-center justify-center shadow-lg"
        :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
        :class="themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface border-4 border-on-surface' : themeStore.currentStyle === 'street' ? 'street-card' : ''"
      >
        <div class="absolute -top-10 -right-10 opacity-[0.03]">
          <Terminal class="w-48 h-48 text-on-surface" />
        </div>
        
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles class="w-6 h-6 text-primary" />
        </div>

        <h3 class="font-headline font-black text-xl md:text-2xl uppercase tracking-tight text-on-surface mb-3">
          Still Have Questions?
        </h3>
        <p class="text-on-surface-variant text-sm leading-relaxed font-body font-medium mb-8 max-w-md opacity-85 mx-auto">
          If you have a custom project or a specific question not covered here, feel free to reach out directly. I'll get back to you within 24 hours.
        </p>

        <router-link 
          to="/contact" 
          class="px-8 py-4 bg-primary text-on-primary font-black text-xs tracking-[0.2em] uppercase inline-flex items-center gap-3 hover:translate-y-[-2px] transition-all shadow-lg active-spring"
          :style="{ borderRadius: 'var(--app-radius)' }"
          :class="themeStore.currentStyle === 'brutal' ? 'brutal-btn text-[11px]' : themeStore.currentStyle === 'street' ? 'street-btn shadow-secondary' : ''"
        >
          GET IN TOUCH
          <ArrowRight class="w-4 h-4" />
        </router-link>
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
