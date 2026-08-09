import React from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'default' | 'verified' | 'election' | 'leader' | 'trending';
type PartyId = 'BJP' | 'INC' | 'AAP' | 'TMC' | 'SP' | 'BSP' | 'OTHER';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  party?: PartyId;
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  party,
  className = ''
}: BadgeProps) {
  const classes = [
    styles.badge,
    styles[variant],
    party ? styles[`party-${party.toLowerCase()}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {variant === 'verified' && <span className={styles.icon}>✓</span>}
      {variant === 'trending' && <span className={styles.icon}>🔥</span>}
      {children}
    </span>
  );
}
