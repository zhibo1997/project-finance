# 项目维度财务数据系统 - 全栈开发实施计划

## 概述

基于PRD文档，使用 Nuxt 4 + Vue 3 + TypeScript + Prisma + MySQL 构建完整的项目财务管理系统。包含项目管理、记账管理、配置管理、文件上传四大核心模块。

## 技术决策

| 决策项 | 方案 |
|--------|------|
| UI 组件库 | naiveui
| 认证方式 | 暂不做认证/登录，前端 localStorage 切换角色，API通过请求头传递用户信息 |
| 数据库 | MySQL: root:123456@127.0.0.1:3306/ai-chat-database |
| 表单操作 | 原生 ref/computed + @nuxt/ui 表单组件（UInput, USelect, UTextarea） |
projectData.ts和projectListData.ts是示例数据

## 目录结构

```
financial-project2/
├── app/                          # 前端源码 (srcDir: "app/")
│   ├── app.vue                   # 根组件 (UApp 包裹)
│   ├── assets/css/main.css       # Tailwind 入口
│   ├── components/               # 公共组件
│   │   ├── AppHeader.vue         # 全局顶栏（角色切换）
│   │   ├── ProjectHeader.vue     # 项目详情头部
│   │   ├── MetricCard.vue        # 财务指标卡片
│   │   ├── ChartsView.vue        # ECharts 图表
│   │   ├── ListView.vue          # 费用明细列表
│   │   ├── FileUpload.vue        # 文件上传组件
│   │   ├── SearchableEmployeeSelect.vue
│   │   └── MultiSelectEmployee.vue
│   ├── composables/
│   │   ├── useAuth.ts            # 角色管理
│   │   └── useApi.ts             # API 封装
│   ├── layouts/
│   │   └── default.vue           # 默认布局
│   ├── pages/
│   │   ├── index.vue             # 项目列表
│   │   ├── projects/
│   │   │   ├── create.vue        # 新建项目（立项表单）
│   │   │   └── [id]/
│   │   │       ├── index.vue     # 项目看板/详情
│   │   │       ├── edit.vue      # 编辑项目
│   │   │       └── accounting.vue # 记账管理
│   │   └── config/
│   │       ├── index.vue         # 配置管理首页
│   │       ├── expense-categories.vue
│   │       ├── purchase-contents.vue
│   │       └── employee-costs.vue
│   └── utils/
│       └── format.ts             # 格式化工具
│
├── server/                       # 后端源码 (serverDir: "server/")
│   ├── api/
│   │   ├── projects/
│   │   │   ├── index.get.ts      # 项目列表
│   │   │   ├── index.post.ts     # 创建项目
│   │   │   └── [id]/
│   │   │       ├── index.get.ts  # 项目详情
│   │   │       ├── index.put.ts  # 更新项目
│   │   │       ├── index.delete.ts
│   │   │       ├── copy.post.ts  # 复制项目
│   │   │       ├── status.put.ts # 状态变更
│   │   │       ├── export.get.ts # Excel导出
│   │   │       └── records/
│   │   │           ├── index.get.ts
│   │   │           └── index.post.ts
│   │   ├── records/
│   │   │   └── [id]/
│   │   │       ├── index.put.ts
│   │   │       └── index.delete.ts
│   │   ├── dict/
│   │   │   ├── expense-categories/
│   │   │   │   ├── index.get.ts
│   │   │   │   ├── index.post.ts
│   │   │   │   └── [id].put.ts & [id].delete.ts
│   │   │   └── purchase-contents/
│   │   │       └── ... (同上)
│   │   ├── config/
│   │   │   └── employee-costs/
│   │   │       └── ... (CRUD)
│   │   └── upload/
│   │       ├── index.post.ts
│   │       └── [...filename].get.ts & [...filename].delete.ts
│   └── utils/
│       ├── prisma.ts             # PrismaClient 单例
│       ├── response.ts           # 统一响应格式
│       └── auth.ts               # 从请求头读取用户信息
│
├── prisma/
│   └── schema.prisma             # 数据库模型
│
├── shared/
│   └── types/
│       ├── index.ts              # 统一导出
│       ├── project.ts            # 项目类型
│       ├── accounting.ts         # 记账类型
│       └── config.ts             # 配置类型
│
├── uploads/                      # 文件上传目录
├── nuxt.config.ts                # (已存在, 需修改 modules)
└── package.json                  # (已存在)
```

---

## 实施步骤

### 阶段 1: 基础设施搭建

#### 1.1 修改 nuxt.config.ts

**文件**: `d:\project\financial-project2\nuxt.config.ts`

将 `modules: ['@nuxtjs/tailwindcss']` 改为 `modules: ['@nuxt/ui']`，因为 @nuxt/ui v4 内置了 Tailwind CSS 支持，不需要单独引入。

#### 1.2 安装依赖 & 初始化项目

```bash
npm install
npx nuxt prepare
```

#### 1.3 创建 .env 文件

**文件**: `d:\project\financial-project2\.env`

```
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/ai-chat-database"
```

#### 1.4 创建 Prisma Schema

**文件**: `d:\project\financial-project2\prisma\schema.prisma`

6个模型：
- **Project**: id(UUID), projectName, projectLeader, clientName, projectType, serviceStartDate(DateTime?), serviceEndDate(DateTime?), serviceAmount(Decimal), status(ProjectStatus enum: DRAFT/SUBMITTED/COMPLETED/CLOSED), formData(Json?), createdBy, createdAt, updatedAt, 关联 members/records
- **ProjectMember**: id, projectId(FK), userId, userName, role(MemberRole enum: MANAGER/MEMBER), createdAt. 索引: projectId+userId 唯一
- **AccountingRecord**: id, projectId(FK), recordType(RecordType enum: INCOME/EXPENSE), approvalId, recordDate(DateTime), amount(Decimal), categoryId?, description?, applicant?, invoiceNo?, payer?, attachments(Json?), remark?, createdBy, createdByName, createdAt, updatedAt
- **ExpenseCategory**: id, name, sortOrder(Int default 0), createdAt, updatedAt
- **PurchaseContent**: id, name, sortOrder(Int default 0), createdAt, updatedAt
- **EmployeeCostConfig**: id, levelKey(unique), levelName, dailyCost(Decimal), createdAt, updatedAt

执行迁移: `npx prisma migrate dev --name init`

#### 1.5 服务端工具函数

**文件 `server/utils/prisma.ts`**: PrismaClient 单例（开发环境防止热重载重复实例化）

**文件 `server/utils/response.ts`**:
```typescript
// successResponse(data?, message?) → { code: 0, message: 'ok', data }
// errorResponse(message, code?) → { code: -1, message }
```

**文件 `server/utils/auth.ts`**:
```typescript
// getUserFromEvent(event) → 从 X-User-Id, X-User-Role, X-User-Name 请求头读取用户信息
// 无header时返回默认 admin 角色（便于开发调试）
```

#### 1.6 共享类型定义

**文件 `shared/types/`**: 定义 Project, ProjectFormData, AccountingRecord, ExpenseCategory, PurchaseContent, EmployeeCostConfig, ApiResponse 等 TypeScript 接口

#### 1.7 前端基础文件

**文件 `app/app.vue`**: UApp 包裹 NuxtLayout + NuxtPage
**文件 `app/layouts/default.vue`**: 包含 AppHeader（角色切换栏）+ slot
**文件 `app/assets/css/main.css`**: Tailwind 指令
**文件 `app/composables/useAuth.ts`**: 从 src-old 迁移，适配 Nuxt 4 auto-import
**文件 `app/composables/useApi.ts`**: 封装 $fetch，自动附加用户 header，统一错误处理
**文件 `app/utils/format.ts`**: formatCurrency, formatDate 工具

#### 1.8 验证

启动 `npm run dev`，确认页面可访问、数据库连接正常。

---

### 阶段 2: 配置管理模块 (Module D)

优先实现最简单的 CRUD 模块，验证全栈链路。

#### 2.1 后端 API (3组，结构相同)

**费用类别** `server/api/dict/expense-categories/`:
- `index.get.ts`: findMany + orderBy sortOrder
- `index.post.ts`: create, 验证 name 必填
- `[id].put.ts`: update
- `[id].delete.ts`: delete（PRD允许删除已使用的类别）

**采购内容** `server/api/dict/purchase-contents/`: 结构同上

**员工成本** `server/api/config/employee-costs/`:
- 同上 CRUD，额外验证 levelKey 唯一

#### 2.2 前端配置页面

**文件 `app/pages/config/expense-categories.vue`**:
- UTable 展示列表（列: 名称、排序、操作）
- UButton 新增 → UModal 弹出表单（UInput 名称 + UInput 排序）
- 编辑/删除操作按钮

`purchase-contents.vue` 和 `employee-costs.vue` 结构类似。

`config/index.vue` 作为配置管理导航页。

---

### 阶段 3: 文件上传模块 (Module E)

#### 3.1 后端 API

**文件 `server/api/upload/index.post.ts`**:
- `readMultipartFormData(event)` 读取文件
- 验证类型（jpg/png/pdf）、大小（<=10MB）
- 生成唯一文件名，保存至 `uploads/` 目录
- 返回 `{ url: '/api/upload/{filename}', filename }`

**文件 `server/api/upload/[...filename].get.ts`**: 从 uploads/ 读取文件并返回

**文件 `server/api/upload/[...filename].delete.ts`**: 删除文件

#### 3.2 前端上传组件

**文件 `app/components/FileUpload.vue`**:
- Props: `modelValue`(附件URL数组), `accept`, `maxSize`
- 点击/拖拽上传，文件预览，删除功能
- 调用 POST /api/upload，emit update:modelValue

---

### 阶段 4: 项目管理模块 (Module B)

#### 4.1 后端 API

**`server/api/projects/index.get.ts`** - 项目列表:
- 查询参数: keyword, status, page(default 1), size(default 20)
- keyword 模糊搜索 projectName/clientName/projectLeader
- status 筛选（支持多状态）
- 分页: skip/take
- 返回项目列表 + 总数

**`server/api/projects/index.post.ts`** - 创建项目:
- 接收: projectName, projectLeader, clientName, projectType, serviceStartDate, serviceEndDate, serviceAmount, formData(JSON), status(默认DRAFT)
- 创建 Project + 关联 ProjectMember（负责人为 MANAGER）
- 如果 formData 中有 projectMembers，同时创建 MEMBER 记录

**`server/api/projects/[id]/index.get.ts`** - 项目详情:
- include members, 关联查询记账记录汇总

**`server/api/projects/[id]/index.put.ts`** - 更新项目:
- 仅 DRAFT/SUBMITTED/COMPLETED 状态可编辑
- 更新字段 + 同步更新 ProjectMember

**`server/api/projects/[id]/index.delete.ts`** - 删除项目:
- 级联删除关联数据

**`server/api/projects/[id]/copy.post.ts`** - 复制项目:
- 仅 COMPLETED/CLOSED 可复制
- 新项目: name + " copy", status = DRAFT
- 复制 formData 和 members

**`server/api/projects/[id]/status.put.ts`** - 状态变更:
- 验证流转规则: DRAFT→SUBMITTED→COMPLETED→CLOSED
- 支持任意状态→CLOSED（关闭）

**`server/api/projects/[id]/export.get.ts`** - Excel导出:
- 使用 ExcelJS 创建工作簿
- Sheet1: 项目概况（基础信息）
- Sheet2: 服务收入明细
- Sheet3: 成本明细（外采+人工+其他）
- 设置响应头，返回 Buffer

#### 4.2 前端页面

**`app/pages/index.vue`** - 项目列表页:
- 参考 src-old/pages/ProjectListPage.vue 布局
- 顶部通过 default.vue layout 展示角色切换（AppHeader）
- 搜索框（UInput）+ 状态筛选按钮组 + 新增按钮（权限控制）
- UTable 展示项目列表（含分页 UPagination）
  - 列: 项目编号/名称/负责人/客户/服务周期/金额/状态/操作
  - 操作按钮: 记账(→accounting)/编辑(→edit)/看板(→detail)/复制/关闭/删除
  - 按状态和权限控制按钮显示
- 统计信息: 项目数、筛选数、总金额

**`app/pages/projects/create.vue`** - 立项表单:
- 参考 src-old/pages/ProjectApplication.vue
- 5个 Section:
  1. 基础信息: 项目名称/负责人/客户/联系人/服务周期(日期选择)/项目成员(MultiSelectEmployee)/背景
  2. 服务收入: 税率输入 + 动态服务项列表(内容+金额) + 底部汇总
  3. 外采成本: 动态采购项(内容+单价+数量+单位) + 小计
  4. 人工成本: 动态人员项(SearchableEmployeeSelect+日成本+天数)
  5. 其他费用: 动态费用项(类别下拉+金额+说明)
- 底部固定栏: 总成本/毛利润/利润率 + 保存草稿/提交按钮
- 提交调用 POST /api/projects

**`app/pages/projects/[id]/edit.vue`** - 编辑项目:
- 复用 create.vue 的表单结构（提取为组件或直接复用逻辑）
- onMounted 加载项目数据填充表单
- 提交调用 PUT /api/projects/:id

**`app/pages/projects/[id]/index.vue`** - 项目看板:
- 参考 src-old/pages/HomePage.vue
- ProjectHeader: 项目基本信息展示
- 4个 MetricCard: 预计收入/入账收入/预计毛利率/实际毛利率
- 视图切换: 明细列表(ListView) / 可视化报表(ChartsView)
- 数据来源: formData(预计) + AccountingRecord(实际)

#### 4.3 复用组件迁移

从 src-old 迁移并适配 @nuxt/ui:
- **MetricCard.vue**: 保留 Tailwind 样式，替换 lucide 图标引用为 auto-import
- **ChartsView.vue**: ECharts 柱状+饼图，保留 resize 和 dispose 逻辑
- **ListView.vue**: 费用明细列表，使用 UTable 替换原生 table
- **SearchableEmployeeSelect.vue**: 搜索式员工选择器，考虑使用 USelectMenu
- **MultiSelectEmployee.vue**: 多选员工组件

---

### 阶段 5: 记账管理模块 (Module C)

#### 5.1 后端 API

**`server/api/projects/[id]/records/index.get.ts`** - 记账列表:
- 查询 project 下的 AccountingRecord
- 权限处理: 如果角色为 project_member，响应中 createdByName 设为空
- 支持按 recordType 筛选

**`server/api/projects/[id]/records/index.post.ts`** - 新增记账:
- 验证项目状态为 COMPLETED
- INCOME 类型: 仅 admin/project_manager
- EXPENSE 类型: 所有角色
- 必填验证: approvalId, recordDate, amount
- 支出额外必填: categoryId, description, applicant

**`server/api/records/[id]/index.put.ts`** - 修改记账:
- project_member 仅可修改自己的记录 (createdBy === currentUser.id)
- admin/project_manager 可修改所有

**`server/api/records/[id]/index.delete.ts`** - 删除记账:
- project_member 不可删除
- admin/project_manager 可删除

#### 5.2 前端页面

**`app/pages/projects/[id]/accounting.vue`** - 记账页面:
- 顶部: 项目信息摘要 + 新增按钮
  - 收入记账按钮: 仅 admin/manager 可见
  - 支出记账按钮: 所有角色可见
- 筛选: 类型切换(全部/收入/支出)
- UTable 记账列表:
  - 列: 日期/类型/审批单号/金额/类别/描述/申请人/附件/备注/操作
  - 操作: 编辑(权限控制)/删除(仅admin/manager)
  - project_member 看不到 "记账人" 列
- UModal 新增/编辑对话框:
  - 收入表单: approvalId, recordDate, amount, invoiceNo, payer, attachments(FileUpload), remark
  - 支出表单: approvalId, recordDate, categoryId(USelect加载字典), amount, description, applicant, attachments(FileUpload), remark

---

## 关键实现细节

### @nuxt/ui v4 组件使用模式

```vue
<!-- UTable 基本用法 -->
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
const columns: TableColumn<Project>[] = [
  { accessorKey: 'projectName', header: '项目名称' },
  { accessorKey: 'status', header: '状态', cell: ({ row }) => h(UBadge, ...) }
]
</script>
<template>
  <UTable :data="projects" :columns="columns" />
</template>

<!-- UModal 用法 -->
<UModal v-model:open="isOpen">
  <UButton label="打开" />
  <template #content>
    <!-- 表单内容 -->
  </template>
</UModal>
```

### 统一 API 响应格式

```typescript
// server/utils/response.ts
export const successResponse = (data?: any, message = 'ok') => ({ code: 0, message, data })
export const errorResponse = (message: string) => ({ code: -1, message })
```

### 用户信息传递（暂无认证）

```typescript
// app/composables/useApi.ts - 前端每次请求附加 header
const apiFetch = (url, opts) => $fetch(url, {
  ...opts,
  headers: {
    'X-User-Id': currentUser.value.id,
    'X-User-Role': currentUser.value.role,
    'X-User-Name': currentUser.value.name,
    ...opts?.headers
  }
})

// server/utils/auth.ts - 后端从 header 读取
export const getUserFromEvent = (event) => ({
  id: getHeader(event, 'x-user-id') || '1',
  role: getHeader(event, 'x-user-role') || 'admin',
  name: getHeader(event, 'x-user-name') || '管理员'
})
```

### 项目状态流转规则

```
DRAFT → SUBMITTED → COMPLETED → CLOSED
任意状态 → CLOSED（admin/manager关闭操作）
仅 COMPLETED 状态可记账
仅 COMPLETED/CLOSED 可复制
CLOSED 状态不可编辑、不可记账
```

### 财务计算逻辑

```typescript
// 预计数据（来自 formData）
预计净收入 = 含税总计 * (1 - 税率%)
预计支出 = 外采成本 + 人工成本 + 其他费用
预计毛利率 = (预计净收入 - 预计支出) / 预计净收入 * 100%

// 实际数据（来自 AccountingRecord）
入账收入 = SUM(amount) WHERE recordType = INCOME
实际支出 = SUM(amount) WHERE recordType = EXPENSE
实际毛利率 = (入账收入 - 实际支出) / 入账收入 * 100%
```

---

## 关键文件清单

| 优先级 | 文件路径 | 说明 |
|--------|----------|------|
| P0 | `nuxt.config.ts` | 修改 modules 为 @nuxt/ui |
| P0 | `.env` | 数据库连接字符串 |
| P0 | `prisma/schema.prisma` | 6个数据表模型定义 |
| P0 | `server/utils/prisma.ts` | PrismaClient 单例 |
| P0 | `server/utils/response.ts` | 统一响应格式 |
| P0 | `server/utils/auth.ts` | 用户信息读取 |
| P0 | `app/app.vue` | 根组件 |
| P0 | `app/layouts/default.vue` | 默认布局 |
| P0 | `app/composables/useAuth.ts` | 角色管理 |
| P0 | `app/composables/useApi.ts` | API 封装 |
| P1 | `server/api/dict/**` | 字典配置 API (6个文件) |
| P1 | `server/api/config/**` | 成本配置 API (4个文件) |
| P1 | `app/pages/config/**` | 配置管理页面 (4个文件) |
| P1 | `server/api/upload/**` | 文件上传 API (3个文件) |
| P1 | `app/components/FileUpload.vue` | 上传组件 |
| P2 | `server/api/projects/**` | 项目管理 API (8个文件) |
| P2 | `app/pages/index.vue` | 项目列表页 |
| P2 | `app/pages/projects/create.vue` | 立项表单 |
| P2 | `app/pages/projects/[id]/edit.vue` | 编辑项目 |
| P2 | `app/pages/projects/[id]/index.vue` | 项目看板 |
| P2 | `app/components/MetricCard.vue` | 指标卡片 |
| P2 | `app/components/ChartsView.vue` | 图表组件 |
| P3 | `server/api/projects/[id]/records/**` | 记账 API (2个文件) |
| P3 | `server/api/records/**` | 记账修改/删除 API (2个文件) |
| P3 | `app/pages/projects/[id]/accounting.vue` | 记账页面 |

---

## 验证计划

### 阶段 1 验证
- [ ] `npm run dev` 成功启动，访问 http://localhost:3000 无报错
- [ ] `npx prisma studio` 可访问，6个表结构正确
- [ ] 角色切换功能正常（AppHeader 中三个角色按钮可切换）

### 阶段 2 验证
- [ ] 费用类别 CRUD: 新增/编辑/删除/列表 API 正常
- [ ] 采购内容 CRUD: 同上
- [ ] 员工成本 CRUD: levelKey 唯一约束验证
- [ ] 配置页面 UI 交互正常

### 阶段 3 验证
- [ ] 文件上传: jpg/png/pdf 类型 <=10MB 上传成功
- [ ] 文件类型/大小校验: 不合法文件被拒绝
- [ ] 文件下载: 通过 URL 可访问已上传文件
- [ ] 文件删除: 删除后无法再访问

### 阶段 4 验证
- [ ] 项目列表: 搜索、状态筛选、分页正常
- [ ] 创建项目: 5个 Part 表单填写、保存草稿、提交
- [ ] 编辑项目: 加载已有数据、修改保存
- [ ] 状态流转: DRAFT→SUBMITTED→COMPLETED→CLOSED 正确
- [ ] 复制项目: 名称带 "copy" 后缀，状态为 DRAFT
- [ ] Excel 导出: 下载文件可正常打开

### 阶段 5 验证
- [ ] 收入记账: admin/manager 可操作，member 不可见按钮
- [ ] 支出记账: 所有角色可操作
- [ ] 记账列表: member 看不到记账人列
- [ ] 修改权限: member 仅能修改自己的记录
- [ ] 删除权限: member 无删除按钮
- [ ] 附件上传: 记账时附件关联正常

### 最终验证
- [ ] `npm run build` 构建无报错
- [ ] 三种角色分别完整走通业务流程
