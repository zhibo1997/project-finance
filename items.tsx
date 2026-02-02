import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Save, Search, ChevronDown, Calendar, Calculator, X } from 'lucide-react';

// --- 模拟海量员工数据库 (100+ 条数据模拟) ---
const generateLargeEmployeeDB = () => {
  const roles = ['项目总监', '高级顾问', '讲师', '助教', '运营专员', '技术支持', '设计师'];
  const baseNames = ['张', '王', '李', '赵', '陈', '刘', '杨', '黄', '吴', '周'];
  const db = [];
  
  // 生成一些固定方便测试的人员
  db.push({ id: 'E001', name: '任志祥', role: '项目总监', standardCost: 5000 });
  
  for (let i = 0; i < 100; i++) {
    const name = baseNames[Math.floor(Math.random() * baseNames.length)] + (Math.floor(Math.random() * 1000));
    const role = roles[Math.floor(Math.random() * roles.length)];
    db.push({
      id: `EMP${1000 + i}`,
      name: name,
      role: role,
      standardCost: role === '项目总监' ? 5000 : role === '高级顾问' ? 3500 : 1500
    });
  }
  return db;
};

const EMPLOYEE_DB = generateLargeEmployeeDB();

// 费用类型选项
const EXPENSE_TYPES = ['差旅费', '招待费', '物料制作费', '场地租赁费', '专家咨询费', '其他杂费'];

// --- 类型定义 ---
interface ProjectBasicInfo {
  projectName: string;
  projectLeader: string;
  clientName: string;
  contactPerson: string;
  startDate: string;
  endDate: string;
  background: string;
}

interface ServiceItem {
  id: string;
  content: string;
  amount: number;
}

interface OutsourcingItem {
  id: string;
  content: string;
  price: number;
  quantity: number;
  unit: string;
}

interface LaborItem {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  dailyCost: number;
  days: number;
}

interface OtherExpenseItem {
  id: string;
  type: string;
  description: string;
  amount: number;
}

// --- 组件：可搜索的下拉选择器 (解决海量人员选择问题) ---
const SearchableEmployeeSelect = ({ value, onChange }: { value: string, onChange: (emp: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 这里的 value 是 employeeId，我们需要反查名字显示
  const selectedEmp = EMPLOYEE_DB.find(e => e.id === value);
  const displayValue = selectedEmp ? selectedEmp.name : '';

  // 过滤逻辑
  const filteredOptions = useMemo(() => {
    if (!search) return EMPLOYEE_DB.slice(0, 20); // 默认显示前20个
    return EMPLOYEE_DB.filter(e => e.name.includes(search) || e.role.includes(search)).slice(0, 20);
  }, [search]);

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        className="flex items-center justify-between w-full border border-gray-300 rounded px-3 py-2 bg-white cursor-text hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <span className={`text-sm ${!displayValue ? 'text-gray-400' : 'text-gray-800'}`}>
          {displayValue || '搜索员工姓名...'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-gray-50 p-2 border-b border-gray-100">
            <div className="flex items-center bg-white border border-gray-200 rounded px-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                autoFocus
                className="w-full p-2 text-sm outline-none"
                placeholder="输入姓名或角色搜索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">无匹配人员</div>
          ) : (
            filteredOptions.map(emp => (
              <div 
                key={emp.id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                onClick={() => {
                  onChange(emp);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                <div className="font-medium text-gray-800">{emp.name}</div>
                <div className="text-xs text-gray-500">{emp.role} | 标价: ¥{emp.standardCost}/天</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// --- 主应用组件 ---
export default function ProjectApplicationOptimized() {
  // 1. 基础信息
  const [basicInfo, setBasicInfo] = useState<ProjectBasicInfo>({
    projectName: '社招新人文化融入项目',
    projectLeader: '任志祥',
    clientName: '集团各组织',
    contactPerson: '各组织人发',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    background: '通过组织新入司伙伴文化融入项目，帮助新入司伙伴快速理解认知新奥文化。'
  });

  // 2. 收入与税率
  const [taxRate, setTaxRate] = useState<string>('6'); // 使用字符串处理输入，避免0的问题
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    { id: 'S1', content: '线下学习：参观体验、发展史介绍、座谈会', amount: 254400 }
  ]);

  // 3. 外采
  const [outsourcingItems, setOutsourcingItems] = useState<OutsourcingItem[]>([
    { id: 'O1', content: '场地费', price: 1500, quantity: 16, unit: '天' },
    { id: 'O2', content: '参观车辆费用', price: 2000, quantity: 8, unit: '期' }
  ]);

  // 4. 人工
  const [laborItems, setLaborItems] = useState<LaborItem[]>([
    { id: 'L1', employeeId: 'E001', name: '任志祥', role: '项目总监', dailyCost: 5000, days: 5 }
  ]);

  // 5. 其他费用
  const [otherItems, setOtherItems] = useState<OtherExpenseItem[]>([
    { id: 'Misc1', type: '差旅费', description: '项目组异地差旅', amount: 5000 }
  ]);

  // --- 辅助函数 ---
  const generateId = () => Math.random().toString(36).substr(2, 9);
  const formatCurrency = (num: number) => num.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 2 });
  
  // --- 计算逻辑 ---
  const totalRevenueInclusive = useMemo(() => serviceItems.reduce((sum, item) => sum + item.amount, 0), [serviceItems]);
  
  // 修正后的税收计算：按照用户要求，如果税率100%，收入为0。即 Revenue = Total * (1 - Rate)
  const netRevenue = useMemo(() => {
    const rate = parseFloat(taxRate) || 0;
    return totalRevenueInclusive * (1 - rate / 100);
  }, [totalRevenueInclusive, taxRate]);

  const totalOutsourcingCost = useMemo(() => outsourcingItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [outsourcingItems]);
  const totalLaborCost = useMemo(() => laborItems.reduce((sum, item) => sum + (item.dailyCost * item.days), 0), [laborItems]);
  const totalOtherCost = useMemo(() => otherItems.reduce((sum, item) => sum + item.amount, 0), [otherItems]);

  const totalCost = totalOutsourcingCost + totalLaborCost + totalOtherCost;
  const grossProfit = netRevenue - totalCost;
  // 利润率计算：毛利 / 净收入 (如果净收入为0，则为0)
  const profitMargin = netRevenue !== 0 ? (grossProfit / netRevenue) * 100 : 0;

  // --- 样式类 ---
  const sectionClass = "bg-white mb-4 border-t border-b md:border md:rounded-lg border-gray-200 overflow-hidden";
  const headerClass = "bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center font-bold text-gray-800 text-sm md:text-base";
  const labelClass = "block text-xs font-semibold text-gray-500 mb-1";
  const inputClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const textAreaClass = "w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors min-h-[60px] resize-y";
  const deleteBtnClass = "p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors";
  const addBtnClass = "flex items-center justify-center gap-1 text-sm text-blue-600 font-medium py-3 hover:bg-blue-50 w-full border-t border-gray-100 transition-colors cursor-pointer";

  return (
    <div className="min-h-screen bg-gray-100 pb-24 font-sans text-gray-800">
      
      {/* 顶部标题栏 - 企业级风格 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">立项申请表</h1>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
            草稿
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto md:py-6">
        
        {/* 1. 项目基础信息 - 紧凑网格布局 */}
        <section className={sectionClass}>
          <div className={headerClass}>1. 项目基础信息</div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 第一行：项目名称 + 负责人 */}
            <div>
              <label className={labelClass}>项目名称</label>
              <input 
                type="text" 
                value={basicInfo.projectName}
                onChange={e => setBasicInfo({...basicInfo, projectName: e.target.value})}
                className={inputClass}
                placeholder="请输入项目全称"
              />
            </div>
            <div>
              <label className={labelClass}>项目负责人</label>
              <input 
                type="text" 
                value={basicInfo.projectLeader}
                onChange={e => setBasicInfo({...basicInfo, projectLeader: e.target.value})}
                className={inputClass}
              />
            </div>

            {/* 第二行：客户 + 联系人 */}
            <div>
              <label className={labelClass}>客户名称</label>
              <input 
                type="text" 
                value={basicInfo.clientName}
                onChange={e => setBasicInfo({...basicInfo, clientName: e.target.value})}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>客户联系人</label>
              <input 
                type="text" 
                value={basicInfo.contactPerson}
                onChange={e => setBasicInfo({...basicInfo, contactPerson: e.target.value})}
                className={inputClass}
              />
            </div>

            {/* 第三行：服务周期 (双日期选择) */}
            <div className="md:col-span-2">
              <label className={labelClass}>服务周期</label>
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <input 
                    type="date" 
                    value={basicInfo.startDate}
                    onChange={e => setBasicInfo({...basicInfo, startDate: e.target.value})}
                    className={inputClass}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <span className="text-gray-400">至</span>
                <div className="relative w-full">
                  <input 
                    type="date" 
                    value={basicInfo.endDate}
                    onChange={e => setBasicInfo({...basicInfo, endDate: e.target.value})}
                    className={inputClass}
                  />
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 第四行：背景 */}
            <div className="md:col-span-2">
              <label className={labelClass}>项目背景</label>
              <textarea 
                value={basicInfo.background}
                onChange={e => setBasicInfo({...basicInfo, background: e.target.value})}
                className={textAreaClass}
                placeholder="请输入项目背景及目标..."
              />
            </div>
          </div>
        </section>

        {/* 2. 服务收入 - 优化文本域和税率 */}
        <section className={sectionClass}>
          <div className={headerClass}>
            <span>2. 服务收入</span>
            <div className="flex items-center gap-2 font-normal">
              <span className="text-xs text-gray-500">税率(%)</span>
              <input 
                type="number" 
                value={taxRate}
                onChange={e => setTaxRate(e.target.value)}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {serviceItems.map((item, index) => (
              <div key={item.id} className="p-4 relative group hover:bg-gray-50 transition-colors">
                <button 
                  onClick={() => setServiceItems(serviceItems.filter(i => i.id !== item.id))}
                  className="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500 md:hidden group-hover:block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <label className={labelClass}>服务内容</label>
                    <textarea 
                      value={item.content}
                      onChange={(e) => {
                        const newItems = [...serviceItems];
                        newItems[index].content = e.target.value;
                        setServiceItems(newItems);
                      }}
                      className={textAreaClass}
                      placeholder="详细描述服务内容..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>含税金额 (元)</label>
                    <input 
                      type="number" 
                      value={item.amount}
                      onChange={(e) => {
                        const newItems = [...serviceItems];
                        newItems[index].amount = parseFloat(e.target.value) || 0;
                        setServiceItems(newItems);
                      }}
                      className={inputClass}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setServiceItems([...serviceItems, { id: generateId(), content: '', amount: 0 }])} className={addBtnClass}>
              <Plus className="w-4 h-4" /> 添加服务项
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">含税总计</div>
              <div className="font-bold text-gray-800 text-lg">{formatCurrency(totalRevenueInclusive)}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500">预计净收入 (扣除税额)</div>
              <div className="font-bold text-blue-600 text-lg">{formatCurrency(netRevenue)}</div>
            </div>
          </div>
        </section>

        {/* 3. 外采成本 - 单位后置优化 */}
        <section className={sectionClass}>
          <div className={headerClass}>3. 线下外采成本</div>
          <div className="divide-y divide-gray-100">
            {outsourcingItems.map((item, index) => (
              <div key={item.id} className="p-4 relative hover:bg-gray-50">
                 <button onClick={() => setOutsourcingItems(outsourcingItems.filter(i => i.id !== item.id))} className="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className={labelClass}>采购内容</label>
                    <textarea 
                      value={item.content}
                      onChange={e => {
                        const list = [...outsourcingItems];
                        list[index].content = e.target.value;
                        setOutsourcingItems(list);
                      }}
                      className={textAreaClass}
                      rows={1}
                      placeholder="内容描述"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelClass}>单价 (元)</label>
                    <input 
                      type="number" 
                      value={item.price}
                      onChange={e => {
                        const list = [...outsourcingItems];
                        list[index].price = parseFloat(e.target.value) || 0;
                        setOutsourcingItems(list);
                      }}
                      className={inputClass}
                    />
                  </div>
                  {/* 数量与单位组合 */}
                  <div className="md:col-span-4">
                    <label className={labelClass}>采购量 & 单位</label>
                    <div className="flex">
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={e => {
                          const list = [...outsourcingItems];
                          list[index].quantity = parseFloat(e.target.value) || 0;
                          setOutsourcingItems(list);
                        }}
                        className="w-2/3 border border-r-0 border-gray-300 rounded-l px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="数量"
                      />
                      <input 
                        type="text"
                        value={item.unit}
                        onChange={e => {
                          const list = [...outsourcingItems];
                          list[index].unit = e.target.value;
                          setOutsourcingItems(list);
                        }}
                        className="w-1/3 border border-gray-300 rounded-r bg-gray-50 px-3 py-2 text-sm text-center text-gray-600 focus:bg-white outline-none"
                        placeholder="单位"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-gray-400">
                  小计: <span className="text-gray-800 font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
             <button onClick={() => setOutsourcingItems([...outsourcingItems, { id: generateId(), content: '', price: 0, quantity: 1, unit: '个' }])} className={addBtnClass}>
              <Plus className="w-4 h-4" /> 添加外采项
            </button>
          </div>
        </section>

        {/* 4. 人工成本 - 搜索选择器 */}
        <section className={sectionClass}>
          <div className={headerClass}>4. 人工成本</div>
          <div className="divide-y divide-gray-100">
            {laborItems.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 relative">
                <button onClick={() => setLaborItems(laborItems.filter(i => i.id !== item.id))} className="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>选择员工 (搜索)</label>
                    <SearchableEmployeeSelect 
                      value={item.employeeId}
                      onChange={(emp) => {
                        const list = [...laborItems];
                        list[index] = {
                          ...list[index],
                          employeeId: emp.id,
                          name: emp.name,
                          role: emp.role,
                          dailyCost: emp.standardCost
                        };
                        setLaborItems(list);
                      }}
                    />
                    <div className="mt-1 text-xs text-gray-500">角色: {item.role || '-'}</div>
                  </div>
                  <div>
                    <label className={labelClass}>标准成本 (元/天)</label>
                    <input 
                      type="number"
                      value={item.dailyCost}
                      onChange={e => {
                        const list = [...laborItems];
                        list[index].dailyCost = parseFloat(e.target.value) || 0;
                        setLaborItems(list);
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>投入天数</label>
                    <input 
                      type="number"
                      value={item.days}
                      onChange={e => {
                        const list = [...laborItems];
                        list[index].days = parseFloat(e.target.value) || 0;
                        setLaborItems(list);
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setLaborItems([...laborItems, { id: generateId(), employeeId: '', name: '', role: '', dailyCost: 0, days: 0 }])} className={addBtnClass}>
              <Plus className="w-4 h-4" /> 添加人员
            </button>
          </div>
        </section>

        {/* 5. 其他费用 */}
        <section className={sectionClass}>
          <div className={headerClass}>5. 其他费用</div>
          <div className="divide-y divide-gray-100">
            {otherItems.map((item, index) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 relative">
                 <button onClick={() => setOtherItems(otherItems.filter(i => i.id !== item.id))} className="absolute right-2 top-2 p-1 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>费用类型</label>
                    <div className="relative">
                      <select 
                        value={item.type}
                        onChange={e => {
                          const list = [...otherItems];
                          list[index].type = e.target.value;
                          setOtherItems(list);
                        }}
                        className={`${inputClass} appearance-none bg-white`}
                      >
                        {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>金额 (元)</label>
                    <input 
                      type="number" 
                      value={item.amount}
                      onChange={e => {
                        const list = [...otherItems];
                        list[index].amount = parseFloat(e.target.value) || 0;
                        setOtherItems(list);
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className={labelClass}>费用说明</label>
                    <textarea 
                      value={item.description}
                      onChange={e => {
                        const list = [...otherItems];
                        list[index].description = e.target.value;
                        setOtherItems(list);
                      }}
                      className={textAreaClass}
                      placeholder="请填写具体费用用途"
                      rows={1}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setOtherItems([...otherItems, { id: generateId(), type: '其他杂费', description: '', amount: 0 }])} className={addBtnClass}>
              <Plus className="w-4 h-4" /> 添加其他费用
            </button>
          </div>
        </section>

      </main>

      {/* 底部固定栏 - 利润汇总与操作 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30 pb-safe">
        <div className="max-w-4xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* 数据概览 */}
          <div className="flex items-center justify-between w-full md:w-auto gap-6 text-sm">
            <div>
              <div className="text-gray-500 text-xs">总成本</div>
              <div className="font-bold text-gray-800">{formatCurrency(totalCost)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">毛利润</div>
              <div className={`font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(grossProfit)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">利润率</div>
              <div className={`font-bold text-lg ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitMargin.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition active:scale-95">
              保存草稿
            </button>
            <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-sm transition active:scale-95 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> 提交审批
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}