import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { STATES, getConstituenciesForState } from '../../../server/data/states';

export default function RegisterModal({ isOpen, onClose }) {
  const { signup, login, loginWithGoogle } = useAuth();
  
  // Top Level Tab: 'signin' or 'signup'
  const [mainTab, setMainTab] = useState('signup'); 
  
  // Method inside Tab: 'email' or 'google'
  const [authMethod, setAuthMethod] = useState('google');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('MH');
  const [constituency, setConstituency] = useState('Nagpur South West');
  const [constituenciesList, setConstituenciesList] = useState(getConstituenciesForState('MH'));
  const [isRegistered, setIsRegistered] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update dynamic constituencies list whenever state selection changes
  const handleStateChange = (newCode) => {
    setState(newCode);
    const available = getConstituenciesForState(newCode);
    setConstituenciesList(available);
    if (available.length > 0) {
      setConstituency(available[0]);
    }
  };

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (mainTab === 'signin') {
        await login(email, password);
      } else {
        await signup(name, email, password, state, constituency, isRegistered);
      }
      onClose();
    } catch (err) {
      const serverErr = err.response?.data?.error;
      if (serverErr) {
        setErrorMsg(serverErr);
        if (serverErr.includes('already exists')) {
          setMainTab('signin');
        }
      } else {
        setErrorMsg(mainTab === 'signin' ? 'Invalid email or password.' : 'Registration failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      if (loginWithGoogle) {
        // Pass selected state & constituency for signup flow
        await loginWithGoogle(state, constituency);
      } else {
        await signup('Google User', `user.${Date.now()}@gmail.com`, 'googlepass123', state, constituency, true);
      }
      onClose();
    } catch (err) {
      console.error('Google Auth Error:', err);
      setErrorMsg('Google authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-modal)', width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-modal)', overflow: 'hidden', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer', background: 'none', border: 'none' }}>✕</button>
        
        {/* Header */}
        <div style={{ padding: '24px 24px 16px 24px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--bg-navy-authority)', letterSpacing: '0.08em', marginBottom: '6px' }}>
            🔒 FIREBASE DB AUTHENTICATION
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            {mainTab === 'signin' ? 'Sign In (Existing User)' : 'Sign Up & Create Account'}
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {mainTab === 'signin' ? 'Welcome back! Sign in with Email or Google.' : 'Select your Constituency & State, then create your voter profile via Email or Google.'}
          </p>
        </div>

        {/* TOP LEVEL TABS: SIGN IN vs SIGN UP */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 24px' }}>
          <button
            type="button"
            onClick={() => { setMainTab('signin'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: mainTab === 'signin' ? '3px solid var(--bg-navy-authority)' : '3px solid transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: mainTab === 'signin' ? 800 : 600,
              color: mainTab === 'signin' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            🔑 SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setMainTab('signup'); setErrorMsg(''); }}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: mainTab === 'signup' ? '3px solid var(--bg-navy-authority)' : '3px solid transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: mainTab === 'signup' ? 800 : 600,
              color: mainTab === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            📝 SIGN UP
          </button>
        </div>

        <div style={{ padding: '20px 24px 28px 24px' }}>
          {errorMsg && (
            <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', lineHeight: 1.4 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* METHOD SUB-TOGGLE: Email/Pass vs Google */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setAuthMethod('email')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: authMethod === 'email' ? '#FFFFFF' : 'transparent',
                boxShadow: authMethod === 'email' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: authMethod === 'email' ? 700 : 500,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              ✉️ Email / Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: authMethod === 'google' ? '#FFFFFF' : 'transparent',
                boxShadow: authMethod === 'google' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: authMethod === 'google' ? 700 : 500,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              🌐 Google
            </button>
          </div>

          {/* SIGN UP FLOW: SELECT CONSTITUENCY (Mandatory Step for BOTH Email & Google Sign Up) */}
          {mainTab === 'signup' && (
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: 'var(--bg-navy-authority)', marginBottom: '8px', letterSpacing: '0.04em' }}>
                🏛 SELECT YOUR CONSTITUENCY & STATE:
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-primary)' }}>HOME STATE</label>
                  <select value={state} onChange={(e) => handleStateChange(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '12.5px' }}>
                    {STATES.map(s => (
                      <option key={s.code} value={s.code}>{s.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--text-primary)' }}>CONSTITUENCY</label>
                  <select value={constituency} onChange={(e) => setConstituency(e.target.value)} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF', fontSize: '12.5px' }}>
                    {constituenciesList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* METHOD A: GOOGLE SIGN IN / SIGN UP */}
          {authMethod === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
              >
                <span>🌐</span> {isSubmitting ? 'OPENING GOOGLE POPUP...' : (mainTab === 'signup' ? 'CREATE ACCOUNT WITH GOOGLE' : 'SIGN IN WITH GOOGLE')}
              </button>
            </div>
          )}

          {/* METHOD B: EMAIL / PASSWORD FORM */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mainTab === 'signup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>FULL NAME</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Anand Verma" />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>EMAIL ADDRESS</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="voter@janmat.in" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>PASSWORD (MIN 4 CHARACTERS)</label>
                <input type="password" value={password} minLength={4} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>

              {mainTab === 'signup' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <input type="checkbox" id="modalRegCheck" checked={isRegistered} onChange={(e) => setIsRegistered(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--bg-navy-authority)' }} />
                  <label htmlFor="modalRegCheck" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    REGISTERED VOTER IN MY CONSTITUENCY
                  </label>
                </div>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '12px', width: '100%', fontSize: '13px', marginTop: '6px' }}>
                {isSubmitting ? 'AUTHENTICATING VIA FIREBASE DB...' : (mainTab === 'signin' ? '🔑 SIGN IN WITH EMAIL' : '📝 CREATE ACCOUNT WITH EMAIL')}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
