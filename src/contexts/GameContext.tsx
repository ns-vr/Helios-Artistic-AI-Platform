import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Badge, badges as allBadges } from '@/lib/gameData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GameStats {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  correctAnswers: number;
  totalQuestions: number;
  badges: string[];
  completedLevels: { [key: number]: number };
}

interface GameContextType {
  stats: GameStats;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  recordAnswer: (correct: boolean) => void;
  awardBadge: (badgeId: string) => void;
  getUserBadges: () => Badge[];
  getProgress: () => number;
  isLoading: boolean;
}

const defaultStats: GameStats = {
  xp: 0,
  level: 1,
  streak: 0,
  bestStreak: 0,
  correctAnswers: 0,
  totalQuestions: 0,
  badges: [],
  completedLevels: {}
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  // Load stats from database when user logs in
  useEffect(() => {
    if (user) {
      loadStatsFromDB();
    } else {
      // Load from localStorage for guest users
      const saved = localStorage.getItem('helios-game-stats');
      setStats(saved ? JSON.parse(saved) : defaultStats);
      setIsLoading(false);
    }
  }, [user]);

  const loadStatsFromDB = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch game stats
      const { data: gameStats, error: statsError } = await supabase
        .from('game_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error loading game stats:', statsError);
      }

      // Fetch user badges
      const { data: userBadges, error: badgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      if (badgesError) {
        console.error('Error loading badges:', badgesError);
      }

      if (gameStats) {
        setStats({
          xp: gameStats.xp,
          level: gameStats.level,
          streak: gameStats.streak,
          bestStreak: gameStats.best_streak,
          correctAnswers: gameStats.correct_answers,
          totalQuestions: gameStats.total_questions,
          badges: userBadges?.map(b => b.badge_id) || [],
          completedLevels: {}
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncToDatabase = useCallback(async (newStats: GameStats) => {
    if (!user) {
      localStorage.setItem('helios-game-stats', JSON.stringify(newStats));
      return;
    }

    try {
      await supabase
        .from('game_stats')
        .update({
          xp: newStats.xp,
          level: newStats.level,
          streak: newStats.streak,
          best_streak: newStats.bestStreak,
          correct_answers: newStats.correctAnswers,
          total_questions: newStats.totalQuestions
        })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error syncing to database:', error);
    }
  }, [user]);

  const saveStats = useCallback((newStats: GameStats) => {
    setStats(newStats);
    syncToDatabase(newStats);
  }, [syncToDatabase]);

  const addXP = useCallback((amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newStats = { ...prev, xp: newXP, level: newLevel };
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats]);

  const incrementStreak = useCallback(() => {
    setStats(prev => {
      const newStreak = prev.streak + 1;
      const newBestStreak = Math.max(newStreak, prev.bestStreak);
      let newBadges = [...prev.badges];
      
      // Award streak badge if reached 10
      if (newStreak >= 10 && !newBadges.includes('streak-master')) {
        newBadges.push('streak-master');
        // Also save badge to DB if user is logged in
        if (user) {
          supabase.from('user_badges').insert({
            user_id: user.id,
            badge_id: 'streak-master'
          }).then(() => {});
        }
      }
      
      const newStats = { 
        ...prev, 
        streak: newStreak, 
        bestStreak: newBestStreak,
        badges: newBadges
      };
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats, user]);

  const resetStreak = useCallback(() => {
    setStats(prev => {
      const newStats = { ...prev, streak: 0 };
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats]);

  const recordAnswer = useCallback((correct: boolean) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
        totalQuestions: prev.totalQuestions + 1
      };
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats]);

  const awardBadge = useCallback(async (badgeId: string) => {
    setStats(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const newStats = { ...prev, badges: [...prev.badges, badgeId] };
      saveStats(newStats);
      
      // Save to DB if logged in
      if (user) {
        supabase.from('user_badges').insert({
          user_id: user.id,
          badge_id: badgeId
        }).then(() => {});
      }
      
      return newStats;
    });
  }, [saveStats, user]);

  const getUserBadges = useCallback(() => {
    return allBadges.filter(badge => stats.badges.includes(badge.id));
  }, [stats.badges]);

  const getProgress = useCallback(() => {
    if (stats.totalQuestions === 0) return 0;
    return Math.round((stats.correctAnswers / stats.totalQuestions) * 100);
  }, [stats.correctAnswers, stats.totalQuestions]);

  return (
    <GameContext.Provider value={{
      stats,
      addXP,
      incrementStreak,
      resetStreak,
      recordAnswer,
      awardBadge,
      getUserBadges,
      getProgress,
      isLoading
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
