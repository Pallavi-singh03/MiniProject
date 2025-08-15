import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem } from '@/types/menu';

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) => {
        console.log("Adding to cart:", item);
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);

// Optional: helper to check hydration
export const hasHydrated = () => {
  return useCartStore.persist?.hasHydrated?.();
};
