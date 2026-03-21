const vendorNameRoots = [
    'Lakshmi', 'Bharat', 'Excel', 'Saraswati', 'Techno', 'Siddharth', 'United', 'Ashok', 'National', 'Premier',
    'Global', 'Raj', 'Shri', 'Fortune', 'Trimurti', 'Apollo', 'Crown', 'Bajaj', 'Tata', 'Jindal',
    'Essar', 'Hindalco', 'SAIL', 'Mishra', 'Supreme'
];

const vendorNameEndings = [
    'Industries Limited', 'Materials & Supplies', 'Trading Corporation', 'Solutions Private Ltd', 'Resources Group',
    'Manufacturing Co.', 'Export House', 'Traders & Suppliers', 'Enterprise Limited', 'Holdings Pvt Ltd'
];

const bulkRawCategories = [
    'Steel', 'Aluminum', 'Copper', 'Nickel', 'Zinc', 'Titanium Alloys', 'Industrial Alloys', 'Polymers',
    'Engineering Plastics', 'Petrochemicals', 'Specialty Chemicals', 'Industrial Solvents',
    'Resins and Compounds', 'Semiconductor Materials', 'Battery Raw Materials', 'Carbon Composites',
    'Silica and Minerals', 'Industrial Gases', 'Rare Earth Materials', 'Electronic Components Bulk'
];

const industrialCities = [
    'Mumbai', 'Pune', 'Nashik', 'Ahmedabad', 'Vadodara', 'Surat', 'Jaipur', 'Udaipur', 'Delhi', 'Noida',
    'Gurugram', 'Faridabad', 'Ludhiana', 'Chandigarh', 'Indore', 'Bhopal', 'Nagpur', 'Raipur', 'Hyderabad', 'Visakhapatnam',
    'Chennai', 'Coimbatore', 'Bengaluru', 'Mysuru', 'Kolkata', 'Durgapur', 'Jamshedpur', 'Ranchi', 'Bhubaneswar', 'Kochi'
];

const trustRatings = ['A+', 'A', 'A-', 'B+'];
const pricingBands = ['budget', 'standard', 'premium'];
const pricingUnits = [
    'INR 58/kg', 'INR 72/kg', 'INR 95/kg', 'INR 120/kg', 'INR 185/kg',
    'INR 240/kg', 'INR 310/kg', 'INR 420/kg', 'INR 560/kg', 'INR 780/kg'
];

const contactFirstNames = ['Amit', 'Ravi', 'Neha', 'Pooja', 'Karan', 'Vikram', 'Priya', 'Ankit', 'Sonia', 'Rahul'];
const contactLastNames = ['Sharma', 'Singh', 'Patel', 'Gupta', 'Mishra', 'Jain', 'Yadav', 'Bansal', 'Khan', 'Iyer'];

const categoryColorMap = {
    Steel: ['#1d4ed8', '#0ea5e9'],
    Aluminum: ['#475569', '#94a3b8'],
    Copper: ['#b45309', '#f59e0b'],
    Nickel: ['#334155', '#64748b'],
    Zinc: ['#0f766e', '#14b8a6'],
    'Titanium Alloys': ['#4338ca', '#6366f1'],
    'Industrial Alloys': ['#1e293b', '#3b82f6'],
    Polymers: ['#7c3aed', '#a855f7'],
    'Engineering Plastics': ['#0f766e', '#22d3ee'],
    Petrochemicals: ['#9a3412', '#f97316'],
    'Specialty Chemicals': ['#991b1b', '#ef4444'],
    'Industrial Solvents': ['#7f1d1d', '#f43f5e'],
    'Resins and Compounds': ['#4c1d95', '#8b5cf6'],
    'Semiconductor Materials': ['#1e1b4b', '#6366f1'],
    'Battery Raw Materials': ['#166534', '#22c55e'],
    'Carbon Composites': ['#111827', '#374151'],
    'Silica and Minerals': ['#92400e', '#f59e0b'],
    'Industrial Gases': ['#0c4a6e', '#0ea5e9'],
    'Rare Earth Materials': ['#7e22ce', '#d946ef'],
    'Electronic Components Bulk': ['#075985', '#38bdf8']
};

function buildProfilePic(category, vendorName) {
    const initials = category
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const [c1, c2] = categoryColorMap[category] || ['#0f172a', '#334155'];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="96" height="96" rx="18" fill="url(#g)"/><circle cx="48" cy="40" r="18" fill="rgba(255,255,255,0.22)"/><text x="48" y="75" text-anchor="middle" fill="#e2e8f0" font-size="14" font-family="Arial">${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

window.COMPANY_VENDOR_MATRIX = Array.from({ length: 120 }, (_, idx) => {
    const root = vendorNameRoots[idx % vendorNameRoots.length];
    const ending = vendorNameEndings[idx % vendorNameEndings.length];
    const category = bulkRawCategories[idx % bulkRawCategories.length];
    const location = industrialCities[idx % industrialCities.length];
    const trust = trustRatings[idx % trustRatings.length];
    const pricingBand = pricingBands[idx % pricingBands.length];
    const rating = (3.6 + ((idx * 0.17) % 1.4)).toFixed(1);
    const leadHours = 30 + (idx % 26);
    const savingsValue = (6.0 + ((idx * 1.37) % 8.5)).toFixed(1);
    const unitPrice = pricingUnits[idx % pricingUnits.length];
    const contactName = `${contactFirstNames[idx % contactFirstNames.length]} ${contactLastNames[idx % contactLastNames.length]}`;
    const phoneNumber = `+91 9${String(700000000 + idx * 137).slice(0, 9)}`;
    const whatsapp = `+91 8${String(600000000 + idx * 173).slice(0, 9)}`;
    const domainToken = `${root.toLowerCase()}${category.split(' ')[0].toLowerCase()}`;
    const email = `sales@${domainToken}.in`;
    const serial = String(idx + 1).padStart(3, '0');
    const vendorName = `${root} ${ending} ${serial}`;

    return {
        id: `VEND${serial}`,
        name: vendorName,
        trust,
        leadTime: `${leadHours}h`,
        savings: `${savingsValue}%`,
        rating,
        pricingBand,
        unitPrice,
        contactPerson: contactName,
        email,
        phone: phoneNumber,
        whatsapp,
        profilePic: buildProfilePic(category, vendorName),
        category,
        location
    };
});
