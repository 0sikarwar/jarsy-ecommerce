"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { CartLineItemDTO, StoreCartLineItem } from "@medusajs/types";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, totalPrice, itemCount, isLoading } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-5 w-5 text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Open shopping cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {isLoading && !cart ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="h-16 w-16 text-muted-foreground mb-4 animate-spin" />
            <p className="text-lg font-semibold">Loading Cart...</p>
          </div>
        ) : cart?.items && cart.items.length > 0 ? (
          <>
            <ScrollArea className="flex-grow pr-4">
              <div className="space-y-4">
                {cart.items.map((item: StoreCartLineItem) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.thumbnail || "https://placehold.co/64x64.png"}
                      alt={item.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">₹{Number(item.unit_price).toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{Number(item.quantity)}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          disabled={isLoading}
                          onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" disabled={isLoading} onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto">
              <div className="w-full space-y-4">
                <Separator />
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground">Add some shoes to get started!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
