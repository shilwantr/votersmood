import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OfficialSeal, EditorialFeed, BallotBox, AssemblyPillar, SignalPulse } from './Icons';

export default function Navbar({ activeTab, setActiveTab, openRegisterModal }) {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {/* 1. Top Gazette Header (#09090B Obsidian Black) */}
      <div style={{ backgroundColor: '#09090B', color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: '11.5px', padding: '6px 0', borderBottom: '1px solid #27272A' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#18181B', color: 'var(--accent-gold-subtle)', border: '1px solid #27272A', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <OfficialSeal size={13} /> OFFICIAL GAZETTE
            </span>
            <span style={{ color: '#A1A1AA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>POLITICAL INTELLIGENCE & VERIFIED CONSTITUENCY ENGINE</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ color: '#A1A1AA' }}>
              STATUS: <span style={{ color: user ? '#059669' : '#FBBF24', fontWeight: 600 }}>{user ? '🟢 REGISTERED' : '🔑 GUEST'}</span>
            </span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: isAdmin ? 'var(--bg-navy-authority)' : '#18181B', border: '1px solid #27272A', color: '#FFFFFF' }}>
              ADMIN: {isAdmin ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (#FFFFFF, 1px solid #E4E4E7) */}
      <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          
          {/* Brand Logo with Cormorant Garamond Font */}
          <div onClick={() => handleNavClick('discussions')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-brand)', fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              THE STATE UNION
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '11px', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', padding: '2px 6px', backgroundColor: 'var(--bg-canvas)', borderRadius: '4px' }}>
              जनमत
            </span>
          </div>

          {/* Desktop Nav Links (Active indicator: 2px solid #0F172A bottom bar) */}
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
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {userProfile?.displayName || user.email?.split('@')[0]}
                </span>
                <button onClick={logout} className="btn-secondary" style={{ height: '36px', padding: '0 12px', fontSize: '12px' }}>
                  Sign Out
                </button>
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
            style={{ display: 'none', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', padding: '4px', color: 'var(--text-primary)' }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--border-subtle)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isActive ? 'var(--bg-canvas)' : 'transparent'
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
                <button onClick={logout} className="btn-secondary" style={{ width: '100%', height: '38px', fontSize: '13px' }}>
                  Sign Out ({user.email?.split('@')[0]})
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
  );
}
