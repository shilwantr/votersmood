import React from 'react';

export default function EmptyState({ 
  icon = '🏛', 
  title = 'No Records Found', 
  description = 'There are no entries available under this selection right now.', 
  actionLabel, 
  onAction 
}) {
  return (
    <div 
      className="gazette-card" 
      style={{ 
        textAlign: 'center', 
        padding: '48px 24px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justify: 'center',
        gap: '12px',
        margin: '16px 0'
      }}
    >
      <div style={{ fontSize: '40px', lineHeight: 1, marginBottom: '4px' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', margin: 0 }}>
        {description}
      </p>

      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary" style={{ marginTop: '12px', fontSize: '12px', padding: '8px 16px' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
