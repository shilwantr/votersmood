import React, { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ options = [], value, onChange, placeholder = 'Search & select...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => {
    const text = typeof opt === 'string' ? opt : (opt.label || opt.name || opt.code);
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const selectedText = options.find(opt => {
    const val = typeof opt === 'string' ? opt : (opt.value || opt.code);
    return val === value;
  });

  const getLabel = (opt) => typeof opt === 'string' ? opt : (opt.label || opt.name || opt.code);
  const getValue = (opt) => typeof opt === 'string' ? opt : (opt.value || opt.code);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-main)',
          borderRadius: 'var(--radius-input)',
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: value ? 'var(--text-primary)' : 'var(--text-muted)'
        }}
      >
        <span>{selectedText ? getLabel(selectedText) : placeholder}</span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
      </div>

      {isOpen && (
        <div 
          style={{
            position: 'absolute',
            top: '105%',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-main)',
            borderRadius: 'var(--radius-input)',
            boxShadow: 'var(--shadow-dropdown)',
            zIndex: 500,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '6px'
          }}
        >
          <input
            type="text"
            placeholder="Type to filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', marginBottom: '6px', fontSize: '13px', padding: '6px 10px' }}
          />

          {filteredOptions.length === 0 ? (
            <div style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
              No matches found
            </div>
          ) : (
            filteredOptions.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(getValue(opt));
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{
                  padding: '8px 10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: value === getValue(opt) ? 'var(--bg-secondary)' : 'transparent',
                  fontWeight: value === getValue(opt) ? 700 : 400
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = value === getValue(opt) ? 'var(--bg-secondary)' : 'transparent'}
              >
                {getLabel(opt)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
