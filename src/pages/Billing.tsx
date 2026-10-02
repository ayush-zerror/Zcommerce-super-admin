import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SubscriptionsTab } from "../components/billing/SubscriptionsTab";
import { PageHeader } from "../components/common/PageHeader";
import { TransactionsTab } from "../components/payments/TransactionsTab";
import { subscriptions, transactions } from "../lib/mockData";

const sections = {
  subscriptions: {
    title: "Subscriptions",
    description: "Track renewals, past due, pending, and expiring subscriptions.",
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

      {active === "subscriptions" ? (
        <SubscriptionsTab subscriptions={subscriptions} />
      ) : null}
      {active === "transactions" ? (
        <TransactionsTab transactions={transactions} />
      ) : null}
    </div>
  );
}
