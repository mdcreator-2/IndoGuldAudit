/* ============================================
   Indo Gulf Audit — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Active Navigation Link ──────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Also set mobile nav active states
  document.querySelectorAll('.mobile-nav-panel nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });


  // ── 2. Mobile Hamburger Menu ───────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobilePanel = document.getElementById('mobile-panel');

  function openMobileMenu() {
    mobileOverlay?.classList.add('active');
    mobilePanel?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('active');
    mobilePanel?.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);


  // ── 3. Smooth Scroll for Anchor Links ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileMenu();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── 4. Fade-In on Scroll (Intersection Observer) ───────
  const fadeElements = document.querySelectorAll('.fade-in-up');
  
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }


  // ── 5. Counter Animation (About Page Stats) ────────────
  const counterElements = document.querySelectorAll('[data-counter]');
  
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = el.getAttribute('data-counter');
    const suffix = el.getAttribute('data-suffix') || '';
    const isPercent = target.includes('%');
    const isRatio = target.includes('/');
    
    if (isRatio) {
      // For "24/7" style — just reveal it
      el.textContent = target;
      return;
    }

    const numericValue = parseInt(target.replace(/[^0-9]/g, ''), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * numericValue);

      el.textContent = currentValue + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }


  // ── 6. FAQ Accordion (Company Formation Page) ──────────
  document.querySelectorAll('.faq-item .faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      
      // Close all other FAQ items
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });


  // ── 7. Contact Form Handler ────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Hide form, show success
    contactForm.style.display = 'none';
    if (formSuccess) {
      formSuccess.classList.add('show');
    }

    // Reset form after a delay
    setTimeout(() => {
      contactForm.reset();
    }, 1000);
  });


  // ── 8. Navbar Shadow on Scroll ─────────────────────────
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

});
