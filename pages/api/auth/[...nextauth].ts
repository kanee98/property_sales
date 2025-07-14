import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const admin = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("Admin not found");
        }

        const passwordMatch = await bcrypt.compare(credentials.password, admin.password);

        if (!passwordMatch) {
          throw new Error("Invalid password");
        }

        // Ensure `id` is returned as a string
        return { id: String(admin.id), name: admin.name, email: admin.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string; // Ensure 'sub' is cast as a string
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});