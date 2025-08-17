const selectionScreen = document.getElementById('selection-screen');
const summaryScreen   = document.getElementById('summary-screen');
const servicesForm    = document.getElementById('services-form');
const confirmBtn      = document.getElementById('confirm-btn');
const backBtn         = document.getElementById('back-btn');
const summaryList     = document.getElementById('summary-list');
const contactForm     = document.getElementById('contact-form');

// NEW refs
const filesInput      = document.getElementById('customer-files');
const filesList       = document.getElementById('selected-files');
const dlBtn           = document.getElementById('download-summary');

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

// File list preview
filesInput?.addEventListener('change', () => {
  if (!filesInput.files?.length) { filesList.textContent = ''; return; }
  let total = 0;
  const names = Array.from(filesInput.files).map(f => {
    total += f.size || 0;
    return `• ${f.name} (${Math.round((f.size||0)/1024)} KB)`;
  });
  filesList.innerHTML = `<p><strong>${filesInput.files.length}</strong> file(s):<br>${names.join('<br>')}</p><p><em>Note:</em> attachments must be added manually in your email client after it opens.</p>`;
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('customer-name').value.trim();
  const email = document.getElementById('customer-email').value.trim();
  const message = document.getElementById('customer-message').value.trim();

  const services = Array.from(summaryList.children).map(li => `- ${li.textContent}`).join('%0D%0A');

  const files = filesInput?.files ? Array.from(filesInput.files).map(f => `- ${f.name} (${Math.round((f.size||0)/1024)} KB)`).join('%0D%0A') : 'None';

  const subject = encodeURIComponent(`Service Request from ${name}`);
  const bodyRaw = `Services Requested:%0D%0A${services}%0D%0A%0D%0AContact:%0D%0A${name}%0D%0A${email}%0D%0A%0D%0ANotes:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0AAttachments to add:%0D%0A${files}%0D%0A`;
  window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${bodyRaw}`;
});

// “Download Summary” convenience
dlBtn?.addEventListener('click', () => {
  const name = document.getElementById('customer-name').value.trim() || 'Client';
  const email = document.getElementById('customer-email').value.trim() || '(none provided)';
  const message = document.getElementById('customer-message').value.trim();
  const services = Array.from(summaryList.children).map(li => `- ${li.textContent}`).join('\n') || '(none)';
  const files = filesInput?.files ? Array.from(filesInput.files).map(f => `- ${f.name} (${Math.round((f.size||0)/1024)} KB)`).join('\n') : 'None';

  const txt = [
    'Damien’s Demon Detailing — Request Summary',
    '',
    'Services:',
    services,
    '',
    'Contact:',
    name,
    email,
    '',
    'Notes:',
    message || '(none)',
    '',
    'Attachments to add:',
    files
  ].join('\n');

  const blob = new Blob([txt], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'detailing-request.txt';
  a.click();
  URL.revokeObjectURL(url);
});
