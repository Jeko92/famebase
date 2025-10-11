import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Influencer ID is required' },
        { status: 400 }
      );
    }

    // Fetch influencer with their posts
    const influencer = await prisma.influencer.findUnique({
      where: {
        id,
        isActive: true,
      },
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
        phoneNumber: true,
        website: true,
        isVerified: true,
        createdAt: true,
        posts: {
          orderBy: {
            postedAt: 'desc',
          },
          take: 6, // Limit to 6 most recent posts
          select: {
            id: true,
            platform: true,
            caption: true,
            imageUrl: true,
            postUrl: true,
            likes: true,
            comments: true,
            views: true,
            shares: true,
            postedAt: true,
          },
        },
      },
    });

    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: influencer }, { status: 200 });
  } catch (error) {
    console.error('Error fetching influencer details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}