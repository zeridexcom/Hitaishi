import { describe, it, expect } from "vitest";
import { ok, fail } from "./api";

describe("api response envelope", () => {
  it("ok wraps data with success=true", () => {
    expect(ok({ x: 1 })).toEqual({ success: true, data: { x: 1 } });
  });

  it("ok with no data still has success:true", () => {
    expect(ok()).toEqual({ success: true, data: null });
  });

  it("fail wraps an error message with success=false", () => {
    expect(fail("nope")).toEqual({ success: false, error: "nope" });
  });
});
