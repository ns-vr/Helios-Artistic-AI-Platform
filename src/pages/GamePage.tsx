import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Flame, Star, Award } from 'lucide-react';
import { MemoryGame } from '@/components/game/MemoryGame';
import { LevelSelector } from '@/components/game/LevelSelector';
import { useGame } from '@/contexts/GameContext';
import { badges as allBadges } from '@/lib/gameData';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function GamePage() {
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | null>(null);
  const { stats, getUserBadges } = useGame();
  const earnedBadges = getUserBadges();

  const handleComplete = (score: number, total: number) => {
    // Game completion is handled in MemoryGame component
    console.log(`Game complete: ${score}/${total}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose/30 text-rose-foreground mb-4">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-sm font-medium">Helios Quest</span>
          </div>
          
          <h1 className="font-serif text-4xl font-bold mb-2">Remember the Master</h1>
          <p className="text-muted-foreground">
            Test your knowledge of art history's greatest painters and paintings
          </p>
        </motion.div>

        {/* Game Area */}
        {selectedLevel ? (
          <MemoryGame 
            level={selectedLevel} 
            onComplete={handleComplete}
            onBack={() => setSelectedLevel(null)}
          />
        ) : (
          <LevelSelector onSelectLevel={setSelectedLevel} />
        )}

        {/* Badges Section (when not playing) */}
        {!selectedLevel && earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-xl font-semibold">Your Badges</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <Card 
                  key={badge.id}
                  className={cn(
                    "p-4 text-center gradient-card shadow-card",
                    badge.color === 'gold' && "gold-border"
                  )}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h3 className="font-serif font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Available Badges */}
        {!selectedLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-muted-foreground" />
              <h2 className="font-serif text-xl font-semibold text-muted-foreground">
                Badges to Earn
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allBadges.filter(b => !stats.badges.includes(b.id)).map((badge) => (
                <Card 
                  key={badge.id}
                  className="p-4 text-center opacity-60 gradient-card"
                >
                  <div className="text-3xl mb-2 grayscale">{badge.icon}</div>
                  <h3 className="font-serif font-semibold text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
