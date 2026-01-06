export type ChronosEvent = {
  id: string;
  ts: number;
  kind: string;
  payload?: Record<string, unknown>;
};

export type ChronosIndex = {
  count: number;
  min_ts: number | null;
  max_ts: number | null;
  by_id: Record<string, number>;
};

const sort_events = (events: ChronosEvent[]): ChronosEvent[] => {
  return [...events].sort((a, b) => {
    if (a.ts !== b.ts) {
      return a.ts - b.ts;
    }
    return a.id.localeCompare(b.id);
  });
};

export class ChronosCore {
  private readonly events: ChronosEvent[] = [];

  append(event: ChronosEvent): ChronosEvent {
    if (!event.id || typeof event.id !== "string") {
      throw new Error("chronos_event_id_required");
    }
    if (typeof event.ts !== "number" || Number.isNaN(event.ts)) {
      throw new Error("chronos_event_ts_required");
    }
    if (!event.kind || typeof event.kind !== "string") {
      throw new Error("chronos_event_kind_required");
    }
    if (this.events.some((e) => e.id === event.id)) {
      throw new Error("chronos_event_id_duplicate");
    }
    this.events.push(event);
    return event;
  }

  range(start_ts: number, end_ts: number): ChronosEvent[] {
    if (typeof start_ts !== "number" || typeof end_ts !== "number") {
      throw new Error("chronos_range_invalid");
    }
    const ordered = sort_events(this.events);
    return ordered.filter((e) => e.ts >= start_ts && e.ts <= end_ts);
  }

  build_index(): ChronosIndex {
    const ordered = sort_events(this.events);
    const by_id: Record<string, number> = {};
    ordered.forEach((event, idx) => {
      by_id[event.id] = idx;
    });
    return {
      count: ordered.length,
      min_ts: ordered.length ? ordered[0].ts : null,
      max_ts: ordered.length ? ordered[ordered.length - 1].ts : null,
      by_id,
    };
  }

  list(): ChronosEvent[] {
    return [...this.events];
  }
}

export const build_chronos_index = (events: ChronosEvent[]): ChronosIndex => {
  const ordered = sort_events(events);
  const by_id: Record<string, number> = {};
  ordered.forEach((event, idx) => {
    by_id[event.id] = idx;
  });
  return {
    count: ordered.length,
    min_ts: ordered.length ? ordered[0].ts : null,
    max_ts: ordered.length ? ordered[ordered.length - 1].ts : null,
    by_id,
  };
};
