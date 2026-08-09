'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.gazetteBadge}>
            🔒 REGISTRATION GAZETTE
          </div>
          <h1 className={styles.title}>Voter Sign In</h1>
          <p className={styles.subtitle}>Enter your email credentials to access the registry.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleEmailLogin} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">EMAIL ADDRESS</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voter@example.com"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            🔑 {loading ? 'AUTHENTICATING...' : 'ACCESS REGISTRY'}
          </button>
        </form>

        <div className={styles.divider}>
          INSTANT GOOGLE SIGN-IN
        </div>

        <button type="button" onClick={handleGoogleLogin} disabled={loading} className={styles.googleBtn}>
          🌐 SIGN IN WITH GOOGLE
        </button>

        <p className={styles.footer}>
          Not registered yet? <Link href="/signup">Register as Verified Citizen</Link>
        </p>
      </div>
    </div>
  );
}
