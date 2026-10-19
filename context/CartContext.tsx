"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * HAFIZ NUTS - cart state.
 *
 * One client-side source of truth for the cart, wrapped around the app in
 * `app/layout.tsx`. The same context also owns the drawer's open state, so the
 * header toggle and the "add to cart" buttons never have to coordinate through
 * props.
 *
 * ## Why an external store rather than `useState` + an effect
 *
 * The cart has to survive a refresh, which means it lives in `localStorage`
 * - a store that outlives the component. Reading it during the initial render
 * would break SSR/prerendering (no `window` on the server) and, worse, would
 * make the first client render disagree with the server HTML for anyone who
 * already has a saved cart. Deferring that read into an effect avoids the
 * mismatch but makes React re-render twice on every load.
 *
 * `useSyncExternalStore` is the API designed for exactly this. It renders the
 * server snapshot on the server and during hydration - so the markup matches
 * - and then swaps to the real snapshot, which is `localStorage` here.
 *
 * Two rules keep it correct:
 *
 * - `getSnapshot` is memoized behind a `hydrated` flag and always returns the
 *   same array reference until something actually changes. Returning a fresh
 *   array on every call would loop React's change check forever.
 * - Every mutation writes through to `localStorage` and then notifies
 *   subscribers. The `storage` event covers *other* tabs; the explicit notify
 *   covers this one, since `storage` never fires in the tab that wrote it.
 *
 * ## Persistence
 *
 * Items are stored under `hafiz_nuts_cart`. Reads are defensive: anything that
 * fails to parse, or parses to a shape this code no longer recognises, is
 * dropped rather than trusted - the cart degrades to empty instead of
 * crashing a page render on a corrupt value.
 */

export type CartItem = {
  id: string;
  name: string;
  /** Pack size, e.g. "30g" or "10 × 30g" for a bundle. */
  size: string;
  pricePkr: number;
  quantity: number;
  image: string;
};

export type CartContextValue = {
  items: readonly CartItem[];
  totalItems: number;
  subtotalPkr: number;
  /** Drawer visibility. */
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** Flips the drawer - used by the header's cart icon. */
  toggleCart: () => void;
  /** Adds an item (or merges into an existing line) and opens the drawer. */
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  /** Sets a quantity; a quantity below 1 removes the line. */
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "hafiz_nuts_cart";

/** Stable server-side snapshot - identical to a fresh, empty cart. */
const EMPTY_ITEMS: readonly CartItem[] = [];

export const CartContext = createContext<CartContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/* The store itself                                                           */
/* -------------------------------------------------------------------------- */

let items: readonly CartItem[] = EMPTY_ITEMS;
let hydrated = false;
const listeners = new Set<() => void>();

/** Narrowing guard for data that has travelled through `localStorage`. */
function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.size === "string" &&
    typeof item.pricePkr === "number" &&
    typeof item.quantity === "number" &&
    typeof item.image === "string" &&
    item.quantity >= 1 &&
    Number.isFinite(item.pricePkr)
  );
}

function readStoredItems(): readonly CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_ITEMS;

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY_ITEMS;
  } catch {
    /* Unreadable or corrupt storage - start from an empty cart. */
    return EMPTY_ITEMS;
  }
}

function writeStoredItems(next: readonly CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Storage full or blocked - the cart still works for this session. */
  }
}

function notify() {
  for (const listener of listeners) listener();
}

/** Commit new items: update memory, persist, and tell every subscriber. */
function commit(next: readonly CartItem[]) {
  items = next;
  writeStoredItems(next);
  notify();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);

  /*
   * Other tabs' writes surface as a `storage` event. Re-read rather than
   * trusting `event.newValue`, so corrupt data is filtered the same way it is
   * on first load.
   */
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      items = readStoredItems();
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): readonly CartItem[] {
  if (!hydrated) {
    items = readStoredItems();
    hydrated = true;
  }

  return items;
}

function getServerSnapshot(): readonly CartItem[] {
  return EMPTY_ITEMS;
}

/* Mutations, expressed against the store rather than React state. */

function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  if (quantity < 1) return;

  const existing = items.find((entry) => entry.id === item.id);

  if (existing) {
    commit(
      items.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      ),
    );
    return;
  }

  commit([...items, { ...item, quantity }]);
}

function removeItem(id: string) {
  commit(items.filter((entry) => entry.id !== id));
}

function updateQuantity(id: string, quantity: number) {
  /* A quantity below 1 means "take it out". */
  if (quantity < 1) {
    removeItem(id);
    return;
  }

  commit(
    items.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)),
  );
}

function clearCart() {
  commit(EMPTY_ITEMS);
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const handleAddItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity?: number) => {
      addItem(item, quantity);
      setIsOpen(true);
    },
    [],
  );

  const handleRemoveItem = useCallback((id: string) => removeItem(id), []);
  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => updateQuantity(id, quantity),
    [],
  );
  const handleClearCart = useCallback(() => clearCart(), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: cartItems,
      totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
      subtotalPkr: cartItems.reduce(
        (total, item) => total + item.pricePkr * item.quantity,
        0,
      ),
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem: handleAddItem,
      removeItem: handleRemoveItem,
      updateQuantity: handleUpdateQuantity,
      clearCart: handleClearCart,
    }),
    [
      cartItems,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      handleAddItem,
      handleRemoveItem,
      handleUpdateQuantity,
      handleClearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
