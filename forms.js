document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form[data-netlify="true"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      fetch('/', { method: 'POST', body: data })
        .then(function () {
          var msg = document.createElement('p');
          msg.textContent = "Thanks! We'll be in touch soon.";
          msg.className = form.dataset.successClass || '';
          msg.style.cssText = 'margin-top:1rem;font-weight:600;color:inherit;';
          form.replaceWith(msg);
        })
        .catch(function () {
          var msg = document.createElement('p');
          msg.textContent = 'Something went wrong. Please try again or call us on 1300 978 051.';
          msg.style.cssText = 'margin-top:1rem;font-weight:600;color:red;';
          form.insertAdjacentElement('afterend', msg);
        });
    });
  });
});
