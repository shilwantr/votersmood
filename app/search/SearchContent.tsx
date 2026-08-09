'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Leader, Topic, Post } from '@/lib/types';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import styles from './page.module.css';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) return;

    const fetchResults = async () => {
      setLoading(true);
      const searchTerm = q.toLowerCase().trim();
      
      try {
        // Search Leaders
        const leadersRef = collection(db, 'leaders');
        const leadersQ = query(
          leadersRef,
          where('searchTokens', 'array-contains', searchTerm),
          limit(5)
        );
        const leadersSnap = await getDocs(leadersQ);
        setLeaders(leadersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Leader)));

        // Search Topics (Firestore doesn't do substring search well, so we might need a workaround or exact matches, or searchTokens. Assuming searchTokens or exact match for now)
        const topicsRef = collection(db, 'topics');
        const topicsQ = query(
          topicsRef,
          where('id', '>=', searchTerm),
          where('id', '<=', searchTerm + '\uf8ff'),
          limit(5)
        );
        const topicsSnap = await getDocs(topicsQ);
        setTopics(topicsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Topic)));

        // Search Posts (simplified)
        const postsRef = collection(db, 'posts');
        const postsQ = query(
          postsRef,
          where('isApproved', '==', true),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const postsSnap = await getDocs(postsQ);
        // Naive client-side filter for posts text since Firestore lacks full text search
        const allPosts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        setPosts(allPosts.filter(post => post.content.toLowerCase().includes(searchTerm)));

      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  if (!q) {
    return <div className={styles.empty}>Enter a search term to find leaders, topics, or discussions.</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Searching for "{q}"...</div>;
  }

  return (
    <div className={styles.resultsContainer}>
      <p className={styles.queryText}>Showing results for: <span className={styles.highlight}>{q}</span></p>

      {leaders.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Leaders</h2>
          <div className={styles.leadersGrid}>
            {leaders.map(leader => (
              <Link href={`/leaders/${leader.id}`} key={leader.id} className={styles.leaderCard}>
                <Card className={styles.cardContent}>
                  <h3 className={styles.leaderName}>{leader.name}</h3>
                  <p className={styles.leaderRole}>{leader.party} • {leader.state}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {topics.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Topics</h2>
          <div className={styles.topicsGrid}>
            {topics.map(topic => (
              <Link href={`/trending?topic=${topic.id}`} key={topic.id} className={styles.topicCard}>
                <Card className={styles.cardContent}>
                  <h3 className={styles.topicTitle}>#{topic.title}</h3>
                  <Badge className={styles.badge}>{topic.category}</Badge>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Discussions</h2>
          <div className={styles.postsList}>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {leaders.length === 0 && topics.length === 0 && posts.length === 0 && (
        <div className={styles.noResults}>
          <p>No results found for "{q}".</p>
        </div>
      )}
    </div>
  );
}
