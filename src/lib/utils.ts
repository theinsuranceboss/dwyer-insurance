import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates a responsive REM size based on a percentage of a base REM value.
 * @param baseRem The standard size in REM (e.g. 1.25 for 20px)
 * @param percentage The scaling percentage from admin settings (e.g. 50 for 50%)
 * @param defaultRem The fallback size if percentage is invalid
 */
export function getScaledSize(baseRem: number, percentage: number | string | undefined, defaultRem: number): string {
  const pct = typeof percentage === 'string' ? parseInt(percentage) : percentage;
  if (pct === undefined || isNaN(Number(pct))) return `${defaultRem}rem`;
  const scaled = (baseRem * Number(pct)) / 100;
  return `${scaled}rem`;
}
