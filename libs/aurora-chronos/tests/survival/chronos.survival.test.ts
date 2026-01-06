import assert from "node:assert/strict";

import { ChronosCore } from "../../src/core";

const core = new ChronosCore();

core.append({ id: "s1", ts: 10, kind: "signal" });
core.append({ id: "s2", ts: 20, kind: "signal" });

const range = core.range(0, 15);
assert.equal(range.length, 1);
assert.equal(range[0]?.id, "s1");

const index = core.build_index();
assert.equal(index.count, 2);
assert.equal(index.by_id.s1, 0);

let duplicate_ok = false;
try {
  core.append({ id: "s1", ts: 30, kind: "signal" });
} catch (err) {
  duplicate_ok = true;
}

assert.equal(duplicate_ok, true);

console.log("chronos.survival.test OK");
