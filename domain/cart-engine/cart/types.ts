export type ProductImageKey = "tee" | "hoodie" | "tote" | "mug";

export type VariantGroup = {
  name: string;
  options: string[];
};

export type SelectedVariants = Record<string, string>;

export type Product = {
  id: string;
  name: string;
  price: number;
  image: ProductImageKey;
  variantGroups?: VariantGroup[];
};

/** A cart line before a quantity is attached — what the picker and the gift sync both build. */
export type CartLine = {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  image: ProductImageKey;
  variants?: SelectedVariants;
  /** True for the promotional free-gift line — not user-added, not user-editable. */
  isGift?: boolean;
  /** The gift's normal price, shown struck through next to "FREE". */
  originalPrice?: number;
};

export type CartItem = CartLine & { quantity: number };

/** The quantity to roll back to if this line's in-flight request fails. */
export type PendingUpdate = {
  requestId: number;
  previousQuantity: number;
};

export type CartState = {
  items: CartItem[];
  pending: Record<string, PendingUpdate>;
  error: string | null;
};

export type CartAction =
  | { type: "ADD_ITEM"; line: CartLine }
  | { type: "REMOVE_ITEM"; lineId: string }
  | { type: "QUANTITY_REQUEST"; lineId: string; delta: number; requestId: number }
  | { type: "QUANTITY_SUCCESS"; lineId: string; requestId: number }
  | { type: "QUANTITY_FAILURE"; lineId: string; requestId: number; message: string }
  /** Idempotent: pass a line to ensure it's present, or null to ensure it's gone. */
  | { type: "SYNC_GIFT"; line: CartLine | null }
  | { type: "DISMISS_ERROR" }
  | { type: "RESET" };
