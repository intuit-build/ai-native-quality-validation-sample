import { findById, mockListings } from '../../data/mockData';
import type { SharePlatform, ShareCountResponse } from '../shareService';
import { delay, createMockError } from './mockHelpers';

const mockShares: Array<{
  _id: string;
  listingId: string;
  platform: SharePlatform;
  createdAt: string;
}> = [];

export const mockShareService = {
  async shareListing(listingId: string, platform: SharePlatform): Promise<{ message: string }> {
    await delay();

    const listing = findById(mockListings, listingId);
    if (!listing) throw createMockError(404, 'Listing not found');

    const validPlatforms: SharePlatform[] = ['copy_link', 'email', 'facebook', 'twitter', 'whatsapp'];
    if (!validPlatforms.includes(platform)) {
      throw createMockError(400, `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`);
    }

    mockShares.push({
      _id: `share_${Date.now()}`,
      listingId,
      platform,
      createdAt: new Date().toISOString(),
    });

    return { message: 'Share recorded successfully' };
  },

  async getShareCount(listingId: string): Promise<ShareCountResponse> {
    await delay();

    const listing = findById(mockListings, listingId);
    if (!listing) throw createMockError(404, 'Listing not found');

    const listingShares = mockShares.filter(s => s.listingId === listingId);

    const platforms: SharePlatform[] = ['copy_link', 'email', 'facebook', 'twitter', 'whatsapp'];
    const byPlatform = platforms.reduce((acc, p) => {
      acc[p] = listingShares.filter(s => s.platform === p).length;
      return acc;
    }, {} as Record<SharePlatform, number>);

    return {
      listingId,
      totalShares: listingShares.length,
      byPlatform,
    };
  },
};
