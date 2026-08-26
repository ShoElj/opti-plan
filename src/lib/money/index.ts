import { CurrencyCode, MinorUnits } from "@/domain/types";

/**
 * Opti-Plan Exact Money Utility Module
 * Guarantees that durable financial arithmetic uses integer minor units (kobo/cents),
 * completely eliminating IEEE-754 binary floating-point rounding errors.
 */

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

/**
 * Parses user input string (e.g., "1,500.25", "1500.25", "250") into integer minor units.
 * Rejects negative amounts, invalid characters, and inputs with >2 decimal places.
 * Does NOT silently round invalid input.
 */
export function parseMoneyInputToMinorUnits(input: string): MinorUnits {
  if (typeof input !== "string") {
    throw new Error("Invalid input: money input must be a string");
  }

  const sanitized = input.trim().replace(/,/g, "");

  if (sanitized === "") {
    throw new Error("Invalid input: money string is empty");
  }

  // Regex matches positive decimal numbers with up to 2 decimal places
  const validPattern = /^\d+(\.\d{1,2})?$/;
  if (!validPattern.test(sanitized)) {
    throw new Error(`Invalid money format '${input}'. Must be a positive number with up to 2 decimal places.`);
  }

  const parts = sanitized.split(".");
  const majorPart = parseInt(parts[0], 10);

  let minorPart = 0;
  if (parts.length > 1) {
    const decimals = parts[1];
    if (decimals.length === 1) {
      minorPart = parseInt(decimals, 10) * 10;
    } else if (decimals.length === 2) {
      minorPart = parseInt(decimals, 10);
    }
  }

  return majorPart * 100 + minorPart;
}

/**
 * Formats integer minor units into major currency display string.
 * Example: (150025, 'NGN') => "₦1,500.25"
 */
export function formatMinorUnits(amount: MinorUnits, currencyCode: CurrencyCode = "NGN"): string {
  if (!Number.isInteger(amount)) {
    throw new Error("formatMinorUnits expects an integer minor unit value");
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const major = Math.floor(absAmount / 100);
  const minor = absAmount % 100;

  const formattedMajor = major.toLocaleString("en-US");
  const formattedMinor = minor.toString().padStart(2, "0");
  const symbol = CURRENCY_SYMBOLS[currencyCode] || "";

  const formattedStr = `${symbol}${formattedMajor}.${formattedMinor}`;
  return isNegative ? `-${formattedStr}` : formattedStr;
}

export function addMinorUnits(a: MinorUnits, b: MinorUnits): MinorUnits {
  return a + b;
}

export function subtractMinorUnits(a: MinorUnits, b: MinorUnits): MinorUnits {
  return a - b;
}

export function sumMinorUnits(amounts: MinorUnits[]): MinorUnits {
  return amounts.reduce((acc, curr) => acc + curr, 0);
}
