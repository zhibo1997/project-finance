export const PROJECT_DATA = {
  basicInfo: {
    projectName: "新奥智学-新引擎交付项目",
    projectId: "XAZX-2025-12",
    clientName: "新奥集团安徽运营中心",
    clientContact: "李经理",
    projectLead: "王建国",
    teamMembers: ["张三", "李四", "王五", "赵六"],
    status: "进行中",
    updateDate: "2025-12-08"
  },
  summary: {
    income: {
      amount: 850000,
      note: "项目收入为独立具体项目收入，如“新引擎”"
    },
    budget: {
      amount: 120000,
      note: "除人工成本外的所有费用支出"
    },
    annualTargetIncome: 1500000, // 年度目标收入
    recordedIncome: 680000 // 入账收入
  },
  categories: [
    {
      id: "cat_1",
      name: "差旅费",
      fullName: "差旅费支出类",
      budget: 30000,
      expenses: [
        { amount: 1200, desc: "张三出差舟山交付交通费", date: "2025-12-01" },
        { amount: 400, desc: "舟山希尔顿住宿费", date: "2025-12-02" },
        { amount: 400, desc: "差旅补助", date: "2025-12-03" }
      ]
    },
    {
      id: "cat_2",
      name: "办公费",
      fullName: "办公支出类",
      budget: 10000,
      expenses: [
        { amount: 2100, desc: "采购打印纸、墨盒及交付物料", date: "2025-12-05" }
      ]
    },
    {
      id: "cat_3",
      name: "广告宣传",
      fullName: "广告宣传支出类",
      budget: 20000,
      expenses: [
        { amount: 5000, desc: "项目宣传册印制", date: "2025-12-06" }
      ]
    },
    {
      id: "cat_4",
      name: "会议费",
      fullName: "会议支出类",
      budget: 15000,
      expenses: [
        { amount: 8000, desc: "启动会场地租赁及茶歇", date: "2025-12-07" }
      ]
    },
    {
      id: "cat_5",
      name: "招待费",
      fullName: "招待支出类",
      budget: 15000,
      expenses: [
        { amount: 3500, desc: "客户高层午餐会", date: "2025-12-08" },
        { amount: 8900, desc: "阶段性汇报晚宴", date: "2025-12-09" }
      ]
    },
    {
      id: "cat_6",
      name: "运输费",
      fullName: "运输支出类",
      budget: 5000,
      expenses: []
    },
    {
      id: "cat_7",
      name: "公司经费",
      fullName: "公司经费支出类",
      budget: 5000,
      expenses: []
    },
    {
      id: "cat_8",
      name: "其他",
      fullName: "其他支出类",
      budget: 20000,
      expenses: [
        { amount: 2000, desc: "外部专家咨询费", date: "2025-12-10" }
      ]
    }
  ]
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', { 
    style: 'currency', 
    currency: 'CNY', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateCategoryTotal = (expenses: any[]) => {
  return expenses.reduce((acc, curr) => acc + curr.amount, 0);
};
