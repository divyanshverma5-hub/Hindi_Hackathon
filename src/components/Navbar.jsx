import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Mic, 
  Volume2, 
  BarChart3, 
  Layers, 
  Sliders, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  TrendingUp, 
  Sparkles,
  HelpCircle,
  Building2,
  PhoneCall
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function Navbar({ 
  currentPath, 
  navigate, 
  onOpenVoiceModal,
  theme,
  toggleTheme,
  language,
  setLanguage
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = bhasiniService.subscribe((event) => {
      if (event.type === 'speaking_start') setIsSpeaking(true);
      if (event.type === 'speaking_end') setIsSpeaking(false);
    });
    return unsub;
  }, []);

  const navLinks = [
    { id: 'today', label: 'आज (Today)', path: '/app', icon: TrendingUp },
    { id: 'compare', label: 'मंडी तुलना (Mandis)', path: '/app/compare', icon: BarChart3, badge: 'मुख्य' },
    { id: 'holdings', label: 'फसल स्टॉक (Lots)', path: '/app/holdings', icon: Layers },
    { id: 'voice', label: 'बोलती सलाह (Listen)', path: '/app/voice', icon: Volume2 },
    { id: 'fpo', label: 'FPO पोर्टल', path: '/fpo', icon: Building2 },
    { id: 'demo', label: 'डेमो (Walkthrough)', path: '/demo', icon: HelpCircle },
    { id: 'settings', label: 'सेटिंग्स', path: '/app/settings', icon: Sliders }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[#2d6a4f]/20 bg-[#14231b]/95 backdrop-blur text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="होमपेज पर जाएं"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e7d32] to-[#1b4332] border border-[#e09f3e]/40 shadow-inner group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6 text-[#e09f3e]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e09f3e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e09f3e]"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#f9fafb]">कृषि<span className="text-[#e09f3e]">वाणी</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#2e7d32]/50 text-[#e09f3e] border border-[#e09f3e]/30">AI भाषिणी</span>
              </div>
              <span className="hidden sm:block text-[11px] text-[#9ca3af] -mt-1 font-medium">बोलती हुई फसल-मूल्य व मुनाफ़ा सहायक</span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.path || (link.path === '/app' && currentPath === '/');
            return (
              <button
                key={link.id}
                onClick={() => navigate(link.path)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#2e7d32] text-white shadow-sm' 
                    : 'text-[#d1d5db] hover:bg-[#1b3528] hover:text-[#f9fafb]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#e09f3e]' : 'text-gray-400'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 text-[10px] bg-[#e09f3e] text-[#14231b] font-bold px-1.5 py-0.2 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Voice Trigger, Language, Theme */}
        <div className="flex items-center gap-2">
          
          {/* Pulsing Voice Assistant Trigger (BHASHINI) */}
          <button
            onClick={onOpenVoiceModal}
            className={`group relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-md ${
              isSpeaking
                ? 'bg-[#e09f3e] text-[#14231b] animate-pulse ring-2 ring-[#e09f3e]'
                : 'bg-gradient-to-r from-[#2e7d32] to-[#1e5828] text-white hover:from-[#388e3c] hover:to-[#2e7d32] border border-[#e09f3e]/40'
            }`}
            title="भाषिणी आवाज़ सहायक से बात करें"
          >
            <div className="relative">
              <Mic className={`h-4 w-4 ${isSpeaking ? 'text-[#14231b]' : 'text-[#e09f3e]'}`} />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              )}
            </div>
            <span className="hidden sm:inline">
              {isSpeaking ? 'बोल रहा है...' : 'बोलकर पूछें (भाषिणी)'}
            </span>
            <span className="sm:hidden">बोलें</span>
          </button>

          {/* Theme Toggle (Noon / Slate) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2d6a4f]/40 bg-[#1b3528] text-gray-300 hover:text-white hover:border-[#e09f3e] transition-colors"
            title={theme === 'noon' ? 'शाम/अंधेरा मोड (Slate)' : 'दोपहर मोड (Noon)'}
          >
            {theme === 'noon' ? (
              <Moon className="h-4 w-4 text-[#e09f3e]" />
            ) : (
              <Sun className="h-4 w-4 text-[#e09f3e]" />
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2d6a4f]/40 bg-[#1b3528] text-gray-300 hover:text-white lg:hidden"
            aria-label="मेनू खोलें"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#2d6a4f]/30 bg-[#14231b] px-4 py-3 lg:hidden animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-[#2e7d32] text-white' 
                      : 'text-gray-300 hover:bg-[#1b3528]'
                  }`}
                >
                  <Icon className="h-4 w-4 text-[#e09f3e]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-[#2d6a4f]/30 flex items-center justify-between text-xs text-gray-400">
            <span>टीम HD Falcons (IIITM ग्वालियर)</span>
            <span className="text-[#e09f3e] font-semibold">हिंदी हैकाथॉन 2026</span>
          </div>
        </div>
      )}
    </header>
  );
}
