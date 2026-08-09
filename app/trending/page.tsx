'use client';

import { useEffect, useState, Suspense } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PollCard from '@/components/PollCard';
import styles from './page.module.css';

const SAMPLE_TRENDING_TOPICS = [
  {
    id: 'maharashtra-elections-2026',
    title: 'MAHARASHTRAELECTIONS2026',
    category: 'ELECTION',
    description: 'Maharashtra Assembly Elections & Local Governance coverage, key constituency polls, and candidate manifestos.',
    postCount: 1420,
    relatedState: 'MAHARASHTRA • MUMBAI SOUTH',
  },
  {
    id: 'up-election-polls-2026',
    title: 'UPELECTIONPOLLS2026',
    category: 'ELECTION',
    description: 'Uttar Pradesh Urban Development & Regional Polls. Debates on law & order, expressways, and upcoming state election candidates.',
    postCount: 980,
    relatedState: 'UTTAR PRADESH • GORAKHPUR URBAN',
  },
  {
    id: 'union-budget-2026',
    title: 'UNIONBUDGET2026',
    category: 'POLICY',
    description: 'Central Union Fiscal Budget & Tax Reforms. Parliamentary debates in Lok Sabha & Rajya Sabha on income tax, infrastructure, and inflation.',
    postCount: 2310,
    relatedState: 'NATIONAL • LOK SABHA',
  },
  {
    id: 'urban-transport-policy',
    title: 'URBANTRANSPORTPOLICY',
    category: 'POLICY',
    description: 'Metro Rail & Highway Expansion Across States. Evaluation of MLA performance in road maintenance, public transit, and smart cities.',
    postCount: 650,
    relatedState: 'NATIONAL • VIDHAN SABHA',
  }
];

function TrendingContent() {
  const [topics, setTopics] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const topicsRef = collection(db, 'topics');
        const topicsQ = query(
          topicsRef,
          where('isTrending', '==', true),
          orderBy('trendScore', 'desc'),
          limit(10)
        );
        const topicsSnap = await getDocs(topicsQ);
        const t = topicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTopics(t);

        const pollsRef = collection(db, 'polls');
        const pollsQ = query(
          pollsRef,
          where('isFeatured', '==', true),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const pollsSnap = await getDocs(pollsQ);
        const p = pollsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPolls(p);
      } catch (error) {
        console.warn("Trending fetch fallback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const displayTopics = topics.length > 0 ? topics : SAMPLE_TRENDING_TOPICS;

  return (
    <div className={styles.content}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Trending Topics</h2>
        <div className={styles.topicsGrid}>
          {displayTopics.map(topic => (
            <div key={topic.id} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <h3 className={styles.topicTitle}>#{topic.title}</h3>
                <span className={styles.badge}>{topic.category || 'TOPIC'}</span>
              </div>
              <p className={styles.topicDescription}>{topic.description}</p>
              <div className={styles.topicMeta}>
                <span className={styles.postCount}>{topic.postCount || 0} GAZETTE POSTS</span>
                {topic.relatedState && (
                  <span className={styles.stateTag}>{topic.relatedState}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {polls.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Polls</h2>
          <div className={styles.pollsGrid}>
            {polls.map(poll => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function TrendingPage() {
  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>📈 Trending Topics & Public Intelligence</h1>
        <p className={styles.subtitle}>REAL-TIME CONSTITUENCY AGGREGATION & ISSUES FEED</p>
      </header>
      
      <Suspense fallback={<div className={styles.loading}>LOADING TRENDING TOPICS...</div>}>
        <TrendingContent />
      </Suspense>
    </main>
  );
}
