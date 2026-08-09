'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, userProfile, loading, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <header className={styles.header}>
      {/* 1. Very Top Black Portal Strip */}
      <div className={styles.portalStrip}>
        <div className={`container ${styles.portalContainer}`}>
          <span className={styles.portalTitle}>JanMat Political & Election Polling Portal</span>
          <div className={styles.portalRight}>
            <span className={styles.statusText}>
              STATUS: <span className={styles.statusHighlight}>{user ? '🟢 REGISTERED VOTER' : '🔑 GUEST (UNREGISTERED)'}</span>
            </span>
            <span className={`${styles.adminToggle} ${isAdmin ? styles.adminToggleActive : ''}`}>
              ADMIN: {isAdmin ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Secondary Sub-Strip */}
      <div className={styles.subStrip}>
        <div className={`container ${styles.subStripContainer}`}>
          <span className={styles.gazetteBadge}>OFFICIAL GAZETTE</span>
          <span className={styles.tagline}>POLITICAL INTELLIGENCE & VERIFIED CONSTITUENCY FEEDBACK ENGINE</span>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <nav className={styles.mainNav}>
        <div className={`container ${styles.navContainer}`}>
          
          {/* Brand Logo */}
          <Link href="/" className={styles.brand}>
            <span className={styles.brandTitle}>THE STATE UNION</span>
            <span className={styles.brandSubtitleBox}>JANMAT जनमत</span>
          </Link>

          {/* Desktop Center Links */}
          <div className={styles.desktopLinks}>
            <Link 
              href="/" 
              className={`${styles.navLink} ${pathname === '/' ? styles.activeNavLink : ''}`}
            >
              <span>💬</span> Discussions
            </Link>
            <Link 
              href="/polls" 
              className={`${styles.navLink} ${pathname.startsWith('/polls') ? styles.activeNavLink : ''}`}
            >
              <span>📊</span> Election Polls
            </Link>
            <Link 
              href="/leaders" 
              className={`${styles.navLink} ${pathname.startsWith('/leaders') ? styles.activeNavLink : ''}`}
            >
              <span>🗂️</span> Directory
            </Link>
            <Link 
              href="/trending" 
              className={`${styles.navLink} ${pathname.startsWith('/trending') ? styles.activeNavLink : ''}`}
            >
              <span>📈</span> Trending
            </Link>
          </div>

          {/* Right Action Section */}
          <div className={styles.rightSection}>
            {isAdmin && (
              <Link href="/admin" className={styles.adminToggle} style={{ color: '#E8792B', borderColor: '#E8792B' }}>
                ADMIN PANEL
              </Link>
            )}

            {!loading && (
              user ? (
                <div className={styles.userMenu}>
                  <button className={styles.avatarBtn} onClick={toggleDropdown} title={userProfile?.displayName || user.email || 'User'}>
                    {userProfile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </button>
                  {isDropdownOpen && (
                    <div className={styles.dropdown}>
                      <Link href="/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                        Profile Settings
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button className={styles.dropdownItem} onClick={() => { signOut(); setIsDropdownOpen(false); }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/signup">
                  <button className={styles.registerBtn}>REGISTER VOTER</button>
                </Link>
              )
            )}

            {/* Mobile Menu Toggle */}
            <button className={styles.mobileToggle} onClick={toggleMenu} aria-label="Toggle menu">
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link href="/" className={styles.mobileNavLink} onClick={toggleMenu}>💬 Discussions</Link>
            <Link href="/polls" className={styles.mobileNavLink} onClick={toggleMenu}>📊 Election Polls</Link>
            <Link href="/leaders" className={styles.mobileNavLink} onClick={toggleMenu}>🗂️ Directory</Link>
            <Link href="/trending" className={styles.mobileNavLink} onClick={toggleMenu}>📈 Trending</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
