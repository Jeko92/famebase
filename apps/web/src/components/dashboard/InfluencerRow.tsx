'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatNumber, formatEngagement, getGenderAvatar } from '@/lib/utils/format';
import FavoriteButton from './FavoriteButton';

interface InfluencerRowProps {
  influencer: {
    id: string;
    name: string;
    gender: string;
    platforms: string[];
    followers: number;
    engagementRate: number;
    location: string;
    topics: string[];
    bio?: string | null;
    profileImageUrl?: string | null;
  };
  isSelected: boolean;
  onToggleSelect: () => void;
  isFavorited?: boolean;
  onFavoriteChange?: (influencerId: string, isFavorited: boolean) => void;
}

export default function InfluencerRow({
  influencer,
  isSelected,
  onToggleSelect,
  isFavorited = false,
  onFavoriteChange,
}: InfluencerRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const avatarUrl = influencer.profileImageUrl || getGenderAvatar(influencer.name, influencer.gender);

  return (
    <div className="border-b border-gray-800">
      <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#1A1A2E] transition-colors">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="h-4 w-4 rounded accent-primary-500"
        />

        {/* Avatar & Info */}
        <div className="flex min-w-[250px] items-center gap-3">
          <Image
            src={avatarUrl}
            alt={influencer.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
            unoptimized
          />
          <div className="flex-1">
            <div className="font-medium text-white">{influencer.name}</div>
            <div className="text-sm text-gray-400">@{influencer.name.toLowerCase().replace(/\s+/g, '')}</div>
          </div>
        </div>

        {/* Followers */}
        <div className="min-w-[100px] text-white">
          {formatNumber(influencer.followers)}
        </div>

        {/* Engagement */}
        <div className="min-w-[100px] text-white">
          {formatEngagement(influencer.engagementRate)}
        </div>

        {/* Location */}
        <div className="min-w-[200px] text-gray-300 text-sm">
          {influencer.location}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <FavoriteButton
            influencerId={influencer.id}
            isFavorited={isFavorited}
            onFavoriteChange={(isFav) => onFavoriteChange?.(influencer.id, isFav)}
          />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-[#1A1A2E] px-6 py-4 space-y-3">
          {influencer.bio && (
            <div>
              <div className="text-sm font-medium text-gray-400 mb-1">Bio:</div>
              <div className="text-sm text-gray-300">{influencer.bio}</div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium text-gray-400 mb-1">Topics:</div>
            <div className="flex flex-wrap gap-2">
              {influencer.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full bg-primary-500/20 px-3 py-1 text-xs text-primary-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-400 mb-1">Platforms:</div>
            <div className="flex flex-wrap gap-2">
              {influencer.platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-300"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}