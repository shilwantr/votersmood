import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

// Recursive Chat Bubble Component
function CommentBubble({ comment, allComments, onReplySubmit, onDeleteComment, user, userProfile, isAdmin, level = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [agree, setAgree] = useState(Math.max(0, comment.agreeCount || 0));
  const [funny, setFunny] = useState(Math.max(0, comment.funnyCount || 0));
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasFunny, setHasFunny] = useState(false);

  const isTopLevel = !comment.parentId;
  const childComments = allComments.filter(c => c.parentId === comment.id);

  // Dynamic Avatar Resolution:
  const isCurrentUser = user && (
    (comment.authorId && comment.authorId === user.uid) ||
    (comment.authorName && (comment.authorName === user.displayName || comment.authorName === user.name || comment.authorName === user.email?.split('@')[0].toUpperCase()))
  );

  const activeUserAvatar = isCurrentUser ? (userProfile?.avatarUrl || user?.avatarUrl) : null;
  const avatarUrl = activeUserAvatar 
    || comment.authorAvatar 
    || `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(comment.authorId || comment.authorName || 'voter')}`;

  // 7-Day Active Streak Tick Icon
  const showVerifiedTick = (isCurrentUser && (userProfile?.isVerifiedStreak || user?.isVerifiedStreak)) || comment.isVerified === true;

  const handleCommentReaction = async (type) => {
    if (!user) {
      alert('Please sign in or register to react to comments.');
      return;
    }

    try {
      if (type === 'agree') {
        if (hasAgreed) {
          setHasAgreed(false);
          setAgree(prev => Math.max(0, prev - 1));
        } else {
          setHasAgreed(true);
          setAgree(prev => prev + 1);
        }
      } else if (type === 'funny') {
        if (hasFunny) {
          setHasFunny(false);
          setFunny(prev => Math.max(0, prev - 1));
        } else {
          setHasFunny(true);
          setFunny(prev => prev + 1);
        }
      }

      const res = await api.toggleReaction({ targetId: comment.id, targetType: 'comment', reactionType: type });
      if (res && typeof res.newCount === 'number') {
        if (type === 'agree') setAgree(Math.max(0, res.newCount));
        if (type === 'funny') setFunny(Math.max(0, res.newCount));
      }
    } catch (e) {
      console.warn('Comment reaction error:', e);
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || replyText.length > 50) return;
    onReplySubmit(comment.id, replyText.trim());
    setReplyText('');
    setShowReplyForm(false);
  };

  const formatCommentDate = (ts) => {
    if (!ts) return 'JUST NOW';
    if (typeof ts === 'string') return ts.toUpperCase();
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60));
    if (diff < 60) return `${Math.max(1, diff)} MINS AGO`;
    if (diff < 1440) return `${Math.floor(diff / 60)} HOURS AGO`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: level > 0 ? '4px' : '8px' }}>
      
      {/* Clean Minimal Comment Item */}
      <div 
        style={{
          width: '100%',
          backgroundColor: isTopLevel ? '#F8F9FA' : '#FAFAFA',
          border: '1px solid #F1F5F9',
          borderRadius: '8px',
          padding: '10px 14px',
          transition: 'background-color 150ms ease',
        }}
      >
        {/* Comment Author Header & 2D Avatar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src={avatarUrl} 
              alt={comment.authorName} 
              style={{ 
                width: '26px', 
                height: '26px', 
                borderRadius: '50%', 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                flexShrink: 0 
              }} 
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {/* Author name: 11px */}
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11px', color: 'var(--text-primary)' }}>
                {comment.authorName}
              </span>

              {/* 7-Day Active Streak Tick Icon */}
              {showVerifiedTick && (
                <span 
                  title="7-Day Active Streak Citizen ✓" 
                  style={{ 
                    color: '#0284C7', 
                    backgroundColor: '#E0F2FE', 
                    borderRadius: '50%', 
                    width: '15px', 
                    height: '15px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justify: 'center', 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    border: '1px solid #BAE6FD',
                    flexShrink: 0
                  }}
                >
                  ✓
                </span>
              )}

              {/* Time: 8px */}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--text-muted)' }}>
                • {formatCommentDate(comment.createdAt)}
              </span>
            </div>
          </div>

          {(isAdmin || user?.uid === comment.authorId) && (
            <button 
              onClick={() => onDeleteComment(comment.id)} 
              className="btn-ghost" 
              style={{ fontSize: '11px', color: 'var(--color-error)', fontWeight: 600, padding: '2px 4px' }}
            >
              🗑
            </button>
          )}
        </div>

        {/* Comment Message Text: 18px */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '18px', lineHeight: 1.55, color: '#1E293B', marginBottom: '8px', wordBreak: 'break-word', paddingLeft: '34px' }}>
          {comment.content}
        </div>

        {/* Comment Actions (Minimal BG ONLY if user has reacted!) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingLeft: '34px' }}>
          <button 
            onClick={() => handleCommentReaction('agree')} 
            className="btn-ghost" 
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              padding: hasAgreed ? '2px 8px' : '0 2px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: hasAgreed ? '#FEF3C7' : 'transparent',
              color: hasAgreed ? '#92400E' : '#64748B',
              fontWeight: hasAgreed ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease'
            }}
          >
            👍 <span style={{ fontSize: '10px' }}>{Math.max(0, agree)}</span>
          </button>
          
          <button 
            onClick={() => handleCommentReaction('funny')} 
            className="btn-ghost" 
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              padding: hasFunny ? '2px 8px' : '0 2px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: hasFunny ? '#F1F5F9' : 'transparent',
              color: hasFunny ? '#0F172A' : '#64748B',
              fontWeight: hasFunny ? 700 : 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease'
            }}
          >
            😄 <span style={{ fontSize: '10px' }}>{Math.max(0, funny)}</span>
          </button>

          <button 
            onClick={() => setShowReplyForm(!showReplyForm)} 
            className="btn-ghost" 
            style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', padding: '0 2px', color: 'var(--bg-navy-authority)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
          >
            ↪ REPLY
          </button>
        </div>
      </div>

      {/* Reply Input Capsule (Appears ONLY on reply click!) */}
      {showReplyForm && (
        <form 
          onSubmit={handleSendReply}
          style={{ 
            marginLeft: '34px', 
            marginTop: '4px',
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '8px', 
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
          }}
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value.slice(0, 50))}
            placeholder={`Reply to ${comment.authorName} (max 50 chars)...`}
            maxLength={50}
            autoFocus
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '13px', padding: '2px 0', outline: 'none', color: 'var(--text-primary)' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', flexShrink: 0 }}>
            {replyText.length}/50
          </span>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!replyText.trim()} 
            style={{ fontSize: '10.5px', padding: '3px 10px', borderRadius: '4px', flexShrink: 0 }}
          >
            Send
          </button>
        </form>
      )}

      {/* Recursive Nested Sub-Threads */}
      {childComments.length > 0 && (
        <div style={{ paddingLeft: '18px', borderLeft: '2px solid #E2E8F0', marginLeft: '12px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {childComments.map(child => (
            <CommentBubble
              key={child.id}
              comment={child}
              allComments={allComments}
              onReplySubmit={onReplySubmit}
              onDeleteComment={onDeleteComment}
              user={user}
              userProfile={userProfile}
              isAdmin={isAdmin}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentThread({ postId }) {
  const { user, userProfile, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [newTopComment, setNewTopComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMainInput, setShowMainInput] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLatestComments = (showLoading = false) => {
      if (showLoading) setIsLoading(true);
      api.getComments(postId).then(data => {
        if (isMounted) {
          setComments(data || []);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isMounted) setIsLoading(false);
      });
    };

    fetchLatestComments(true);

    // Auto-refresh comments every 1 minute (60,000 ms) from Cloud Firestore DB
    const intervalId = setInterval(() => {
      fetchLatestComments(false);
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [postId]);

  const handleAddComment = async (parentId, text) => {
    if (!text || !text.trim()) return;

    try {
      const created = await api.createComment({
        postId,
        parentId: parentId || null,
        content: text.trim(),
        authorAvatar: userProfile?.avatarUrl || user?.avatarUrl
      });
      setComments(prev => [...prev, created]);
      setShowMainInput(false);
    } catch (e) {
      console.warn('Comment submit error:', e);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment or reply?')) return;
    try {
      await api.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    } catch (e) {
      setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    }
  };

  const handleTopSubmit = (e) => {
    e.preventDefault();
    if (!newTopComment.trim() || newTopComment.length > 500) return;
    handleAddComment(null, newTopComment.trim());
    setNewTopComment('');
  };

  const topLevelComments = comments.filter(c => !c.parentId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      
      {/* Horizontally Aligned Action Row: Pen Icon Write Option & Bubble Icon Insights */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => setShowMainInput(!showMainInput)}
          className="btn-ghost" 
          style={{ 
            fontSize: '11px', 
            fontFamily: 'var(--font-mono)',
            padding: '2px 4px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px',
            color: 'var(--bg-navy-authority)',
            fontWeight: 700
          }}
        >
          <span>✏️</span> {showMainInput ? 'Hide' : 'Write Insight'}
        </button>
      </div>

      {/* Top Level Comment Input Box (Appears ONLY when pen write option is clicked!) */}
      {showMainInput && (
        <form 
          onSubmit={handleTopSubmit} 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            backgroundColor: '#FFFFFF', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '8px', 
            padding: '10px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}
        >
          <textarea
            value={newTopComment}
            onChange={(e) => setNewTopComment(e.target.value.slice(0, 500))}
            placeholder={user ? "Write an insight comment (max 500 chars)..." : "Sign in to write a comment..."}
            maxLength={500}
            disabled={!user}
            autoFocus
            rows={2}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, fontSize: '14px', outline: 'none', resize: 'none', color: 'var(--text-primary)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)' }}>
              {newTopComment.length}/500 MAX
            </span>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={!user || !newTopComment.trim()}
              style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '4px' }}
            >
              💬 SUBMIT
            </button>
          </div>
        </form>
      )}

      {/* Recursive Chat Bubbles List */}
      {isLoading ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', padding: '4px 0' }}>
          Loading insights...
        </div>
      ) : topLevelComments.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {topLevelComments.map(comment => (
            <CommentBubble
              key={comment.id}
              comment={comment}
              allComments={comments}
              onReplySubmit={(parentId, text) => handleAddComment(parentId, text)}
              onDeleteComment={handleDeleteComment}
              user={user}
              userProfile={userProfile}
              isAdmin={isAdmin}
              level={0}
            />
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', padding: '4px 0', fontStyle: 'italic' }}>
          No comments posted yet. Click ✏️ Write Insight to start the discussion!
        </div>
      )}
    </div>
  );
}
