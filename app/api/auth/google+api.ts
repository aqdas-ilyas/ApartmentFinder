import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    // In a real app, verify the Google token and get user info
    // This is just a demo implementation
    const user = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      picture: 'https://lh3.googleusercontent.com/a/default-user',
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