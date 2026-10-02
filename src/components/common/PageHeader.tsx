import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import type { ReactNode } from "react";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbCrumb[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumbs size="sm" className="mb-1">
            {breadcrumbs.map((crumb) => (
              <BreadcrumbItem key={crumb.label} href={crumb.href}>
                {crumb.label}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>
        ) : null}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-default-500">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
