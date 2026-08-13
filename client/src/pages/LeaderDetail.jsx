import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import PostCard from '../components/PostCard';
import PostComposer from '../components/PostComposer';

const CATEGORIES = [
  'All',
  'Water Supply',
  'Infrastructure',
  'Employment',
  'Healthcare',
  'Education',
  'Roads',
  'Agriculture',
  'Law & Order',
  'Other'
];

export default function LeaderDetail({ leaderId, onBack }) {
  const [leader, setLeader] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Sorting
  const [sortOption, setSortOption] = useState('supported'); // 'supported' | 'discussed' | 'recent' | 'unanswered' | 'oldest'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const fetchLeaderData = (showLoading = false) => {
      if (showLoading) setLoading(true);
      Promise.all([
        api.getLeaderById(leaderId),
        api.getPosts({ leaderId, isOpenQuestion: 'true', sort: sortOption, category: categoryFilter })
      ]).then(([leaderData, postsData]) => {
        if (isMounted) {
          setLeader(leaderData);
          if (leaderData?.name) {
            document.title = `${leaderData.name} (${leaderData.party} • ${leaderData.constituency}) - JanMat Gazette`;
          }
          
          let filtered = postsData.filter(p => p.isOpenQuestion === true || p.targetLeaderId === leaderId || p.targetLeaderId === leaderData?.id);
          if (statusFilter === 'Answered') filtered = filtered.filter(p => p.responseStatus === 'answered');
          if (statusFilter === 'Unanswered') filtered = filtered.filter(p => p.responseStatus === 'pending');
          
          setQuestions(filtered);
          setLoading(false);
        }
      }).catch(() => {
        if (isMounted) setLoading(false);
      });
    };

    fetchLeaderData(true);

    // Auto-refresh open questions every 1 minute (60,000 ms) from Cloud Firestore DB
    const intervalId = setInterval(() => {
      fetchLeaderData(false);
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [leaderId, sortOption, categoryFilter, statusFilter]);

  return (
    <div className="container page-main-container" style={{ padding: '32px 24px', maxWidth: '1000px' }}>
      
      {/* SEO Friendly Back Navigation Bar */}
      <button onClick={onBack} className="btn-ghost" style={{ marginBottom: '16px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
        ← BACK TO ELECTED REPRESENTATIVES DIRECTORY
      </button>

      {/* Leader Profile Header */}
      {leader && (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-card)', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '8px', backgroundColor: 'var(--bg-navbar)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 700 }}>
                {leader.name?.charAt(0)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {leader.name}
                  </h1>
                  <span className="badge badge-featured">{leader.party}</span>
                  <span className="badge badge-verified">{leader.type}</span>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  📍 {leader.constituency}, {leader.state} ({leader.chamber || 'Vidhan Sabha'})
                </div>

                {leader.portfolio && (
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                    💼 {leader.portfolio}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LEADER STATISTICS SUMMARY BOX */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '20px', backgroundColor: '#FDF6ED', border: '1px solid #F5E5D3', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--accent-primary)' }}>OPEN QUESTIONS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{leader.openQuestionsCount || 24}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--color-success)' }}>ANSWERED</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{leader.answeredCount || 6}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--color-warning)' }}>PENDING</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{leader.pendingCount || 18}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL REACTIONS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(leader.totalReactionsCount || 4382).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>TOTAL COMMENTS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>{(leader.totalCommentsCount || 1245).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Post Composer for Asking Questions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
          ❓ Ask an Open Question to {leader?.name}
        </h3>
        <PostComposer onPostCreated={(p) => setQuestions([p, ...questions])} />
      </div>

      {/* OPEN QUESTIONS FILTER & SORTING BAR */}
      <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-card)', padding: '16px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 700 }}>
            ❓ Citizen Open Questions ({questions.length})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Filter */}
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ fontSize: '12.5px' }}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ fontSize: '12.5px' }}>
            <option value="All">All Status</option>
            <option value="Unanswered">Unanswered (Pending)</option>
            <option value="Answered">Answered</option>
          </select>

          {/* Sort Option */}
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} style={{ fontSize: '12.5px', fontWeight: 600 }}>
            <option value="supported">Most Supported 👍</option>
            <option value="discussed">Most Discussed 💬</option>
            <option value="recent">Most Recent 🕒</option>
            <option value="oldest">Oldest</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      </div>

      {/* Open Questions Posts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '36px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          LOADING OPEN QUESTIONS FOR THIS REPRESENTATIVE...
        </div>
      ) : questions.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-main)', borderRadius: '8px', padding: '32px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          No open questions posted under this filter. Ask the first question above!
        </div>
      ) : (
        questions.map(q => (
          <PostCard key={q.id} post={{ ...q, isOpenQuestion: true, targetLeaderName: leader?.name }} onDelete={(id) => setQuestions(questions.filter(item => item.id !== id))} />
        ))
      )}
    </div>
  );
}
