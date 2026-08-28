import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotals, calculateSubtotal, totalItemCount } from "./selectors.ts";
import type { CartItem } from "./types.ts";

const items: CartItem[] = [
  { lineId: "a", productId: "a", name: "A", price: 10, image: "tee", quantity: 2 },
  { lineId: "b", productId: "b", name: "B", price: 5.5, image: "mug", quantity: 3 },
];

const giftItem: CartItem = {
  lineId: "gift:tote",
  productId: "tote",
  name: "Canvas Tote",
  price: 0,
  originalPrice: 18,
  image: "tote",
  quantity: 1,
  isGift: true,
};

test("calculateSubtotal sums price times quantity across items", () => {
  assert.equal(calculateSubtotal(items), 10 * 2 + 5.5 * 3);
});

test("calculateSubtotal returns 0 for an empty cart", () => {
  assert.equal(calculateSubtotal([]), 0);
});

test("calculateSubtotal excludes gift lines even though they're real items", () => {
  assert.equal(calculateSubtotal([...items, giftItem]), calculateSubtotal(items));
});

test("calculateSubtotal doesn't drift with repeated fractional-cent-prone prices", () => {
  const trickyItems: CartItem[] = Array.from({ length: 10 }, (_, i) => ({
    lineId: `item-${i}`,
    productId: `item-${i}`,
    name: "Item",
    price: 0.1,
    image: "mug" as const,
    quantity: 1,
  }));
  assert.equal(calculateSubtotal(trickyItems), 1);
});

test("totalItemCount sums quantities, not line count", () => {
  assert.equal(totalItemCount(items), 5);
});

test("calculateOrderTotals applies no discount and base shipping below every threshold", () => {
  const totals = calculateOrderTotals([{ ...items[0], quantity: 1 }]); // $10
  assert.equal(totals.subtotal, 10);
  assert.equal(totals.discountPercent, null);
  assert.equal(totals.discount, 0);
  assert.equal(totals.freeShipping, false);
  assert.equal(totals.shipping, 5);
  assert.equal(totals.total, 15);
});

test("calculateOrderTotals grants free shipping at $50 and charges nothing for it", () => {
  const totals = calculateOrderTotals([{ ...items[0], price: 50, quantity: 1 }]);
  assert.equal(totals.freeShipping, true);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.total, 50);
});

test("calculateOrderTotals applies a correct 10% discount at $75, from the actual subtotal", () => {
  const totals = calculateOrderTotals([{ ...items[0], price: 80, quantity: 1 }]);
  assert.equal(totals.subtotal, 80);
  assert.equal(totals.discountPercent, 10);
  assert.equal(totals.discount, 8);
  assert.equal(totals.freeShipping, true);
  assert.equal(totals.total, 72);
});

test("calculateOrderTotals matches a hand-checkable example: $40 + $35 = $75, 10% off = -$7.50, total $67.50", () => {
  const cart: CartItem[] = [
    { lineId: "a", productId: "a", name: "A", price: 20, image: "tee", quantity: 2 },
    { lineId: "b", productId: "b", name: "B", price: 35, image: "mug", quantity: 1 },
  ];
  const totals = calculateOrderTotals(cart);
  assert.equal(totals.subtotal, 75);
  assert.equal(totals.discount, 7.5);
  assert.equal(totals.freeShipping, true);
  assert.equal(totals.total, 67.5);
});

test("calculateOrderTotals never charges shipping or a discount on an empty cart", () => {
  const totals = calculateOrderTotals([]);
  assert.equal(totals.subtotal, 0);
  assert.equal(totals.shipping, 0);
  assert.equal(totals.discount, 0);
  assert.equal(totals.total, 0);
});

test("calculateOrderTotals excludes the free gift from the subtotal a discount is computed from", () => {
  const withoutGift = calculateOrderTotals([{ ...items[0], price: 100, quantity: 1 }]);
  const withGift = calculateOrderTotals([{ ...items[0], price: 100, quantity: 1 }, giftItem]);
  assert.deepEqual(withGift, withoutGift);
});
