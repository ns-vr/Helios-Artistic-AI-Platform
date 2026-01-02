import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Sparkles, X, Loader2, Palette, Clock, MapPin, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ArtAnalysis {
  title: string;
  artist: string;
  period: string;
  style: string;
  technique: string;
  colors: string[];
  mood: string;
  composition: string;
  historicalContext: string;
  interpretation: string;
  funFact: string;
  similarWorks: string[];
}

export function ArtScanner() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ArtAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeArt = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-art', {
        body: { imageUrl: image, action: 'analyze' }
      });

      if (error) throw error;
      
      if (data.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Analysis complete! ✨",
          description: "Helios has uncovered the secrets of this artwork"
        });
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze the artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card 
              className="p-12 gradient-card border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-lavender to-sky flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Upload Artwork</h3>
                <p className="text-muted-foreground mb-4">
                  Drop an image or click to browse
                </p>
                <div className="flex gap-3">
                  <Badge variant="secondary">JPG</Badge>
                  <Badge variant="secondary">PNG</Badge>
                  <Badge variant="secondary">WebP</Badge>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Image Preview */}
            <Card className="relative overflow-hidden gradient-card">
              <button
                onClick={clearImage}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center hover:bg-card transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img 
                src={image} 
                alt="Uploaded artwork" 
                className="w-full max-h-[400px] object-contain"
              />
            </Card>

            {/* Analyze Button */}
            {!analysis && (
              <Button
                onClick={analyzeArt}
                disabled={analyzing}
                className="w-full bg-gradient-to-r from-gold to-silver text-white hover:opacity-90"
                size="lg"
              >
                {analyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Helios is analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Analyze with Helios
                  </span>
                )}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title Card */}
            <Card className="p-6 gradient-card gold-border">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {analysis.title}
                  </h2>
                  <p className="text-lg text-muted-foreground">{analysis.artist}</p>
                </div>
                <Badge className="bg-gradient-to-r from-gold to-silver text-white">
                  {analysis.style}
                </Badge>
              </div>
            </Card>

            {/* Details Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Period & Technique */}
              <Card className="p-5 gradient-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-lavender/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-medium">{analysis.period}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose/30 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-rose-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Technique</p>
                    <p className="font-medium">{analysis.technique}</p>
                  </div>
                </div>
              </Card>

              {/* Colors */}
              <Card className="p-5 gradient-card">
                <p className="text-sm text-muted-foreground mb-3">Color Palette</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.colors.map((color, i) => (
                    <Badge key={i} variant="outline" className="capitalize">
                      {color}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">Mood</p>
                <p className="font-medium capitalize">{analysis.mood}</p>
              </Card>
            </div>

            {/* Interpretation */}
            <Card className="p-5 gradient-card">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-gold" />
                <h3 className="font-serif font-semibold">Interpretation</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.interpretation}
              </p>
            </Card>

            {/* Historical Context */}
            <Card className="p-5 gradient-card">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-semibold">Historical Context</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.historicalContext}
              </p>
            </Card>

            {/* Fun Fact */}
            <Card className="p-5 bg-gradient-to-r from-lavender/20 to-sky/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold mb-1">Did You Know?</h3>
                  <p className="text-muted-foreground">{analysis.funFact}</p>
                </div>
              </div>
            </Card>

            {/* Similar Works */}
            {analysis.similarWorks?.length > 0 && (
              <Card className="p-5 gradient-card">
                <h3 className="font-serif font-semibold mb-3">Explore Similar Works</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.similarWorks.map((work, i) => (
                    <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {work}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Scan Another */}
            <Button
              onClick={clearImage}
              variant="outline"
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Scan Another Artwork
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
