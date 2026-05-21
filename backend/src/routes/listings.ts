import express from 'express';
import {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getAvailability,
} from '../controllers/listingController.mock'; // Using mock data
import { shareListing, getShareCount } from '../controllers/shareController.mock';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.get('/:id/availability', getAvailability);
router.get('/:id/shares', getShareCount);
router.post('/', authenticate, createListing);
router.post('/:id/share', shareListing);
router.put('/:id', authenticate, updateListing);
router.delete('/:id', authenticate, deleteListing);

export default router;
