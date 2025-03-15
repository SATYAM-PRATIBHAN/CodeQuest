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
            if (!params.user.email) {
                return false
            }
            try {
              const user = await db.user.findUnique({
                where : {
                  email : params.user.email
                }
              })
              if(user) return true;
              
                await db.user.create({
                    data: {
                        email: params.user.email,
                        username: params.user.name ?? "",
                    }
                })
            } catch(error) {
                console.log("An error occurred ", error);
            }
            return true;
        }
    },
    session: {
      strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
    },
}