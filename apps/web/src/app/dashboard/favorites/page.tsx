'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import InfluencerTable from '@/components/dashboard/InfluencerTable';
import { getFavorites } from '@/lib/api/favorites';
import type { FavoriteWithInfluencer } from '@/lib/validations/favorite';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteWithInfluencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getFavorites();
      setFavorites(response.favorites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteChange = (influencerId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      // Remove from list when unfavorited
      setFavorites((prev) => prev.filter((fav) => fav.influencerId !== influencerId));
    }
  };

  // Transform favorites to influencer format for the table
  const influencers = favorites.map((fav) => fav.influencer);
  const favoritedIds = new Set(favorites.map((fav) => fav.influencerId));

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Favorites</h1>
        </div>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Your saved influencers for quick access
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={loadFavorites}
            className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="rounded-lg bg-[#0F0F23] overflow-hidden">
          <div className="animate-pulse space-y-4 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {favorites.length === 0 && !isLoading ? (
            <div className="rounded-lg bg-[#1A1A2E] p-12 text-center">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-lg text-gray-400">No favorites yet</p>
              <p className="mt-2 text-sm text-gray-500">
                Start adding influencers to your favorites from the search page
              </p>
              <a
                href="/dashboard/search"
                className="mt-4 inline-block rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
              >
                Go to Search
              </a>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="rounded-lg bg-[#1A1A2E] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Favorites</p>
                    <p className="text-2xl font-bold text-white">{favorites.length}</p>
                  </div>
                  <Heart className="h-12 w-12 text-red-500 fill-current opacity-20" />
                </div>
              </div>

              {/* Favorites Table */}
              <InfluencerTable
                influencers={influencers}
                favoritedIds={favoritedIds}
                onFavoriteChange={handleFavoriteChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}