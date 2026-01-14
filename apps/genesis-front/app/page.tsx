'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Componente de "Selo" (Detalhe de Cor Primária)
const LiveStatus = () => (
  <div className="flex items-center gap-2">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-green opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-green"></span>
    </span>
    <span className="text-[10px] font-mono tracking-widest uppercase text-ink-light">Genesis Online</span>
  </div>
);

export default function AbsolutWhiteHome() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Efeito Paralaxe: Texto sobe, Imagem desce
  const yText = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div ref={containerRef} className="bg-paper min-h-[200vh] w-full overflow-hidden">

      {/* 1. NAV INVISÍVEL */}
      <nav className="fixed top-0 left-0 w-full px-8 md:px-12 py-8 flex justify-between items-start z-40 mix-blend-difference text-white">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tighter">RODOBENS</span>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-70">Wealth Management</span>
        </div>
        <div className="hidden md:flex gap-12 text-xs font-medium tracking-widest uppercase">
          <a href="#" className="hover:opacity-50 transition-opacity">Private</a>
          <a href="#" className="hover:opacity-50 transition-opacity">Corporate</a>
          <a href="#" className="hover:opacity-50 transition-opacity underline decoration-1 underline-offset-4">Audit</a>
        </div>
        <LiveStatus />
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative h-screen w-full flex flex-col justify-center px-8 md:px-32 pt-20">
        <motion.div style={{ y: yText }} className="z-10 max-w-6xl">
          <h1 className="text-5xl md:text-[7rem] leading-[0.9] font-bold tracking-tighter text-ink mb-12">
            A verdade <br />
            matemática <br />
            <span className="text-ink-light font-light italic">do patrimônio.</span>
          </h1>

          <div className="flex flex-col md:flex-row gap-12 items-start max-w-2xl mt-12">
            <p className="text-sm md:text-base text-ink-light leading-relaxed font-medium">
              O Genesis não pede confiança. Ele prova solidez. <br/>
              Uma infraestrutura de inteligência para aquisição de ativos de alto valor, auditada em tempo real.
            </p>

            <Link href="/terminal" className="group flex items-center gap-4 text-sm font-bold tracking-widest uppercase border-b border-black pb-1 hover:text-signal-green hover:border-signal-green transition-colors">
              Iniciar Auditoria
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-12 left-8 md:left-32 flex flex-col items-start gap-2 opacity-40">
          <span className="text-[10px] font-mono uppercase">Scroll to Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* 3. PARALLAX IMAGE BREAK */}
      <section className="relative w-full h-[80vh] overflow-hidden my-12 group">
        <motion.div style={{ y: yImage }} className="absolute inset-0 w-full h-[120%]">
           {/* Imagem Arquitetural Minimalista (Unsplash) */}
           <div className="relative w-full h-full bg-zinc-200">
             <Image
               src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
               alt="Arquitetura Financeira"
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
             />
             <div className="absolute inset-0 bg-black/5"></div>
           </div>
        </motion.div>

        {/* Card Flutuante (Overlay) */}
        <div className="absolute bottom-12 right-8 md:bottom-24 md:right-32 bg-white p-8 max-w-xs md:max-w-sm shadow-2xl border border-gray-100">
          <span className="text-[10px] font-mono text-signal-green uppercase mb-2 block tracking-widest">Case Realizado</span>
          <h3 className="text-2xl font-bold tracking-tight mb-4">Frota Scania R540</h3>
          <div className="flex justify-between border-t border-gray-100 pt-4 mt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase">Economia</span>
              <span className="font-mono text-lg">R$ 450k</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400 uppercase">Prazo</span>
              <span className="font-mono text-lg">82m</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O PORTAL (Produtos) */}
      <section className="bg-paper py-32 px-8 md:px-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-black pb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter max-w-xl">
            Decisões baseadas em <span className="text-ink-light">dados.</span>
          </h2>
          <span className="font-mono text-xs text-gray-400 mt-8 md:mt-0">
            [ PROTOCOLO TRUSTWARE v2.1 ]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-32">
          {[
            { title: "Consórcio Pesado", value: "0.98% a.m.", desc: "Para renovação de frota e maquinário agrícola high-end." },
            { title: "Imóvel Private", value: "1.12% a.m.", desc: "Alavancagem patrimonial sem juros compostos. Liquidez imediata." },
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-3xl font-bold group-hover:text-signal-green transition-colors">{item.title}</h3>
                <span className="font-mono text-sm border border-gray-200 px-3 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-all">{item.value}</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CALL TO ACTION (Black Piano Transition) */}
      <section className="bg-ink text-white py-40 px-8 md:px-32 flex flex-col items-center text-center">
        <span className="text-signal-green font-mono text-xs tracking-widest uppercase mb-6">Acesso Restrito</span>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
          Entre no Terminal.
        </h2>
        <Link href="/terminal" className="bg-white text-black px-12 py-6 text-sm font-bold tracking-widest uppercase hover:bg-signal-green hover:text-white transition-all duration-300 transform hover:scale-105">
          Acessar Genesis Black
        </Link>
      </section>

    </div>
  );
}
