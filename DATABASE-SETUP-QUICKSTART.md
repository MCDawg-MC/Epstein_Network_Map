# Database Setup - Quick Start

Fast reference for setting up your Supabase database with CSV data.

## Prerequisites

✅ CSV files ready:
- `schools.csv`
- `profiles.csv`
- `deadlines_fixed.csv` ← Use the FIXED version!

## Quick Steps

### 1. Run SQL Scripts in Supabase SQL Editor

In order, copy-paste and run:

```bash
1. supabase/00-complete-schema.sql      # Creates all tables
2. supabase/01-create-staging-tables.sql # Creates import tables
```

### 2. Import CSVs via Supabase Dashboard

**Table Editor → Insert → Import CSV:**

| Table | CSV File | Rows |
|-------|----------|------|
| `_schools_stage` | `schools.csv` | ~1,106 |
| `_profiles_stage` | `profiles.csv` | ~1,108 |
| `_deadlines_stage` | `deadlines_fixed.csv` | ~1,993 |

⚠️ **Important**: Use `deadlines_fixed.csv`, not `deadlines.csv`!

### 3. Migrate & Secure

```bash
3. supabase/02-migrate-csv-data.sql     # Transform and load data
4. supabase/03-row-level-security.sql   # Enable security policies
```

### 4. Verify

Run in SQL Editor:

```sql
-- Check counts
select 'schools' as table_name, count(*) from schools
union all
select 'profiles', count(*) from school_commonapp_profiles
union all
select 'deadlines', count(*) from school_deadlines;
```

Expected:
- schools: 1,106
- profiles: 1,108
- deadlines: 1,993

## Common Issues

| Error | Fix |
|-------|-----|
| Duplicate key error | Use `deadlines_fixed.csv` |
| Foreign key violation | Import in order: schools → profiles → deadlines |
| No data after migration | Check staging tables have data first |

## File Location

All SQL files are in: `college-tracker/supabase/`

## Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

**Total time**: ~10-15 minutes

See `supabase/README.md` for detailed instructions.
