import { describe, expect, it } from "vitest";
import { calculateWeeklyStats } from "./analytics";

describe("analytics", () => {
  it("calculates weekly totals and daily buckets", () => {
    const now = new Date("2026-03-24T12:00:00.000Z"); // Tuesday
    const data = [
      { total_amount: 120, created_at: "2026-03-22T11:00:00.000Z" }, // Sunday
      { total_amount: 150, created_at: "2026-03-23T11:00:00.000Z" }, // Monday
      { total_amount: 200, created_at: "2026-03-24T11:00:00.000Z" }, // Tuesday
      { total_amount: 500, created_at: "2026-03-20T11:00:00.000Z" }, // Previous week
    ];

    const result = calculateWeeklyStats(data, now);

    expect(result.weekCount).toBe(3);
    expect(result.weekTotal).toBe(470);
    expect(result.daily.Sunday.revenue).toBe(120);
    expect(result.daily.Monday.revenue).toBe(150);
    expect(result.daily.Tuesday.revenue).toBe(200);
  });
});
