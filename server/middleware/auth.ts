export default defineEventHandler((event) => {
  // 简单的身份认证中间件
  // 目前不接入登录，所有请求都通过
  event.context.user = {
    id: 'mock-user-id',
    name: '测试用户',
    role: 'admin' // 可以是 admin, manager, member
  }

  return
})
