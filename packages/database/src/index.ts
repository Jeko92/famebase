import { PrismaClient, Platform } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for common queries
export const influencerQueries = {
    findByTopic: async (topic: string) => {
        return prisma.influencer.findMany({
            where: {
                topics: {
                    has: topic,
                },
                isActive: true,
            },
            include: {
                images: {
                    where: { isPublic: true },
                    orderBy: { order: 'asc' },
                },
            },
        });
    },

    findByPlatform: async (platform: Platform) => {
        return prisma.influencer.findMany({
            where: {
                platforms: {
                    has: platform,
                },
                isActive: true,
            },
        });
    },

    findByEngagementRange: async (min: number, max: number) => {
        return prisma.influencer.findMany({
            where: {
                engagementRate: {
                    gte: min,
                    lte: max,
                },
                isActive: true,
            },
            orderBy: {
                engagementRate: 'desc',
            },
        });
    },
};

export * from '@prisma/client';