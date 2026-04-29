import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import { mobilesApi } from "@/lib/api";

const empty = { brand: "", model: "", price: "", stock: "" };

export default function Mobiles() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["mobiles"],
    queryFn: mobilesApi.list,
  });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setForm({
      brand: m.brand,
      model: m.model,
      price: String(m.price),
      stock: String(m.stock),
    });
    setOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        brand: form.brand,
        model: form.model,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing) return mobilesApi.update(editing.id, payload);
      return mobilesApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Mobile updated" : "Mobile added");
      qc.invalidateQueries({ queryKey: ["mobiles"] });
      setOpen(false);
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => mobilesApi.remove(id),
    onSuccess: () => {
      toast.success("Mobile deleted");
      qc.invalidateQueries({ queryKey: ["mobiles"] });
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  return (
    <div>
      <PageHeader
        title="Mobiles"
        description="Manage your inventory of mobile devices."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> Add mobile
          </Button>
        }
      />

      <Card className="border-border" style={{ boxShadow: "var(--shadow-card)" }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="py-3 px-5 font-medium">ID</th>
                  <th className="py-3 px-5 font-medium">Brand</th>
                  <th className="py-3 px-5 font-medium">Model</th>
                  <th className="py-3 px-5 font-medium">Price</th>
                  <th className="py-3 px-5 font-medium">Stock</th>
                  <th className="py-3 px-5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      Loading…
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No mobiles yet. Click "Add mobile" to create one.
                    </td>
                  </tr>
                ) : (
                  data.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-border last:border-0 hover:bg-accent/40"
                    >
                      <td className="py-3 px-5 text-muted-foreground">
                        #{m.id}
                      </td>
                      <td className="py-3 px-5 font-medium">{m.brand}</td>
                      <td className="py-3 px-5">{m.model}</td>
                      <td className="py-3 px-5">
                        ₹{m.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-5">
                        <Badge
                          variant={
                            m.stock === 0
                              ? "destructive"
                              : m.stock <= 5
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {m.stock}
                        </Badge>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(m)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Delete ${m.brand} ${m.model}?`)) {
                              deleteMutation.mutate(m.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit mobile" : "Add mobile"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                />
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
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
