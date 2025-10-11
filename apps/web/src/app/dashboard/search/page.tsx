'use client';

import { useState, useEffect } from 'react';
import SearchFilters, { SearchFilterValues } from '@/components/dashboard/SearchFilters';
import InfluencerTable from '@/components/dashboard/InfluencerTable';
import { searchInfluencers, getDefaultSearchParams } from '@/lib/api/influencers';
import type { PaginationMetadata } from '@/lib/validations/influencer';

interface Influencer {
  id: string;
  name: string;
  gender: string;
  platforms: string[];
  followers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  topics: string[];
  location: string;
  bio?: string | null;
  profileImageUrl?: string | null;
}

export default function SearchPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilterValues>({
    searchType: 'category',
  });

  // Load initial data
  useEffect(() => {
    loadInfluencers(getDefaultSearchParams());
  }, []);

  const loadInfluencers = async (filters: Partial<SearchFilterValues>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await searchInfluencers(filters);
      setInfluencers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load influencers');
      console.error('Error loading influencers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilterValues) => {
    setCurrentFilters(filters);
    loadInfluencers({
      ...filters,
      page: 1, // Reset to first page on new search
    });
  };

  const handlePageChange = (page: number) => {
    loadInfluencers({
      ...currentFilters,
      page,
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => loadInfluencers(getDefaultSearchParams())}
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
          {/* Results */}
          <div>
            {influencers.length === 0 && !isLoading ? (
              <div className="rounded-lg bg-[#1A1A2E] p-12 text-center">
                <p className="text-lg text-gray-400">No influencers found</p>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search filters
                </p>
              </div>
            ) : (
              <InfluencerTable influencers={influencers} />
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-lg bg-[#1A1A2E] px-6 py-4">
              <div className="text-sm text-gray-400">
                Page {pagination.page} of {pagination.totalPages} • {pagination.total} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="rounded border border-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  className="rounded border border-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}