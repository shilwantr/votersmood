'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, runTransaction, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/providers/AuthProvider';
import styles from './ReactionButtons.module.css';

interface ReactionButtonsProps {
  targetId: string;
  targetType: 'post' | 'comment';
  initialAgreeCount: number;
  initialFunnyCount: number;
}

type ReactionType = 'agree' | 'funny' | null;

export default function ReactionButtons({ targetId, targetType, initialAgreeCount, initialFunnyCount }: ReactionButtonsProps) {
  const { user } = useAuth();
  const [agreeCount, setAgreeCount] = useState(initialAgreeCount);
  const [funnyCount, setFunnyCount] = useState(initialFunnyCount);
  const [userReaction, setUserReaction] = useState<ReactionType>(null);
  const [isAnimating, setIsAnimating] = useState<ReactionType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserReaction = async () => {
      if (!user) {
        setUserReaction(null);
        setIsLoading(false);
        return;
      }
      try {
        const reactionRef = doc(db, 'reactions', `${user.uid}_${targetId}`);
        const reactionSnap = await getDoc(reactionRef);
        if (reactionSnap.exists()) {
          setUserReaction(reactionSnap.data().type as ReactionType);
        } else {
          setUserReaction(null);
        }
      } catch (err) {
        console.error('Error fetching reaction:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserReaction();
  }, [user, targetId]);

  const handleReaction = async (type: 'agree' | 'funny') => {
    if (!user || isLoading) return;

    // Optimistic update
    const previousReaction = userReaction;
    let agreeDiff = 0;
    let funnyDiff = 0;

    if (previousReaction === type) {
      // Toggle off
      setUserReaction(null);
      if (type === 'agree') agreeDiff = -1;
      if (type === 'funny') funnyDiff = -1;
    } else {
      // Switch or new
      setUserReaction(type);
      setIsAnimating(type);
      setTimeout(() => setIsAnimating(null), 300);

      if (type === 'agree') agreeDiff = 1;
      if (type === 'funny') funnyDiff = 1;
      if (previousReaction === 'agree') agreeDiff = -1;
      if (previousReaction === 'funny') funnyDiff = -1;
    }

    setAgreeCount(prev => prev + agreeDiff);
    setFunnyCount(prev => prev + funnyDiff);

    try {
      const targetCollection = targetType === 'post' ? 'posts' : 'comments';
      const targetRef = doc(db, targetCollection, targetId);
      const reactionRef = doc(db, 'reactions', `${user.uid}_${targetId}`);

      await runTransaction(db, async (transaction) => {
        const targetDoc = await transaction.get(targetRef);
        if (!targetDoc.exists()) throw new Error('Target does not exist!');

        const newAgreeCount = (targetDoc.data().agreeCount || 0) + agreeDiff;
        const newFunnyCount = (targetDoc.data().funnyCount || 0) + funnyDiff;

        transaction.update(targetRef, {
          agreeCount: newAgreeCount,
          funnyCount: newFunnyCount
        });

        if (previousReaction === type) {
          transaction.delete(reactionRef);
        } else {
          transaction.set(reactionRef, {
            userId: user.uid,
            targetId,
            targetType,
            type,
            createdAt: new Date()
          });
        }
      });
    } catch (error) {
      console.error('Reaction transaction failed:', error);
      // Revert optimistic update
      setUserReaction(previousReaction);
      setAgreeCount(prev => prev - agreeDiff);
      setFunnyCount(prev => prev - funnyDiff);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.reactionBtn} ${userReaction === 'agree' ? styles.active : ''} ${isAnimating === 'agree' ? styles.animate : ''}`}
        onClick={() => handleReaction('agree')}
        disabled={!user || isLoading}
        aria-label="Agree"
      >
        <span className={styles.icon}>✓</span>
        <span className={styles.label}>AGREE</span>
        <span className={styles.count}>{agreeCount}</span>
      </button>

      <button 
        className={`${styles.reactionBtn} ${userReaction === 'funny' ? styles.active : ''} ${isAnimating === 'funny' ? styles.animate : ''}`}
        onClick={() => handleReaction('funny')}
        disabled={!user || isLoading}
        aria-label="Funny"
      >
        <span className={styles.icon}>😂</span>
        <span className={styles.label}>FUNNY</span>
        <span className={styles.count}>{funnyCount}</span>
      </button>
    </div>
  );
}
