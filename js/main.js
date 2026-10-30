/* =========================================================
   XYZ Company — interactions (no dependencies)
   ========================================================= */
(function () {
  'use strict';

  /* =======================================================
     CONTACT FORM DELIVERY
     -------------------------------------------------------
     GitHub Pages is static hosting, so it cannot send mail
     itself. These providers accept a browser POST and
     forward it to your inbox. Pick one, fill in the value,
     and the form goes live.

     provider: 'web3forms'  -> set accessKey  (recommended;
                               your address stays out of the
                               page source)
     provider: 'formsubmit' -> set email      (no signup, but
                               the address is visible in the
                               page source)

     Until it is configured the form stays in demo mode and
     only shows a notice.
     ======================================================= */
  var FORM = {
    provider:  'web3forms',
    accessKey: '2dcd4291-743e-4846-917f-6a6152f73c2d',
    email:     'support@sharpbees.com',
    subject:   'New enquiry from the XYZ Company website'
  };

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow + back-to-top ---------- */
  var header = $('#header');
  var toTop  = $('#toTop');

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (toTop)  toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var burger = $('#burger');
  var nav    = $('#nav');
  var backdrop = null;

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-lock');
    if (backdrop) {
      backdrop.classList.remove('is-on');
      var el = backdrop;
      backdrop = null;
      setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 300);
    }
  }

  function openNav() {
    nav.classList.add('is-open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-lock');

    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    backdrop.addEventListener('click', closeNav);
    document.body.appendChild(backdrop);
    requestAnimationFrame(function () { backdrop.classList.add('is-on'); });
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.contains('is-open') ? closeNav() : openNav();
    });
    $$('.nav a').forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Scroll reveal ---------- */
  var revealables = $$('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Animated stat counters ---------- */
  function runCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var navLinks = $$('.nav__link');
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function syncActiveLink() {
    var pos = (window.pageYOffset || document.documentElement.scrollTop) + 140;
    var currentId = sections.length ? sections[0].id : null;

    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', syncActiveLink, { passive: true });
  syncActiveLink();

  /* ---------- Job category filter ---------- */
  var chips = $$('.chip');
  var jobs  = $$('.job');
  var empty = $('#jobsEmpty');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.classList.toggle('is-active', c === chip); });

      var shown = 0;
      jobs.forEach(function (job) {
        var match = filter === 'all' || job.getAttribute('data-cat') === filter;
        job.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });

      if (empty) empty.hidden = shown !== 0;
    });
  });

  /* ---------- Contact form: validate, then POST to the provider ---------- */
  var form = $('#contactForm');
  var note = $('#formNote');

  function setError(input, message) {
    var field = input.closest('.field');
    if (!field) return;
    var slot = $('.err', field);
    field.classList.toggle('has-error', !!message);
    if (slot) slot.textContent = message || '';
  }

  function validate() {
    var ok = true;
    var name    = $('#name');
    var email   = $('#email');
    var phone   = $('#phone');
    var message = $('#message');

    if (!name.value.trim()) { setError(name, 'Please enter your name.'); ok = false; }
    else setError(name, '');

    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email.value.trim())) { setError(email, 'Enter a valid email address.'); ok = false; }
    else setError(email, '');

    if (phone.value.trim() && !/^[+\d][\d\s()-]{6,19}$/.test(phone.value.trim())) {
      setError(phone, 'Enter a valid phone number.'); ok = false;
    } else setError(phone, '');

    if (message.value.trim().length < 10) {
      setError(message, 'Please add a little more detail (10+ characters).'); ok = false;
    } else setError(message, '');

    return ok;
  }

  function isConfigured() {
    if (FORM.provider === 'web3forms') {
      return !!FORM.accessKey && FORM.accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';
    }
    if (FORM.provider === 'formsubmit') {
      return !!FORM.email && FORM.email.indexOf('@') > 0;
    }
    return false;
  }

  function showNote(text, kind) {
    if (!note) return;
    note.textContent = text;
    note.classList.toggle('form__note--error', kind === 'error');
    note.hidden = false;
    note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function buildPayload() {
    var base = {
      name:    $('#name').value.trim(),
      email:   $('#email').value.trim(),
      phone:   $('#phone').value.trim() || 'Not provided',
      topic:   $('#topic').value,
      message: $('#message').value.trim(),
      subject: FORM.subject,
      page:    window.location.href
    };

    if (FORM.provider === 'web3forms') {
      base.access_key = FORM.accessKey;
      base.from_name = 'XYZ Company website';
      base.replyto = base.email;
      base.botcheck = '';
    } else {
      // FormSubmit reserved fields
      base._subject  = FORM.subject;
      base._replyto  = base.email;
      base._template = 'table';
      base._captcha  = 'false';
    }
    return base;
  }

  function endpoint() {
    return FORM.provider === 'web3forms'
      ? 'https://api.web3forms.com/submit'
      : 'https://formsubmit.co/ajax/' + encodeURIComponent(FORM.email);
  }

  function clearFields() {
    form.reset();
    $$('.field', form).forEach(function (f) {
      f.classList.remove('has-error');
      var slot = $('.err', f);
      if (slot) slot.textContent = '';
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (note) note.hidden = true;

      // Honeypot: a filled hidden field means a bot. Fail silently.
      if ($('#botcheck') && $('#botcheck').value) {
        showNote('Thanks - your message has been sent.', 'ok');
        clearFields();
        return;
      }

      if (!validate()) {
        var firstBad = $('.field.has-error input, .field.has-error textarea');
        if (firstBad) firstBad.focus();
        return;
      }

      var btn = $('#formSubmit');
      var original = btn.textContent;

      if (!isConfigured()) {
        showNote(
          'Form delivery is not configured yet, so nothing was sent. ' +
          'Add your provider key in js/main.js to switch this on.',
          'error'
        );
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Sending...';

      fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload())
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          // Both providers report success either via HTTP status or a
          // success flag, which FormSubmit sends as the string "true".
          var ok = result.ok && String(result.data.success) !== 'false';
          if (!ok) {
            throw new Error(result.data.message || 'Request failed');
          }
          clearFields();
          showNote('Thanks - your message has been sent. We will get back to you shortly.', 'ok');
        })
        .catch(function (err) {
          showNote(
            'Sorry, the message could not be sent (' + err.message + '). ' +
            'Please email us directly instead.',
            'error'
          );
        })
        .then(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });

    $$('input, textarea', form).forEach(function (input) {
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validate();
      });
    });
  }
})();
