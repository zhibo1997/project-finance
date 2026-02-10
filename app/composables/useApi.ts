import type { UserInfo } from '~/server/utils/auth'

export const useApi = () => {
  const { currentUser } = useAuth()

  const apiFetch = async (url: string, opts: any = {}) => {
    const headers = {
      'X-User-Id': currentUser.value.id,
      'X-User-Role': currentUser.value.role,
      'X-User-Name': currentUser.value.name,
      ...opts?.headers
    }

    try {
      const response = await $fetch(url, {
        ...opts,
        headers
      })
      return response
    } catch (error: any) {
      console.error('API请求失败:', error)
      // 统一错误处理
      if (error?.data?.message) {
        useMessage().error(error.data.message)
      } else {
        useMessage().error('请求失败，请稍后重试')
      }
      throw error
    }
  }

  return {
    apiFetch
  }
}
