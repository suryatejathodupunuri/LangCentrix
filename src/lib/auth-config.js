import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase(),
            isActive: true
          }
        })

        if (!user || !user.password) {
          throw new Error("Invalid email or password")
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            lastLogin: new Date(),
            updatedAt: new Date()
          }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  secret: process.env.NEXTAUTH_SECRET,
}