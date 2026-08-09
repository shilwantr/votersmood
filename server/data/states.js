export const STATES = [
  { code: 'AP', name: 'Andhra Pradesh', type: 'state', lokSabhaSeats: 25, vidhanSabhaSeats: 175 },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'state', lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'AS', name: 'Assam', type: 'state', lokSabhaSeats: 14, vidhanSabhaSeats: 126 },
  { code: 'BR', name: 'Bihar', type: 'state', lokSabhaSeats: 40, vidhanSabhaSeats: 243 },
  { code: 'CT', name: 'Chhattisgarh', type: 'state', lokSabhaSeats: 11, vidhanSabhaSeats: 90 },
  { code: 'GA', name: 'Goa', type: 'state', lokSabhaSeats: 2, vidhanSabhaSeats: 40 },
  { code: 'GJ', name: 'Gujarat', type: 'state', lokSabhaSeats: 26, vidhanSabhaSeats: 182 },
  { code: 'HR', name: 'Haryana', type: 'state', lokSabhaSeats: 10, vidhanSabhaSeats: 90 },
  { code: 'HP', name: 'Himachal Pradesh', type: 'state', lokSabhaSeats: 4, vidhanSabhaSeats: 68 },
  { code: 'JH', name: 'Jharkhand', type: 'state', lokSabhaSeats: 14, vidhanSabhaSeats: 81 },
  { code: 'KA', name: 'Karnataka', type: 'state', lokSabhaSeats: 28, vidhanSabhaSeats: 224 },
  { code: 'KL', name: 'Kerala', type: 'state', lokSabhaSeats: 20, vidhanSabhaSeats: 140 },
  { code: 'MP', name: 'Madhya Pradesh', type: 'state', lokSabhaSeats: 29, vidhanSabhaSeats: 230 },
  { code: 'MH', name: 'Maharashtra', type: 'state', lokSabhaSeats: 48, vidhanSabhaSeats: 288 },
  { code: 'MN', name: 'Manipur', type: 'state', lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'ML', name: 'Meghalaya', type: 'state', lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'MZ', name: 'Mizoram', type: 'state', lokSabhaSeats: 1, vidhanSabhaSeats: 40 },
  { code: 'NL', name: 'Nagaland', type: 'state', lokSabhaSeats: 1, vidhanSabhaSeats: 60 },
  { code: 'OR', name: 'Odisha', type: 'state', lokSabhaSeats: 21, vidhanSabhaSeats: 147 },
  { code: 'PB', name: 'Punjab', type: 'state', lokSabhaSeats: 13, vidhanSabhaSeats: 117 },
  { code: 'RJ', name: 'Rajasthan', type: 'state', lokSabhaSeats: 25, vidhanSabhaSeats: 200 },
  { code: 'SK', name: 'Sikkim', type: 'state', lokSabhaSeats: 1, vidhanSabhaSeats: 32 },
  { code: 'TN', name: 'Tamil Nadu', type: 'state', lokSabhaSeats: 39, vidhanSabhaSeats: 234 },
  { code: 'TG', name: 'Telangana', type: 'state', lokSabhaSeats: 17, vidhanSabhaSeats: 119 },
  { code: 'TR', name: 'Tripura', type: 'state', lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'UP', name: 'Uttar Pradesh', type: 'state', lokSabhaSeats: 80, vidhanSabhaSeats: 403 },
  { code: 'UT', name: 'Uttarakhand', type: 'state', lokSabhaSeats: 5, vidhanSabhaSeats: 70 },
  { code: 'WB', name: 'West Bengal', type: 'state', lokSabhaSeats: 42, vidhanSabhaSeats: 294 },
  { code: 'DL', name: 'Delhi', type: 'ut', lokSabhaSeats: 7, vidhanSabhaSeats: 70 },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'ut', lokSabhaSeats: 5, vidhanSabhaSeats: 90 },
  { code: 'PY', name: 'Puducherry', type: 'ut', lokSabhaSeats: 1, vidhanSabhaSeats: 30 }
];

export const CONSTITUENCIES_BY_STATE = {
  MH: ['Nagpur South West', 'Nagpur East', 'Nagpur Central', 'Mumbai South', 'Mumbai North', 'Pune City', 'Baramati', 'Nashik', 'Thane', 'Chhatrapati Sambhajinagar', 'Solapur', 'Kolhapur'],
  UP: ['Rae Bareli', 'Gorakhpur Urban', 'Varanasi', 'Lucknow', 'Amethi', 'Kannauj', 'Mathura', 'Ayodhya', 'Kanpur Nagar', 'Ghaziabad', 'Noida / Gautam Buddha Nagar'],
  BR: ['Patna Sahib', 'Begusarai', 'Gaya Town', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga', 'Nalanda', 'Kishanganj'],
  KA: ['Bengaluru South', 'Bengaluru Central', 'Bengaluru North', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'],
  WB: ['Bhabanipur', 'Diamond Harbour', 'Asansol', 'Kolkata Uttar', 'Kolkata Dakshin', 'Darjeeling', 'Siliguri'],
  DL: ['New Delhi', 'Chandni Chowk', 'East Delhi', 'South Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi'],
  TN: ['Chennai South', 'Chennai Central', 'Coimbatore', 'Madurai', 'Salem', 'Thoothukudi'],
  KL: ['Thiruvananthapuram', 'Wayanad', 'Thrissur', 'Ernakulam', 'Kozhikode', 'Palakkad'],
  GJ: ['Gandhinagar', 'Rajkot', 'Surat', 'Vadodara', 'Ahmedabad East', 'Ahmedabad West'],
  MP: ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Chhindwara'],
  RJ: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner'],
  PB: ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Gurdaspur'],
  TG: ['Hyderabad', 'Secunderabad', 'Malkajgiri', 'Karimnagar', 'Warangal'],
  AP: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Kurnool']
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
    `${name} South`,
    `${name} East`,
    `${name} West`,
    `Capital Constituency`
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
  'JD(U)': { name: 'Janata Dal (United)', bg: '#0F766E', color: '#FFFFFF' },
  RJD: { name: 'Rashtriya Janata Dal', bg: '#16A34A', color: '#FFFFFF' },
  TMC: { name: 'All India Trinamool Congress', bg: '#0284C7', color: '#FFFFFF' },
  DMK: { name: 'Dravida Munnetra Kazhagam', bg: '#111827', color: '#FFFFFF' },
  AIADMK: { name: 'All India Anna DMK', bg: '#14532D', color: '#FFFFFF' },
  BRS: { name: 'Bharat Rashtra Samithi', bg: '#BE185D', color: '#FFFFFF' },
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
