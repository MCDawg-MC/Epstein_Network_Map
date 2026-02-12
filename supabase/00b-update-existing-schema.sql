-- ============================================
-- UPDATE EXISTING SCHEMA
-- ============================================
-- Safe to run - only adds missing columns/tables
-- Run this if you get "relation already exists" errors

-- Add priority column to deadlines if it doesn't exist
alter table public.school_deadlines
  add column if not exists priority int default 1;

-- Add deadline_label column if it doesn't exist
alter table public.school_deadlines
  add column if not exists deadline_label text;

-- Drop old unique constraint if it exists
alter table public.school_deadlines
  drop constraint if exists school_deadlines_school_id_cycle_id_plan_key;

-- Add new unique constraint with priority
drop index if exists school_deadlines_unique_idx;
create unique index if not exists school_deadlines_unique_idx
  on public.school_deadlines (school_id, cycle_id, plan, priority);

-- Add missing indexes
create index if not exists deadlines_date_idx
  on public.school_deadlines (deadline_date)
  where deadline_date is not null;

create index if not exists deadlines_rolling_idx
  on public.school_deadlines (is_rolling);

create index if not exists deadlines_school_idx
  on public.school_deadlines (school_id);

-- Create user tables if they don't exist
create table if not exists public.user_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,

  application_plan text,
  status text default 'not_started',
  submitted_date date,
  decision_date date,

  scholarship_offered numeric,
  financial_aid_offered numeric,

  notes text,
  priority text default 'medium',

  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique (user_id, school_id)
);

create table if not exists public.user_essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.user_applications(id) on delete cascade,

  title text not null,
  essay_type text,
  prompt text,
  content text,
  word_count int,
  word_limit int,

  is_common_app boolean default false,
  status text default 'draft',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

-- Add indexes for user tables
create index if not exists user_apps_user_idx on public.user_applications (user_id);
create index if not exists user_apps_status_idx on public.user_applications (status);
create index if not exists essays_user_idx on public.user_essays (user_id);
create index if not exists essays_app_idx on public.user_essays (application_id);
create index if not exists scholarships_user_idx on public.user_scholarships (user_id);
create index if not exists scholarships_deadline_idx on public.user_scholarships (deadline);
create index if not exists todos_user_idx on public.user_todos (user_id);
create index if not exists todos_completed_idx on public.user_todos (completed);

-- Add triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_user_applications on public.user_applications;
create trigger set_updated_at_user_applications
  before update on public.user_applications
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_user_essays on public.user_essays;
create trigger set_updated_at_user_essays
  before update on public.user_essays
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_user_scholarships on public.user_scholarships;
create trigger set_updated_at_user_scholarships
  before update on public.user_scholarships
  for each row execute function public.handle_updated_at();

drop trigger if exists set_updated_at_user_todos on public.user_todos;
create trigger set_updated_at_user_todos
  before update on public.user_todos
  for each row execute function public.handle_updated_at();

select '✅ Schema updated successfully!' as status;
