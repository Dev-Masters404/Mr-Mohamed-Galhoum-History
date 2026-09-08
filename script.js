// ===== Language Toggle (AR / EN) =====

const translatable = document.querySelectorAll('[data-ar][data-en]');
const langToggle = document.getElementById('langToggle');
const html = document.documentElement;

function applyLang(lang) {
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';

  translatable.forEach(el => {
    el.textContent = el.dataset[lang];
  });
}

langToggle.addEventListener('click', () => {
  const nextLang = html.lang === 'ar' ? 'en' : 'ar';
  applyLang(nextLang);
});


// ===== Booking → WhatsApp =====

const bookingForm = document.getElementById('bookingForm');

const WHATSAPP_NUMBER = '201062704345';

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // ===== Get Form Data =====

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  const stageSelect = document.getElementById('stage');
  const notes = document.getElementById('notes').value.trim();

  const stage =
    stageSelect.options[stageSelect.selectedIndex].text;


  // ===== Create Message =====

  const isArabic = html.lang === 'ar';

  let message;

  if (isArabic) {

    message =
`مرحبًا مستر جلهوم 👋

عايز أأكد حجز كورس التاريخ.

الاسم: ${name}
رقم الهاتف: ${phone}
المرحلة الدراسية: ${stage}
${notes ? `ملاحظات: ${notes}` : ''}`;

  } else {

    message =
`Hello Mr. Galhoum 👋

I'd like to confirm my booking for the History course.

Name: ${name}
Phone: ${phone}
School stage: ${stage}
${notes ? `Notes: ${notes}` : ''}`;

  }


  // ===== WhatsApp URL =====

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


  // ===== Open WhatsApp Automatically =====

  window.location.href = whatsappURL;
});


// ===== Initial Language =====

applyLang('ar');