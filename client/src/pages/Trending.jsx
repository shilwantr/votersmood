import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Trending({ openRegisterModal }) {
  const [topics, setTopics] = useState([]);
  const [windowHours, setWindowHours] = useState(48);
  const [loading, setLoading] = useState(true);
  const [topicPosts, setTopicPosts] = useState({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getTopics({ window: windowHours }).then(async (fetchedData) => {
      if (!isMounted) return;
      const fetchedTopics = Array.isArray(fetchedData) ? fetchedData : (fetchedData?.topics || []);
      setTopics(fetchedTopics);

      const postsMap = {};
      await Promise.all(
        fetchedTopics.map(async (t) => {
          try {
            const postsData = await api.getPosts({ topic: t.title, sort: 'reactions' });
            const posts = Array.isArray(postsData) ? postsData : (postsData?.posts || []);
            // Sort posts by total reaction count (agreeCount + funnyCount) descending
            const sortedPosts = [...posts].sort((a, b) => {
              const scoreA = (a.agreeCount || 0) + (a.funnyCount || 0);
              const scoreB = (b.agreeCount || 0) + (b.funnyCount || 0);
              return scoreB - scoreA;
            });
            postsMap[t.id] = sortedPosts;
          } catch (e) {
            console.warn(`Error fetching posts for ${t.title}:`, e);
          }
        })
      );

      if (isMounted) {
        setTopicPosts(postsMap);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [windowHours]);

  const handlePostCreated = (topicId, newPost) => {
    setTopicPosts(prev => {
      const existing = Array.isArray(prev[topicId]) ? prev[topicId] : [];
      const updated = [newPost, ...existing].sort((a, b) => {
        const scoreA = (a.agreeCount || 0) + (a.funnyCount || 0);
        const scoreB = (b.agreeCount || 0) + (b.funnyCount || 0);
        return scoreB - scoreA;
      });
      return { ...prev, [topicId]: updated };
    });
  };

  const safeTopics = Array.isArray(topics) ? topics : [];

  return (
    <div className="container" style={{ padding: '32px 24px', maxWidth: '960px' }}>
      {/* Top Header Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-card)', padding: '20px 24px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700, margin: '0 0 4px 0' }}>
            📈 Trending Issues & Citizen Chat Threads
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
            Ranked by highest reaction volume (Agree 👍 & Funny 😄) over a rolling 24 to 48 hour window.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-main)', padding: '4px', borderRadius: 'var(--radius-button)' }}>
          <button
            onClick={() => setWindowHours(24)}
            className={windowHours === 24 ? 'btn-primary' : 'btn-ghost'}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '6px 14px' }}
          >
            ⚡ 24 HOURS
          </button>
          <button
            onClick={() => setWindowHours(48)}
            className={windowHours === 48 ? 'btn-primary' : 'btn-ghost'}
            style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '6px 14px' }}
          >
            🔥 48 HOURS
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : safeTopics.length === 0 ? (
        <EmptyState 
          icon="📈"
          title="No Trending Topics Recorded"
          description="Reaction scores are calculated over a rolling window. Post a new insight to start trending discussions!"
          actionLabel="Post New Insight"
          onAction={openRegisterModal}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {safeTopics.map((topic, index) => {
            const posts = Array.isArray(topicPosts[topic.id]) ? topicPosts[topic.id] : [];

            return (
              <div 
                key={topic.id} 
                className="gazette-card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-main)',
                  borderRadius: 'var(--radius-card)',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
                }}
              >
                {/* Topic Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, backgroundColor: 'var(--bg-navbar)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px' }}>
                      #{topic.rank || (index + 1)} RANK
                    </span>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: 0, color: 'var(--text-primary)' }}>
                        #{topic.title}
                      </h2>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                        📍 {topic.relatedState}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-trending" style={{ fontSize: '11px' }}>{topic.category}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', backgroundColor: '#FDF6ED', padding: '4px 10px', borderRadius: '4px' }}>
                      🔥 {topic.activeReactionScore?.toLocaleString() || topic.reactionsLast48h} TOTAL REACTIONS ({windowHours}H)
                    </span>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {topic.description}
                </p>

                {/* Insight Post Composer for this Topic */}
                <div style={{ marginTop: '8px' }}>
                  <PostComposer 
                    onPostCreated={(post) => handlePostCreated(topic.id, post)} 
                    openRegisterModal={openRegisterModal} 
                  />
                </div>

                {/* Embedded Discussions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💬 Citizen Discussions for #{topic.title} (Ranked by Reaction Volume)
                  </div>

                  {posts.length === 0 ? (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', padding: '16px 0' }}>
                      No discussions posted yet for this topic. Be the first to post an insight above!
                    </div>
                  ) : (
                    posts.map(post => (
                      <PostCard key={post.id} post={{ ...post, topicTag: topic.title }} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
