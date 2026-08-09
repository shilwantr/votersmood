import React from 'react';

export function CardSkeleton() {
  return (
    <div className="gazette-card" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div className="skeleton-box" style={{ width: '38px', height: '38px', borderRadius: '6px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div className="skeleton-box" style={{ width: '40%', height: '14px' }} />
          <div className="skeleton-box" style={{ width: '25%', height: '10px' }} />
        </div>
      </div>
      <div className="skeleton-box" style={{ width: '100%', height: '16px' }} />
      <div className="skeleton-box" style={{ width: '80%', height: '16px' }} />
      <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
        <div className="skeleton-box" style={{ width: '80px', height: '28px' }} />
        <div className="skeleton-box" style={{ width: '80px', height: '28px' }} />
      </div>
    </div>
  );
}

export function LeaderSkeleton() {
  return (
    <div className="gazette-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton-box" style={{ width: '60px', height: '20px' }} />
        <div className="skeleton-box" style={{ width: '50px', height: '20px' }} />
      </div>
      <div className="skeleton-box" style={{ width: '70%', height: '22px' }} />
      <div className="skeleton-box" style={{ width: '50%', height: '14px' }} />
      <div className="skeleton-box" style={{ width: '90%', height: '14px' }} />
      <div className="skeleton-box" style={{ width: '100%', height: '32px', marginTop: '8px' }} />
    </div>
  );
}

export function PollSkeleton() {
  return (
    <div className="gazette-card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="skeleton-box" style={{ width: '30%', height: '20px' }} />
      <div className="skeleton-box" style={{ width: '85%', height: '28px' }} />
      <div className="skeleton-box" style={{ width: '100%', height: '40px' }} />
      <div className="skeleton-box" style={{ width: '100%', height: '40px' }} />
    </div>
  );
}
