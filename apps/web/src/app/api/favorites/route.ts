import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addFavoriteSchema, FavoriteWithInfluencer } from '@/lib/validations/favorite';

/**
 * GET /api/favorites
 * Get all favorites for the authenticated user
 */
export async function GET() {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch favorites with influencer details
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        influencer: {
          select: {
            id: true,
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
            isVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match the FavoriteWithInfluencer type
    const formattedFavorites: FavoriteWithInfluencer[] = favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      influencerId: fav.influencerId,
      createdAt: fav.createdAt.toISOString(),
      influencer: {
        id: fav.influencer.id,
        name: fav.influencer.name,
        gender: fav.influencer.gender,
        age: fav.influencer.age,
        platforms: fav.influencer.platforms,
        followers: fav.influencer.followers,
        engagementRate: fav.influencer.engagementRate,
        avgLikes: fav.influencer.avgLikes,
        avgComments: fav.influencer.avgComments,
        topics: fav.influencer.topics,
        location: fav.influencer.location,
        bio: fav.influencer.bio,
        profileImageUrl: fav.influencer.profileImageUrl,
        isVerified: fav.influencer.isVerified,
      },
    }));

    return NextResponse.json({
      favorites: formattedFavorites,
      total: formattedFavorites.length,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/favorites
 * Add an influencer to favorites
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = addFavoriteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.errors },
        { status: 400 }
      );
    }

    const { influencerId } = result.data;

    // Check if influencer exists
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
    });

    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_influencerId: {
          userId: session.user.id,
          influencerId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Influencer already in favorites' },
        { status: 409 }
      );
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        influencerId,
      },
      include: {
        influencer: {
          select: {
            id: true,
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
            isVerified: true,
          },
        },
      },
    });

    const formattedFavorite: FavoriteWithInfluencer = {
      id: favorite.id,
      userId: favorite.userId,
      influencerId: favorite.influencerId,
      createdAt: favorite.createdAt.toISOString(),
      influencer: {
        id: favorite.influencer.id,
        name: favorite.influencer.name,
        gender: favorite.influencer.gender,
        age: favorite.influencer.age,
        platforms: favorite.influencer.platforms,
        followers: favorite.influencer.followers,
        engagementRate: favorite.influencer.engagementRate,
        avgLikes: favorite.influencer.avgLikes,
        avgComments: favorite.influencer.avgComments,
        topics: favorite.influencer.topics,
        location: favorite.influencer.location,
        bio: favorite.influencer.bio,
        profileImageUrl: favorite.influencer.profileImageUrl,
        isVerified: favorite.influencer.isVerified,
      },
    };

    return NextResponse.json(
      { favorite: formattedFavorite },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/favorites
 * Remove an influencer from favorites
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get influencerId from URL search params
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get('influencerId');

    if (!influencerId) {
      return NextResponse.json(
        { error: 'Influencer ID is required' },
        { status: 400 }
      );
    }

    // Find and delete the favorite
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_influencerId: {
          userId: session.user.id,
          influencerId,
        },
      },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}