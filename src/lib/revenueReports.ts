import type {
  Client,
  PaymentGateway,
  PlanName,
  Transaction,
  TransactionStatus,
} from "../types";

export interface MonthlyPlanRevenue {
  key: string; // YYYY-MM
  label: string;
  year: number;
  month: number; // 1-12
  Free: number;
  Starter: number;
  Pro: number;
  Enterprise: number;
}

export interface RevenueKpis {
  planRevenue: number;
  netCollected: number;
  pendingAmount: number;
  failedAmount: number;
  refundedAmount: number;
  activeMrr: number;
  payingStores: number;
  momChangePercent: number | null;
}

export interface PlanBreakdownRow {
  plan: PlanName;
  revenue: number;
  sharePercent: number;
  storeCount: number;
  mrr: number;
}

export interface GatewayBreakdownRow {
  gateway: PaymentGateway;
  collected: number;
  failed: number;
  pending: number;
  refunded: number;
  sharePercent: number;
}

export interface TopStoreRevenueRow {
  clientId: string;
  storeName: string;
  ownerEmail: string;
  plan: PlanName;
  collected: number;
  failed: number;
  txnCount: number;
}

export interface RevenueTrendPoint {
  month: string;
  fullLabel: string;
  revenue: number;
  mrr: number;
}

/** Demo monthly subscription revenue by plan (2025-10 → 2026-09). */
export const MONTHLY_PLAN_REVENUE: MonthlyPlanRevenue[] = [
  { key: "2025-10", label: "Oct 2025", year: 2025, month: 10, Free: 0, Starter: 3800, Pro: 8600, Enterprise: 10800 },
  { key: "2025-11", label: "Nov 2025", year: 2025, month: 11, Free: 0, Starter: 4000, Pro: 9100, Enterprise: 11200 },
  { key: "2025-12", label: "Dec 2025", year: 2025, month: 12, Free: 0, Starter: 4300, Pro: 9600, Enterprise: 11800 },
  { key: "2026-01", label: "Jan 2026", year: 2026, month: 1, Free: 0, Starter: 4500, Pro: 9900, Enterprise: 12200 },
  { key: "2026-02", label: "Feb 2026", year: 2026, month: 2, Free: 0, Starter: 4700, Pro: 10300, Enterprise: 12800 },
  { key: "2026-03", label: "Mar 2026", year: 2026, month: 3, Free: 0, Starter: 4900, Pro: 10700, Enterprise: 13400 },
  { key: "2026-04", label: "Apr 2026", year: 2026, month: 4, Free: 0, Starter: 4200, Pro: 9800, Enterprise: 12000 },
  { key: "2026-05", label: "May 2026", year: 2026, month: 5, Free: 0, Starter: 4600, Pro: 10200, Enterprise: 13200 },
  { key: "2026-06", label: "Jun 2026", year: 2026, month: 6, Free: 0, Starter: 5100, Pro: 11100, Enterprise: 14000 },
  { key: "2026-07", label: "Jul 2026", year: 2026, month: 7, Free: 0, Starter: 5400, Pro: 11800, Enterprise: 15100 },
  { key: "2026-08", label: "Aug 2026", year: 2026, month: 8, Free: 0, Starter: 5800, Pro: 12400, Enterprise: 16200 },
  { key: "2026-09", label: "Sep 2026", year: 2026, month: 9, Free: 0, Starter: 6100, Pro: 13100, Enterprise: 17100 },
];

const PLANS: PlanName[] = ["Free", "Starter", "Pro", "Enterprise"];

function monthStart(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

function monthEnd(year: number, month: number): Date {
  return new Date(year, month, 0, 23, 59, 59, 999);
}

function monthOverlapsRange(
  row: MonthlyPlanRevenue,
  start: Date,
  end: Date,
): boolean {
  const s = monthStart(row.year, row.month);
  const e = monthEnd(row.year, row.month);
  return s <= end && e >= start;
}

export function filterMonthlyPlanRevenue(
  rows: MonthlyPlanRevenue[],
  start: Date,
  end: Date,
): MonthlyPlanRevenue[] {
  return rows.filter((row) => monthOverlapsRange(row, start, end));
}

export function monthTotal(row: MonthlyPlanRevenue): number {
  return row.Free + row.Starter + row.Pro + row.Enterprise;
}

export function filterTransactionsInRange(
  transactions: Transaction[],
  start: Date,
  end: Date,
): Transaction[] {
  const startMs = start.getTime();
  const endMs = end.getTime();
  return transactions.filter((txn) => {
    const t = new Date(txn.date).getTime();
    return t >= startMs && t <= endMs;
  });
}

function sumByStatus(
  transactions: Transaction[],
  status: TransactionStatus,
): number {
  return transactions
    .filter((t) => t.status === status)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function buildRevenueKpis(input: {
  monthly: MonthlyPlanRevenue[];
  allMonthly: MonthlyPlanRevenue[];
  transactions: Transaction[];
  clients: Client[];
  rangeStart: Date;
  rangeEnd: Date;
}): RevenueKpis {
  const { monthly, allMonthly, transactions, clients, rangeStart, rangeEnd } =
    input;

  const planRevenue = monthly.reduce((sum, row) => sum + monthTotal(row), 0);
  const inRange = filterTransactionsInRange(transactions, rangeStart, rangeEnd);
  const collected = sumByStatus(inRange, "success");
  const refunded = sumByStatus(inRange, "refunded");
  const pending = sumByStatus(inRange, "pending");
  const failed = sumByStatus(inRange, "failed");

  const payingStores = clients.filter(
    (c) => c.status === "active" && c.mrr > 0,
  ).length;
  const activeMrr = clients
    .filter((c) => c.status === "active" || c.status === "trial")
    .reduce((sum, c) => sum + c.mrr, 0);

  let momChangePercent: number | null = null;
  if (monthly.length > 0) {
    const last = monthly[monthly.length - 1];
    const lastIdx = allMonthly.findIndex((r) => r.key === last.key);
    const prev = lastIdx > 0 ? allMonthly[lastIdx - 1] : undefined;
    if (prev) {
      const prevTotal = monthTotal(prev);
      const lastTotal = monthTotal(last);
      momChangePercent =
        prevTotal === 0 ? null : ((lastTotal - prevTotal) / prevTotal) * 100;
    }
  }

  return {
    planRevenue,
    netCollected: collected - refunded,
    pendingAmount: pending,
    failedAmount: failed,
    refundedAmount: refunded,
    activeMrr,
    payingStores,
    momChangePercent,
  };
}

export function buildPlanBreakdown(
  monthly: MonthlyPlanRevenue[],
  clients: Client[],
): PlanBreakdownRow[] {
  const revenueByPlan: Record<PlanName, number> = {
    Free: 0,
    Starter: 0,
    Pro: 0,
    Enterprise: 0,
  };
  for (const row of monthly) {
    for (const plan of PLANS) revenueByPlan[plan] += row[plan];
  }
  const total = PLANS.reduce((s, p) => s + revenueByPlan[p], 0);

  return PLANS.map((plan) => {
    const revenue = revenueByPlan[plan];
    const planClients = clients.filter((c) => c.plan === plan);
    return {
      plan,
      revenue,
      sharePercent: total === 0 ? 0 : (revenue / total) * 100,
      storeCount: planClients.length,
      mrr: planClients.reduce((s, c) => s + c.mrr, 0),
    };
  }).filter((row) => row.revenue > 0 || row.storeCount > 0);
}

export function buildGatewayBreakdown(
  transactions: Transaction[],
  start: Date,
  end: Date,
): GatewayBreakdownRow[] {
  const inRange = filterTransactionsInRange(transactions, start, end);
  const gateways: PaymentGateway[] = ["Stripe", "Razorpay"];
  const rows = gateways.map((gateway) => {
    const subset = inRange.filter((t) => t.gateway === gateway);
    return {
      gateway,
      collected: sumByStatus(subset, "success"),
      failed: sumByStatus(subset, "failed"),
      pending: sumByStatus(subset, "pending"),
      refunded: sumByStatus(subset, "refunded"),
      sharePercent: 0,
    };
  });
  const collectedTotal = rows.reduce((s, r) => s + r.collected, 0);
  return rows
    .map((r) => ({
      ...r,
      sharePercent:
        collectedTotal === 0 ? 0 : (r.collected / collectedTotal) * 100,
    }))
    .filter(
      (r) =>
        r.collected > 0 || r.failed > 0 || r.pending > 0 || r.refunded > 0,
    );
}

export function buildTopStoreRevenue(
  transactions: Transaction[],
  clients: Client[],
  start: Date,
  end: Date,
  limit = 8,
): TopStoreRevenueRow[] {
  const inRange = filterTransactionsInRange(transactions, start, end);
  const byClient = new Map<
    string,
    { collected: number; failed: number; txnCount: number }
  >();

  for (const txn of inRange) {
    const cur = byClient.get(txn.clientId) ?? {
      collected: 0,
      failed: 0,
      txnCount: 0,
    };
    cur.txnCount += 1;
    if (txn.status === "success") cur.collected += txn.amount;
    if (txn.status === "failed") cur.failed += txn.amount;
    byClient.set(txn.clientId, cur);
  }

  const clientById = new Map(clients.map((c) => [c.id, c]));

  return Array.from(byClient.entries())
    .map(([clientId, stats]) => {
      const client = clientById.get(clientId);
      return {
        clientId,
        storeName: client?.storeName ?? clientId,
        ownerEmail: client?.ownerEmail ?? "—",
        plan: client?.plan ?? "Free",
        collected: stats.collected,
        failed: stats.failed,
        txnCount: stats.txnCount,
      };
    })
    .sort((a, b) => b.collected - a.collected || b.txnCount - a.txnCount)
    .slice(0, limit);
}

/** Revenue = month plan bookings; MRR = 3‑month trailing average of bookings. */
export function buildTrendWithMrr(
  monthly: MonthlyPlanRevenue[],
): RevenueTrendPoint[] {
  return monthly.map((row, index, arr) => {
    const revenue = monthTotal(row);
    const window = arr.slice(Math.max(0, index - 2), index + 1);
    const mrr = Math.round(
      window.reduce((s, r) => s + monthTotal(r), 0) / window.length,
    );
    return {
      month: row.label.replace(/ 20\d\d$/, ""),
      fullLabel: row.label,
      revenue,
      mrr,
    };
  });
}
