# MAEC Demo Booking Landing Page

A Spanish-language landing page that helps architecture, engineering, and construction (AEC) businesses discover MAEC and request a product demo. The page explains how teams can manage projects, budgets, people, and day-to-day construction workflows in one place, then directs visitors to book a demo.

**Live page:** [maec.ai/solicitar-demo]([https://maec.ai/solicitar-demo/](https://demo-booking-maec.vercel.app/))

## What it does

- Presents MAEC's construction project-management value proposition and product integrations.
- Offers a demo-booking flow through TidyCal. The booking embed is loaded only after a visitor clicks **Ver horarios disponibles**.
- Collects newsletter signups through a Vercel serverless function at `POST /api/subscribe`, which validates email addresses and adds subscribers to a configured MailerLite group.
- Uses a honeypot field to filter automated form submissions.
- Loads Google Tag Manager after the visitor's first interaction and emits demo-booking conversion events.
- Provides responsive layouts and Spanish-language content for desktop and mobile visitors.

## Built with

- HTML, CSS, and browser JavaScript
- Vercel static hosting and a serverless API function
- TidyCal for demo scheduling
- MailerLite for newsletter subscriptions

There is no package manifest or build step in this repository.

## Run a local preview

Clone the repository and start a simple static web server:

```bash
git clone https://github.com/intoaecmarketing-lang/demo-booking-maec.git
cd demo-booking-maec
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

This is a **static preview**. The newsletter form's `/api/subscribe` endpoint is a Vercel function, so it will not run under Python's basic HTTP server. The booking widget also depends on the external TidyCal service and loads when its button is clicked.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Add the environment variables below in the project's environment settings. Keep the API key private; do not commit it to Git.
3. Deploy. Vercel serves the static site and maps `api/subscribe.js` to `/api/subscribe`.

| Variable | Purpose |
| --- | --- |
| `MAILERLITE_API_KEY` | MailerLite API token used by the subscription function. |
| `MAILERLITE_GROUP_ID` | MailerLite group that receives new subscribers. |

`.env.example` shows the required variable names. Confirm the group ID is the intended destination for the deployment before using it.

## Newsletter endpoint

`POST /api/subscribe` accepts a JSON body containing an `email` field:

```json
{
  "email": "person@example.com"
}
```

The function normalizes and validates the address, then forwards it to MailerLite. It returns `{ "ok": true }` on success, including when the subscriber already exists. Invalid addresses return a `400` response; missing server configuration returns `500`; MailerLite or network failures return `502`. A non-empty `website` field is treated as a bot submission.

## Project layout

```text
.
├── api/
│   └── subscribe.js       # Vercel newsletter subscription endpoint
├── css/
│   └── style.css          # Main stylesheet
├── fonts/                 # Locally served Poppins font files
├── images/                # Brand, integration, and page imagery
├── js/
│   ├── main.js            # Navigation, demo booking, and UI behavior
│   └── tracking.js        # Deferred tracking and conversion events
├── index.html             # Spanish-language landing page
├── vercel.json            # Response headers and asset caching rules
└── .env.example           # Required environment variable names
```

## Useful maintenance notes

- The TidyCal event path is set on the `#tidycal-embed` element in `index.html` (`data-path="moni1/reunion-demo-maec"`). Update it if the booking event changes.
- Update the integration logos, product links, and page copy in `index.html` and `images/` as needed.
- `js/tracking.js` contains placeholder IDs for optional direct GA4, Meta Pixel, and Microsoft Clarity tags. Google Tag Manager is configured separately in `index.html`.
- `vercel.json` sets `X-Robots-Tag: noindex, follow`, matching this campaign landing page's current indexing configuration.

## Related links

- [MAEC website](https://maec.ai/)
- [Product and feature links](./Links.md)
