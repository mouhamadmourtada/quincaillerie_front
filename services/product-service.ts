import { API_URL, getAuthHeader } from '@/lib/config';
import { Product } from '@/types/product';

interface ProductFilters {
    name?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const ProductService = {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const url = new URL(`${API_URL}/products`);
    
    if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) url.searchParams.append(key, value.toString());
        });
    }

    const response = await fetch(url.toString(), {
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    return response.json();
  },

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    supplierId: string;
  }): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
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

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
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

  async updateProductStock(id: string, quantity: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/stock`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
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
export const getProducts = ProductService.getProducts;
export const getProduct = ProductService.getProduct;
