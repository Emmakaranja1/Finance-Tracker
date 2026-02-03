export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  KES: 'KSh',
};

export const formatCurrency = (amount: number, currency: string) => {
  const code = currency || 'USD';
  const symbol = CURRENCY_SYMBOLS[code] || code;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fallback for unsupported currency codes
    return `${symbol}${amount.toFixed(2)}`;
  }
};

