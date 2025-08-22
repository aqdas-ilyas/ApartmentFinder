import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // In a real app, validate credentials against a database
    // This is just a demo implementation
    if (email !== 'demo@example.com' || password !== 'password') {
      return new Response('Invalid credentials', { status: 401 });
    }

    const user = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
    };

    const token = await new jose.SignJWT({ ...user })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.EXPO_PUBLIC_JWT_SECRET || 'your-secret-key'));

    return Response.json({ token, user });
  } catch (error) {
    return new Response('Internal server error', { status: 500 });
  }
}