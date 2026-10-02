import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CouponsTab } from "../components/billing/CouponsTab";
import { PageHeader } from "../components/common/PageHeader";
import { coupons as initialCoupons } from "../lib/mockData";
import type { Coupon } from "../types";

const sections = {
  discounts: {
    title: "Discounts",
    description: "Create and review discount codes for client subscriptions.",
  },
} as const;

type SettingsSection = keyof typeof sections;

export function Settings() {
  const { section } = useParams<{ section: string }>();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [createOpen, setCreateOpen] = useState(false);

  const active = useMemo(() => {
    if (!section || !(section in sections)) return null;
    return section as SettingsSection;
  }, [section]);

  if (!active) {
    return <Navigate to="/settings/discounts" replace />;
  }

  const meta = sections[active];

  return (
    <div>
      <PageHeader
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Settings", href: "/settings/discounts" },
          { label: meta.title },
        ]}
        actions={
          <Button
            color="primary"
            radius="full"
            size="sm"
            className="h-8 px-5 font-medium"
            startContent={<Plus size={14} strokeWidth={2.5} />}
            onPress={() => setCreateOpen(true)}
          >
            Create discount
          </Button>
        }
      />

      <CouponsTab
        coupons={coupons}
        onCreate={(coupon) => setCoupons((prev) => [coupon, ...prev])}
        createOpen={createOpen}
        onCreateOpenChange={setCreateOpen}
      />
    </div>
  );
}
