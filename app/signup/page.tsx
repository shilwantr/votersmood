'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { STATES } from '@/data/states';
import styles from './page.module.css';

// District fallback dictionary for Next.js app
const DISTRICTS_MAP: Record<string, string[]> = {
  MH: ['Nagpur', 'Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur', 'Ahmednagar'],
  UP: ['Agra', 'Aligarh', 'Allahabad (Prayagraj)', 'Amethi', 'Azamgarh', 'Bareilly', 'Basti', 'Gorakhpur', 'Kanpur Nagar', 'Lucknow', 'Mathura', 'Meerut', 'Noida', 'Varanasi'],
  WB: ['Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 'Darjeeling', 'Jalpaiguri', 'Paschim Bardhaman', 'Murshidabad'],
  BR: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Begusarai', 'Nalanda', 'Kishanganj'],
  TN: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Thanjavur'],
  KA: ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Belagavi', 'Hubballi-Dharwad'],
  TG: ['Hyderabad', 'Medchal-Malkajgiri', 'Ranga Reddy', 'Karimnagar', 'Warangal'],
  GJ: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  DL: ['New Delhi', 'Central Delhi', 'East Delhi', 'South Delhi', 'West Delhi', 'North Delhi']
};

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  
  const [name, setName] = useState('Anand Verma');
  const [email, setEmail] = useState('anand.v@example.com');
  const [password, setPassword] = useState('password123');
  
  // Cascading Location state: State -> District -> Block -> Voting Constituency
  const [state, setState] = useState('MH');
  const [district, setDistrict] = useState('Nagpur');
  const [block, setBlock] = useState('Nagpur Urban');
  const [constituency, setConstituency] = useState('Nagpur South West');

  const [isRegistered, setIsRegistered] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDistricts = (stCode: string) => {
    return DISTRICTS_MAP[stCode] || [`${stCode} Central District`, `${stCode} North District`, `${stCode} South District`, 'Capital District'];
  };

  const handleStateChange = (newCode: string) => {
    setState(newCode);
    const dists = getDistricts(newCode);
    const defaultDist = dists[0] || '';
    setDistrict(defaultDist);
    setBlock(`${defaultDist} Urban Block`);
    setConstituency(`${defaultDist} Central`);
  };

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    setBlock(`${newDist} Block`);
    setConstituency(`${newDist} Main`);
  };

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
        'Nagpur South West', 
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
      <div className={styles.modal} style={{ maxWidth: '560px' }}>
        <button className={styles.closeBtn} onClick={() => router.push('/')} aria-label="Close">✕</button>
        
        <div className={styles.header}>
          <div className={styles.gazetteBadge}>
            🔒 REGISTRATION GAZETTE
          </div>
          <h2 className={styles.title}>Register as Verified Citizen</h2>
          <p className={styles.subtitle}>Select State → District → Block → Voting Constituency for verified voter badges.</p>
        </div>

        <div className={styles.body}>
          <div className={styles.noticeBox}>
            <div className={styles.noticeTitle}>
              🛡 STATE, DISTRICT & CONSTITUENCY REGISTRY NOTICE:
            </div>
            <p className={styles.noticeText}>
              JanMat segregates poll votes into Local Residents vs Outside Observers based on your verified constituency.
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

            {/* 4-Field Location Grid: State -> District -> Block -> Voting Constituency */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                🏛 CASCADING LOCATION REGISTRATION:
              </div>

              <div className={styles.twoColumn} style={{ marginBottom: '10px' }}>
                <div className={styles.field}>
                  <label className={styles.label}>1. HOME STATE *</label>
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    required
                    className={styles.input}
                  >
                    {STATES?.map((s) => (
                      <option key={s.code} value={s.code}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>2. DISTRICT *</label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    required
                    className={styles.input}
                  >
                    {getDistricts(state).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.twoColumn}>
                <div className={styles.field}>
                  <label className={styles.label}>3. BLOCK / TEHSIL</label>
                  <input
                    type="text"
                    value={block}
                    onChange={(e) => setBlock(e.target.value)}
                    className={styles.input}
                    placeholder="Nagpur Urban"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>4. VOTING CONSTITUENCY *</label>
                  <input
                    type="text"
                    value={constituency}
                    onChange={(e) => setConstituency(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Nagpur South West"
                  />
                </div>
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
