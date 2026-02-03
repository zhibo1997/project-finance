# 项目维度财务数据系统 - PRD与技术方案 v1.1

## 文档说明

本文档按模块拆分，每个模块包含【业务需求】+【技术实现】，支持多Agent并发开发。

---

## 技术架构总览

| 层级 | 技术 | 说明 |
|------|------|------|
| 全栈框架 | Nuxt 3 | 前后端一体 |
| 前端 | Vue 3 + TypeScript | 组合式API |
| UI组件 | NaiveUI | 企业级组件库 |
| 图表 | ECharts | 数据可视化 |
| 数据库 | MySQL | 关系型数据库 |
| 文件存储 | 本地服务器（初期）→ 华为云OBS（后期） | 凭证附件 |
| 文档生成 | exceljs | 后端生成Excel |

---

## 数据库ER图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE ER DIAGRAM                                 │
│                                 数据库实体关系图                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────┐       1:N        ┌────────────────────────────┐
│   projects (项目表)         │◄─────────────────┤  project_members (项目成员表) │
├────────────────────────────┤                  ├────────────────────────────┤
│ PK id (主键ID)              │                  │ PK id (主键ID)              │
│    project_name (项目名称)   │                  │ FK project_id (项目ID)      │
│    project_leader (负责人)   │                  │    user_id (用户ID)         │
│    client_name (客户名称)    │                  │    user_name (用户姓名)      │
│    project_type (项目类型)   │                  │    role (角色:经理/成员)     │
│    service_start_date       │                  │    created_at (创建时间)     │
│      (服务开始日期)          │                  └────────────────────────────┘
│    service_end_date         │
│      (服务结束日期)          │       1:N        ┌────────────────────────────┐
│    service_amount (服务金额) │◄─────────────────┤ accounting_records (记账表)  │
│    status (状态)            │                  ├────────────────────────────┤
│    form_data (表单数据JSON)  │                  │ PK id (主键ID)              │
│    created_by (创建人)       │                  │ FK project_id (项目ID)      │
│    created_at (创建时间)     │                  │    record_type (类型:收入/支出)│
│    updated_at (更新时间)     │                  │    approval_id (审批流程单ID) │
└────────────────────────────┘                  │    record_date (记账日期)    │
                                                │    amount (金额)            │
                                                │ FK category_id (费用类别ID)  │──┐
┌────────────────────────────┐                  │    description (用途说明)    │  │
│ expense_categories (费用类别)│                  │    applicant (申请人)       │  │
├────────────────────────────┤       N:1        │    invoice_no (发票号)       │  │
│ PK id (主键ID)              │◄─────────────────│    payer (付款方)           │  │
│    name (类别名称)          │                  │    attachments (附件JSON)   │  │
│    sort_order (排序号)      │                  │    remark (备注)            │  │
│    created_at (创建时间)    │                  │    created_by (记账人ID)    │  │
│    updated_at (更新时间)    │                  │    created_by_name (记账人)  │  │
└────────────────────────────┘                  │    created_at (创建时间)     │  │
                                                │    updated_at (更新时间)     │  │
                                                └────────────────────────────┘  │
┌────────────────────────────┐                           │                      │
│ purchase_contents (采购内容) │                           │ 引用                 │
├────────────────────────────┤                           ▼                      │
│ PK id (主键ID)              │                  ┌────────────────────────────┐  │
│    name (采购内容名称)       │                  │ expense_categories (费用类别)│◄─┘
│    sort_order (排序号)      │                  └────────────────────────────┘
│    created_at (创建时间)    │
│    updated_at (更新时间)    │
└────────────────────────────┘

┌────────────────────────────┐
│ employee_cost_config       │
│   (员工成本配置表)           │
├────────────────────────────┤
│ PK id (主键ID)              │
│    level_key (级别标识)     │
│    level_name (级别名称)    │
│    daily_cost (日成本)      │
│    created_at (创建时间)    │
│    updated_at (更新时间)    │
└────────────────────────────┘
```
### 数据库配置
      "MYSQL_HOST": "127.0.0.1",
      "MYSQL_PORT": "3306",
      "MYSQL_USER": "root",
      "MYSQL_PASSWORD": "123456",
      "MYSQL_DATABASE": "ai-chat-database"

### 数据表清单

| 表名 | 中文名 | 说明 |
|------|--------|------|
| projects | 项目表 | 存储项目基本信息和立项表单 |
| project_members | 项目成员表 | 项目与用户的关联，含角色 |
| accounting_records | 记账表 | 收入/支出记录 |
| expense_categories | 费用类别字典 | 支出费用分类 |
| purchase_contents | 采购内容字典 | 服务收入的采购内容 |
| employee_cost_config | 员工成本配置 | 按级别配置日成本 |

### 字段详细说明

**projects (项目表)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| project_name | 项目名称 | VARCHAR(200) | 必填 |
| project_leader | 项目负责人 | VARCHAR(100) | 必填 |
| client_name | 客户名称 | VARCHAR(200) | - |
| project_type | 项目类型 | VARCHAR(100) | - |
| service_start_date | 服务开始日期 | DATE | - |
| service_end_date | 服务结束日期 | DATE | - |
| service_amount | 服务总金额 | DECIMAL(15,2) | 自动计算 |
| status | 状态 | ENUM | draft/submitted/completed/closed |
| form_data | 表单数据 | JSON | 完整立项表单 |
| created_by | 创建人ID | VARCHAR(36) | - |
| created_at | 创建时间 | DATETIME | 自动 |
| updated_at | 更新时间 | DATETIME | 自动 |

**project_members (项目成员表)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| project_id | 项目ID | VARCHAR(36) | 外键 |
| user_id | 用户ID | VARCHAR(36) | - |
| user_name | 用户姓名 | VARCHAR(100) | - |
| role | 角色 | ENUM | manager(经理)/member(成员) |
| created_at | 创建时间 | DATETIME | 自动 |

**accounting_records (记账表)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| project_id | 项目ID | VARCHAR(36) | 外键 |
| record_type | 记账类型 | ENUM | income(收入)/expense(支出) |
| approval_id | 审批流程单ID | VARCHAR(100) | 必填，手填 |
| record_date | 记账日期 | DATE | 必填 |
| amount | 金额 | DECIMAL(15,2) | 必填 |
| category_id | 费用类别ID | VARCHAR(36) | 支出必填 |
| description | 用途说明 | TEXT | 支出必填 |
| applicant | 申请人 | VARCHAR(100) | 支出必填 |
| invoice_no | 发票号 | VARCHAR(100) | 收入可选 |
| payer | 付款方 | VARCHAR(200) | 收入可选 |
| attachments | 附件 | JSON | URL数组 |
| remark | 备注 | TEXT | 可选 |
| created_by | 记账人ID | VARCHAR(36) | 自动 |
| created_by_name | 记账人姓名 | VARCHAR(100) | 成员不可见 |
| created_at | 创建时间 | DATETIME | 自动 |
| updated_at | 更新时间 | DATETIME | 自动 |

**expense_categories (费用类别字典)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| name | 类别名称 | VARCHAR(100) | 必填 |
| sort_order | 排序号 | INT | 默认0 |
| created_at | 创建时间 | DATETIME | 自动 |
| updated_at | 更新时间 | DATETIME | 自动 |

**purchase_contents (采购内容字典)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| name | 采购内容名称 | VARCHAR(200) | 必填 |
| sort_order | 排序号 | INT | 默认0 |
| created_at | 创建时间 | DATETIME | 自动 |
| updated_at | 更新时间 | DATETIME | 自动 |

**employee_cost_config (员工成本配置表)**
| 字段名 | 中文名 | 类型 | 说明 |
|--------|--------|------|------|
| id | 主键ID | VARCHAR(36) | UUID |
| level_key | 级别标识 | VARCHAR(50) | 唯一键 |
| level_name | 级别名称 | VARCHAR(100) | 如：初级/中级/高级 |
| daily_cost | 日成本 | DECIMAL(10,2) | 元/天 |
| created_at | 创建时间 | DATETIME | 自动 |
| updated_at | 更新时间 | DATETIME | 自动 |

---

## 系统使用流程图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           系统使用流程图 (System Flow)                            │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────┐
                                    │  开始   │
                                    └────┬────┘
                                         │
                                         ▼
                              ┌─────────────────────┐
                              │     用户登录系统     │
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
            │   管理员       │    │   项目经理    │    │   项目成员    │
            └───────┬───────┘    └───────┬───────┘    └───────┬───────┘
                    │                    │                    │
        ┌───────────┴───────────┐        │                    │
        ▼                       ▼        ▼                    ▼
┌───────────────┐       ┌───────────────────────────────────────────────┐
│  配置管理      │       │              项目列表页面                      │
├───────────────┤       ├───────────────────────────────────────────────┤
│ • 费用类别配置  │       │  • 查看项目列表 (按权限过滤)                    │
│ • 采购内容配置  │       │  • 搜索项目 (名称/客户/负责人)                  │
│ • 员工成本配置  │       │  • 状态筛选                                   │
└───────────────┘       └───────────────────┬───────────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
            ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
            │   新建项目     │       │   查看/编辑    │       │    复制项目   │
            │ (经理/管理员)  │       │   项目详情     │       │  (跨年快速)   │
            └───────┬───────┘       └───────┬───────┘       └───────┬───────┘
                    │                       │                       │
                    ▼                       │                       │
    ┌───────────────────────────────┐       │                       │
    │        项目立项表单            │       │                       │
    ├───────────────────────────────┤       │                       │
    │  Part 1: 基础信息             │       │                       │
    │  Part 2: 服务收入(采购+必要性) │       │                       │
    │  Part 3: 外采成本             │       │                       │
    │  Part 4: 人工成本             │       │                       │
    │  Part 5: 其他费用             │       │                       │
    └───────────────┬───────────────┘       │                       │
                    │                       │                       │
                    ▼                       │                       │
    ┌───────────────────────────────┐       │                       │
    │          保存草稿             │◄──────┴───────────────────────┘
    │        状态: draft            │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │          提交立项             │
    │       状态: submitted         │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │      导出Excel文档            │
    │      (用于线下审批打印)        │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │        线下审批流程            │
    │      (系统外部进行)            │
    └───────────────┬───────────────┘
                    │
                    ▼
    ┌───────────────────────────────┐
    │    上传审批单/标记完成         │
    │       状态: completed         │
    └───────────────┬───────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐       ┌───────────────────────────────┐
│   项目记账     │       │          手工结项             │
│ (已完成状态)   │       │        状态: closed           │
└───────┬───────┘       └───────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────┐
│                    记账操作                            │
├───────────────────────────────────────────────────────┤
│                                                        │
│   ┌─────────────────┐         ┌─────────────────┐     │
│   │    收入记账      │         │    支出记账      │     │
│   │  (管理员/经理)   │         │   (所有角色)     │     │
│   ├─────────────────┤         ├─────────────────┤     │
│   │ • 审批流程单ID   │         │ • 审批流程单ID   │     │
│   │ • 入账日期      │         │ • 支出日期       │     │
│   │ • 入账金额      │         │ • 费用类别       │     │
│   │ • 发票号(可选)  │         │ • 支出金额       │     │
│   │ • 付款方(可选)  │         │ • 用途说明       │     │
│   │ • 附件(可选)    │         │ • 申请人        │     │
│   └─────────────────┘         │ • 附件(可选)     │     │
│                               └─────────────────┘     │
│                                                        │
│   ┌─────────────────────────────────────────────┐     │
│   │               权限控制                        │     │
│   ├─────────────────────────────────────────────┤     │
│   │ • 管理员/经理: 可查看记账人，可修改/删除所有   │     │
│   │ • 项目成员: 不可见记账人，只能修改自己的记录   │     │
│   └─────────────────────────────────────────────┘     │
│                                                        │
└───────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────┐
│              项目数据看板 (后续迭代)                    │
├───────────────────────────────────────────────────────┤
│ • 收入/支出汇总                                        │
│ • 预算执行情况                                         │
│ • 数据导出                                            │
└───────────────────────────────────────────────────────┘
```

### 状态流转图

```
┌─────────────────────────────────────────────────────────────────┐
│                    项目状态流转 (State Machine)                  │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
       创建项目 ──▶ │    draft     │ ◀── 可编辑
                    │   (草稿箱)    │
                    └──────┬───────┘
                           │ 提交
                           ▼
                    ┌──────────────┐
                    │  submitted   │ ◀── 可编辑
                    │   (已提交)    │
                    └──────┬───────┘
                           │ 上传审批单/标记完成
                           ▼
                    ┌──────────────┐
                    │  completed   │ ◀── 可编辑、可记账
                    │   (已完成)    │
                    └──────┬───────┘
                           │ 手工结项
                           ▼
                    ┌──────────────┐
                    │   closed     │ ◀── 不可编辑、不可记账
                    │   (已结项)    │
                    └──────────────┘

    ※ 管理员/项目经理可在任意状态关闭(删除)项目
    ※ 已完成和已结项状态支持复制项目
```

---

## 并发开发模块划分

| 模块 | 负责内容 | 依赖 | 可并行 |
|------|----------|------|--------|
| **模块A：基础设施** | Nuxt项目、数据库、公共API | 无 | 首先完成 |
| **模块B：项目管理** | 项目CRUD、状态流转、复制、文档生成 | 模块A | ✅ |
| **模块C：记账管理** | 记账CRUD、权限控制 | 模块A | ✅ |
| **模块D：配置管理** | 字典配置、成本配置 | 模块A | ✅ |
| **模块E：文件上传** | 上传API、存储管理 | 模块A | ✅ |

**开发顺序**：
1. Phase 1：模块A（基础设施）- 1人
2. Phase 2：模块B/C/D/E 并发开发 - 4人并行

---

# 模块A：基础设施

## A.1 业务需求
- 系统基础框架搭建
- 数据库初始化
- 公共中间件（鉴权、错误处理）
- 公共工具函数

## A.2 技术实现

### A.2.1 项目结构
```
baobiao/
├── server/
│   ├── api/                    # API路由
│   ├── middleware/             # 中间件
│   │   └── auth.ts            # 鉴权中间件
│   ├── utils/                  # 后端工具
│   │   ├── db.ts              # 数据库连接
│   │   ├── response.ts        # 统一响应格式
│   │   └── upload.ts          # 文件上传工具
│   └── plugins/               # 服务端插件
├── pages/                      # 页面
├── components/                 # 组件
├── composables/                # 组合式函数
├── types/                      # 类型定义
├── prisma/
│   └── schema.prisma          # 数据库Schema
├── uploads/                    # 上传文件目录（初期）
├── nuxt.config.ts
└── package.json
```

### A.2.2 数据库连接配置
```typescript
// server/utils/db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma
```

### A.2.3 统一响应格式
```typescript
// server/utils/response.ts
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

export function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, message, data }
}

export function error(message: string, code = -1): ApiResponse {
  return { code, message }
}
```

### A.2.4 依赖包
```json
{
  "dependencies": {
    "nuxt": "^3.x",
    "@prisma/client": "^5.x",
    "naive-ui": "^2.x",
    "echarts": "^5.x",
    "exceljs": "^4.x",
    "multer": "^1.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "typescript": "^5.x"
  }
}
```

---

# 模块B：项目管理

## B.1 业务需求

### B.1.1 项目状态定义

| 状态值 | 显示名 | 子状态 | 说明 |
|--------|--------|--------|------|
| draft | 立项中 | 草稿箱 | 编辑中，未提交 |
| submitted | 立项中 | 已提交 | 已提交待线下审批 |
| completed | 已完成 | - | 线下审批单已上传 |
| closed | 已结项 | - | 手工结项 |

### B.1.2 操作权限矩阵

| 状态 | 编辑 | 关闭/删除 | 记账 | 复制 | 结项 |
|------|------|-----------|------|------|------|
| draft | ✅ | ✅（管理员/经理） | ❌ | ❌ | ❌ |
| submitted | ✅ | ✅（管理员/经理） | ❌ | ❌ | ❌ |
| completed | ✅ | ✅（管理员/经理） | ✅ | ✅ | ✅ |
| closed | ❌ | ✅（管理员/经理） | ❌ | ✅ | ❌ |

**说明**：已提交和已完成状态均可编辑

### B.1.3 功能列表

| 功能 | 说明 |
|------|------|
| 项目列表 | 支持搜索（名称/客户/负责人），按时间倒序 |
| 创建项目 | 草稿状态 |
| 编辑项目 | draft/submitted/completed可编辑 |
| 关闭项目 | 管理员/经理可关闭任意状态项目 |
| 复制项目 | 全部字段保留，名称加"copy"后缀 |
| 状态变更 | 提交/完成/结项 |
| 文档导出 | 生成Excel，用于线下审批打印 |

### B.1.4 立项表单结构（已优化）

**Part 1: 项目基础信息**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| projectName | string | ✅ | 项目名称 |
| projectLeader | string | ✅ | 项目负责人 |
| clientName | string | ✅ | 客户名称 |
| projectType | string | ✅ | 项目类型 |
| serviceStartDate | date | ✅ | 服务开始日期 |
| serviceEndDate | date | ✅ | 服务结束日期 |
| projectMembers | string[] | ❌ | 项目成员（使用现成组件） |
| projectBackground | text | ❌ | 项目背景 |
| clientDemand | text | ❌ | 客户需求 |
| serviceContent | text | ❌ | 服务内容 |

**Part 2: 服务收入（已优化）**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| purchaseContent | string | ✅ | 采购内容（字典配置） |
| necessityDesc | text | ✅ | 必要性描述 |
| amount | number | ✅ | 含税金额 |
| taxRate | number | ✅ | 税率（手输） |

**Part 3: 线下外采成本**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | ✅ | 采购内容 |
| unitPrice | number | ✅ | 单价 |
| quantity | number | ✅ | 数量 |

**Part 4: 人工成本**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| employeeId | string | ✅ | 员工ID（使用现成组件） |
| employeeName | string | ✅ | 员工姓名 |
| level | string | ✅ | 员工级别 |
| dailyCost | number | ✅ | 日成本（从配置读取） |
| days | number | ✅ | 投入天数 |

**Part 5: 其他费用**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | ✅ | 费用类型 |
| amount | number | ✅ | 金额 |

---

## B.2 技术实现

### B.2.1 数据库表

**项目表 (projects)**
```sql
CREATE TABLE projects (
  id VARCHAR(36) PRIMARY KEY,
  project_name VARCHAR(200) NOT NULL COMMENT '项目名称',
  project_leader VARCHAR(100) NOT NULL COMMENT '负责人',
  client_name VARCHAR(200) COMMENT '客户名称',
  project_type VARCHAR(100) COMMENT '项目类型',
  service_start_date DATE COMMENT '服务开始日期',
  service_end_date DATE COMMENT '服务结束日期',
  service_amount DECIMAL(15,2) DEFAULT 0 COMMENT '服务总金额',
  status ENUM('draft', 'submitted', 'completed', 'closed') DEFAULT 'draft' COMMENT '状态',
  form_data JSON COMMENT '完整立项表单JSON',
  created_by VARCHAR(36) COMMENT '创建人',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_leader (project_leader),
  INDEX idx_created (created_at DESC)
) COMMENT '项目表';
```

**项目成员表 (project_members)**
```sql
CREATE TABLE project_members (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
  user_id VARCHAR(36) NOT NULL COMMENT '用户ID',
  user_name VARCHAR(100) COMMENT '用户姓名',
  role ENUM('manager', 'member') NOT NULL COMMENT '角色：经理/成员',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY uk_project_user (project_id, user_id)
) COMMENT '项目成员表';
```

### B.2.2 TypeScript类型

```typescript
// types/project.ts

export type ProjectStatus = 'draft' | 'submitted' | 'completed' | 'closed'

export interface Project {
  id: string
  projectName: string
  projectLeader: string
  clientName: string
  projectType: string
  serviceStartDate: string
  serviceEndDate: string
  serviceAmount: number
  status: ProjectStatus
  formData: ProjectFormData
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  basicInfo: {
    projectName: string
    projectLeader: string
    clientName: string
    projectType: string
    serviceStartDate: string
    serviceEndDate: string
    projectMembers: string[]
    projectBackground: string
    clientDemand: string
    serviceContent: string
  }
  serviceIncome: ServiceIncomeItem[]
  outsourcingCost: OutsourcingCostItem[]
  laborCost: LaborCostItem[]
  otherExpenses: OtherExpenseItem[]
}

export interface ServiceIncomeItem {
  id: string
  purchaseContent: string      // 采购内容（字典）
  necessityDesc: string        // 必要性描述
  amount: number               // 含税金额
  taxRate: number              // 税率
}

export interface OutsourcingCostItem {
  id: string
  content: string
  unitPrice: number
  quantity: number
}

export interface LaborCostItem {
  id: string
  employeeId: string
  employeeName: string
  level: string
  dailyCost: number
  days: number
}

export interface OtherExpenseItem {
  id: string
  category: string
  amount: number
}
```

### B.2.3 API接口

| 方法 | 路径 | 说明 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | /api/projects | 项目列表 | ?keyword=&status=&page=&size= | Project[] |
| GET | /api/projects/:id | 项目详情 | - | Project |
| POST | /api/projects | 创建项目 | ProjectFormData | Project |
| PUT | /api/projects/:id | 更新项目 | ProjectFormData | Project |
| DELETE | /api/projects/:id | 删除/关闭项目 | - | - |
| POST | /api/projects/:id/copy | 复制项目 | - | Project |
| PUT | /api/projects/:id/status | 状态变更 | { status } | Project |
| GET | /api/projects/:id/export | 导出Excel | - | file stream |

### B.2.4 API实现示例

```typescript
// server/api/projects/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { keyword, status, page = 1, size = 20 } = query
  
  const where: any = {}
  if (status) where.status = status
  if (keyword) {
    where.OR = [
      { projectName: { contains: keyword } },
      { clientName: { contains: keyword } },
      { projectLeader: { contains: keyword } }
    ]
  }
  
  const [total, list] = await Promise.all([
    prisma.projects.count({ where }),
    prisma.projects.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * size,
      take: size
    })
  ])
  
  return success({ total, list, page, size })
})
```

```typescript
// server/api/projects/[id]/copy.post.ts
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const original = await prisma.projects.findUnique({ where: { id } })
  
  if (!original) {
    return error('项目不存在')
  }
  
  const formData = original.formData as any
  formData.basicInfo.projectName = `${formData.basicInfo.projectName} copy`
  
  const newProject = await prisma.projects.create({
    data: {
      id: generateId(),
      ...original,
      id: undefined,
      status: 'draft',
      formData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  
  return success(newProject)
})
```

---

# 模块C：记账管理

## C.1 业务需求

### C.1.1 记账类型

| 类型 | 说明 | 操作权限 |
|------|------|----------|
| income | 收入记账 | 管理员、项目经理 |
| expense | 支出记账 | 管理员、项目经理、项目成员 |

### C.1.2 记账权限矩阵

| 角色 | 收入记账 | 支出记账 | 查看记录 | 查看记账人 | 修改记录 | 删除记录 |
|------|----------|----------|----------|------------|----------|----------|
| 管理员 | ✅ | ✅ | ✅ 全部 | ✅ | ✅ 全部 | ✅ 全部 |
| 项目经理 | ✅ | ✅ | ✅ 全部 | ✅ | ✅ 全部 | ✅ 全部 |
| 项目成员 | ❌ | ✅ | ✅ 全部 | ❌ | ✅ 仅自己 | ❌ |

**说明**：项目成员可查看所有记账记录，但看不到记账人是谁

### C.1.3 业务规则

| 规则 | 说明 |
|------|------|
| 审批流程 | 不需要审批，直接入账 |
| 费用类别 | 从字典获取，支持配置 |
| 凭证附件 | 可选上传，不必填 |
| 预算挂钩 | 不挂钩，不做校验 |
| 记录修改 | 支持修改，不需审批 |

### C.1.4 字段定义

**收入记账**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| approvalId | string | ✅ | 审批流程单ID（手填） |
| recordDate | date | ✅ | 入账日期 |
| amount | number | ✅ | 入账金额 |
| invoiceNo | string | ❌ | 发票号 |
| payer | string | ❌ | 付款方 |
| attachments | file[] | ❌ | 凭证附件 |
| remark | string | ❌ | 备注 |

**支出记账**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| approvalId | string | ✅ | 审批流程单ID（手填） |
| recordDate | date | ✅ | 支出日期 |
| categoryId | string | ✅ | 费用类别 |
| amount | number | ✅ | 支出金额 |
| description | string | ✅ | 用途说明 |
| applicant | string | ✅ | 申请人 |
| attachments | file[] | ❌ | 凭证附件 |
| remark | string | ❌ | 备注 |

---

## C.2 技术实现

### C.2.1 数据库表

**记账表 (accounting_records)**
```sql
CREATE TABLE accounting_records (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NOT NULL COMMENT '项目ID',
  record_type ENUM('income', 'expense') NOT NULL COMMENT '类型：收入/支出',
  approval_id VARCHAR(100) NOT NULL COMMENT '审批流程单ID',
  record_date DATE NOT NULL COMMENT '记账日期',
  amount DECIMAL(15,2) NOT NULL COMMENT '金额',
  category_id VARCHAR(36) COMMENT '费用类别ID（支出）',
  description TEXT COMMENT '用途说明',
  applicant VARCHAR(100) COMMENT '申请人',
  invoice_no VARCHAR(100) COMMENT '发票号（收入）',
  payer VARCHAR(200) COMMENT '付款方（收入）',
  attachments JSON COMMENT '附件URL数组',
  remark TEXT COMMENT '备注',
  created_by VARCHAR(36) NOT NULL COMMENT '记账人',
  created_by_name VARCHAR(100) COMMENT '记账人姓名',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project (project_id),
  INDEX idx_type (record_type),
  INDEX idx_date (record_date)
) COMMENT '记账表';
```

### C.2.2 TypeScript类型

```typescript
// types/accounting.ts

export type RecordType = 'income' | 'expense'

export interface AccountingRecord {
  id: string
  projectId: string
  recordType: RecordType
  approvalId: string
  recordDate: string
  amount: number
  categoryId?: string
  categoryName?: string
  description?: string
  applicant?: string
  invoiceNo?: string
  payer?: string
  attachments?: string[]
  remark?: string
  createdBy: string
  createdByName?: string  // 仅管理员/经理可见
  createdAt: string
  updatedAt: string
}

export interface CreateIncomeRecordDTO {
  approvalId: string
  recordDate: string
  amount: number
  invoiceNo?: string
  payer?: string
  attachments?: string[]
  remark?: string
}

export interface CreateExpenseRecordDTO {
  approvalId: string
  recordDate: string
  categoryId: string
  amount: number
  description: string
  applicant: string
  attachments?: string[]
  remark?: string
}
```

### C.2.3 API接口

| 方法 | 路径 | 说明 | 请求参数 | 响应 |
|------|------|------|----------|------|
| GET | /api/projects/:id/records | 记账列表 | ?type=&page=&size= | AccountingRecord[] |
| POST | /api/projects/:id/records | 新增记账 | CreateRecordDTO | AccountingRecord |
| PUT | /api/records/:id | 修改记账 | UpdateRecordDTO | AccountingRecord |
| DELETE | /api/records/:id | 删除记账 | - | - |

### C.2.4 权限控制实现

```typescript
// server/api/projects/[projectId]/records.get.ts
export default defineEventHandler(async (event) => {
  const projectId = event.context.params?.projectId
  const userId = event.context.user?.id
  const userRole = await getUserRoleInProject(projectId, userId)
  
  const records = await prisma.accountingRecords.findMany({
    where: { projectId },
    orderBy: { recordDate: 'desc' }
  })
  
  // 项目成员隐藏记账人信息
  if (userRole === 'member') {
    return success(records.map(r => ({
      ...r,
      createdBy: undefined,
      createdByName: undefined
    })))
  }
  
  return success(records)
})
```

```typescript
// server/api/records/[id].put.ts
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const userId = event.context.user?.id
  const body = await readBody(event)
  
  const record = await prisma.accountingRecords.findUnique({ where: { id } })
  if (!record) return error('记录不存在')
  
  const userRole = await getUserRoleInProject(record.projectId, userId)
  
  // 成员只能修改自己的记录
  if (userRole === 'member' && record.createdBy !== userId) {
    return error('无权限修改此记录')
  }
  
  const updated = await prisma.accountingRecords.update({
    where: { id },
    data: { ...body, updatedAt: new Date() }
  })
  
  return success(updated)
})
```

---

# 模块D：配置管理

## D.1 业务需求

### D.1.1 费用类别字典
- 管理员可增删改
- 支持删除（已使用的类别也可删除）
- 按排序号排序

### D.1.2 采购内容字典（新增）
- 用于服务收入的采购内容选择
- 管理员可增删改

### D.1.3 员工成本配置
- 按员工级别配置日成本
- 数据结构：级别 → 日成本（key-value）
- 无生效时间范围

---

## D.2 技术实现

### D.2.1 数据库表

**费用类别字典 (expense_categories)**
```sql
CREATE TABLE expense_categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL COMMENT '类别名称',
  sort_order INT DEFAULT 0 COMMENT '排序号',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '费用类别字典';
```

**采购内容字典 (purchase_contents)**
```sql
CREATE TABLE purchase_contents (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(200) NOT NULL COMMENT '采购内容名称',
  sort_order INT DEFAULT 0 COMMENT '排序号',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT '采购内容字典';
```

**员工成本配置 (employee_cost_config)**
```sql
CREATE TABLE employee_cost_config (
  id VARCHAR(36) PRIMARY KEY,
  level_key VARCHAR(50) NOT NULL COMMENT '级别标识',
  level_name VARCHAR(100) NOT NULL COMMENT '级别名称',
  daily_cost DECIMAL(10,2) NOT NULL COMMENT '日成本',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_level (level_key)
) COMMENT '员工成本配置';
```

### D.2.2 TypeScript类型

```typescript
// types/config.ts

export interface ExpenseCategory {
  id: string
  name: string
  sortOrder: number
}

export interface PurchaseContent {
  id: string
  name: string
  sortOrder: number
}

export interface EmployeeCostConfig {
  id: string
  levelKey: string
  levelName: string
  dailyCost: number
}
```

### D.2.3 API接口

**费用类别**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/dict/expense-categories | 列表 |
| POST | /api/dict/expense-categories | 新增 |
| PUT | /api/dict/expense-categories/:id | 更新 |
| DELETE | /api/dict/expense-categories/:id | 删除 |

**采购内容**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/dict/purchase-contents | 列表 |
| POST | /api/dict/purchase-contents | 新增 |
| PUT | /api/dict/purchase-contents/:id | 更新 |
| DELETE | /api/dict/purchase-contents/:id | 删除 |

**员工成本配置**
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/config/employee-costs | 列表 |
| POST | /api/config/employee-costs | 新增 |
| PUT | /api/config/employee-costs/:id | 更新 |
| DELETE | /api/config/employee-costs/:id | 删除 |

---

# 模块E：文件上传

## E.1 业务需求

### E.1.1 上传场景
- 记账凭证附件上传（可选）
- 支持图片（jpg/png）和PDF
- 单文件大小限制：10MB

### E.1.2 存储方案
- **初期**：本地服务器 `/uploads` 目录
- **后期**：迁移至华为云OBS

---

## E.2 技术实现

### E.2.1 API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload | 上传文件 |
| GET | /api/upload/:filename | 获取文件 |
| DELETE | /api/upload/:filename | 删除文件 |

### E.2.2 上传实现

```typescript
// server/api/upload.post.ts
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  const file = formData?.find(f => f.name === 'file')
  
  if (!file) {
    return error('未选择文件')
  }
  
  // 检查文件大小 (10MB)
  if (file.data.length > 10 * 1024 * 1024) {
    return error('文件大小不能超过10MB')
  }
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
  if (!allowedTypes.includes(file.type || '')) {
    return error('仅支持jpg/png/pdf格式')
  }
  
  // 生成文件名
  const ext = file.filename?.split('.').pop() || 'bin'
  const filename = `${randomUUID()}.${ext}`
  
  // 保存文件
  const uploadDir = join(process.cwd(), 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), file.data)
  
  const url = `/api/upload/${filename}`
  return success({ filename, url })
})
```

```typescript
// server/api/upload/[filename].get.ts
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const filename = event.context.params?.filename
  const filepath = join(process.cwd(), 'uploads', filename!)
  
  if (!existsSync(filepath)) {
    throw createError({ statusCode: 404, message: '文件不存在' })
  }
  
  return sendStream(event, createReadStream(filepath))
})
```

---

# 开发计划与分工

## 并发开发时间线

```
Week 1:
├── 模块A（基础设施）────────────────┤ 完成后其他模块开始

Week 2-3:
├── 模块B（项目管理）────────────────────────────┤
├── 模块C（记账管理）────────────────────────────┤
├── 模块D（配置管理）──────────┤
├── 模块E（文件上传）──────────┤

Week 4:
├── 联调测试 ────────────────────────────────────┤
```

## 模块间依赖关系

```
模块A（基础设施）
    ↓
    ├── 模块B（项目管理）
    │       ↓
    │   模块C（记账管理）← 依赖项目ID
    │
    ├── 模块D（配置管理）← 模块B/C需要字典
    │
    └── 模块E（文件上传）← 模块C需要上传
```

## 验证清单

### 模块A验证
- [ ] Nuxt项目启动正常
- [ ] 数据库连接成功
- [ ] Prisma迁移执行成功

### 模块B验证
- [ ] 项目CRUD正常
- [ ] 搜索功能正常
- [ ] 状态流转正确
- [ ] 复制功能正常（名称带copy）
- [ ] 关闭功能正常
- [ ] Excel导出正常

### 模块C验证
- [ ] 收入/支出记账正常
- [ ] 权限控制正确（成员看不到记账人）
- [ ] 修改/删除权限正确
- [ ] 附件上传关联正常

### 模块D验证
- [ ] 费用类别CRUD正常
- [ ] 采购内容CRUD正常
- [ ] 员工成本配置正常

### 模块E验证
- [ ] 文件上传成功
- [ ] 文件大小限制生效
- [ ] 文件类型限制生效
- [ ] 文件下载正常

---

*文档版本：v1.1*
*更新日期：2026-02-02*
*状态：评审完成，可开始开发*
