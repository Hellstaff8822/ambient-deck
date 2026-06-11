"use client";

import React from "react";
import { motion } from "framer-motion";

interface DeckButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  variant?: "danger" | "standard" | "success";
}

export default function DeckButton({
  onClick,
  isActive = false,
  children,
  variant = "standard",
}: DeckButtonProps) {
  const ledColors = {
    standard: isActive
      ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
      : "bg-amber-950",
    danger: isActive ? "bg-red-500 shadow-[0_0_8px_#ef4444]" : "bg-red-950",
    success: isActive
      ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
      : "bg-emerald-950",
  };

  return (
    <div className="flex flex-col items-center gap-1.5 font-chassis">
      <div
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${ledColors[variant]}`}
      />

      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ y: 2 }}
        className={`w-14 h-12 rounded-md flex items-center justify-center relative
                    border-t border-l border-slate-500/20
                    border-b-4 border-r-2 border-black/70
                    transition-all duration-150 select-none cursor-pointer
                    ${
                      isActive
                        ? "bg-[#141318] text-amber-500 border-none shadow-[inset_0px_4px_6px_rgba(0,0,0,0.9)] translate-y-[4px]"
                        : "bg-[#2e2d36] text-slate-400 hover:text-slate-200 shadow-[0_4px_0_#121115,0_6px_10px_rgba(0,0,0,0.5)]"
                    }`}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/5 rounded-t-md pointer-events-none" />

        <div className="relative z-10 filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
          {children}
        </div>
      </motion.button>
    </div>
  );
}
