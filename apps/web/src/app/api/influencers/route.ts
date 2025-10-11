import { NextResponse } from 'next/server';
import { Prisma } from 'database';
import { prisma } from '@/lib/prisma';
import { influencerSearchSchema } from '@/lib/validations/influencer';
import type { InfluencerSearchResponse, PaginationMetadata } from '@/lib/validations/influencer';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert URLSearchParams to object for validation
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validation = influencerSearchSchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      keyword,
      category,
      platform,
      minFollowers,
      maxFollowers,
      minEngagement,
      maxEngagement,
      location,
      page,
      limit,
      sortBy,
      sortOrder,
    } = validation.data;

    // Build where clause dynamically
    const where: Prisma.InfluencerWhereInput = {
      isActive: true, // Only show active influencers
      AND: [],
    };

    // Keyword search (name, bio, topics)
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { bio: { contains: keyword, mode: 'insensitive' } },
        { topics: { has: keyword } },
      ];
    }

    // Category search (in topics array)
    if (category) {
      where.topics = { has: category };
    }

    // Platform filter
    if (platform) {
      where.platforms = { has: platform };
    }

    // Followers range
    if (minFollowers !== undefined || maxFollowers !== undefined) {
      where.followers = {};
      if (minFollowers !== undefined) {
        where.followers.gte = minFollowers;
      }
      if (maxFollowers !== undefined) {
        where.followers.lte = maxFollowers;
      }
    }

    // Engagement rate range
    if (minEngagement !== undefined || maxEngagement !== undefined) {
      where.engagementRate = {};
      if (minEngagement !== undefined) {
        where.engagementRate.gte = minEngagement;
      }
      if (maxEngagement !== undefined) {
        where.engagementRate.lte = maxEngagement;
      }
    }

    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build orderBy clause
    const orderBy: Prisma.InfluencerOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute queries in parallel
    const [influencers, total] = await Promise.all([
      prisma.influencer.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          externalId: true,
          name: true,
          gender: true,
          age: true,
          platforms: true,
          followers: true,
          engagementRate: true,
          avgLikes: true,
          avgComments: true,
          topics: true,
          location: true,
          bio: true,
          profileImageUrl: true,
          email: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      prisma.influencer.count({ where }),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationMetadata = {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    };

    const response: InfluencerSearchResponse = {
      data: influencers,
      pagination,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Influencer search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}