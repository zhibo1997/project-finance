/**
 * 格式化金额为货币字符串
 */
export const formatCurrency = (amount: number | string | null | undefined): string => {
  if (amount == null) return '-'

  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num)) return '-'

  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2
  }).format(num)
}

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string | null | undefined, format = 'YYYY-MM-DD'): string => {
  if (date == null) return '-'

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化百分比
 */
export const formatPercentage = (value: number | string | null | undefined, decimals = 2): string => {
  if (value == null) return '-'

  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) return '-'

  return `${num.toFixed(decimals)}%`
}
