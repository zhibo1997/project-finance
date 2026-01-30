<script setup lang="ts">
import { Building2, Calendar, User } from 'lucide-vue-next';

defineProps<{
  info: {
    status: string;
    projectId: string;
    projectName: string;
    clientName: string;
    region: string;
    clientContact: string;
    updateDate: string;
    projectLead: string;
    teamMembers: string[];
  }
}>();
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
    <div class="h-2 bg-gradient-to-r from-blue-600 to-green-500"></div>
    <div class="p-6 sm:p-8">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div class="space-y-4 flex-1">
          <div class="flex items-center gap-3">
            <span class="px-2.5 py-1 rounded-md ant-tag-success text-xs font-semibold tracking-wide">
              {{ info.status }}
            </span>
            <span class="text-gray-400 text-xs font-mono tracking-wider">
              {{ info.projectId }}
            </span>
          </div>
          
          <!-- Client Focused Header -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {{ info.clientName }}
              </h1>
              <span class="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                {{ info.region }}
              </span>
            </div>
            
            <h2 class="text-lg text-gray-600 font-medium mb-3">
              {{ info.projectName }}
            </h2>

            <div class="flex items-center text-gray-500 text-sm gap-4">
              <span class="flex items-center gap-1.5">
                <User :size="14" />
                客户联系: {{ info.clientContact }}
              </span>
              <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span class="flex items-center gap-1.5">
                <Calendar :size="14" />
                更新于 {{ info.updateDate }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 min-w-[280px]">
          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100/50 flex items-center justify-between group hover:border-gray-200 transition-colors">
            <div>
              <div class="text-xs text-gray-400 mb-0.5">项目负责人</div>
              <div class="text-sm font-semibold text-gray-900">{{ info.projectLead }}</div>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 ring-2 ring-white">
              {{ info.projectLead[0] }}
            </div>
          </div>

          <div class="flex items-center justify-between px-2">
            <div class="text-xs text-gray-400">项目成员</div>
            <div class="flex -space-x-2">
              <div 
                v-for="(member, idx) in info.teamMembers" 
                :key="idx"
                class="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500 shadow-sm ring-1 ring-white" 
                :title="member"
              >
                {{ member[0] }}
              </div>
              <div class="w-7 h-7 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[10px] text-gray-400">
                +
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
