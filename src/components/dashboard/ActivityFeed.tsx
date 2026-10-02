import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import type { IconType } from "react-icons";
import {
  HiOutlineArrowDownCircle,
  HiOutlineArrowUpCircle,
  HiOutlineCreditCard,
  HiOutlineNoSymbol,
  HiOutlineUserPlus,
} from "react-icons/hi2";
import type { ActivityItem, ActivityType } from "../../types";
import { formatDateTime } from "../../lib/utils";

export interface ActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
}

const iconMap: Record<ActivityType, IconType> = {
  signup: HiOutlineUserPlus,
  upgrade: HiOutlineArrowUpCircle,
  downgrade: HiOutlineArrowDownCircle,
  cancellation: HiOutlineNoSymbol,
  failed_payment: HiOutlineCreditCard,
  payout: HiOutlineCreditCard,
  note: HiOutlineUserPlus,
};

const colorMap: Record<ActivityType, string> = {
  signup: "bg-success/15 text-success",
  upgrade: "bg-primary/15 text-primary",
  downgrade: "bg-warning/15 text-warning",
  cancellation: "bg-danger/15 text-danger",
  failed_payment: "bg-danger/15 text-danger",
  payout: "bg-secondary/15 text-secondary",
  note: "bg-default-100 text-default-600",
};

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  return (
    <Card shadow="none" className="h-full">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
        <h2 className="text-base font-semibold">Recent activity</h2>
        <p className="text-xs text-default-500">Signups, upgrades, cancellations & payments</p>
      </CardHeader>
      <CardBody className="px-3 pb-4 pt-0">
        {isLoading ? (
          <div className="space-y-3 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <ul className="custom-scroll max-h-[420px] space-y-1 overflow-y-auto pr-1">
            {items.map((item) => {
              const Icon = iconMap[item.type];
              return (
                <li
                  key={item.id}
                  className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-default-50"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colorMap[item.type]}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <time className="shrink-0 text-[11px] text-default-400">
                        {formatDateTime(item.timestamp)}
                      </time>
                    </div>
                    <p className="text-xs text-default-500">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
