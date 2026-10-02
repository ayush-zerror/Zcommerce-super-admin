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
import { dataTableClassNames } from "../common/dataTableStyles";
import type { ReactNode } from "react";
import type { Client, Subscription, Transaction } from "../../types";
import { formatCurrency, formatDate, formatDateTime } from "../../lib/utils";
import { StatusChip } from "../common/StatusChip";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";

export interface ClientBillingTabProps {
  client: Client;
  subscription?: Subscription;
  transactions: Transaction[];
}

const txnColumns = [
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "gateway", label: "Gateway" },
  { key: "status", label: "Status" },
  { key: "transactionId", label: "Transaction ID" },
] as const;

export function ClientBillingTab({
  client,
  subscription,
  transactions,
}: ClientBillingTabProps) {
  return (
    <div className="space-y-4">
      <Card shadow="none">
        <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
          <h3 className="text-base font-semibold">Current subscription</h3>
          <p className="text-xs text-default-500">
            Billing summary for {client.storeName}
          </p>
        </CardHeader>
        <CardBody className="grid grid-cols-1 gap-4 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem label="Plan" value={subscription?.plan ?? client.plan} />
          <SummaryItem
            label="Status"
            valueNode={
              <StatusChip
                kind="subscription"
                value={subscription?.status ?? (client.status === "trial" ? "trialing" : "active")}
              />
            }
          />
          <SummaryItem
            label="Renewal date"
            value={
              subscription?.renewalDate
                ? formatDate(subscription.renewalDate)
                : "—"
            }
          />
          <SummaryItem
            label="MRR contribution"
            value={formatCurrency(subscription?.mrr ?? client.mrr)}
          />
        </CardBody>
      </Card>

      <Card shadow="none" className="rounded-xl border border-default-200 bg-white overflow-hidden">
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
                  <TableCell>{txn.gateway}</TableCell>
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
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value?: string;
  valueNode?: ReactNode;
}

function SummaryItem({ label, value, valueNode }: SummaryItemProps) {
  return (
    <div className="rounded-xl bg-default-50 px-4 py-3 dark:bg-default-100/10">
      <p className="text-xs text-default-500">{label}</p>
      <div className="mt-1 text-sm font-semibold">
        {valueNode ?? value}
      </div>
    </div>
  );
}
