import { z } from 'zod';

// Platform enum from Prisma
export const platformEnum = z.enum([
  'INSTAGRAM',
  'YOUTUBE',
  'TIKTOK',
  'TWITCH',
  'TWITTER',
  'LINKEDIN',
  'FACEBOOK',
]);

// Sort options
export const sortByEnum = z.enum(['followers', 'engagementRate', 'createdAt']);
export const sortOrderEnum = z.enum(['asc', 'desc']);

// Search query schema
export const influencerSearchSchema = z.object({
  // Search parameters
  keyword: z.string().optional(),
  category: z.string().optional(),

  // Platform filter
  platform: platformEnum.optional(),

  // Follower range
  minFollowers: z.coerce.number().int().min(0).optional(),
  maxFollowers: z.coerce.number().int().min(0).optional(),

  // Engagement range
  minEngagement: z.coerce.number().min(0).max(100).optional(),
  maxEngagement: z.coerce.number().min(0).max(100).optional(),

  // Location filter
  location: z.string().optional(),

  // Pagination
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: sortByEnum.default('followers'),
  sortOrder: sortOrderEnum.default('desc'),
}).refine(
  (data) => {
    // If both min and max followers are provided, min should be less than max
    if (data.minFollowers !== undefined && data.maxFollowers !== undefined) {
      return data.minFollowers <= data.maxFollowers;
    }
    return true;
  },
  {
    message: 'minFollowers must be less than or equal to maxFollowers',
    path: ['minFollowers'],
  }
).refine(
  (data) => {
    // If both min and max engagement are provided, min should be less than max
    if (data.minEngagement !== undefined && data.maxEngagement !== undefined) {
      return data.minEngagement <= data.maxEngagement;
    }
    return true;
  },
  {
    message: 'minEngagement must be less than or equal to maxEngagement',
    path: ['minEngagement'],
  }
);

export type InfluencerSearchParams = z.infer<typeof influencerSearchSchema>;

// Response types
export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// Influencer data structure returned from API
export interface InfluencerData {
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
  isVerified: boolean;
  createdAt: Date;
}

export interface InfluencerSearchResponse {
  data: InfluencerData[];
  pagination: PaginationMetadata;
}