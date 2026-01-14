"use client";

import React from "react";
import { Bell, Search, ChevronRight } from "lucide-react";
import mockData from "../../../data/mocks/wealth_shell.json";

interface WealthHeaderProps {
  title?: string;
  breadcrumb?: string[];
}

export function WealthHeader({ title, breadcrumb }: WealthHeaderProps) {
  const { user } = mockData;

  return (
    <header className="fixed top-0 left-[80px] right-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-[#050505]/80 px-8 backdrop-blur-md">
      {/* Context / Breadcrumb */}
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
            <span>Aurora</span>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <ChevronRight className="h-3 w-3" />
                <span className={index === breadcrumb.length - 1 ? "text-white/60" : ""}>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        {title && <h1 className="mt-1 font-serif text-xl tracking-tight text-white">{title}</h1>}
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-6">
        <div className="relative group cursor-pointer">
          <Search className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
        </div>
        <div className="relative group cursor-pointer">
          <Bell className="h-5 w-5 text-white/40 transition-colors group-hover:text-white" />
          <div className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>

        <div className="h-8 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-white/40">{user.role}</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/30">
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
