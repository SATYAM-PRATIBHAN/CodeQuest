"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthSigninStore";
import { useState } from "react";

export default function SignInPage() {
  const { error,loading, setLoading, setError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await signIn("google", { callbackUrl: "/" });

      if (res?.error) {
        setError("Google sign-in failed. Try again.");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

  
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, 
      });
  
      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Store authentication state (localStorage, sessionStorage, or state management)
        localStorage.setItem("isAdmin", "true");
    
        // Redirect to admin dashboard
        router.push("/admin");
      }

      router.push("/");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-6 relative  overflow-hidden">
  {/* Animated Background */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute w-80 h-80 bg-gradient-to-r from-[#1F6FEB]/20 to-transparent rounded-full -top-40 -left-40 animate-float blur-2xl"></div>
    <div className="absolute w-64 h-64 bg-gradient-to-l from-[#1F6FEB]/15 to-transparent rounded-full bottom-10 right-10 animate-float-slow blur-xl"></div>
    <div className="absolute w-full h-full bg-[radial-gradient(#30363D_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
  </div>

  {/* Sign-In Container */}
  <div className="w-full max-w-sm z-10 animate-reveal">
    <div className="bg-[#161B22]/95 p-6 rounded-xl shadow-lg shadow-blue-500/50 border border-[#30363D]/40">
      <h2 className="text-2xl font-semibold text-center text-blue-500 mb-2 animate-fade-in">
        Sign In
      </h2>
      <p className="text-center text-gray-400 text-sm mb-6 animate-fade-in delay-100">
        Access your account
      </p>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4 bg-red-900/10 p-2 rounded animate-fade-in delay-200">
          {error}
        </p>
      )}

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="animate-slide-in delay-300">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 rounded bg-[#0D1117] border border-[#30363D] text-white placeholder-gray-500 focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/50 outline-none transition duration-300"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="animate-slide-in delay-400">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-3 py-2 rounded bg-[#0D1117] border border-[#30363D] text-white placeholder-gray-500 focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/50 outline-none transition duration-300"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1F6FEB] py-2 rounded font-medium text-white hover:bg-[#1F6FEB]/85 disabled:bg-[#1F6FEB]/60 disabled:cursor-not-allowed transition duration-300 animate-slide-in delay-500"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400 text-sm animate-slide-in delay-600">
        Don&apos;t have anaccount? 
        <Link href="/signup" className="text-[#1F6FEB] hover:text-[#1F6FEB]/85 ml-1 transition duration-300">
          Sign Up
        </Link>
      </p>

      <div className="flex items-center my-4 animate-slide-in delay-700">
        <div className="flex-grow border-t border-[#30363D]"></div>
        <span className="px-2 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-[#30363D]"></div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition duration-300 animate-slide-in delay-800"
      >
        <FcGoogle className="text-xl" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
    </div>
  </div>
</div>
  );
}
