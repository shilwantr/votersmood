export interface StateData {
  code: string;
  name: string;
  type: 'state' | 'ut';
  hasLegislativeCouncil: boolean;
  lokSabhaSeats: number;
  vidhanSabhaSeats: number;
}

export const STATES: StateData[] = [
  { code: 'AP', name: 'Andhra Pradesh', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 25, vidhanSabhaSeats: 175 },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'AS', name: 'Assam', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 14, vidhanSabhaSeats: 126 },
  { code: 'BR', name: 'Bihar', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 40, vidhanSabhaSeats: 243 },
  { code: 'CT', name: 'Chhattisgarh', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 11, vidhanSabhaSeats: 90 },
  { code: 'GA', name: 'Goa', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 40 },
  { code: 'GJ', name: 'Gujarat', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 26, vidhanSabhaSeats: 182 },
  { code: 'HR', name: 'Haryana', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 10, vidhanSabhaSeats: 90 },
  { code: 'HP', name: 'Himachal Pradesh', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 4, vidhanSabhaSeats: 68 },
  { code: 'JH', name: 'Jharkhand', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 14, vidhanSabhaSeats: 81 },
  { code: 'KA', name: 'Karnataka', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 28, vidhanSabhaSeats: 224 },
  { code: 'KL', name: 'Kerala', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 20, vidhanSabhaSeats: 140 },
  { code: 'MP', name: 'Madhya Pradesh', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 29, vidhanSabhaSeats: 230 },
  { code: 'MH', name: 'Maharashtra', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 48, vidhanSabhaSeats: 288 },
  { code: 'MN', name: 'Manipur', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'ML', name: 'Meghalaya', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'MZ', name: 'Mizoram', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 40 },
  { code: 'NL', name: 'Nagaland', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 60 },
  { code: 'OR', name: 'Odisha', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 21, vidhanSabhaSeats: 147 },
  { code: 'PB', name: 'Punjab', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 13, vidhanSabhaSeats: 117 },
  { code: 'RJ', name: 'Rajasthan', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 25, vidhanSabhaSeats: 200 },
  { code: 'SK', name: 'Sikkim', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 32 },
  { code: 'TN', name: 'Tamil Nadu', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 39, vidhanSabhaSeats: 234 },
  { code: 'TG', name: 'Telangana', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 17, vidhanSabhaSeats: 119 },
  { code: 'TR', name: 'Tripura', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 60 },
  { code: 'UP', name: 'Uttar Pradesh', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 80, vidhanSabhaSeats: 403 },
  { code: 'UT', name: 'Uttarakhand', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 5, vidhanSabhaSeats: 70 },
  { code: 'WB', name: 'West Bengal', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 42, vidhanSabhaSeats: 294 },
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 0 },
  { code: 'CH', name: 'Chandigarh', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 0 },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 2, vidhanSabhaSeats: 0 },
  { code: 'DL', name: 'Delhi', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 7, vidhanSabhaSeats: 70 },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 5, vidhanSabhaSeats: 90 },
  { code: 'LA', name: 'Ladakh', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 0 },
  { code: 'LD', name: 'Lakshadweep', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 0 },
  { code: 'PY', name: 'Puducherry', type: 'ut', hasLegislativeCouncil: false, lokSabhaSeats: 1, vidhanSabhaSeats: 30 },
];

export const PARTIES = {
  BJP: { name: 'Bharatiya Janata Party', color: '#FF9933' },
  INC: { name: 'Indian National Congress', color: '#19AAED' },
  AAP: { name: 'Aam Aadmi Party', color: '#0066A4' },
  AITC: { name: 'All India Trinamool Congress', color: '#20C646' },
  BSP: { name: 'Bahujan Samaj Party', color: '#22409A' },
  CPI: { name: 'Communist Party of India', color: '#CB0922' },
  CPIM: { name: 'Communist Party of India (Marxist)', color: '#DE0000' },
  NCP: { name: 'Nationalist Congress Party', color: '#00B2B2' },
  NPP: { name: 'National People\'s Party', color: '#F8E71C' },
  SP: { name: 'Samajwadi Party', color: '#FF2222' },
};

export const LEADER_TYPES = {
  MP_LS: 'Member of Parliament (Lok Sabha)',
  MP_RS: 'Member of Parliament (Rajya Sabha)',
  MLA: 'Member of Legislative Assembly',
  MLC: 'Member of Legislative Council'
};

export const ELECTION_TYPES = {
  STATE: 'State Assembly Election',
  NATIONAL: 'National (Lok Sabha) Election',
  BYPOLL: 'Bypoll Election'
};

export const getStateByCode = (code: string) => STATES.find(s => s.code === code);
export const getStatesWithCouncil = () => STATES.filter(s => s.hasLegislativeCouncil);
export const getPartyColor = (code: string) => PARTIES[code as keyof typeof PARTIES]?.color || '#888888';
