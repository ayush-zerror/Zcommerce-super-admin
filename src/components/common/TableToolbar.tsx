import {
  Button,
  Checkbox,
  CheckboxGroup,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { ChevronDown, ListFilter, Search } from "lucide-react";
import type { ReactNode } from "react";
import { secondaryButtonClassName } from "./buttonStyles";

export interface TableColumnOption {
  key: string;
  label: string;
}

export interface TableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  columns?: TableColumnOption[];
  visibleColumns?: string[];
  onVisibleColumnsChange?: (keys: string[]) => void;
  filterContent?: ReactNode;
  endContent?: ReactNode;
}

export function TableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  filterContent,
  endContent,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-default-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <Input
        aria-label="Search table"
        placeholder={searchPlaceholder}
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search size={16} className="text-default-400" />}
        radius="full"
        className="w-full sm:max-w-md"
        classNames={{
          inputWrapper:
            "bg-white border border-default-200 shadow-none h-10 data-[hover=true]:bg-white",
          input: "text-sm",
        }}
      />

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        {columns && visibleColumns && onVisibleColumnsChange ? (
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                color="primary"
                radius="full"
                size="sm"
                className={secondaryButtonClassName}
                endContent={<ChevronDown size={14} />}
              >
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Toggle columns"
              closeOnSelect={false}
              selectionMode="multiple"
              selectedKeys={new Set(visibleColumns)}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys).map(String);
                if (selected.length > 0) onVisibleColumnsChange(selected);
              }}
            >
              {columns.map((column) => (
                <DropdownItem key={column.key}>{column.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : null}

        {filterContent ? (
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                variant="bordered"
                color="primary"
                radius="full"
                size="sm"
                className={secondaryButtonClassName}
                endContent={<ListFilter size={14} strokeWidth={2.5} />}
              >
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="flex w-full flex-col gap-3">{filterContent}</div>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            variant="bordered"
            color="primary"
            radius="full"
            size="sm"
            className={secondaryButtonClassName}
            endContent={<ListFilter size={14} strokeWidth={2.5} />}
          >
            Filters
          </Button>
        )}

        {endContent}
      </div>
    </div>
  );
}

export interface TableSelectAllProps {
  isSelected: boolean;
  isIndeterminate?: boolean;
  onValueChange: (selected: boolean) => void;
}

export function TableSelectAll({
  isSelected,
  isIndeterminate,
  onValueChange,
}: TableSelectAllProps) {
  return (
    <input
      type="checkbox"
      aria-label="Select all"
      checked={isSelected}
      ref={(el) => {
        if (el) el.indeterminate = !!isIndeterminate && !isSelected;
      }}
      onChange={(event) => onValueChange(event.target.checked)}
      onClick={(event) => event.stopPropagation()}
      className="h-4 w-4 cursor-pointer accent-[#3b82f6]"
    />
  );
}

export interface TableRowCheckboxProps {
  isSelected: boolean;
  onValueChange: (selected: boolean) => void;
  ariaLabel: string;
}

export function TableRowCheckbox({
  isSelected,
  onValueChange,
  ariaLabel,
}: TableRowCheckboxProps) {
  return (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      checked={isSelected}
      onChange={(event) => onValueChange(event.target.checked)}
      onClick={(event) => event.stopPropagation()}
      className="h-4 w-4 cursor-pointer accent-[#3b82f6]"
    />
  );
}

export interface FilterCheckboxGroupProps {
  label: string;
  options: { key: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function FilterCheckboxGroup({
  label,
  options,
  value,
  onChange,
}: FilterCheckboxGroupProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-default-500">{label}</p>
      <CheckboxGroup
        value={value}
        onValueChange={onChange}
        size="sm"
        classNames={{ wrapper: "gap-2" }}
      >
        {options.map((option) => (
          <Checkbox key={option.key} value={option.key}>
            {option.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
