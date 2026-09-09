// ===== Language toggle (AR / EN) =====
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
  const next = html.lang === 'ar' ? 'en' : 'ar';
  applyLang(next);
});

// ===== Booking form -> WhatsApp =====
const WHATSAPP_NUMBER = '201062704345';

const stageLabels = {
  middle: { ar: 'إعدادي', en: 'Middle' },
  high:   { ar: 'ثانوي', en: 'High school' }
};
const modeLabels = {
  center:  { ar: 'في سنتر الإيمان', en: 'At El-Eman Center' },
  online:  { ar: 'أونلاين', en: 'Online' },
  private: { ar: 'برايفت', en: 'Private' }
};

const form = document.getElementById('bookingForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isAr = html.lang === 'ar';
  const data = Object.fromEntries(new FormData(form).entries());
  const stage = stageLabels[data.stage] ? stageLabels[data.stage][isAr ? 'ar' : 'en'] : data.stage;
  const mode = modeLabels[data.mode] ? modeLabels[data.mode][isAr ? 'ar' : 'en'] : data.mode;

  const lines = isAr
    ? [
        'مرحبًا مستر جلهوم، عايز أحجز مكان في كورس التاريخ.',
        `الاسم: ${data.name}`,
        `رقم الهاتف: ${data.phone}`,
        `المرحلة: ${stage}`,
        `نظام الحضور: ${mode}`,
        data.notes ? `ملاحظات: ${data.notes}` : null
      ]
    : [
        "Hello Mr. Galhoum, I'd like to book a spot in the History course.",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Stage: ${stage}`,
        `Attendance type: ${mode}`,
        data.notes ? `Notes: ${data.notes}` : null
      ];

  const message = lines.filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
});