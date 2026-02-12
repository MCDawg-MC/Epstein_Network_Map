-- ============================================
-- STAGING TABLES FOR CSV IMPORT
-- ============================================
-- These tables are temporary and match the CSV structure exactly
-- After importing CSVs here, we'll migrate to the final tables

-- Drop staging tables if they exist (for re-runs)
drop table if exists public._schools_stage cascade;
drop table if exists public._profiles_stage cascade;
drop table if exists public._deadlines_stage cascade;

-- 1) Schools staging (matches schools.csv)
create table public._schools_stage (
  school_key text,
  school_name text,
  school_type text,
  country text
);

-- 2) Profiles staging (matches profiles.csv)
create table public._profiles_stage (
  school_key text,
  cycle_label text,
  app_fee_usd_us numeric,
  app_fee_usd_intl numeric,
  personal_essay_required boolean,
  c_and_g text,
  portfolio text,
  writing text,
  test_policy text,
  sat_act_tests_used text,
  saves_forms text,
  raw jsonb
);

-- 3) Deadlines staging (matches deadlines_fixed.csv with priority)
create table public._deadlines_stage (
  school_key text,
  cycle_label text,
  plan text,
  deadline_date date,
  is_rolling boolean,
  raw_value text,
  priority int default 1
);

-- Success message
comment on table public._schools_stage is 'Staging table for schools.csv import';
comment on table public._profiles_stage is 'Staging table for profiles.csv import';
comment on table public._deadlines_stage is 'Staging table for deadlines_fixed.csv import';

select 'Staging tables created successfully!' as status;
