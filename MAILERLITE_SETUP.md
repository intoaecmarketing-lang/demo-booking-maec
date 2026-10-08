c# MailerLite Newsletter Setup

Checklist to take the newsletter signup form live.

## How it works

- **Form:** the newsletter section in `index.html` (around line 325) POSTs the email to `/api/subscribe`.
- **Backend:** `api/subscribe.js` is a Vercel serverless function that calls `https://connect.mailerlite.com/api/subscribers` and adds the subscriber to a group.
- **Tracking:** on success the form pushes a `newsletter_signup` event to the GTM `dataLayer`.
- **Config:** `.env.example` lists the two required env vars.

## Action steps

### 1. Get the MailerLite API token
- [ ] In MailerLite go to **Integrations → MailerLite API → Generate new token**.
- [ ] Copy the token. It is only shown once.

### 2. Confirm the group ID
- [ ] Go to **Subscribers → Groups** and open the newsletter group.
- [ ] Check the ID in the URL matches `200746263316006845`. If not, use the ID from the URL.

### 3. Add env vars in Vercel
- [ ] Open **Project → Settings → Environment Variables**.
- [ ] Add `MAILERLITE_API_KEY` (the token).
- [ ] Add `MAILERLITE_GROUP_ID` (the group ID).
- [ ] Enable both for **Production** (and **Preview** if you want to test there).

### 4. Commit and push the code
Currently uncommitted: `api/`, `.env.example`, `.gitignore`, `index.html`, `images/google-meet.webp`.
- [ ] Check `.gitignore` excludes `.env`. Never commit real keys. `.env.example` is safe to commit.
- [ ] Commit and push to `main`.

### 5. Redeploy
- [ ] Vercel deploys on push. If env vars were added after the last deploy, trigger a redeploy (env vars only apply to new builds).

### 6. Test on the live site
- [ ] Submit a real email in the newsletter form and confirm the success message.
- [ ] Confirm the subscriber appears in the MailerLite group.
- [ ] In GTM Preview, confirm the `newsletter_signup` event fires.

### 7. Optional but recommended
- [ ] **Welcome email:** create a MailerLite automation triggered when a subscriber joins the group.
- [ ] **Double opt-in:** enable in MailerLite account settings if GDPR compliance is needed (the form is in Spanish and may reach EU users).

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Form shows an error; logs say `Missing MAILERLITE_API_KEY or MAILERLITE_GROUP_ID` | Env vars not set in Vercel, or no redeploy after adding them |
| Logs show `MailerLite error 401` | Invalid or revoked API token |
| Logs show `MailerLite error 422` | Invalid email, or group ID does not exist |
| `/api/subscribe` returns 404 | `api/` folder not pushed or deployed |
