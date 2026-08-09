'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import styles from './page.module.css';

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, all

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let q = collection(db, 'posts');
      if (filter === 'pending') {
        q = query(collection(db, 'posts'), where('isApproved', '==', false)) as any;
      } else if (filter === 'approved') {
        q = query(collection(db, 'posts'), where('isApproved', '==', true)) as any;
      }
      
      const snap = await getDocs(q);
      // Client-side sort by newest since composite index might be needed otherwise
      const data: any[] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string, isApproved: boolean) => {
    try {
      await updateDoc(doc(db, 'posts', id), { isApproved });
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert('Error updating post');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post permanently?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        fetchPosts();
      } catch (error) {
        console.error(error);
        alert('Error deleting post');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Post Moderation</h1>
      
      <div className={styles.filters}>
        <button className={filter === 'pending' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('pending')}>Pending</button>
        <button className={filter === 'approved' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('approved')}>Approved</button>
        <button className={filter === 'all' ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter('all')}>All</button>
      </div>

      <div className={styles.list}>
        {loading ? <p>Loading posts...</p> : posts.length === 0 ? <p>No posts found.</p> : (
          posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <span className={styles.author}>Author ID: {post.authorId || 'Anonymous'}</span>
                <span className={styles.date}>{new Date(post.createdAt).toLocaleString()}</span>
                <span className={post.isApproved ? styles.badgeApproved : styles.badgePending}>
                  {post.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className={styles.postContent}>{post.content}</div>
              {post.leaderId && <div className={styles.meta}>Related Leader ID: {post.leaderId}</div>}
              {post.topicId && <div className={styles.meta}>Related Topic ID: {post.topicId}</div>}
              
              <div className={styles.actions}>
                {!post.isApproved ? (
                  <button onClick={() => handleApprove(post.id, true)} className={styles.approveBtn}>Approve</button>
                ) : (
                  <button onClick={() => handleApprove(post.id, false)} className={styles.rejectBtn}>Unapprove</button>
                )}
                <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
