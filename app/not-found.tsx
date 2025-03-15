import Link from "next/link";

export default function NotFoundPage() {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0D1117] text-[#E6EDF3] text-center px-6">
        <h1 className="text-6xl font-bold text-[#1F6FEB]">404</h1>
        <p className="text-2xl mt-2 text-gray-400">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <p className="text-lg text-gray-500 mt-4">
          The link might be broken, or the page may have been removed.
        </p>
        <Link
          href="/"
          className="mt-6 bg-[#1F6FEB] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-80 transition"
        >
          Go Back Home
        </Link>
      </div>
    );
  }