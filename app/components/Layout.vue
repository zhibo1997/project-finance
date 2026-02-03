<template>
  <div class="app-container">
    <header class="app-header">
      <div class="container">
        <h1>项目维度财务数据系统</h1>
        <nav class="app-nav">
          <NuxtLink to="/" class="nav-link">首页</NuxtLink>
          <NuxtLink to="/projects" class="nav-link">项目管理</NuxtLink>
          <NuxtLink to="/config" class="nav-link">配置管理</NuxtLink>
          <NuxtLink to="/accounting" class="nav-link">记账管理</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <slot />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>项目维度财务数据系统 © 2026</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #1890ff;
  color: white;
  padding: 16px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.app-header h1 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
}

.app-nav {
  display: flex;
  gap: 16px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-main {
  flex: 1;
  padding: 24px 0;
}

.app-footer {
  background-color: #f0f2f5;
  color: #666;
  padding: 16px 0;
  text-align: center;
  margin-top: auto;
}
</style>
