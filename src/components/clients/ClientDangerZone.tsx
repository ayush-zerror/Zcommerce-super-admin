import { addToast, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { useState } from "react";
import type { Client, ClientStatus } from "../../types";
import { ConfirmModal } from "../common/ConfirmModal";

export interface ClientDangerZoneProps {
  client: Client;
  onStatusChange: (status: ClientStatus) => void;
  onDelete: () => void;
}

export function ClientDangerZone({
  client,
  onStatusChange,
  onDelete,
}: ClientDangerZoneProps) {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isSuspended = client.status === "suspended";

  return (
    <>
      <Card shadow="none" className="bg-danger-50/40 dark:bg-danger-100/10">
        <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
          <h3 className="text-base font-semibold text-danger">Danger zone</h3>
          <p className="text-xs text-default-500">
            Destructive account actions. Confirm carefully — demo only updates local state.
          </p>
        </CardHeader>
        <CardBody className="gap-4 px-5 pb-5">
          <div className="flex flex-col gap-3 rounded-xl border border-default-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                {isSuspended ? "Reactivate store" : "Suspend store"}
              </p>
              <p className="text-xs text-default-500">
                {isSuspended
                  ? "Restore access for the merchant admin panel."
                  : "Block storefront and merchant dashboard access."}
              </p>
            </div>
            {isSuspended ? (
              <Button color="success" variant="flat" onPress={() => setActivateOpen(true)}>
                Reactivate
              </Button>
            ) : (
              <Button color="warning" variant="flat" onPress={() => setSuspendOpen(true)}>
                Suspend
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-danger-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-danger-100/40">
            <div>
              <p className="text-sm font-semibold text-danger">Delete client</p>
              <p className="text-xs text-default-500">
                Permanently remove this client from the admin panel list.
              </p>
            </div>
            <Button color="danger" variant="flat" onPress={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </CardBody>
      </Card>

      <ConfirmModal
        isOpen={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title={`Suspend ${client.storeName}?`}
        description="The merchant will lose access until reactivated. Orders and data remain intact."
        confirmLabel="Suspend client"
        confirmColor="warning"
        onConfirm={() => {
          onStatusChange("suspended");
          addToast({
            title: "Client suspended",
            description: `${client.storeName} has been suspended.`,
            color: "warning",
          });
        }}
      />

      <ConfirmModal
        isOpen={activateOpen}
        onClose={() => setActivateOpen(false)}
        title={`Reactivate ${client.storeName}?`}
        description="Store access will be restored immediately for the merchant team."
        confirmLabel="Reactivate"
        confirmColor="success"
        onConfirm={() => {
          onStatusChange("active");
          addToast({
            title: "Client reactivated",
            description: `${client.storeName} is active again.`,
            color: "success",
          });
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={`Delete ${client.storeName}?`}
        description="This removes the client from the demo list. No backend delete is performed."
        confirmLabel="Delete permanently"
        confirmColor="danger"
        onConfirm={() => {
          onDelete();
          addToast({
            title: "Client deleted",
            description: `${client.storeName} was removed from local state.`,
            color: "danger",
          });
        }}
      />
    </>
  );
}
