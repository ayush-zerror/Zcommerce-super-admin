import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import type { Transaction } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { dataTableClassNames } from "../common/dataTableStyles";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { StatusChip } from "../common/StatusChip";

export interface ClientBillingTabProps {
  transactions: Transaction[];
}

const txnColumns = [
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "transactionId", label: "Transaction ID" },
] as const;

export function ClientBillingTab({ transactions }: ClientBillingTabProps) {
  return (
    <Card shadow="none" className="overflow-hidden rounded-xl border border-default-200 bg-white">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
        <h3 className="text-base font-semibold">Billing history</h3>
        <p className="text-xs text-default-500">
          Platform subscription charges for this client
        </p>
      </CardHeader>
      <CardBody className="px-0 pb-0 pt-0">
        <Table
          aria-label="Client billing history"
          removeWrapper
          classNames={{
            ...dataTableClassNames,
            base: "rounded-none border-0 border-t border-default-200 overflow-hidden bg-white",
          }}
        >
          <TableHeader columns={[...txnColumns]}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody
            items={transactions}
            emptyContent={
              <NoDataPlaceholder
                title="No billing history yet"
                description="Subscription charges for this client will show up here."
              />
            }
          >
            {(txn) => (
              <TableRow key={txn.id}>
                <TableCell className="text-sm">
                  {formatDateTime(txn.date)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(txn.amount, txn.currency)}
                </TableCell>
                <TableCell>
                  <StatusChip kind="transaction" value={txn.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-default-500">
                  {txn.transactionId}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
