import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Upload, Sparkles, Loader2, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const presetStyles = [
  { id: 'van-gogh', label: 'Van Gogh Swirls', prompt: 'Transform in Van Gogh\'s swirling post-impressionist style with bold colors' },
  { id: 'monet', label: 'Monet Impressions', prompt: 'Apply Claude Monet\'s soft impressionist style with dappled light' },
  { id: 'picasso', label: 'Picasso Cubism', prompt: 'Convert to Pablo Picasso\'s cubist style with geometric shapes' },
  { id: 'anime', label: 'Anime Style', prompt: 'Transform into vibrant anime art style with clean lines' },
  { id: 'watercolor', label: 'Watercolor', prompt: 'Apply delicate watercolor painting effect with soft washes' },
  { id: 'neon', label: 'Neon Glow', prompt: 'Add cyberpunk neon glow effect with bright colors on dark background' },
];

interface ArtRemixerProps {
  onArtworkCreated?: () => void;
}

export function ArtRemixer({ onArtworkCreated }: ArtRemixerProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-art', {
        body: {
          prompt,
          sourceImageUrl: sourceImage,
          mode: sourceImage ? 'remix' : 'generate'
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setGeneratedImage(data.imageUrl);
      toast.success('Artwork generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate artwork');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!generatedImage || !user) {
      toast.error('Please sign in to save artwork');
      return;
    }

    setIsSaving(true);
    try {
      const shareId = crypto.randomUUID().slice(0, 8);
      
      const { error } = await supabase.from('user_artworks').insert({
        user_id: user.id,
        title: prompt.slice(0, 50) || 'AI Generated Art',
        image_url: generatedImage,
        original_prompt: prompt,
        share_id: shareId
      });

      if (error) throw error;
      
      toast.success('Saved to your gallery!');
      onArtworkCreated?.();
      setOpen(false);
      setGeneratedImage(null);
      setSourceImage(null);
      setPrompt('');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save artwork');
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-button text-primary-foreground">
          <Wand2 className="w-4 h-4" />
          AI Art Remixer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif">
            <Sparkles className="w-5 h-5 text-gold" />
            AI Art Remixer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Source Image Upload */}
          <div>
            <label className="text-sm font-medium mb-2 block">Source Image (optional)</label>
            <div className="flex gap-4">
              <label className="flex-1">
                <Card className="p-6 border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors text-center">
                  {sourceImage ? (
                    <img src={sourceImage} alt="Source" className="max-h-32 mx-auto object-contain" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload image to remix</p>
                    </>
                  )}
                </Card>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Creative Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the art you want to create or how to transform the image..."
              rows={3}
            />
          </div>

          {/* Preset Styles */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Styles</label>
            <div className="flex flex-wrap gap-2">
              {presetStyles.map((style) => (
                <Button
                  key={style.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(style.prompt)}
                  className="text-xs"
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full gradient-button text-primary-foreground"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Magic...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Artwork
              </>
            )}
          </Button>

          {/* Generated Result */}
          <AnimatePresence>
            {generatedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-4 gradient-card">
                  <img 
                    src={generatedImage} 
                    alt="Generated" 
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveToGallery}
                      disabled={isSaving}
                      className="flex-1 gap-2"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save to Gallery
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = generatedImage;
                        link.download = 'helios-artwork.png';
                        link.click();
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
