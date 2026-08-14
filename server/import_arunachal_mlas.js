import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './config/firebase.js';
import { doc, setDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = 'C:\\Users\\roysh\\.gemini\\antigravity\\brain\\639011b9-eed6-4ca0-a18e-fbe518076766\\scratch\\arunachal_mlas.csv';

const PARTY_MAP = {
  'Bharatiya Janata Party': 'BJP',
  'Indian National Congress': 'INC',
  'Nationalist Congress Party': 'NCP',
  'People\'s Party of Arunachal': 'PPA',
  'National Peoples Party': 'NPP',
  'Independent': 'INDEPENDENT'
};

const parseCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const runImport = async () => {
  console.log('📂 Reading Arunachal Pradesh CSV file...');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n').filter(l => l.trim() !== '');

  const headers = parseCsvLine(lines[0]);
  const records = lines.slice(1);
  console.log(`📊 Found ${records.length} MLA records to process.`);

  const jsonLeaders = [];

  for (let i = 0; i < records.length; i++) {
    const cols = parseCsvLine(records[i]);
    if (cols.length < 5) continue;

    const name = cols[0];
    const age = cols[1];
    let rawConstituency = cols[2] || '';
    const gender = (cols[3] || 'Male').trim();
    const fullParty = cols[4] || '';
    const education = cols[6] || '';
    const termStart = cols[7] || '2024-06-04';

    if (!name) continue;

    let seatType = 'General';
    let cleanConstituency = rawConstituency;

    if (/\(Sc\)/i.test(rawConstituency)) {
      seatType = 'SC';
      cleanConstituency = rawConstituency.replace(/\(Sc\)/i, '').trim();
    } else if (/\(St\)/i.test(rawConstituency)) {
      seatType = 'ST';
      cleanConstituency = rawConstituency.replace(/\(St\)/i, '').trim();
    }

    const party = PARTY_MAP[fullParty] || fullParty || 'INDEPENDENT';
    const slugId = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    const leaderDoc = {
      id: slugId,
      name: name.trim(),
      displayName: name.trim(),
      party: party,
      state: 'AR',
      constituency: cleanConstituency,
      type: 'MLA',
      repType: 'MLA',
      chamber: 'Vidhan Sabha',
      gender: gender === 'Female' ? 'Female' : 'Male',
      status: 'Active',
      verificationStatus: 'Verified',
      seatType: seatType,
      electionYear: '2024',
      termStart: termStart,
      portfolio: `Member of Legislative Assembly (MLA) - ${cleanConstituency}`,
      portfolios: ['Member of Legislative Assembly'],
      education: education,
      age: parseInt(age, 10) || null,
      website: '',
      profilePhoto: `https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(slugId)}`,
      openQuestionsCount: 0,
      answeredCount: 0,
      pendingCount: 0,
      agreeCount: 0,
      funnyCount: 0,
      totalReactionsCount: 0,
      totalCommentsCount: 0,
      createdAt: Date.now()
    };

    jsonLeaders.push(leaderDoc);
  }

  // Write JSON export file
  const jsonOutputPath = path.join(__dirname, 'arunachal_mlas_imported.json');
  fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonLeaders, null, 2));

  console.log(`💾 Prepared ${jsonLeaders.length} JSON objects. Writing to Cloud Firestore...`);

  let addedCount = 0;
  if (db) {
    // Parallel batches of 20
    const chunkSize = 20;
    for (let i = 0; i < jsonLeaders.length; i += chunkSize) {
      const chunk = jsonLeaders.slice(i, i + chunkSize);
      await Promise.all(chunk.map(leader => 
        setDoc(doc(db, 'leaders', leader.id), leader, { merge: true })
          .then(() => { addedCount++; })
          .catch(e => console.warn(`Error inserting ${leader.id}:`, e.message))
      ));
      console.log(`PROGRESS: Persisted ${Math.min(i + chunkSize, jsonLeaders.length)} / ${jsonLeaders.length} leader documents...`);
    }
  } else {
    addedCount = jsonLeaders.length;
  }

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS: Successfully added ${addedCount} documents into 'leaders' collection!`);
  console.log(`📁 Exported JSON File: g:\\projects\\votersmood\\server\\arunachal_mlas_imported.json`);
  console.log(`📊 TOTAL DOCS ADDED: ${addedCount}`);
  console.log('======================================================\n');
};

runImport().then(() => process.exit(0)).catch(e => {
  console.error('Import failed:', e);
  process.exit(1);
});
