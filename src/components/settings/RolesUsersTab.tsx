import {
  addToast,
  Avatar,
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
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useMemo, useState } from "react";
import type { AdminUser, UserRole } from "../../types";
import { formatDateTime } from "../../lib/utils";
import { dataTableFillClassNames, tablePanelFillClassName } from "../common/dataTableStyles";
import { StatusChip } from "../common/StatusChip";
import {
  FilterCheckboxGroup,
  TableRowCheckbox,
  TableSelectAll,
  TableToolbar,
} from "../common/TableToolbar";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";

export interface RolesUsersTabProps {
  users: AdminUser[];
  onInvite: (user: AdminUser) => void;
  inviteOpen: boolean;
  onInviteOpenChange: (open: boolean) => void;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "lastLogin", label: "Last login" },
] as const;

const roles: UserRole[] = [
  "Super Admin",
  "Support Agent",
  "Billing Manager",
  "Read-only",
];

export function RolesUsersTab({
  users,
  onInvite,
  inviteOpen,
  onInviteOpenChange,
}: RolesUsersTabProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("Support Agent");
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((column) => column.key),
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query);
      const matchesStatus =
        statuses.length === 0 || statuses.includes(user.status);
      return matchesSearch && matchesStatus;
    });
  }, [search, statuses, users]);

  const dataColumns = columns.filter((column) =>
    visibleColumns.includes(column.key),
  );
  const headerColumns = useMemo(
    () => [{ key: "select", label: "" }, ...dataColumns],
    [dataColumns],
  );

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selected.has(item.id));
  const someSelected = filtered.some((item) => selected.has(item.id));

  const renderCell = (user: AdminUser, key: string) => {
    if (key === "select") {
      return (
        <TableRowCheckbox
          ariaLabel={`Select ${user.name}`}
          isSelected={selected.has(user.id)}
          onValueChange={(checked) => {
            setSelected((prev) => {
              const next = new Set(prev);
              if (checked) next.add(user.id);
              else next.delete(user.id);
              return next;
            });
          }}
        />
      );
    }

    switch (key) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              name={user.avatarInitials}
              size="sm"
              classNames={{ base: "bg-primary text-white" }}
            />
            <span className="font-medium">{user.name}</span>
          </div>
        );
      case "email":
        return user.email;
      case "role":
        return user.role;
      case "status":
        return <StatusChip kind="user" value={user.status} />;
      case "lastLogin":
        return (
          <span className="text-sm text-default-600">
            {user.lastLogin === "—" ? "—" : formatDateTime(user.lastLogin)}
          </span>
        );
      default:
        return "—";
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setRole("Support Agent");
  };

  const handleInvite = () => {
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      addToast({
        title: "Invalid invite",
        description: "Provide a name and valid email.",
        color: "danger",
      });
      return;
    }
    const initials = name
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();

    onInvite({
      id: `admin-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      status: "invited",
      lastLogin: "—",
      avatarInitials: initials || "NA",
    });
    onInviteOpenChange(false);
    reset();
    addToast({
      title: "Invite sent",
      description: `${email.trim()} was invited as ${role}.`,
      color: "success",
    });
  };

  return (
    <>
      <Card shadow="none" className={tablePanelFillClassName}>
        <CardBody className="flex min-h-0 flex-1 flex-col gap-0 p-0">
          <TableToolbar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search for user details..."
            columns={[...columns].map((column) => ({
              key: column.key,
              label: column.label,
            }))}
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={setVisibleColumns}
            filterContent={
              <FilterCheckboxGroup
                label="Status"
                options={[
                  { key: "active", label: "Active" },
                  { key: "invited", label: "Invited" },
                  { key: "disabled", label: "Disabled" },
                ]}
                value={statuses}
                onChange={setStatuses}
              />
            }
          />
          <Table
            aria-label="Admin users table"
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
                  title="No users"
                  description="Invite a teammate to manage the platform."
                  buttonLabel="Invite user"
                  onButtonClick={() => onInviteOpenChange(true)}
                />
              }
            >
              {(user) => (
                <TableRow key={user.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(user, String(columnKey))}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={inviteOpen}
        onClose={() => {
          onInviteOpenChange(false);
          reset();
        }}
        placement="center"
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader>Invite user</ModalHeader>
              <ModalBody className="gap-3">
                <Input label="Full name" value={name} onValueChange={setName} />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                />
                <Select
                  label="Role"
                  selectedKeys={new Set([role])}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0];
                    if (typeof value === "string") setRole(value as UserRole);
                  }}
                  disallowEmptySelection
                >
                  {roles.map((option) => (
                    <SelectItem key={option}>{option}</SelectItem>
                  ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={close}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleInvite}>
                  Send invite
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
