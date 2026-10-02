import {
  Card,
  CardBody,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";
import type { Transaction, TransactionStatus } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { dataTableFillClassNames, tablePanelFillClassName } from "../common/dataTableStyles";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import {
  FilterCheckboxGroup,
  TableRowCheckbox,
  TableSelectAll,
  TableToolbar,
} from "../common/TableToolbar";

export interface TransactionsTabProps {
  transactions: Transaction[];
}

const columnOptions = [
  { key: "clientName", label: "Client" },
  { key: "amount", label: "Amount" },
  { key: "gateway", label: "Gateway" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
  { key: "transactionId", label: "Transaction ID" },
];

export function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState(
    columnOptions.map((c) => c.key),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((txn) => {
      const matchesSearch =
        !query ||
        txn.clientName.toLowerCase().includes(query) ||
        txn.transactionId.toLowerCase().includes(query);
      const matchesStatus =
        statuses.length === 0 || statuses.includes(txn.status);
      return matchesSearch && matchesStatus;
    });
  }, [search, statuses, transactions]);

  const dataColumns = columnOptions.filter((c) => visibleColumns.includes(c.key));
  const headerColumns = useMemo(
    () => [{ key: "select", label: "" }, ...dataColumns],
    [dataColumns],
  );

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someSelected = filtered.some((item) => selected.has(item.id));

  const renderCell = (txn: Transaction, key: string) => {
    if (key === "select") {
      return (
        <TableRowCheckbox
          ariaLabel={`Select ${txn.transactionId}`}
          isSelected={selected.has(txn.id)}
          onValueChange={(checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(txn.id);
              else next.delete(txn.id);
              return next;
            });
          }}
        />
      );
    }

    switch (key) {
      case "clientName":
        return <span className="font-medium">{txn.clientName}</span>;
      case "amount":
        return formatCurrency(txn.amount, txn.currency);
      case "gateway":
        return (
          <Chip size="sm" variant="flat" color="primary" className="rounded-full">
            {txn.gateway}
          </Chip>
        );
      case "status":
        return <StatusChip kind="transaction" value={txn.status} />;
      case "date":
        return formatDateTime(txn.date);
      case "transactionId":
        return (
          <span className="font-mono text-xs text-default-500">{txn.transactionId}</span>
        );
      default:
        return "—";
    }
  };

  return (
    <Card shadow="none" className={tablePanelFillClassName}>
      <CardBody className="flex min-h-0 flex-1 flex-col gap-0 p-0">
        <TableToolbar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search for transaction details..."
          columns={columnOptions}
          visibleColumns={visibleColumns}
          onVisibleColumnsChange={setVisibleColumns}
          filterContent={
            <FilterCheckboxGroup
              label="Status"
              options={(["success", "failed", "refunded"] as TransactionStatus[]).map(
                (status) => ({
                  key: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1),
                }),
              )}
              value={statuses}
              onChange={setStatuses}
            />
          }
        />

        <Table
          aria-label="Transactions table"
          classNames={dataTableFillClassNames}
        >
          <TableHeader columns={headerColumns}>
            {(column) =>
              column.key === "select" ? (
                <TableColumn key="select" width={48}>
                  <TableSelectAll
                    isSelected={allSelected}
                    isIndeterminate={someSelected && !allSelected}
                    onValueChange={(checked) => {
                      setSelected(
                        checked
                          ? new Set(filtered.map((item) => item.id))
                          : new Set(),
                      );
                    }}
                  />
                </TableColumn>
              ) : (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )
            }
          </TableHeader>
          <TableBody
            items={filtered}
            emptyContent={
              <NoDataPlaceholder
                title="No transactions found"
                description="Payment charges will appear here once available."
              />
            }
          >
            {(txn) => (
              <TableRow key={txn.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(txn, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
