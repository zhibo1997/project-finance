<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900">404 - 页面未找到</h1>
      <p class="text-gray-600 mt-2">您访问的页面不存在</p>
      <NButton type="primary" @click="navigateTo('/')" class="mt-4">
        返回首页
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
