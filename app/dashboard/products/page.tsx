'use client';

import { useState } from 'react';
import { DataTable } from '@/components/products/data-table';
import { columns } from '@/components/products/columns';
import { ProductDrawer } from '@/components/products/product-drawer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { Product } from '@/types/product';
import { PageHeader } from '@/components/page-header';

export default function ProductsPage() {
  const { products, isLoading: isLoadingProducts, refresh: refreshProducts } = useProducts();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCreate = () => {
    setSelectedProduct(null);
    setDrawerMode('create');
    setIsDrawerOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDrawerMode('edit');
    setIsDrawerOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setDrawerMode('view');
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    refreshProducts();
    handleCloseDrawer();
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <PageHeader
        title="Produits"
        description="Gérez vos produits"
        action={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau produit
          </Button>
        }
      />

      <DataTable 
        columns={columns} 
        data={products} 
        onEdit={(product) => handleEdit(product)}
        onView={(product) => handleView(product)}
      />

      <ProductDrawer
        product={selectedProduct}
        mode={drawerMode}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleSuccess}
        categories={categories}
      />
    </div>
  );
}