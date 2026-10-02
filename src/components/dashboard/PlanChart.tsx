import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { PlanDistribution } from "../../types";

export interface PlanChartProps {
  data: PlanDistribution[];
  isLoading?: boolean;
}

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: PlanDistribution;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-default-200 bg-content1 px-3 py-2 shadow-md">
      <p className="text-sm font-semibold">
        {item.name}: {item.value} clients
      </p>
    </div>
  );
}

export function PlanChart({ data, isLoading }: PlanChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card shadow="none" className="h-full">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-0 pt-5">
        <h2 className="text-base font-semibold">Plan distribution</h2>
        <p className="text-xs text-default-500">Clients by subscription plan</p>
      </CardHeader>
      <CardBody className="px-5 pb-5 pt-2">
        {isLoading ? (
          <Skeleton className="mx-auto h-[220px] w-[220px] rounded-full" />
        ) : (
          <>
            <div className="relative mx-auto h-[220px] w-full max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{total}</span>
                <span className="text-xs text-default-400">clients</span>
              </div>
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {data.map((entry) => (
                <li key={entry.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-default-600">{entry.name}</span>
                  <span className="ml-auto font-medium">{entry.value}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardBody>
    </Card>
  );
}
