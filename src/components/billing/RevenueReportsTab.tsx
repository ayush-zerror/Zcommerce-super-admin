import { Card, CardBody, CardHeader } from "@heroui/react";
import { endOfDay, endOfMonth, startOfMonth } from "date-fns";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PlanName } from "../../types";
import { formatCurrency } from "../../lib/utils";
import {
  DateRangeComparison,
  type DateRangeValue,
} from "../common/DateRangeComparison";

interface RevenueByPlanPoint {
  month: string;
  monthNum: number;
  Free: number;
  Starter: number;
  Pro: number;
  Enterprise: number;
}

const reportData: RevenueByPlanPoint[] = [
  { month: "Apr", monthNum: 4, Free: 0, Starter: 4200, Pro: 9800, Enterprise: 12000 },
  { month: "May", monthNum: 5, Free: 0, Starter: 4600, Pro: 10200, Enterprise: 13200 },
  { month: "Jun", monthNum: 6, Free: 0, Starter: 5100, Pro: 11100, Enterprise: 14000 },
  { month: "Jul", monthNum: 7, Free: 0, Starter: 5400, Pro: 11800, Enterprise: 15100 },
  { month: "Aug", monthNum: 8, Free: 0, Starter: 5800, Pro: 12400, Enterprise: 16200 },
  { month: "Sep", monthNum: 9, Free: 0, Starter: 6100, Pro: 13100, Enterprise: 17100 },
];

const planColors: Record<PlanName, string> = {
  Free: "#94A3B8",
  Starter: "#60A5FA",
  Pro: "#3b82f6",
  Enterprise: "#1E3A8A",
};

interface TooltipPayloadItem {
  dataKey?: string | number;
  value?: number;
  color?: string;
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
        <p key={String(entry.dataKey)} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.dataKey}: {formatCurrency(entry.value ?? 0)}
        </p>
      ))}
    </div>
  );
}

const defaultRange: DateRangeValue = {
  startDate: startOfMonth(new Date(2026, 8, 1)),
  endDate: endOfDay(endOfMonth(new Date(2026, 8, 1))),
};

export function RevenueReportsTab() {
  const [range, setRange] = useState<DateRangeValue>(defaultRange);

  const filtered = useMemo(() => {
    const startMonth = range.startDate.getMonth() + 1;
    const endMonth = range.endDate.getMonth() + 1;
    const startYear = range.startDate.getFullYear();
    const endYear = range.endDate.getFullYear();

    return reportData.filter((row) => {
      // Demo data is for 2026 Apr–Sep
      if (startYear > 2026 || endYear < 2026) return false;
      return row.monthNum >= startMonth && row.monthNum <= endMonth;
    });
  }, [range.endDate, range.startDate]);

  const totals = filtered.reduce(
    (acc, row) => {
      acc.Starter += row.Starter;
      acc.Pro += row.Pro;
      acc.Enterprise += row.Enterprise;
      return acc;
    },
    { Starter: 0, Pro: 0, Enterprise: 0 },
  );

  return (
    <div className="space-y-4">
      <DateRangeComparison value={range} onChange={setRange} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(["Starter", "Pro", "Enterprise"] as const).map((plan) => (
          <Card key={plan} shadow="none">
            <CardBody className="p-4">
              <p className="text-xs text-default-500">{plan}</p>
              <p className="text-xl font-bold">{formatCurrency(totals[plan])}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card shadow="none">
        <CardHeader className="px-5 pb-0 pt-5">
          <h3 className="text-base font-semibold">Revenue by plan</h3>
        </CardHeader>
        <CardBody className="h-[320px] px-2 pb-4 sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtered} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-default-200" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
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
        </CardBody>
      </Card>
    </div>
  );
}
