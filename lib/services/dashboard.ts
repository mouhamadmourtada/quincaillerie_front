import { Product } from '@/types/product';
import { Sale } from '@/types/sale';

export interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  averageOrderValue: number;
  totalProducts: number;
  topSellingProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  recentSales: Sale[];
  salesByMonth: Array<{
    month: string;
    total: number;
  }>;
  stockStatus: Array<{
    status: 'En stock' | 'Stock faible' | 'Rupture';
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  supplierDistribution: Array<{
    supplier: string;
    count: number;
  }>;
  profitMargin: Array<{
    month: string;
    margin: number;
  }>;
  stockRotation: Array<{
    product: string;
    rotationRate: number;
  }>;
  customerSegmentation: Array<{
    segment: string;
    count: number;
    revenue: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    total: number;
  }>;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDashboardStats(): Promise<DashboardStats> {
  // Simuler un délai d'API
  await delay(800);

  return {
    totalRevenue: 125000,
    totalSales: 450,
    totalProducts: 200,
    averageOrderValue: 277.78,
    topSellingProducts: [
      {
        product: {
          id: '1',
          name: 'Marteau',
          price: 1500,
          description: 'Marteau professionnel',
          categoryId: '1',
          stock: 25,
          supplierId: '1'
        },
        quantity: 50,
        revenue: 75000,
      },
      {
        product: {
          id: '2',
          name: 'Tournevis',
          price: 800,
          description: 'Set de tournevis',
          categoryId: '1',
          stock: 15,
          supplierId: '2'
        },
        quantity: 45,
        revenue: 36000,
      },
      {
        product: {
          id: '3',
          name: 'Clés',
          price: 2000,
          description: 'Jeu de clés',
          categoryId: '2',
          stock: 30,
          supplierId: '3'
        },
        quantity: 30,
        revenue: 60000,
      },
    ],
    recentSales: [
      {
        id: '1',
        saleDate: new Date(),
        totalAmount: 5000,
        status: 'PAID',
        items: [],
        customerName: '',
        customerPhone: '',
        paymentDate: null,
        paymentType: 'CASH'
      },
      {
        id: '2',
        saleDate: new Date(Date.now() - 86400000),
        totalAmount: 3000,
        status: 'PAID',
        items: [],
        customerName: '',
        customerPhone: '',
        paymentDate: null,
        paymentType: 'CASH'
      },
    ],
    salesByMonth: [
      { month: 'Jan', total: 12000 },
      { month: 'Fév', total: 15000 },
      { month: 'Mar', total: 18000 },
      { month: 'Avr', total: 14000 },
      { month: 'Mai', total: 16000 },
      { month: 'Juin', total: 19000 },
      { month: 'Juil', total: 20000 },
      { month: 'Août', total: 17000 },
      { month: 'Sep', total: 21000 },
      { month: 'Oct', total: 22000 },
      { month: 'Nov', total: 23000 },
      { month: 'Déc', total: 25000 },
    ],
    stockStatus: [
      { status: 'En stock', count: 150 },
      { status: 'Stock faible', count: 30 },
      { status: 'Rupture', count: 20 },
    ],
    categoryDistribution: [
      { category: 'Outils manuels', count: 45 },
      { category: 'Électricité', count: 30 },
      { category: 'Plomberie', count: 25 },
      { category: 'Jardinage', count: 20 },
      { category: 'Peinture', count: 15 },
    ],
    supplierDistribution: [
      { supplier: 'Fournisseur A', count: 50 },
      { supplier: 'Fournisseur B', count: 40 },
      { supplier: 'Fournisseur C', count: 35 },
      { supplier: 'Fournisseur D', count: 30 },
    ],
    profitMargin: [
      { month: 'Jan', margin: 25 },
      { month: 'Fév', margin: 28 },
      { month: 'Mar', margin: 24 },
      { month: 'Avr', margin: 26 },
      { month: 'Mai', margin: 29 },
      { month: 'Juin', margin: 27 },
    ],
    stockRotation: [
      { product: 'Marteau', rotationRate: 4.2 },
      { product: 'Tournevis', rotationRate: 3.8 },
      { product: 'Clés', rotationRate: 3.5 },
      { product: 'Peinture', rotationRate: 2.9 },
      { product: 'Vis', rotationRate: 5.1 },
    ],
    customerSegmentation: [
      { segment: 'Particuliers', count: 250, revenue: 50000 },
      { segment: 'Professionnels', count: 150, revenue: 45000 },
      { segment: 'Entreprises', count: 50, revenue: 30000 },
    ],
    paymentMethods: [
      { method: 'Espèces', count: 200, total: 40000 },
      { method: 'Carte bancaire', count: 150, total: 45000 },
      { method: 'Mobile Money', count: 100, total: 40000 },
    ],
  };
}
