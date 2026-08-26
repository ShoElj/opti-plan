import { describe, it, expect } from "vitest";
import {
  parseMoneyInputToMinorUnits,
  formatMinorUnits,
  addMinorUnits,
  subtractMinorUnits,
  sumMinorUnits,
} from "./index";

describe("Exact Money Utilities", () => {
  describe("parseMoneyInputToMinorUnits", () => {
    it("correctly parses valid decimal strings into integer minor units", () => {
      expect(parseMoneyInputToMinorUnits("100.00")).toBe(10000);
      expect(parseMoneyInputToMinorUnits("1,500.25")).toBe(150025);
      expect(parseMoneyInputToMinorUnits("0.50")).toBe(50);
      expect(parseMoneyInputToMinorUnits("50")).toBe(5000);
      expect(parseMoneyInputToMinorUnits(" 25.5 ")).toBe(2550);
    });

    it("rejects invalid money strings without silent rounding", () => {
      expect(() => parseMoneyInputToMinorUnits("12.345")).toThrow();
      expect(() => parseMoneyInputToMinorUnits("-100")).toThrow();
      expect(() => parseMoneyInputToMinorUnits("abc")).toThrow();
      expect(() => parseMoneyInputToMinorUnits("")).toThrow();
    });
  });

  describe("formatMinorUnits", () => {
    it("formats minor units into major currency display strings", () => {
      expect(formatMinorUnits(150025, "NGN")).toBe("₦1,500.25");
      expect(formatMinorUnits(1000, "USD")).toBe("$10.00");
      expect(formatMinorUnits(500, "GBP")).toBe("£5.00");
      expect(formatMinorUnits(0, "EUR")).toBe("€0.00");
    });
  });

  describe("minor unit arithmetic", () => {
    it("adds minor units without binary floating point drift", () => {
      expect(addMinorUnits(100, 200)).toBe(300);
    });

    it("subtracts minor units", () => {
      expect(subtractMinorUnits(500, 200)).toBe(300);
    });

    it("sums minor units array", () => {
      expect(sumMinorUnits([100, 200, 300])).toBe(600);
    });
  });
});
