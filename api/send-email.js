export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Missing email' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  // Use verified domain email as fallback
  const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || 'yug@launchplan.dev';

  if (!RESEND_API_KEY) {
    console.error('ERROR: RESEND_API_KEY is not set in environment variables');
    return res.status(500).json({ 
      error: 'Email service not configured', 
      details: 'RESEND_API_KEY is missing' 
    });
  }

  console.log(`Attempting to send email to ${email} from ${FROM_ADDRESS}...`);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `LaunchPlan <${FROM_ADDRESS}>`,
        to: [email.trim()],
        subject: "You're on the LaunchPlan waitlist 🚀",
        html: `
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: #FAF5EE; padding: 40px 20px; min-height: 100vh;">
            <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.05);">
              <div style="background: #E84520; padding: 28px 40px;">
                <p style="margin: 0; font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.02em;">launchplan</p>
                <p style="margin: 4px 0 0; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7); letter-spacing: 0.1em; text-transform: uppercase;">plan · build · ship · scale</p>
              </div>
              <div style="padding: 40px;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #E84520; letter-spacing: 0.06em; text-transform: uppercase;">You're in</p>
                <h1 style="margin: 0 0 20px; font-size: 32px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.03em; line-height: 1.1;">Welcome to the<br/>Inner Circle.</h1>
                <p style="margin: 0 0 20px; font-size: 16px; color: #555; line-height: 1.7;">
                  You're now on the early access list for LaunchPlan — where we hand you validated, blueprinted startup ideas every Friday, ready to ship by Monday.
                </p>
                <p style="margin: 0 0 32px; font-size: 16px; color: #555; line-height: 1.7;">
                  We'll reach out as soon as we're ready to let you in. Until then, stay sharp.
                </p>
                <a href="https://launchplan.dev" style="display: inline-block; background: #E84520; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 100px; font-size: 14px; font-weight: 700; letter-spacing: 0.01em;">
                  Visit LaunchPlan →
                </a>
              </div>
              <div style="padding: 24px 40px; border-top: 1px solid rgba(0,0,0,0.06);">
                <p style="margin: 0; font-size: 12px; color: #bbb; letter-spacing: 0.05em;">launchplan.dev · You're receiving this because you joined our waitlist.</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend API Error:', JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        error: 'Resend API failed', 
        status: response.status,
        details: data 
      });
    }

    console.log(`Email sent successfully to ${email}`);
    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
