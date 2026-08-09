import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export default function PollCard({ poll }) {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState(null);
  const [isResident, setIsResident] = useState(true);
  const [pollState, setPollState] = useState(poll);

  const totalVotes = pollState.totalVotes || 1470;
  const isElectionPoll = pollState.type === 'election' || pollState.isElectionPoll;

  const handleVote = async (optId) => {
    if (hasVoted) return;
    try {
      setHasVoted(true);
      setVotedOption(optId);

      const updatedOptions = pollState.options.map(opt => {
        if (opt.id === optId) return { ...opt, votes: (opt.votes || 0) + 1 };
        return opt;
      });

      setPollState(prev => ({
        ...prev,
        options: updatedOptions,
        totalVotes: (prev.totalVotes || 0) + 1,
        residentVotes: isResident ? (prev.residentVotes || 0) + 1 : (prev.residentVotes || 0),
        nonResidentVotes: !isResident ? (prev.nonResidentVotes || 0) + 1 : (prev.nonResidentVotes || 0),
      }));

      await api.votePoll(pollState.id, { optionId: optId, isResident });
    } catch (e) {
      console.warn('Vote error:', e);
    }
  };

  return (
    <div className="gazette-card" style={{ marginBottom: '24px', borderLeft: isElectionPoll ? '4px solid var(--text-primary)' : '1px solid var(--border-main)' }}>
      {/* Poll Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            {pollState.authorName || 'Official Gazette Poll Engine'}
          </span>
          {pollState.authorRole === 'admin' && (
            <span className="badge badge-featured">ADMIN OFFICIAL</span>
          )}
        </div>
        {isElectionPoll && (
          <span className="badge badge-live">LIVE ELECTION POLL</span>
        )}
      </div>

      {/* Question */}
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.35 }}>
        {pollState.question}
      </h2>

      {/* Election Resident Notice Box */}
      {isElectionPoll && !hasVoted && (
        <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-divider)', padding: '12px 14px', borderRadius: 'var(--radius-input)', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            🛡 RESIDENCY DECLARATION FOR CONSTITUENCY VOTING
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={isResident} 
              onChange={(e) => setIsResident(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }} 
            />
            I am a registered resident voter in {pollState.constituency || 'this constituency'} ({pollState.state || 'MH'})
          </label>
        </div>
      )}

      {/* Poll Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {pollState.options.map((opt) => {
          const votes = opt.votes || 0;
          const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isSelected = votedOption === opt.id;

          return (
            <div
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              style={{
                position: 'relative',
                backgroundColor: 'var(--bg-secondary)',
                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-main)',
                borderRadius: 'var(--radius-input)',
                overflow: 'hidden',
                cursor: hasVoted ? 'default' : 'pointer',
                transition: 'border-color 150ms ease',
              }}
            >
              {/* Saffron Progress Fill */}
              {hasVoted && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: 'rgba(217, 119, 6, 0.25)',
                    zIndex: 1,
                    transition: 'width 400ms ease',
                  }}
                />
              )}

              <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>
                <span>{opt.text}</span>
                {hasVoted && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    {percentage}% ({votes})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Poll Breakdown Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-divider)', paddingTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
        <span>TOTAL VOTES: {totalVotes}</span>
        {isElectionPoll && (
          <span>
            LOCAL RESIDENTS: <strong style={{ color: 'var(--accent-primary)' }}>{pollState.residentVotes || 980}</strong> | OBSERVERS: {pollState.nonResidentVotes || 490}
          </span>
        )}
      </div>
    </div>
  );
}
