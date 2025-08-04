import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'For Job Seekers', href: '#job-seekers' },
    { label: 'For Employers', href: '#employers' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glass-header shadow-glass' : 'bg-background/50'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="p-2 rounded-xl text-primary-foreground">
                <img src="/Main_Logo.png" alt="JobMatch AI Logo" className="h-6 w-6 object-contain" />
              </div>
              <span className="text-xl font-bold">ZenithWork AI</span>
            </Link>


            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200 hover:underline underline-offset-4"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" className="btn-ghost">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="btn-primary">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          <div className="absolute top-16 left-0 right-0 bg-card border-b border-border shadow-elevation">
            <nav className="container mx-auto px-4 py-8">
              <div className="flex flex-col space-y-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-3 pt-6 border-t border-border">
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="ghost" className="btn-ghost w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={toggleMenu}>
                    <Button className="btn-primary w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;