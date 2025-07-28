// Currency Configuration for Banyan Admin Console
// All monetary values must use Nigerian Naira (₦)

export const CURRENCY_CONFIG = {
  symbol: '₦',
  name: 'Nigerian Naira',
  code: 'NGN',
  locale: 'en-NG',
  decimalPlaces: 2,
} as const;

// Format amount as Naira with proper formatting
export function formatNaira(amount: number): string {
  return `${CURRENCY_CONFIG.symbol}${amount.toLocaleString(CURRENCY_CONFIG.locale)}`;
}

// Format amount as Naira with decimal places
export function formatNairaWithDecimals(amount: number, decimals: number = CURRENCY_CONFIG.decimalPlaces): string {
  return `${CURRENCY_CONFIG.symbol}${amount.toLocaleString(CURRENCY_CONFIG.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}`;
}

// Format large amounts with K, M, B suffixes
export function formatNairaCompact(amount: number): string {
  if (amount >= 1000000000) {
    return `${CURRENCY_CONFIG.symbol}${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `${CURRENCY_CONFIG.symbol}${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${CURRENCY_CONFIG.symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return formatNaira(amount);
}

// Parse Naira string back to number
export function parseNaira(nairaString: string): number {
  const cleanString = nairaString.replace(/[₦,\s]/g, '');
  return parseFloat(cleanString) || 0;
}

// Currency validation
export function isValidNairaAmount(amount: number): boolean {
  return amount >= 0 && isFinite(amount);
}

// Currency rules for the application
export const CURRENCY_RULES = {
  // All monetary values must use ₦ symbol
  // No dollar signs ($) should be used anywhere
  // All amounts should be formatted with proper thousand separators
  // Large amounts should use compact notation (K, M, B)
  // Decimal places should be 2 for most cases
  // Currency should be consistent across all modules
} as const; 