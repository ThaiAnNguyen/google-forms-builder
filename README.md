# Google Forms Builder

Build **rich** Google Forms programmatically — checkboxes, linear scales, paragraphs,
"Other" options, multi-page **sections**, and **section-level branching** — using the
official [Google Forms API](https://developers.google.com/forms/api) and `googleapis`.

Most form wrappers (including many MCP servers) only expose radio + short-text questions
and insert items in reverse order. This project talks to the Forms API directly via a small
toolkit ([`src/formKit.js`](src/formKit.js)) and ships a non-trivial two-track survey as a worked
example ([`examples/ai-usage-survey/`](examples/ai-usage-survey)).

---

## What you can build

| Capability | Helper | Notes |
|---|---|---|
| Multiple choice | `radio(title, options)` | options are strings or option objects |
| Checkboxes | `checkboxes(title, options)` | |
| Linear scale 1–5 | `scale(title, {lowLabel, highLabel})` | `low`/`high` default to 1/5 |
| Paragraph / short text | `paragraph(title)` / `shortText(title)` | |
| "Other" write-in | `other()` | append to a radio/checkbox option list |
| Section (new page) | `section(itemId, title, desc)` | `itemId` is yours, for routing |
| Route to a section | `toSection(value, sectionId)` | forward jumps only |
| Submit on answer | `toSubmit(value)` | |

All questions are required by default (pass `{ required: false }` to opt out).

---

## Quick start

```bash
npm install
cp .env.example .env          # then edit .env  (Windows: copy .env.example .env)
npm run get-token             # prints a URL → approve → paste the token into .env
npm run build:demo            # creates the two example forms in your Google account
npm run verify <formId>       # prints the resulting structure
```

---

## Getting credentials

1. **Enable the API.** In the [Google Cloud Console](https://console.cloud.google.com/),
   create (or pick) a project and enable the **Google Forms API** (and **Google Drive API**
   if you want to rename files later).
2. **Create an OAuth client.** *APIs & Services → Credentials → Create credentials →
   OAuth client ID → Application type: **Desktop app***. Copy the **Client ID** and
   **Client secret** into `.env`.
   - Desktop clients allow the `http://localhost:3000/oauth2callback` loopback this tool uses.
   - You may need to add yourself as a **Test user** on the OAuth consent screen.
3. **Mint a refresh token.** Run `npm run get-token`, open the printed URL, approve the
   requested scopes, and paste the printed token into `.env` as `GOOGLE_REFRESH_TOKEN`.

Scopes requested: `https://www.googleapis.com/auth/forms` and `.../auth/drive`.

> ### ⚠️ Security
> - `.env` is gitignored — **never commit real credentials**.
> - A refresh token is a long-lived credential. If one leaks, revoke it at
>   [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and/or
>   rotate the client secret in Cloud Console, then re-run `get-token`.

---

## Build your own form

```js
require('dotenv').config();
const FK = require('./src/formKit');

const S = { INTRO: '1', DETAILS: '2' };

const items = [
  FK.section(S.INTRO, 'About you'),
    FK.radio('Are you a customer?', [
      FK.toSection('Yes', S.DETAILS),   // jump forward to the DETAILS section
      FK.toSubmit('No'),                // …or submit immediately
    ]),
  FK.section(S.DETAILS, 'Tell us more'),
    FK.checkboxes('Which products do you use?', ['A', 'B', 'C', FK.other()]),
    FK.scale('How satisfied are you?', { lowLabel: 'Unhappy', highLabel: 'Delighted' }),
    FK.paragraph('Anything else?', { required: false }),
];

(async () => {
  const forms = FK.formsClient();
  const r = await FK.createForm(forms, { title: 'My survey', description: 'Thanks!', items });
  console.log(r.editUrl, r.responderUri);
})();
```

### How branching works (important)

Google Forms routing is **section-level and forward-only** — a question can jump to a *later*
section or submit, but it cannot hide an individual earlier question, and there is **no
"after this section, go to X" setting** in the API (only choice-option routing). `createForm`
inserts items bottom-up so every `goToSectionId` target already exists in one batch; just make
sure each route points to a section that appears **later** in your `items` array than the
question, and keep a routing question **last** in its section.

---

## Known API limits (set these in the UI)

The Forms API **cannot**:

- **Limit checkbox selections** ("select at most N"). The example writes the rule into the
  question description as text; enforce it via *question ⋮ → Response validation → Select at most → N*.
- **Change response settings** (collect email, limit to 1 response, "make anonymous"). Set
  these under *Settings → Responses*. New forms are anonymous by default.
- **Set `documentTitle` after creation** — it's create-only here; rename the Drive file via the
  Drive API if needed.

---

## Layout

```
src/formKit.js              reusable toolkit (auth + item builders + createForm)
get-refresh-token.js        one-time OAuth helper
examples/ai-usage-survey/
  content.js                all survey copy + option lists (two tracks)
  build.js                  assembles & creates both forms
  verify.js                 prints a form's structure
.env.example                credential template
```

## License

MIT — see [LICENSE](LICENSE). (Edit the copyright holder to your name/org.)
