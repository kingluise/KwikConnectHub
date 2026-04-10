// KwikConnectHub - 404 Page JavaScript

document.addEventListener('DOMContentLoaded', () => {

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Redirect after 30 seconds of inactivity
    let redirectTimer = setTimeout(() => {
        window.location.href = 'index.html';
    }, 30000);

    // Reset timer on user interaction
    document.addEventListener('mousemove', () => {
        clearTimeout(redirectTimer);
    });

    document.addEventListener('keydown', () => {
        clearTimeout(redirectTimer);
    });

    console.log('404 page loaded');
});
