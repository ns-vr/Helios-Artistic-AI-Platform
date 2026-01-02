import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Camera, 
  Sparkles, 
  Video, 
  Mic, 
  Search,
  Gamepad2,
  Trophy,
  Flame,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGame } from '@/contexts/GameContext';
import { ArtScanner } from '@/components/scanner/ArtScanner';
import { cn } from '@/lib/utils';

const aiModules = [
  {
    id: 'scanner',
    name: 'Art Scanner',
    description: 'Analyze artwork with AI',
    icon: Camera,
    color: 'bg-sky/50 text-sky-foreground',
    status: 'ready'
  },
  {
    id: 'nano-banana',
    name: 'Image Generation',
    description: 'Generate & edit images',
    icon: Sparkles,
    color: 'bg-gold/30 text-gold-foreground',
    status: 'ready'
  },
  {
    id: 'veo',
    name: 'Video Animation',
    description: 'Animate static art',
    icon: Video,
    color: 'bg-rose/50 text-rose-foreground',
    status: 'coming soon'
  },
  {
    id: 'voice',
    name: 'Voice Chat',
    description: 'Hands-free assistant',
    icon: Mic,
    color: 'bg-primary/10 text-primary',
    status: 'coming soon'
  },
];

export default function DashboardPage() {
  const { stats, getProgress, getUserBadges } = useGame();
  const [activeTab, setActiveTab] = useState('overview');
  const progress = getProgress();
  const earnedBadges = getUserBadges();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Your Dashboard</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Your AI-powered art studio awaits. Explore, create, and learn.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="scanner">Art Scanner</TabsTrigger>
            <TabsTrigger value="modules">AI Modules</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Helios Quest Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 gradient-card shadow-elevated gold-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gold/30 flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-gold-foreground" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-semibold">Helios Quest</h3>
                          <p className="text-sm text-muted-foreground">Your game progress</p>
                        </div>
                      </div>
                      <Link to="/game">
                        <Button className="gradient-button text-primary-foreground gap-1">
                          Play <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{stats.xp}</div>
                        <div className="text-xs text-muted-foreground">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gold">Lv.{stats.level}</div>
                        <div className="text-xs text-muted-foreground">Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-rose-foreground flex items-center justify-center gap-1">
                          <Flame className="w-5 h-5" />
                          {stats.streak}
                        </div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-sky-foreground">{earnedBadges.length}</div>
                        <div className="text-xs text-muted-foreground">Badges</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </Card>
                </motion.div>

                {/* Quick Start Scanner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 gradient-card shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-sky/50 flex items-center justify-center">
                          <Camera className="w-6 h-6 text-sky-foreground" />
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-semibold">Art Scanner</h3>
                          <p className="text-sm text-muted-foreground">Analyze any artwork</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('scanner')}
                        className="gap-1"
                      >
                        Open Scanner <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Upload an image of any painting, sculpture, or artwork to get AI-powered analysis 
                      of its style, technique, historical context, and significance.
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-5 h-5 text-gold" />
                    <h2 className="font-serif text-xl font-semibold">Badges</h2>
                  </div>

                  <Card className="p-4 gradient-card shadow-card">
                    {earnedBadges.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {earnedBadges.map((badge) => (
                          <div 
                            key={badge.id} 
                            className="text-center p-2 rounded-lg bg-muted/50"
                            title={badge.name}
                          >
                            <div className="text-2xl">{badge.icon}</div>
                            <p className="text-xs text-muted-foreground truncate">{badge.name}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Play games to earn badges!</p>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="p-4 gradient-card shadow-card">
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-2">
                      <Link to="/gallery" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Browse Exhibitions</span>
                      </Link>
                      <Link to="/community" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Community Spotlight</span>
                      </Link>
                      <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Your Profile</span>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          {/* Scanner Tab */}
          <TabsContent value="scanner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <ArtScanner />
            </motion.div>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-xl font-semibold">AI Modules</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {aiModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-6 gradient-card shadow-card hover:shadow-elevated transition-all cursor-pointer group">
                        <div className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                          module.color
                        )}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{module.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {module.description}
                        </p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          module.status === 'ready' 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {module.status}
                        </span>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
