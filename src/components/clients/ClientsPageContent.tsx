import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Client, ClientStatus, PlanName } from "../../types";
import { useClients } from "../../providers/ClientsProvider";
import { PageHeader } from "../common/PageHeader";
import { tablePanelClassName } from "../common/dataTableStyles";
import {
  FilterCheckboxGroup,
  TableToolbar,
} from "../common/TableToolbar";
import { ClientsTable } from "./ClientsTable";

export interface ClientsPageContentProps {
  clients: Client[];
}

const allColumnKeys = [
  "storeName",
  "plan",
  "status",
  "renewalDate",
  "mrr",
  "orders30d",
];

const columnOptions = [
  { key: "storeName", label: "Store" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "renewalDate", label: "Renewal / Due" },
  { key: "mrr", label: "MRR (₹)" },
  { key: "orders30d", label: "Orders (30d)" },
];

const planMrr: Record<PlanName, number> = {
  Free: 0,
  Starter: 29,
  Pro: 99,
  Enterprise: 299,
};

export function ClientsPageContent({ clients }: ClientsPageContentProps) {
  const { addClient } = useClients();
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [plan, setPlan] = useState<PlanName>("Starter");
  const [status, setStatus] = useState<ClientStatus>("trial");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesSearch =
        !query ||
        client.storeName.toLowerCase().includes(query) ||
        client.ownerEmail.toLowerCase().includes(query) ||
        client.ownerName.toLowerCase().includes(query);
      const matchesPlan =
        plans.length === 0 || plans.includes(client.plan);
      const matchesStatus =
        statuses.length === 0 || statuses.includes(client.status);
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [clients, plans, search, statuses]);

  const resetForm = () => {
    setStoreName("");
    setOwnerName("");
    setOwnerEmail("");
    setPlan("Starter");
    setStatus("trial");
  };

  const handleCreate = () => {
    const store = storeName.trim();
    const owner = ownerName.trim();
    const email = ownerEmail.trim().toLowerCase();

    if (!store) {
      addToast({ title: "Store name required", color: "danger" });
      return;
    }
    if (!owner) {
      addToast({ title: "Owner name required", color: "danger" });
      return;
    }
    if (!email || !email.includes("@")) {
      addToast({ title: "Valid owner email required", color: "danger" });
      return;
    }

    const now = new Date().toISOString();
    const mrr = status === "suspended" ? 0 : planMrr[plan];

    addClient({
      id: `cli-${Date.now()}`,
      storeName: store,
      ownerName: owner,
      ownerEmail: email,
      plan,
      status,
      mrr,
      orders30d: 0,
      revenue: 0,
      growthPercent: 0,
      lastActive: now,
      joinedDate: now.slice(0, 10),
      usage: { products: 0, storageGb: 0, bandwidthGb: 0 },
      notes: "",
    });

    setCreateOpen(false);
    resetForm();
    addToast({
      title: "Client added",
      description: `${store} was added to the platform.`,
      color: "success",
    });
  };

  return (
    <div>
      <PageHeader
        title={`Clients (${clients.length})`}
        description="Monitor and manage every client store on the Zcommerce platform."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clients" }]}
        actions={
          <Button
            color="primary"
            radius="full"
            size="sm"
            className="h-8 px-5 font-medium"
            startContent={<Plus size={14} strokeWidth={2.5} />}
            onPress={() => setCreateOpen(true)}
          >
            Add client
          </Button>
        }
      />

      <Card shadow="none" className={tablePanelClassName}>
        <CardBody className="gap-0 p-0">
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search for client details..."
            columns={columnOptions}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            filterContent={
              <>
                <FilterCheckboxGroup
                  label="Plan"
                  options={(["Free", "Starter", "Pro", "Enterprise"] as PlanName[]).map(
                    (planOption) => ({ key: planOption, label: planOption }),
                  )}
                  value={plans}
                  onChange={setPlans}
                />
                <FilterCheckboxGroup
                  label="Status"
                  options={(["active", "trial", "suspended"] as ClientStatus[]).map(
                    (statusOption) => ({
                      key: statusOption,
                      label:
                        statusOption.charAt(0).toUpperCase() + statusOption.slice(1),
                    }),
                  )}
                  value={statuses}
                  onChange={setStatuses}
                />
                <Select
                  aria-label="Quick plan filter"
                  label="Quick plan"
                  size="sm"
                  selectedKeys={plans.length === 1 ? new Set(plans) : new Set()}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    setPlans(typeof value === "string" && value ? [value] : []);
                  }}
                >
                  <SelectItem key="Free">Free</SelectItem>
                  <SelectItem key="Starter">Starter</SelectItem>
                  <SelectItem key="Pro">Pro</SelectItem>
                  <SelectItem key="Enterprise">Enterprise</SelectItem>
                </Select>
              </>
            }
          />
          <ClientsTable
            clients={filtered}
            isLoading={loading}
            visibleColumns={visibleColumns}
          />
        </CardBody>
      </Card>

      <Modal
        isOpen={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        placement="center"
        size="lg"
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>Add client</ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Store name"
                  placeholder="Drift Skate Co."
                  value={storeName}
                  onValueChange={setStoreName}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    label="Owner name"
                    placeholder="Leo Martinez"
                    value={ownerName}
                    onValueChange={setOwnerName}
                  />
                  <Input
                    label="Owner email"
                    type="email"
                    placeholder="leo@store.com"
                    value={ownerEmail}
                    onValueChange={setOwnerEmail}
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select
                    label="Plan"
                    selectedKeys={new Set([plan])}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      if (
                        value === "Free" ||
                        value === "Starter" ||
                        value === "Pro" ||
                        value === "Enterprise"
                      ) {
                        setPlan(value);
                      }
                    }}
                    disallowEmptySelection
                  >
                    <SelectItem key="Free">Free</SelectItem>
                    <SelectItem key="Starter">Starter</SelectItem>
                    <SelectItem key="Pro">Pro</SelectItem>
                    <SelectItem key="Enterprise">Enterprise</SelectItem>
                  </Select>
                  <Select
                    label="Status"
                    selectedKeys={new Set([status])}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      if (
                        value === "active" ||
                        value === "trial" ||
                        value === "suspended"
                      ) {
                        setStatus(value);
                      }
                    }}
                    disallowEmptySelection
                  >
                    <SelectItem key="trial">Trial</SelectItem>
                    <SelectItem key="active">Active</SelectItem>
                    <SelectItem key="suspended">Suspended</SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleCreate}>
                  Add client
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
