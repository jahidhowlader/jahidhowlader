"use client";

import { useState } from "react";
import { demoProducts } from "@/content/cart-engine";
import { buildLineId } from "@/domain/cart-engine/cart/lineId";
import type { Product, SelectedVariants } from "@/domain/cart-engine/cart/types";
import { formatCurrency } from "@/lib/cart-engine/formatCurrency";
import { ProductImage } from "./ProductImage";
import { useCartEngine } from "./CartEngineContext";
import styles from "./DemoControls.module.css";

function defaultVariants(product: Product): SelectedVariants {
  return Object.fromEntries((product.variantGroups ?? []).map((group) => [group.name, group.options[0]]));
}

export function DemoControls() {
  const { addProduct, simulateFailure, setSimulateFailure, reset } = useCartEngine();
  const [selections, setSelections] = useState<Record<string, SelectedVariants>>(() =>
    Object.fromEntries(demoProducts.map((product) => [product.id, defaultVariants(product)])),
  );

  const setVariant = (productId: string, groupName: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [groupName]: value },
    }));
  };

  return (
    <div className={styles.controls}>
      <p className="label">Add a product</p>

      <ul className={styles.productGrid}>
        {demoProducts.map((product) => {
          const hasVariants = (product.variantGroups?.length ?? 0) > 0;
          const variants = selections[product.id] ?? defaultVariants(product);

          return (
            <li key={product.id} className={styles.card}>
              <ProductImage image={product.image} label={product.name} size={72} />

              <div className={styles.cardBody}>
                <div className={styles.details}>
                  <p className={styles.name}>{product.name}</p>
                  <p className={styles.price}>{formatCurrency(product.price)}</p>

                  {hasVariants ? (
                    <div className={styles.variantGroups}>
                      {product.variantGroups?.map((group) => (
                        <div key={group.name} className={styles.variantGroup}>
                          <span className={styles.variantLabel}>{group.name}</span>
                          <div className={styles.variantOptions} role="group" aria-label={`${group.name} for ${product.name}`}>
                            {group.options.map((option) => {
                              const selected = variants[group.name] === option;
                              return (
                                <button
                                  key={option}
                                  type="button"
                                  className={`${styles.variantOption} ${selected ? styles.variantSelected : ""}`}
                                  aria-pressed={selected}
                                  onClick={() => setVariant(product.id, group.name, option)}
                                >
                                  {option}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() =>
                    addProduct({
                      lineId: buildLineId(product, variants),
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      variants: hasVariants ? variants : undefined,
                    })
                  }
                >
                  Add to cart
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.demoRow}>
        <label className={styles.failureToggle}>
          <input
            type="checkbox"
            checked={simulateFailure}
            onChange={(event) => setSimulateFailure(event.target.checked)}
          />
          Simulate network failure
        </label>

        <button type="button" className={styles.resetButton} onClick={reset}>
          Reset demo
        </button>
      </div>
    </div>
  );
}
