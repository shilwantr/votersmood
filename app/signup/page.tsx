'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import { STATES } from '@/data/states';
import styles from './page.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  
  const [name, setName] = useState('Anand Verma');
  const [email, setEmail] = useState('anand.v@example.com');
  const [password, setPassword] = useState('password123');
  const [state, setState] = useState('MH');
  const [constituency, setConstituency] = useState('Mumbai South');
  const [isRegistered, setIsRegistered] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password, name, state, constituency, isRegistered);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register citizen profile');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signUpWithEmail(
        `demo.${Date.now()}@votersmood.in`, 
        'demoPass123', 
        'Anand Verma (Verified Voter)', 
        'MH', 
        'Mumbai South', 
        true
      );
      router.push('/');
    } catch (err: any) {
      setError('Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={() => router.push('/')} aria-label="Close">✕</button>
        
        <div className={styles.header}>
          <div className={styles.gazetteBadge}>
            🔒 REGISTRATION GAZETTE
          </div>
          <h2 className={styles.title}>Register as Verified Citizen</h2>
          <p className={styles.subtitle}>Sign up with Email or Google to post & vote in constituency polls.</p>
        </div>

        <div className={styles.body}>
          <div className={styles.noticeBox}>
            <div className={styles.noticeTitle}>
              🛡 STATE & CONSTITUENCY REGISTRY NOTICE:
            </div>
            <p className={styles.noticeText}>
              JanMat segregates poll votes into Local Residents vs Outside Observers.
            </p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSignup} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
                placeholder="Anand Verma"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="anand.v@example.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
                placeholder="••••••••"
              />
            </div>

            <div className={styles.twoColumn}>
              <div className={styles.field}>
                <label className={styles.label}>HOME STATE</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  className={styles.input}
                >
                  <option value="">Select State</option>
                  {STATES?.map((s) => (
                    <option key={s.code} value={s.code}>{s.name.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>CONSTITUENCY</label>
                <input
                  type="text"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="Mumbai South"
                />
              </div>
            </div>

            <div className={styles.checkboxField}>
              <input
                type="checkbox"
                id="isRegistered"
                checked={isRegistered}
                onChange={(e) => setIsRegistered(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="isRegistered" className={styles.checkboxLabel}>
                REGISTERED VOTER IN MY CONSTITUENCY
              </label>
            </div>

            <button type="submit" disabled={loading} className={styles.completeBtn}>
              🔒 {loading ? 'PROCESSING REGISTRATION...' : 'COMPLETE REGISTRATION WITH EMAIL'}
            </button>
          </form>

          <div className={styles.instantDivider}>
            OR SIGN IN WITH ONE CLICK
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={styles.demoBtn}
              style={{ backgroundColor: '#FFFFFF', color: '#111111', border: '1px solid #CCCCCC' }}
            >
              🌐 ONE-CLICK GOOGLE SIGN-IN
            </button>

            <button 
              type="button" 
              onClick={handleDemoLogin}
              disabled={loading}
              className={styles.demoBtn}
              style={{ backgroundColor: '#F4F4F4', color: '#222222', border: '1px solid #CCCCCC' }}
            >
              ⚙ ONE-CLICK DEMO REGISTERED VOTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
