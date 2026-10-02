import {
  addToast,
  Button,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type SortDescriptor,
} from "@heroui/react";
import { LogIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Client, Subscription } from "../../types";
import { subscriptions } from "../../lib/mockData";
import {
  daysUntil,
  formatDate,
  formatNumber,
  isExpiringSoon,
} from "../../lib/utils";
import { secondaryButtonClassName } from "../common/buttonStyles";
import { ConfirmModal } from "../common/ConfirmModal";
import { dataTableClassNames } from "../common/dataTableStyles";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { TableRowCheckbox, TableSelectAll } from "../common/TableToolbar";

export interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
  visibleColumns?: string[];
}

type ColumnKey =
  | "storeName"
  | "plan"
  | "status"
  | "renewalDate"
  | "mrr"
  | "orders30d"
  | "actions";

const allColumns: { key: ColumnKey; label: string; allowsSorting?: boolean }[] = [
  { key: "storeName", label: "Store", allowsSorting: true },
  { key: "plan", label: "Plan", allowsSorting: true },
  { key: "status", label: "Status", allowsSorting: true },
  { key: "renewalDate", label: "Renewal / Due", allowsSorting: true },
  { key: "mrr", label: "MRR (₹)", allowsSorting: true },
  { key: "orders30d", label: "Orders (30d)", allowsSorting: true },
];

const PAGE_SIZE = 10;

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

function compareClients(
  a: Client,
  b: Client,
  column: ColumnKey,
  byClientId: Map<string, Subscription>,
): number {
  if (column === "renewalDate") {
    const left = byClientId.get(a.id)?.renewalDate ?? "";
    const right = byClientId.get(b.id)?.renewalDate ?? "";
    return left.localeCompare(right);
  }
  if (column === "actions") return 0;

  const left = a[column as keyof Client];
  const right = b[column as keyof Client];
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export function ClientsTable({
  clients,
  isLoading,
  visibleColumns,
}: ClientsTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "storeName",
    direction: "ascending",
  });
  const [loginClient, setLoginClient] = useState<Client | null>(null);

  const subscriptionByClientId = useMemo(() => {
    const map = new Map<string, Subscription>();
    subscriptions.forEach((sub) => map.set(sub.clientId, sub));
    return map;
  }, []);

  const dataColumns = useMemo(() => {
    if (!visibleColumns?.length) return allColumns;
    return allColumns.filter((column) => visibleColumns.includes(column.key));
  }, [visibleColumns]);

  const headerColumns = useMemo(
    () => [
      { key: "select", label: "", allowsSorting: false as boolean | undefined },
      ...dataColumns,
      { key: "actions", label: "Actions", allowsSorting: false as boolean | undefined },
    ],
    [dataColumns],
  );

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [clients]);

  const sorted = useMemo(() => {
    const column = (sortDescriptor.column as ColumnKey) ?? "storeName";
    if (column === ("select" as ColumnKey)) return clients;
    const items = [...clients].sort((a, b) =>
      compareClients(a, b, column, subscriptionByClientId),
    );
    return sortDescriptor.direction === "descending" ? items.reverse() : items;
  }, [clients, sortDescriptor, subscriptionByClientId]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [safePage, sorted]);

  const allPageSelected =
    pageItems.length > 0 && pageItems.every((item) => selected.has(item.id));
  const somePageSelected = pageItems.some((item) => selected.has(item.id));

  if (isLoading) {
    return (
      <div className="space-y-3 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const renderCell = (client: Client, key: string) => {
    if (key === "select") {
      return (
        <TableRowCheckbox
          ariaLabel={`Select ${client.storeName}`}
          isSelected={selected.has(client.id)}
          onValueChange={(checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(client.id);
              else next.delete(client.id);
              return next;
            });
          }}
        />
      );
    }

    const subscription = subscriptionByClientId.get(client.id);
    const renewal = subscription ? renewalLabel(subscription) : null;

    switch (key as ColumnKey) {
      case "storeName":
        return (
          <div>
            <p className="font-medium text-foreground">{client.storeName}</p>
            <p className="text-xs text-default-400">{client.ownerEmail}</p>
          </div>
        );
      case "plan":
        return <StatusChip kind="plan" value={client.plan} />;
      case "status":
        return <StatusChip kind="client" value={client.status} />;
      case "renewalDate":
        if (!renewal) return <span className="text-default-400">—</span>;
        return (
          <span
            className={
              renewal.tone === "danger"
                ? "text-sm font-medium text-danger"
                : renewal.tone === "warning"
                  ? "text-sm font-medium text-warning"
                  : "text-sm text-default-600"
            }
          >
            {renewal.text}
          </span>
        );
      case "mrr":
        return <span className="font-medium">{formatNumber(client.mrr)}</span>;
      case "orders30d":
        return formatNumber(client.orders30d);
      case "actions":
        return (
          <div
            className="flex justify-end"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              radius="full"
              variant="bordered"
              color="primary"
              className={secondaryButtonClassName}
              startContent={<LogIn size={14} strokeWidth={2.5} />}
              onPress={() => setLoginClient(client)}
            >
              Login
            </Button>
          </div>
        );
      default:
        return "—";
    }
  };

  return (
    <div>
      <Table
        aria-label="Clients table"
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          setSortDescriptor(descriptor);
          setPage(1);
        }}
        classNames={dataTableClassNames}
      >
        <TableHeader columns={headerColumns}>
          {(column) =>
            column.key === "select" ? (
              <TableColumn key="select" width={48} allowsSorting={false}>
                <TableSelectAll
                  isSelected={allPageSelected}
                  isIndeterminate={somePageSelected && !allPageSelected}
                  onValueChange={(checked) => {
                    setSelected((prev) => {
                      const next = new Set(prev);
                      pageItems.forEach((item) => {
                        if (checked) next.add(item.id);
                        else next.delete(item.id);
                      });
                      return next;
                    });
                  }}
                />
              </TableColumn>
            ) : column.key === "actions" ? (
              <TableColumn key="actions" align="end" allowsSorting={false}>
                {column.label}
              </TableColumn>
            ) : (
              <TableColumn key={column.key} allowsSorting={column.allowsSorting}>
                {column.label}
              </TableColumn>
            )
          }
        </TableHeader>
        <TableBody
          items={pageItems}
          emptyContent={
            <NoDataPlaceholder
              title="No clients match your filters"
              description="Try adjusting search or filter criteria."
            />
          }
        >
          {(client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer"
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              {(columnKey) => (
                <TableCell>{renderCell(client, String(columnKey))}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between gap-3 border-t border-default-100 px-4 py-3">
        <p className="text-xs text-default-400">
          Showing {(safePage - 1) * PAGE_SIZE + (pageItems.length ? 1 : 0)}–
          {Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length}
        </p>
        <Pagination
          page={safePage}
          total={pageCount}
          onChange={setPage}
          size="sm"
          showControls
          classNames={{ cursor: "bg-primary" }}
        />
      </div>

      <ConfirmModal
        isOpen={loginClient !== null}
        onClose={() => setLoginClient(null)}
        title={loginClient ? `Login as ${loginClient.storeName}?` : ""}
        description="This would open an impersonation session in production. In this demo, only a toast is shown."
        confirmLabel="Continue"
        confirmColor="primary"
        onConfirm={() => {
          if (!loginClient) return;
          addToast({
            title: "Impersonation started (demo)",
            description: `You would now be logged in as ${loginClient.ownerEmail}.`,
            color: "primary",
          });
          setLoginClient(null);
        }}
      />
    </div>
  );
}
