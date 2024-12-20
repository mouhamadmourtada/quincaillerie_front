import { API_URL, getAuthHeader } from '@/lib/config';
import { Supplier } from '@/types/supplier';

// Données mockées pour le développement
const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Fournisseur Pro',
    email: 'contact@fournisseurpro.com',
    phone: '0123456789',
    address: '123 Rue des Fournisseurs',
  },
  {
    id: '2',
    name: 'Super Supply',
    email: 'info@supersupply.com',
    phone: '0987654321',
    address: '456 Avenue des Livraisons',
  },
];

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SupplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    const response = await fetch(`${API_URL}/suppliers`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async getSupplier(id: string): Promise<Supplier> {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async updateSupplier(id: string, data: Partial<Supplier>): Promise<Supplier> {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async deleteSupplier(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  }
};

// Export des fonctions individuelles pour la compatibilité
export const getSuppliers = SupplierService.getSuppliers;
