import type { Selection } from "@heroui/react";

/** Convert HeroUI table selection into an explicit id Set (never keep `"all"`). */
export function selectionToIdSet(keys: Selection, allIds: string[]): Set<string> {
  if (keys === "all") return new Set(allIds);
  return new Set(Array.from(keys).map(String));
}
