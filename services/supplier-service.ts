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
    await delay(500);
    return MOCK_SUPPLIERS;
  },

  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    await delay(500);
    const newSupplier = {
      id: Math.random().toString(),
      ...supplier
    };
    MOCK_SUPPLIERS.push(newSupplier);
    return newSupplier;
  },

  async updateSupplier(id: string, supplier: Partial<Supplier>): Promise<Supplier> {
    await delay(500);
    const index = MOCK_SUPPLIERS.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Supplier not found');
    
    const updatedSupplier = {
      ...MOCK_SUPPLIERS[index],
      ...supplier,
      id
    };
    MOCK_SUPPLIERS[index] = updatedSupplier;
    return updatedSupplier;
  },

  async deleteSupplier(id: string): Promise<void> {
    await delay(500);
    const index = MOCK_SUPPLIERS.findIndex(s => s.id === id);
    if (index !== -1) {
      MOCK_SUPPLIERS.splice(index, 1);
    }
  },

  async getSupplierById(id: string): Promise<Supplier | null> {
    await delay(500);
    const supplier = MOCK_SUPPLIERS.find(s => s.id === id);
    return supplier || null;
  }
};

// Export des fonctions individuelles pour la compatibilité
export const getSuppliers = SupplierService.getSuppliers;
