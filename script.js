'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const viewport = $('#viewport');
const world = $('#world');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const positions = slides.map((_, i) => {
  const row = Math.floor(i / 5);
  const column = 4 - i % 5;
  return [180 + column * 1340, 180 + row * 900];
});

$('#sections').innerHTML = slides.map((slide, i) => `
  <section id="${slide.id}" class="station" data-scene="${slide.id}" data-station="${i}"
    aria-label="${escapeHTML(slide.title)}" style="left:${positions[i][0]}px;top:${positions[i][1]}px">
    ${slide.cover ? '' : `<div class="eyebrow">${String(i + 1).padStart(2,'0')} / ${slide.kicker}</div>`}
    ${slide.render()}
    <button class="map-hit-target" data-map-station="${i}" disabled tabindex="-1"
      aria-label="رفتن به اسلاید ${i + 1}: ${escapeHTML(slide.title)}">
      <span class="map-hit-number">${String(i + 1).padStart(2, '0')}</span>
      <span class="map-hit-title">${slide.title}</span>
    </button>
  </section>`).join('');

const mapWidth = Math.max(...positions.map(p => p[0])) - 180 + 1120;
const mapHeight = Math.max(...positions.map(p => p[1])) - 180 + 660;
$('#connections').style.width = `${mapWidth + 360}px`;
$('#connections').style.height = `${mapHeight + 360}px`;
$('#connections').innerHTML = positions.slice(1).map((p, i) => {
  const a = positions[i];
  return `<path d="M ${a[0]+560} ${a[1]+330} C ${a[0]+560} ${p[1]+330}, ${p[0]+560} ${a[1]+330}, ${p[0]+560} ${p[1]+330}"/>`;
}).join('');

// One camera transforms the persistent world. Overview has explicit hit targets.
const camera = {x: 0, y: 0, scale: 1};
let current = 0;
let overview = false;
let animation = 0;
function paint() {
  world.style.transform = `translate(${camera.x}px,${camera.y}px) scale(${camera.scale})`;
}
function move(target, duration = 800) {
  cancelAnimationFrame(animation);
  const start = {...camera};
  const started = performance.now();
  function tick(now) {
    const t = Math.min(1, (now - started) / (reducedMotion ? 1 : duration));
    const eased = 1 - Math.pow(1 - t, 4);
    for (const key of ['x', 'y', 'scale']) camera[key] = start[key] + (target[key] - start[key]) * eased;
    paint();
    if (t < 1) animation = requestAnimationFrame(tick);
  }
  animation = requestAnimationFrame(tick);
}
function setOverview(enabled) {
  overview = enabled;
  viewport.classList.toggle('is-overview', enabled);
  $$('.station').forEach((section, i) => {
    [...section.children].forEach(child => {
      if (!child.matches('.map-hit-target')) child.inert = enabled || i !== current;
    });
  });
  $$('[data-map-station]').forEach(button => {
    button.disabled = !enabled;
    button.tabIndex = enabled ? 0 : -1;
  });
}
function focusStation(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  setOverview(false);
  const scale = Math.min((innerWidth - 60) / 1120, (innerHeight - 160) / 660, 1.35);
  const position = positions[current];
  move({scale, x: innerWidth / 2 - (position[0] + 560) * scale, y: (innerHeight + 5) / 2 - (position[1] + 330) * scale});
  $$('.station').forEach((section, i) => section.classList.toggle('active', i === current));
  const activeSection = $$('.station')[current];
  activeSection.classList.remove('scene-enter');
  void activeSection.offsetWidth;
  activeSection.classList.add('scene-enter');
  $('#counter').innerHTML = `${String(current + 1).padStart(2, '0')} <i>/ ${slides.length}</i>`;
  $('#breadcrumbs').textContent = slides[current].kicker;
  $('#progress').style.width = `${(current + 1) / slides.length * 100}%`;
  $('#previous').disabled = current === 0;
  $('#next').disabled = current === slides.length - 1;
  $('#announcement').textContent = slides[current].title;
  $('#help').hidden = true;
}
function showMap() {
  setOverview(true);
  const scale = Math.min((innerWidth - 80) / mapWidth, (innerHeight - 160) / mapHeight);
  world.style.setProperty('--map-label-size', `${Math.min(130, 11 / scale)}px`);
  world.style.setProperty('--map-number-size', `${Math.min(100, 9 / scale)}px`);
  move({scale, x: (innerWidth - mapWidth * scale) / 2 - 180 * scale, y: (innerHeight - mapHeight * scale) / 2 - 180 * scale});
  $('#breadcrumbs').textContent = 'OVERVIEW / CLICK A SLIDE TO OPEN';
  $('#announcement').textContent = 'نمای کلی؛ روی اسلاید موردنظر کلیک کنید.';
}
$('#previous').onclick = () => focusStation(current - 1);
$('#next').onclick = () => focusStation(current + 1);
$('#map-button').onclick = showMap;
$('.brand').onclick = e => { e.preventDefault(); focusStation(0); };
$('#help-toggle').onclick = () => { $('#help').hidden = !$('#help').hidden; };
$('#fullscreen').onclick = async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  } catch { $('#announcement').textContent = 'تمام‌صفحه در این مرورگر در دسترس نیست.'; }
};
$('#help-toggle').innerHTML = icon('help');
$('#fullscreen').innerHTML = icon('fullscreen');
$('#map-button').innerHTML = `${icon('grid')} نمای کلی ارائه`;

document.addEventListener('keydown', e => {
  if ($('#tool-dialog').open) return;
  if (e.key === 'Escape') { e.preventDefault(); showMap(); return; }
  if (e.target.matches('input,textarea,select') || e.target.isContentEditable) return;
  if (!['ArrowRight','ArrowLeft',' ','Home','End'].includes(e.key)) return;
  if (e.key === ' ' && e.target.closest('button,a')) return;
  e.preventDefault();
  if (e.key === 'ArrowLeft' || e.key === ' ') focusStation(current + 1);
  else if (e.key === 'ArrowRight') focusStation(current - 1);
  else if (e.key === 'End') focusStation(slides.length - 1);
  else showMap();
});

// Capture only after a real drag. Capturing on pointerdown retargets a normal
// click to the viewport and loses the selected slide — the original overview bug.
let drag = null;
let suppressClickUntil = 0;
viewport.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  if (!overview && e.target.closest('button,input,textarea,a,label')) return;
  drag = {id: e.pointerId, x: e.clientX, y: e.clientY, cx: camera.x, cy: camera.y, moved: false};
});
viewport.addEventListener('pointermove', e => {
  if (!drag || drag.id !== e.pointerId) return;
  const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if (!drag.moved && Math.hypot(dx, dy) > 6) {
    drag.moved = true;
    cancelAnimationFrame(animation);
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('dragging');
  }
  if (!drag.moved) return;
  camera.x = drag.cx + dx;
  camera.y = drag.cy + dy;
  paint();
});
function endDrag(e) {
  if (!drag || drag.id !== e.pointerId) return;
  if (drag.moved) suppressClickUntil = performance.now() + 350;
  if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
  drag = null;
  viewport.classList.remove('dragging');
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);
viewport.addEventListener('wheel', e => {
  if (!overview && e.target.closest('input,textarea,.demo-log,.discussion-board')) return;
  e.preventDefault();
  cancelAnimationFrame(animation);
  const scale = Math.min(2.5, Math.max(.05, camera.scale * Math.exp(-e.deltaY * .0015)));
  const ratio = scale / camera.scale;
  camera.x = e.clientX - (e.clientX - camera.x) * ratio;
  camera.y = e.clientY - (e.clientY - camera.y) * ratio;
  camera.scale = scale;
  paint();
}, {passive: false});
window.addEventListener('resize', () => overview ? showMap() : focusStation(current));

function renderToolbox(categoryName) {
  const category = categories.find(c => c[0] === categoryName);
  $('#toolbox-tools').innerHTML = `<div class="reference-grid visual-reference">${category[2].map(name => `<article>${visualFigure(name,true)}<div class="tool-card-header">${toolMark(name)}<h3>${name}</h3></div><p>${tools[name].what}</p><div><button data-tool="${name}">روش شروع و نمونه درخواست</button>${officialLink(name)}</div></article>`).join('')}</div>`;
  $$('[data-toolbox]').forEach(button => {
    const selected = button.dataset.toolbox === categoryName;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
$('#toolbox-filters').innerHTML = categories.map(c => `<button class="filter" data-toolbox="${c[0]}" aria-pressed="false">${c[0]}</button>`).join('');
renderToolbox('Claude');

function openTool(name) {
  const t = tools[name];
  $('#tool-detail').innerHTML = `<div class="eyebrow">QUICK REFERENCE / ${name}</div>${toolMark(name,true)}<h2>${name}</h2>${visualFigure(name,true)}<div class="detail-grid"><div class="card"><h3>قابلیت و کاربرد</h3><p>${t.what}<br>${t.when}</p></div><div class="card"><h3>روش شروع</h3><p>${t.start}</p></div></div><div class="mock-preview"><h3>نمونه درخواست قابل استفاده</h3><p style="margin:12px 0">${t.prompt}</p><button class="primary" data-copy-tool="${name}">کپی نمونه درخواست</button></div><a class="external-link" href="${t.url}" target="_blank" rel="noopener noreferrer">وب‌سایت رسمی ${name} ↗</a>`;
  if (!$('#tool-dialog').open) $('#tool-dialog').showModal();
}
$('.close-dialog').onclick = () => $('#tool-dialog').close();
$('#tool-dialog').addEventListener('click', e => {
  if (e.target !== $('#tool-dialog')) return;
  const rect = e.target.getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) e.target.close();
});
async function copyText(text, button) {
  let copied = false;
  try {
    if (navigator.clipboard) { await navigator.clipboard.writeText(text); copied = true; }
  } catch { /* file:// and embedded browsers may require the local fallback. */ }
  if (!copied) {
    const input = document.createElement('textarea');
    input.value = text;
    input.className = 'copy-fallback';
    const host = $('#tool-dialog').open ? $('#tool-dialog') : document.body;
    host.append(input);
    input.select();
    copied = document.execCommand('copy');
    if (copied) input.remove();
    else { input.classList.remove('copy-fallback'); input.readOnly = true; input.setAttribute('aria-label', 'متن نمونه برای کپی'); }
  }
  if (copied) button.focus({preventScroll:true});
  const oldLabel = button.textContent;
  button.textContent = copied ? '✓ کپی شد' : 'متن آماده انتخاب است';
  $('#announcement').textContent = button.textContent;
  setTimeout(() => { if (button.isConnected) button.textContent = oldLabel; }, 1800);
}

let demoStage = 0;
let demoPrompt = '';
function renderDemo(stage) {
  demoStage = stage;
  const topic = $('#demo-topic').value.trim() || 'صفحه معرفی بوت‌کمپ کوئرا';
  const prompts = [
    `«${topic}» را از brief.md و assets/ بساز. تحویل: index.html محلی، راست‌به‌چپ و قابل نمایش روی موبایل. ابتدا برنامه کوتاه بده، سپس فایل را بساز، در مرورگر بررسی کن و نتیجه را گزارش کن.`,
    `برای همان task، brief.md و assets/ را بخوان. اطلاعات محصول و تصاویر قابل استفاده را شناسایی کن؛ ابهام مؤثر بر اجرا را بپرس.`,
    `برنامه ساخت همان صفحه را ارائه بده: بخش‌ها، فایل‌های خروجی و روش بررسی. هدف اولیه ثابت است.`,
    `برنامه را اجرا کن. index.html و فایل‌های لازم را در پوشه پروژه بساز؛ اطلاعات محصول را از بریف بگیر.`,
    `صفحه ساخته‌شده را باز کن. راست‌به‌چپ بودن، تصاویر و نمایش موبایل را بررسی و مشکلات پیدا‌شده را اصلاح کن.`,
    `برای «${topic}»، مسیر فایل‌های نهایی، نتیجه بررسی‌ها و موارد حل‌نشده را گزارش کن تا صفحه را بازبینی کنم.`
  ];
  demoPrompt = prompts[stage];
  const outputs = [
    'هدف ثبت‌شده: ساخت صفحه محلی؛ پایان کار یعنی فایل آماده و نمایش بررسی‌شده.',
    'Agent با ابزار فایل، بریف و دارایی‌ها را بررسی می‌کند؛ کمبودها را مشخص می‌کند.',
    'برنامه کوتاه: ساخت بخش معرفی و CTA، استفاده از تصاویر موجود و بررسی دو اندازه صفحه.',
    'Agent فایل‌های صفحه را می‌نویسد؛ خروجی دیگر فقط پیشنهاد متن یا کد در چت نیست.',
    'Agent صفحه را در مرورگر می‌بیند؛ ایراد قابل مشاهده را اصلاح می‌کند و بررسی را تکرار می‌کند.',
    'تحویل مورد انتظار: index.html، فایل‌های محلی و گزارش بررسی؛ شما فایل را باز و نتیجه را تأیید یا اصلاح می‌کنید.'
  ];
  $('#demo-log').innerHTML = `<div class="mock-label">OFFLINE EXAMPLE / ${stage+1} OF ${workflow.length}</div><h3 class="accent" style="margin:18px 0 9px">${workflow[stage][0]} · ${workflow[stage][1]}</h3><h4>نمونه ورودی</h4><p class="demo-prompt">${escapeHTML(demoPrompt)}</p><h4>خروجی مورد انتظار</h4><p class="demo-output">${outputs[stage]}</p><button data-copy-demo>کپی نمونه درخواست</button><p class="section-note">این صفحه مسیر استفاده را نشان می‌دهد؛ خروجی واقعی باید در ابزار مربوط ساخته شود.</p>`;
  $$('[data-demo-stage]').forEach(button => {
    const active = Number(button.dataset.demoStage) === stage;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}
$('#demo-topic').addEventListener('input', () => renderDemo(demoStage));
renderDemo(0);

// Capture phase ensures overview selection wins over all nested interactions.
document.addEventListener('click', e => {
  const station = e.target.closest('[data-station]');
  if (e.target.closest('#viewport') && performance.now() < suppressClickUntil) {
    e.preventDefault(); e.stopPropagation(); return;
  }
  if (overview && station) {
    e.preventDefault(); e.stopPropagation();
    focusStation(Number(station.dataset.station));
    return;
  }
  if (station && Number(station.dataset.station) !== current) {
    e.preventDefault(); e.stopPropagation();
    focusStation(Number(station.dataset.station));
    return;
  }
  const button = e.target.closest('button');
  if (!button) return;
  if (button.dataset.image) {
    const key=button.dataset.image, asset=visualAssets[key];
    $('#tool-detail').innerHTML=`<div class="eyebrow">IMAGE / ${escapeHTML(key)}</div><img class="expanded-real-image" src="assets/${asset[0]}" alt="${escapeHTML(asset[1])}"><p class="section-note">${asset[1]}</p>${asset[2]?`<a class="external-link" href="${asset[2]}" target="_blank" rel="noopener noreferrer">منبع تصویر ↗</a>`:''}`;
    if (!$('#tool-dialog').open) $('#tool-dialog').showModal();
  }
  if (button.hasAttribute('data-next')) focusStation(current + 1);
  if (button.hasAttribute('data-home')) showMap();
  if (button.dataset.tool) openTool(button.dataset.tool);
  if (button.dataset.toolbox) renderToolbox(button.dataset.toolbox);
  if (button.dataset.copyTool) copyText(tools[button.dataset.copyTool].prompt, button);
  if (button.hasAttribute('data-copy-demo')) copyText(demoPrompt, button);
  if (button.hasAttribute('data-demo-stage')) renderDemo(Number(button.dataset.demoStage));
}, true);

focusStation(0);
