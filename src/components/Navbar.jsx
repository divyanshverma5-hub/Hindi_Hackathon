import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Mic, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  MoreVertical,
  Building2,
  HelpCircle,
  Sliders,
  TrendingUp,
  BarChart3,
  Layers,
  Volume2
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function Navbar({ 
  currentPath, 
  navigate, 
  onOpenVoiceModal,
  theme,
  toggleTheme
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const unsub = bhasiniService.subscribe((event) => {
      if (event.type === 'speaking_start') setIsSpeaking(true);
      if (event.type === 'speaking_end') setIsSpeaking(false);
    });
    return unsub;
  }, []);

  // Close more menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Main 4 Nav Links (Single-line Hindi labels, NO English brackets)
  const mainLinks = [
    { id: 'today', label: 'आज', path: '/app', icon: TrendingUp },
    { id: 'compare', label: 'मंडी तुलना', path: '/app/compare', icon: BarChart3 },
    { id: 'holdings', label: 'फसल स्टॉक', path: '/app/holdings', icon: Layers },
    { id: 'voice', label: 'बोलती सलाह', path: '/app/voice', icon: Volume2 }
  ];

  // Secondary Links in "अधिक (⋮)" Menu
  const moreLinks = [
    { id: 'fpo', label: 'FPO पोर्टल', path: '/fpo', icon: Building2 },
    { id: 'demo', label: 'डेमो वॉकथ्रू', path: '/demo', icon: HelpCircle },
    { id: 'settings', label: 'सेटिंग्स', path: '/app/settings', icon: Sliders }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-header)] backdrop-blur shadow-sm transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="होमपेज पर जाएं"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2e7d32] text-white shadow-sm group-hover:scale-105 transition-transform">
              <Sprout className="h-5 w-5 text-[#fef08a]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[var(--text-main)]">
                  कृषि<span className="text-[#2e7d32]">वाणी</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  भाषिणी
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Desktop 4 Main Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="मुख्य मेनू">
          {mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path === '/app' && currentPath === '/');
            return (
              <button
                key={link.id}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#2e7d32] text-white shadow-sm' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* More Menu Dropdown (⋮) */}
          <div className="relative ml-1" ref={moreMenuRef}>
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
              title="अधिक विकल्प"
              aria-label="अधिक विकल्प"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] py-1.5 shadow-xl animate-fadeIn text-sm z-50">
                {moreLinks.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMoreMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left font-medium transition-colors ${
                        isActive 
                          ? 'bg-[var(--brand-green-subtle)] text-[#2e7d32] font-bold' 
                          : 'text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)]'
                      }`}
                    >
                      <ItemIcon className="h-4 w-4 text-[#2e7d32]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Tools: Mic + Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          
          {/* Mic Button */}
          <button
            onClick={onOpenVoiceModal}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-sm ${
              isSpeaking
                ? 'bg-amber-500 text-white animate-pulse ring-2 ring-amber-400'
                : 'bg-[#2e7d32] hover:bg-[#256629] text-white'
            }`}
            title="बोलकर पूछें"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isSpeaking ? 'बोल रहा है...' : 'बोलकर पूछें'}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
            title={theme === 'noon' ? 'सांझ मोड' : 'दोपहर मोड'}
            aria-label="थीम बदलें"
          >
            {theme === 'noon' ? (
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] md:hidden hover:bg-[var(--bg-card-subtle)]"
            aria-label="मेनू खोलें"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--bg-header)] px-4 py-3 md:hidden animate-fadeIn space-y-1">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#2e7d32] text-white' 
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-[var(--border-color)] pt-2 space-y-1">
            <span className="text-[11px] font-bold text-[var(--text-muted)] px-2 uppercase">अधिक सेवाएं</span>
            {moreLinks.map((item) => {
              const ItemIcon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive 
                      ? 'text-[#2e7d32] font-bold' 
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)]'
                  }`}
                >
                  <ItemIcon className="h-3.5 w-3.5 text-[#2e7d32]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
