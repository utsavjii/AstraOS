import { describe, expect, it } from "vitest";
import { evaluateExpression, normalizeExpression } from "./calculator";

describe("calculator", () => {
  it("normalizes visual operators", () => {
    expect(normalizeExpression("8×4÷2−3")).toBe("8*4/2-3");
  });

  it("evaluates arithmetic and percentages", () => {
    expect(evaluateExpression("10 + 25%")).toBe(10.25);
    expect(evaluateExpression("sqrt(81)+sin(0)")).toBe(9);
  });

  it("rejects unsupported expressions", () => {
    expect(() => evaluateExpression("window.location")).toThrow("Unsupported expression");
  });
});
