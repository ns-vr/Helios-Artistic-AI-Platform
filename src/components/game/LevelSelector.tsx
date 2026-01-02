import { motion } from 'framer-motion';
import { Sparkles, Trophy, Target, Brain } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

interface LevelSelectorProps {
  onSelectLevel: (level: 1 | 2 | 3) => void;
}

const levels = [
  {
    level: 1 as const,
    title: 'Match the Master',
    description: 'See a painting, identify the artist',
    icon: Sparkles,
    color: 'sky',
    difficulty: 'Beginner'
  },
  {
    level: 2 as const,
    title: 'Name the Work',
    description: 'Know the artist, find their painting',
    icon: Target,
    color: 'rose',
    difficulty: 'Intermediate'
  },
  {
    level: 3 as const,
    title: 'Art Historian',
    description: 'Deep knowledge of why art matters',
    icon: Brain,
    color: 'gold',
    difficulty: 'Advanced'
  }
];

export function LevelSelector({ onSelectLevel }: LevelSelectorProps) {
  const { stats } = useGame();

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card className="p-4 text-center gradient-card shadow-card">
          <div className="text-3xl font-bold text-primary">{stats.xp}</div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </Card>
        <Card className="p-4 text-center gradient-card shadow-card">
          <div className="text-3xl font-bold text-gold">{stats.bestStreak}</div>
          <div className="text-xs text-muted-foreground">Best Streak</div>
        </Card>
        <Card className="p-4 text-center gradient-card shadow-card">
          <div className="text-3xl font-bold text-rose-foreground">{stats.badges.length}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </Card>
      </motion.div>

      {/* Level Cards */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-center">Choose Your Challenge</h2>
        
        <div className="grid gap-4">
          {levels.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => onSelectLevel(item.level)}
                  className="w-full text-left"
                >
                  <Card className={cn(
                    "p-5 transition-all duration-300 hover:shadow-elevated",
                    "border-2 hover:border-primary/50 group cursor-pointer",
                    "gradient-card"
                  )}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center shrink-0",
                        "transition-all duration-300 group-hover:scale-110",
                        item.color === 'sky' && "bg-sky/50 text-sky-foreground",
                        item.color === 'rose' && "bg-rose/50 text-rose-foreground",
                        item.color === 'gold' && "bg-gold/30 text-gold-foreground"
                      )}>
                        <Icon className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-serif font-semibold text-lg">
                            {item.title}
                          </h3>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            item.level === 1 && "bg-sky/50 text-sky-foreground",
                            item.level === 2 && "bg-rose/50 text-rose-foreground",
                            item.level === 3 && "bg-gold/30 text-gold-foreground"
                          )}>
                            {item.difficulty}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        <Trophy className="w-5 h-5" />
                      </div>
                    </div>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
