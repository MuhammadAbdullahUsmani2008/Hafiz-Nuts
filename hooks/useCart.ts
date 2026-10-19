"use client";

import { useContext } from "react";

import { CartContext, type CartContextValue } from "@/context/CartContext";

/**
 * HAFIZ NUTS - cart accessor.
 *
 * Throws when called outside the provider rather than returning a silent
 * no-op: a button that "adds to cart" without a cart is worse than a loud
 * failure during development.
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within <CartProvider>");
  }

  return context;
}
