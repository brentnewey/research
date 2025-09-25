const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

const JWT_SECRET = 'your-secret-key';
const authCodes = new Map();
const users = new Map([
  ['user@example.com', { password: 'password123', id: '1', name: 'John Doe' }]
]);

app.get('/.well-known/openid_configuration', (req, res) => {
  res.json({
    issuer: 'http://localhost:3001',
    authorization_endpoint: 'http://localhost:3001/auth',
    token_endpoint: 'http://localhost:3001/token',
    userinfo_endpoint: 'http://localhost:3001/userinfo',
    jwks_uri: 'http://localhost:3001/.well-known/jwks.json',
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['HS256']
  });
});

app.get('/auth', (req, res) => {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  if (response_type !== 'code') {
    return res.status(400).send('Unsupported response_type');
  }

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Identity Provider Login</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; }
            .form-group { margin: 15px 0; }
            label { display: block; margin-bottom: 5px; }
            input { width: 100%; padding: 8px; margin-bottom: 10px; }
            button { background: #007cba; color: white; padding: 10px 20px; border: none; cursor: pointer; }
            .info { background: #f0f8ff; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
        </style>
    </head>
    <body>
        <div class="info">
            <h3>OIDC Identity Provider</h3>
            <p><strong>Client:</strong> ${client_id}</p>
            <p><strong>Requested Scopes:</strong> ${scope}</p>
        </div>

        <h2>Login</h2>
        <form method="POST" action="/auth">
            <input type="hidden" name="client_id" value="${client_id}">
            <input type="hidden" name="redirect_uri" value="${redirect_uri}">
            <input type="hidden" name="scope" value="${scope}">
            <input type="hidden" name="state" value="${state}">

            <div class="form-group">
                <label>Email:</label>
                <input type="email" name="username" placeholder="user@example.com" required>
            </div>

            <div class="form-group">
                <label>Password:</label>
                <input type="password" name="password" placeholder="password123" required>
            </div>

            <button type="submit">Login & Authorize</button>
        </form>

        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
            Demo credentials: user@example.com / password123
        </p>
    </body>
    </html>
  `);
});

app.post('/auth', (req, res) => {
  const { username, password, client_id, redirect_uri, scope, state } = req.body;

  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials');
  }

  const authCode = crypto.randomUUID();
  authCodes.set(authCode, {
    client_id,
    user_id: user.id,
    scope,
    expires_at: Date.now() + 600000 // 10 minutes
  });

  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', authCode);
  if (state) redirectUrl.searchParams.set('state', state);

  res.redirect(redirectUrl.toString());
});

app.post('/token', (req, res) => {
  const { grant_type, code, client_id, redirect_uri } = req.body;

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({ error: 'unsupported_grant_type' });
  }

  const authData = authCodes.get(code);
  if (!authData || authData.expires_at < Date.now()) {
    authCodes.delete(code);
    return res.status(400).json({ error: 'invalid_grant' });
  }

  if (authData.client_id !== client_id) {
    return res.status(400).json({ error: 'invalid_client' });
  }

  authCodes.delete(code);

  const user = Array.from(users.values()).find(u => u.id === authData.user_id);

  const accessToken = jwt.sign({
    sub: authData.user_id,
    aud: client_id,
    iss: 'http://localhost:3001',
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: authData.scope
  }, JWT_SECRET);

  const idToken = jwt.sign({
    sub: authData.user_id,
    aud: client_id,
    iss: 'http://localhost:3001',
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    name: user.name,
    email: user.id === '1' ? 'user@example.com' : 'unknown@example.com'
  }, JWT_SECRET);

  res.json({
    access_token: accessToken,
    id_token: idToken,
    token_type: 'Bearer',
    expires_in: 3600
  });
});

app.get('/userinfo', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.sub);

    res.json({
      sub: decoded.sub,
      name: user.name,
      email: user.id === '1' ? 'user@example.com' : 'unknown@example.com'
    });
  } catch (error) {
    res.status(401).json({ error: 'invalid_token' });
  }
});

app.listen(PORT, () => {
  console.log(`Identity Provider running on http://localhost:${PORT}`);
  console.log(`Discovery endpoint: http://localhost:${PORT}/.well-known/openid_configuration`);
});