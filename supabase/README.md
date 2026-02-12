# Supabase Database Setup Guide

Complete step-by-step guide to set up your College Tracker database and import CSV data.

## Overview

This setup includes:
- **Reference data**: Schools, deadlines, application requirements
- **User data**: Applications, essays, scholarships, todos
- **Row Level Security**: Users can only access their own data

## Files in This Directory

1. `00-complete-schema.sql` - Main database schema (run first)
2. `01-create-staging-tables.sql` - Temporary tables for CSV import
3. `02-migrate-csv-data.sql` - Transform and load CSV data
4. `03-row-level-security.sql` - Security policies

## Step-by-Step Instructions

### Step 1: Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Note your project credentials:
   - Project URL
   - Anon/Public key

### Step 2: Configure Environment Variables

Create `.env.local` in the `college-tracker/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Create Database Schema

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste `00-complete-schema.sql`
3. Click **Run**
4. ✅ Should see: "Schema created successfully!"

This creates all tables:
- `schools`
- `admission_cycles`
- `school_commonapp_profiles`
- `school_deadlines`
- `user_applications`
- `user_essays`
- `user_scholarships`
- `user_todos`

### Step 4: Create Staging Tables

1. In SQL Editor, run `01-create-staging-tables.sql`
2. ✅ Should see: "Staging tables created successfully!"

This creates temporary import tables:
- `_schools_stage`
- `_profiles_stage`
- `_deadlines_stage`

### Step 5: Import CSV Files

Now import your CSV files into the staging tables using Supabase Table Editor:

#### 5a. Import Schools

1. Go to **Table Editor** → `_schools_stage`
2. Click **Insert** → **Import data from CSV**
3. Select: `c:\Users\mitch\Downloads\College Application APP\schools.csv`
4. Map columns:
   - `school_key` → `school_key`
   - `school_name` → `school_name`
   - `school_type` → `school_type`
   - `country` → `country`
5. Click **Import**
6. ✅ Should import ~1,106 rows

#### 5b. Import Profiles

1. Go to **Table Editor** → `_profiles_stage`
2. Click **Insert** → **Import data from CSV**
3. Select: `c:\Users\mitch\Downloads\College Application APP\profiles.csv`
4. Map all columns to match
5. Click **Import**
6. ✅ Should import ~1,108 rows

#### 5c. Import Deadlines (FIXED VERSION)

1. Go to **Table Editor** → `_deadlines_stage`
2. Click **Insert** → **Import data from CSV**
3. Select: `c:\Users\mitch\Downloads\College Application APP\deadlines_fixed.csv` ⚠️ **Use the FIXED version!**
4. Map columns including the new `priority` column
5. Click **Import**
6. ✅ Should import ~1,993 rows

### Step 6: Migrate Data to Final Tables

1. In SQL Editor, run `02-migrate-csv-data.sql`
2. This will:
   - Transform data from staging tables
   - Load into final normalized tables
   - Show verification statistics
3. ✅ Check the output to verify counts

Expected output:
```
schools_imported: 1106
profiles_imported: 1108
deadlines_imported: 1993
```

### Step 7: Enable Row Level Security

1. In SQL Editor, run `03-row-level-security.sql`
2. ✅ Should see: "Row Level Security policies created successfully!"

This ensures:
- Reference data (schools, deadlines) is readable by all authenticated users
- User data (applications, essays) is private to each user

### Step 8: Clean Up (Optional)

After verifying data looks good, you can drop the staging tables:

```sql
drop table if exists public._schools_stage;
drop table if exists public._profiles_stage;
drop table if exists public._deadlines_stage;
```

## Verification Queries

Check your data with these queries:

```sql
-- Count schools
select count(*) from schools;

-- Count deadlines by type
select plan, count(*)
from school_deadlines
group by plan
order by count(*) desc;

-- Schools with multiple deadlines per plan type
select s.school_name, sd.plan, count(*)
from school_deadlines sd
join schools s on s.id = sd.school_id
group by s.school_name, sd.plan
having count(*) > 1;

-- Average application fees
select
  round(avg(app_fee_usd_us), 2) as avg_us_fee,
  round(avg(app_fee_usd_intl), 2) as avg_intl_fee,
  count(*) filter (where personal_essay_required = true) as schools_requiring_essay
from school_commonapp_profiles;

-- Earliest and latest deadlines
select
  min(deadline_date) as earliest,
  max(deadline_date) as latest
from school_deadlines
where is_rolling = false;
```

## Troubleshooting

### CSV Import Fails

**Problem**: "Duplicate key value violates unique constraint"
- **Solution**: Make sure you're using `deadlines_fixed.csv` (not `deadlines.csv`)

**Problem**: Date format not recognized
- **Solution**: Dates should be in format `MM/DD/YYYY` or `YYYY-MM-DD`

### Migration Fails

**Problem**: "Foreign key constraint violation"
- **Solution**: Ensure schools were imported into staging tables first

**Problem**: Some schools missing from final tables
- **Solution**: Check for mismatched `school_key` values between CSVs

### Need to Re-import

If you need to start over:

```sql
-- Clear all data
truncate table school_deadlines;
truncate table school_commonapp_profiles;
truncate table schools cascade;

-- Re-run migration script
-- (After re-importing CSVs into staging tables)
```

## Next Steps

After database setup is complete:

1. ✅ Test Supabase connection in your Next.js app
2. ✅ Build API routes for CRUD operations
3. ✅ Create UI components for school search
4. ✅ Implement authentication flow
5. ✅ Build dashboard, calendar, and search pages

## Need Help?

- Check Supabase logs: Dashboard → Logs
- Verify RLS policies: Dashboard → Authentication → Policies
- Test queries: SQL Editor

---

**Status**: Ready for Phase 3 - Building the Application! 🚀
