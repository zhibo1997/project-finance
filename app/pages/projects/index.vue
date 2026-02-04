<template>
  <Layout>
    <div class="projects-page">
      <div class="page-header">
        <h2>项目管理</h2>
        <n-button type="primary" size="large" @click="navigateTo('/projects/new')">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </template>
          新建项目
        </n-button>
      </div>

      <div class="search-section">
        <n-input
          v-model:value="searchParams.keyword"
          placeholder="搜索项目名称、客户或负责人..."
          class="search-input"
          clearable
          @keyup.enter="searchProjects"
        />
        <n-select
          v-model:value="searchParams.status"
          placeholder="所有状态"
          class="status-select"
          style="width: 150px"
        >
          <n-select-option value="">所有状态</n-select-option>
          <n-select-option value="draft">草稿</n-select-option>
          <n-select-option value="submitted">已提交</n-select-option>
          <n-select-option value="completed">已完成</n-select-option>
          <n-select-option value="closed">已结项</n-select-option>
        </n-select>
        <n-button type="primary" @click="searchProjects">搜索</n-button>
      </div>

      <div class="projects-list">
        <n-data-table
          :columns="columns"
          :data="projects.list"
          :pagination="false"
          class="project-table"
          :bordered="true"
          :scroll-x="800"
        />
      </div>

      <div class="pagination" v-if="projects.total > projects.size">
        <n-pagination
          v-model:page="projects.page"
          v-model:page-size="projects.size"
          :page-sizes="[10, 20, 50, 100]"
          :item-count="projects.total"
          show-size-picker
          show-quick-jumper
          show-page-sizes
          @update:page="fetchProjects"
          @update:page-size="fetchProjects"
        />
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import type { Project } from '~/types/project'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'

const router = useRouter()
const api = useApi()
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

const columns = [
  { title: '项目名称', key: 'projectName', ellipsis: true },
  { title: '负责人', key: 'projectLeader' },
  { title: '客户', key: 'clientName', ellipsis: true },
  { title: '项目类型', key: 'projectType' },
  {
    title: '服务日期',
    key: 'serviceDate',
    render: ({ serviceStartDate, serviceEndDate }: Project) => {
      return `${formatDate(serviceStartDate)} - ${formatDate(serviceEndDate)}`
    }
  },
  {
    title: '服务金额',
    key: 'serviceAmount',
    render: ({ serviceAmount }: Project) => {
      return `¥${serviceAmount.toFixed(2)}`
    }
  },
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
      return h('n-tag', { type: statusInfo.type }, { default: () => statusInfo.text })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    render: ({ id }: Project) => {
      return h('div', { style: { display: 'flex', gap: '8px' } }, [
        h('n-button', {
          type: 'primary',
          size: 'small',
          onClick: () => router.push(`/projects/${id}`)
        }, { default: () => '查看详情' }),
        h('n-button', {
          type: 'default',
          size: 'small',
          onClick: () => router.push(`/projects/${id}/edit`)
        }, { default: () => '编辑' }),
        h('n-button', {
          type: 'default',
          size: 'small',
          onClick: () => copyProject(id)
        }, { default: () => '复制' }),
        h('n-button', {
          type: 'error',
          size: 'small',
          onClick: () => deleteProject(id)
        }, { default: () => '删除' })
      ])
    }
  }
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const fetchProjects = async () => {
  try {
    const response = await api.projects.list({
      page: projects.value.page,
      size: projects.value.size,
      keyword: searchParams.value.keyword,
      status: searchParams.value.status
    })
    projects.value = response
  } catch (error) {
    console.error('获取项目列表失败:', error)
    useMessage().error('获取项目列表失败')
  }
}

const searchProjects = () => {
  projects.value.page = 1
  fetchProjects()
}

const copyProject = async (id: string) => {
  try {
    const message = useMessage()
    const response = await api.projects.copy(id)
    message.success('项目复制成功')
    fetchProjects()
  } catch (error) {
    console.error('复制项目失败:', error)
    useMessage().error('复制项目失败')
  }
}

const deleteProject = async (id: string) => {
  try {
    const dialog = useDialog()
    dialog.warning({
      title: '确认删除',
      content: '确定要删除这个项目吗？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        await api.projects.delete(id)
        useMessage().success('项目删除成功')
        fetchProjects()
      }
    })
  } catch (error) {
    console.error('删除项目失败:', error)
    useMessage().error('删除项目失败')
  }
}

const navigateTo = (path: string) => {
  router.push(path)
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
}

.status-select {
  min-width: 150px;
}

.projects-list {
  margin-bottom: 20px;
}

.project-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .search-section {
    flex-direction: column;
  }

  .search-input {
    min-width: 100%;
  }

  .status-select {
    min-width: 100%;
  }
}
</style>
