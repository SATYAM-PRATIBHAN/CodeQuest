"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";

export default function SignUpPage() {
  const { form, setForm, loading, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
  
      alert("Registered successfully!");
      router.push("/signin"); // Redirect to login page
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(` ${err.message}`); // Show alert popup
        setError(err.message);
      } else {
        alert("An unexpected error occurred");
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1117] p-4 sm:p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-80 h-80 bg-gradient-to-r from-[#1F6FEB]/20 to-transparent rounded-full -top-40 -left-40 animate-float blur-2xl"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-l from-[#1F6FEB]/15 to-transparent rounded-full bottom-10 right-10 animate-float-slow blur-xl"></div>
        <div className="absolute w-full h-full bg-[radial-gradient(#30363D_1px,transparent_1px)] [background-size:16px_16px] opacity-60"></div>
      </div>

      {/* Sign-Up Container */}
      <div className="w-full max-w-sm z-10 animate-reveal">
        <div className="bg-[#161B22]/95 p-6 rounded-xl shadow-lg shadow-[#1F6FEB]/40 border border-[#30363D]/40">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[#1F6FEB] mb-2 animate-fade-in">
            Sign Up
          </h2>
          <p className="text-center text-gray-400 text-sm mb-6 animate-fade-in delay-100">
            Create your account
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4 bg-red-900/10 p-2 rounded animate-fade-in delay-200">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="animate-slide-in delay-300">
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0D1117] border border-[#30363D] text-white placeholder-gray-500 focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/50 outline-none transition duration-300"
                required
              />
            </div>

            <div className="animate-slide-in delay-400">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0D1117] border border-[#30363D] text-white placeholder-gray-500 focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/50 outline-none transition duration-300"
                required
              />
            </div>

            <div className="animate-slide-in delay-500">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#0D1117] border border-[#30363D] text-white placeholder-gray-500 focus:border-[#1F6FEB] focus:ring-1 focus:ring-[#1F6FEB]/50 outline-none transition duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1F6FEB] py-2 rounded font-medium text-white hover:bg-[#1F6FEB]/85 disabled:bg-[#1F6FEB]/60 disabled:cursor-not-allowed transition duration-300 animate-slide-in delay-600"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-sm animate-slide-in delay-700">
            Already have an account?
            <Link href="/signin" className="text-[#1F6FEB] hover:text-[#1F6FEB]/85 ml-1 transition duration-300">
              Sign In
            </Link>
          </p>

          <div className="flex items-center my-4 animate-slide-in delay-800">
            <div className="flex-grow border-t border-[#30363D]"></div>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-[#30363D]"></div>
          </div>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 rounded font-medium hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed transition duration-300 animate-slide-in delay-900"
          >
            <FcGoogle className="text-xl" />
            {loading ? "Signing up..." : "Sign up with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
