'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import styles from './page.module.css';

export default function AdminTopics() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    relatedState: '',
    isTrending: false,
    trendScore: 0
  });

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'topics'));
      setTopics(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'topics', editingId), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'topics'), {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      
      setFormData({ title: '', description: '', category: 'general', relatedState: '', isTrending: false, trendScore: 0 });
      setEditingId(null);
      fetchTopics();
    } catch (error) {
      console.error(error);
      alert('Error saving topic');
    }
  };

  const handleEdit = (topic: any) => {
    setEditingId(topic.id);
    setFormData({
      title: topic.title || '',
      description: topic.description || '',
      category: topic.category || 'general',
      relatedState: topic.relatedState || '',
      isTrending: topic.isTrending || false,
      trendScore: topic.trendScore || 0
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await deleteDoc(doc(db, 'topics', id));
        fetchTopics();
      } catch (error) {
        console.error(error);
        alert('Error deleting topic');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Topics</h1>

      <div className={styles.formContainer}>
        <h2>{editingId ? 'Edit Topic' : 'Add New Topic'}</h2>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={styles.input} rows={3} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Category</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={styles.input}>
                <option value="general">General</option>
                <option value="election">Election</option>
                <option value="policy">Policy</option>
                <option value="scandal">Scandal</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Trend Score (Higher = more trending)</label>
              <input type="number" value={formData.trendScore} onChange={e => setFormData({...formData, trendScore: Number(e.target.value)})} className={styles.input} />
            </div>
          </div>
          <div className={styles.checkboxGroup}>
            <label>
              <input type="checkbox" checked={formData.isTrending} onChange={e => setFormData({...formData, isTrending: e.target.checked})} />
              Mark as Trending Topic
            </label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>{editingId ? 'Update' : 'Save'} Topic</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({title:'',description:'',category:'general',relatedState:'',isTrending:false,trendScore:0}); }} className={styles.cancelBtn}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.tableContainer}>
        {loading ? <p>Loading...</p> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Trending</th>
                <th>Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={topic.id}>
                  <td>{topic.title}</td>
                  <td>{topic.category}</td>
                  <td>{topic.isTrending ? 'Yes' : 'No'}</td>
                  <td>{topic.trendScore || 0}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(topic)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(topic.id)} className={styles.deleteBtn}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
