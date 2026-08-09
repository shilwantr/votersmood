'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './page.module.css';

export default function AdminConfig() {
  const [config, setConfig] = useState<any>({
    imagePostingEnabled: true,
    commentModerationEnabled: false,
    pollCreationEnabled: true,
    electionStates: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'appConfig', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig(docSnap.data());
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'appConfig', 'main'), config);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Error saving configuration');
    }
    setSaving(false);
  };

  const toggleToggle = (key: string) => {
    setConfig({ ...config, [key]: !config[key] });
  };

  const handleElectionStatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const statesStr = e.target.value;
    const statesArr = statesStr.split(',').map(s => s.trim()).filter(Boolean);
    setConfig({ ...config, electionStates: statesArr });
  };

  if (loading) return <div className={styles.container}>Loading config...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>App Configuration</h1>
      <p className={styles.desc}>Changes made here take effect immediately across the app without requiring a restart.</p>
      
      <div className={styles.card}>
        <div className={styles.toggleRow}>
          <div>
            <h3>Image Posting Enabled</h3>
            <p>Allow users to upload and attach images to their posts.</p>
          </div>
          <button 
            className={config.imagePostingEnabled ? styles.toggleOn : styles.toggleOff} 
            onClick={() => toggleToggle('imagePostingEnabled')}
          >
            {config.imagePostingEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <h3>Comment Moderation</h3>
            <p>Require manual approval for all comments before they are visible.</p>
          </div>
          <button 
            className={config.commentModerationEnabled ? styles.toggleOn : styles.toggleOff} 
            onClick={() => toggleToggle('commentModerationEnabled')}
          >
            {config.commentModerationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className={styles.toggleRow}>
          <div>
            <h3>User Poll Creation</h3>
            <p>Allow verified users to create their own polls.</p>
          </div>
          <button 
            className={config.pollCreationEnabled ? styles.toggleOn : styles.toggleOff} 
            onClick={() => toggleToggle('pollCreationEnabled')}
          >
            {config.pollCreationEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className={styles.inputRow}>
          <h3>Active Election States</h3>
          <p>Comma-separated list of states currently holding elections (e.g. Maharashtra, Haryana)</p>
          <input 
            type="text" 
            value={config.electionStates?.join(', ') || ''} 
            onChange={handleElectionStatesChange}
            className={styles.input}
            placeholder="State 1, State 2"
          />
        </div>
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Configuration'}
      </button>
    </div>
  );
}
