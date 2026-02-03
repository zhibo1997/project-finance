import { PrismaClient } from '@prisma/client'

// 全局单例 Prisma 客户端
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // 在开发环境中，确保只创建一个 Prisma 实例
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
