
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Loader2, ChevronsRight, Truck } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCustomer } from "@/hooks/use-customer";
import { medusaSdk } from "@/lib/mdedusa-sdk";
import type { ShippingOption, AddressPayload, Cart } from "@medusajs/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Address schema for validation
const addressSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  address_1: z.string().min(5, "Address is required"),
  address_2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  province: z.string().optional(),
  postal_code: z.string().min(4, "Postal code is required"),
  country_code: z.string().length(2, "Country code must be 2 letters").default("in"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
});

type AddressFormValues = z.infer<typeof addressSchema>;
type CheckoutStep = "address" | "shipping" | "payment";

export default function CheckoutPage() {
  const { cart, clearCart, itemCount, retrieveCart } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("address");

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country_code: "in" },
  });

  useEffect(() => {
    setIsClient(true);
    if (itemCount === 0) {
      router.replace("/");
    }
  }, [itemCount, router]);

  useEffect(() => {
    if (customer) {
      const defaultAddress = customer.shipping_addresses?.[0];
      addressForm.reset({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email,
        address_1: defaultAddress?.address_1 || "",
        city: defaultAddress?.city || "",
        postal_code: defaultAddress?.postal_code || "",
        country_code: defaultAddress?.country_code || "in",
        phone: defaultAddress?.phone || "",
      });
    }
  }, [customer, addressForm]);

  const handleAddressSubmit = async (data: AddressFormValues) => {
    if (!cart) return;
    setIsLoading(true);
    try {
      // Update cart with address and email
      await medusaSdk.store.carts.update(cart.id, {
        shipping_address: data,
        email: data.email,
      });
      // Fetch shipping options
      const { shipping_options } = await medusaSdk.store.carts.shippingOptions.list(cart.id);
      setShippingOptions(shipping_options);
      setStep("shipping");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not set shipping address." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShippingSubmit = async () => {
    if (!cart || !selectedShipping) return;
    setIsLoading(true);
    try {
      await medusaSdk.store.carts.shippingMethods.add(cart.id, { option_id: selectedShipping });
      await medusaSdk.store.carts.paymentSessions.create(cart.id);
      // For this demo, we auto-select the 'manual' payment provider
      await medusaSdk.store.carts.paymentSessions.select(cart.id, { provider_id: "manual" });
      if (cart.id) await retrieveCart(cart.id); // Refresh cart state
      setStep("payment");
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not set shipping method." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!cart) return;
    setIsLoading(true);
    try {
      const { type } = await medusaSdk.store.carts.complete(cart.id);
      if (type === "order") {
        toast({ title: "Payment Successful!", description: "Your order has been placed." });
        await clearCart();
        router.push("/order/success");
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not complete your order." });
    } finally {
      setIsLoading(false);
    }
  };

  const summary = useMemo(() => {
    if (!cart) return { subtotal: 0, shipping: 0, total: 0 };
    return {
      subtotal: (cart.subtotal || 0) / 100,
      shipping: (cart.shipping_total || 0) / 100,
      total: (cart.total || 0) / 100,
    };
  }, [cart]);

  if (!isClient || itemCount === 0 || !cart) {
    return (
      <div className="container mx-auto flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          {/* Step 1: Address */}
          {step === "address" && (
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="first_name" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField name="last_name" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField name="email" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField name="address_1" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField name="city" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField name="postal_code" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField name="phone" control={addressForm.control} render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>} />
                  </CardContent>
                </Card>
                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsRight className="mr-2 h-5 w-5" />}
                  Continue to Shipping
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Shipping */}
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
                <CardDescription>Choose how you want your order delivered.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selectedShipping || ""} onValueChange={setSelectedShipping}>
                  {shippingOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex justify-between w-full items-center">
                        <span>{option.name}</span>
                        <span className="font-bold">₹{(option.amount || 0) / 100}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button onClick={handleShippingSubmit} size="lg" className="w-full mt-4" disabled={isLoading || !selectedShipping}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronsRight className="mr-2 h-5 w-5" />}
                  Continue to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
                <CardDescription>You are ready to complete your order.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="font-semibold">Test Payment</p>
                  <p className="text-sm text-muted-foreground">This is a test store. No real payment will be processed.</p>
                </div>
                <Button onClick={handleCompleteOrder} size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                  {isLoading ? "Processing..." : `Pay ₹${summary.total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
          <Card>
            <CardContent className="space-y-4 pt-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.thumbnail || "https://placehold.co/64x64.png"}
                      alt={item.title}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p>₹{((item.total || 0) / 100).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-semibold">
                <p>Subtotal</p>
                <p>₹{summary.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <p>Shipping</p>
                <p>{summary.shipping > 0 ? `₹${summary.shipping.toFixed(2)}` : "Calculated at next step"}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>₹{summary.total.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
