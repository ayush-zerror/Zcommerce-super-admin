import { Navbar, NavbarBrand } from "@heroui/react";
import { Button, Input } from "@heroui/react";
import { Menu, Search } from "lucide-react";
import { MessagesPopover } from "../common/MessagesPopover";
import { NotificationsPopover } from "../common/NotificationsPopover";
import { ProfileDropdown } from "../common/ProfileDropdown";

export interface TopbarProps {
  onOpenMobileNav?: () => void;
  /** Brand-only bar for auth pages (no search / profile actions). */
  variant?: "default" | "auth";
}

export function Topbar({ onOpenMobileNav, variant = "default" }: TopbarProps) {
  const isAuth = variant === "auth";

  return (
    <Navbar
      maxWidth="full"
      height="3.5rem"
      classNames={{
        base: "bg-navbar text-white shadow-sm",
        wrapper: "relative px-3 sm:px-5",
      }}
    >
      <NavbarBrand className="z-10 gap-2 max-w-fit">
        {!isAuth && onOpenMobileNav ? (
          <Button
            isIconOnly
            radius="sm"
            variant="flat"
            className="h-9 w-9 min-w-9 bg-[#3a3a3a] text-white data-[hover=true]:bg-[#4a4a4a] lg:hidden"
            aria-label="Open menu"
            onPress={onOpenMobileNav}
          >
            <Menu size={18} />
          </Button>
        ) : null}
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-extrabold tracking-[0.14em] sm:text-base">
            ZCOMMERCE
          </span>
          <span className="hidden text-[11px] font-medium text-white/70 sm:block">
            Super admin panel
          </span>
        </div>
      </NavbarBrand>

      {!isAuth ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 hidden justify-center sm:flex">
            <div className="pointer-events-auto w-full max-w-xl px-4">
              <Input
                aria-label="Global search"
                placeholder="Search for tools, apps, help & more..."
                radius="full"
                size="sm"
                startContent={<Search size={16} className="text-white/45" />}
                classNames={{
                  inputWrapper:
                    "bg-[#3a3a3a] shadow-none h-9 border-none data-[hover=true]:bg-[#454545] group-data-[focus=true]:bg-[#454545]",
                  input: "text-sm text-white/90 placeholder:text-white/45",
                }}
              />
            </div>
          </div>

          <div className="z-10 ml-auto flex items-center gap-2">
            <NotificationsPopover />
            <MessagesPopover />
            <ProfileDropdown />
          </div>
        </>
      ) : null}
    </Navbar>
  );
}
