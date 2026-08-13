import React, { useState } from 'react';
import CommentThread from './CommentThread';
import PollCard from './PollCard';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onDelete }) {
  const { user, isAdmin } = useAuth();
  const [showComments, setShowComments] = useState(true);
  const [agreeCount, setAgreeCount] = useState(Math.max(0, post.agreeCount || 0));
  const [funnyCount, setFunnyCount] = useState(Math.max(0, post.funnyCount || 0));
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasFunny, setHasFunny] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'RECENT';
    const date = new Date(timestamp);
    const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (diff < 60) return `${Math.max(1, diff)} MINS AGO`;
    if (diff < 1440) return `${Math.floor(diff / 60)} HOURS AGO`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  // Enforce strict 1-reaction limit per user per post
  const handleReaction = async (type) => {
    if (!user) {
      alert('Please sign in or register to react to political insights.');
      return;
    }

    try {
      if (type === 'agree') {
        if (hasAgreed) {
          setHasAgreed(false);
          setAgreeCount(prev => Math.max(0, prev - 1));
        } else {
          setHasAgreed(true);
          setAgreeCount(prev => prev + 1);
        }
      } else if (type === 'funny') {
        if (hasFunny) {
          setHasFunny(false);
          setFunnyCount(prev => Math.max(0, prev - 1));
        } else {
          setHasFunny(true);
          setFunnyCount(prev => prev + 1);
        }
      }

      const res = await api.toggleReaction({ targetId: post.id, targetType: 'post', reactionType: type });
      if (res && typeof res.newCount === 'number') {
        if (type === 'agree') setAgreeCount(Math.max(0, res.newCount));
        if (type === 'funny') setFunnyCount(Math.max(0, res.newCount));
      }
    } catch (e) {
      console.warn('Reaction error:', e);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deletePost(post.id);
      setIsDeleted(true);
      if (onDelete) onDelete(post.id);
    } catch (e) {
      console.warn('Delete error:', e);
      setIsDeleted(true);
    }
  };

  if (isDeleted) return null;

  const authorAvatarUrl = post.authorAvatar || `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(post.authorId || post.authorName || 'voter')}`;

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: post.isOpenQuestion ? '2px solid var(--accent-primary)' : '1px solid #E5E2DC', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '16px' }}>
      
      {/* OPEN QUESTION SPECIAL BADGE STRIP */}
      {post.isOpenQuestion && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FDF6ED', border: '1px solid #F5E5D3', borderRadius: '6px', padding: '8px 12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
              ❓ OPEN QUESTION
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
              To: {post.targetLeaderName || post.leaderTag}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {post.questionCategory && (
              <span className="badge badge-verified" style={{ fontSize: '9px' }}>
                {post.questionCategory}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
              STATUS: {post.responseStatus?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={authorAvatarUrl} 
            alt={post.authorName} 
            style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-canvas)', flexShrink: 0 }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                {post.authorName || 'VERIFIED CITIZEN'}
              </span>
              <span className="badge badge-verified" style={{ fontSize: '9px' }}>✓ VERIFIED</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {!post.isOpenQuestion && post.leaderTag && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', backgroundColor: 'var(--bg-canvas)', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              📍 {post.leaderTag}
            </span>
          )}
          {post.topicTag && (
            <span className="badge badge-trending" style={{ fontSize: '10px' }}>
              #{post.topicTag.replace(/^#/, '')}
            </span>
          )}

          {(isAdmin || user?.uid === post.authorId) && (
            <button onClick={handleDeletePost} className="btn-ghost" style={{ fontSize: '11px', color: 'var(--color-error)', fontWeight: 700 }}>
              🗑 DELETE
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: '14px', wordBreak: 'break-word' }}>
        {post.content}
      </div>

      {/* Attached Poll inside Post */}
      {post.poll && (
        <div style={{ marginBottom: '14px' }}>
          <PollCard poll={post.poll} />
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => handleReaction('agree')}
            className="btn-secondary" 
            style={{
              fontSize: '12px',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: hasAgreed ? '1px solid var(--accent-primary)' : '1px solid #E0DDD7',
              backgroundColor: hasAgreed ? '#FFF7ED' : '#FFFFFF',
              color: hasAgreed ? 'var(--accent-primary)' : 'var(--text-primary)',
              fontWeight: hasAgreed ? 700 : 500
            }}
          >
            <span style={{ color: '#D97706' }}>👍</span> AGREE ({Math.max(0, agreeCount)})
          </button>
          <button 
            onClick={() => handleReaction('funny')}
            className="btn-secondary" 
            style={{
              fontSize: '12px',
              padding: '5px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: hasFunny ? '1px solid var(--bg-navy-authority)' : '1px solid #E0DDD7',
              backgroundColor: hasFunny ? '#F1F5F9' : '#FFFFFF',
              color: hasFunny ? 'var(--bg-navy-authority)' : 'var(--text-primary)',
              fontWeight: hasFunny ? 700 : 500
            }}
          >
            <span style={{ color: '#5B5B5B' }}>😄</span> FUNNY ({Math.max(0, funnyCount)})
          </button>
        </div>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="btn-ghost" 
          style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}
        >
          💬 {post.commentCount || 0} INSIGHTS
        </button>
      </div>

      {/* Comments Thread */}
      {showComments && (
        <div style={{ marginTop: '14px', paddingTop: '10px' }}>
          <CommentThread postId={post.id} />
        </div>
      )}
    </div>
  );
}
