// KwikConnectHub - Service Detail Page JavaScript

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
    //  GET SERVICE ID FROM URL
    // ══════════════════════════════
    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        // No ID provided — redirect to services listing
        window.location.href = 'services.html';
        return;
    }

    // ══════════════════════════════
    //  STATE
    // ══════════════════════════════
    let serviceData   = null;
    let currentImgIdx = 0;
    let images        = [];
    let activePlan    = 'basic';

    // ══════════════════════════════
    //  LOAD SERVICE DATA
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadService() {
        showSkeleton(true);

        try {
            // TODO: GET /api/services/:serviceId
            // const res  = await fetch(`/api/services/${serviceId}`);
            // if (!res.ok) throw new Error('Service not found');
            // serviceData = await res.json();
            // populatePage(serviceData);

            // ── Placeholder: shows empty/skeleton state until backend is connected ──
            // Remove the lines below once API is integrated
            showSkeleton(false);
            showEmptyState();

        } catch (err) {
            showSkeleton(false);
            showToast('Failed to load service. Please try again.', 'error');
            console.error('loadService error:', err);
        }
    }

    function showSkeleton(visible) {
        document.getElementById('skeletonWrap').classList.toggle('hidden', !visible);
        document.getElementById('detailContent').classList.toggle('hidden', visible);
    }

    function showEmptyState() {
        // When no data is returned from the API, show a minimal placeholder
        document.getElementById('detailContent').classList.remove('hidden');
        document.getElementById('skeletonWrap').classList.add('hidden');

        document.getElementById('serviceTitle').textContent       = 'Service not found';
        document.getElementById('serviceDescription').innerHTML   = '<p>This service could not be loaded. It may have been removed or is temporarily unavailable.</p>';
        document.getElementById('breadcrumbTitle').textContent    = 'Service Detail';
    }

    // ══════════════════════════════
    //  POPULATE PAGE
    //  Called after successful API response
    // ══════════════════════════════
    function populatePage(data) {
        serviceData = data;
        images      = data.images || [];

        // Page title & breadcrumb
        document.title = `${data.title} — KwikConnectHub`;
        document.getElementById('breadcrumbTitle').textContent = data.title;

        // ── Meta card (right) ──
        document.getElementById('metaCategory').textContent          = data.category || '';
        document.getElementById('serviceTitle').textContent          = data.title    || '';
        document.getElementById('metaScore').textContent             = data.rating   ? data.rating.toFixed(1) : '';
        document.getElementById('metaReviews').textContent           = data.reviewCount ? `(${data.reviewCount} reviews)` : '';
        document.getElementById('metaProviderName').textContent      = data.provider?.name    || '';
        document.getElementById('metaLocationText').textContent      = data.location           || '';

        // Provider avatar (right meta)
        setAvatar('metaProviderAvatar', data.provider?.name, data.provider?.avatarUrl);

        // Stars
        renderStars('metaStars', data.rating || 0);

        // Tags
        document.getElementById('metaTags').innerHTML = (data.tags || [])
            .map(t => `<span class="meta-tag">${t}</span>`).join('');

        // Quick stats
        document.getElementById('qsDelivery').textContent = data.stats?.avgDelivery  || '—';
        document.getElementById('qsRepeat').textContent   = data.stats?.repeatClients || '—';
        document.getElementById('qsResponse').textContent = data.stats?.responseTime  || '—';

        // ── Gallery ──
        populateGallery();

        // ── Description tab ──
        document.getElementById('serviceDescription').innerHTML = data.description || '<p>No description provided.</p>';
        document.getElementById('includedList').innerHTML = (data.included || [])
            .map(item => `<li>${item}</li>`).join('');

        // ── About tab ──
        setAvatar('providerAvatar', data.provider?.name, data.provider?.avatarUrl);
        document.getElementById('providerFullName').textContent  = data.provider?.name     || '';
        document.getElementById('providerTagline').textContent   = data.provider?.tagline  || '';
        document.getElementById('providerRating').textContent    = data.provider?.rating   || '—';
        document.getElementById('providerJobs').textContent      = data.provider?.jobsDone || '—';
        document.getElementById('providerYears').textContent     = data.provider?.yearsExp || '—';
        document.getElementById('providerBio').textContent       = data.provider?.bio      || '';

        document.getElementById('providerSkills').innerHTML = (data.provider?.skills || [])
            .map(s => `<span class="skill-tag">${s}</span>`).join('');

        document.getElementById('providerBadges').innerHTML = (data.provider?.badges || [])
            .map(b => `<span class="provider-badge-item"><i data-lucide="check-circle"></i>${b}</span>`).join('');

        // ── Reviews tab ──
        populateReviews(data.reviews || [], data.rating || 0, data.reviewCount || 0, data.ratingBreakdown || {});

        // ── FAQ tab ──
        populateFAQ(data.faq || []);

        // ── Pricing ──
        renderPricingPlan('basic', data.plans);

        // ── Related services ──
        loadRelated(data.category, data.id);

        // Show content
        showSkeleton(false);
        document.getElementById('detailContent').classList.remove('hidden');
        lucide.createIcons();
    }

    // ══════════════════════════════
    //  AVATAR HELPER
    //  Sets initials or image on an avatar element
    // ══════════════════════════════
    function setAvatar(elId, name, imageUrl) {
        const el = document.getElementById(elId);
        if (!el) return;
        if (imageUrl) {
            el.innerHTML = `<img src="${imageUrl}" alt="${name || ''}">`;
        } else {
            el.textContent = name ? name.charAt(0).toUpperCase() : '?';
        }
    }

    // ══════════════════════════════
    //  GALLERY
    // ══════════════════════════════
    function populateGallery() {
        const mainImage = document.getElementById('mainImage');

        if (!images || images.length === 0) {
            mainImage.closest('.gallery-main').innerHTML = `
                <div class="gallery-placeholder">
                    <i data-lucide="image"></i>
                    <span>No images available</span>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        mainImage.src = images[0];
        updateGalleryCounter();

        const thumbsWrap = document.getElementById('galleryThumbs');
        thumbsWrap.innerHTML = images.map((src, i) => `
            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
                <img src="${src}" alt="Image ${i + 1}" loading="lazy">
            </div>
        `).join('');

        thumbsWrap.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => setImage(parseInt(thumb.dataset.index)));
        });
    }

    function setImage(index) {
        if (!images.length) return;
        currentImgIdx = index;
        const mainImage = document.getElementById('mainImage');
        mainImage.style.opacity = '0';
        setTimeout(() => { mainImage.src = images[index]; mainImage.style.opacity = '1'; }, 200);
        document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === index));
        updateGalleryCounter();
    }

    function updateGalleryCounter() {
        document.getElementById('galleryCounter').textContent = `${currentImgIdx + 1} / ${images.length || 1}`;
    }

    document.getElementById('galleryPrev').addEventListener('click', () => {
        setImage((currentImgIdx - 1 + images.length) % images.length);
    });
    document.getElementById('galleryNext').addEventListener('click', () => {
        setImage((currentImgIdx + 1) % images.length);
    });

    // ══════════════════════════════
    //  STARS RENDERER
    // ══════════════════════════════
    function renderStars(containerId, rating) {
        const el = document.getElementById(containerId);
        if (!el) return;
        el.innerHTML = [1,2,3,4,5].map(i =>
            `<i data-lucide="star" style="width:14px;height:14px;color:#f59e0b;fill:${i <= Math.round(rating) ? '#f59e0b' : 'none'};"></i>`
        ).join('');
    }

    // ══════════════════════════════
    //  PRICING PLANS
    // ══════════════════════════════
    function renderPricingPlan(planKey, plans) {
        if (!plans) return;
        activePlan = planKey;
        const plan = plans[planKey];
        if (!plan) return;

        document.getElementById('pricingBody').innerHTML = `
            <div class="plan-name">${plan.name} Plan</div>
            <div class="plan-price">$${plan.price} <span>/ service</span></div>
            <p class="plan-desc">${plan.description || ''}</p>
            <ul class="plan-features">
                ${(plan.features || []).map(f => `<li><i data-lucide="check"></i>${f}</li>`).join('')}
            </ul>
            <div class="plan-delivery">
                <i data-lucide="clock"></i>
                Estimated duration: <strong>${plan.deliveryTime || '—'}</strong>
            </div>
        `;

        // Update modal summary
        document.getElementById('modalPlanSummary').innerHTML =
            `<strong>${plan.name} Plan</strong> — $${plan.price} · ${plan.deliveryTime || '—'}`;
        document.getElementById('modalTotal').innerHTML =
            `Total: <strong>$${plan.price}</strong> (${plan.name} Plan)`;

        lucide.createIcons();
    }

    document.querySelectorAll('.pricing-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPricingPlan(tab.dataset.plan, serviceData?.plans);
        });
    });

    // ══════════════════════════════
    //  REVIEWS
    // ══════════════════════════════
    function populateReviews(reviews, avgRating, totalCount, breakdown) {
        // Score
        document.getElementById('reviewsScore').innerHTML = `
            <span class="score-big">${avgRating ? avgRating.toFixed(1) : '—'}</span>
            <div class="score-stars">${[1,2,3,4,5].map(() =>
                `<i data-lucide="star" style="width:15px;height:15px;color:#f59e0b;fill:#f59e0b;"></i>`
            ).join('')}</div>
            <span class="score-total">${totalCount} review${totalCount !== 1 ? 's' : ''}</span>
        `;

        // Breakdown
        // breakdown expected: { 5: number, 4: number, 3: number, 2: number, 1: number }
        const breakdownHtml = [5,4,3,2,1].map(star => {
            const count = breakdown[star] || 0;
            const pct   = totalCount ? Math.round((count / totalCount) * 100) : 0;
            return `
                <div class="breakdown-row">
                    <span class="breakdown-label">${star} ★</span>
                    <div class="breakdown-bar"><div class="breakdown-fill" style="width:${pct}%"></div></div>
                    <span class="breakdown-pct">${pct}%</span>
                </div>
            `;
        }).join('');
        document.getElementById('reviewsBreakdown').innerHTML = breakdownHtml;

        // Review items
        if (!reviews || reviews.length === 0) {
            document.getElementById('reviewsList').innerHTML = '';
            document.getElementById('reviewsEmpty').classList.remove('hidden');
            return;
        }

        document.getElementById('reviewsEmpty').classList.add('hidden');
        document.getElementById('reviewsList').innerHTML = reviews.map(r => `
            <div class="review-item">
                <div class="review-top">
                    <div class="review-avatar">${r.initials || r.reviewerName?.charAt(0) || '?'}</div>
                    <div class="review-meta">
                        <div class="review-name">${r.reviewerName || 'Anonymous'}</div>
                        <div class="review-date">${r.date || ''}</div>
                    </div>
                    <div class="review-stars">
                        ${[1,2,3,4,5].map(i =>
                            `<i data-lucide="star" style="width:13px;height:13px;color:#f59e0b;fill:${i <= r.rating ? '#f59e0b' : 'none'};"></i>`
                        ).join('')}
                    </div>
                </div>
                <p class="review-text">${r.comment || ''}</p>
            </div>
        `).join('');
    }

    // ══════════════════════════════
    //  FAQ
    // ══════════════════════════════
    function populateFAQ(faqItems) {
        if (!faqItems || faqItems.length === 0) {
            document.getElementById('faqEmpty').classList.remove('hidden');
            return;
        }

        document.getElementById('faqEmpty').classList.add('hidden');
        document.getElementById('faqList').innerHTML = faqItems.map((item, i) => `
            <div class="faq-item" data-index="${i}">
                <button class="faq-question">
                    ${item.question}
                    <i data-lucide="chevron-down"></i>
                </button>
                <div class="faq-answer">${item.answer}</div>
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

        lucide.createIcons();
    }

    // ══════════════════════════════
    //  RELATED SERVICES
    //  TODO: Replace with actual API call
    // ══════════════════════════════
    async function loadRelated(category, excludeId) {
        // TODO: GET /api/services?category=category&exclude=excludeId&limit=4
        // const res  = await fetch(`/api/services?category=${category}&exclude=${excludeId}&limit=4`);
        // const data = await res.json();
        // renderRelated(data.services);

        // Hide section until API is connected
        document.getElementById('relatedSection').classList.add('hidden');
    }

    function renderRelated(services) {
        if (!services || services.length === 0) return;

        document.getElementById('relatedSection').classList.remove('hidden');
        document.getElementById('relatedGrid').innerHTML = services.map(s => `
            <div class="related-card" onclick="window.location.href='service-detail.html?id=${s.id}'">
                <div class="related-card-img">
                    ${s.imageUrl
                        ? `<img src="${s.imageUrl}" alt="${s.title}" loading="lazy">`
                        : `<div style="width:100%;height:100%;background:var(--border-light);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:0.75rem;">No image</div>`
                    }
                </div>
                <div class="related-card-body">
                    <h4 class="related-card-title">${s.title}</h4>
                    <div class="related-card-meta">
                        <div class="related-rating">
                            <i data-lucide="star"></i> ${s.rating ? s.rating.toFixed(1) : '—'}
                        </div>
                        <div class="related-price">$${s.startingPrice || '—'}</div>
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    }

    // ══════════════════════════════
    //  INFO TABS
    // ══════════════════════════════
    document.querySelectorAll('.info-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.info-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            tab.classList.add('active');
            document.getElementById(`tab-${tab.dataset.tab}`)?.classList.remove('hidden');
        });
    });

    // ══════════════════════════════
    //  WISHLIST TOGGLE
    // ══════════════════════════════
    document.getElementById('metaWishlist').addEventListener('click', function () {
        const isLiked = this.classList.toggle('liked');
        const icon    = this.querySelector('i');
        icon.style.fill = isLiked ? '#ef4444' : 'none';

        // TODO: POST /api/user/wishlist { serviceId, action: isLiked ? 'add' : 'remove' }
        showToast(isLiked ? 'Saved to wishlist!' : 'Removed from wishlist');
        lucide.createIcons();
    });

    // ══════════════════════════════
    //  BOOKING MODAL
    // ══════════════════════════════
    const modalOverlay = document.getElementById('modalOverlay');
    const modalConfirm = document.getElementById('modalConfirm');

    function openModal() {
        if (!serviceData) { showToast('Service data is still loading.', 'error'); return; }
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('bookingDate').min = today;
        lucide.createIcons();
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        // Clear fields
        document.getElementById('bookingDate').value    = '';
        document.getElementById('bookingTime').value    = '';
        document.getElementById('bookingAddress').value = '';
        document.getElementById('bookingNotes').value   = '';
        clearModalErrors();
    }

    function clearModalErrors() {
        ['bookingDate','bookingTime','bookingAddress'].forEach(id => {
            document.getElementById(id).classList.remove('error');
            document.getElementById(id + 'Err').classList.remove('show');
        });
    }

    document.getElementById('bookBtn').addEventListener('click', openModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCancel').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    modalConfirm.addEventListener('click', async () => {
        const date    = document.getElementById('bookingDate').value;
        const time    = document.getElementById('bookingTime').value;
        const address = document.getElementById('bookingAddress').value.trim();
        const notes   = document.getElementById('bookingNotes').value.trim();

        let valid = true;
        valid = setError('bookingDate',    'bookingDateErr',    !date)    && valid;
        valid = setError('bookingTime',    'bookingTimeErr',    !time)    && valid;
        valid = setError('bookingAddress', 'bookingAddressErr', !address) && valid;
        if (!valid) return;

        modalConfirm.classList.add('loading');

        const payload = {
            serviceId,
            plan:    activePlan,
            date,
            time,
            address,
            notes
        };

        // TODO: POST /api/bookings { ...payload }
        // const res  = await fetch('/api/bookings', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        // const data = await res.json();
        // if (data.success) window.location.href = `checkout.html?bookingId=${data.bookingId}`;

        setTimeout(() => {
            modalConfirm.classList.remove('loading');
            closeModal();
            showToast('Booking confirmed! Redirecting to checkout...');
            setTimeout(() => { window.location.href = 'checkout.html'; }, 1500);
        }, 1800);
    });

    // ══════════════════════════════
    //  CONTACT PROVIDER
    // ══════════════════════════════
    document.getElementById('contactBtn').addEventListener('click', () => {
        if (!serviceData?.provider) return;
        // TODO: navigate to messages with provider pre-selected
        // window.location.href = `messages.html?conv=${serviceData.provider.id}`;
        showToast('Redirecting to messages...');
        setTimeout(() => { window.location.href = 'messages.html'; }, 800);
    });

    // ══════════════════════════════
    //  VALIDATION HELPER
    // ══════════════════════════════
    function setError(inputId, errId, show) {
        const input = document.getElementById(inputId);
        const err   = document.getElementById(errId);
        if (input) input.classList.toggle('error', show);
        if (err)   err.classList.toggle('show', show);
        return !show;
    }

    // Clear errors on input change
    ['bookingDate','bookingTime','bookingAddress'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            document.getElementById(id).classList.remove('error');
            document.getElementById(id + 'Err')?.classList.remove('show');
        });
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
    loadService();

    console.log('🚀 Service Detail page loaded! Service ID:', serviceId);
});
