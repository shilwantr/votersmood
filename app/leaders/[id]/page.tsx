'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import styles from './page.module.css';
import Link from 'next/link';

export default function LeaderProfile() {
  const { id } = useParams() as { id: string };
  const [leader, setLeader] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLeaderData();
    }
  }, [id]);

  const fetchLeaderData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'leaders', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const leaderObj = { id: docSnap.id, ...data };
        setLeader(leaderObj);
        
        // Fetch posts linked to this leader from DB
        const postsQuery = query(collection(db, 'posts'), where('targetLeaderId', '==', id));
        const postsSnap = await getDocs(postsQuery);
        setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        // Fetch polls linked to this leader from DB
        const pollsQuery = query(collection(db, 'polls'), where('leaderId', '==', id));
        const pollsSnap = await getDocs(pollsQuery);
        setPolls(pollsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch related leaders in same state from DB
        if (data.state) {
          const relQuery = query(collection(db, 'leaders'), where('state', '==', data.state), limit(4));
          const relSnap = await getDocs(relQuery);
          const relList = relSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(r => r.id !== id);
          setRelated(relList);
        }
      } else {
        setLeader(null);
      }
    } catch (error) {
      console.warn("Error fetching leader profile from DB:", error);
      setLeader(null);
    }
    setLoading(false);
  };

  if (loading) return <div className={styles.loading}>LOADING REPRESENTATIVE PROFILE FROM DB...</div>;
  if (!leader) return <div className={styles.loading}>Representative profile not found in database.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.profileHeader}>
          <div className={styles.photoContainer}>
            {leader.profilePhoto || leader.photoUrl ? (
              <img src={leader.profilePhoto || leader.photoUrl} alt={leader.name} className={styles.photo} />
            ) : (
              <div>{leader.name ? leader.name.split(' ').map((n: string) => n[0]).join('') : 'L'}</div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{leader.name}</h1>
            <div className={styles.badges}>
              <span className={styles.partyBadge}>{leader.party}</span>
              <span className={styles.typeBadge}>{leader.type || leader.repType}</span>
            </div>
            <p className={styles.location}>📍 {leader.constituency}, {leader.state}</p>
            <div className={styles.stats}>
              <div className={styles.statBox}>
                <span className={styles.statValue}>{leader.agreeCount || 0}</span>
                <span className={styles.statLabel}>AGREE</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statValue}>{leader.funnyCount || 0}</span>
                <span className={styles.statLabel}>FUNNY</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Recent Discussions & Insights</h2>
          {posts.length > 0 ? (
            <div className={styles.list}>
              {posts.map(post => (
                <div key={post.id} className={styles.listItem}>
                  {post.content}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMsg}>No public discussions posted yet about this leader.</p>
          )}
        </div>

        <div className={styles.contentSection}>
          <h2 className={styles.sectionTitle}>Active Constituency Polls</h2>
          {polls.length > 0 ? (
            <div className={styles.list}>
              {polls.map(poll => (
                <div key={poll.id} className={styles.listItem}>
                  {poll.question}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyMsg}>No active constituency polls linked to this leader.</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Related Representatives ({leader.state})</h2>
          <div className={styles.relatedList}>
            {related.map(rel => (
              <Link href={`/leaders/${rel.id}`} key={rel.id} className={styles.relatedCard}>
                <div className={styles.relatedPhoto}>
                  {rel.name ? rel.name.split(' ').map((n: string) => n[0]).join('') : 'L'}
                </div>
                <div className={styles.relatedInfo}>
                  <h4 className={styles.relatedName}>{rel.name}</h4>
                  <p className={styles.relatedParty}>{rel.party}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
