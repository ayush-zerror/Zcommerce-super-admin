import type { PlatformSettings } from "../types";

/** Default thresholds for subscription-ops health (Reports module). */
export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  health: {
    expiringWithinDays: 7,
    inactiveAfterDays: 14,
  },
  gracePeriodDays: 3,
  reminders: {
    daysBeforeDue: [7, 3, 1],
    daysAfterDue: [1, 3, 7],
    email: true,
    sms: false,
    whatsapp: false,
  },
};

export const PLATFORM_SETTINGS_KEY = "zcommerce-platform-settings";

export function loadPlatformSettings(): PlatformSettings {
  try {
    const raw = localStorage.getItem(PLATFORM_SETTINGS_KEY);
    if (!raw) return structuredClone(DEFAULT_PLATFORM_SETTINGS);
    const parsed = JSON.parse(raw) as Partial<PlatformSettings>;
    return {
      health: {
        ...DEFAULT_PLATFORM_SETTINGS.health,
        ...parsed.health,
      },
      gracePeriodDays:
        parsed.gracePeriodDays ?? DEFAULT_PLATFORM_SETTINGS.gracePeriodDays,
      reminders: {
        ...DEFAULT_PLATFORM_SETTINGS.reminders,
        ...parsed.reminders,
      },
    };
  } catch {
    return structuredClone(DEFAULT_PLATFORM_SETTINGS);
  }
}

export function savePlatformSettings(settings: PlatformSettings): void {
  localStorage.setItem(PLATFORM_SETTINGS_KEY, JSON.stringify(settings));
}
