import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string;
  reply?: string;
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

interface StoreState {
  categories: Category[];
  products: Product[];
  messages: Message[];
  cart: CartItem[];
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  toggleCategoryActive: (id: string) => void;
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  
  // Message actions
  addMessage: (message: Omit<Message, 'id' | 'createdAt' | 'isRead'>) => void;
  replyToMessage: (id: string, reply: string) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  
  // Cart actions
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Latest gadgets and tech', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Gaming', description: 'Gaming gear and accessories', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Accessories', description: 'Premium accessories', isActive: true, createdAt: new Date().toISOString() },
];

const initialProducts: Product[] = [
  { id: '1', name: 'Gaming Keyboard RGB', description: 'Mechanical keyboard with RGB lighting', price: 149.99, categoryId: '2', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400', stock: 50, isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Wireless Gaming Mouse', description: 'High precision wireless mouse', price: 79.99, categoryId: '2', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', stock: 30, isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'Gaming Headset Pro', description: '7.1 surround sound headset', price: 199.99, categoryId: '2', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400', stock: 25, isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Smart Watch Elite', description: 'Advanced fitness tracking', price: 299.99, categoryId: '1', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', stock: 40, isActive: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Wireless Earbuds Pro', description: 'Active noise cancellation', price: 179.99, categoryId: '1', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', stock: 60, isActive: true, createdAt: new Date().toISOString() },
  { id: '6', name: 'Premium Phone Case', description: 'Military grade protection', price: 49.99, categoryId: '3', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400', stock: 100, isActive: true, createdAt: new Date().toISOString() },
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      categories: initialCategories,
      products: initialProducts,
      messages: [],
      cart: [],

      // Category actions
      addCategory: (category) =>
        set((state) => ({
          categories: [...state.categories, { ...category, id: generateId(), createdAt: new Date().toISOString() }],
        })),

      updateCategory: (id, category) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...category } : c)),
        })),

      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          products: state.products.filter((p) => p.categoryId !== id),
        })),

      toggleCategoryActive: (id) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
        })),

      // Product actions
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: generateId(), createdAt: new Date().toISOString() }],
        })),

      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...product } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      toggleProductActive: (id) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
        })),

      // Message actions
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, { ...message, id: generateId(), createdAt: new Date().toISOString(), isRead: false }],
        })),

      replyToMessage: (id, reply) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, reply, isRead: true } : m)),
        })),

      markMessageAsRead: (id) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        })),

      // Cart actions
      addToCart: (productId) =>
        set((state) => {
          const existing = state.cart.find((item) => item.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity: 1 }] };
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),

      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'ecommerce-store',
    }
  )
);
