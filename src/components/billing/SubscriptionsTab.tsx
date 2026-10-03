import {
  Card,
  CardBody,
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type Selection,
} from "@heroui/react";
import { AlertTriangle, Clock3 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Subscription, SubscriptionStatus } from "../../types";
import { selectionToIdSet } from "../../lib/tableSelection";
import {
  daysUntil,
  formatDate,
  formatNumber,
  isExpiringSoon,
} from "../../lib/utils";
import { dataTableClassNames, tablePanelClassName } from "../common/dataTableStyles";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { TableToolbar } from "../common/TableToolbar";

export type SubscriptionFilter =
  | "all"
  | "active"
  | "expiring"
  | "past_due"
  | "pending"
  | "trialing"
  | "canceled";

export interface SubscriptionsTabProps {
  subscriptions: Subscription[];
}

const columns = [
  { key: "clientName", label: "Client" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "renewalDate", label: "Renewal / Due" },
  { key: "mrr", label: "MRR (₹)" },
] as const;

function renewalLabel(sub: Subscription): {
  text: string;
  tone: "default" | "warning" | "danger";
} {
  const days = daysUntil(sub.renewalDate);
  if (sub.status === "past_due") {
    return {
      text: `Overdue by ${Math.abs(days)}d · ${formatDate(sub.renewalDate)}`,
      tone: "danger",
    };
  }
  if (sub.status === "canceled") {
    return { text: `Ended ${formatDate(sub.renewalDate)}`, tone: "default" };
  }
  if (days < 0) {
    return { text: `Overdue · ${formatDate(sub.renewalDate)}`, tone: "danger" };
  }
  if (isExpiringSoon(sub.renewalDate, 7)) {
    return {
      text:
        days === 0
          ? `Due today · ${formatDate(sub.renewalDate)}`
          : `Expires in ${days}d · ${formatDate(sub.renewalDate)}`,
      tone: "warning",
    };
  }
  return { text: formatDate(sub.renewalDate), tone: "default" };
}

export function SubscriptionsTab({ subscriptions }: SubscriptionsTabProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<SubscriptionFilter>("all");
  const [search, setSearch] = useState("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((column) => column.key),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(() => {
    return {
      all: subscriptions.length,
      active: subscriptions.filter((s) => s.status === "active").length,
      expiring: subscriptions.filter(
        (s) =>
          s.status !== "canceled" &&
          s.status !== "past_due" &&
          isExpiringSoon(s.renewalDate, 7),
      ).length,
      past_due: subscriptions.filter((s) => s.status === "past_due").length,
      pending: subscriptions.filter((s) => s.status === "pending").length,
      trialing: subscriptions.filter((s) => s.status === "trialing").length,
      canceled: subscriptions.filter((s) => s.status === "canceled").length,
    };
  }, [subscriptions]);

  const filterOptions: { key: SubscriptionFilter; label: string }[] = [
    { key: "all", label: `All (${counts.all})` },
    { key: "active", label: `Active (${counts.active})` },
    { key: "expiring", label: `Expiring (${counts.expiring})` },
    { key: "past_due", label: `Past due (${counts.past_due})` },
    { key: "pending", label: `Pending (${counts.pending})` },
    { key: "trialing", label: `Trial (${counts.trialing})` },
    { key: "canceled", label: `Canceled (${counts.canceled})` },
  ];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return subscriptions
      .filter((sub) => {
        const matchesSearch =
          !query ||
          sub.clientName.toLowerCase().includes(query) ||
          sub.plan.toLowerCase().includes(query);
        if (!matchesSearch) return false;

        switch (filter) {
          case "all":
            return true;
          case "expiring":
            return (
              sub.status !== "canceled" &&
              sub.status !== "past_due" &&
              isExpiringSoon(sub.renewalDate, 7)
            );
          default:
            return sub.status === (filter as SubscriptionStatus);
        }
      })
      .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate));
  }, [filter, search, subscriptions]);

  const dataColumns = columns.filter((column) =>
    visibleColumns.includes(column.key),
  );
  const headerColumns = dataColumns;

  const handleSelectionChange = (keys: Selection) => {
    setSelected(selectionToIdSet(keys, filtered.map((item) => item.id)));
  };

  const renderCell = (sub: Subscription, key: string) => {
    const renewal = renewalLabel(sub);

    switch (key) {
      case "clientName":
        return <span className="font-medium">{sub.clientName}</span>;
      case "plan":
        return <StatusChip kind="plan" value={sub.plan} />;
      case "status":
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusChip kind="subscription" value={sub.status} />
            {sub.status !== "past_due" &&
            sub.status !== "canceled" &&
            isExpiringSoon(sub.renewalDate, 7) ? (
              <Chip
                size="sm"
                color="warning"
                variant="flat"
                className="rounded-full"
              >
                Expiring
              </Chip>
            ) : null}
          </div>
        );
      case "renewalDate":
        return (
          <span
            className={
              renewal.tone === "danger"
                ? "text-danger text-sm font-medium"
                : renewal.tone === "warning"
                  ? "text-warning text-sm font-medium"
                  : "text-sm text-default-600"
            }
          >
            {renewal.text}
          </span>
        );
      case "mrr":
        return formatNumber(sub.mrr);
      default:
        return "—";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card shadow="none">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-xs text-default-500">Past due</p>
              <p className="text-lg font-bold">{counts.past_due}</p>
            </div>
          </CardBody>
        </Card>
        <Card shadow="none">
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-xs text-default-500">Expiring in 7 days</p>
              <p className="text-lg font-bold">{counts.expiring}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card shadow="none" className={tablePanelClassName}>
        <CardBody className="gap-0 p-0">
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search for subscription details..."
            columns={[...columns].map((column) => ({
              key: column.key,
              label: column.label,
            }))}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            filterContent={
              <Select
                aria-label="Filter subscriptions by status"
                label="Status"
                selectedKeys={new Set([filter])}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0];
                  if (typeof value === "string") {
                    setFilter(value as SubscriptionFilter);
                  }
                }}
                disallowEmptySelection
              >
                {filterOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            }
          />

          <Table
            aria-label="Subscriptions table"
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={handleSelectionChange}
            classNames={{
              ...dataTableClassNames,
              tr: "border-b border-default-100 last:border-b-0 hover:bg-default-50/80 data-[selected=true]:bg-primary/5",
            }}
          >
            <TableHeader columns={headerColumns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={filtered}
              emptyContent={
                <NoDataPlaceholder
                  title="No subscriptions in this view"
                  description="Try another status filter or clear your search."
                />
              }
            >
              {(sub) => (
                <TableRow
                  key={sub.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/clients/${sub.clientId}`)}
                >
                  {(columnKey) => (
                    <TableCell>{renderCell(sub, String(columnKey))}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
