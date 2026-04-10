// KwikConnectHub - Profile Settings JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ══════════════════════════════
    //  NAVBAR AVATAR DROPDOWN
    // ══════════════════════════════
    const navAvatarWrap  = document.getElementById('navAvatarWrap');
    const avatarDropdown = document.getElementById('avatarDropdown');

    navAvatarWrap?.addEventListener('click', (e) => {
        e.stopPropagation();
        avatarDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => avatarDropdown?.classList.add('hidden'));

    // ══════════════════════════════
    //  TAB SWITCHING
    // ══════════════════════════════
    document.querySelectorAll('.settings-link').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.settings-link').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
        });
    });

    // ══════════════════════════════
    //  LOAD USER PROFILE
    // ══════════════════════════════
    async function loadProfile() {
        // TODO: GET /api/user/profile
        // const res  = await fetch('/api/user/profile');
        // const data = await res.json();
        // populateProfile(data);

        // Leave fields empty — backend will populate
    }

    // ══════════════════════════════
    //  AVATAR UPLOAD PREVIEW
    // ══════════════════════════════
    document.getElementById('avatarInput')?.addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('avatarPreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Avatar">`;
            document.getElementById('navAvatar').innerHTML    = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
            document.getElementById('settingsAvatar').innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        };
        reader.readAsDataURL(file);
    });

    // ══════════════════════════════
    //  PERSONAL INFO — SAVE
    // ══════════════════════════════
    function savePersonalInfo() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName  = document.getElementById('lastName').value.trim();
        const email     = document.getElementById('email').value.trim();

        let valid = true;
        valid = setError('firstName', 'firstNameErr', !firstName) && valid;
        valid = setError('lastName',  'lastNameErr',  !lastName)  && valid;
        valid = setError('email', 'emailErr', !isValidEmail(email)) && valid;

        if (!valid) return;

        const payload = {
            firstName,
            lastName,
            email,
            phone:    document.getElementById('phone').value.trim(),
            location: document.getElementById('location').value.trim(),
            bio:      document.getElementById('bio').value.trim()
        };

        // TODO: PUT /api/user/profile
        // await fetch('/api/user/profile', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });

        // Update display name
        document.getElementById('navAvatarName').textContent = `${firstName}`;
        document.getElementById('settingsName').textContent  = `${firstName} ${lastName}`;
        document.getElementById('settingsEmail').textContent = email;

        showToast('Profile updated successfully!');
    }

    window.savePersonalInfo = savePersonalInfo;

    // ══════════════════════════════
    //  SECURITY — PASSWORD
    // ══════════════════════════════
    function savePassword() {
        const currentPw = document.getElementById('currentPw').value;
        const newPw     = document.getElementById('newPw').value;
        const confirmPw = document.getElementById('confirmPw').value;

        if (!currentPw) { showToast('Please enter your current password.', 'error'); return; }
        if (newPw.length < 8) { showToast('New password must be at least 8 characters.', 'error'); return; }

        const match = newPw === confirmPw;
        setError('confirmPw', 'confirmPwErr', !match);
        if (!match) return;

        const payload = { currentPassword: currentPw, newPassword: newPw };

        // TODO: PUT /api/user/password
        // await fetch('/api/user/password', { method: 'PUT', body: JSON.stringify(payload) });

        document.getElementById('currentPw').value = '';
        document.getElementById('newPw').value     = '';
        document.getElementById('confirmPw').value  = '';
        document.getElementById('pwStrength').classList.add('hidden');

        showToast('Password updated successfully!');
    }

    window.savePassword = savePassword;

    // ══════════════════════════════
    //  PASSWORD STRENGTH
    // ══════════════════════════════
    function checkPwStrength(value) {
        const strengthEl = document.getElementById('pwStrength');
        const label      = document.getElementById('pwLabel');
        const barIds     = ['bar1','bar2','bar3','bar4'];

        if (!value) { strengthEl.classList.add('hidden'); return; }
        strengthEl.classList.remove('hidden');

        let score = 0;
        if (value.length >= 8)          score++;
        if (/[A-Z]/.test(value))        score++;
        if (/[0-9]/.test(value))        score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const levels = ['weak','fair','good','strong'];
        const labels = ['Too weak','Fair','Good','Strong 🔒'];
        const colors = { weak:'#ef4444', fair:'#f59e0b', good:'#3b82f6', strong:'#059669' };

        barIds.forEach((id, i) => {
            const bar = document.getElementById(id);
            bar.className = 'pw-bar';
            if (i < score) bar.classList.add(levels[score - 1]);
        });

        label.textContent = labels[score - 1] || 'Password strength';
        label.style.color = colors[levels[score - 1]] || '#6b7280';
    }

    window.checkPwStrength = checkPwStrength;

    // ══════════════════════════════
    //  PASSWORD TOGGLE
    // ══════════════════════════════
    function togglePw(inputId, btn) {
        const input   = document.getElementById(inputId);
        const isHidden = input.type === 'password';
        input.type     = isHidden ? 'text' : 'password';
        btn.innerHTML  = isHidden
            ? '<i data-lucide="eye-off" style="width:16px;height:16px;"></i>'
            : '<i data-lucide="eye" style="width:16px;height:16px;"></i>';
        lucide.createIcons();
    }

    window.togglePw = togglePw;

    // ══════════════════════════════
    //  2FA TOGGLE
    // ══════════════════════════════
    function toggleTfa(el) {
        el.classList.toggle('on');
        const isOn = el.classList.contains('on');
        // TODO: PUT /api/user/2fa { enabled: isOn }
        showToast(isOn ? '2FA enabled' : '2FA disabled');
    }

    window.toggleTfa = toggleTfa;

    // ══════════════════════════════
    //  NOTIFICATION TOGGLES
    // ══════════════════════════════
    function toggleNotif(el) {
        el.classList.toggle('on');
    }

    window.toggleNotif = toggleNotif;

    function saveNotifications() {
        const prefs = {
            email:    document.getElementById('notifEmail').classList.contains('on'),
            sms:      document.getElementById('notifSms').classList.contains('on'),
            orders:   document.getElementById('notifOrders').classList.contains('on'),
            messages: document.getElementById('notifMessages').classList.contains('on'),
            promo:    document.getElementById('notifPromo').classList.contains('on')
        };

        // TODO: PUT /api/user/notifications { preferences: prefs }
        showToast('Notification preferences saved!');
    }

    window.saveNotifications = saveNotifications;

    // ══════════════════════════════
    //  PAYMENT METHODS
    // ══════════════════════════════
    function addCard() {
        // TODO: open add card modal / integrate payment provider SDK
        showToast('Add card feature coming soon!');
    }

    window.addCard = addCard;

    function addBank() {
        // TODO: open add bank account modal
        showToast('Link bank account feature coming soon!');
    }

    window.addBank = addBank;

    // ══════════════════════════════
    //  LINKED ACCOUNTS
    // ══════════════════════════════
    const linkedState = { google: false, facebook: false };

    function toggleLinked(provider, btn) {
        linkedState[provider] = !linkedState[provider];
        const isConnected = linkedState[provider];

        document.getElementById(`${provider}Status`).textContent = isConnected ? 'Connected' : 'Not connected';
        btn.textContent = isConnected ? 'Disconnect' : 'Connect';
        btn.classList.toggle('connected', isConnected);

        // TODO: POST /api/auth/link/:provider or DELETE /api/auth/link/:provider
        showToast(isConnected ? `${provider} connected!` : `${provider} disconnected`);
    }

    window.toggleLinked = toggleLinked;

    // ══════════════════════════════
    //  VALIDATION HELPERS
    // ══════════════════════════════
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setError(inputId, errId, show) {
        const input = document.getElementById(inputId);
        const err   = document.getElementById(errId);
        if (input) input.classList.toggle('error', show);
        if (err)   err.classList.toggle('show', show);
        return !show;
    }

    // Clear errors on input
    ['firstName','lastName','email','phone'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
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
    loadProfile();

    // Load payment methods & bank
    // TODO: GET /api/payment/methods → renderCards()
    // TODO: GET /api/payment/bank-account → renderBank()
    document.getElementById('cardsEmpty')?.classList.remove('hidden');
    document.getElementById('bankEmpty')?.classList.remove('hidden');

    console.log('🚀 Profile Settings loaded!');
});
