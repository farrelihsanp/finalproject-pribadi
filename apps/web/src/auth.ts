import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  jwt: {
    encode: () => {},
    decode: () => {},
  },
  cookies: {
    sessionToken: {
      name: 'accessToken',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        domain:
          process.env.NODE_ENV === 'development' ? 'localhost' : 'quickmart',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});

// const handlers = NextAuth({ providers: [Google] }).handlers;
