// Vercel serverless function: adds a newsletter signup to MailerLite.
// Env vars: MAILERLITE_API_KEY, MAILERLITE_GROUP_ID

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};
  const email = String(body.email || '').trim().toLowerCase();

  // Honeypot: real users leave this empty. Pretend success to bots.
  if (body.website) return res.status(200).json({ ok: true });

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'invalid_email' });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) {
    console.error('Missing MAILERLITE_API_KEY or MAILERLITE_GROUP_ID');
    return res.status(500).json({ ok: false, error: 'server_misconfigured' });
  }

  try {
    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, groups: [groupId] }),
    });

    // 200 = already existed (updated), 201 = created
    if (r.status === 200 || r.status === 201) return res.status(200).json({ ok: true });

    if (r.status === 422) {
      return res.status(400).json({ ok: false, error: 'invalid_email' });
    }

    console.error('MailerLite error', r.status, await r.text());
    return res.status(502).json({ ok: false, error: 'upstream_error' });
  } catch (err) {
    console.error('MailerLite request failed', err);
    return res.status(502).json({ ok: false, error: 'upstream_error' });
  }
};

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
