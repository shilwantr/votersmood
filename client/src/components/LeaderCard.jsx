import React, { useState, useEffect } from 'react';
import { CitizenInquiry } from './Icons';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function LeaderCard({ leader, rank, onSelect, openRegisterModal }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [agreeCount, setAgreeCount] = useState(leader.agreeCount || 0);
  const [funnyCount, setFunnyCount] = useState(leader.funnyCount || 0);
  const [userAgreed, setUserAgreed] = useState(false);
  const [userFunny, setUserFunny] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAgreeCount(leader.agreeCount || 0);
    setFunnyCount(leader.funnyCount || 0);
  }, [leader.agreeCount, leader.funnyCount]);

  // Load user reaction state across page refreshes
  useEffect(() => {
    if (!user) return;

    const cacheKey = `janmat_leader_rxn_${user.uid}_${leader.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.agree !== undefined) setUserAgreed(parsed.agree);
        if (parsed.funny !== undefined) setUserFunny(parsed.funny);
      } catch (e) {}
    }

    // Query Cloud Firestore DB
    api.getUserReactions().then(res => {
      if (res && res.userReactions && res.userReactions[leader.id]) {
        const rxns = res.userReactions[leader.id];
        const hasAgree = !!rxns.agree;
        const hasFunny = !!rxns.funny;
        setUserAgreed(hasAgree);
        setUserFunny(hasFunny);
        localStorage.setItem(cacheKey, JSON.stringify({ agree: hasAgree, funny: hasFunny }));
      }
    }).catch(() => {});
  }, [user, leader.id]);

  const handleReaction = async (e, reactionType) => {
    e.stopPropagation(); // Prevent card navigation when clicking reaction buttons

    if (!user) {
      if (openRegisterModal) openRegisterModal();
      else showError('Please sign in or register to react to representatives.');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await api.toggleReaction({
        targetId: leader.id,
        targetType: 'leader',
        reactionType
      });

      const cacheKey = `janmat_leader_rxn_${user.uid}_${leader.id}`;

      if (reactionType === 'agree') {
        setUserAgreed(res.toggled);
        setAgreeCount(res.newCount);
        const cacheVal = { agree: res.toggled, funny: userFunny };
        localStorage.setItem(cacheKey, JSON.stringify(cacheVal));
        showSuccess(res.toggled ? `👍 Agreed with ${leader.name}!` : `Removed Agree reaction`);
      } else {
        setUserFunny(res.toggled);
        setFunnyCount(res.newCount);
        const cacheVal = { agree: userAgreed, funny: res.toggled };
        localStorage.setItem(cacheKey, JSON.stringify(cacheVal));
        showSuccess(res.toggled ? `😄 Reacted Funny to ${leader.name}!` : `Removed Funny reaction`);
      }
    } catch (err) {
      showError('Reaction error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(leader.id)}
      className="gazette-card"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '16px 18px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        transition: 'transform 150ms ease, box-shadow 150ms ease'
      }}
    >
      <div>
        {/* Header Badges Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Rank badge: Crisp WHITE text on BLACK background */}
            {rank && (
              <span 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: 800, 
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: '#000000', 
                  color: '#FFFFFF', 
                  padding: '2px 7px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em'
                }}
              >
                #{rank} RANK
              </span>
            )}
            <span className="badge badge-featured" style={{ fontSize: '10px' }}>{leader.party}</span>
          </div>

          <span className="badge badge-verified" style={{ fontSize: '10px' }}>{leader.type || leader.repType}</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-card-title)', fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
          {leader.name}
        </h3>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          📍 {leader.constituency}, {leader.state}
        </div>

        {leader.portfolio && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.35, fontStyle: 'italic' }}>
            💼 {leader.portfolio}
          </p>
        )}
      </div>

      {/* Single Compact Horizontal Action Bar (Reactions Left, Open Questions Right) */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '11px', flexWrap: 'wrap', gap: '6px' }}>
        
        {/* Minimal Transparent Reaction Buttons (Soft Tint ONLY if Reacted) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={(e) => handleReaction(e, 'agree')}
            className="btn-ghost"
            style={{
              fontSize: '11px',
              padding: userAgreed ? '2px 7px' : '0 2px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              backgroundColor: userAgreed ? '#FEF3C7' : 'transparent',
              color: userAgreed ? '#92400E' : '#64748B',
              fontWeight: userAgreed ? 700 : 500,
              transition: 'all 150ms ease'
            }}
          >
            <span>👍</span> <span>{agreeCount.toLocaleString()}</span>
          </button>

          <button
            type="button"
            onClick={(e) => handleReaction(e, 'funny')}
            className="btn-ghost"
            style={{
              fontSize: '11px',
              padding: userFunny ? '2px 7px' : '0 2px',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              backgroundColor: userFunny ? '#F1F5F9' : 'transparent',
              color: userFunny ? '#0F172A' : '#64748B',
              fontWeight: userFunny ? 700 : 500,
              transition: 'all 150ms ease'
            }}
          >
            <span>😄</span> <span>{funnyCount.toLocaleString()}</span>
          </button>
        </div>

        {/* Open Questions Count Indicator on the Right side of the Same Row */}
        <span style={{ fontWeight: 600, fontSize: '10.5px', color: 'var(--accent-copper-text)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CitizenInquiry size={12} /> {leader.openQuestionsCount || 0} Open Ques
        </span>
      </div>
    </div>
  );
}
