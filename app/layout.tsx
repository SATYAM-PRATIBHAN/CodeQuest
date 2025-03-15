import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { SpaceGrotesk } from "@/font/font";
import Navbar from "@/components/main/navbar";
import Footer from "@/components/main/footer";
import SessionWrapper from "@/public/sessionwrapper";
import { Metadata } from "next";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeQuest - Best Coding Interview Hub",
  description: "CodeQuest aggregates the best coding problems from platforms like LeetCode, CodeForces, and HackerRank.",
  icons: {
    icon: "/logo.ico", // For browsers
    shortcut: "/logo.ico", // Shortcut icon for quick access
  },
  keywords: "coding, interview prep, coding problems, leetcode, hackerrank, codeforces",
  robots: "index, follow",
  openGraph: {
    title: "CodeQuest - Your Ultimate Coding Hub",
    description: "Practice coding interview questions from multiple platforms in one place.",
    url: "https://codequest-pi.vercel.app/",
    type: "website",
    images: [
      {
        url: "/metaimage.png", // Correct path for Next.js public assets
        width: 1200,
        height: 630,
        alt: "CodeQuest - Master Coding Interviews"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeQuest - Master Coding Interviews",
    description: "Practice coding interview questions from multiple platforms in one place.",
    images: ["/metaimage.png"] // Same path for Twitter meta image
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html suppressHydrationWarning lang="en">
          <body
            suppressHydrationWarning
            className={`${geistSans.variable} ${geistMono.variable} ${SpaceGrotesk.className} antialiased`}
          >
            <SessionWrapper>
              <Navbar />
                {children}
              <Footer />
            </SessionWrapper>
          </body>
      </html>
  );
}
