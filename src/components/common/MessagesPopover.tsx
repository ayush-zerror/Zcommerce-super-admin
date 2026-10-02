import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { CreditCard, Headphones, Mail, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDateTime } from "../../lib/utils";

type MessageCategory = "All" | "Support" | "Billing" | "Alerts";

interface MessageItem {
  id: string;
  category: Exclude<MessageCategory, "All">;
  from: string;
  preview: string;
  timestamp: string;
  dateGroup: string;
  read: boolean;
}

const initialMessages: MessageItem[] = [
  {
    id: "msg-1",
    category: "Support",
    from: "Anika Patel",
    preview: "Can you review the Orbit Gadgets suspension notes?",
    timestamp: "2026-03-28T07:40:00Z",
    dateGroup: "Today",
    read: false,
  },
  {
    id: "msg-2",
    category: "Billing",
    from: "Marcus Reed",
    preview: "March payout report is ready for approval.",
    timestamp: "2026-03-28T05:15:00Z",
    dateGroup: "Today",
    read: false,
  },
  {
    id: "msg-3",
    category: "Alerts",
    from: "System",
    preview: "Failed payment retry scheduled for Orbit Gadgets.",
    timestamp: "2026-03-27T18:00:00Z",
    dateGroup: "Yesterday",
    read: true,
  },
  {
    id: "msg-4",
    category: "Support",
    from: "Lena Ortiz",
    preview: "TrailForge Gear asked about upgrading before trial ends.",
    timestamp: "2026-03-26T11:20:00Z",
    dateGroup: "Earlier",
    read: true,
  },
  {
    id: "msg-5",
    category: "Billing",
    from: "Marcus Reed",
    preview: "Coupon PRO50OFF is nearing max redemptions.",
    timestamp: "2026-03-25T09:10:00Z",
    dateGroup: "Earlier",
    read: false,
  },
];

function categoryIcon(category: MessageItem["category"]) {
  switch (category) {
    case "Support":
      return <Headphones size={16} />;
    case "Billing":
      return <CreditCard size={16} />;
    case "Alerts":
      return <ShieldAlert size={16} />;
    default:
      return <Mail size={16} />;
  }
}

export function MessagesPopover() {
  const [items, setItems] = useState<MessageItem[]>(initialMessages);
  const [filter, setFilter] = useState<MessageCategory>("All");

  const unreadCount = items.filter((m) => !m.read).length;

  const filtered = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((m) => m.category === filter);
  }, [filter, items]);

  const groups = useMemo(() => {
    const map = new Map<string, MessageItem[]>();
    for (const item of filtered) {
      const list = map.get(item.dateGroup) ?? [];
      list.push(item);
      map.set(item.dateGroup, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const markAllRead = () => {
    setItems((prev) => prev.map((m) => ({ ...m, read: true })));
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
            aria-label="Messages"
            className="h-9 w-9 min-w-9 bg-[#3a3a3a] text-white data-[hover=true]:bg-[#4a4a4a]"
          >
            <Mail size={18} fill="currentColor" strokeWidth={0} />
          </Button>
        </PopoverTrigger>
      </Badge>
      <PopoverContent className="w-[360px] p-0 sm:w-[400px]">
        <div className="flex w-full flex-col">
          <div className="flex items-center justify-between border-b border-default-100 px-4 py-3">
            <h3 className="text-base font-semibold">Messages</h3>
            <Button size="sm" variant="light" color="primary" onPress={markAllRead}>
              Mark as read
            </Button>
          </div>

          <div className="px-3 pt-3">
            <Tabs
              aria-label="Message filters"
              selectedKey={filter}
              onSelectionChange={(key) => setFilter(key as MessageCategory)}
              size="sm"
              variant="light"
              classNames={{
                tabList: "gap-1",
                cursor: "bg-primary/15",
                tab: "px-3 h-8",
              }}
            >
              <Tab key="All" title="All" />
              <Tab
                key="Support"
                title={`Support (${items.filter((m) => m.category === "Support" && !m.read).length})`}
              />
              <Tab key="Billing" title="Billing" />
              <Tab key="Alerts" title="Alerts" />
            </Tabs>
          </div>

          <div className="custom-scroll max-h-[360px] overflow-y-auto px-2 py-3">
            {groups.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-default-400">
                No messages
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
                            <span className="text-sm font-semibold">{item.from}</span>
                            {!item.read ? (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                            <span className="ml-auto shrink-0 text-[11px] text-default-400">
                              {formatDateTime(item.timestamp)}
                            </span>
                          </div>
                          <p className="truncate text-xs text-default-500">
                            {item.preview}
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
