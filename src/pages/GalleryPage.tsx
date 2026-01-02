import { motion } from 'framer-motion';
import { Search, MapPin, Calendar } from 'lucide-react';
import { ExhibitionSearch } from '@/components/gallery/ExhibitionSearch';

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Search className="w-4 h-4" />
            <span className="text-sm font-medium">Art Discovery</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-2">Search Gallery</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover art exhibitions worldwide. Find shows that matter, 
            understand their significance, and save your favorites.
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
            <MapPin className="w-5 h-5 mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold">8+</div>
            <div className="text-xs text-muted-foreground">Cities</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <Calendar className="w-5 h-5 mx-auto mb-2 text-rose-foreground" />
            <div className="text-xl font-bold">12+</div>
            <div className="text-xs text-muted-foreground">Shows</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/50">
            <Search className="w-5 h-5 mx-auto mb-2 text-gold" />
            <div className="text-xl font-bold">6</div>
            <div className="text-xs text-muted-foreground">Genres</div>
          </div>
        </motion.div>

        {/* Exhibition Search Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ExhibitionSearch />
        </motion.div>
      </div>
    </div>
  );
}
