import { QuoteItem, TaxType, DiscountType, QuoteTotals } from '../types';

export const calculateQuoteTotals = (
  items: QuoteItem[],
  taxType: TaxType,
  discountType: DiscountType,
  discountValue: number
): QuoteTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  let discountAmount = 0;
  if (discountType === 'amount') {
    discountAmount = discountValue;
  } else {
    discountAmount = Math.round(subtotal * (discountValue / 100));
  }

  // Ensure discount doesn't exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  const afterDiscount = subtotal - discountAmount;
  let taxAmount = 0;
  let total = 0;

  switch (taxType) {
    case 'none':
      taxAmount = 0;
      total = afterDiscount;
      break;
    case 'add_5':
      taxAmount = Math.round(afterDiscount * 0.05);
      total = afterDiscount + taxAmount;
      break;
    case 'included':
      // Back-calculate tax from the total (which is the afterDiscount amount)
      // Total = Net * 1.05 => Net = Total / 1.05
      // Tax = Total - Net
      const netAmount = afterDiscount / 1.05;
      taxAmount = Math.round(afterDiscount - netAmount);
      total = afterDiscount;
      break;
  }

  return {
    subtotal,
    discountAmount,
    taxableAmount: afterDiscount, // This is the amount before tax is added (or the total if tax included)
    taxAmount,
    total,
  };
};
