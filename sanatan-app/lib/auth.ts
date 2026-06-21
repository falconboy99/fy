import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const query = await db.query(
          "select id, email, name, password_hash from users where email = $1 limit 1",
          [credentials.email],
        );
        const user = query.rows[0];

        if (!user) {
          return null;
        }

        const ok = await bcrypt.compare(credentials.password, user.password_hash ?? "");
        if (!ok) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      const existing = await db.query("select id from users where email = $1 limit 1", [user.email]);

      if (existing.rowCount === 0) {
        await db.query(
          "insert into users (email, name, auth_provider) values ($1, $2, $3)",
          [user.email, user.name ?? "Seeker", account?.provider ?? "credentials"],
        );
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const query = await db.query("select id from users where email = $1 limit 1", [user.email]);
        const dbUser = query.rows[0];
        if (dbUser) {
          token.uid = String(dbUser.id);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = String(token.uid);
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
