import type { CartAction, CartState } from "./types.ts";

export const initialCartState: CartState = {
  items: [],
  pending: {},
  error: null,
};

function withoutKey<T extends Record<string, unknown>>(record: T, key: string): T {
  const next = { ...record };
  delete next[key];
  return next;
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => item.lineId === action.line.lineId);
      const items = existing
        ? state.items.map((item) =>
            item.lineId === action.line.lineId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.items, { ...action.line, quantity: 1 }];
      return { ...state, items };
    }

    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.lineId !== action.lineId),
        pending: withoutKey(state.pending, action.lineId),
      };
    }

    case "QUANTITY_REQUEST": {
      const current = state.items.find((item) => item.lineId === action.lineId);
      // The free gift isn't user-editable — its quantity is owned entirely
      // by the reward sync, never by a click.
      if (!current || current.isGift) return state;

      const existingPending = state.pending[action.lineId];
      // A burst of rapid clicks produces several in-flight requests for the
      // same line. Only the FIRST one in the burst knows the last confirmed
      // quantity; every request after it must keep pointing at that same
      // value, or a later failure would roll back to an intermediate
      // optimistic quantity instead of the last quantity the "server" agreed to.
      const previousQuantity = existingPending?.previousQuantity ?? current.quantity;

      // The delta is applied to `current.quantity` — the reducer's OWN,
      // always-fresh state — rather than to a quantity value the caller
      // read from a render closure. Three rapid clicks dispatched before a
      // single re-render still land on 3, 4, 5 in turn, because React
      // guarantees each dispatch in a batch is applied to the PREVIOUS
      // dispatch's resulting state, not to whatever the UI last rendered.
      const nextQuantity = Math.max(1, current.quantity + action.delta);

      return {
        ...state,
        error: null,
        items: state.items.map((item) =>
          item.lineId === action.lineId ? { ...item, quantity: nextQuantity } : item,
        ),
        pending: {
          ...state.pending,
          [action.lineId]: { requestId: action.requestId, previousQuantity },
        },
      };
    }

    case "QUANTITY_SUCCESS": {
      const pending = state.pending[action.lineId];
      // If a newer request has already been issued for this line, its own
      // resolution owns the outcome — this response is stale and is ignored
      // rather than allowed to overwrite a more recent optimistic update.
      if (!pending || pending.requestId !== action.requestId) return state;
      return { ...state, pending: withoutKey(state.pending, action.lineId) };
    }

    case "QUANTITY_FAILURE": {
      const pending = state.pending[action.lineId];
      if (!pending || pending.requestId !== action.requestId) return state;
      return {
        ...state,
        pending: withoutKey(state.pending, action.lineId),
        error: action.message,
        items: state.items.map((item) =>
          item.lineId === action.lineId ? { ...item, quantity: pending.previousQuantity } : item,
        ),
      };
    }

    case "SYNC_GIFT": {
      const withoutGift = state.items.filter((item) => !item.isGift);
      if (!action.line) {
        // Already absent — return the same reference so this is a true no-op.
        if (withoutGift.length === state.items.length) return state;
        return { ...state, items: withoutGift };
      }
      const alreadyPresent = state.items.some(
        (item) => item.isGift && item.lineId === action.line?.lineId,
      );
      if (alreadyPresent && withoutGift.length === state.items.length - 1) return state;
      return { ...state, items: [...withoutGift, { ...action.line, quantity: 1 }] };
    }

    case "DISMISS_ERROR":
      return { ...state, error: null };

    case "RESET":
      return initialCartState;

    default:
      return state;
  }
}
