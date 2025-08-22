import * as jose from 'jose';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.EXPO_PUBLIC_JWT_SECRET || 'your-secret-key')
    );

    return Response.json({ valid: true, user: payload });
  } catch (error) {
    return Response.json({ valid: false }, { status: 401 });
  }
}