import { motion } from 'framer-motion';
import { X, Share2, Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  likes?: number;
  prompt?: string;
  shareId?: string;
}

interface GalleryModalProps {
  item: GalleryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GalleryModal({ item, open, onOpenChange }: GalleryModalProps) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const shareUrl = item.shareId 
    ? `${window.location.origin}/art/${item.shareId}`
    : `${window.location.origin}/gallery?id=${item.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out this artwork: ${item.title}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Image */}
          <div className="aspect-square max-h-[60vh] overflow-hidden bg-muted">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold">{item.title}</h2>
                {item.likes !== undefined && (
                  <div className="flex items-center gap-1 text-muted-foreground mt-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{item.likes} likes</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button size="sm" onClick={handleShare} className="gap-1">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Original Prompt */}
            {item.prompt && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">Original AI Prompt</p>
                <p className="text-sm italic">&ldquo;{item.prompt}&rdquo;</p>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
