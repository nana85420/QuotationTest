export interface SalesRep {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Vendor {
  id: string;
  name: string;
  taxId: string; // 統編
  contactPerson: string;
  address?: string;
  email?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  unit: string;
}

export interface QuoteItem {
  id: string;
  productId?: string; // Optional if custom item
  name: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export type TaxType = 'none' | 'add_5' | 'included';

export type DiscountType = 'amount' | 'percentage';

export interface QuoteSettings {
  taxType: TaxType;
  discountType: DiscountType;
  discountValue: number;
}

export interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
}

export interface Quote {
  id: string;
  date: string;
  salesRep: SalesRep;
  vendor: Vendor;
  items: QuoteItem[];
  settings: QuoteSettings;
  notes?: string;
}
