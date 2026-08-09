import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import OfficialElectionPoll from '../components/OfficialElectionPoll';
import CommunityPollsSection from '../components/CommunityPollsSection';
import EngagementSidebar from '../components/EngagementSidebar';
import RegisterModal from '../components/RegisterModal';
import { PollSkeleton } from '../components/Skeleton';

export default function Polls() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [officialElections, setOfficialElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let catParam = 'all';
    if (categoryFilter === 'National Elections') catParam = 'national';
    if (categoryFilter === 'State Elections') catParam = 'state';
    if (categoryFilter === 'By-Elections') catParam = 'byelection';

    api.getOfficialElections({ category: catParam }).then(data => {
      if (isMounted) {
        setOfficialElections(data);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, [categoryFilter]);

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      
      {/* Category Filter Navigation Bar */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-card)', padding: '16px 20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
            🏛 OFFICIAL GAZETTE ELECTION POLLING CENTER
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            Constituency Elections & Citizen Surveys
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-main)', padding: '4px', borderRadius: 'var(--radius-button)', flexWrap: 'wrap' }}>
          {[
            { label: 'All', val: 'All' },
            { label: 'National Elections', val: 'National Elections' },
            { label: 'State Elections', val: 'State Elections' },
            { label: 'By-Elections', val: 'By-Elections' }
          ].map(tab => (
            <button
              key={tab.val}
              onClick={() => setCategoryFilter(tab.val)}
              className={categoryFilter === tab.val ? 'btn-primary' : 'btn-ghost'}
              style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', padding: '6px 14px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="two-column-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        
        {/* Left Column */}
        <div>
          {loading ? (
            <div>
              <PollSkeleton />
              <PollSkeleton />
            </div>
          ) : (
            <div>
              {officialElections.map(election => (
                <OfficialElectionPoll 
                  key={election.id} 
                  election={election} 
                  openRegisterModal={() => setIsRegisterOpen(true)} 
                />
              ))}

              <CommunityPollsSection openRegisterModal={() => setIsRegisterOpen(true)} />
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div>
          <EngagementSidebar />
        </div>

      </div>

      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </div>
  );
}
