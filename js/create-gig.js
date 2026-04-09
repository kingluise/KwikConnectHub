// KwikConnectHub - Create Gig Page JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  STATE
    // ══════════════════════════════
    let currentStep = 1;
    const totalSteps = 4;
    const tags = [];
    const uploadedImages = [];
    const planFeatures = { basic: [], standard: [], premium: [] };

    // Check if editing existing gig
    const urlParams = new URLSearchParams(window.location.search);
    const gigId = urlParams.get('id');
    if (gigId) {
        document.getElementById('pageTitle').textContent = 'Edit Gig';
        document.getElementById('pageHeaderTitle').textContent = 'Edit Gig';
        loadGigData(gigId);
    }

    // ══════════════════════════════
    //  LOAD EXISTING GIG (edit mode)
    // ══════════════════════════════
    async function loadGigData(id) {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/gigs/${id}`);
        // const gig = await response.json();
        // populateForm(gig);
    }

    // ══════════════════════════════
    //  STEP NAVIGATION
    // ══════════════════════════════
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        if (step > currentStep && !validateStep(currentStep)) return;

        document.querySelectorAll('.form-step').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${step}`).classList.remove('hidden');

        // Update step indicator
        document.querySelectorAll('.step').forEach((el, i) => {
            const num = i + 1;
            el.classList.remove('active', 'completed');
            if (num === step) el.classList.add('active');
            if (num < step)  el.classList.add('completed');
        });

        document.querySelectorAll('.step-line').forEach((line, i) => {
            line.classList.toggle('completed', i < step - 1);
        });

        if (step === 4) buildReviewSummary();

        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.goToStep = goToStep;

    // ══════════════════════════════
    //  VALIDATION
    // ══════════════════════════════
    function validateStep(step) {
        if (step === 1) {
            const title    = document.getElementById('gigTitle').value.trim();
            const category = document.getElementById('gigCategory').value;
            const location = document.getElementById('gigLocation').value.trim();
            const desc     = document.getElementById('gigDescription').value.trim();

            let valid = true;
            if (!title)          { showErr('gigTitleErr'); valid = false; }
            else                   clearErr('gigTitleErr');
            if (!category)       { showErr('gigCategoryErr'); valid = false; }
            else                   clearErr('gigCategoryErr');
            if (!location)       { showErr('gigLocationErr'); valid = false; }
            else                   clearErr('gigLocationErr');
            if (desc.length < 50){ showErr('gigDescErr'); valid = false; }
            else                   clearErr('gigDescErr');
            return valid;
        }
        if (step === 2) {
            const basicPrice = document.getElementById('basicPrice').value;
            if (!basicPrice || basicPrice < 5) {
                showToast('Please set a price for the Basic plan.', 'error');
                return false;
            }
        }
        return true;
    }

    function showErr(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('show');
    }

    function clearErr(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('show');
    }

    // ══════════════════════════════
    //  CHARACTER COUNTS
    // ══════════════════════════════
    document.getElementById('gigTitle').addEventListener('input', function() {
        document.getElementById('gigTitleCount').textContent = this.value.length;
        clearErr('gigTitleErr');
    });

    document.getElementById('gigDescription').addEventListener('input', function() {
        document.getElementById('gigDescCount').textContent = this.value.length;
        clearErr('gigDescErr');
    });

    // ══════════════════════════════
    //  CATEGORY → SUBCATEGORY
    // ══════════════════════════════
    const subcategories = {
        home:      ['Gardening', 'Moving', 'Assembly', 'Painting'],
        cleaning:  ['Deep Clean', 'Move-in/out', 'Office', 'Post-construction'],
        repairs:   ['Plumbing', 'Electrical', 'HVAC', 'Carpentry'],
        design:    ['Graphic Design', 'Web Design', 'Logo', 'Interior Design'],
        tech:      ['Computer Repair', 'Networking', 'Data Recovery', 'Software'],
        events:    ['Photography', 'Catering', 'DJ/Music', 'Decoration'],
        education: ['Tutoring', 'Language', 'Music Lessons', 'Fitness']
    };

    document.getElementById('gigCategory').addEventListener('change', function() {
        const subs = subcategories[this.value] || [];
        const subEl = document.getElementById('gigSubcategory');
        subEl.innerHTML = '<option value="">Select subcategory</option>' +
            subs.map(s => `<option value="${s.toLowerCase().replace(/\s/g,'-')}">${s}</option>`).join('');
        clearErr('gigCategoryErr');
    });

    // ══════════════════════════════
    //  TAGS
    // ══════════════════════════════
    const tagInput = document.getElementById('tagInput');

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = tagInput.value.trim().replace(',', '');
            if (val && tags.length < 5 && !tags.includes(val)) {
                tags.push(val);
                renderTags();
                tagInput.value = '';
            }
        }
    });

    function renderTags() {
        const list = document.getElementById('tagsList');
        list.innerHTML = tags.map((t, i) => `
            <span class="tag-chip">${t}<button onclick="removeTag(${i})">×</button></span>
        `).join('');
    }

    window.removeTag = function(index) {
        tags.splice(index, 1);
        renderTags();
    };

    // ══════════════════════════════
    //  PLAN FEATURES
    // ══════════════════════════════
    ['basic', 'standard', 'premium'].forEach(plan => {
        const input = document.getElementById(`${plan}FeatureInput`);
        if (!input) return;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = input.value.trim();
                if (val) {
                    planFeatures[plan].push(val);
                    renderFeatures(plan);
                    input.value = '';
                }
            }
        });
    });

    function renderFeatures(plan) {
        const list = document.getElementById(`${plan}Features`);
        if (!list) return;
        list.innerHTML = planFeatures[plan].map((f, i) => `
            <div class="feature-item">
                <span>${f}</span>
                <button class="feature-remove" onclick="removeFeature('${plan}', ${i})">×</button>
            </div>
        `).join('');
    }

    window.removeFeature = function(plan, index) {
        planFeatures[plan].splice(index, 1);
        renderFeatures(plan);
    };

    // ══════════════════════════════
    //  IMAGE UPLOAD
    // ══════════════════════════════
    const uploadArea  = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');

    uploadArea.addEventListener('click', () => imageUpload.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    imageUpload.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const remaining = 5 - uploadedImages.length;
        const toAdd = Array.from(files).slice(0, remaining);

        toAdd.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImages.push({ src: e.target.result, name: file.name });
                renderPreviews();
            };
            reader.readAsDataURL(file);
        });
    }

    function renderPreviews() {
        const container = document.getElementById('imagePreviews');
        container.innerHTML = uploadedImages.map((img, i) => `
            <div class="preview-item">
                <img src="${img.src}" alt="Preview ${i+1}">
                <button class="preview-remove" onclick="removeImage(${i})">×</button>
                ${i === 0 ? '<span class="preview-cover-badge">Cover</span>' : ''}
            </div>
        `).join('');
    }

    window.removeImage = function(index) {
        uploadedImages.splice(index, 1);
        renderPreviews();
    };

    // ══════════════════════════════
    //  REVIEW SUMMARY
    // ══════════════════════════════
    function buildReviewSummary() {
        const title    = document.getElementById('gigTitle').value || '—';
        const category = document.getElementById('gigCategory').options[document.getElementById('gigCategory').selectedIndex]?.text || '—';
        const location = document.getElementById('gigLocation').value || '—';
        const desc     = document.getElementById('gigDescription').value || '—';
        const basicPrice = document.getElementById('basicPrice').value;

        document.getElementById('reviewSummary').innerHTML = `
            <div class="review-row">
                <span class="review-row-label">Title</span>
                <span class="review-row-value">${title}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Category</span>
                <span class="review-row-value">${category}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Location</span>
                <span class="review-row-value">${location}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Description</span>
                <span class="review-row-value">${desc.substring(0, 200)}${desc.length > 200 ? '...' : ''}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Tags</span>
                <span class="review-row-value">${tags.length ? tags.join(', ') : '—'}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Starting Price</span>
                <span class="review-row-value">${basicPrice ? '$' + basicPrice : '—'}</span>
            </div>
            <div class="review-row">
                <span class="review-row-label">Images</span>
                <span class="review-row-value">${uploadedImages.length} image(s) uploaded</span>
            </div>
        `;
    }

    // ══════════════════════════════
    //  SAVE DRAFT
    // ══════════════════════════════
    document.getElementById('saveDraftBtn').addEventListener('click', async () => {
        const gigData = collectFormData();
        gigData.status = 'draft';

        // TODO: POST to /api/gigs/draft
        // const response = await fetch('/api/gigs/draft', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(gigData)
        // });

        showToast('Gig saved as draft!');
    });

    // ══════════════════════════════
    //  PUBLISH GIG
    // ══════════════════════════════
    document.getElementById('publishBtn').addEventListener('click', async () => {
        const gigData = collectFormData();
        gigData.status = 'active';

        // TODO: POST to /api/gigs
        // const response = await fetch('/api/gigs', {
        //     method: gigId ? 'PUT' : 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(gigData)
        // });
        // if (response.ok) window.location.href = 'provider-dashboard.html';

        showToast('Gig published successfully!');
        setTimeout(() => {
            window.location.href = 'provider-dashboard.html';
        }, 1500);
    });

    function collectFormData() {
        return {
            title:       document.getElementById('gigTitle').value,
            category:    document.getElementById('gigCategory').value,
            subcategory: document.getElementById('gigSubcategory').value,
            location:    document.getElementById('gigLocation').value,
            description: document.getElementById('gigDescription').value,
            tags,
            plans: {
                basic: {
                    name:     document.getElementById('basicName').value,
                    price:    document.getElementById('basicPrice').value,
                    desc:     document.getElementById('basicDesc').value,
                    delivery: document.getElementById('basicDelivery').value,
                    features: planFeatures.basic
                },
                standard: {
                    name:     document.getElementById('standardName').value,
                    price:    document.getElementById('standardPrice').value,
                    desc:     document.getElementById('standardDesc').value,
                    delivery: document.getElementById('standardDelivery').value,
                    features: planFeatures.standard
                },
                premium: {
                    name:     document.getElementById('premiumName').value,
                    price:    document.getElementById('premiumPrice').value,
                    desc:     document.getElementById('premiumDesc').value,
                    delivery: document.getElementById('premiumDelivery').value,
                    features: planFeatures.premium
                }
            },
            images: uploadedImages.map(i => i.src)
        };
    }

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

    console.log('🚀 KwikConnectHub Create Gig loaded!');
});
