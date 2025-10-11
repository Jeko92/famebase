'use client';

import { useState, useRef, useEffect } from 'react';
import { Instagram, ChevronDown, SlidersHorizontal, Youtube, Video, Twitch, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilterValues) => void;
}

export interface SearchFilterValues {
  platform?: 'INSTAGRAM' | 'YOUTUBE' | 'TIKTOK' | 'TWITCH' | 'TWITTER' | 'LINKEDIN' | 'FACEBOOK';
  searchType: 'category' | 'keyword';
  category?: string;
  keyword?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxEngagement?: number;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: 'followers' | 'engagementRate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'TikTok', icon: Video, color: 'text-white' },
  { name: 'Twitch', icon: Twitch, color: 'text-purple-500' },
];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchType, setSearchType] = useState<'category' | 'keyword'>('category');
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isAllFiltersOpen, setIsAllFiltersOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);
  const followersRef = useRef<HTMLDivElement>(null);

  // Advanced filters
  const [minFollowers, setMinFollowers] = useState<string>('');
  const [maxFollowers, setMaxFollowers] = useState<string>('');
  const [minEngagement, setMinEngagement] = useState<string>('');
  const [maxEngagement, setMaxEngagement] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setIsPlatformOpen(false);
      }
      if (followersRef.current && !followersRef.current.contains(event.target as Node)) {
        setIsFollowersOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPlatform = platform ? platforms.find(p => p.name === platform) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: SearchFilterValues = {
      searchType,
      ...(searchType === 'category' && category && { category }),
      ...(searchType === 'keyword' && keyword && { keyword }),
      ...(minFollowers && { minFollowers: parseInt(minFollowers) }),
      ...(maxFollowers && { maxFollowers: parseInt(maxFollowers) }),
      ...(minEngagement && { minEngagement: parseFloat(minEngagement) }),
      ...(maxEngagement && { maxEngagement: parseFloat(maxEngagement) }),
      ...(location && { location }),
    };

    // Add platform only if selected, with proper enum conversion
    if (platform) {
      filters.platform = platform.toUpperCase() as SearchFilterValues['platform'];
    }

    onSearch(filters);
  };

  const handleClearFilters = () => {
    setPlatform('');
    setCategory('');
    setKeyword('');
    setMinFollowers('');
    setMaxFollowers('');
    setMinEngagement('');
    setMaxEngagement('');
    setLocation('');
  };

  const activeFiltersCount = [
    platform,
    minFollowers,
    maxFollowers,
    minEngagement,
    maxEngagement,
    location,
  ].filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Search Type Toggle */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="searchType"
            value="category"
            checked={searchType === 'category'}
            onChange={() => setSearchType('category')}
            className="h-4 w-4 accent-primary-500"
          />
          <span className="text-sm text-white">Category</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="searchType"
            value="keyword"
            checked={searchType === 'keyword'}
            onChange={() => setSearchType('keyword')}
            className="h-4 w-4 accent-primary-500"
          />
          <span className="text-sm text-gray-400">Keyword</span>
        </label>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* Platform Selector */}
        <div className="relative" ref={platformRef}>
          <button
            type="button"
            onClick={() => setIsPlatformOpen(!isPlatformOpen)}
            className="flex h-12 items-center gap-2 rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white hover:border-gray-600"
          >
            {selectedPlatform ? (
              <>
                <selectedPlatform.icon className={`h-5 w-5 ${selectedPlatform.color}`} />
                <span className="text-sm">{selectedPlatform.name}</span>
              </>
            ) : (
              <span className="text-sm text-gray-400">All Platforms</span>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isPlatformOpen && (
            <div className="absolute top-14 left-0 z-50 min-w-[160px] rounded-lg border border-gray-700 bg-[#1A1A2E] shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setPlatform('');
                  setIsPlatformOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#0F0F23] ${
                  !platform ? 'bg-[#0F0F23]' : ''
                }`}
              >
                <span className="text-sm">All Platforms</span>
              </button>
              {platforms.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setPlatform(p.name);
                    setIsPlatformOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#0F0F23] ${
                    platform === p.name ? 'bg-[#0F0F23]' : ''
                  }`}
                >
                  <p.icon className={`h-5 w-5 ${p.color}`} />
                  <span className="text-sm">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category/Keyword Input */}
        {searchType === 'category' ? (
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full appearance-none rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 pr-10 text-white outline-none focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Beauty">Beauty</option>
              <option value="Fitness">Fitness</option>
              <option value="Tech">Tech</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Fashion">Fashion</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        ) : (
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword..."
            className="h-12 flex-1 min-w-[200px] rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
          />
        )}

        {/* Followers Filter */}
        <div className="relative" ref={followersRef}>
          <button
            type="button"
            onClick={() => setIsFollowersOpen(!isFollowersOpen)}
            className="flex h-12 items-center gap-2 rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white hover:border-gray-600"
          >
            <span className="text-sm">
              {minFollowers || maxFollowers ? 'Followers ✓' : 'Followers'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Followers Dropdown */}
          {isFollowersOpen && (
            <div className="absolute top-14 left-0 z-50 w-[280px] rounded-lg border border-gray-700 bg-[#1A1A2E] shadow-lg p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Min Followers</label>
                  <input
                    type="number"
                    value={minFollowers}
                    onChange={(e) => setMinFollowers(e.target.value)}
                    placeholder="e.g., 10000"
                    className="w-full h-10 rounded-lg border border-gray-700 bg-[#0F0F23] px-3 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Max Followers</label>
                  <input
                    type="number"
                    value={maxFollowers}
                    onChange={(e) => setMaxFollowers(e.target.value)}
                    placeholder="e.g., 500000"
                    className="w-full h-10 rounded-lg border border-gray-700 bg-[#0F0F23] px-3 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMinFollowers('');
                      setMaxFollowers('');
                    }}
                    className="flex-1 h-9 rounded-lg border border-gray-700 text-sm text-gray-400 hover:bg-[#0F0F23]"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFollowersOpen(false)}
                    className="flex-1 h-9 rounded-lg bg-primary-500 text-sm text-white hover:bg-primary-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* All Filters Button */}
        <button
          type="button"
          onClick={() => setIsAllFiltersOpen(true)}
          className="flex h-12 items-center gap-2 rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white hover:border-gray-600"
        >
          <span className="text-sm">
            All filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
        </button>

        {/* Show Results Button */}
        <button
          type="submit"
          className="h-12 rounded-lg bg-primary-500 px-8 font-medium text-white transition-colors hover:bg-primary-600"
        >
          Show results
        </button>
      </div>

      {/* All Filters Modal */}
      {isAllFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-[#1A1A2E] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">All Filters</h3>
              <button
                type="button"
                onClick={() => setIsAllFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Engagement Rate */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Engagement Rate (%)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Min %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={minEngagement}
                      onChange={(e) => setMinEngagement(e.target.value)}
                      placeholder="e.g., 2.5"
                      className="w-full h-10 rounded-lg border border-gray-700 bg-[#0F0F23] px-3 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Max %</label>
                    <input
                      type="number"
                      step="0.1"
                      value={maxEngagement}
                      onChange={(e) => setMaxEngagement(e.target.value)}
                      placeholder="e.g., 10.0"
                      className="w-full h-10 rounded-lg border border-gray-700 bg-[#0F0F23] px-3 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className="text-sm font-medium text-white mb-3">Location</h4>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Berlin, Germany"
                  className="w-full h-10 rounded-lg border border-gray-700 bg-[#0F0F23] px-3 text-white outline-none placeholder:text-gray-500 focus:border-primary-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 h-11 rounded-lg border border-gray-700 text-white hover:bg-[#0F0F23]"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setIsAllFiltersOpen(false)}
                  className="flex-1 h-11 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}