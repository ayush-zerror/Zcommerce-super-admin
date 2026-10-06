import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowDownRight, HiOutlineArrowUpRight } from "react-icons/hi2";
import type { PlanName } from "../../types";
import { clients, transactions } from "../../lib/mockData";
import {
  MONTHLY_PLAN_REVENUE,
  buildGatewayBreakdown,
  buildPlanBreakdown,
  buildRevenueKpis,
  buildTopStoreRevenue,
  buildTrendWithMrr,
  filterMonthlyPlanRevenue,
  monthTotal,
  type MonthlyPlanRevenue,
} from "../../lib/revenueReports";
import { downloadCsv, rowsToCsv } from "../../lib/subscriptionReports";
import { formatCurrency, formatNumber, formatPercent } from "../../lib/utils";
import { secondaryButtonClassName } from "../common/buttonStyles";
import {
  DateRangeComparison,
  type DateRangeValue,
} from "../common/DateRangeComparison";
import { dataTableClassNames, tablePanelClassName } from "../common/dataTableStyles";
import { NoDataPlaceholder } from "../common/NoDataPlaceholder";
import { StatusChip } from "../common/StatusChip";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const planColors: Record<PlanName, string> = {
  Free: "#94A3B8",
  Starter: "#60A5FA",
  Pro: "#3b82f6",
  Enterprise: "#1E3A8A",
};

const defaultRange: DateRangeValue = {
  startDate: startOfMonth(new Date(2026, 3, 1)),
  endDate: endOfDay(endOfMonth(new Date(2026, 8, 1))),
};

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: number | null;
}

function SummaryCard({ title, value, subtitle, change }: SummaryCardProps) {
  const positive = change != null && change >= 0;
  return (
    <Card shadow="none">
      <CardBody className="gap-1 p-4">
        <p className="text-xs font-medium text-default-500">{title}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {change != null ? (
          <p
            className={`flex items-center gap-0.5 text-xs font-medium ${
              positive ? "text-success" : "text-danger"
            }`}
          >
            {positive ? (
              <HiOutlineArrowUpRight size={12} />
            ) : (
              <HiOutlineArrowDownRight size={12} />
            )}
            {formatPercent(Math.abs(change))} MoM
          </p>
        ) : subtitle ? (
          <p className="text-xs text-default-400">{subtitle}</p>
        ) : null}
      </CardBody>
    </Card>
  );
}

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  color?: string;
  name?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-default-200 bg-content1 px-3 py-2 shadow-md">
      <p className="mb-1 text-xs font-medium text-default-500">{label}</p>
      {payload.map((entry) => (
        <p
          key={String(entry.dataKey)}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name ?? entry.dataKey}: {formatCurrency(entry.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

export function RevenueReportsTab() {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRangeValue>(defaultRange);

  const monthly = useMemo(
    () =>
      filterMonthlyPlanRevenue(
        MONTHLY_PLAN_REVENUE,
        range.startDate,
        range.endDate,
      ),
    [range.endDate, range.startDate],
  );

  const trend = useMemo(() => buildTrendWithMrr(monthly), [monthly]);

  const kpis = useMemo(
    () =>
      buildRevenueKpis({
        monthly,
        allMonthly: MONTHLY_PLAN_REVENUE,
        transactions,
        clients,
        rangeStart: range.startDate,
        rangeEnd: range.endDate,
      }),
    [monthly, range.endDate, range.startDate],
  );

  const planRows = useMemo(
    () => buildPlanBreakdown(monthly, clients),
    [monthly],
  );

  const gatewayRows = useMemo(
    () =>
      buildGatewayBreakdown(transactions, range.startDate, range.endDate),
    [range.endDate, range.startDate],
  );

  const topStores = useMemo(
    () =>
      buildTopStoreRevenue(
        transactions,
        clients,
        range.startDate,
        range.endDate,
      ),
    [range.endDate, range.startDate],
  );

  const exportCsv = () => {
    const columns = [
      { key: "label", label: "Month" },
      { key: "Starter", label: "Starter" },
      { key: "Pro", label: "Pro" },
      { key: "Enterprise", label: "Enterprise" },
      { key: "total", label: "Total" },
    ];
    const rows = monthly.map((row: MonthlyPlanRevenue) => ({
      label: row.label,
      Starter: row.Starter,
      Pro: row.Pro,
      Enterprise: row.Enterprise,
      total: monthTotal(row),
    }));
    downloadCsv("revenue-by-plan.csv", rowsToCsv(rows, columns));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangeComparison value={range} onChange={setRange} />
        <Button
          size="sm"
          variant="bordered"
          radius="full"
          className={secondaryButtonClassName}
          startContent={<Download size={14} strokeWidth={2.5} />}
          isDisabled={monthly.length === 0}
          onPress={exportCsv}
        >
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <SummaryCard
          title="Plan revenue"
          value={formatCurrency(kpis.planRevenue)}
          change={kpis.momChangePercent}
        />
        <SummaryCard
          title="Net collected"
          value={formatCurrency(kpis.netCollected)}
          subtitle="Success − refunds in range"
        />
        <SummaryCard
          title="Pending"
          value={formatCurrency(kpis.pendingAmount)}
          subtitle="Awaiting settlement"
        />
        <SummaryCard
          title="Failed"
          value={formatCurrency(kpis.failedAmount)}
          subtitle={
            kpis.refundedAmount > 0
              ? `${formatCurrency(kpis.refundedAmount)} refunded`
              : "Charge failures"
          }
        />
        <SummaryCard
          title="Active MRR"
          value={formatCurrency(kpis.activeMrr)}
          subtitle="Current paid + trial MRR"
        />
        <SummaryCard
          title="Paying stores"
          value={formatNumber(kpis.payingStores)}
          subtitle="Active with MRR > 0"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card shadow="none" className={tablePanelClassName}>
          <CardHeader className="flex flex-col items-start gap-1 px-5 pb-0 pt-5">
            <h3 className="text-base font-semibold">Revenue trend</h3>
            <p className="text-xs text-default-500">
              Monthly plan bookings vs trailing 3‑month average
            </p>
          </CardHeader>
          <CardBody className="h-[300px] px-2 pb-4 sm:px-4">
            {trend.length === 0 ? (
              <NoDataPlaceholder
                title="No months in range"
                description="Widen the date range to see revenue trend."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-default-200" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => formatCurrency(v, "INR", true)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    name="Trailing avg"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card shadow="none" className={tablePanelClassName}>
          <CardHeader className="flex flex-col items-start gap-1 px-5 pb-0 pt-5">
            <h3 className="text-base font-semibold">Revenue by plan</h3>
            <p className="text-xs text-default-500">
              Stacked subscription bookings per month
            </p>
          </CardHeader>
          <CardBody className="h-[300px] px-2 pb-4 sm:px-4">
            {monthly.length === 0 ? (
              <NoDataPlaceholder
                title="No months in range"
                description="Widen the date range to see plan mix."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-default-200" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => String(v).replace(/ 20\d\d$/, "")}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => formatCurrency(v, "INR", true)}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Bar dataKey="Starter" stackId="a" fill={planColors.Starter} />
                  <Bar dataKey="Pro" stackId="a" fill={planColors.Pro} />
                  <Bar
                    dataKey="Enterprise"
                    stackId="a"
                    fill={planColors.Enterprise}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card shadow="none" className={`overflow-hidden ${tablePanelClassName}`}>
          <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
            <h3 className="text-base font-semibold">Plan breakdown</h3>
            <p className="text-xs text-default-500">
              Share of period revenue, store count, and live MRR
            </p>
          </CardHeader>
          <CardBody className="px-0 pb-0 pt-0">
            <Table
              aria-label="Plan revenue breakdown"
              removeWrapper
              classNames={{
                ...dataTableClassNames,
                base: "rounded-none border-0 border-t border-default-200 overflow-hidden bg-white",
              }}
            >
              <TableHeader>
                <TableColumn>Plan</TableColumn>
                <TableColumn>Revenue</TableColumn>
                <TableColumn>Share</TableColumn>
                <TableColumn>Stores</TableColumn>
                <TableColumn>MRR</TableColumn>
              </TableHeader>
              <TableBody
                items={planRows}
                emptyContent={
                  <NoDataPlaceholder
                    title="No plan revenue"
                    description="No plan bookings in this range."
                  />
                }
              >
                {(row) => (
                  <TableRow key={row.plan}>
                    <TableCell>
                      <StatusChip kind="plan" value={row.plan} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(row.revenue)}
                    </TableCell>
                    <TableCell>{row.sharePercent.toFixed(1)}%</TableCell>
                    <TableCell>{formatNumber(row.storeCount)}</TableCell>
                    <TableCell>{formatCurrency(row.mrr)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        <Card shadow="none" className={`overflow-hidden ${tablePanelClassName}`}>
          <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
            <h3 className="text-base font-semibold">Gateway split</h3>
            <p className="text-xs text-default-500">
              Collected vs failed charges by payment gateway
            </p>
          </CardHeader>
          <CardBody className="px-0 pb-0 pt-0">
            <Table
              aria-label="Gateway revenue breakdown"
              removeWrapper
              classNames={{
                ...dataTableClassNames,
                base: "rounded-none border-0 border-t border-default-200 overflow-hidden bg-white",
              }}
            >
              <TableHeader>
                <TableColumn>Gateway</TableColumn>
                <TableColumn>Collected</TableColumn>
                <TableColumn>Failed</TableColumn>
                <TableColumn>Pending</TableColumn>
                <TableColumn>Share</TableColumn>
              </TableHeader>
              <TableBody
                items={gatewayRows}
                emptyContent={
                  <NoDataPlaceholder
                    title="No charges in range"
                    description="Transactions in this period will show here."
                  />
                }
              >
                {(row) => (
                  <TableRow key={row.gateway}>
                    <TableCell className="font-medium">{row.gateway}</TableCell>
                    <TableCell>{formatCurrency(row.collected)}</TableCell>
                    <TableCell className="text-danger">
                      {formatCurrency(row.failed)}
                    </TableCell>
                    <TableCell>{formatCurrency(row.pending)}</TableCell>
                    <TableCell>{row.sharePercent.toFixed(1)}%</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      <Card shadow="none" className={`overflow-hidden ${tablePanelClassName}`}>
        <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
          <h3 className="text-base font-semibold">Top stores by collected revenue</h3>
          <p className="text-xs text-default-500">
            Successful charges in the selected range
          </p>
        </CardHeader>
        <CardBody className="px-0 pb-0 pt-0">
          <Table
            aria-label="Top stores by revenue"
            removeWrapper
            classNames={{
              ...dataTableClassNames,
              base: "rounded-none border-0 border-t border-default-200 overflow-hidden bg-white",
            }}
          >
            <TableHeader>
              <TableColumn>Store</TableColumn>
              <TableColumn>Plan</TableColumn>
              <TableColumn>Collected</TableColumn>
              <TableColumn>Failed</TableColumn>
              <TableColumn>Charges</TableColumn>
            </TableHeader>
            <TableBody
              items={topStores}
              emptyContent={
                <NoDataPlaceholder
                  title="No store charges"
                  description="Successful payments in this range will rank here."
                />
              }
            >
              {(row) => (
                <TableRow
                  key={row.clientId}
                  className="cursor-pointer"
                  onClick={() => navigate(`/clients/${row.clientId}`)}
                >
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate font-medium whitespace-nowrap">
                        {row.storeName}
                      </p>
                      <p className="truncate text-xs text-default-400">
                        {row.ownerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusChip kind="plan" value={row.plan} />
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(row.collected)}
                  </TableCell>
                  <TableCell className="text-danger">
                    {formatCurrency(row.failed)}
                  </TableCell>
                  <TableCell>{formatNumber(row.txnCount)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
