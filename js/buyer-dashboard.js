// KwikConnectHub - Buyer Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  NAVBAR SCROLL
    // ══════════════════════════════
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    });

    // ══════════════════════════════
    //  SIDEBAR TOGGLE (mobile)
    // ══════════════════════════════
    const sidebar        = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle  = document.getElementById('sidebarToggleBtn');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('hidden');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    });

    // ══════════════════════════════
    //  AVATAR DROPDOWN
    // ══════════════════════════════
    const navAvatarWrap  = document.getElementById('navAvatarWrap');
    const avatarDropdown = document.getElementById('avatarDropdown');

    navAvatarWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', () => avatarDropdown.classList.add('hidden'));

    // ══════════════════════════════
    //  SECTION SWITCHING
    // ══════════════════════════════
    function switchSection(sectionId) {
        document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.sidebar-link[data-section]').forEach(l => l.classList.remove('active'));

        document.getElementById(`section-${sectionId}`)?.classList.add('active');
        document.querySelector(`[data-section="${sectionId}"]`)?.classList.add('active');

        if (window.innerWidth < 900) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    window.switchSection = switchSection;

    document.querySelectorAll('.sidebar-link[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(link.dataset.section);
        });
    });

    // ══════════════════════════════
    //  LOAD BUYER PROFILE
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadProfile() {
        // TODO: GET /api/user/profile
        // const res  = await fetch('/api/user/profile');
        // const data = await res.json();
        // populateProfile(data);
    }

    // ══════════════════════════════
    //  LOAD STATS
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadStats() {
        // TODO: GET /api/buyer/stats
        // const res  = await fetch('/api/buyer/stats');
        // const data = await res.json();
        // document.getElementById('statTotal').textContent     = data.total;
        // document.getElementById('statPending').textContent   = data.pending;
        // document.getElementById('statCompleted').textContent = data.completed;
        // document.getElementById('statSpent').textContent     = `$${data.spent}`;
    }

    // ══════════════════════════════
    //  LOAD RECENT ORDERS
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadRecentOrders() {
        // TODO: GET /api/buyer/orders?limit=5
        // const res  = await fetch('/api/buyer/orders?limit=5');
        // const data = await res.json();
        // renderOrders(data.orders, 'recentOrdersBody', 'recentOrdersEmpty');
        showEmptyTable('recentOrdersBody', 'recentOrdersEmpty');
    }

    // ══════════════════════════════
    //  LOAD ALL ORDERS
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadAllOrders(status = 'all') {
        // TODO: GET /api/buyer/orders?status=status
        // const res  = await fetch(`/api/buyer/orders?status=${status}`);
        // const data = await res.json();
        // renderOrders(data.orders, 'allOrdersBody', 'allOrdersEmpty');
        showEmptyTable('allOrdersBody', 'allOrdersEmpty');
    }

    // ══════════════════════════════
    //  LOAD SAVED SERVICES
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadSavedServices() {
        // TODO: GET /api/buyer/saved
        // const res  = await fetch('/api/buyer/saved');
        // const data = await res.json();
        // renderSaved(data.services, 'savedGridPreview', 'savedPreviewEmpty');
        // renderSaved(data.services, 'savedGridFull', 'savedFullEmpty');
        showEmptySaved('savedGridPreview', 'savedPreviewEmpty');
        showEmptySaved('savedGridFull', 'savedFullEmpty');
    }

    // ══════════════════════════════
    //  LOAD REVIEWS
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadReviews() {
        // TODO: GET /api/buyer/reviews
        // const res  = await fetch('/api/buyer/reviews');
        // const data = await res.json();
        // renderReviews(data.reviews);
        document.getElementById('myReviewsList').innerHTML = '';
        document.getElementById('myReviewsEmpty').classList.remove('hidden');
    }

    // ══════════════════════════════
    //  RENDER FUNCTIONS
    // ══════════════════════════════

    function renderOrders(orders, tbodyId, emptyId) {
        const tbody = document.getElementById(tbodyId);
        const empty = document.getElementById(emptyId);

        if (!orders || orders.length === 0) {
            tbody.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td><span style="font-weight:600;color:var(--emerald)">#${order.id}</span></td>
                <td>${order.serviceName}</td>
                <td>${order.providerName}</td>
                <td>${order.date}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td><strong>$${order.amount}</strong></td>
                <td>
                    <button class="btn-ghost" onclick="viewOrder('${order.id}')">View</button>
                </td>
            </tr>
        `).join('');
    }

    function renderSaved(services, gridId, emptyId) {
        const grid  = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);

        if (!services || services.length === 0) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = services.map(s => `
            <div class="saved-card" onclick="window.location.href='service-detail.html?id=${s.id}'">
                <div class="saved-card-img">
                    <img src="${s.image || ''}" alt="${s.title}">
                </div>
                <div class="saved-card-body">
                    <div class="saved-card-title">${s.title}</div>
                    <div class="saved-card-meta">
                        <div class="saved-rating">
                            <i data-lucide="star"></i>${s.rating}
                        </div>
                        <div class="saved-price">$${s.price}</div>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    function renderReviews(reviews) {
        const list  = document.getElementById('myReviewsList');
        const empty = document.getElementById('myReviewsEmpty');

        if (!reviews || reviews.length === 0) {
            list.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        list.innerHTML = reviews.map(r => `
            <div class="review-item">
                <div class="review-item-header">
                    <span class="review-service">${r.serviceName}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <div class="review-stars">
                    ${[1,2,3,4,5].map(i =>
                        `<i data-lucide="star" style="width:13px;height:13px;color:#f59e0b;fill:${i <= r.rating ? '#f59e0b' : 'none'};"></i>`
                    ).join('')}
                </div>
                <p class="review-text">${r.text}</p>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // ══════════════════════════════
    //  EMPTY STATE HELPERS
    // ══════════════════════════════
    function showEmptyTable(tbodyId, emptyId) {
        const tbody = document.getElementById(tbodyId);
        const empty = document.getElementById(emptyId);
        if (tbody) tbody.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
    }

    function showEmptySaved(gridId, emptyId) {
        const grid  = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        if (grid)  grid.innerHTML = '';
        if (empty) empty.classList.remove('hidden');
    }

    // ══════════════════════════════
    //  ACTION HANDLERS
    // ══════════════════════════════
    function viewOrder(orderId) {
        // TODO: navigate to order detail page or open modal
        showToast(`Viewing order #${orderId}`);
    }
    window.viewOrder = viewOrder;

    document.getElementById('ordersFilter').addEventListener('change', (e) => {
        // TODO: GET /api/buyer/orders?status=e.target.value
        loadAllOrders(e.target.value);
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
    loadProfile();
    loadStats();
    loadRecentOrders();
    loadSavedServices();
    loadReviews();

    console.log('🚀 Buyer Dashboard loaded!');
});
