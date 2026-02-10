import type { UserInfo } from '~/server/utils/auth'

export const useAuth = () => {
  const currentUser = ref<UserInfo>({
    id: '1',
    role: 'admin',
    name: '管理员'
  })

  // 从 localStorage 加载用户信息
  const loadUserFromStorage = () => {
    if (process.client) {
      const savedUser = localStorage.getItem('currentUser')
      if (savedUser) {
        currentUser.value = JSON.parse(savedUser)
      }
    }
  }

  // 保存用户信息到 localStorage
  const saveUserToStorage = (user: UserInfo) => {
    if (process.client) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }
  }

  // 切换角色
  const switchRole = (role: UserInfo['role'], name: string) => {
    const newUser: UserInfo = {
      id: role === 'admin' ? '1' : role === 'project_manager' ? '2' : '3',
      role,
      name
    }
    currentUser.value = newUser
    saveUserToStorage(newUser)
  }

  // 初始化
  if (process.client) {
    loadUserFromStorage()
  }

  return {
    currentUser,
    switchRole
  }
}
