import type { Product, SelectedVariants } from "./types.ts";

/**
 * Two selections of the same product are different cart lines the moment
 * their variants differ, so the id has to fold the selected variants in —
 * not just the product id.
 */
export function buildLineId(product: Product, variants?: SelectedVariants): string {
  const groups = product.variantGroups ?? [];
  if (groups.length === 0 || !variants) return product.id;

  const signature = groups.map((group) => `${group.name}:${variants[group.name] ?? ""}`).join("|");
  return `${product.id}::${signature}`;
}
