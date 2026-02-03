<template>
  <Layout>
    <div class="homepage">
      <div class="welcome-section">
        <h2>欢迎使用项目维度财务数据系统</h2>
        <p>这是一个专注于项目维度财务数据管理的系统，帮助您更好地跟踪和分析项目的财务状况。</p>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <h3>项目总数</h3>
          <p class="stat-value">{{ stats.projectCount }}</p>
        </div>
        <div class="stat-card">
          <h3>已完成项目</h3>
          <p class="stat-value">{{ stats.completedCount }}</p>
        </div>
        <div class="stat-card">
          <h3>总收入</h3>
          <p class="stat-value">¥{{ stats.totalIncome.toFixed(2) }}</p>
        </div>
        <div class="stat-card">
          <h3>总支出</h3>
          <p class="stat-value">¥{{ stats.totalExpense.toFixed(2) }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <h3>快速操作</h3>
        <div class="action-buttons">
          <NuxtLink to="/projects" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            项目管理
          </NuxtLink>
          <NuxtLink to="/config" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"></path>
            </svg>
            配置管理
          </NuxtLink>
          <NuxtLink to="/accounting" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            记账管理
          </NuxtLink>
        </div>
      </div>

      <div class="recent-projects">
        <h3>最近项目</h3>
        <div class="project-list">
          <div v-for="project in recentProjects" :key="project.id" class="project-item">
            <h4>{{ project.projectName }}</h4>
            <p>负责人: {{ project.projectLeader }}</p>
            <p>客户: {{ project.clientName }}</p>
            <p>状态: {{ project.status }}</p>
            <NuxtLink :to="`/projects/${project.id}`" class="btn btn-secondary">查看详情</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Project } from '~/types/project'

const stats = ref({
  projectCount: 0,
  completedCount: 0,
  totalIncome: 0,
  totalExpense: 0
})

const recentProjects = ref<Project[]>([])

onMounted(async () => {
  // 获取项目统计数据
  const response = await $fetch('/api/stats')
  if (response?.code === 0) {
    stats.value = response.data
  }

  // 获取最近项目
  const projectsResponse = await $fetch('/api/projects?page=1&size=5')
  if (projectsResponse?.code === 0) {
    recentProjects.value = projectsResponse.data.list
  }
})
</script>

<style scoped>
.homepage {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.welcome-section h2 {
  font-size: 28px;
  margin-bottom: 16px;
  color: #1890ff;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin: 0;
}

.quick-actions {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.quick-actions h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons a {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

.recent-projects {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recent-projects h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.project-item {
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.project-item h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #1890ff;
}

.project-item p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .welcome-section h2 {
    font-size: 24px;
  }

  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .stat-value {
    font-size: 20px;
  }

  .project-list {
    grid-template-columns: 1fr;
  }
}
</style>
