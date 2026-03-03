import React, { useState, useEffect } from 'react';
import { Vendor } from '../../types';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';

interface Step2Props {
  vendors: Vendor[];
  selectedVendorId: string;
  newVendorData: Partial<Vendor>;
  onSelectVendor: (vendorId: string) => void;
  onUpdateNewVendor: (data: Partial<Vendor>) => void;
}

export const Step2Vendor: React.FC<Step2Props> = ({
  vendors,
  selectedVendorId,
  newVendorData,
  onSelectVendor,
  onUpdateNewVendor,
}) => {
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (selectedVendorId === 'new') {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [selectedVendorId]);

  const options = [
    ...vendors.map((v) => ({ value: v.id, label: v.name })),
    { value: 'new', label: '+ Add New Vendor' },
  ];

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onSelectVendor(val);
  };

  const handleNewVendorChange = (field: keyof Vendor, value: string) => {
    onUpdateNewVendor({ ...newVendorData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Select Client / Vendor</h2>
      
      <Select
        label="Vendor"
        options={options}
        value={selectedVendorId}
        onChange={handleVendorChange}
        placeholder="Select a vendor..."
      />

      {isNew && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900">New Vendor Details</h3>
          <Input
            label="Company Name"
            value={newVendorData.name || ''}
            onChange={(e) => handleNewVendorChange('name', e.target.value)}
            placeholder="Enter company name"
          />
          <Input
            label="Tax ID (統編)"
            value={newVendorData.taxId || ''}
            onChange={(e) => handleNewVendorChange('taxId', e.target.value)}
            placeholder="e.g. 12345678"
          />
          <Input
            label="Contact Person"
            value={newVendorData.contactPerson || ''}
            onChange={(e) => handleNewVendorChange('contactPerson', e.target.value)}
            placeholder="Name"
          />
          <Input
            label="Email"
            type="email"
            value={newVendorData.email || ''}
            onChange={(e) => handleNewVendorChange('email', e.target.value)}
            placeholder="Email address"
          />
          <Input
            label="Address"
            value={newVendorData.address || ''}
            onChange={(e) => handleNewVendorChange('address', e.target.value)}
            placeholder="Company address"
          />
        </div>
      )}

      {!isNew && selectedVendorId && (
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          {(() => {
            const v = vendors.find((v) => v.id === selectedVendorId);
            if (!v) return null;
            return (
              <>
                <p className="font-medium">{v.name}</p>
                <p>Tax ID: {v.taxId}</p>
                <p>Contact: {v.contactPerson}</p>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
