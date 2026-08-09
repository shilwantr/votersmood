import React from 'react';

export function OfficialSeal({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M12 2L14.8 4.2L18.3 3.8L19.2 7.2L22.4 8.7L21.3 12L22.4 15.3L19.2 16.8L18.3 20.2L14.8 19.8L12 22L9.2 19.8L5.7 20.2L4.8 16.8L1.6 15.3L2.7 12L1.6 8.7L4.8 7.2L5.7 3.8L9.2 4.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function EditorialFeed({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M21 15C21 16.1046 20.1046 17 19 17H7L3 21V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 8H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function BallotBox({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect x="3" y="10" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 10V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V10" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 15.5L11 17.5L15 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AssemblyPillar({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M3 21H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 3H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 3V21" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M19 3V21" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 3V21" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14.5 3V21" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

export function SignalPulse({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 7H21V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function CitizenInquiry({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.15 13.7 11.1 12.6 11.4L12 11.6V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="17" r="0.75" fill="currentColor"/>
    </svg>
  );
}

export function VerifiedCheck({ size = 20, className = '', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
