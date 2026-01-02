import React, { createContext, useContext, useState, useCallback } from 'react';
import { Badge, badges as allBadges } from '@/lib/gameData';

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
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('helios-game-stats');
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const saveStats = useCallback((newStats: GameStats) => {
    localStorage.setItem('helios-game-stats', JSON.stringify(newStats));
    setStats(newStats);
  }, []);

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
  }, [saveStats]);

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

  const awardBadge = useCallback((badgeId: string) => {
    setStats(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const newStats = { ...prev, badges: [...prev.badges, badgeId] };
      saveStats(newStats);
      return newStats;
    });
  }, [saveStats]);

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
      getProgress
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
