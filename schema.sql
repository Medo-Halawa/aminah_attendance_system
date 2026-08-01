-- ============================================================
-- Schema لقاعدة بيانات نظام الحضور والانصراف (Cloudflare D1)
-- ------------------------------------------------------------
-- طريقة التنفيذ:
-- 1. من لوحة تحكم Cloudflare: Workers & Pages ← D1 ← أنشئ قاعدة بيانات جديدة (اسمها مثلاً attendance_db)
-- 2. افتح تاب "Console" في قاعدة البيانات، والصق كل الكود ده، ونفّذه (Execute)
--    أو عن طريق Wrangler CLI:
--    wrangler d1 execute attendance_db --file=./schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS employees (
  employee_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_name TEXT NOT NULL,
  job_title     TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  date                TEXT NOT NULL,
  employee_name       TEXT NOT NULL,
  job_title           TEXT,
  shift               TEXT,
  status              TEXT,
  attendance_time     TEXT,
  attendance_location TEXT,
  attendance_distance REAL,
  leaving_time        TEXT,
  leaving_location    TEXT,
  leaving_distance    REAL
);

-- فهرس بيسرّع البحث عن حالة موظف معين في يوم معين (بيتنفذ مع كل حضور/انصراف)
CREATE INDEX IF NOT EXISTS idx_attendance_date_name ON attendance (date, employee_name);

-- أمثلة لإضافة موظفين (اختياري - عدّل الأسماء والوظائف حسب مركزك، أو ضيفهم من الـ Console مباشرة)
-- INSERT INTO employees (employee_name, job_title) VALUES ('سارة أحمد', 'ريسيبشن');
-- INSERT INTO employees (employee_name, job_title) VALUES ('محمد سامي', 'تمريض داخلي');
