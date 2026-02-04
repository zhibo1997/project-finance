<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部导航 -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">项目维度财务数据系统</h1>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-blue-600 font-medium">
              项目列表
            </NuxtLink>
            <NuxtLink to="/config" class="text-gray-600 hover:text-blue-600 font-medium">
              配置管理
            </NuxtLink>
            <div class="text-sm text-gray-500">
              欢迎, {{ currentUser?.name }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- 底部 -->
    <footer class="bg-white border-t mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-sm text-gray-500">
          © 2024 项目维度财务数据系统
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const currentUser = computed(() => {
  // 在实际项目中，应该从状态管理或API获取用户信息
  return {
    id: '1',
    name: '张管理员',
    role: 'admin',
    email: 'admin@company.com'
  }
})
</script>
