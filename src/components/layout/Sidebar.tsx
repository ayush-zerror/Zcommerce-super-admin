import { Button, Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { BiX } from "react-icons/bi";
import { IoAnalytics, IoCard, IoHome, IoPeople, IoSettingsSharp } from "react-icons/io5";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
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
      { label: "Automation", href: "/settings/automation" },
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
            "flex w-full items-center rounded px-2 py-2 text-sm transition-colors",
            "hover:bg-lightPrimary hover:text-primary",
            collapsed ? "justify-center" : "",
            isActive
              ? "bg-lightPrimary text-primary dark:bg-slate-700"
              : "text-default-700",
          )
        }
      >
        <>
          <Icon size={18} className="shrink-0 text-lg" />
          {!collapsed ? <span className="ml-2 text-sm">{item.label}</span> : null}
        </>
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip content={item.label} placement="right" size="sm">
          <div>{link}</div>
        </Tooltip>
      );
    }

    return link;
  }

  if (collapsed) {
    return (
      <Tooltip content={item.label} placement="right" size="sm">
        <NavLink
          to={children[0]?.href ?? item.href}
          onClick={onNavigate}
          className={() =>
            cn(
              "flex w-full items-center justify-center rounded px-2 py-2 text-sm transition-colors",
              "hover:bg-lightPrimary hover:text-primary",
              sectionActive
                ? "bg-lightPrimary text-primary dark:bg-slate-700"
                : "text-default-700",
            )
          }
        >
          <Icon size={18} className="text-lg" />
        </NavLink>
      </Tooltip>
    );
  }

  return (
    <div className="overflow-hidden rounded">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center rounded px-2 py-2 text-left text-sm transition-colors",
          "hover:bg-lightPrimary dark:hover:bg-slate-700",
          open || sectionActive
            ? "bg-lightPrimary text-primary dark:bg-[#42454c]"
            : "text-default-700",
        )}
        aria-expanded={open}
      >
        <Icon size={18} className="shrink-0 text-lg" />
        <span className="ml-2 flex-1 text-sm">{item.label}</span>
        <span
          className={cn(
            "mr-1 text-sm text-black transition-transform duration-200",
            open && "rotate-90",
          )}
        >
          ›
        </span>
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
            <div className="space-y-1 rounded-b bg-lightPrimary py-2 dark:bg-[#42454c]">
              {children.map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "mx-2 flex items-center gap-3 rounded px-2 py-2 text-tiny transition-colors",
                      "hover:bg-[#D4EBFD]",
                      isActive
                        ? "bg-[#D4EBFD] text-primary dark:bg-slate-700"
                        : "text-default-700",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        aria-hidden
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          isActive ? "bg-primary" : "bg-gray-300",
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
    <div className="relative h-full overflow-visible">
      <Tooltip size="sm" content={collapsed ? "Expand" : "Collapse"} className="hidden lg:block">
        <button
          type="button"
          className="absolute -right-5 top-10 z-[1] hidden h-6 w-9 cursor-pointer items-center justify-end rounded-r-xl border border-l-0 border-gray-300 bg-white px-1.5 shadow-sm transition-all duration-150 lg:flex dark:border-slate-900 dark:bg-[#42454c]"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MdOutlineKeyboardDoubleArrowLeft
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </Tooltip>

      <aside
        className={cn(
          "relative z-[2] flex h-full max-h-full shrink-0 flex-col justify-between overflow-hidden border-r border-[#dfe5eb] bg-white transition-all duration-500 ease-in-out dark:border-gray-800 dark:bg-gray-900",
          collapsed ? "w-16 px-1 pt-1" : "w-60 p-2",
        )}
      >
        <div className="lg:hidden p-2">
          {onNavigate ? (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onNavigate}
              className="text-gray-500"
              aria-label="Close menu"
            >
              <BiX size={24} />
            </Button>
          ) : null}
        </div>

        <nav className="custom-scroll min-h-0 w-full flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2">
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

        {!collapsed ? (
          <div className="mb-2 mt-6 shrink-0 px-2 text-xs text-default-500">
            <p className="text-xs">
              Developed by{" "}
              <a
                href="https://www.zerrorstudios.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground"
              >
                Zerror Studios
              </a>
            </p>
            <p className="text-xs">
              © {new Date().getFullYear()} | Version 1.01.000
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
