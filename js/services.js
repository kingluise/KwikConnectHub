document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // User dropdown
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', () => userDropdown.classList.add('hidden'));
    }

    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    // Check auth state
    checkAuthState();

    // Load filters
    loadCategoryFilters();

    // Parse URL params and load services
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');

    if (category) {
        document.getElementById('breadcrumbCategory').textContent = capitalizeFirst(category.replace('-', ' '));
        document.getElementById('pageTitle').textContent = capitalizeFirst(category.replace('-', ' '));
    } else if (search) {
        document.getElementById('breadcrumbCategory').textContent = `Search: "${search}"`;
        document.getElementById('pageTitle').textContent = `Search Results`;
        document.getElementById('navSearch').value = search;
    }

    // Load services
    loadServices();

    // Setup filter listeners
    setupFilterListeners();
});

// State
let currentPage = 1;
let currentView = 'grid';
let activeFilters = {
    category: null,
    minPrice: null,
    maxPrice: null,
    rating: null,
    verified: false,
    topRated: false,
    sort: 'recommended'
};

// TODO: Replace with actual API call
async function fetchServices(filters, page, limit = 12) {
    // const response = await fetch(`/api/services?page=${page}&limit=${limit}&${new URLSearchParams(filters)}`);
    // const data = await response.json();
    // return data;
    return {
        services: [],
        total: 0,
        pages: 0
    };
}

// TODO: Replace with actual API call
async function fetchCategories() {
    // const response = await fetch('/api/categories');
    // const data = await response.json();
    // return data;
    return [
        { id: 'all', name: 'All Services', count: 0, slug: 'all' },
        { id: 'home-services', name: 'Home Services', count: 0, slug: 'home-services' },
        { id: 'cleaning', name: 'Cleaning', count: 0, slug: 'cleaning' },
        { id: 'repairs', name: 'Repairs', count: 0, slug: 'repairs' },
        { id: 'design', name: 'Design', count: 0, slug: 'design' },
        { id: 'tech', name: 'Tech', count: 0, slug: 'tech' },
        { id: 'events', name: 'Events', count: 0, slug: 'events' },
        { id: 'education', name: 'Education', count: 0, slug: 'education' }
    ];
}

async function loadCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    const categories = await fetchCategories();

    container.innerHTML = categories.map(cat => `
        <label class="flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-3">
                <input type="radio" name="category" value="${cat.slug}" ${cat.slug === 'all' ? 'checked' : ''}
                    onchange="handleCategoryChange('${cat.slug}')"
                    class="w-4 h-4 text-emerald-600 focus:ring-emerald-500">
                <span class="text-sm group-hover:text-emerald-600 transition-colors">${cat.name}</span>
            </div>
            <span class="text-xs text-text-muted">${cat.count}</span>
        </label>
    `).join('');

    // Set initial category from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const radio = document.querySelector(`input[value="${category}"]`);
        if (radio) radio.checked = true;
        activeFilters.category = category;
    }
}

async function loadServices() {
    const grid = document.getElementById('servicesGrid');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');
    const resultsCount = document.getElementById('resultsCount');

    // Show loading skeleton
    grid.innerHTML = Array(6).fill(0).map((_, i) => `
        <div class="skeleton h-80 rounded-2xl"></div>
    `).join('');

    try {
        const data = await fetchServices(activeFilters, currentPage);

        resultsCount.textContent = `${data.total} results`;

        if (data.services.length === 0) {
            grid.innerHTML = '';
            emptyState.classList.remove('hidden');
            pagination.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        pagination.classList.remove('hidden');

        // Render services or placeholder cards
        grid.innerHTML = Array(6).fill(0).map((_, i) => createServiceCard({
            id: i + 1,
            title: 'Professional Service Title',
            provider: { name: 'Provider Name', avatar: null, isPro: true },
            rating: 4.9,
            reviews: 0,
            price: 50 + (i * 25),
            image: `http://static.photos/workspace/640x360/${i + 20}`,
            badge: i === 0 ? 'top' : i === 1 ? 'new' : null
        }, i)).join('');

        renderPagination(data.pages);

    } catch (error) {
        showToast('Failed to load services', 'error');
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function createServiceCard(service, index) {
    const badgeHtml = service.badge ? `<span class="badge badge-${service.badge}">${service.badge === 'top' ? 'Top Rated' : service.badge === 'new' ? 'New' : 'Popular'}</span>` : '';

    return `
        <div class="service-card ${currentView === 'list' ? 'list-view' : ''} overflow-hidden group cursor-pointer" onclick="window.location.href='service-detail.html?id=${service.id}'">
            <div class="service-image aspect-video bg-gray-200 relative overflow-hidden">
                <img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                ${badgeHtml}
                <button class="wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${service.id})">
                    <i data-lucide="heart" class="w-4 h-4"></i>
                </button>
            </div>
            <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        ${service.provider.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-text truncate">${service.provider.name}</p>
                        ${service.provider.isPro ? '<span class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Pro</span>' : ''}
                    </div>
                </div>
                <h3 class="font-semibold text-text mb-2 line-clamp-2">${service.title}</h3>
                <div class="flex items-center gap-1 mb-3">
                    <i data-lucide="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i>
                    <span class="text-sm font-medium">${service.rating}</span>
                    <span class="text-sm text-text-muted">(${service.reviews} reviews)</span>
                </div>
                <div class="flex items-center justify-between pt-3 border-t border-border">
                    <span class="text-xs text-text-muted">Starting at</span>
                    <span class="font-bold text-lg">$${service.price}</span>
                </div>
            </div>
        </div>
    `;
}

function renderPagination(totalPages) {
    const container = document.getElementById('pageNumbers');
    let html = '';

    for (let i = 1; i <= Math.min(totalPages || 5, 5); i++) {
        html += `
            <button onclick="goToPage(${i})" class="pagination-btn w-10 h-10 rounded-xl border border-border font-medium text-sm ${i === currentPage ? 'active' : 'hover:bg-gray-50'}">
                ${i}
            </button>
        `;
    }

    container.innerHTML = html;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function setupFilterListeners() {
    // Price inputs
    document.getElementById('minPrice')?.addEventListener('change', (e) => {
        activeFilters.minPrice = e.target.value;
        applyFilters();
    });
    document.getElementById('maxPrice')?.addEventListener('change', (e) => {
        activeFilters.maxPrice = e.target.value;
        applyFilters();
    });

    // Rating radios
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            activeFilters.rating = e.target.value;
            applyFilters();
        });
    });

    // Toggles
    document.getElementById('verifiedOnly')?.addEventListener('change', (e) => {
        activeFilters.verified = e.target.checked;
        applyFilters();
    });
    document.getElementById('topRatedOnly')?.addEventListener('change', (e) => {
        activeFilters.topRated = e.target.checked;
        applyFilters();
    });
}

function handleCategoryChange(category) {
    activeFilters.category = category === 'all' ? null : category;
    currentPage = 1;
    updateURL();
    loadServices();
}

function handleSort() {
    const select = document.getElementById('sortSelect');
    activeFilters.sort = select.value;
    loadServices();
}

function setView(view) {
    currentView = view;
    document.getElementById('gridViewBtn').className = view === 'grid' ? 'p-2 rounded-lg bg-emerald-50 text-emerald-600' : 'p-2 rounded-lg text-text-muted hover:text-text';
    document.getElementById('listViewBtn').className = view === 'list' ? 'p-2 rounded-lg bg-emerald-50 text-emerald-600' : 'p-2 rounded-lg text-text-muted hover:text-text';
    loadServices();
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }
    loadServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToPage(page) {
    currentPage = page;
    loadServices();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyFilters() {
    currentPage = 1;
    updateActiveFiltersDisplay();
    loadServices();
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFilters');
    const filters = [];

    if (activeFilters.category) filters.push({ label: capitalizeFirst(activeFilters.category), key: 'category' });
    if (activeFilters.minPrice || activeFilters.maxPrice) filters.push({ label: `$${activeFilters.minPrice || 0} - $${activeFilters.maxPrice || '1000+'}`, key: 'price' });
    if (activeFilters.rating) filters.push({ label: `${activeFilters.rating}+ stars`, key: 'rating' });
    if (activeFilters.verified) filters.push({ label: 'Verified Only', key: 'verified' });
    if (activeFilters.topRated) filters.push({ label: 'Top Rated', key: 'topRated' });

    if (filters.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    container.innerHTML = filters.map(f => `
        <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            ${f.label}
            <button onclick="removeFilter('${f.key}')" class="hover:text-emerald-900"><i data-lucide="x" class="w-3 h-3"></i></button>
        </span>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function removeFilter(key) {
    switch(key) {
        case 'category':
            activeFilters.category = null;
            document.querySelector('input[value="all"]').checked = true;
            break;
        case 'price':
            activeFilters.minPrice = null;
            activeFilters.maxPrice = null;
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            break;
        case 'rating':
            activeFilters.rating = null;
            document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
            break;
        case 'verified':
            activeFilters.verified = false;
            document.getElementById('verifiedOnly').checked = false;
            break;
        case 'topRated':
            activeFilters.topRated = false;
            document.getElementById('topRatedOnly').checked = false;
            break;
    }
    applyFilters();
}

function clearAllFilters() {
    activeFilters = {
        category: null,
        minPrice: null,
        maxPrice: null,
        rating: null,
        verified: false,
        topRated: false,
        sort: 'recommended'
    };
    document.querySelector('input[value="all"]').checked = true;
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
    document.getElementById('verifiedOnly').checked = false;
    document.getElementById('topRatedOnly').checked = false;
    document.getElementById('sortSelect').value = 'recommended';
    applyFilters();
}

function updateURL() {
    const params = new URLSearchParams();
    if (activeFilters.category) params.set('category', activeFilters.category);
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
}

function openMobileFilters() {
    const drawer = document.getElementById('mobileFilterDrawer');
    const content = document.getElementById('mobileFilterContent');
    drawer.classList.remove('hidden');
    setTimeout(() => content.classList.add('open'), 10);
}

function closeMobileFilters() {
    const drawer = document.getElementById('mobileFilterDrawer');
    const content = document.getElementById('mobileFilterContent');
    content.classList.remove('open');
    setTimeout(() => drawer.classList.add('hidden'), 300);
}

function toggleWishlist(id) {
    showToast('Added to saved services', 'success');
}

function checkAuthState() {
    const isLoggedIn = false;
    document.querySelector('.nav-logged-out')?.classList.toggle('hidden', isLoggedIn);
    document.querySelector('.nav-logged-out')?.classList.toggle('flex', !isLoggedIn);
    document.querySelector('.nav-logged-in')?.classList.toggle('hidden', !isLoggedIn);
    document.querySelector('.nav-logged-in')?.classList.toggle('flex', isLoggedIn);
}

function handleLogout() {
    showToast('Logged out successfully', 'success');
    setTimeout(() => window.location.href = 'index.html', 1000);
}

function capitalizeFirst(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';
    toast.className = `toast ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`;
    toast.innerHTML = `<i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="w-5 h-5"></i><span class="font-medium">${message}</span>`;
    container.appendChild(toast);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// Expose to window
window.handleCategoryChange = handleCategoryChange;
window.handleSort = handleSort;
window.setView = setView;
window.changePage = changePage;
window.goToPage = goToPage;
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;
window.openMobileFilters = openMobileFilters;
window.closeMobileFilters = closeMobileFilters;
window.toggleWishlist = toggleWishlist;
window.handleLogout = handleLogout;
