import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { OfficialSeal, EditorialFeed, BallotBox, AssemblyPillar, SignalPulse } from './Icons';
import AvatarSelectionModal from './AvatarSelectionModal';

export default function Navbar({ activeTab, setActiveTab, openRegisterModal }) {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userAvatar = userProfile?.avatarUrl || user?.avatarUrl || `https://api.dicebear.com/10.x/avataaars/svg?seed=${user?.uid || 'voter'}`;
  const isVerifiedStreak = userProfile?.isVerifiedStreak || user?.isVerifiedStreak;
  const streakCount = userProfile?.streakCount || user?.streakCount || 1;

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
        {/* 1. Top Gazette Header (#09090B Obsidian Black) */}
        <div style={{ backgroundColor: '#09090B', color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: '11.5px', padding: '6px 0', borderBottom: '1px solid #27272A' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ backgroundColor: '#18181B', color: 'var(--accent-gold-subtle)', border: '1px solid #27272A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                <OfficialSeal size={13} /> OFFICIAL GAZETTE
              </span>
              <span className="gazette-top-tagline" style={{ color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                POLITICAL INTELLIGENCE & VERIFIED CONSTITUENCY ENGINE
              </span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: '#A1A1AA', fontSize: '11px', whiteSpace: 'nowrap' }}>
                STREAK: <span style={{ color: isVerifiedStreak ? '#38BDF8' : '#FBBF24', fontWeight: 700 }}>🔥 {streakCount}d {isVerifiedStreak ? '✓ VERIFIED' : ''}</span>
              </span>
              <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: isAdmin ? 'var(--bg-navy-authority)' : '#18181B', border: '1px solid #27272A', color: '#FFFFFF', whiteSpace: 'nowrap' }}>
                ADMIN: {isAdmin ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar (#FFFFFF, 1px solid #E4E4E7) */}
        <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
            
            {/* Brand Logo with Cormorant Garamond Font */}
            <div onClick={() => handleNavClick('discussions')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-logo-text" style={{ fontFamily: 'var(--font-brand)', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                THE STATE UNION
              </span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '10px', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', padding: '1px 5px', backgroundColor: 'var(--bg-canvas)', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                जनमत
              </span>
            </div>

            {/* Desktop Nav Links */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '28px', height: '100%', alignItems: 'center' }}>
              {[
                { id: 'discussions', label: 'Discussions', icon: EditorialFeed },
                { id: 'polls', label: 'Election Polls', icon: BallotBox },
                { id: 'directory', label: 'Directory', icon: AssemblyPillar },
                { id: 'trending', label: 'Trending', icon: SignalPulse },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavClick(tab.id)}
                    style={{
                      height: '100%',
                      background: 'none',
                      border: 'none',
                      borderBottom: isActive ? '2px solid var(--bg-navy-authority)' : '2px solid transparent',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '14px',
                      borderRadius: 0,
                      cursor: 'pointer',
                      padding: '0 2px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 150ms ease, border-color 150ms ease'
                    }}
                  >
                    <IconComp size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="desktop-nav" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {isAdmin && (
                <button onClick={() => handleNavClick('admin')} className="btn-authority" style={{ height: '36px', padding: '0 14px', fontSize: '12px' }}>
                  ADMIN PANEL
                </button>
              )}

              {user ? (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  {/* Clean Profile Badge Trigger */}
                  <div 
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    title="Open Citizen Profile Menu"
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer', 
                      backgroundColor: profileDropdownOpen ? '#F1F5F9' : 'var(--bg-canvas)', 
                      border: '1px solid var(--border-subtle)', 
                      borderRadius: '20px', 
                      padding: '3px 12px 3px 3px',
                      transition: 'background-color 150ms ease'
                    }}
                  >
                    <img 
                      src={userAvatar} 
                      alt="Profile Avatar" 
                      style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }} 
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {userProfile?.displayName || user.email?.split('@')[0]}
                    </span>

                    {/* 7-Day Active Streak Tick Icon */}
                    {isVerifiedStreak && (
                      <span 
                        title="Verified 7-Day Streak Citizen ✓" 
                        style={{ 
                          color: '#0284C7', 
                          backgroundColor: '#E0F2FE', 
                          borderRadius: '50%', 
                          width: '16px', 
                          height: '16px', 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justify: 'center', 
                          fontSize: '10px', 
                          fontWeight: 800, 
                          border: '1px solid #BAE6FD'
                        }}
                      >
                        ✓
                      </span>
                    )}

                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>
                      {profileDropdownOpen ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Profile Dropdown Popup Menu */}
                  {profileDropdownOpen && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 'calc(100% + 8px)', 
                        right: 0, 
                        width: '260px', 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E2E8F0', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', 
                        padding: '12px', 
                        zIndex: 200 
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9', marginBottom: '8px' }}>
                        <img src={userAvatar} alt="User Avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #E2E8F0', backgroundColor: '#F8F9FA' }} />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {userProfile?.displayName || user.email?.split('@')[0]}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      {/* Citizen Details Strip */}
                      <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '8px 10px', marginBottom: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>📍 {userProfile?.constituency || 'Mumbai South'}, {userProfile?.state || 'MH'}</div>
                        <div style={{ color: isVerifiedStreak ? '#0284C7' : '#D97706', fontWeight: 700 }}>
                          🔥 Streak: {streakCount} Days {isVerifiedStreak ? '✓ Verified Citizen' : '(Active)'}
                        </div>
                      </div>

                      {/* Menu Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button 
                          onClick={() => { setAvatarModalOpen(true); setProfileDropdownOpen(false); }}
                          className="btn-ghost"
                          style={{ width: '100%', textAlign: 'left', fontSize: '12.5px', padding: '8px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', fontWeight: 600 }}
                        >
                          <span>🎨</span> Change 2D Avatar
                        </button>

                        <button 
                          onClick={() => { logout(); setProfileDropdownOpen(false); }}
                          className="btn-ghost"
                          style={{ width: '100%', textAlign: 'left', fontSize: '12.5px', padding: '8px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: 700 }}
                        >
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={openRegisterModal} className="btn-primary" style={{ height: '36px', padding: '0 16px', fontSize: '13px' }}>
                  REGISTER VOTER
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              aria-label="Toggle navigation menu"
              style={{ display: 'none', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', padding: '4px 8px', color: 'var(--text-primary)' }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Dropdown Navigation Menu */}
          {mobileMenuOpen && (
            <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {user && (
                <div 
                  onClick={() => { setAvatarModalOpen(true); setMobileMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <img src={userAvatar} alt="Mobile Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{userProfile?.displayName || user.email?.split('@')[0]}</span>
                      {isVerifiedStreak && (
                        <span style={{ color: '#0284C7', backgroundColor: '#E0F2FE', borderRadius: '50%', width: '15px', height: '15px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--accent-copper-text)' }}>
                      🎨 Tap to change 2D Avatar (Streak: 🔥 {streakCount}d)
                    </div>
                  </div>
                </div>
              )}

              {[
                { id: 'discussions', label: 'Discussions', icon: EditorialFeed },
                { id: 'polls', label: 'Election Polls', icon: BallotBox },
                { id: 'directory', label: 'Directory', icon: AssemblyPillar },
                { id: 'trending', label: 'Trending', icon: SignalPulse },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavClick(tab.id)}
                    className="btn-ghost"
                    style={{
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'var(--bg-navy-authority)' : 'var(--text-primary)',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: isActive ? 'var(--bg-canvas)' : 'transparent',
                      borderRadius: '6px'
                    }}
                  >
                    <IconComp size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isAdmin && (
                  <button onClick={() => handleNavClick('admin')} className="btn-authority" style={{ width: '100%', height: '38px', fontSize: '13px' }}>
                    ⚙ ADMIN PANEL
                  </button>
                )}

                {user ? (
                  <button onClick={logout} className="btn-secondary" style={{ width: '100%', height: '38px', fontSize: '13px', color: '#DC2626', fontWeight: 700 }}>
                    🚪 Sign Out ({user.email?.split('@')[0]})
                  </button>
                ) : (
                  <button onClick={() => { openRegisterModal(); setMobileMenuOpen(false); }} className="btn-primary" style={{ width: '100%', height: '38px', fontSize: '13px' }}>
                    🔑 REGISTER VOTER
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Avatar Selection Modal */}
      <AvatarSelectionModal 
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </>
  );
}
