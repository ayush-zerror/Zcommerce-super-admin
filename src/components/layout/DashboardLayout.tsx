import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const COLLAPSE_KEY = "zcommerce-sidebar-collapsed";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSE_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-content">
      <div className="shrink-0">
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="relative z-10 hidden h-full shrink-0 overflow-visible lg:block">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((prev) => !prev)}
          />
        </div>

        <Drawer
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          placement="left"
          size="xs"
          hideCloseButton
        >
          <DrawerContent>
            <DrawerBody className="h-full p-0">
              <Sidebar
                collapsed={false}
                onToggleCollapse={() => setMobileOpen(false)}
                onNavigate={() => setMobileOpen(false)}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <main className="custom-scroll min-h-0 flex-1 overflow-y-auto px-10 py-4 sm:py-6">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
