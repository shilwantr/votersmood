import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import RegisterModal from './components/RegisterModal';
import Home from './pages/Home';
import Polls from './pages/Polls';
import Leaders from './pages/Leaders';
import LeaderDetail from './pages/LeaderDetail';
import Trending from './pages/Trending';
import Admin from './pages/Admin';

const KNOWN_TABS = ['discussions', 'polls', 'directory', 'trending', 'admin'];

function AppContent() {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedLeaderSlug, setSelectedLeaderSlug] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Sync client route with window.location.pathname for SEO Friendly Leader URLs (e.g. /devendra-fadnavis)
  useEffect(() => {
    const parseUrlRoute = () => {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      
      if (!path || path === 'discussions') {
        setActiveTab('discussions');
        setSelectedLeaderSlug(null);
        document.title = "JanMat | Political Intelligence & Verified Constituency Portal";
      } else if (KNOWN_TABS.includes(path)) {
        setActiveTab(path);
        setSelectedLeaderSlug(null);
        document.title = `JanMat Gazette • ${path.toUpperCase()}`;
      } else {
        // SEO Leader Slug URL e.g. /devendra-fadnavis or /rahul-gandhi
        setSelectedLeaderSlug(path);
        setActiveTab('leader-detail');
      }
    };

    parseUrlRoute();

    const handlePopState = () => parseUrlRoute();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // SEO-friendly Navigation to Leader Page (e.g. /devendra-fadnavis)
  const handleSelectLeader = (leaderIdOrSlug) => {
    const cleanSlug = String(leaderIdOrSlug).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    setSelectedLeaderSlug(cleanSlug);
    setActiveTab('leader-detail');
    window.history.pushState({}, '', `/${cleanSlug}`);
  };

  const handleTabChange = (tab) => {
    setSelectedLeaderSlug(null);
    setActiveTab(tab);
    const newPath = tab === 'discussions' ? '/' : `/${tab}`;
    window.history.pushState({}, '', newPath);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        openRegisterModal={() => setIsRegisterOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'discussions' && <Home openRegisterModal={() => setIsRegisterOpen(true)} />}
        {activeTab === 'polls' && <Polls />}
        {activeTab === 'directory' && <Leaders onSelectLeader={handleSelectLeader} />}
        {activeTab === 'leader-detail' && selectedLeaderSlug && (
          <LeaderDetail 
            leaderId={selectedLeaderSlug} 
            onBack={() => handleTabChange('directory')} 
          />
        )}
        {activeTab === 'trending' && <Trending openRegisterModal={() => setIsRegisterOpen(true)} />}
        {activeTab === 'admin' && <Admin />}
      </main>

      <footer style={{ backgroundColor: 'var(--bg-navbar)', color: 'var(--text-muted)', borderTop: '1px solid #222222', padding: '24px 0', marginTop: '64px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        <div className="container">
          JanMat Official Gazette Political Portal • Security Isolated Decoupled Express API Backend & React UI
        </div>
      </footer>

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
