import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import LeaderCard from '../components/LeaderCard';
import { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Home({ openRegisterModal }) {
  const [posts, setPosts] = useState([]);
  const [featuredLeaders, setFeaturedLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      api.getPosts(),
      api.getLeaders({ sort: 'openQuestions' })
    ]).then(([postsData, leadersData]) => {
      if (isMounted) {
        setPosts(postsData);
        
        // Sort leaders strictly by openQuestionsCount descending & pick top 5
        const list = Array.isArray(leadersData) ? leadersData : (leadersData.leaders || []);
        const sorted = [...list].sort((a, b) => (b.openQuestionsCount || 0) - (a.openQuestionsCount || 0));
        setFeaturedLeaders(sorted.slice(0, 5));
        
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      
      {/* Title Header Card */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-card)', padding: '24px', marginBottom: '28px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em', marginBottom: '4px' }}>
          🏛 OFFICIAL GAZETTE CIVIC DISCUSSIONS
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          Citizen Discussions & Public Open Questions
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', margin: 0 }}>
          Verified constituency feedback, leader open questions, and political performance insights.
        </p>
      </div>

      <div className="two-column-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        
        {/* Main Feed Column */}
        <div>
          <PostComposer onPostCreated={handlePostCreated} openRegisterModal={openRegisterModal} />

          {loading ? (
            <div>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState 
              icon="💬"
              title="No Discussions Posted Yet"
              description="Be the first verified citizen to post an insight or open question to a leader!"
              actionLabel="Post First Insight"
              onAction={openRegisterModal}
            />
          ) : (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onDelete={(id) => setPosts(posts.filter(p => p.id !== id))} 
              />
            ))
          )}
        </div>

        {/* Sidebar Column: Top 5 Featured Representatives Ranked by Open Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="gazette-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                🏛 Featured Representatives (Top 5)
              </h3>
              <span className="badge badge-featured" style={{ fontSize: '9px', textTransform: 'uppercase' }}>
                RANKED BY OPEN QUESTIONS
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {featuredLeaders.map((l, index) => (
                <LeaderCard 
                  key={l.id} 
                  leader={l} 
                  rank={index + 1} 
                  openRegisterModal={openRegisterModal}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
