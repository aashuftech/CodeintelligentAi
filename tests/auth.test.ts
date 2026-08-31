import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../src/lib/auth/password";
import { createSessionToken, verifySessionToken } from "../src/lib/auth/session";

describe("Authentication and Session Security", () => {
  it("hashes password with salt and verifies valid passwords", async () => {
    const raw = "SuperSecretPassword123!";
    const hash = await hashPassword(raw);

    expect(hash).not.toBe(raw);
    expect(hash.startsWith("$2")).toBe(true);

    const isMatch = await verifyPassword(raw, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("generates and verifies signed JWT session tokens", async () => {
    const payload = {
      userId: "64b0f9c2e4b0d1a2b3c4d5e6",
      email: "candidate@example.com",
      name: "Alex Rivers",
      role: "candidate" as const,
    };

    const token = await createSessionToken(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it("rejects invalid or tampered tokens", async () => {
    const tampered = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
    const decoded = await verifySessionToken(tampered);
    expect(decoded).toBeNull();
  });
});
