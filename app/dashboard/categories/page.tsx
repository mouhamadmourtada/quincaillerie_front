'use client';

import { useState } from 'react';
import { DataTable } from '@/components/categories/data-table';
import { columns } from '@/components/categories/columns';
import { CategoryDrawer } from '@/components/categories/category-drawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/use-categories';
import { Category } from '@/types/category';
import { LoadingPage } from '@/components/loading-page';
import { PageHeader } from '@/components/page-header';

export default function CategoriesPage() {
  const { categories, isLoading, refresh: refreshCategories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreate = () => {
    setSelectedCategory(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCategory(null);
  };

  const handleSuccess = () => {
    refreshCategories();
    handleCloseDrawer();
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <PageHeader
        title="Catégories"
        description="Gérez vos catégories"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        }
      />
      
      <DataTable 
        columns={columns} 
        data={categories} 
        onEdit={(category) => handleEdit(category)}
        onView={(category) => handleView(category)}
      />

      <CategoryDrawer
        category={selectedCategory}
        mode={drawerMode}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleSuccess}
      />
    </div>
  );
}