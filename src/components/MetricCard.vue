<script setup lang="ts">
import { type Component } from 'vue';

const props = withDefaults(defineProps<{
  label: string;
  value: string;
  subValue?: string;
  icon: Component;
  trend?: string | number;
  type?: 'neutral' | 'dark' | 'highlight';
}>(), {
  type: 'neutral'
});

const styles = {
  neutral: "bg-white border-gray-200 text-gray-900",
  dark: "bg-gray-900 border-gray-800 text-white",
  highlight: "bg-white border-gray-200 text-gray-900",
};
</script>

<template>
  <div 
    class="relative p-5 rounded-xl border shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5"
    :class="styles[type]"
  >
    <div class="flex justify-between items-start mb-4">
      <div 
        class="p-2 rounded-lg"
        :class="type === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'"
      >
        <component :is="icon" :size="18" />
      </div>
      <span 
        v-if="trend"
        class="text-xs font-medium px-2 py-0.5 rounded-full"
        :class="Number(trend) > 0 ? 'ant-tag-success' : 'ant-tag-warning'"
      >
        {{ Number(trend) > 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    
    <div>
      <p 
        class="text-xs font-medium uppercase tracking-wider mb-1"
        :class="type === 'dark' ? 'text-gray-400' : 'text-gray-500'"
      >
        {{ label }}
      </p>
      <h3 class="text-2xl font-bold tracking-tight tabular-nums">
        {{ value }}
      </h3>
      <p 
        v-if="subValue"
        class="text-xs mt-2 leading-relaxed"
        :class="type === 'dark' ? 'text-gray-500' : 'text-gray-400'"
      >
        {{ subValue }}
      </p>
    </div>
  </div>
</template>
