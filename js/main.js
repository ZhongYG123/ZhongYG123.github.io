/* ============================================================
   Chenxinghe Trading Co., Ltd. — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // --- Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileNav.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // --- Header Scroll Effect ---
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Back to Top Button ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Animation (Intersection Observer) ---
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 72;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Lightbox for product images ---
  initLightbox();

});

// --- Lightbox ---
function initLightbox() {
  // Create overlay
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<div class="lightbox-close">&times;</div><div class="lightbox-content"><img src="" alt=""><div class="lightbox-caption"></div></div>';
  document.body.appendChild(overlay);

  var lightboxImg = overlay.querySelector('img');
  var lightboxCaption = overlay.querySelector('.lightbox-caption');
  var closeBtn = overlay.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(function() { lightboxImg.src = ''; }, 300);
  }

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach to all product card images
  var productImages = document.querySelectorAll('.product-card-image img, .product-gallery img');
  productImages.forEach(function(img) {
    var container = img.closest('.product-card-image') || img.closest('.product-gallery');
    if (container && !container.classList.contains('has-lightbox')) {
      container.classList.add('has-lightbox');
      container.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) return;
        var caption = '';
        var card = container.closest('.product-card');
        if (card) {
          var h3 = card.querySelector('h3');
          caption = h3 ? h3.textContent : '';
        }
        openLightbox(img.src, caption);
      });
    }
  });
}

// --- Language Switcher (Basic) ---
function switchLang(lang) {
  var buttons = document.querySelectorAll('.lang-switch button');
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  // For now, show an alert since we haven't implemented full i18n yet
  if (lang === 'zh') {
    alert('中文版网站正在建设中，敬请期待！\n\nChinese version is under construction. Stay tuned!');
    // Revert to EN button
    buttons.forEach(function(btn) {
      btn.classList.remove('active');
      if (btn.textContent.trim() === 'EN') btn.classList.add('active');
    });
  }
}

// --- Contact Form Handler ---
function handleSubmit(event) {
  event.preventDefault();

  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  // Basic validation
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var country = document.getElementById('country').value.trim();
  var product = document.getElementById('product').value;
  var message = document.getElementById('message').value.trim();

  if (!name || !email || !country || !product || !message) {
    alert('Please fill in all required fields (marked with *).');
    return false;
  }

  // Simulate form submission (in production, send to backend/API)
  var submitBtn = form.querySelector('.form-submit');
  var originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = '0.7';

  setTimeout(function() {
    // Hide form, show success
    form.style.display = 'none';
    success.style.display = 'block';

    // Reset form for next use
    form.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '1';

    // Scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // In production: send data to backend API endpoint
    // fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, country, product, message, ... })
    // });
  }, 1500);

  return false;
}
