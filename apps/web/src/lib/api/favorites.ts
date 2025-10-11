import { FavoriteWithInfluencer } from '@/lib/validations/favorite';

/**
 * Fetch all favorites for the current user
 */
export async function getFavorites(): Promise<{
  favorites: FavoriteWithInfluencer[];
  total: number;
}> {
  const response = await fetch('/api/favorites', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch favorites');
  }

  return response.json();
}

/**
 * Add an influencer to favorites
 */
export async function addFavorite(influencerId: string): Promise<{
  favorite: FavoriteWithInfluencer;
}> {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ influencerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add favorite');
  }

  return response.json();
}

/**
 * Remove an influencer from favorites
 */
export async function removeFavorite(influencerId: string): Promise<void> {
  const response = await fetch(`/api/favorites?influencerId=${influencerId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove favorite');
  }
}

/**
 * Check if an influencer is favorited
 */
export async function isFavorited(influencerId: string): Promise<boolean> {
  try {
    const { favorites } = await getFavorites();
    return favorites.some((fav) => fav.influencerId === influencerId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}