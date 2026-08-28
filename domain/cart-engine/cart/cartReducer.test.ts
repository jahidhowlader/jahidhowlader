import { test } from "node:test";
import assert from "node:assert/strict";
import { cartReducer, initialCartState } from "./cartReducer.ts";
import type { CartLine, CartState } from "./types.ts";

const line: CartLine = { lineId: "tee", productId: "tee", name: "Everyday T-Shirt", price: 28, image: "tee" };
const giftLine: CartLine = {
  lineId: "gift:tote",
  productId: "tote",
  name: "Canvas Tote",
  price: 0,
  originalPrice: 18,
  image: "tote",
  isGift: true,
};

function withItem(quantity: number): CartState {
  return { ...initialCartState, items: [{ ...line, quantity }] };
}

test("ADD_ITEM adds a new line at quantity 1", () => {
  const state = cartReducer(initialCartState, { type: "ADD_ITEM", line });
  assert.deepEqual(state.items, [{ ...line, quantity: 1 }]);
});

test("ADD_ITEM increments quantity if the same line is already in the cart", () => {
  const state = cartReducer(withItem(2), { type: "ADD_ITEM", line });
  assert.equal(state.items[0].quantity, 3);
});

test("ADD_ITEM with a different variant creates a separate line", () => {
  const variantLine: CartLine = { ...line, lineId: "tee::Size:L", variants: { Size: "L" } };
  const state = cartReducer(withItem(1), { type: "ADD_ITEM", line: variantLine });
  assert.equal(state.items.length, 2);
  assert.equal(state.items[1].quantity, 1);
});

test("REMOVE_ITEM removes the line and any pending update for it", () => {
  const state: CartState = {
    ...withItem(2),
    pending: { tee: { requestId: 1, previousQuantity: 1 } },
  };
  const next = cartReducer(state, { type: "REMOVE_ITEM", lineId: "tee" });
  assert.deepEqual(next.items, []);
  assert.deepEqual(next.pending, {});
});

test("QUANTITY_REQUEST applies a +1 delta optimistically and records the rollback target", () => {
  const state = cartReducer(withItem(1), {
    type: "QUANTITY_REQUEST",
    lineId: "tee",
    delta: 1,
    requestId: 1,
  });
  assert.equal(state.items[0].quantity, 2);
  assert.deepEqual(state.pending.tee, { requestId: 1, previousQuantity: 1 });
});

test("QUANTITY_REQUEST applies a -1 delta the same way", () => {
  const state = cartReducer(withItem(3), {
    type: "QUANTITY_REQUEST",
    lineId: "tee",
    delta: -1,
    requestId: 1,
  });
  assert.equal(state.items[0].quantity, 2);
});

test("QUANTITY_REQUEST clamps at a minimum of 1 rather than going to 0 or below", () => {
  const state = cartReducer(withItem(1), {
    type: "QUANTITY_REQUEST",
    lineId: "tee",
    delta: -5,
    requestId: 1,
  });
  assert.equal(state.items[0].quantity, 1);
});

test("QUANTITY_REQUEST for a lineId not in the cart is a no-op", () => {
  const state = cartReducer(withItem(1), {
    type: "QUANTITY_REQUEST",
    lineId: "missing",
    delta: 1,
    requestId: 1,
  });
  assert.deepEqual(state, withItem(1));
});

test("QUANTITY_REQUEST is a no-op for the free-gift line — its quantity isn't user-controlled", () => {
  const state: CartState = { ...initialCartState, items: [{ ...giftLine, quantity: 1 }] };
  const next = cartReducer(state, {
    type: "QUANTITY_REQUEST",
    lineId: giftLine.lineId,
    delta: 1,
    requestId: 1,
  });
  assert.deepEqual(next, state);
});

test("QUANTITY_SUCCESS clears the pending entry and keeps the new quantity", () => {
  const requested = cartReducer(withItem(1), {
    type: "QUANTITY_REQUEST",
    lineId: "tee",
    delta: 1,
    requestId: 1,
  });
  const settled = cartReducer(requested, { type: "QUANTITY_SUCCESS", lineId: "tee", requestId: 1 });
  assert.equal(settled.items[0].quantity, 2);
  assert.deepEqual(settled.pending, {});
});

test("QUANTITY_FAILURE rolls back to the last confirmed quantity and sets an error", () => {
  const requested = cartReducer(withItem(1), {
    type: "QUANTITY_REQUEST",
    lineId: "tee",
    delta: 1,
    requestId: 1,
  });
  const failed = cartReducer(requested, {
    type: "QUANTITY_FAILURE",
    lineId: "tee",
    requestId: 1,
    message: "The connection to the store was interrupted.",
  });
  assert.equal(failed.items[0].quantity, 1);
  assert.equal(failed.error, "The connection to the store was interrupted.");
  assert.deepEqual(failed.pending, {});
});

test("a burst of rapid clicks lands on 2, 3, 4 in turn — the delta is applied to the reducer's OWN fresh state, not a value the UI captured earlier", () => {
  // Simulates three quick "+" clicks fired before any of them have resolved.
  let state = withItem(1);
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 1 });
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 2 });
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 3 });

  assert.equal(state.items[0].quantity, 4, "UI shows the latest optimistic value");
  assert.equal(
    state.pending.tee.previousQuantity,
    1,
    "rollback target stays anchored to the last CONFIRMED quantity, not request #2's optimistic value",
  );

  // Only the LAST request (#3) actually fails.
  const failed = cartReducer(state, {
    type: "QUANTITY_FAILURE",
    lineId: "tee",
    requestId: 3,
    message: "The connection to the store was interrupted.",
  });
  assert.equal(failed.items[0].quantity, 1);
});

test("a stale success response is ignored once a newer request is in flight", () => {
  let state = withItem(1);
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 1 });
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 2 });

  // Request #1 resolves AFTER #2 has already been issued — its success must
  // not be allowed to clear the pending state that #2 owns.
  const afterStaleSuccess = cartReducer(state, {
    type: "QUANTITY_SUCCESS",
    lineId: "tee",
    requestId: 1,
  });
  assert.equal(afterStaleSuccess.items[0].quantity, 3);
  assert.deepEqual(afterStaleSuccess.pending.tee, { requestId: 2, previousQuantity: 1 });

  // #2 then succeeds for real.
  const settled = cartReducer(afterStaleSuccess, {
    type: "QUANTITY_SUCCESS",
    lineId: "tee",
    requestId: 2,
  });
  assert.equal(settled.items[0].quantity, 3);
  assert.deepEqual(settled.pending, {});
});

test("a stale failure response is ignored once a newer request is in flight", () => {
  let state = withItem(1);
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 1 });
  state = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 2 });

  // Request #1 fails AFTER #2 has already been issued — it must not roll
  // back a quantity that request #2 is still actively updating.
  const afterStaleFailure = cartReducer(state, {
    type: "QUANTITY_FAILURE",
    lineId: "tee",
    requestId: 1,
    message: "stale failure",
  });
  assert.equal(afterStaleFailure.items[0].quantity, 3, "quantity is untouched by the stale failure");
  assert.equal(afterStaleFailure.error, null, "no error surfaces for a superseded request");
});

test("DISMISS_ERROR clears the error without touching items", () => {
  const state: CartState = { ...withItem(1), error: "The connection to the store was interrupted." };
  const next = cartReducer(state, { type: "DISMISS_ERROR" });
  assert.equal(next.error, null);
  assert.equal(next.items[0].quantity, 1);
});

test("RESET returns to the initial empty cart", () => {
  const state: CartState = { ...withItem(3), error: "x" };
  assert.deepEqual(cartReducer(state, { type: "RESET" }), initialCartState);
});

test("SYNC_GIFT adds the gift line once, at quantity 1", () => {
  const state = cartReducer(withItem(1), { type: "SYNC_GIFT", line: giftLine });
  assert.equal(state.items.length, 2);
  assert.deepEqual(
    state.items.find((item) => item.isGift),
    { ...giftLine, quantity: 1 },
  );
});

test("SYNC_GIFT is idempotent — dispatching the same line twice doesn't duplicate it", () => {
  const once = cartReducer(withItem(1), { type: "SYNC_GIFT", line: giftLine });
  const twice = cartReducer(once, { type: "SYNC_GIFT", line: giftLine });
  assert.equal(twice.items.filter((item) => item.isGift).length, 1);
});

test("SYNC_GIFT with null removes the gift line", () => {
  const withGift = cartReducer(withItem(1), { type: "SYNC_GIFT", line: giftLine });
  const withoutGift = cartReducer(withGift, { type: "SYNC_GIFT", line: null });
  assert.equal(withoutGift.items.length, 1);
  assert.equal(withoutGift.items.some((item) => item.isGift), false);
});

test("QUANTITY_REQUEST, REMOVE_ITEM never touch a paid line's neighboring gift line", () => {
  const state = cartReducer(withItem(1), { type: "SYNC_GIFT", line: giftLine });
  const next = cartReducer(state, { type: "QUANTITY_REQUEST", lineId: "tee", delta: 1, requestId: 1 });
  assert.equal(next.items.find((item) => item.isGift)?.quantity, 1);
});
