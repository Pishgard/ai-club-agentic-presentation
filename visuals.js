'use strict';

// Locally bundled photography and published product imagery; captions distinguish
// screenshots, promotional artwork, and the Quera examples used in this deck.
const visualAssets = {
  Claude: ['screenshots/claude-artifact-ui.png','نمای خروجی Claude · تصویر رسمی Artifacts','https://claude.com/features/artifacts'],
  'Claude Code': ['screenshots/claude-code-ui.webp','نمای ابزار Claude Code · تصویر رسمی','https://claude.com/product/claude-code'],
  ChatGPT: ['screenshots/chatgpt-ui.png','اسکرین‌شات ChatGPT · نمای آرشیوی ۲۰۲۴','https://commons.wikimedia.org/wiki/File:Chatgpt-screenshot.png'],
  Codex: ['screenshots/codex-demo.png','نمای دموی رسمی Codex · مستندات OpenAI','https://developers.openai.com/codex/'],
  Gemini: ['screenshots/gemini.png','اسکرین‌شات Gemini · Wikimedia Commons','https://commons.wikimedia.org/wiki/File:Google_Gemini_Screenshot_(2026).png'],
  Antigravity: ['screenshots/antigravity.png','اسکرین‌شات محیط Antigravity · Scalable Path','https://www.scalablepath.com/ai/google-antigravity-review'],
  Codera: ['codera-desktop.webp','اسکرین‌شات رسمی کدرا · کوئرا','https://quera.org/codera/'],
  OpenCode: ['screenshots/opencode.png','تصویر معرفی محیط OpenCode · رسمی','https://opencode.ai/'],
  NotebookLM: ['screenshots/notebooklm.png','NotebookLM · VanlindtMarc / CC BY-SA 4.0','https://commons.wikimedia.org/wiki/File:NotebookLM_Observatoire_AI_1.png'],
  college: ['screenshots/college-python.png','تصویر واقعی دوره پایتون · کوئرا کالج','https://quera.org/college/'],
  bootcamp: ['screenshots/bootcamp.jpg','عکس واقعی از آلبوم بوت‌کمپ کوئرا','https://quera.org/bootcamp/'],
  contest: ['screenshots/contest.png','تصویر معرفی برگزاری مسابقه · کوئرا','https://quera.org/contest/'],
  campaign: ['screenshots/claude.jpg','نمونه گزارش کمپین منتشرشده توسط Claude','https://claude.com/product/overview'],
  browser: ['screenshots/antigravity-browser.png','اسکرین‌شات مرورگر Antigravity · Scalable Path','https://www.scalablepath.com/ai/google-antigravity-review'],
  manager: ['screenshots/antigravity-manager.png','اسکرین‌شات Agent Manager · Scalable Path','https://www.scalablepath.com/ai/google-antigravity-review']
};
function visualFigure(key, compact = false) {
  const a = visualAssets[key];
  if (!a) return '';
  return `<figure class="real-visual ${compact?'compact':''}"><button class="visual-open" data-image="${key}" aria-label="بزرگ‌نمایی تصویر ${escapeHTML(key)}"><img src="assets/${a[0]}" alt="${escapeHTML(a[1])}" decoding="async"><span class="visual-zoom">${icon('fullscreen')}</span></button><figcaption><span>${a[1]}</span>${a[2]?`<a href="${a[2]}" target="_blank" rel="noopener noreferrer">منبع ↗</a>`:''}</figcaption></figure>`;
}
function motionOrnament(index) {
  const names = ['research','code','design','automation','agent'];
  return `<div class="motion-ornament" aria-hidden="true"><span class="motion-track"></span><span class="motion-token">${icon(names[index%names.length])}</span><span class="motion-dot"></span><span class="motion-spark">✦</span></div>`;
}

// Visual first introductions: a large image beside four short capability cards.
const sceneImages = {
  claude:'Claude','claude-sales':'contest','claude-code':'Claude Code',gpt:'ChatGPT',
  'gpt-social':'bootcamp',codex:'Codex',gemini:'Gemini','google-knowledge':'NotebookLM',
  antigravity:'Antigravity'
};
const exampleImages = {
  'claude-marketing':'college','claude-code-case':'Claude Code','gpt-data':'campaign',
  'codex-case':'contest','gemini-social':'bootcamp','antigravity-case':'browser'
};
slides.forEach((slide,index)=>{
  const render=slide.render;
  slide.render=()=>{
    let html=render();
    if (sceneImages[slide.id]) {
      const start=html.indexOf('<div class="focus-grid">');
      const note=html.indexOf('<div class="focus-note">');
      const end=note<0?html.length:note;
      html=html.slice(0,start)+`<div class="visual-layout"><div class="visual-copy">${html.slice(start,end)}</div><div class="visual-stage">${visualFigure(sceneImages[slide.id])}<div class="floating-label">${icon('sparkle')} ${slide.kicker.split('/').pop().trim()}</div></div></div>`+html.slice(end);
    }
    if (exampleImages[slide.id]) {
      html=html.replace('<span class="case-label">OUTPUT / خروجی مورد انتظار</span>',visualFigure(exampleImages[slide.id],true)+'<span class="case-label">OUTPUT / خروجی مورد انتظار</span>');
    }
    return html+motionOrnament(index);
  };
});

const productsSlide={id:'quera-products',title:'سه محصول؛ سه مسئله واقعی.',kicker:'QUERA / COLLEGE · BOOTCAMP · CONTEST',render:()=>`${heading('کالج، بوت‌کمپ و کانتست.','مثال‌های این جلسه، حول همین سه محصول و پنج تیم کوئرا هستند.')}<div class="product-gallery">${[
  ['college','کالج','تازه‌کار / تغییر مسیر / ارتقای مهارت','پیام سگمنت‌ها، قیف کمپین و تجربه ثبت‌نام.'],
  ['bootcamp','بوت‌کمپ','مهارت‌جو / متقاضی مشاوره','سوشال، پاسخ به پرسش‌ها و لندینگ مشاوره.'],
  ['contest','کانتست · مسابقات','شرکت‌کننده / دانشگاه / برگزارکننده','دعوت به مسابقه، پیشنهاد همکاری و پنل ثبت‌نام.']
].map(([key,title,segment,text])=>`<article>${visualFigure(key)}<h3>${title}</h3><strong>${segment}</strong><p>${text}</p></article>`).join('')}</div>${motionOrnament(2)}`};
slides.splice(2,0,productsSlide);
slides.splice(slides.findIndex(s=>s.id==='antigravity-case'),0,{
  id:'antigravity-surfaces',title:'Antigravity؛ سه نمای کار.',kicker:'ANTIGRAVITY / EDITOR · MANAGER · BROWSER',
  render:()=>`${heading('کد، مدیریت Agent و مرورگر.','سه اسکرین‌شات از محیط واقعی؛ مسیر نمونه برای لندینگ بوت‌کمپ.')}<div class="product-gallery">${[
    ['Antigravity','Editor','فایل‌ها، کد و گفتگو با Agent.'],['manager','Agent Manager','دیدن وظیفه‌ها و دنبال کردن روند اجرا.'],['browser','Browser','بررسی مسیر فرم و رفتار صفحه اجراشده.']
  ].map(([key,title,text])=>`<article>${visualFigure(key)}<h3>${title}</h3><p>${text}</p></article>`).join('')}</div>${motionOrnament(3)}`
});

// The short introductions also show the products themselves.
const other=slides.find(s=>s.id==='other-tools');
other.render=()=>`${heading('دو محیط دیگر برای کار روی پروژه.','معرفی کوتاه؛ انتخاب محیط به جریان کار و مدل‌های در دسترس تیم بستگی دارد.')}<div class="short-tool-gallery">${['Codera','OpenCode'].map(name=>`<article>${visualFigure(name)}<h3>${name}</h3><p>${tools[name].what}</p>${officialLink(name)}</article>`).join('')}</div>${motionOrnament(4)}`;
// A visual reference keeps secondary tools short and avoids a text-only catalog.
categories.splice(3,1,['سایر ابزارها','layers',['Codera','OpenCode']]);
const eco=slides.find(s=>s.id==='ecosystems');
eco.render=()=>`${heading('سه اکوسیستم، فراتر از صفحه چت.','مدل → محیط کار → ابزار اجرا؛ این سه لایه را جدا ببینیم.')}<div class="ecosystem-gallery">${[
 ['Claude','Anthropic','Claude → Projects / Artifacts → Claude Code'],
 ['ChatGPT','OpenAI','GPT → ChatGPT / Canvas → Codex'],
 ['Gemini','Google','Gemini → Gems / Workspace → Antigravity']
].map(([key,org,text])=>`<article>${visualFigure(key)}<span>${org}</span><h3>${key}</h3><p dir="ltr">${text}</p></article>`).join('')}</div>${motionOrnament(0)}`;
const cover=slides[0],coverRender=cover.render;
cover.render=()=>coverRender().replace(/<div class="universe-art"[\s\S]*?<span class="cover-note">/,`<div class="cover-photo-stack"><img src="assets/screenshots/bootcamp-team.jpg" alt="عکس واقعی آلبوم بوت‌کمپ کوئرا"><img src="assets/screenshots/antigravity.png" alt="اسکرین‌شات Antigravity"><span>COLLEGE · BOOTCAMP · CONTEST</span></div></div><span class="cover-note">`);
const agents=slides.find(s=>s.id==='agents'),agentsRender=agents.render;
agents.render=()=>agentsRender().replace('«ابزارهای مستندسازی را طبق معیارهای تیم مقایسه کن.»','«برای مسابقه کوئرا، مخاطب و پیام دعوت را بر اساس بریف بررسی کن.»').replace('Manus برای بعضی کارهای چندمرحله‌ای.','ابزارهای اجرا بسته به محیط انتخابی متفاوت‌اند.');
