-- ============================================
-- COMPLETE DATABASE SCHEMA
-- ============================================
-- Run this first to create all tables with proper structure

create extension if not exists pgcrypto;

-- ============================================
-- REFERENCE DATA TABLES
-- ============================================

-- 1) Schools (canonical reference table)
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  school_key text not null unique,
  school_name text not null,
  school_type text,
  country text not null default 'US',
  created_at timestamptz default now()
);

create index if not exists schools_name_idx on public.schools (school_name);
create index if not exists schools_key_idx on public.schools (school_key);

-- 2) Admission cycles
create table if not exists public.admission_cycles (
  id uuid primary key default gen_random_uuid(),
  cycle_label text not null unique,
  start_year int,
  end_year int,
  created_at timestamptz default now()
);

-- Insert default cycle
insert into public.admission_cycles (cycle_label, start_year, end_year)
values ('2025-26', 2025, 2026)
on conflict (cycle_label) do nothing;

-- 3) Common App profiles (fees + requirements per cycle)
create table if not exists public.school_commonapp_profiles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  cycle_id uuid not null references public.admission_cycles(id) on delete cascade,

  app_fee_usd_us numeric,
  app_fee_usd_intl numeric,

  personal_essay_required boolean,
  c_and_g text,
  portfolio boolean,
  writing text,
  test_policy text,
  sat_act_tests_used text,
  saves_forms boolean,

  source text default 'commonapp',
  raw jsonb,
  imported_at timestamptz default now(),

  unique (school_id, cycle_id)
);

create index if not exists profiles_school_idx on public.school_commonapp_profiles (school_id);
create index if not exists profiles_cycle_idx on public.school_commonapp_profiles (cycle_id);

-- 4) Deadlines (normalized) - FIXED to allow multiple deadlines per plan
create table if not exists public.school_deadlines (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  cycle_id uuid not null references public.admission_cycles(id) on delete cascade,

  plan text not null,
  deadline_date date,
  is_rolling boolean default false,
  raw_value text,
  priority int default 1,

  source text default 'commonapp',
  imported_at timestamptz default now(),

  unique (school_id, cycle_id, plan, priority)
);

create index if not exists deadlines_plan_idx on public.school_deadlines (plan);
create index if not exists deadlines_date_idx on public.school_deadlines (deadline_date) where deadline_date is not null;
create index if not exists deadlines_rolling_idx on public.school_deadlines (is_rolling);
create index if not exists deadlines_school_idx on public.school_deadlines (school_id);

-- ============================================
-- USER DATA TABLES
-- ============================================

-- 5) User tracked schools (applications)
create table if not exists public.user_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,

  -- Application details
  application_plan text, -- ED, EA, RD, etc.
  status text default 'not_started', -- not_started, in_progress, submitted, accepted, rejected, waitlisted, deferred
  submitted_date date,
  decision_date date,

  -- Financial
  scholarship_offered numeric,
  financial_aid_offered numeric,

  -- Custom fields
  notes text,
  priority text default 'medium', -- low, medium, high

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (user_id, school_id)
);

create index if not exists user_apps_user_idx on public.user_applications (user_id);
create index if not exists user_apps_status_idx on public.user_applications (status);
create index if not exists user_apps_plan_idx on public.user_applications (application_plan);

-- 6) User essays
create table if not exists public.user_essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.user_applications(id) on delete cascade,

  title text not null,
  essay_type text, -- Personal Statement, Supplemental, Why Us, etc.
  prompt text,
  content text,
  word_count int,
  word_limit int,

  is_common_app boolean default false,
  status text default 'draft', -- draft, in_review, final

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists essays_user_idx on public.user_essays (user_id);
create index if not exists essays_app_idx on public.user_essays (application_id);
create index if not exists essays_type_idx on public.user_essays (essay_type);

-- 7) User scholarships
create table if not exists public.user_scholarships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid references public.schools(id) on delete set null,

  scholarship_name text not null,
  amount numeric,
  deadline date,
  status text default 'not_started',

  requirements text,
  essay_required boolean default false,
  link text,
  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists scholarships_user_idx on public.user_scholarships (user_id);
create index if not exists scholarships_deadline_idx on public.user_scholarships (deadline);

-- 8) User todos
create table if not exists public.user_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.user_applications(id) on delete cascade,

  title text not null,
  description text,
  due_date date,
  completed boolean default false,
  priority text default 'medium',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists todos_user_idx on public.user_todos (user_id);
create index if not exists todos_completed_idx on public.user_todos (completed);
create index if not exists todos_due_date_idx on public.user_todos (due_date);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger set_updated_at_user_applications
  before update on public.user_applications
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_user_essays
  before update on public.user_essays
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_user_scholarships
  before update on public.user_scholarships
  for each row execute function public.handle_updated_at();

create trigger set_updated_at_user_todos
  before update on public.user_todos
  for each row execute function public.handle_updated_at();

select '✅ Schema created successfully!' as status;
