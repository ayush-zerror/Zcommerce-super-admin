import { describe, expect, it } from "vitest";
import { evaluateSubscriptionHealth } from "./subscriptionHealth";
import type { Client, Subscription } from "../types";
import { DEFAULT_PLATFORM_SETTINGS } from "./platformSettings";

const baseClient: Client = {
  id: "c1",
  storeName: "Test Store",
  ownerName: "Owner",
  ownerEmail: "o@test.com",
  plan: "Pro",
  status: "active",
  mrr: 99,
  orders30d: 50,
  revenue: 1000,
  growthPercent: 5,
  lastActive: "2026-10-05T12:00:00Z",
  joinedDate: "2025-01-01",
  usage: { products: 10, storageGb: 1, bandwidthGb: 1 },
  notes: "",
};

const asOf = new Date("2026-10-06T12:00:00Z");

describe("evaluateSubscriptionHealth", () => {
  it("marks suspended as unhealthy", () => {
    const result = evaluateSubscriptionHealth({
      client: { ...baseClient, status: "suspended" },
      asOf,
    });
    expect(result.bucket).toBe("unhealthy");
    expect(result.reason).toMatch(/suspended/i);
  });

  it("marks past_due with overdue days", () => {
    const sub: Subscription = {
      id: "s1",
      clientId: "c1",
      clientName: "Test Store",
      plan: "Pro",
      status: "past_due",
      renewalDate: "2026-09-24",
      mrr: 0,
      amountDue: 99,
    };
    const result = evaluateSubscriptionHealth({
      client: baseClient,
      subscription: sub,
      asOf,
    });
    expect(result.bucket).toBe("unhealthy");
    expect(result.daysOverdue).toBe(12);
    expect(result.reason).toBe("Payment overdue by 12 days");
  });

  it("marks pending as at_risk", () => {
    const sub: Subscription = {
      id: "s1",
      clientId: "c1",
      clientName: "Test Store",
      plan: "Starter",
      status: "pending",
      renewalDate: "2026-10-10",
      mrr: 29,
      amountDue: 29,
    };
    const result = evaluateSubscriptionHealth({
      client: baseClient,
      subscription: sub,
      asOf,
    });
    expect(result.bucket).toBe("at_risk");
    expect(result.reason).toMatch(/pending/i);
  });

  it("marks expiring soon as at_risk", () => {
    const sub: Subscription = {
      id: "s1",
      clientId: "c1",
      clientName: "Test Store",
      plan: "Pro",
      status: "active",
      renewalDate: "2026-10-09",
      mrr: 99,
      amountDue: 0,
    };
    const result = evaluateSubscriptionHealth({
      client: baseClient,
      subscription: sub,
      asOf,
      settings: DEFAULT_PLATFORM_SETTINGS,
    });
    expect(result.bucket).toBe("at_risk");
    expect(result.reason).toBe("Renewal in 3 days");
  });

  it("marks healthy when active and up to date", () => {
    const sub: Subscription = {
      id: "s1",
      clientId: "c1",
      clientName: "Test Store",
      plan: "Pro",
      status: "active",
      renewalDate: "2026-11-01",
      mrr: 99,
      amountDue: 0,
    };
    const result = evaluateSubscriptionHealth({
      client: baseClient,
      subscription: sub,
      asOf,
    });
    expect(result.bucket).toBe("healthy");
    expect(result.reason).toMatch(/up to date/i);
  });

  it("uses client gracePeriodDays override instead of platform default", () => {
    const sub: Subscription = {
      id: "s1",
      clientId: "c1",
      clientName: "Test Store",
      plan: "Pro",
      status: "active",
      renewalDate: "2026-09-30",
      mrr: 99,
      amountDue: 99,
    };
    // 6 days overdue — default grace is 3 → unhealthy
    const withoutOverride = evaluateSubscriptionHealth({
      client: baseClient,
      subscription: sub,
      asOf,
      settings: DEFAULT_PLATFORM_SETTINGS,
    });
    expect(withoutOverride.bucket).toBe("unhealthy");

    // Same overdue, but client promised to pay — 10-day grace → not unhealthy yet
    const withOverride = evaluateSubscriptionHealth({
      client: { ...baseClient, gracePeriodDays: 10 },
      subscription: sub,
      asOf,
      settings: DEFAULT_PLATFORM_SETTINGS,
    });
    expect(withOverride.bucket).toBe("healthy");
  });
});
