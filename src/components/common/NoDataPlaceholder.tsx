import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { secondaryButtonClassName } from "./buttonStyles";

export interface NoDataPlaceholderProps {
  title?: string;
  description?: string;
  error?: string;
  icon?: ReactNode | string;
  iconHeight?: number | string;
  actionLabel?: string;
  actionTo?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

export function NoDataPlaceholder({
  title = "No data yet",
  description,
  error,
  icon = "/no-activity.svg",
  iconHeight = 110,
  actionLabel,
  actionTo,
  buttonLabel,
  onButtonClick,
  isLoading,
  className = "",
}: NoDataPlaceholderProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center p-6 text-center ${className}`}
    >
      {icon ? (
        <div className="mb-2">
          {typeof icon === "string" ? (
            <img
              src={icon}
              alt=""
              style={{
                height:
                  typeof iconHeight === "number" ? `${iconHeight}px` : iconHeight,
                width: "auto",
              }}
            />
          ) : (
            icon
          )}
        </div>
      ) : null}

      <h2 className="mb-1.5 text-base font-semibold text-foreground">{title}</h2>

      {description ? (
        <p className="mb-3 max-w-md text-sm text-default-600">{description}</p>
      ) : null}

      {error ? <p className="mb-2 text-sm text-danger">{error}</p> : null}

      {buttonLabel && onButtonClick ? (
        <Button
          startContent={<Plus size={14} strokeWidth={2.5} />}
          variant="bordered"
          size="sm"
          radius="full"
          color="primary"
          className={secondaryButtonClassName}
          onPress={onButtonClick}
          isLoading={isLoading}
        >
          {buttonLabel}
        </Button>
      ) : null}

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="text-sm font-medium text-primary hover:underline"
        >
          {actionLabel} →
        </Link>
      ) : null}
    </div>
  );
}
