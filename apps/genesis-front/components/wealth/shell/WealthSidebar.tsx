"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, ShieldCheck } from "lucide-react";

export function WealthSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-[80px] flex-col border-r border-white/5 bg-[#050505] transition-all duration-300">
      {/* Brand Icon */}
      <div className="flex h-20 items-center justify-center border-b border-white/5">
        <div className="h-8 w-8 rounded-full bg-white/10 p-2">
          <div className="h-full w-full rounded-full bg-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col items-center gap-6 py-8">
        <Link href="/wealth/dashboard" className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/5">
          <LayoutDashboard className={`h-5 w-5 transition-colors ${isActive("/wealth/dashboard") ? "text-white" : "text-white/40 group-hover:text-white"}`} />
          {isActive("/wealth/dashboard") && <div className="absolute right-0 top-2 h-6 w-0.5 rounded-l-full bg-white" />}
        </Link>

        <Link href="/wealth/portfolio" className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/5">
          <Briefcase className={`h-5 w-5 transition-colors ${isActive("/wealth/portfolio") ? "text-white" : "text-white/40 group-hover:text-white"}`} />
          {isActive("/wealth/portfolio") && <div className="absolute right-0 top-2 h-6 w-0.5 rounded-l-full bg-white" />}
        </Link>

        <div className="my-2 h-px w-8 bg-white/5" />

        <button className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/5">
           <ShieldCheck className="h-5 w-5 text-emerald-500/50 transition-colors group-hover:text-emerald-500" />
        </button>
      </nav>

      {/* Footer */}
      <div className="flex flex-col items-center gap-6 py-8 border-t border-white/5">
        <button className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/5">
          <Settings className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
        </button>
        <button className="group flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/5">
          <LogOut className="h-5 w-5 text-white/40 transition-colors group-hover:text-rose-500" />
        </button>
      </div>
    </aside>
  );
}
