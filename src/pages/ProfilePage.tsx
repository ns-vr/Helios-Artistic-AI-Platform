import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Trophy, Flame, Star, Heart, Calendar, MapPin, Edit3, Settings, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { badges as allBadges } from '@/lib/gameData';
import { BadgeTooltip } from '@/components/profile/BadgeTooltip';
import { GalleryModal } from '@/components/profile/GalleryModal';
import { AvatarFilter } from '@/components/profile/AvatarFilter';
import { ArtRemixer } from '@/components/art/ArtRemixer';
import { toast } from 'sonner';

interface UserArtwork {
  id: string;
  title: string;
  image_url: string;
  likes: number;
  original_prompt: string | null;
  share_id: string | null;
}

const savedExhibitions = [
  { id: 1, title: 'Van Gogh: The Immersive Experience', venue: 'Bengaluru', date: 'Feb 15 - May 30, 2026', imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400' },
  { id: 2, title: 'TeamLab Borderless 2026', venue: 'Tokyo', date: 'All Year', imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400' }
];

export default function ProfilePage() {
  const { stats, getProgress, getUserBadges } = useGame();
  const { user } = useAuth();
  const progress = getProgress();
  const earnedBadges = getUserBadges();
  const [artworks, setArtworks] = useState<UserArtwork[]>([]);
  const [selectedArtwork, setSelectedArtwork] = useState<UserArtwork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<{ avatar_url: string | null; display_name: string | null }>({ avatar_url: null, display_name: null });

  useEffect(() => {
    if (user) {
      fetchArtworks();
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('avatar_url, display_name').eq('user_id', user.id).single();
    if (data) setProfile(data);
  };

  const fetchArtworks = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_artworks').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setArtworks(data);
  };

  const handleShare = async (artwork: UserArtwork) => {
    const shareUrl = `${window.location.origin}/art/${artwork.share_id || artwork.id}`;
    if (navigator.share) {
      await navigator.share({ title: artwork.title, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    }
  };

  const openArtworkModal = (artwork: UserArtwork) => {
    setSelectedArtwork(artwork);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 gradient-card shadow-elevated mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-gold/30 shadow-glow">
                  <AvatarImage src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Helios"} />
                  <AvatarFallback className="text-2xl font-serif">HA</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-gold-foreground text-sm font-bold shadow-glow">
                  {stats.level}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="font-serif text-2xl font-bold mb-1">{profile.display_name || 'Art Explorer'}</h1>
                <p className="text-muted-foreground mb-3">Discovering beauty in every brushstroke ✨</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="secondary" className="gap-1"><MapPin className="w-3 h-3" />Art Enthusiast</Badge>
                  <Badge variant="secondary" className="gap-1 bg-gold/20 text-gold-foreground"><Star className="w-3 h-3" />Level {stats.level}</Badge>
                </div>

                <div className="flex gap-2 justify-center md:justify-start flex-wrap">
                  <AvatarFilter currentAvatar={profile.avatar_url || undefined} onAvatarUpdate={(url) => setProfile(p => ({ ...p, avatar_url: url }))} />
                  <Button variant="outline" size="sm" className="gap-1"><Edit3 className="w-4 h-4" />Edit</Button>
                  <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div><div className="text-2xl font-bold text-primary">{stats.xp}</div><div className="text-xs text-muted-foreground">XP</div></div>
                <div><div className="text-2xl font-bold text-gold flex items-center justify-center gap-1"><Flame className="w-5 h-5" />{stats.bestStreak}</div><div className="text-xs text-muted-foreground">Best Streak</div></div>
                <div><div className="text-2xl font-bold text-rose-foreground">{earnedBadges.length}</div><div className="text-xs text-muted-foreground">Badges</div></div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Progress to Level {stats.level + 1}</span><span className="font-medium">{stats.xp % 100}/100 XP</span></div>
              <Progress value={stats.xp % 100} className="h-2" />
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Tabs defaultValue="badges" className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/50">
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="artworks">My Art</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="stats">Game Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="badges">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {earnedBadges.length > 0 ? earnedBadges.map((badge) => (
                  <BadgeTooltip key={badge.id} badge={badge} earned />
                )) : (
                  <div className="col-span-full text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground">No badges earned yet</p>
                  </div>
                )}
                {allBadges.filter(b => !earnedBadges.find(e => e.id === b.id)).map((badge) => (
                  <BadgeTooltip key={badge.id} badge={badge} earned={false} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="artworks">
              <div className="mb-4"><ArtRemixer onArtworkCreated={fetchArtworks} /></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {artworks.map((artwork) => (
                  <Card key={artwork.id} className="overflow-hidden gradient-card shadow-card group cursor-pointer" onClick={() => openArtworkModal(artwork)}>
                    <div className="aspect-square overflow-hidden relative">
                      <img src={artwork.image_url} alt={artwork.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <Button size="icon" variant="secondary" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleShare(artwork); }}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{artwork.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground text-xs"><Heart className="w-3 h-3" />{artwork.likes}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <div className="space-y-4">
                {savedExhibitions.map((exhibition) => (
                  <Card key={exhibition.id} className="overflow-hidden gradient-card shadow-card">
                    <div className="flex">
                      <div className="w-32 h-24 overflow-hidden shrink-0"><img src={exhibition.imageUrl} alt={exhibition.title} className="w-full h-full object-cover" /></div>
                      <div className="p-4 flex-1">
                        <h3 className="font-serif font-semibold">{exhibition.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{exhibition.venue}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{exhibition.date}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 gradient-card shadow-card">
                  <h3 className="font-serif font-semibold mb-4">Game Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Questions</span><span className="font-bold">{stats.totalQuestions}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Correct Answers</span><span className="font-bold text-green-600">{stats.correctAnswers}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Accuracy</span><span className="font-bold">{progress}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Current Streak</span><span className="font-bold text-gold">{stats.streak}</span></div>
                  </div>
                </Card>
                <Card className="p-6 gradient-card shadow-card">
                  <h3 className="font-serif font-semibold mb-4">Level Progress</h3>
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-4">
                      <div><div className="text-4xl font-bold text-gold">{stats.level}</div><div className="text-xs text-muted-foreground">Level</div></div>
                    </div>
                    <p className="text-muted-foreground text-sm">{100 - (stats.xp % 100)} XP to next level</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <GalleryModal
        item={selectedArtwork ? { id: selectedArtwork.id, title: selectedArtwork.title, imageUrl: selectedArtwork.image_url, likes: selectedArtwork.likes, prompt: selectedArtwork.original_prompt || undefined, shareId: selectedArtwork.share_id || undefined } : null}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
