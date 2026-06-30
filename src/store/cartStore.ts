import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  increaseQuantity: (id: string, size: string) => void;
  decreaseQuantity: (id: string, size: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();

        const existingItem = items.find(
          (i) => i.id === newItem.id && i.size === newItem.size
        );

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === newItem.id && i.size === newItem.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, quantity: 1 }] });
        }
      },

      removeItem: (id, size) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.size === size)),
        });
      },

      increaseQuantity: (id, size) => {
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
      },

      decreaseQuantity: (id, size) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((i) => i.id === id && i.size === size);

        if (targetItem?.quantity === 1) {
          get().removeItem(id, size);
        } else {
          set({
            items: currentItems.map((i) =>
              i.id === id && i.size === size
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'arabica-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);