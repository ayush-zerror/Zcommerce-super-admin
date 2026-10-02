import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { dataTableClassNames } from "../common/dataTableStyles";
import { useNavigate } from "react-router-dom";
import type { Client } from "../../types";
import { formatCurrency, formatNumber, formatPercent } from "../../lib/utils";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";

export interface TopClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
}

const columns = [
  { key: "storeName", label: "Client" },
  { key: "plan", label: "Plan" },
  { key: "revenue", label: "Revenue" },
  { key: "orders30d", label: "Orders" },
  { key: "growthPercent", label: "Growth" },
] as const;

export function TopClientsTable({ clients, isLoading }: TopClientsTableProps) {
  const navigate = useNavigate();
  const topClients = [...clients]
    .filter((c) => c.status !== "suspended")
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <Card shadow="none" className="rounded-xl border border-default-200 bg-white">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
        <h2 className="text-base font-semibold">Top performing clients</h2>
        <p className="text-xs text-default-500">Ranked by lifetime platform revenue</p>
      </CardHeader>
      <CardBody className="px-0 pb-0 pt-0">
        {isLoading ? (
          <div className="space-y-3 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <Table
            aria-label="Top performing clients"
            removeWrapper
            classNames={{
              ...dataTableClassNames,
              base: "rounded-none border-0 border-t border-default-200 overflow-hidden bg-white",
            }}
          >
            <TableHeader columns={[...columns]}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody
              items={topClients}
              emptyContent={
                <NoDataPlaceholder
                  title="No clients found"
                  description="Top performing clients will appear here."
                  iconHeight={90}
                />
              }
            >
              {(client) => (
                <TableRow
                  key={client.id}
                  className="cursor-pointer hover:bg-default-50"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium">{client.storeName}</p>
                      <p className="text-xs text-default-400">{client.ownerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusChip kind="plan" value={client.plan} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(client.revenue)}
                  </TableCell>
                  <TableCell>{formatNumber(client.orders30d)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        client.growthPercent >= 0 ? "text-success" : "text-danger"
                      }
                    >
                      {formatPercent(client.growthPercent)}
                    </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
