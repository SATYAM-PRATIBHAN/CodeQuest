"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/store/useNavbarStore";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { menuOpen, toggleMenu, closeMenu } = useNavbarStore();
  const { data: session } = useSession();
  const handleLogout = () => {
    localStorage.removeItem("isAdmin"); 
    router.push("/"); 
  };

  return (
    <nav className="bg-[#0A0E14] text-[#F0F4F8] px-8 py-5 relative shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-[#3B82F6] relative z-50 transition-transform hover:scale-105"
        >
          CodeQuest
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6 lg:space-x-8 text-base lg:text-lg">
          <NavItem href="/" label="Home Page">Home</NavItem>
          <NavItem href="/problems" label="Coding Problems">Problems</NavItem>
          <NavItem href="/tech-trivia" label="Tech Trivia where you would get points">Tech Trivia</NavItem>
          <NavItem href="/discuss" label="Community Discussions">Discuss</NavItem>
        </ul>

        {/* Desktop Authentication */}
        <div className="hidden md:flex  items-center gap-4 lg:gap-6">
          {session ? (
            <>
              <span className="text-[#F0F4F8] font-medium truncate max-w-[120px] lg:max-w-[160px]">
                {session?.user?.name?.split(" ")[0]}
              </span>
              <Button
                variant="outline"
                className="border-[#2A3239] text-[#F0F4F8] hover:bg-red-600 hover:border-red-600 relative z-10 transition-all duration-300 text-sm lg:text-base px-4 lg:px-5 py-2 rounded-xl"
                onClick={() => {
                  signOut();
                  handleLogout();
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="border-[#2A3239]text-[#F0F4F8] hover:bg-[#3B82F6] hover:border-[#3B82F6] relative z-10 transition-all duration-300 text-sm lg:text-base px-4 lg:px-5 py-2 rounded-xl"
              onClick={() => router.push("/signin")}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#F0F4F8] z-50 focus:outline-none hover:text-[#3B82F6] transition-colors duration-200"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0A0E14] shadow-xl z-50 transition-all duration-300 ease-in-out">
          <ul className="flex flex-col space-y-4 py-6 px-6">
            <NavItem href="/" label="Home Page" isMobile>Home</NavItem>
            <NavItem href="/problems" label="Coding Problems" isMobile>Problems</NavItem>
            <NavItem href="/tech-trivia" label="Tech Trivia where you would get points" isMobile>Tech Trivia</NavItem>
            <NavItem href="/discuss" label="Community Discussions" isMobile>Discuss</NavItem>
            {session ? (
              <li>
                <button
                  className="w-full text-left text-[#F0F4F8] py-3 px-5 hover:bg-red-600 hover:text-[#F0F4F8] transition-all duration-300 rounded-xl bg-[#11171D]"
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <button
                  className="w-full relative z-50 text-left text-[#F0F4F8] py-3 px-5 hover:bg-[#3B82F6] hover:text-[#F0F4F8] transition-all duration-300 rounded-xl bg-[#11171D]"
                  onClick={() => {
                    router.push("/signin");
                    closeMenu();
                  }}
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

// Reusable NavItem component
function NavItem({
  href,
  children,
  label,
  isMobile = false,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
  isMobile?: boolean;
}) {
  const pathname = usePathname();
  const { closeMenu } = useNavbarStore();

  return (
    <li>
      <Link
        href={href}
        aria-label={label}
        onClick={isMobile ? closeMenu : undefined}
        className={`block px-3 py-2 ${
          pathname === href ? "text-[#3B82F6]" : "text-[#F0F4F8]"
        } relative z-50 hover:text-[#3B82F6] transition-all duration-300 ${isMobile ? "rounded-xl hover:bg-[#11171D]" : ""}`}
      >
        {children}
      </Link>
    </li>
  );
}