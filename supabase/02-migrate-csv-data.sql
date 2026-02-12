-- ============================================
-- MIGRATE DATA FROM STAGING TO FINAL TABLES
-- ============================================
-- This script transforms and loads data from staging tables
-- into the final normalized schema

-- Step 1: Migrate Schools
-- ============================================
insert into public.schools (school_key, school_name, school_type, country)
select
  school_key,
  school_name,
  coalesce(school_type, 'Coed') as school_type,
  coalesce(country, 'US') as country
from public._schools_stage
on conflict (school_key) do update set
  school_name = excluded.school_name,
  school_type = excluded.school_type,
  country = excluded.country;

-- Verify schools import
select
  count(*) as schools_imported,
  count(distinct school_type) as unique_school_types
from public.schools;

-- Step 2: Ensure admission cycle exists
-- ============================================
insert into public.admission_cycles (cycle_label, start_year, end_year)
values ('2025-26', 2025, 2026)
on conflict (cycle_label) do nothing;

-- Step 3: Migrate Profiles
-- ============================================
insert into public.school_commonapp_profiles (
  school_id,
  cycle_id,
  app_fee_usd_us,
  app_fee_usd_intl,
  personal_essay_required,
  c_and_g,
  portfolio,
  writing,
  test_policy,
  sat_act_tests_used,
  saves_forms,
  raw
)
select
  s.id as school_id,
  c.id as cycle_id,
  p.app_fee_usd_us,
  p.app_fee_usd_intl,
  p.personal_essay_required,
  p.c_and_g,
  case
    when lower(p.portfolio) = 'true' then true
    when lower(p.portfolio) = 'false' then false
    else null
  end as portfolio,
  p.writing,
  p.test_policy,
  p.sat_act_tests_used,
  case
    when lower(p.saves_forms) = 'true' then true
    when lower(p.saves_forms) = 'false' then false
    else null
  end as saves_forms,
  p.raw
from public._profiles_stage p
inner join public.schools s on s.school_key = p.school_key
inner join public.admission_cycles c on c.cycle_label = p.cycle_label
on conflict (school_id, cycle_id) do update set
  app_fee_usd_us = excluded.app_fee_usd_us,
  app_fee_usd_intl = excluded.app_fee_usd_intl,
  personal_essay_required = excluded.personal_essay_required,
  c_and_g = excluded.c_and_g,
  portfolio = excluded.portfolio,
  writing = excluded.writing,
  test_policy = excluded.test_policy,
  sat_act_tests_used = excluded.sat_act_tests_used,
  saves_forms = excluded.saves_forms,
  raw = excluded.raw;

-- Verify profiles import
select
  count(*) as profiles_imported,
  count(*) filter (where personal_essay_required = true) as schools_requiring_essay,
  round(avg(app_fee_usd_us), 2) as avg_us_fee,
  round(avg(app_fee_usd_intl), 2) as avg_intl_fee
from public.school_commonapp_profiles;

-- Step 4: Migrate Deadlines
-- ============================================
insert into public.school_deadlines (
  school_id,
  cycle_id,
  plan,
  deadline_date,
  is_rolling,
  raw_value,
  priority
)
select
  s.id as school_id,
  c.id as cycle_id,
  d.plan,
  d.deadline_date,
  coalesce(d.is_rolling, false) as is_rolling,
  d.raw_value,
  coalesce(d.priority, 1) as priority
from public._deadlines_stage d
inner join public.schools s on s.school_key = d.school_key
inner join public.admission_cycles c on c.cycle_label = d.cycle_label
on conflict (school_id, cycle_id, plan, priority) do update set
  deadline_date = excluded.deadline_date,
  is_rolling = excluded.is_rolling,
  raw_value = excluded.raw_value;

-- Verify deadlines import
select
  count(*) as deadlines_imported,
  count(*) filter (where is_rolling = true) as rolling_deadlines,
  count(*) filter (where plan = 'ED') as early_decision,
  count(*) filter (where plan = 'EA') as early_action,
  count(*) filter (where plan = 'RD') as regular_decision,
  count(distinct school_id) as schools_with_deadlines
from public.school_deadlines;

-- Step 5: Cleanup - Drop staging tables (optional)
-- ============================================
-- Uncomment these lines after verifying data looks good
-- drop table if exists public._schools_stage;
-- drop table if exists public._profiles_stage;
-- drop table if exists public._deadlines_stage;

select '✅ Migration completed successfully!' as status;
