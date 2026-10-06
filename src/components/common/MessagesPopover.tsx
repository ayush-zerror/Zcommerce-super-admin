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
import { FaEnvelope } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface MessageItem {
  id: string;
  from: string;
  preview: string;
  timestamp: string;
  dateGroup: string;
  read: boolean;
}

const initialMessages: MessageItem[] = [
  {
    id: "msg-1",
    from: "Anika Patel",
    preview: "Can you review the Orbit Gadgets suspension notes?",
    timestamp: "2026-03-28T07:40:00Z",
    dateGroup: "Today",
    read: false,
  },
  {
    id: "msg-2",
    from: "Marcus Reed",
    preview: "March payout report is ready for approval.",
    timestamp: "2026-03-28T05:15:00Z",
    dateGroup: "Today",
    read: false,
  },
  {
    id: "msg-3",
    from: "System",
    preview: "Failed payment retry scheduled for Orbit Gadgets.",
    timestamp: "2026-03-27T18:00:00Z",
    dateGroup: "Yesterday",
    read: true,
  },
  {
    id: "msg-4",
    from: "Lena Ortiz",
    preview: "TrailForge Gear asked about upgrading before trial ends.",
    timestamp: "2026-03-26T11:20:00Z",
    dateGroup: "Earlier",
    read: true,
  },
  {
    id: "msg-5",
    from: "Marcus Reed",
    preview: "Coupon PRO50OFF is nearing max redemptions.",
    timestamp: "2026-03-25T09:10:00Z",
    dateGroup: "Earlier",
    read: false,
  },
];

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

export function MessagesPopover() {
  const [items, setItems] = useState<MessageItem[]>(initialMessages);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((m) => !m.read).length,
    [items],
  );

  const filteredGroups = useMemo(() => {
    const filtered =
      filter === "all" ? items : items.filter((item) => !item.read);

    const map = new Map<string, MessageItem[]>();
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
    setItems((prev) => prev.map((m) => ({ ...m, read: true })));
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
          aria-label="Messages"
          className="relative h-9 w-9 min-w-9 overflow-visible bg-[#3a3a3a] text-white data-[hover=true]:bg-[#4a4a4a]"
        >
          <FaEnvelope className="text-lg" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-tiny text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Messages"
        closeOnSelect={false}
        className="w-[380px] max-h-[820px] overflow-y-auto p-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        topContent={
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <p className="text-sm font-semibold text-[#131720]">Message</p>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close">
                <IoClose className="cursor-pointer text-lg text-[#868AA5]" />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <Chip
                size="sm"
                radius="sm"
                className={chipClass(filter === "all")}
                onClick={() => setFilter("all")}
                classNames={{
                  content: "flex items-center gap-1 cursor-pointer",
                }}
              >
                All
              </Chip>

              <Chip
                size="sm"
                radius="sm"
                className={chipClass(filter === "unread")}
                onClick={() => setFilter("unread")}
                classNames={{
                  content: "flex items-center gap-1 cursor-pointer",
                }}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[0.6rem] text-white">
                    {unreadCount}
                  </span>
                )}
              </Chip>
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
            <p className="py-6 text-center text-sm text-[#868AA5]">No messages</p>
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
                  textValue={item.from}
                >
                  <div className="flex gap-3">
                    <Avatar
                      size="sm"
                      name={item.from}
                      classNames={{
                        base: "h-7 w-7 opacity-70",
                        name: "text-[10px]",
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[#131720]">
                            {item.from}
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
                        className={`mt-0.5 line-clamp-2 text-xs ${
                          !item.read ? "text-black" : "text-[#44485F]"
                        }`}
                      >
                        {item.preview}
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
