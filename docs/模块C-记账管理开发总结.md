# 模块C：记账管理开发总结

## 概述

模块C负责实现项目的记账管理功能，包括收入记账和支出记账，支持多角色权限控制。该模块是项目财务管理系统的核心组成部分，提供了完整的记账CRUD操作和详细的权限管理。

## 技术栈

- **Vue 3 + TypeScript + Vite** - 前端框架和构建工具
- **Tailwind CSS 3** - 样式框架
- **Lucide Vue Next** - 图标库
- **模拟数据库** - 用于开发和测试的Mock数据
- **组合式函数** - Vue 3的Composition API
- **Vue Router 4** - 路由管理
- **Element Plus** - UI组件库（可选）

## 核心功能

### 1. 记账类型

- **收入记账**：管理员、项目经理可操作
- **支出记账**：所有角色可操作

### 2. 权限控制

| 角色 | 查看记录 | 查看记账人 | 修改记录 | 删除记录 |
|------|----------|------------|----------|----------|
| 管理员 | ✅ 全部 | ✅ | ✅ 全部 | ✅ 全部 |
| 项目经理 | ✅ 全部 | ✅ | ✅ 全部 | ✅ 全部 |
| 项目成员 | ✅ 全部 | ❌ | ✅ 仅自己 | ❌ |

### 3. 记账字段

#### 收入记账
- 审批流程单ID（必填）
- 入账日期（必填）
- 金额（必填）
- 发票号（可选）
- 付款方（可选）
- 附件（可选）
- 备注（可选）

#### 支出记账
- 审批流程单ID（必填）
- 支出日期（必填）
- 费用类别（必填）
- 金额（必填）
- 用途说明（必填）
- 申请人（必填）
- 附件（可选）
- 备注（可选）

## 修改的文件

### 1. 类型定义 (`src/types/accounting.ts`)

新增了记账管理的类型定义：
- `AccountingType`: 定义记账类型（收入/支出）
- `AccountingRecord`: 记账记录接口
- `CreateAccountingRecordDTO`: 创建记账记录数据结构
- `UpdateAccountingRecordDTO`: 更新记账记录数据结构

### 2. API接口 (`src/api/accounting.ts`)

新增了记账API接口：
- `getAccountingRecords`: 获取记账记录列表
- `getAccountingRecordById`: 获取单个记账记录
- `createAccountingRecord`: 创建记账记录
- `updateAccountingRecord`: 更新记账记录
- `deleteAccountingRecord`: 删除记账记录

### 3. 组合式函数 (`src/composables/useAccounting.ts`)

新增了记账管理组合式函数：
- 数据加载和管理
- 记录增删改查
- 计算属性（总收入、总支出、净收入）
- 权限检查方法

### 4. 权限管理 (`src/composables/useAuth.ts`)

更新了权限管理组合式函数，添加了项目管理和记账管理相关权限方法：

#### 项目管理权限
- `canViewProject`: 检查是否可以查看项目
- `canEditProject`: 检查是否可以编辑项目
- `canDeleteProject`: 检查是否可以删除项目
- `canCopyProject`: 检查是否可以复制项目
- `canCloseProject`: 检查是否可以关闭项目

#### 记账管理权限
- `canViewCreator`: 检查是否可以查看记账人
- `canEditAccountingRecord`: 检查是否可以编辑记录
- `canDeleteAccountingRecord`: 检查是否可以删除记录
- `canBookkeepingIncome`: 检查是否可以进行收入记账
- `canBookkeepingExpense`: 检查是否可以进行支出记账

### 5. 页面组件 (`src/pages/AccountingPage.vue`)

新增了记账管理页面：
- 标签页导航（收入/支出）
- 搜索和筛选功能
- 记录列表显示
- 创建/编辑/查看/删除操作

### 6. 可复用组件

新增了以下记账管理组件：

- `src/components/accounting/RecordList.vue`: 记录列表展示组件
- `src/components/accounting/IncomeForm.vue`: 收入记账表单组件
- `src/components/accounting/ExpenseForm.vue`: 支出记账表单组件
- `src/components/accounting/ViewRecord.vue`: 记录详情查看组件

### 7. 工具函数 (`src/utils/index.ts`)

更新了工具函数，添加了 `calculateTotalAmount` 方法，用于计算项目总金额。

### 8. 路由配置 (`src/router/index.ts`)

添加了记账管理路由：

```typescript
{
  path: '/accounting',
  name: 'accounting',
  component: AccountingPage,
  meta: {
    title: '记账管理',
    requiresAuth: true
  }
}
```

### 9. 首页 (`src/pages/HomePage.vue`)

更新了首页导航链接，添加了记账管理入口。

### 10. 项目列表页面 (`src/pages/ProjectListPage.vue`)

更新了项目列表页面的导航函数，指向新的记账管理页面。

## 使用的技术点

### 1. 响应式设计

- 使用 Tailwind CSS 的响应式类实现移动端和桌面端适配
- 标签页组件支持在小屏幕上垂直堆叠

### 2. 表单验证

- 使用 Vue 3 的表单验证 API
- 支持必填字段、数字验证、日期验证等
- 实时显示验证错误信息

### 3. 文件上传

- 支持附件上传功能
- 限制文件类型和大小
- 显示上传进度和预览

### 4. 数据格式化

- 金额格式化（显示千分位和小数点）
- 日期格式化（支持多种日期格式）
- 数字格式化（百分比、货币等）

### 5. 权限控制

- 基于角色的访问控制（RBAC）
- 路由级别的权限检查
- 组件级别的权限控制
- 操作级别的权限验证

### 6. 模拟数据

- 使用 MockDatabase 提供模拟数据
- 支持开发和测试环境的数据模拟
- 包含收入和支出记录的示例数据

## 运行说明

```bash
cd "d:\项目demo\baobiao"
npm install
npm run dev
# 访问 http://localhost:3001/accounting
```

## 验证清单

### 功能验证
- [x] 页面加载正常
- [x] 收入/支出标签页切换
- [x] 搜索功能正常
- [x] 创建新记录
- [x] 编辑记录
- [x] 查看记录详情
- [x] 删除记录
- [x] 附件上传
- [x] 表单验证
- [x] 权限控制

### 权限验证
- [x] 管理员/经理可以查看所有记录和记账人
- [x] 项目成员不能查看记账人
- [x] 项目成员只能修改自己的记录
- [x] 项目成员不能删除记录
- [x] 只有管理员/经理可以看到删除按钮

## 总结

模块C（记账管理）的开发已完成，实现了完整的收入和支出记账功能，并具有严格的权限控制。该模块遵循了项目的架构设计，使用了Vue 3 + TypeScript + Vite技术栈，提供了良好的用户体验和响应式设计。所有功能已通过基础验证，可以正常使用。
