import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ExternalLink, Heart, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { searchExhibitions, getGenres, getCities, Exhibition } from '@/lib/exhibitionData';
import { cn } from '@/lib/utils';

export function ExhibitionSearch() {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  const results = searchExhibitions(query, {
    city: selectedCity,
    genre: selectedGenre
  });

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exhibitions, artists, or locations..."
            className="pl-12 h-12 text-lg bg-card border-border"
          />
        </div>
        
        <div className="flex gap-3 flex-wrap">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {getCities().map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {getGenres().map(genre => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {results.length} exhibition{results.length !== 1 ? 's' : ''} found
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((exhibition, index) => (
            <ExhibitionCard 
              key={exhibition.id}
              exhibition={exhibition}
              index={index}
              isWishlisted={wishlist.includes(exhibition.id)}
              onToggleWishlist={() => toggleWishlist(exhibition.id)}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExhibitionCardProps {
  exhibition: Exhibition;
  index: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  formatDate: (date: string) => string;
}

function ExhibitionCard({ exhibition, index, isWishlisted, onToggleWishlist, formatDate }: ExhibitionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-elevated group",
        "gradient-card",
        exhibition.mustSee && "gold-border"
      )}>
        {/* Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img 
            src={exhibition.imageUrl} 
            alt={exhibition.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          
          {/* Must See Badge */}
          {exhibition.mustSee && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-gold/90 text-gold-foreground text-xs font-medium">
              <Star className="w-3 h-3" />
              Must See
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={cn(
              "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
              isWishlisted 
                ? "bg-rose text-rose-foreground" 
                : "bg-card/80 text-muted-foreground hover:bg-card"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-serif text-lg font-semibold text-white mb-1 line-clamp-2">
              {exhibition.title}
            </h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {exhibition.venue}, {exhibition.city}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
            </div>
            <Badge variant="secondary">{exhibition.genre}</Badge>
          </div>
          
          {/* Why Important */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {exhibition.whyImportant}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-semibold text-primary">{exhibition.price}</span>
            <Button size="sm" variant="outline" className="gap-1.5">
              Get Tickets
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
