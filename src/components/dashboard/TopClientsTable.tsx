import {
  addToast,
  Button,
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
import { LogIn } from "lucide-react";
import { useMemo, useState } from "react";
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
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { StatusChip } from "../common/StatusChip";
import { StoreHealthCell } from "../common/StoreHealthCell";

export interface TopClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
}

const columns = [
  { key: "storeName", label: "Store" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "storeHealth", label: "Store Health" },
  { key: "renewalDate", label: "Renewal / Due" },
  { key: "mrr", label: "MRR (₹)" },
  { key: "actions", label: "Actions" },
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

export function TopClientsTable({ clients, isLoading }: TopClientsTableProps) {
  const navigate = useNavigate();
  const [loginClient, setLoginClient] = useState<Client | null>(null);

  const subscriptionByClientId = useMemo(() => {
    const map = new Map<string, Subscription>();
    subscriptions.forEach((sub) => map.set(sub.clientId, sub));
    return map;
  }, []);

  const topClients = useMemo(
    () =>
      [...clients]
        .filter((c) => c.status !== "suspended")
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [clients],
  );

  const renderCell = (client: Client, key: string) => {
    const subscription = subscriptionByClientId.get(client.id);
    const renewal = subscription ? renewalLabel(subscription) : null;

    switch (key) {
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
      case "storeHealth":
        return (
          <StoreHealthCell client={client} subscription={subscription} />
        );
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
              {(column) =>
                column.key === "actions" ? (
                  <TableColumn key="actions" align="end">
                    {column.label}
                  </TableColumn>
                ) : (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )
              }
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
                  {(columnKey) => (
                    <TableCell>{renderCell(client, String(columnKey))}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardBody>

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
    </Card>
  );
}
