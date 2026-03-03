import React from 'react';
import { QuoteSettings, QuoteTotals, TaxType, DiscountType } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/format';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface Step4Props {
  settings: QuoteSettings;
  totals: QuoteTotals;
  onUpdateSettings: (updates: Partial<QuoteSettings>) => void;
}

export const Step4Totals: React.FC<Step4Props> = ({
  settings,
  totals,
  onUpdateSettings,
}) => {
  const taxOptions = [
    { value: 'none', label: 'No Tax' },
    { value: 'add_5', label: 'Add 5% Tax' },
    { value: 'included', label: 'Tax Included' },
  ];

  const discountOptions = [
    { value: 'amount', label: 'Fixed Amount ($)' },
    { value: 'percentage', label: 'Percentage (%)' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Totals & Settings</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Tax Setting"
          options={taxOptions}
          value={settings.taxType}
          onChange={(e) =>
            onUpdateSettings({ taxType: e.target.value as TaxType })
          }
        />
        <div className="flex space-x-2">
          <Select
            label="Discount Type"
            options={discountOptions}
            value={settings.discountType}
            onChange={(e) =>
              onUpdateSettings({ discountType: e.target.value as DiscountType })
            }
            className="w-1/2"
          />
          <Input
            label="Value"
            type="number"
            value={settings.discountValue}
            onChange={(e) =>
              onUpdateSettings({ discountValue: Number(e.target.value) })
            }
            className="w-1/2"
            placeholder={settings.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 500'}
          />
        </div>
      </div>

      <Card className="bg-gray-50 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Discount ({settings.discountType === 'percentage' ? formatPercentage(settings.discountValue) : 'Fixed'})
              </span>
              <span>-{formatCurrency(totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Taxable Amount</span>
            <span>{formatCurrency(totals.taxableAmount)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax ({settings.taxType === 'add_5' ? '5%' : settings.taxType === 'included' ? 'Included' : '0%'})</span>
            <span>{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 text-lg font-bold text-gray-900 flex justify-between">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
