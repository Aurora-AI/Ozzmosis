"use client";

import React from "react";
import { SuitabilityAlphaSlot, type SuitabilityAlphaSlotModel } from "./SuitabilityAlphaSlot";
import { TCOMirrorSlot, type TCOMirrorSlotModel } from "./TCOMirrorSlot";
import { getSlotType, isTrustwareSlotType, type TrustwareSlotType } from "../../../src/lib/templates/slots/slotRegistry";
import { TrustwareStateBadge } from "../../trustware/TrustwareStateBadge";
import { TrustwareStateFrame } from "../../trustware/TrustwareStateFrame";

type TrustwareSlotModel = SuitabilityAlphaSlotModel | TCOMirrorSlotModel;

export type TrustwareSlotRendererProps = {
  payload?: unknown; // pode vir do builder no futuro; aqui é neutro
  isLoading?: boolean;
  error?: string | null;
  onExplain?: () => void; // educativo; não conversão
};

function FallbackCard(props: { title: string; message: string; detail?: string; state?: "blocked" | "insufficient_data" }) {
  const { title, message, detail, state = "insufficient_data" } = props;
  return (
    <TrustwareStateFrame state={state} title={title}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{message}</p>
        <TrustwareStateBadge state={state} />
      </div>
      {detail ? <p className="mt-2 text-[10px] font-mono text-muted-foreground opacity-60 line-clamp-2">{detail}</p> : null}
      <p className="mt-4 text-[10px] text-muted-foreground border-t pt-4">
        Sincronizando telemetria técnica... Nenhuma inferência foi feita. Este bloco é apenas roteamento técnico.
      </p>
    </TrustwareStateFrame>
  );
}

function renderKnownSlot(slotType: TrustwareSlotType, payload: TrustwareSlotModel, onExplain?: () => void) {
  switch (slotType) {
    case "SuitabilityAlphaSlot":
      return <SuitabilityAlphaSlot data={payload as SuitabilityAlphaSlotModel} onExplain={onExplain} />;
    case "TCOMirrorSlot":
      return <TCOMirrorSlot data={payload as TCOMirrorSlotModel} onExplain={onExplain} />;
    default:
      return (
        <FallbackCard
          title="Slot desconhecido"
          message="Este slot não está registrado no catálogo canônico."
          detail={`slot_type: ${slotType}`}
          state="blocked"
        />
      );
  }
}

export function TrustwareSlotRenderer(props: TrustwareSlotRendererProps) {
  const { payload, isLoading, error, onExplain } = props;

  if (isLoading) {
    return <FallbackCard title="Carregando" message="Sincronizando telemetria técnica..." />;
  }

  if (error) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Falha na integridade do contrato."
        detail={error}
        state="blocked"
      />
    );
  }

  const slotTypeRaw = getSlotType(payload);

  if (!slotTypeRaw) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Dados insuficientes para decisão."
        detail="Payload ausente ou sem slot_type. Não inferimos sem envelope mínimo."
      />
    );
  }

  if (!isTrustwareSlotType(slotTypeRaw)) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Dados insuficientes para decisão."
        detail={`Slot não reconhecido pelo catálogo canônico. slot_type: ${slotTypeRaw}`}
      />
    );
  }

  // Aqui assumimos que payload já foi validado pelo validator do template contract,
  // ou que é um payload confiável (ex.: demos). Mesmo assim, não crashamos.
  try {
    return renderKnownSlot(slotTypeRaw, payload as TrustwareSlotModel, onExplain);
  } catch (e) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Falha na integridade do contrato."
        detail={String(e)}
        state="blocked"
      />
    );
  }
}
