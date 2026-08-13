import React, { useState } from 'react';
import { useToast } from './Toast';

export default function ShareLeaderModal({ isOpen, onClose, leader }) {
  const { showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !leader) return null;

  const slug = (leader.id || leader.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  const leaderUrl = `${window.location.origin}/${slug}`;
  const shareText = `🏛 Track public performance & open questions for ${leader.name} (${leader.party} • ${leader.constituency}, ${leader.state}) on JanMat Official Gazette:`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(leaderUrl).then(() => {
      setCopied(true);
      showSuccess(`🔗 Profile link for ${leader.name} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      const input = document.createElement('input');
      input.value = leaderUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      showSuccess(`🔗 Profile link for ${leader.name} copied to clipboard!`);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShareX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(leaderUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${leaderUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(leaderUrl)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n${leaderUrl}`).then(() => {
      showSuccess('📸 Copied to clipboard! Ready to paste into Instagram Story or DM.');
    });
  };

  return (
    <div 
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 14, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="gazette-card" 
        style={{ width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      >
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📤</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Share Representative Profile
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: '18px', padding: '2px 8px', color: '#64748B' }}>✕</button>
        </div>

        {/* Leader Snippet Preview */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {leader.profilePhoto || leader.photoURL ? (
            <img 
              src={leader.profilePhoto || leader.photoURL} 
              alt={leader.name} 
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #CBD5E1', flexShrink: 0 }} 
            />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-navbar)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, flexShrink: 0 }}>
              {leader.name?.charAt(0)}
            </div>
          )}
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {leader.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#64748B' }}>
              📍 {leader.constituency}, {leader.state} ({leader.party} • {leader.type || leader.repType})
            </div>
          </div>
        </div>

        {/* Social Share Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          
          {/* X / Twitter */}
          <button
            type="button"
            onClick={handleShareX}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 150ms ease'
            }}
          >
            <span style={{ fontSize: '14px' }}>𝕏</span> Share on X
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 150ms ease'
            }}
          >
            <span style={{ fontSize: '14px' }}>💬</span> WhatsApp
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={handleShareLinkedIn}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              backgroundColor: '#0A66C2',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 150ms ease'
            }}
          >
            <span style={{ fontSize: '14px' }}>💼</span> LinkedIn
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={handleShareInstagram}
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 150ms ease'
            }}
          >
            <span style={{ fontSize: '14px' }}>📸</span> Instagram
          </button>

        </div>

        {/* Copy Link Input Bar */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: '10px', padding: '6px 8px 6px 14px', border: '1px solid #E2E8F0' }}>
          <input
            type="text"
            readOnly
            value={leaderUrl}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: '#334155',
              textOverflow: 'ellipsis'
            }}
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-primary"
            style={{
              fontSize: '11px',
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: copied ? '#16A34A' : 'var(--bg-navy-authority)',
              transition: 'background-color 200ms ease'
            }}
          >
            {copied ? '✓ COPIED' : '📋 COPY LINK'}
          </button>
        </div>

      </div>
    </div>
  );
}
