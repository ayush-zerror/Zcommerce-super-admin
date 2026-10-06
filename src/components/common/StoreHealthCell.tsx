import { Progress, Tooltip } from "@heroui/react";
import type { Client, Subscription } from "../../types";
import { getStoreHealth } from "../../lib/storeHealth";

export interface StoreHealthCellProps {
  client: Client;
  subscription?: Subscription;
}

export function StoreHealthCell({ client, subscription }: StoreHealthCellProps) {
  const health = getStoreHealth(client, subscription);
  const tip = `${health.label} · ${health.factors.slice(0, 4).join(" · ")}`;

  return (
    <Tooltip content={tip} placement="top">
      <div className="flex w-28 flex-col gap-1 overflow-hidden">
        <div className="flex min-w-0 items-center justify-between gap-1">
          <span className="shrink-0 text-sm font-semibold tabular-nums">
            {health.score}%
          </span>
          <span className="min-w-0 truncate text-right text-[11px] text-default-400">
            {health.label}
          </span>
        </div>
        <Progress
          aria-label={`Store health ${health.score}%`}
          size="sm"
          value={health.score}
          color={health.tone}
          className="w-full max-w-full"
          classNames={{
            base: "max-w-full",
            track: "h-1.5 w-full bg-default-100",
            indicator: "rounded-full",
          }}
        />
      </div>
    </Tooltip>
  );
}
