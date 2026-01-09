export const CHRONOS_VERSION = "0.1.0";

/**
 * Chronos e o nucleo do tempo operacional.
 * Este modulo expõe um core minimo deterministico.
 */
export type ChronosPlaceholder = {
  version: string;
};

export {
  ChronosCore,
  build_chronos_index,
  type ChronosEvent,
  type ChronosIndex,
} from "./core";
