import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

const STYLES = [
  { id: 'avataaars', label: 'Avataaars' },
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'micah', label: 'Micah' },
  { id: 'bottts', label: 'Bottts' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'pixel-art', label: 'Pixel' },
];

const SEED_PRESETS = [
  'Executive', 'Citizen', 'Sentinel', 'Scholar', 
  'Advocate', 'Leader', 'Gazette', 'Observer'
];

export default function AvatarSelectionModal({ isOpen, onClose }) {
  const { user, updateUserAvatar } = useAuth();
  const { showSuccess, showError } = useToast();

  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [currentSeed, setCurrentSeed] = useState('Executive');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState('');
  const [randomSeedOffset, setRandomSeedOffset] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.avatarUrl) {
      setSelectedAvatarUrl(user.avatarUrl);
      if (user.avatarStyle) setSelectedStyle(user.avatarStyle);
    } else {
      setSelectedAvatarUrl(`https://api.dicebear.com/10.x/${selectedStyle}/svg?seed=${currentSeed}`);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const buildAvatarUrl = (style, seed) => {
    return `https://api.dicebear.com/10.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleStyleChange = (styleId) => {
    setSelectedStyle(styleId);
    const newUrl = buildAvatarUrl(styleId, currentSeed);
    setSelectedAvatarUrl(newUrl);
  };

  const handleSelectPreset = (seed) => {
    const seedWithOffset = randomSeedOffset > 0 ? `${seed}_${randomSeedOffset}` : seed;
    setCurrentSeed(seedWithOffset);
    const newUrl = buildAvatarUrl(selectedStyle, seedWithOffset);
    setSelectedAvatarUrl(newUrl);
  };

  const handleRandomize = () => {
    const newOffset = Math.floor(Math.random() * 10000);
    setRandomSeedOffset(newOffset);
    const randomSeed = `Citizen_${newOffset}`;
    setCurrentSeed(randomSeed);
    const newUrl = buildAvatarUrl(selectedStyle, randomSeed);
    setSelectedAvatarUrl(newUrl);
  };

  const handleSave = async () => {
    if (!user) {
      showError('Please sign in to save custom avatar');
      return;
    }

    setSaving(true);
    try {
      await updateUserAvatar(selectedAvatarUrl, selectedStyle);
      showSuccess('🎨 2D Avatar Saved to Cloud Firestore DB!');
      onClose();
    } catch (err) {
      showError('Failed to save 2D avatar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div 
        className="gazette-card" 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '16px', 
          width: '100%', 
          maxWidth: '460px', 
          padding: '24px', 
          boxShadow: 'var(--shadow-modal)',
          border: '1px solid var(--border-subtle)',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
              🎨 CITIZEN PROFILE CUSTOMIZATION
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Choose your avatar
            </h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        {/* Styles Selector Tabs */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Styles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {STYLES.map(st => (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStyleChange(st.id)}
                className={selectedStyle === st.id ? 'btn-primary' : 'btn-secondary'}
                style={{
                  fontSize: '12px',
                  height: '34px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: selectedStyle === st.id ? 700 : 500
                }}
              >
                [ {st.label} ]
              </button>
            ))}
          </div>
        </div>

        {/* 2D Avatar Gallery Grid */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
            Presets
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {SEED_PRESETS.map((seedName) => {
              const seedVal = randomSeedOffset > 0 ? `${seedName}_${randomSeedOffset}` : seedName;
              const imgUrl = buildAvatarUrl(selectedStyle, seedVal);
              const isSelected = selectedAvatarUrl === imgUrl;

              return (
                <div
                  key={seedName}
                  onClick={() => handleSelectPreset(seedName)}
                  style={{
                    backgroundColor: isSelected ? '#EFF6FF' : 'var(--bg-canvas)',
                    border: isSelected ? '2px solid var(--bg-navy-authority)' : '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 150ms ease',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <img 
                    src={imgUrl} 
                    alt={seedName} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%' }} 
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {seedName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🎲 Randomize Button */}
        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleRandomize}
            className="btn-secondary"
            style={{ width: '100%', height: '36px', fontSize: '12.5px', gap: '6px', fontFamily: 'var(--font-mono)' }}
          >
            🎲 Randomize Seeds
          </button>
        </div>

        {/* Preview Badge (◯ AVATAR ◯) */}
        <div style={{ backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.06em' }}>
            Preview
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', padding: '6px 14px', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>◯</span>
            <img 
              src={selectedAvatarUrl} 
              alt="Avatar Preview" 
              style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)' }} 
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>◯</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', marginTop: '6px', fontWeight: 600 }}>
            {user?.displayName || 'VERIFIED CITIZEN'}
          </div>
        </div>

        {/* Action Button: [ Save Avatar ] */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ width: '100%', height: '42px', fontSize: '14px', borderRadius: '8px' }}
        >
          {saving ? 'Saving...' : '[ Save Avatar ]'}
        </button>

      </div>
    </div>
  );
}
