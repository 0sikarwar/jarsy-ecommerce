import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, MapPin, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data for demonstration
const user = {
  name: 'Alex Rider',
  email: 'alex.rider@example.com',
  memberSince: '2023-05-20',
};

const addresses = [
  { id: 1, type: 'Shipping', address: '1234 Sneaker Ave, Style City, CA 98765', isDefault: true },
  { id: 2, type: 'Billing', address: '5678 Boot Boulevard, Comfort Town, CA 54321', isDefault: false },
];

const orders = [
  { id: 'ORD-2024-001', date: '2024-07-15', total: 129.99, status: 'Shipped', items: [{ name: 'Urban Runner', quantity: 1 }] },
  { id: 'ORD-2024-002', date: '2024-06-28', total: 189.99, status: 'Delivered', items: [{ name: 'Mountain Trekker', quantity: 1 }] },
  { id: 'ORD-2023-12-10', date: '2023-12-10', total: 249.99, status: 'Delivered', items: [{ name: 'Executive Oxford', quantity: 1 }] },
];

export default function AccountPage() {
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

                    <TabsContent value="profile" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src="https://placehold.co/128x128.png" alt="User avatar" data-ai-hint="avatar person" />
                                        <AvatarFallback>AR</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                                        <CardDescription>{user.email}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Member since {user.memberSince}</p>
                                <Button className="mt-4">Edit Profile</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="addresses" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manage Addresses</CardTitle>
                                <CardDescription>Update your shipping and billing addresses.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {addresses.map(addr => (
                                    <div key={addr.id} className="p-4 border rounded-lg flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{addr.type} Address</h3>
                                                {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                                            </div>
                                            <p className="text-muted-foreground">{addr.address}</p>
                                        </div>
                                        <Button variant="outline" size="sm">Edit</Button>
                                    </div>
                                ))}
                                <Button>Add New Address</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="orders" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order History</CardTitle>
                                <CardDescription>Check the status of recent orders.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map(order => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">{order.id}</TableCell>
                                                <TableCell>{order.date}</TableCell>
                                                <TableCell><Badge variant={order.status === 'Shipped' ? 'default' : 'secondary'}>{order.status}</Badge></TableCell>
                                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm">View Details</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
