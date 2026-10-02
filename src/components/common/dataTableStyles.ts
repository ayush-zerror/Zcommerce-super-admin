/** Outer bordered white panel that wraps toolbar + table. */
export const tablePanelClassName =
  "rounded-xl border border-default-200 bg-white overflow-hidden";

/** Panel that fills remaining viewport below page header. */
export const tablePanelFillClassName =
  "rounded-xl border border-default-200 bg-white overflow-hidden flex h-[calc(100dvh-12.5rem)] flex-col";

/** Fixed-height scroll area for table body (header stays sticky). */
export const tableScrollClassName =
  "h-[min(26rem,calc(100vh-22rem))] overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

const scrollHidden =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

/** Table styles when nested inside the panel (no outer border). */
export const dataTableClassNames = {
  base: "rounded-none border-0 bg-white",
  wrapper: `p-0 shadow-none rounded-none border-0 h-[min(26rem,calc(100vh-22rem))] overflow-auto ${scrollHidden}`,
  thead: "sticky top-0 z-20 [&>tr]:first:shadow-none",
  th: "bg-[#c3e5ff] text-foreground text-sm font-semibold h-12 px-4 !rounded-none first:!rounded-none last:!rounded-none sticky top-0",
  td: "py-4 px-4 text-sm text-default-700 border-b border-transparent last:border-0",
  tr: "border-b border-default-100 last:border-b-0 hover:bg-default-50/80",
  table: "min-w-full",
  emptyWrapper: "text-default-400 h-full py-8",
} as const;

/** Taller table that fills the viewport panel. */
export const dataTableFillClassNames = {
  ...dataTableClassNames,
  base: "rounded-none border-0 bg-white min-h-0 flex-1 flex flex-col",
  wrapper: `p-0 shadow-none rounded-none border-0 flex-1 min-h-0 !h-auto overflow-auto ${scrollHidden}`,
} as const;
