import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  Users, 
  User,
  Building2,
  FileText,
  AlertCircle,
  LayoutGrid,
  List,
  Calendar,
  CreditCard,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart, 
  Pie, 
  Legend
} from 'recharts';

// --- Mock Data ---
const PROJECT_DATA = {
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

// --- Utilities ---
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('zh-CN', { 
    style: 'currency', 
    currency: 'CNY', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const calculateCategoryTotal = (expenses) => {
  return expenses.reduce((acc, curr) => acc + curr.amount, 0);
};

// --- Components ---

// 1. New Header Component
const Header = ({ info }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Top Banner Stripe */}
      <div className="h-2 bg-gradient-to-r from-gray-800 to-gray-600" />
      
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          
          {/* Left: Project Identity */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
               <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 tracking-wide">
                 {info.status}
               </span>
               <span className="text-gray-400 text-xs font-mono tracking-wider">
                 {info.projectId}
               </span>
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                {info.projectName}
              </h1>
              <div className="mt-2 flex items-center text-gray-500 text-sm gap-4">
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  {info.clientName}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  更新于 {info.updateDate}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Team & Key Contacts (Grid Layout) */}
          <div className="flex flex-col gap-4 min-w-[280px]">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50 flex items-center justify-between group hover:border-gray-200 transition-colors">
              <div>
                <div className="text-xs text-gray-400 mb-0.5">项目负责人</div>
                <div className="text-sm font-semibold text-gray-900">{info.projectLead}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 ring-2 ring-white">
                {info.projectLead[0]}
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
               <div className="text-xs text-gray-400">项目成员</div>
               <div className="flex -space-x-2">
                 {info.teamMembers.map((member, idx) => (
                   <div key={idx} className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500 shadow-sm ring-1 ring-white" title={member}>
                     {member[0]}
                   </div>
                 ))}
                 <div className="w-7 h-7 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[10px] text-gray-400">
                   +
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// 2. Metric Cards Component
const MetricCard = ({ label, value, subValue, icon: Icon, trend, type = "neutral" }) => {
  const styles = {
    neutral: "bg-white border-gray-200 text-gray-900",
    dark: "bg-gray-900 border-gray-800 text-white",
    highlight: "bg-white border-gray-200 text-gray-900", // We will style internal elements
  };

  return (
    <div className={`relative p-5 rounded-xl border ${styles[type]} shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${type === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'}`}>
          <Icon size={18} />
        </div>
        {trend && (
           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
             {trend > 0 ? '+' : ''}{trend}%
           </span>
        )}
      </div>
      
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${type === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </p>
        <h3 className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </h3>
        {subValue && (
          <p className={`text-xs mt-2 leading-relaxed ${type === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

// 3. Chart View Component
const ChartsView = ({ data, totalBudget, totalActual }) => {
  // Prepare data for Bar Chart
  const barData = data.map(cat => ({
    name: cat.name,
    budget: cat.budget,
    actual: calculateCategoryTotal(cat.expenses),
  }));

  // Prepare data for Pie Chart
  const pieData = data
    .map(cat => ({
      name: cat.name,
      value: calculateCategoryTotal(cat.expenses)
    }))
    .filter(item => item.value > 0);

  const COLORS = ['#18181b', '#3f3f46', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#f4f4f5'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bar Chart: Budget vs Actual */}
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChartIconWrapper /> 预算执行对比 (Budget vs Actual)
        </h3>
        <div className="h-[300px] w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a'}} />
              <Tooltip 
                cursor={{fill: '#f4f4f5'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
              <Bar name="预算额度" dataKey="budget" fill="#e4e4e7" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar name="实际支出" dataKey="actual" fill="#18181b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart: Expense Distribution */}
      <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <PieChartIconWrapper /> 支出构成分析
        </h3>
        <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                 formatter={(value) => formatCurrency(value)}
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-24">
             <span className="text-xs text-gray-400">总支出</span>
             <span className="text-lg font-bold text-gray-900">{formatCurrency(totalActual)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. List View Component (The original one, slightly refined)
const ListView = ({ data }) => (
  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="col-span-5 sm:col-span-4">预算科目</div>
        <div className="col-span-3 sm:col-span-3 text-right">预算额度</div>
        <div className="col-span-4 sm:col-span-3 text-right">实际支出</div>
        <div className="hidden sm:block sm:col-span-2 text-right">进度</div>
      </div>
      <div className="divide-y divide-gray-50">
        {data.map((cat) => (
          <BudgetRow key={cat.id} item={cat} />
        ))}
      </div>
  </div>
);

// Helper Components for Icons
const BarChartIconWrapper = () => <LayoutGrid size={16} className="text-gray-400" />;
const PieChartIconWrapper = () => <PieChart size={16} className="text-gray-400" />;

const BudgetRow = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const actualUsed = calculateCategoryTotal(item.expenses);
  const progress = Math.min((actualUsed / item.budget) * 100, 100);
  const isOverBudget = actualUsed > item.budget;

  return (
    <div className="group transition-colors hover:bg-gray-50/30">
      <div 
        className="grid grid-cols-12 gap-4 py-4 px-6 items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
          <button className={`p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 ${isExpanded ? 'rotate-180 bg-gray-100' : ''}`}>
             <ChevronDown size={14} />
          </button>
          <div>
            <div className="text-sm font-medium text-gray-900">{item.name}</div>
            <div className="text-[10px] text-gray-400 hidden sm:block">{item.fullName}</div>
          </div>
        </div>
        
        <div className="col-span-3 sm:col-span-3 text-right text-sm text-gray-500 font-mono">
          {formatCurrency(item.budget)}
        </div>
        
        <div className="col-span-4 sm:col-span-3 text-right">
          <div className={`text-sm font-mono font-medium ${isOverBudget ? 'text-orange-600' : 'text-gray-900'}`}>
            {formatCurrency(actualUsed)}
          </div>
        </div>

        <div className="hidden sm:flex col-span-2 items-center justify-end gap-2">
           <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
             <div 
                className={`h-full rounded-full ${isOverBudget ? 'bg-orange-500' : 'bg-gray-800'}`} 
                style={{ width: `${progress}%` }}
             />
           </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
          <div className="max-w-3xl ml-auto sm:mr-12">
            {item.expenses.length > 0 ? (
              <div className="space-y-2">
                {item.expenses.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 rounded hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
                    <span className="text-gray-600">{exp.desc}</span>
                    <span className="font-mono text-gray-900">{formatCurrency(exp.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-xs italic py-2">本月暂无报销记录</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { basicInfo, summary, categories } = PROJECT_DATA;
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'chart'

  // Calculations
  const totalActual = categories.reduce((sum, cat) => sum + calculateCategoryTotal(cat.expenses), 0);
  const totalBudget = summary.budget.amount;
  const grossProfit = summary.income.amount - totalActual;
  const profitRate = ((grossProfit / summary.income.amount) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-gray-200 selection:text-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        
        {/* 1. Header Section */}
        <Header info={basicInfo} />

        {/* 2. Summary Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            label="项目总收入" 
            value={formatCurrency(summary.income.amount)} 
            icon={Wallet}
            subValue="已确认合同金额"
            type="neutral"
          />
          <MetricCard 
            label="业务成本预算" 
            value={formatCurrency(totalBudget)} 
            icon={FileText}
            subValue="不含人工成本"
            type="neutral"
          />
          <MetricCard 
            label="实际支出" 
            value={formatCurrency(totalActual)} 
            icon={CreditCard}
            subValue={`${((totalActual/totalBudget)*100).toFixed(1)}% 预算消耗`}
            type="dark" // Highlight this one
          />
          <MetricCard 
            label="当前毛利" 
            value={formatCurrency(grossProfit)} 
            icon={TrendingUp}
            subValue={`毛利率 ${profitRate}%`}
            trend={profitRate}
            type="neutral"
          />
        </div>

        {/* 3. Details / Charts Section */}
        <div className="space-y-4">
          {/* Section Header & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 tracking-tight flex items-center gap-2">
              <Briefcase size={18} className="text-gray-500"/>
              资金分析与明细
            </h2>
            
            {/* Toggle Control */}
            <div className="bg-gray-200/50 p-1 rounded-lg flex items-center self-start sm:self-auto">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={14} />
                明细列表
              </button>
              <button 
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'chart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutGrid size={14} />
                可视化报表
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
             {viewMode === 'list' ? (
               <ListView data={categories} />
             ) : (
               <ChartsView data={categories} totalBudget={totalBudget} totalActual={totalActual} />
             )}
          </div>
          
          {/* Note Footer */}
          <div className="flex items-start gap-2 text-xs text-gray-400 px-2 mt-4 max-w-3xl">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <p>
              数据说明：项目收入为独立具体项目收入。业务成本预算包含除人工成本外的所有费用支出。如因项目调整导致预算变更，需重新补充立项审批单。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}