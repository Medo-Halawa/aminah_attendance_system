// ============================================================
// دوال مشتركة تستخدمها كل ملفات الـ API
// ============================================================

export const NURSING_ROLES = ['تمريض داخلي', 'تمريض عمليات', 'تمريض حضانه'];

export function jsonResponse(obj, status){
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}

// تاريخ اليوم بتوقيت القاهرة، بصيغة dd/mm/yyyy
export function getCairoDateStr(){
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo', day: '2-digit', month: '2-digit', year: 'numeric'
  }).formatToParts(new Date());
  const d = parts.find(p => p.type === 'day').value;
  const m = parts.find(p => p.type === 'month').value;
  const y = parts.find(p => p.type === 'year').value;
  return `${d}/${m}/${y}`;
}

// الوقت الحالي بتوقيت القاهرة، بصيغة HH:MM (24 ساعة)
export function getCairoTimeStr(){
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  }).formatToParts(new Date());
  const h = parts.find(p => p.type === 'hour').value;
  const min = parts.find(p => p.type === 'minute').value;
  return `${h}:${min}`;
}

// تحديد الشيفت تلقائيًا حسب ساعة التسجيل بتوقيت القاهرة
// AB: 8:00 صباحًا - 8:00 مساءً  |  C: 8:00 مساءً - 8:00 صباحًا
// (نفس تسمية شيفتات التمريض، عشان يبقوا متسقين مع بعض)
export function computeAutoShift(){
  const hourStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo', hour: '2-digit', hourCycle: 'h23'
  }).format(new Date());
  const hour = Number(hourStr);
  if(hour >= 8 && hour < 20) return 'AB';
  return 'C';
}
