import { SalesRep, Vendor, Product } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbxZMzzkj0TjWBVmVyBoRvVnsEHMzXDaqOHxmVhk2JbosoPEMWrMqdD_70XXsZubeZ7hRA/exec';

export interface MetaDataResponse {
  status: 'success' | 'error';
  data: {
    salesReps: SalesRep[];
    vendors: Vendor[];
    products: Product[];
  };
  message?: string;
}

export interface CreateVendorResponse {
  status: 'success' | 'error';
  data: Vendor;
  message?: string;
}

export const api = {
  fetchMetaData: async (): Promise<MetaDataResponse> => {
    try {
      const response = await fetch(`${API_URL}?action=getMetaData`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching metadata:', error);
      throw error;
    }
  },

  createVendor: async (vendorData: Partial<Vendor>): Promise<CreateVendorResponse> => {
    try {
      // Use text/plain to avoid CORS preflight issues with Google Apps Script
      const response = await fetch(`${API_URL}?action=createVendor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },
};
