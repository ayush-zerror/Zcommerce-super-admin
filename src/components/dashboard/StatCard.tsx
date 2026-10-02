import { Card, CardBody, Skeleton } from "@heroui/react";
import type { IconType } from "react-icons";
import { HiOutlineArrowDownRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import { formatPercent } from "../../lib/utils";

export interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: IconType;
  isLoading?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, isLoading }: StatCardProps) {
  const isPositive = change >= 0;

  if (isLoading) {
    return (
      <Card shadow="none">
        <CardBody className="gap-3 p-5">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-4 w-20 rounded-lg" />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card shadow="none">
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-default-500">{title}</p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon size={18} />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>
        <div
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? (
            <HiOutlineArrowUpRight size={14} />
          ) : (
            <HiOutlineArrowDownRight size={14} />
          )}
          <span>{formatPercent(change)}</span>
          <span className="font-normal text-default-400">vs last period</span>
        </div>
      </CardBody>
    </Card>
  );
}
