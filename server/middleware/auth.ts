import type { H3Event } from 'h3'
import type { UserRole } from '~/types/auth'

export interface User {
  id: string
  name: string
  role: UserRole
}

// 模拟用户数据
const mockUsers: Record<string, User> = {
  'admin': {
    id: '1',
    name: '管理员',
    role: 'admin'
  },
  'manager': {
    id: '2',
    name: '项目经理',
    role: 'manager'
  },
  'member': {
    id: '3',
    name: '项目成员',
    role: 'member'
  }
}

// 验证用户身份
export function authenticate(event: H3Event): User | null {
  // 从请求头中获取 token 或其他身份信息
  const authorization = getRequestHeader(event, 'Authorization')

  if (authorization) {
    const token = authorization.replace('Bearer ', '')
    const user = mockUsers[token]

    if (user) {
      // 将用户信息存储在请求上下文中
      event.context.user = user
      return user
    }
  }

  // 默认返回项目成员身份
  const defaultUser = {
    id: '3',
    name: '项目成员',
    role: 'member'
  }
  event.context.user = defaultUser
  return defaultUser
}

// 检查用户权限
export function checkPermission(event: H3Event, requiredRoles: UserRole[]): boolean {
  const user = event.context.user

  if (!user) {
    return false
  }

  return requiredRoles.includes(user.role)
}

// 中间件函数
export default defineEventHandler((event) => {
  // 验证用户身份
  authenticate(event)

  // 可以在此处添加更多权限检查逻辑
  return event
})
