// KwikConnectHub - Provider Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  NAVBAR SCROLL
    // ══════════════════════════════
    window.addEventListener('scroll', () => {
        document.getElementById('navbar')
            .classList.toggle('scrolled', window.scrollY > 10);
    });

    // ══════════════════════════════
    //  SIDEBAR TOGGLE (mobile)
    // ══════════════════════════════
    const sidebar        = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle  = document.getElementById('sidebarToggle');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('hidden');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    });

    // ══════════════════════════════
    //  SECTION SWITCHING
    // ══════════════════════════════
    function switchSection(name) {
        document.querySelectorAll('.dash-section').forEach(s => s.classList.add('hidden'));
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

        const section = document.getElementById(`section-${name}`);
        if (section) section.classList.remove('hidden');

        const link = document.querySelector(`[data-section="${name}"]`);
        if (link) link.classList.add('active');

        // Close sidebar on mobile
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    }

    window.switchSection = switchSection;

    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.dataset.section);
        });
    });

    // ══════════════════════════════
    //  LOAD PROVIDER DATA
    // ══════════════════════════════
    async function loadProviderData() {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/provider/profile');
        // const data = await response.json();
        // renderProviderProfile(data);

        // Placeholder: set UI to empty/loading state
        document.getElementById('welcomeTitle').textContent = 'Welcome back!';
        document.getElementById('navUsername').textContent  = 'Provider';
        document.getElementById('navAvatar').textContent    = 'P';
        document.getElementById('sidebarAvatar').textContent = 'P';
        document.getElementById('sidebarName').textContent  = 'Provider Name';
    }

    // ══════════════════════════════
    //  LOAD STATS
    // ══════════════════════════════
    async function loadStats() {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/provider/stats');
        // const data = await response.json();
        // renderStats(data);

        // Show dashes until data loads
        ['statEarnings','statActiveOrders','statCompleted','statRating',
         'availableBalance','pendingBalance','monthlyEarnings','totalEarnings']
            .forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '—';
            });
    }

    // ══════════════════════════════
    //  LOAD ORDERS
    // ══════════════════════════════
    async function loadOrders() {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/provider/orders');
        // const data = await response.json();
        // renderOrders(data);

        showEmptyOrders();
    }

    function showEmptyOrders() {
        ['recentOrdersBody','allOrdersBody'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        ['recentOrdersEmpty','allOrdersEmpty'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
    }

    function renderOrders(orders, tbodyId, emptyId) {
        const tbody = document.getElementById(tbodyId);
        const empty = document.getElementById(emptyId);
        if (!tbody) return;

        if (!orders || orders.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><span style="font-weight:600;color:var(--emerald)">#${order.id}</span></td>
                <td>${order.buyerName}</td>
                <td>${order.serviceName}</td>
                <td>${order.date}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td><strong>$${order.amount}</strong></td>
                <td>
                    <button class="text-btn" onclick="viewOrder('${order.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    window.viewOrder = function(id) {
        // TODO: Navigate to order detail or open modal
        showToast(`Order #${id} — detail view coming soon`);
    };

    // ══════════════════════════════
    //  LOAD GIGS
    // ══════════════════════════════
    async function loadGigs() {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/provider/gigs');
        // const data = await response.json();
        // renderGigs(data);

        showEmptyGigs();
    }

    function showEmptyGigs() {
        ['gigsGrid','allGigsGrid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        ['gigsEmpty','allGigsEmpty'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'block';
        });
    }

    function renderGigs(gigs, gridId, emptyId) {
        const grid  = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        if (!grid) return;

        if (!gigs || gigs.length === 0) {
            grid.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';

        grid.innerHTML = gigs.map(gig => `
            <div class="gig-card">
                <div class="gig-card-img">
                    <img src="${gig.image || ''}" alt="${gig.title}">
                </div>
                <div class="gig-card-body">
                    <h4 class="gig-card-title">${gig.title}</h4>
                    <div class="gig-card-meta">
                        <span class="gig-status ${gig.status}">${gig.status}</span>
                        <span class="gig-price">From $${gig.price}</span>
                    </div>
                    <div class="gig-actions">
                        <button class="gig-action-btn" onclick="editGig('${gig.id}')">
                            <i data-lucide="edit-2"></i> Edit
                        </button>
                        <button class="gig-action-btn" onclick="toggleGig('${gig.id}')">
                            <i data-lucide="pause"></i> Pause
                        </button>
                        <button class="gig-action-btn danger" onclick="deleteGig('${gig.id}')">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        lucide.createIcons();
    }

    window.editGig = function(id) {
        window.location.href = `create-gig.html?id=${id}`;
    };

    window.toggleGig = function(id) {
        // TODO: PATCH /api/gigs/:id/toggle
        showToast('Gig status updated');
    };

    window.deleteGig = function(id) {
        // TODO: DELETE /api/gigs/:id
        showToast('Gig deleted');
    };

    // ══════════════════════════════
    //  LOAD REVIEWS
    // ══════════════════════════════
    async function loadReviews() {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/provider/reviews');
        // const data = await response.json();
        // renderReviews(data);

        ['recentReviewsList'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });

        const empty = document.getElementById('reviewsEmpty');
        if (empty) empty.style.display = 'block';
    }

    function renderReviews(reviews, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (!reviews || reviews.length === 0) return;

        container.innerHTML = reviews.map(r => `
            <div class="review-card">
                <div class="review-top">
                    <div class="review-avatar">${r.initials}</div>
                    <div>
                        <div class="review-name">${r.name}</div>
                        <div class="review-date">${r.date}</div>
                    </div>
                    <div class="review-stars">
                        ${[1,2,3,4,5].map(i =>
                            `<i data-lucide="star" style="width:13px;height:13px;fill:${i<=r.rating?'#f59e0b':'none'};color:#f59e0b"></i>`
                        ).join('')}
                    </div>
                </div>
                <p class="review-text">${r.text}</p>
            </div>
        `).join('');

        lucide.createIcons();
    }

    // ══════════════════════════════
    //  EARNINGS RANGE CHANGE
    // ══════════════════════════════
    document.getElementById('earningsRange')?.addEventListener('change', (e) => {
        // TODO: Fetch earnings data for selected range
        // fetchEarningsChart(e.target.value);
    });

    // ══════════════════════════════
    //  ORDER STATUS FILTER
    // ══════════════════════════════
    document.getElementById('orderStatusFilter')?.addEventListener('change', (e) => {
        // TODO: Filter orders by status
        // filterOrders(e.target.value);
    });

    // ══════════════════════════════
    //  WITHDRAW BUTTON
    // ══════════════════════════════
    document.getElementById('withdrawBtn')?.addEventListener('click', () => {
        // TODO: Open withdrawal modal
        showToast('Withdrawal feature coming soon!');
    });

    // ══════════════════════════════
    //  TOAST
    // ══════════════════════════════
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const msg   = document.getElementById('toastMsg');
        const icon  = toast.querySelector('i');

        msg.textContent = message;
        icon.setAttribute('data-lucide', type === 'error' ? 'alert-circle' : 'check-circle');
        icon.style.color = type === 'error' ? '#f87171' : '#6ee7b7';
        lucide.createIcons();

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    window.showToast = showToast;

    // ══════════════════════════════
    //  INIT
    // ══════════════════════════════
    loadProviderData();
    loadStats();
    loadOrders();
    loadGigs();
    loadReviews();

    console.log('🚀 KwikConnectHub Provider Dashboard loaded!');
});
