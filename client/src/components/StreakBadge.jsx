import React, { useState } from 'react';

export default function StreakBadge({ isVerified = false, size = '16px', fontSize = '10px' }) {
  const [isHovered, setIsHovered] = useState(false);

  const catchyTooltipText = isVerified
    ? "🔥 7-DAY STREAK UNLOCKED! Verified Public Intelligence Contributor ✓"
    : "⚡ GO 7 DAYS IN A ROW & GET VERIFIED! Post or react daily to claim your Official Verified Badge ✓";

  return (
    <div 
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span 
        title={catchyTooltipText} 
        style={{ 
          color: '#0284C7', 
          backgroundColor: '#E0F2FE', 
          borderRadius: '50%', 
          width: size, 
          height: size, 
          display: 'inline-flex', 
          alignItems: 'center', 
          justify: 'center', 
          fontSize: fontSize, 
          fontWeight: 800, 
          border: '1px solid #BAE6FD',
          flexShrink: 0,
          cursor: 'pointer',
          transform: isHovered ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isHovered ? '0 0 10px rgba(2, 132, 199, 0.4)' : 'none'
        }}
      >
        ✓
      </span>

      {/* Catchy Popover Tooltip on Hover */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            bottom: '130%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid #38BDF8',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '10.5px',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '12px' }}>{isVerified ? '🔥' : '🚀'}</span>
          <span style={{ fontWeight: 600 }}>
            {isVerified 
              ? "7-DAY STREAK UNLOCKED! Verified Citizen ✓" 
              : "GO 7 DAYS IN A ROW & GET VERIFIED! ⚡"}
          </span>
        </div>
      )}
    </div>
  );
}
