import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import SearchableSelect from './SearchableSelect';

const QUESTION_CATEGORIES = [
  'Education',
  'Healthcare',
  'Employment',
  'Roads',
  'Infrastructure',
  'Electricity',
  'Water Supply',
  'Law & Order',
  'Corruption',
  'Agriculture',
  'Economy',
  'Environment',
  'Public Transport',
  'Women Safety',
  'Other'
];

export default function PostComposer({ onPostCreated, openRegisterModal }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Open Question state
  const [isOpenQuestion, setIsOpenQuestion] = useState(false);
  const [targetLeaderId, setTargetLeaderId] = useState('devendra-fadnavis');
  const [targetLeaderName, setTargetLeaderName] = useState('Devendra Fadnavis (MLA)');
  const [questionCategory, setQuestionCategory] = useState('Water Supply');

  // Leaders dropdown list
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    api.getLeaders().then(res => {
      const data = Array.isArray(res) ? res : (res.leaders || []);
      if (data && data.length > 0) {
        setLeaders(data.map(l => ({
          value: l.id,
          label: `${l.name} (${l.party} • ${l.constituency})`,
          rawName: `${l.name} (${l.type || l.repType})`
        })));
      }
    }).catch(() => {});
  }, []);

  const handleTextareaInput = (e) => {
    setContent(e.target.value.slice(0, 500));
    e.target.style.height = 'auto';
    e.target.style.height = Math.max(48, e.target.scrollHeight) + 'px';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      if (openRegisterModal) openRegisterModal();
      return;
    }

    if (!content.trim() || content.length > 500) return;

    setIsSubmitting(true);
    try {
      const created = await api.createPost({
        content: content.trim(),
        isOpenQuestion,
        targetLeaderId: isOpenQuestion ? targetLeaderId : null,
        targetLeaderName: isOpenQuestion ? targetLeaderName : null,
        questionCategory: isOpenQuestion ? questionCategory : null,
        leaderTag: isOpenQuestion ? targetLeaderName.toUpperCase() : 'DEVENDRA FADNAVIS (MLA)',
        topicTag: 'MAHARASHTRAELECTIONS2026',
      });

      setContent('');
      setIsOpenQuestion(false);
      if (onPostCreated) onPostCreated(created);
    } catch (error) {
      console.error('Post creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        backgroundColor: '#FFFFFF', 
        border: '1px solid var(--border-default)', 
        borderRadius: '12px', 
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '20px'
      }}
    >
      {/* Borderless 2-Row Minimum Auto-Expanding Textarea (Same as Comment Input) */}
      <textarea
        className="borderless-input"
        value={content}
        onChange={handleTextareaInput}
        onClick={() => { if (!user && openRegisterModal) openRegisterModal(); }}
        placeholder={user ? "Write your insight or ask an open question to a leader (max 500 chars)..." : "🔒 Click to register as Verified Citizen & post an insight (max 500 chars)..."}
        disabled={isSubmitting}
        maxLength={500}
        rows={2}
        style={{ 
          width: '100%', 
          border: 'none !important', 
          outline: 'none !important', 
          boxShadow: 'none !important',
          background: 'transparent', 
          backgroundColor: 'transparent',
          fontSize: '15px', 
          lineHeight: 1.5,
          color: 'var(--text-primary)', 
          cursor: user ? 'text' : 'pointer',
          padding: '4px 0',
          minHeight: '48px',
          resize: 'none',
          overflow: 'hidden'
        }}
      />

      {/* Open Question Section Toggle */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '2px' }}>
          <input
            type="checkbox"
            id="openQuestionCheck"
            checked={isOpenQuestion}
            onChange={(e) => setIsOpenQuestion(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <label htmlFor="openQuestionCheck" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent-copper-text)', cursor: 'pointer' }}>
            ❓ MARK THIS POST AS AN OPEN QUESTION TO A LEADER
          </label>
        </div>
      )}

      {/* Revealed Open Question Controls */}
      {isOpenQuestion && user && (
        <div style={{ backgroundColor: 'var(--accent-copper-bg)', border: '1px solid var(--accent-copper-border)', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ATTACH POLITICAL LEADER
              </label>
              <SearchableSelect
                options={leaders.length > 0 ? leaders : [
                  { value: 'devendra-fadnavis', label: 'Devendra Fadnavis (BJP • Nagpur South West)', rawName: 'Devendra Fadnavis (MLA)' },
                  { value: 'rahul-gandhi', label: 'Rahul Gandhi (INC • Rae Bareli)', rawName: 'Rahul Gandhi (MP_LS)' },
                  { value: 'nitin-gadkari', label: 'Nitin Gadkari (BJP • Nagpur)', rawName: 'Nitin Gadkari (MP_LS)' }
                ]}
                value={targetLeaderId}
                onChange={(val) => {
                  setTargetLeaderId(val);
                  const found = leaders.find(l => l.value === val);
                  if (found) setTargetLeaderName(found.rawName || found.label);
                }}
                placeholder="Search Leader..."
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                QUESTION CATEGORY
              </label>
              <select
                value={questionCategory}
                onChange={(e) => setQuestionCategory(e.target.value)}
                style={{ fontSize: '13px', border: '1px solid var(--border-subtle)' }}
              >
                {QUESTION_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar (Clean Borderless Layout matching comment input) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
          {content.length}/500 CHARS MAX
        </span>

        <button
          type="submit"
          disabled={isSubmitting || (user && !content.trim())}
          className="btn-primary"
          style={{ fontSize: '12px', height: '36px', padding: '0 18px', borderRadius: '18px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <span>✈</span> {isSubmitting ? 'POSTING...' : isOpenQuestion ? 'POST OPEN QUESTION' : 'POST INSIGHT'}
        </button>
      </div>
    </form>
  );
}
