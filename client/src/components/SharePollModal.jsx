import React, { useState } from 'react';
import { useToast } from './Toast';

export default function SharePollModal({ isOpen, onClose, poll }) {
  const { showSuccess } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !poll) return null;

  // Construct deep link URL to poll
  const pollUrl = `${window.location.origin}/polls?poll=${poll.id}#poll-${poll.id}`;
  const shareText = `📊 Cast your vote in the Official Gazette Election Poll: "${poll.title || poll.question || 'Official Election Poll'}" on JanMat Portal`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl).then(() => {
      setCopied(true);
      showSuccess('🔗 Election poll link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      const input = document.createElement('input');
      input.value = pollUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      showSuccess('🔗 Election poll link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShareX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${pollUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`;
    window.open(liUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    navigator.clipboard.writeText(`${shareText}\n${pollUrl}`).then(() => {
      showSuccess('📸 Copied to clipboard! Ready to paste into Instagram Story or DM.');
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 15, 14, 0.75)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="gazette-card" style={{ width: '100%', maxWidth: '480px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>📊</span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Share Official Election Poll
            </h3>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: '18px', padding: '2px 8px', color: '#64748B' }}>✕</button>
        </div>

        {/* Poll Snippet Preview */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px', fontSize: '13px', color: '#334155' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#D97706', marginBottom: '4px' }}>
            🏛 OFFICIAL GAZETTE ELECTION POLL
          </div>
          <div style={{ fontWeight: 700, lineHeight: 1.4, color: '#0F172A' }}>
            "{poll.title || poll.question}"
          </div>
        </div>

        {/* Social Share Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          
          {/* X / Twitter */}
          <button
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
            value={pollUrl}
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
