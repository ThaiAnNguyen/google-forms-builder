'use strict';
/**
 * One-time helper to obtain a Google OAuth refresh token.
 *
 * Prereqs (see README): a Google Cloud OAuth client of type "Desktop app",
 * with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set in your .env.
 *
 * Run:  npm run get-token
 * It prints a URL — open it, approve access, and the refresh token is printed
 * back here. Paste that into .env as GOOGLE_REFRESH_TOKEN.
 */
require('dotenv').config();
const http = require('http');
const { google } = require('googleapis');
const { SCOPES } = require('./src/formKit');

const PORT = 3000;
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first (see README).');
  process.exit(1);
}

const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT);
const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES });

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/oauth2callback')) { res.writeHead(404); res.end(); return; }
  const code = new URL(req.url, REDIRECT).searchParams.get('code');
  try {
    const { tokens } = await oauth2.getToken(code);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Refresh token captured. You can close this tab and return to the terminal.');
    console.log('\n=== GOOGLE_REFRESH_TOKEN (paste into your .env) ===\n');
    console.log(tokens.refresh_token || '(none returned — revoke prior access at https://myaccount.google.com/permissions and retry)');
    console.log('\n===================================================\n');
  } catch (e) {
    res.writeHead(500); res.end('Token exchange failed: ' + e.message);
    console.error('Token exchange failed:', e.message);
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log('1) Open this URL in your browser and approve access:\n');
  console.log('   ' + authUrl + '\n');
  console.log('2) After approving you are redirected to localhost; the token prints here.');
});
