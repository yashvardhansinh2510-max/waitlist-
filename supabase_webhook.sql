-- SQL to set up a Database Webhook for automated confirmation emails
-- This will trigger the Supabase Edge Function 'send-confirmation' 
-- every time a new row is inserted into the 'waitlist' table.

-- 1. Create a trigger that calls the edge function
CREATE OR REPLACE FUNCTION public.handle_new_waitlist_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- We use the built-in net.http_post to call the edge function
  -- Replace 'YOUR_PROJECT_REF' with your actual Supabase project ID
  -- Or better, if using Supabase Dash, just set up the Webhook in 'Database > Webhooks'
  
  -- NOTE: It's easier to set this up via the Supabase Dashboard UI:
  -- 1. Go to Database > Webhooks
  -- 2. Create a new Webhook:
  --    - Name: send_waitlist_email
  --    - Table: waitlist
  --    - Events: Insert
  --    - Type: HTTP Request
  --    - Method: POST
  --    - URL: https://xmleakoipfmkffungwln.supabase.co/functions/v1/send-confirmation
  --    - Headers: Authorization: Bearer YOUR_ANON_KEY
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- To actually run this via SQL, you'd need the pg_net extension enabled:
-- CREATE EXTENSION IF NOT EXISTS pg_net;
