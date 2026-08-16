export interface StateData {
  code: string;
  name: string;
  type: 'state' | 'ut';
  hasLegislativeCouncil: boolean;
  lokSabhaSeats: number;
  vidhanSabhaSeats: number;
}

export const STATES: StateData[] = [
  { code: 'MH', name: 'Maharashtra', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 48, vidhanSabhaSeats: 288 },
  { code: 'UP', name: 'Uttar Pradesh', type: 'state', hasLegislativeCouncil: true, lokSabhaSeats: 80, vidhanSabhaSeats: 403 },
  { code: 'WB', name: 'West Bengal', type: 'state', hasLegislativeCouncil: false, lokSabhaSeats: 42, vidhanSabhaSeats: 294 }
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
