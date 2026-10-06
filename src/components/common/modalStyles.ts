import type { ModalProps } from "@heroui/react";

/** Shared HeroUI Modal chrome — matches dashboard create/contact popup style. */
export const dashboardModalClassNames: NonNullable<ModalProps["classNames"]> = {
  backdrop: "bg-[#0f172a]/45",
  base: "rounded-2xl border-0 bg-white shadow-xl mx-4",
  header:
    "flex flex-col gap-1 px-6 pt-6 pb-2 text-xl font-bold text-[#0f172a]",
  body: "px-6 py-3 gap-4",
  footer: "px-6 pb-6 pt-3 gap-3",
  closeButton:
    "top-4 end-4 z-20 rounded-full text-default-500 hover:bg-default-100 hover:text-foreground",
};

export const dashboardModalProps: Pick<
  ModalProps,
  "placement" | "scrollBehavior" | "classNames"
> = {
  placement: "center",
  scrollBehavior: "inside",
  classNames: dashboardModalClassNames,
};
