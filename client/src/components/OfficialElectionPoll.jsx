import React, { useState, useEffect, useRef } from 'react';
import SearchableSelect from './SearchableSelect';
import SharePollModal from './SharePollModal';
import { STATES } from '../../../server/data/states';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';

export default function OfficialElectionPoll({ election, openRegisterModal }) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // 5-Step Guided Voting Flow States:
  const [step, setStep] = useState(1);
  const [isResident, setIsResident] = useState(true);
  const [selectedState, setSelectedState] = useState(election?.state || 'MH');
  const [selectedConstituency, setSelectedConstituency] = useState(election?.constituencies?.[0] || 'Mumbai South');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteErrorMsg, setVoteErrorMsg] = useState('');
  const [justVoted, setJustVoted] = useState(false);
  const [hasVotedBefore, setHasVotedBefore] = useState(false);
  const [activePoll, setActivePoll] = useState(election);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const cardRef = useRef(null);

  // Deep Link Auto-Scroll & Highlighting Handler for Election Polls
  useEffect(() => {
    if (!activePoll?.id) return;

    const urlParams = new URLSearchParams(window.location.search);
    const targetPollId = urlParams.get('poll');
    const hashId = window.location.hash.replace('#poll-', '');

    if (targetPollId === activePoll.id || hashId === activePoll.id) {
      setIsHighlighted(true);
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);

      // Remove highlight after 4 seconds
      const timer = setTimeout(() => setIsHighlighted(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [activePoll?.id]);

  // Check if user has already voted in this election in Cloud Firestore DB or localStorage
  useEffect(() => {
    if (election) {
      setActivePoll(election);

      // Check local cache receipt
      const localReceipt = localStorage.getItem(`janmat_vote_${election.id}`);
      if (localReceipt) {
        try {
          const parsed = JSON.parse(localReceipt);
          setSelectedCandidateId(parsed.candidateId);
          setIsResident(parsed.isResident !== false);
          setHasVotedBefore(true);
          setStep(6); // Default to Results View
        } catch (e) {}
      }

      // Check Cloud Firestore DB user votes
      if (user) {
        api.getUserVotes().then(res => {
          if (res && res.userVotes && res.userVotes[election.id]) {
            const vote = res.userVotes[election.id];
            setSelectedCandidateId(vote.candidateId);
            setIsResident(vote.isResident !== false);
            setHasVotedBefore(true);
            setStep(6); // Automatically open Results View
            localStorage.setItem(`janmat_vote_${election.id}`, JSON.stringify(vote));
          }
        }).catch(() => {});
      }
    }
  }, [election, user]);

  const refreshLiveResults = async () => {
    if (!activePoll?.id) return;
    try {
      const data = await api.getOfficialElections();
      const updated = data.find(e => e.id === activePoll.id);
      if (updated) {
        setActivePoll(updated);
      }
    } catch (e) {
      console.warn('Live DB refresh warning:', e);
    }
  };

  const availableStates = (election?.states || ['MH']).map(code => {
    const found = STATES.find(s => s.code === code);
    return { value: code, label: found ? found.name.toUpperCase() : code };
  });

  const availableConstituencies = (election?.constituencies || ['Mumbai South']).map(c => ({
    value: c,
    label: c
  }));

  const selectedCandidateObj = activePoll?.candidates?.find(c => c.id === selectedCandidateId);

  const handleStep1Eligible = (eligible) => {
    if (!user) {
      if (openRegisterModal) openRegisterModal();
      return;
    }

    setIsResident(eligible);
    if (!eligible) {
      setStep(4);
    } else {
      setStep(2);
    }
  };

  const handleStep2State = (stateCode) => {
    setSelectedState(stateCode);
    if (activePoll?.category === 'state' || activePoll?.category === 'byelection') {
      setStep(3);
    } else {
      setStep(4);
    }
  };

  const handleStep3Constituency = (constituencyName) => {
    setSelectedConstituency(constituencyName);
    setStep(4);
  };

  const handleStep4Candidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
    setStep(5);
  };

  const handleConfirmVoteSubmit = async () => {
    if (!user || !selectedCandidateId || isSubmitting) return;

    setIsSubmitting(true);
    setVoteErrorMsg('');
    try {
      const response = await api.voteOfficialElection({
        electionId: activePoll?.id || 'election-mh-2026',
        candidateId: selectedCandidateId,
        isResident,
        state: selectedState,
        constituency: selectedConstituency
      });

      if (response && response.election) {
        setActivePoll(response.election);
      }

      const voteRecord = { candidateId: selectedCandidateId, isResident, electionId: activePoll.id };
      localStorage.setItem(`janmat_vote_${activePoll.id}`, JSON.stringify(voteRecord));

      setJustVoted(true);
      setHasVotedBefore(true);
      showSuccess("🎉 Official Vote Confirmed & Persisted in Cloud Firestore DB!");
      
      // Immediately refetch live updated counts from Cloud Firestore DB
      await refreshLiveResults();
      setStep(6); // Move to segregated results
    } catch (err) {
      const serverErr = err.response?.data?.error;
      if (serverErr) {
        setVoteErrorMsg(serverErr);
        showError(`⚠️ ${serverErr}`);
      } else {
        setVoteErrorMsg('Vote submission error. Displaying latest DB results.');
      }
      await refreshLiveResults();
      setStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate vote metrics
  const residentTotal = Object.values(activePoll?.residentVotes || {}).reduce((a, b) => a + b, 0);
  const observerTotal = Object.values(activePoll?.observerVotes || {}).reduce((a, b) => a + b, 0);

  return (
    <>
      <div 
        id={`poll-${activePoll.id}`}
        ref={cardRef}
        className={`gazette-card ${justVoted ? 'animate-vote-success' : ''}`}
        style={{ 
          backgroundColor: '#FFFFFF', 
          border: isHighlighted ? '2px solid var(--accent-primary)' : hasVotedBefore ? '2px solid #059669' : '2px solid var(--border-main)', 
          borderRadius: 'var(--radius-card)', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: isHighlighted ? '0 0 20px rgba(217, 119, 6, 0.35)' : '0 4px 20px rgba(0,0,0,0.06)',
          position: 'relative',
          transition: 'all 300ms ease'
        }}
      >
        {/* TOP ROW ALIGNED WITH OTHER THINGS ON RIGHT HAND SIDE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-featured" style={{ fontSize: '11px', padding: '4px 8px' }}>
              🏛 OFFICIAL ELECTION POLL (ADMIN CONTROLLED)
            </span>
            {hasVotedBefore ? (
              <span className="badge badge-published animate-bounce-in" style={{ fontSize: '11px', padding: '4px 8px', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                ✓ YOUR VOTE CONFIRMED IN DB
              </span>
            ) : (
              <span className="badge badge-live" style={{ fontSize: '11px', padding: '4px 8px' }}>
                STATUS: {activePoll?.status?.toUpperCase() || 'PUBLISHED'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              CATEGORY: {activePoll?.category?.toUpperCase() || 'NATIONAL'} ELECTION
            </span>

            {/* Broadcast Loudspeaker Share Poll Button in Top Row Right Hand Side */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="btn-ghost"
              title="Share Polls"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#0284C7',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              <span style={{ fontSize: '13px' }}>📢</span> Share Polls
            </button>
          </div>
        </div>

        {/* Official Election Title */}
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.25 }}>
          {activePoll?.title}
        </h1>

        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '15px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          {activePoll?.description}
        </p>

        {/* VOTING SUCCESS ANIMATED CONFIRMATION BANNER */}
        {justVoted && (
          <div className="animate-bounce-in" style={{ backgroundColor: '#ECFDF5', border: '2px solid #059669', color: '#065F46', padding: '14px 18px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#059669', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, flexShrink: 0 }}>
              ✓
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                VOTE CONFIRMED & PERSISTED TO CLOUD FIRESTORE DB!
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', marginTop: '2px' }}>
                Your vote for <strong>{selectedCandidateObj?.name || 'Selected Candidate'} ({selectedCandidateObj?.party || ''})</strong> has been securely logged.
              </div>
            </div>
          </div>
        )}

        {voteErrorMsg && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', lineHeight: 1.4 }}>
            ⚠️ {voteErrorMsg}
          </div>
        )}

        {/* 5-STEP GUIDED INTERACTIVE VOTING FLOW */}
        {step === 1 && !hasVotedBefore && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-input)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              STEP 1 OF 5: ARE YOU AN ELIGIBLE REGISTERED VOTER IN THIS ELECTION?
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleStep1Eligible(true)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                ✓ YES, I AM AN ELIGIBLE LOCAL VOTER
              </button>
              <button onClick={() => handleStep1Eligible(false)} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                🌐 NO (VOTE AS OBSERVER)
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-input)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              STEP 2 OF 5: WHICH STATE ARE YOU REGISTERED TO VOTE IN?
            </div>
            <SearchableSelect
              options={availableStates}
              value={selectedState}
              onChange={(st) => handleStep2State(st)}
              placeholder="Search & select your registered state..."
            />
            <button onClick={() => setStep(1)} className="btn-ghost" style={{ fontSize: '12px', alignSelf: 'flex-start' }}>
              ← Back to Step 1
            </button>
          </div>
        )}

        {step === 3 && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-input)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              STEP 3 OF 5: WHICH CONSTITUENCY ARE YOU REGISTERED IN?
            </div>
            <SearchableSelect
              options={availableConstituencies}
              value={selectedConstituency}
              onChange={(consti) => handleStep3Constituency(consti)}
              placeholder="Search & select your constituency..."
            />
            <button onClick={() => setStep(2)} className="btn-ghost" style={{ fontSize: '12px', alignSelf: 'flex-start' }}>
              ← Back to Step 2
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-divider)', borderRadius: 'var(--radius-input)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
              STEP 4 OF 5: SELECT YOUR PREFERRED CANDIDATE / PARTY
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {activePoll?.candidates?.map(cand => (
                <div
                  key={cand.id}
                  onClick={() => handleStep4Candidate(cand.id)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: selectedCandidateId === cand.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-main)',
                    borderRadius: 'var(--radius-input)',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: cand.color || '#D97706' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 700 }}>{cand.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>{cand.party}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(isResident ? 3 : 1)} className="btn-ghost" style={{ fontSize: '12px', alignSelf: 'flex-start' }}>
              ← Back
            </button>
          </div>
        )}

        {step === 5 && (
          <div style={{ backgroundColor: '#FDF6ED', border: '2px solid var(--accent-primary)', borderRadius: 'var(--radius-input)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
              STEP 5 OF 5: CONFIRM YOUR OFFICIAL VOTE SUBMISSION
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-primary)' }}>
              <div>VOTER TYPE: <strong>{isResident ? 'LOCAL REGISTERED RESIDENT' : 'OUTSIDE OBSERVER'}</strong></div>
              <div>STATE: <strong>{selectedState}</strong></div>
              <div>CONSTITUENCY: <strong>{selectedConstituency}</strong></div>
              <div>SELECTED CANDIDATE: <strong style={{ color: 'var(--accent-primary)' }}>{selectedCandidateObj?.name} ({selectedCandidateObj?.party})</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button onClick={handleConfirmVoteSubmit} disabled={isSubmitting} className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                🔒 {isSubmitting ? 'CONFIRMING VOTE & SYNCING DB...' : 'CONFIRM & SUBMIT OFFICIAL VOTE'}
              </button>
              <button onClick={() => setStep(4)} className="btn-secondary" style={{ padding: '12px 18px', fontSize: '13px' }}>
                Change Selection
              </button>
            </div>
          </div>
        )}

        {/* STEP 6 & DEFAULT RESULTS VIEW: STRICTLY SEGREGATED VOTE RESULTS */}
        {(step === 6 || activePoll?.totalVotes > 0 || hasVotedBefore) && (
          <div style={{ marginTop: '20px', borderTop: '2px solid var(--border-main)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                OFFICIAL ELECTION RESULTS (TOTAL VOTES: {activePoll?.totalVotes || residentTotal + observerTotal})
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={refreshLiveResults} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px' }}>
                  🔄 REFRESH LIVE DB
                </button>
                {!hasVotedBefore && (
                  <button onClick={() => { setStep(1); setVoteErrorMsg(''); setJustVoted(false); }} className="btn-ghost" style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 700 }}>
                    Vote Again / Change Mode
                  </button>
                )}
              </div>
            </div>

            {/* TWO SEPARATE RESULTS COLUMNS: RESIDENT VOTES vs OBSERVER VOTES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              
              {/* COLUMN A: RESIDENT VOTES */}
              <div style={{ backgroundColor: '#F9F8F6', border: '1px solid var(--border-divider)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '12px', borderBottom: '1px solid var(--border-divider)', paddingBottom: '6px' }}>
                  🏠 LOCAL RESIDENT VOTES ({residentTotal})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activePoll?.candidates?.map(cand => {
                    const votes = activePoll?.residentVotes?.[cand.id] || 0;
                    const pct = residentTotal > 0 ? Math.round((votes / residentTotal) * 100) : 0;
                    const isYourCandidate = selectedCandidateId === cand.id;

                    return (
                      <div key={cand.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: isYourCandidate ? 700 : 600 }}>
                          <span style={{ color: isYourCandidate ? '#059669' : 'var(--text-primary)' }}>
                            {isYourCandidate && '✓ '}
                            {cand.name} ({cand.party})
                            {isYourCandidate && ' (YOUR VOTE)'}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{pct}% ({votes})</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#E5E2DC', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: isYourCandidate ? '#059669' : (cand.color || 'var(--accent-primary)'), transition: 'width 400ms ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUMN B: OBSERVER VOTES */}
              <div style={{ backgroundColor: '#F9F8F6', border: '1px solid var(--border-divider)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', borderBottom: '1px solid var(--border-divider)', paddingBottom: '6px' }}>
                  🌐 OUTSIDE OBSERVER VOTES ({observerTotal})
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activePoll?.candidates?.map(cand => {
                    const votes = activePoll?.observerVotes?.[cand.id] || 0;
                    const pct = observerTotal > 0 ? Math.round((votes / observerTotal) * 100) : 0;

                    return (
                      <div key={cand.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 600 }}>
                          <span>{cand.name} ({cand.party})</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{pct}% ({votes})</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: '#E5E2DC', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#A8A29E', transition: 'width 400ms ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Share Election Poll Modal */}
      <SharePollModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        poll={activePoll}
      />
    </>
  );
}
