const { useEffect, useMemo, useRef, useState } = React;

const STORAGE_KEYS = {
    USER: 'bazar_react_user',
    THEME: 'bazar_react_theme',
    VENDOR_PROFILES: 'bazar_vendor_profiles',
    LANDING_IMAGE: 'bazar_landing_image',
    SAMPLE_REQUESTS: 'bazar_sample_requests'
};

const API_ENDPOINTS = {
    HEALTH: '/api/health',
    REGISTER: '/api/auth/register',
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp'
};

const LANDING_BG_IMAGE_CANDIDATES = [
    'assets/landing-page-bg.png',
    'assets/landing-page-bg.jpg',
    'assets/landing-page-bg.jpeg',
    'assets/landing-page-bg.webp',
    'assets/hero-bg.png',
    'assets/hero-bg.jpg',
    'landing-page-bg.png',
    'landing-page-bg.jpg'
];

const vendorInsights = [
    { label: 'Revenue Forecast', value: 'INR 8.4L', delta: '+12.4%' },
    { label: 'Inventory Health', value: '94%', delta: '+3%' },
    { label: 'Vendor Rating', value: '4.8/5', delta: '+0.3' }
];

const vendorOrderStages = [
    { label: 'New Leads', key: 'newLeads' },
    { label: 'Quoted', key: 'quoted' },
    { label: 'In Production', key: 'production' },
    { label: 'Dispatched', key: 'dispatched' }
];

const vendorActionModules = [
    { title: 'Quotation Follow-up', detail: '2 buyers waiting for revised quote', tone: 'text-amber-300' },
    { title: 'Inventory Refill', detail: 'Aluminum stock low for next 7 days', tone: 'text-cyan-300' },
    { title: 'Response SLA', detail: 'Average buyer response time 42 minutes', tone: 'text-emerald-300' }
];

const companyInsights = [
    { label: 'Open RFQs', value: '28', delta: '+6' },
    { label: 'Avg. Savings', value: '17%', delta: '+2.1%' },
    { label: 'On-time Vendors', value: '91%', delta: '+4%' }
];

const companyStrategicCards = [
    {
        label: 'Cost Leakage Monitor',
        title: 'Leakage under control',
        description: 'AI checks detected price drift across paint and hardware categories and auto-flagged re-negotiation windows.',
        tag: 'Finance AI'
    },
    {
        label: 'Supplier Confidence',
        title: 'Trust score map live',
        description: 'Performance heatmap updates every cycle using SLA adherence, rejection ratio and dispute closure speed.',
        tag: 'Risk Engine'
    },
    {
        label: 'Contact Details',
        title: 'Support and escalation desk',
        description: 'Email: support@bazarvendor.com | Phone: +91 98765 43210 | WhatsApp: +91 87654 32109',
        tag: 'Contact'
    }
];

const procurementPhases = [
    { label: 'Demand Mapping', progress: 92, tone: 'from-cyan-400 to-sky-500' },
    { label: 'Vendor Evaluation', progress: 78, tone: 'from-brand-400 to-amber-500' },
    { label: 'Negotiation Closure', progress: 64, tone: 'from-emerald-400 to-teal-500' },
    { label: 'Contract Finalization', progress: 47, tone: 'from-violet-400 to-indigo-500' }
];

const companyVendorMatrix = Array.isArray(window.COMPANY_VENDOR_MATRIX)
    ? window.COMPANY_VENDOR_MATRIX
    : [];

const spotlightItems = [
    { name: 'Teak Wood Plank', category: 'Woods', price: 'INR 2,500', score: 'High Demand' },
    { name: 'Industrial Drill Kit', category: 'Tools', price: 'INR 3,400', score: 'Stable Price' },
    { name: 'Premium Paint Base', category: 'Paint', price: 'INR 2,050', score: 'Rising Trend' }
];

const rfqComparisonRows = [
    { rfq: 'RFQ-2411-STEEL', vendor: 'Arora Industries 011', quote: 'INR 7.8L', lead: '36h', status: 'Negotiation' },
    { rfq: 'RFQ-2411-CHEM', vendor: 'Sterling Resources 044', quote: 'INR 5.2L', lead: '42h', status: 'Shortlisted' },
    { rfq: 'RFQ-2411-PLAS', vendor: 'Nexus Materials 073', quote: 'INR 3.6L', lead: '40h', status: 'Awaiting Sample' },
    { rfq: 'RFQ-2411-ALLOY', vendor: 'Prithvi Commodity 091', quote: 'INR 6.1L', lead: '33h', status: 'Approved' }
];

const communicationThreads = [
    { vendor: 'Arora Industries 011', channel: 'In-app Chat', topic: 'Price revision for bulk steel', updated: '12 min ago' },
    { vendor: 'Shreeji Global 052', channel: 'Email', topic: 'Sample dispatch confirmation', updated: '38 min ago' },
    { vendor: 'Horizon Raw Materials 067', channel: 'WhatsApp', topic: 'Lead-time commitment and SLA', updated: '1 hr ago' }
];

const adminKycQueue = [
    { vendor: 'Zenon Industrial Hub 004', docs: 'GST + PAN + Udyam', score: '92%', action: 'Approve' },
    { vendor: 'Parth Bulk Traders 028', docs: 'GST + Address Proof', score: '84%', action: 'Review' },
    { vendor: 'Sudarshan Supply Chain 045', docs: 'GST + PAN + Bank', score: '88%', action: 'Approve' }
];

const paymentMilestones = [
    { project: 'Steel Contract A', stage: 'Advance', amount: 'INR 2.0L', status: 'Released' },
    { project: 'Chemical Lot B', stage: 'Dispatch Milestone', amount: 'INR 1.3L', status: 'Escrow Hold' },
    { project: 'Polymer Bulk C', stage: 'Quality Clearance', amount: 'INR 1.1L', status: 'Pending' }
];

const growthModules = [
    { title: 'Featured Vendor Slots', detail: 'Promoted listing for high-intent buyers', tag: 'Monetization' },
    { title: 'Subscription Analytics', detail: 'Advanced dashboards for premium users', tag: 'SaaS Plan' },
    { title: 'Referral Engine', detail: 'Invite buyers/vendors and earn credits', tag: 'Acquisition' }
];

function getChatbotStarterMessage(language = 'english') {
    const text = language === 'hindi'
        ? 'Namaste! Main Bazar Vendor Help Bot hoon. Aap Hindi ya English me sawal puch sakte ho. Main aapko clear step-by-step instructions dunga.'
        : 'Hello! I am the Bazar Vendor Help Bot. You can ask in English or Hindi, and I will provide clear step-by-step instructions.';

    return {
        id: `bot-welcome-${language}`,
        sender: 'bot',
        text
    };
}

function detectHindiIntent(text) {
    const value = String(text || '').toLowerCase();
    const hasHindiScript = /[\u0900-\u097f]/.test(value);
    if (hasHindiScript) {
        return true;
    }
    return /(kaise|kya|mujhe|mujh|krna|karna|batao|samjhao|vendor|company|madad|sawaal|pr|ke|ki|ka)\b/.test(value);
}

function apiPost(url, payload) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(async (response) => {
            const data = await response.json().catch(() => ({}));
            return {
                ok: response.ok,
                status: response.status,
                data
            };
        })
        .catch(() => ({
            ok: false,
            status: 0,
            data: { message: 'Could not connect to server. Please run npm run dev.' }
        }));
}

function sanitizeProfileType(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'vendor' || normalized === 'company') {
        return normalized;
    }
    return 'vendor';
}

function getDashboardView(profileType) {
    return sanitizeProfileType(profileType) === 'company' ? 'company' : 'vendor';
}

function getStoredVendorProfiles() {
    const raw = localStorage.getItem(STORAGE_KEYS.VENDOR_PROFILES);
    if (!raw) {
        return {};
    }
    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(STORAGE_KEYS.VENDOR_PROFILES);
        return {};
    }
}

function getStoredSampleRequests() {
    const raw = localStorage.getItem(STORAGE_KEYS.SAMPLE_REQUESTS);
    if (!raw) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        localStorage.removeItem(STORAGE_KEYS.SAMPLE_REQUESTS);
        return [];
    }
}

function isVendorProfileComplete(profile) {
    if (!profile) {
        return false;
    }
    return [profile.storeName, profile.ownerName, profile.location, profile.contact].every((value) => String(value || '').trim().length > 0);
}

function getDefaultVendorProfile(user) {
    return {
        storeName: user?.businessName || '',
        ownerName: user?.name || '',
        location: user?.location || '',
        contact: user?.mobile || '',
        specialization: 'Building Materials',
        fulfillment: '48 Hours'
    };
}

function parseInrUnitPrice(value) {
    const match = String(value || '').match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : 100;
}

function formatInrAmount(value) {
    const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
    return `INR ${Math.max(safe, 0).toLocaleString('en-IN')}`;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function hashString(value) {
    let hash = 0;
    const input = String(value || '');
    for (let index = 0; index < input.length; index += 1) {
        hash = (hash << 5) - hash + input.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash);
}

function deriveVendorId(vendor) {
    if (vendor?.id) {
        return String(vendor.id);
    }

    const serialMatch = String(vendor?.name || '').match(/(\d{3,})$/);
    if (serialMatch) {
        return `VEND${serialMatch[1]}`;
    }

    return `VEND-${hashString(String(vendor?.name || 'unknown')).toString().slice(0, 6)}`;
}

function generateFallbackCompanyData() {
    const roots = ['Lakshmi', 'Bharat', 'Excel', 'Saraswati', 'Techno', 'United', 'Global', 'Apollo', 'Vertex', 'Quantum'];
    const endings = ['Manufacturing Company', 'Industries Limited', 'Productions Pvt Ltd', 'Solutions Inc.', 'Trading Company'];
    const categories = ['Automotive Manufacturing', 'Pharmaceuticals', 'Electronics & Semiconductors', 'Construction & Infrastructure', 'Packaging'];
    const cities = ['Mumbai', 'Pune', 'Delhi', 'Noida', 'Bengaluru', 'Hyderabad'];
    const sizes = ['Startup', 'Small', 'Medium', 'Large', 'Enterprise'];

    return Array.from({ length: 120 }, (_, index) => {
        const root = roots[index % roots.length];
        const ending = endings[index % endings.length];
        const category = categories[index % categories.length];
        const city = cities[index % cities.length];
        const size = sizes[index % sizes.length];
        const name = `${root} ${ending}`;

        return {
            id: `FALLBACK_COMP_${String(index + 1).padStart(4, '0')}`,
            name,
            category,
            size,
            location: city,
            budget: ['₹5L - ₹25L', '₹25L - ₹1Cr', '₹1Cr - ₹5Cr'][index % 3],
            contactPerson: `Manager ${index + 1}`,
            email: `contact${index + 1}@${root.toLowerCase()}${city.toLowerCase()}.com`,
            phone: `+91-9${String(100000000 + index).padStart(9, '0')}`,
            whatsapp: `+919${String(100000000 + index).padStart(9, '0')}`,
            website: `www.${root.toLowerCase()}${index + 1}.com`,
            profilePic: '',
            buyingCategories: ['Steel', 'Specialty Chemicals'],
            monthlyPurchaseVolume: 1000 + index * 10,
            leadTimeDays: 7 + (index % 20),
            orderCycleDays: 30 + (index % 40),
            priorityRating: '★★★★',
            accountStatus: 'Active',
            totalOrders: 5 + (index % 100),
            averageRating: (3.5 + ((index % 15) * 0.1)).toFixed(1),
            paymentTerm: ['Immediate', '7 Days', '15 Days', '30 Days'][index % 4],
            gst: `FALLBACKGST${String(index).padStart(5, '0')}`
        };
    });
}

// Link companies with suitable vendors based on buying categories
function matchVendorsForCompany(company, vendors) {
    if (!company || !Array.isArray(vendors)) {
        return [];
    }
    
    const companyBuyingCategories = Array.isArray(company.buyingCategories) ? company.buyingCategories : [];
    
    if (companyBuyingCategories.length === 0) {
        return vendors.slice(0, 5);
    }
    
    const matches = vendors.filter(vendor => {
        const vendorCategory = String(vendor.category || '').toLowerCase();
        return companyBuyingCategories.some(buyingCat => 
            vendorCategory.includes(buyingCat.toLowerCase()) || 
            buyingCat.toLowerCase().includes(vendorCategory)
        );
    });
    
    return matches.length > 0 ? matches : vendors.slice(0, 5);
}

// Get matched vendors for a specific company
function getCompanyVendorMatches(companyId, companies, vendors) {
    const company = Array.isArray(companies) 
        ? companies.find(c => c.id === companyId) 
        : null;
    
    if (!company) return [];
    
    return matchVendorsForCompany(company, vendors).slice(0, 10);
}

// Get all companies interested in a vendor's category
function getVendorInterestedCompanies(vendorCategory, companies) {
    if (!vendorCategory || !Array.isArray(companies)) {
        return [];
    }
    
    const category = String(vendorCategory).toLowerCase();
    
    return companies.filter(company => {
        const buyingCats = Array.isArray(company.buyingCategories) ? company.buyingCategories : [];
        return buyingCats.some(cat => 
            category.includes(cat.toLowerCase()) || 
            cat.toLowerCase().includes(category)
        );
    });
}

function LogoMark({ compact = false }) {
    return (
        <div className={`brand-mark ${compact ? 'compact' : ''}`}>
            <svg viewBox="0 0 64 64" aria-hidden="true">
                <defs>
                    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" />
                        <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                </defs>
                <path d="M12 18L32 7l20 11v28L32 57 12 46z" fill="url(#brandGrad)" opacity="0.95" />
                <path d="M32 7v50" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
                <path d="M12 18l20 11 20-11" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" />
                <path d="M12 46l20-11 20 11" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none" />
            </svg>
        </div>
    );
}

function BrandIdentity({ compact = false, centered = false, prominent = false }) {
    const className = ['brand-identity', compact ? 'compact' : '', centered ? 'centered' : '', prominent ? 'prominent' : '']
        .filter(Boolean)
        .join(' ');

    return (
        <div className={className}>
            <LogoMark compact={compact} />
            <div>
                <p className="brand-title">Bazar Vendor</p>
                <p className="brand-subtitle">Professional B2B Commerce Platform</p>
            </div>
        </div>
    );
}

function App() {
    const [view, setView] = useState('landing');
    const [viewHistory, setViewHistory] = useState([]);
    const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || 'dark');
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem(STORAGE_KEYS.USER);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch {
            localStorage.removeItem(STORAGE_KEYS.USER);
            return null;
        }
    });
    const [health, setHealth] = useState(null);
    const [toast, setToast] = useState('');
    const toastTimeoutRef = useRef(null);

    const [loginEmail, setLoginEmail] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [entryLoginRole, setEntryLoginRole] = useState('business');
    const [dashboardSearch, setDashboardSearch] = useState('');
    const [vendorCategoryFilter, setVendorCategoryFilter] = useState('all');
    const [vendorRatingFilter, setVendorRatingFilter] = useState('all');
    const [vendorPricingFilter, setVendorPricingFilter] = useState('all');
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const shellRef = useRef(null);
    const landingImageInputRef = useRef(null);

    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);

    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        mobile: '',
        profileType: 'vendor',
        businessName: '',
        location: ''
    });

    const [vendorProfile, setVendorProfile] = useState(getDefaultVendorProfile(null));
    const [vendorProfileReady, setVendorProfileReady] = useState(false);
    const [companyData, setCompanyData] = useState(() => (
        Array.isArray(window.COMPANY_DATABASE) && window.COMPANY_DATABASE.length > 0
            ? window.COMPANY_DATABASE
            : generateFallbackCompanyData()
    ));
    const [customLandingImage, setCustomLandingImage] = useState(() => localStorage.getItem(STORAGE_KEYS.LANDING_IMAGE) || '');
    const [defaultLandingImage, setDefaultLandingImage] = useState(LANDING_BG_IMAGE_CANDIDATES[0]);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [chatbotInput, setChatbotInput] = useState('');
    const [chatbotLanguage, setChatbotLanguage] = useState('auto');
    const [chatbotMessages, setChatbotMessages] = useState([getChatbotStarterMessage('english')]);
    const [selectedCompanyVendor, setSelectedCompanyVendor] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [companiesSearchQuery, setCompaniesSearchQuery] = useState('');
    const [sampleRequests, setSampleRequests] = useState(() => getStoredSampleRequests());

    function goToView(nextView, options = {}) {
        const { track = true, reset = false } = options;
        setView((currentView) => {
            if (currentView === nextView) {
                return currentView;
            }

            setViewHistory((prevHistory) => {
                if (reset) {
                    return [];
                }
                if (!track) {
                    return prevHistory;
                }
                return [...prevHistory, currentView];
            });

            return nextView;
        });
    }

    function goBack() {
        setViewHistory((prevHistory) => {
            if (prevHistory.length === 0) {
                setView('landing');
                return prevHistory;
            }

            const nextHistory = [...prevHistory];
            const previousView = nextHistory.pop();
            setView(previousView || 'landing');
            return nextHistory;
        });
    }

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }, [theme]);

    useEffect(() => {
        fetch(API_ENDPOINTS.HEALTH)
            .then((res) => res.json())
            .then((data) => setHealth(data))
            .catch(() => setHealth({ ok: false, message: 'Health check failed' }));
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const profileType = sanitizeProfileType(user.profileType);
        if (profileType === 'vendor') {
            const profiles = getStoredVendorProfiles();
            const key = user.email || user.id;
            const storedProfile = key ? profiles[key] : null;
            const mergedProfile = { ...getDefaultVendorProfile(user), ...(storedProfile || {}) };
            const ready = isVendorProfileComplete(mergedProfile);

            setVendorProfile(mergedProfile);
            setVendorProfileReady(ready);
            goToView(ready ? 'vendor' : 'vendor-profile', { track: false });
            return;
        }

        goToView(getDashboardView(profileType), { track: false });
    }, [user]);

    useEffect(() => {
        if (cooldown <= 0) {
            return undefined;
        }
        const timer = setInterval(() => {
            setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    useEffect(() => {
        if (Array.isArray(window.COMPANY_DATABASE) && window.COMPANY_DATABASE.length > 0) {
            setCompanyData(window.COMPANY_DATABASE);
            return undefined;
        }

        const timer = setInterval(() => {
            if (Array.isArray(window.COMPANY_DATABASE) && window.COMPANY_DATABASE.length > 0) {
                setCompanyData(window.COMPANY_DATABASE);
                clearInterval(timer);
            }
        }, 200);

        const fallbackTimer = setTimeout(() => {
            setCompanyData((prev) => (prev.length > 0 ? prev : generateFallbackCompanyData()));
        }, 1500);

        return () => {
            clearInterval(timer);
            clearTimeout(fallbackTimer);
        };
    }, []);

    useEffect(() => {
        let isCancelled = false;

        function probeImage(src) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
            });
        }

        async function resolveDefaultLandingImage() {
            for (const candidate of LANDING_BG_IMAGE_CANDIDATES) {
                const ok = await probeImage(candidate);
                if (ok) {
                    if (!isCancelled) {
                        setDefaultLandingImage(candidate);
                    }
                    return;
                }
            }
            if (!isCancelled) {
                setDefaultLandingImage(LANDING_BG_IMAGE_CANDIDATES[0]);
            }
        }

        resolveDefaultLandingImage();
        return () => {
            isCancelled = true;
        };
    }, []);

    const sceneMode = useMemo(() => {
        if (view.startsWith('vendor')) {
            return 'vendor';
        }
        if (view.startsWith('company')) {
            return 'company';
        }
        if (view === 'landing' || view === 'showcase') {
            return 'landing';
        }
        return 'neutral';
    }, [view]);

    function handleParallaxMove(event) {
        if (!shellRef.current) {
            return;
        }

        const rect = shellRef.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        shellRef.current.style.setProperty('--parallax-x', `${x.toFixed(4)}`);
        shellRef.current.style.setProperty('--parallax-y', `${y.toFixed(4)}`);
    }

    function handleParallaxLeave() {
        if (!shellRef.current) {
            return;
        }
        shellRef.current.style.setProperty('--parallax-x', '0');
        shellRef.current.style.setProperty('--parallax-y', '0');
    }

    function pushToast(message) {
        setToast(message);
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = setTimeout(() => setToast(''), 3000);
    }

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    function updateSignupField(field, value) {
        setSignupForm((prev) => ({ ...prev, [field]: value }));
    }

    function openRoleLogin(role) {
        setEntryLoginRole(role === 'vendor' ? 'vendor' : 'business');
        goToView('login');
    }

    function handleDemoLogin(role) {
        const loginRole = role === 'vendor' ? 'vendor' : 'company';

        if (loginRole === 'vendor') {
            const demoUser = {
                id: 'demo-vendor-siddharth-006',
                name: 'Vikram Jain',
                email: 'demo.siddharth006@bazarvendor.com',
                mobile: '9700000685',
                profileType: 'vendor',
                businessName: 'Siddharth Manufacturing Co. 006',
                location: 'Surat'
            };

            const profiles = getStoredVendorProfiles();
            profiles[demoUser.email] = {
                storeName: demoUser.businessName,
                ownerName: demoUser.name,
                location: demoUser.location,
                contact: demoUser.mobile,
                specialization: 'Titanium Alloys',
                fulfillment: '35 Hours',
                updatedAt: new Date().toISOString()
            };

            localStorage.setItem(STORAGE_KEYS.VENDOR_PROFILES, JSON.stringify(profiles));
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
            setUser(demoUser);
            setEntryLoginRole('vendor');
            setLoginEmail(demoUser.email);
            pushToast('Demo vendor login successful: Siddharth Manufacturing Co. 006');
            return;
        }

        const demoCompanyUser = {
            id: 'demo-company-procurement-001',
            name: 'Procurement Manager',
            email: 'demo.company@bazarvendor.com',
            mobile: '9876543210',
            profileType: 'company',
            businessName: 'Lakshmi Productions Pvt Ltd',
            location: 'Mumbai'
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoCompanyUser));
        setUser(demoCompanyUser);
        setEntryLoginRole('business');
        setLoginEmail(demoCompanyUser.email);
        pushToast('Demo company login successful.');
    }

    function handleDashboardSearchSubmit() {
        const query = dashboardSearch.trim();
        if (!query) {
            pushToast(view.startsWith('vendor') ? 'Please enter company keyword to search.' : 'Please enter vendor keyword to search.');
            return;
        }

        if (view.startsWith('company')) {
            goToView('company-search-results');
            return;
        }

        if (view.startsWith('vendor')) {
            goToView('vendor-company-search-results');
            return;
        }

        goToView('showcase');
    }

    function handleSampleRequest(vendor) {
        const requesterName = String(user?.businessName || user?.name || 'Company User').trim();
        const vendorId = deriveVendorId(vendor);
        const newRequest = {
            id: `sample-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            vendorId,
            vendorName: String(vendor?.name || 'Unknown Vendor'),
            vendorCategory: String(vendor?.category || 'General'),
            requesterName: requesterName || 'Company User',
            requesterEmail: String(user?.email || ''),
            createdAt: new Date().toISOString()
        };

        setSampleRequests((prev) => {
            const next = [newRequest, ...prev].slice(0, 60);
            localStorage.setItem(STORAGE_KEYS.SAMPLE_REQUESTS, JSON.stringify(next));
            return next;
        });

        const contact = vendor.whatsapp || vendor.phone || vendor.email || 'contact channel';
        pushToast(`Sample request sent to ${vendor.name} (${vendorId}) via ${contact}.`);
    }

    function clearSampleRequests() {
        setSampleRequests([]);
        localStorage.removeItem(STORAGE_KEYS.SAMPLE_REQUESTS);
        pushToast('Sample request notifications cleared.');
    }

    function openCompanyVendorProfile(vendor) {
        setSelectedCompanyVendor(vendor || null);
        goToView('company-vendor-profile');
    }

    function openCompanyProfile(company) {
        setSelectedCompany(company || null);
        goToView('company-profile');
    }

    function openCompanyStudio(company) {
        if (company) {
            setSelectedCompany(company);
        }
        goToView('company-studio');
    }

    function resolveChatbotLanguage(question) {
        if (chatbotLanguage === 'hindi' || chatbotLanguage === 'english') {
            return chatbotLanguage;
        }
        return detectHindiIntent(question) ? 'hindi' : 'english';
    }

    function getChatbotReply(question, language) {
        const text = String(question || '').toLowerCase();
        const role = sanitizeProfileType(user?.profileType || (view.startsWith('company') ? 'company' : 'vendor'));
        const isHindi = language === 'hindi';

        function formatInstructions(titleEn, titleHi, stepsEn, stepsHi) {
            const title = isHindi ? titleHi : titleEn;
            const steps = isHindi ? stepsHi : stepsEn;
            return `${title}\n1. ${steps[0]}\n2. ${steps[1]}\n3. ${steps[2]}\n4. ${steps[3]}`;
        }

        if (text.includes('rfq') || text.includes('quotation') || text.includes('quote') || text.includes('tender')) {
            return role === 'company'
                ? formatInstructions(
                    'Instructions: RFQ workflow for companies',
                    'Nirdesh: Company ke liye RFQ workflow',
                    ['Open Company Dashboard and search relevant vendors.', 'Apply category, rating, and pricing filters.', 'Send sample request to shortlisted vendors.', 'Finalize negotiation based on SLA and quote quality.'],
                    ['Company Dashboard me relevant vendors search karo.', 'Category, rating, aur pricing filters apply karo.', 'Shortlisted vendors ko sample request bhejo.', 'SLA aur quote quality ke basis par negotiation finalize karo.']
                )
                : formatInstructions(
                    'Instructions: Win more RFQs as a vendor',
                    'Nirdesh: Vendor ke roop me RFQ jeetne ka tareeka',
                    ['Keep profile and specialization complete.', 'Respond quickly to sample and quote requests.', 'Set transparent pricing band and lead time.', 'Follow up professionally on each active RFQ.'],
                    ['Profile aur specialization complete rakho.', 'Sample aur quote requests ka fast response do.', 'Pricing band aur lead time clear rakho.', 'Har active RFQ par professional follow-up karo.']
                );
        }

        if (text.includes('search') || text.includes('vendor') || text.includes('find supplier') || text.includes('category')) {
            return formatInstructions(
                'Instructions: Search and shortlist vendors',
                'Nirdesh: Vendor search aur shortlist',
                ['Enter material keyword in top search bar.', 'Select category, minimum rating, and pricing band.', 'Open results page and compare trust plus lead time.', 'Send sample request to best matching vendors.'],
                ['Top search bar me material keyword likho.', 'Category, minimum rating, aur pricing band select karo.', 'Results page par trust aur lead-time compare karo.', 'Best matching vendors ko sample request bhejo.']
            );
        }

        if (text.includes('sample') || text.includes('demo') || text.includes('specimen')) {
            return formatInstructions(
                'Instructions: Request and track samples',
                'Nirdesh: Sample request aur tracking',
                ['Open vendor search results card.', 'Click Request Sample for selected vendor.', 'Use email/phone/WhatsApp for confirmation.', 'Track dispatch and update status in operations flow.'],
                ['Vendor search results card open karo.', 'Selected vendor par Request Sample click karo.', 'Email/phone/WhatsApp se confirmation lo.', 'Dispatch track karke operations flow me status update karo.']
            );
        }

        if (text.includes('profile') || text.includes('onboard') || text.includes('kyc') || text.includes('setup')) {
            return role === 'vendor'
                ? formatInstructions(
                    'Instructions: Complete vendor profile setup',
                    'Nirdesh: Vendor profile setup complete karein',
                    ['Add store name, owner name, and location.', 'Add phone or WhatsApp contact details.', 'Select specialization and fulfillment timeline.', 'Save profile to unlock optimized recommendations.'],
                    ['Store name, owner name aur location bharo.', 'Phone ya WhatsApp contact details add karo.', 'Specialization aur fulfillment timeline choose karo.', 'Profile save karo taaki optimized recommendations milen.']
                )
                : formatInstructions(
                    'Instructions: Complete company onboarding',
                    'Nirdesh: Company onboarding complete karein',
                    ['Use registered business email for login.', 'Select Company role during signup/login.', 'Verify OTP and open procurement dashboard.', 'Use search plus comparison modules for sourcing.'],
                    ['Login ke liye registered business email use karo.', 'Signup/login me Company role select karo.', 'OTP verify karke procurement dashboard open karo.', 'Sourcing ke liye search aur comparison modules use karo.']
                );
        }

        if (text.includes('payment') || text.includes('escrow') || text.includes('invoice') || text.includes('milestone')) {
            return formatInstructions(
                'Instructions: Manage payment milestones',
                'Nirdesh: Payment milestones manage karein',
                ['Track advance, dispatch, and QC milestones.', 'Check escrow hold and pending status daily.', 'Verify invoice values against approved RFQ.', 'Escalate mismatches through admin workflow.'],
                ['Advance, dispatch aur QC milestones track karo.', 'Escrow hold aur pending status daily check karo.', 'Invoice values ko approved RFQ se verify karo.', 'Mismatch ho to admin workflow me escalate karo.']
            );
        }

        if (text.includes('delivery') || text.includes('lead time') || text.includes('sla') || text.includes('timeline')) {
            return formatInstructions(
                'Instructions: Improve SLA and delivery tracking',
                'Nirdesh: SLA aur delivery tracking improve karein',
                ['Shortlist vendors with strong trust and rating.', 'Compare lead time and fulfillment commitments.', 'Confirm SLA after sample approval.', 'Monitor delays and update communication thread.'],
                ['Strong trust aur rating wale vendors shortlist karo.', 'Lead time aur fulfillment commitments compare karo.', 'Sample approval ke baad SLA confirm karo.', 'Delay monitor karke communication thread update karo.']
            );
        }

        if (text.includes('support') || text.includes('help') || text.includes('contact') || text.includes('issue')) {
            return formatInstructions(
                'Instructions: Get support quickly',
                'Nirdesh: Support jaldi kaise lein',
                ['Use listed email, phone, or help desk channel.', 'Share issue type with screenshot and timestamp.', 'Mention account role and expected outcome.', 'Follow escalation contact if no reply within SLA.'],
                ['Listed email, phone ya help desk channel use karo.', 'Issue type ke saath screenshot aur timestamp bhejo.', 'Account role aur expected outcome mention karo.', 'SLA me response na mile to escalation contact use karo.']
            );
        }

        return role === 'company'
            ? (isHindi
                ? 'Nirdesh: Company help ke liye\n1. RFQ, vendor comparison, sample tracking ya payment se related sawal likho.\n2. Issue ko short aur specific rakho.\n3. Main aapko action-based steps dunga.\n4. Chahe to language selector se English/Hindi change karo.'
                : 'Instructions: Company help\n1. Ask about RFQ, vendor comparison, sample tracking, or payments.\n2. Keep your question specific and short.\n3. I will provide action-oriented steps.\n4. Use the language selector to switch English or Hindi anytime.')
            : (isHindi
                ? 'Nirdesh: Vendor help ke liye\n1. Profile, pricing, lead conversion, ya sample response par sawal puchho.\n2. Current problem ko one-line me define karo.\n3. Main practical step-by-step guidance dunga.\n4. Language selector se Hindi ya English choose karo.'
                : 'Instructions: Vendor help\n1. Ask about profile setup, pricing, lead conversion, or samples.\n2. Describe your current problem in one line.\n3. I will provide practical step-by-step guidance.\n4. Use the language selector to choose English or Hindi.');
    }

    function submitChatbotMessage(rawMessage) {
        const message = String(rawMessage || '').trim();
        if (!message) {
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            sender: 'user',
            text: message
        };

        const botMessage = {
            id: `bot-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            sender: 'bot',
            text: getChatbotReply(message, resolveChatbotLanguage(message))
        };

        setChatbotMessages((prev) => [...prev, userMessage, botMessage]);
        setChatbotInput('');
    }

    const chatbotQuickPrompts = useMemo(() => {
        const language = chatbotLanguage === 'hindi' ? 'hindi' : 'english';
        const role = sanitizeProfileType(user?.profileType || (view.startsWith('company') ? 'company' : 'vendor'));
        if (language === 'hindi') {
            return role === 'company'
                ? ['RFQ workflow ke steps batao', 'Vendor shortlist kaise karein?', 'Sample request process batao']
                : ['Vendor profile complete kaise karun?', 'Lead conversion kaise improve karein?', 'Pricing strategy kaise set karein?'];
        }
        return role === 'company'
            ? ['Show RFQ workflow steps', 'How to shortlist vendors?', 'Explain sample request process']
            : ['How to complete vendor profile?', 'How to improve lead conversion?', 'How to set pricing strategy?'];
    }, [user, view, chatbotLanguage]);

    useEffect(() => {
        const languageForGreeting = chatbotLanguage === 'hindi' ? 'hindi' : 'english';
        setChatbotMessages((prev) => {
            if (prev.length > 1) {
                return prev;
            }
            return [getChatbotStarterMessage(languageForGreeting)];
        });
    }, [chatbotLanguage]);

    function resetSignup() {
        setSignupForm({
            name: '',
            email: '',
            mobile: '',
            profileType: 'vendor',
            businessName: '',
            location: ''
        });
    }

    async function handleSignup(event) {
        event.preventDefault();
        if (isAuthLoading) {
            return;
        }

        const payload = {
            name: signupForm.name.trim(),
            email: signupForm.email.trim().toLowerCase(),
            mobile: signupForm.mobile.replace(/\D/g, ''),
            profileType: sanitizeProfileType(signupForm.profileType),
            businessName: signupForm.businessName.trim(),
            location: signupForm.location.trim()
        };

        if (!payload.name || !payload.email || !payload.mobile || !payload.businessName || !payload.location) {
            pushToast('Please fill all signup fields.');
            return;
        }

        setIsAuthLoading(true);
        const result = await apiPost(API_ENDPOINTS.REGISTER, payload);
        setIsAuthLoading(false);

        if (!result.ok) {
            pushToast(result.data.message || 'Signup failed. Please try again.');
            return;
        }

        pushToast(result.data.message || 'Signup success. Continue with OTP login.');
        setLoginEmail(payload.email);
        setAuthEmail(payload.email);
        resetSignup();
        goToView('login');
    }

    async function handleSendOtp() {
        if (isAuthLoading) {
            return;
        }

        const email = loginEmail.trim().toLowerCase();
        if (!email) {
            pushToast('Please enter your registered email.');
            return;
        }

        setIsAuthLoading(true);
        const result = await apiPost(API_ENDPOINTS.SEND_OTP, { email });
        setIsAuthLoading(false);

        if (!result.ok) {
            pushToast(result.data.message || 'Failed to send OTP.');
            return;
        }

        setAuthEmail(email);
        setOtpDigits(['', '', '', '', '', '']);
        setCooldown(30);
        goToView('otp');
        pushToast(result.data.message || 'OTP sent to your email.');
    }

    async function handleResendOtp() {
        if (isAuthLoading || cooldown > 0) {
            return;
        }
        if (!authEmail) {
            pushToast('Please send OTP first.');
            goToView('login');
            return;
        }

        setIsAuthLoading(true);
        const result = await apiPost(API_ENDPOINTS.SEND_OTP, { email: authEmail });
        setIsAuthLoading(false);

        if (!result.ok) {
            pushToast(result.data.message || 'Failed to resend OTP.');
            return;
        }

        setCooldown(30);
        pushToast(result.data.message || 'OTP resent successfully.');
    }

    async function handleVerifyOtp() {
        if (isAuthLoading) {
            return;
        }

        const otp = otpDigits.join('');
        if (!authEmail || otp.length !== 6) {
            pushToast('Enter the 6-digit OTP sent to your email.');
            return;
        }

        setIsAuthLoading(true);
        const result = await apiPost(API_ENDPOINTS.VERIFY_OTP, { email: authEmail, otp });
        setIsAuthLoading(false);

        if (!result.ok) {
            pushToast(result.data.message || 'OTP verification failed.');
            return;
        }

        const verifiedUser = {
            id: result.data.user?.id || null,
            name: result.data.user?.name || 'Business User',
            email: result.data.user?.email || authEmail,
            mobile: result.data.user?.mobile || '',
            profileType: sanitizeProfileType(result.data.user?.profileType),
            businessName: result.data.user?.businessName || 'Business Account',
            location: result.data.user?.location || ''
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(verifiedUser));
        setUser(verifiedUser);
        goToView(getDashboardView(verifiedUser.profileType), { track: false });
        pushToast('Login successful. Welcome back.');
    }

    function handleOtpDigitChange(index, value) {
        const digit = value.replace(/\D/g, '').slice(-1);
        setOtpDigits((prev) => {
            const next = [...prev];
            next[index] = digit;
            return next;
        });

        if (digit && otpRefs.current[index + 1]) {
            otpRefs.current[index + 1].focus();
        }
    }

    function handleOtpKeyDown(index, event) {
        if (event.key === 'Backspace' && !otpDigits[index] && otpRefs.current[index - 1]) {
            otpRefs.current[index - 1].focus();
        }
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
        setAuthEmail('');
        setLoginEmail('');
        setOtpDigits(['', '', '', '', '', '']);
        setVendorProfile(getDefaultVendorProfile(null));
        setVendorProfileReady(false);
        goToView('landing', { reset: true, track: false });
    }

    function onPickLandingImage() {
        if (landingImageInputRef.current) {
            landingImageInputRef.current.click();
        }
    }

    function onLandingImageSelected(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            pushToast('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const result = String(reader.result || '');
            if (!result) {
                pushToast('Could not read selected image.');
                return;
            }

            setCustomLandingImage(result);
            localStorage.setItem(STORAGE_KEYS.LANDING_IMAGE, result);
            pushToast('Landing background image updated.');
        };
        reader.onerror = () => {
            pushToast('Image upload failed. Please try another file.');
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    function resetLandingImage() {
        setCustomLandingImage('');
        localStorage.removeItem(STORAGE_KEYS.LANDING_IMAGE);
        pushToast('Default landing background restored.');
    }

    function handleVendorProfileField(field, value) {
        setVendorProfile((prev) => ({ ...prev, [field]: value }));
    }

    function saveVendorProfile() {
        if (!user || sanitizeProfileType(user.profileType) !== 'vendor') {
            return;
        }

        if (!isVendorProfileComplete(vendorProfile)) {
            pushToast('Please complete all required profile fields.');
            return;
        }

        const profiles = getStoredVendorProfiles();
        const key = user.email || user.id;
        if (key) {
            profiles[key] = {
                ...vendorProfile,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.VENDOR_PROFILES, JSON.stringify(profiles));
        }

        const updatedUser = {
            ...user,
            businessName: vendorProfile.storeName,
            name: vendorProfile.ownerName,
            location: vendorProfile.location,
            mobile: vendorProfile.contact
        };

        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        setUser(updatedUser);
        setVendorProfileReady(true);
        goToView('vendor-onboarding-done');
        pushToast('Profile saved successfully. Your vendor workspace is now ready.');
    }

    const statusBadge = useMemo(() => {
        if (!health) {
            return { className: 'status-amber', text: 'Checking backend' };
        }
        if (health.ok) {
            return {
                className: 'status-green',
                text: `Node API online | Registered users: ${health.registeredUsers || 0}`
            };
        }
        return { className: 'status-red', text: 'Backend disconnected' };
    }, [health]);

    const activeLandingImage = customLandingImage || defaultLandingImage;
    const isUsingCustomLandingImage = Boolean(customLandingImage);
    const vendorCategoryOptions = useMemo(() => {
        const categories = new Set(companyVendorMatrix.map((vendor) => vendor.category).filter(Boolean));
        return Array.from(categories).sort((a, b) => a.localeCompare(b));
    }, []);

    const filteredCompanyVendors = useMemo(() => {
        const query = dashboardSearch.trim().toLowerCase();
        return companyVendorMatrix.filter((vendor) => {
            const searchable = `${vendor.name} ${vendor.category || ''} ${vendor.location || ''} ${vendor.trust} ${vendor.pricingBand || ''} ${vendor.rating || ''}`.toLowerCase();
            const searchMatch = !query || searchable.includes(query);
            const categoryMatch = vendorCategoryFilter === 'all' || vendor.category === vendorCategoryFilter;
            const ratingMatch = vendorRatingFilter === 'all' || Number(vendor.rating || 0) >= Number(vendorRatingFilter);
            const pricingMatch = vendorPricingFilter === 'all' || String(vendor.pricingBand || '').toLowerCase() === vendorPricingFilter;

            return searchMatch && categoryMatch && ratingMatch && pricingMatch;
        });
    }, [dashboardSearch, vendorCategoryFilter, vendorRatingFilter, vendorPricingFilter]);

    const bestSellerVendors = useMemo(() => {
        function parseUnitPrice(value) {
            const match = String(value || '').match(/\d+(?:\.\d+)?/);
            return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
        }

        return [...filteredCompanyVendors]
            .sort((a, b) => {
                const ratingDiff = Number(b.rating || 0) - Number(a.rating || 0);
                if (ratingDiff !== 0) {
                    return ratingDiff;
                }
                return parseUnitPrice(a.unitPrice) - parseUnitPrice(b.unitPrice);
            })
            .slice(0, 5);
    }, [filteredCompanyVendors]);

    const selectedVendorWebsiteSales = useMemo(() => {
        if (!selectedCompanyVendor) {
            return null;
        }

        const vendorHash = hashString(selectedCompanyVendor.name);
        const unitPrice = parseInrUnitPrice(selectedCompanyVendor.unitPrice);
        const rating = Number(selectedCompanyVendor.rating || 4);
        const monthlyOrders = 140 + (vendorHash % 190);
        const repeatBuyerRate = 42 + (vendorHash % 33);
        const websiteSalesValue = Math.round((monthlyOrders * unitPrice * (18 + rating * 4)) / 1000) / 10;

        return {
            monthlyOrders,
            repeatBuyerRate,
            websiteSales: `INR ${websiteSalesValue.toFixed(1)}L`
        };
    }, [selectedCompanyVendor]);

    const recentSampleRequests = useMemo(() => sampleRequests.slice(0, 5), [sampleRequests]);

    const activeStudioCompany = useMemo(() => {
        if (selectedCompany) {
            return selectedCompany;
        }

        const businessName = String(user?.businessName || '').trim().toLowerCase();
        if (businessName) {
            const matched = companyData.find((company) => String(company?.name || '').trim().toLowerCase() === businessName);
            if (matched) {
                return matched;
            }
        }

        return companyData[0] || null;
    }, [selectedCompany, companyData, user?.businessName]);

    const companyStudioItems = useMemo(() => {
        if (!activeStudioCompany) {
            return spotlightItems;
        }

        const categories = Array.isArray(activeStudioCompany.buyingCategories) && activeStudioCompany.buyingCategories.length > 0
            ? activeStudioCompany.buyingCategories
            : [activeStudioCompany.category || 'Industrial Materials'];
        const baseVolume = Number(activeStudioCompany.monthlyPurchaseVolume || 1200);
        const budgetText = String(activeStudioCompany.budget || '');
        const budgetMultiplier = budgetText.includes('25Cr')
            ? 1.35
            : budgetText.includes('5Cr')
                ? 1.2
                : budgetText.includes('1Cr')
                    ? 1.08
                    : 1;

        const normalized = categories.slice(0, 3);
        while (normalized.length < 3) {
            normalized.push(activeStudioCompany.category || 'Industrial Materials');
        }

        return normalized.map((category, index) => {
            const lotPrice = Math.round(((baseVolume / (3 + index)) * (1.65 + index * 0.3) * budgetMultiplier));
            const demandLabel = index === 0 ? 'Cost Optimized' : (index === 1 ? 'Fast Fulfillment' : 'Strategic Buffer');
            return {
                name: `${category} ${index === 0 ? 'Lot' : index === 1 ? 'Kit' : 'Reserve'}`,
                category,
                price: formatInrAmount(lotPrice),
                score: demandLabel
            };
        });
    }, [activeStudioCompany]);

    const companyStudioNegotiationBands = useMemo(() => {
        if (!activeStudioCompany) {
            return [{ band: 'Conservative', value: '63%' }, { band: 'Balanced', value: '78%' }, { band: 'Aggressive', value: '84%' }];
        }

        const rating = Number(activeStudioCompany.averageRating || 4);
        const totalOrders = Number(activeStudioCompany.totalOrders || 20);
        const accountStatus = String(activeStudioCompany.accountStatus || 'Active');
        const statusBoost = accountStatus === 'Active' ? 4 : (accountStatus === 'Under Review' ? -2 : -6);
        const base = Math.round(52 + Math.min(totalOrders, 120) * 0.12 + (rating - 3) * 6 + statusBoost);
        const conservative = clamp(base, 45, 88);
        const balanced = clamp(conservative + 12, 55, 94);
        const aggressive = clamp(balanced + 7, 62, 98);

        return [
            { band: 'Conservative', value: `${conservative}%` },
            { band: 'Balanced', value: `${balanced}%` },
            { band: 'Aggressive', value: `${aggressive}%` }
        ];
    }, [activeStudioCompany]);

    const companyKpiChart = useMemo(() => {
        const parsed = companyInsights.map((item) => {
            const match = String(item.value || '').match(/\d+(?:\.\d+)?/);
            const numeric = match ? Number(match[0]) : 0;
            return {
                label: item.label,
                display: item.value,
                numeric
            };
        });

        const max = Math.max(...parsed.map((item) => item.numeric), 1);
        return parsed.map((item) => ({
            ...item,
            heightPercent: Math.max((item.numeric / max) * 100, 12)
        }));
    }, []);

    const vendorDashboardAnalytics = useMemo(() => {
        const seed = hashString(user?.email || user?.name || 'vendor');
        const weeklySales = [
            4.2 + (seed % 8) * 0.12,
            5.1 + (seed % 7) * 0.13,
            5.8 + (seed % 6) * 0.14,
            6.6 + (seed % 5) * 0.15,
            7.3 + (seed % 4) * 0.16,
            8.1 + (seed % 3) * 0.18
        ];
        const weeklyLabels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
        const maxWeekly = Math.max(...weeklySales, 1);
        const orderStages = {
            newLeads: 18 + (seed % 11),
            quoted: 13 + (seed % 9),
            production: 9 + (seed % 7),
            dispatched: 14 + (seed % 8)
        };

        return {
            weeklySales: weeklySales.map((value, index) => ({
                label: weeklyLabels[index],
                value: Number(value.toFixed(1)),
                heightPercent: Math.max((value / maxWeekly) * 100, 16)
            })),
            orderStages,
            websiteLeads: 120 + (seed % 80),
            conversionRate: Number((17 + (seed % 9) * 0.7).toFixed(1)),
            pendingFollowUps: 4 + (seed % 4)
        };
    }, [user]);

    const filteredVendorDashboardCompanies = useMemo(() => {
        const query = dashboardSearch.trim().toLowerCase();
        const companies = companyData;

        if (!query) {
            return companies;
        }

        return companies.filter((company) => {
            const searchable = `${company.name} ${company.location || ''} ${company.category || ''} ${company.size || ''} ${company.budget || ''}`.toLowerCase();
            return searchable.includes(query);
        });
    }, [companyData, dashboardSearch]);

    const filteredCompaniesBrowse = useMemo(() => {
        const query = companiesSearchQuery.trim().toLowerCase();
        const companies = companyData;
        
        if (!query) {
            return companies;
        }
        
        return companies.filter(company => {
            const searchable = `${company.name} ${company.category || ''} ${company.location || ''} ${company.size || ''} ${company.budget || ''}`.toLowerCase();
            return searchable.includes(query);
        });
    }, [companyData, companiesSearchQuery]);

    const isAuthView = view === 'login' || view === 'signup' || view === 'otp';
    const isLandingView = view === 'landing';
    const isDashboardView = view.startsWith('vendor') || view.startsWith('company');
    const showBackIcon = !isLandingView;

    return (
        <div
            ref={shellRef}
            className={`app-shell font-body min-h-screen scene-${sceneMode}`}
            onMouseMove={handleParallaxMove}
            onMouseLeave={handleParallaxLeave}
        >
            <div className="ambient-grid" />
            <div className="ambient-orb orb-one" aria-hidden="true" />
            <div className="ambient-orb orb-two" aria-hidden="true" />
            <Image3DBackground mode={sceneMode} imageSrc={activeLandingImage} />

            {showBackIcon ? (
                <button
                    className="back-icon-btn"
                    type="button"
                    onClick={goBack}
                    aria-label="Go back"
                    title="Go back"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 5L8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            ) : null}

            {toast ? (
                <div className="toast-float">{toast}</div>
            ) : null}

            <header className="w-full max-w-6xl mx-auto px-4 pt-6">
                {isLandingView ? (
                    <div className="landing-top-nav glass-panel">
                        <div className="landing-top-left">
                            <LogoMark compact />
                            <div>
                                <p className="brand-title">Bazar Vendor</p>
                                <p className="brand-subtitle">Your marketplace for woods, paint, tools & more</p>
                            </div>
                        </div>
                        <div className="landing-nav-menu">
                            <button className="chip-btn" type="button">Features</button>
                            <button className="chip-btn" type="button">Vendors</button>
                            <button className="chip-btn" type="button">Pricing</button>
                            <button
                                className="chip-btn"
                                type="button"
                                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                            >
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <button className="chip-btn" type="button" onClick={() => goToView('login')}>Sign In</button>
                            <button className="btn-pro nav-cta" type="button" onClick={() => goToView('signup')}>Sign Up</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="header-brand-wrap">
                            <BrandIdentity centered prominent />
                        </div>

                        <div className="header-actions">
                            {isDashboardView ? (
                                <div className="dashboard-top-search" role="search" aria-label={view.startsWith('vendor') ? "Companies search" : "Vendors search"}>
                                    <div className="dashboard-search-wrap">
                                        <input
                                            className="dashboard-search-input"
                                            type="search"
                                            value={dashboardSearch}
                                            onChange={(e) => setDashboardSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleDashboardSearchSubmit();
                                                }
                                            }}
                                            placeholder={view.startsWith('vendor') ? "Search companies by name, location, category..." : "Search vendors by name, category, location..."}
                                            aria-label={view.startsWith('vendor') ? "Search companies" : "Search vendor"}
                                        />
                                        <button
                                            className="dashboard-search-btn"
                                            type="button"
                                            onClick={handleDashboardSearchSubmit}
                                            aria-label="Search and open next page"
                                            title="Search"
                                        >
                                            <span className="dashboard-search-icon dashboard-search-icon-right" aria-hidden="true">🔎</span>
                                        </button>
                                    </div>
                                    {view.startsWith('company') ? (
                                        <div className="dashboard-search-filters">
                                            <select
                                                className="dashboard-filter-select"
                                                value={vendorCategoryFilter}
                                                onChange={(e) => setVendorCategoryFilter(e.target.value)}
                                                aria-label="Filter vendors by category"
                                            >
                                                <option value="all">All Categories</option>
                                                {vendorCategoryOptions.map((category) => (
                                                    <option key={category} value={category}>{category}</option>
                                                ))}
                                            </select>
                                            <select
                                                className="dashboard-filter-select"
                                                value={vendorRatingFilter}
                                                onChange={(e) => setVendorRatingFilter(e.target.value)}
                                                aria-label="Filter vendors by rating"
                                            >
                                                <option value="all">Any Rating</option>
                                                <option value="4.5">4.5+ Rating</option>
                                                <option value="4.0">4.0+ Rating</option>
                                                <option value="3.5">3.5+ Rating</option>
                                            </select>
                                            <select
                                                className="dashboard-filter-select"
                                                value={vendorPricingFilter}
                                                onChange={(e) => setVendorPricingFilter(e.target.value)}
                                                aria-label="Filter vendors by pricing"
                                            >
                                                <option value="all">All Pricing</option>
                                                <option value="budget">Budget</option>
                                                <option value="standard">Standard</option>
                                                <option value="premium">Premium</option>
                                            </select>
                                        </div>
                                    ) : null}
                                </div>
                            ) : null}
                            <span className={`status-pill ${statusBadge.className}`}>{statusBadge.text}</span>
                            {isLandingView ? (
                                <button className="chip-btn" type="button" onClick={() => goToView('showcase')}>
                                    Explore Features
                                </button>
                            ) : null}
                            <button
                                className="chip-btn"
                                onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
                                type="button"
                            >
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        </div>
                    </>
                )}
            </header>

            <main className={`w-full max-w-6xl mx-auto px-4 pb-10 ${isAuthView ? 'pt-6 min-h-[calc(100vh-120px)] flex items-center justify-center' : 'pt-6'}`}>
                {view === 'landing' ? (
                    <section className="landing-wrap">
                        <div className="landing-hero glass-panel p-6 md:p-8">
                            <div className="landing-glow-shape glow-a" />
                            <div className="landing-glow-shape glow-b" />
                            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-center relative z-10">
                                <div>
                                    <p className="badge-pill">BAZAR VENDOR PLATFORM</p>
                                    <h1 className="font-display text-4xl md:text-6xl leading-tight text-slate-100 mt-3">
                                        Find Trusted Vendors Instantly
                                    </h1>
                                    <p className="text-slate-300 text-base md:text-lg mt-3 max-w-2xl">
                                        Bazar Vendor helps procurement teams discover trusted suppliers, compare capabilities, and accelerate business decisions with confidence.
                                    </p>

                                    <div className="flex gap-3 mt-5 flex-wrap">
                                        <button className="btn-pro landing-main-cta" type="button" onClick={() => goToView('signup')}>
                                            Start Free Trial
                                        </button>
                                        <button className="btn-soft" type="button" onClick={() => openRoleLogin('business')}>
                                            Explore Platform
                                        </button>
                                    </div>

                                    <div className="hero-metric-row mt-5">
                                        <div className="hero-metric-card">
                                            <p>Verified Vendors</p>
                                            <h4>12K+</h4>
                                        </div>
                                        <div className="hero-metric-card">
                                            <p>Avg Match Time</p>
                                            <h4>2.4 min</h4>
                                        </div>
                                        <div className="hero-metric-card">
                                            <p>Procurement Savings</p>
                                            <h4>18%</h4>
                                        </div>
                                    </div>

                                </div>

                                <div className="landing-anime-scene" aria-label="Bulk materials animated scene">
                                    <div className="anime-grid" />
                                    <div className="anime-center-logo">
                                        <LogoMark compact />
                                        <p>Bazar Vendor</p>
                                    </div>

                                    <div className="anime-bulk-card card-wood">
                                        <span className="material-pill">WOOD</span>
                                        <h4>Bulk Timber Lots</h4>
                                        <p>Container-ready stock</p>
                                    </div>

                                    <div className="anime-bulk-card card-metal">
                                        <span className="material-pill">METAL</span>
                                        <h4>Steel Sheet Bundles</h4>
                                        <p>Industrial grade supply</p>
                                    </div>

                                    <div className="anime-bulk-card card-alloy">
                                        <span className="material-pill">ALLOY</span>
                                        <h4>Coils & Profiles</h4>
                                        <p>High-volume dispatch</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="landing-feature-grid">
                            {[
                                {
                                icon: '⚡',
                                title: 'Instant Vendor Match',
                                text: 'Smart filters and AI ranking connect you with qualified suppliers in seconds.'
                                },
                                {
                                icon: '🛡️',
                                title: 'Trust & Compliance Layer',
                                text: 'Background checks, certifications, and performance scores in one secure profile.'
                                },
                                {
                                icon: '📞',
                                title: 'Contact Details',
                                text: 'Gmail: support@bazarvendor.com | Call: +91 98765 43210 | Help Desk: help@bazarvendor.com'
                                }
                            ].map((card) => (
                                <div className="three-card p-4" key={card.title}>
                                    <div className="feature-icon-glow" aria-hidden="true">{card.icon}</div>
                                    <h3 className="font-display text-lg text-slate-100">{card.title}</h3>
                                    {card.title === 'Contact Details' ? (
                                        <div className="contact-card-list mt-2">
                                            <div className="contact-card-row">
                                                <span className="contact-card-label">Gmail</span>
                                                <a className="contact-card-value" href="mailto:support@bazarvendor.com">support@bazarvendor.com</a>
                                            </div>
                                            <div className="contact-card-row">
                                                <span className="contact-card-label">Call</span>
                                                <a className="contact-card-value" href="tel:+919876543210">+91 98765 43210</a>
                                            </div>
                                            <div className="contact-card-row">
                                                <span className="contact-card-label">Help Desk</span>
                                                <a className="contact-card-value" href="mailto:help@bazarvendor.com">help@bazarvendor.com</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 mt-2">{card.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="landing-login-section glass-panel p-5 md:p-6 mt-4">
                            <div>
                                <p className="badge-pill">LOGIN ACCESS</p>
                                <h3 className="font-display text-2xl md:text-3xl text-slate-100 mt-3">Choose your login section</h3>
                                <p className="text-slate-300 text-sm md:text-base mt-2">Pick the portal that matches your workflow and continue with secure OTP login.</p>
                            </div>
                            <div className="landing-login-grid landing-login-grid-spaced mt-4">
                                <button className="role-login-card" type="button" onClick={() => openRoleLogin('vendor')}>
                                    <span className="role-login-icon" aria-hidden="true">🛠️</span>
                                    <h4>Vendor Login</h4>
                                    <p>Manage catalog, pricing, and inventory operations.</p>
                                </button>
                                <button className="role-login-card" type="button" onClick={() => openRoleLogin('business')}>
                                    <span className="role-login-icon" aria-hidden="true">🏢</span>
                                    <h4>Business Login</h4>
                                    <p>Find vendors, compare offers, and run procurement.</p>
                                </button>
                            </div>
                        </div>
                    </section>
                ) : null}

                {view === 'login' ? (
                    <GlassPanel
                        title="Secure Business Login"
                        subtitle={entryLoginRole === 'vendor' ? 'Vendor access: use your registered email to receive OTP.' : 'Business access: only registered business emails can receive OTP.'}
                        showBrand
                        size="auth"
                    >
                        <div className="grid gap-4">
                            <InputLabel label="Registered Email" />
                            <input
                                className="input-pro"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                placeholder="you@company.com"
                                type="email"
                            />

                            <InputLabel label="Login Type" />
                            <select
                                className="input-pro"
                                value={entryLoginRole}
                                onChange={(e) => setEntryLoginRole(e.target.value === 'vendor' ? 'vendor' : 'business')}
                            >
                                <option value="business">Company</option>
                                <option value="vendor">Vendor</option>
                            </select>

                            <button className="btn-pro" type="button" onClick={handleSendOtp} disabled={isAuthLoading}>
                                {isAuthLoading ? 'Sending OTP...' : 'Send OTP'}
                            </button>

                            <div className="flex flex-wrap gap-3">
                                <button className="btn-soft" type="button" onClick={() => goToView('signup')}>
                                    Create New Account
                                </button>
                                <button className="btn-soft" type="button" onClick={() => goToView('showcase')}>
                                    Open Experience Deck
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button className="btn-soft" type="button" onClick={() => handleDemoLogin('vendor')}>
                                    Demo Login: Siddharth 006
                                </button>
                                <button className="btn-soft" type="button" onClick={() => handleDemoLogin('company')}>
                                    Demo Login: Company
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'signup' ? (
                    <GlassPanel
                        title="Create Business Account"
                        subtitle="Register once, then login anytime using Gmail OTP."
                        showBrand
                        size="auth"
                    >
                        <form className="grid gap-3" onSubmit={handleSignup}>
                            <InputLabel label="Full Name" />
                            <input
                                className="input-pro"
                                value={signupForm.name}
                                onChange={(e) => updateSignupField('name', e.target.value)}
                                placeholder="Owner name"
                                autoComplete="name"
                            />

                            <InputLabel label="Business Email" />
                            <input
                                className="input-pro"
                                type="email"
                                value={signupForm.email}
                                onChange={(e) => updateSignupField('email', e.target.value)}
                                placeholder="business@gmail.com"
                                autoComplete="email"
                            />

                            <div className="grid md:grid-cols-2 gap-3">
                                <div>
                                    <InputLabel label="Mobile" />
                                    <input
                                        className="input-pro"
                                        value={signupForm.mobile}
                                        onChange={(e) => updateSignupField('mobile', e.target.value)}
                                        placeholder="10-digit number"
                                    />
                                </div>

                                <div>
                                    <InputLabel label="Role" />
                                    <select
                                        className="input-pro"
                                        value={signupForm.profileType}
                                        onChange={(e) => updateSignupField('profileType', e.target.value)}
                                    >
                                        <option value="vendor">Vendor</option>
                                        <option value="company">Company</option>
                                    </select>
                                </div>
                            </div>

                            <InputLabel label="Store / Company Name" />
                            <input
                                className="input-pro"
                                value={signupForm.businessName}
                                onChange={(e) => updateSignupField('businessName', e.target.value)}
                                placeholder="Business legal/trade name"
                            />

                            <InputLabel label="Location" />
                            <input
                                className="input-pro"
                                value={signupForm.location}
                                onChange={(e) => updateSignupField('location', e.target.value)}
                                placeholder="City, State"
                            />

                            <div className="flex flex-wrap gap-3 mt-2">
                                <button className="btn-pro" type="submit" disabled={isAuthLoading}>
                                    {isAuthLoading ? 'Creating Account...' : 'Create Account'}
                                </button>
                                <button className="btn-soft" type="button" onClick={() => goToView('login')}>
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </GlassPanel>
                ) : null}

                {view === 'otp' ? (
                    <GlassPanel
                        title="Verify OTP"
                        subtitle={`Code sent to ${authEmail || 'your email'}`}
                        showBrand
                        size="auth"
                    >
                        <div className="grid gap-4">
                            <div className="flex gap-1.5 md:gap-2 justify-center">
                                {otpDigits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => {
                                            otpRefs.current[index] = el;
                                        }}
                                        className="otp-digit"
                                        value={digit}
                                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        inputMode="numeric"
                                        maxLength={1}
                                    />
                                ))}
                            </div>

                            <button className="btn-pro" type="button" onClick={handleVerifyOtp} disabled={isAuthLoading}>
                                {isAuthLoading ? 'Verifying...' : 'Verify and Continue'}
                            </button>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="btn-soft"
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={isAuthLoading || cooldown > 0}
                                >
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
                                </button>
                                <button className="btn-soft" type="button" onClick={() => goToView('login')}>
                                    Edit Email
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'showcase' ? (
                    <div className="grid gap-6">
                        <GlassPanel
                            title="Pro-Level Marketplace Experience"
                            subtitle="Interactive 3D visual layer with role-driven workflow pages."
                        >
                            <div className="grid md:grid-cols-2 gap-4">
                                {['3D Inventory Physics', 'Negotiation Intelligence'].map((title, idx) => (
                                    <div className="three-card p-4" key={title}>
                                        <p className="badge-pill">Module {idx + 1}</p>
                                        <h3 className="font-display text-lg text-slate-100 mt-2">{title}</h3>
                                        <p className="text-sm text-slate-300 mt-2">Production-ready UI surfaces designed for real operations.</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-5 flex-wrap">
                                <button className="btn-pro" onClick={() => goToView('login')} type="button">Back to Login</button>
                                <button className="btn-soft" onClick={() => goToView('signup')} type="button">Create Account</button>
                            </div>
                        </GlassPanel>
                    </div>
                ) : null}

                {view === 'vendor' && user ? (
                    <div className="grid gap-6">
                        <GlassPanel
                            title={`Vendor Command Deck | ${user.businessName || user.name}`}
                            subtitle={`Logged in as ${user.email} | Sales, leads, and execution control center`}
                        >
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className={`status-pill ${vendorProfileReady ? 'status-green' : 'status-amber'}`}>
                                    {vendorProfileReady ? 'Profile setup complete' : 'Profile setup pending'}
                                </span>
                                <button className="btn-soft" type="button" onClick={() => goToView('vendor-profile')}>
                                    Edit Profile
                                </button>
                            </div>

                            <div className="sample-notification-bar">
                                <div className="sample-notification-head">
                                    <p className="sample-notification-title">Sample Request Notifications</p>
                                    <p className="sample-notification-count">{sampleRequests.length} total</p>
                                </div>
                                {recentSampleRequests.length > 0 ? (
                                    <div className="sample-notification-list">
                                        {recentSampleRequests.map((entry) => (
                                            <div className="sample-notification-item" key={entry.id}>
                                                <p className="sample-notification-text">
                                                    <span className="sample-notification-who">{entry.requesterName}</span> requested sample for <span className="sample-notification-vendor">{entry.vendorName}</span>
                                                </p>
                                                <p className="sample-notification-meta">{entry.vendorId || 'N/A'} | {entry.vendorCategory} | {new Date(entry.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="sample-notification-empty">No sample requests yet. Company clicks on Request Sample will appear here.</p>
                                )}
                                {sampleRequests.length > 0 ? (
                                    <div className="mt-3">
                                        <button className="btn-soft" type="button" onClick={clearSampleRequests}>Clear Notifications</button>
                                    </div>
                                ) : null}
                            </div>

                            <div className="grid md:grid-cols-3 gap-4 vendor-kpi-grid">
                                {vendorInsights.map((item) => (
                                    <div className="three-card p-4" key={item.label}>
                                        <p className="text-sm text-slate-400">{item.label}</p>
                                        <p className="text-2xl font-display text-slate-100 mt-2">{item.value}</p>
                                        <p className="text-sm text-emerald-300 mt-1">{item.delta}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-4 mt-4 vendor-dashboard-grid">
                                <div className="holo-card p-4 md:p-5">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <p className="badge-pill">Sales Momentum</p>
                                        <p className="text-sm text-slate-300">Website leads: {vendorDashboardAnalytics.websiteLeads}</p>
                                    </div>

                                    <div className="vendor-sales-stage mt-4">
                                        <div className="vendor-sales-bars">
                                            {vendorDashboardAnalytics.weeklySales.map((entry) => (
                                                <div key={entry.label} className="vendor-sales-bar-item">
                                                    <p className="vendor-sales-value">{entry.value}L</p>
                                                    <div className="vendor-sales-track">
                                                        <div className="vendor-sales-fill" style={{ height: `${entry.heightPercent}%` }} />
                                                    </div>
                                                    <p className="vendor-sales-label">{entry.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="vendor-sales-footnote">6-week sales trend generated from platform demand activity.</p>
                                    </div>
                                </div>

                                <div className="grid gap-4">
                                    <div className="three-card p-4">
                                        <p className="badge-pill">Order Pipeline</p>
                                        <h3 className="font-display text-lg text-slate-100 mt-2">Execution Queue</h3>
                                        <div className="mt-3 grid gap-2">
                                            {vendorOrderStages.map((stage) => (
                                                <div key={stage.key} className="vendor-pipeline-row">
                                                    <span className="vendor-pipeline-label">{stage.label}</span>
                                                    <span className="vendor-pipeline-value">{vendorDashboardAnalytics.orderStages[stage.key]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="three-card p-4">
                                        <p className="badge-pill">Action Center</p>
                                        <h3 className="font-display text-lg text-slate-100 mt-2">Today Focus</h3>
                                        <div className="mt-3 grid gap-2">
                                            {vendorActionModules.map((module) => (
                                                <div key={module.title} className="vendor-focus-row">
                                                    <p className="text-sm font-semibold text-slate-100">{module.title}</p>
                                                    <p className={`text-xs mt-1 ${module.tone}`}>{module.detail}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 vendor-conversion-strip">
                                            <p className="text-xs text-slate-300">Conversion Rate</p>
                                            <p className="text-sm font-semibold text-emerald-300">{vendorDashboardAnalytics.conversionRate}%</p>
                                            <p className="text-xs text-slate-300">Pending follow-ups: {vendorDashboardAnalytics.pendingFollowUps}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 mt-5">
                                <button className="btn-pro" type="button" onClick={() => goToView('vendor-studio')}>
                                    Open Vendor Studio
                                </button>
                                <button className="btn-soft" type="button" onClick={logout}>
                                    Logout
                                </button>
                            </div>
                        </GlassPanel>
                    </div>
                ) : null}

                {view === 'vendor-profile' && user ? (
                    <GlassPanel
                        title="Vendor Profile Setup"
                        subtitle="Save your business profile once. We'll personalize your command deck automatically."
                    >
                        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
                            <div className="three-card p-4 md:p-5">
                                <div className="grid gap-3">
                                    <InputLabel label="Store Name" />
                                    <input
                                        className="input-pro"
                                        value={vendorProfile.storeName}
                                        onChange={(e) => handleVendorProfileField('storeName', e.target.value)}
                                        placeholder="Enter store name"
                                    />

                                    <InputLabel label="Owner Name" />
                                    <input
                                        className="input-pro"
                                        value={vendorProfile.ownerName}
                                        onChange={(e) => handleVendorProfileField('ownerName', e.target.value)}
                                        placeholder="Enter owner full name"
                                    />

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <InputLabel label="Location" />
                                            <input
                                                className="input-pro"
                                                value={vendorProfile.location}
                                                onChange={(e) => handleVendorProfileField('location', e.target.value)}
                                                placeholder="City, State"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel label="Contact" />
                                            <input
                                                className="input-pro"
                                                value={vendorProfile.contact}
                                                onChange={(e) => handleVendorProfileField('contact', e.target.value)}
                                                placeholder="Mobile / WhatsApp"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <InputLabel label="Specialization" />
                                            <select
                                                className="input-pro"
                                                value={vendorProfile.specialization}
                                                onChange={(e) => handleVendorProfileField('specialization', e.target.value)}
                                            >
                                                <option>Building Materials</option>
                                                <option>Industrial Tools</option>
                                                <option>Electrical Supplies</option>
                                                <option>Paint and Finishes</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel label="Fulfillment SLA" />
                                            <select
                                                className="input-pro"
                                                value={vendorProfile.fulfillment}
                                                onChange={(e) => handleVendorProfileField('fulfillment', e.target.value)}
                                            >
                                                <option>24 Hours</option>
                                                <option>48 Hours</option>
                                                <option>72 Hours</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="three-card p-4 md:p-5">
                                <p className="badge-pill">Profile Readiness</p>
                                <h3 className="font-display text-lg text-slate-100 mt-3">Professional Presence Score</h3>
                                <p className="text-sm text-slate-300 mt-2">Complete the details to unlock vendor workspace recommendations and premium dashboard layout.</p>
                                <div className="mt-4 h-3 rounded-full bg-slate-700/50 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-brand-500 to-sky-400"
                                        style={{ width: `${isVendorProfileComplete(vendorProfile) ? 100 : 60}%` }}
                                    />
                                </div>
                                <p className="text-sm text-slate-300 mt-3">
                                    {isVendorProfileComplete(vendorProfile)
                                        ? 'Ready to publish vendor profile.'
                                        : 'Fill all required fields to continue.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={saveVendorProfile}>
                                Save Profile and Continue
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('vendor')}>
                                Skip for Now
                            </button>
                            <button className="btn-soft" type="button" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'vendor-onboarding-done' && user ? (
                    <GlassPanel
                        title="Vendor Workspace Activated"
                        subtitle="Your profile is now live. Your next-page workspace is optimized for conversion and trust."
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="three-card p-4">
                                <p className="badge-pill">Trust Layer</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Profile Verified</h3>
                                <p className="text-sm text-slate-300 mt-2">Buyers now see your business identity, location and response confidence signals.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Growth Layer</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Lead Prioritization</h3>
                                <p className="text-sm text-slate-300 mt-2">Dashboard ranking and recommendation cards are tuned to your specialization.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Delivery Layer</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">SLA Visibility</h3>
                                <p className="text-sm text-slate-300 mt-2">Your fulfillment timeline helps companies shortlist you faster.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('vendor')}>
                                Open Vendor Dashboard
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('vendor-studio')}>
                                Jump to Vendor Studio
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('vendor-profile')}>
                                Edit Profile
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'vendor-studio' && user ? (
                    <GlassPanel
                        title="Vendor Growth Studio"
                        subtitle="3D accelerated analytics for pricing, demand and order momentum."
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            {spotlightItems.map((item) => (
                                <div className="three-card p-4" key={item.name}>
                                    <p className="badge-pill">{item.score}</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">{item.name}</h3>
                                    <p className="text-sm text-slate-300 mt-1">{item.category}</p>
                                    <p className="text-brand-400 font-semibold mt-2">{item.price}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('vendor')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={logout}>Logout</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company' && user ? (
                    <GlassPanel
                        title={user.businessName || user.name}
                        titleClassName="text-4xl md:text-5xl"
                        subtitle={`Logged in as ${user.email} | High-performance procurement intelligence layer`}
                    >
                        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-4">
                            <div className="holo-card p-4 md:p-5">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <p className="badge-pill">3D Procurement Surface</p>
                                    <p className="text-sm text-slate-300">Live market pulse | refreshed every 15 min</p>
                                </div>

                                <div className="company-hero-grid mt-4">
                                    {companyInsights.map((item) => (
                                        <div className="three-card p-4" key={item.label}>
                                            <p className="text-sm text-slate-400">{item.label}</p>
                                            <p className="text-2xl font-display text-slate-100 mt-2">{item.value}</p>
                                            <p className="text-sm text-cyan-300 mt-1">{item.delta}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="holo-stage mt-5">
                                    <div className="holo-grid-lines" />
                                    <div className="holo-chart-shell">
                                        <div className="holo-bar-chart" role="img" aria-label="Company KPI comparison chart">
                                            {companyKpiChart.map((item) => (
                                                <div key={item.label} className="holo-bar-item">
                                                    <div className="holo-bar-value">{item.display}</div>
                                                    <div className="holo-bar-track">
                                                        <div className="holo-bar-fill" style={{ height: `${item.heightPercent}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="holo-chart-axis">
                                            {companyKpiChart.map((item) => (
                                                <span key={item.label}>{item.label}</span>
                                            ))}
                                        </div>

                                        <div className="holo-chart-legend">
                                            <span className="holo-legend-dot" aria-hidden="true" />
                                            <span>Graph chart for current KPI data</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4">
                                <div className="three-card p-4">
                                    <p className="badge-pill">Pipeline Heat</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">Procurement Progress</h3>
                                    <div className="mt-3 grid gap-3">
                                        {procurementPhases.map((phase) => (
                                            <div key={phase.label}>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-slate-300">{phase.label}</span>
                                                    <span className="text-slate-100 font-semibold">{phase.progress}%</span>
                                                </div>
                                                <div className="mt-1 h-2 rounded-full bg-slate-700/45 overflow-hidden">
                                                    <div
                                                        className={`h-full bg-gradient-to-r ${phase.tone}`}
                                                        style={{ width: `${phase.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="three-card p-4">
                                    <p className="badge-pill">Vendor Matrix</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">Best Sellers</h3>
                                    <p className="text-xs text-slate-300 mt-1">Top 5 vendors by rating and pricing</p>
                                    <div className="mt-3 grid gap-2">
                                        {bestSellerVendors.map((vendor, index) => (
                                            <div key={vendor.name} className="rounded-xl border border-slate-600/40 px-3 py-2 bg-slate-900/30">
                                                <p className="text-sm font-semibold text-slate-100">#{index + 1} {vendor.name}</p>
                                                <div className="vendor-meta-list mt-2">
                                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Category</span><span className="vendor-meta-value">{vendor.category}</span></p>
                                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Location</span><span className="vendor-meta-value">{vendor.location}</span></p>
                                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Trust</span><span className="vendor-meta-value">{vendor.trust}</span></p>
                                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Lead / Savings</span><span className="vendor-meta-value">{vendor.leadTime} / {vendor.savings}</span></p>
                                                    <p className="vendor-meta-row vendor-meta-highlight"><span className="vendor-meta-label">Rating / Pricing</span><span className="vendor-meta-value">{vendor.rating || '4.0'} / {vendor.pricingBand || 'standard'} / {vendor.unitPrice || 'Price on request'}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                        {bestSellerVendors.length === 0 ? (
                                            <p className="text-sm text-slate-300">No matching vendors found. Try another keyword.</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            {companyStrategicCards.map((card) => (
                                <div className="three-card p-4" key={card.label}>
                                    <p className="badge-pill">{card.tag}</p>
                                    <p className="text-xs uppercase tracking-[0.14em] text-slate-300 mt-2">{card.label}</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">{card.title}</h3>
                                    {card.label === 'Contact Details' ? (
                                        <div className="mt-2 grid gap-1 text-sm text-slate-300">
                                            {card.description.split(' | ').map((line) => (
                                                <p key={line}>{line}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-300 mt-2">{card.description}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company-studio')}>
                                Open Procurement Studio
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('companies')}>
                                Browse Companies Directory
                            </button>
                            <button className="btn-soft" type="button" onClick={() => pushToast('Help chatbot is available!')}>
                                Get AI Help
                            </button>
                            <button className="btn-soft" type="button" onClick={logout}>
                                Logout
                            </button>
                        </div>

                    </GlassPanel>
                ) : null}

                {view === 'company-studio' && user ? (
                    <GlassPanel
                        title={activeStudioCompany ? `${activeStudioCompany.name} | Deep Procurement Studio` : 'Company Deep Procurement Studio'}
                        subtitle={activeStudioCompany
                            ? `${activeStudioCompany.category} | ${activeStudioCompany.location} | Budget ${activeStudioCompany.budget}`
                            : 'A premium 3D decision cockpit for demand intelligence, cost arbitration and vendor confidence planning.'}
                    >
                        <div className="grid lg:grid-cols-2 gap-4">
                            {companyStudioItems.map((item, index) => (
                                <div className="three-card p-4" key={`${item.name}-${index}`}>
                                    <p className="badge-pill">{index % 2 === 0 ? 'Cost Optimized' : 'Fast Fulfillment'}</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">{item.name}</h3>
                                    <p className="text-sm text-slate-300 mt-1">{item.category}</p>
                                    <p className="text-brand-400 font-semibold mt-2">{item.price}</p>
                                    <div className="mt-3 h-2 rounded-full bg-slate-700/40 overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${index % 2 === 0 ? 'from-emerald-400 to-cyan-400' : 'from-brand-400 to-amber-400'}`}
                                            style={{ width: `${72 + index * 8}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="holo-card p-4 md:p-5 mt-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <p className="badge-pill">Negotiation Simulator</p>
                                <p className="text-sm text-slate-300">Predictive win probability by supplier mix</p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-3 mt-3">
                                {companyStudioNegotiationBands.map((zone) => (
                                    <div className="three-card p-4" key={zone.band}>
                                        <p className="text-sm text-slate-300">{zone.band}</p>
                                        <p className="font-display text-2xl text-slate-100 mt-2">{zone.value}</p>
                                        <p className="text-xs text-cyan-300 mt-1">Deal closure confidence</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={logout}>Logout</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-procurement-hub' && user ? (
                    <GlassPanel
                        title="Procurement Hub"
                        subtitle="RFQ comparison, saved vendors, and reorder-ready workflows."
                    >
                        <div className="three-card p-4">
                            <p className="badge-pill">RFQ Compare Table</p>
                            <div className="mt-3 grid gap-2">
                                {rfqComparisonRows.map((row) => (
                                    <div key={row.rfq} className="rounded-xl border border-slate-600/40 px-3 py-2 bg-slate-900/30 grid md:grid-cols-5 gap-2 text-sm">
                                        <span className="text-slate-100 font-semibold">{row.rfq}</span>
                                        <span className="text-slate-300">{row.vendor}</span>
                                        <span className="text-cyan-300">{row.quote}</span>
                                        <span className="text-slate-300">{row.lead}</span>
                                        <span className="text-emerald-300">{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="three-card p-4">
                                <p className="badge-pill">Saved Vendors</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Quick Access List</h3>
                                <p className="text-sm text-slate-300 mt-2">Pin high-performing vendors and reopen negotiation instantly.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Reorder Flow</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Repeat Purchase</h3>
                                <p className="text-sm text-slate-300 mt-2">Convert approved RFQs into one-click reorder templates.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Auto Shortlist</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Best Match Engine</h3>
                                <p className="text-sm text-slate-300 mt-2">Rank by pricing, SLA and trust to reduce decision time.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={() => goToView('company-operations-hub')}>Go to Operations Hub</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-operations-hub' && user ? (
                    <GlassPanel
                        title="Operations Hub"
                        subtitle="Communication, sample tracking, and SLA workflow center."
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="three-card p-4">
                                <p className="badge-pill">In-App Communication</p>
                                <div className="mt-3 grid gap-2">
                                    {communicationThreads.map((thread) => (
                                        <div key={thread.vendor} className="rounded-xl border border-slate-600/40 px-3 py-2 bg-slate-900/30">
                                            <p className="text-sm font-semibold text-slate-100">{thread.vendor}</p>
                                            <p className="text-xs text-slate-300 mt-1">{thread.channel} | {thread.topic}</p>
                                            <p className="text-xs text-cyan-300 mt-1">Updated {thread.updated}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Sample Tracker</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Dispatch to Approval Timeline</h3>
                                <div className="mt-3 grid gap-2 text-sm">
                                    <p className="text-slate-300">1. Request sent to vendor, dispatch confirmation received</p>
                                    <p className="text-slate-300">2. Logistics update with delivery ETA visibility</p>
                                    <p className="text-slate-300">3. QC status: Approved / Rework / Reject</p>
                                    <p className="text-slate-300">4. Auto move to negotiation closure</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={() => goToView('company-admin-hub')}>Open Admin Hub</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-admin-hub' && user ? (
                    <GlassPanel
                        title="Admin Hub"
                        subtitle="KYC approvals, moderation, disputes, and control center."
                    >
                        <div className="three-card p-4">
                            <p className="badge-pill">KYC Approval Queue</p>
                            <div className="mt-3 grid gap-2">
                                {adminKycQueue.map((entry) => (
                                    <div key={entry.vendor} className="rounded-xl border border-slate-600/40 px-3 py-2 bg-slate-900/30 grid md:grid-cols-4 gap-2 text-sm">
                                        <span className="text-slate-100 font-semibold">{entry.vendor}</span>
                                        <span className="text-slate-300">{entry.docs}</span>
                                        <span className="text-cyan-300">Risk Score {entry.score}</span>
                                        <span className="text-emerald-300">{entry.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                            <div className="three-card p-4">
                                <p className="badge-pill">Dispute Panel</p>
                                <p className="text-sm text-slate-300 mt-2">Resolve open issues with SLA-bound ticket states.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Review Moderation</p>
                                <p className="text-sm text-slate-300 mt-2">Approve/reject abusive or fraudulent rating activity.</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="badge-pill">Fraud Alerts</p>
                                <p className="text-sm text-slate-300 mt-2">Flag anomalous pricing and duplicate vendor identity checks.</p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={() => goToView('company-growth-hub')}>Open Growth Hub</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-growth-hub' && user ? (
                    <GlassPanel
                        title="Growth & Monetization Hub"
                        subtitle="Subscriptions, featured listings, and referral mechanics."
                    >
                        <div className="grid md:grid-cols-3 gap-4">
                            {growthModules.map((module) => (
                                <div key={module.title} className="three-card p-4">
                                    <p className="badge-pill">{module.tag}</p>
                                    <h3 className="font-display text-lg text-slate-100 mt-2">{module.title}</h3>
                                    <p className="text-sm text-slate-300 mt-2">{module.detail}</p>
                                </div>
                            ))}
                        </div>

                        <div className="three-card p-4 mt-4">
                            <p className="badge-pill">Escrow & Milestones</p>
                            <div className="mt-3 grid gap-2">
                                {paymentMilestones.map((payment) => (
                                    <div key={payment.project} className="rounded-xl border border-slate-600/40 px-3 py-2 bg-slate-900/30 grid md:grid-cols-4 gap-2 text-sm">
                                        <span className="text-slate-100 font-semibold">{payment.project}</span>
                                        <span className="text-slate-300">{payment.stage}</span>
                                        <span className="text-cyan-300">{payment.amount}</span>
                                        <span className="text-emerald-300">{payment.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>Back to Dashboard</button>
                            <button className="btn-soft" type="button" onClick={() => goToView('company-studio')}>Open Company Studio</button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'vendor-company-search-results' && user ? (
                    <GlassPanel
                        title="Company Search Results"
                        subtitle={`Query: ${dashboardSearch || 'All companies'} | Matches: ${filteredVendorDashboardCompanies.length} | Dataset: ${companyData.length}`}
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            {filteredVendorDashboardCompanies.map((company) => (
                                <div key={`vendor-company-result-${company.id}`} className="three-card p-4 vendor-result-card">
                                    <div className="vendor-result-head">
                                        <img className="vendor-result-avatar" src={company.profilePic} alt={`${company.category} profile`} loading="lazy" />
                                        <div>
                                            <p className="badge-pill">{company.size}</p>
                                            <h3 className="font-display text-lg text-slate-100 mt-2">{company.name}</h3>
                                            <p className="text-sm text-slate-300 mt-1">{company.location} | {company.category}</p>
                                        </div>
                                    </div>

                                    <div className="vendor-contact-grid mt-3">
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Contact</span><span className="vendor-contact-value">{company.contactPerson || 'Business Manager'}</span></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Email</span><a className="vendor-contact-value" href={`mailto:${company.email || ''}`}>{company.email || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Phone</span><a className="vendor-contact-value" href={`tel:${company.phone || ''}`}>{company.phone || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Website</span><a className="vendor-contact-value" href={`https://${company.website || '#'}`} target="_blank" rel="noopener noreferrer">{company.website || 'n/a'}</a></p>
                                    </div>

                                    <div className="vendor-meta-list mt-2">
                                        <p className="vendor-meta-row"><span className="vendor-meta-label">Budget</span><span className="vendor-meta-value">{company.budget}</span></p>
                                        <p className="vendor-meta-row vendor-meta-highlight"><span className="vendor-meta-label">Rating / Orders</span><span className="vendor-meta-value">{company.averageRating} ★ / {company.totalOrders} orders</span></p>
                                    </div>
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button className="btn-soft sample-request-btn" type="button" onClick={() => openCompanyProfile(company)}>
                                            View Full Profile
                                        </button>
                                        <button className="btn-pro sample-request-btn" type="button" onClick={() => openCompanyStudio(company)}>
                                            Open Studio
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredVendorDashboardCompanies.length === 0 ? (
                                <div className="three-card p-4 md:col-span-2">
                                    <h3 className="font-display text-lg text-slate-100">No Companies Found</h3>
                                    <p className="text-sm text-slate-300 mt-2">Try changing your keyword. Search by company name, location, or category.</p>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('vendor')}>
                                Back to Vendor Dashboard
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('vendor-studio')}>
                                Open Vendor Studio
                            </button>
                            <button className="btn-soft" type="button" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-search-results' && user ? (
                    <GlassPanel
                        title="Vendor Search Results"
                        subtitle={`Query: ${dashboardSearch || 'All vendors'} | Matches: ${filteredCompanyVendors.length}`}
                    >
                        <div className="grid md:grid-cols-2 gap-4">
                            {filteredCompanyVendors.map((vendor) => (
                                <div key={`result-${vendor.name}`} className="three-card p-4 vendor-result-card">
                                    <div className="vendor-result-head">
                                        <img className="vendor-result-avatar" src={vendor.profilePic} alt={`${vendor.category} profile`} loading="lazy" />
                                        <div>
                                            <p className="badge-pill">{vendor.category}</p>
                                            <h3 className="font-display text-lg text-slate-100 mt-2">{vendor.name}</h3>
                                            <p className="text-sm text-slate-300 mt-1">{vendor.id || deriveVendorId(vendor)} | {vendor.location} | Trust {vendor.trust}</p>
                                        </div>
                                    </div>

                                    <div className="vendor-contact-grid mt-3">
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Contact</span><span className="vendor-contact-value">{vendor.contactPerson || 'Sales Desk'}</span></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Email</span><a className="vendor-contact-value" href={`mailto:${vendor.email || ''}`}>{vendor.email || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Phone</span><a className="vendor-contact-value" href={`tel:${vendor.phone || ''}`}>{vendor.phone || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">WhatsApp</span><span className="vendor-contact-value">{vendor.whatsapp || 'n/a'}</span></p>
                                    </div>

                                    <div className="vendor-meta-list mt-2">
                                        <p className="vendor-meta-row"><span className="vendor-meta-label">Lead / Savings</span><span className="vendor-meta-value">{vendor.leadTime} / {vendor.savings}</span></p>
                                        <p className="vendor-meta-row vendor-meta-highlight"><span className="vendor-meta-label">Rating / Pricing</span><span className="vendor-meta-value">{vendor.rating || '4.0'} / {vendor.pricingBand || 'standard'} / {vendor.unitPrice || 'Price on request'}</span></p>
                                    </div>
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button className="btn-soft sample-request-btn" type="button" onClick={() => openCompanyVendorProfile(vendor)}>
                                            View Full Profile
                                        </button>
                                        <button className="btn-pro sample-request-btn" type="button" onClick={() => handleSampleRequest(vendor)}>
                                            Request Sample
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredCompanyVendors.length === 0 ? (
                                <div className="three-card p-4 md:col-span-2">
                                    <h3 className="font-display text-lg text-slate-100">No Vendors Found</h3>
                                    <p className="text-sm text-slate-300 mt-2">Try changing category, rating, pricing, or search keyword to see matching vendors.</p>
                                </div>
                            ) : null}
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('company')}>
                                Back to Company Dashboard
                            </button>
                            <button className="btn-soft" type="button" onClick={() => goToView('company-studio')}>
                                Open Company Studio
                            </button>
                            <button className="btn-soft" type="button" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-vendor-profile' && user && selectedCompanyVendor ? (
                    <GlassPanel
                        title={`${selectedCompanyVendor.name} | Vendor Profile`}
                        subtitle="Company view: pricing, ratings, website sales performance, and aligned contact details"
                    >
                        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
                            <div className="three-card p-4 vendor-profile-overview">
                                <div className="vendor-result-head">
                                    <img className="vendor-result-avatar" src={selectedCompanyVendor.profilePic} alt={`${selectedCompanyVendor.category} profile`} loading="lazy" />
                                    <div>
                                        <p className="badge-pill">{selectedCompanyVendor.category}</p>
                                        <h3 className="font-display text-xl text-slate-100 mt-2">{selectedCompanyVendor.name}</h3>
                                        <p className="text-sm text-slate-300 mt-1">{selectedCompanyVendor.id || deriveVendorId(selectedCompanyVendor)} | {selectedCompanyVendor.location} | Trust {selectedCompanyVendor.trust}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-3 mt-4 vendor-profile-metrics">
                                    <div className="vendor-stat-card">
                                        <p className="vendor-stat-label">Unit Price</p>
                                        <p className="vendor-stat-value">{selectedCompanyVendor.unitPrice || 'Price on request'}</p>
                                        <p className="vendor-stat-sub">{selectedCompanyVendor.pricingBand || 'standard'} pricing</p>
                                    </div>
                                    <div className="vendor-stat-card">
                                        <p className="vendor-stat-label">Rating</p>
                                        <p className="vendor-stat-value">{selectedCompanyVendor.rating || '4.0'}/5</p>
                                        <p className="vendor-stat-sub">Lead {selectedCompanyVendor.leadTime}</p>
                                    </div>
                                    <div className="vendor-stat-card">
                                        <p className="vendor-stat-label">Website Sales</p>
                                        <p className="vendor-stat-value">{selectedVendorWebsiteSales?.websiteSales || 'INR 0.0L'}</p>
                                        <p className="vendor-stat-sub">via our website</p>
                                    </div>
                                </div>

                                <div className="vendor-meta-list mt-4">
                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Monthly Orders</span><span className="vendor-meta-value">{selectedVendorWebsiteSales?.monthlyOrders || 0}</span></p>
                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Repeat Buyer Rate</span><span className="vendor-meta-value">{selectedVendorWebsiteSales?.repeatBuyerRate || 0}%</span></p>
                                    <p className="vendor-meta-row"><span className="vendor-meta-label">Savings Potential</span><span className="vendor-meta-value">{selectedCompanyVendor.savings}</span></p>
                                </div>
                            </div>

                            <div className="three-card p-4">
                                <p className="badge-pill">Contact Details</p>
                                <h3 className="font-display text-lg text-slate-100 mt-2">Aligned Communication Desk</h3>
                                <div className="vendor-contact-grid mt-3">
                                    <p className="vendor-contact-row"><span className="vendor-contact-label">Contact Person</span><span className="vendor-contact-value">{selectedCompanyVendor.contactPerson || 'Sales Desk'}</span></p>
                                    <p className="vendor-contact-row"><span className="vendor-contact-label">Email</span><a className="vendor-contact-value" href={`mailto:${selectedCompanyVendor.email || ''}`}>{selectedCompanyVendor.email || 'n/a'}</a></p>
                                    <p className="vendor-contact-row"><span className="vendor-contact-label">Phone</span><a className="vendor-contact-value" href={`tel:${selectedCompanyVendor.phone || ''}`}>{selectedCompanyVendor.phone || 'n/a'}</a></p>
                                    <p className="vendor-contact-row"><span className="vendor-contact-label">WhatsApp</span><span className="vendor-contact-value">{selectedCompanyVendor.whatsapp || 'n/a'}</span></p>
                                </div>

                                <div className="flex gap-2 flex-wrap mt-4">
                                    <button className="btn-pro sample-request-btn" type="button" onClick={() => handleSampleRequest(selectedCompanyVendor)}>
                                        Request Sample
                                    </button>
                                    <button className="btn-soft sample-request-btn" type="button" onClick={() => goToView('company-search-results')}>
                                        Back to Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'companies' && user ? (
                    <GlassPanel title="Browse Companies" subtitle={`Total Companies: ${companyData.length} | Showing: ${filteredCompaniesBrowse.length} matches`}>
                        <div className="mb-6">
                            <div className="three-card p-3 md:p-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="text-slate-400 text-lg md:text-xl flex-shrink-0" aria-hidden="true">🔍</span>
                                    <input
                                        className="flex-1 px-2 md:px-3 py-2 md:py-3 rounded-lg bg-slate-700/30 border border-slate-600/50 text-slate-100 text-sm md:text-base placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                                        type="search"
                                        placeholder="Search companies by name, category, location, size, or budget..."
                                        value={companiesSearchQuery}
                                        onChange={(e) => setCompaniesSearchQuery(e.target.value)}
                                        aria-label="Search companies"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
                            {filteredCompaniesBrowse.map((company) => (
                                <div key={`company-${company.id}`} className="three-card p-4 vendor-result-card hover:ring-2 hover:ring-cyan-400/30 transition-all">
                                    <div className="vendor-result-head">
                                        <img className="vendor-result-avatar" src={company.profilePic} alt={`${company.category} profile`} loading="lazy" />
                                        <div>
                                            <p className="badge-pill">{company.size}</p>
                                            <h3 className="font-display text-lg text-slate-100 mt-2">{company.name}</h3>
                                            <p className="text-sm text-slate-300 mt-1">{company.location} | {company.category}</p>
                                        </div>
                                    </div>

                                    <div className="vendor-contact-grid mt-3">
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Contact</span><span className="vendor-contact-value">{company.contactPerson || 'Business Manager'}</span></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Email</span><a className="vendor-contact-value" href={`mailto:${company.email || ''}`}>{company.email || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Phone</span><a className="vendor-contact-value" href={`tel:${company.phone || ''}`}>{company.phone || 'n/a'}</a></p>
                                        <p className="vendor-contact-row"><span className="vendor-contact-label">Website</span><a className="vendor-contact-value" href={`https://${company.website || '#'}`} target="_blank" rel="noopener noreferrer">{company.website || 'n/a'}</a></p>
                                    </div>

                                    <div className="vendor-meta-list mt-2">
                                        <p className="vendor-meta-row"><span className="vendor-meta-label">Budget</span><span className="vendor-meta-value">{company.budget}</span></p>
                                        <p className="vendor-meta-row vendor-meta-highlight"><span className="vendor-meta-label">Rating / Orders</span><span className="vendor-meta-value">{company.averageRating} ★ / {company.totalOrders} orders</span></p>
                                    </div>
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        <button className="btn-soft sample-request-btn" type="button" onClick={() => openCompanyProfile(company)}>
                                            View Full Profile
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredCompaniesBrowse.length === 0 ? (
                            <div className="three-card p-8 text-center">
                                <p className="text-slate-300 text-lg">No companies found matching your search.</p>
                                <p className="text-slate-400 text-sm mt-2">Try adjusting your search query.</p>
                            </div>
                        ) : null}

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView('showcase')}>
                                Back to Marketplace
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}

                {view === 'company-profile' && user && selectedCompany ? (
                    <GlassPanel title={selectedCompany.name} subtitle={`${selectedCompany.category} | ${selectedCompany.location}`}>
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div className="three-card p-4">
                                <p className="vendor-stat-label">Company Size</p>
                                <p className="vendor-stat-value">{selectedCompany.size}</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="vendor-stat-label">Budget Range</p>
                                <p className="vendor-stat-value text-amber-300">{selectedCompany.budget}</p>
                            </div>
                            <div className="three-card p-4">
                                <p className="vendor-stat-label">Total Orders</p>
                                <p className="vendor-stat-value text-emerald-300">{selectedCompany.totalOrders}</p>
                            </div>
                        </div>

                        <h3 className="font-display text-lg text-slate-100 mt-6 mb-3">Company Details</h3>
                        <div className="three-card p-4 mb-6">
                            <div className="vendor-contact-grid">
                                <p className="vendor-contact-row"><span className="vendor-contact-label">Contact Person</span><span className="vendor-contact-value">{selectedCompany.contactPerson}</span></p>
                                <p className="vendor-contact-row"><span className="vendor-contact-label">Email</span><a className="vendor-contact-value" href={`mailto:${selectedCompany.email || ''}`}>{selectedCompany.email || 'n/a'}</a></p>
                                <p className="vendor-contact-row"><span className="vendor-contact-label">Phone</span><a className="vendor-contact-value" href={`tel:${selectedCompany.phone || ''}`}>{selectedCompany.phone || 'n/a'}</a></p>
                                <p className="vendor-contact-row"><span className="vendor-contact-label">WhatsApp</span><span className="vendor-contact-value">{selectedCompany.whatsapp || 'n/a'}</span></p>
                                <p className="vendor-contact-row"><span className="vendor-contact-label">Website</span><a className="vendor-contact-value" href={`https://${selectedCompany.website || '#'}`} target="_blank" rel="noopener noreferrer">{selectedCompany.website || 'n/a'}</a></p>
                                <p className="vendor-contact-row"><span className="vendor-contact-label">GST Number</span><span className="vendor-contact-value">{selectedCompany.gst}</span></p>
                            </div>
                        </div>

                        <h3 className="font-display text-lg text-slate-100 mt-6 mb-3">Matched Vendors for This Company</h3>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            {getCompanyVendorMatches(selectedCompany.id, companyData, window.COMPANY_VENDOR_MATRIX)?.map((vendor) => (
                                <div key={`matched-${vendor.name}`} className="three-card p-3">
                                    <div className="flex items-start gap-2">
                                        <img className="vendor-result-avatar" style={{width: '50px', height: '50px'}} src={vendor.profilePic} alt={`${vendor.category}`} loading="lazy" />
                                        <div className="flex-1">
                                            <h4 className="text-slate-100 font-semibold text-sm">{vendor.name}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{vendor.category} | {vendor.location}</p>
                                            <p className="text-xs text-emerald-300 mt-1">Rating: {vendor.rating} ★ | {vendor.pricingBand}</p>
                                        </div>
                                    </div>
                                </div>
                            )) || []}
                        </div>

                        <div className="three-card p-4 mb-6">
                            <p className="text-sm text-slate-300">
                                <span className="font-semibold">Monthly Purchase Volume:</span> {selectedCompany.monthlyPurchaseVolume || 0} units
                            </p>
                            <p className="text-sm text-slate-300 mt-2">
                                <span className="font-semibold">Order Cycle:</span> Every {selectedCompany.orderCycleDays} days
                            </p>
                            <p className="text-sm text-slate-300 mt-2">
                                <span className="font-semibold">Payment Term:</span> {selectedCompany.paymentTerm}
                            </p>
                            <p className="text-sm text-slate-300 mt-2">
                                <span className="font-semibold">Account Status:</span> <span className={selectedCompany.accountStatus === 'Active' ? 'text-emerald-300' : 'text-amber-300'}>{selectedCompany.accountStatus}</span>
                            </p>
                        </div>

                        <div className="flex gap-3 mt-5 flex-wrap">
                            <button className="btn-pro" type="button" onClick={() => goToView(sanitizeProfileType(user?.profileType) === 'vendor' ? 'vendor-company-search-results' : 'companies')}>
                                {sanitizeProfileType(user?.profileType) === 'vendor' ? 'Back to Company Results' : 'Back to Companies'}
                            </button>
                            <button className="btn-soft" type="button" onClick={() => openCompanyStudio(selectedCompany)}>
                                Open Company Studio
                            </button>
                            <button className="btn-soft" type="button" onClick={() => pushToast(`Contact request sent to ${selectedCompany.name}`)}>
                                Send Message
                            </button>
                        </div>
                    </GlassPanel>
                ) : null}
            </main>

            <HelpChatbot
                isOpen={chatbotOpen}
                onToggle={() => setChatbotOpen((prev) => !prev)}
                messages={chatbotMessages}
                inputValue={chatbotInput}
                onInputChange={setChatbotInput}
                onSend={submitChatbotMessage}
                quickPrompts={chatbotQuickPrompts}
                language={chatbotLanguage}
                onLanguageChange={setChatbotLanguage}
            />
        </div>
    );
}

function Image3DBackground({ mode, imageSrc }) {
    const [isImageReady, setIsImageReady] = useState(true);

    useEffect(() => {
        setIsImageReady(true);
    }, [imageSrc]);

    return (
        <div className={`image3d-shell mode-${mode}`} aria-hidden="true">
            <img
                src={imageSrc}
                alt=""
                className="image3d-preload"
                onError={() => setIsImageReady(false)}
            />
            <div className="image3d-stage">
                <div className="image3d-layer image3d-backdrop" />
                <div
                    className={`image3d-layer image3d-main ${isImageReady ? '' : 'image3d-fallback'}`}
                    style={isImageReady ? { backgroundImage: `url('${imageSrc}')` } : undefined}
                />
                <div className="image3d-layer image3d-glow" />
                <div className="image3d-layer image3d-vignette" />
            </div>
        </div>
    );
}

function GlassPanel({ title, subtitle, children, showBrand = false, size = 'wide', titleClassName = '' }) {
    const sizeClass = size === 'auth' ? 'max-w-3xl' : 'max-w-5xl';
    const panelKindClass = size === 'auth' ? 'auth-panel' : '';
    const baseTitleClass = size === 'auth'
        ? 'font-display text-[clamp(2.15rem,8.2vw,4.1rem)] leading-[1.06] text-slate-100'
        : 'font-display text-2xl md:text-3xl text-slate-100';
    const titleClass = `${baseTitleClass} ${titleClassName}`.trim();
    const subtitleClass = size === 'auth'
        ? 'text-slate-300 mt-3 text-base md:text-lg leading-relaxed'
        : 'text-slate-300 mt-2 text-sm md:text-base';

    return (
        <section className={`glass-panel ${panelKindClass} w-full ${sizeClass} mx-auto p-5 md:p-8`}>
            {showBrand ? (
                <div className="mb-5">
                    <BrandIdentity compact />
                </div>
            ) : null}
            <div className="mb-6">
                <h2 className={titleClass}>{title}</h2>
                <p className={subtitleClass}>{subtitle}</p>
            </div>
            {children}
        </section>
    );
}

function InputLabel({ label }) {
    return <label className="text-base font-semibold tracking-[0.01em] text-slate-700 dark:text-slate-200">{label}</label>;
}

function HelpChatbot({ isOpen, onToggle, messages, inputValue, onInputChange, onSend, quickPrompts, language, onLanguageChange }) {
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!messageEndRef.current) {
            return;
        }
        messageEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isOpen]);

    return (
        <div className="help-chatbot-shell" aria-live="polite">
            {isOpen ? (
                <div className="help-chatbot-panel glass-panel">
                    <div className="help-chatbot-header">
                        <div>
                            <p className="badge-pill">AI ASSISTANT</p>
                            <h3 className="font-display text-lg text-slate-100 mt-2">Vendor + Company Help Desk</h3>
                        </div>
                        <button className="chip-btn" type="button" onClick={onToggle} aria-label="Close chatbot">
                            Close
                        </button>
                    </div>

                    <div className="help-chatbot-lang-row">
                        <span className="help-chatbot-lang-label">Language</span>
                        <select
                            className="help-chatbot-lang-select"
                            value={language}
                            onChange={(event) => onLanguageChange(event.target.value)}
                            aria-label="Select AI help language"
                        >
                            <option value="auto">Auto</option>
                            <option value="english">English</option>
                            <option value="hindi">Hindi</option>
                        </select>
                    </div>

                    <div className="help-chatbot-quick-actions">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                className="help-chatbot-prompt"
                                type="button"
                                onClick={() => onSend(prompt)}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="help-chatbot-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`help-chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        <div ref={messageEndRef} />
                    </div>

                    <form
                        className="help-chatbot-input-row"
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSend(inputValue);
                        }}
                    >
                        <input
                            className="input-pro"
                            type="text"
                            placeholder={language === 'hindi' ? 'Apna sawaal likho...' : 'Type your question...'}
                            value={inputValue}
                            onChange={(event) => onInputChange(event.target.value)}
                        />
                        <button className="btn-pro help-chatbot-send" type="submit">
                            Send
                        </button>
                    </form>
                </div>
            ) : null}

            <button className="help-chatbot-toggle" type="button" onClick={onToggle} aria-label="Open AI help chatbot">
                {isOpen ? 'Hide Help' : 'AI Help'}
            </button>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
