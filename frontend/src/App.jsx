import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AppLayout from "@/pages/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Mobiles from "@/pages/Mobiles";
import Customers from "@/pages/Customers";
import Orders from "@/pages/Orders";
import Billing from "@/pages/Billing";
import NotFound from "@/pages/NotFound";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mobiles" element={<Mobiles />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/billing" element={<Billing />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
