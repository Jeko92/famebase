import { PrismaClient, Gender, Platform } from '@prisma/client';
import influencerData from '../../../influencer_liste.json';
import postsData from '../../../influencer_posts.json';

const prisma = new PrismaClient();

// Mapping function to convert JSON data to Prisma types
function mapGender(gender: string): Gender {
    switch (gender.toLowerCase()) {
        case 'male':
            return Gender.MALE;
        case 'female':
            return Gender.FEMALE;
        case 'non-binary':
            return Gender.NON_BINARY;
        default:
            return Gender.OTHER;
    }
}

function mapPlatforms(platforms: string[]): Platform[] {
    return platforms.map((p) => {
        switch (p.toUpperCase()) {
            case 'INSTAGRAM':
                return Platform.INSTAGRAM;
            case 'YOUTUBE':
                return Platform.YOUTUBE;
            case 'TIKTOK':
                return Platform.TIKTOK;
            case 'TWITCH':
                return Platform.TWITCH;
            case 'TWITTER':
                return Platform.TWITTER;
            case 'LINKEDIN':
                return Platform.LINKEDIN;
            case 'FACEBOOK':
                return Platform.FACEBOOK;
            default:
                return Platform.INSTAGRAM;
        }
    });
}

async function main() {
    // Clear existing data
    await prisma.favorite.deleteMany();
    await prisma.list.deleteMany();
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.influencerImage.deleteMany();
    await prisma.influencer.deleteMany();
    await prisma.campaign.deleteMany();

    // Seed influencers
    for (const influencer of influencerData) {
        await prisma.influencer.create({
            data: {
                externalId: influencer.id,
                name: influencer.name,
                gender: mapGender(influencer.gender),
                age: influencer.age,
                platforms: mapPlatforms(influencer.platform),
                followers: influencer.followers,
                engagementRate: influencer.engagementRate,
                avgLikes: influencer.avgLikes,
                avgComments: influencer.avgComments,
                topics: influencer.topics,
                location: influencer.location,
                email: `${influencer.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
                isVerified: influencer.followers > 100000,
                isActive: true,
                profileImageUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=${influencer.name}`,
            },
        });
    }

    // Create sample posts for influencers
    const allInfluencers = await prisma.influencer.findMany();

    for (const influencer of allInfluencers) {
        const numPosts = Math.floor(Math.random() * 3) + 3;
        const platforms = influencer.platforms;

        for (let i = 0; i < numPosts; i++) {
            const platform = platforms[Math.floor(Math.random() * platforms.length)];
            const postData = postsData[i % postsData.length];
            const daysAgo = Math.floor(Math.random() * 90);
            const postedDate = new Date();
            postedDate.setDate(postedDate.getDate() - daysAgo);

            const baseLikes = Math.floor(influencer.avgLikes * (0.7 + Math.random() * 0.6));
            const baseComments = Math.floor(influencer.avgComments * (0.7 + Math.random() * 0.6));

            await prisma.post.create({
                data: {
                    influencerId: influencer.id,
                    platform: platform,
                    caption: postData.caption,
                    imageUrl: `${postData.imageUrl}?w=600&h=600&fit=crop`,
                    postUrl: `https://${platform.toLowerCase()}.com/p/${influencer.name.toLowerCase().replace(/\s+/g, '')}/${Math.random().toString(36).substring(7)}`,
                    likes: baseLikes,
                    comments: baseComments,
                    views: platform === 'YOUTUBE' || platform === 'TIKTOK' ? Math.floor(baseLikes * 10) : null,
                    shares: Math.floor(baseComments * 0.5),
                    postedAt: postedDate,
                },
            });
        }
    }

    // Create some sample campaigns
    await prisma.campaign.create({
        data: {
            name: 'Summer Beauty Campaign 2025',
            description: 'Looking for beauty influencers for summer product launch',
            budget: 50000,
            startDate: new Date('2025-06-01'),
            endDate: new Date('2025-08-31'),
            status: 'ACTIVE',
            targetTopics: ['Beauty', 'Skincare', 'Vegan'],
            targetPlatforms: [Platform.INSTAGRAM, Platform.YOUTUBE],
            minFollowers: 100000,
            maxFollowers: 500000,
        },
    });

    await prisma.campaign.create({
        data: {
            name: 'Tech Product Review Q4',
            description: 'Gaming and tech influencers needed for new product reviews',
            budget: 30000,
            startDate: new Date('2025-10-01'),
            endDate: new Date('2025-12-31'),
            status: 'DRAFT',
            targetTopics: ['Tech', 'Gaming', 'Gadgets'],
            targetPlatforms: [Platform.YOUTUBE, Platform.TWITCH],
            minFollowers: 80000,
        },
    });

    // Create sample users
    const user1 = await prisma.user.create({
        data: {
            email: 'john.doe@example.com',
            password: '$2a$10$dummyhashedpassword1', // In real app, use bcrypt
            name: 'John Doe',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'jane.smith@example.com',
            password: '$2a$10$dummyhashedpassword2',
            name: 'Jane Smith',
        },
    });

    // Get first 5 influencers for favorites
    const influencers = await prisma.influencer.findMany({
        take: 5,
    });

    // Create favorites for user1
    for (let i = 0; i < 3; i++) {
        if (influencers[i]) {
            await prisma.favorite.create({
                data: {
                    userId: user1.id,
                    influencerId: influencers[i].id,
                },
            });
        }
    }

    // Create favorites for user2
    for (let i = 2; i < 5; i++) {
        if (influencers[i]) {
            await prisma.favorite.create({
                data: {
                    userId: user2.id,
                    influencerId: influencers[i].id,
                },
            });
        }
    }

    // Create sample lists
    await prisma.list.create({
        data: {
            name: 'My Top Influencers',
            description: 'Favorite influencers for my campaigns',
            userId: user1.id,
        },
    });

    await prisma.list.create({
        data: {
            name: 'Beauty Influencers',
            description: 'Curated list of beauty content creators',
            userId: user2.id,
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    });