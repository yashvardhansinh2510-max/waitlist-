// Supabase Edge Function: send-confirmation
// Setup:
// 1. Install Supabase CLI
// 2. run: supabase functions new send-confirmation
// 3. run: supabase secrets set RESEND_API_KEY=your_key_here

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    console.log('Webhook Payload Received:', JSON.stringify(payload, null, 2))

    // Supabase Webhook payload has the new data in 'record'
    const record = payload?.record
    const userEmail = record?.email

    if (!userEmail) {
      console.error('No email found in payload.record:', record)
      return new Response(JSON.stringify({ error: 'No email found in payload' }), { status: 400 })
    }

    console.log(`Attempting to send confirmation to: ${userEmail}`)

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is missing')
      return new Response(JSON.stringify({ error: 'Resend API Key missing' }), { status: 500 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Waitlist <onboarding@resend.dev>', 
        to: [userEmail],
        subject: 'Welcome to the Inner Circle',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #E84520;">You're on the list!</h1>
            <p>Thanks for joining our waitlist. We're building the future of startup execution, and we're excited to have you with us.</p>
            <p>Stay tuned for updates on our upcoming launch.</p>
            <br/>
            <p>Best,<br/>The LaunchPlan Team</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    console.log('Resend API Response:', JSON.stringify(data, null, 2))

    if (!res.ok) {
      console.error('Resend API failed:', data)
      return new Response(JSON.stringify({ error: 'Resend API failed', details: data }), { status: 500 })
    }
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    console.error('Edge Function Fatal Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
