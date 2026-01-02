import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Gamepad2, Sparkles, Users, Camera, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/hero-gallery.jpg';

const quickActions = [
  { 
    icon: Camera, 
    label: 'Scan Art', 
    description: 'Analyze any artwork with AI',
    path: '/dashboard',
    color: 'bg-sky/50 text-sky-foreground'
  },
  { 
    icon: Gamepad2, 
    label: 'Play Game', 
    description: 'Test your art knowledge',
    path: '/game',
    color: 'bg-rose/50 text-rose-foreground'
  },
  { 
    icon: Search, 
    label: 'Find Shows', 
    description: 'Discover exhibitions',
    path: '/gallery',
    color: 'bg-primary/10 text-primary'
  },
  { 
    icon: Users, 
    label: 'Community', 
    description: 'Connect with artists',
    path: '/community',
    color: 'bg-gold/30 text-gold-foreground'
  },
];

const trendingRemixes = [
  {
    id: 1,
    title: 'Starry Night in Neon',
    artist: 'NeonDreamer',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400',
    likes: 234
  },
  {
    id: 2,
    title: 'Mona Lisa Cyberpunk',
    artist: 'DigitalMaster',
    imageUrl: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400',
    likes: 189
  },
  {
    id: 3,
    title: 'Water Lilies Abstract',
    artist: 'ColorFlow',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    likes: 156
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Ethereal art gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold/40"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * -200],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold-foreground mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Art Discovery</span>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-foreground">
              Welcome to{' '}
              <span className="text-gradient">Helios</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Your peaceful sanctuary for discovering, learning, and creating art. 
              Powered by AI, inspired by masters.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search exhibitions, artists, or art styles..."
                  className="pl-12 pr-4 h-14 text-lg bg-card/80 backdrop-blur-sm border-border/50 rounded-2xl shadow-soft"
                />
                <Button className="absolute right-2 top-1/2 -translate-y-1/2 gradient-button text-primary-foreground rounded-xl">
                  Explore
                </Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/game">
                <Button size="lg" className="gradient-button text-primary-foreground gap-2 rounded-xl shadow-elevated">
                  <Gamepad2 className="w-5 h-5" />
                  Play Remember the Master
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="gap-2 rounded-xl bg-card/50 backdrop-blur-sm">
                  <Search className="w-5 h-5" />
                  Browse Exhibitions
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.path}>
                  <Card className="p-6 text-center hover:shadow-elevated transition-all duration-300 cursor-pointer group gradient-card">
                    <div className={`w-14 h-14 mx-auto rounded-xl ${action.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-serif font-semibold mb-1">{action.label}</h3>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Trending Remixes */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h2 className="font-serif text-2xl font-semibold">Trending Remixes</h2>
              </div>
              <Link to="/community">
                <Button variant="ghost" className="gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {trendingRemixes.map((remix, index) => (
                <motion.div
                  key={remix.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden group cursor-pointer shadow-card hover:shadow-elevated transition-all">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={remix.imageUrl} 
                        alt={remix.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif font-semibold">{remix.title}</h3>
                      <p className="text-sm text-muted-foreground">by {remix.artist}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Powered by{' '}
            <span className="text-gradient">Google Gemini</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Experience cutting-edge AI features including Nano Banana Pro for image editing, 
            Veo for video animation, and advanced multimodal understanding.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="p-6 gradient-card shadow-card">
              <div className="w-12 h-12 rounded-xl bg-sky/50 flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-sky-foreground" />
              </div>
              <h3 className="font-serif font-semibold mb-2">Art Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Upload any artwork and get instant AI analysis of style, technique, and historical context.
              </p>
            </Card>
            
            <Card className="p-6 gradient-card shadow-card">
              <div className="w-12 h-12 rounded-xl bg-rose/50 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-rose-foreground" />
              </div>
              <h3 className="font-serif font-semibold mb-2">Remix Generator</h3>
              <p className="text-sm text-muted-foreground">
                Transform classic masterpieces into your own style with AI-powered image editing.
              </p>
            </Card>
            
            <Card className="p-6 gradient-card shadow-card">
              <div className="w-12 h-12 rounded-xl bg-gold/30 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-gold-foreground" />
              </div>
              <h3 className="font-serif font-semibold mb-2">Video Animation</h3>
              <p className="text-sm text-muted-foreground">
                Bring static art to life with Veo - animate paintings into immersive 8-second clips.
              </p>
            </Card>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
