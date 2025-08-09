// lib/db.ts or src/db.ts
// import { PrismaClient } from "@/prisma/prismaClient"
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'], // Optional: remove in production
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
