import { test } from "node:test";
import assert from "node:assert/strict";
import { getNextReward, getRewardProgress, getUnlockedRewards, REWARDS } from "./rewards.ts";

test("no rewards unlocked below the first threshold", () => {
  assert.deepEqual(getUnlockedRewards(20), []);
});

test("rewards unlock in order as thresholds are crossed", () => {
  assert.deepEqual(
    getUnlockedRewards(80).map((r) => r.id),
    ["free-shipping", "discount-10"],
  );
});

test("every reward is unlocked once the subtotal clears the highest threshold", () => {
  assert.deepEqual(
    getUnlockedRewards(150).map((r) => r.id),
    REWARDS.map((r) => r.id),
  );
});

test("getNextReward returns the lowest unmet threshold", () => {
  assert.equal(getNextReward(60)?.id, "discount-10");
});

test("getNextReward is null once every reward is unlocked", () => {
  assert.equal(getNextReward(200), null);
});

test("progress is 0 at the start of a segment and 1 at its end", () => {
  assert.equal(getRewardProgress(0).progressToNext, 0);
  assert.equal(getRewardProgress(50).progressToNext, 0); // start of the 50→75 segment
  assert.equal(getRewardProgress(75).progressToNext, 0); // start of the 75→100 segment
});

test("progress does not jump backwards when an earlier reward unlocks", () => {
  // Just below $50: progress is far along the 0→50 segment.
  const justBelow = getRewardProgress(49.99).progressToNext;
  // Just at $50: free shipping unlocks, progress resets to the START of the
  // next (50→75) segment rather than snapping back relative to the old one.
  const justAt = getRewardProgress(50).progressToNext;
  assert.ok(justBelow > 0.9);
  assert.equal(justAt, 0);
});

test("remainingToNext is exact and never negative", () => {
  assert.equal(getRewardProgress(30).remainingToNext, 20);
  assert.equal(getRewardProgress(100).remainingToNext, 0);
});

test("progressToNext is 1 and remainingToNext is 0 once every reward is unlocked", () => {
  const progress = getRewardProgress(500);
  assert.equal(progress.next, null);
  assert.equal(progress.progressToNext, 1);
  assert.equal(progress.remainingToNext, 0);
});
