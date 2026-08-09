'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import styles from './page.module.css';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    polls: 0,
    pendingMods: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const usersSnap = await getCountFromServer(collection(db, 'users'));
      const postsSnap = await getCountFromServer(collection(db, 'posts'));
      const pollsSnap = await getCountFromServer(collection(db, 'polls'));
      const pendingSnap = await getCountFromServer(query(collection(db, 'posts'), where('isApproved', '==', false)));
      
      setStats({
        users: usersSnap.data().count,
        posts: postsSnap.data().count,
        polls: pollsSnap.data().count,
        pendingMods: pendingSnap.data().count
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard Overview</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <p className={styles.statValue}>{stats.users}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Posts</h3>
          <p className={styles.statValue}>{stats.posts}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Active Polls</h3>
          <p className={styles.statValue}>{stats.polls}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Moderation</h3>
          <p className={`${styles.statValue} ${stats.pendingMods > 0 ? styles.alert : ''}`}>
            {stats.pendingMods}
          </p>
        </div>
      </div>

      <h2 className={styles.subtitle}>Quick Actions</h2>
      <div className={styles.actions}>
        <Link href="/admin/leaders" className={styles.actionBtn}>Manage Leaders</Link>
        <Link href="/admin/topics" className={styles.actionBtn}>Manage Topics</Link>
        <Link href="/admin/posts" className={styles.actionBtn}>Review Posts</Link>
        <Link href="/admin/config" className={styles.actionBtn}>App Config</Link>
      </div>
    </div>
  );
}
