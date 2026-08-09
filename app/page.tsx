'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import PostComposer from '@/components/PostComposer';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

const SAMPLE_POST = {
  id: 'sample-main-post-1',
  content: 'Evaluating local MLA performance in Nagpur South West constituency. The road quality and highway connectivity have improved significantly, but local water pressure in East Nagpur still requires urgent MLA intervention ahead of state elections.',
  authorId: 'ananya-deshmukh',
  authorName: 'ANANYA DESHMUKH',
  authorAvatar: '',
  isVerified: true,
  createdAt: new Date(),
  leaderTag: 'DEVENDRA FADNAVIS (MLA)',
  topicTag: 'MAHARASHTRAELECTIONS2026',
  agreeCount: 142,
  funnyCount: 12,
  commentCount: 2,
};

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    }, (error) => {
      console.warn("Using sample post feed fallback:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const displayPosts = posts.length > 0 ? posts : [SAMPLE_POST];

  return (
    <div className={styles.layout}>
      {/* Main Feed Column */}
      <main className={styles.mainFeed}>
        <div className={styles.sectionHeader}>
          <h1 className={styles.sectionTitle}>
            💬 Citizen Political Discussions
          </h1>
        </div>

        {/* Insight Composer */}
        <PostComposer />

        {/* Posts List */}
        {loading ? (
          <div className={styles.loading}>LOADING DISCUSSIONS...</div>
        ) : (
          displayPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </main>

      {/* Right Sidebar */}
      <aside className={styles.sidebar}>
        {/* Directory Card */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>🗂️ DIRECTORY PREVIEW</div>
          <div className={styles.leaderList}>
            <div className={styles.leaderItem}>
              <div className={styles.leaderLeft}>
                <div className={styles.leaderAvatar}>RG</div>
                <div className={styles.leaderMeta}>
                  <span className={styles.leaderName}>Rahul Gandhi</span>
                  <span className={styles.leaderSub}>LS_MP • Uttar Pradesh</span>
                </div>
              </div>
              <span className={`${styles.partyBadge} ${styles.partyInc}`}>INC</span>
            </div>

            <div className={styles.leaderItem}>
              <div className={styles.leaderLeft}>
                <div className={styles.leaderAvatar}>NG</div>
                <div className={styles.leaderMeta}>
                  <span className={styles.leaderName}>Nitin Gadkari</span>
                  <span className={styles.leaderSub}>LS_MP • Maharashtra</span>
                </div>
              </div>
              <span className={`${styles.partyBadge} ${styles.partyBjp}`}>BJP</span>
            </div>

            <div className={styles.leaderItem}>
              <div className={styles.leaderLeft}>
                <div className={styles.leaderAvatar}>ST</div>
                <div className={styles.leaderMeta}>
                  <span className={styles.leaderName}>Shashi Tharoor</span>
                  <span className={styles.leaderSub}>LS_MP • Kerala</span>
                </div>
              </div>
              <span className={`${styles.partyBadge} ${styles.partyInc}`}>INC</span>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>📈 TRENDING TOPICS</div>
          <div className={styles.topicsList}>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#MAHARASHTRAELECTIONS2026</span>
              <span className={styles.topicCount}>1,420 GAZETTE POSTS</span>
            </div>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#UPELECTIONPOLLS2026</span>
              <span className={styles.topicCount}>980 GAZETTE POSTS</span>
            </div>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#UNIONBUDGET2026</span>
              <span className={styles.topicCount}>2,310 GAZETTE POSTS</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
