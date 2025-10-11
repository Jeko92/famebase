'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, MapPin, Users, TrendingUp, ExternalLink, Heart, MessageCircle, Eye } from 'lucide-react';
import { getInfluencer, type InfluencerDetailData } from '@/lib/api/influencers';
import { formatNumber, formatEngagement, getGenderAvatar } from '@/lib/utils/format';
import FavoriteButton from './FavoriteButton';

interface InfluencerDetailModalProps {
  influencerId: string;
  isOpen: boolean;
  onClose: () => void;
  isFavorited?: boolean;
  onFavoriteChange?: (influencerId: string, isFavorited: boolean) => void;
}

export default function InfluencerDetailModal({
  influencerId,
  isOpen,
  onClose,
  isFavorited = false,
  onFavoriteChange,
}: InfluencerDetailModalProps) {
  const [influencer, setInfluencer] = useState<InfluencerDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullBio, setShowFullBio] = useState(false);

  const loadInfluencer = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getInfluencer(influencerId);
      setInfluencer(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load influencer details');
      console.error('Error loading influencer:', err);
    } finally {
      setIsLoading(false);
    }
  }, [influencerId]);

  useEffect(() => {
    if (isOpen && influencerId) {
      loadInfluencer();
    }
  }, [isOpen, influencerId, loadInfluencer]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const avatarUrl = influencer?.profileImageUrl || getGenderAvatar(influencer?.name || '', influencer?.gender || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0F0F23] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="space-y-4 text-center">
                <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-400">Loading influencer details...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={loadInfluencer}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 rounded-lg text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          {influencer && !isLoading && (
            <>
              {/* Header Section */}
              <div className="bg-gradient-to-b from-[#1A1A2E] to-[#0F0F23] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  {/* Profile Image */}
                  <div className="relative">
                    <Image
                      src={avatarUrl}
                      alt={influencer.name}
                      width={120}
                      height={120}
                      className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-primary-500/20"
                      unoptimized
                    />
                    {influencer.isVerified && (
                      <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                          {influencer.name}
                        </h2>
                        <p className="text-gray-400 mb-3">
                          @{influencer.name.toLowerCase().replace(/\s+/g, '')}
                        </p>
                      </div>
                      <FavoriteButton
                        influencerId={influencer.id}
                        isFavorited={isFavorited}
                        onFavoriteChange={(isFav) => onFavoriteChange?.(influencer.id, isFav)}
                        size="lg"
                      />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                      <div className="bg-[#0F0F23] rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Users className="h-4 w-4" />
                          Followers
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatNumber(influencer.followers)}
                        </div>
                      </div>
                      <div className="bg-[#0F0F23] rounded-lg p-3">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <TrendingUp className="h-4 w-4" />
                          Engagement
                        </div>
                        <div className="text-xl font-bold text-white">
                          {formatEngagement(influencer.engagementRate)}
                        </div>
                      </div>
                      <div className="bg-[#0F0F23] rounded-lg p-3 col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <MapPin className="h-4 w-4" />
                          Location
                        </div>
                        <div className="text-lg font-semibold text-white truncate">
                          {influencer.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body Section */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Bio */}
                {influencer.bio && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                    <div className="bg-[#1A1A2E] rounded-lg p-4">
                      <p className="text-gray-300 leading-relaxed">
                        {showFullBio || influencer.bio.length <= 150
                          ? influencer.bio
                          : `${influencer.bio.substring(0, 150)}...`}
                      </p>
                      {influencer.bio.length > 150 && (
                        <button
                          onClick={() => setShowFullBio(!showFullBio)}
                          className="text-primary-400 hover:text-primary-300 text-sm mt-2 font-medium"
                        >
                          {showFullBio ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Topics & Platforms */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Topics */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {influencer.topics.map((topic) => (
                        <span
                          key={topic}
                          className="inline-flex items-center rounded-full bg-primary-500/20 px-4 py-2 text-sm font-medium text-primary-400 border border-primary-500/30"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Platforms */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {influencer.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="inline-flex items-center rounded-full bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 border border-gray-600"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sample Posts */}
                {influencer.posts && influencer.posts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {influencer.posts.map((post) => (
                        <div
                          key={post.id}
                          className="bg-[#1A1A2E] rounded-lg overflow-hidden hover:ring-2 hover:ring-primary-500/50 transition-all group"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={post.imageUrl}
                              alt={post.caption || 'Post image'}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                                <div className="flex items-center gap-4 text-white text-sm">
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    {formatNumber(post.likes)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    {formatNumber(post.comments)}
                                  </span>
                                  {post.views && (
                                    <span className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      {formatNumber(post.views)}
                                    </span>
                                  )}
                                </div>
                                {post.postUrl && (
                                  <a
                                    href={post.postUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm font-medium"
                                  >
                                    View Post <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-gray-400 uppercase">
                                {post.platform}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(post.postedAt).toLocaleDateString()}
                              </span>
                            </div>
                            {post.caption && (
                              <p className="text-sm text-gray-300 line-clamp-2">
                                {post.caption}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                {(influencer.email || influencer.phoneNumber || influencer.website) && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                    <div className="bg-[#1A1A2E] rounded-lg p-4 space-y-2">
                      {influencer.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="text-gray-400 text-sm">Email:</span>
                          <a href={`mailto:${influencer.email}`} className="text-primary-400 hover:text-primary-300">
                            {influencer.email}
                          </a>
                        </div>
                      )}
                      {influencer.phoneNumber && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="text-gray-400 text-sm">Phone:</span>
                          <a href={`tel:${influencer.phoneNumber}`} className="text-primary-400 hover:text-primary-300">
                            {influencer.phoneNumber}
                          </a>
                        </div>
                      )}
                      {influencer.website && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <span className="text-gray-400 text-sm">Website:</span>
                          <a
                            href={influencer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
                          >
                            {influencer.website} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}