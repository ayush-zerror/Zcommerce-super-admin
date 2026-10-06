import { describe, expect, it } from "vitest";
import {
  MONTHLY_PLAN_REVENUE,
  buildGatewayBreakdown,
  buildPlanBreakdown,
  buildRevenueKpis,
  filterMonthlyPlanRevenue,
  monthTotal,
} from "./revenueReports";
import type { Client, Transaction } from "../types";

const clients: Client[] = [
  {
    id: "c1",
    storeName: "A",
    ownerName: "O",
    ownerEmail: "a@test.com",
    plan: "Pro",
    status: "active",
    mrr: 99,
    orders30d: 1,
    revenue: 100,
    growthPercent: 0,
    lastActive: "2026-09-01",
    joinedDate: "2025-01-01",
    usage: { products: 1, storageGb: 1, bandwidthGb: 1 },
    notes: "",
  },
  {
    id: "c2",
    storeName: "B",
    ownerName: "O",
    ownerEmail: "b@test.com",
    plan: "Starter",
    status: "active",
    mrr: 29,
    orders30d: 1,
    revenue: 50,
    growthPercent: 0,
    lastActive: "2026-09-01",
    joinedDate: "2025-01-01",
    usage: { products: 1, storageGb: 1, bandwidthGb: 1 },
    notes: "",
  },
];

const transactions: Transaction[] = [
  {
    id: "t1",
    clientId: "c1",
    clientName: "A",
    amount: 99,
    currency: "INR",
    gateway: "Stripe",
    status: "success",
    date: "2026-09-10T12:00:00Z",
    transactionId: "x1",
  },
  {
    id: "t2",
    clientId: "c2",
    clientName: "B",
    amount: 29,
    currency: "INR",
    gateway: "Razorpay",
    status: "failed",
    date: "2026-09-12T12:00:00Z",
    transactionId: "x2",
  },
];

describe("revenueReports", () => {
  it("filters months overlapping the selected range", () => {
    const rows = filterMonthlyPlanRevenue(
      MONTHLY_PLAN_REVENUE,
      new Date(2026, 3, 1),
      new Date(2026, 5, 30, 23, 59, 59),
    );
    expect(rows.map((r) => r.key)).toEqual(["2026-04", "2026-05", "2026-06"]);
  });

  it("builds plan breakdown shares", () => {
    const monthly = filterMonthlyPlanRevenue(
      MONTHLY_PLAN_REVENUE,
      new Date(2026, 8, 1),
      new Date(2026, 8, 30, 23, 59, 59),
    );
    const rows = buildPlanBreakdown(monthly, clients);
    const total = rows.reduce((s, r) => s + r.revenue, 0);
    expect(total).toBe(monthTotal(monthly[0]));
    expect(rows.find((r) => r.plan === "Enterprise")?.sharePercent).toBeGreaterThan(40);
  });

  it("builds KPIs and gateway split from transactions", () => {
    const start = new Date(2026, 8, 1);
    const end = new Date(2026, 8, 30, 23, 59, 59);
    const monthly = filterMonthlyPlanRevenue(MONTHLY_PLAN_REVENUE, start, end);
    const kpis = buildRevenueKpis({
      monthly,
      allMonthly: MONTHLY_PLAN_REVENUE,
      transactions,
      clients,
      rangeStart: start,
      rangeEnd: end,
    });
    expect(kpis.netCollected).toBe(99);
    expect(kpis.failedAmount).toBe(29);
    expect(kpis.payingStores).toBe(2);

    const gateways = buildGatewayBreakdown(transactions, start, end);
    expect(gateways.find((g) => g.gateway === "Stripe")?.collected).toBe(99);
    expect(gateways.find((g) => g.gateway === "Razorpay")?.failed).toBe(29);
  });
});
