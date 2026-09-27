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

  const [theme, setTheme] = useState('noon'); // 'noon' (light) or 'slate' (dark)
  const [language, setLanguage] = useState('hi'); // Default Hindi (हिन्दी)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passData, setPassData] = useState(null);

  // Sync theme with html data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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

    // Default Fallback to TodayDashboard
    return (
      <TodayDashboard
        navigate={navigate}
        onGeneratePass={handleOpenPassModal}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      theme === 'slate' ? 'bg-[#0f1914] text-[#f3f4f6]' : 'bg-[#F8F9F5] text-[#1E2922]'
    }`}>
      
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

      {/* Global Interactive Bhasini Voice Modal */}
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
