'use client';

import { useState } from 'react';
import SearchFilters, { SearchFilterValues } from '@/components/dashboard/SearchFilters';
import InfluencerTable from '@/components/dashboard/InfluencerTable';
import influencersData from '@/data/influencer_liste.json';

// Transform the data to match our interface
const transformedInfluencers = influencersData.map((inf) => ({
  id: inf.id,
  name: inf.name,
  gender: inf.gender.toUpperCase(),
  platforms: inf.platform,
  followers: inf.followers,
  engagementRate: inf.engagementRate,
  avgLikes: inf.avgLikes,
  avgComments: inf.avgComments,
  topics: inf.topics,
  location: inf.location,
  bio: null,
  profileImageUrl: null,
}));

export default function SearchPage() {
  const [filteredInfluencers, setFilteredInfluencers] = useState(transformedInfluencers);

  const handleSearch = (filters: SearchFilterValues) => {
    let results = [...transformedInfluencers];

    // Filter by search type
    if (filters.searchType === 'category' && filters.category) {
      results = results.filter((inf) =>
        inf.topics.some((topic) => topic.toLowerCase().includes(filters.category!.toLowerCase()))
      );
    } else if (filters.searchType === 'keyword' && filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      results = results.filter((inf) =>
        inf.topics.some((topic) => topic.toLowerCase().includes(keyword)) ||
        inf.name.toLowerCase().includes(keyword)
      );
    }

    // Filter by platform
    if (filters.platform) {
      results = results.filter((inf) =>
        inf.platforms.includes(filters.platform)
      );
    }

    setFilteredInfluencers(results);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Search</h1>
        <p className="mt-2 text-sm sm:text-base text-gray-400">
          Find the perfect influencers for your campaign
        </p>
      </div>

      {/* Filters */}
      <SearchFilters onSearch={handleSearch} />

      {/* Results */}
      <div>
        <InfluencerTable influencers={filteredInfluencers} />
      </div>
    </div>
  );
}