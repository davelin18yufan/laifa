import NextAuth, { NextAuthOptions, User, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface CustomUser extends User {
  id: string
  role: "shopkeeper" | "admin"
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: "shopkeeper" | "admin"
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        if (
          username === process.env.SHOPKEEPER_USERNAME &&
          password === process.env.SHOPKEEPER_PASSWORD
        ) {
          return { id: "shopkeeper", name: "Shopkeeper", role: "shopkeeper" }
        } else if (
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return { id: "admin", name: "Admin", role: "admin" }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt", // 使用 JWT 儲存 session，簡單且符合 Middleware 使用
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser
        token.role = customUser.role // 將 role 存入 token
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role as "shopkeeper" | "admin" // 將 role 傳遞到 session
      return session
    },
  },
  pages: {
    signIn: "/login", 
  },
}

export const GET = NextAuth(authOptions)
export const POST = NextAuth(authOptions)
