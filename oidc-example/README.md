# OIDC Example Workflow

This project demonstrates a complete OpenID Connect (OIDC) Authorization Code flow with three main entities:

## Architecture

1. **Identity Provider (IdP)** - Port 3001
   - Authenticates users and issues JWT tokens
   - Provides OIDC discovery endpoint
   - Handles authorization and token endpoints

2. **Client Application (Relying Party)** - Port 3000
   - Initiates OIDC flow
   - Exchanges authorization codes for tokens
   - Displays user information

3. **User Agent** - Your browser
   - Facilitates redirects between IdP and Client
   - Handles user authentication

## Quick Start

1. **Install dependencies:**
   ```bash
   cd identity-provider && npm install
   cd ../client-app && npm install
   ```

2. **Start the Identity Provider:**
   ```bash
   cd identity-provider
   npm start
   ```
   (Runs on http://localhost:3001)

3. **Start the Client Application (in another terminal):**
   ```bash
   cd client-app
   npm start
   ```
   (Runs on http://localhost:3000)

4. **Test the flow:**
   - Open http://localhost:3000
   - Click "Login with OIDC Provider"
   - Use demo credentials: `user@example.com` / `password123`

## OIDC Flow Steps

1. **Authorization Request**: Client redirects user to IdP with authentication request
2. **User Authentication**: User logs in at IdP
3. **Authorization Response**: IdP redirects back to client with authorization code
4. **Token Exchange**: Client exchanges code for access and ID tokens
5. **Resource Access**: Client uses tokens to access user information

## Demo Credentials

- **Email**: `user@example.com`
- **Password**: `password123`

## Key Endpoints

### Identity Provider (localhost:3001)
- `/.well-known/openid_configuration` - OIDC discovery
- `/auth` - Authorization endpoint
- `/token` - Token endpoint
- `/userinfo` - User information endpoint

### Client Application (localhost:3000)
- `/` - Home page
- `/login` - Initiate OIDC flow
- `/callback` - OIDC callback handler
- `/logout` - Logout

## Security Features

- JWT tokens with expiration
- State parameter for CSRF protection
- Authorization code with limited lifetime
- Proper token validation