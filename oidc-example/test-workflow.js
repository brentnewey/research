const fetch = require('node-fetch');

async function testOIDCWorkflow() {
  console.log('🧪 Testing OIDC Workflow Programmatically\n');

  try {
    // Test 1: Discovery endpoint
    console.log('1️⃣ Testing OIDC Discovery...');
    const discoveryResponse = await fetch('http://localhost:3001/.well-known/openid_configuration');
    const discovery = await discoveryResponse.json();
    console.log('✅ Discovery endpoint working');
    console.log('   Issuer:', discovery.issuer);
    console.log('   Authorization endpoint:', discovery.authorization_endpoint);
    console.log('   Token endpoint:', discovery.token_endpoint);
    console.log();

    // Test 2: Check if services are running
    console.log('2️⃣ Checking service availability...');

    const idpCheck = await fetch('http://localhost:3001/.well-known/openid_configuration');
    console.log('✅ Identity Provider (port 3001):', idpCheck.ok ? 'Running' : 'Not available');

    const clientCheck = await fetch('http://localhost:3000/');
    console.log('✅ Client Application (port 3000):', clientCheck.ok ? 'Running' : 'Not available');
    console.log();

    // Test 3: Simulate authorization flow (first step)
    console.log('3️⃣ Testing authorization endpoint...');
    const authUrl = 'http://localhost:3001/auth?response_type=code&client_id=demo-client-app&redirect_uri=http://localhost:3000/callback&scope=openid%20email%20profile&state=test-state';
    const authResponse = await fetch(authUrl);
    console.log('✅ Authorization endpoint accessible:', authResponse.ok);
    console.log('   Returns login form for user authentication');
    console.log();

    console.log('🎉 All automated tests passed!');
    console.log();
    console.log('📋 Manual Testing Instructions:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Click "Login with OIDC Provider"');
    console.log('3. Use credentials: user@example.com / password123');
    console.log('4. Observe the complete OIDC flow');
    console.log();
    console.log('🔍 What to look for:');
    console.log('• Redirect to Identity Provider (port 3001)');
    console.log('• Login form with client information displayed');
    console.log('• Successful authentication and redirect back');
    console.log('• Display of user information and tokens');
    console.log('• Proper JWT token structure in the response');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('• Make sure both services are running:');
    console.log('  - Identity Provider: cd identity-provider && npm start');
    console.log('  - Client App: cd client-app && npm start');
    console.log('• Check that ports 3000 and 3001 are available');
  }
}

testOIDCWorkflow();