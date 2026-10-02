import { Button, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { IoAnalytics, IoCard, IoHome, IoPeople, IoSettingsSharp } from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  children?: NavChild[];
}

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: IoHome },
  { label: "Clients", href: "/clients", icon: IoPeople },
  {
    label: "Billing",
    href: "/billing",
    icon: IoCard,
    children: [
      { label: "Subscriptions", href: "/billing/subscriptions" },
      { label: "Transactions", href: "/billing/transactions" },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: IoAnalytics,
    children: [
      { label: "Revenue Reports", href: "/analytics/revenue" },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: IoSettingsSharp,
    children: [
      { label: "Discounts", href: "/settings/discounts" },
    ],
  },
];

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
}

function pathMatches(pathname: string, href: string, end = false): boolean {
  if (end) return pathname === href;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface NavGroupProps {
  item: NavItem;
  collapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

function NavGroup({ item, collapsed, open, onToggle, onNavigate }: NavGroupProps) {
  const location = useLocation();
  const Icon = item.icon;
  const children = item.children ?? [];
  const hasChildren = children.length > 0;
  const sectionActive = pathMatches(location.pathname, item.href, item.href === "/");

  if (!hasChildren) {
    const link = (
      <NavLink
        to={item.href}
        end={item.href === "/"}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 py-2.5 text-sm font-normal transition-colors",
            collapsed ? "mx-2 justify-center rounded-md px-0" : "mx-3 rounded-md px-3",
            isActive
              ? "bg-accent-soft text-primary"
              : "text-default-700 hover:bg-default-100",
          )
        }
      >
        <>
          <Icon size={18} className="shrink-0" />
          {!collapsed ? <span>{item.label}</span> : null}
        </>
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip content={item.label} placement="right">
          <div>{link}</div>
        </Tooltip>
      );
    }

    return link;
  }

  if (collapsed) {
    return (
      <Tooltip content={item.label} placement="right">
        <NavLink
          to={children[0]?.href ?? item.href}
          onClick={onNavigate}
          className={() =>
            cn(
              "relative mx-2 flex items-center justify-center rounded-md py-2.5 text-sm font-normal transition-colors",
              sectionActive
                ? "bg-accent-soft text-primary"
                : "text-default-700 hover:bg-default-100",
            )
          }
        >
          <Icon size={18} />
        </NavLink>
      </Tooltip>
    );
  }

  return (
    <div
      className={cn(
        "mx-3 overflow-hidden rounded-md transition-colors duration-300",
        open || sectionActive ? "bg-accent-soft/70" : "bg-transparent",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-normal transition-colors",
          sectionActive ? "text-foreground" : "text-default-700 hover:text-foreground",
        )}
        aria-expanded={open}
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1">{item.label}</span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-default-500 transition-transform duration-300 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="submenu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-primary/10 px-2 pb-2 pt-1">
              {children.map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-normal transition-colors",
                      isActive
                        ? "bg-accent-soft text-primary"
                        : "text-default-700 hover:bg-white/70 hover:text-foreground",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          isActive ? "bg-primary" : "bg-default-300",
                        )}
                      />
                      <span>{child.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function getActiveSectionHref(pathname: string): string | null {
  const match = mainNavItems.find(
    (item) => item.children?.length && pathMatches(pathname, item.href),
  );
  return match?.href ?? null;
}

export function Sidebar({ collapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(() =>
    getActiveSectionHref(location.pathname),
  );

  useEffect(() => {
    const active = getActiveSectionHref(location.pathname);
    if (active) setOpenSection(active);
  }, [location.pathname]);

  return (
    <aside
      className={cn(
        "flex h-full max-h-full shrink-0 flex-col overflow-hidden border-r border-default-200 bg-white transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-[240px]",
      )}
    >
      <nav className="custom-scroll min-h-0 flex-1 space-y-1 overflow-y-auto overflow-x-hidden py-3">
        {mainNavItems.map((item) => (
          <NavGroup
            key={item.href}
            item={item}
            collapsed={collapsed}
            open={openSection === item.href}
            onToggle={() =>
              setOpenSection((prev) => (prev === item.href ? null : item.href))
            }
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-default-200 p-3">
        {!collapsed ? (
          <div className="mb-3 rounded-xl bg-default-100 p-3">
            <p className="text-xs font-normal text-default-600">
              Internal ops console for all client stores
            </p>
          </div>
        ) : null}
        <Tooltip content={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <Button
            fullWidth={!collapsed}
            isIconOnly={collapsed}
            variant="flat"
            className="justify-center"
            onPress={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed ? <span className="ml-2">Collapse</span> : null}
          </Button>
        </Tooltip>
      </div>
    </aside>
  );
}
