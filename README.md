<div align="center">

  [![ar](https://img.shields.io/badge/lang-ar-brightgreen.svg)](README.md)
  [![en](https://img.shields.io/badge/lang-en-red.svg)](README.en.md)

</div>

<h1 dir="rtl">إضافة باحث للمتصفح</h1>

<p dir="rtl">إضافة للمتصفح تنبهك إذا كان المقطع الذي تشاهده متاحًا على منصة باحث</p>

<h2 dir="rtl">المنصات المدعومة</h2>

<ul dir="rtl">
  <li>يوتيوب</li>
</ul>

<h2 dir="rtl">تثبيت الإضافة</h2>

<p dir="rtl">يمكن الحصول على الإضافة من متجر إضافات متصفح Google Chrome من <a href="https://chromewebstore.google.com/detail/ijdjnkiocmodojidknkpajajbpghhacl">هنا</a> أو من متجر إضافات متصفح FireFox من <a href="https://addons.mozilla.org/en-US/firefox/addon/baheth-%D8%A8%D8%A7%D8%AD%D8%AB">هنا</a>.<p>

<h2 dir="rtl">المساهمة في التطوير</h2>

<h3 dir="rtl">المتطلبات</h3>

<p dir="rtl">ستحتاج إلى تثبيت Node.js و Git ثم انتقل إلى المرحلة التالية.</p>

<h3 dir="rtl">تجهيز بيئة التطوير</h3>

<ul dir="rtl">
  <li>قم بعمل نسخة (Fork) من هذا المشروع في حسابك</li>
  <li>حمِّل المستودع على جهازك الشخصي، أو اكتب في الطرفية:</li>

  <pre dir="ltr">git clone https://github.com/USERNAME/baheth-extension.git</pre>

  <p dir="rtl">ملاحظة: استبدل <code>USERNAME</code> باسم المستخدم الخاص بك على GitHub.</p>

  <li>انتقل إلى مجلد <code>baheth-extension</code>:</li>
      
  <pre dir="ltr">cd baheth-extension</pre>
      
  <li>ثبت الحِزَم المطلوبة:</li>

  <pre dir="ltr">npm install</pre>

  <li>نفِّذ الأمر التالي في الطرفية:</li>

  <pre dir="ltr">npm run build:watch</pre>

  <li>ثبت الإضافة مؤقتاً في المتصفح للاختبار أثناء التطوير:
    <ul>
      <li>افتح المتصفح وانتقل إلى صفحة الإضافات: <code dir="ltr">chrome://extensions/</code></li>
      <li>فعّل خيار "وضع المطوّر" (Developer mode) الموجود في أعلى الصفحة</li>
      <li>انقر على زر "تحميل إضافة غير مضغوطة" (Load unpacked) الموجود في أعلى الصفحة</li>
      <li>في نافذة اختيار الملفات، انتقل إلى مجلد <code>baheth-extension</code> ثم اختر المجلد الفرعي <code>dist</code> واضغط على "تحديد" (Select Folder) أو "موافق" (OK)</li>
      <li>الآن ستجد أن الإضافة أصبحت موجودة في متصفحك</li>
    </ul>
  </li>
</ul>

<h3 dir="rtl">تعديل الشيفرة المصدرية</h3>

<p dir="rtl">بعد أن تمُرَّ على المرحلتين السابقتين، حان الوقت لتبدأ في البرمجة.</p>

<ul dir="rtl">
  <li>
    عدِّل ما تشاء في الشيفرة المصدرية للإضافة
    <p>ملاحظة: كلَّما عدَّلت أي شيء، افتح صفحة الإضافات في متصفحك واضغط على زر إعادة التحميل الموجود بجانب اسم الإضافة.</p>
  </li>
  <li>تأكَّد من عدم وجود أي أخطاء أو مشاكل قد تظهر بسبب تعديلاتك.</li>
  <li>ارفع التعديلات إلى نسختك من المستودع</li>
  <li>قم بعرض التعديلات التي عمِلت عليها في <a href="https://github.com/ieasybooks/baheth-extension/pulls">Pull Request</a> ثم انتظر الرد.</li>
</ul>

<h2 dir="rtl">الرخصة</h2>

<p dir="rtl">وقف لله تعالى.</p>
