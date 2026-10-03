'use strict';

Object.assign(visualAssets,{
 cycle:['agent-cycle.svg','نمودار چرخه اجرای Agent · طراحی برای این ارائه',''],
 connections:['tool-connections.svg','نقشه اتصال Agent به ابزارها · طراحی برای این ارائه',''],
 brief:['task-brief.svg','اجزای شرح کار · طراحی برای این ارائه','']
});

// Preserve the opening narrative while giving each explanatory slide a visual anchor.
const openingVisuals={
 'chatbot-vs-agent':'ChatGPT','agent-loop':'cycle','agent-types':'connections',
 'agent-brief':'brief','connect-sheets':'connections','connect-recipe':'connections',
 'connect-environments':'manager'
};
Object.entries(openingVisuals).forEach(([id,key])=>{
 const slide=slides.find(s=>s.id===id),render=slide.render;
 slide.render=()=>{
  const html=render(),start=html.indexOf('<div class="focus-grid">');
  const boundary=html.indexOf('<div class="focus-note">');
  const ornament=html.indexOf('<div class="motion-ornament"');
  const end=boundary>=0?boundary:ornament>=0?ornament:html.length;
  return html.slice(0,start)+`<div class="visual-layout"><div class="visual-copy">${html.slice(start,end)}</div><div class="visual-stage">${visualFigure(key)}</div></div>`+html.slice(end);
 };
});

function toolDetail(id,title,image,lead,items,note) {
 const slide=illustratedCase(id,title,image,lead,items,note);
 slide.kicker='TOOLS IN PRACTICE / WHAT · CONNECT · DO';
 return slide;
}
const refreshedDetails=[
 toolDetail('claude','Claude؛ میز کار برای منابع و خروجی.','Claude','وقتی چند سند و یادداشت داری و می‌خواهی از آن‌ها یک خروجی منسجم بسازی.',[
  ['PROJECTS','منابع یک موضوع، کنار هم','بریف، لحن و اسناد را در Project نگه دار تا لازم نباشد هر گفتگو را از صفر شروع کنی.'],
  ['ARTIFACTS','خروجی را جلوی چشم اصلاح کن','سند یا نمونه تعاملی را در فضای مستقل بساز؛ بخش مشخص را بازنویسی یا تکمیل کن.'],
  ['CONNECT','منابع را وارد محیط کن','فایل اضافه کن؛ برای سرویس‌های آنلاین، اتصال‌های پشتیبانی‌شده حساب را تنظیم کن. ابزار و دسترسی هر اتصال جداست.'],
  ['DO','چرا خرید نیمه‌کاره می‌ماند؟','تیکت و مصاحبه کالج را کنار مسیر خرید بگذار؛ مسئله‌های تکراری را با شاهد و پیشنهاد اصلاح استخراج کن.']
 ],'کالج: «این تیکت‌ها و مصاحبه‌ها را بخوان؛ سه مانع اصلی خرید را با نقل‌قول پیدا کن. برای هرکدام فرضیه، اصلاح پیشنهادی و معیار سنجش بده؛ در یک بریف محصول جمع‌بندی کن.»'),
 toolDetail('claude-code','Claude Code؛ کار را داخل پوشه انجام بده.','Claude Code','پوشه ورودی و نتیجه نهایی را مشخص کن؛ Agent فایل می‌خواند، می‌نویسد و فرمان اجرا می‌کند.',[
  ['OPEN','پوشه پروژه را باز کن','در محیط رسمی Claude Code روی پوشه کار کن؛ راهنمای ثابت پروژه را در CLAUDE.md قرار بده.'],
  ['TOOLS','فایل + ترمینال + MCP','برای فایل محلی اتصال دیگری لازم نیست؛ سرویس‌هایی مثل Sheets به MCP سازگار یا اسکریپت API نیاز دارند.'],
  ['DO','ثبت‌نام دوباره را ریشه‌یابی کن','کاربر فرم مشاوره بوت‌کمپ را دوبار می‌فرستد؛ مسیر UI و درخواست شبکه را پیدا و باگ را اصلاح کن.'],
  ['CHECK','خروجی ساخته‌شده را بررسی کن','تعداد ردیف‌ها را تطبیق بده، فایل را باز کن یا تست مرتبط را اجرا کن؛ گزارش تغییرات بگیر.']
 ],'بوت‌کمپ: «در پروژه نمونه، دوبار کلیک روی فرم مشاوره دو درخواست می‌سازد. علت را پیدا کن؛ ارسال تکراری را رفع کن؛ خطا و تلاش مجدد را حفظ و بررسی کن؛ diff و نتیجه را تحویل بده.»'),
 toolDetail('gpt','ChatGPT؛ حالت کار را درست انتخاب کن.','ChatGPT','یک محیط، چند مسیر: پاسخ سریع، تحقیق، محاسبه و اجرای کار با ابزارهای فعال.',[
  ['SEARCH / RESEARCH','وب را برایت بررسی کند','Search برای پاسخ کوتاه با منبع؛ Deep Research برای جستجو و ترکیب منابع در یک گزارش.'],
  ['DATA','فایل را واقعاً محاسبه کند','CSV یا فایل پشتیبانی‌شده را اضافه کن؛ محاسبه، جدول و نمودار را با فرمول و داده بررسی کن.'],
  ['AGENT / APPS','دسترسی محیط را ببین','در صورت دسترسی، حالت Agent و Apps را بررسی کن؛ قابلیت خواندن، اقدام و نوشتن به ابزار فعال بستگی دارد.'],
  ['DO','دو گزارش متناقض را تطبیق بده','گزارش هزینه تبلیغات و خرید کالج را با تعریف مشترک کانال و بازه زمانی کنار هم بگذار؛ اختلاف را مشخص کن.']
 ],'کالج: «فایل تبلیغات و خرید را تطبیق بده؛ نام کانال‌ها را یکسان کن؛ هزینه هر خرید را حساب کن. ردیف‌های بدون تطبیق را جدا بده و مشخص کن تصمیم بودجه کجا هنوز داده کم دارد.»'),
 toolDetail('codex','Codex؛ یک task، فایل‌ها و نتیجه اجرا.','Codex','برای ساخت، اصلاح و اجرای کار روی پروژه؛ لازم نیست هر قطعه کد را از چت کپی کنی.',[
  ['OPEN','محیط پروژه را انتخاب کن','در CLI، IDE یا محیط رسمی مربوط، پروژه را در دسترس قرار بده؛ دسترسی‌ها بین محیط‌ها متفاوت‌اند.'],
  ['CONNECT','ابزار سرویس را اضافه کن','در محیط پشتیبانی‌شده MCP را تنظیم کن؛ یا اسکریپت API را با دسترسی لازم در پروژه اجرا کن.'],
  ['DO','ابزار ورود گروهی شرکت‌کننده بساز','در پنل نمونه مسابقه، CSV را قبل از ثبت نهایی اعتبارسنجی کن؛ خطای هر ردیف قابل مشاهده باشد.'],
  ['DELIVER','فایل و بررسی، کنار هم','خروجی، diff یا گزارش اجرا را بگیر؛ موردی که اجرا نشده باید مشخص باشد.']
 ],'کانتست: «در پنل نمونه، ورود CSV شرکت‌کنندگان را اضافه کن؛ ایمیل نامعتبر و ردیف تکراری را علامت بزن؛ پیش‌نمایش قبل از ثبت بساز؛ بررسی‌های مرتبط را اجرا و تغییرها را گزارش کن.»'),
 toolDetail('gemini','Gemini؛ تحقیق، رسانه و کار کنار گوگل.','Gemini','برای کار با منابع متنی و تصویری، تحقیق و قابلیت‌های فعال Workspace.',[
  ['RESEARCH','از سؤال به گزارش مستند','Deep Research برای بررسی منابع و ساخت گزارش؛ هدف و محدوده مقایسه را بده.'],
  ['GEMS / CANVAS','دستور ثابت و فضای خروجی','Gems برای کار تکراری با دستور مشخص؛ Canvas برای ساخت و اصلاح سند یا نمونه کد.'],
  ['WORKSPACE','داخل محیط کار خودت','اگر Gemini در Sheets یا Docs فعال است، از قابلیت‌های همان محیط استفاده کن؛ دسترسی اپ Gemini جداست.'],
  ['DO','کمپین برای انتشار آماده است؟','بریف، دارایی‌های Drive و تقویم شیت را کنار هم بررسی کن؛ محتوای ناقص و تاریخ ناسازگار را پیدا کن.']
 ],'بوت‌کمپ: «از بریف و منابع قابل دسترس، چک‌لیست آمادگی کمپین بساز؛ کدام پست عکس، لینک یا متن نهایی ندارد؟ تاریخ‌های ناسازگار را نشان بده و جدول اقدام با مسئول درج‌شده در منابع بده.»'),
 toolDetail('google-knowledge','NotebookLM؛ سؤال از منابع خودت.','NotebookLM','وقتی جواب باید از سندها و منابع منتخب بیاید، نه صرفاً دانش عمومی مدل.',[
  ['ADD SOURCES','منابع را انتخاب کن','اسناد، لینک‌ها و انواع منابع پشتیبانی‌شده را به notebook اضافه کن؛ وضعیت واردشدن را بررسی کن.'],
  ['ASK','با ارجاع جواب بگیر','سؤال درباره اختلاف سندها، قوانین یا نکات مشترک بپرس؛ ارجاع را برای دیدن شاهد باز کن.'],
  ['DO','پاسخ مشاوره را مستند کن','سرفصل، پیش‌نیاز و FAQ بوت‌کمپ را منبع کن؛ پاسخ مناسب به شرایط هر متقاضی را با شاهد آماده کن.'],
  ['ROLE','نقش آن در جریان کار','خروجی مستند را به مرحله بعد بده؛ برای ویرایش شیت یا مدیریت ایمیل از Agent دارای ابزار آن سرویس استفاده کن.']
 ],'بوت‌کمپ: «برای تازه‌کار، دانشجوی آشنا با مبانی و شاغل با وقت محدود، پیش‌نیاز و زمان لازم را از منابع استخراج کن؛ پاسخ مشاوره با ارجاع بده؛ درباره استخدام وعده خارج از منبع نساز.»'),
 toolDetail('antigravity','Antigravity؛ بساز و نتیجه را ببین.','Antigravity','برای خروجی‌هایی که باید اجرا شوند و در مرورگر قابل مشاهده باشند.',[
  ['PROJECT','پوشه و دارایی‌ها را بده','بریف، تصاویر و پروژه موجود را آماده کن؛ رفتار مطلوب و خروجی را مشخص کن.'],
  ['TOOLS','ویرایشگر، ترمینال و مرورگر','Agent فایل تغییر می‌دهد، برنامه را اجرا می‌کند و در صورت دسترسی، نتیجه را در مرورگر بررسی می‌کند.'],
  ['CONNECT','سرویس خارجی هم ابزار می‌خواهد','اتصال‌های پشتیبانی‌شده محیط یا اسکریپت API را تنظیم کن؛ مرورگر به‌تنهایی اتصال Sheets نیست.'],
  ['DO','اصلاح فرم را قابل دیدن کن','در لندینگ نمونه کالج، فرم طولانی را به دو مرحله تبدیل کن؛ حفظ داده و رفتار خطا را در مرورگر ببین.']
 ],'کالج: «در لندینگ نمونه، فرم را دو مرحله‌ای کن؛ برگشت به مرحله قبل داده را پاک نکند. حالت خطا را با پاسخ mock بررسی کن؛ روی موبایل اجرا و قبل/بعد را با اسکرین‌شات تحویل بده.»')
];
const queraToolProducts={claude:'کالج · علت رهاکردن خرید','claude-code':'بوت‌کمپ · رفع ثبت‌نام تکراری',gpt:'کالج · تطبیق تبلیغات و خرید',codex:'کانتست · ورود گروهی شرکت‌کنندگان',gemini:'بوت‌کمپ · آمادگی کمپین','google-knowledge':'بوت‌کمپ · مشاوره مستند',antigravity:'کالج · فرم دو مرحله‌ای'};
refreshedDetails.forEach(slide=>{
 const render=slide.render;
 slide.kicker=`QUERA / ${queraToolProducts[slide.id]}`;
 slide.render=()=>render().replace('<div class="focus-note">','<div class="focus-note quera-example">');
 Object.assign(slides.find(s=>s.id===slide.id),slide);
});

// The examples show a concrete handoff rather than repeating tool capabilities.
const deliveryPreviews={
 'case-travel':['TRIP PLAN',['روز اول · مسیر رسیدن و اقامت','روز دوم · دیدنی‌ها و زمان رفت‌وآمد','روز سوم · برنامه سبک و برگشت'],'plan.md + budget.csv + calendar.ics'],
 'case-inbox':['INBOX DIGEST',['نیازمند پاسخ · لینک ایمیل + موعد','جلسه‌ها · زمان + موارد نامشخص','پیش‌نویس‌ها · آماده بازبینی'],'action-list + email drafts'],
 'case-files':['ORGANIZED DOWNLOADS',['Receipts/ · رسیدها','Documents/ · سندها','Photos/ · تصاویر'],'manifest.csv + duplicates.csv'],
 'case-shopping':['SHORTLIST',['گزینه A · مناسب حمل روزانه','گزینه B · مناسب پردازش سنگین','گزینه C · اقتصادی‌تر'],'comparison.csv + source links'],
 'case-weekly-report':['WEEKLY REPORT',['کانال · هزینه · تعداد ثبت‌نام','هزینه هر ثبت‌نام · فرمول محاسبه','تغییر هفتگی · موارد نیازمند بررسی'],'Weekly report tab / report.csv'],
 'case-content':['CONTENT PACK',['carousel/ · شش صفحه HTML','captions.md · متن هر پست','content-plan.csv · تاریخ و کانال'],'files + schedule + review notes'],
 'case-build':['LOCAL PREVIEW',['معرفی · پیام و تصویر اصلی','قوانین · اطلاعات تأییدشده','ثبت‌نام · لینک و مسیر مشخص'],'index.html + assets/ + checks']
};
everydayCases.forEach(original=>{
 const slide=slides.find(s=>s.id===original.id),render=slide.render,preview=deliveryPreviews[slide.id];
 slide.render=()=>render().replace('class="visual-layout"','class="visual-layout illustrated-delivery"').replace(/<div class="floating-label">[\s\S]*?<\/div>/,`<div class="delivery-preview"><span>ساختار خروجی پیشنهادی · ${preview[0]}</span>${preview[1].map(s=>`<div>${s}</div>`).join('')}<code>${preview[2]}</code></div>`);
});
const queraCaseTitles={
 'case-weekly-report':['کالج کوئرا؛ گزارش کمپین از شیت.','گزارش دوشنبه را از Google Sheets بساز.'],
 'case-content':['بوت‌کمپ کوئرا؛ بسته محتوای سوشال.','از یک بریف، بسته محتوای آماده بساز.'],
 'case-build':['کانتست کوئرا؛ صفحه معرفی مسابقه.','ایده را به یک صفحه قابل دیدن تبدیل کن.']
};
Object.entries(queraCaseTitles).forEach(([id,[title,previousTitle]])=>{
 const slide=slides.find(s=>s.id===id),render=slide.render;
 slide.title=title;slide.kicker='QUERA / PRACTICAL SCENARIO';
 slide.render=()=>render().replace(previousTitle,title);
});
const surfaces=slides.find(s=>s.id==='antigravity-surfaces'),surfacesRender=surfaces.render;
surfaces.title='کار Agent را از سه زاویه ببین.';
surfaces.render=()=>surfacesRender().replace('کد، مدیریت Agent و مرورگر.','کار Agent را از سه زاویه ببین.').replace('سه اسکرین‌شات از محیط واقعی؛ مسیر نمونه برای لندینگ بوت‌کمپ.','در Editor تغییر را ببین، در Manager روند اجرا را دنبال کن، در Browser نتیجه را بررسی کن.');
const finalDemo=slides.find(s=>s.id==='demo'),finalDemoRender=finalDemo.render;
finalDemo.title='یک اجرا را قدم‌به‌قدم ببینیم.';
finalDemo.render=()=>finalDemoRender().replace('یک درخواست؛ چند قدم اجرای Agent.','یک اجرا را قدم‌به‌قدم ببینیم.').replace('نمایش آموزشی آفلاین: ساخت یک صفحه محلی از بریف؛ مراحل زیر اجرای واقعی AI نیستند.','با کلیک روی مراحل، از هدف تا تحویل یک صفحه پیش برویم؛ این نمایش آموزشی آفلاین است.');

const closing=slides.find(s=>s.id==='closing');
closing.title='ممنون که همراه بودید!';
closing.kicker='AI CLUB / QUERA · LET’S TALK';
closing.render=()=>`<div class="closing-conversation"><div><div class="eyebrow">AI CLUB / QUERA</div><h2>ممنون که<br><span class="accent">همراه بودید!</span></h2><p>حالا شما هم بیاید از تجربه‌هاتون<br>با AI و کارهای Agentic بگید.</p><div class="conversation-cues"><span>چی امتحان کردید؟</span><span>کجا به کارتون اومد؟</span><span>چه چیزی غافلگیرتون کرد؟</span></div><div class="closing-signature">تجربه‌های کوچک هم ارزش شنیدن دارند.</div></div><div class="closing-photo closing-brand"><img src="assets/quera-logo.svg" alt="لوگوی کوئرا"><span>از هم یاد بگیریم.</span></div></div>${motionOrnament(4)}`;
