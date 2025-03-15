import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({ variant = "default", className, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg text-sm font-medium transition focus:outline-none";
  
  const variants = {
    default: "bg-[#1F6FEB] text-white hover:bg-[#174BA1]",
    outline: "border border-gray-500 text-white hover:bg-[#1F6FEB] hover:text-white",
    ghost: "text-gray-300 hover:text-white hover:bg-gray-800",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
