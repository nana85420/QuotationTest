import React from 'react';
import { SalesRep } from '../../types';
import { Select } from '../ui/Select';

interface Step1Props {
  salesReps: SalesRep[];
  selectedRepId: string;
  onSelect: (rep: SalesRep) => void;
}

export const Step1SalesRep: React.FC<Step1Props> = ({ salesReps, selectedRepId, onSelect }) => {
  const options = salesReps.map((rep) => ({
    value: rep.id,
    label: rep.name,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const rep = salesReps.find((r) => r.id === e.target.value);
    if (rep) onSelect(rep);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Select Sales Representative</h2>
      <Select
        label="Sales Rep"
        options={options}
        value={selectedRepId}
        onChange={handleChange}
        placeholder="Select yourself..."
      />
      {selectedRepId && (
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
          <p>Selected: {salesReps.find((r) => r.id === selectedRepId)?.name}</p>
          <p>{salesReps.find((r) => r.id === selectedRepId)?.email}</p>
        </div>
      )}
    </div>
  );
};
