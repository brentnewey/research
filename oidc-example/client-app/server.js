const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const CLIENT_ID = 'demo-client-app';
const CLIENT_REDIRECT_URI = 'http://localhost:3000/callback';
const IDP_BASE_URL = 'http://localhost:3001';

let sessions = new Map();

app.get('/', (req, res) => {
  const sessionId = req.query.session;
  const user = sessionId ? sessions.get(sessionId) : null;

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>OIDC Client Application</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .user-info { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .login-section { background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            button { background: #007cba; color: white; padding: 12px 24px; border: none; cursor: pointer; border-radius: 4px; margin: 5px; }
            .logout-btn { background: #dc3545; }
            pre { background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; }
            .flow-info { background: #fff3cd; padding: 15px; border-radius: 4px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <h1>OIDC Client Application Demo</h1>
        <div class="flow-info">
            <h3>🔄 OIDC Flow Status</h3>
            <p>This is the <strong>Relying Party (Client)</strong> in the OIDC flow.</p>
        </div>

        ${user ? `
            <div class="user-info">
                <h2>✅ Logged In Successfully!</h2>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Subject:</strong> ${user.sub}</p>

                <h3>Token Information:</h3>
                <pre>${JSON.stringify(user.tokens, null, 2)}</pre>

                <button class="logout-btn" onclick="window.location.href='/logout?session=${sessionId}'">Logout</button>
            </div>
        ` : `
            <div class="login-section">
                <h2>🔐 Not Logged In</h2>
                <p>Click the button below to initiate the OIDC Authorization Code flow:</p>
                <button onclick="window.location.href='/login'">Login with OIDC Provider</button>

                <div style="margin-top: 20px; font-size: 0.9em; color: #666;">
                    <h4>What happens when you click login:</h4>
                    <ol>
                        <li>Redirected to Identity Provider (port 3001)</li>
                        <li>Authenticate with demo credentials</li>
                        <li>Redirected back here with authorization code</li>
                        <li>Code exchanged for access/ID tokens</li>
                        <li>User info retrieved and displayed</li>
                    </ol>
                </div>
            </div>
        `}

        <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 4px;">
            <h3>🏗️ Architecture Overview</h3>
            <ul>
                <li><strong>Identity Provider</strong> (port 3001): Authenticates users, issues tokens</li>
                <li><strong>Client Application</strong> (port 3000): This app, requests authentication</li>
                <li><strong>User Agent</strong>: Your browser, facilitates the flow</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

app.get('/login', (req, res) => {
  const state = crypto.randomUUID();

  const authUrl = new URL(`${IDP_BASE_URL}/auth`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', CLIENT_REDIRECT_URI);
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);

  console.log('🔄 Initiating OIDC flow...');
  console.log('Redirecting to IdP:', authUrl.toString());

  res.redirect(authUrl.toString());
});

app.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`Authentication failed: ${error}`);
  }

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  console.log('📥 Received authorization code:', code);

  try {
    const tokenResponse = await fetch(`${IDP_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: CLIENT_ID,
        redirect_uri: CLIENT_REDIRECT_URI
      })
    });

    const tokens = await tokenResponse.json();
    console.log('🎟️ Received tokens:', tokens);

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokens.error}`);
    }

    const idTokenPayload = jwt.decode(tokens.id_token);
    console.log('🆔 ID token payload:', idTokenPayload);

    const userinfoResponse = await fetch(`${IDP_BASE_URL}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userInfo = await userinfoResponse.json();
    console.log('👤 User info:', userInfo);

    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      ...userInfo,
      tokens: tokens,
      loginTime: new Date().toISOString()
    });

    console.log('✅ OIDC flow completed successfully');

    res.redirect(`/?session=${sessionId}`);
  } catch (error) {
    console.error('❌ OIDC flow failed:', error);
    res.status(500).send(`Authentication failed: ${error.message}`);
  }
});

app.get('/logout', (req, res) => {
  const sessionId = req.query.session;
  if (sessionId) {
    sessions.delete(sessionId);
    console.log('👋 User logged out');
  }
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Client Application running on http://localhost:${PORT}`);
  console.log(`Callback URI: ${CLIENT_REDIRECT_URI}`);
});