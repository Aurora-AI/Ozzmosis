"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface CinematicHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function CinematicHero({ title, subtitle, ctaText, onCtaClick }: CinematicHeroProps) {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-3xl group">
      {/* Background (Mock Video/Image) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1634141700676-e968f9213f75?q=80&w=2787&auto=format&fit=crop')" }}
      />

      {/* Overlay - Gradient Void */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-12">
        <h1 className="max-w-2xl font-serif text-5xl leading-tight text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/70">
          {subtitle}
        </p>

        {ctaText && (
          <button
            onClick={onCtaClick}
            className="mt-8 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40"
          >
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
