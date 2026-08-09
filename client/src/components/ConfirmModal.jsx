import React from 'react';

export default function ConfirmModal({ isOpen, title = 'Confirm Action', message = 'Are you sure you want to proceed?', confirmText = 'Confirm', onConfirm, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '16px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-main)', borderRadius: 'var(--radius-modal)', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: 'var(--shadow-modal)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
          {title}
        </h3>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 20px 0', lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn-secondary" style={{ fontSize: '12px', padding: '6px 14px' }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger" style={{ fontSize: '12px', padding: '6px 14px' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
