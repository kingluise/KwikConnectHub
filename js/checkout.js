// KwikConnectHub - Checkout Page JavaScript

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
    //  STATE
    // ══════════════════════════════
    let termsChecked  = false;
    let activeMethod  = 'card';
    let promoApplied  = false;
    let basePrice     = 0;
    let discountAmt   = 0;

    // ══════════════════════════════
    //  LOAD ORDER DETAILS
    //  TODO: Replace with actual session/API data
    // ══════════════════════════════
    async function loadOrderDetails() {
        // TODO: GET /api/booking/current  or  read from sessionStorage
        // const data = JSON.parse(sessionStorage.getItem('pendingBooking'));
        // if (!data) { window.location.href = 'services.html'; return; }
        // populateOrderSummary(data);

        // Load bank details for transfer option
        loadBankDetails();

        // Load wallet balance
        loadWalletBalance();
    }

    function populateOrderSummary(data) {
        document.getElementById('summaryTitle').textContent    = data.serviceTitle    || '—';
        document.getElementById('summaryProvider').textContent = data.providerName    || '—';
        document.getElementById('summaryPlan').textContent     = `${data.plan} Plan`  || '—';
        document.getElementById('detailDate').textContent      = data.date            || '—';
        document.getElementById('detailTime').textContent      = data.time            || '—';
        document.getElementById('detailAddress').textContent   = data.address         || '—';

        if (data.serviceImage) {
            document.getElementById('summaryImg').innerHTML =
                `<img src="${data.serviceImage}" alt="${data.serviceTitle}">`;
        }

        if (data.features && data.features.length) {
            document.getElementById('planFeaturesList').innerHTML =
                data.features.map(f => `<li>${f}</li>`).join('');
        }

        basePrice = parseFloat(data.price) || 0;
        updatePriceBreakdown();
    }

    function updatePriceBreakdown() {
        const fee      = parseFloat((basePrice * 0.05).toFixed(2));
        const discount = promoApplied ? discountAmt : 0;
        const total    = parseFloat((basePrice + fee - discount).toFixed(2));

        document.getElementById('priceSubtotal').textContent  = `$${basePrice.toFixed(2)}`;
        document.getElementById('priceFee').textContent       = `$${fee.toFixed(2)}`;
        document.getElementById('priceTotal').textContent     = `$${total.toFixed(2)}`;

        if (discount > 0) {
            document.getElementById('discountRow').classList.remove('hidden');
            document.getElementById('priceDiscount').textContent = `-$${discount.toFixed(2)}`;
        } else {
            document.getElementById('discountRow').classList.add('hidden');
        }

        document.getElementById('payBtnText').textContent = `Pay $${total.toFixed(2)}`;
    }

    async function loadBankDetails() {
        // TODO: GET /api/payment/bank-details
        // const res  = await fetch('/api/payment/bank-details');
        // const data = await res.json();
        // document.getElementById('bankName').textContent      = data.bankName;
        // document.getElementById('accountName').textContent   = data.accountName;
        // document.getElementById('accountNumber').textContent = data.accountNumber;
    }

    async function loadWalletBalance() {
        // TODO: GET /api/wallet/balance
        // const res  = await fetch('/api/wallet/balance');
        // const data = await res.json();
        // document.getElementById('walletBalance').textContent = `$${data.balance.toFixed(2)}`;
    }

    // ══════════════════════════════
    //  PAYMENT METHOD TABS
    // ══════════════════════════════
    document.querySelectorAll('.payment-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.payment-method').forEach(m => m.classList.add('hidden'));

            tab.classList.add('active');
            activeMethod = tab.dataset.method;
            document.getElementById(`method-${activeMethod}`).classList.remove('hidden');
        });
    });

    // ══════════════════════════════
    //  CARD NUMBER FORMATTING
    // ══════════════════════════════
    document.getElementById('cardNumber').addEventListener('input', function () {
        let val = this.value.replace(/\D/g, '').substring(0, 16);
        this.value = val.match(/.{1,4}/g)?.join(' ') || val;
        this.classList.remove('error');
        document.getElementById('cardNumberErr').classList.remove('show');
    });

    document.getElementById('cardExpiry').addEventListener('input', function () {
        let val = this.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
        this.value = val;
        this.classList.remove('error');
        document.getElementById('cardExpiryErr').classList.remove('show');
    });

    document.getElementById('cardCvv').addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
        this.classList.remove('error');
        document.getElementById('cardCvvErr').classList.remove('show');
    });

    // Clear name error on input
    document.getElementById('cardName').addEventListener('input', function () {
        this.classList.remove('error');
        document.getElementById('cardNameErr').classList.remove('show');
    });

    // ══════════════════════════════
    //  PROMO CODE
    // ══════════════════════════════
    document.getElementById('applyPromoBtn').addEventListener('click', applyPromo);
    document.getElementById('promoInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyPromo();
    });

    async function applyPromo() {
        const code  = document.getElementById('promoInput').value.trim();
        const msgEl = document.getElementById('promoMsg');

        if (!code) return;

        // TODO: POST /api/promo/validate { code }
        // const res  = await fetch('/api/promo/validate', { method: 'POST', body: JSON.stringify({ code }) });
        // const data = await res.json();
        // if (data.valid) { ... } else { ... }

        // Placeholder — backend will handle real validation
        msgEl.textContent = 'Promo code will be validated at checkout.';
        msgEl.className   = 'promo-msg success';
        msgEl.classList.remove('hidden');
    }

    // ══════════════════════════════
    //  TERMS CHECKBOX
    // ══════════════════════════════
    function toggleTerms(el) {
        termsChecked = !termsChecked;
        el.classList.toggle('checked', termsChecked);
        el.innerHTML = termsChecked
            ? '<i data-lucide="check" style="width:11px;height:11px;color:white;"></i>'
            : '';
        document.getElementById('termsErr').classList.remove('show');
        lucide.createIcons();
    }
    window.toggleTerms = toggleTerms;

    // ══════════════════════════════
    //  VALIDATION
    // ══════════════════════════════
    function setError(inputId, errId, show) {
        const input = document.getElementById(inputId);
        const err   = document.getElementById(errId);
        if (input) input.classList.toggle('error', show);
        if (err)   err.classList.toggle('show', show);
        return !show;
    }

    function validateCard() {
        let valid = true;
        const name    = document.getElementById('cardName').value.trim();
        const number  = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry  = document.getElementById('cardExpiry').value.trim();
        const cvv     = document.getElementById('cardCvv').value.trim();

        valid = setError('cardName',   'cardNameErr',   !name)                       && valid;
        valid = setError('cardNumber', 'cardNumberErr', number.length < 16)          && valid;
        valid = setError('cardExpiry', 'cardExpiryErr', expiry.length < 7)           && valid;
        valid = setError('cardCvv',    'cardCvvErr',    cvv.length < 3)              && valid;
        return valid;
    }

    // ══════════════════════════════
    //  HANDLE PAYMENT
    // ══════════════════════════════
    function handlePayment() {
        if (!termsChecked) {
            document.getElementById('termsErr').classList.add('show');
            return;
        }

        if (activeMethod === 'card' && !validateCard()) return;

        const payBtn = document.getElementById('payBtn');
        payBtn.classList.add('loading');

        // TODO: POST /api/booking/confirm { method: activeMethod, ... }
        // const res = await fetch('/api/booking/confirm', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ paymentMethod: activeMethod, promoCode: document.getElementById('promoInput').value.trim() })
        // });
        // const data = await res.json();
        // if (data.success) window.location.href = `buyer-dashboard.html?order=${data.orderId}`;

        setTimeout(() => {
            payBtn.classList.remove('loading');
            showToast('Booking confirmed! Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'buyer-dashboard.html';
            }, 1800);
        }, 2000);
    }
    window.handlePayment = handlePayment;

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
    loadOrderDetails();

    console.log('🚀 Checkout page loaded!');
});
