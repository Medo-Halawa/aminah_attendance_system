import { jsonResponse, getCairoDateStr } from '../_utils.js';

export async function onRequestGet(context){
  const { env } = context;
  try{
    const today = getCairoDateStr();
    const { results } = await env.DB.prepare(
      'SELECT * FROM attendance WHERE date = ? ORDER BY id DESC'
    ).bind(today).all();
    return jsonResponse({ rows: results });
  }catch(err){
    return jsonResponse({ error: 'تعذر الاتصال بقاعدة البيانات: ' + err.message }, 500);
  }
}
