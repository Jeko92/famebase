'use client';

import { useState, useRef, useEffect } from 'react';
import { Instagram, ChevronDown, SlidersHorizontal, Youtube, Video, Twitch } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilterValues) => void;
}

export interface SearchFilterValues {
  platform: string;
  searchType: 'category' | 'keyword';
  category?: string;
  keyword?: string;
  followersMin?: number;
  followersMax?: number;
  engagementMin?: number;
  engagementMax?: number;
  location?: string;
}

const platforms = [
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'TikTok', icon: Video, color: 'text-white' },
  { name: 'Twitch', icon: Twitch, color: 'text-purple-500' },
];

export default function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [searchType, setSearchType] = useState<'category' | 'keyword'>('category');
  const [platform, setPlatform] = useState('Instagram');
  const [category, setCategory] = useState('Lifestyle');
  const [keyword, setKeyword] = useState('');
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const platformRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (platformRef.current && !platformRef.current.contains(event.target as Node)) {
        setIsPlatformOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedPlatform = platforms.find(p => p.name === platform) || platforms[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: SearchFilterValues = {
      platform,
      searchType,
      ...(searchType === 'category' ? { category } : { keyword }),
    };

    onSearch(filters);
  };

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
            <selectedPlatform.icon className={`h-5 w-5 ${selectedPlatform.color}`} />
            <span className="text-sm">{selectedPlatform.name}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {isPlatformOpen && (
            <div className="absolute top-14 left-0 z-50 min-w-[160px] rounded-lg border border-gray-700 bg-[#1A1A2E] shadow-lg">
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
        <div className="relative">
          <button
            type="button"
            className="flex h-12 items-center gap-2 rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white hover:border-gray-600"
          >
            <span className="text-sm">Followers</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* All Filters Button */}
        <button
          type="button"
          className="flex h-12 items-center gap-2 rounded-lg border border-gray-700 bg-[#1A1A2E] px-4 text-white hover:border-gray-600"
        >
          <span className="text-sm">All filters</span>
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
    </form>
  );
}