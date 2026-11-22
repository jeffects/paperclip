import { describe, expect, it } from "vitest";
import { shouldRehydrateExternalControllerMarker } from "./native-session-executor.js";

describe("external controller marker rehydration", () => {
  const external = { plainIdentity: false, externalIdentity: true };

  it("restores a local author handback whose only identity is an external marker", () => {
    expect(shouldRehydrateExternalControllerMarker({
      mode: "per_turn", expectedMode: "per_turn", restartKind: null, remote: false, ...external,
    })).toBe(true);
    expect(shouldRehydrateExternalControllerMarker({
      mode: "warm", expectedMode: "warm", restartKind: null, remote: false, ...external,
    })).toBe(true);
  });

  it("restores a non-reattach restart and leaves a live reattach alone", () => {
    expect(shouldRehydrateExternalControllerMarker({
      mode: "warm", expectedMode: "warm", restartKind: "resume_dead_runner", remote: true, ...external,
    })).toBe(true);
    expect(shouldRehydrateExternalControllerMarker({
      mode: "warm", expectedMode: "warm", restartKind: "reattach_existing_runner", remote: false, ...external,
    })).toBe(false);
    expect(shouldRehydrateExternalControllerMarker({
      mode: "per_turn", expectedMode: "per_turn", restartKind: "reattach_remote_runner", remote: true, ...external,
    })).toBe(false);
  });

  it("does not replace a readable local journal or an unreadable file", () => {
    expect(shouldRehydrateExternalControllerMarker({
      mode: "per_turn", expectedMode: "per_turn", restartKind: null, remote: false,
      plainIdentity: true, externalIdentity: false,
    })).toBe(false);
    expect(shouldRehydrateExternalControllerMarker({
      mode: "per_turn", expectedMode: "per_turn", restartKind: null, remote: false,
      plainIdentity: false, externalIdentity: false,
    })).toBe(false);
    expect(shouldRehydrateExternalControllerMarker({
      mode: "warm", expectedMode: "per_turn", restartKind: null, remote: false, ...external,
    })).toBe(false);
  });

  it("keeps the existing remote admission path", () => {
    expect(shouldRehydrateExternalControllerMarker({
      mode: "per_turn", expectedMode: "per_turn", restartKind: null, remote: true,
      plainIdentity: false, externalIdentity: false,
    })).toBe(true);
  });
});
