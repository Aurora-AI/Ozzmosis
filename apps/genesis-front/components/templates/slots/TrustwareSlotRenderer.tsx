"use client";

import React from "react";
import { SuitabilityAlphaSlot, type SuitabilityAlphaSlotModel } from "./SuitabilityAlphaSlot";
import { TCOMirrorSlot, type TCOMirrorSlotModel } from "./TCOMirrorSlot";
import { getSlotType, isTrustwareSlotType, type TrustwareSlotType } from "../../../src/lib/templates/slots/slotRegistry";

type TrustwareSlotModel = SuitabilityAlphaSlotModel | TCOMirrorSlotModel;

export type TrustwareSlotRendererProps = {
  payload?: unknown; // pode vir do builder no futuro; aqui é neutro
  isLoading?: boolean;
  error?: string | null;
  onExplain?: () => void; // educativo; não conversão
};

function FallbackCard(props: { title: string; message: string; detail?: string }) {
  const { title, message, detail } = props;
  return (
    <section className="rounded-2xl border bg-background p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {detail ? <p className="mt-2 text-xs text-muted-foreground">{detail}</p> : null}
      <p className="mt-4 text-xs text-muted-foreground">
        Nenhuma inferência foi feita. Este bloco é apenas roteamento e evidência.
      </p>
    </section>
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
        />
      );
  }
}

export function TrustwareSlotRenderer(props: TrustwareSlotRendererProps) {
  const { payload, isLoading, error, onExplain } = props;

  if (isLoading) {
    return <FallbackCard title="Carregando" message="Preparando slot (sem inferência)." />;
  }

  if (error) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Não foi possível renderizar este slot (erro de entrada/contrato)."
        detail={error}
      />
    );
  }

  const slotTypeRaw = getSlotType(payload);

  if (!slotTypeRaw) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Payload ausente ou sem slot_type. Não inferimos sem envelope mínimo."
      />
    );
  }

  if (!isTrustwareSlotType(slotTypeRaw)) {
    return (
      <FallbackCard
        title="Análise manual pendente"
        message="Slot não reconhecido pelo catálogo canônico."
        detail={`slot_type: ${slotTypeRaw}`}
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
        message="Falha ao renderizar slot apesar de reconhecido. Nenhuma inferência foi feita."
        detail={String(e)}
      />
    );
  }
}
