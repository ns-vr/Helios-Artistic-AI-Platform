import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Upload, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const artisticFilters = [
  { id: 'van-gogh', label: 'Van Gogh', preview: '🌻' },
  { id: 'impressionist', label: 'Impressionist', preview: '🎨' },
  { id: 'surreal', label: 'Surreal', preview: '⏰' },
  { id: 'pop-art', label: 'Pop Art', preview: '🎯' },
  { id: 'renaissance', label: 'Renaissance', preview: '🖼️' },
  { id: 'anime', label: 'Anime', preview: '✨' },
  { id: 'watercolor', label: 'Watercolor', preview: '💧' },
  { id: 'oil-painting', label: 'Oil Painting', preview: '🖌️' },
];

interface AvatarFilterProps {
  currentAvatar?: string;
  onAvatarUpdate?: (newUrl: string) => void;
}

export function AvatarFilter({ currentAvatar, onAvatarUpdate }: AvatarFilterProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filteredImage, setFilteredImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setFilteredImage(null);
        setSelectedFilter(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyFilter = async (filterId: string) => {
    const imageToProcess = uploadedImage || currentAvatar;
    if (!imageToProcess) {
      toast.error('Please upload an image first');
      return;
    }

    setSelectedFilter(filterId);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('apply-avatar-filter', {
        body: {
          imageUrl: imageToProcess,
          filterType: filterId
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setFilteredImage(data.imageUrl);
      toast.success('Filter applied!');
    } catch (error) {
      console.error('Filter error:', error);
      toast.error('Failed to apply filter');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!filteredImage || !user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: filteredImage })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Avatar updated!');
      onAvatarUpdate?.(filteredImage);
      setOpen(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save avatar');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Paintbrush className="w-4 h-4" />
          Artistic Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Paintbrush className="w-5 h-5 text-primary" />
            Apply Artistic Filter
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Photo</label>
            <label className="block">
              <Card className="p-6 border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors text-center">
                {uploadedImage || currentAvatar ? (
                  <img 
                    src={uploadedImage || currentAvatar} 
                    alt="Avatar" 
                    className="w-32 h-32 mx-auto rounded-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload your photo</p>
                  </>
                )}
              </Card>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Filter Grid */}
          <div>
            <label className="text-sm font-medium mb-2 block">Choose Style</label>
            <div className="grid grid-cols-4 gap-2">
              {artisticFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => handleApplyFilter(filter.id)}
                  disabled={isProcessing}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    selectedFilter === filter.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{filter.preview}</span>
                  <span className="text-xs font-medium">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Applying artistic filter...</span>
            </div>
          )}

          {/* Preview Result */}
          <AnimatePresence>
            {filteredImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-4 gradient-card">
                  <p className="text-sm font-medium mb-2 text-center">Preview</p>
                  <img 
                    src={filteredImage} 
                    alt="Filtered" 
                    className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-gold/30"
                  />
                  <Button
                    onClick={handleSaveAvatar}
                    disabled={isSaving}
                    className="w-full mt-4 gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Set as Avatar
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
