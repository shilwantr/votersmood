export const OFFICIAL_ELECTIONS = [
  {
    id: 'election-mh-2026',
    title: 'Maharashtra Assembly Election 2026',
    category: 'state',
    description: 'Official State Election polling for the 288 Vidhan Sabha constituencies across Maharashtra.',
    startDate: '2026-10-01',
    endDate: '2026-11-15',
    status: 'published',
    isOfficial: true,
    state: 'MH',
    states: ['MH'],
    constituencies: [
      'Nagpur South West',
      'Mumbai South',
      'Worli',
      'Thane',
      'Pune City',
      'Nashik Central',
      'Aurangabad East',
      'Kolhapur South'
    ],
    candidates: [
      { id: 'c-bjp', name: 'Devendra Fadnavis', party: 'BJP', color: '#D97706' },
      { id: 'c-inc', name: 'Nana Patole', party: 'INC', color: '#2E7D32' },
      { id: 'c-ss', name: 'Eknath Shinde', party: 'Shiv Sena', color: '#C2410C' },
      { id: 'c-ncp', name: 'Ajit Pawar', party: 'NCP', color: '#2563EB' },
      { id: 'c-nota', name: 'None of the Above (NOTA)', party: 'Independent', color: '#6B7280' }
    ],
    residentVotes: {
      'c-bjp': 680,
      'c-inc': 420,
      'c-ss': 310,
      'c-ncp': 240,
      'c-nota': 50
    },
    observerVotes: {
      'c-bjp': 340,
      'c-inc': 290,
      'c-ss': 180,
      'c-ncp': 120,
      'c-nota': 30
    },
    totalVotes: 2660,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'election-national-2026',
    title: 'Lok Sabha General Elections 2026 (National)',
    category: 'national',
    description: 'National General Elections for the 543 Lok Sabha seats in Parliament.',
    startDate: '2026-04-01',
    endDate: '2026-05-20',
    status: 'published',
    isOfficial: true,
    states: ['MH', 'UP', 'KA', 'TN', 'WB', 'GJ', 'RJ', 'BR', 'DL', 'KL'],
    candidates: [
      { id: 'c-bjp-nat', name: 'Narendra Modi (NDA Alliance)', party: 'BJP', color: '#D97706' },
      { id: 'c-inc-nat', name: 'Rahul Gandhi (INDIA Bloc)', party: 'INC', color: '#2E7D32' },
      { id: 'c-aap-nat', name: 'Arvind Kejriwal', party: 'AAP', color: '#2563EB' },
      { id: 'c-nota-nat', name: 'None of the Above (NOTA)', party: 'Independent', color: '#6B7280' }
    ],
    residentVotes: {
      'c-bjp-nat': 1420,
      'c-inc-nat': 980,
      'c-aap-nat': 310,
      'c-nota-nat': 90
    },
    observerVotes: {
      'c-bjp-nat': 650,
      'c-inc-nat': 520,
      'c-aap-nat': 180,
      'c-nota-nat': 40
    },
    totalVotes: 4190,
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'election-byelection-up-2026',
    title: 'Gorakhpur Urban Constituency By-Election 2026',
    category: 'byelection',
    description: 'By-Election for the Gorakhpur Urban Vidhan Sabha seat in Uttar Pradesh.',
    startDate: '2026-09-10',
    endDate: '2026-09-25',
    status: 'published',
    isOfficial: true,
    state: 'UP',
    states: ['UP'],
    constituencies: ['Gorakhpur Urban'],
    candidates: [
      { id: 'c-bjp-up', name: 'Yogi Adityanath', party: 'BJP', color: '#D97706' },
      { id: 'c-sp-up', name: 'Kajal Nishad', party: 'SP', color: '#DC2626' },
      { id: 'c-bsp-up', name: 'Khwaja Shamsuddin', party: 'BSP', color: '#1E40AF' },
      { id: 'c-nota-up', name: 'None of the Above (NOTA)', party: 'Independent', color: '#6B7280' }
    ],
    residentVotes: {
      'c-bjp-up': 540,
      'c-sp-up': 310,
      'c-bsp-up': 120,
      'c-nota-up': 20
    },
    observerVotes: {
      'c-bjp-up': 210,
      'c-sp-up': 140,
      'c-bsp-up': 60,
      'c-nota-up': 10
    },
    totalVotes: 1410,
    createdAt: Date.now() - 259200000,
  }
];

export const COMMUNITY_MINI_POLLS = [
  {
    id: 'comm-poll-1',
    question: 'What issue matters most in this Maharashtra election?',
    options: [
      { id: 'o1', text: 'Employment & Industrial Investment', votes: 420 },
      { id: 'o2', text: 'Road Quality & Transport Infrastructure', votes: 380 },
      { id: 'o3', text: 'Farmer Loan Relief & Agricultural Subsidies', votes: 290 },
      { id: 'o4', text: 'Water Supply & Coastal Management', votes: 190 }
    ],
    authorName: 'SURESH PATIL (Verified Citizen)',
    authorRole: 'user',
    isFeatured: true,
    isLocked: false,
    totalVotes: 1280,
    agreeCount: 45,
    createdAt: Date.now() - 43200000,
  },
  {
    id: 'comm-poll-2',
    question: 'Which local public amenity needs immediate attention after winning?',
    options: [
      { id: 'o1', text: 'Public Hospitals & Primary Healthcare', votes: 510 },
      { id: 'o2', text: 'Municipal Schools & Education Infrastructure', votes: 340 },
      { id: 'o3', text: 'Stormwater Drainage & Flood Control', votes: 280 },
      { id: 'o4', text: 'City Waste Management & Sanitation', votes: 150 }
    ],
    authorName: 'ANANYA DESHMUKH (Verified Citizen)',
    authorRole: 'user',
    isFeatured: false,
    isLocked: false,
    totalVotes: 1280,
    agreeCount: 32,
    createdAt: Date.now() - 86400000,
  }
];
