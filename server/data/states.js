export const STATES = [
  { code: 'MH', name: 'Maharashtra', type: 'state', lokSabhaSeats: 48, vidhanSabhaSeats: 288 },
  { code: 'UP', name: 'Uttar Pradesh', type: 'state', lokSabhaSeats: 80, vidhanSabhaSeats: 403 },
  { code: 'WB', name: 'West Bengal', type: 'state', lokSabhaSeats: 42, vidhanSabhaSeats: 294 }
];

export const CONSTITUENCIES_BY_STATE = {
  MH: [
    'Nagpur South West', 'Nagpur South', 'Nagpur East', 'Nagpur Central', 'Nagpur West', 'Nagpur North', 
    'Kamptee', 'Hingna', 'Katol', 'Savner', 'Umred', 'Ramtek',
    'Colaba', 'Byculla', 'Malabar Hill', 'Mumbadevi', 'Wadala', 'Mahim', 'Worli', 'Shivadi', 'Dharavi',
    'Bandra West', 'Bandra East', 'Andheri West', 'Andheri East', 'Vile Parle', 'Chandivali', 'Ghatkopar West', 'Ghatkopar East', 'Kurla', 'Kalina', 'Borivali', 'Dahisar', 'Magathane', 'Mulund', 'Vikhroli', 'Bhandup West', 'Kandivali East', 'Charkop', 'Malad West', 'Goregaon', 'Versova',
    'Kothrud', 'Kasba Peth', 'Shivajinagar', 'Pune Cantonment', 'Hadapsar', 'Vadgaon Sheri', 'Parvati', 'Khadakwasala', 'Baramati', 'Bhor', 'Maval', 'Chinchwad', 'Pimpri', 'Bhosari', 'Junnar', 'Ambegaon', 'Khed Alandi', 'Shirur', 'Daund', 'Indapur', 'Purandar',
    'Thane', 'Kopri-Pachpakhadi', 'Ovala-Majiwada', 'Mira Bhayandar', 'Airoli', 'Belapur', 'Kalyan West', 'Kalyan East', 'Kalyan Rural', 'Dombivali', 'Ambernath', 'Ulhasnagar', 'Murbad', 'Bhiwandi West', 'Bhiwandi East', 'Bhiwandi Rural', 'Shahapur',
    'Nashik East', 'Nashik Central', 'Nashik West', 'Deolali', 'Igatpuri', 'Sinnar', 'Niphad', 'Dindori', 'Chandvad', 'Yevla', 'Nandgaon', 'Malegaon Central', 'Malegaon Outer', 'Baglan', 'Kalwan',
    'Solapur City North', 'Solapur City Central', 'Solapur South', 'Mohol', 'Akkalkot', 'Pandharpur', 'Sangole', 'Malshiras', 'Karmala', 'Madha', 'Barshi',
    'Kolhapur South', 'Kolhapur North', 'Karvir', 'Chandgad', 'Radhanagari', 'Kagal', 'Shahuwadi', 'Hatkanangle', 'Ichalkaranji', 'Shirol',
    'Aurangabad Central', 'Aurangabad West', 'Aurangabad East', 'Phulambri', 'Sillod', 'Kannad', 'Paithan', 'Gangapur', 'Vaijapur'
  ],
  UP: [
    'Lucknow Central', 'Lucknow North', 'Lucknow East', 'Lucknow West', 'Lucknow Cantt', 'Sarojini Nagar', 'Bakshi Kaa Talab', 'Malihabad', 'Mohanlalganj',
    'Varanasi South', 'Varanasi North', 'Varanasi Cantt', 'Pindra', 'Ajagara', 'Shivpur', 'Rohaniya', 'Sevapuri',
    'Gorakhpur Urban', 'Gorakhpur Rural', 'Pipraich', 'Caimpiyarganj', 'Sahajanwa', 'Khajani', 'Chauri-Chaura', 'Bansgaon', 'Chillupar',
    'Agra Urban', 'Agra South', 'Agra Cantt', 'Agra North', 'Agra Rural', 'Etmadpur', 'Fatehpur Sikri', 'Kheragarh', 'Bah',
    'Kalyanpur', 'Govindnagar', 'Sishamau', 'Arya Nagar', 'Kidwai Nagar', 'Kanpur Cantt', 'Maharajpur', 'Bithoor', 'Bilhaur', 'Ghatampur',
    'Noida', 'Dadri', 'Jewar',
    'Rae Bareli', 'Bachhrawan', 'Harchandpur', 'Sareni', 'Unchahar', 'Salon',
    'Ayodhya', 'Milkipur', 'Bikapur', 'Goshainganj', 'Rudauli',
    'Kannauj', 'Chhibramau', 'Tirwa'
  ],
  WB: [
    'Bhabanipur', 'Kolkata Port', 'Chowrangee', 'Entally', 'Ballygunge', 'Rashbehari', 'Jorasanko', 'Beleghata', 'Shyampukur', 'Maniktala', 'Kashipur-Belgachhia',
    'Rajarhat New Town', 'Bidhannagar', 'Madhyamgram', 'Barasat', 'Deganga', 'Haroa', 'Habra', 'Ashoknagar', 'Amdanga', 'Barrackpur', 'Naihati', 'Bhatpara', 'Jagatdal', 'Noapara', 'Khardaha', 'Dum Dum Uttar', 'Panihati', 'Kamarhati', 'Baranagar', 'Dum Dum',
    'Diamond Harbour', 'Canning Paschim', 'Canning Purba', 'Baruipur Purba', 'Baruipur Paschim', 'Sonarpur Uttar', 'Sonarpur Dakshin', 'Jadavpur', 'Kasba', 'Tollygunge', 'Behala Purba', 'Behala Paschim', 'Maheshtala', 'Budge Budge', 'Metiaburuz', 'Kultali', 'Patharpratima', 'Kakdwip', 'Sagar',
    'Howrah Uttar', 'Howrah Madhya', 'Howrah Dakshin', 'Shibpur', 'Bally', 'Sankrail', 'Panchla', 'Uluberia Purba', 'Uluberia Uttar', 'Uluberia Dakshin', 'Bagnan', 'Amta', 'Udaynarayanpur', 'Domjur',
    'Uttarpara', 'Sreerampur', 'Champdani', 'Singur', 'Chandannagar', 'Chunchura', 'Balagarh', 'Pandua', 'Saptagram', 'Chanditala', 'Jangipara', 'Haripal', 'Dhanekhali', 'Tarakeswar', 'Pursurah', 'Arambag', 'Goghat', 'Khanakul',
    'Asansol Uttar', 'Asansol Dakshin', 'Raniganj', 'Jamuria', 'Kulti', 'Barabani', 'Durgapur Purba', 'Durgapur Paschim', 'Pandabeswar',
    'Darjeeling', 'Kurseong', 'Kalimpong', 'Siliguri', 'Matigara-Naxalbari', 'Phansidewa'
  ]
};

export const getConstituenciesForState = (stateCode) => {
  if (CONSTITUENCIES_BY_STATE[stateCode]) {
    return CONSTITUENCIES_BY_STATE[stateCode];
  }
  const stateObj = STATES.find(s => s.code === stateCode);
  const name = stateObj ? stateObj.name : 'State';
  return [
    `${name} Central`,
    `${name} North`,
    `${name} South`
  ];
};

export const PARTIES = {
  BJP: { name: 'Bharatiya Janata Party', bg: '#D97706', color: '#FFFFFF' },
  INC: { name: 'Indian National Congress', bg: '#2E7D32', color: '#FFFFFF' },
  AAP: { name: 'Aam Aadmi Party', bg: '#2563EB', color: '#FFFFFF' },
  CPI: { name: 'Communist Party of India', bg: '#B91C1C', color: '#FFFFFF' },
  'CPI(M)': { name: 'Communist Party of India (Marxist)', bg: '#991B1B', color: '#FFFFFF' },
  SP: { name: 'Samajwadi Party', bg: '#DC2626', color: '#FFFFFF' },
  BSP: { name: 'Bahujan Samaj Party', bg: '#1E40AF', color: '#FFFFFF' },
  TMC: { name: 'All India Trinamool Congress', bg: '#0284C7', color: '#FFFFFF' },
  'Shiv Sena': { name: 'Shiv Sena', bg: '#C2410C', color: '#FFFFFF' },
  NCP: { name: 'Nationalist Congress Party', bg: '#2563EB', color: '#FFFFFF' },
  Independent: { name: 'Independent Candidate', bg: '#6B7280', color: '#FFFFFF' }
};

export const LEADER_TYPES = {
  MP_LS: 'Member of Parliament (Lok Sabha)',
  MP_RS: 'Member of Parliament (Rajya Sabha)',
  MLA: 'Member of Legislative Assembly',
  MLC: 'Member of Legislative Council'
};
