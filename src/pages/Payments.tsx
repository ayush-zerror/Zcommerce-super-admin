import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { PayoutsTab } from "../components/payments/PayoutsTab";
import { TransactionsTab } from "../components/payments/TransactionsTab";
import { payouts, transactions } from "../lib/mockData";

const sections = {
  transactions: {
    title: "Transactions",
    description: "Payment charges across Stripe and Razorpay.",
  },
  payouts: {
    title: "Payouts",
    description: "Platform commission payout schedule and history.",
  },
} as const;

type PaymentsSection = keyof typeof sections;

export function Payments() {
  const { section } = useParams<{ section: string }>();

  const active = useMemo(() => {
    if (!section || !(section in sections)) return null;
    return section as PaymentsSection;
  }, [section]);

  if (!active) {
    return <Navigate to="/payments/transactions" replace />;
  }

  const meta = sections[active];

  return (
    <div>
      <PageHeader
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Payments", href: "/payments/transactions" },
          { label: meta.title },
        ]}
      />

      {active === "transactions" ? (
        <TransactionsTab transactions={transactions} />
      ) : null}
      {active === "payouts" ? <PayoutsTab payouts={payouts} /> : null}
    </div>
  );
}
