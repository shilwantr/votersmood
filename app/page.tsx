'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, limit, getDocs } from 'firebase/firestore';
import PostComposer from '@/components/PostComposer';
import PostCard from '@/components/PostCard';
import styles from './page.module.css';

const SAMPLE_POST = {
  id: 'sample-main-post-1',
  content: 'Evaluating local representative performance in constituency. Infrastructure and connectivity have improved, but local water supply in the area requires urgent intervention ahead of elections.',
  authorId: 'ananya-deshmukh',
  authorName: 'ANANYA DESHMUKH',
  authorAvatar: '',
  isVerified: true,
  createdAt: new Date(),
  leaderTag: 'CONSTITUENCY FEEDBACK',
  topicTag: 'CITIZENVOICE',
  agreeCount: 142,
  funnyCount: 12,
  commentCount: 2,
};

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live discussions from Firestore DB
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

  // 2. Fetch live representative directory preview directly from Cloud Firestore DB
  useEffect(() => {
    const fetchTopLeaders = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'leaders'), limit(4)));
        if (!snap.empty) {
          const list = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
          setLeaders(list);
        }
      } catch (e) {
        console.warn('Error fetching leaders for home preview:', e);
      }
    };
    fetchTopLeaders();
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
        {/* Directory Preview (100% DB-Fetched Representatives) */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>🗂️ DIRECTORY PREVIEW</div>
          <div className={styles.leaderList}>
            {leaders.map(leader => (
              <div key={leader.id} className={styles.leaderItem}>
                <div className={styles.leaderLeft}>
                  {leader.profilePhoto ? (
                    <img src={leader.profilePhoto} alt={leader.name} className={styles.leaderAvatar} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className={styles.leaderAvatar}>{leader.name?.charAt(0) || 'L'}</div>
                  )}
                  <div className={styles.leaderMeta}>
                    <span className={styles.leaderName}>{leader.name}</span>
                    <span className={styles.leaderSub}>{leader.type || leader.repType || 'MLA'} • {leader.state}</span>
                  </div>
                </div>
                <span className={`${styles.partyBadge}`}>{leader.party}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Topics */}
        <div className={styles.sidebarCard}>
          <div className={styles.sidebarTitle}>📈 TRENDING TOPICS</div>
          <div className={styles.topicsList}>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#ELECTIONS2026</span>
              <span className={styles.topicCount}>1,420 GAZETTE POSTS</span>
            </div>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#POLICYFEEDBACK</span>
              <span className={styles.topicCount}>980 GAZETTE POSTS</span>
            </div>
            <div className={styles.topicItem}>
              <span className={styles.topicHashtag}>#UNIONBUDGET</span>
              <span className={styles.topicCount}>2,310 GAZETTE POSTS</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
