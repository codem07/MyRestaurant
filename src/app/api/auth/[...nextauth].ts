import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const, // Fix SessionStrategy type error
  },
  callbacks: {
    async session({ session, token, user }: { session: Session; token: JWT; user?: User }) {
      // Attach user id and role to session (type assertion to allow extra fields)
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = (token as any).role;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        (token as any).role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 