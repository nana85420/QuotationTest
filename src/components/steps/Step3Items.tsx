import React, { useState } from 'react';
import { QuoteItem, Product } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/format';
import { Trash2, Plus, Minus, Search } from 'lucide-react';

interface Step3Props {
  products: Product[];
  items: QuoteItem[];
  onAddItem: (item: QuoteItem) => void;
  onUpdateItem: (id: string, updates: Partial<QuoteItem>) => void;
  onRemoveItem: (id: string) => void;
}

export const Step3Items: React.FC<Step3Props> = ({
  products,
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: Product) => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: product.defaultPrice,
      unit: product.unit,
    };
    onAddItem(newItem);
    setSearchTerm('');
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsSearching(!isSearching)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      {isSearching && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm hover:bg-blue-50 cursor-pointer"
                onClick={() => handleAddProduct(product)}
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(product.defaultPrice)} / {product.unit}
                  </p>
                </div>
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="text-center text-sm text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="relative overflow-hidden">
            <div className="absolute right-2 top-2">
              <button
                onClick={() => onRemoveItem(item.id)}
                className="rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-3 pr-8">
              <Input
                value={item.name}
                onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
                className="border-none bg-transparent p-0 text-base font-medium focus:ring-0"
                placeholder="Item Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Price</label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    onUpdateItem(item.id, { unitPrice: Number(e.target.value) })
                  }
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Quantity</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      onUpdateItem(item.id, { quantity: Math.max(1, item.quantity - 1) })
                    }
                    className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateItem(item.id, { quantity: item.quantity + 1 })}
                    className="rounded-md border border-gray-300 p-1 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-end border-t border-gray-100 pt-2">
              <p className="text-sm font-medium text-gray-900">
                Subtotal: {formatCurrency(item.quantity * item.unitPrice)}
              </p>
            </div>
          </Card>
        ))}
        {items.length === 0 && !isSearching && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
            <p className="text-gray-500">No items added yet.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-blue-600"
              onClick={() => setIsSearching(true)}
            >
              Add your first item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
