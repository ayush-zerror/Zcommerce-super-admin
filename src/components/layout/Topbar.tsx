import {
  Button,
  Chip,
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";
import { BiMenu, BiSearch } from "react-icons/bi";
import { MessagesPopover } from "../common/MessagesPopover";
import { NotificationsPopover } from "../common/NotificationsPopover";
import { ProfileDropdown } from "../common/ProfileDropdown";
import { currentAdmin } from "../../lib/mockData";
import { getDarkSearchInputClasses } from "../../styles/inputStyle";

export interface TopbarProps {
  onOpenMobileNav?: () => void;
  /** Brand-only bar for auth pages (no search / profile actions). */
  variant?: "default" | "auth";
}

export function Topbar({ onOpenMobileNav, variant = "default" }: TopbarProps) {
  const isAuth = variant === "auth";

  return (
    <Navbar
      isBordered={false}
      height={50}
      maxWidth="full"
      className="w-full"
      classNames={{
        base: "bg-textStandardPrimary dark:bg-slate-900",
        wrapper:
          "relative max-w-full px-3 sm:px-5 z-100 dark:text-white sticky top-0 left-0 overflow-visible",
      }}
    >
      <NavbarContent justify="start" className="z-10 max-w-fit gap-2 basis-auto flex-grow-0">
        {!isAuth && onOpenMobileNav ? (
          <Button
            isIconOnly
            aria-label="Menu"
            variant="light"
            className="lg:hidden text-white"
            onPress={onOpenMobileNav}
          >
            <BiMenu size={24} />
          </Button>
        ) : null}
        <NavbarBrand className="max-w-fit items-center gap-2">
          <p className="text-xl font-bold text-inherit text-white">ZCOMMERCE</p>
          <Chip
            size="sm"
            variant="flat"
            className="h-5 min-h-5 bg-primary/20 px-2 text-[10px] font-semibold uppercase tracking-wide text-primary"
            classNames={{
              content: "px-0",
            }}
          >
            {currentAdmin.role}
          </Chip>
        </NavbarBrand>
      </NavbarContent>

      {!isAuth ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-[1] hidden -translate-y-1/2 justify-center lg:flex">
            <div className="pointer-events-auto w-full max-w-xl px-4">
              <Input
                placeholder="Search for tools, apps, help & more..."
                size="sm"
                type="search"
                aria-label="search"
                radius="full"
                startContent={<BiSearch size={18} className="text-white/45" />}
                classNames={{
                  ...getDarkSearchInputClasses(),
                  base: "w-full",
                }}
              />
            </div>
          </div>

          <NavbarContent
            as="div"
            className="z-10 ml-auto max-w-fit basis-auto flex-grow-0 items-center gap-2 sm:gap-5"
            justify="end"
          >
            <NotificationsPopover />
            <MessagesPopover />
            <ProfileDropdown />
          </NavbarContent>
        </>
      ) : null}
    </Navbar>
  );
}
