const record = document.querySelector('.record-control');
const caption = document.querySelector('.record-caption');
if (record && caption) {
  record.addEventListener('click', () => {
    const spinning = record.getAttribute('aria-pressed') !== 'true';
    record.setAttribute('aria-pressed', String(spinning));
    record.setAttribute('aria-label', spinning ? 'Pause the record' : 'Spin the record');
    caption.textContent = spinning ? 'TAP TO PAUSE THE RECORD' : 'TAP TO SPIN THE RECORD';
  });
}
