
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCustomer } from '@/hooks/use-customer';

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "ZIP code is required"),
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number format (XXXX XXXX XXXX XXXX)"),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cardCvc: z.string().regex(/^\d{3,4}$/, "Invalid CVC"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, itemCount } = useCart();
  const { customer } = useCustomer();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (itemCount === 0) {
      router.replace('/');
    }
  }, [itemCount, router]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', email: '', address: '', city: '', zip: '',
      cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '',
    },
  });

  useEffect(() => {
    if (customer) {
        const defaultAddress = customer.shipping_addresses?.[0];
        form.reset({
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            address: defaultAddress?.address_1 || '',
            city: defaultAddress?.city || '',
            zip: defaultAddress?.postal_code || '',
        })
    }
  }, [customer, form]);

  const onSubmit: SubmitHandler<CheckoutFormValues> = (data) => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      console.log("Checkout data:", data);
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed.",
      });
      clearCart();
      router.push('/order/success');
      setIsLoading(false);
    }, 2000);
  };
  
  if (!isClient || itemCount === 0) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
                <h2 className="font-headline text-2xl font-bold mb-4">Shipping & Payment</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Shipping Information</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField name="name" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="email" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="address" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField name="city" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="zip" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField name="cardName" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="cardNumber" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="xxxx xxxx xxxx xxxx" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField name="cardExpiry" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField name="cardCvc" control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5"/>}
                            {isLoading ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="space-y-6">
                <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
                <Card>
                    <CardContent className="space-y-4 pt-6">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Image src={item.images.main} alt={item.name} width={50} height={50} className="rounded-md" data-ai-hint={`${item.category} shoe`} />
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-semibold">
                            <p>Subtotal</p>
                            <p>₹{totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <p>Shipping</p>
                            <p>Free</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>₹{totalPrice.toFixed(2)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
