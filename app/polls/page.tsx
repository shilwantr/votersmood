'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/providers/AuthProvider';
import PollCard from '@/components/PollCard';
import CreatePollModal from '@/components/CreatePollModal';

const SAMPLE_FEATURED_POLLS = [
  {
    id: 'sample-poll-1',
    question: 'Priority Focus for Next Maharashtra Assembly Elections?',
    options: [
      { id: 'o1', text: 'Urban Infrastructure & Metro Expansion' },
      { id: 'o2', text: 'Farmer Loan Waiver & Agricultural Subsidies' },
      { id: 'o3', text: 'Job Creation & Industrial Investment' },
      { id: 'o4', text: 'Water Supply & Coastal Management' }
    ],
    authorName: 'Official Gazette Poll Engine',
    authorRole: 'admin',
    type: 'election',
    electionType: 'state',
    state: 'MH',
    constituency: 'Mumbai South',
    createdAt: new Date(),
  },
  {
    id: 'sample-poll-2',
    question: 'UP Assembly Election Prep: Key Factor in Gorakhpur Urban',
    options: [
      { id: 'o1', text: 'Law & Order Enforcement' },
      { id: 'o2', text: 'Highway & Expressway Connectivity' },
      { id: 'o3', text: 'Healthcare & Public Hospitals' }
    ],
    authorName: 'Official Gazette Poll Engine',
    authorRole: 'admin',
    type: 'election',
    electionType: 'state',
    state: 'UP',
    constituency: 'Gorakhpur Urban',
    createdAt: new Date(),
  }
];

export default function PollsPage() {
  const { user } = useAuth();
  const [polls, setPolls] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPolls(p);
    }, (err) => {
      console.warn("Polls query fallback:", err);
    });
    return () => unsubscribe();
  }, []);

  const allPolls = polls.length > 0 ? polls : SAMPLE_FEATURED_POLLS;

  const filters = ['All', 'Election', 'State', 'National', 'Bypoll'];

  const filteredPolls = allPolls.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Election') return p.type === 'election';
    if (filter === 'State') return p.electionType === 'state' || p.electionType === 'State';
    if (filter === 'National') return p.electionType === 'national' || p.electionType === 'National';
    if (filter === 'Bypoll') return p.electionType === 'bypoll' || p.electionType === 'Bypoll';
    return true;
  });

  const featuredPolls = filteredPolls.filter(p => p.type === 'election' || p.type === 'featured' || p.authorRole === 'admin');
  const citizenPolls = filteredPolls.filter(p => p.type === 'regular' || p.type === 'user');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📊 Election & Citizen Polls</h1>
        <button 
          className={styles.createPollBtn} 
          onClick={() => setIsModalOpen(true)}
        >
          + CREATE POLL
        </button>
      </div>

      <div className={styles.tabs}>
        {filters.map(f => (
          <button 
            key={f}
            className={`${styles.tab} ${filter === f ? styles.tabActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {featuredPolls.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Featured & State Election Polls</h2>
          <div className={styles.pollsList}>
            {featuredPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className={styles.sectionTitle}>Citizen Discussions & Polls</h2>
        <div className={styles.pollsList}>
          {citizenPolls.length > 0 ? (
            citizenPolls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))
          ) : (
            <p className={styles.empty}>No citizen polls created yet. Click "+ CREATE POLL" above to start one.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreatePollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
