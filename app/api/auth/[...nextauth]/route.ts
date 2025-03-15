import NextAuth from "next-auth";
import { authOptions } from "@/lib/authoptions"; // Import authOptions here

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
