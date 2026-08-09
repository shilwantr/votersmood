import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '908059965361',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seedData() {
  console.log('Seeding initial VotersMood data...');

  // 1. Initial App Config
  await setDoc(doc(db, 'appConfig', 'main'), {
    imagePostingEnabled: true,
    commentModerationEnabled: true,
    pollCreationEnabled: true,
    electionStates: ['MH', 'UP'],
  });
  console.log('✔ Seeded App Config');

  // 2. Initial Sample Leaders
  const sampleLeaders = [
    {
      id: 'devendra-fadnavis',
      name: 'Devendra Fadnavis',
      party: 'BJP',
      state: 'MH',
      constituency: 'Nagpur South West',
      type: 'MLA',
      chamber: 'Vidhan Sabha',
      agreeCount: 142,
      funnyCount: 12,
      commentCount: 8,
      searchTokens: ['devendra', 'fadnavis', 'nagpur', 'bjp', 'mla', 'maharashtra'],
      createdAt: Date.now(),
    },
    {
      id: 'rahul-gandhi',
      name: 'Rahul Gandhi',
      party: 'INC',
      state: 'UP',
      constituency: 'Rae Bareli',
      type: 'MP_LS',
      chamber: 'Lok Sabha',
      agreeCount: 230,
      funnyCount: 45,
      commentCount: 34,
      searchTokens: ['rahul', 'gandhi', 'rae bareli', 'inc', 'mp', 'lok sabha'],
      createdAt: Date.now(),
    },
    {
      id: 'nitin-gadkari',
      name: 'Nitin Gadkari',
      party: 'BJP',
      state: 'MH',
      constituency: 'Nagpur',
      type: 'MP_LS',
      chamber: 'Lok Sabha',
      agreeCount: 310,
      funnyCount: 5,
      commentCount: 19,
      searchTokens: ['nitin', 'gadkari', 'nagpur', 'bjp', 'mp', 'lok sabha'],
      createdAt: Date.now(),
    }
  ];

  for (const leader of sampleLeaders) {
    await setDoc(doc(db, 'leaders', leader.id), leader);
  }
  console.log('✔ Seeded Sample Leaders');

  // 3. Initial Topics
  const sampleTopics = [
    {
      id: 'maharashtra-elections-2026',
      title: '#MAHARASHTRAELECTIONS2026',
      description: 'Maharashtra Assembly Elections & Local Governance coverage, key constituency polls.',
      isTrending: true,
      trendScore: 100,
      category: 'election',
      relatedState: 'MH',
      postCount: 1420,
      createdAt: Date.now(),
    },
    {
      id: 'up-election-polls-2026',
      title: '#UPELECTIONPOLLS2026',
      description: 'Uttar Pradesh Urban Development & Regional Polls debates on law & order and infrastructure.',
      isTrending: true,
      trendScore: 85,
      category: 'election',
      relatedState: 'UP',
      postCount: 980,
      createdAt: Date.now(),
    },
    {
      id: 'union-budget-2026',
      title: '#UNIONBUDGET2026',
      description: 'Central Union Fiscal Budget & Tax Reforms debates in Lok Sabha & Rajya Sabha.',
      isTrending: true,
      trendScore: 70,
      category: 'policy',
      postCount: 2310,
      createdAt: Date.now(),
    }
  ];

  for (const topic of sampleTopics) {
    await setDoc(doc(db, 'topics', topic.id), topic);
  }
  console.log('✔ Seeded Sample Topics');

  // 4. Initial Featured Election Polls
  const samplePolls = [
    {
      question: 'Priority Focus for Next Maharashtra Assembly Elections?',
      options: [
        { text: 'Urban Infrastructure & Metro Expansion', votes: 450 },
        { text: 'Farmer Loan Waiver & Agricultural Subsidies', votes: 310 },
        { text: 'Job Creation & Industrial Investment', votes: 520 },
        { text: 'Water Supply & Coastal Management', votes: 190 }
      ],
      createdBy: 'admin',
      createdByName: 'Official Election Commission Gazette',
      isAdmin: true,
      isFeatured: true,
      isElectionPoll: true,
      electionState: 'MH',
      electionConstituency: 'Mumbai South',
      electionType: 'state',
      totalVotes: 1470,
      residentVotes: 980,
      nonResidentVotes: 490,
      createdAt: Date.now()
    },
    {
      question: 'Gorakhpur Urban Development: Evaluate Current Civic Services',
      options: [
        { text: 'Substantially Improved', votes: 620 },
        { text: 'Moderate Progress', votes: 240 },
        { text: 'Needs Urgent Intervention', votes: 110 }
      ],
      createdBy: 'admin',
      createdByName: 'Official Gazette Engine',
      isAdmin: true,
      isFeatured: true,
      isElectionPoll: true,
      electionState: 'UP',
      electionConstituency: 'Gorakhpur Urban',
      electionType: 'state',
      totalVotes: 970,
      residentVotes: 710,
      nonResidentVotes: 260,
      createdAt: Date.now()
    }
  ];

  for (const poll of samplePolls) {
    await addDoc(collection(db, 'polls'), poll);
  }
  console.log('✔ Seeded Featured Election Polls');

  console.log('\nSeeding Complete!');
}

seedData().catch(console.error);
