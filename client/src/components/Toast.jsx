import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  const showSuccess = (msg) => addToast(msg, 'success');
  const showError = (msg) => addToast(msg, 'error');
  const showInfo = (msg) => addToast(msg, 'info');

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo }}>
      {children}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              backgroundColor: t.type === 'success' ? '#161616' : t.type === 'error' ? '#C62828' : '#161616',
              color: '#FFFFFF',
              borderLeft: `4px solid ${t.type === 'success' ? '#2E7D32' : t.type === 'error' ? '#FF5252' : '#D97706'}`,
              borderRadius: '6px',
              padding: '10px 16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 200ms ease'
            }}
          >
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '⚠️' : 'ℹ'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      showSuccess: () => {},
      showError: () => {},
      showInfo: () => {}
    };
  }
  return context;
}
