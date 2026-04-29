import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Receipt, Printer } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { billsApi, mobilesApi, ordersApi } from "@/lib/api";

export default function Billing() {
  const ordersQ = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });
  const mobilesQ = useQuery({
    queryKey: ["mobiles"],
    queryFn: mobilesApi.list,
  });
  const orders = ordersQ.data ?? [];
  const mobiles = mobilesQ.data ?? [];
  const mobileMap = useMemo(
    () => new Map(mobiles.map((m) => [m.id, m])),
    [mobiles]
  );

  const [bills, setBills] = useState({});

  const generateMutation = useMutation({
    mutationFn: (orderId) => billsApi.create(orderId),
    onSuccess: (bill, orderId) => {
      setBills((prev) => ({ ...prev, [orderId]: bill }));
      toast.success(`Bill #${bill.billId} generated`);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <div>
      <PageHeader
        title="Billing"
        description="Generate bills for placed orders."
      />

      {ordersQ.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : orders.length === 0 ? (
        <Card
          className="border-border"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <CardContent className="text-center py-16 text-muted-foreground">
            No orders to bill.
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {orders.map((o) => {
            const m = mobileMap.get(o.mobileId);
            const total = m ? m.price * o.quantity : 0;
            const bill = bills[o.id];
            return (
              <Card
                key={o.id}
                className="border-border"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order #{o.id}
                      </p>
                      <p className="text-lg font-semibold tracking-tight mt-0.5">
                        {o.customerName}
                      </p>
                    </div>
                    <Badge variant={bill ? "default" : "secondary"}>
                      {bill ? "Billed" : (o.status ?? "PLACED")}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mobile</span>
                      <span className="font-medium">
                        {m ? `${m.brand} ${m.model}` : `#${o.mobileId}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit price</span>
                      <span>₹{(m?.price ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span>× {o.quantity}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold text-primary">
                        ₹{(bill?.totalAmount ?? total).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {bill ? (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-4 w-4 mr-2" /> Print bill #
                        {bill.billId}
                      </Button>
                    ) : (
                      <Button
                        className="flex-1"
                        onClick={() => generateMutation.mutate(o.id)}
                        disabled={generateMutation.isPending}
                      >
                        <Receipt className="h-4 w-4 mr-2" /> Generate bill
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
