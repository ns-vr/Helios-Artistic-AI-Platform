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
import { useGame } from '@/contexts/GameContext';
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
    name: 'Nano Banana Pro',
    description: 'Edit & generate images',
    icon: Sparkles,
    color: 'bg-gold/30 text-gold-foreground',
    status: 'ready'
  },
  {
    id: 'veo',
    name: 'Veo Animation',
    description: 'Animate static art',
    icon: Video,
    color: 'bg-rose/50 text-rose-foreground',
    status: 'ready'
  },
  {
    id: 'voice',
    name: 'Voice Chat',
    description: 'Hands-free assistant',
    icon: Mic,
    color: 'bg-primary/10 text-primary',
    status: 'ready'
  },
  {
    id: 'search',
    name: 'Search Grounding',
    description: 'Real-time art data',
    icon: Search,
    color: 'bg-accent text-accent-foreground',
    status: 'ready'
  },
];

export default function DashboardPage() {
  const { stats, getProgress, getUserBadges } = useGame();
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

            {/* AI Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
                <h2 className="font-serif text-xl font-semibold">Gemini Spark Modules</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {aiModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Card className="p-4 gradient-card shadow-card hover:shadow-elevated transition-all cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                            module.color
                          )}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{module.name}</h3>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-600">
                                {module.status}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {module.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-semibold">Recent Activity</h2>
              </div>

              <Card className="p-6 gradient-card shadow-card">
                <div className="text-center text-muted-foreground py-8">
                  <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent scans or remixes</p>
                  <p className="text-sm">Start by scanning an artwork or playing a game!</p>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Scan Art
                    </Button>
                    <Link to="/game">
                      <Button size="sm" className="gradient-button text-primary-foreground">
                        <Gamepad2 className="w-4 h-4 mr-2" />
                        Play Game
                      </Button>
                    </Link>
                  </div>
                </div>
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
      </div>
    </div>
  );
}
