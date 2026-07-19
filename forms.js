(function () {
  var stateStyle = document.createElement('style');
  stateStyle.textContent = [
    'select[name="state"]:invalid{color:#9ca3af;-webkit-text-fill-color:#9ca3af}',
    'form[name="hero-contact"] select[name="state"]:invalid{color:rgba(255,255,255,.4);-webkit-text-fill-color:rgba(255,255,255,.4)}',
    'form[name="footer-contact"] select[name="state"]:invalid{color:#6b7280;-webkit-text-fill-color:#6b7280}',
    'form[name="hero-contact"] select[name="state"]:valid,form[name="footer-contact"] select[name="state"]:valid{color:#fff;-webkit-text-fill-color:#fff}',
    'form[name="contact"] select[name="state"]:valid{color:#4b5563;-webkit-text-fill-color:#4b5563}',
    'form[name="careers"] select[name="state"]:valid{color:#0f2e2e;-webkit-text-fill-color:#0f2e2e}'
  ].join('');
  document.head.appendChild(stateStyle);

  document.querySelectorAll('form[data-ajax="true"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      })
        // .then(function () {
        //   var msg = document.createElement('p');
        //   msg.textContent = "Thanks! We'll be in touch soon.";
        //   msg.style.cssText = 'margin-top:1rem;font-weight:600;color:inherit;';
        //   form.replaceWith(msg);
        // })
        .then(function () {
          window.location.href = '/thank-you/';
        })
        .catch(function () {
          var msg = document.createElement('p');
          msg.textContent = 'Something went wrong. Please try again or call us on 1300 978 051.';
          msg.style.cssText = 'margin-top:1rem;font-weight:600;color:red;';
          form.insertAdjacentElement('afterend', msg);
        });
    });
  });
})();
