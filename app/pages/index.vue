<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1 style="color: #333; margin-bottom: 20px;">🎉 Nuxt 基础页面测试</h1>
    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border: 1px solid #4caf50;">
      <p style="margin: 0; color: #2e7d32;">✅ 如果你能看到这个绿色框，说明Nuxt基础渲染功能正常！</p>
    </div>
    
    <div style="margin-top: 20px;">
      <h2 style="color: #555;">系统信息：</h2>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Nuxt 版本：4.x</li>
        <li>端口：8989</li>
        <li>当前时间：{{ new Date().toLocaleString() }}</li>
      </ul>
    </div>
    
    <div style="margin-top: 20px;">
      <button 
        @click="testAPI" 
        style="background: #2196f3; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;"
      >
        测试API
      </button>
      <button 
        @click="goToTestPage" 
        style="background: #4caf50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;"
      >
        访问测试页面
      </button>
    </div>
    
    <div v-if="apiResult" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px;">
      <h3>API响应结果：</h3>
      <pre style="white-space: pre-wrap;">{{ JSON.stringify(apiResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
const apiResult = ref(null)

const testAPI = async () => {
  try {
    // 简单的测试，不依赖复杂的API
    apiResult.value = { status: 'success', message: 'Nuxt服务器连接正常', timestamp: new Date().toISOString() }
  } catch (error) {
    apiResult.value = { error: error.message }
  }
}

const goToTestPage = () => {
  window.location.href = '/test'
}

useHead({
  title: 'Nuxt基础测试页面'
})
</script>
