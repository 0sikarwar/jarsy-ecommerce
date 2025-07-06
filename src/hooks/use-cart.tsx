
"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useToast } from "./use-toast";
import type { Cart } from "@medusajs/types";
import { medusaSdk } from "@/lib/mdedusa-sdk";

const REGION_ID = "reg_01JYXR4EHCTQMY10K0HFH4Y3MF"; // You might want to make this dynamic based on user location

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  retrieveCart: (cartId: string) => Promise<Cart | null>;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getCartId = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("cart_id");
    }
    return null;
  };

  const setCartId = (cartId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart_id", cartId);
    }
  };

  const removeCartId = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart_id");
    }
  };

  const createNewCart = useCallback(async () => {
    try {
      const { cart: newCart } = await medusaSdk.store.carts.create({ region_id: REGION_ID });
      setCart(newCart);
      if (newCart.id) {
        setCartId(newCart.id);
      }
      return newCart;
    } catch (error) {
      console.error("Failed to create cart", error);
      toast({ variant: "destructive", title: "Error", description: "Could not create a new cart." });
      return null;
    }
  }, [toast]);

  const retrieveCart = useCallback(
    async (cartId: string) => {
      try {
        const { cart: retrievedCart } = await medusaSdk.store.carts.retrieve(cartId);
        setCart(retrievedCart);
        return retrievedCart;
      } catch (error) {
        // If cart not found, it might have been completed, so create a new one.
        console.error("Failed to retrieve cart, creating a new one.", error);
        removeCartId();
        return await createNewCart();
      }
    },
    [createNewCart]
  );

  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true);
      const cartId = getCartId();
      if (cartId) {
        await retrieveCart(cartId);
      } else {
        await createNewCart();
      }
      setIsLoading(false);
    };
    initializeCart();
  }, [createNewCart, retrieveCart]);

  const addToCart = async (variantId: string, quantity: number) => {
    let currentCart = cart;
    if (!currentCart?.id) {
      currentCart = await createNewCart();
      if (!currentCart) {
        toast({ variant: "destructive", title: "Error", description: "Cart not available." });
        return;
      }
    }
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await medusaSdk.store.carts.lineItems.add(currentCart.id, {
        variant_id: variantId,
        quantity,
      });
      setCart(updatedCart);
      toast({ title: "Added to cart", description: "Item has been added to your cart." });
    } catch (error) {
      console.error("Failed to add item to cart", error);
      toast({ variant: "destructive", title: "Error", description: "Could not add item to cart." });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) {
      toast({ variant: "destructive", title: "Error", description: "Cart not available." });
      return;
    }
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await medusaSdk.store.carts.lineItems.delete(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
      toast({ variant: "destructive", title: "Error", description: "Could not remove item from cart." });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) {
      toast({ variant: "destructive", title: "Error", description: "Cart not available." });
      return;
    }
    if (quantity <= 0) {
      await removeFromCart(lineId);
      return;
    }
    setIsLoading(true);
    try {
      const { cart: updatedCart } = await medusaSdk.store.carts.lineItems.update(cart.id, lineId, { quantity });
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update item quantity", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update item quantity." });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    removeCartId();
    await createNewCart();
    setIsLoading(false);
  };

  const totalPrice = useMemo(() => {
    return cart?.total ? cart.total / 100 : 0;
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart?.items?.reduce((count, item) => count + item.quantity, 0) || 0;
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        retrieveCart,
        totalPrice,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
