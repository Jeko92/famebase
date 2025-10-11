import { z } from 'zod';

/**
 * Schema for adding a favorite
 */
export const addFavoriteSchema = z.object({
  influencerId: z.string().min(1, 'Influencer ID is required'),
});

/**
 * Schema for removing a favorite
 */
export const removeFavoriteSchema = z.object({
  influencerId: z.string().min(1, 'Influencer ID is required'),
});

/**
 * Type definitions
 */
export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;
export type RemoveFavoriteInput = z.infer<typeof removeFavoriteSchema>;

/**
 * Favorite response type (what the API returns)
 */
export interface FavoriteResponse {
  id: string;
  userId: string;
  influencerId: string;
  createdAt: string;
}

/**
 * Favorite with influencer details
 */
export interface FavoriteWithInfluencer {
  id: string;
  userId: string;
  influencerId: string;
  createdAt: string;
  influencer: {
    id: string;
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
    isVerified: boolean;
  };
}