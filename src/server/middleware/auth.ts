// 鉴权中间件
// 由于当前项目是前端项目，我们使用模拟鉴权
// 实际项目中应使用 JWT 或其他鉴权方式

export interface User {
  id: string
  name: string
  role: 'admin' | 'manager' | 'member'
}

// 模拟用户数据
const mockUsers: User[] = [
  { id: 'user_1', name: '管理员', role: 'admin' },
  { id: 'user_2', name: '项目经理', role: 'manager' },
  { id: 'user_3', name: '项目成员', role: 'member' }
]

// 鉴权函数
export function authenticate(token: string): User | null {
  // 简单的令牌验证
  if (!token) return null

  // 模拟从令牌中解析用户信息
  const userId = token.replace('Bearer ', '')
  return mockUsers.find(user => user.id === userId) || null
}

// 权限检查
export function checkPermission(user: User, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role)
}

// 获取用户在项目中的角色
export function getUserRoleInProject(projectId: string, userId: string): 'manager' | 'member' {
  // 简单的角色判断：user_2 是经理，其他是成员
  return userId === 'user_2' ? 'manager' : 'member'
}
