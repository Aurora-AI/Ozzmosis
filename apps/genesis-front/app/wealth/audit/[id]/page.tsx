"use client";

import React from "react";
import { TrustwareFocusMode } from "../../../../components/wealth/layout/TrustwareFocusMode";
import { TrustwareTerminalMount } from "../../../../components/wealth/placeholders/TrustwareTerminalMount";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function WealthAuditPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <TrustwareFocusMode>
      <div className="mb-6 flex items-center justify-between">
         <Link href="/wealth/dashboard" className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
         </Link>
         <span className="font-mono text-xs text-white/20">AUDIT_SESSION_ID: {id?.toUpperCase() || "UNKNOWN"}</span>
      </div>

      <TrustwareTerminalMount />
    </TrustwareFocusMode>
  );
}
