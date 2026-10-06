import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import type { Client, Transaction } from "../../types";
import { formatCurrency, formatDateTime } from "../../lib/utils";
import { getInputClasses } from "../../styles/inputStyle";
import { dataTableClassNames } from "../common/dataTableStyles";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { StatusChip } from "../common/StatusChip";

export interface ClientBillingTabProps {
  client: Client;
  transactions: Transaction[];
  defaultGracePeriodDays: number;
  onSaveGracePeriod: (days: number | undefined) => void;
}

const txnColumns = [
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "transactionId", label: "Transaction ID" },
] as const;

export function ClientBillingTab({
  client,
  transactions,
  defaultGracePeriodDays,
  onSaveGracePeriod,
}: ClientBillingTabProps) {
  const savedOverride = client.gracePeriodDays;
  const [useOverride, setUseOverride] = useState(savedOverride != null);
  const [days, setDays] = useState(
    String(savedOverride ?? defaultGracePeriodDays),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUseOverride(client.gracePeriodDays != null);
    setDays(String(client.gracePeriodDays ?? defaultGracePeriodDays));
    setError(null);
  }, [client.id, client.gracePeriodDays, defaultGracePeriodDays]);

  const dirty = useMemo(() => {
    if (!useOverride) return savedOverride != null;
    const n = Number(days);
    if (!Number.isFinite(n)) return true;
    return savedOverride !== n;
  }, [useOverride, days, savedOverride]);

  const onSave = () => {
    if (!useOverride) {
      setError(null);
      onSaveGracePeriod(undefined);
      addToast({
        title: "Using platform default grace period",
        description: `${defaultGracePeriodDays} day${defaultGracePeriodDays === 1 ? "" : "s"}`,
        color: "success",
      });
      return;
    }
    const n = Number(days);
    if (!Number.isFinite(n) || n < 0 || n > 30 || !Number.isInteger(n)) {
      setError("Use a whole number from 0–30");
      addToast({ title: "Fix validation errors", color: "danger" });
      return;
    }
    setError(null);
    onSaveGracePeriod(n);
    addToast({
      title: "Grace period updated",
      description: `${n} day${n === 1 ? "" : "s"} for ${client.storeName}`,
      color: "success",
    });
  };

  const onCancel = () => {
    setUseOverride(savedOverride != null);
    setDays(String(savedOverride ?? defaultGracePeriodDays));
    setError(null);
  };

  return (
    <div className="space-y-4">
      <Card shadow="none">
        <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
          <h3 className="text-base font-semibold">Grace period</h3>
          <p className="text-xs text-default-500">
            Extend days after due date when this client says they will pay later.
            Uses the platform default ({defaultGracePeriodDays} day
            {defaultGracePeriodDays === 1 ? "" : "s"}) unless you set a custom
            value below.
          </p>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 px-5 pb-5 sm:max-w-md">
          <Switch
            size="sm"
            isSelected={useOverride}
            onValueChange={(next) => {
              setUseOverride(next);
              if (!next) {
                setDays(String(defaultGracePeriodDays));
                setError(null);
              }
            }}
          >
            Custom grace period for this store
          </Switch>

          {!useOverride ? (
            <p className="text-xs text-default-400">
              Currently using platform default ({defaultGracePeriodDays} days)
            </p>
          ) : (
            <Input
              type="number"
              label="Grace period (days)"
              labelPlacement="outside"
              min={0}
              max={30}
              value={days}
              onValueChange={setDays}
              isInvalid={!!error}
              errorMessage={error}
              description="0–30 days after the due date"
              classNames={getInputClasses()}
            />
          )}

          <div className="flex items-center gap-2">
            <Button size="sm" variant="light" isDisabled={!dirty} onPress={onCancel}>
              Cancel
            </Button>
            <Button
              size="sm"
              color="primary"
              radius="full"
              className="h-8 px-5 font-medium"
              isDisabled={!dirty}
              onPress={onSave}
            >
              Save
            </Button>
            {dirty ? (
              <span className="text-xs text-warning">Unsaved changes</span>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Card
        shadow="none"
        className="overflow-hidden rounded-xl border border-default-200 bg-white"
      >
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
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
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
    </div>
  );
}
