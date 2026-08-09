'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
  suggestions?: string[];
}

export default function SearchBar({
  placeholder = 'Search...',
  onSearch,
  debounceMs = 300,
  className = '',
  suggestions = []
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showSuggestions = isFocused && suggestions.length > 0 && query.length > 0;

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <div className={styles.inputWrapper}>
        <span className={styles.icon}>🔍</span>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => setQuery('')}>
            ×
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className={styles.dropdown}>
          {suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase())).map((suggestion, i) => (
            <button
              key={i}
              className={styles.suggestionItem}
              onClick={() => {
                setQuery(suggestion);
                setIsFocused(false);
                onSearch(suggestion);
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
