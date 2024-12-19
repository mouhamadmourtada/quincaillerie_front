import { Sale, SaleItem } from '@/types/sale';
import { Product } from '@/types/product';

// Données mockées pour le développement
const MOCK_SALES: Sale[] = [
  {
    id: '1',
    items: [
      {
        productId: '1',
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
      },
      {
        productId: '2',
        quantity: 1,
        unitPrice: 12.99,
        totalPrice: 12.99,
      },
    ],
    totalAmount: 72.97,
    customerName: 'Jean Dupont',
    customerPhone: '0123456789',
    saleDate: new Date('2024-12-19T10:00:00'),
    paymentDate: new Date('2024-12-19T10:00:00'),
    paymentType: 'CASH',
    status: 'PAID',
  },
];

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SaleService = {
  async getSales(): Promise<Sale[]> {
    await delay(500);
    return MOCK_SALES;
  },

  async createSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
    await delay(500);
    const newSale = {
      id: Math.random().toString(),
      ...sale,
    };
    MOCK_SALES.push(newSale);
    return newSale;
  },

  async updateSale(id: string, sale: Partial<Sale>): Promise<Sale> {
    await delay(500);
    const index = MOCK_SALES.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sale not found');
    
    const updatedSale = {
      ...MOCK_SALES[index],
      ...sale,
      id,
    };
    MOCK_SALES[index] = updatedSale;
    return updatedSale;
  },

  async deleteSale(id: string): Promise<void> {
    await delay(500);
    const index = MOCK_SALES.findIndex(s => s.id === id);
    if (index !== -1) {
      MOCK_SALES.splice(index, 1);
    }
  },

  async getSaleById(id: string): Promise<Sale | null> {
    await delay(500);
    const sale = MOCK_SALES.find(s => s.id === id);
    return sale || null;
  }
};

// Export des fonctions individuelles pour la compatibilité
export const getSales = SaleService.getSales;
