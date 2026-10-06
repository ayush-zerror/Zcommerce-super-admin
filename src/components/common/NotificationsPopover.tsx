import {
  Avatar,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { BsBellFill, BsTruck } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { LuPackage, LuWallet } from "react-icons/lu";
import { SlGraph } from "react-icons/sl";
import { notifications as mockNotifications } from "../../lib/mockData";
import type { Notification, NotificationCategory } from "../../types";

type FilterKey = Exclude<NotificationCategory, "All"> | "all";

function categoryIcon(category: Notification["category"]) {
  switch (category) {
    case "Orders":
      return <LuPackage className="text-gray-500" />;
    case "Shipping":
      return <BsTruck className="text-gray-500" />;
    case "Analytics":
      return <SlGraph className="text-gray-500" />;
    case "Billing":
      return <LuWallet className="text-gray-500" />;
    default:
      return <BsTruck className="text-gray-500" />;
  }
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(iso))
    .toLowerCase()
    .replace(" ", "");
}

const FILTERS: { key: FilterKey; label: string; category?: Notification["category"] }[] = [
  { key: "all", label: "All" },
  { key: "Orders", label: "Orders", category: "Orders" },
  { key: "Shipping", label: "Shipping", category: "Shipping" },
  { key: "Analytics", label: "Analytics", category: "Analytics" },
  { key: "Billing", label: "Billing", category: "Billing" },
];

export function NotificationsPopover() {
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [isOpen, setIsOpen] = useState(false);

  const unreadCounts = useMemo(() => {
    return {
      all: items.filter((i) => !i.read).length,
      Orders: items.filter((i) => !i.read && i.category === "Orders").length,
      Shipping: items.filter((i) => !i.read && i.category === "Shipping").length,
      Analytics: items.filter((i) => !i.read && i.category === "Analytics").length,
      Billing: items.filter((i) => !i.read && i.category === "Billing").length,
    };
  }, [items]);

  const filteredGroups = useMemo(() => {
    const filtered =
      filter === "all" ? items : items.filter((item) => item.category === filter);

    const map = new Map<string, Notification[]>();
    for (const item of filtered) {
      const list = map.get(item.dateGroup) ?? [];
      list.push(item);
      map.set(item.dateGroup, list);
    }
    return Array.from(map.entries());
  }, [filter, items]);

  const chipClass = (active: boolean) =>
    active
      ? "bg-blue-50 text-primary cursor-pointer"
      : "border border-gray-200 text-gray-700 bg-transparent cursor-pointer";

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Dropdown
      placement="bottom-end"
      showArrow
      offset={14}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          radius="sm"
          variant="flat"
          aria-label="Notifications"
          className="relative h-9 w-9 min-w-9 overflow-visible bg-[#3a3a3a] text-white data-[hover=true]:bg-[#4a4a4a]"
        >
          <BsBellFill className="text-lg" />
          {unreadCounts.all > 0 && (
            <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-tiny text-white">
              {unreadCounts.all}
            </span>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifications"
        closeOnSelect={false}
        className="w-[380px] max-h-[820px] overflow-y-auto p-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        topContent={
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <p className="text-sm font-semibold text-[#131720]">Notification</p>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
                <IoClose className="cursor-pointer text-lg text-[#868AA5]" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const count =
                  f.key === "all" ? 0 : unreadCounts[f.key as Notification["category"]];
                return (
                  <Chip
                    key={f.key}
                    size="sm"
                    radius="sm"
                    className={chipClass(filter === f.key)}
                    onClick={() => setFilter(f.key)}
                    classNames={{
                      content: "flex items-center gap-1 cursor-pointer",
                    }}
                  >
                    {f.label}
                    {count > 0 && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] text-white">
                        {count}
                      </span>
                    )}
                  </Chip>
                );
              })}
            </div>

            <div className="mt-2 flex w-full justify-end">
              <button
                type="button"
                className="text-xs text-primary"
                onClick={markAllRead}
              >
                Mark as read
              </button>
            </div>
          </div>
        }
      >
        {filteredGroups.length === 0 ? (
          <DropdownItem key="empty" className="cursor-default" isReadOnly>
            <p className="py-6 text-center text-sm text-[#868AA5]">
              No notifications
            </p>
          </DropdownItem>
        ) : (
          filteredGroups.map(([dateGroup, groupItems]) => (
            <DropdownSection
              key={dateGroup}
              title={dateGroup}
              classNames={{
                heading:
                  "px-4 py-2 text-xs font-semibold text-black cursor-default",
              }}
            >
              {groupItems.map((item) => (
                <DropdownItem
                  key={item.id}
                  className="rounded-none border-b border-gray-200 px-4 py-4"
                  classNames={{
                    base: "data-[hover=true]:bg-[#E6F3FE]",
                  }}
                  textValue={item.title}
                >
                  <div className="flex gap-3">
                    <Avatar
                      size="sm"
                      icon={categoryIcon(item.category)}
                      classNames={{
                        base: "h-7 w-7 opacity-70 bg-transparent",
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#131720]">
                            {item.title}
                          </p>
                          {!item.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <span className="shrink-0 text-xs text-[#868AA5]">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>

                      <p
                        className={`mt-0.5 line-clamp-1 text-xs ${
                          !item.read ? "text-black" : "text-[#44485F]"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                </DropdownItem>
              ))}
            </DropdownSection>
          ))
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
