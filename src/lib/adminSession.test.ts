import { beforeEach, describe, expect, it } from "vitest";
import {
  createAdminSessionToken,
  getConfiguredAdminPin,
  verifyAdminSessionToken,
} from "./adminSession";

describe("adminSession", () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = "test-session-secret";
    process.env.ADMIN_SECRET_PIN = "1234";
  });

  it("creates and verifies a valid token", async () => {
    const token = await createAdminSessionToken(Date.now() + 60_000);
    const isValid = await verifyAdminSessionToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects an expired token", async () => {
    const token = await createAdminSessionToken(Date.now() - 1_000);
    const isValid = await verifyAdminSessionToken(token);
    expect(isValid).toBe(false);
  });

  it("rejects a tampered token", async () => {
    const token = await createAdminSessionToken(Date.now() + 60_000);
    const tampered = `${token}x`;
    const isValid = await verifyAdminSessionToken(tampered);
    expect(isValid).toBe(false);
  });

  it("uses ADMIN_SECRET_PIN as configured pin", () => {
    expect(getConfiguredAdminPin()).toBe("1234");
  });
});
