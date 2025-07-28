import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export currency functions from the dedicated currency config
export { 
  formatNaira, 
  formatNairaWithDecimals, 
  formatNairaCompact, 
  parseNaira, 
  isValidNairaAmount,
  CURRENCY_CONFIG,
  CURRENCY_RULES
} from './config/currency';
