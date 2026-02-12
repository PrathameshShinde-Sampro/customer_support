
const BASE_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'TestPassword123!';
    const name = 'Test User';

    console.log('--- Testing Registration ---');
    try {
        const regRes = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Response:', regData);

        if (!regRes.ok) {
            console.error('Registration failed, aborting login test.');
            return;
        }
    } catch (e) {
        console.error('Registration fetch failed:', e);
        return;
    }

    console.log('\n--- Testing Login ---');
    try {
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);

        // Check cookies? Not easy with fetch in node unless inspecting headers
        const cookies = loginRes.headers.get('set-cookie');
        console.log('Set-Cookie Header:', cookies);

    } catch (e) {
        console.error('Login fetch failed:', e);
    }
}

testAuth();
