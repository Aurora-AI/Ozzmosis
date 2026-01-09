import assert from "node:assert/strict";

import { ChronosCore, build_chronos_index } from "../src/core";

const core = new ChronosCore();

core.append({ id: "e2", ts: 200, kind: "note", payload: { v: 2 } });
core.append({ id: "e1", ts: 100, kind: "note", payload: { v: 1 } });

const range = core.range(100, 150);
assert.equal(range.length, 1);
assert.equal(range[0]?.id, "e1");

const index = core.build_index();
assert.equal(index.count, 2);
assert.equal(index.min_ts, 100);
assert.equal(index.max_ts, 200);
assert.equal(index.by_id.e1, 0);
assert.equal(index.by_id.e2, 1);

const direct = build_chronos_index([
  { id: "x2", ts: 2, kind: "k" },
  { id: "x1", ts: 1, kind: "k" },
]);
assert.equal(direct.count, 2);
assert.equal(direct.min_ts, 1);
assert.equal(direct.max_ts, 2);

console.log("chronos.core.test OK");
