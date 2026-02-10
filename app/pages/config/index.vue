<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">配置管理</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div class="text-4xl mb-4">📊</div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">费用类别</h2>
          <p class="text-gray-600 mb-4">管理项目费用的分类标准</p>
          <NButton type="primary" @click="navigateTo('/config/expense-categories')">
            管理费用类别
          </NButton>
        </div>

        <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div class="text-4xl mb-4">🛒</div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">采购内容</h2>
          <p class="text-gray-600 mb-4">管理项目采购的内容分类</p>
          <NButton type="primary" @click="navigateTo('/config/purchase-contents')">
            管理采购内容
          </NButton>
        </div>

        <div class="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div class="text-4xl mb-4">👥</div>
          <h2 class="text-lg font-semibold text-gray-900 mb-2">员工成本</h2>
          <p class="text-gray-600 mb-4">配置不同职级的每日成本标准</p>
          <NButton type="primary" @click="navigateTo('/config/employee-costs')">
            管理员工成本
          </NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navigateTo = (path: string) => {
  navigateTo(path)
}
</script>
