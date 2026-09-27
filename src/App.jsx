import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import MandiPassModal from './components/MandiPassModal';

// Pages
import LandingPage from './pages/LandingPage';
import TodayDashboard from './pages/TodayDashboard';
import MandiCompare from './pages/MandiCompare';
import HoldingsPage from './pages/HoldingsPage';
import VoicePage from './pages/VoicePage';
import CropDetailPage from './pages/CropDetailPage';
import FpoPortal from './pages/FpoPortal';
import DemoPage from './pages/DemoPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  // Read current path from hash or pathname
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      return hash || window.location.pathname || '/';
    }
    return '/';
  });

  // Persistent Day / Night theme (saved in localStorage)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('krishivaani_theme') || 'noon';
    }
    return 'noon';
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('krishivaani_lang') || 'hi';
    }
    return 'hi';
  });

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passData, setPassData] = useState(null);

  // Sync theme with html data-theme attribute & localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('krishivaani_theme', theme);
  }, [theme]);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('krishivaani_lang', language);
  }, [language]);

  // Sync router state with window events
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'noon' ? 'slate' : 'noon');
  };

  const handleOpenPassModal = (data) => {
    setPassData(data);
    setIsPassModalOpen(true);
  };

  // Render Page Based on Route
  const renderPage = () => {
    if (currentPath === '/') {
      return (
        <LandingPage 
          navigate={navigate} 
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)} 
        />
      );
    }

    if (currentPath === '/app') {
      return (
        <TodayDashboard
          navigate={navigate}
          onGeneratePass={handleOpenPassModal}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      );
    }

    if (currentPath === '/app/compare') {
      return (
        <MandiCompare
          navigate={navigate}
          onGeneratePass={handleOpenPassModal}
        />
      );
    }

    if (currentPath === '/app/holdings') {
      return (
        <HoldingsPage
          navigate={navigate}
          onGeneratePass={handleOpenPassModal}
        />
      );
    }

    if (currentPath === '/app/voice') {
      return (
        <VoicePage
          navigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/app/crop/')) {
      const cropId = currentPath.split('/app/crop/')[1] || 'onion';
      return (
        <CropDetailPage
          cropId={cropId}
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/fpo') {
      return (
        <FpoPortal
          navigate={navigate}
        />
      );
    }

    if (currentPath === '/demo') {
      return (
        <DemoPage
          navigate={navigate}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      );
    }

    if (currentPath === '/app/settings') {
      return (
        <SettingsPage
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      );
    }

    // Default Fallback
    return (
      <TodayDashboard
        navigate={navigate}
        onGeneratePass={handleOpenPassModal}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 bg-[var(--bg-page)] text-[var(--text-main)]">
      
      {/* Universal Top Navigation Header */}
      <Navbar
        currentPath={currentPath}
        navigate={navigate}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Page Body */}
      <div className="flex-1">
        {renderPage()}
      </div>

      {/* Global Interactive Voice Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        navigate={navigate}
      />

      {/* Global Mandi Gate Pass & Profit Estimation Slip Modal */}
      <MandiPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        passData={passData}
      />

    </div>
  );
}
