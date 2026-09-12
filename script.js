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
  document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
    el.placeholder = el.dataset[`${lang}Placeholder`];
  });
  populateGrade();
  populateSchedule();
}

langToggle.addEventListener('click', () => {
  const next = html.lang === 'ar' ? 'en' : 'ar';
  applyLang(next);
});

// ===== Booking form -> WhatsApp =====
const WHATSAPP_NUMBER = '201062704345';

const stageLabels = {
  primary: { ar: 'ابتدائي', en: 'Primary' },
  middle:  { ar: 'إعدادي', en: 'Middle school' },
  high:    { ar: 'ثانوي', en: 'High school' }
};

const modeLabels = {
  center1: { ar: 'في سنتر الإيمان', en: 'At El-Eman Center' },
  center2: { ar: 'في سنتر زهرة الفردوس', en: 'At Zahra EL-Ferdos Center' },
  center3: { ar: 'في مركز الهدى', en: 'At El-Huda Center' },
  online:  { ar: 'أونلاين', en: 'Online' },
  private: { ar: 'برايفت', en: 'Private' }
};

// المودز اللي الميعاد فيها بيتحدد من الطالب نفسه (مش من مواعيد ثابتة)
const studentPicksTimeModes = ['online', 'private'];

const gradesByStage = {
  primary: [
    { value: 'g1', ar: 'الأولى ابتدائي', en: '1st Primary' },
    { value: 'g2', ar: 'الثانية ابتدائي', en: '2nd Primary' },
    { value: 'g3', ar: 'الثالثة ابتدائي', en: '3rd Primary' },
    { value: 'g4', ar: 'الرابعة ابتدائي', en: '4th Primary' },
    { value: 'g5', ar: 'الخامسة ابتدائي', en: '5th Primary' },
    { value: 'g6', ar: 'السادسة ابتدائي', en: '6th Primary' }
  ],
  middle: [
    { value: 'g1', ar: 'الأولى إعدادي', en: '1st Middle' },
    { value: 'g2', ar: 'الثانية إعدادي', en: '2nd Middle' },
    { value: 'g3', ar: 'الثالثة إعدادي', en: '3rd Middle' }
  ],
  high: [
    { value: 'g1', ar: 'الأولى ثانوي', en: '1st Secondary' },
    { value: 'g2', ar: 'الثانية باكالوريا', en: '2nd Secondary Baccalaureate' },
    { value: 'g3', ar: 'الثالثة ثانوي', en: '3rd Secondary' }
  ]
};

// ====================================================
// مواعيد السناتر فقط (أونلاين وبرايفت الطالب بيكتب وقته بنفسه)
// كل موعد: { value: 'اسم-فريد', ar: 'النص بالعربي', en: 'النص بالإنجليزي' }
// ====================================================
const schedules = {

  // ---------- سنتر الإيمان (center1) ----------
  center1_primary_g6: [
    { value: 'sun-wed-530', ar: 'الأحد والأربعاء - 5:30', en: 'Sunday & Wednesday - 5:30' }
  ],
  center1_middle_g1: [
    { value: 'sun-wed-630', ar: 'الأحد والأربعاء - 6:30', en: 'Sunday & Wednesday - 6:30' }
  ],
  center1_middle_g2: [
    { value: 'sun-wed-430', ar: 'الأحد والأربعاء - 4:30', en: 'Sunday & Wednesday - 4:30' }
  ],
  center1_middle_g3: [
    { value: 'sun-wed-230', ar: 'الأحد والأربعاء - 2:30', en: 'Sunday & Wednesday - 2:30' }
  ],
  center1_high_g2: [
    { value: 'sun-wed-730', ar: 'الأحد والأربعاء - 7:30', en: 'Sunday & Wednesday - 7:30' }
  ],

  // ---------- سنتر زهرة الفردوس (center2) ----------
  center2_high_g1: [
    { value: 'sat-1130-tue-230', ar: 'السبت - 11:30 والثلاثاء - 2:30', en: 'Saturday - 11:30 & Tuesday - 2:30' }
  ],
  center2_high_g3: [
    { value: 'sat-tue-10-history', ar: 'السبت والثلاثاء - 10:00 (تاريخ)', en: 'Saturday & Tuesday - 10:00 (History)' },
    { value: 'sun-wed-11-geo', ar: 'الأحد والأربعاء - 11:00 (جغرافيا)', en: 'Sunday & Wednesday - 11:00 (Geography)' }
  ],

  // ---------- مركز الهدى (center3) ----------
  center3_middle_g1: [
    { value: 'mon-thu-5', ar: 'الاثنين والخميس - 5:00', en: 'Monday & Thursday - 5:00' }
  ],
  center3_middle_g2: [
    { value: 'mon-thu-6', ar: 'الاثنين والخميس - 6:00', en: 'Monday & Thursday - 6:00' }
  ],
  center3_middle_g3: [
    { value: 'mon-thu-7', ar: 'الاثنين والخميس - 7:00', en: 'Monday & Thursday - 7:00' }
  ]

};
// ====================================================

const form = document.getElementById('bookingForm');
const stageSelect = document.getElementById('stage');
const gradeSelect = document.getElementById('grade');
const modeSelect = document.getElementById('mode');
const scheduleSelect = document.getElementById('schedule');
const preferredTimeField = document.getElementById('preferredTimeField');
const preferredTimeInput = document.getElementById('preferredTime');

function populateGrade() {
  const isAr = html.lang === 'ar';
  const stageValue = stageSelect.value;

  gradeSelect.innerHTML = '';

  if (!stageValue || !gradesByStage[stageValue]) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = isAr ? 'اختر المرحلة أولاً' : 'Choose stage first';
    gradeSelect.appendChild(placeholder);
    gradeSelect.disabled = true;
    return;
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = isAr ? 'اختر السنة' : 'Choose year';
  gradeSelect.appendChild(placeholder);

  gradesByStage[stageValue].forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.value;
    opt.textContent = isAr ? g.ar : g.en;
    gradeSelect.appendChild(opt);
  });

  gradeSelect.disabled = false;
}

function populateSchedule() {
  const isAr = html.lang === 'ar';
  const stageValue = stageSelect.value;
  const gradeValue = gradeSelect.value;
  const modeValue = modeSelect.value;

  // البرايفت والأونلاين: الطالب بيكتب وقته بنفسه، مفيش select
  if (studentPicksTimeModes.includes(modeValue)) {
    scheduleSelect.style.display = 'none';
    scheduleSelect.required = false;
    scheduleSelect.disabled = true;
    preferredTimeField.style.display = '';
    preferredTimeInput.required = true;
    return;
  }

  scheduleSelect.style.display = '';
  scheduleSelect.required = true;
  preferredTimeField.style.display = 'none';
  preferredTimeInput.required = false;

  const key = (stageValue && gradeValue && modeValue) ? `${modeValue}_${stageValue}_${gradeValue}` : null;

  scheduleSelect.innerHTML = '';

  if (!key || !schedules[key] || schedules[key].length === 0) {
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = (!stageValue || !gradeValue || !modeValue)
      ? (isAr ? 'اختر المرحلة والسنة والنظام أولاً' : 'Choose stage, year and attendance type first')
      : (isAr ? 'لا توجد مواعيد متاحة حاليًا' : 'No time slots available yet');
    scheduleSelect.appendChild(placeholder);
    scheduleSelect.disabled = true;
    return;
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = isAr ? 'اختر الموعد' : 'Choose a time slot';
  scheduleSelect.appendChild(placeholder);

  schedules[key].forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot.value;
    opt.textContent = isAr ? slot.ar : slot.en;
    scheduleSelect.appendChild(opt);
  });

  scheduleSelect.disabled = false;
}

stageSelect.addEventListener('change', () => {
  populateGrade();
  populateSchedule();
});
gradeSelect.addEventListener('change', populateSchedule);
modeSelect.addEventListener('change', populateSchedule);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isAr = html.lang === 'ar';
  const data = Object.fromEntries(new FormData(form).entries());

  const stage = stageLabels[data.stage] ? stageLabels[data.stage][isAr ? 'ar' : 'en'] : data.stage;
  const mode = modeLabels[data.mode] ? modeLabels[data.mode][isAr ? 'ar' : 'en'] : data.mode;
  const gradeOption = gradeSelect.querySelector(`option[value="${data.grade}"]`);
  const grade = gradeOption ? gradeOption.textContent : data.grade;

  let schedule;
  if (studentPicksTimeModes.includes(data.mode)) {
    schedule = data.preferredTime;
  } else {
    const scheduleOption = scheduleSelect.querySelector(`option[value="${data.schedule}"]`);
    schedule = scheduleOption ? scheduleOption.textContent : data.schedule;
  }

  const lines = isAr
    ? [
        'مرحبًا مستر جلهوم، عايز أحجز مكان في كورس التاريخ.',
        `الاسم: ${data.name}`,
        `رقم الهاتف: ${data.phone}`,
        `المرحلة: ${stage}`,
        `السنة الدراسية: ${grade}`,
        `نظام الحضور: ${mode}`,
        `الموعد: ${schedule}`,
        data.notes ? `ملاحظات: ${data.notes}` : null
      ]
    : [
        "Hello Mr. Galhoum, I'd like to book a spot in the History course.",
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        `Stage: ${stage}`,
        `Year: ${grade}`,
        `Attendance type: ${mode}`,
        `Time slot: ${schedule}`,
        data.notes ? `Notes: ${data.notes}` : null
      ];

  const message = lines.filter(Boolean).join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
});