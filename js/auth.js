// KwikConnectHub - Auth Page JavaScript

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ── STATE ──
    let currentTab = 'signin';
    let selectedRole = 'buyer';
    let termsChecked = false;

    // ── TAB SWITCHING ──
    function switchTab(tab) {
        currentTab = tab;
        const isSignin = tab === 'signin';

        document.getElementById('signinTab').classList.toggle('active', isSignin);
        document.getElementById('signupTab').classList.toggle('active', !isSignin);
        document.getElementById('signinForm').classList.toggle('hidden', !isSignin);
        document.getElementById('signupForm').classList.toggle('hidden', isSignin);

        document.getElementById('authTitle').textContent = isSignin ? 'Welcome back' : 'Create your account';
        document.getElementById('authSubtitle').textContent = isSignin
            ? 'Sign in to your account to continue'
            : 'Join KwikConnectHub for free today';

        updateSignupBtnText();
    }

    // Expose to HTML onclick handlers
    window.switchTab = switchTab;

    // ── ROLE SELECTION ──
    function selectRole(role) {
        selectedRole = role;
        document.getElementById('rolebuyer').classList.toggle('selected', role === 'buyer');
        document.getElementById('roleprovider').classList.toggle('selected', role === 'provider');

        // Show phone field only for providers
        document.getElementById('phoneGroup').style.display = role === 'provider' ? 'block' : 'none';

        updateSignupBtnText();
    }

    window.selectRole = selectRole;

    function updateSignupBtnText() {
        const text = selectedRole === 'provider' ? 'Join as a Pro' : 'Create Account';
        const el = document.getElementById('signupBtnText');
        if (el) el.textContent = text;
    }

    // ── PASSWORD TOGGLE ──
    function togglePw(inputId, btn) {
        const input = document.getElementById(inputId);
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.innerHTML = isHidden
            ? '<i data-lucide="eye-off" style="width:16px;height:16px;"></i>'
            : '<i data-lucide="eye" style="width:16px;height:16px;"></i>';
        lucide.createIcons();
    }

    window.togglePw = togglePw;

    // ── PASSWORD STRENGTH ──
    function checkPasswordStrength(value) {
        const strengthEl = document.getElementById('pwStrength');
        const label = document.getElementById('pwLabel');
        const barIds = ['bar1', 'bar2', 'bar3', 'bar4'];

        if (!value) {
            strengthEl.classList.remove('show');
            return;
        }

        strengthEl.classList.add('show');

        let score = 0;
        if (value.length >= 8)          score++;
        if (/[A-Z]/.test(value))        score++;
        if (/[0-9]/.test(value))        score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;

        const levels = ['weak', 'fair', 'good', 'strong'];
        const labels = ['Too weak', 'Fair', 'Good', 'Strong 🔒'];
        const colors = {
            weak:   '#ef4444',
            fair:   '#f59e0b',
            good:   '#3b82f6',
            strong: '#059669'
        };

        barIds.forEach((id, i) => {
            const bar = document.getElementById(id);
            bar.className = 'pw-bar';
            if (i < score) bar.classList.add(levels[score - 1]);
        });

        label.textContent = labels[score - 1] || 'Password strength';
        label.style.color = colors[levels[score - 1]] || '#6b7280';
    }

    window.checkPasswordStrength = checkPasswordStrength;

    // ── CHECKBOX ──
    function toggleCheck(el) {
        termsChecked = !termsChecked;
        el.classList.toggle('checked', termsChecked);
        el.innerHTML = termsChecked
            ? '<i data-lucide="check" style="width:12px;height:12px;color:white;"></i>'
            : '';
        lucide.createIcons();
    }

    window.toggleCheck = toggleCheck;

    // ── VALIDATION HELPERS ──
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setError(inputId, errId, show) {
        const input = document.getElementById(inputId);
        const err   = document.getElementById(errId);
        if (show) {
            input.classList.add('error');
            err.classList.add('show');
        } else {
            input.classList.remove('error');
            err.classList.remove('show');
        }
        return !show;
    }

    // Clear errors on input
    const fieldIds = ['signinEmail', 'signinPassword', 'firstName', 'lastName', 'signupEmail', 'phone', 'signupPassword'];
    fieldIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                el.classList.remove('error');
                const errEl = document.getElementById(id + 'Err');
                if (errEl) errEl.classList.remove('show');
            });
        }
    });

    // ══════════════════════════════
    //  DEMO CREDENTIALS
    //  Remove these once real backend auth is connected
    // ══════════════════════════════
    const DEMO_USERS = [
        {
            email:     'buyer@kwikconnect.com',
            password:  'Buyer@1234',
            role:      'buyer',
            name:      'Adaeze Okafor',
            redirect:  'buyer-dashboard.html'
        },
        {
            email:     'provider@kwikconnect.com',
            password:  'Provider@1234',
            role:      'provider',
            name:      'Emeka Nwosu',
            redirect:  'provider-dashboard.html'
        }
    ];

    // ── SIGN IN HANDLER ──
    function handleSignIn() {
        const email    = document.getElementById('signinEmail').value.trim();
        const password = document.getElementById('signinPassword').value;

        let valid = true;
        valid = setError('signinEmail',    'signinEmailErr',    !isValidEmail(email)) && valid;
        valid = setError('signinPassword', 'signinPasswordErr', !password)            && valid;
        if (!valid) return;

        const btn = document.getElementById('signinBtn');
        btn.classList.add('loading');

        setTimeout(() => {
            btn.classList.remove('loading');

            // ── Check against demo credentials ──
            const match = DEMO_USERS.find(
                u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
            );

            if (match) {
                // Store session info (replace with real token handling when backend is ready)
                sessionStorage.setItem('kch_user', JSON.stringify({
                    name:  match.name,
                    email: match.email,
                    role:  match.role
                }));
                showToast(`Welcome back, ${match.name.split(' ')[0]}! Redirecting...`);
                setTimeout(() => { window.location.href = match.redirect; }, 1200);
            } else {
                setError('signinEmail',    'signinEmailErr',    true);
                setError('signinPassword', 'signinPasswordErr', true);
                document.getElementById('signinEmailErr').textContent    = 'Invalid email or password.';
                document.getElementById('signinPasswordErr').textContent = 'Please check your credentials.';
                showToast('Invalid email or password.', 'error');
            }

            // TODO: Replace demo logic above with real API call:
            // const res  = await fetch('/api/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
            // const data = await res.json();
            // if (data.token) { localStorage.setItem('kch_token', data.token); window.location.href = data.role === 'provider' ? 'provider-dashboard.html' : 'buyer-dashboard.html'; }

        }, 1200);
    }

    window.handleSignIn = handleSignIn;

    // ── SIGN UP HANDLER ──
    function handleSignUp() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName  = document.getElementById('lastName').value.trim();
        const email     = document.getElementById('signupEmail').value.trim();
        const password  = document.getElementById('signupPassword').value;
        const phone     = document.getElementById('phone').value.trim();

        let valid = true;
        valid = setError('firstName', 'firstNameErr', !firstName) && valid;
        valid = setError('lastName', 'lastNameErr', !lastName) && valid;
        valid = setError('signupEmail', 'signupEmailErr', !isValidEmail(email)) && valid;
        valid = setError('signupPassword', 'signupPasswordErr', password.length < 8) && valid;

        if (selectedRole === 'provider') {
            valid = setError('phone', 'phoneErr', !phone) && valid;
        }

        if (!termsChecked) {
            showToast('Please agree to the Terms of Service.', 'error');
            return;
        }

        if (!valid) return;

        const btn = document.getElementById('signupBtn');
        btn.classList.add('loading');

        // Simulate API call
        setTimeout(() => {
            btn.classList.remove('loading');
            const roleMsg = selectedRole === 'provider' ? 'as a Pro' : 'as a Buyer';
            showToast(`Account created ${roleMsg}! Welcome, ${firstName}!`);
        }, 2000);
    }

    window.handleSignUp = handleSignUp;

    // ── SOCIAL LOGIN ──
    function socialLogin(provider) {
        showToast(`${provider} login coming soon!`, 'info');
    }

    window.socialLogin = socialLogin;

    // ── TOAST NOTIFICATION ──
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

    // Expose toast globally (useful for future pages too)
    // ── FILL DEMO CREDENTIALS ──
    function fillDemo(role) {
        const user = DEMO_USERS.find(u => u.role === role);
        if (!user) return;
        document.getElementById('signinEmail').value    = user.email;
        document.getElementById('signinPassword').value = user.password;
        // Clear any existing errors
        ['signinEmail','signinPassword'].forEach(id => {
            document.getElementById(id).classList.remove('error');
            const errEl = document.getElementById(id + 'Err');
            if (errEl) errEl.classList.remove('show');
        });
        showToast('Demo credentials filled. Click Sign In!');
    }
    window.fillDemo = fillDemo;

    window.showToast = showToast;

    console.log('🚀 KwikConnectHub Auth loaded successfully!');
});
