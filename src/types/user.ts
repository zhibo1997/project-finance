export type UserRole = 'admin' | 'project_manager' | 'project_member'

export interface UserInfo {
  id: string
  name: string
  role: UserRole
  email: string
}

export interface RoleConfig {
  role: UserRole
  label: string
  description: string
  canViewAllProjects: boolean
  canCreateProjects: boolean
  canBookkeeping: {
    income: boolean
    expense: boolean
  }
  canEditProjects: boolean
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    label: '管理员',
    description: '可以查看所有项目，拥有全部权限',
    canViewAllProjects: true,
    canCreateProjects: true,
    canBookkeeping: {
      income: true,
      expense: true
    },
    canEditProjects: true
  },
  project_manager: {
    role: 'project_manager',
    label: '项目经理',
    description: '可以查看和管理自己负责的项目，支持立项和记账（收入/支出）',
    canViewAllProjects: false,
    canCreateProjects: true,
    canBookkeeping: {
      income: true,
      expense: true
    },
    canEditProjects: true
  },
  project_member: {
    role: 'project_member',
    label: '项目成员',
    description: '可以查看自己参与的项目，只能进行支出记账',
    canViewAllProjects: false,
    canCreateProjects: false,
    canBookkeeping: {
      income: false,
      expense: true
    },
    canEditProjects: false
  }
}

export const MOCK_USERS: Record<UserRole, UserInfo> = {
  admin: {
    id: '1',
    name: '张管理员',
    role: 'admin',
    email: 'admin@company.com'
  },
  project_manager: {
    id: '2',
    name: '赵六',
    role: 'project_manager',
    email: 'manager@company.com'
  },
  project_member: {
    id: '3',
    name: '王成员',
    role: 'project_member',
    email: 'member@company.com'
  }
}
