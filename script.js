const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const songs = [...document.querySelectorAll('.song')];
const search = document.querySelector('#song-search');
const status = document.querySelector('#music-status');
const normalize = value => value.normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g, '').toLocaleLowerCase().trim();
search.addEventListener('input', () => {
  const query = normalize(search.value);
  songs.forEach(song => {
    song.hidden = !normalize(song.querySelector('.song-details').textContent).includes(query);
    song.classList.remove('picked');
  });
  const count = songs.filter(song => !song.hidden).length;
  status.textContent = count ? `${count} ${count === 1 ? 'song' : 'songs'} to explore` : 'No songs found. Try another title in English or Arabic.';
});
let previousPick = -1;
document.querySelector('#surprise').addEventListener('click', () => {
  search.value = '';
  songs.forEach(song => { song.hidden = false; song.classList.remove('picked'); });
  const choices = songs.map((_, index) => index).filter(index => index !== previousPick);
  const index = choices[Math.floor(Math.random() * choices.length)];
  previousPick = index;
  const song = songs[index];
  song.classList.add('picked');
  status.textContent = `Your next listen: ${song.querySelector('h3').textContent}. Open the highlighted card to find it on Thamar’s channel.`;
  song.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
  song.focus({ preventScroll: true });
});
const record = document.querySelector('.record-control');
record.addEventListener('click', () => {
  const active = record.getAttribute('aria-pressed') !== 'true';
  record.setAttribute('aria-pressed', String(active));
  record.setAttribute('aria-label', active ? 'Stop the illustrated record' : 'Animate the illustrated record');
  document.querySelector('.record-caption').textContent = active ? 'IN MOTION · TAP TO PAUSE' : 'TAP TO SPIN · VISUAL PLAYGROUND';
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches && record.getAttribute('aria-pressed') === 'true') record.click();
});
const progress = document.querySelector('.reading-progress');
let scheduled = false;
const updateScroll = () => {
  const range = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
  document.querySelector('.header').classList.toggle('scrolled', scrollY > 30);
  scheduled = false;
};
addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
updateScroll();
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-top, .song, .connect').forEach(element => {
    element.classList.add('reveal'); observer.observe(element);
  });
}
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  songs.forEach(song => {
    song.addEventListener('pointermove', event => {
      if (reducedMotion.matches) return;
      const rect = song.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      song.style.setProperty('--tilt-x', `${-y * 7}deg`);
      song.style.setProperty('--tilt-y', `${x * 7}deg`);
    });
    song.addEventListener('pointerleave', () => {
      song.style.setProperty('--tilt-x', '0deg'); song.style.setProperty('--tilt-y', '0deg');
    });
  });
}
