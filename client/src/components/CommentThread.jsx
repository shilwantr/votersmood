import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

// Recursive Chat Bubble Component (Clean & Less Borders Layout)
function CommentBubble({ comment, allComments, onReplySubmit, onDeleteComment, user, isAdmin, level = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [agree, setAgree] = useState(Math.max(0, comment.agreeCount || 0));
  const [funny, setFunny] = useState(Math.max(0, comment.funnyCount || 0));
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasFunny, setHasFunny] = useState(false);

  const isTopLevel = !comment.parentId;
  const childComments = allComments.filter(c => c.parentId === comment.id);

  // Dynamic Avatar fallback
  const avatarUrl = comment.authorAvatar || `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(comment.authorId || comment.authorName || 'voter')}`;

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
      
      {/* Clean Minimal Comment Item (Less Borders) */}
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
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '11.5px', color: 'var(--text-primary)' }}>
                {comment.authorName}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                • {formatCommentDate(comment.createdAt)}
              </span>
              <span className="badge badge-verified" style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px' }}>
                {isTopLevel ? 'INSIGHT' : 'MAX 50 CHARS'}
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

        {/* Comment Message Text */}
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13.5px', lineHeight: 1.5, color: '#1E293B', marginBottom: '6px', wordBreak: 'break-word', paddingLeft: '34px' }}>
          {comment.content}
        </div>

        {/* Comment Actions (Subtle & Clean) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '34px' }}>
          <button 
            onClick={() => handleCommentReaction('agree')} 
            className="btn-ghost" 
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: hasAgreed ? '#EFF6FF' : 'transparent',
              color: hasAgreed ? 'var(--bg-navy-authority)' : 'var(--text-secondary)',
              fontWeight: hasAgreed ? 700 : 500
            }}
          >
            👍 {Math.max(0, agree)}
          </button>
          <button 
            onClick={() => handleCommentReaction('funny')} 
            className="btn-ghost" 
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: hasFunny ? '#F8FAFC' : 'transparent',
              color: hasFunny ? 'var(--bg-navy-authority)' : 'var(--text-secondary)',
              fontWeight: hasFunny ? 700 : 500
            }}
          >
            😄 {Math.max(0, funny)}
          </button>
          <button 
            onClick={() => setShowReplyForm(!showReplyForm)} 
            className="btn-ghost" 
            style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '0 4px', color: 'var(--bg-navy-authority)', fontWeight: 600 }}
          >
            ↪ REPLY
          </button>
        </div>
      </div>

      {/* Reply Input Capsule */}
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
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '12.5px', padding: '2px 0', outline: 'none', color: 'var(--text-primary)' }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
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

      {/* Recursive Nested Sub-Threads (Subtle Left Thread Line) */}
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
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [newTopComment, setNewTopComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getComments(postId).then(data => {
      if (isMounted) {
        setComments(data || []);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setComments([]);
        setIsLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [postId]);

  const handleAddComment = async (parentId, text) => {
    if (!text || !text.trim()) return;

    try {
      const created = await api.createComment({
        postId,
        parentId: parentId || null,
        content: text.trim()
      });
      setComments(prev => [...prev, created]);
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
      
      {/* Sleek Top Level Comment Input Box (Clean Border) */}
      <form 
        onSubmit={handleTopSubmit} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '6px', 
          backgroundColor: '#FFFFFF', 
          border: '1px solid var(--border-subtle)', 
          borderRadius: '8px', 
          padding: '10px 12px' 
        }}
      >
        <textarea
          value={newTopComment}
          onChange={(e) => setNewTopComment(e.target.value.slice(0, 500))}
          placeholder={user ? "Write a top-level insight comment (max 500 chars)..." : "Sign in to write a comment (max 500 chars)..."}
          maxLength={500}
          disabled={!user}
          rows={2}
          style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, fontSize: '13.5px', outline: 'none', resize: 'none', color: 'var(--text-primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
            {newTopComment.length}/500 MAX
          </span>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={!user || !newTopComment.trim()}
            style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '4px' }}
          >
            💬 COMMENT
          </button>
        </div>
      </form>

      {/* Recursive Chat Bubbles List */}
      {isLoading ? (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', padding: '6px 0' }}>
          Loading insights from database...
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
              isAdmin={isAdmin}
              level={0}
            />
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', padding: '6px 0', fontStyle: 'italic' }}>
          No comments posted yet. Be the first verified citizen to share an insight!
        </div>
      )}
    </div>
  );
}
