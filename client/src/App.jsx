import React, { useState } from 'react';
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

function AppContent() {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedLeaderId, setSelectedLeaderId] = useState(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSelectLeader = (id) => {
    setSelectedLeaderId(id);
    setActiveTab('leader-detail');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setSelectedLeaderId(null);
          setActiveTab(tab);
        }} 
        openRegisterModal={() => setIsRegisterOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'discussions' && <Home openRegisterModal={() => setIsRegisterOpen(true)} />}
        {activeTab === 'polls' && <Polls />}
        {activeTab === 'directory' && <Leaders onSelectLeader={handleSelectLeader} />}
        {activeTab === 'leader-detail' && selectedLeaderId && (
          <LeaderDetail leaderId={selectedLeaderId} onBack={() => setActiveTab('directory')} />
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
