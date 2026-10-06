import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubscriptionReportsTab } from "../components/billing/SubscriptionReportsTab";
import { PageHeader } from "../components/common/PageHeader";
import { TransactionsTab } from "../components/payments/TransactionsTab";
import { transactions } from "../lib/mockData";

const sections = {
  subscriptions: {
    title: "Subscriptions",
    description:
      "Subscription health, payments, renewals, and shop status in one place.",
  },
  transactions: {
    title: "Transactions",
    description: "Payment charges across Stripe and Razorpay.",
  },
} as const;

type BillingSection = keyof typeof sections;

export function Billing() {
  const { section } = useParams<{ section: string }>();

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
      />

      {active === "subscriptions" ? <SubscriptionReportsTab /> : null}
      {active === "transactions" ? (
        <TransactionsTab transactions={transactions} />
      ) : null}
    </div>
  );
}
