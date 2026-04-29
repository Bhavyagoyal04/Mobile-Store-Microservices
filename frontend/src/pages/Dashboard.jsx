import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Smartphone,
  Users,
  ShoppingCart,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mobilesApi, customersApi, ordersApi } from "@/lib/api";

export default function Dashboard() {
  const mobilesQ = useQuery({ queryKey: ["mobiles"], queryFn: mobilesApi.list });
  const customersQ = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.list,
  });
  const ordersQ = useQuery({ queryKey: ["orders"], queryFn: ordersApi.list });

  const mobiles = mobilesQ.data ?? [];
  const customers = customersQ.data ?? [];
  const orders = ordersQ.data ?? [];

  const mobileMap = useMemo(
    () => new Map(mobiles.map((m) => [m.id, m])),
    [mobiles]
  );

  const revenue = useMemo(
    () =>
      orders.reduce((sum, o) => {
        const m = mobileMap.get(o.mobileId);
        return sum + (m ? m.price * o.quantity : 0);
      }, 0),
    [orders, mobileMap]
  );

  const lowStock = useMemo(
    () => mobiles.filter((m) => m.stock <= 5).slice(0, 6),
    [mobiles]
  );
  const recentOrders = useMemo(
    () => [...orders].slice(-6).reverse(),
    [orders]
  );

  const chartData = useMemo(() => {
    const buckets = Array.from({ length: 7 }, (_, i) => ({
      name: `D${i + 1}`,
      orders: 0,
      revenue: 0,
    }));
    orders.forEach((o, idx) => {
      const b = buckets[idx % 7];
      const m = mobileMap.get(o.mobileId);
      b.orders += 1;
      b.revenue += m ? m.price * o.quantity : 0;
    });
    return buckets;
  }, [orders, mobileMap]);

  const stats = [
    {
      label: "Mobiles",
      value: mobiles.length,
      icon: Smartphone,
      tint: "oklch(0.55 0.18 260)",
    },
    {
      label: "Customers",
      value: customers.length,
      icon: Users,
      tint: "oklch(0.65 0.16 155)",
    },
    {
      label: "Orders",
      value: orders.length,
      icon: ShoppingCart,
      tint: "oklch(0.75 0.16 75)",
    },
    {
      label: "Revenue",
      value: `₹${revenue.toLocaleString()}`,
      icon: IndianRupee,
      tint: "oklch(0.6 0.22 25)",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance and inventory health."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `color-mix(in oklab, ${s.tint} 14%, transparent)`,
                      color: s.tint,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-semibold mt-2 tracking-tight">
                  {s.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card
          className="lg:col-span-2 border-border"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Orders & Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="oklch(0.55 0.18 260)"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="oklch(0.55 0.18 260)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.92 0.008 260)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="oklch(0.5 0.02 260)"
                    fontSize={12}
                  />
                  <YAxis stroke="oklch(0.5 0.02 260)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid oklch(0.92 0.008 260)",
                      background: "white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.55 0.18 260)"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card
          className="border-border"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStock.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                All items well-stocked.
              </p>
            ) : (
              <ul className="space-y-3">
                {lowStock.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {m.brand} {m.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{m.price.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={m.stock === 0 ? "destructive" : "secondary"}
                    >
                      {m.stock} left
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card
        className="mt-6 border-border"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <CardHeader>
          <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="py-2 font-medium">#</th>
                    <th className="py-2 font-medium">Customer</th>
                    <th className="py-2 font-medium">Mobile</th>
                    <th className="py-2 font-medium">Qty</th>
                    <th className="py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => {
                    const m = mobileMap.get(o.mobileId);
                    return (
                      <tr
                        key={o.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3">#{o.id}</td>
                        <td className="py-3">{o.customerName}</td>
                        <td className="py-3">
                          {m
                            ? `${m.brand} ${m.model}`
                            : `Mobile #${o.mobileId}`}
                        </td>
                        <td className="py-3">{o.quantity}</td>
                        <td className="py-3">
                          <Badge variant="secondary">
                            {o.status ?? "PLACED"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
