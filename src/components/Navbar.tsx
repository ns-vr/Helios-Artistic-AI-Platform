import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Gamepad2, Search, Users, LayoutDashboard, User, Sparkles, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/game', label: 'Play', icon: Gamepad2 },
  { path: '/gallery', label: 'Gallery', icon: Search },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-gold-foreground" />
            </div>
            <span className="font-serif text-xl font-semibold text-gradient">
              Helios
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Auth Button */}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="ml-2 gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="ml-2 gap-2 bg-gradient-to-r from-primary to-accent"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-300",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-muted-foreground"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="p-2 rounded-lg text-primary"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
