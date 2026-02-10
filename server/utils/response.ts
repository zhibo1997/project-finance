/**
 * 成功响应
 */
export const successResponse = (data?: any, message = 'ok') => {
  return {
    code: 0,
    message,
    data
  }
}

/**
 * 错误响应
 */
export const errorResponse = (message: string, code = -1) => {
  return {
    code,
    message
  }
}
