import { STATES } from '../../../server/data/states.js';

export { STATES };

export const DISTRICTS_BY_STATE = {
  MH: [
    'Nagpur', 'Mumbai City', 'Mumbai Suburban', 'Pune', 'Thane', 'Nashik', 
    'Solapur', 'Kolhapur', 'Chhatrapati Sambhajinagar'
  ],
  UP: [
    'Lucknow', 'Varanasi', 'Gorakhpur', 'Agra', 'Kanpur Nagar', 
    'Gautam Buddha Nagar (Noida)', 'Rae Bareli', 'Ayodhya', 'Kannauj'
  ],
  WB: [
    'Kolkata', 'North 24 Parganas', 'South 24 Parganas', 'Howrah', 'Hooghly', 
    'Paschim Bardhaman', 'Darjeeling'
  ]
};

export const BLOCKS_BY_DISTRICT = {
  // Maharashtra
  Nagpur: ['Nagpur Urban', 'Nagpur Rural', 'Hingna', 'Kamptee', 'Katol', 'Savner', 'Umred', 'Ramtek', 'Kuhi', 'Bhiwapur', 'Parseoni', 'Narkhed'],
  'Mumbai City': ['Zone I (Fort/Colaba)', 'Zone II (Byculla/Worli)', 'Zone III (Dharavi/Wadala)'],
  'Mumbai Suburban': ['Andheri Block', 'Borivali Block', 'Kurla Block'],
  Pune: ['Pune Urban', 'Haveli', 'Baramati Block', 'Khed', 'Maval', 'Shirur', 'Daund', 'Indapur', 'Bhor', 'Junnar', 'Ambegaon', 'Purandar'],
  Thane: ['Thane Urban', 'Kalyan', 'Bhiwandi', 'Mira Bhayandar', 'Ulhasnagar', 'Ambernath', 'Murbad', 'Shahapur'],
  Nashik: ['Nashik Urban', 'Malegaon', 'Sinnar', 'Niphad', 'Dindori', 'Chandvad', 'Yevla', 'Igatpuri', 'Baglan', 'Kalwan', 'Surgana', 'Deola'],
  Solapur: ['Solapur Urban', 'North Solapur', 'South Solapur', 'Pandharpur', 'Barshi', 'Sangole', 'Madha', 'Karmala', 'Mohol', 'Akkalkot', 'Malshiras', 'Mangalvedhe'],
  Kolhapur: ['Karvir (Kolhapur Urban)', 'Hatkanangle', 'Ichalkaranji', 'Shirol', 'Kagal', 'Gadhinglaj', 'Radhanagari', 'Bhudargad', 'Ajra', 'Chandgad', 'Shahuwadi', 'Panhala', 'Gaganbavda'],
  'Chhatrapati Sambhajinagar': ['Aurangabad Urban', 'Aurangabad Rural', 'Paithan', 'Gangapur', 'Vaijapur', 'Sillod', 'Kannad', 'Phulambri', 'Khultabad', 'Soegaon'],

  // Uttar Pradesh
  Lucknow: ['Lucknow Sadar', 'Bakshi Ka Talab', 'Mohanlalganj', 'Sarojini Nagar', 'Chinhat', 'Malihabad', 'Gosainganj', 'Kakori'],
  Varanasi: ['Varanasi City', 'Kashi Vidyapeeth', 'Pindra', 'Cholapur', 'Araziline', 'Sevapuri', 'Harhua', 'Baragaon'],
  Gorakhpur: ['Gorakhpur City', 'Bhathat', 'Chargawan', 'Sahajanwa', 'Pipraich', 'Kauriram', 'Bansgaon', 'Campierganj', 'Khajani', 'Gola', 'Uruwa', 'Jangal Kauria', 'Pali', 'Brahmpur', 'Belghat', 'Sardarnagar', 'Khajni'],
  Agra: ['Agra Sadar', 'Bichpuri', 'Akola', 'Fatehabad', 'Etmadpur', 'Kheragarh', 'Bah', 'Shamsabad', 'Pinahat', 'Jaitpur Kalan', 'Kiraoli', 'Jagner', 'Saiyan'],
  'Kanpur Nagar': ['Kanpur Sadar', 'Kalyanpur', 'Bidhnu', 'Bhitargaon', 'Ghatampur', 'Sarsaul', 'Chakeri', 'Bilhaur', 'Kakor', 'Choubepur', 'Sivrajpur'],
  'Gautam Buddha Nagar (Noida)': ['Bisrakh (Noida)', 'Dadri Block', 'Jewer Block'],
  'Rae Bareli': ['Rae Bareli Sadar', 'Amawan', 'Bachanrawan', 'Harchandpur', 'Lalganj', 'Sareni', 'Unchahar', 'Deenshah Gaura', 'Rahi', 'Sataon', 'Salon', 'Jagatpur', 'Maharajganj', 'Rohania', 'Chatoh', 'Dih'],
  Ayodhya: ['Ayodhya Sadar', 'Masodha', 'Pura Bazar', 'Sohawal', 'Milkipur', 'Bikapur', 'Tarun', 'Harringtonganj', 'Rudauli', 'Mawai', 'Amaniganj'],
  Kannauj: ['Kannauj Sadar', 'Chhibramau', 'Tirwa', 'Umarda', 'Gursahayganj', 'Talgram', 'Haseran', 'Saurikh'],

  // West Bengal
  Kolkata: ['Kolkata North', 'Kolkata South', 'Kolkata Central'],
  'North 24 Parganas': ['Barasat-I', 'Barasat-II', 'Deganga', 'Habra-I', 'Habra-II', 'Amdanga', 'Barrackpur-I', 'Barrackpur-II', 'Rajarhat', 'Gaighata', 'Bangaon', 'Bagda', 'Haroa', 'Minakhan', 'Hasnabad', 'Hingalganj', 'Sandeshkhali-I', 'Sandeshkhali-II', 'Swarupnagar', 'Baduria'],
  'South 24 Parganas': ['Diamond Harbour-I', 'Diamond Harbour-II', 'Baruipur', 'Canning-I', 'Canning-II', 'Sonarpur', 'Bhangar-I', 'Bhangar-II', 'Budge Budge-I', 'Budge Budge-II', 'Thakurpukur Mahestola', 'Jaynagar-I', 'Jaynagar-II', 'Basanti', 'Gosaba', 'Kultali', 'Mathurapur-I', 'Mathurapur-II', 'Patharpratima', 'Kakdwip', 'Namkhana', 'Sagar', 'Kulpi'],
  Howrah: ['Howrah Sadar', 'Bally Jagachha', 'Sankrail', 'Domjur', 'Panchla', 'Jagatballavpur', 'Uluberia-I', 'Uluberia-II', 'Shyampur-I', 'Shyampur-II', 'Bagnan-I', 'Bagnan-II', 'Amta-I', 'Amta-II', 'Udaynarayanpur'],
  Hooghly: ['Chunchura-Mogra', 'Polba Dadpur', 'Balagarh', 'Pandua', 'Sreerampur-Uttarpara', 'Singur', 'Chanditala-I', 'Chanditala-II', 'Jangipara', 'Haripal', 'Dhanekhali', 'Tarakeswar', 'Pursurah', 'Arambag', 'Goghat-I', 'Goghat-II', 'Khanakul-I', 'Khanakul-II'],
  'Paschim Bardhaman': ['Asansol Sadar', 'Raniganj', 'Jamuria', 'Salampur', 'Barabani', 'Kanka', 'Faridpur Durgapur', 'Pandabeswar'],
  Darjeeling: ['Darjeeling Pulbazar', 'Jorebunglow Sukiapokhri', 'Kurseong', 'Mirik', 'Gorubathan', 'Matigara', 'Naxalbari', 'Phansidewa', 'Kharibari']
};

export const CONSTITUENCIES_BY_DISTRICT = {
  // Maharashtra
  Nagpur: ['Nagpur South West', 'Nagpur South', 'Nagpur East', 'Nagpur Central', 'Nagpur West', 'Nagpur North', 'Kamptee', 'Hingna', 'Katol', 'Savner', 'Umred', 'Ramtek'],
  'Mumbai City': ['Colaba', 'Byculla', 'Malabar Hill', 'Mumbadevi', 'Wadala', 'Mahim', 'Worli', 'Shivadi', 'Dharavi'],
  'Mumbai Suburban': ['Bandra West', 'Bandra East', 'Andheri West', 'Andheri East', 'Vile Parle', 'Chandivali', 'Ghatkopar West', 'Ghatkopar East', 'Kurla', 'Kalina', 'Borivali', 'Dahisar', 'Magathane', 'Mulund', 'Vikhroli', 'Bhandup West', 'Kandivali East', 'Charkop', 'Malad West', 'Goregaon', 'Versova'],
  Pune: ['Kothrud', 'Kasba Peth', 'Shivajinagar', 'Pune Cantonment', 'Hadapsar', 'Vadgaon Sheri', 'Parvati', 'Khadakwasala', 'Baramati', 'Bhor', 'Maval', 'Chinchwad', 'Pimpri', 'Bhosari', 'Junnar', 'Ambegaon', 'Khed Alandi', 'Shirur', 'Daund', 'Indapur', 'Purandar'],
  Thane: ['Thane', 'Kopri-Pachpakhadi', 'Ovala-Majiwada', 'Mira Bhayandar', 'Airoli', 'Belapur', 'Kalyan West', 'Kalyan East', 'Kalyan Rural', 'Dombivali', 'Ambernath', 'Ulhasnagar', 'Murbad', 'Bhiwandi West', 'Bhiwandi East', 'Bhiwandi Rural', 'Shahapur'],
  Nashik: ['Nashik East', 'Nashik Central', 'Nashik West', 'Deolali', 'Igatpuri', 'Sinnar', 'Niphad', 'Dindori', 'Chandvad', 'Yevla', 'Nandgaon', 'Malegaon Central', 'Malegaon Outer', 'Baglan', 'Kalwan'],
  Solapur: ['Solapur City North', 'Solapur City Central', 'Solapur South', 'Mohol', 'Akkalkot', 'Pandharpur', 'Sangole', 'Malshiras', 'Karmala', 'Madha', 'Barshi'],
  Kolhapur: ['Kolhapur South', 'Kolhapur North', 'Karvir', 'Chandgad', 'Radhanagari', 'Kagal', 'Shahuwadi', 'Hatkanangle', 'Ichalkaranji', 'Shirol'],
  'Chhatrapati Sambhajinagar': ['Aurangabad Central', 'Aurangabad West', 'Aurangabad East', 'Phulambri', 'Sillod', 'Kannad', 'Paithan', 'Gangapur', 'Vaijapur'],

  // Uttar Pradesh
  Lucknow: ['Lucknow Central', 'Lucknow North', 'Lucknow East', 'Lucknow West', 'Lucknow Cantt', 'Sarojini Nagar', 'Bakshi Kaa Talab', 'Malihabad', 'Mohanlalganj'],
  Varanasi: ['Varanasi South', 'Varanasi North', 'Varanasi Cantt', 'Pindra', 'Ajagara', 'Shivpur', 'Rohaniya', 'Sevapuri'],
  Gorakhpur: ['Gorakhpur Urban', 'Gorakhpur Rural', 'Pipraich', 'Caimpiyarganj', 'Sahajanwa', 'Khajani', 'Chauri-Chaura', 'Bansgaon', 'Chillupar'],
  Agra: ['Agra Urban', 'Agra South', 'Agra Cantt', 'Agra North', 'Agra Rural', 'Etmadpur', 'Fatehpur Sikri', 'Kheragarh', 'Bah'],
  'Kanpur Nagar': ['Kalyanpur', 'Govindnagar', 'Sishamau', 'Arya Nagar', 'Kidwai Nagar', 'Kanpur Cantt', 'Maharajpur', 'Bithoor', 'Bilhaur', 'Ghatampur'],
  'Gautam Buddha Nagar (Noida)': ['Noida', 'Dadri', 'Jewar'],
  'Rae Bareli': ['Rae Bareli', 'Bachhrawan', 'Harchandpur', 'Sareni', 'Unchahar', 'Salon'],
  Ayodhya: ['Ayodhya', 'Milkipur', 'Bikapur', 'Goshainganj', 'Rudauli'],
  Kannauj: ['Kannauj', 'Chhibramau', 'Tirwa'],

  // West Bengal
  Kolkata: ['Bhabanipur', 'Kolkata Port', 'Chowrangee', 'Entally', 'Ballygunge', 'Rashbehari', 'Jorasanko', 'Beleghata', 'Shyampukur', 'Maniktala', 'Kashipur-Belgachhia'],
  'North 24 Parganas': ['Rajarhat New Town', 'Bidhannagar', 'Madhyamgram', 'Barasat', 'Deganga', 'Haroa', 'Habra', 'Ashoknagar', 'Amdanga', 'Barrackpur', 'Naihati', 'Bhatpara', 'Jagatdal', 'Noapara', 'Khardaha', 'Dum Dum Uttar', 'Panihati', 'Kamarhati', 'Baranagar', 'Dum Dum'],
  'South 24 Parganas': ['Diamond Harbour', 'Canning Paschim', 'Canning Purba', 'Baruipur Purba', 'Baruipur Paschim', 'Sonarpur Uttar', 'Sonarpur Dakshin', 'Jadavpur', 'Kasba', 'Tollygunge', 'Behala Purba', 'Behala Paschim', 'Maheshtala', 'Budge Budge', 'Metiaburuz', 'Kultali', 'Patharpratima', 'Kakdwip', 'Sagar'],
  Howrah: ['Howrah Uttar', 'Howrah Madhya', 'Howrah Dakshin', 'Shibpur', 'Bally', 'Sankrail', 'Panchla', 'Uluberia Purba', 'Uluberia Uttar', 'Uluberia Dakshin', 'Bagnan', 'Amta', 'Udaynarayanpur', 'Domjur'],
  Hooghly: ['Uttarpara', 'Sreerampur', 'Champdani', 'Singur', 'Chandannagar', 'Chunchura', 'Balagarh', 'Pandua', 'Saptagram', 'Chanditala', 'Jangipara', 'Haripal', 'Dhanekhali', 'Tarakeswar', 'Pursurah', 'Arambag', 'Goghat', 'Khanakul'],
  'Paschim Bardhaman': ['Asansol Uttar', 'Asansol Dakshin', 'Raniganj', 'Jamuria', 'Kulti', 'Barabani', 'Durgapur Purba', 'Durgapur Paschim', 'Pandabeswar'],
  Darjeeling: ['Darjeeling', 'Kurseong', 'Kalimpong', 'Siliguri', 'Matigara-Naxalbari', 'Phansidewa']
};

export const getDistrictsForState = (stateCode) => {
  if (DISTRICTS_BY_STATE[stateCode] && DISTRICTS_BY_STATE[stateCode].length > 0) {
    return DISTRICTS_BY_STATE[stateCode];
  }
  const stateObj = STATES.find(s => s.code === stateCode);
  const stateName = stateObj ? stateObj.name : 'State';
  return [
    `${stateName} Central District`,
    `${stateName} North District`,
    `${stateName} South District`
  ];
};

export const getBlocksForDistrict = (districtName, stateCode) => {
  if (BLOCKS_BY_DISTRICT[districtName]) {
    return BLOCKS_BY_DISTRICT[districtName];
  }
  if (!districtName) return ['Central Block', 'Urban Block', 'Rural Block'];
  return [
    `${districtName} Urban / Sadar Block`,
    `${districtName} North Tehsil`,
    `${districtName} South Block`
  ];
};

export const getConstituenciesForDistrict = (districtName, stateCode) => {
  if (CONSTITUENCIES_BY_DISTRICT[districtName]) {
    return CONSTITUENCIES_BY_DISTRICT[districtName];
  }
  if (!districtName) {
    const stateObj = STATES.find(s => s.code === stateCode);
    const stateName = stateObj ? stateObj.name : 'State';
    return [`${stateName} Central`, `${stateName} North`, `${stateName} South`];
  }
  return [
    `${districtName} Central`,
    `${districtName} Urban`,
    `${districtName} Rural`
  ];
};
