import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PlusCircle } from "lucide-react";
import type { StoreCustomerAddress } from "@medusajs/types";

export default function AddressesTab({
  addresses,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
}: {
  addresses: StoreCustomerAddress[];
  isLoading: boolean;
  onEdit: (address: StoreCustomerAddress) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Addresses</CardTitle>
          <CardDescription>Update your shipping and billing addresses.</CardDescription>
        </div>
        <Button onClick={onAdd}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p>Loading addresses...</p>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => (
            <div key={addr.id} className="p-4 border rounded-lg flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {addr.first_name} {addr.last_name}
                </h3>
                <p className="text-muted-foreground">
                  {addr.address_1}
                  {addr.address_2 && `, ${addr.address_2}`}
                </p>
                <p className="text-muted-foreground">
                  {addr.city}, {addr.province} {addr.postal_code}
                </p>
                <p className="text-muted-foreground">{addr.country_code?.toUpperCase()}</p>
                {addr.phone && <p className="text-muted-foreground">Phone: {addr.phone}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(addr)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(addr.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>You have no saved addresses.</p>
        )}
      </CardContent>
    </Card>
  );
}
