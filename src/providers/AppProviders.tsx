import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useEffect, type ReactNode } from "react";
import { useHref, useNavigate } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import { ClientsProvider } from "./ClientsProvider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("zcommerce-theme");
  }, []);

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ToastProvider placement="bottom-right" />
      <AuthProvider>
        <ClientsProvider>{children}</ClientsProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}
