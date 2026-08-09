'use client';

import React, { useState, useEffect } from 'react';
import styles from './PollCard.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, onSnapshot, query } from 'firebase/firestore';
import Badge from '@/components/ui/Badge';

export default function PollCard({ poll }: { poll: any }) {
  const { user } = useAuth();
  const [hasVoted, setHasVoted] = useState(false);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [votes, setVotes] = useState<any[]>([]);
  const [isResident, setIsResident] = useState(false);
  
  useEffect(() => {
    if (!poll.id) return;
    const votesRef = collection(db, 'polls', poll.id, 'votes');
    const q = query(votesRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const v: any[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVotes(v);
      if (user) {
        const userVote = v.find(vote => vote.id === user.uid);
        if (userVote) {
          setHasVoted(true);
          setVotedOption(userVote.optionId);
        }
      }
    });
    return () => unsubscribe();
  }, [poll.id, user]);

  const totalVotes = votes.length;
  
  const handleVote = async (optionId: string) => {
    if (!user || hasVoted) return;
    try {
      const voteRef = doc(db, 'polls', poll.id, 'votes', user.uid);
      await setDoc(voteRef, {
        optionId,
        isResident: poll.type === 'election' ? isResident : null,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getOptionPercentage = (optionId: string) => {
    if (totalVotes === 0) return 0;
    const optionVotes = votes.filter(v => v.optionId === optionId).length;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  const getResidentBreakdown = (optionId: string) => {
    const optionVotes = votes.filter(v => v.optionId === optionId);
    const residentCount = optionVotes.filter(v => v.isResident).length;
    const nonResidentCount = optionVotes.length - residentCount;
    return { residentCount, nonResidentCount };
  };

  return (
    <div className={`${styles.card} ${poll.type === 'featured' || poll.type === 'election' ? styles.featured : ''}`}>
      <div className={styles.header}>
        <div className={styles.author}>
          By <span className={styles.authorName}>{poll.authorName}</span>
          {poll.authorRole === 'admin' && <span className={styles.adminBadge}>ADMIN</span>}
        </div>
        {poll.topicId && <Badge>{poll.topicId}</Badge>}
      </div>
      
      <h3 className={`${styles.question} ${poll.type !== 'regular' ? styles.questionBold : ''}`}>
        {poll.question}
      </h3>

      {poll.type === 'election' && !hasVoted && (
        <div className={styles.electionQuestions}>
          <p>Please confirm your residency status before voting:</p>
          <label className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={isResident}
              onChange={(e) => setIsResident(e.target.checked)} 
            />
            I am a resident of {poll.constituency || poll.state} and eligible to vote in this election.
          </label>
        </div>
      )}

      <div className={styles.options}>
        {poll.options?.map((option: any, idx: number) => {
          const percentage = getOptionPercentage(option.id);
          const breakdown = poll.type === 'election' ? getResidentBreakdown(option.id) : null;
          
          return (
            <div key={idx} className={styles.optionBar} onClick={() => handleVote(option.id)}>
              {(hasVoted) && (
                <div className={styles.optionFill} style={{ width: `${percentage}%` }}></div>
              )}
              <div className={styles.optionContent}>
                <span>{option.text}</span>
                {hasVoted && <span>{percentage}%</span>}
              </div>
              {hasVoted && poll.type === 'election' && breakdown && (
                <div className={styles.resultsGrid} style={{ padding: '0 1rem 0.5rem', position: 'relative', zIndex: 2 }}>
                  <span>Residents: {breakdown.residentCount} | Non-residents: {breakdown.nonResidentCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.meta}>
        <span>{totalVotes} votes</span>
        {poll.expiresAt && <span>Expires: {new Date(poll.expiresAt.seconds * 1000).toLocaleDateString()}</span>}
      </div>
    </div>
  );
}
