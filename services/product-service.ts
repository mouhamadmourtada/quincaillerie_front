import { Product } from '@/types/product';

// Données mockées pour le développement
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Marteau de charpentier',
    category: 'Outils',
    price: 29.99,
    stock: 45,
  },
  {
    id: '2',
    name: 'Tournevis cruciforme',
    category: 'Outils',
    price: 12.99,
    stock: 78,
  },
];

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    await delay(500);
    return MOCK_PRODUCTS;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(500);
    const newProduct = {
      id: Math.random().toString(),
      ...product
    };
    MOCK_PRODUCTS.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    await delay(500);
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const updatedProduct = {
      ...MOCK_PRODUCTS[index],
      ...product,
      id
    };
    MOCK_PRODUCTS[index] = updatedProduct;
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(500);
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_PRODUCTS.splice(index, 1);
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(500);
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return product || null;
  }
};

// Export des fonctions individuelles pour la compatibilité
export const getProducts = ProductService.getProducts;
