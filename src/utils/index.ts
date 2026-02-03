// 格式化金额
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// 格式化日期
export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
}

// 生成随机ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 计算项目总金额
export const calculateTotalAmount = (formData: any): number => {
  // 计算服务收入总和
  const serviceIncome = formData.serviceIncome?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0

  // 计算外采成本总和
  const outsourcingCost = formData.outsourcingCost?.reduce((sum: number, item: any) => sum + (item.unitPrice * item.quantity), 0) || 0

  // 计算人工成本总和
  const laborCost = formData.laborCost?.reduce((sum: number, item: any) => sum + (item.dailyCost * item.days), 0) || 0

  // 计算其他费用总和
  const otherExpenses = formData.otherExpenses?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0

  // 项目总金额 = 服务收入 - (外采成本 + 人工成本 + 其他费用)
  return serviceIncome - (outsourcingCost + laborCost + otherExpenses)
}
