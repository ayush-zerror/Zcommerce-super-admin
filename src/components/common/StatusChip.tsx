import { Chip } from "@heroui/react";
import type { ClientStatus, PlanName, SubscriptionStatus, TransactionStatus, UserStatus } from "../../types";

type ChipColor = "default" | "primary" | "secondary" | "success" | "warning" | "danger";

export interface StatusChipProps {
  kind: "client" | "plan" | "transaction" | "subscription" | "user";
  value: string;
}

function resolveColor(kind: StatusChipProps["kind"], value: string): ChipColor {
  if (kind === "client") {
    const map: Record<ClientStatus, ChipColor> = {
      active: "success",
      trial: "warning",
      suspended: "danger",
    };
    return map[value as ClientStatus] ?? "default";
  }

  if (kind === "plan") {
    const map: Record<PlanName, ChipColor> = {
      Free: "default",
      Starter: "primary",
      Pro: "secondary",
      Enterprise: "warning",
    };
    return map[value as PlanName] ?? "default";
  }

  if (kind === "transaction") {
    const map: Record<TransactionStatus, ChipColor> = {
      success: "success",
      failed: "danger",
      refunded: "warning",
    };
    return map[value as TransactionStatus] ?? "default";
  }

  if (kind === "subscription") {
    const map: Record<SubscriptionStatus, ChipColor> = {
      active: "success",
      trialing: "warning",
      pending: "warning",
      past_due: "danger",
      canceled: "default",
    };
    return map[value as SubscriptionStatus] ?? "default";
  }

  const userMap: Record<UserStatus, ChipColor> = {
    active: "success",
    invited: "warning",
    disabled: "danger",
  };
  return userMap[value as UserStatus] ?? "default";
}

function formatLabel(value: string): string {
  if (value.includes("_")) {
    return value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function StatusChip({ kind, value }: StatusChipProps) {
  return (
    <Chip
      size="sm"
      variant="flat"
      color={resolveColor(kind, value)}
      className="h-7 rounded-full px-3 capitalize"
      classNames={{
        base: "rounded-full",
        content: "font-medium text-xs",
      }}
    >
      {formatLabel(value)}
    </Chip>
  );
}
