export type ProjectStatus = '已完成' | '立项中'

export interface Project {
  id: string
  projectName: string
  projectLeader: string
  clientName: string
  projectType: string
  projectBackground: string
  clientDemand: string
  serviceContent: string
  serviceStartDate: string
  serviceEndDate: string
  serviceAmount: number
  isCrossYear: boolean
  status: ProjectStatus
}

export const PROJECT_LIST_DATA: Project[] = [
  {
    id: 'PROJ00001',
    projectName: 'XX科技学习平台建设项目',
    projectLeader: '张三',
    clientName: 'XX科技有限公司',
    projectType: '外部项目',
    projectBackground: '为客户建设面向企业内部的学习平台',
    clientDemand: '学习平台基础服务：AI',
    serviceContent: '在线培训+无忧导',
    serviceStartDate: '2025/10/1',
    serviceEndDate: '2026/10/31',
    serviceAmount: 2800000,
    isCrossYear: true,
    status: '已完成'
  },
  {
    id: 'PROJ00002',
    projectName: '企业人才培养第八期训练营',
    projectLeader: '李四',
    clientName: 'XX集团各公司',
    projectType: '内部培训',
    projectBackground: '面向集团内年轻人，加速人才培养',
    clientDemand: '智能时代，加速',
    serviceContent: '选拔线上测评+面授',
    serviceStartDate: '2025/7/1',
    serviceEndDate: '2026/7/31',
    serviceAmount: 9800000,
    isCrossYear: true,
    status: '已完成'
  },
  {
    id: 'PROJ00003',
    projectName: '能源产业数智化转型工坊',
    projectLeader: '王五',
    clientName: 'XX能源销售有限公司',
    projectType: '工坊课程',
    projectBackground: '该项目为面向区域管理层的能源数智转型岗位胜任认证发展工',
    clientDemand: '面向区域管理层',
    serviceContent: '1.课程方案设计；2.组织访谈调研与方案设计',
    serviceStartDate: '2025/11/28',
    serviceEndDate: '2025/11/28',
    serviceAmount: 45000,
    isCrossYear: false,
    status: '立项中'
  },
  {
    id: 'PROJ00004',
    projectName: '西南区域后备人才培养项目',
    projectLeader: '赵六',
    clientName: 'XX能源发展有限公司',
    projectType: '人才发展',
    projectBackground: '西南区域后备人才培养项目背景。',
    clientDemand: '以探索业务增长',
    serviceContent: '1.访谈调研与方案设计；2.主题课程学习设计与实施',
    serviceStartDate: '2025/8/1',
    serviceEndDate: '2026/5/31',
    serviceAmount: 280000,
    isCrossYear: true,
    status: '已完成'
  },
  {
    id: 'PROJ00005',
    projectName: '江苏区域\"凌云计划\"后备人才培养',
    projectLeader: '赵六',
    clientName: 'XX能源发展有限公司',
    projectType: '人才发展',
    projectBackground: '江苏区域后备人才培养项目背景。',
    clientDemand: '以探索业务增长',
    serviceContent: '1.访谈调研与方案设计；2.测评选拔',
    serviceStartDate: '2025/8/1',
    serviceEndDate: '2026/5/31',
    serviceAmount: 400000,
    isCrossYear: true,
    status: '已完成'
  },
  {
    id: 'PROJ00006',
    projectName: '湖南区域智湘人才培养项目',
    projectLeader: '赵六',
    clientName: 'XX能源发展有限公司',
    projectType: '人才发展',
    projectBackground: '湖南区域人才培养项目背景。',
    clientDemand: '以加速企业智能',
    serviceContent: '1.访谈调研与方案设计；2.主题课程学习设计与实施',
    serviceStartDate: '2025/3/1',
    serviceEndDate: '2026/3/31',
    serviceAmount: 340000,
    isCrossYear: true,
    status: '已完成'
  },
  {
    id: 'PROJ00007',
    projectName: '2025首届企业青年创客大赛',
    projectLeader: '王五',
    clientName: 'XX集团团委',
    projectType: '工坊课程',
    projectBackground: '智能时代，为激发青年伙伴创新思维，',
    clientDemand: '组织实施首届企业',
    serviceContent: '青年创客大赛方案设计',
    serviceStartDate: '2025/3/24',
    serviceEndDate: '2025/5/30',
    serviceAmount: 70000,
    isCrossYear: false,
    status: '立项中'
  },
  {
    id: 'PROJ00008',
    projectName: '浙江省公司一号位智能应用',
    projectLeader: '王五',
    clientName: 'XX能源发展有限公司',
    projectType: '工坊课程',
    projectBackground: '为提升应对能力；挖掘业务典型场',
    clientDemand: '面向城市公司一号',
    serviceContent: '项目方案设计；2.组织',
    serviceStartDate: '2025/8/1',
    serviceEndDate: '2025/11/30',
    serviceAmount: 35000,
    isCrossYear: false,
    status: '立项中'
  },
  {
    id: 'PROJ00009',
    projectName: '广东区域厂站站长能力提升',
    projectLeader: '钱七',
    clientName: 'XX能源广东区域',
    projectType: '工坊课程',
    projectBackground: '近年来，国家、省及市政府部门对',
    clientDemand: '输入标杆最佳实践',
    serviceContent: '厂站站标准化工作坊',
    serviceStartDate: '2025/8/15',
    serviceEndDate: '2025/8/15',
    serviceAmount: 22000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00010',
    projectName: 'XX公司企业文化培训',
    projectLeader: '孙八',
    clientName: 'XX燃气有限公司',
    projectType: '工坊课程',
    projectBackground: '入职2-3年的大学生越来越成为公司的员',
    clientDemand: '以企业文化践行新',
    serviceContent: '企业文化、服务文化授课',
    serviceStartDate: '2025/9/16',
    serviceEndDate: '2025/9/16',
    serviceAmount: 25000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00011',
    projectName: '2025年度全员安全能力提升',
    projectLeader: '周九',
    clientName: 'XX智能安全有限公司',
    projectType: '安全',
    projectBackground: '2025年度全员安全能力提升项目背景。',
    clientDemand: '全面提升伙伴安全',
    serviceContent: '伙伴能力提升及资源沉淀',
    serviceStartDate: '2025/9/1',
    serviceEndDate: '2025/10/30',
    serviceAmount: 120000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00012',
    projectName: '2025年度全员安全能力提升',
    projectLeader: '周九',
    clientName: 'XX安全有限公司',
    projectType: '安全',
    projectBackground: '为深入贯彻落实国家安全生产方针政策',
    clientDemand: '学员可自由选课，',
    serviceContent: '伙伴能力提升及资源沉淀',
    serviceStartDate: '2025/4/1',
    serviceEndDate: '2025/9/30',
    serviceAmount: 220000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00013',
    projectName: '2025年全员数智安全能力提升',
    projectLeader: '周九',
    clientName: 'XX数智安全能力群组',
    projectType: '安全',
    projectBackground: '为深入贯彻落实国家安全生产方针政策，',
    clientDemand: '提升伙伴信息安全的法律与法规',
    serviceContent: '伙伴能力提升及资源沉淀',
    serviceStartDate: '2025/4/1',
    serviceEndDate: '2025/9/30',
    serviceAmount: 100000,
    isCrossYear: false,
    status: '立项中'
  },
  {
    id: 'PROJ00014',
    projectName: 'XX集团2025年安全年会直播',
    projectLeader: '周九',
    clientName: 'XX集团安全智能能力群',
    projectType: '安全',
    projectBackground: 'XX集团针对集团安全工作总结回顾',
    clientDemand: '明确整体需求进行资源协调与实施推进。',
    serviceContent: '年会直播1场，',
    serviceStartDate: '2025/1/30',
    serviceEndDate: '2025/1/17',
    serviceAmount: 130000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00015',
    projectName: 'XX集团2025年新入职训练营',
    projectLeader: '吴十',
    clientName: 'XX集团各产业一号位',
    projectType: '新入职',
    projectBackground: '新入职是企业的新鲜血液及重要的青年',
    clientDemand: '助力2025级新入职',
    serviceContent: '能力发展计划开发及资源',
    serviceStartDate: '2025/7/20',
    serviceEndDate: '2025/8/31',
    serviceAmount: 1450000,
    isCrossYear: false,
    status: '已完成'
  },
  {
    id: 'PROJ00016',
    projectName: '社招新人文化融入项目',
    projectLeader: '孙八',
    clientName: '集团各组织',
    projectType: '文化融入',
    projectBackground: '通过组织新入司伙伴文化融入项目，帮助新入司伙伴快速理解认知企业文化。',
    clientDemand: '了解企业创业历程',
    serviceContent: '社招新伙伴线上与线下学习',
    serviceStartDate: '2025/4/1',
    serviceEndDate: '2025/12/1',
    serviceAmount: 220000,
    isCrossYear: false,
    status: '立项中'
  }
]

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
