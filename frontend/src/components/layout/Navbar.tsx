import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui';

const navLinks = [
  { label: 'Features',    href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Community',   href: '#stats' },
  { label: 'Contact',     href: '#footer' },
];

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(232, 75, 58, 0.12)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-shadow duration-300 group-hover:shadow-[0_0_16px_rgba(232,75,58,0.5)]"
                style={{ background: 'linear-gradient(135deg, #e84b3a, #f5a623)' }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "'Clash Display', sans-serif", color: '#f5f3ef' }}
              >
                Uni<span className="text-gradient">Space</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                  style={{ color: '#d4d0c8' }}
                  onMouseEnter={e => {
                    (e.target as HTMLAnchorElement).style.color = '#f5f3ef';
                    (e.target as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLAnchorElement).style.color = '#d4d0c8';
                    (e.target as HTMLAnchorElement).style.background = '';
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl transition-colors duration-200"
              style={{ color: '#d4d0c8' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <div
              className="absolute top-16 left-4 right-4 rounded-2xl p-4"
              style={{ background: '#141414', border: '1px solid rgba(232,75,58,0.2)' }}
            >
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200"
                    style={{ color: '#d4d0c8' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(232,75,58,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(232,75,58,0.1)' }}>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block">
                  <Button variant="outline" size="md" className="w-full">Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block">
                  <Button size="md" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
