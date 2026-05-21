import api from './api';
import { mockShareService } from './mock/mockShareService';

export type SharePlatform = 'copy_link' | 'email' | 'facebook' | 'twitter' | 'whatsapp';

export interface ShareCountResponse {
  listingId: string;
  totalShares: number;
  byPlatform: Record<SharePlatform, number>;
}

const realShareService = {
  async shareListing(listingId: string, platform: SharePlatform): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/listings/${listingId}/share`, {
      platform,
    });
    return response.data;
  },

  async getShareCount(listingId: string): Promise<ShareCountResponse> {
    const response = await api.get<ShareCountResponse>(`/listings/${listingId}/shares`);
    return response.data;
  },
};

export const shareService = import.meta.env.VITE_MOCK_API === 'true'
  ? mockShareService
  : realShareService;
