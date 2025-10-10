import { PrismaClient, Gender, Platform } from '@prisma/client';
import influencerData from '../../../influencer_liste.json';
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
    console.log('Starting database seed...');

    // Clear existing data
    await prisma.favorite.deleteMany();
    await prisma.list.deleteMany();
    await prisma.user.deleteMany();
    await prisma.influencerImage.deleteMany();
    await prisma.influencer.deleteMany();
    await prisma.campaign.deleteMany();

    console.log('Cleared existing data');

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
                // Set profile image URL
                profileImageUrl: `https://api.dicebear.com/7.x/avataaars/png?seed=${influencer.name}`,
            },
        });

        console.log(`Created influencer: ${influencer.name}`);
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

    console.log('Created sample users');

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

    console.log('Created sample favorites');

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

    console.log('Created sample lists');

    console.log('Seeding completed successfully!');

    // Print summary
    const influencerCount = await prisma.influencer.count();
    const imageCount = await prisma.influencerImage.count();
    const campaignCount = await prisma.campaign.count();
    const userCount = await prisma.user.count();
    const favoriteCount = await prisma.favorite.count();
    const listCount = await prisma.list.count();

    console.log('\n📊 Database Summary:');
    console.log(`   Influencers: ${influencerCount}`);
    console.log(`   Images: ${imageCount}`);
    console.log(`   Campaigns: ${campaignCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Favorites: ${favoriteCount}`);
    console.log(`   Lists: ${listCount}`);
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