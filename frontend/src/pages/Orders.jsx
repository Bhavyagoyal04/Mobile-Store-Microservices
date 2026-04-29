import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customersApi, mobilesApi, ordersApi } from "@/lib/api";

export default function Orders() {
  const qc = useQueryClient();
  const ordersQ = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
  const mobilesQ = useQuery({
    queryKey: ["mobiles"],
    queryFn: mobilesApi.list,
  });
  const customersQ = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.list,
  });
  const orders = ordersQ.data ?? [];
  const mobiles = mobilesQ.data ?? [];
  const customers = customersQ.data ?? [];
  const mobileMap = useMemo(
    () => new Map(mobiles.map((m) => [m.id, m])),
    [mobiles]
  );

  const [open, setOpen] = useState(false);
  const [mobileId, setMobileId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [customerId, setCustomerId] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      ordersApi.create({
        mobileId: Number(mobileId),
        quantity: Number(quantity),
        customerId: Number(customerId),
      }),
    onSuccess: () => {
      toast.success("Order placed");
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["mobiles"] });
      setOpen(false);
      setMobileId("");
      setQuantity("1");
      setCustomerId("");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => ordersApi.remove(id),
    onSuccess: () => {
      toast.success("Order deleted");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track and manage customer orders."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New order
          </Button>
        }
      />

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-3 px-5 font-medium">Order</th>
                  <th className="py-3 px-5 font-medium">Customer</th>
                  <th className="py-3 px-5 font-medium">Mobile</th>
                  <th className="py-3 px-5 font-medium">Qty</th>
                  <th className="py-3 px-5 font-medium">Total</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersQ.isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const m = mobileMap.get(o.mobileId);
                    const total = m ? m.price * o.quantity : 0;
                    return (
                      <tr
                        key={o.id}
                        className="border-b border-border last:border-0 hover:bg-accent/40"
                      >
                        <td className="py-3 px-5 text-muted-foreground">
                          #{o.id}
                        </td>
                        <td className="py-3 px-5 font-medium">
                          {o.customerName}
                        </td>
                        <td className="py-3 px-5">
                          {m
                            ? `${m.brand} ${m.model}`
                            : `Mobile #${o.mobileId}`}
                        </td>
                        <td className="py-3 px-5">{o.quantity}</td>
                        <td className="py-3 px-5">
                          ₹{total.toLocaleString()}
                        </td>
                        <td className="py-3 px-5">
                          <Badge variant="secondary">
                            {o.status ?? "PLACED"}
                          </Badge>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete order #${o.id}?`))
                                deleteMutation.mutate(o.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New order</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Mobile</Label>
              <Select value={mobileId} onValueChange={setMobileId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mobile" />
                </SelectTrigger>
                <SelectContent>
                  {mobiles.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.brand} {m.model} — ₹{m.price.toLocaleString()} (
                      {m.stock} in stock)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name} — {c.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || !mobileId || !customerId}
              >
                {createMutation.isPending ? "Placing…" : "Place order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
