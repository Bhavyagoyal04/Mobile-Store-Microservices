import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { tokenStore } from "@/lib/api";

export default function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokenStore.get()) {
      navigate("/login");
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--gradient-subtle)" }}
    >
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="px-6 md:px-10 py-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
