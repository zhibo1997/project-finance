<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: '%s - 项目维度财务数据系统',
  htmlAttrs: {
    lang: 'zh-CN'
  }
})
</script>

<style>
@import '~/assets/css/main.css';
</style>
