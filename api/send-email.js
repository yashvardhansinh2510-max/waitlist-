export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Missing email' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  // Use onboarding@resend.dev as fallback if domain is not verified
  const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || 'onboarding@resend.dev';

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
          <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF5EE; padding: 40px 20px; min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(232, 69, 32, 0.08); border: 1px solid rgba(232, 69, 32, 0.05);">
              
              <!-- Logo Header -->
              <div style="background-color: #ffffff; padding: 40px 40px 20px; text-align: center;">
                <img src="https://launchplan.dev/launchplan-logo.png" alt="LaunchPlan Logo" style="width: 180px; height: auto; display: block; margin: 0 auto;" />
              </div>

              <!-- Main Content -->
              <div style="padding: 20px 40px 40px;">
                <div style="display: inline-block; background-color: rgba(232, 69, 32, 0.1); color: #E84520; padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">
                  Waitlist Confirmed
                </div>
                
                <h1 style="margin: 0 0 20px; font-size: 36px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.04em; line-height: 1.1;">
                  Welcome to the<br/><span style="color: #E84520;">Inner Circle.</span>
                </h1>
                
                <p style="margin: 0 0 24px; font-size: 17px; color: #444; line-height: 1.6;">
                  You're now on the early access list for LaunchPlan — where we hand you validated, blueprinted startup ideas every Friday, ready to ship by Monday.
                </p>
                
                <div style="background-color: #fcfcfc; border: 1px dashed #E84520; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                  <p style="margin: 0; font-size: 15px; color: #666; font-style: italic;">
                    "The best way to predict the future is to create it. We're here to help you build the tools of tomorrow, today."
                  </p>
                </div>

                <p style="margin: 0 0 32px; font-size: 16px; color: #555; line-height: 1.7;">
                  We'll reach out as soon as we're ready to let you in. Until then, keep an eye on your inbox.
                </p>
                
                <a href="https://launchplan.dev" style="display: inline-block; background-color: #E84520; color: #ffffff; text-decoration: none; padding: 18px 36px; border-radius: 14px; font-size: 16px; font-weight: 700; box-shadow: 0 4px 14px rgba(232, 69, 32, 0.4); transition: transform 0.2s ease;">
                  Visit LaunchPlan Dashboard →
                </a>
              </div>

              <!-- Footer -->
              <div style="padding: 32px 40px; background-color: #fafafa; border-top: 1px solid #f0f0f0; text-align: center;">
                <p style="margin: 0 0 12px; font-size: 14px; color: #999; font-weight: 500;">
                  Plan • Build • Ship • Scale
                </p>
                <div style="margin-bottom: 16px;">
                  <a href="https://launchplan.dev" style="color: #E84520; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">Website</a>
                  <a href="#" style="color: #999; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">Twitter</a>
                  <a href="#" style="color: #999; text-decoration: none; font-size: 13px; font-weight: 600; margin: 0 10px;">LinkedIn</a>
                </div>
                <p style="margin: 0; font-size: 11px; color: #ccc; line-height: 1.6;">
                  © 2026 LaunchPlan. All rights reserved.<br/>
                  You're receiving this because you signed up for the LaunchPlan waitlist.
                </p>
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
