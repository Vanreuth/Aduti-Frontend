"use client";

import type { ReactNode } from "react";
import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TableFilterOption = {
  label: string;
  value: string | number;
};

export type TableFilterConfig = {
  key: string;
  label: string;
  type: "select" | "number" | "text" | "daterange";
  placeholder?: string;
  options?: TableFilterOption[];
  dependsOn?: string;
};

export type TableColumnConfig = {
  key: string;
  label: string;
};

type TableFiltersProps = {
  title: string;
  description?: string;
  searchPlaceholder?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  headerActions?: ReactNode;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount?: number;
  filters?: TableFilterConfig[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  onNumberFilterChange?: (key: string, value: string) => void;
  dateRange?: { from: string; to: string };
  onDateRangeChange?: (next: { from: string; to: string }) => void;
  onClearFilters?: () => void;
  columns?: TableColumnConfig[];
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (next: Record<string, boolean>) => void;
  labels?: {
    filters?: string;
    columns?: string;
    clearAll?: string;
    all?: string;
  };
};

export function TableFilters({
  title,
  description,
  searchPlaceholder = "Search...",
  searchTerm,
  onSearchChange,
  headerActions,
  showFilters,
  onToggleFilters,
  activeFiltersCount = 0,
  filters = [],
  filterValues = {},
  onFilterChange,
  onNumberFilterChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  columns,
  columnVisibility,
  onColumnVisibilityChange,
  labels,
}: TableFiltersProps) {
  const strings = {
    filters: labels?.filters ?? "Filters",
    columns: labels?.columns ?? "Columns",
    clearAll: labels?.clearAll ?? "Clear all",
    all: labels?.all ?? "All",
  };

  const showColumns =
    !!columns?.length && !!columnVisibility && !!onColumnVisibilityChange;
  const safeColumnVisibility = columnVisibility ?? {};

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {headerActions}
      </div>

      <div className="flex flex-col gap-4 bg-card rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
            {searchTerm ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <div className="flex gap-2">
            {filters.length > 0 ? (
              <Button
                variant={showFilters ? "default" : "outline"}
                onClick={onToggleFilters}
                className="relative"
                type="button"
              >
                <Filter className="mr-2 h-4 w-4" />
                {strings.filters}
                {activeFiltersCount > 0 ? (
                  <span className="ml-2 px-1.5 py-0.5 bg-background text-foreground rounded-full text-[10px] font-bold">
                    {activeFiltersCount}
                  </span>
                ) : null}
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </Button>
            ) : null}
            {showColumns ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" type="button">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    {strings.columns}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuSeparator />
                  {columns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={!!safeColumnVisibility[column.key]}
                      onCheckedChange={(val) =>
                        onColumnVisibilityChange({
                          ...safeColumnVisibility,
                          [column.key]: Boolean(val),
                        })
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        {showFilters && filters.length > 0 ? (
          <div className="pt-4 border-t animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filters.map((filter) => {
                const value = filterValues[filter.key] ?? strings.all;
                const dependsOn =
                  filter.dependsOn && filterValues[filter.dependsOn];
                const disableSelect =
                  !!filter.dependsOn && (!dependsOn || dependsOn === strings.all);

                return (
                  <div key={filter.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      {filter.label}
                    </label>
                    {filter.type === "select" ? (
                      <Select
                        value={value}
                        onValueChange={(v) => onFilterChange?.(filter.key, v)}
                        disabled={disableSelect}
                      >
                        <SelectTrigger className="h-9 w-full bg-background">
                          <SelectValue placeholder={strings.all} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={strings.all}>
                            {strings.all}
                          </SelectItem>
                          {filter.options?.map((opt) => (
                            <SelectItem
                              key={String(opt.value)}
                              value={String(opt.value)}
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.type === "daterange" ? (
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          className="h-9 bg-background"
                          value={dateRange?.from ?? ""}
                          onChange={(e) =>
                            onDateRangeChange?.({
                              from: e.target.value,
                              to: dateRange?.to ?? "",
                            })
                          }
                        />
                        <Input
                          type="date"
                          className="h-9 bg-background"
                          value={dateRange?.to ?? ""}
                          onChange={(e) =>
                            onDateRangeChange?.({
                              from: dateRange?.from ?? "",
                              to: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <Input
                        type={filter.type === "number" ? "number" : "text"}
                        placeholder={filter.placeholder}
                        value={value === strings.all ? "" : value}
                        onChange={(e) =>
                          filter.type === "number"
                            ? onNumberFilterChange?.(filter.key, e.target.value)
                            : onFilterChange?.(filter.key, e.target.value)
                        }
                        className="h-9 bg-background"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              {onClearFilters ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-destructive hover:bg-destructive/10"
                  type="button"
                >
                  {strings.clearAll}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
