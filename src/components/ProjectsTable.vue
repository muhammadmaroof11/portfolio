<script setup>
import { ref, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowUpRight, Search, Sparkles } from 'lucide-vue-next'

const themeStore = useThemeStore()
const allProjects = ref(portfolioData.projects)

// Search and filter state
const searchQuery = ref('')
const selectedTech = ref('ALL')

// Get unique tech tags for filter pills
const allTechTags = computed(() => {
  const tags = new Set()
  allProjects.value.forEach(p => p.tech.forEach(t => tags.add(t)))
  return ['ALL', ...Array.from(tags)]
})

// Filtered projects
const filteredProjects = computed(() => {
  return allProjects.value.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTech = selectedTech.value === 'ALL' || p.tech.includes(selectedTech.value)
    return matchesSearch && matchesTech
  })
})
</script>

<template>
  <div class="relative w-full overflow-visible py-8 md:py-16">
    <!-- Header of the Table view -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16">
      <div>
        <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">Complete Registry</span>
        <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-[calc(-0.04em)] uppercase leading-none text-on-surface">
          PROJECT <span class="text-primary italic">ARCHIVE</span>
        </h2>
      </div>

      <!-- Live Search & Filters -->
      <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <!-- Search bar -->
        <div class="relative flex items-center bg-surface-container-high/40 border border-primary/10 rounded-xl px-4 py-2.5 min-w-[240px] backdrop-blur-md">
          <Search class="w-4 h-4 text-on-surface/40 mr-3 shrink-0" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search projects..." 
            class="bg-transparent text-xs text-on-surface focus:outline-none placeholder-on-surface/40 w-full font-body font-semibold uppercase tracking-wider"
          />
        </div>

        <!-- Tech tags selector list -->
        <div class="flex items-center gap-1.5 overflow-x-auto max-w-[320px] scrollbar-none py-1">
          <button 
            v-for="tech in allTechTags.slice(0, 5)" 
            :key="tech"
            @click="selectedTech = tech"
            class="text-[8px] font-black tracking-widest px-3 py-2 uppercase transition-all duration-300 whitespace-nowrap active-spring"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '0.5rem' }"
            :class="selectedTech === tech 
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
              : 'bg-surface-container-high/30 hover:bg-surface-container-high/70 text-on-surface/60 border border-primary/5'"
          >
            {{ tech }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabular Deck Layout -->
    <div class="w-full overflow-x-auto scrollbar-none border-t border-primary/10">
      <table 
        class="w-full text-left border-collapse"
      >
        <thead>
          <tr class="border-b border-primary/10 text-on-surface/40 uppercase font-black text-[9px] tracking-[0.3em]">
            <th class="py-6 px-4 md:px-6 w-[12%]">YEAR</th>
            <th class="py-6 px-4 md:px-6 w-[28%]">PROJECT</th>
            <th class="py-6 px-4 md:px-6 w-[35%]">ARCHITECTURE / DESCRIPTION</th>
            <th class="py-6 px-4 md:px-6 w-[15%]">BUILT WITH</th>
            <th class="py-6 px-4 md:px-6 w-[10%] text-right">LINK</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary/5">
          <tr 
            v-for="(project, idx) in filteredProjects" 
            :key="project.id"
            class="group transition-all duration-300 cursor-pointer"
            :class="[
              themeStore.currentStyle === 'brutal' ? 'hover:bg-primary/5 hover:translate-x-1' :
              themeStore.currentStyle === 'street' ? 'hover:bg-primary/10 hover:text-primary' :
              'hover:bg-surface-container-high/40'
            ]"
          >
            <!-- Year column -->
            <td class="py-7 px-4 md:px-6 font-mono text-xs font-bold tracking-wider text-on-surface/50 group-hover:text-primary transition-colors">
              {{ project.year }}
            </td>

            <!-- Title column -->
            <td class="py-7 px-4 md:px-6">
              <div class="flex items-center gap-3">
                <span class="font-headline font-black text-lg md:text-xl uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  {{ project.title }}
                </span>
                <span v-if="project.featured" class="flex h-2 w-2 relative" title="Featured Project">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
            </td>

            <!-- Description column -->
            <td class="py-7 px-4 md:px-6 text-xs md:text-sm font-body font-semibold text-on-surface-variant leading-relaxed opacity-85 group-hover:opacity-100">
              {{ project.description }}
            </td>

            <!-- Tech Stack tags column -->
            <td class="py-7 px-4 md:px-6">
              <div class="flex flex-wrap gap-1 max-w-[200px]">
                <span 
                  v-for="tag in project.tech" 
                  :key="tag"
                  class="text-[7px] md:text-[8px] font-black px-2 py-1 bg-surface-container-high/60 border border-primary/5 text-on-surface/70 group-hover:text-primary group-hover:border-primary/20 transition-all uppercase tracking-widest rounded-md"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <!-- Access link column -->
            <td class="py-7 px-4 md:px-6 text-right">
              <a 
                v-if="project.link && project.link !== '#'" 
                :href="project.link" 
                target="_blank"
                class="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary/20 text-on-surface/70 hover:text-on-primary hover:bg-primary hover:border-primary transition-all duration-300"
                :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
              >
                <ArrowUpRight class="w-4 h-4" />
              </a>
              <span v-else class="text-[8px] font-black uppercase tracking-wider text-on-surface/40 bg-surface-container-high px-2.5 py-1.5 rounded-md">
                {{ project.hoverText || 'LOCK' }}
              </span>
            </td>
          </tr>

          <!-- Empty search result row -->
          <tr v-if="filteredProjects.length === 0">
            <td colspan="5" class="py-12 text-center text-on-surface/40 font-body font-semibold uppercase tracking-wider text-xs">
              No matching configurations found in archive database.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
