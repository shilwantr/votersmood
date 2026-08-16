import { db } from '../config/firebase.js';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';

const buildLocationsFromLeadersDB = async () => {
  console.log('📂 Querying Cloud Firestore DB leaders collection to extract all States, Districts & Constituencies...');

  if (!db) {
    console.error('Database connection unavailable!');
    return;
  }

  const snap = await getDocs(collection(db, 'leaders'));
  console.log(`📊 Found ${snap.docs.length} leader documents in Firestore DB.`);

  const constituenciesByState = {};
  const districtsByState = {};
  const constituenciesByDistrict = {};

  snap.docs.forEach(docSnap => {
    const data = docSnap.data();
    const state = data.state;
    const consti = data.constituency;

    if (!state || !consti) return;

    if (!constituenciesByState[state]) {
      constituenciesByState[state] = new Set();
    }
    constituenciesByState[state].add(consti);

    // Estimate/Extract District from Constituency or portfolio
    let districtName = consti.split('-')[0].trim();
    if (districtName.toLowerCase().includes('rural') || districtName.toLowerCase().includes('urban')) {
      districtName = districtName.replace(/rural|urban/gi, '').trim();
    }

    if (!districtsByState[state]) {
      districtsByState[state] = new Set();
    }
    districtsByState[state].add(districtName);

    if (!constituenciesByDistrict[districtName]) {
      constituenciesByDistrict[districtName] = new Set();
    }
    constituenciesByDistrict[districtName].add(consti);
  });

  // Convert Sets to Arrays & sort
  const sortedConstituenciesByState = {};
  const sortedDistrictsByState = {};
  const sortedConstituenciesByDistrict = {};

  Object.keys(constituenciesByState).forEach(st => {
    sortedConstituenciesByState[st] = Array.from(constituenciesByState[st]).sort();
  });

  Object.keys(districtsByState).forEach(st => {
    sortedDistrictsByState[st] = Array.from(districtsByState[st]).sort();
  });

  Object.keys(constituenciesByDistrict).forEach(dist => {
    sortedConstituenciesByDistrict[dist] = Array.from(constituenciesByDistrict[dist]).sort();
  });

  const locationMetadataDoc = {
    constituenciesByState: sortedConstituenciesByState,
    districtsByState: sortedDistrictsByState,
    constituenciesByDistrict: sortedConstituenciesByDistrict,
    totalLeaders: snap.docs.length,
    updatedAt: Date.now()
  };

  // Write master location document to Cloud Firestore DB under 'locations/master'
  await setDoc(doc(db, 'locations', 'master'), locationMetadataDoc, { merge: true });
  console.log(`🎉 SUCCESS: Created 'locations/master' document in Cloud Firestore DB!`);
  console.log(`📈 Indexed ${Object.keys(sortedConstituenciesByState).length} States & UTs with over ${snap.docs.length} real constituencies!`);
};

buildLocationsFromLeadersDB()
  .then(() => process.exit(0))
  .catch(e => {
    console.error('Error building location DB:', e);
    process.exit(1);
  });
