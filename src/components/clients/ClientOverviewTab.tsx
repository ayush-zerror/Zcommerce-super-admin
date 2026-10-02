import { Card, CardBody, CardHeader } from "@heroui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Client } from "../../types";
import { formatCurrency, formatNumber, formatPercent } from "../../lib/utils";
import { StatusChip } from "../common/StatusChip";
import { StatCard } from "../dashboard/StatCard";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";

export interface ClientOverviewTabProps {
  client: Client;
}

interface MonthPoint {
  month: string;
  revenue: number;
  orders: number;
}

function buildClientTrend(client: Client): MonthPoint[] {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const baseRevenue = Math.max(client.revenue / 12, 200);
  const baseOrders = Math.max(client.orders30d / 1.2, 5);

  return months.map((month, index) => {
    const factor = 0.75 + index * 0.05 + (client.growthPercent / 100) * 0.1;
    return {
      month,
      revenue: Math.round(baseRevenue * factor),
      orders: Math.round(baseOrders * factor),
    };
  });
}

interface TooltipPayloadItem {
  value?: number;
  dataKey?: string | number;
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
        <p key={String(entry.dataKey)} className="text-sm font-semibold">
          {entry.dataKey === "revenue"
            ? `Revenue: ${formatCurrency(entry.value ?? 0)}`
            : `Orders: ${formatNumber(entry.value ?? 0)}`}
        </p>
      ))}
    </div>
  );
}

export function ClientOverviewTab({ client }: ClientOverviewTabProps) {
  const trend = buildClientTrend(client);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Store Revenue"
          value={formatCurrency(client.revenue)}
          change={client.growthPercent}
          icon={DollarSign}
        />
        <StatCard
          title="MRR Contribution"
          value={formatCurrency(client.mrr)}
          change={client.status === "trial" ? 0 : 2.4}
          icon={TrendingUp}
        />
        <StatCard
          title="Orders (30d)"
          value={formatNumber(client.orders30d)}
          change={client.growthPercent * 0.6}
          icon={ShoppingCart}
        />
        <StatCard
          title="Growth"
          value={formatPercent(client.growthPercent)}
          change={client.growthPercent}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card shadow="none" className="lg:col-span-2">
          <CardHeader className="flex flex-col items-start gap-1 px-5 pb-0 pt-5">
            <h3 className="text-base font-semibold">Performance trend</h3>
            <p className="text-xs text-default-500">
              Estimated monthly revenue & orders for {client.storeName}
            </p>
          </CardHeader>
          <CardBody className="px-2 pb-4 pt-2 sm:px-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-default-200" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    yAxisId="left"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => formatCurrency(v, "USD", true)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#94A3B8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card shadow="none">
          <CardHeader className="px-5 pb-0 pt-5">
            <h3 className="text-base font-semibold">Store profile</h3>
          </CardHeader>
          <CardBody className="gap-3 px-5 pb-5">
            <ProfileRow label="Owner" value={client.ownerName} />
            <ProfileRow label="Email" value={client.ownerEmail} />
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-default-500">Plan</span>
              <StatusChip kind="plan" value={client.plan} />
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-default-500">Status</span>
              <StatusChip kind="client" value={client.status} />
            </div>
            <ProfileRow label="Joined" value={client.joinedDate} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

interface ProfileRowProps {
  label: string;
  value: string;
}

function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-default-500">{label}</span>
      <span className="font-medium text-right break-all">{value}</span>
    </div>
  );
}
