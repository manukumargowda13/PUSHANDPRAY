import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names safely with Tailwind merge support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indian Numbering System (e.g. 1,50,000 or 1.25 Cr)
 */
export function formatIndianNumber(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats values into Indian Rupees (INR)
 */
export function formatINR(value: number, compact: boolean = false): string {
  if (value === null || value === undefined || isNaN(value)) return "₹0";

  if (compact) {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(value) >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    if (Math.abs(value) >= 1000) {
      return `₹${(value / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Formats a fraction or percentage into human-readable percent string
 */
export function formatPercent(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formats energy units (MW, GW, kWh, MWh, GWh)
 */
export function formatEnergy(
  value: number,
  unit: "MW" | "GW" | "kWh" | "MWh" | "GWh",
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) return `0 ${unit}`;
  return `${formatIndianNumber(value, decimals)} ${unit}`;
}

/**
 * Safe date formatter for Indian localized displays
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
