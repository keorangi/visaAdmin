// Mobile nav toggle
(function () {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();

// Form submission — progressive enhancement.
// If JS is available and the action is a real URL, we POST via fetch and
// show inline status. Otherwise the browser submits natively.
(function () {
  const forms = document.querySelectorAll('form[data-form]');
  if (!forms.length) return;

  const honeypotField = 'website';

  forms.forEach((form) => {
    const status = form.querySelector('.form-message');
    const thanks = form.dataset.thanks || 'Thanks.';
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
      const action = form.getAttribute('action');

      // Honeypot — if filled, silently succeed.
      const trap = form.elements[honeypotField];
      if (trap && trap.value) {
        e.preventDefault();
        if (status) { status.dataset.state = 'ok'; status.textContent = thanks; }
        form.reset();
        return;
      }

      // Endpoint not configured — intercept and acknowledge locally.
      if (!action || action === '#') {
        e.preventDefault();
        if (status) {
          status.dataset.state = 'ok';
          status.textContent = thanks + ' (Local preview — endpoint not configured.)';
        }
        form.reset();
        return;
      }

      e.preventDefault();
      const data = new FormData(form);
      data.set('_form', form.dataset.form || 'unknown');
      data.set('_page', location.pathname);

      const original = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      if (status) { status.dataset.state = ''; status.textContent = ''; }

      try {
        const res = await fetch(action, {
          method: form.getAttribute('method') || 'POST',
          body: data,
          headers: { 'Accept': 'application/json' },
        });
        if (res.ok) {
          if (status) { status.dataset.state = 'ok'; status.textContent = thanks; }
          form.reset();
        } else {
          let serverMsg = '';
          try { const j = await res.json(); serverMsg = j.message || ''; } catch (_) {}
          if (status) {
            status.dataset.state = 'error';
            if (res.status >= 400 && res.status < 500) {
              status.textContent = /spam/i.test(serverMsg)
                ? "Submission likely blocked by our spam filters. If this is genuine, email hello@aewvcompliance.co.nz."
                : "Submission may not have gone through. Please check the fields and try again.";
            } else {
              status.textContent = 'Our submission service is currently unavailable. Please try again later, or email hello@aewvcompliance.co.nz.';
            }
          }
        }
      } catch (err) {
        if (status) {
          status.dataset.state = 'error';
          status.textContent = 'Could not send. Please try again, or email hello@aewvcompliance.co.nz.';
        }
      } finally {
        if (submitBtn && original !== null) { submitBtn.disabled = false; submitBtn.textContent = original; }
      }
    });
  });
})();
