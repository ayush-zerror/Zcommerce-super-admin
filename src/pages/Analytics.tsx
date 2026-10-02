import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { RevenueReportsTab } from "../components/billing/RevenueReportsTab";
import { PageHeader } from "../components/common/PageHeader";

const sections = {
  revenue: {
    title: "Revenue Reports",
    description: "Subscription revenue breakdown by plan over time.",
  },
} as const;

type AnalyticsSection = keyof typeof sections;

export function Analytics() {
  const { section } = useParams<{ section: string }>();

  const active = useMemo(() => {
    if (!section || !(section in sections)) return null;
    return section as AnalyticsSection;
  }, [section]);

  if (!active) {
    return <Navigate to="/analytics/revenue" replace />;
  }

  const meta = sections[active];

  return (
    <div>
      <PageHeader
        title={meta.title}
        description={meta.description}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Analytics", href: "/analytics/revenue" },
          { label: meta.title },
        ]}
      />
      <RevenueReportsTab />
    </div>
  );
}
