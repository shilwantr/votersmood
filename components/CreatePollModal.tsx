'use client';

import React, { useState } from 'react';
import styles from './CreatePollModal.module.css';
import { useAuth } from '@/providers/AuthProvider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { STATES, ELECTION_TYPES } from '@/data/states';

export default function CreatePollModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, userProfile, isAdmin } = useAuth();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ id: 'opt1', text: '' }, { id: 'opt2', text: '' }]);
  const [type, setType] = useState('regular'); // regular, featured, election
  const [state, setState] = useState('');
  const [constituency, setConstituency] = useState('');
  const [electionType, setElectionType] = useState('');
  const [topicId, setTopicId] = useState('');
  const [leaderId, setLeaderId] = useState('');

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: `opt${Date.now()}`, text: '' }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'polls'), {
        question,
        options,
        type: isAdmin ? type : 'regular',
        state: type === 'election' ? state : null,
        constituency: type === 'election' ? constituency : null,
        electionType: type === 'election' ? electionType : null,
        topicId: topicId || null,
        leaderId: leaderId || null,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        authorRole: userProfile?.role || 'user',
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      console.error("Error creating poll:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Poll">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Question</label>
          <input 
            className={styles.input}
            value={question} 
            onChange={(e) => setQuestion(e.target.value)} 
            required 
            placeholder="Ask a question..."
          />
        </div>

        <div className={styles.field}>
          <label>Options</label>
          <div className={styles.optionsList}>
            {options.map((opt, idx) => (
              <div key={opt.id} className={styles.optionRow}>
                <input 
                  className={styles.input}
                  value={opt.text} 
                  onChange={(e) => handleOptionChange(opt.id, e.target.value)} 
                  required 
                  placeholder={`Option ${idx + 1}`}
                />
                {options.length > 2 && (
                  <button type="button" className={styles.removeBtn} onClick={() => handleRemoveOption(opt.id)}>X</button>
                )}
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button type="button" className={styles.addBtn} onClick={handleAddOption}>+ Add Option</button>
          )}
        </div>

        {isAdmin && (
          <div className={styles.field}>
            <label>Poll Type</label>
            <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="regular">Regular</option>
              <option value="featured">Featured</option>
              <option value="election">Election</option>
            </select>
          </div>
        )}

        {type === 'election' && (
          <>
            <div className={styles.field}>
              <label>Election Type</label>
              <select className={styles.select} value={electionType} onChange={(e) => setElectionType(e.target.value)} required>
                <option value="">Select Election Type</option>
                {Object.entries(ELECTION_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>State</label>
              <select className={styles.select} value={state} onChange={(e) => setState(e.target.value)} required>
                <option value="">Select State</option>
                {STATES?.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Constituency (Optional)</label>
              <input className={styles.input} value={constituency} onChange={(e) => setConstituency(e.target.value)} placeholder="E.g. Varanasi" />
            </div>
          </>
        )}

        <div className={styles.field}>
          <label>Linked Topic (Optional)</label>
          <input className={styles.input} value={topicId} onChange={(e) => setTopicId(e.target.value)} placeholder="Topic ID..." />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit">Publish Poll</Button>
        </div>
      </form>
    </Modal>
  );
}
