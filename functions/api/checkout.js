import { jsonResponse, getCairoTimeStr } from '../_utils.js';

export async function onRequestPost(context){
  const { env, request } = context;
  let body;
  try{ body = await request.json(); }catch(err){ return jsonResponse({ error: 'بيانات غير صحيحة' }, 400); }

  const name = (body.name || '').trim();
  const lat = body.lat !== undefined ? body.lat : '';
  const lng = body.lng !== undefined ? body.lng : '';
  const distance = body.distance !== undefined ? Math.round(body.distance) : '';

  if(!name) return jsonResponse({ error: 'الاسم مطلوب' });

  try{
    // بندور على آخر صف مفتوح لنفس الموظف في أي تاريخ (مش بس النهارده)
    // عشان نغطي حالة إن الحضور كان يوم واتسجل الانصراف اليوم اللي بعده (شيفت 24 ساعة)
    const openRow = await env.DB.prepare(
      `SELECT id FROM attendance WHERE employee_name = ?
       AND (leaving_time IS NULL OR leaving_time = '') ORDER BY id DESC LIMIT 1`
    ).bind(name).first();

    if(!openRow){
      return jsonResponse({ error: name + ' لسه مسجلش حضور، لازم تسجل الحضور الأول' });
    }

    const nowTime = getCairoTimeStr();
    const location = (lat !== '' && lng !== '') ? `${lat},${lng}` : '';

    await env.DB.prepare(
      `UPDATE attendance SET leaving_time = ?, leaving_location = ?, leaving_distance = ?, status = ? WHERE id = ?`
    ).bind(nowTime, location, distance, 'منصرف', openRow.id).run();

    return jsonResponse({ success: true, time: nowTime });
  }catch(err){
    return jsonResponse({ error: 'تعذر الاتصال بقاعدة البيانات: ' + err.message }, 500);
  }
}
