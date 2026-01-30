export const PROJECT_DATA = {
  basicInfo: {
    projectName: "新奥智学-新引擎交付项目",
    projectId: "XAZX-2025-12",
    clientName: "新奥集团",
    region: "安徽区域",
    clientContact: "刘先生",
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
    }
  },
  categories: [
    { 
      id: "cat_1", 
      name: "差旅费", 
      fullName: "差旅费支出类",
      budget: 30000, 
      expenses: [
        { amount: 1200, desc: "张三出差舟山交付交通费" },
        { amount: 400, desc: "舟山希尔顿住宿费" },
        { amount: 400, desc: "差旅补助" }
      ]
    },
    { 
      id: "cat_2", 
      name: "办公费", 
      fullName: "办公支出类",
      budget: 10000, 
      expenses: [
        { amount: 2100, desc: "采购打印纸、墨盒及交付物料" }
      ]
    },
    { 
      id: "cat_3", 
      name: "广告宣传", 
      fullName: "广告宣传支出类",
      budget: 20000, 
      expenses: [
        { amount: 5000, desc: "项目宣传册印制" }
      ]
    },
    { 
      id: "cat_4", 
      name: "会议费", 
      fullName: "会议支出类",
      budget: 15000, 
      expenses: [
        { amount: 8000, desc: "启动会场地租赁及茶歇" }
      ]
    },
    { 
      id: "cat_5", 
      name: "招待费", 
      fullName: "招待支出类",
      budget: 15000, 
      expenses: [
        { amount: 3500, desc: "客户高层午餐会" },
        { amount: 8900, desc: "阶段性汇报晚宴" }
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
        { amount: 2000, desc: "外部专家咨询费" }
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
