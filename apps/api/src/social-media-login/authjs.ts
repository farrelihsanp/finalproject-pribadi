// // auth.js
// import NextAuth from 'next-auth';
// import Providers from 'next-auth/providers';
// import { PrismaAdapter } from '@next-auth/prisma-adapter';
// import { prisma } from '../configs/prisma.js';

// export default NextAuth({
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     Providers.GitHub({
//       clientId: process.env.GITHUB_ID,
//       clientSecret: process.env.GITHUB_SECRET,
//     }),
//   ],
//   callbacks: {
//     async session({ session, user }) {
//       session.userId = user.id;
//       return session;
//     },
//     async signIn({ user, account, profile, email, credentials }) {
//       return true;
//     },
//   },
//   pages: {
//     signIn: '/api/auth/signin',
//     signOut: '/api/auth/signout',
//     error: '/api/auth/error',
//     verifyRequest: '/api/auth/verify-request',
//     newUser: null,
//   },
// });
