'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { STATES, PARTIES, LEADER_TYPES } from '@/data/states';
import styles from './page.module.css';

export default function LeadersDirectory() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, [selectedState, selectedParty, selectedType]);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'leaders');
      let constraints: any[] = [];
      if (selectedState) constraints.push(where('state', '==', selectedState));
      if (selectedParty) constraints.push(where('party', '==', selectedParty));
      if (selectedType) constraints.push(where('type', '==', selectedType));
      
      const qRef = query(q, ...constraints, limit(100));
      const snapshot = await getDocs(qRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeaders(data);
    } catch (error) {
      console.error('Error fetching leaders from DB:', error);
    }
    setLoading(false);
  };

  const filteredLeaders = leaders.filter(l => {
    const matchesSearch = !search || (l.name && l.name.toLowerCase().includes(search.toLowerCase())) || (l.constituency && l.constituency.toLowerCase().includes(search.toLowerCase()));
    const matchesState = !selectedState || l.state === selectedState;
    const matchesParty = !selectedParty || l.party === selectedParty;
    const matchesType = !selectedType || l.type === selectedType;
    return matchesSearch && matchesState && matchesParty && matchesType;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🗂️ Political Representatives Directory</h1>
        <p className={styles.subtitle}>VERIFIED MLAS, MLCS, AND LOK SABHA / RAJYA SABHA MEMBERS FROM DB</p>
      </div>
      
      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Search leader by name or constituency..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className={styles.select}>
          <option value="">All States / UTs</option>
          {STATES?.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        <select value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)} className={styles.select}>
          <option value="">All Parties</option>
          {Object.entries(PARTIES).map(([code, p]) => <option key={code} value={code}>{code} - {p.name}</option>)}
        </select>
        <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={styles.select}>
          <option value="">All Types (MLA / MP)</option>
          {Object.entries(LEADER_TYPES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>LOADING REPRESENTATIVES DIRECTORY FROM DB...</div>
      ) : filteredLeaders.length === 0 ? (
        <div className={styles.loading}>No elected representatives match your search criteria.</div>
      ) : (
        <div className={styles.grid}>
          {filteredLeaders.map(leader => (
            <Link href={`/leaders/${leader.id}`} key={leader.id} className={styles.cardLink}>
              <div className={styles.card}>
                <div className={styles.photoContainer}>
                  {leader.profilePhoto || leader.photoUrl ? (
                    <img src={leader.profilePhoto || leader.photoUrl} alt={leader.name} className={styles.photo} />
                  ) : (
                    <div className={styles.placeholderPhoto}>
                      {leader.name ? leader.name.split(' ').map((n: string) => n[0]).join('') : 'L'}
                    </div>
                  )}
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{leader.name}</h3>
                  <div className={styles.badges}>
                    <span className={styles.partyBadge}>{leader.party}</span>
                    <span className={styles.typeBadge}>{leader.type || leader.repType}</span>
                  </div>
                  <p className={styles.location}>📍 {leader.constituency}, {leader.state}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
