import { Badge } from '@/lib/gameData';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BadgeTooltipProps {
  badge: Badge;
  earned?: boolean;
}

export function BadgeTooltip({ badge, earned = true }: BadgeTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Card 
            className={cn(
              "p-4 text-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg",
              earned ? "gradient-card shadow-card" : "opacity-50",
              badge.color === 'gold' && earned && "gold-border"
            )}
          >
            <div className="text-4xl mb-2">{badge.icon}</div>
            <h3 className="font-serif font-semibold text-sm">{badge.name}</h3>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            <p className="text-xs text-primary">{badge.requirement}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
