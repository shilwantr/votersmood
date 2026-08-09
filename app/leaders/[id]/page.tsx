'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styles from './page.module.css';
import Link from 'next/link';

const SAMPLE_PROFILES: { [key: string]: any } = {
  'devendra-fadnavis': {
    id: 'devendra-fadnavis',
    name: 'Devendra Fadnavis',
    party: 'BJP',
    state: 'MH',
    constituency: 'Nagpur South West',
    type: 'MLA',
    agreeCount: 142,
    funnyCount: 12,
  },
  'rahul-gandhi': {
    id: 'rahul-gandhi',
    name: 'Rahul Gandhi',
    party: 'INC',
    state: 'UP',
    constituency: 'Rae Bareli',
    type: 'MP_LS',
    agreeCount: 230,
    funnyCount: 45,
  },
  'nitin-gadkari': {
    id: 'nitin-gadkari',
    name: 'Nitin Gadkari',
    party: 'BJP',
    state: 'MH',
    constituency: 'Nagpur',
    type: 'MP_LS',
    agreeCount: 310,
    funnyCount: 5,
  }
};

const SAMPLE_RELATED = [
  { id: 'nitin-gadkari', name: 'Nitin Gadkari', party: 'BJP' },
  { id: 'rahul-gandhi', name: 'Rahul Gandhi', party: 'INC' },
  { id: 'shashi-tharoor', name: 'Shashi Tharoor', party: 'INC' }
];

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
        setLeader({ id: docSnap.id, ...data });
        
        const postsQuery = query(collection(db, 'posts'), where('leaderId', '==', id));
        const postsSnap = await getDocs(postsQuery);
        setPosts(postsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const pollsQuery = query(collection(db, 'polls'), where('leaderId', '==', id));
        const pollsSnap = await getDocs(pollsQuery);
        setPolls(pollsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        // Fallback for sample profile
        const sample = SAMPLE_PROFILES[id] || {
          id,
          name: id.replace(/-/g, ' ').toUpperCase(),
          party: 'INDEPENDENT',
          state: 'NATIONAL',
          constituency: 'Constituency Registry',
          type: 'MLA',
          agreeCount: 45,
          funnyCount: 3
        };
        setLeader(sample);
        setRelated(SAMPLE_RELATED.filter(r => r.id !== id));
      }
    } catch (error) {
      console.warn("Using leader fallback profile:", error);
      const sample = SAMPLE_PROFILES[id] || {
        id,
        name: id.replace(/-/g, ' ').toUpperCase(),
        party: 'INDEPENDENT',
        state: 'NATIONAL',
        constituency: 'Constituency Registry',
        type: 'MLA',
        agreeCount: 45,
        funnyCount: 3
      };
      setLeader(sample);
      setRelated(SAMPLE_RELATED.filter(r => r.id !== id));
    }
    setLoading(false);
  };

  if (loading) return <div className={styles.loading}>LOADING REPRESENTATIVE PROFILE...</div>;
  if (!leader) return <div className={styles.loading}>Leader profile not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.profileHeader}>
          <div className={styles.photoContainer}>
            {leader.photoUrl ? (
              <img src={leader.photoUrl} alt={leader.name} className={styles.photo} />
            ) : (
              <div>{leader.name.split(' ').map((n: string) => n[0]).join('')}</div>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{leader.name}</h1>
            <div className={styles.badges}>
              <span className={styles.partyBadge}>{leader.party}</span>
              <span className={styles.typeBadge}>{leader.type}</span>
            </div>
            <p className={styles.location}>📍 {leader.constituency}, {leader.state}</p>
            <div className={styles.stats}>
              <div className={styles.statBox}>
                <span className={styles.statValue}>{leader.agreeCount || leader.reactions?.agree || 0}</span>
                <span className={styles.statLabel}>AGREE</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statValue}>{leader.funnyCount || leader.reactions?.funny || 0}</span>
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

      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Related Representatives</h2>
        <div className={styles.relatedList}>
          {(related.length > 0 ? related : SAMPLE_RELATED).map(rel => (
            <Link href={`/leaders/${rel.id}`} key={rel.id} className={styles.relatedCard}>
              <div className={styles.relatedPhoto}>
                {rel.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className={styles.relatedInfo}>
                <h4 className={styles.relatedName}>{rel.name}</h4>
                <p className={styles.relatedParty}>{rel.party}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
