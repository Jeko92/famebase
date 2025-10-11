'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { addFavorite, removeFavorite } from '@/lib/api/favorites';

interface FavoriteButtonProps {
  influencerId: string;
  isFavorited: boolean;
  onFavoriteChange?: (isFavorited: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({
  influencerId,
  isFavorited: initialFavorited,
  onFavoriteChange,
  size = 'md',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row expansion

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (isFavorited) {
        await removeFavorite(influencerId);
        setIsFavorited(false);
        onFavoriteChange?.(false);
      } else {
        await addFavorite(influencerId);
        setIsFavorited(true);
        onFavoriteChange?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Show error toast or notification here if desired
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 transition-colors ${
        isFavorited
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${sizeClasses[size]} ${isFavorited ? 'fill-current' : ''}`}
      />
    </button>
  );
}