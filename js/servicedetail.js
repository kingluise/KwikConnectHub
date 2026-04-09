// KwikConnectHub - Service Detail Page JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  SERVICES DATA
    //  (mirrors services.js — in production this would come from an API)
    // ══════════════════════════════
    const servicesData = {
        1: {
            id: 1,
            title: "Professional Home Deep Cleaning Service",
            category: "Cleaning",
            location: "Lagos, Nigeria",
            tags: ["Deep Clean", "Move-in/out", "Post-construction"],
            rating: 4.9,
            reviews: 128,
            images: [
                "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
                "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80",
                "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80"
            ],
            description: `<p>Transform your home with our comprehensive deep cleaning service. We go beyond the surface to deliver a spotless, sanitized living environment that you'll love coming back to.</p>
            <p>Our team of trained and background-checked cleaning professionals use eco-friendly, hospital-grade products that are safe for your family, kids, and pets — while delivering a deep clean that regular cleaning simply can't match.</p>
            <p>Whether you need a one-time deep clean, a post-construction cleanup, or a move-in/move-out service, we have you covered with flexible scheduling and transparent pricing.</p>`,
            included: [
                "Kitchen deep clean", "Bathroom sanitization", "Bedroom dusting & vacuuming",
                "Floor mopping & polishing", "Window cleaning", "Appliance exterior cleaning",
                "Refrigerator interior", "Cabinet wipe-down"
            ],
            plans: {
                basic: {
                    name: "Basic",
                    price: 85,
                    desc: "Perfect for small apartments and studio flats. Covers main living areas.",
                    features: ["1-2 bedrooms", "1 bathroom", "Kitchen & living room", "Eco-friendly products"],
                    delivery: "3-4 hours"
                },
                standard: {
                    name: "Standard",
                    price: 150,
                    desc: "Ideal for medium-sized homes. Full deep clean with extra attention to detail.",
                    features: ["3-4 bedrooms", "2 bathrooms", "All rooms included", "Inside appliances", "Window cleaning"],
                    delivery: "5-6 hours"
                },
                premium: {
                    name: "Premium",
                    price: 250,
                    desc: "Complete deep clean for large homes. Every corner spotless, guaranteed.",
                    features: ["5+ bedrooms", "3+ bathrooms", "Full house coverage", "Carpet shampooing", "Post-service inspection", "24hr re-clean guarantee"],
                    delivery: "8-10 hours"
                }
            },
            provider: {
                name: "Sarah Mensah",
                tagline: "Professional Cleaning Expert · 6 years experience",
                avatar: "https://i.pravatar.cc/200?img=1",
                rating: "4.9",
                jobs: "430+",
                years: "6",
                bio: "Hi! I'm Sarah, a certified home cleaning professional based in Lagos. I founded my cleaning business in 2018 with a simple mission: to give every client a truly spotless home they can be proud of. I personally oversee every job and only use verified, eco-friendly cleaning products.",
                skills: ["Deep Cleaning", "Carpet Care", "Post-Construction", "Move-In/Out", "Office Cleaning"],
                badges: ["Verified Pro", "Top Rated", "Fast Responder"]
            },
            stats: {
                delivery: "Same Day",
                repeat: "78%",
                response: "< 1 hour"
            },
            reviewList: [
                { name: "Amaka O.", initials: "AO", date: "March 2025", rating: 5, text: "Absolutely incredible service! Sarah and her team arrived on time, were professional, and left my apartment looking brand new. Will definitely book again." },
                { name: "Chidi N.", initials: "CN", date: "February 2025", rating: 5, text: "Best cleaning service I've used in Lagos. They were thorough, didn't cut corners, and the price was very fair for the quality." },
                { name: "Bisi A.", initials: "BA", date: "January 2025", rating: 4, text: "Very happy with the result. A few minor spots were missed but they came back the same day to fix everything. Great customer service." },
                { name: "Emeka F.", initials: "EF", date: "December 2024", rating: 5, text: "Used them for a post-construction cleanup. The place was a disaster zone before they came in — they made it spotless. Highly recommend." }
            ],
            faq: [
                { q: "Do I need to provide cleaning supplies?", a: "No, we bring all our own professional-grade, eco-friendly cleaning products and equipment. You don't need to provide anything." },
                { q: "How do I prepare for the cleaning?", a: "Simply make sure the team can access all areas of your home. It helps to clear countertops and pick up any personal items off the floor beforehand." },
                { q: "Are your cleaners background-checked?", a: "Yes, every member of our team goes through a thorough background check and reference verification before joining us." },
                { q: "What if I'm not satisfied with the results?", a: "We offer a 24-hour re-clean guarantee. If you're not happy with any part of the job, contact us and we'll return to fix it at no extra cost." }
            ]
        },
        2: {
            id: 2,
            title: "Expert Plumbing Repair & Installation",
            category: "Repairs",
            location: "Lagos, Nigeria",
            tags: ["Emergency", "Installation", "Repairs"],
            rating: 5.0,
            reviews: 89,
            images: [
                "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
                "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80"
            ],
            description: `<p>Fast, reliable plumbing solutions for homes and businesses. From minor leaks to full pipe installations, we handle every plumbing job with precision and professionalism.</p>
            <p>With over 8 years of experience, our certified plumbers diagnose and fix issues quickly, saving you time and money. We carry all major parts and fittings in our van, so most jobs are completed in a single visit.</p>`,
            included: [
                "Free diagnosis", "All parts included", "Leak detection", "Pipe installation",
                "Fixture installation", "Drain unblocking", "Water heater service", "Emergency callouts"
            ],
            plans: {
                basic: { name: "Basic", price: 120, desc: "Minor repairs: leaky taps, blocked drains, toilet fixes.", features: ["1 fixture repair", "Parts included", "1-hour job", "Same-day available"], delivery: "1-2 hours" },
                standard: { name: "Standard", price: 200, desc: "Multiple repairs or one complex installation.", features: ["Up to 3 repairs", "Parts included", "Full diagnosis", "Warranty on work"], delivery: "3-4 hours" },
                premium: { name: "Premium", price: 380, desc: "Full plumbing inspection and multi-room service.", features: ["Full house inspection", "Unlimited repairs", "Parts included", "6-month warranty", "Priority scheduling"], delivery: "Full day" }
            },
            provider: {
                name: "Alex Kolade",
                tagline: "Certified Plumber · 8 years experience",
                avatar: "https://i.pravatar.cc/200?img=2",
                rating: "5.0",
                jobs: "290+",
                years: "8",
                bio: "I'm Alex, a certified master plumber with 8 years of experience across residential and commercial properties. I believe in doing the job right the first time, which is why 80% of my clients book me again.",
                skills: ["Pipe Installation", "Leak Repair", "Drain Clearing", "Water Heaters", "Emergency Plumbing"],
                badges: ["Verified Pro", "Top Rated", "Licensed & Insured"]
            },
            stats: { delivery: "Same Day", repeat: "81%", response: "< 30 mins" },
            reviewList: [
                { name: "Tunde B.", initials: "TB", date: "March 2025", rating: 5, text: "Alex fixed my burst pipe within an hour of calling. Absolute lifesaver! Very professional and reasonably priced." },
                { name: "Kemi L.", initials: "KL", date: "February 2025", rating: 5, text: "Installed a new water heater for me. Clean work, explained everything, and cleaned up after himself. 10/10." }
            ],
            faq: [
                { q: "Do you offer emergency services?", a: "Yes, we offer 24/7 emergency callouts for burst pipes, severe leaks, and blocked drains." },
                { q: "Are parts included in the price?", a: "Yes, all standard parts are included in our pricing. For specialty items, we'll get your approval before ordering." }
            ]
        }
    };

    // Add fallback for service IDs 3–12 using service 1 as template
    for (let i = 3; i <= 12; i++) {
        if (!servicesData[i]) {
            servicesData[i] = { ...servicesData[1], id: i };
        }
    }

    // ══════════════════════════════
    //  GET SERVICE ID FROM URL
    // ══════════════════════════════
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = parseInt(urlParams.get('id')) || 1;
    const service = servicesData[serviceId] || servicesData[1];

    // ══════════════════════════════
    //  NAVBAR SCROLL
    // ══════════════════════════════
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    });

    // ══════════════════════════════
    //  MOBILE MENU
    // ══════════════════════════════
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu    = document.getElementById('mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
        lucide.createIcons();
    });

    // ══════════════════════════════
    //  POPULATE PAGE
    // ══════════════════════════════
    function populatePage() {
        // Breadcrumb & title
        document.getElementById('breadcrumbTitle').textContent = service.title;
        document.title = `${service.title} — KwikConnectHub`;

        // ── Service meta card (right column) ──
        document.getElementById('metaCategory').textContent = service.category;
        document.getElementById('serviceTitle').textContent = service.title;
        document.getElementById('metaScore').textContent = service.rating.toFixed(1);
        document.getElementById('metaReviews').textContent = `(${service.reviews} reviews)`;
        document.getElementById('metaProviderImg').src = service.provider.avatar;
        document.getElementById('metaProviderName').textContent = service.provider.name;
        document.getElementById('metaLocation').querySelector('span').textContent = service.location;

        // Stars
        renderStars('metaStars', service.rating);

        // Tags
        document.getElementById('metaTags').innerHTML = service.tags
            .map(t => `<span class="meta-tag">${t}</span>`).join('');

        // Quick stats
        document.getElementById('qsDelivery').textContent = service.stats.delivery;
        document.getElementById('qsRepeat').textContent   = service.stats.repeat;
        document.getElementById('qsResponse').textContent = service.stats.response;

        // ── Gallery ──
        populateGallery();

        // ── Description tab ──
        document.getElementById('serviceDescription').innerHTML = service.description;
        document.getElementById('includedList').innerHTML = service.included
            .map(item => `<li>${item}</li>`).join('');

        // ── About tab ──
        document.getElementById('providerImg').src          = service.provider.avatar;
        document.getElementById('providerFullName').textContent = service.provider.name;
        document.getElementById('providerTagline').textContent  = service.provider.tagline;
        document.getElementById('providerRating').textContent   = service.provider.rating;
        document.getElementById('providerJobs').textContent     = service.provider.jobs;
        document.getElementById('providerYears').textContent    = service.provider.years;
        document.getElementById('providerBio').textContent      = service.provider.bio;

        document.getElementById('providerSkills').innerHTML = service.provider.skills
            .map(s => `<span class="skill-tag">${s}</span>`).join('');

        document.getElementById('providerBadges').innerHTML = service.provider.badges
            .map(b => `<span class="provider-badge-item"><i data-lucide="check-circle"></i>${b}</span>`).join('');

        // ── Reviews tab ──
        populateReviews();

        // ── FAQ tab ──
        populateFAQ();

        // ── Pricing ── (default: basic)
        renderPricingPlan('basic');

        // ── Related services ──
        populateRelated();

        lucide.createIcons();
    }

    // ══════════════════════════════
    //  GALLERY
    // ══════════════════════════════
    let currentImageIndex = 0;
    const images = service.images;

    function populateGallery() {
        const mainImage = document.getElementById('mainImage');
        mainImage.src = images[0];

        const thumbsContainer = document.getElementById('galleryThumbs');
        thumbsContainer.innerHTML = images.map((src, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${src}" alt="Image ${i + 1}">
            </div>
        `).join('');

        updateGalleryCounter();

        // Thumb clicks
        thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                setImage(parseInt(thumb.dataset.index));
            });
        });
    }

    function setImage(index) {
        currentImageIndex = index;
        const mainImage = document.getElementById('mainImage');
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = images[index];
            mainImage.style.opacity = '1';
        }, 200);

        document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });

        updateGalleryCounter();
    }

    function updateGalleryCounter() {
        document.getElementById('galleryCounter').textContent = `${currentImageIndex + 1} / ${images.length}`;
    }

    document.getElementById('galleryPrev').addEventListener('click', () => {
        setImage((currentImageIndex - 1 + images.length) % images.length);
    });

    document.getElementById('galleryNext').addEventListener('click', () => {
        setImage((currentImageIndex + 1) % images.length);
    });

    // ══════════════════════════════
    //  RENDER STARS
    // ══════════════════════════════
    function renderStars(containerId, rating) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = [1,2,3,4,5].map(i =>
            `<i data-lucide="star" style="width:14px;height:14px;color:#f59e0b;fill:${i <= Math.round(rating) ? '#f59e0b' : 'none'};"></i>`
        ).join('');
    }

    // ══════════════════════════════
    //  PRICING PLANS
    // ══════════════════════════════
    let activePlan = 'basic';

    function renderPricingPlan(planKey) {
        activePlan = planKey;
        const plan = service.plans[planKey];
        const pricingBody = document.getElementById('pricingBody');

        pricingBody.innerHTML = `
            <div class="plan-name">${plan.name} Plan</div>
            <div class="plan-price">$${plan.price} <span>/ service</span></div>
            <p class="plan-desc">${plan.desc}</p>
            <ul class="plan-features">
                ${plan.features.map(f => `<li><i data-lucide="check"></i>${f}</li>`).join('')}
            </ul>
            <div class="plan-delivery">
                <i data-lucide="clock"></i>
                Estimated duration: <strong>${plan.delivery}</strong>
            </div>
        `;

        document.getElementById('modalPlanInfo').innerHTML =
            `<strong>${plan.name} Plan</strong> — $${plan.price} · ${plan.delivery}`;
        document.getElementById('modalTotal').innerHTML =
            `💳 Total: <strong>$${plan.price}</strong> (${plan.name} Plan)`;

        lucide.createIcons();
    }

    document.querySelectorAll('.pricing-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPricingPlan(tab.dataset.plan);
        });
    });

    // ══════════════════════════════
    //  REVIEWS
    // ══════════════════════════════
    function populateReviews() {
        // Score summary
        const scoreHTML = `
            <span class="score-big">${service.rating.toFixed(1)}</span>
            <div class="score-stars">${[1,2,3,4,5].map(i =>
                `<i data-lucide="star" style="width:15px;height:15px;color:#f59e0b;fill:#f59e0b;"></i>`
            ).join('')}</div>
            <span class="score-total">${service.reviews} reviews</span>
        `;
        document.getElementById('reviewsScore').innerHTML = scoreHTML;

        // Breakdown bars (simulated distribution)
        const breakdown = [
            { label: '5 ★', pct: 75 },
            { label: '4 ★', pct: 18 },
            { label: '3 ★', pct: 5 },
            { label: '2 ★', pct: 1 },
            { label: '1 ★', pct: 1 }
        ];

        document.getElementById('reviewsBreakdown').innerHTML = breakdown.map(b => `
            <div class="breakdown-row">
                <span class="breakdown-label">${b.label}</span>
                <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width: ${b.pct}%"></div>
                </div>
                <span class="breakdown-pct">${b.pct}%</span>
            </div>
        `).join('');

        // Review items
        document.getElementById('reviewsList').innerHTML = service.reviewList.map(r => `
            <div class="review-item">
                <div class="review-top">
                    <div class="review-avatar">${r.initials}</div>
                    <div class="review-meta">
                        <div class="review-name">${r.name}</div>
                        <div class="review-date">${r.date}</div>
                    </div>
                    <div class="review-stars">
                        ${[1,2,3,4,5].map(i =>
                            `<i data-lucide="star" style="width:13px;height:13px;color:#f59e0b;fill:${i <= r.rating ? '#f59e0b' : 'none'};"></i>`
                        ).join('')}
                    </div>
                </div>
                <p class="review-text">${r.text}</p>
            </div>
        `).join('');
    }

    // ══════════════════════════════
    //  FAQ
    // ══════════════════════════════
    function populateFAQ() {
        document.getElementById('faqList').innerHTML = service.faq.map((item, i) => `
            <div class="faq-item" data-index="${i}">
                <button class="faq-question">
                    ${item.q}
                    <i data-lucide="chevron-down"></i>
                </button>
                <div class="faq-answer">${item.a}</div>
            </div>
        `).join('');

        document.querySelectorAll('.faq-item').forEach(item => {
            item.querySelector('.faq-question').addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                if (!isOpen) item.classList.add('open');
                lucide.createIcons();
            });
        });
    }

    // ══════════════════════════════
    //  RELATED SERVICES
    // ══════════════════════════════
    function populateRelated() {
        const related = [
            { id: 2, title: "Expert Plumbing Repair", rating: 5.0, price: 120, img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80" },
            { id: 5, title: "AC Repair & Maintenance", rating: 4.8, price: 75,  img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
            { id: 6, title: "Furniture Assembly",      rating: 4.9, price: 60,  img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" },
            { id: 11, title: "Home Electrical Wiring", rating: 4.8, price: 110, img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80" }
        ].filter(r => r.id !== service.id);

        document.getElementById('relatedGrid').innerHTML = related.map(r => `
            <div class="related-card" onclick="window.location.href='service-detail.html?id=${r.id}'">
                <div class="related-card-img">
                    <img src="${r.img}" alt="${r.title}" loading="lazy">
                </div>
                <div class="related-card-body">
                    <h4 class="related-card-title">${r.title}</h4>
                    <div class="related-card-meta">
                        <div class="related-rating">
                            <i data-lucide="star"></i>
                            ${r.rating.toFixed(1)}
                        </div>
                        <div class="related-price">$${r.price}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // ══════════════════════════════
    //  TABS
    // ══════════════════════════════
    document.querySelectorAll('.info-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`).classList.remove('hidden');
        });
    });

    // ══════════════════════════════
    //  WISHLIST TOGGLE
    // ══════════════════════════════
    const metaWishlist = document.getElementById('metaWishlist');
    metaWishlist.addEventListener('click', () => {
        const isLiked = metaWishlist.classList.toggle('liked');
        const icon = metaWishlist.querySelector('i');
        icon.style.fill = isLiked ? '#ef4444' : 'none';
        showToast(isLiked ? 'Saved to wishlist!' : 'Removed from wishlist');
        lucide.createIcons();
    });

    // ══════════════════════════════
    //  BOOKING MODAL
    // ══════════════════════════════
    const modalOverlay = document.getElementById('modalOverlay');
    const bookBtn      = document.getElementById('bookBtn');
    const modalClose   = document.getElementById('modalClose');
    const modalCancel  = document.getElementById('modalCancel');
    const modalConfirm = document.getElementById('modalConfirm');

    function openModal() {
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').min = today;

        // Update modal plan info from active plan
        const plan = service.plans[activePlan];
        document.getElementById('modalPlanInfo').innerHTML =
            `Booking: <strong>${service.title}</strong><br>Plan: <strong>${plan.name}</strong> — $${plan.price}`;
        document.getElementById('modalTotal').innerHTML =
            `💳 Total: <strong>$${plan.price}</strong>`;

        lucide.createIcons();
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }

    bookBtn.addEventListener('click', () => {
        openModal();
    });

    document.getElementById('contactBtn').addEventListener('click', () => {
        showToast('Messaging feature coming soon!');
    });

    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Confirm booking
    modalConfirm.addEventListener('click', () => {
        const date    = document.getElementById('bookingDate').value;
        const time    = document.getElementById('bookingTime').value;
        const address = document.getElementById('bookingAddress').value.trim();

        if (!date)    { showToast('Please select a date.', 'error');    return; }
        if (!time)    { showToast('Please select a time slot.', 'error'); return; }
        if (!address) { showToast('Please enter your address.', 'error'); return; }

        // Simulate booking
        modalConfirm.innerHTML = '<i data-lucide="loader"></i> Processing...';
        lucide.createIcons();

        setTimeout(() => {
            closeModal();
            showToast('Booking confirmed! Check your email for details.');
            modalConfirm.innerHTML = '<i data-lucide="check"></i> Confirm Booking';
            lucide.createIcons();
        }, 1800);
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
    populatePage();

    console.log('🚀 KwikConnectHub Service Detail loaded!');
});
