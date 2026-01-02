import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart } from 'lucide-react';
import { CommunityFeed } from '@/components/community/CommunityFeed';

export default function CommunityPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold-foreground mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Helios Artverse</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Connect with fellow artists, share your creations, find collaborators, 
            and join learning circles to grow together.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto"
        >
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold">5.2k</div>
            <div className="text-xs text-muted-foreground">Artists</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <Heart className="w-5 h-5 mx-auto mb-2 text-rose-foreground" />
            <div className="text-xl font-bold">12.4k</div>
            <div className="text-xs text-muted-foreground">Artworks</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <MessageCircle className="w-5 h-5 mx-auto mb-2 text-gold" />
            <div className="text-xl font-bold">4</div>
            <div className="text-xs text-muted-foreground">Circles</div>
          </div>
        </motion.div>

        {/* Community Feed Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CommunityFeed />
        </motion.div>
      </div>
    </div>
  );
}
