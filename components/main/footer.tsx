import Link from "next/link";
import { FaTwitter, FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0D1117] text-[#E6EDF3] py-4 sm:py-6 border-t border-[#161B22]">
  <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-center space-y-4 md:space-y-0 px-4 sm:px-6 md:px-6">
    {/* Brand Text */}
    <p className="text-base sm:text-lg font-semibold">
      CodeQuest © {new Date().getFullYear()}
    </p>

    {/* Tagline */}
    <p className="hidden md:block text-[#8B949E] text-xs sm:text-sm md:text-base">
      If you found this helpful, please consider following me on my socials.
    </p>

    {/* Social Icons */}
    <div className="flex gap-4 sm:gap-6">
      <Link href="https://x.com/s_pratibhan" target="_blank" rel="noopener noreferrer">
        <FaTwitter className="text-[#1F6FEB] text-xl sm:text-2xl hover:text-opacity-80 transition" />
      </Link>
      <Link href="https://www.linkedin.com/in/satyampratibhan/" target="_blank" rel="noopener noreferrer">
        <FaLinkedin className="text-[#1F6FEB] text-xl sm:text-2xl hover:text-opacity-80 transition" />
      </Link>
      <Link href="mailto:satyampratibhan@gmail.com">
        <FaEnvelope className="text-[#F85149] text-xl sm:text-2xl hover:text-opacity-80 transition" />
      </Link>
      <Link href="https://github.com/SATYAM-PRATIBHAN">
        <FaGithub className="text-[#f9fafa] text-xl sm:text-2xl hover:text-opacity-80 transition" />
      </Link>
    </div>
  </div>
</footer>
  );
}
