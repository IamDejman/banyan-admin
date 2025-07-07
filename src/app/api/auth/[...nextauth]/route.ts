import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // TODO: Implement proper authentication logic
        if (credentials?.email === 'demo@example.com' && credentials?.password === 'demo') {
          return {
            id: '1',
            email: 'demo@example.com',
            name: 'Demo User',
            role: 'CLAIMS_AGENT',
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role ?? 'CLAIMS_AGENT';
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }; 