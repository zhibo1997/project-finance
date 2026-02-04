<template>
  <Layout>
    <div class="homepage">
      <div class="welcome-section">
        <h2>欢迎使用项目维度财务数据系统</h2>
        <p>这是一个专注于项目维度财务数据管理的系统，帮助您更好地跟踪和分析项目的财务状况。</p>
      </div>

      <div class="stats-section">
        <n-card v-for="(stat, index) in statsData" :key="index" class="stat-card">
          <n-statistic
            :title="stat.title"
            :value="stat.value"
            :prefix="stat.prefix"
          />
        </n-card>
      </div>

      <div class="quick-actions">
        <h3>快速操作</h3>
        <div class="action-buttons">
          <n-button type="primary" size="large" @click="navigateTo('/projects')">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </template>
            项目管理
          </n-button>
          <n-button type="primary" size="large" @click="navigateTo('/config')">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"></path>
              </svg>
            </template>
            配置管理
          </n-button>
          <n-button type="primary" size="large" @click="navigateTo('/accounting')">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </template>
            记账管理
          </n-button>
        </div>
      </div>

      <div class="recent-projects">
        <h3>最近项目</h3>
        <n-data-table
          :columns="columns"
          :data="recentProjects"
          :pagination="false"
          class="project-table"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import type { Project } from '~/types/project'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = useApi()
const stats = ref({
  projectCount: 0,
  completedCount: 0,
  totalIncome: 0,
  totalExpense: 0
})
const recentProjects = ref<Project[]>([])

const statsData = computed(() => [
  { title: '项目总数', value: stats.value.projectCount },
  { title: '已完成项目', value: stats.value.completedCount },
  { title: '总收入', value: stats.value.totalIncome.toFixed(2), prefix: '¥' },
  { title: '总支出', value: stats.value.totalExpense.toFixed(2), prefix: '¥' }
])

const columns = [
  { title: '项目名称', key: 'projectName', ellipsis: true },
  { title: '负责人', key: 'projectLeader' },
  { title: '客户', key: 'clientName', ellipsis: true },
  {
    title: '状态',
    key: 'status',
    render: ({ status }: Project) => {
      const statusMap: Record<string, { text: string; type: 'default' | 'primary' | 'success' | 'warning' | 'error' }> = {
        draft: { text: '草稿', type: 'warning' },
        submitted: { text: '已提交', type: 'primary' },
        completed: { text: '已完成', type: 'success' },
        closed: { text: '已结项', type: 'default' }
      }
      const statusInfo = statusMap[status] || { text: status, type: 'default' }
      return h(
        'n-tag',
        { type: statusInfo.type },
        { default: () => statusInfo.text }
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render: ({ id }: Project) => h(
      'n-button',
      {
        type: 'primary',
        size: 'small',
        onClick: () => router.push(`/projects/${id}`)
      },
      { default: () => '查看详情' }
    )
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(async () => {
  try {
    // 获取统计数据
    stats.value = await api.stats.get()

    // 获取最近项目
    const projectsResponse = await api.projects.list({ page: 1, size: 5 })
    recentProjects.value = projectsResponse.list
  } catch (error) {
    console.error('获取数据失败:', error)
    useMessage().error('获取数据失败')
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.project-table {
  margin-top: 16px;
}

@media (max-width: 768px) {
  .welcome-section h2 {
    font-size: 24px;
  }

  .stats-section {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
