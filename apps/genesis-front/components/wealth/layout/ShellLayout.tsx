"use client";

import React from "react";
import { WealthSidebar } from "../shell/WealthSidebar";
import { WealthHeader } from "../shell/WealthHeader";

interface ShellLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumb?: string[];
  focusMode?: boolean;
}

export function ShellLayout({ children, title, breadcrumb, focusMode = false }: ShellLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20">
      <WealthSidebar />
      <WealthHeader title={title} breadcrumb={breadcrumb} />

      <main
        className={`ml-[80px] pt-20 transition-all duration-500 ease-out ${
          focusMode ? "opacity-30 blur-sm pointer-events-none grayscale" : "opacity-100"
        }`}
      >
        <div className="mx-auto max-w-7xl p-8">
          {children}
        </div>
      </main>

      {/* Focus Mode Overlay Layer (if we wanted to mount something ON TOP, but for now we just dim main)
          Actually, if focusMode is true, the children MIGHT contain the focused element outside this main wrapper
          OR structure asks for the focus content to be separate.

          Based on OS: "A UI do Shell recua (diminui opacidade) para dar foco total ao Terminal."
          So usually the Terminal is rendered ON TOP or replacing content.

          For this implementation: I will render a separate layer for 'focused' content if provided,
          but usually the page structure handles the 'Audit' page.
      */}
    </div>
  );
}
