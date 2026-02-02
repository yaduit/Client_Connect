const API = 'http://localhost:5000/api';

async function run() {
  try {
    const ts = Date.now();
    const email = `ittest${ts}@example.com`;
    const password = 'Password123!';
    const name = `IT Test ${ts}`;

    console.log('Registering user', email);
    let res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const regBody = await res.json();
    console.log('Register response:', res.status, regBody);

    console.log('Logging in');
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginBody = await res.json();
    console.log('Login response:', res.status, loginBody);
    const setCookie = res.headers.get('set-cookie');
    console.log('Set-Cookie:', setCookie);

    if (!setCookie) {
      console.error('No set-cookie header; cannot proceed');
      return;
    }

    const cookieHeader = setCookie.split(';')[0];

    console.log('Fetching categories');
    res = await fetch(`${API}/categories`);
    const cats = await res.json();
    console.log('Categories fetched:', cats.map(c => c.slug).join(', '));

    const cat = cats[0];
    const sub = cat.subCategories?.[0]?.slug || 'test';

    console.log('Registering provider');
    const payload = {
      businessName: `IT Provider ${ts}`,
      categoryId: cat._id,
      subCategorySlug: sub,
      description: 'Integration test provider',
      location: { city: 'City', state: 'State', geo: { coordinates: [12, 34] } },
    };

    res = await fetch(`${API}/providers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify(payload),
    });

    const provBody = await res.json();
    console.log('Provider register status:', res.status, provBody);

    const newSetCookie = res.headers.get('set-cookie');
    console.log('Provider register set-cookie:', newSetCookie);

    // Call /providers/me to ensure provider exists for this user
    console.log('Fetching /providers/me with updated cookie');
    res = await fetch(`${API}/providers/me`, {
      method: 'GET',
      headers: { Cookie: cookieHeader }
    });
    const meBody = await res.json();
    console.log('/providers/me status:', res.status, meBody);

    // Verify /auth/logout clears cookie
    console.log('Logging out to verify cookie clearing');
    res = await fetch(`${API}/auth/logout`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });
    const logoutBody = await res.json();
    const logoutSetCookie = res.headers.get('set-cookie');
    console.log('Logout status:', res.status, logoutBody);
    console.log('Logout set-cookie:', logoutSetCookie);

  } catch (err) {
    console.error('Test failed', err);
  }
}

run();
