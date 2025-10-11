import type { InfluencerSearchParams, InfluencerSearchResponse } from '@/lib/validations/influencer';

// Post interface for detail view
export interface Post {
  id: string;
  platform: string;
  caption: string | null;
  imageUrl: string;
  postUrl: string | null;
  likes: number;
  comments: number;
  views: number | null;
  shares: number | null;
  postedAt: Date;
}

// Detailed influencer response
export interface InfluencerDetailData {
  id: string;
  externalId: string | null;
  name: string;
  gender: string;
  age: number;
  platforms: string[];
  followers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  topics: string[];
  location: string;
  bio: string | null;
  profileImageUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
  website: string | null;
  isVerified: boolean;
  createdAt: Date;
  posts: Post[];
}

export interface InfluencerDetailResponse {
  data: InfluencerDetailData;
}

export async function searchInfluencers(
  params: Partial<InfluencerSearchParams>
): Promise<InfluencerSearchResponse> {
  // Build query string
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`/api/influencers?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch influencers');
  }

  return response.json();
}

// Fetch single influencer with details
export async function getInfluencer(id: string): Promise<InfluencerDetailResponse> {
  const response = await fetch(`/api/influencers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch influencer details');
  }

  return response.json();
}

// Helper to get default search params
export function getDefaultSearchParams(): Partial<InfluencerSearchParams> {
  return {
    page: 1,
    limit: 20,
    sortBy: 'followers',
    sortOrder: 'desc',
  };
}