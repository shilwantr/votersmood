import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../config/firebase.js';
import { doc, setDoc } from 'firebase/firestore';
import { STATES, CONSTITUENCIES_BY_STATE } from '../data/states.js';
import { DISTRICTS_BY_STATE, BLOCKS_BY_DISTRICT, CONSTITUENCIES_BY_DISTRICT } from '../../client/src/utils/locationData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverDir = path.join(__dirname, '..');

const runSync3States = async () => {
  console.log('📂 Syncing 3 States (MH, UP, WB) master location data to Cloud Firestore DB...');

  const locationMasterData = {
    states: STATES, // 3 States: MH, UP, WB
    districtsByState: DISTRICTS_BY_STATE,
    constituenciesByState: CONSTITUENCIES_BY_STATE,
    constituenciesByDistrict: CONSTITUENCIES_BY_DISTRICT,
    blocksByDistrict: BLOCKS_BY_DISTRICT,
    totalLeadersCount: 300,
    updatedAt: Date.now()
  };

  // Write master location metadata directly into Cloud Firestore DB
  if (db) {
    console.log('💾 Overwriting [locations/master] in Cloud Firestore DB with 3 States dataset...');
    await setDoc(doc(db, 'locations', 'master'), locationMasterData, { merge: false });
    console.log('🎉 SUCCESS: Written [locations/master] with 3 States to Cloud Firestore DB!');
  }

  // Also write local cache json
  const localCachePath = path.join(serverDir, 'data', 'locations_master.json');
  fs.writeFileSync(localCachePath, JSON.stringify(locationMasterData, null, 2));
  console.log(`📁 Exported Local JSON Cache: ${localCachePath}`);

  console.log('\n======================================================');
  console.log(`🎉 SUCCESS: Locations Master Synced to 3 States!`);
  console.log(`States: ${STATES.map(s => s.name).join(', ')}`);
  console.log('======================================================\n');
};

runSync3States().then(() => process.exit(0)).catch(e => {
  console.error('Error during 3 states location sync:', e);
  process.exit(1);
});
