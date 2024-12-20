import { API_URL, getAuthHeader } from '@/lib/config';
import { Category } from '@/types/category';

// Données mockées pour le développement
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Outils',
    description: 'Outils manuels et électriques',
  },
  {
    id: '2',
    name: 'Matériaux',
    description: 'Matériaux de construction',
  },
];

// Simuler un délai d'API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CategoryService = {
  async getCategories(name?: string): Promise<Category[]> {
    const url = new URL(`${API_URL}/categories`);
    if (name) url.searchParams.append('name', name);

    const response = await fetch(url.toString(), {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/categories/${id}`, {
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
export const getCategories = CategoryService.getCategories;
