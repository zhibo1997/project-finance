```
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
```

## Project Overview

**Project Finance System** - A comprehensive financial management system for tracking project budgets, expenses, and accounting records. Built with Nuxt 4 + Vue 3 + TypeScript + Prisma + MySQL.

## Development Commands

### Core Development
- `npm run dev`: Start development server (host: 0.0.0.0, port: 3000)
- `npm run build`: Build for production
- `npm run generate`: Generate static site
- `npm run preview`: Preview production build
- `npm run postinstall`: Prepare Nuxt environment (runs automatically after install)

### Database Management (Prisma)
- `npm run prisma:init`: Initialize Prisma configuration
- `npm run prisma:migrate`: Create and apply database migrations
- `npm run prisma:studio`: Open Prisma Studio (database GUI)

## Project Architecture

### Directory Structure
```
project-finance/
├── app/                          # Client-side application (Nuxt app directory)
│   ├── app.vue                   # Root component
│   ├── components/               # Reusable Vue components
│   │   ├── BudgetRow.vue         # Budget item component
│   │   ├── MetricCard.vue        # Metric display card
│   │   ├── ChartsView.vue        # Charts visualization
│   │   ├── Header.vue            # Page header
│   │   └── ListView.vue          # List/table view
│   ├── composables/              # Vue composables
│   │   └── useAuth.ts            # Authentication composable
│   ├── data/                     # Mock data (for development)
│   │   ├── projectListData.ts
│   │   └── projectData.ts
│   ├── layouts/                  # Page layouts
│   │   └── default.vue           # Default layout
│   ├── pages/                    # Nuxt pages (file-based routing)
│   │   ├── index.vue             # Dashboard/home page
│   │   ├── records/              # Records management
│   │   │   └── index.vue
│   │   ├── config/               # Configuration
│   │   │   └── index.vue
│   │   └── projects/             # Projects management
│   │       ├── index.vue
│   │       ├── create.vue
│   │       ├── apply.vue
│   │       └── [id]/             # Dynamic project routes
│   └── types/                    # TypeScript type definitions
│       └── user.ts
├── server/                       # Server-side code (Nuxt server directory)
│   ├── api/                      # API endpoints (file-based routing)
│   │   ├── upload.post.ts        # File upload
│   │   ├── records/              # Records API
│   │   ├── config/               # Configuration API
│   │   ├── projects/             # Projects API
│   │   └── dict/                 # Dictionary API (expense categories, purchase contents)
│   ├── middleware/               # Server middleware
│   │   └── auth.ts               # Authentication middleware
│   └── utils/                    # Server utilities
│       ├── db.ts                 # Prisma client instance
│       ├── auth.ts               # Authentication utilities
│       └── response.ts           # Response helpers
├── prisma/                       # Prisma ORM
│   └── schema.prisma            # Database schema definition
├── config/                      # Configuration files
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── nuxt.config.ts              # Nuxt configuration
```

### Tech Stack

**Frontend:**
- Nuxt 4.x (Vue 3 framework)
- Vue 3.x with `<script setup>` syntax
- TypeScript 5.4.x
- ECharts for data visualization
- ExcelJS for Excel export
- Lucide Vue for icons
- @nuxt/ui (UI components)

**Backend:**
- Nuxt Server API (Nitro server engine)
- Prisma ORM 5.x
- MySQL database

**Key Features:**
1. Project management (create, edit, delete, copy, status management)
2. Project members management
3. Accounting records management (income/expense tracking)
4. Budget management
5. Financial reports and charts (income vs expense, category breakdown)
6. Data export (Excel)
7. Configuration management (employee costs, expense categories, purchase contents)
8. File upload functionality

### Database Schema

**Main Tables:**
- `projects`: Project information (name, leader, client, dates, status, budget)
- `project_members`: Project members and roles
- `accounting_records`: Financial records (income/expense, amount, category, date)
- `expense_categories`: Expense categories dictionary
- `purchase_contents`: Purchase contents dictionary
- `employee_cost_config`: Employee daily cost configuration

### API Structure

All API endpoints follow RESTful patterns with:
- GET: Retrieve data
- POST: Create data
- PUT: Update data
- DELETE: Delete data

Key endpoints:
- `/api/projects`: Projects CRUD operations
- `/api/records`: Accounting records CRUD
- `/api/config/employee-costs`: Employee cost configuration
- `/api/dict/expense-categories`: Expense categories
- `/api/dict/purchase-contents`: Purchase contents

### Authentication

- Server-side middleware: `server/middleware/auth.ts`
- Client-side composable: `app/composables/useAuth.ts`

### Response Format

All API responses follow a standard format with `success`, `message`, and `data` fields (see `server/utils/response.ts`).
