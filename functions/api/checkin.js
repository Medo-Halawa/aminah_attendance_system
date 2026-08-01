import { jsonResponse, getCairoDateStr, getCairoTimeStr, computeAutoShift, NURSING_ROLES } from '../_utils.js';

export async function onRequestPost(context){
  const { env, request } = context;
  let body;
  try{ body = await request.json(); }catch(err){ return jsonResponse({ error: 'بيانات غير صحيحة' }, 400); }

  const name = (body.name || '').trim();
  const jobTitle = (body.job_title || '').trim();
  const manualShift = (body.shift || '').trim();
  const lat = body.lat !== undefined ? body.lat : '';
  const lng = body.lng !== undefined ? body.lng : '';
  const distance = body.distance !== undefined ? Math.round(body.distance) : '';

  if(!name) return jsonResponse({ error: 'الاسم مطلوب' });
  if(!jobTitle) return jsonResponse({ error: 'الوظيفة مطلوبة' });
  if(NURSING_ROLES.includes(jobTitle) && !manualShift){
    return jsonResponse({ error: 'لازم تحدد الشيفت (AB / C / ABC) لوظائف التمريض' });
  }

  try{
    const today = getCairoDateStr();

    // بندور على آخر صف مفتوح لنفس الموظف في أي تاريخ (مش بس النهارده)
    // عشان نغطي حالة إن حد فاضل شغال من يوم اللي قبله (شيفت ABC مثلاً)
    const openRow = await env.DB.prepare(
      `SELECT id FROM attendance WHERE employee_name = ?
       AND (leaving_time IS NULL OR leaving_time = '') ORDER BY id DESC LIMIT 1`
    ).bind(name).first();

    if(openRow){
      return jsonResponse({ error: name + ' مسجل حضور بالفعل ولسه محصلش انصراف' });
    }

    const nowTime = getCairoTimeStr();
    const shift = NURSING_ROLES.includes(jobTitle) ? manualShift : computeAutoShift();
    const location = (lat !== '' && lng !== '') ? `${lat},${lng}` : '';

    await env.DB.prepare(
      `INSERT INTO attendance
       (date, employee_name, job_title, shift, status, attendance_time, attendance_location, attendance_distance, leaving_time, leaving_location, leaving_distance)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', '', '')`
    ).bind(today, name, jobTitle, shift, 'حاضر', nowTime, location, distance).run();

    return jsonResponse({ success: true, time: nowTime, shift: shift });
  }catch(err){
    return jsonResponse({ error: 'تعذر الاتصال بقاعدة البيانات: ' + err.message }, 500);
  }
}
