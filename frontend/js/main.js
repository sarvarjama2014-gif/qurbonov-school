document.addEventListener('DOMContentLoaded', function () {

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    loader.style.opacity = '0';
    setTimeout(function () { loader.style.display = 'none'; }, 500);
  });
  setTimeout(function () {
    if (loader.style.display !== 'none') {
      loader.style.opacity = '0';
      setTimeout(function () { loader.style.display = 'none'; }, 500);
    }
  }, 3000);

  // ===== MOBILE MENU =====
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('overlay');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    mobileMenu.style.left = '0';
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.style.left = '-100%';
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ===== SWIPER INIT =====
  var courseSwiper = new Swiper('.mySwiper', {
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: { slidesPerView: 1.1, spaceBetween: 16 },
      640: { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 24 },
      1280: { slidesPerView: 4, spaceBetween: 30 },
    },
  });

  var studentSwiper = new Swiper('.studentSwiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: false,
    loop: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });

  // ===== FADE-IN ON SCROLL =====
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(function (el) {
    observer.observe(el);
  });

  // ===== MODAL =====
  var modal = document.getElementById('priceModal');
  var modalOverlay = document.getElementById('modalOverlay');
  var modalClose = document.getElementById('modalClose');
  var modalForm = document.getElementById('modalForm');

  document.querySelectorAll('.open-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);

  // ===== FORM SUBMISSION =====
  var API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api/form'
    : '/api/form';

  var mainForm = document.getElementById('applicationForm');
  var successMessage = document.getElementById('successMessage');

  function handleFormSubmit(form, formData) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Yuborilmoqda...';
    submitBtn.disabled = true;

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Server xatosi');
        return res.json();
      })
      .then(function () {
        submitBtn.textContent = 'Yuborildi ✓';
        submitBtn.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
        form.reset();
        if (form === mainForm) {
          successMessage.classList.remove('hidden');
          form.classList.add('hidden');
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 3000);
        } else {
          setTimeout(function () {
            closeModal();
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
          }, 2000);
        }
      })
      .catch(function (err) {
        console.error('Xatolik:', err);
        submitBtn.textContent = 'Xatolik yuz berdi';
        submitBtn.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        setTimeout(function () {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
  }

  if (mainForm) {
    mainForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        name: document.getElementById('name').value.trim(),
        age: parseInt(document.getElementById('age').value),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
      };
      if (!data.name || !data.age || !data.phone || !data.subject) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
      }
      handleFormSubmit(mainForm, data);
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        name: modalForm.querySelector('[name="modal_name"]').value.trim(),
        age: parseInt(modalForm.querySelector('[name="modal_age"]').value),
        phone: modalForm.querySelector('[name="modal_phone"]').value.trim(),
        subject: 'Aniqlanmagan',
      };
      if (!data.name || !data.age || !data.phone) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
      }
      handleFormSubmit(modalForm, data);
    });
  }

  // ===== PHONE MASK =====
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      var x = this.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (x) {
        this.value = !x[2] ? x[1]
          : '(' + x[1] + ') ' + x[2] + (x[3] ? ' ' + x[3] : '') + (x[4] ? ' ' + x[4] : '') + (x[5] ? ' ' + x[5] : '');
      }
    });
  });

  // ===== HEADER SCROLL EFFECT =====
  var header = document.querySelector('header');
  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset;
    if (currentScroll > 200) {
      header.style.backdropFilter = 'blur(10px)';
      header.style.backgroundColor = 'rgba(8, 0, 54, 0.95)';
    } else {
      header.style.backdropFilter = 'none';
      header.style.backgroundColor = '#080036';
    }
    lastScroll = currentScroll;
  });

});