import type { InfluencerSearchParams, InfluencerSearchResponse } from '@/lib/validations/influencer';

export async function searchInfluencers(
  params: Partial<InfluencerSearchParams>
): Promise<InfluencerSearchResponse> {
  // Build query string
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await fetch(`/api/influencers?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch influencers');
  }

  return response.json();
}

// Helper to get default search params
export function getDefaultSearchParams(): Partial<InfluencerSearchParams> {
  return {
    page: 1,
    limit: 20,
    sortBy: 'followers',
    sortOrder: 'desc',
  };
}