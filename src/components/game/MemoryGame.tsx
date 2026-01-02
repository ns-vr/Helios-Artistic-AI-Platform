import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight, Trophy, Flame, Star, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  QuizQuestion, 
  generateQuizQuestions, 
  getPaintingById, 
  getPainterById 
} from '@/lib/gameData';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

interface MemoryGameProps {
  level: 1 | 2 | 3;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

export function MemoryGame({ level, onComplete, onBack }: MemoryGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const { addXP, incrementStreak, resetStreak, recordAnswer } = useGame();

  useEffect(() => {
    setQuestions(generateQuizQuestions(level, 5));
  }, [level]);

  const currentQuestion = questions[currentIndex];
  const painting = currentQuestion?.paintingId ? getPaintingById(currentQuestion.paintingId) : null;
  const painter = currentQuestion?.painterId ? getPainterById(currentQuestion.painterId) : null;

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion.correctAnswer;
    recordAnswer(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      addXP(level * 10);
      incrementStreak();
    } else {
      resetStreak();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
      onComplete(score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0), questions.length);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading questions...</div>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = score + (selectedAnswer === currentQuestion?.correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-gold flex items-center justify-center shadow-glow">
          <Trophy className="w-12 h-12 text-gold-foreground" />
        </div>
        
        <h2 className="font-serif text-3xl font-bold mb-2">
          {percentage >= 80 ? 'Magnificent!' : percentage >= 60 ? 'Well Done!' : 'Keep Learning!'}
        </h2>
        
        <p className="text-muted-foreground mb-6">
          You scored {finalScore} out of {questions.length}
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{percentage}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gold">+{finalScore * level * 10}</div>
            <div className="text-xs text-muted-foreground">XP Earned</div>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={onBack}>
            Back to Levels
          </Button>
          <Button onClick={() => {
            setQuestions(generateQuizQuestions(level, 5));
            setCurrentIndex(0);
            setScore(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setIsComplete(false);
          }} className="gradient-button text-primary-foreground">
            Play Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 text-gold" />
            <span className="font-medium">{score}/{questions.length}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Level {level}</span>
          </div>
        </div>
      </div>
      
      <Progress value={(currentIndex / questions.length) * 100} className="h-2" />

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 gradient-card shadow-card">
            {/* Image (for painting questions) */}
            {painting && (
              <div className="mb-6 rounded-xl overflow-hidden aspect-[4/3] relative">
                <img 
                  src={painting.imageUrl} 
                  alt="Mystery artwork"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
            )}
            
            {/* Painter image (for title matching) */}
            {painter && (
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gold/30 shadow-glow">
                  <img 
                    src={painter.imageUrl} 
                    alt={painter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Question */}
            <h3 className="font-serif text-xl font-semibold text-center mb-6">
              {currentQuestion.question}
            </h3>

            {/* Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                const showCorrectness = showResult;
                
                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all duration-300 border-2",
                      !showCorrectness && "border-border hover:border-primary/50 hover:bg-primary/5",
                      showCorrectness && isCorrect && "border-green-500 bg-green-500/10",
                      showCorrectness && isSelected && !isCorrect && "border-red-500 bg-red-500/10",
                      showCorrectness && !isSelected && !isCorrect && "border-border opacity-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "font-medium",
                        showCorrectness && isCorrect && "text-green-700",
                        showCorrectness && isSelected && !isCorrect && "text-red-700"
                      )}>
                        {option}
                      </span>
                      {showCorrectness && isCorrect && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      {showCorrectness && isSelected && !isCorrect && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">
                        {currentQuestion.explanation}
                      </p>
                      {currentQuestion.relatedWork && (
                        <p className="text-xs text-muted-foreground mt-2">
                          💡 Also explore: "{currentQuestion.relatedWork}"
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button 
            onClick={handleNext}
            className="gradient-button text-primary-foreground px-8"
          >
            {currentIndex < questions.length - 1 ? (
              <>Continue <ChevronRight className="w-4 h-4 ml-1" /></>
            ) : (
              <>See Results <Trophy className="w-4 h-4 ml-1" /></>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}
