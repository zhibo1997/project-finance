import { ref, computed } from 'vue'
import { projectDataStore } from '../data/projectData'
import type { Project, ProjectFormData, ProjectStatus, CreateProjectDTO, UpdateProjectDTO, ChangeStatusDTO } from '../types/project'

export function useProject() {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 加载项目列表
  const loadProjects = () => {
    loading.value = true
    error.value = null
    try {
      projects.value = projectDataStore.getProjects()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载项目列表失败'
    } finally {
      loading.value = false
    }
  }

  // 获取项目详情
  const getProject = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      loading.value = true
      error.value = null
      try {
        const project = projectDataStore.getProjectById(id)
        if (project) {
          currentProject.value = project
        } else {
          error.value = '项目不存在'
        }
        resolve()
      } catch (err) {
        error.value = err instanceof Error ? err.message : '获取项目详情失败'
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  // 创建项目
  const createProject = (data: CreateProjectDTO): Promise<Project> => {
    return new Promise((resolve, reject) => {
      loading.value = true
      error.value = null
      try {
        const project = projectDataStore.createProject({
          projectName: data.formData.basicInfo.projectName,
          projectLeader: data.formData.basicInfo.projectLeader,
          clientName: data.formData.basicInfo.clientName,
          projectType: data.formData.basicInfo.projectType,
          serviceStartDate: data.formData.basicInfo.serviceStartDate,
          serviceEndDate: data.formData.basicInfo.serviceEndDate,
          serviceAmount: 0, // 会在存储中计算
          status: 'draft',
          formData: data.formData,
          createdBy: data.createdBy
        })
        currentProject.value = project
        projects.value.push(project)
        resolve(project)
      } catch (err) {
        error.value = err instanceof Error ? err.message : '创建项目失败'
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  // 更新项目
  const updateProject = (id: string, data: UpdateProjectDTO): Promise<Project | undefined> => {
    return new Promise((resolve, reject) => {
      loading.value = true
      error.value = null
      try {
        const updated = projectDataStore.updateProject(id, {
          ...data,
          projectName: data.formData.basicInfo.projectName,
          projectLeader: data.formData.basicInfo.projectLeader,
          clientName: data.formData.basicInfo.clientName,
          projectType: data.formData.basicInfo.projectType,
          serviceStartDate: data.formData.basicInfo.serviceStartDate,
          serviceEndDate: data.formData.basicInfo.serviceEndDate
        })

        if (updated) {
          // 更新本地项目列表
          const index = projects.value.findIndex(p => p.id === id)
          if (index !== -1) {
            projects.value[index] = updated
          }
          currentProject.value = updated
        }

        resolve(updated)
      } catch (err) {
        error.value = err instanceof Error ? err.message : '更新项目失败'
        reject(err)
      } finally {
        loading.value = false
      }
    })
  }

  // 删除项目
  const deleteProject = (id: string): boolean => {
    loading.value = true
    error.value = null
    try {
      const success = projectDataStore.deleteProject(id)
      if (success) {
        projects.value = projects.value.filter(p => p.id !== id)
        if (currentProject.value?.id === id) {
          currentProject.value = null
        }
      }
      return success
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除项目失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 复制项目
  const copyProject = (id: string): Project | undefined => {
    loading.value = true
    error.value = null
    try {
      const copied = projectDataStore.copyProject(id)
      if (copied) {
        projects.value.push(copied)
        currentProject.value = copied
      }
      return copied
    } catch (err) {
      error.value = err instanceof Error ? err.message : '复制项目失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 更改项目状态
  const changeProjectStatus = (id: string, data: ChangeStatusDTO): Project | undefined => {
    loading.value = true
    error.value = null
    try {
      const updated = projectDataStore.changeProjectStatus(id, data.status)
      if (updated) {
        const index = projects.value.findIndex(p => p.id === id)
        if (index !== -1) {
          projects.value[index] = updated
        }
        if (currentProject.value?.id === id) {
          currentProject.value = updated
        }
      }
      return updated
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更改项目状态失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 搜索项目
  const searchProjects = (keyword: string) => {
    return projectDataStore.searchProjects(keyword)
  }

  // 按状态筛选项目
  const filterProjectsByStatus = (status: ProjectStatus | 'all') => {
    return projectDataStore.filterProjectsByStatus(status)
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    loadProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    copyProject,
    changeProjectStatus,
    searchProjects,
    filterProjectsByStatus
  }
}