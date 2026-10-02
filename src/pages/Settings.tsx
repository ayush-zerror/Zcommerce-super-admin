import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { PlatformSettingsTab } from "../components/settings/PlatformSettingsTab";
import { RolesUsersTab } from "../components/settings/RolesUsersTab";
import { adminUsers as initialUsers } from "../lib/mockData";
import type { AdminUser } from "../types";

const sections = {
  users: {
    title: "Roles & Users",
    description: "Manage internal team access and invitations.",
  },
  platform: {
    title: "Platform Settings",
    description: "Branding and notification preferences.",
  },
} as const;

type SettingsSection = keyof typeof sections;

export function Settings() {
  const { section } = useParams<{ section: string }>();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const active = useMemo(() => {
    if (!section || !(section in sections)) return null;
    return section as SettingsSection;
  }, [section]);

  if (!active) {
    return <Navigate to="/settings/users" replace />;
  }

  const meta = sections[active];

  return (
    <div>
      <PageHeader
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Settings", href: "/settings/users" },
          { label: meta.title },
        ]}
        actions={
          active === "users" ? (
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="h-8 px-5 font-medium"
              startContent={<Plus size={14} strokeWidth={2.5} />}
              onPress={() => setInviteOpen(true)}
            >
              Invite user
            </Button>
          ) : undefined
        }
      />

      {active === "users" ? (
        <RolesUsersTab
          users={users}
          onInvite={(user) => setUsers((prev) => [user, ...prev])}
          inviteOpen={inviteOpen}
          onInviteOpenChange={setInviteOpen}
        />
      ) : null}
      {active === "platform" ? <PlatformSettingsTab /> : null}
    </div>
  );
}
