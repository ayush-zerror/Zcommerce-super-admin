import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import type { Client, Plan } from "../../types";
import { formatNumber } from "../../lib/utils";

export interface ClientUsageTabProps {
  client: Client;
  plan?: Plan;
}

interface UsageMetric {
  key: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}

function usageColor(percent: number): "success" | "warning" | "danger" | "primary" {
  if (percent >= 90) return "danger";
  if (percent >= 75) return "warning";
  return "primary";
}

export function ClientUsageTab({ client, plan }: ClientUsageTabProps) {
  const limits = plan?.limits ?? {
    products: 25,
    storageGb: 1,
    bandwidthGb: 10,
  };

  const metrics: UsageMetric[] = [
    {
      key: "products",
      label: "Products",
      used: client.usage.products,
      limit: limits.products,
      unit: "",
    },
    {
      key: "storage",
      label: "Storage",
      used: client.usage.storageGb,
      limit: limits.storageGb,
      unit: "GB",
    },
    {
      key: "bandwidth",
      label: "Bandwidth",
      used: client.usage.bandwidthGb,
      limit: limits.bandwidthGb,
      unit: "GB",
    },
  ];

  return (
    <Card shadow="none">
      <CardHeader className="flex flex-col items-start gap-1 px-5 pb-2 pt-5">
        <h3 className="text-base font-semibold">Plan usage</h3>
        <p className="text-xs text-default-500">
          Resource consumption vs {client.plan} plan limits
        </p>
      </CardHeader>
      <CardBody className="gap-6 px-5 pb-6">
        {metrics.map((metric) => {
          const percent = Math.min(100, Math.round((metric.used / metric.limit) * 100));
          const unitSuffix = metric.unit ? ` ${metric.unit}` : "";
          return (
            <div key={metric.key} className="space-y-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{metric.label}</p>
                  <p className="text-xs text-default-500">
                    {formatNumber(metric.used)}
                    {unitSuffix} of {formatNumber(metric.limit)}
                    {unitSuffix}
                  </p>
                </div>
                <span className="text-sm font-medium text-default-600">{percent}%</span>
              </div>
              <Progress
                aria-label={`${metric.label} usage`}
                value={percent}
                color={usageColor(percent)}
                className="max-w-full"
                size="md"
              />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
