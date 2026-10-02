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
import type { Payout } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import { dataTableFillClassNames, tablePanelFillClassName } from "../common/dataTableStyles";
import {
  FilterCheckboxGroup,
  TableRowCheckbox,
  TableSelectAll,
  TableToolbar,
} from "../common/TableToolbar";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";

export interface PayoutsTabProps {
  payouts: Payout[];
}

const columnOptions = [
  { key: "period", label: "Period" },
  { key: "amount", label: "Gross volume" },
  { key: "commission", label: "Platform commission" },
  { key: "gateway", label: "Gateway" },
  { key: "status", label: "Status" },
  { key: "payoutDate", label: "Payout date" },
];

function payoutColor(
  status: Payout["status"],
): "success" | "warning" | "primary" {
  if (status === "paid") return "success";
  if (status === "pending") return "warning";
  return "primary";
}

export function PayoutsTab({ payouts }: PayoutsTabProps) {
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState(
    columnOptions.map((c) => c.key),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payouts.filter((payout) => {
      const matchesSearch =
        !query ||
        payout.period.toLowerCase().includes(query) ||
        payout.gateway.toLowerCase().includes(query);
      const matchesStatus =
        statuses.length === 0 || statuses.includes(payout.status);
      return matchesSearch && matchesStatus;
    });
  }, [payouts, search, statuses]);

  const dataColumns = columnOptions.filter((c) => visibleColumns.includes(c.key));
  const headerColumns = useMemo(
    () => [{ key: "select", label: "" }, ...dataColumns],
    [dataColumns],
  );

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someSelected = filtered.some((item) => selected.has(item.id));

  const renderCell = (payout: Payout, key: string) => {
    if (key === "select") {
      return (
        <TableRowCheckbox
          ariaLabel={`Select ${payout.period}`}
          isSelected={selected.has(payout.id)}
          onValueChange={(checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(payout.id);
              else next.delete(payout.id);
              return next;
            });
          }}
        />
      );
    }

    switch (key) {
      case "period":
        return <span className="font-medium">{payout.period}</span>;
      case "amount":
        return formatCurrency(payout.amount);
      case "commission":
        return (
          <span className="font-semibold text-primary">
            {formatCurrency(payout.commission)}
          </span>
        );
      case "gateway":
        return payout.gateway;
      case "status":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={payoutColor(payout.status)}
            className="h-7 rounded-full capitalize px-3"
          >
            {payout.status}
          </Chip>
        );
      case "payoutDate":
        return formatDate(payout.payoutDate);
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
          searchPlaceholder="Search for payout details..."
          columns={columnOptions}
          visibleColumns={visibleColumns}
          onVisibleColumnsChange={setVisibleColumns}
          filterContent={
            <FilterCheckboxGroup
              label="Status"
              options={[
                { key: "paid", label: "Paid" },
                { key: "pending", label: "Pending" },
                { key: "processing", label: "Processing" },
              ]}
              value={statuses}
              onChange={setStatuses}
            />
          }
        />

        <Table
          aria-label="Payouts table"
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
                title="No payouts yet"
                description="Platform commission payouts will show up here."
              />
            }
          >
            {(payout) => (
              <TableRow key={payout.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(payout, String(columnKey))}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
