import { addToast, Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { LogIn } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ClientBillingTab } from "../components/clients/ClientBillingTab";
import { ClientDangerZone } from "../components/clients/ClientDangerZone";
import { ClientOverviewTab } from "../components/clients/ClientOverviewTab";
import { ClientUsageTab } from "../components/clients/ClientUsageTab";
import { ConfirmModal } from "../components/common/ConfirmModal";
import { PageHeader } from "../components/common/PageHeader";
import { StatusChip } from "../components/common/StatusChip";
import { plans, subscriptions, transactions } from "../lib/mockData";
import { useClients } from "../providers/ClientsProvider";

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClient, setClientStatus, deleteClient } = useClients();
  const [loginOpen, setLoginOpen] = useState(false);
  const [tab, setTab] = useState("overview");

  const client = id ? getClient(id) : undefined;

  const plan = useMemo(
    () => (client ? plans.find((p) => p.name === client.plan) : undefined),
    [client],
  );

  const subscription = useMemo(
    () => (client ? subscriptions.find((s) => s.clientId === client.id) : undefined),
    [client],
  );

  const clientTransactions = useMemo(
    () => (client ? transactions.filter((t) => t.clientId === client.id) : []),
    [client],
  );

  if (!id) {
    return <Navigate to="/clients" replace />;
  }

  if (!client) {
    return (
      <div>
        <PageHeader
          title="Client not found"
          description="This client may have been deleted or the link is invalid."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Clients", href: "/clients" },
            { label: "Not found" },
          ]}
        />
        <Card shadow="none">
          <CardBody className="items-center gap-3 py-16 text-center">
            <p className="text-default-500">No client with id “{id}”.</p>
            <Button color="primary" variant="flat" onPress={() => navigate("/clients")}>
              Back to clients
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={client.storeName}
        description={`${client.ownerName} · ${client.ownerEmail}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Clients", href: "/clients" },
          { label: client.storeName },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip kind="plan" value={client.plan} />
            <StatusChip kind="client" value={client.status} />
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="h-8 px-5 font-medium"
              startContent={<LogIn size={14} strokeWidth={2.5} />}
              onPress={() => setLoginOpen(true)}
            >
              Login as client
            </Button>
          </div>
        }
      />

      <Tabs
        aria-label="Client detail tabs"
        selectedKey={tab}
        onSelectionChange={(key) => setTab(String(key))}
        variant="underlined"
        color="primary"
        classNames={{
          tabList: "gap-4 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-11",
          panel: "pt-5",
        }}
      >
        <Tab key="overview" title="Overview">
          <ClientOverviewTab client={client} />
        </Tab>
        <Tab key="billing" title="Billing History">
          <ClientBillingTab
            client={client}
            subscription={subscription}
            transactions={clientTransactions}
          />
        </Tab>
        <Tab key="usage" title="Usage">
          <ClientUsageTab client={client} plan={plan} />
        </Tab>
        <Tab key="danger" title="Danger Zone">
          <ClientDangerZone
            client={client}
            onStatusChange={(status) => setClientStatus(client.id, status)}
            onDelete={() => {
              deleteClient(client.id);
              navigate("/clients");
            }}
          />
        </Tab>
      </Tabs>

      <ConfirmModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        title={`Login as ${client.storeName}?`}
        description="This would open an impersonation session in production. In this demo, only a toast is shown."
        confirmLabel="Continue"
        confirmColor="primary"
        onConfirm={() =>
          addToast({
            title: "Impersonation started (demo)",
            description: `You would now be logged in as ${client.ownerEmail}.`,
            color: "primary",
          })
        }
      />
    </div>
  );
}
