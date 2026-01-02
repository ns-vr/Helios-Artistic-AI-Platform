import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image, Mic, Gamepad2, Search, Users, HelpCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Search, label: 'Scan Art', action: 'scan_art' },
  { icon: Sparkles, label: 'Learn Artist', action: 'learn_painter' },
  { icon: Gamepad2, label: 'Play Game', action: 'play_game' },
  { icon: Search, label: 'Find Shows', action: 'search_exhibitions' },
  { icon: Users, label: 'Community', action: 'view_community' },
  { icon: HelpCircle, label: 'Help', action: 'profile_help' },
];

export function HeliosMuse() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello, I\'m Helios Muse ✨ Your peaceful guide through the world of art. How may I illuminate your journey today?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        'game': 'Ready to test your art knowledge? Navigate to the Game tab to play "Remember the Master" - match paintings to their creators and earn XP! 🎮',
        'scan': 'I can help analyze artwork! For now, try uploading an image or describe a painting you\'d like to learn about.',
        'show': 'Looking for art exhibitions? Check out the Gallery tab to discover amazing shows near you, from Van Gogh immersive experiences to contemporary showcases.',
        'community': 'The Helios community is vibrant! Visit the Community page to see today\'s spotlight artwork, join learning circles, or find collaborators.',
        'default': 'What a beautiful question! Art connects us across time and space. Let me guide you - would you like to explore paintings, play a game, or discover exhibitions?'
      };

      const lowerInput = inputValue.toLowerCase();
      let responseText = responses.default;
      
      if (lowerInput.includes('game') || lowerInput.includes('play') || lowerInput.includes('quiz')) {
        responseText = responses.game;
      } else if (lowerInput.includes('scan') || lowerInput.includes('image') || lowerInput.includes('analyze')) {
        responseText = responses.scan;
      } else if (lowerInput.includes('show') || lowerInput.includes('exhibition') || lowerInput.includes('gallery')) {
        responseText = responses.show;
      } else if (lowerInput.includes('community') || lowerInput.includes('collab') || lowerInput.includes('artist')) {
        responseText = responses.community;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      scan_art: 'I\'d like to scan and analyze an artwork',
      learn_painter: 'Tell me about a famous painter',
      play_game: 'I want to play the art memory game',
      search_exhibitions: 'Find art exhibitions near me',
      view_community: 'Show me the community highlights',
      profile_help: 'Help me with my profile settings'
    };

    setInputValue(actionMessages[action] || '');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-muse shadow-elevated",
          "flex items-center justify-center transition-all duration-300",
          "hover:scale-110 glow-pulse",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="w-6 h-6 text-silver-foreground" />
      </button>

      {/* Chat Panel */}
      <div className={cn(
        "fixed inset-0 z-50 transition-all duration-500",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />

        {/* Chat Window */}
        <div className={cn(
          "absolute bottom-0 right-0 w-full sm:w-[420px] sm:bottom-6 sm:right-6 sm:rounded-2xl",
          "h-[100dvh] sm:h-[600px] bg-card border border-border shadow-elevated",
          "flex flex-col overflow-hidden transition-all duration-500",
          isOpen 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full sm:translate-y-8 opacity-0"
        )}>
          {/* Header */}
          <div className="gradient-hero p-4 flex items-center justify-between border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-gold-foreground" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground">Helios Muse</h3>
                <p className="text-xs text-muted-foreground">Your art companion</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-border/50 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-card">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                <Mic className="w-5 h-5" />
              </Button>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about art..."
                className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                size="icon"
                className="shrink-0 gradient-button text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
