import { describe, expect, it } from "vitest";
import { usageModelConflicts } from "./native-usage-delivery.js";

describe("usage model provenance", () => {
  it("records an unknown resumed model without treating it as required evidence", () => {
    expect(usageModelConflicts("unknown", "gpt-5.6-luna")).toBe(false);
    expect(usageModelConflicts("gpt-5.6-luna", null)).toBe(false);
    expect(usageModelConflicts("unknown", "unknown")).toBe(false);
    expect(usageModelConflicts("", "unknown")).toBe(false);
  });

  it("still conflicts when two concrete models disagree", () => {
    expect(usageModelConflicts("gpt-5.6-luna", "gpt-5.6-sol")).toBe(true);
    expect(usageModelConflicts("gpt-5.6-luna", " gpt-5.6-luna ")).toBe(false);
  });
});
