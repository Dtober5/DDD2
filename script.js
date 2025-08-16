const selectionScreen = document.getElementById('selection-screen');
const summaryScreen = document.getElementById('summary-screen');
const servicesForm = document.getElementById('services-form');
const confirmBtn = document.getElementById('confirm-btn');
const backBtn = document.getElementById('back-btn');
const summaryList = document.getElementById('summary-list');
const contactForm = document.getElementById('contact-form');

function showScreen(show, hide) {
  hide.classList.add('fade-out');
  hide.addEventListener('animationend', function handler() {
    hide.classList.add('hidden');
    hide.classList.remove('fade-out');
    hide.removeEventListener('animationend', handler);
  });

  show.classList.remove('hidden');
  show.classList.add('fade-in');
  show.addEventListener('animationend', function handler() {
    show.classList.remove('fade-in');
    show.removeEventListener('animationend', handler);
  });
}

confirmBtn.addEventListener('click', () => {
  const checked = Array.from(servicesForm.querySelectorAll('input[type="checkbox"]:checked'));
  if (checked.length === 0) {
    alert('Please select at least one service.');
    return;
  }
  summaryList.innerHTML = '';
  checked.forEach(cb => {
    const li = document.createElement('li');
    li.textContent = cb.value;
    summaryList.appendChild(li);
  });
  showScreen(summaryScreen, selectionScreen);
});

backBtn.addEventListener('click', () => {
  showScreen(selectionScreen, summaryScreen);
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('customer-name').value;
  const email = document.getElementById('customer-email').value;
  const services = Array.from(summaryList.children).map(li => li.textContent).join('%0D%0A');
  const subject = encodeURIComponent(`Service Request from ${name}`);
  const body = encodeURIComponent(`Services Requested:%0D%0A${services}%0D%0A%0D%0AContact:%0D%0A${name}%0D%0A${email}`);
  window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;
});