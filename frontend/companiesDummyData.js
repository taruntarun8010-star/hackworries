// Companies Dummy Data - 200+ B2B Companies related to vendors
// These companies are buyers/customers who purchase from the vendors

const companyNameRoots = [
  'Lakshmi', 'Bharat', 'Excel', 'Saraswati', 'Techno', 'Siddharth', 'United', 'Ashok',
  'National', 'Premier', 'Global', 'Raj', 'Shri', 'Fortune', 'Trimurti', 'Apollo',
  'Crown', 'Bajaj', 'Tata', 'Jindal', 'Essar', 'Hindalco', 'SAIL', 'Mishra', 'Supreme',
  'Phoenix', 'Rising', 'Sunrise', 'Zenith', 'Summit', 'Peak', 'Horizon', 'Equinox',
  'Trinity', 'Quantum', 'Nexus', 'Prism', 'Vertex', 'Alpha', 'Beta', 'Gamma',
  'Delta', 'Sigma', 'Omega', 'Helix', 'Aurora', 'Nova', 'Stellar', 'Cosmic',
  'Stellar', 'Velocity', 'Dynamic', 'Kinetic', 'Synergy', 'Harmony', 'Meridian', 'Vector',
  'Catalyst', 'Momentum', 'Pulse', 'Rhythm', 'Echo', 'Resonance', 'Vibrant', 'Vivid'
];

const companyNameEndings = [
  'Manufacturing Company', 'Industries Limited', 'Productions Pvt Ltd', 'Solutions Inc.',
  'Systems Private Ltd', 'Corporation Ltd', 'Enterprises Pvt Ltd', 'Holdings Limited',
  'Group Limited', 'Works Private Ltd', 'Mills & Manufacturing', 'Engineering Pvt Ltd',
  'Processing Industries', 'Export Corporation', 'Trading Company', 'Supplies Limited',
  'Equipment Limited', 'Machinery Private Ltd', 'Factory Limited', 'Plant Industries'
];

const companyCategories = [
  'Automotive Manufacturing', 'Pharmaceuticals', 'Electronics & Semiconductors', 
  'Textile & Apparel', 'Food & Beverage Processing', 'Construction & Infrastructure',
  'Energy & Power', 'Chemical Manufacturing', 'Consumer Goods', 'Packaging',
  'Heavy Equipment', 'Aerospace & Defense', 'Railways & Transportation', 'Machinery',
  'Steel Fabrication', 'Aluminum Products', 'Plastic Manufacturing', 'Rubber Products',
  'Glass & Ceramics', 'Fertilizers & Chemicals', 'Mining & Extraction', 'White Goods',
  'Mobile & Electronics', 'IT Hardware', 'Solar & Renewable', 'Water Treatment'
];

const companySizes = ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'];

const industrialCities = [
  'Mumbai', 'Pune', 'Nashik', 'Ahmedabad', 'Vadodara', 'Surat', 'Jaipur', 'Udaipur',
  'Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ludhiana', 'Chandigarh', 'Indore', 'Bhopal',
  'Nagpur', 'Raipur', 'Hyderabad', 'Visakhapatnam', 'Chennai', 'Coimbatore', 'Bengaluru',
  'Mysuru', 'Kolkata', 'Durgapur', 'Jamshedpur', 'Ranchi', 'Bhubaneswar', 'Kochi'
];

const firstNames = [
  'Rajesh', 'Vikram', 'Sanjay', 'Amit', 'Arjun', 'Priya', 'Deepak', 'Anita',
  'Manoj', 'Suresh', 'Kavita', 'Arun', 'Ramesh', 'Neha', 'Varun', 'Shreya',
  'Nirav', 'Pooja', 'Aditya', 'Divya', 'Abhishek', 'Anjali', 'Rohit', 'Isha',
  'Karan', 'Meera', 'Rishabh', 'Zara', 'Akshay', 'Swati', 'Manish', 'Riya'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Desai', 'Gupta', 'Nair', 'Reddy',
  'Rao', 'Mishra', 'Verma', 'Jain', 'Bhat', 'Iyer', 'Shah', 'Kapoor',
  'Malhotra', 'Chopra', 'Bhatnagar', 'Pandey', 'Saxena', 'Sinha', 'Roy', 'Das'
];

const industryToBuyingCategories = {
  'Automotive Manufacturing': ['Steel', 'Aluminum', 'Electronic Components Bulk', 'Industrial Gases', 'Specialty Chemicals'],
  'Pharmaceuticals': ['Specialty Chemicals', 'Electronic Components Bulk', 'Semiconductor Materials'],
  'Electronics & Semiconductors': ['Semiconductor Materials', 'Rare Earth Materials', 'Electronic Components Bulk', 'Specialty Chemicals'],
  'Textile & Apparel': ['Industrial Solvents', 'Polymers', 'Specialty Chemicals', 'Carbon Composites'],
  'Food & Beverage Processing': ['Specialty Chemicals', 'Industrial Solvents', 'Resins and Compounds', 'Industrial Gases'],
  'Construction & Infrastructure': ['Steel', 'Aluminum', 'Cement Materials', 'Industrial Gases'],
  'Energy & Power': ['Steel', 'Nickel', 'Rare Earth Materials', 'Electronic Components Bulk'],
  'Chemical Manufacturing': ['Petrochemicals', 'Specialty Chemicals', 'Resins and Compounds', 'Industrial Solvents'],
  'Consumer Goods': ['Polymers', 'Engineering Plastics', 'Resins and Compounds', 'Electronic Components Bulk'],
  'Packaging': ['Engineering Plastics', 'Polymers', 'Aluminum', 'Specialty Chemicals'],
};

const budgetRanges = ['₹5L - ₹25L', '₹25L - ₹1Cr', '₹1Cr - ₹5Cr', '₹5Cr - ₹25Cr', '₹25Cr+'];

const buildCompanyProfilePic = (category, index) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#ABEBC6'
  ];
  const bgColor = colors[(index * 7) % colors.length];
  const initial = category.charAt(0).toUpperCase();
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='${encodeURIComponent(bgColor)}' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-weight='bold'%3E${initial}%3C/text%3E%3C/svg%3E`;
};

const generateCompanyEmail = (companyName, city) => {
  const cleanName = companyName.toLowerCase().replace(/\s+/g, '').substring(0, 12);
  const cleanCity = city.toLowerCase().substring(0, 3);
  return `contact@${cleanName}${cleanCity}.com`;
};

const generatePhone = (index) => {
  const areaCode = String(100 + (index % 900)).substring(1);
  const number = String(10000000 + (index * 7919 % 90000000));
  return `+91-${areaCode}-${number.substring(0, 4)}-${number.substring(4)}`;
};

const generateWebsite = (companyName) => {
  const cleanName = companyName.toLowerCase().replace(/\s+/g, '').substring(0, 15);
  return `www.${cleanName}.com`;
};

// Generate 250+ companies
window.COMPANY_DATABASE = Array.from({ length: 250 }, (_, index) => {
  const categoryIndex = index % companyCategories.length;
  const category = companyCategories[categoryIndex];
  const sizeIndex = index % companySizes.length;
  const size = companySizes[sizeIndex];
  const cityIndex = index % industrialCities.length;
  const city = industrialCities[cityIndex];
  
  const nameRoot = companyNameRoots[Math.floor(index / 3) % companyNameRoots.length];
  const nameEnding = companyNameEndings[index % companyNameEndings.length];
  const companyName = `${nameRoot} ${nameEnding}`;
  
  const contactFirstName = firstNames[index % firstNames.length];
  const contactLastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const contactPerson = `${contactFirstName} ${contactLastName}`;
  
  const budgetIndex = Math.floor(index / 50) % budgetRanges.length;
  const budget = budgetRanges[budgetIndex];
  
  // Get relevant buying categories for this company type
  const buyingCategories = industryToBuyingCategories[category] || [];
  const selectedBuyingCategories = buyingCategories.slice(0, 2 + (index % 2));
  
  // Estimate monthly purchase volume based on company size
  const volumeMultiplier = {
    'Startup': 100,
    'Small': 500,
    'Medium': 2000,
    'Large': 5000,
    'Enterprise': 10000
  };
  const monthlyPurchaseVolume = volumeMultiplier[size] + (index % 1000) * 10;
  
  // Average lead time in days
  const leadTimeDays = 7 + (index % 20);
  
  // Repeat order cycle in days
  const orderCycleDays = 30 + (index % 60);
  
  // Priority/rating based on size
  const priorityRating = {
    'Startup': '★★★',
    'Small': '★★★★',
    'Medium': '★★★★',
    'Large': '★★★★★',
    'Enterprise': '★★★★★'
  }[size];
  
  return {
    id: `COMP${String(index + 1).padStart(4, '0')}`,
    name: companyName,
    category: category,
    size: size,
    location: city,
    budget: budget,
    contactPerson: contactPerson,
    email: generateCompanyEmail(companyName, city),
    phone: generatePhone(index),
    whatsapp: `+91${String(9000000000 + (index * 123456) % 900000000)}`,
    website: generateWebsite(companyName),
    profilePic: buildCompanyProfilePic(category, index),
    buyingCategories: selectedBuyingCategories,
    monthlyPurchaseVolume: monthlyPurchaseVolume,
    leadTimeDays: leadTimeDays,
    orderCycleDays: orderCycleDays,
    priorityRating: priorityRating,
    accountStatus: index % 3 === 0 ? 'Suspended' : (index % 5 === 0 ? 'Under Review' : 'Active'),
    registeredDate: new Date(2024, Math.floor(index / 20), (index % 28) + 1).toISOString().split('T')[0],
    totalOrders: 5 + (index % 100),
    totalSpent: `₹${(1000000 + (index * 50000) % 50000000).toLocaleString('en-IN')}`,
    averageRating: (3.2 + (index % 20) * 0.1).toFixed(1),
    paymentTerm: ['Immediate', '7 Days', '15 Days', '30 Days'][index % 4],
    yearEstablished: 2015 + (index % 10),
    gst: `GST${String(index).padStart(5, '0')}IN001`
  };
});

console.log(`✅ Generated ${window.COMPANY_DATABASE.length} dummy companies`);
