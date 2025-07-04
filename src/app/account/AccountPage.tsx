"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { StoreCustomerAddress, StoreOrder } from "@medusajs/types";
import { useCustomer } from "@/hooks/use-customer";
import {
  getAddressesAction,
  getOrdersAction,
  updateProfileAction,
  addAddressAction,
  updateAddressAction,
  deleteAddressAction,
} from "@/lib/actions/customer";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileTab from "./ProfileTab";
import AddressesTab from "./AddressesTab";
import OrdersTab from "./OrdersTab";
import AddressDialog from "./AddressDialog";

// Add these imports for tabs and icons
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, MapPin, Package } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { customer, isLoading: isCustomerLoading, refetchCustomer } = useCustomer();

  const [addresses, setAddresses] = useState<StoreCustomerAddress[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<StoreCustomerAddress | null>(null);

  useEffect(() => {
    if (!isCustomerLoading && !customer) {
      router.replace("/login");
    } else if (customer) {
      const fetchData = async () => {
        setIsDataLoading(true);
        const [addressesRes, ordersRes] = await Promise.all([getAddressesAction(), getOrdersAction()]);
        if (addressesRes.success && addressesRes.data) setAddresses(addressesRes.data);
        if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
        setIsDataLoading(false);
      };
      fetchData();
    }
  }, [customer, isCustomerLoading, router]);

  const refetchAddresses = async () => {
    const res = await getAddressesAction();
    if (res.success && res.data) setAddresses(res.data);
  };

  // Profile update handler
  const handleProfileUpdate = async (data: any) => {
    const result = await updateProfileAction(data);
    if (result.success) {
      toast({ title: "Profile Updated", description: "Your information has been saved." });
      await refetchCustomer();
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: result.error });
    }
  };

  // Address handlers
  const handleAddressSubmit = async (data: any) => {
    const result = editingAddress ? await updateAddressAction(editingAddress.id, data) : await addAddressAction(data);

    if (result.success) {
      toast({
        title: `Address ${editingAddress ? "Updated" : "Added"}`,
        description: "Your address book is up to date.",
      });
      await refetchAddresses();
      setIsAddressDialogOpen(false);
    } else {
      toast({ variant: "destructive", title: "Action Failed", description: result.error });
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const result = await deleteAddressAction(addressId);
    if (result.success) {
      toast({ title: "Address Deleted" });
      await refetchAddresses();
    } else {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: result.error || "An error occurred while deleting the address.",
      });
    }
  };

  const openAddressDialog = (address: StoreCustomerAddress | null = null) => {
    setEditingAddress(address);
    setIsAddressDialogOpen(true);
  };

  if (isCustomerLoading || !customer) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8">
          <Skeleton className="h-12 w-1/3" />
        </header>
        <Skeleton className="h-10 w-1/2 mb-6" />
        <Skeleton className="h-64 w-full" />
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
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="mr-2 h-4 w-4" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="mr-2 h-4 w-4" /> Orders
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <ProfileTab customer={customer} onSubmit={handleProfileUpdate} />
          </TabsContent>
          <TabsContent value="addresses" className="mt-6">
            <AddressesTab
              addresses={addresses}
              isLoading={isDataLoading}
              onEdit={openAddressDialog}
              onDelete={handleDeleteAddress}
              onAdd={() => openAddressDialog(null)}
            />
          </TabsContent>
          <TabsContent value="orders" className="mt-6">
            <OrdersTab orders={orders} isLoading={isDataLoading} />
          </TabsContent>
        </Tabs>
      </main>
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        address={editingAddress}
        onSubmit={handleAddressSubmit}
      />
    </div>
  );
}
