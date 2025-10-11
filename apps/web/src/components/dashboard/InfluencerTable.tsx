'use client';

import { useState } from 'react';
import InfluencerRow from './InfluencerRow';

interface Influencer {
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
}

interface InfluencerTableProps {
  influencers: Influencer[];
}

export default function InfluencerTable({ influencers }: InfluencerTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === influencers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(influencers.map(i => i.id)));
    }
  };

  if (influencers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-gray-400">No influencers found</p>
        <p className="mt-2 text-sm text-gray-500">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-[#0F0F23] overflow-hidden">
      <div className="overflow-x-auto">
      {/* Table Header */}
      <div className="flex items-center gap-4 border-b border-gray-800 px-6 py-3 bg-[#1A1A2E]">
        <input
          type="checkbox"
          checked={selectedIds.size === influencers.length && influencers.length > 0}
          onChange={handleSelectAll}
          className="h-4 w-4 rounded accent-primary-500"
        />
        <div className="min-w-[250px] text-sm font-medium text-gray-400">Influencer</div>
        <div className="min-w-[100px] text-sm font-medium text-gray-400">Followers</div>
        <div className="min-w-[100px] text-sm font-medium text-gray-400">Engagement</div>
        <div className="min-w-[200px] text-sm font-medium text-gray-400">Location</div>
        <div className="ml-auto text-sm font-medium text-gray-400">Action</div>
      </div>

      {/* Table Body */}
      <div>
        {influencers.map((influencer) => (
          <InfluencerRow
            key={influencer.id}
            influencer={influencer}
            isSelected={selectedIds.has(influencer.id)}
            onToggleSelect={() => handleToggleSelect(influencer.id)}
          />
        ))}
      </div>

      {/* Pagination - Placeholder */}
      <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4 bg-[#1A1A2E]">
        <div className="text-sm text-gray-400">
          {selectedIds.size > 0 && `${selectedIds.size} selected • `}
          Showing {influencers.length} results
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-400 hover:bg-gray-800">
            Previous
          </button>
          <button className="rounded border border-gray-700 px-3 py-1 text-sm text-gray-400 hover:bg-gray-800">
            Next
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}