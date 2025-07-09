import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { StoreOrder } from "@medusajs/types";

export default function OrdersTab({ orders, isLoading }: { orders: StoreOrder[]; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Check the status of your recent orders.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading orders...</p>
        ) : orders.length > 0 ? (
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.display_id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.payment_status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.fulfillment_status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>You have not placed any orders yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
