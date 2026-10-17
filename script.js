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
  document.querySelector('#light').scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth'});
  document.querySelector('#recipient').focus({preventScroll: true});
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

// Curated public-domain King James Version quotations. Messages are editorial encouragement.
const encouragements = [
  {id:'hope-1',mood:'hope',message:'There is still room for hope.',verse:'Rejoicing in hope; patient in tribulation; continuing instant in prayer;',reference:'Romans 12:12',song:2},
  {id:'hope-2',mood:'hope',message:'Take today one hopeful step at a time.',verse:'But I will hope continually, and will yet praise thee more and more.',reference:'Psalm 71:14',song:2},
  {id:'courage-1',mood:'courage',message:'You can take the next small step.',verse:'What time I am afraid, I will trust in thee.',reference:'Psalm 56:3',song:0},
  {id:'courage-2',mood:'courage',message:'Make a little room for courage today.',verse:'Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.',reference:'Psalm 27:14',song:0},
  {id:'peace-1',mood:'peace',message:'You deserve a moment to breathe.',verse:'I will both lay me down in peace, and sleep: for thou, LORD, only makest me dwell in safety.',reference:'Psalm 4:8',song:2},
  {id:'peace-2',mood:'peace',message:'A quiet moment, just for you.',verse:'Great peace have they which love thy law: and nothing shall offend them.',reference:'Psalm 119:165',song:2},
  {id:'gratitude-1',mood:'gratitude',message:'Here’s to the good worth noticing.',verse:'O give thanks unto the LORD, for he is good: for his mercy endureth for ever.',reference:'Psalm 107:1',song:1},
  {id:'gratitude-2',mood:'gratitude',message:'You make the everyday brighter.',verse:'This is the day which the LORD hath made; we will rejoice and be glad in it.',reference:'Psalm 118:24',song:1},
  {id:'comfort-1',mood:'comfort',message:'Sending a little tenderness your way.',verse:'He healeth the broken in heart, and bindeth up their wounds.',reference:'Psalm 147:3',song:2},
  {id:'comfort-2',mood:'comfort',message:'You don’t have to find every answer today.',verse:'God is our refuge and strength, a very present help in trouble.',reference:'Psalm 46:1',song:0}
];
const lightForm = document.querySelector('#light-form');
const cardStatus = document.querySelector('#card-status');
const recipientInput = document.querySelector('#recipient');
const senderInput = document.querySelector('#sender');
const noteInput = document.querySelector('#personal-note');
let currentGift = null;
let spinTimer;
const cleanText = (value, limit) => typeof value === 'string' ? [...value.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g,'')].slice(0,limit).join('').trim() : '';
function giftLink(gift) {
  const data = new TextEncoder().encode(JSON.stringify(gift));
  const encoded = btoa(Array.from(data, byte => String.fromCharCode(byte)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const url = new URL(location.href);
  url.search = '';
  url.hash = `gift=${encoded}`;
  return url.href;
}
function selectedEntry() { return encouragements.find(entry => entry.id === currentGift?.id); }
function updateGift(entry, incoming = null) {
  currentGift = incoming || {v:1,id:entry.id,to:cleanText(recipientInput.value,40),from:cleanText(senderInput.value,40),note:cleanText(noteInput.value,160)};
  const song = songs[entry.song];
  document.querySelector('#card-recipient').textContent = currentGift.to ? `For ${currentGift.to}.` : 'For someone special.';
  document.querySelector('#card-message').textContent = entry.message;
  document.querySelector('#card-verse').textContent = `“${entry.verse}”`;
  document.querySelector('#card-verse').hidden = false;
  document.querySelector('#card-reference').textContent = `${entry.reference} · KJV`;
  document.querySelector('#card-note').textContent = currentGift.note;
  document.querySelector('#card-note').hidden = !currentGift.note;
  document.querySelector('#card-sender').textContent = currentGift.from ? `With love, ${currentGift.from}` : 'Sent with love.';
  document.querySelector('#card-song-title').textContent = song.querySelector('h3').textContent;
  document.querySelector('#card-song').href = song.href;
  document.querySelector('#card-result').hidden = false;
  const text = `${currentGift.to ? `For ${currentGift.to}` : 'A little light for you'} 💛\n\n${entry.message}\n\n“${entry.verse}”\n${entry.reference} (KJV)${currentGift.note ? `\n\nA note for you: ${currentGift.note}` : ''}${currentGift.from ? `\n\nWith love, ${currentGift.from}` : ''}\n\nA song for you: ${song.querySelector('h3').textContent}\nFind it on Thamar’s channel: ${song.href}\n\nOpen your card: ${giftLink(currentGift)}`;
  document.querySelector('#whatsapp-share').href = `https://wa.me/?text=${encodeURIComponent(text)}`;
}
lightForm.addEventListener('submit', event => {
  event.preventDefault();
  const mood = new FormData(lightForm).get('mood');
  const options = encouragements.filter(entry => entry.mood === mood && entry.id !== currentGift?.id);
  const entry = options[Math.floor(Math.random() * options.length)];
  updateGift(entry);
  clearTimeout(spinTimer);
  document.querySelector('.record').classList.add('is-creating');
  spinTimer = setTimeout(() => document.querySelector('.record').classList.remove('is-creating'),1800);
  cardStatus.textContent = 'Your card is ready. Share a little light, or spin again for another verse.';
  document.querySelector('#encouragement-card').focus({preventScroll:true});
  if (matchMedia('(max-width: 760px)').matches) document.querySelector('.card-area').scrollIntoView({behavior:reducedMotion.matches ? 'instant':'smooth',block:'start'});
});
[recipientInput,senderInput,noteInput].forEach(input => input.addEventListener('input', () => {
  if (currentGift) { updateGift(selectedEntry()); cardStatus.textContent = 'Your card and sharing link have been updated.'; }
}));
document.querySelectorAll('input[name=mood]').forEach(input => input.addEventListener('change', () => {
  if (currentGift) cardStatus.textContent = 'Press Spin & create a card to choose a verse for this feeling.';
}));
document.querySelector('#copy-card').addEventListener('click', async () => {
  if (!currentGift) return;
  const url = giftLink(currentGift);
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(url);
    cardStatus.textContent = 'Link copied. Send it to someone who needs a little light.';
  } catch {
    let fallback = document.querySelector('#copy-link-fallback');
    if (!fallback) {
      const label = document.createElement('label'); label.htmlFor='copy-link-fallback';label.textContent='Copy this dedication link:';
      fallback = document.createElement('input');fallback.id='copy-link-fallback';fallback.readOnly=true;fallback.setAttribute('aria-label','Dedication link');
      cardStatus.replaceChildren(label,fallback);
    }
    fallback.value=url;fallback.focus();fallback.select();
  }
});
function readGift() {
  if (!location.hash.startsWith('#gift=')) return;
  try {
    const encoded = location.hash.slice(6);
    if (encoded.length > 5000 || !/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('Invalid link');
    const bytes = Uint8Array.from(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
    const data = JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
    const entry = encouragements.find(item => item.id === data?.id);
    if (!entry || data.v!==1 || !['to','from','note'].every(key => typeof data[key]==='string')) throw new Error('Unknown card');
    const gift = {v:1,id:entry.id,to:cleanText(data.to,40),from:cleanText(data.from,40),note:cleanText(data.note,160)};
    recipientInput.value=gift.to;senderInput.value=gift.from;noteInput.value=gift.note;
    document.querySelector(`input[name=mood][value=${entry.mood}]`).checked=true;
    updateGift(entry,gift);
    cardStatus.textContent='Someone sent you a little light. Enjoy your verse and song, or make a card for someone else.';
    requestAnimationFrame(()=>document.querySelector('.card-area').scrollIntoView({behavior:'instant',block:'start'}));
  } catch { cardStatus.textContent='This dedication link could not be opened. You can still create a new card below.'; }
}
addEventListener('hashchange',readGift);
readGift();

// Render a standalone Story image with no external assets or audio.
function wrapCanvasText(ctx,text,width) {
  const lines=[];
  for (const paragraph of text.split('\n')) {
    let line='';
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue;
      const next=line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width<=width) { line=next;continue; }
      if (line) { lines.push(line);line=''; }
      if (ctx.measureText(word).width<=width) { line=word;continue; }
      for (const char of Array.from(word)) {
        if (ctx.measureText(line+char).width>width && line) { lines.push(line);line=''; }
        line+=char;
      }
    }
    lines.push(line);
  }
  return lines;
}
function drawBlock(ctx,text,x,y,width,maxHeight,startSize,family,color,weight=500) {
  let size=startSize,lines;
  do {
    ctx.font=`${weight} ${size}px ${family}`;
    lines=wrapCanvasText(ctx,text,width);
    if (lines.length*size*1.35<=maxHeight || size<=22) break;
    size-=2;
  } while(size>22);
  ctx.fillStyle=color;
  ctx.textBaseline='top';
  lines.forEach((line,index)=>ctx.fillText(line,x,y+index*size*1.35));
  return lines.length*size*1.35;
}
document.querySelector('#download-card').addEventListener('click', async () => {
  if (!currentGift) return;
  const button=document.querySelector('#download-card');button.disabled=true;
  const gift={...currentGift}; const entry=selectedEntry();
  try {
    await Promise.all([document.fonts.load('500 48px "Space Grotesk"'),document.fonts.load('400 40px Manrope'),document.fonts.load('400 40px "Noto Sans Arabic"')]);
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;
    const ctx=canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');
    ctx.fillStyle='#103f62';ctx.fillRect(0,0,1080,1920);
    ctx.strokeStyle='#245774';ctx.lineWidth=2;
    [220,275,330].forEach(radius=>{ctx.beginPath();ctx.arc(1050,420,radius,0,Math.PI*2);ctx.stroke();});
    ctx.fillStyle='#37c6b4';ctx.fillRect(80,100,70,7);
    drawBlock(ctx,'A LITTLE LIGHT, JUST FOR YOU',80,140,920,70,25,'Manrope','#c6eae2',700);
    drawBlock(ctx,gift.to ? `For ${gift.to}.`:'For someone special.',80,245,920,230,80,'"Space Grotesk", "Noto Sans Arabic"','#ff8c27',600);
    drawBlock(ctx,entry.message,80,510,920,220,66,'"Space Grotesk"','#f2efe7');
    drawBlock(ctx,`“${entry.verse}”`,80,780,920,300,49,'"Space Grotesk"','#f2efe7',400);
    drawBlock(ctx,`${entry.reference} · KJV`,80,1105,920,70,29,'Manrope','#37c6b4',700);
    if (gift.note) drawBlock(ctx,gift.note,80,1220,920,225,39,'Manrope, "Noto Sans Arabic"','#f2efe7',400);
    drawBlock(ctx,gift.from ? `With love, ${gift.from}`:'Sent with love.',80,1490,920,130,34,'Manrope, "Noto Sans Arabic"','#c6eae2',400);
    ctx.fillStyle='#35617a';ctx.fillRect(80,1650,920,2);
    drawBlock(ctx,`A SONG FOR YOU · ${songs[entry.song].querySelector('h3').textContent}`,80,1700,920,70,30,'"Space Grotesk"','#ff8c27',600);
    drawBlock(ctx,'Thamar Zananiri · @ThamarZananiriOfficial',80,1780,920,65,27,'Manrope','#f2efe7',400);
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Export failed')),'image/png'));
    const url=URL.createObjectURL(blob);const anchor=document.createElement('a');anchor.href=url;anchor.download='a-little-light-thamar.png';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    cardStatus.textContent='Your Story card is ready. Copy the dedication link to add it to your Story.';
  } catch { cardStatus.textContent='The image could not be created in this browser. You can still copy the card link or share on WhatsApp.'; }
  finally {button.disabled=false;}
});
