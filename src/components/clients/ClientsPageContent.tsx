import { Card, CardBody, Select, SelectItem } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import type { Client, ClientStatus, PlanName } from "../../types";
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
  "ownerEmail",
  "plan",
  "status",
  "mrr",
  "orders30d",
  "lastActive",
  "joinedDate",
];

const columnOptions = [
  { key: "storeName", label: "Store Name" },
  { key: "ownerEmail", label: "Owner Email" },
  { key: "plan", label: "Plan" },
  { key: "status", label: "Status" },
  { key: "mrr", label: "MRR" },
  { key: "orders30d", label: "Orders (30d)" },
  { key: "lastActive", label: "Last Active" },
  { key: "joinedDate", label: "Joined Date" },
];

export function ClientsPageContent({ clients }: ClientsPageContentProps) {
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <PageHeader
        title={`Clients (${clients.length})`}
        description="Monitor and manage every client store on the Zcommerce platform."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clients" }]}
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
                    (plan) => ({ key: plan, label: plan }),
                  )}
                  value={plans}
                  onChange={setPlans}
                />
                <FilterCheckboxGroup
                  label="Status"
                  options={(["active", "trial", "suspended"] as ClientStatus[]).map(
                    (status) => ({
                      key: status,
                      label: status.charAt(0).toUpperCase() + status.slice(1),
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
    </div>
  );
}
