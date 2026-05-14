const allowed = /^[0-9+\-*/().% eEπsqrtcossintanlogabsroundfloorceil]+$/i;

const api = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  log: Math.log10,
  abs: Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil: Math.ceil,
  π: Math.PI,
};

export function normalizeExpression(expression: string) {
  return expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/(\d+(\.\d+)?)%/g, "($1/100)");
}

export function evaluateExpression(expression: string): number {
  const normalized = normalizeExpression(expression).trim();
  if (!normalized || !allowed.test(normalized)) {
    throw new Error("Unsupported expression");
  }
  const fn = new Function(...Object.keys(api), `"use strict"; return (${normalized});`);
  const result = fn(...Object.values(api));
  if (typeof result !== "number" || !Number.isFinite(result)) {
    throw new Error("Invalid result");
  }
  return Number(result.toFixed(10));
}
