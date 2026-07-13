(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('navLinks');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Scroll reveals
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Lightbox (thumb grid -> data-large on demand)
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCount = lb.querySelector('.lb-count');
    var gallery = [], idx = 0, lastFocus = null;
    function showAt(i) {
      idx = (i + gallery.length) % gallery.length;
      var im = gallery[idx];
      lbImg.src = im.getAttribute('data-large') || im.src;
      lbImg.alt = im.alt;
      lbCount.textContent = (idx + 1) + ' / ' + gallery.length;
    }
    function openLb(imgs, i) {
      gallery = imgs; lastFocus = document.activeElement;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      showAt(i);
      lb.querySelector('.lb-close').focus();
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    document.querySelectorAll('.gallery').forEach(function (g) {
      var imgs = Array.prototype.slice.call(g.querySelectorAll('img'));
      g.querySelectorAll('button').forEach(function (btn, i) {
        btn.addEventListener('click', function () { openLb(imgs, i); });
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { showAt(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { showAt(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') showAt(idx - 1);
      if (e.key === 'ArrowRight') showAt(idx + 1);
    });
  }

  // Contact form (Formspree AJAX)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      if (!form.checkValidity()) {
        status.textContent = 'Please fill in your name, email, and a note about your project.';
        status.classList.remove('ok');
        return;
      }
      var data = new FormData(form);
      var controls = form.querySelectorAll('input,textarea,button');
      controls.forEach(function (el) { el.disabled = true; });
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Thank you — your message is on its way. We’ll be in touch soon.';
          status.classList.add('ok');
        } else { throw new Error('bad status'); }
      }).catch(function () {
        controls.forEach(function (el) { el.disabled = false; });
        status.textContent = 'Something went wrong sending your message. Please email info@abiariinteriors.com instead.';
        status.classList.remove('ok');
      });
    });
  }
})();
