import { jsonResponse } from '../_utils.js';

export async function onRequestGet(context){
  const { env } = context;
  try{
    const { results } = await env.DB.prepare(
      'SELECT employee_id, employee_name, job_title FROM employees ORDER BY employee_name'
    ).all();
    return jsonResponse({ employees: results });
  }catch(err){
    return jsonResponse({ error: 'تعذر الاتصال بقاعدة البيانات: ' + err.message }, 500);
  }
}
