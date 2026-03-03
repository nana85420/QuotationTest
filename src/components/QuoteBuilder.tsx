import React, { useState, useMemo, useEffect } from 'react';
import { SalesRep, Vendor, QuoteItem, QuoteSettings, Product } from '../types';
import { calculateQuoteTotals } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import { Step1SalesRep } from './steps/Step1SalesRep';
import { Step2Vendor } from './steps/Step2Vendor';
import { Step3Items } from './steps/Step3Items';
import { Step4Totals } from './steps/Step4Totals';
import { Button } from './ui/Button';
import { PDFPreview } from './PDFPreview';
import { FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const QuoteBuilder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [salesReps, setSalesReps] = useState<SalesRep[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedRepId, setSelectedRepId] = useState<string>('');
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [newVendorData, setNewVendorData] = useState<Partial<Vendor>>({});
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [settings, setSettings] = useState<QuoteSettings>({
    taxType: 'none',
    discountType: 'amount',
    discountValue: 0,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isCreatingVendor, setIsCreatingVendor] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await api.fetchMetaData();
        if (response.status === 'success') {
          setSalesReps(response.data.salesReps);
          setVendors(response.data.vendors);
          setProducts(response.data.products);
        } else {
          setError(response.message || 'Failed to load data');
        }
      } catch (err) {
        setError('Failed to connect to the database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totals = useMemo(() => {
    return calculateQuoteTotals(items, settings.taxType, settings.discountType, settings.discountValue);
  }, [items, settings]);

  const handleAddItem = (item: QuoteItem) => {
    setItems([...items, item]);
  };

  const handleUpdateItem = (id: string, updates: Partial<QuoteItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleGeneratePDF = async () => {
    if (selectedVendorId === 'new') {
      // Create new vendor first
      try {
        setIsCreatingVendor(true);
        const response = await api.createVendor(newVendorData);
        if (response.status === 'success') {
          const newVendor = response.data;
          setVendors([...vendors, newVendor]);
          setSelectedVendorId(newVendor.id);
          // Continue to preview
          setShowPreview(true);
        } else {
          alert('Failed to create new vendor: ' + response.message);
          return;
        }
      } catch (err) {
        alert('Error creating vendor. Please try again.');
        console.error(err);
        return;
      } finally {
        setIsCreatingVendor(false);
      }
    } else {
      setShowPreview(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center text-red-600">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (showPreview) {
    const rep = salesReps.find((r) => r.id === selectedRepId);
    const vendor = vendors.find((v) => v.id === selectedVendorId);

    if (!rep || !vendor) return <div>Error: Missing data</div>;

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Preview Quote</h1>
        </div>
        <PDFPreview
          quote={{
            id: `Q-${Date.now()}`, // Temporary ID
            date: new Date().toISOString().split('T')[0],
            salesRep: rep,
            vendor: vendor,
            items: items,
            settings: settings,
          }}
          totals={totals}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-8 p-4 pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">New Quote</h1>
        <p className="text-sm text-gray-500">Create a professional quote in seconds.</p>
      </div>

      <div className="space-y-8">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <Step1SalesRep
            salesReps={salesReps}
            selectedRepId={selectedRepId}
            onSelect={(rep) => setSelectedRepId(rep.id)}
          />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <Step2Vendor
            vendors={vendors}
            selectedVendorId={selectedVendorId}
            newVendorData={newVendorData}
            onSelectVendor={setSelectedVendorId}
            onUpdateNewVendor={setNewVendorData}
          />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <Step3Items
            products={products}
            items={items}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onRemoveItem={handleRemoveItem}
          />
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <Step4Totals
            settings={settings}
            totals={totals}
            onUpdateSettings={(updates) => setSettings({ ...settings, ...updates })}
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 shadow-lg">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totals.total)}</p>
          </div>
          <Button
            onClick={handleGeneratePDF}
            disabled={!selectedRepId || !selectedVendorId || items.length === 0 || isCreatingVendor}
            className="w-1/2"
          >
            {isCreatingVendor ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" /> Preview PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
