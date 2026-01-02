import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image, Gamepad2, Search, Users, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Prepare messages for API (exclude system greeting)
      const apiMessages = [...messages.slice(1), userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/helios-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: apiMessages }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate limited",
            description: "Please wait a moment and try again.",
            variant: "destructive"
          });
          throw new Error("Rate limited");
        }
        if (response.status === 402) {
          toast({
            title: "Credits exhausted",
            description: "AI credits are low. Please try again later.",
            variant: "destructive"
          });
          throw new Error("Credits exhausted");
        }
        throw new Error("Failed to get response");
      }

      // Stream the response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      let buffer = '';
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            // Incomplete JSON, continue
          }
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error);
      // Add fallback message on error
      if (!error.message.includes('Rate limited') && !error.message.includes('Credits')) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Apologies, I'm having a moment of artistic contemplation. Please try again shortly. ✨",
          timestamp: new Date()
        }]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: string } = {
      scan_art: 'How do I scan and analyze an artwork?',
      learn_painter: 'Tell me about Vincent van Gogh',
      play_game: 'How do I play the art memory game?',
      search_exhibitions: 'How can I find art exhibitions?',
      view_community: 'What can I do in the community?',
      profile_help: 'Help me understand my profile and badges'
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
                <p className="text-xs text-muted-foreground">AI Art Companion</p>
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
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && messages[messages.length - 1]?.content === '' && (
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
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about art..."
                disabled={isTyping}
                className="flex-1 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
                className="shrink-0 gradient-button text-primary-foreground"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
