import { Request, Response } from 'express';
import { mockShares, mockListings, findById } from '../data/mockData';
import { AuthRequest } from '../types';

const VALID_PLATFORMS = ['copy_link', 'email', 'facebook', 'twitter', 'whatsapp'] as const;

export const shareListing = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { platform } = req.body;

    const listing = findById(mockListings, id);
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    if (!platform || !VALID_PLATFORMS.includes(platform)) {
      res.status(400).json({
        error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}`,
      });
      return;
    }

    // Get userId from auth if available (sharing works for both logged-in and anonymous users)
    const userId = (req as AuthRequest).user?.userId || null;

    const newShare = {
      _id: `907f1f77bcf86cd7994390${40 + mockShares.length + 1}`,
      listingId: id,
      userId,
      platform: platform as typeof VALID_PLATFORMS[number],
      createdAt: new Date(),
    };

    mockShares.push(newShare);

    res.status(201).json({
      message: 'Share recorded successfully',
      share: newShare,
    });
  } catch (error) {
    console.error('Share listing error:', error);
    res.status(500).json({ error: 'Failed to record share' });
  }
};

export const getShareCount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const listing = findById(mockListings, id);
    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    const listingShares = mockShares.filter(share => share.listingId === id);

    const byPlatform = VALID_PLATFORMS.reduce((acc, platform) => {
      acc[platform] = listingShares.filter(s => s.platform === platform).length;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      listingId: id,
      totalShares: listingShares.length,
      byPlatform,
    });
  } catch (error) {
    console.error('Get share count error:', error);
    res.status(500).json({ error: 'Failed to fetch share count' });
  }
};
