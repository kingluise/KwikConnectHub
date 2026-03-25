// ServiceHub Marketplace - Vanilla JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            mobileMenu.classList.toggle('hidden');

            // Change icon based on state
            const icon = mobileMenuBtn.querySelector('i');
            if (isMenuOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 10) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Hide/show navbar on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');

    if (searchInput && searchSuggestions) {
        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            searchSuggestions.classList.remove('hidden');
            setTimeout(() => {
                searchSuggestions.classList.remove('opacity-0', '-translate-y-2');
            }, 10);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.add('opacity-0', '-translate-y-2');
                setTimeout(() => {
                    searchSuggestions.classList.add('hidden');
                }, 200);
            }
        });

        // Handle search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    // Simulate search action
                    showToast(`Searching for: ${query}`);
                    searchSuggestions.classList.add('hidden');
                }
            }
        });
    }

    // Heart/Like button functionality
    const heartButtons = document.querySelectorAll('[data-lucide="heart"]');
    heartButtons.forEach(button => {
        button.closest('button')?.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');

            if (this.classList.contains('heart-filled')) {
                this.classList.remove('heart-filled');
                icon.classList.remove('fill-current', 'text-red-500');
                icon.classList.add('text-gray-600');
            } else {
                this.classList.add('heart-filled');
                icon.classList.add('fill-current', 'text-red-500');
                icon.classList.remove('text-gray-600');

                // Small animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });

    // Service cards data (for dynamic loading simulation)
    const servicesData = [
        {
            title: "AC Repair & Maintenance",
            provider: "Mike R.",
            rating: 4.8,
            reviews: 156,
            price: 75,
            image: "http://static.photos/indoor/640x360/2",
            avatar: "http://static.photos/people/200x200/11",
            badge: "Top Rated"
        },
        {
            title: "Furniture Assembly",
            provider: "David L.",
            rating: 4.9,
            reviews: 89,
            price: 60,
            image: "http://static.photos/indoor/640x360/3",
            avatar: "http://static.photos/people/200x200/12",
            badge: null
        },
        {
            title: "Personal Fitness Training",
            provider: "Emma W.",
            rating: 5.0,
            reviews: 234,
            price: 50,
            image: "http://static.photos/outdoor/640x360/2",
            avatar: "http://static.photos/people/200x200/13",
            badge: "Popular"
        },
        {
            title: "Logo Design & Branding",
            provider: "Chris M.",
            rating: 4.7,
            reviews: 312,
            price: 199,
            image: "http://static.photos/workspace/640x360/3",
            avatar: "http://static.photos/people/200x200/14",
            badge: null
        }
    ];

    // Load more services functionality
    const servicesGrid = document.getElementById('servicesGrid');
    let currentPage = 1;

    function createServiceCard(service) {
        return `
            <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 opacity-0 translate-y-4 animate-fade-in">
                <div class="relative h-48 overflow-hidden">
                    <img src="${service.image}" alt="${service.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    ${service.badge ? `<div class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">${service.badge}</div>` : ''}
                    <button class="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors heart-btn">
                        <i data-lucide="heart" class="w-4 h-4 text-gray-600"></i>
                    </button>
                </div>
                <div class="p-5">
                    <div class="flex items-center gap-2 mb-3">
                        <img src="${service.avatar}" alt="${service.provider}" class="w-8 h-8 rounded-full object-cover">
                        <span class="text-sm font-medium text-gray-700">${service.provider}</span>
                        <span class="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Pro</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${service.title}</h3>
                    <div class="flex items-center gap-1 mb-3">
                        <i data-lucide="star" class="w-4 h-4 text-amber-400 fill-current"></i>
                        <span class="text-sm font-medium text-gray-900">${service.rating}</span>
                        <span class="text-sm text-gray-500">(${service.reviews} reviews)</span>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-500">Starting at</span>
                        <span class="text-lg font-bold text-gray-900">$${service.price}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-4');
            }
        });
    }, observerOptions);

    // Observe all service cards
    document.querySelectorAll('#servicesGrid > div').forEach(card => {
        card.classList.add('transition-all', 'duration-500');
        observer.observe(card);
    });

    // Toast notification system
    function showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification fixed bottom-4 right-4 px-6 py-3 bg-gray-900 text-white rounded-lg shadow-lg transform translate-y-10 opacity-0 transition-all duration-300 z-50 flex items-center gap-2`;

        const icon = type === 'success' ? 'check-circle' : 'info';
        toast.innerHTML = `
            <i data-lucide="${icon}" class="w-5 h-5 text-emerald-400"></i>
            <span class="font-medium">${message}</span>
        `;

        document.body.appendChild(toast);
        lucide.createIcons();

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Category card click handler
    document.querySelectorAll('.group').forEach(card => {
        if (card.querySelector('h3')) {  // Only for category cards
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryName = card.querySelector('h3').textContent;
                showToast(`Exploring ${categoryName} services...`);
            });
        }
    });

    // Button click handlers for "Coming Soon" features
    document.querySelectorAll('button').forEach(button => {
        if (!button.id && !button.classList.contains('heart-btn')) {
            button.addEventListener('click', (e) => {
                // Check if it's a functional button
                const text = button.textContent.trim();
                if (text && !button.type === 'submit') {
                    if (text.includes('View All') || text.includes('Become') || text.includes('Join')) {
                        showToast(`${text} - Coming Soon!`);
                    }
                }
            });
        }
    });

    // Performance: Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add CSS animation for fade-in
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease forwards;
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 ServiceHub Marketplace loaded successfully!');
});
