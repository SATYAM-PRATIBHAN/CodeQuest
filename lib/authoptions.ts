import { db } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
              password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials?.password) {
                throw new Error("Missing email or password");
              }
      
              const user = await db.user.findUnique({
                where: { email: credentials.email },
              });
      
              if (!user) {
                throw new Error("Invalid email or password");
              }
      
              return {
                id: user.id,
                name: user.username || user.email.split("@")[0], // Ensure name is returned
                email: user.email,
              };
            },
          }),
    ], 
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id as string; 
          session.user.name = token.name as string; 
          session.user.email = token.email as string; 
        }
        return session;
      },
      
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.name = user.name || user.email?.split("@")[0]; // Fallback to email prefix
          token.email = user.email;
        }
        return token;
      },
        async signIn(params) {
          const { user, account } = params;
      
          if (!user?.email) {
              return false;
          }
      
          try {
              const existingUser = await db.user.findUnique({
                  where: { email: user.email }
              });
      
              if (!existingUser) {
                  if (account?.provider === "google") {
                      // ✅ Create Google User with Google ID
                      await db.user.create({
                          data: {
                              id: account.providerAccountId, // ✅ Correct Google ID from params
                              email: user.email,
                              username: user.name ?? "",
                              image: user.image ?? "", // Optional Google profile image
                          }
                      });
                  } else if (account?.provider === "credentials") {
                      // ✅ Create Credentials User
                      await db.user.create({
                          data: {
                              email: user.email,
                              username: user.name ?? "",
                          }
                      });
                  }
              }
      
              return true;
          } catch (error) {
              console.error("An error occurred while signing in: ", error);
              return false;
          }
      }   
    },
    session: {
      strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
}