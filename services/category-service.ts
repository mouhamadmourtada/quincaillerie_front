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
  async getCategories(): Promise<Category[]> {
    await delay(500);
    return MOCK_CATEGORIES;
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    await delay(500);
    const newCategory = {
      id: Math.random().toString(),
      ...category
    };
    
    MOCK_CATEGORIES.push(newCategory);
    return newCategory;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    await delay(500);
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = {
      ...MOCK_CATEGORIES[index],
      ...category,
      id
    };
    MOCK_CATEGORIES[index] = updatedCategory;
    return updatedCategory;
  },

  async deleteCategory(id: string): Promise<void> {
    await delay(500);
    const index = MOCK_CATEGORIES.findIndex(c => c.id === id);
    if (index !== -1) {
      MOCK_CATEGORIES.splice(index, 1);
    }
  },

  async getCategoryById(id: string): Promise<Category | null> {
    await delay(500);
    const category = MOCK_CATEGORIES.find(c => c.id === id);
    return category || null;
  }
};

// Export des fonctions individuelles pour la compatibilité
export const getCategories = CategoryService.getCategories;
