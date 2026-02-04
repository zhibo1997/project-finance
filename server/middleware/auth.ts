import { MOCK_USERS, ROLE_CONFIGS } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  // 模拟用户认证 - 在实际项目中应该使用真实的认证机制
  const mockRole = getCookie(event, 'mock-role') || 'admin'
  const user = MOCK_USERS[mockRole as keyof typeof MOCK_USERS] || MOCK_USERS.admin

  // 将用户信息添加到事件上下文中
  event.context.user = user
  event.context.roleConfig = ROLE_CONFIGS[user.role]

  console.log(`User ${user.name} (${user.role}) accessed: ${event.node.req.url}`)
})
