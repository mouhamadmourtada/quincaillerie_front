import { Sale, SaleItem, PaymentType } from '@/types/sale';
import { Product } from '@/types/product';
import { API_URL, getAuthHeader } from '@/lib/config';
import { ProductService } from './product-service';
import { get } from 'http';

interface CreateSaleData {
    customerName: string;
    customerPhone: string;
    paymentType: PaymentType;
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
    }>;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
}

interface SaleFilters {
    status?: string;
    paymentType?: PaymentType;
    startDate?: string;
    endDate?: string;
}

interface MarkAsPaidData {
  paymentType: PaymentType;
  paymentDate: Date;
}

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
  async getSales(filters?: SaleFilters): Promise<Sale[]> {
    let url = `${API_URL}/sales`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentType) params.append('paymentType', filters.paymentType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const sales = await response.json();
    
    // Enrichir les ventes avec les noms des produits
    for (const sale of sales) {
      for (const item of sale.items) {
        try {
          const product = await ProductService.getProduct(item.productId);
          item.productName = product.name;
        } catch (error) {
          console.error(`Impossible de charger le produit ${item.productId}:`, error);
          item.productName = 'Produit inconnu';
        }
      }
    }

    return sales;
  },

  async getSale(id: string): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const sale = await response.json();

    // Enrichir la vente avec les noms des produits
    for (const item of sale.items) {
      try {
        const product = await ProductService.getProduct(item.productId);
        item.productName = product.name;
      } catch (error) {
        console.error(`Impossible de charger le produit ${item.productId}:`, error);
        item.productName = 'Produit inconnu';
      }
    }

    return sale;
  },

  async createSale(data: CreateSaleData): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales`, {
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

  async updateSale(id: string, data: Partial<Sale>): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async deleteSale(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/sales/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  },

  async markAsPaid(id: string, data: MarkAsPaidData): Promise<Sale> {
    const response = await fetch(`${API_URL}/sales/${id}/pay`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erreur lors du marquage de la vente comme payée');
    }
    return response.json();
  },

  async cancelSale(id: string) {
    const response = await fetch(`${API_URL}/sales/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'annulation de la vente');
    }

    return response.json();
  },
};

// Export des fonctions individuelles pour la compatibilité
export const getSales = SaleService.getSales;
