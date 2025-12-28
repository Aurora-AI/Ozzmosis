type LogEvent = {
  organ: "chronos";
  action: string;
  status: "success" | "failure" | "info";
  meta?: Record<string, unknown>;
};

export function logEvent(evt: LogEvent) {
  const payload = JSON.stringify(evt);
  if (evt.status === "failure") {
    console.error(payload);
    return;
  }
  console.log(payload);
}
