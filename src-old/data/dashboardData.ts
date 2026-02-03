import type { Project } from './projectListData'

export interface DashboardData {
  // 项目概况
  projectOverview: {
    totalProjects: number
    completedProjects: number
    inProgressProjects: number
    plannedProjects: number
  }

  // 财务数据
  financialData: {
    annualTargetIncome: number
    actualIncome: number
    incomeCompletionRate: number
    annualBudget: number
    totalExpenses: number
    expenseRate: number
    netProfit: number
    averageProfitRate: number
  }

  // 月度收入和支出趋势
  monthlyTrend: {
    months: string[]
    monthlyIncome: number[]
    monthlyExpenses: number[]
  }

  // 项目收入排行
  incomeRanking: {
    projectName: string
    income: number
    projectLeader: string
  }[]

  // 项目支出排行
  expenseRanking: {
    projectName: string
    expenses: number
    projectLeader: string
  }[]

  // 项目状态分布
  statusDistribution: {
    status: string
    count: number
    percentage: number
  }[]

  // 项目类型分布
  typeDistribution: {
    type: string
    count: number
    percentage: number
  }[]

  // 项目经理绩效
  managerPerformance: {
    name: string
    projectCount: number
    totalIncome: number
    totalExpenses: number
    profit: number
  }[]
}

export const generateDashboardData = (projects: Project[]): DashboardData => {
  // 计算项目概况
  const totalProjects = projects.length
  const completedProjects = projects.filter(p => p.status === '已完成').length
  const inProgressProjects = projects.filter(p => p.status === '立项中').length
  const plannedProjects = totalProjects // 简化处理，实际项目可能有计划状态

  // 模拟财务数据（基于项目服务费）
  const annualTargetIncome = 5000000
  const actualIncome = projects.reduce((sum, p) => {
    // 已完成项目按100%计算收入，立项中项目按30%计算
    const completionRate = p.status === '已完成' ? 1 : 0.3
    return sum + p.serviceAmount * completionRate
  }, 0)
  const incomeCompletionRate = (actualIncome / annualTargetIncome) * 100

  const annualBudget = 4000000
  // 模拟支出，基于项目服务费的60%
  const totalExpenses = projects.reduce((sum, p) => {
    const completionRate = p.status === '已完成' ? 1 : 0.3
    return sum + p.serviceAmount * completionRate * 0.6
  }, 0)
  const expenseRate = (totalExpenses / annualBudget) * 100
  const netProfit = actualIncome - totalExpenses
  const averageProfitRate = netProfit > 0 ? (netProfit / actualIncome) * 100 : 0

  // 模拟月度趋势数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const monthlyIncome = months.map(() => Math.floor(Math.random() * 300000 + 100000))
  const monthlyExpenses = months.map(() => Math.floor(Math.random() * 200000 + 50000))

  // 项目收入排行（按服务费排序）
  const incomeRanking = projects
    .map(p => ({
      projectName: p.projectName,
      income: p.serviceAmount,
      projectLeader: p.projectLeader
    }))
    .sort((a, b) => b.income - a.income)
    .slice(0, 10)

  // 项目支出排行（按服务费的60%计算）
  const expenseRanking = projects
    .map(p => ({
      projectName: p.projectName,
      expenses: Math.floor(p.serviceAmount * 0.6),
      projectLeader: p.projectLeader
    }))
    .sort((a, b) => b.expenses - a.expenses)
    .slice(0, 10)

  // 项目状态分布
  const statusDistribution = [
    { status: '已完成', count: completedProjects, percentage: (completedProjects / totalProjects) * 100 },
    { status: '立项中', count: inProgressProjects, percentage: (inProgressProjects / totalProjects) * 100 }
  ]

  // 项目类型分布
  const typeCounts: Record<string, number> = {}
  projects.forEach(p => {
    typeCounts[p.projectType] = (typeCounts[p.projectType] || 0) + 1
  })
  const typeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: (count / totalProjects) * 100
  }))

  // 项目经理绩效
  const managerPerformance: DashboardData['managerPerformance'] = []
  const projectLeaders = Array.from(new Set(projects.map(p => p.projectLeader)))
  projectLeaders.forEach(leader => {
    const leaderProjects = projects.filter(p => p.projectLeader === leader)
    const leaderIncome = leaderProjects.reduce((sum, p) => sum + p.serviceAmount, 0)
    const leaderExpenses = Math.floor(leaderIncome * 0.6)
    managerPerformance.push({
      name: leader,
      projectCount: leaderProjects.length,
      totalIncome: leaderIncome,
      totalExpenses: leaderExpenses,
      profit: leaderIncome - leaderExpenses
    })
  })

  return {
    projectOverview: {
      totalProjects,
      completedProjects,
      inProgressProjects,
      plannedProjects
    },
    financialData: {
      annualTargetIncome,
      actualIncome,
      incomeCompletionRate,
      annualBudget,
      totalExpenses,
      expenseRate,
      netProfit,
      averageProfitRate
    },
    monthlyTrend: {
      months,
      monthlyIncome,
      monthlyExpenses
    },
    incomeRanking,
    expenseRanking,
    statusDistribution,
    typeDistribution,
    managerPerformance
  }
}
