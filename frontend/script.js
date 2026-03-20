(function() {
    // ---------- STATE & PERSISTENCE ----------
    const STORAGE_KEYS = {
        USER: 'bazar_user',
        VENDOR_PROFILE: 'bazar_vendor_profile',
        ITEMS: 'bazar_items',
        CART: 'bazar_cart',
        VENDOR_NOTIFICATIONS: 'bazar_vendor_notifications',
        COMPANY_NOTIFICATIONS: 'bazar_company_notifications',
        THEME: 'bazar_theme'
    };

    // Default data
    const defaultVendorProfile = {
        storeName: 'Woodcraft Solutions',
        ownerName: 'Aryan Saini',
        location: 'Sector 62, Noida',
        contact: '+91 98765 43210'
    };

    const defaultItems = [
        { id: 1, name: 'Teak Wood Plank', category: 'Woods', price: 2500, quantity: 10, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 2, name: 'Premium Pine Wood', category: 'Woods', price: 1800, quantity: 20, place: 'Delhi', vendor: 'Woodcraft Solutions' },
        { id: 3, name: 'Asian Paint (White)', category: 'Paint', price: 2200, quantity: 15, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 4, name: 'Nerolac Paint (Blue)', category: 'Paint', price: 2100, quantity: 12, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 5, name: 'Hammer Drill Machine', category: 'Tools', price: 3500, quantity: 5, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 6, name: 'Circular Saw', category: 'Tools', price: 4200, quantity: 3, place: 'Delhi', vendor: 'Woodcraft Solutions' },
        { id: 7, name: 'Brass Door Handle', category: 'Hardware', price: 350, quantity: 50, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 8, name: 'Steel Hinge', category: 'Hardware', price: 120, quantity: 100, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 9, name: 'Copper Wire (Roll)', category: 'Electrical', price: 850, quantity: 25, place: 'Noida', vendor: 'Woodcraft Solutions' },
        { id: 10, name: 'PVC Pipe 1 inch', category: 'Plumbing', price: 300, quantity: 40, place: 'Noida', vendor: 'Woodcraft Solutions' }
    ];

    // Load state
    let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null;
    let vendorProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDOR_PROFILE)) || { ...defaultVendorProfile };
    let items = JSON.parse(localStorage.getItem(STORAGE_KEYS.ITEMS)) || [...defaultItems];
    let cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || []; // array of { itemId, name, price, quantity }
    let vendorNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDOR_NOTIFICATIONS)) || [];
    let companyNotifications = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPANY_NOTIFICATIONS)) || [];

    // Theme
    let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.body.className = currentTheme;

    // Save helpers
    function saveUser() { localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser)); }
    function saveVendorProfileState() { localStorage.setItem(STORAGE_KEYS.VENDOR_PROFILE, JSON.stringify(vendorProfile)); }
    function saveItemsState() { localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items)); }
    function saveCartState() { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }
    function saveVendorNotificationsState() { localStorage.setItem(STORAGE_KEYS.VENDOR_NOTIFICATIONS, JSON.stringify(vendorNotifications)); }
    function saveCompanyNotificationsState() { localStorage.setItem(STORAGE_KEYS.COMPANY_NOTIFICATIONS, JSON.stringify(companyNotifications)); }

    // ---------- UI HELPERS ----------
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('animate-in'); // Reset animation
        });
        const target = document.getElementById(screenId);
        target.classList.remove('hidden');
        // Force reflow to re-trigger animation
        void target.offsetWidth;
        target.classList.add('animate-in');

        // Show chat only on dashboards
        const chatBtn = document.getElementById('chatButton');
        const chatPanel = document.getElementById('chatPanel');
        if (!chatBtn || !chatPanel) return;
        if (screenId === 'vendorDashboard' || screenId === 'companyDashboard') {
            chatBtn.classList.remove('hidden');
        } else {
            chatBtn.classList.add('hidden');
            chatPanel.classList.add('hidden');
        }
    }

    function showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), duration);
    }

    // Theme toggle
    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.className = currentTheme;
        localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
        // Update all theme toggle buttons icons
        document.querySelectorAll('[id^="themeToggle"]').forEach(btn => {
            btn.innerHTML = currentTheme === 'light' ? '<i class="fas fa-moon"></i> Dark' : '<i class="fas fa-sun"></i> Light';
        });
    }

    // OTP input handling
    function setupOtpInputs() {
        const inputs = document.querySelectorAll('.otp-input');
        inputs.forEach((input) => {
            input.removeEventListener('input', otpInputHandler);
            input.removeEventListener('keydown', otpKeydownHandler);
            input.addEventListener('input', otpInputHandler);
            input.addEventListener('keydown', otpKeydownHandler);
        });
    }

    function otpInputHandler(e) {
        const input = e.target;
        if (input.value.length === 1) {
            const next = input.parentElement.querySelector(`.otp-input[data-index="${parseInt(input.dataset.index) + 1}"]`);
            if (next) next.focus();
        }
    }

    function otpKeydownHandler(e) {
        const input = e.target;
        if (e.key === 'Backspace' && input.value.length === 0) {
            const prev = input.parentElement.querySelector(`.otp-input[data-index="${parseInt(input.dataset.index) - 1}"]`);
            if (prev) {
                prev.focus();
                prev.value = '';
            }
        }
    }

    function resetOtpInputs() {
        document.querySelectorAll('.otp-input').forEach(inp => inp.value = '');
    }

    // ---------- CATEGORY CHIPS (dynamic) ----------
    function renderCategoryChips(activeCat = 'all') {
        const container = document.getElementById('companyCategoryChips');
        if (!container) return;
        const cats = ['all', ...new Set(items.map(i => i.category))];
        container.innerHTML = cats.map(cat => `
            <span class="chip ${activeCat === cat ? 'active' : ''}" data-cat="${cat}">${cat === 'all' ? 'All' : cat}</span>
        `).join('');
        container.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                document.querySelectorAll('#companyCategoryChips .chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                filterCompanyItems(chip.dataset.cat);
            });
        });
    }

    // ---------- NOTIFICATIONS ----------
    function addVendorNotification(message) {
        vendorNotifications.push({ message, read: false, timestamp: Date.now() });
        saveVendorNotificationsState();
        updateVendorNotificationBadge();
    }

    function addCompanyNotification(message) {
        companyNotifications.push({ message, read: false, timestamp: Date.now() });
        saveCompanyNotificationsState();
        updateCompanyNotificationBadge();
    }

    function updateVendorNotificationBadge() {
        const badge = document.getElementById('vendorNotificationBadge');
        if (!badge) return;
        const unread = vendorNotifications.filter(n => !n.read).length;
        if (unread > 0) {
            badge.textContent = unread;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    function updateCompanyNotificationBadge() {
        const badge = document.getElementById('companyNotificationBadge');
        if (!badge) return;
        const unread = companyNotifications.filter(n => !n.read).length;
        if (unread > 0) {
            badge.textContent = unread;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    function showVendorNotifications() {
        const list = document.getElementById('vendorNotificationList');
        if (!list) return;
        list.innerHTML = vendorNotifications.length ? vendorNotifications.map(n => `
            <div class="notification-item ${!n.read ? 'unread' : ''}">${n.message}</div>
        `).join('') : '<p>No notifications</p>';
        document.getElementById('vendorNotificationModal').classList.remove('hidden');
        vendorNotifications.forEach(n => n.read = true);
        saveVendorNotificationsState();
        updateVendorNotificationBadge();
    }

    function showCompanyNotifications() {
        const list = document.getElementById('companyNotificationList');
        if (!list) return;
        list.innerHTML = companyNotifications.length ? companyNotifications.map(n => `
            <div class="notification-item ${!n.read ? 'unread' : ''}">${n.message}</div>
        `).join('') : '<p>No notifications</p>';
        document.getElementById('companyNotificationModal').classList.remove('hidden');
        companyNotifications.forEach(n => n.read = true);
        saveCompanyNotificationsState();
        updateCompanyNotificationBadge();
    }

    function clearVendorNotifications() {
        vendorNotifications = [];
        saveVendorNotificationsState();
        updateVendorNotificationBadge();
        document.getElementById('vendorNotificationModal').classList.add('hidden');
    }

    function clearCompanyNotifications() {
        companyNotifications = [];
        saveCompanyNotificationsState();
        updateCompanyNotificationBadge();
        document.getElementById('companyNotificationModal').classList.add('hidden');
    }

    // ---------- CART ----------
    function addToCart(item) {
        const existing = cart.find(c => c.itemId === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ itemId: item.id, name: item.name, price: item.price, quantity: 1, vendor: item.vendor });
        }
        saveCartState();
        updateCartBadge();
        showToast(`${item.name} added to cart`);
    }

    function updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        const count = cart.reduce((acc, i) => acc + i.quantity, 0);
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    function showCart() {
        const list = document.getElementById('cartItemsList');
        if (!list) return;
        if (cart.length === 0) {
            list.innerHTML = '<p>Your cart is empty</p>';
        } else {
            list.innerHTML = cart.map(c => `
                <div class="cart-item">
                    <span>${c.name} x${c.quantity}</span>
                    <span>₹${c.price * c.quantity} <button class="small-btn" onclick="window.removeFromCart(${c.itemId})">Remove</button></span>
                </div>
            `).join('');
        }
        document.getElementById('cartModal').classList.remove('hidden');
    }

    window.removeFromCart = function(itemId) {
        cart = cart.filter(c => c.itemId !== itemId);
        saveCartState();
        updateCartBadge();
        showCart(); // refresh
    };

    function buyNow() {
        if (cart.length === 0) {
            showToast('Cart is empty');
            return;
        }
        showToast('Purchase successful! (demo)');
        cart = [];
        saveCartState();
        updateCartBadge();
        document.getElementById('cartModal').classList.add('hidden');
    }

    // ---------- COMPANY DASHBOARD ----------
    let currentCompanyCategory = 'all';
    function filterCompanyItems(cat) {
        currentCompanyCategory = cat || currentCompanyCategory;
        renderCompanyItems();
    }

    function renderCompanyItems() {
        const searchInput = document.getElementById('companySearch');
        if (!searchInput) return;
        const searchText = searchInput.value.toLowerCase();
        const grid = document.getElementById('companyItemGrid');
        if (!grid) return;
        grid.innerHTML = '';

        let filtered = items;
        if (currentCompanyCategory !== 'all') {
            filtered = filtered.filter(item => item.category === currentCompanyCategory);
        }
        if (searchText) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchText) ||
                item.category.toLowerCase().includes(searchText) ||
                item.vendor.toLowerCase().includes(searchText)
            );
        }

        if (filtered.length === 0) {
            grid.innerHTML = '<p class="empty-grid-message">No items found</p>';
            return;
        }

        filtered.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'grid-card animate-in';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `
                <h4>${escapeHtml(item.name)}</h4>
                <p class="item-category">${escapeHtml(item.category)}</p>
                <div class="price">₹${item.price}</div>
                <p class="item-meta">${escapeHtml(item.vendor)} | ${escapeHtml(item.place)}</p>
                <button class="negotiate-btn" data-item-id="${item.id}">Negotiate</button>
                <button class="add-to-cart-btn" data-item-id="${item.id}">Add to Cart</button>
            `;
            card.querySelector('.negotiate-btn').addEventListener('click', () => openNegotiateModal(item));
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(item));
            grid.appendChild(card);
        });
    }

    function escapeHtml(unsafe) {
        return unsafe.replace(/[&<>"]/g, function(m) {
            if(m === '&') return '&amp;'; if(m === '<') return '&lt;'; if(m === '>') return '&gt;'; if(m === '"') return '&quot;';
            return m;
        });
    }

    // Negotiate modal
    let currentNegotiateItem = null;
    function openNegotiateModal(item) {
        currentNegotiateItem = item;
        document.getElementById('negotiateItemName').innerText = 'Item: ' + item.name;
        document.getElementById('negotiateCurrentPrice').innerText = item.price;
        document.getElementById('negotiateOffer').value = '';
        document.getElementById('negotiateModal').classList.remove('hidden');
    }

    function closeNegotiateModal() {
        document.getElementById('negotiateModal').classList.add('hidden');
        currentNegotiateItem = null;
    }

    function sendNegotiation() {
        const offer = document.getElementById('negotiateOffer').value;
        if (!offer || offer <= 0) {
            showToast('Please enter a valid offer');
            return;
        }
        showToast(`Offer of ₹${offer} sent to vendor for ${currentNegotiateItem.name}`);
        addVendorNotification(`New offer of ₹${offer} on ${currentNegotiateItem.name} from a company.`);
        closeNegotiateModal();
    }

    // ---------- VENDOR DASHBOARD ----------
    function switchVendorTab(tabId) {
        const tabs = document.querySelectorAll('#vendorDashboard .tab');
        if (!tabs.length) return;
        tabs.forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`#vendorDashboard .tab[data-vendor-tab="${tabId}"]`);
        if (activeTab) activeTab.classList.add('active');

        document.querySelectorAll('#vendorDashboard .tab-content').forEach(c => c.classList.add('hidden'));
        if (tabId === 'profile') {
            document.getElementById('vendorProfileTab').classList.remove('hidden');
            loadVendorProfileToForm();
        } else if (tabId === 'items') {
            document.getElementById('vendorItemsTab').classList.remove('hidden');
            renderVendorItems();
        } else if (tabId === 'add') {
            document.getElementById('vendorAddTab').classList.remove('hidden');
        }
    }

    function loadVendorProfileToForm() {
        document.getElementById('vendorStoreName').value = vendorProfile.storeName || '';
        document.getElementById('vendorOwnerName').value = vendorProfile.ownerName || '';
        document.getElementById('vendorLocation').value = vendorProfile.location || '';
        document.getElementById('vendorContact').value = vendorProfile.contact || '';
    }

    function handleSaveVendorProfile() {
        vendorProfile.storeName = document.getElementById('vendorStoreName').value.trim() || vendorProfile.storeName;
        vendorProfile.ownerName = document.getElementById('vendorOwnerName').value.trim() || vendorProfile.ownerName;
        vendorProfile.location = document.getElementById('vendorLocation').value.trim() || vendorProfile.location;
        vendorProfile.contact = document.getElementById('vendorContact').value.trim() || vendorProfile.contact;
        saveVendorProfileState();
        showToast('Profile updated');
    }

    function renderVendorItems() {
        const container = document.getElementById('vendorItemList');
        if (!container) return;
        container.innerHTML = '';
        if (items.length === 0) {
            container.innerHTML = '<p class="empty-section-message">No items yet. Add some!</p>';
            return;
        }
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card animate-in';
            card.style.animationDelay = `${index * 0.05}s`;
            card.innerHTML = `
                <div class="item-info">
                    <h4>${escapeHtml(item.name)}</h4>
                    <p>${escapeHtml(item.category)} | Qty: ${item.quantity} | ${escapeHtml(item.place)}</p>
                </div>
                <div class="item-actions">
                    <span class="price-tag">₹${item.price}</span>
                    <button class="small-btn edit-item" data-item-id="${item.id}">Edit</button>
                    <button class="small-btn delete-item" data-item-id="${item.id}">Delete</button>
                </div>
            `;
            card.querySelector('.edit-item').addEventListener('click', () => openEditItemModal(item));
            card.querySelector('.delete-item').addEventListener('click', () => deleteItem(item.id));
            container.appendChild(card);
        });
    }

    function deleteItem(id) {
        const item = items.find(i => i.id === id);
        if (confirm('Are you sure you want to delete this item?')) {
            items = items.filter(i => i.id !== id);
            saveItemsState();
            renderVendorItems();
            if (currentUser?.profileType === 'company') renderCompanyItems();
            renderCategoryChips(currentCompanyCategory);
            showToast('Item deleted');
            addCompanyNotification(`Item ${item?.name} was deleted by vendor.`);
        }
    }

    function openEditItemModal(item) {
        document.getElementById('editItemId').value = item.id;
        document.getElementById('editItemName').value = item.name;
        document.getElementById('editItemCategory').value = item.category;
        document.getElementById('editItemPrice').value = item.price;
        document.getElementById('editItemQty').value = item.quantity;
        document.getElementById('editItemPlace').value = item.place;
        document.getElementById('editItemModal').classList.remove('hidden');
    }

    function closeEditItemModal() {
        document.getElementById('editItemModal').classList.add('hidden');
    }

    function saveItemEdit() {
        const id = parseInt(document.getElementById('editItemId').value);
        const item = items.find(i => i.id === id);
        if (!item) return;
        const newName = document.getElementById('editItemName').value.trim();
        const newCat = document.getElementById('editItemCategory').value;
        const newPrice = parseFloat(document.getElementById('editItemPrice').value);
        const newQty = parseInt(document.getElementById('editItemQty').value);
        const newPlace = document.getElementById('editItemPlace').value.trim();

        if (!newName || !newCat || isNaN(newPrice) || newPrice < 0 || isNaN(newQty) || newQty < 0 || !newPlace) {
            showToast('Please fill all fields with valid values');
            return;
        }

        const oldPrice = item.price;
        item.name = newName;
        item.category = newCat;
        item.price = newPrice;
        item.quantity = newQty;
        item.place = newPlace;
        saveItemsState();
        renderVendorItems();
        if (currentUser?.profileType === 'company') renderCompanyItems();
        renderCategoryChips(currentCompanyCategory);
        closeEditItemModal();
        showToast('Item updated');
        if (oldPrice !== newPrice) {
            addCompanyNotification(`Price updated for ${item.name}: ₹${oldPrice} → ₹${newPrice}`);
        }
    }

    function addVendorItem() {
        const name = document.getElementById('newItemName').value.trim();
        const category = document.getElementById('newItemCategory').value;
        const price = parseFloat(document.getElementById('newItemPrice').value);
        const quantity = parseInt(document.getElementById('newItemQty').value);
        const place = document.getElementById('newItemPlace').value.trim();

        if (!name || !category || isNaN(price) || price < 0 || isNaN(quantity) || quantity < 0 || !place) {
            showToast('Please fill all fields with valid values');
            return;
        }

        const newId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
        items.push({
            id: newId,
            name,
            category,
            price,
            quantity,
            place,
            vendor: vendorProfile.storeName || 'Unknown Vendor'
        });
        saveItemsState();
        document.getElementById('newItemName').value = '';
        document.getElementById('newItemCategory').value = 'Woods';
        document.getElementById('newItemPrice').value = '';
        document.getElementById('newItemQty').value = '';
        document.getElementById('newItemPlace').value = '';
        showToast('Item added');
        switchVendorTab('items');
        renderVendorItems();
        if (currentUser?.profileType === 'company') renderCompanyItems();
        renderCategoryChips(currentCompanyCategory);
        addCompanyNotification(`New item added: ${name} by ${vendorProfile.storeName}`);
    }

    // ---------- AUTH FLOW ----------
    const API_ENDPOINTS = {
        SEND_OTP: '/api/auth/send-otp',
        VERIFY_OTP: '/api/auth/verify-otp'
    };

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function postJson(url, payload) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json().catch(() => ({}));
            return {
                ok: response.ok,
                status: response.status,
                data
            };
        } catch (error) {
            return {
                ok: false,
                status: 0,
                data: {
                    message: 'Could not connect to the server. Please run: npm run dev'
                }
            };
        }
    }

    let currentLoginEmail = '';

    async function sendOtp() {
        const email = document.getElementById('loginEmailInput').value.trim().toLowerCase();
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address');
            return;
        }

        const result = await postJson(API_ENDPOINTS.SEND_OTP, { email });
        if (!result.ok) {
            showToast(result.data?.message || 'Failed to send OTP');
            return;
        }

        currentLoginEmail = email;
        document.getElementById('otpEmailDisplay').innerText = email;
        resetOtpInputs();
        showScreen('otpScreen');
        setupOtpInputs();
        showToast(result.data?.message || 'OTP was sent to your email');
    }

    async function verifyOtp() {
        const otp = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value).join('');
        if (otp.length !== 6) {
            showToast('Please enter 6-digit OTP');
            return;
        }
        if (!currentLoginEmail) {
            showToast('Please send OTP first');
            showScreen('loginScreen');
            return;
        }

        const result = await postJson(API_ENDPOINTS.VERIFY_OTP, {
            email: currentLoginEmail,
            otp
        });
        if (!result.ok) {
            showToast(result.data?.message || 'OTP verification failed');
            return;
        }

        showToast(result.data?.message || 'OTP verified successfully!');
        currentUser = { email: currentLoginEmail, name: 'Demo User', profileType: null };
        saveUser();
        showScreen('profileChoiceScreen');
    }

    async function resendOtp() {
        if (!currentLoginEmail) {
            showToast('Please enter your email and send OTP first');
            showScreen('loginScreen');
            return;
        }
        const result = await postJson(API_ENDPOINTS.SEND_OTP, { email: currentLoginEmail });
        showToast(result.data?.message || (result.ok ? 'OTP resent successfully' : 'Failed to resend OTP'));
    }

    function submitSignup() {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const mobile = document.getElementById('signupMobile').value.trim();
        if (!name || !email || !/^\d{10}$/.test(mobile)) {
            showToast('Please fill all fields correctly');
            return;
        }
        showToast('Signup successful! Please login');
        showScreen('loginScreen');
    }

    function selectProfile(profileType) {
        if (!currentUser) {
            showScreen('loginScreen');
            return;
        }
        currentUser.profileType = profileType;
        saveUser();
        if (profileType === 'vendor') {
            showScreen('vendorDashboard');
            switchVendorTab('profile');
            updateVendorNotificationBadge();
            addMessage("Welcome, Vendor! Check the 'Market Trends' in your dashboard soon.", "bot");
        } else {
            showScreen('companyDashboard');
            renderCategoryChips('all');
            renderCompanyItems();
            updateCartBadge();
            updateCompanyNotificationBadge();
            addMessage("Hello! I can help you find the best deals in 'Woods' and 'Paint'.", "bot");
        }
    }

    function logout() {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        showScreen('loginScreen');
    }

    // ---------- CHATBOT ----------
    const chatButton = document.getElementById('chatButton');
    const chatPanel = document.getElementById('chatPanel');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    function toggleChat() {
        chatPanel.classList.toggle('hidden');
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function processUserMessage(userText) {
        const lower = userText.toLowerCase();
        let reply = '';

        // Simple AI logic based on keywords and user role
        if (currentUser?.profileType === 'vendor') {
            // Vendor-specific help
            if (lower.includes('price') || lower.includes('suggest')) {
                reply = 'As a vendor, you can check market demand. Would you like me to show popular categories?';
            } else if (lower.includes('demand') || lower.includes('popular')) {
                const categories = [...new Set(items.map(i => i.category))];
                reply = `Popular categories: ${categories.join(', ')}. You can add items in these.`;
            } else if (lower.includes('best') || lower.includes('find')) {
                reply = 'You can use the "My Items" tab to manage your listings. Need help pricing?';
            } else {
                reply = 'I can help you manage your inventory, set prices, or check notifications.';
            }
        } else if (currentUser?.profileType === 'company') {
            // Company-specific help
            if (lower.includes('best price') || lower.includes('cheapest')) {
                // Find cheapest item
                const cheapest = items.reduce((min, i) => i.price < min.price ? i : min, items[0]);
                reply = `The cheapest item right now is ${cheapest.name} at ₹${cheapest.price} from ${cheapest.vendor}.`;
            } else if (lower.includes('find') || lower.includes('search')) {
                const words = lower.split(' ');
                const possibleCat = words.find(w => ['woods','paint','tools','hardware','electrical','plumbing'].includes(w));
                if (possibleCat) {
                    const catItems = items.filter(i => i.category.toLowerCase().includes(possibleCat));
                    if (catItems.length) {
                        reply = `Found ${catItems.length} items in ${possibleCat}. Check the grid above.`;
                    } else {
                        reply = `No items found in ${possibleCat}. Try another category.`;
                    }
                } else {
                    reply = 'Try searching by category like "woods" or "paint".';
                }
            } else if (lower.includes('suggest') || lower.includes('recommend')) {
                const random = items[Math.floor(Math.random() * items.length)];
                reply = `I recommend ${random.name} at ₹${random.price} from ${random.vendor}. It's a great choice!`;
            } else if (lower.includes('cart')) {
                reply = `You have ${cart.reduce((a,i)=>a+i.quantity,0)} items in your cart. Click the cart icon to view.`;
            } else {
                reply = 'I can help you find the best deals, compare prices, or suggest items. What do you need?';
            }
        } else {
            reply = 'Please log in to use the assistant.';
        }

        addMessage(reply, 'bot');
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        chatInput.value = '';
        processUserMessage(text);
    }

    // ---------- EVENT LISTENERS ----------
    document.addEventListener('DOMContentLoaded', () => {
        // Theme toggle listeners
        document.querySelectorAll('[id^="themeToggle"]').forEach(btn => {
            btn.addEventListener('click', toggleTheme);
        });

        // Auth
        document.getElementById('sendOtpBtn').addEventListener('click', sendOtp);
        document.getElementById('showSignupBtn').addEventListener('click', () => showScreen('signupScreen'));
        document.getElementById('resendOtpBtn').addEventListener('click', resendOtp);
        document.getElementById('backToLoginBtn').addEventListener('click', () => showScreen('loginScreen'));
        document.getElementById('verifyOtpBtn').addEventListener('click', verifyOtp);
        document.getElementById('submitSignupBtn').addEventListener('click', submitSignup);
        document.getElementById('goToLoginFromSignupBtn').addEventListener('click', () => showScreen('loginScreen'));

        // Profile choice
        document.querySelectorAll('.choice-card').forEach(card => {
            card.addEventListener('click', () => {
                const profile = card.dataset.profile;
                selectProfile(profile);
            });
        });

        // Vendor tabs
        document.querySelectorAll('#vendorDashboard .tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchVendorTab(tab.dataset.vendorTab);
            });
        });

        // Vendor profile save
        document.getElementById('saveVendorProfileBtn').addEventListener('click', handleSaveVendorProfile);
        document.getElementById('addVendorItemBtn').addEventListener('click', addVendorItem);

        // Logout
        document.getElementById('vendorLogoutBtn').addEventListener('click', logout);
        document.getElementById('companyLogoutBtn').addEventListener('click', logout);

        // Company search
        document.getElementById('companySearch').addEventListener('input', () => filterCompanyItems());

        // Negotiate modal
        document.getElementById('closeNegotiateModalBtn').addEventListener('click', closeNegotiateModal);
        document.getElementById('sendNegotiationBtn').addEventListener('click', sendNegotiation);

        // Edit item modal
        document.getElementById('closeEditItemModalBtn').addEventListener('click', closeEditItemModal);
        document.getElementById('saveItemEditBtn').addEventListener('click', saveItemEdit);

        // Notifications
        document.getElementById('vendorNotificationsBtn').addEventListener('click', showVendorNotifications);
        document.getElementById('companyNotificationsBtn').addEventListener('click', showCompanyNotifications);
        document.getElementById('clearVendorNotifications').addEventListener('click', clearVendorNotifications);
        document.getElementById('clearCompanyNotifications').addEventListener('click', clearCompanyNotifications);
        document.getElementById('closeVendorNotificationModal').addEventListener('click', () => {
            document.getElementById('vendorNotificationModal').classList.add('hidden');
        });
        document.getElementById('closeCompanyNotificationModal').addEventListener('click', () => {
            document.getElementById('companyNotificationModal').classList.add('hidden');
        });

        // Cart
        document.getElementById('companyCartBtn').addEventListener('click', showCart);
        document.getElementById('closeCartModal').addEventListener('click', () => {
            document.getElementById('cartModal').classList.add('hidden');
        });
        document.getElementById('buyNowBtn').addEventListener('click', buyNow);

        // Chatbot listeners
        if (chatButton) chatButton.addEventListener('click', toggleChat);
        if (closeChatBtn) closeChatBtn.addEventListener('click', () => chatPanel.classList.add('hidden'));
        if (sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
        if (chatInput) chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
            }
        });

        // Restore session
        if (currentUser) {
            if (currentUser.profileType) {
                if (currentUser.profileType === 'vendor') {
                    showScreen('vendorDashboard');
                    switchVendorTab('profile');
                    updateVendorNotificationBadge();
                } else {
                    showScreen('companyDashboard');
                    renderCategoryChips('all');
                    renderCompanyItems();
                    updateCartBadge();
                    updateCompanyNotificationBadge();
                }
            } else {
                showScreen('profileChoiceScreen');
            }
        } else {
            showScreen('loginScreen');
        }

        loadVendorProfileToForm();

        // Set initial theme toggle text
        document.querySelectorAll('[id^="themeToggle"]').forEach(btn => {
            btn.innerHTML = currentTheme === 'light' ? '<i class="fas fa-moon"></i> Dark' : '<i class="fas fa-sun"></i> Light';
        });
    });
})();
