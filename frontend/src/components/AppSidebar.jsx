import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Smartphone,
  Users,
  ShoppingCart,
  Receipt,
  LogOut,
  Store,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mobiles", label: "Mobiles", icon: Smartphone },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/billing", label: "Billing", icon: Receipt },
];

export function AppSidebar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Store className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">MobileStore</p>
          <p className="text-xs text-muted-foreground">Inventory Suite</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-accent-foreground">
            {username?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{username ?? "User"}</p>
            <p className="text-xs text-muted-foreground">Signed in</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
