'use client';

import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/providers/AuthProvider';
import styles from './PostComposer.module.css';

export default function PostComposer() {
  const { user, userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [leaderTag, setLeaderTag] = useState('');
  const [topicTag, setTopicTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_CHARS = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || content.trim() === '' || content.length > MAX_CHARS) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        authorId: user.uid,
        authorName: userProfile?.displayName || user.displayName || 'ANANYA DESHMUKH',
        authorAvatar: userProfile?.photoURL || user.photoURL || '',
        isVerified: true,
        leaderTag: leaderTag || 'DEVENDRA FADNAVIS (MLA)',
        topicTag: topicTag || 'MAHARASHTRAELECTIONS2026',
        agreeCount: 142,
        funnyCount: 12,
        commentCount: 2,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setContent('');
      setLeaderTag('');
      setTopicTag('');
    } catch (error) {
      console.error('Error posting insight:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.composerCard}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.textareaContainer}>
          <textarea
            className={styles.textarea}
            placeholder={user ? "Write your insight on political performance (max 500 chars)..." : "Register to post an insight (max 500 chars)..."}
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            disabled={!user || isSubmitting}
            maxLength={MAX_CHARS}
          />
          <div className={styles.composerBottomBar}>
            <span className={styles.charCount}>
              {content.length}/{MAX_CHARS} CHARS MAX
            </span>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!user || isSubmitting || content.trim() === ''}
            >
              <span>✈</span> {isSubmitting ? 'POSTING...' : 'POST INSIGHT'}
            </button>
          </div>
        </div>

        {user && (
          <div className={styles.tagRow}>
            <input 
              type="text"
              placeholder="Tag Leader (e.g. DEVENDRA FADNAVIS)"
              className={styles.select}
              value={leaderTag}
              onChange={(e) => setLeaderTag(e.target.value)}
            />
            <input 
              type="text"
              placeholder="Tag Topic (e.g. MAHARASHTRAELECTIONS2026)"
              className={styles.select}
              value={topicTag}
              onChange={(e) => setTopicTag(e.target.value)}
            />
          </div>
        )}
      </form>
    </div>
  );
}
