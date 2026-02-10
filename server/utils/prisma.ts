import { PrismaClient } from '@prisma/client'

// PrismaClient 单例，防止开发环境热重载重复实例化
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient()
  }
  // @ts-ignore
  prisma = global.prisma
}

export default prisma
