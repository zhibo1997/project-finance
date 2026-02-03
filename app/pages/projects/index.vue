<template>
  <Layout>
    <div class="projects-page">
      <div class="page-header">
        <h2>项目管理</h2>
        <NuxtLink to="/projects/new" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          新建项目
        </NuxtLink>
      </div>

      <div class="search-section">
        <input
          v-model="searchParams.keyword"
          type="text"
          placeholder="搜索项目名称、客户或负责人..."
          class="search-input"
        />
        <select v-model="searchParams.status" class="status-select">
          <option value="">所有状态</option>
          <option value="draft">草稿</option>
          <option value="submitted">已提交</option>
          <option value="completed">已完成</option>
          <option value="closed">已结项</option>
        </select>
        <button @click="searchProjects" class="btn btn-primary">搜索</button>
      </div>

      <div class="projects-list">
        <div v-for="project in projects.list" :key="project.id" class="project-card">
          <div class="project-info">
            <h3>{{ project.projectName }}</h3>
            <p>负责人: {{ project.projectLeader }}</p>
            <p>客户: {{ project.clientName }}</p>
            <p>项目类型: {{ project.projectType }}</p>
            <p>服务日期: {{ formatDate(project.serviceStartDate) }} - {{ formatDate(project.serviceEndDate) }}</p>
            <p>服务金额: ¥{{ project.serviceAmount.toFixed(2) }}</p>
            <p>状态: <span :class="getStatusClass(project.status)">{{ getStatusText(project.status) }}</span></p>
          </div>
          <div class="project-actions">
            <NuxtLink :to="`/projects/${project.id}`" class="btn btn-secondary">查看详情</NuxtLink>
            <NuxtLink :to="`/projects/${project.id}/edit`" class="btn btn-secondary">编辑</NuxtLink>
            <button @click="copyProject(project.id)" class="btn btn-secondary">复制</button>
            <button @click="deleteProject(project.id)" class="btn btn-secondary" style="background-color: #ff4d4f; color: white;">删除</button>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="projects.total > projects.size">
        <button @click="changePage(projects.page - 1)" :disabled="projects.page <= 1" class="btn btn-secondary">上一页</button>
        <span>第 {{ projects.page }} 页 / 共 {{ Math.ceil(projects.total / projects.size) }} 页</span>
        <button @click="changePage(projects.page + 1)" :disabled="projects.page >= Math.ceil(projects.total / projects.size)" class="btn btn-secondary">下一页</button>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Project } from '~/types/project'

const projects = ref({
  list: [] as Project[],
  total: 0,
  page: 1,
  size: 20
})

const searchParams = ref({
  keyword: '',
  status: ''
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    submitted: '已提交',
    completed: '已完成',
    closed: '已结项'
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: 'status-draft',
    submitted: 'status-submitted',
    completed: 'status-completed',
    closed: 'status-closed'
  }
  return statusMap[status] || ''
}

const fetchProjects = async () => {
  try {
    const params = new URLSearchParams()
    params.append('page', projects.value.page.toString())
    params.append('size', projects.value.size.toString())
    if (searchParams.value.keyword) {
      params.append('keyword', searchParams.value.keyword)
    }
    if (searchParams.value.status) {
      params.append('status', searchParams.value.status)
    }

    const response = await $fetch(`/api/projects?${params.toString()}`)
    if (response?.code === 0) {
      projects.value = response.data
    }
  } catch (error) {
    console.error('获取项目列表失败:', error)
  }
}

const searchProjects = () => {
  projects.value.page = 1
  fetchProjects()
}

const changePage = (page: number) => {
  projects.value.page = page
  fetchProjects()
}

const copyProject = async (id: string) => {
  try {
    const response = await $fetch(`/api/projects/${id}/copy`, {
      method: 'POST'
    })
    if (response?.code === 0) {
      alert('项目复制成功')
      fetchProjects()
    } else {
      alert(response?.message || '复制项目失败')
    }
  } catch (error) {
    console.error('复制项目失败:', error)
    alert('复制项目失败')
  }
}

const deleteProject = async (id: string) => {
  if (!confirm('确定要删除这个项目吗？')) {
    return
  }

  try {
    const response = await $fetch(`/api/projects/${id}`, {
      method: 'DELETE'
    })
    if (response?.code === 0) {
      alert('项目删除成功')
      fetchProjects()
    } else {
      alert(response?.message || '删除项目失败')
    }
  } catch (error) {
    console.error('删除项目失败:', error)
    alert('删除项目失败')
  }
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.projects-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.status-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.projects-list {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.project-card {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.project-info {
  flex: 1;
}

.project-info h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #1890ff;
}

.project-info p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.project-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.status-draft {
  color: #faad14;
}

.status-submitted {
  color: #1890ff;
}

.status-completed {
  color: #52c41a;
}

.status-closed {
  color: #8c8c8c;
}

@media (max-width: 768px) {
  .project-card {
    flex-direction: column;
  }

  .project-actions {
    flex-direction: row;
    margin-left: 0;
    margin-top: 16px;
  }

  .search-section {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }
}
</style>
