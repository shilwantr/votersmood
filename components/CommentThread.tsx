'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/providers/AuthProvider';
import styles from './CommentThread.module.css';
import ReactionButtons from './ReactionButtons';

interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  content: string;
  authorId: string;
  authorName: string;
  isApproved: boolean;
  createdAt: any;
  agreeCount: number;
  funnyCount: number;
}

interface CommentThreadProps {
  postId: string;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 'sample-comment-1',
    postId: 'sample-post-1',
    parentId: null,
    authorId: 'suresh-patil',
    authorName: 'SURESH PATIL',
    content: 'Agreed! As a local resident of Nagpur South West, water distribution pipelines were upgraded last month in Ward 14. We need the local corporators and MLA to coordinate faster completion before monsoon.',
    isApproved: true,
    agreeCount: 38,
    funnyCount: 2,
    createdAt: '15 mins ago',
  },
  {
    id: 'sample-reply-1',
    postId: 'sample-post-1',
    parentId: 'sample-comment-1',
    authorId: 'priya-n',
    authorName: 'PRIYA N',
    content: 'Ward 14 work is moving fast now!',
    isApproved: true,
    agreeCount: 12,
    funnyCount: 0,
    createdAt: '10 mins ago',
  },
  {
    id: 'sample-reply-2',
    postId: 'sample-post-1',
    parentId: 'sample-comment-1',
    authorId: 'amit-v',
    authorName: 'AMIT V',
    content: 'Still waiting in Ward 12 though haha',
    isApproved: true,
    agreeCount: 9,
    funnyCount: 5,
    createdAt: '5 mins ago',
  },
  {
    id: 'sample-comment-2',
    postId: 'sample-post-1',
    parentId: null,
    authorId: 'kunal-roy',
    authorName: 'KUNAL ROY',
    content: 'Is there an official townhall scheduled with the constituency candidates this weekend?',
    isApproved: true,
    agreeCount: 19,
    funnyCount: 1,
    createdAt: '8 mins ago',
  }
];

export default function CommentThread({ postId }: CommentThreadProps) {
  const { user, userProfile } = useAuth();
  const [dbComments, setDbComments] = useState<Comment[]>([]);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setDbComments(fetched);
    });

    return () => unsubscribe();
  }, [postId]);

  const allComments = [...SAMPLE_COMMENTS, ...dbComments];

  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!user || !content.trim()) return;
    if (content.length > 50) return;

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        parentId,
        content: content.trim(),
        authorId: user.uid,
        authorName: userProfile?.displayName || user.displayName || 'VERIFIED CITIZEN',
        isApproved: true,
        createdAt: serverTimestamp(),
        agreeCount: 0,
        funnyCount: 0,
      });

      setReplyContent({ ...replyContent, [parentId]: '' });
      setActiveReply(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const topLevelComments = allComments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => allComments.filter(c => c.parentId === parentId);

  return (
    <div className={styles.threadContainer}>
      <div className={styles.commentList}>
        {topLevelComments.map(comment => (
          <div key={comment.id} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <div className={styles.authorMeta}>
                <div className={styles.avatar}>
                  {comment.authorName.charAt(0)}
                </div>
                <span className={styles.author}>{comment.authorName}</span>
                <span className={styles.timestamp}>
                  {typeof comment.createdAt === 'string' ? comment.createdAt : 'RECENT'}
                </span>
              </div>
              <span className={styles.charBadge}>MAX 500 CHARS</span>
            </div>
            
            <div className={styles.content}>{comment.content}</div>

            <div className={styles.commentFooter}>
              <ReactionButtons 
                targetId={comment.id} 
                targetType="comment"
                initialAgreeCount={comment.agreeCount || 0}
                initialFunnyCount={comment.funnyCount || 0}
              />
              <button 
                className={styles.replyToggle}
                onClick={() => setActiveReply(activeReply === comment.id ? null : comment.id)}
              >
                ↪ SUB-COMMENT
              </button>
            </div>

            {/* Replies Section */}
            <div className={styles.repliesContainer}>
              {getReplies(comment.id).map(reply => (
                <div key={reply.id} className={styles.replyItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.authorMeta}>
                      <div className={styles.avatar} style={{ width: '20px', height: '20px', fontSize: '0.65rem' }}>
                        {reply.authorName.charAt(0)}
                      </div>
                      <span className={styles.author} style={{ fontSize: '0.75rem' }}>{reply.authorName}</span>
                      <span className={styles.timestamp}>{typeof reply.createdAt === 'string' ? reply.createdAt : 'RECENT'}</span>
                    </div>
                    <span className={styles.charBadge} style={{ fontSize: '0.55rem' }}>MAX 50 CHARS</span>
                  </div>
                  
                  <div className={styles.content} style={{ fontSize: '0.875rem' }}>{reply.content}</div>
                  
                  <ReactionButtons 
                    targetId={reply.id} 
                    targetType="comment"
                    initialAgreeCount={reply.agreeCount || 0}
                    initialFunnyCount={reply.funnyCount || 0}
                  />
                </div>
              ))}

              {/* Sub-comment / Reply Input */}
              {activeReply === comment.id && (
                <div className={styles.replyInputSection}>
                  <textarea
                    className={styles.textarea}
                    placeholder="Write a sub-comment (max 50 chars)..."
                    value={replyContent[comment.id] || ''}
                    onChange={(e) => setReplyContent({
                      ...replyContent, 
                      [comment.id]: e.target.value.slice(0, 50)
                    })}
                    maxLength={50}
                  />
                  <div className={styles.inputFooter}>
                    <span className={styles.inputCharCount}>
                      {(replyContent[comment.id] || '').length}/50 MAX
                    </span>
                    <button 
                      className={styles.replySubmitBtn}
                      onClick={() => handleSubmitReply(comment.id, replyContent[comment.id] || '')}
                      disabled={!user || !(replyContent[comment.id] || '').trim()}
                    >
                      SUBMIT REPLY
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
