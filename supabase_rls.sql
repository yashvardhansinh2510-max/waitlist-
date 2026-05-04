-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email into the waitlist
CREATE POLICY "Enable public insert for waitlist" ON "public"."waitlist"
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Deny all updates and deletes (Waitlist is append-only)
CREATE POLICY "Deny update for waitlist" ON "public"."waitlist"
FOR UPDATE TO anon USING (false);

CREATE POLICY "Deny delete for waitlist" ON "public"."waitlist"
FOR DELETE TO anon USING (false);

-- Allow authenticated users to see the count of signups
CREATE POLICY "Enable read for authenticated users" ON "public"."waitlist"
FOR SELECT 
TO authenticated 
USING (true);
