import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { Bell, LineChart, Package, Truck, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { notifications as mockNotifications } from "../../lib/mockData";
import { formatDateTime } from "../../lib/utils";
import type { Notification, NotificationCategory } from "../../types";

function categoryIcon(category: Notification["category"]) {
  switch (category) {
    case "Orders":
      return <Package size={16} />;
    case "Shipping":
      return <Truck size={16} />;
    case "Analytics":
      return <LineChart size={16} />;
    case "Billing":
      return <Wallet size={16} />;
    default:
      return <Bell size={16} />;
  }
}

export function NotificationsPopover() {
  const [items, setItems] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotificationCategory>("All");

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((n) => n.category === filter);
  }, [filter, items]);

  const groups = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const item of filtered) {
      const list = map.get(item.dateGroup) ?? [];
      list.push(item);
      map.set(item.dateGroup, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover placement="bottom-end" offset={12}>
      <Badge
        color="primary"
        content={unreadCount}
        isInvisible={unreadCount === 0}
        shape="circle"
        size="md"
        placement="top-right"
        classNames={{
          base: "border-none",
          badge:
            "border-2 border-navbar min-w-5 h-5 text-[11px] font-bold px-1",
        }}
      >
        <PopoverTrigger>
          <Button
            isIconOnly
            radius="sm"
            variant="flat"
            aria-label="Notifications"
            className="h-9 w-9 min-w-9 bg-[#3a3a3a] text-white data-[hover=true]:bg-[#4a4a4a]"
          >
            <Bell size={18} fill="currentColor" strokeWidth={0} />
          </Button>
        </PopoverTrigger>
      </Badge>
      <PopoverContent className="w-[360px] p-0 sm:w-[400px]">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b border-default-100 px-4 py-3">
            <h3 className="text-base font-semibold">Notification</h3>
            <Button size="sm" variant="light" color="primary" onPress={markAllRead}>
              Mark as read
            </Button>
          </div>

          <div className="px-3 pt-3">
            <Tabs
              aria-label="Notification filters"
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as NotificationCategory)}
              size="sm"
              variant="light"
              classNames={{
                tabList: "gap-1",
                cursor: "bg-primary/15",
                tab: "px-3 h-8",
              }}
            >
              <Tab key="All" title="All" />
              <Tab key="Orders" title={`Orders (${items.filter((n) => n.category === "Orders" && !n.read).length})`} />
              <Tab key="Shipping" title="Shipping" />
              <Tab key="Analytics" title="Analytics" />
              <Tab key="Billing" title="Billing" />
            </Tabs>
          </div>

          <div className="custom-scroll max-h-[360px] overflow-y-auto px-2 py-3">
            {groups.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-default-400">
                No notifications
              </p>
            ) : (
              groups.map(([group, groupItems]) => (
                <div key={group} className="mb-3">
                  <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-default-400">
                    {group}
                  </p>
                  <ul className="space-y-1">
                    {groupItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-default-100"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-default-100 text-default-600">
                          {categoryIcon(item.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{item.title}</span>
                            {!item.read ? (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                            <span className="ml-auto shrink-0 text-[11px] text-default-400">
                              {formatDateTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="truncate text-xs text-default-500">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
