<script setup>
import { ref, computed } from 'vue'
import { portfolioData } from '../data/portfolioData'
import { useThemeStore } from '../stores/themeStore'
import { ArrowUpRight, Search, ChevronDown } from 'lucide-vue-next'

const themeStore = useThemeStore()
const allProjects = ref(portfolioData.projects)

// Search and filter state
const searchQuery = ref('')
const selectedTech = ref('ALL')
const selectedChallenge = ref('ALL')
const filterMode = ref('challenge') // 'challenge' or 'tech'

const challenges = [
  'ALL',
  'Automate Operations',
  'Scale User Growth',
  'Deploy Agentic AI',
  'Launch Mobile Products'
]

// Accordion — all rows expanded by default using a Set of IDs
const expandedRows = ref(new Set(portfolioData.projects.map(p => p.id)))
const toggleRow = (id) => {
  const s = new Set(expandedRows.value)
  s.has(id) ? s.delete(id) : s.add(id)
  expandedRows.value = s
}

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
    const matchesTech = filterMode.value === 'tech' && selectedTech.value !== 'ALL'
      ? p.tech.includes(selectedTech.value)
      : true
    const matchesChallenge = filterMode.value === 'challenge' && selectedChallenge.value !== 'ALL'
      ? p.challenges?.includes(selectedChallenge.value)
      : true
    return matchesSearch && matchesTech && matchesChallenge
  })
})
</script>

<template>
  <div class="relative w-full overflow-visible py-8 md:py-16">
    <!-- Header of the Table view -->
    <div class="flex flex-col gap-4 mb-8 md:mb-12">
      <!-- Title row + search bar side by side -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span class="text-primary font-black tracking-[0.4em] uppercase text-[9px] md:text-[10px] mb-4 block">Complete Registry</span>
          <h2 class="font-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-[calc(-0.04em)] uppercase leading-none text-on-surface">
            PROJECT <span class="text-primary italic">ARCHIVE</span>
          </h2>
        </div>
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
      </div>

      <!-- Filter Mode Selector -->
      <div class="flex items-center gap-4 text-[10px] font-mono mb-2">
        <span class="text-on-surface/40 uppercase tracking-wider font-bold">Filter By:</span>
        <div class="flex gap-2">
          <button 
            @click="filterMode = 'challenge'" 
            class="px-3 py-1 rounded-full border transition-all font-black uppercase text-[8px] tracking-widest active-spring"
            :class="filterMode === 'challenge' ? 'border-primary text-primary bg-primary/10' : 'border-primary/10 text-on-surface/60 hover:bg-surface-container-high/40'"
          >
            Business Challenge
          </button>
          <button 
            @click="filterMode = 'tech'" 
            class="px-3 py-1 rounded-full border transition-all font-black uppercase text-[8px] tracking-widest active-spring"
            :class="filterMode === 'tech' ? 'border-primary text-primary bg-primary/10' : 'border-primary/10 text-on-surface/60 hover:bg-surface-container-high/40'"
          >
            Technology
          </button>
        </div>
      </div>

      <!-- Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        <!-- Challenge Pills -->
        <template v-if="filterMode === 'challenge'">
          <button 
            v-for="ch in challenges" 
            :key="ch"
            @click="selectedChallenge = ch"
            class="text-[10px] font-black tracking-[0.15em] px-3 py-2 uppercase transition-all duration-300 whitespace-nowrap active-spring"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '0.5rem' }"
            :class="selectedChallenge === ch 
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
              : 'bg-surface-container-high/30 hover:bg-surface-container-high/70 text-on-surface/60 border border-primary/5'"
          >
            {{ ch }}
          </button>
        </template>
        
        <!-- Tech Pills -->
        <template v-else>
          <button 
            v-for="tech in allTechTags.slice(0, 8)" 
            :key="tech"
            @click="selectedTech = tech"
            class="text-[10px] font-black tracking-[0.15em] px-3 py-2 uppercase transition-all duration-300 whitespace-nowrap active-spring"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '0.5rem' }"
            :class="selectedTech === tech 
              ? 'bg-primary text-on-primary shadow-lg shadow-primary/15'
              : 'bg-surface-container-high/30 hover:bg-surface-container-high/70 text-on-surface/60 border border-primary/5'"
          >
            {{ tech }}
          </button>
        </template>
      </div>
    </div>

    <!-- ===== MOBILE / TABLET: Accordion list layout (< lg) ===== -->
    <div class="lg:hidden divide-y divide-primary/10 border-t border-primary/10">
      <!-- Empty state -->
      <div v-if="filteredProjects.length === 0" class="py-10 text-center text-on-surface/40 font-body font-semibold uppercase tracking-wider text-xs">
        No matching configurations found in archive database.
      </div>

      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="group"
            <!-- Collapsed row: always visible -->
        <button
          class="w-full flex items-center gap-3 py-3.5 px-1 text-left transition-all duration-200"
          :class="expandedRows.has(project.id) ? 'text-primary' : ''"
          @click="toggleRow(project.id)"
        >
          <!-- Year badge -->
          <span class="font-mono text-[9px] font-bold tracking-wider text-on-surface/40 shrink-0 w-8"
            :class="expandedRows.has(project.id) ? 'text-primary' : ''"
          >{{ project.year }}</span>

          <!-- Featured dot -->
          <span v-if="project.featured" class="flex h-1.5 w-1.5 relative shrink-0">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          <span v-else class="w-1.5 shrink-0"></span>

          <!-- Project title -->
          <span class="font-headline font-black text-sm uppercase tracking-tight text-on-surface flex-1 min-w-0 truncate transition-colors"
            :class="expandedRows.has(project.id) ? 'text-primary' : ''"
          >{{ project.title }}</span>

          <!-- First 2 tech tags -->
          <span class="flex gap-1 shrink-0">
            <span
              v-for="tag in project.tech.slice(0, 2)"
              :key="tag"
              class="text-[7px] font-black px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/10 uppercase tracking-widest rounded hidden sm:inline-block"
            >{{ tag }}</span>
          </span>

          <!-- Link or chevron -->
          <a
            v-if="project.link && project.link !== '#'"
            :href="project.link"
            target="_blank"
            @click.stop
            class="inline-flex items-center justify-center w-6 h-6 rounded-full border border-primary/20 text-on-surface/60 hover:text-on-primary hover:bg-primary hover:border-primary transition-all duration-300 shrink-0"
          >
            <ArrowUpRight class="w-3 h-3" />
          </a>
          <ChevronDown
            v-else
            class="w-4 h-4 text-on-surface/30 shrink-0 transition-transform duration-300"
            :class="expandedRows.has(project.id) ? 'rotate-180 text-primary' : ''"
          />
        </button>

        <!-- Expanded panel: description + full tech stack -->
        <div
          v-show="expandedRows.has(project.id)"
          class="pb-4 px-1 pl-11"
        >
          <!-- Full tech tags -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="tag in project.tech"
              :key="tag"
              class="text-[7px] font-black px-2 py-0.5 bg-surface-container-high/60 border border-primary/10 text-primary uppercase tracking-widest rounded"
              :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
            >{{ tag }}</span>
          </div>
          <!-- Description -->
          <p class="text-on-surface-variant text-xs leading-relaxed font-body font-medium opacity-85">
            {{ project.description }}
          </p>
          <!-- Lock label if no link -->
          <span
            v-if="!project.link || project.link === '#'"
            class="inline-block mt-2 text-[7px] font-black uppercase tracking-wider text-on-surface/40 bg-surface-container-high px-2 py-1 rounded-md"
          >{{ project.hoverText || 'PRIVATE' }}</span>
        </div>
      </div>
    </div>

    <!-- ===== DESKTOP: Full table layout (lg+) ===== -->
    <div class="hidden lg:block w-full overflow-x-auto scrollbar-none border-t border-primary/10">
      <table class="w-full min-w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-primary/10 text-on-surface/40 uppercase font-black text-[9px] tracking-[0.3em]">
            <th class="py-5 lg:py-6 px-6 w-[10%]">YEAR</th>
            <th class="py-5 lg:py-6 px-6 w-[25%]">PROJECT</th>
            <th class="py-5 lg:py-6 px-6 w-[35%]">ARCHITECTURE / DESCRIPTION</th>
            <th class="py-5 lg:py-6 px-6 w-[20%]">BUILT WITH</th>
            <th class="py-5 lg:py-6 px-6 w-[10%] text-right">LINK</th>
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
            <td class="py-5 lg:py-7 px-6 font-mono text-xs font-bold tracking-wider text-on-surface/50 group-hover:text-primary transition-colors">
              {{ project.year }}
            </td>

            <!-- Title column -->
            <td class="py-5 lg:py-7 px-6">
              <div class="flex items-center gap-3">
                <span class="font-headline font-black text-base lg:text-xl uppercase tracking-tight text-on-surface group-hover:text-primary transition-colors">
                  {{ project.title }}
                </span>
                <span v-if="project.featured" class="flex h-2 w-2 relative" title="Featured Project">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              </div>
            </td>

            <!-- Description column -->
            <td class="py-5 lg:py-7 px-6 text-xs lg:text-sm font-body font-semibold text-on-surface-variant leading-relaxed opacity-85 group-hover:opacity-100">
              {{ project.description }}
            </td>

            <!-- Tech Stack tags column -->
            <td class="py-5 lg:py-7 px-6">
              <div class="flex flex-wrap gap-1 max-w-[200px]">
                <span 
                  v-for="tag in project.tech" 
                  :key="tag"
                  class="text-[7px] lg:text-[8px] font-black px-2 py-1 bg-surface-container-high/60 border border-primary/5 text-on-surface/70 group-hover:text-primary group-hover:border-primary/20 transition-all uppercase tracking-widest rounded-md"
                  :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <!-- Access link column -->
            <td class="py-5 lg:py-7 px-6 text-right">
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

