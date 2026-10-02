import {
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Client } from "../../types";
import { formatCurrency, formatDate, formatDateTime, formatNumber } from "../../lib/utils";
import { dataTableClassNames } from "../common/dataTableStyles";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { TableRowCheckbox, TableSelectAll } from "../common/TableToolbar";

export interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
  visibleColumns?: string[];
}

type SortableColumn =
  | "storeName"
  | "ownerEmail"
  | "plan"
  | "status"
  | "mrr"
  | "orders30d"
  | "lastActive"
  | "joinedDate";

const allColumns: { key: SortableColumn; label: string; allowsSorting?: boolean }[] = [
  { key: "storeName", label: "Store Name", allowsSorting: true },
  { key: "ownerEmail", label: "Owner Email", allowsSorting: true },
  { key: "plan", label: "Plan", allowsSorting: true },
  { key: "status", label: "Status", allowsSorting: true },
  { key: "mrr", label: "MRR", allowsSorting: true },
  { key: "orders30d", label: "Orders (30d)", allowsSorting: true },
  { key: "lastActive", label: "Last Active", allowsSorting: true },
  { key: "joinedDate", label: "Joined Date", allowsSorting: true },
];

const PAGE_SIZE = 10;

function compareClients(a: Client, b: Client, column: SortableColumn): number {
  const left = a[column];
  const right = b[column];
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
    column: "joinedDate",
    direction: "descending",
  });

  const dataColumns = useMemo(() => {
    if (!visibleColumns?.length) return allColumns;
    return allColumns.filter((column) => visibleColumns.includes(column.key));
  }, [visibleColumns]);

  const headerColumns = useMemo(
    () => [{ key: "select", label: "", allowsSorting: false as boolean | undefined }, ...dataColumns],
    [dataColumns],
  );

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [clients]);

  const sorted = useMemo(() => {
    const column = (sortDescriptor.column as SortableColumn) ?? "joinedDate";
    if (column === ("select" as SortableColumn)) return clients;
    const items = [...clients].sort((a, b) => compareClients(a, b, column));
    return sortDescriptor.direction === "descending" ? items.reverse() : items;
  }, [clients, sortDescriptor]);

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

    switch (key as SortableColumn) {
      case "storeName":
        return (
          <div>
            <p className="font-medium text-foreground">{client.storeName}</p>
            <p className="text-xs text-default-400">{client.ownerName}</p>
          </div>
        );
      case "ownerEmail":
        return client.ownerEmail;
      case "plan":
        return <StatusChip kind="plan" value={client.plan} />;
      case "status":
        return <StatusChip kind="client" value={client.status} />;
      case "mrr":
        return <span className="font-medium">{formatCurrency(client.mrr)}</span>;
      case "orders30d":
        return formatNumber(client.orders30d);
      case "lastActive":
        return formatDateTime(client.lastActive);
      case "joinedDate":
        return formatDate(client.joinedDate);
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
    </div>
  );
}
