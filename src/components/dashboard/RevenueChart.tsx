import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "../../types";
import { formatCurrency, formatNumber } from "../../lib/utils";

export interface RevenueChartProps {
  data: RevenuePoint[];
  isLoading?: boolean;
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
          {entry.dataKey === "revenue" ? "Revenue" : "MRR"}:{" "}
          {entry.dataKey === "mrr"
            ? formatNumber(entry.value ?? 0)
            : formatCurrency(entry.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  return (
    <Card shadow="none" className="h-full">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-0 pt-5">
        <h2 className="text-base font-semibold">Revenue trend</h2>
        <p className="text-xs text-default-500">Platform-wide revenue — last 12 months</p>
      </CardHeader>
      <CardBody className="px-2 pb-4 pt-2 sm:px-4">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-xl" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--heroui-default-200))" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--heroui-default-500))" }}
                  tickFormatter={(v: number) => formatCurrency(v, "INR", true)}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="#94A3B8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
