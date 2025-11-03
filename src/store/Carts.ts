// import create from "zustand";
// import { CartItem } from "../types";

// type CartState = {
//   items: CartItem[];
//   addItem: (item: CartItem) => void;
//   updateQty: (id: string, qty: number) => void;
//   removeItem: (id: string) => void;
//   clear: () => void;
//   subtotal: () => number;
// };

// export const useCart = create<CartState>((set, get) => ({
//   items: [],
//   addItem: (item) => {
//     const items = get().items;
//     const exists = items.find(i => i.id === item.id);
//     if (exists) {
//       set({
//         items: items.map(i => i.id === item.id ? {...i, quantity: i.quantity + item.quantity} : i)
//       });
//     } else {
//       set({ items: [...items, item] });
//     }
//   },
//   updateQty: (id, qty) => set({ items: get().items.map(i => i.id === id ? {...i, quantity: qty} : i) }),
//   removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
//   clear: () => set({ items: [] }),
//   subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
// }));
