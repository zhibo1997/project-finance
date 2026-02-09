import type { UserRole } from '~/types/user'

interface User {
  name: string
  email: string
  role: UserRole
}

interface RoleConfig {
  description: string
}

export const useAuth = () => {
  const currentUser = useState<User>('currentUser', () => ({
    name: '张三',
    email: 'zhangsan@example.com',
    role: 'admin'
  }))

  const currentRoleConfig = useState<RoleConfig>('currentRoleConfig', () => ({
    description: '您可以查看和管理所有项目'
  }))

  const roleConfigs: Record<UserRole, RoleConfig> = {
    admin: {
      description: '您可以查看和管理所有项目'
    },
    project_manager: {
      description: '您可以查看和管理您负责的项目'
    },
    project_member: {
      description: '您可以查看您参与的项目'
    }
  }

  const switchRole = (role: UserRole) => {
    currentUser.value.role = role
    currentRoleConfig.value = roleConfigs[role]
  }

  const initAuth = () => {
    currentRoleConfig.value = roleConfigs[currentUser.value.role]
  }

  const canViewAllProjects = computed(() => currentUser.value.role === 'admin')

  const canCreateProjects = computed(() => currentUser.value.role === 'admin')

  const canBookkeepingIncome = computed(() =>
    currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
  )

  const canBookkeepingExpense = computed(() =>
    currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager' || currentUser.value.role === 'project_member'
  )

  const canEditProjects = computed(() =>
    currentUser.value.role === 'admin' || currentUser.value.role === 'project_manager'
  )

  return {
    currentUser,
    currentRoleConfig,
    switchRole,
    initAuth,
    canViewAllProjects,
    canCreateProjects,
    canBookkeepingIncome,
    canBookkeepingExpense,
    canEditProjects
  }
}
