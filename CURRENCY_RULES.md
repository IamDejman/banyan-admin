# Currency Rules for Banyan Admin Console

## Overview
All monetary values in the Banyan Admin Console must use **Nigerian Naira (₦)** as the currency.

## Rules

### 1. Currency Symbol
- ✅ **Use**: ₦ (Naira symbol)
- ❌ **Never use**: $ (Dollar sign) or any other currency symbols

### 2. Currency Icons
- ✅ **Use**: `NairaIcon` component from `@/components/ui/naira-icon`
- ❌ **Never use**: `DollarSign` from lucide-react or any other currency icons

```typescript
// ✅ Correct
import { NairaIcon } from '@/components/ui/naira-icon';
<NairaIcon className="h-4 w-4" />

// ❌ Incorrect
import { DollarSign } from 'lucide-react';
<DollarSign className="h-4 w-4" />
```

### 3. Formatting Functions
Use the provided utility functions for consistent formatting:

```typescript
import { formatNaira, formatNairaCompact, formatNairaWithDecimals } from '@/lib/utils';

// Basic formatting
formatNaira(50000) // "₦50,000"

// Compact formatting for large amounts
formatNairaCompact(156000000) // "₦156M"

// With decimal places
formatNairaWithDecimals(50000.50) // "₦50,000.50"
```

### 4. Implementation Guidelines

#### In Components
```typescript
// ✅ Correct
<TableCell>₦{amount.toLocaleString()}</TableCell>
<TableCell>{formatNaira(amount)}</TableCell>
<NairaIcon className="h-4 w-4" />

// ❌ Incorrect
<TableCell>${amount.toLocaleString()}</TableCell>
<TableCell>${amount}</TableCell>
<DollarSign className="h-4 w-4" />
```

#### In Forms
```typescript
// ✅ Correct
placeholder="₦0"
value={formatNaira(amount)}
icon={<NairaIcon className="h-4 w-4" />}

// ❌ Incorrect
placeholder="$0"
value={`$${amount}`}
icon={<DollarSign className="h-4 w-4" />}
```

#### In Mock Data
```typescript
// ✅ Correct
const mockData = {
  amount: 50000,
  displayAmount: '₦50,000',
  icon: NairaIcon
};

// ❌ Incorrect
const mockData = {
  amount: 50000,
  displayAmount: '$50,000',
  icon: DollarSign
};
```

### 5. Currency Configuration
The currency configuration is centralized in `src/lib/config/currency.ts`:

```typescript
export const CURRENCY_CONFIG = {
  symbol: '₦',
  name: 'Nigerian Naira',
  code: 'NGN',
  locale: 'en-NG',
  decimalPlaces: 2,
} as const;
```

### 6. Validation
- All amounts must be positive numbers
- Use `isValidNairaAmount()` for validation
- Parse user input with `parseNaira()` function

### 7. Files to Check
When making changes, ensure these files follow the currency rules:
- All settlement-related components
- Claims forms and displays
- Assessment pages
- Dashboard statistics
- Report displays
- Any monetary input fields
- Icon usage in components

### 8. Testing
Before committing changes:
1. Search for `$` symbol in the codebase
2. Search for `DollarSign` import in the codebase
3. Ensure all monetary displays use ₦
4. Ensure all currency icons use `NairaIcon`
5. Test currency formatting functions
6. Verify input validation works correctly

## Enforcement
- ESLint rules can be added to catch dollar signs and DollarSign imports
- Code reviews should check for currency compliance
- Automated tests should verify currency formatting
- Icon usage should be consistent across the application 