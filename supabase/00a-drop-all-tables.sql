-- ============================================
-- DROP ALL TABLES (USE WITH CAUTION!)
-- ============================================
-- This will DELETE ALL DATA and remove all tables
-- Only use this if you want to start completely fresh

-- Drop user tables first (they depend on others)
drop table if exists public.user_todos cascade;
drop table if exists public.user_scholarships cascade;
drop table if exists public.user_essays cascade;
drop table if exists public.user_applications cascade;

-- Drop reference data tables
drop table if exists public.school_deadlines cascade;
drop table if exists public.school_commonapp_profiles cascade;
drop table if exists public.schools cascade;
drop table if exists public.admission_cycles cascade;

-- Drop staging tables
drop table if exists public._deadlines_stage cascade;
drop table if exists public._profiles_stage cascade;
drop table if exists public._schools_stage cascade;

-- Drop functions
drop function if exists public.handle_updated_at() cascade;

select '✅ All tables dropped. You can now run 00-complete-schema.sql' as status;
