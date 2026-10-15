# Anar Shah Survey

Simple survey website with admin panel.

## Setup

### 1. Supabase

1. supabase.com par account banayein
2. New project banayein
3. SQL Editor mein ye chalayein:

```sql
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_idea TEXT NOT NULL,
  missing_thing TEXT NOT NULL,
  improve_thing TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  phone TEXT,
  extra_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_policy" ON responses
FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "select_policy" ON responses
FOR SELECT TO service_role USING (true);