import { ref, computed } from "vue"
import type { UserRole, UserInfo } from "@/types/user"
import { ROLE_CONFIGS, MOCK_USERS } from "@/types/user"

// 模拟当前登录用户
const currentUser = ref<UserInfo>(MOCK_USERS.admin)

// 切换角色
const switchRole = (role: UserRole) => {
  currentUser.value = MOCK_USERS[role]
  // 可以在这里添加本地存储，以便刷新页面后保持角色状态
  localStorage.setItem("mock-role", role)
  console.log("角色切换成功:", ROLE_CONFIGS[role].label)
}

// 初始化时从本地存储读取角色
const initAuth = () => {
  const savedRole = localStorage.getItem("mock-role") as UserRole
  if (savedRole && ROLE_CONFIGS[savedRole]) {
    currentUser.value = MOCK_USERS[savedRole]
  }
}

// 计算属性
const currentRoleConfig = computed(() => {
  return ROLE_CONFIGS[currentUser.value.role]
})

const isAdmin = computed(() => currentUser.value.role === "admin")
const isProjectManager = computed(() => currentUser.value.role === "project_manager")
const isProjectMember = computed(() => currentUser.value.role === "project_member")
const canViewAllProjects = computed(() => currentRoleConfig.value.canViewAllProjects)
const canCreateProjects = computed(() => currentRoleConfig.value.canCreateProjects)
const canBookkeepingIncome = computed(() => currentRoleConfig.value.canBookkeeping.income)
const canBookkeepingExpense = computed(() => currentRoleConfig.value.canBookkeeping.expense)
const canEditProjects = computed(() => currentRoleConfig.value.canEditProjects)

// 项目管理相关权限
const canViewProject = (projectLeader: string, projectMembers: string[]): boolean => {
  if (currentUser.value.role === "admin") {
    return true
  }
  if (currentUser.value.role === "project_manager") {
    return projectLeader === currentUser.value.name
  }
  return projectMembers.includes(currentUser.value.name)
}

const canEditProject = (status: string, projectLeader: string): boolean => {
  if (currentUser.value.role === "admin") {
    return true
  }
  if (currentUser.value.role === "project_manager") {
    return projectLeader === currentUser.value.name && (status === "draft" || status === "submitted" || status === "completed")
  }
  return false
}

const canDeleteProject = (projectLeader: string): boolean => {
  if (currentUser.value.role === "admin") {
    return true
  }
  if (currentUser.value.role === "project_manager") {
    return projectLeader === currentUser.value.name
  }
  return false
}

const canCopyProject = (status: string): boolean => {
  return status === "completed" || status === "closed"
}

const canCloseProject = (projectLeader: string): boolean => {
  if (currentUser.value.role === "admin") {
    return true
  }
  if (currentUser.value.role === "project_manager") {
    return projectLeader === currentUser.value.name
  }
  return false
}

// 记账管理相关权限
const canViewCreator = computed(() => {
  return currentUser.value.role === "admin" || currentUser.value.role === "project_manager"
})

const canEditAccountingRecord = (record: any): boolean => {
  if (currentUser.value.role === "admin" || currentUser.value.role === "project_manager") {
    return true
  }
  return record.createdBy === currentUser.value.name
}

const canDeleteAccountingRecord = (): boolean => {
  return currentUser.value.role === "admin" || currentUser.value.role === "project_manager"
}

export const useAuth = () => {
  return {
    currentUser,
    currentRoleConfig,
    isAdmin,
    isProjectManager,
    isProjectMember,
    canViewAllProjects,
    canCreateProjects,
    canBookkeepingIncome,
    canBookkeepingExpense,
    canEditProjects,
    canViewProject,
    canEditProject,
    canDeleteProject,
    canCopyProject,
    canCloseProject,
    canViewCreator,
    canEditAccountingRecord,
    canDeleteAccountingRecord,
    switchRole,
    initAuth
  }
}
