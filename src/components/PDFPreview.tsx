import React, { useRef } from 'react';
import { Quote, QuoteTotals } from '../types';
import { formatCurrency, formatPercentage } from '../utils/format';
import { Button } from './ui/Button';
import { Download, Printer } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PDFPreviewProps {
  quote: Quote;
  totals: QuoteTotals;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ quote, totals }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const element = contentRef.current;
    const opt: any = {
      margin: 10,
      filename: `Quote-${quote.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-4">
        <Button onClick={handleDownload} variant="primary">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
        <Button onClick={() => window.print()} variant="secondary">
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-lg shadow-lg bg-gray-500 p-8">
        <div
          ref={contentRef}
          className="mx-auto bg-white p-8 text-sm text-gray-900"
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          {/* Header */}
          <div className="mb-8 flex justify-between border-b border-gray-200 pb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QUOTATION</h1>
              <p className="text-gray-500">#{quote.id}</p>
              <p className="text-gray-500">Date: {quote.date}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-blue-600">Marketing Co. Ltd.</h2>
              <p>123 Creative Blvd, Taipei, Taiwan</p>
              <p>Tax ID: 88888888</p>
              <p>Phone: (02) 2345-6789</p>
              <p>Email: contact@marketing.com</p>
            </div>
          </div>

          {/* Client & Sales Info */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="mb-2 font-bold text-gray-700 uppercase tracking-wider">Bill To:</h3>
              <p className="font-bold">{quote.vendor.name}</p>
              <p>Attn: {quote.vendor.contactPerson}</p>
              <p>{quote.vendor.address}</p>
              <p>Tax ID: {quote.vendor.taxId}</p>
              <p>{quote.vendor.email}</p>
            </div>
            <div className="text-right">
              <h3 className="mb-2 font-bold text-gray-700 uppercase tracking-wider">Sales Representative:</h3>
              <p className="font-bold">{quote.salesRep.name}</p>
              <p>{quote.salesRep.email}</p>
              <p>{quote.salesRep.phone}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="mb-8 w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-bold text-gray-700">Item Description</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">Qty</th>
                <th className="px-4 py-3 text-right font-bold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.unit}</p>
                  </td>
                  <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mb-12 flex justify-end">
            <div className="w-1/2 space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(totals.discountAmount)}</span>
                </div>
              )}
              {quote.settings.taxType !== 'none' && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({quote.settings.taxType === 'add_5' ? '5%' : 'Included'}):</span>
                  <span>{formatCurrency(totals.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 pt-2 text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signature */}
          <div className="mt-auto pt-12">
            <div className="mb-8 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <h4 className="mb-2 font-bold text-gray-900">Terms & Conditions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>This quotation is valid for 30 days.</li>
                <li>Payment terms: 50% deposit, 50% upon completion.</li>
                <li>Please sign and return this document to confirm your order.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-12">
              <div className="border-t border-gray-400 pt-2 text-center">
                <p className="font-bold text-gray-900">Authorized Signature</p>
                <p className="text-sm text-gray-500">Marketing Co. Ltd.</p>
              </div>
              <div className="border-t border-gray-400 pt-2 text-center">
                <p className="font-bold text-gray-900">Client Acceptance</p>
                <p className="text-sm text-gray-500">Signature & Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
