import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  FaTimes,
  FaCopy,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
} from 'react-icons/fa';
import { shareService } from '../services/shareService';
import type { SharePlatform } from '../services/shareService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
}

const platformConfig: Array<{
  key: SharePlatform;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  { key: 'copy_link', label: 'Copy Link', icon: FaCopy, color: 'bg-gray-600 hover:bg-gray-700' },
  { key: 'email', label: 'Email', icon: FaEnvelope, color: 'bg-blue-600 hover:bg-blue-700' },
  { key: 'facebook', label: 'Facebook', icon: FaFacebook, color: 'bg-[#1877F2] hover:bg-[#166FE5]' },
  { key: 'twitter', label: 'Twitter', icon: FaTwitter, color: 'bg-[#1DA1F2] hover:bg-[#1A8CD8]' },
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'bg-[#25D366] hover:bg-[#22C55E]' },
];

const ShareModal = ({ isOpen, onClose, listingId, listingTitle }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const shareMutation = useMutation({
    mutationFn: (platform: SharePlatform) => shareService.shareListing(listingId, platform),
  });

  const handleShare = async (platform: SharePlatform) => {
    const listingUrl = `${window.location.origin}/#/listing/${listingId}`;

    if (platform === 'copy_link') {
      try {
        await navigator.clipboard.writeText(listingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    } else if (platform === 'email') {
      window.open(
        `mailto:?subject=${encodeURIComponent(`Check out: ${listingTitle}`)}&body=${encodeURIComponent(`I found this great place: ${listingUrl}`)}`,
        '_blank'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this place: ${listingTitle}`)}&url=${encodeURIComponent(listingUrl)}`,
        '_blank',
        'width=600,height=400'
      );
    } else if (platform === 'whatsapp') {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`Check out this place: ${listingTitle} ${listingUrl}`)}`,
        '_blank'
      );
    }

    shareMutation.mutate(platform);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      data-testid="share-modal-overlay"
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="share-modal"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          data-testid="share-modal-close"
          aria-label="Close share modal"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Share this place</h2>

        <div className="space-y-3">
          {platformConfig.map(({ key, label, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => handleShare(key)}
              className={`w-full flex items-center space-x-3 text-white px-4 py-3 rounded-lg transition ${color}`}
              data-testid={`share-btn-${key}`}
            >
              <Icon className="text-lg" />
              <span className="font-medium">
                {key === 'copy_link' && copied ? 'Copied!' : label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
