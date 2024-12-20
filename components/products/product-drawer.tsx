'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Product } from '@/types/product';
import { Category } from '@/types/category';
import { ProductCreateForm } from './forms/product-create-form';
import { ProductEditForm } from './forms/product-edit-form';
import { ProductDetails } from './product-details';
import { useToast } from '@/hooks/use-toast';
import { showToast } from '@/lib/toast';
import { ProductService } from '@/services/product-service';

interface ProductDrawerProps {
  product?: Product;
  mode: 'create' | 'edit' | 'view';
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export function ProductDrawer({
  product,
  mode,
  open,
  onClose,
  onSuccess,
  categories,
}: ProductDrawerProps) {
  const title =
    mode === 'create'
      ? 'Nouveau Produit'
      : mode === 'edit'
      ? 'Modifier le Produit'
      : 'Détails du Produit';

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[800px] sm:max-w-[800px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-4">
          {mode === 'create' && (
            <ProductCreateForm
              categories={categories}
              onSuccess={async (values) => {
                try {
                  setIsLoading(true);
                  await ProductService.createProduct(values);
                  toast(showToast.success({
                    title: 'Produit créé avec succès',
                    description: 'Le nouveau produit a été ajouté'
                  }));
                  onSuccess();
                  onClose();
                } catch (error) {
                  console.error('Failed to save product:', error);
                  toast(showToast.error({
                    title: 'Erreur',
                    description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'
                  }));
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          )}
          {mode === 'edit' && product && (
            <ProductEditForm
              product={product}
              categories={categories}
              onSuccess={async (values) => {
                try {
                  setIsLoading(true);
                  await ProductService.updateProduct(product.id, values);
                  toast(showToast.success({
                    title: 'Produit modifié avec succès',
                    description: 'Les modifications ont été enregistrées'
                  }));
                  onSuccess();
                  onClose();
                } catch (error) {
                  console.error('Failed to save product:', error);
                  toast(showToast.error({
                    title: 'Erreur',
                    description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement'
                  }));
                } finally {
                  setIsLoading(false);
                }
              }}
            />
          )}
          {mode === 'view' && product && (
            <div className="space-y-6">
              <ProductDetails 
                product={product} 
                category={categories.find(c => c.id === product.categoryId) || { id: '', name: 'Inconnue' }} 
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}