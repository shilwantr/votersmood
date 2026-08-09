'use client';

import React, { useState } from 'react';
import styles from './PostCard.module.css';
import ReactionButtons from './ReactionButtons';
import CommentThread from './CommentThread';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    isVerified?: boolean;
    createdAt: any;
    leaderTag?: string;
    leaderType?: string;
    topicTag?: string;
    agreeCount: number;
    funnyCount: number;
    commentCount: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(true); // Default open to show insights thread like reference UI

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'RECENT';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60));
    if (diff < 60) return `${Math.max(1, diff)} MINS AGO`;
    if (diff < 1440) return `${Math.floor(diff / 60)} HOURS AGO`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: '#fff', textAlign: 'center', lineHeight: '38px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {post.authorName?.charAt(0) || 'V'}
              </div>
            )}
          </div>
          <div className={styles.authorDetails}>
            <div className={styles.authorNameLine}>
              <span className={styles.authorName}>{post.authorName || 'VERIFIED CITIZEN'}</span>
              {(post.isVerified !== false) && <span className={styles.verifiedBadge}>VERIFIED</span>}
            </div>
            <span className={styles.timestamp}>{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        <div className={styles.tagsGroup}>
          {post.leaderTag && (
            <span className={styles.leaderTag}>
              📍 {post.leaderTag} {post.leaderType ? `(${post.leaderType})` : ''}
            </span>
          )}
          {post.topicTag && (
            <span className={styles.topicTag}>
              #{post.topicTag.replace(/^#/, '')}
            </span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {post.content}
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <ReactionButtons 
            targetId={post.id} 
            targetType="post"
            initialAgreeCount={post.agreeCount || 0}
            initialFunnyCount={post.funnyCount || 0}
          />
        </div>
        
        <button 
          className={styles.commentsToggle}
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.commentCount || 0} INSIGHTS
        </button>
      </div>

      {showComments && (
        <div className={styles.commentsSection}>
          <CommentThread postId={post.id} />
        </div>
      )}
    </div>
  );
}
