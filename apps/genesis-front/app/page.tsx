"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Play, ShieldCheck, Lock, ChevronRight, Activity, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- COMPONENTS ---

// 1. SYSTEM HEADER
const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold tracking-tight">RODOBENS</span>
      <span className="text-lg font-light tracking-widest opacity-80">WEALTH</span>
    </div>

    <nav className="hidden md:flex items-center gap-8">
      {['Private', 'Corporate', 'Agro'].map((item) => (
        <button key={item} className="text-xs font-medium uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          {item}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-6">
       <Link href="/terminal" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest py-2 border-b border-white/0 group-hover:border-white transition-all">
         <span className="group-hover:text-signal-green transition-colors">Acessar Terminal</span>
         <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
       </Link>
    </div>
  </header>
);

// 2. CINEMATIC HERO
const Hero = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center px-8 md:px-24 overflow-hidden bg-black">
      {/* Video Background (Abstract/City) */}
      <div className="absolute inset-0 z-0 opacity-40 grayscale">
         {/* Placeholder for video - using a dark abstract texture for now */}
         <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center" />
         <div className="absolute inset-0 bg-black/60" /> {/* Overlay darkening */}
      </div>

      <div className="z-10 max-w-4xl space-y-8 mt-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="space-y-2"
        >
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
            A Verdade Matemática
            <br />
            <span className="text-gray-500">do Patrimônio.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-400 max-w-xl font-light leading-relaxed"
        >
          O Genesis elimina a incerteza da alavancagem. Auditoria algorítmica para aquisição de ativos <span className="text-white font-medium">High-Ticket</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 pt-4"
        >
          <Link href="/terminal" className="px-8 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-signal-green hover:text-white transition-all duration-300">
            Iniciar Auditoria
          </Link>

          <button className="px-8 py-4 text-white border border-white/20 text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-3 backdrop-blur-sm">
            <Play className="w-3 h-3 fill-current" />
            Ver o Filme
          </button>
        </motion.div>

        {/* Trust Metric */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1.2 }}
           className="absolute bottom-12 left-8 md:left-24 flex items-center gap-3 text-white/40"
        >
           <Activity className="w-4 h-4" />
           <span className="text-xs font-mono uppercase tracking-widest">System Status: <span className="text-signal-green">Active</span> • Genesis OS v2.1</span>
        </motion.div>
      </div>
    </section>
  );
};

// 3. OPPORTUNITY CARD COMPONENT
const OpportunityCard = ({ title, img, badges, delay }: { title: string, img: string, badges: string[], delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className="group relative h-[500px] w-full overflow-hidden border-r border-white/10 last:border-r-0 bg-black"
    >
      {/* Background Image */}
      <Image
        src={img}
        alt={title}
        fill
        className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end items-start z-10">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
           {badges.map(b => (
             <span key={b} className="px-2 py-1 bg-signal-green/10 border border-signal-green/20 text-signal-green text-[10px] uppercase font-bold tracking-wider backdrop-blur-md">
               {b}
             </span>
           ))}
        </div>

        <h3 className="text-3xl font-bold text-white uppercase tracking-tighter mb-2 group-hover:text-white transition-colors">
          {title}
        </h3>

        <div className="h-px w-0 group-hover:w-full bg-signal-green transition-all duration-700 mb-6" />

        <Link href="/terminal" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
          <span className="border-b border-transparent group-hover:border-white pb-0.5 transition-all">Auditar Ativo</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
};

// 4. AUDITED OPPORTUNITIES SECTION
const AuditedOpportunities = () => {
  return (
    <section className="bg-black py-32 border-t border-white/10">
      <div className="px-8 md:px-24 mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
           <span className="text-signal-green font-mono text-xs tracking-widest uppercase mb-4 block">The Portfolio</span>
           <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter max-w-2xl">
             Oportunidades <span className="text-gray-600">Auditadas.</span>
           </h2>
        </div>
        <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
          Ativos reais, pré-validados pelo algoritmo Trustware, prontos para alocação imediata de crédito.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-y border-white/10">
         <OpportunityCard
           title="Frota Pesada Scania"
           img="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2670&auto=format&fit=crop"
           badges={['Crédito: R$ 750k', 'Taxa: 0.98% a.m.', 'Viabilidade: Alta']}
           delay={0.1}
         />
         <OpportunityCard
           title="Jardins Private Estate"
           img="https://images.unsplash.com/photo-1600596542815-60c37c6525fa?q=80&w=2670&auto=format&fit=crop"
           badges={['Liquidez Imediata', 'ROI Projetado: 14%', 'Zona Exclusiva']}
           delay={0.2}
         />
      </div>

      <div className="flex justify-center mt-16">
        <Link href="/wealth/portfolio" className="text-xs text-gray-500 font-mono hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
           <TrendingUp className="w-4 h-4" /> Ver Todas as Oportunidades
        </Link>
      </div>
    </section>
  );
};

// 5. FOOTER
const Footer = () => (
  <footer className="bg-black py-12 border-t border-white/10">
     <div className="px-8 md:px-24 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
           <span className="font-bold text-white">RODOBENS</span>
           <span className="font-light text-white">WEALTH</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-gray-600 uppercase tracking-widest">
           <span>Genesis OS v2.1</span>
           <span className="px-2 text-gray-800">|</span>
           <div className="flex items-center gap-2 text-signal-green">
              <ShieldCheck className="w-3 h-3 animate-pulse" />
              <span>Auditoria Ativa</span>
           </div>
        </div>
     </div>
  </footer>
);

export default function Home() {
  return (
    <main className="bg-black min-h-screen selection:bg-signal-green selection:text-white">
      <Header />
      <Hero />
      <AuditedOpportunities />
      <Footer />
    </main>
  );
}
