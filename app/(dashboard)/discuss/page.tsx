"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

interface Message {
  id: string;
  username: string;
  text: string;
  createdAt: string;
}

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-xl shadow-lg text-center my-6 max-w-md mx-auto transform transition-all duration-300 hover:scale-[1.02]">
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-lg font-medium">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Retry
      </button>
    </div>
  </div>
);

export default function DiscussPage() {
  const { data: session } = useSession();
  const username = session?.user?.name || "Guest";

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number | null>(null);

  // Timer Logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCooldown = sessionStorage.getItem("cooldown");
      if (savedCooldown) {
        const remainingTime = parseInt(savedCooldown, 10) - Math.floor(Date.now() / 1000);
        if (remainingTime > 0) {
          setCooldown(remainingTime);
        } else {
          sessionStorage.removeItem("cooldown");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown !== null && cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev !== null && prev > 1) {
            sessionStorage.setItem("cooldown", (Math.floor(Date.now() / 1000) + prev - 1).toString());
            return prev - 1;
          } else {
            sessionStorage.removeItem("cooldown");
            return null;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [cooldown]);

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      setError(null);
      const res = await fetch("/api/discuss", { cache: "no-store" });

      if (!res.ok) {
        throw new Error("Cannot connect right now. Please try again.");
      }

      const data = await res.json();
      setMessages(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  // Send Message
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || cooldown !== null) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text: newMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      setNewMessage("");
      fetchMessages();

      const cooldownTime = 300; // 5 minutes
      setCooldown(cooldownTime);
      sessionStorage.setItem("cooldown", (Math.floor(Date.now() / 1000) + cooldownTime).toString());
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSending(false);
    }
  };

  // Handle Key Press (Send Message on Enter)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0A0E14] text-gray-50">
      {/* Show Username at the Top */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#3B82F6] tracking-tight">Discussion Room</h1>
        <p className="text-lg font-medium text-gray-200">
          Logged in as: <span className="text-[#3B82F6]">{username}</span>
        </p>
      </div>
      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={fetchMessages} />}

      {/* Message List */}
      <div className="mt-8 p-5 bg-[#11171D] rounded-xl border border-[#2A3239] h-[70vh] overflow-y-auto shadow-md">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="p-3 border-b border-[#2A3239] transition-colors hover:bg-[#161C24]">
              <p className="text-[#3B82F6] font-semibold">{msg.username}</p>
              <p className="text-gray-100">{msg.text}</p>
            </div>
          ))
        ) : !error ? (
          <p className="text-gray-400 text-center py-4">No messages yet.</p>
        ) : null}
      </div>

      {/* Input & Send Button */}
      <div className="mt-6 flex gap-3">
        <input
          type="text"
          placeholder="Your Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isSending || cooldown !== null}
          className="w-full px-5 py-3 rounded-xl bg-[#0A0E14] border border-[#2A3239] text-gray-100 placeholder-gray-500 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6] outline-none transition-all hover:bg-[#11171D]"
        />
        
        <Button 
          onClick={sendMessage} 
          className={`px-6 py-3 rounded-xl bg-[#3B82F6] text-white font-semibold transition-all duration-200 hover:bg-[#2563EB] disabled:bg-[#4B5E7A] disabled:cursor-not-allowed`}
          disabled={isSending || cooldown !== null}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </div>
      {cooldown !== null && (
          <div className="bg-yellow-500 mt-10 text-black text-center py-2 px-4 rounded-lg mb-4">
            ⚠️ Slow Mode is enabled: You can only send one message every 5 minutes. Next message available in {cooldown} seconds.
          </div>
        )}
    </div>
  );
}
