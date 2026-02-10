import type { H3Event } from 'h3'

export interface UserInfo {
  id: string
  role: 'admin' | 'project_manager' | 'project_member'
  name: string
}

/**
 * 从请求头读取用户信息
 * 无 header 时返回默认 admin 角色（便于开发调试）
 */
export const getUserFromEvent = (event: H3Event): UserInfo => {
  const userId = getHeader(event, 'x-user-id') || '1'
  const userRole = (getHeader(event, 'x-user-role') || 'admin') as UserInfo['role']
  const userName = getHeader(event, 'x-user-name') || '管理员'

  return {
    id: userId,
    role: userRole,
    name: userName
  }
}
