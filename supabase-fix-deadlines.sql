-- Fix: Allow multiple deadlines per plan type
-- Drop the unique constraint and add a priority/sequence field

-- If table exists, drop the unique constraint
alter table if exists public.school_deadlines
  drop constraint if exists school_deadlines_school_id_cycle_id_plan_key;

-- Add a priority field to handle multiple deadlines of same type
alter table public.school_deadlines
  add column if not exists priority int default 1;

-- Add a label for deadline types (e.g., "Priority", "Regular", "Final")
alter table public.school_deadlines
  add column if not exists deadline_label text;

-- New unique constraint allowing multiple of same plan type
create unique index if not exists school_deadlines_unique_idx
  on public.school_deadlines (school_id, cycle_id, plan, priority);

-- Add helpful index
create index if not exists deadlines_date_idx
  on public.school_deadlines (deadline_date)
  where deadline_date is not null;
