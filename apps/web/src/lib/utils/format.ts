/**
 * Format large numbers to compact format (e.g., 125000 => "125K")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format engagement rate as percentage
 */
export function formatEngagement(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Generate avatar URL using UI Avatars service
 */
export function getAvatarUrl(name: string, background?: string): string {
  const encodedName = encodeURIComponent(name);
  const bg = background || 'random';
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bg}&color=fff&size=128`;
}

/**
 * Get gender-based avatar URL
 */
export function getGenderAvatar(name: string, gender: string): string {
  const encodedName = encodeURIComponent(name);

  // Gender-specific background colors
  const colors: Record<string, string> = {
    MALE: '3b82f6',       // Blue
    FEMALE: 'ec4899',     // Pink
    NON_BINARY: '8b5cf6', // Purple
    OTHER: '6b7280',      // Gray
    PREFER_NOT_TO_SAY: '6b7280',
  };

  const bg = colors[gender] || 'random';
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bg}&color=fff&size=128`;
}