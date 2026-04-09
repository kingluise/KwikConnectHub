document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Check URL params for tab or role selection
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get('role');
    if (role === 'provider') {
        switchTab('signup');
        setTimeout(() => {
            document.querySelector('input[value="provider"]').checked = true;
            toggleRoleFields('provider');
        }, 100);
    }
});

// TODO: Replace with actual API call
async function handleSignIn(e) {
    e.preventDefault();

    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    const submitBtn = document.getElementById('signinSubmit');
    const spinner = submitBtn.querySelector('.loading-spinner');
    const btnText = submitBtn.querySelector('span');

    // Show loading
    spinner.classList.remove('hidden');
    btnText.textContent = 'Signing in...';
    submitBtn.disabled = true;

    // Clear previous errors
    clearErrors();

    try {
        // TODO: POST to /api/auth/signin
        // const response = await fetch('/api/auth/signin', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // });
        // const data = await response.json();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        showToast('Successfully signed in!', 'success');
        setTimeout(() => {
            window.location.href = 'buyer-dashboard.html';
        }, 1000);

    } catch (error) {
        showToast('Invalid email or password', 'error');
        document.getElementById('signinEmail').classList.add('error');
        document.getElementById('signinPassword').classList.add('error');
    } finally {
        spinner.classList.add('hidden');
        btnText.textContent = 'Sign In';
        submitBtn.disabled = false;
    }
}

// TODO: Replace with actual API call
async function handleSignUp(e) {
    e.preventDefault();

    const role = document.querySelector('input[name="role"]:checked').value;
    const firstName = document.getElementById('signupFirstName').value;
    const lastName = document.getElementById('signupLastName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone')?.value;
    const password = document.getElementById('signupPassword').value;
    const submitBtn = document.getElementById('signupSubmit');
    const spinner = submitBtn.querySelector('.loading-spinner');
    const btnText = submitBtn.querySelector('span');

    // Show loading
    spinner.classList.remove('hidden');
    btnText.textContent = 'Creating account...';
    submitBtn.disabled = true;

    // Clear previous errors
    clearErrors();

    // Validate password strength
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        document.getElementById('signupPassword').classList.add('error');
        spinner.classList.add('hidden');
        btnText.textContent = 'Create Account';
        submitBtn.disabled = false;
        return;
    }

    try {
        // TODO: POST to /api/auth/signup
        // const response = await fetch('/api/auth/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ role, firstName, lastName, email, phone, password })
        // });
        // const data = await response.json();

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        showToast('Account created successfully!', 'success');
        setTimeout(() => {
            if (role === 'provider') {
                window.location.href = 'provider-dashboard.html';
            } else {
                window.location.href = 'buyer-dashboard.html';
            }
        }, 1000);

    } catch (error) {
        showToast('Failed to create account. Please try again.', 'error');
    } finally {
        spinner.classList.add('hidden');
        btnText.textContent = 'Create Account';
        submitBtn.disabled = false;
    }
}

function switchTab(tab) {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const signInTab = document.getElementById('signInTab');
    const signUpTab = document.getElementById('signUpTab');

    if (tab === 'signin') {
        signInForm.classList.remove('hidden');
        signUpForm.classList.add('hidden');
        signInTab.classList.add('bg-white', 'text-text', 'shadow-sm');
        signInTab.classList.remove('text-text-muted');
        signUpTab.classList.remove('bg-white', 'text-text', 'shadow-sm');
        signUpTab.classList.add('text-text-muted');
    } else {
        signInForm.classList.add('hidden');
        signUpForm.classList.remove('hidden');
        signUpTab.classList.add('bg-white', 'text-text', 'shadow-sm');
        signUpTab.classList.remove('text-text-muted');
        signInTab.classList.remove('bg-white', 'text-text', 'shadow-sm');
        signInTab.classList.add('text-text-muted');
    }
}

function toggleRoleFields(role) {
    const phoneField = document.getElementById('phoneField');
    const phoneInput = document.getElementById('signupPhone');

    if (role === 'provider') {
        phoneField.classList.remove('hidden');
        phoneInput.required = true;
    } else {
        phoneField.classList.add('hidden');
        phoneInput.required = false;
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;

    // Update icon
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function checkPasswordStrength(password) {
    const bars = document.querySelectorAll('.password-strength-bar');
    const text = document.getElementById('passwordStrengthText');

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    bars.forEach((bar, index) => {
        bar.className = 'h-1 flex-1 rounded-full password-strength-bar';
        if (index < strength) {
            if (strength === 1) bar.classList.add('weak');
            else if (strength === 2) bar.classList.add('fair');
            else if (strength === 3) bar.classList.add('good');
            else if (strength === 4) bar.classList.add('strong');
        } else {
            bar.classList.add('bg-gray-200');
        }
    });

    const strengthText = ['Enter at least 8 characters', 'Weak', 'Fair', 'Good', 'Strong'];
    text.textContent = strengthText[strength];
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));
}

function socialSignIn(provider) {
    // TODO: Implement OAuth flow
    showToast(`Signing in with ${provider}...`, 'info');
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

// Expose functions to window
window.switchTab = switchTab;
window.toggleRoleFields = toggleRoleFields;
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.socialSignIn = socialSignIn;
