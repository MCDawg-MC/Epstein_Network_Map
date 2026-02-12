-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Ensures users can only access their own data

-- Enable RLS on all user tables
alter table public.user_applications enable row level security;
alter table public.user_essays enable row level security;
alter table public.user_scholarships enable row level security;
alter table public.user_todos enable row level security;

-- Reference tables are public (read-only for authenticated users)
alter table public.schools enable row level security;
alter table public.admission_cycles enable row level security;
alter table public.school_commonapp_profiles enable row level security;
alter table public.school_deadlines enable row level security;

-- ============================================
-- REFERENCE DATA POLICIES (Read-only for authenticated users)
-- ============================================

-- Schools - Anyone can read
create policy "Schools are viewable by authenticated users"
  on public.schools for select
  to authenticated
  using (true);

-- Admission cycles - Anyone can read
create policy "Admission cycles are viewable by authenticated users"
  on public.admission_cycles for select
  to authenticated
  using (true);

-- Profiles - Anyone can read
create policy "School profiles are viewable by authenticated users"
  on public.school_commonapp_profiles for select
  to authenticated
  using (true);

-- Deadlines - Anyone can read
create policy "School deadlines are viewable by authenticated users"
  on public.school_deadlines for select
  to authenticated
  using (true);

-- ============================================
-- USER DATA POLICIES (Users can only access their own data)
-- ============================================

-- User Applications
create policy "Users can view their own applications"
  on public.user_applications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.user_applications for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.user_applications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.user_applications for delete
  to authenticated
  using (auth.uid() = user_id);

-- User Essays
create policy "Users can view their own essays"
  on public.user_essays for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own essays"
  on public.user_essays for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own essays"
  on public.user_essays for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own essays"
  on public.user_essays for delete
  to authenticated
  using (auth.uid() = user_id);

-- User Scholarships
create policy "Users can view their own scholarships"
  on public.user_scholarships for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own scholarships"
  on public.user_scholarships for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own scholarships"
  on public.user_scholarships for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own scholarships"
  on public.user_scholarships for delete
  to authenticated
  using (auth.uid() = user_id);

-- User Todos
create policy "Users can view their own todos"
  on public.user_todos for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on public.user_todos for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on public.user_todos for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on public.user_todos for delete
  to authenticated
  using (auth.uid() = user_id);

select '✅ Row Level Security policies created successfully!' as status;
