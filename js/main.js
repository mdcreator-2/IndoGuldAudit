/**
 * Indo Gulf Audit — Main JavaScript
 * Handles: mobile navigation, scroll animations, contact form AJAX
 */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // Mobile Navigation
    // ========================================
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobilePanel = document.getElementById('mobile-panel');

    function openMobileNav() {
        if (mobileOverlay && mobilePanel) {
            mobileOverlay.classList.add('active');
            mobilePanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeMobileNav() {
        if (mobileOverlay && mobilePanel) {
            mobileOverlay.classList.remove('active');
            mobilePanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', openMobileNav);
    if (menuClose) menuClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMobileNav();
    });

    // Close mobile nav when a link is clicked
    if (mobilePanel) {
        mobilePanel.querySelectorAll('nav a').forEach(function (link) {
            link.addEventListener('click', closeMobileNav);
        });
    }


    // ========================================
    // Scroll-based Fade-In Animations
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .fade-in-up');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }


    // ========================================
    // Contact Form AJAX Submission
    // ========================================
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    const sendAnotherBtn = document.getElementById('send-another-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.textContent = 'Sending...';
            if (submitSpinner) submitSpinner.classList.remove('hidden');
            if (formError) formError.classList.add('hidden');

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    // Show success, hide form
                    contactForm.style.display = 'none';
                    if (formSuccess) {
                        formSuccess.classList.add('show');
                        formSuccess.style.display = 'block';
                    }
                    contactForm.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                if (formError) formError.classList.remove('hidden');
            } finally {
                // Reset button state
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.textContent = 'Send Message';
                if (submitSpinner) submitSpinner.classList.add('hidden');
            }
        });
    }

    // Send another message button
    if (sendAnotherBtn) {
        sendAnotherBtn.addEventListener('click', function () {
            if (contactForm) contactForm.style.display = '';
            if (formSuccess) {
                formSuccess.classList.remove('show');
                formSuccess.style.display = 'none';
            }
        });
    }


    // ========================================
    // Smooth scroll for anchor links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
