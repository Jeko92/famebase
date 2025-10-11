'use client';

import { Heart } from 'lucide-react';

interface Favorite {
  id: string;
  name: string;
  followers: number;
  engagementRate: number;
}

export default function FavoritesPage() {
  // This will be connected to the API later
  const favorites: Favorite[] = [];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Favorites</h1>
        <p className="mt-2 text-gray-400">
          Your saved influencers
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg bg-[#1A1A2E] py-16 text-center">
          <div className="mb-4 rounded-full bg-primary-500/20 p-4">
            <Heart className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-medium text-white">No favorites yet</h3>
          <p className="mt-2 text-sm text-gray-400">
            Start adding influencers to your favorites from the search page
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-[#0F0F23] p-6">
          {/* Favorites list will go here */}
          <p className="text-gray-400">Favorites functionality coming soon...</p>
        </div>
      )}
    </div>
  );
}