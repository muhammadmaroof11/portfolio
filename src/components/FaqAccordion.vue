<script setup>
import { ref } from 'vue'
import { useThemeStore } from '../stores/themeStore'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  columns: {
    type: Number,
    default: 1
  }
})

const themeStore = useThemeStore()
const activeIdx = ref(null)

const toggleFaq = (idx) => {
  activeIdx.value = activeIdx.value === idx ? null : idx
}
</script>

<template>
  <div 
    :class="[
      columns === 2 
        ? 'grid grid-cols-1 lg:grid-cols-2 gap-5 w-full items-start' 
        : 'flex flex-col gap-4 w-full'
    ]"
  >
    <div 
      v-for="(faq, idx) in items" 
      :key="faq.q"
      class="faq-card border border-primary/10 bg-surface-container-low/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-md cursor-pointer select-none"
      :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
      :class="[
        themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
        themeStore.currentStyle === 'street' ? 'street-card' : 'hover:border-primary/30',
        activeIdx === idx ? 'border-primary/45 bg-surface-container-low/80 ring-1 ring-primary/10' : ''
      ]"
      @click="toggleFaq(idx)"
    >
      <!-- Card Header -->
      <div class="p-5 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span v-if="faq.category" class="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary font-black shrink-0">
            {{ faq.category }}
          </span>
          <h3 class="font-headline font-black text-sm sm:text-base md:text-lg uppercase tracking-tight text-on-surface leading-tight text-left">
            {{ faq.q }}
          </h3>
        </div>
        <ChevronDown 
          class="w-5 h-5 text-on-surface-variant/60 transition-transform duration-300 shrink-0"
          :class="{ 'rotate-180 text-primary': activeIdx === idx }"
        />
      </div>

      <!-- Card Expandable Content -->
      <div 
        class="transition-all duration-500 ease-in-out overflow-hidden"
        :style="{ maxHeight: activeIdx === idx ? '300px' : '0px' }"
      >
        <div class="px-5 pb-6 pt-1 border-t border-on-surface/5 text-left">
          <p class="text-on-surface-variant text-xs sm:text-sm font-body font-medium leading-relaxed opacity-90 text-balance">
            {{ faq.a }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
