<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../stores/themeStore'
import { ArrowRight, Calculator, Cpu, DollarSign, Clock, ShieldCheck } from 'lucide-vue-next'

const themeStore = useThemeStore()

// Input states
const monthlyCloudSpend = ref(1200)
const apiLatency = ref(650)
const manualHours = ref(15)

// Projected calculations
const costSavings = computed(() => Math.round(monthlyCloudSpend.value * 0.32))
const yearlySavings = computed(() => costSavings.value * 12)
const latencyReduction = computed(() => Math.round(apiLatency.value * 0.58))
const optimizedLatency = computed(() => Math.max(45, apiLatency.value - latencyReduction.value))
const reclaimedHours = computed(() => Math.round(manualHours.value * 0.85))

// Dynamic operational blueprint recommendation
const operationalBlueprint = computed(() => {
  if (monthlyCloudSpend.value > 3000 || apiLatency.value > 800) {
    return {
      title: "DATABASE & SERVER OPTIMIZATION",
      stack: "Database Indexing // Server-Side Caching // Load Balancing",
      details: "We will optimize your database queries and set up fast server caching to prevent slow loading, slash hosting bills, and handle more concurrent users."
    }
  } else if (manualHours.value > 20) {
    return {
      title: "CUSTOM TASK AUTOMATION",
      stack: "Automated Workflows // AI Helpers // API Integrations",
      details: "We will set up automated pipelines to handle repetitive manual tasks, saving your team hours of work every week."
    }
  } else {
    return {
      title: "FAST WEB & MOBILE DEPLOYMENT",
      stack: "Optimized Code // Fast Loading // Clean User Experience",
      details: "We will build a high-performance website or mobile app optimized for speed and designed to convert visitors into customers."
    }
  }
})
</script>

<template>
  <div 
    class="w-full p-6 md:p-10 border border-primary/15 bg-surface-container-low/50 backdrop-blur-md relative overflow-hidden text-left"
    :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '2.5rem' }"
    :class="[
      themeStore.currentStyle === 'brutal' ? 'brutal-card bg-surface' : 
      themeStore.currentStyle === 'street' ? 'street-card border-secondary/40' : ''
    ]"
  >
    <!-- Background Glow -->
    <div v-if="themeStore.currentStyle !== 'brutal'" class="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

    <!-- Header -->
    <div class="flex items-center gap-3 mb-8">
      <div 
        class="w-10 h-10 bg-primary/10 flex items-center justify-center"
        :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '0.75rem' }"
      >
        <Calculator class="w-5 h-5 text-primary" />
      </div>
      <div>
        <span class="block font-mono text-[9px] text-primary font-black uppercase tracking-[0.2em] leading-none mb-1">ESTIMATE YOUR SAVINGS & SPEED</span>
        <h3 class="font-headline font-black text-lg md:text-xl uppercase tracking-tight text-on-surface">PROJECT VALUE CALCULATOR</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- Input Controls -->
      <div class="lg:col-span-6 flex flex-col gap-6">
        <!-- Monthly Cloud Spend Slider -->
        <div class="flex flex-col gap-2.5">
          <div class="flex justify-between items-baseline font-headline font-black text-xs md:text-sm uppercase tracking-wide text-on-surface">
            <span>MONTHLY SERVER & CLOUD COST</span>
            <span class="text-primary font-mono">${{ monthlyCloudSpend.toLocaleString() }}</span>
          </div>
          <input 
            v-model.number="monthlyCloudSpend" 
            type="range" 
            min="200" 
            max="10000" 
            step="100"
            class="w-full accent-primary bg-on-surface/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- API Latency Slider -->
        <div class="flex flex-col gap-2.5">
          <div class="flex justify-between items-baseline font-headline font-black text-xs md:text-sm uppercase tracking-wide text-on-surface">
            <span>AVERAGE WEBSITE LOADING SPEED</span>
            <span class="text-primary font-mono">{{ apiLatency }}ms</span>
          </div>
          <input 
            v-model.number="apiLatency" 
            type="range" 
            min="50" 
            max="1500" 
            step="25"
            class="w-full accent-primary bg-on-surface/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <!-- Manual Work Hours Slider -->
        <div class="flex flex-col gap-2.5">
          <div class="flex justify-between items-baseline font-headline font-black text-xs md:text-sm uppercase tracking-wide text-on-surface">
            <span>MANUAL WORK HOURS SPENT / WEEK</span>
            <span class="text-primary font-mono">{{ manualHours }} Hours</span>
          </div>
          <input 
            v-model.number="manualHours" 
            type="range" 
            min="2" 
            max="60" 
            step="1"
            class="w-full accent-primary bg-on-surface/10 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <!-- Simulator Output Metrics -->
      <div class="lg:col-span-6 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-on-surface/5 pt-6 lg:pt-0 lg:pl-8">
        <!-- Metric Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div 
            class="p-4 bg-primary/5 rounded-2xl border border-primary/10"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          >
            <div class="flex items-center gap-1.5 text-on-surface-variant text-[9px] font-mono uppercase tracking-widest mb-1">
              <DollarSign class="w-3.5 h-3.5 text-primary" />
              PROJECTED ANNUAL SAVINGS
            </div>
            <div class="font-headline font-black text-lg md:text-2xl text-primary italic">
              ${{ yearlySavings.toLocaleString() }}
            </div>
          </div>

          <div 
            class="p-4 bg-primary/5 rounded-2xl border border-primary/10"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          >
            <div class="flex items-center gap-1.5 text-on-surface-variant text-[9px] font-mono uppercase tracking-widest mb-1">
              <Cpu class="w-3.5 h-3.5 text-primary" />
              PROJECTED LOADING SPEED
            </div>
            <div class="font-headline font-black text-lg md:text-2xl text-primary italic">
              {{ optimizedLatency }}ms <span class="text-[10px] text-emerald-500 font-mono tracking-tight">-{{ latencyReduction }}ms</span>
            </div>
          </div>

          <div 
            class="p-4 bg-primary/5 rounded-2xl border border-primary/10 col-span-2"
            :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
          >
            <div class="flex items-center gap-1.5 text-on-surface-variant text-[9px] font-mono uppercase tracking-widest mb-1">
              <Clock class="w-3.5 h-3.5 text-primary" />
              RECLAIMED TEAM TIME
            </div>
            <div class="font-headline font-black text-lg md:text-2xl text-primary italic">
              {{ reclaimedHours }} HOURS / WEEK <span class="text-xs text-emerald-500 font-sans tracking-tight font-bold">(-85% Ops Overhead)</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Recommendation Panel -->
        <div 
          class="p-5 bg-surface-container-high/60 rounded-2xl border border-on-surface/5"
          :style="{ borderRadius: themeStore.currentStyle === 'brutal' ? '0px' : '' }"
        >
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[8px] font-black uppercase tracking-wider mb-2 leading-none">
            <ShieldCheck class="w-3 h-3" />
            RECOMMENDED ACTION PLAN
          </span>
          <h4 class="font-headline font-black text-xs md:text-sm uppercase tracking-wide text-on-surface mb-1">
            {{ operationalBlueprint.title }}
          </h4>
          <p class="font-mono text-[8px] text-primary/70 font-bold mb-3 uppercase tracking-wider">
            {{ operationalBlueprint.stack }}
          </p>
          <p class="text-on-surface-variant text-[11px] font-body font-medium leading-relaxed opacity-85">
            {{ operationalBlueprint.details }}
          </p>
        </div>

        <!-- Call to Action Link -->
        <div class="mt-2 text-right">
          <router-link 
            to="/contact" 
            class="font-headline font-black text-xs text-primary uppercase tracking-widest inline-flex items-center gap-2 group hover:underline"
          >
            TALK ABOUT YOUR PROJECT
            <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
