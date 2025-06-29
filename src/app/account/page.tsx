
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// @ts-ignore
import type { Customer, Address, Order } from '@medusajs/medusa';
import { useCustomer } from '@/hooks/use-customer';
import { getAddressesAction, getOrdersAction, updateProfileAction, addAddressAction, updateAddressAction, deleteAddressAction } from '@/lib/actions/customer';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, MapPin, Package, Loader2, Edit, Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  address_1: z.string().min(5, 'Address is required'),
  address_2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().optional(),
  postal_code: z.string().min(4, 'Postal code is required'),
  country_code: z.string().length(2, 'Country code must be 2 letters').default('in'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type AddressFormValues = z.infer<typeof addressSchema>;


export default function AccountPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { customer, isLoading: isCustomerLoading, refetchCustomer } = useCustomer();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    // Fetch initial data
    useEffect(() => {
        if (!isCustomerLoading && !customer) {
            router.replace('/login');
        } else if (customer) {
            const fetchData = async () => {
                setIsDataLoading(true);
                const [addressesRes, ordersRes] = await Promise.all([
                    getAddressesAction(),
                    getOrdersAction()
                ]);

                if (addressesRes.success && addressesRes.data) setAddresses(addressesRes.data);
                if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
                setIsDataLoading(false);
            };
            fetchData();
        }
    }, [customer, isCustomerLoading, router]);


    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    const addressForm = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
    });
    
    // Handlers
    const handleProfileUpdate = async (data: ProfileFormValues) => {
        const result = await updateProfileAction(data);
        if (result.success) {
            toast({ title: "Profile Updated", description: "Your information has been saved." });
            await refetchCustomer();
        } else {
            toast({ variant: 'destructive', title: "Update Failed", description: result.error });
        }
    };
    
    useEffect(() => {
        if (customer) {
            profileForm.reset({
                firstName: customer.first_name || '',
                lastName: customer.last_name || '',
                email: customer.email || '',
                phone: customer.phone || '',
            });
        }
    }, [customer, profileForm]);

    const refetchAddresses = async () => {
        const res = await getAddressesAction();
        if (res.success && res.data) setAddresses(res.data);
    };

    const handleAddressSubmit = async (data: AddressFormValues) => {
        const result = editingAddress
            ? await updateAddressAction(editingAddress.id, data)
            : await addAddressAction(data);

        if (result.success) {
            toast({ title: `Address ${editingAddress ? 'Updated' : 'Added'}`, description: "Your address book is up to date." });
            await refetchAddresses();
            setIsAddressDialogOpen(false);
        } else {
            toast({ variant: 'destructive', title: "Action Failed", description: result.error });
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        const result = await deleteAddressAction(addressId);
        if (result.success) {
            toast({ title: "Address Deleted" });
            await refetchAddresses();
        } else {
            toast({ variant: 'destructive', title: "Delete Failed", description: result.error });
        }
    }
    
    const openAddressDialog = (address: Address | null = null) => {
        setEditingAddress(address);
        addressForm.reset(address ? {
            ...address,
            country_code: address.country_code || 'in'
        } : { country_code: 'in' });
        setIsAddressDialogOpen(true);
    };

    if (isCustomerLoading || !customer) {
        return (
            <div className="container mx-auto px-4 py-8 md:py-12">
                 <header className="mb-8">
                    <Skeleton className="h-12 w-1/3" />
                </header>
                <Skeleton className="h-10 w-1/2 mb-6" />
                <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <header className="mb-8">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">My Account</h1>
            </header>

            <main>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md">
                        <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Profile</TabsTrigger>
                        <TabsTrigger value="addresses"><MapPin className="mr-2 h-4 w-4" /> Addresses</TabsTrigger>
                        <TabsTrigger value="orders"><Package className="mr-2 h-4 w-4" /> Orders</TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="mt-6">
                        <Card>
                             <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src="https://placehold.co/128x128.png" alt="User avatar" data-ai-hint="avatar person" />
                                                <AvatarFallback>{customer.first_name?.[0]}{customer.last_name?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-2xl">{customer.first_name} {customer.last_name}</CardTitle>
                                                <CardDescription>Member since {new Date(customer.created_at).toLocaleDateString()}</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField name="firstName" control={profileForm.control} render={({ field }) => (
                                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField name="lastName" control={profileForm.control} render={({ field }) => (
                                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <FormField name="email" control={profileForm.control} render={({ field }) => (
                                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="phone" control={profileForm.control} render={({ field }) => (
                                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                            {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
                                        </Button>
                                    </CardContent>
                                </form>
                            </Form>
                        </Card>
                    </TabsContent>

                    {/* Addresses Tab */}
                    <TabsContent value="addresses" className="mt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                               <div>
                                 <CardTitle>Manage Addresses</CardTitle>
                                 <CardDescription>Update your shipping and billing addresses.</CardDescription>
                               </div>
                               <Button onClick={() => openAddressDialog()}>
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add New Address
                               </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isDataLoading ? <p>Loading addresses...</p> : addresses.length > 0 ? (
                                    addresses.map(addr => (
                                        <div key={addr.id} className="p-4 border rounded-lg flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{addr.first_name} {addr.last_name}</h3>
                                                <p className="text-muted-foreground">{addr.address_1}{addr.address_2 && `, ${addr.address_2}`}</p>
                                                <p className="text-muted-foreground">{addr.city}, {addr.province} {addr.postal_code}</p>
                                                <p className="text-muted-foreground">{addr.country_code?.toUpperCase()}</p>
                                                {addr.phone && <p className="text-muted-foreground">Phone: {addr.phone}</p>}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="icon" onClick={() => openAddressDialog(addr)}><Edit className="h-4 w-4"/></Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteAddress(addr.id)}><Trash2 className="h-4 w-4"/></Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>You have no saved addresses.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    {/* Orders Tab */}
                    <TabsContent value="orders" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order History</CardTitle>
                                <CardDescription>Check the status of your recent orders.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isDataLoading ? <p>Loading orders...</p> : orders.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Payment Status</TableHead>
                                            <TableHead>Fulfillment Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">#{order.display_id}</TableCell>
                                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell><Badge variant="secondary">{order.payment_status}</Badge></TableCell>
                                                <TableCell><Badge variant="secondary">{order.fulfillment_status}</Badge></TableCell>
                                                <TableCell className="text-right">₹{(order.total / 100).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                ) : (
                                    <p>You have not placed any orders yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Address Dialog */}
            <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
                        <DialogDescription>
                            {editingAddress ? 'Update the details of your address.' : 'Add a new address to your profile.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...addressForm}>
                        <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                             <FormField name="first_name" control={addressForm.control} render={({ field }) => (
                                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                              <FormField name="last_name" control={addressForm.control} render={({ field }) => (
                                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                           </div>
                            <FormField name="address_1" control={addressForm.control} render={({ field }) => (
                                <FormItem><FormLabel>Address Line 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                            <FormField name="address_2" control={addressForm.control} render={({ field }) => (
                                <FormItem><FormLabel>Address Line 2 (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField name="city" control={addressForm.control} render={({ field }) => (
                                    <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="postal_code" control={addressForm.control} render={({ field }) => (
                                    <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField name="province" control={addressForm.control} render={({ field }) => (
                                <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                             )} />
                            <DialogFooter>
                                <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                                     {addressForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                     Save
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
