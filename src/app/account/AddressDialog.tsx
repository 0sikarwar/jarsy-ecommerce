import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { StoreCustomerAddress } from "@medusajs/types";
import { useEffect } from "react";

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
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function AddressDialog({
  open,
  onOpenChange,
  address,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: StoreCustomerAddress | null;
  onSubmit: (data: AddressFormValues) => void;
}) {
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country_code: "in" },
  });

  useEffect(() => {
    if (address) {
      addressForm.reset({
        first_name: address.first_name ?? "",
        last_name: address.last_name ?? "",
        address_1: address.address_1 ?? "",
        address_2: address.address_2 ?? "",
        city: address.city ?? "",
        province: address.province ?? "",
        postal_code: address.postal_code ?? "",
        country_code: address.country_code || "in",
        phone: address.phone ?? "",
      });
    } else {
      addressForm.reset({ country_code: "in" });
    }
  }, [address, addressForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
          <DialogDescription>
            {address ? "Update the details of your address." : "Add a new address to your profile."}
          </DialogDescription>
        </DialogHeader>
        <Form {...addressForm}>
          <form onSubmit={addressForm.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="first_name"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="last_name"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="phone"
              control={addressForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address_1"
              control={addressForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address_2"
              control={addressForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="city"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="postal_code"
                control={addressForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="province"
              control={addressForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Province</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={addressForm.formState.isSubmitting}>
                {addressForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
