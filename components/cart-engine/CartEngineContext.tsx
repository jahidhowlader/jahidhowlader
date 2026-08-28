"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { cartReducer, initialCartState } from "@/domain/cart-engine/cart/cartReducer";
import { calculateOrderTotals, calculateSubtotal, type OrderTotals } from "@/domain/cart-engine/cart/selectors";
import type { CartLine, CartState } from "@/domain/cart-engine/cart/types";
import { getRewardProgress, isFreeGiftReward, REWARDS, type RewardProgress } from "@/domain/cart-engine/rewards/rewards";
import { demoProducts } from "@/content/cart-engine";
import { simulateNetwork } from "@/lib/cart-engine/simulatedNetwork";

type CartEngineValue = {
  state: CartState;
  subtotal: number;
  orderTotals: OrderTotals;
  rewardProgress: RewardProgress;
  simulateFailure: boolean;
  setSimulateFailure: (value: boolean) => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  addProduct: (line: CartLine) => void;
  removeItem: (lineId: string) => void;
  changeQuantity: (lineId: string, delta: number) => void;
  dismissError: () => void;
  reset: () => void;
};

const CartEngineContext = createContext<CartEngineValue | null>(null);

const giftReward = REWARDS.find(isFreeGiftReward) ?? null;
const giftProduct = giftReward ? demoProducts.find((product) => product.id === giftReward.giftProductId) ?? null : null;

export function CartEngineProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const requestIdRef = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const addProduct = useCallback((line: CartLine) => {
    dispatch({ type: "ADD_ITEM", line });
    // A real storefront confirms the add by showing the cart, not by
    // leaving the shopper to go find it themselves.
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    dispatch({ type: "REMOVE_ITEM", lineId });
  }, []);

  const changeQuantity = useCallback(
    (lineId: string, delta: number) => {
      const requestId = (requestIdRef.current += 1);
      dispatch({ type: "QUANTITY_REQUEST", lineId, delta, requestId });

      simulateNetwork(null, { forceFail: simulateFailure }).then(
        () => dispatch({ type: "QUANTITY_SUCCESS", lineId, requestId }),
        (error: Error) =>
          dispatch({ type: "QUANTITY_FAILURE", lineId, requestId, message: error.message }),
      );
    },
    [simulateFailure],
  );

  const dismissError = useCallback(() => dispatch({ type: "DISMISS_ERROR" }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const subtotal = calculateSubtotal(state.items);
  const rewardProgress = getRewardProgress(subtotal);
  const orderTotals = calculateOrderTotals(state.items);

  // The free gift is a real cart line kept in sync with reward state, not a
  // message layered on top: the instant the (gift-excluded) subtotal clears
  // the threshold the line is added, and the instant it drops back below,
  // the line is removed — in both directions, from quantity changes,
  // removals, or a rolled-back optimistic update alike.
  useEffect(() => {
    if (!giftReward || !giftProduct) return;

    const unlocked = subtotal >= giftReward.threshold;
    const hasGiftLine = state.items.some((item) => item.isGift);
    if (unlocked === hasGiftLine) return;

    const line: CartLine | null = unlocked
      ? {
          lineId: `gift:${giftProduct.id}`,
          productId: giftProduct.id,
          name: giftProduct.name,
          image: giftProduct.image,
          price: 0,
          originalPrice: giftProduct.price,
          isGift: true,
        }
      : null;

    dispatch({ type: "SYNC_GIFT", line });
  }, [subtotal, state.items]);

  const value = useMemo<CartEngineValue>(
    () => ({
      state,
      subtotal,
      orderTotals,
      rewardProgress,
      simulateFailure,
      setSimulateFailure,
      drawerOpen,
      openDrawer,
      closeDrawer,
      triggerRef,
      addProduct,
      removeItem,
      changeQuantity,
      dismissError,
      reset,
    }),
    [
      state,
      subtotal,
      orderTotals,
      rewardProgress,
      simulateFailure,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addProduct,
      removeItem,
      changeQuantity,
      dismissError,
      reset,
    ],
  );

  return <CartEngineContext.Provider value={value}>{children}</CartEngineContext.Provider>;
}

export function useCartEngine(): CartEngineValue {
  const value = useContext(CartEngineContext);
  if (!value) {
    throw new Error("useCartEngine must be used within a CartEngineProvider");
  }
  return value;
}
