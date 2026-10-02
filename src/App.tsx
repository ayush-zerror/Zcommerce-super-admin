import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Billing } from "./pages/Billing";
import { ClientDetail } from "./pages/ClientDetail";
import { Clients } from "./pages/Clients";
import { Home } from "./pages/Home";
import { Payments } from "./pages/Payments";
import { Settings } from "./pages/Settings";
import { SignIn } from "./pages/SignIn";
import { useAuth } from "./providers/AuthProvider";

function GuestOnly({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/sign-in"
        element={
          <GuestOnly>
            <SignIn />
          </GuestOnly>
        }
      />

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/:id" element={<ClientDetail />} />

          <Route path="billing" element={<Navigate to="/billing/subscriptions" replace />} />
          <Route path="billing/:section" element={<Billing />} />

          <Route path="payments" element={<Navigate to="/payments/transactions" replace />} />
          <Route path="payments/:section" element={<Payments />} />

          <Route path="settings" element={<Navigate to="/settings/users" replace />} />
          <Route path="settings/:section" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
