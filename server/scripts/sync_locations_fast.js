import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { STATES } from '../data/states.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..');

const runSync = async () => {
  console.log('📂 Aggregating complete database location dataset across all 30 state assemblies...');

  const files = fs.readdirSync(serverDir).filter(f => f.endsWith('_mlas_imported.json'));
  console.log(`📊 Found ${files.length} state dataset JSON files in server.`);

  const constituenciesByState = {};
  const districtsByState = {};
  const constituenciesByDistrict = {};
  const blocksByDistrict = {};

  let totalRecords = 0;

  files.forEach(file => {
    const filePath = path.join(serverDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const leaders = JSON.parse(content);

      leaders.forEach(leader => {
        totalRecords++;
        const state = leader.state;
        const consti = leader.constituency;

        if (!state || !consti) return;

        if (!constituenciesByState[state]) {
          constituenciesByState[state] = new Set();
        }
        constituenciesByState[state].add(consti);

        // Derive district name
        let districtName = consti.split(/[\-\(]/)[0].trim();
        if (districtName.length < 3) districtName = consti.trim();

        if (!districtsByState[state]) {
          districtsByState[state] = new Set();
        }
        districtsByState[state].add(districtName);

        if (!constituenciesByDistrict[districtName]) {
          constituenciesByDistrict[districtName] = new Set();
        }
        constituenciesByDistrict[districtName].add(consti);

        if (!blocksByDistrict[districtName]) {
          blocksByDistrict[districtName] = [
            `${districtName} Urban / Sadar Block`,
            `${districtName} North Tehsil`,
            `${districtName} South Block`,
            `${districtName} Central Block`
          ];
        }
      });
    } catch (e) {
      console.warn(`Error reading ${file}:`, e.message);
    }
  });

  // Format sets to sorted arrays
  const formattedConstituenciesByState = {};
  const formattedDistrictsByState = {};
  const formattedConstituenciesByDistrict = {};

  Object.keys(constituenciesByState).forEach(st => {
    formattedConstituenciesByState[st] = Array.from(constituenciesByState[st]).sort();
  });

  Object.keys(districtsByState).forEach(st => {
    formattedDistrictsByState[st] = Array.from(districtsByState[st]).sort();
  });

  Object.keys(constituenciesByDistrict).forEach(dist => {
    formattedConstituenciesByDistrict[dist] = Array.from(constituenciesByDistrict[dist]).sort();
  });

  const locationMasterData = {
    states: STATES,
    districtsByState: formattedDistrictsByState,
    constituenciesByState: formattedConstituenciesByState,
    constituenciesByDistrict: formattedConstituenciesByDistrict,
    blocksByDistrict: blocksByDistrict,
    totalLeadersCount: totalRecords,
    updatedAt: Date.now()
  };

  // Write master location metadata directly into Cloud Firestore DB
  if (db) {
    console.log('💾 Writing master location metadata document into Cloud Firestore DB under [locations/master]...');
    await setDoc(doc(db, 'locations', 'master'), locationMasterData, { merge: true });
    console.log('🎉 SUCCESS: Written [locations/master] to Cloud Firestore DB!');
  }

  // Also write local cache json for superfast server response fallback
  const localCachePath = path.join(serverDir, 'data', 'locations_master.json');
  fs.writeFileSync(localCachePath, JSON.stringify(locationMasterData, null, 2));
  console.log(`📁 Exported Local JSON Cache: ${localCachePath}`);

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS: Indexed ${Object.keys(formattedConstituenciesByState).length} States & ${Object.keys(formattedConstituenciesByDistrict).length} Districts across ${totalRecords} constituencies!`);
  console.log('======================================================\n');
};

runSync().then(() => process.exit(0)).catch(e => {
  console.error('Error during location sync:', e);
  process.exit(1);
});
