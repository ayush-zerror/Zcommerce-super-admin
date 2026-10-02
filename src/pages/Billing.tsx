import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CouponsTab } from "../components/billing/CouponsTab";
import { RevenueReportsTab } from "../components/billing/RevenueReportsTab";
import { SubscriptionsTab } from "../components/billing/SubscriptionsTab";
import { PageHeader } from "../components/common/PageHeader";
import { coupons as initialCoupons, subscriptions } from "../lib/mockData";
import type { Coupon } from "../types";

const sections = {
  subscriptions: {
    title: "Subscriptions",
    description: "Track renewals, past due, pending, and expiring subscriptions.",
  },
  coupons: {
    title: "Coupons",
    description: "Create and review discount codes for client subscriptions.",
  },
  reports: {
    title: "Revenue Reports",
    description: "Subscription revenue breakdown by plan over time.",
  },
} as const;

type BillingSection = keyof typeof sections;

export function Billing() {
  const { section } = useParams<{ section: string }>();
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [createOpen, setCreateOpen] = useState(false);

  const active = useMemo(() => {
    if (!section || !(section in sections)) return null;
    return section as BillingSection;
  }, [section]);

  if (!active) {
    return <Navigate to="/billing/subscriptions" replace />;
  }

  const meta = sections[active];

  return (
    <div>
      <PageHeader
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Billing", href: "/billing/subscriptions" },
          { label: meta.title },
        ]}
        actions={
          active === "coupons" ? (
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="h-8 px-5 font-medium"
              startContent={<Plus size={14} strokeWidth={2.5} />}
              onPress={() => setCreateOpen(true)}
            >
              Create coupon
            </Button>
          ) : undefined
        }
      />

      {active === "subscriptions" ? (
        <SubscriptionsTab subscriptions={subscriptions} />
      ) : null}
      {active === "coupons" ? (
        <CouponsTab
          coupons={coupons}
          onCreate={(coupon) => setCoupons((prev) => [coupon, ...prev])}
          createOpen={createOpen}
          onCreateOpenChange={setCreateOpen}
        />
      ) : null}
      {active === "reports" ? <RevenueReportsTab /> : null}
    </div>
  );
}
