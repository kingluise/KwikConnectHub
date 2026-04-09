document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.setAttribute('data-lucide', 'menu');
            } else {
                menuIcon.setAttribute('data-lucide', 'x');
            }
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }

    // User Dropdown Toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            userDropdown.classList.add('hidden');
        });
    }

    // Check Auth State (placeholder)
    checkAuthState();

    // Load Dynamic Content
    loadCategories();
    loadFeaturedServices();
    loadTestimonials();
    loadStats();

    // Initialize lazy loading
    initLazyLoading();
});

// TODO: Replace with actual API call
async function fetchCategories() {
    // const response = await fetch('/api/categories');
    // const data = await response.json();
    // return data;
    return [];
}

// TODO: Replace with actual API call
async function fetchFeaturedServices() {
    // const response = await fetch('/api/services/featured');
    // const data = await response.json();
    // return data;
    return [];
}

// TODO: Replace with actual API call
async function fetchTestimonials() {
    // const response = await fetch('/api/testimonials');
    // const data = await response.json();
    // return data;
    return [];
}

// TODO: Replace with actual API call
async function fetchStats() {
    // const response = await fetch('/api/stats');
    // const data = await response.json();
    // return data;
    return {};
}

function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    // TODO: Fetch from API
    const categories = [
        { name: 'Home Services', icon: 'home', count: 0, slug: 'home-services' },
        { name: 'Cleaning', icon: 'sparkles', count: 0, slug: 'cleaning' },
        { name: 'Repairs', icon: 'wrench', count: 0, slug: 'repairs' },
        { name: 'Design', icon: 'palette', count: 0, slug: 'design' },
        { name: 'Events', icon: 'calendar', count: 0, slug: 'events' },
        { name: 'Tech', icon: 'laptop', count: 0, slug: 'tech' }
    ];

    categoriesGrid.innerHTML = categories.map(cat => `
        <a href="services.html?category=${cat.slug}" class="category-card bg-white rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-all cursor-pointer group">
            <div class="w-14 h-14 mx-auto mb-4 rounded-xl bg-gray-50 flex items-center justify-center category-icon text-text-muted group-hover:bg-emerald-50 transition-colors">
                <i data-lucide="${cat.icon}" class="w-7 h-7"></i>
            </div>
            <h3 class="font-semibold text-text mb-1">${cat.name}</h3>
            <p class="text-sm text-text-muted">${cat.count} Pros</p>
        </a>
    `).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadFeaturedServices() {
    const container = document.getElementById('featuredServices');
    if (!container) return;

    // TODO: Fetch from API
    const services = [];

    if (services.length === 0) {
        container.innerHTML = Array(4).fill(0).map((_, i) => `
            <div class="service-card bg-white rounded-2xl border border-border overflow-hidden group cursor-pointer" onclick="window.location.href='service-detail.html?id=${i + 1}'">
                <div class="aspect-video bg-gray-200 relative overflow-hidden">
                    <img src="http://static.photos/workspace/640x360/${i + 10}" alt="Service" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-src="service-${i}">
                    <button class="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors" onclick="event.stopPropagation(); toggleWishlist(${i})">
                        <i data-lucide="heart" class="w-4 h-4 text-text-muted"></i>
                    </button>
                </div>
                <div class="p-5">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">P</div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-text truncate">Provider Name</p>
                            <span class="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Pro</span>
                        </div>
                    </div>
                    <h3 class="font-semibold text-text mb-2 line-clamp-2">Service Title Placeholder</h3>
                    <div class="flex items-center gap-1 mb-3">
                        <i data-lucide="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i>
                        <span class="text-sm font-medium">4.9</span>
                        <span class="text-sm text-text-muted">(0 reviews)</span>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-border">
                        <span class="text-xs text-text-muted">Starting at</span>
                        <span class="font-bold text-lg">$00</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        // Render actual services
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    // TODO: Fetch from API
    const testimonials = [
        { name: 'Sarah Johnson', role: 'Homeowner', text: 'Amazing service! The plumber arrived within 30 minutes and fixed our leak perfectly. Highly recommended!', rating: 5 },
        { name: 'Mike Chen', role: 'Business Owner', text: 'KwikConnectHub made it so easy to find a reliable cleaner for our office. The booking process was seamless.', rating: 5 },
        { name: 'Emily Davis', role: 'Homeowner', text: 'Great experience with the furniture assembly service. Professional, quick, and affordable. Will use again!', rating: 5 }
    ];

    container.innerHTML = testimonials.map(t => `
        <div class="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div class="flex items-center gap-1 mb-4">
                ${Array(t.rating).fill().map(() => `<i data-lucide="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i>`).join('')}
            </div>
            <p class="text-text mb-6 leading-relaxed">"${t.text}"</p>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                    ${t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p class="font-semibold text-text text-sm">${t.name}</p>
                    <p class="text-xs text-text-muted">${t.role}</p>
                </div>
            </div>
        </div>
    `).join('');

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function loadStats() {
    // TODO: Fetch from API and animate numbers
    const stats = { professionals: 2500, services: 15000, rating: 4.9 };

    animateValue('statProfessionals', 0, stats.professionals, 2000);
    animateValue('statServices', 0, stats.services, 2000);
    animateValue('statRating', 0, stats.rating, 2000, true);
}

function animateValue(id, start, end, duration, isDecimal = false) {
    const obj = document.getElementById(id);
    if (!obj) return;

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = progress * (end - start) + start;
        obj.innerHTML = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function checkAuthState() {
    // TODO: Check actual auth state from API/localStorage
    const isLoggedIn = false; // Placeholder

    const loggedOutNav = document.querySelector('.nav-logged-out');
    const loggedInNav = document.querySelector('.nav-logged-in');

    if (isLoggedIn) {
        loggedOutNav?.classList.add('hidden');
        loggedInNav?.classList.remove('hidden');
        loggedInNav?.classList.add('flex');
    } else {
        loggedOutNav?.classList.remove('hidden');
        loggedOutNav?.classList.add('flex');
        loggedInNav?.classList.add('hidden');
    }
}

function handleLogout() {
    // TODO: Call logout API
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function handleHeroSearch() {
    // TODO: Implement search
    const query = document.querySelector('input[placeholder*="What service"]').value;
    if (query) {
        window.location.href = `services.html?search=${encodeURIComponent(query)}`;
    }
}

function filterByTag(tag) {
    window.location.href = `services.html?search=${encodeURIComponent(tag)}`;
}

function toggleWishlist(id) {
    // TODO: Implement wishlist toggle
    showToast('Added to saved services', 'success');
}

function scrollServices(direction) {
    // TODO: Implement carousel scroll
    console.log('Scroll', direction);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-800';

    toast.className = `toast ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[300px]`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info'}" class="w-5 h-5"></i>
        <span class="font-medium">${message}</span>
    `;

    container.appendChild(toast);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initLazyLoading() {
    // TODO: Implement intersection observer for lazy loading
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.classList.add('loaded');
    });
}

// Expose functions to window
window.handleHeroSearch = handleHeroSearch;
window.filterByTag = filterByTag;
window.toggleWishlist = toggleWishlist;
window.scrollServices = scrollServices;
window.handleLogout = handleLogout;
