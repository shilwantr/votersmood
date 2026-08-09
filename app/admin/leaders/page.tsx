'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { STATES, PARTIES, LEADER_TYPES } from '@/data/states';
import styles from './page.module.css';

export default function AdminLeaders() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    type: '',
    state: '',
    constituency: '',
    photoUrl: ''
  });

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'leaders'));
      setLeaders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create search tokens for simple search
      const nameTokens = formData.name.toLowerCase().split(' ');
      const leaderData = {
        ...formData,
        searchTokens: nameTokens,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'leaders', editingId), leaderData);
      } else {
        await addDoc(collection(db, 'leaders'), {
          ...leaderData,
          createdAt: new Date().toISOString(),
          reactions: { agree: 0, funny: 0 }
        });
      }
      
      setFormData({ name: '', party: '', type: '', state: '', constituency: '', photoUrl: '' });
      setEditingId(null);
      fetchLeaders();
    } catch (error) {
      console.error(error);
      alert('Error saving leader');
    }
  };

  const handleEdit = (leader: any) => {
    setEditingId(leader.id);
    setFormData({
      name: leader.name || '',
      party: leader.party || '',
      type: leader.type || '',
      state: leader.state || '',
      constituency: leader.constituency || '',
      photoUrl: leader.photoUrl || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this leader?')) {
      try {
        await deleteDoc(doc(db, 'leaders', id));
        fetchLeaders();
      } catch (error) {
        console.error(error);
        alert('Error deleting leader');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Manage Leaders</h1>

      <div className={styles.formContainer}>
        <h2>{editingId ? 'Edit Leader' : 'Add New Leader'}</h2>
        <form onSubmit={handleSave} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Party</label>
              <select required value={formData.party} onChange={e => setFormData({...formData, party: e.target.value})} className={styles.input}>
                <option value="">Select Party</option>
                {Object.entries(PARTIES).map(([code, info]) => <option key={code} value={code}>{code} - {info.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Type</label>
              <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={styles.input}>
                <option value="">Select Type</option>
                {Object.entries(LEADER_TYPES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>State</label>
              <select required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className={styles.input}>
                <option value="">Select State</option>
                {STATES?.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Constituency</label>
              <input required type="text" value={formData.constituency} onChange={e => setFormData({...formData, constituency: e.target.value})} className={styles.input} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Photo URL (Optional)</label>
            <input type="url" value={formData.photoUrl} onChange={e => setFormData({...formData, photoUrl: e.target.value})} className={styles.input} />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>{editingId ? 'Update' : 'Save'} Leader</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({name:'',party:'',type:'',state:'',constituency:'',photoUrl:''}); }} className={styles.cancelBtn}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className={styles.tableContainer}>
        {loading ? <p>Loading...</p> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Party</th>
                <th>Type</th>
                <th>State</th>
                <th>Constituency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map(leader => (
                <tr key={leader.id}>
                  <td>{leader.name}</td>
                  <td>{leader.party}</td>
                  <td>{leader.type}</td>
                  <td>{leader.state}</td>
                  <td>{leader.constituency}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(leader)} className={styles.editBtn}>Edit</button>
                    <button onClick={() => handleDelete(leader.id)} className={styles.deleteBtn}>Delete</button>
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
