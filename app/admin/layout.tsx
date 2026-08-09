'use client';
import { useAuth } from '@/providers/AuthProvider';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!user || !isAdmin) return <div className={styles.denied}>ACCESS DENIED</div>;

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>ADMIN PANEL</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin" className={pathname === '/admin' ? styles.active : ''}>Dashboard</Link>
          <Link href="/admin/leaders" className={pathname.includes('/admin/leaders') ? styles.active : ''}>Leaders</Link>
          <Link href="/admin/topics" className={pathname.includes('/admin/topics') ? styles.active : ''}>Topics</Link>
          <Link href="/admin/posts" className={pathname.includes('/admin/posts') ? styles.active : ''}>Posts Moderation</Link>
          <Link href="/admin/config" className={pathname.includes('/admin/config') ? styles.active : ''}>App Config</Link>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
