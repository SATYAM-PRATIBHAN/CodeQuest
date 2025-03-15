"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "../ui/background-beams";
import { Spotlight } from "../ui/spotlight";
import { useEffect, useState, useRef } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconCode,
  IconUsers,
  IconChartBar,
  IconBook,
} from "@tabler/icons-react";
import "../../app/globals.css"; 

const items = [
  {
    title: "Curated Problems",
    description: "Access top questions from multiple coding platforms.",
    className: "md:col-span-2",
    icon: <IconBook className="h-8 w-8 text-[#3B82F6]" />,
  },
  {
    title: "Live Code Editor",
    description: "Code in-browser with real-time feedback.",
    className: "md:col-span-1",
    icon: <IconCode className="h-8 w-8 text-[#FACC15]" />,
  },
  {
    title: "Community Discussions",
    description: "Engage with peers, share solutions, and discuss strategies.",
    className: "md:col-span-1",
    icon: <IconUsers className="h-8 w-8 text-[#EC4899]" />,
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement and ace your next interview.",
    className: "md:col-span-2",
    icon: <IconChartBar className="h-8 w-8 text-[#22C55E]" />,
  },
];


export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const sectionRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const adminCheck = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminCheck);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Create a snapshot of the ref array
    const refsSnapshot = [...sectionRefs.current];

    refsSnapshot.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      refsSnapshot.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);


  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E14] text-[#F0F4F8]">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#3B82F6" />
      
      {/* Hero Section */}
      <ContainerScroll
        titleComponent={
          <section className="flex relative z-10 flex-col items-center justify-center text-center py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 min-h-[70vh]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl tracking-tight">
              Master Coding Interviews with <span className="text-[#3B82F6]">CodeQuest</span>
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-[#94A3B8] mt-4 sm:mt-5 max-w-xl sm:max-w-2xl">
              The ultimate hub for coding interview preparation. Practice problems from LeetCode, Codeforces, and more—all in one place.
            </p>
            <div className="mt-6 sm:mt-8 relative z-10">
              <Link href="/problems">
                <Button className="text-base sm:text-lg font-semibold px-5 sm:px-7 py-2.5 sm:py-3.5 bg-[#0A0E14] text-[#F0F4F8] border border-[#2A3239] hover:bg-[#3B82F6] hover:border-[#3B82F6] rounded-xl transition-all duration-300">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </section>
        }
      >
        <Image
          src={`/home.png`}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl relative z-10 object-cover h-full object-left-top "
          draggable={false}
        />
      </ContainerScroll>

      {/* Admin Panel */}
      <section ref={addToRefs} className="animate-on-scroll animate-right flex relative z-10 flex-col items-center justify-center text-center py-24 px-8">
        <div className="mt-2 relative z-10 flex gap-4">
          {isAdmin && (
            <>
              <Link href="/api/admin">
                <Button className="text-lg font-semibold px-8 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F0F4F8] rounded-xl shadow-md border border-[#3B82F6]/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0A0E14] hover:to-[#11171D] hover:border-[#2A3239]/70 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] relative z-10">
                  Admin Panel
                </Button>
              </Link>
              <Link href="/api/problems-admin">
                <Button className="text-lg font-semibold px-8 py-3.5 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-[#F0F4F8] rounded-xl shadow-md border border-[#3B82F6]/50 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#0A0E14] hover:to-[#11171D] hover:border-[#2A3239]/70 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] relative z-10">
                  Manage Problems
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section ref={addToRefs} className="animate-on-scroll animate-left">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center py-16 text-[#F0F4F8] tracking-tight relative">
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent relative z-10">
            <span className="text-white">Highlights of</span> CodeQuest
          </span>
        </h2>
        <BentoGrid className="max-w-4xl mx-auto ">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </section>
      
      
      {/* Testimonials Section */}
      <section ref={addToRefs} className="animate-on-scroll animate-right py-24 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#F0F4F8] tracking-tight">
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">What Our Users Say</span>
        </h2>
        <div className="max-w-5xl mx-auto mt-14 grid gap-8 md:grid-cols-2">
          {[
            { name: "Alice Johnson", feedback: "CodeQuest helped me land my dream job at Google! The curated questions were spot on." },
            { name: "Mark Peterson", feedback: "The live code editor and discussions made problem-solving so much easier. Highly recommended!" }
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className="relative p-6 bg-[#0A0E14]/90 backdrop-blur-md border border-[#2A3239]/50 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:-translate-y-1"
            >
              <p className="text-lg text-[#D1D5DB] italic leading-relaxed">
                &quot;{testimonial.feedback}&quot;
              </p>
              <h4 className="text-[#60A5FA] font-semibold mt-6 tracking-wide">
                — {testimonial.name}
              </h4>
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={addToRefs} className="animate-on-scroll animate-left py-24 -mt-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#F0F4F8] mb-14 tracking-tight">
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </h2>
        {[
          { question: "Is CodeQuest free to use?", answer: "Yes! Enjoy our core features at no cost. Premium options are coming soon." },
          { question: "Do I need an account to practice?", answer: "Yes!, you would need an account to access the problems or to practise them. " },
          { question: "Which coding platforms are included?", answer: "We bring you problems from LeetCode, Codeforces, HackerRank, and beyond." }
        ].map((faq, index) => (
          <div 
            key={index} 
            className="mb-10 group relative transition-all duration-300 hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold text-[#F0F4F8] tracking-tight group-hover:text-[#60A5FA] transition-colors duration-300">
              {faq.question}
            </h3>
            <p className="text-[#A0B1C5] mt-3 text-base leading-relaxed max-w-2xl">
              {faq.answer}
            </p>
            <div className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section ref={addToRefs} className="animate-on-scroll animate-right py-20 -mt-20 px-6 text-center text-[#F0F4F8]">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Ready to{" "}
          <span className="bg-gradient-to-r from-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent">
            Ace Your Coding Interview?
          </span>
        </h2>
        <p className="text-lg text-[#A0B1C5] mt-6 max-w-xl mx-auto leading-relaxed">
          Join thousands of developers sharpening their skills with CodeQuest.
        </p>
        <div className="mt-10">
          <Link href="/signup">
            <Button 
              className="text-lg font-semibold px-9 py-4 bg-[#F9FAFB] text-[#3B82F6] rounded-2xl shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-[#3B82F6] hover:to-[#60A5FA] hover:text-[#F0F4F8] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
      

      <BackgroundBeams />
    </div>
  );
}